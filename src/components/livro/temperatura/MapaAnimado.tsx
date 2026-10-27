/**
 * A animação do mapa da temperatura zero (Remotion; docs/capacidades/temperatura-zero-revisao.md, etapas 2 e 4), que o
 * leitor toca ou rola (palco/RolaCena.tsx). Cinco cenas, uma por vez (a escolha sem sorteio fica na animação de antes,
 * EscolhaAnimada.tsx): a mesma pergunta sozinha ou num grupo (esquema); a régua de 16 bits, em que a soma parcial
 * escorrega para o valor que o formato guarda; as pontuações e o vencedor de cada execução; o token que volta à entrada;
 * e o controle com folga. Os balões explicam cada cena. O que se desenha sai de mapa.ts, e os números, de figuras/mapa.py.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, kf, mono, suave, ui } from "../palco/video";
import { Balao, entre, opacidadeDoBalao, type Ponto } from "../roteiro/pecas";
import { type Alvo, baloes, CENAS, type Caso, type DadosMapa, fimDaCena, numero, REGUA, token } from "./mapa.ts";

export type Desenho = "largo" | "estreito";
export const MEDIDAS = {
  largo: { w: 780, h: 400, x: 20, aw: 460, fonte: 16, balao: { lado: true, x: 500, w: 264, y: 0, fonte: 17 } },
  estreito: { w: 420, h: 620, x: 14, aw: 392, fonte: 15, balao: { lado: false, x: 14, w: 392, y: 404, fonte: 17 } },
} as const;
const AZUL = "#2a6fdb", AMBAR = "#c77d0a";

export type Props = { dados: DadosMapa; desenho: Desenho };

export const MapaAnimado: React.FC<Props> = ({ dados: d, desenho }) => {
  const M = MEDIDAS[desenho];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const [disputa, folga] = d.casos;
  const teto = Math.max(...d.casos.flatMap((c) => c.execucoes.flatMap((e) => e.pontuacoes)));
  /* cada cena entra e sai em 0,4 s; a última fica */
  const cena = (k: number) => kf(t, k + 1 < CENAS.length
    ? [[CENAS[k].de, k ? 0 : 1], [CENAS[k].de + 0.4, 1], [fimDaCena(k) - 0.3, 1], [fimDaCena(k), 0]]
    : [[CENAS[k].de, 0], [CENAS[k].de + 0.4, 1]]);

  const lista = baloes(d);
  const balao = lista.find((x) => entre(t, x.de, x.ate)) ?? null;
  const opaBalao = balao ? opacidadeDoBalao(t, balao.de, balao.ate, balao === lista[lista.length - 1]) : 0;
  const alvos: Record<Alvo, number> = { grupo: 170, regua: 250, barras: 200, volta: 300 };
  const alvo = (a: Alvo): Ponto => ({ x: M.x + M.aw, y: alvos[a] });

  const titulo = (k: number) => (
    <div style={{ position: "absolute", left: M.x, top: 12, width: M.aw, font: `700 13px ${mono}`, letterSpacing: ".06em", textTransform: "uppercase", color: cor.acento }}>
      {k + 1} de {CENAS.length} · {CENAS[k].nome}
    </div>
  );
  const caixa = (x: number, y: number, w: number, h: number, filhos: React.ReactNode, borda: string = cor.linha) => (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box", border: `2px solid ${borda}`, borderRadius: 12,
      background: cor.papel, padding: "8px 12px" }}>{filhos}</div>
  );

  /* as barras de uma execução: A e B, na mesma escala; o vencedor ganha a borda verde quando `marca` */
  const barras = (x: number, y: number, w: number, c: Caso, i: number, cresce: number, marca: boolean, rotulo: string) => {
    const e = c.execucoes[i];
    return (
      <div style={{ position: "absolute", left: x, top: y, width: w }}>
        <div style={{ font: `700 ${M.fonte - 1}px ${ui}`, color: cor.texto, marginBottom: 6 }}>{rotulo}</div>
        {[0, 1].map((j) => {
          const vence = marca && e.escolha === j;
          return (
            <div key={j} style={{ display: "grid", gridTemplateColumns: "18px 1fr 34px", alignItems: "center", gap: 6, padding: "4px 6px", marginBottom: 4, borderRadius: 8,
              border: `2px solid ${vence ? cor.ok : "transparent"}`, background: vence ? "color-mix(in srgb, var(--ok, #1f7a4c) 10%, transparent)" : "transparent" }}>
              <b style={{ font: `700 ${M.fonte}px ${mono}`, color: j ? AMBAR : AZUL }}>{j ? "B" : "A"}</b>
              <div style={{ height: 14, borderRadius: 4, background: cor.linha, overflow: "hidden" }}>
                <div style={{ width: `${(100 * e.pontuacoes[j] * cresce) / teto}%`, height: "100%", background: j ? AMBAR : AZUL }} />
              </div>
              <span style={{ font: `600 ${M.fonte - 1}px ${mono}`, color: cor.texto, textAlign: "right" }}>{numero(e.pontuacoes[j])}</span>
            </div>
          );
        })}
        <div style={{ font: `700 ${M.fonte - 2}px ${ui}`, color: cor.ok, opacity: marca ? 1 : 0, marginTop: 2 }}>vence {token(e)}</div>
      </div>
    );
  };

  /* cena 1: sozinha ou num grupo (esquema do mecanismo descrito na fonte) */
  const c2 = () => {
    const o = cena(0);
    if (!o) return null;
    const meia = (M.aw - 12) / 2, t0 = CENAS[0].de;
    const envelope = (x: number, y: number, destaque: boolean, k: number) => (
      <div key={k} style={{ position: "absolute", left: x, top: y, width: 44, height: 30, borderRadius: 6, border: `2px solid ${destaque ? cor.acento : cor.linha}`,
        background: destaque ? "color-mix(in srgb, var(--acento, #2a4fb5) 12%, transparent)" : cor.papel, display: "flex", alignItems: "center", justifyContent: "center",
        font: `14px ${ui}`, color: destaque ? cor.acento : cor.fraco, opacity: kf(t, [[t0 + 0.4 + k * 0.15, 0], [t0 + 0.7 + k * 0.15, 1]]) }}>✉</div>
    );
    const lado = (i: number) => {
      const x = M.x + i * (meia + 12), grupo = i === 1;
      const c = d.caminhos[i];
      const expr = i === 0 ? `(${numero(c.passos[0].parcelas[0])} + ${numero(c.passos[0].parcelas[1])}) + ${numero(c.passos[1].parcelas[1])}`
        : `${numero(c.passos[1].parcelas[0])} + (${numero(c.passos[0].parcelas[0])} + ${numero(c.passos[0].parcelas[1])})`;
      return <div key={i}>
        {caixa(x, 44, meia, 250, <>
          <div style={{ font: `700 ${M.fonte}px ${ui}`, color: cor.texto }}>{grupo ? "num grupo de 4" : "sozinha"}</div>
          <div style={{ font: `${M.fonte - 3}px ${ui}`, color: cor.fraco }}>execução {i + 1}</div>
        </>)}
        {(grupo ? [0, 1, 2, 3] : [0]).map((k) => envelope(x + 14 + (k % 2) * 52, 104 + Math.floor(k / 2) * 40, k === 0, k))}
        <div style={{ position: "absolute", left: x + 12, top: 200, width: meia - 24, opacity: kf(t, [[t0 + 1.6, 0], [t0 + 2.0, 1]]) }}>
          <div style={{ font: `600 11px ${mono}`, color: cor.fraco }}>A CONTA</div>
          <div style={{ font: `700 ${desenho === "largo" ? 15 : 13}px ${mono}`, color: cor.texto }}>{expr}</div>
        </div>
      </div>;
    };
    return <div style={{ opacity: o }}>
      {titulo(0)}
      {lado(0)}{lado(1)}
      <div style={{ position: "absolute", left: M.x, top: 304, width: M.aw, font: `italic 12.5px ${ui}`, color: cor.fraco }}>esquema do mecanismo descrito na fonte; os números são do exemplo</div>
    </div>;
  };

  /* cena 3: a régua de 16 bits; cada soma parcial aparece no valor exato e escorrega para o que o formato guarda */
  const c3 = () => {
    const o = cena(1);
    if (!o) return null;
    const lo = d.guardaveis[0], hi = d.guardaveis.at(-1)!;
    const px = (v: number) => M.x + 20 + ((v - lo) / (hi - lo)) * (M.aw - 40);
    const eixo = 120;
    const pista = (i: number) => {
      const y = eixo + 76 + i * 118, c = d.caminhos[i];
      return <div key={i}>
        <div style={{ position: "absolute", left: M.x, top: y - 34, font: `700 ${M.fonte - 2}px ${ui}`, color: cor.texto }}>execução {i + 1} · {i ? "num grupo" : "sozinha"}</div>
        {c.passos.map((p, k) => {
          const de = REGUA.passo(i, k), dentro = p.exato >= lo;
          const aparece = kf(t, [[de, 0], [de + 0.3, 1]]);
          const desce = kf(t, [[de + REGUA.escorrega, 0], [de + REGUA.escorrega + 0.5, 1]], suave);
          const ultimo = k === c.passos.length - 1;
          const saiu = !ultimo && t > REGUA.passo(i, k + 1);
          if (!dentro) {
            return <div key={k} style={{ position: "absolute", left: M.x, top: y + 40, opacity: aparece * (saiu ? 0.45 : 1), font: `600 ${M.fonte - 1}px ${mono}`, color: cor.fraco }}>
              {numero(p.parcelas[0])} + {numero(p.parcelas[1])} = {numero(p.guardado)} <span style={{ font: `12px ${ui}` }}>(perto de zero, cabe)</span>
            </div>;
          }
          const x = px(p.exato) + (px(p.guardado) - px(p.exato)) * desce;
          return <div key={k} style={{ opacity: aparece * (saiu ? 0.3 : 1) }}>
            <div style={{ position: "absolute", left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 9, background: i ? AMBAR : AZUL, boxShadow: "0 0 0 3px var(--papel, #f6f2ea)" }} />
            <div style={{ position: "absolute", left: Math.min(x - 70, M.x + M.aw - 160), top: y + 14, width: 160, font: `600 ${M.fonte - 2}px ${mono}`, color: cor.texto }}>
              {desce < 0.5 ? `${numero(p.parcelas[0])} + ${numero(p.parcelas[1])} = ${numero(p.exato)}` : `guarda ${numero(p.guardado)}`}
            </div>
          </div>;
        })}
      </div>;
    };
    return <div style={{ opacity: o }}>
      {titulo(1)}
      <div style={{ position: "absolute", left: M.x, top: 44, width: M.aw, font: `${M.fonte - 2}px ${ui}`, color: cor.fraco }}>os valores que o formato de 16 bits consegue guardar</div>
      <div style={{ position: "absolute", left: px(lo), top: eixo, width: px(hi) - px(lo), height: 2, background: cor.linha }} />
      {d.guardaveis.map((g) => <div key={g}>
        <div style={{ position: "absolute", left: px(g) - 1, top: eixo - 8, width: 2, height: 18, background: cor.texto }} />
        <div style={{ position: "absolute", left: px(g) - 30, top: eixo - 30, width: 60, textAlign: "center", font: `600 ${desenho === "largo" ? 12 : 11}px ${mono}`, color: cor.fraco }}>{numero(g)}</div>
      </div>)}
      {pista(0)}{pista(1)}
    </div>;
  };

  /* cenas 4 e 6: as barras das duas execuções, lado a lado; a 5 mostra o token que volta à entrada */
  const lados = (k: number, c: Caso) => {
    const o = cena(k);
    if (!o) return null;
    const meia = (M.aw - 12) / 2, t0 = CENAS[k].de;
    return <div style={{ opacity: o }}>
      {titulo(k)}
      {[0, 1].map((i) => <div key={i}>
        {caixa(M.x + i * (meia + 12), 44, meia, 196, null, t > t0 + 1.8 ? cor.ok : cor.linha)}
        <div style={{ position: "absolute", left: M.x + i * (meia + 12) + 12, top: 54, font: `600 ${M.fonte - 3}px ${mono}`, color: cor.fraco }}>soma: {numero(c.execucoes[i].soma)}</div>
        {barras(M.x + i * (meia + 12) + 8, 78, meia - 16, c, i, kf(t, [[t0 + 0.3, 0], [t0 + 1.2, 1]], suave), t > t0 + 1.8, `execução ${i + 1}`)}
      </div>)}
      <div style={{ position: "absolute", left: M.x, top: 256, width: M.aw, textAlign: "center", font: `700 ${M.fonte + 1}px ${ui}`, color: c === folga ? cor.ok : cor.aviso, opacity: kf(t, [[t0 + 2.2, 0], [t0 + 2.6, 1]]) }}>
        {c.execucoes[0].escolha !== c.execucoes[1].escolha ? `${token(c.execucoes[0])} de um lado, ${token(c.execucoes[1])} do outro: a escolha mudou` : `${token(c.execucoes[0])} dos dois lados: a escolha ficou`}
      </div>
      <div style={{ position: "absolute", left: M.x, top: 286, width: M.aw, textAlign: "center", font: `12.5px ${ui}`, color: cor.fraco }}>neste exemplo, A = soma − {numero(1024)}; B = {numero(c.b)}</div>
    </div>;
  };

  const c5 = () => {
    const o = cena(3);
    if (!o) return null;
    const meia = (M.aw - 12) / 2, t0 = CENAS[3].de;
    return <div style={{ opacity: o }}>
      {titulo(3)}
      {disputa.execucoes.map((e, i) => {
        const x = M.x + i * (meia + 12);
        return <div key={i}>
          {caixa(x, 44, meia, 70, <>
            <div style={{ font: `600 11px ${mono}`, color: cor.fraco }}>EXECUÇÃO {i + 1}: A PRÓXIMA ENTRADA</div>
            <div style={{ font: `${M.fonte - 1}px ${ui}`, color: cor.texto }}>pergunta + <b style={{ color: e.escolha ? AMBAR : AZUL }}>{token(e)}</b></div>
          </>)}
          {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: x + meia / 2 - 40, top: 130 + k * 52, width: 80, height: 36, borderRadius: 8,
            border: `2px dashed ${e.escolha ? AMBAR : AZUL}`, opacity: kf(t, [[t0 + 0.6 + k * 0.4, 0], [t0 + 0.9 + k * 0.4, 1]]), display: "flex", alignItems: "center", justifyContent: "center",
            font: `600 13px ${mono}`, color: cor.fraco }}>token {k + 2}</div>)}
        </div>;
      })}
      <div style={{ position: "absolute", left: M.x, top: 296, width: M.aw, textAlign: "center", font: `700 ${M.fonte}px ${ui}`, color: cor.aviso, opacity: kf(t, [[t0 + 2.0, 0], [t0 + 2.4, 1]]) }}>
        daqui em diante, as duas respostas seguem caminhos diferentes
      </div>
    </div>;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui }}>
      {c2()}{c3()}{lados(2, disputa)}{c5()}{lados(4, folga)}
      {balao && M.balao.lado ? <svg width={M.w} height={M.h} style={{ position: "absolute", inset: 0 }}>
        <line x1={M.x + M.aw + 6} y1={alvo(balao.alvo).y} x2={M.balao.x} y2={alvo(balao.alvo).y} stroke={cor.acento} strokeWidth={2} strokeDasharray="5 4" opacity={opaBalao} />
      </svg> : null}
      {balao ? <Balao M={M as never} alvo={alvo(balao.alvo)} opacidade={opaBalao}>{balao.texto}</Balao> : null}
    </AbsoluteFill>
  );
};
