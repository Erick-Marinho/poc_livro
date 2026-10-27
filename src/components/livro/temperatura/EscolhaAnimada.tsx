/**
 * Como o modelo escolhe (Remotion; docs/capacidades/temperatura-zero-revisao.md, etapa 4), que o leitor toca ou rola
 * (palco/RolaCena.tsx). Seis cenas: a resposta se escreve um token por vez; os tokens possíveis ganham pontuação; com a
 * temperatura em 1, cada um ganha uma chance, e três execuções sorteiam três respostas; a temperatura desce a zero, e as
 * três escrevem a mesma; o cálculo das pontuações aparece antes da escolha; e a pergunta vai sozinha ou num lote, com a
 * ordem das somas trocada e a mesma escolha. Os balões explicam. O que se desenha sai de escolha.ts.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, kf, mono, suave, ui } from "../palco/video";
import { Balao, entre, opacidadeDoBalao } from "../roteiro/pecas";
import { baloes, CENAS, type Escolha, porcento, SEGUNDOS } from "./escolha.ts";

export type Desenho = "largo" | "estreito";
export const MEDIDAS = {
  largo: { w: 780, h: 400, x: 20, aw: 460, balao: { lado: true, x: 500, w: 264, y: 0, fonte: 17 } },
  estreito: { w: 420, h: 620, x: 14, aw: 392, balao: { lado: false, x: 14, w: 392, y: 400, fonte: 17 } },
} as const;
const CORES = ["#2a6fdb", "#c77d0a", "#7a52b3", "#2f8f83"];

export type Props = { escolha: Escolha; desenho: Desenho };

export const EscolhaAnimada: React.FC<Props> = ({ escolha: e, desenho }) => {
  const M = MEDIDAS[desenho];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const k = CENAS.reduce((i, c, j) => (t >= c.de ? j : i), 0);
  const t0 = CENAS[k].de;
  const fimDe = (j: number) => (j + 1 < CENAS.length ? CENAS[j + 1].de : SEGUNDOS);
  const largo = desenho === "largo";
  const maior = e.zero.indexOf(1);
  const teto = Math.max(...e.candidatos.map((c) => c.pontuacao));

  const lista = baloes(e);
  const balao = lista.find((x) => entre(t, x.de, x.ate)) ?? null;
  const opaBalao = balao ? opacidadeDoBalao(t, balao.de, balao.ate, balao === lista[lista.length - 1]) : 0;
  const alvo = { x: M.x + M.aw, y: M.h / 2 };

  /* a resposta que se escreve: os tokens já escritos e o lugar do próximo */
  const resposta = (proximo: React.ReactNode) => (
    <div style={{ position: "absolute", left: M.x, top: 40, width: M.aw, boxSizing: "border-box", border: `2px solid ${cor.linha}`, borderRadius: 12, background: cor.papel, padding: "6px 10px" }}>
      <div style={{ font: `600 11px ${mono}`, color: cor.fraco }}>A RESPOSTA, A “{e.pergunta}”</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4, alignItems: "center" }}>
        {e.escrito.map((tk, i) => (
          <span key={i} style={{ font: `600 ${largo ? 16 : 15}px ${mono}`, padding: "2px 8px", borderRadius: 7, background: cor.nota, border: `1.5px solid ${cor.linha}`, color: cor.texto,
            opacity: k === 0 ? kf(t, [[0.4 + i * 0.7, 0], [0.7 + i * 0.7, 1]]) : 1 }}>{tk}</span>
        ))}
        {proximo}
      </div>
    </div>
  );
  const vazio = (texto = "?") => <span style={{ font: `700 ${largo ? 16 : 15}px ${mono}`, padding: "2px 10px", borderRadius: 7, border: `2px dashed ${cor.acento}`, color: cor.acento,
    opacity: 0.55 + 0.45 * Math.abs(Math.sin(t * 3)) }}>{texto}</span>;

  /* os tokens possíveis: a barra é a pontuação; a chance aparece com o sorteio e, na temperatura zero, vai toda para o maior */
  const zerando = kf(t, [[CENAS[3].de + 0.6, 0], [CENAS[3].de + 2.2, 1]], suave);
  const temperatura = e.temperatura * (1 - zerando);
  const candidatos = (y: number, mostraChance: boolean) => (
    <div style={{ position: "absolute", left: M.x, top: y, width: M.aw }}>
      <div style={{ display: "grid", gridTemplateColumns: `${largo ? 78 : 70}px 1fr 34px ${mostraChance ? (largo ? "70px" : "62px") : "0px"}`, columnGap: 8, rowGap: 6, alignItems: "center" }}>
        <span style={{ font: `600 11px ${mono}`, color: cor.fraco }}>TOKEN</span><span style={{ font: `600 11px ${mono}`, color: cor.fraco }}>PONTUAÇÃO</span><span />
        <span style={{ font: `600 11px ${mono}`, color: cor.fraco, opacity: mostraChance ? 1 : 0 }}>CHANCE</span>
        {e.candidatos.map((c, i) => {
          const cresce = k === 1 ? kf(t, [[t0 + 0.3 + i * 0.2, 0], [t0 + 1.0 + i * 0.2, 1]], suave) : 1;
          const ch = e.quente[i] * (1 - zerando) + e.zero[i] * zerando;
          return [
            <b key={`t${i}`} style={{ font: `700 ${largo ? 15 : 14}px ${mono}`, color: CORES[i] }}>{c.token}</b>,
            <div key={`b${i}`} style={{ height: 14, borderRadius: 4, background: cor.linha, overflow: "hidden" }}>
              <div style={{ width: `${(100 * c.pontuacao * cresce) / teto}%`, height: "100%", background: CORES[i] }} />
            </div>,
            <span key={`v${i}`} style={{ font: `600 13px ${mono}`, color: cor.texto, textAlign: "right" }}>{c.pontuacao.toLocaleString("pt-BR")}</span>,
            <b key={`c${i}`} style={{ font: `700 ${largo ? 15 : 13}px ${mono}`, color: ch > 0.5 ? cor.ok : cor.fraco, opacity: mostraChance ? 1 : 0, textAlign: "right" }}>{porcento(Math.round(ch * 1000) / 1000)}</b>,
          ];
        })}
      </div>
    </div>
  );

  /* a temperatura, numa régua de 0 a 1 */
  const regua = (y: number) => (
    <div style={{ position: "absolute", left: M.x, top: y, width: M.aw, display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ font: `600 13px ${ui}`, color: cor.texto, whiteSpace: "nowrap" }}>temperatura <b style={{ font: `700 15px ${mono}`, color: cor.acento }}>{temperatura.toLocaleString("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 0 })}</b></span>
      <div style={{ position: "relative", flex: 1, height: 6, borderRadius: 3, background: cor.linha }}>
        <div style={{ position: "absolute", left: `calc(${(100 * temperatura) / e.temperatura}% - 9px)`, top: -6, width: 18, height: 18, borderRadius: 9, background: cor.acento }} />
      </div>
    </div>
  );

  /* as execuções: cada uma sorteia o próximo token; na temperatura zero, todas dão o maior */
  const execucoes = (y: number, quais: number[], de: number) => (
    <div style={{ position: "absolute", left: M.x, top: y, width: M.aw, display: "grid", gridTemplateColumns: `repeat(${quais.length}, 1fr)`, gap: 8 }}>
      {quais.map((i, j) => {
        const aparece = kf(t, [[de + j * 0.6, 0], [de + j * 0.6 + 0.35, 1]]);
        return <div key={j} style={{ opacity: aparece, transform: `translateY(${(1 - aparece) * 8}px)`, boxSizing: "border-box", border: `2px solid ${CORES[i]}`, borderRadius: 10,
          background: cor.papel, padding: "4px 8px", textAlign: "center" }}>
          <div style={{ font: `600 11px ${mono}`, color: cor.fraco }}>EXECUÇÃO {j + 1}</div>
          <div style={{ font: `700 ${largo ? 15 : 13}px ${mono}`, color: CORES[i] }}>{e.candidatos[i].token}</div>
        </div>;
      })}
    </div>
  );

  /* cena 5: o cálculo das pontuações, antes da escolha */
  const calculo = (x: number, y: number, w: number, h: number, de: number, trocado = false) => {
    const parcelas = trocado ? ["(a + b)", "+", "(c + d)"] : ["((a + b)", "+ c)", "+ d"];
    return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box", border: `2px solid ${cor.acento}`, borderRadius: 12,
      background: "color-mix(in srgb, var(--acento, #2a4fb5) 7%, var(--papel, #f6f2ea))", padding: "6px 10px", display: "grid", alignContent: "start", gap: 4 }}>
      <div style={{ font: `600 11px ${mono}`, color: cor.acento }}>O CÁLCULO DAS PONTUAÇÕES</div>
      <div style={{ font: `700 ${largo ? 15 : 13}px ${mono}`, color: cor.texto, opacity: kf(t, [[de, 0], [de + 0.4, 1]]) }}>{parcelas.join(" ")}</div>
      <div style={{ font: `12px ${ui}`, color: cor.fraco, opacity: kf(t, [[de + 0.6, 0], [de + 1, 1]]) }}>e milhares de somas como esta</div>
    </div>;
  };

  const opa = (j: number) => kf(t, j + 1 < CENAS.length
    ? [[CENAS[j].de, j ? 0 : 1], [CENAS[j].de + 0.35, 1], [fimDe(j) - 0.25, 1], [fimDe(j), 0]] : [[CENAS[j].de, 0], [CENAS[j].de + 0.35, 1]]);

  const cena = () => {
    if (k === 0) return resposta(vazio());
    if (k === 1) return <>{resposta(vazio())}{candidatos(118, false)}</>;
    if (k === 2) return <>{resposta(vazio())}{candidatos(118, true)}{regua(274)}{execucoes(306, e.quentes, t0 + 2.2)}</>;
    if (k === 3) return <>{resposta(vazio())}{candidatos(118, true)}{regua(274)}{execucoes(306, e.zeros, t0 + 2.6)}</>;
    if (k === 4) {
      const meia = (M.aw - 30) / 2;
      return <>
        {calculo(M.x, 54, meia, 84, t0 + 0.4)}
        <div style={{ position: "absolute", left: M.x + meia + 4, top: 100, width: 22, font: `700 20px ${ui}`, color: cor.acento, opacity: kf(t, [[t0 + 1.2, 0], [t0 + 1.5, 1]]) }}>→</div>
        <div style={{ position: "absolute", left: M.x + meia + 30, top: 54, width: meia, opacity: kf(t, [[t0 + 1.4, 0], [t0 + 1.8, 1]]) }}>
          <div style={{ font: `600 11px ${mono}`, color: cor.fraco, marginBottom: 6 }}>AS PONTUAÇÕES</div>
          {e.candidatos.slice(0, 2).map((c, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: 6, alignItems: "center", marginBottom: 6 }}>
            <b style={{ font: `700 13px ${mono}`, color: CORES[i] }}>{c.token}</b>
            <div style={{ height: 12, borderRadius: 4, background: cor.linha }}><div style={{ width: `${(100 * c.pontuacao) / teto}%`, height: "100%", borderRadius: 4, background: CORES[i] }} /></div>
          </div>)}
          <div style={{ font: `600 12px ${ui}`, color: cor.ok }}>→ a escolha: vence a maior</div>
        </div>
        <div style={{ position: "absolute", left: M.x, top: 160, width: M.aw, font: `700 ${largo ? 16 : 15}px ${ui}`, color: cor.texto, textAlign: "center", opacity: kf(t, [[t0 + 2.4, 0], [t0 + 2.8, 1]]) }}>
          a escolha é só a última parte do caminho
        </div>
      </>;
    }
    /* cena 6: sozinha ou num lote */
    const meia = (M.aw - 12) / 2;
    const envelope = (x: number, y: number, destaque: boolean, j: number) => <div key={j} style={{ position: "absolute", left: x, top: y, width: 40, height: 28, borderRadius: 6,
      border: `2px solid ${destaque ? cor.acento : cor.linha}`, background: cor.papel, display: "flex", alignItems: "center", justifyContent: "center", font: `14px ${ui}`,
      color: destaque ? cor.acento : cor.fraco, opacity: kf(t, [[t0 + 0.3 + j * 0.15, 0], [t0 + 0.6 + j * 0.15, 1]]) }}>✉</div>;
    return <>
      {[0, 1].map((i) => {
        const x = M.x + i * (meia + 12);
        return <div key={i}>
          <div style={{ position: "absolute", left: x, top: 40, font: `700 ${largo ? 15 : 14}px ${ui}`, color: cor.texto }}>{i ? "num lote de 4 perguntas" : "a sua pergunta sozinha"}</div>
          {(i ? [0, 1, 2, 3] : [0]).map((j) => envelope(x + j * 46, 66, j === 0, j))}
          {calculo(x, 108, meia, 92, t0 + 1.2 + i * 0.6, i === 1)}
          <div style={{ position: "absolute", left: x, top: 212, width: meia, opacity: kf(t, [[t0 + 2.6, 0], [t0 + 3, 1]]) }}>
            {e.candidatos.slice(0, 2).map((c, j) => <div key={j} style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 6, alignItems: "center", marginBottom: 5 }}>
              <b style={{ font: `700 12px ${mono}`, color: CORES[j] }}>{c.token}</b>
              <div style={{ height: 10, borderRadius: 4, background: cor.linha }}><div style={{ width: `${(100 * c.pontuacao) / teto * (i && j === 1 ? 1.02 : 1)}%`, height: "100%", borderRadius: 4, background: CORES[j] }} /></div>
            </div>)}
            <div style={{ font: `700 12px ${ui}`, color: cor.ok }}>escreve “{e.candidatos[maior].token}”</div>
          </div>
        </div>;
      })}
      <div style={{ position: "absolute", left: M.x, top: 296, width: M.aw, textAlign: "center", font: `700 ${largo ? 15 : 14}px ${ui}`, color: cor.aviso, opacity: kf(t, [[t0 + 3.6, 0], [t0 + 4, 1]]) }}>
        a ordem das somas mudou; aqui, a escolha não
      </div>
      <div style={{ position: "absolute", left: M.x, top: 322, width: M.aw, textAlign: "center", font: `italic 12px ${ui}`, color: cor.fraco, opacity: kf(t, [[t0 + 3.6, 0], [t0 + 4, 1]]) }}>
        esquema do mecanismo descrito no estudo; os tokens e as pontuações são do exemplo
      </div>
    </>;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui }}>
      <div style={{ position: "absolute", left: M.x, top: 12, width: M.aw, font: `700 13px ${mono}`, letterSpacing: ".06em", textTransform: "uppercase", color: cor.acento }}>
        {k + 1} de {CENAS.length} · {CENAS[k].nome}
      </div>
      <div style={{ opacity: opa(k) }}>{cena()}</div>
      {balao && M.balao.lado ? <svg width={M.w} height={M.h} style={{ position: "absolute", inset: 0 }}>
        <line x1={M.x + M.aw + 6} y1={alvo.y} x2={M.balao.x} y2={alvo.y} stroke={cor.acento} strokeWidth={2} strokeDasharray="5 4" opacity={opaBalao} />
      </svg> : null}
      {balao ? <Balao M={M as never} alvo={alvo} opacidade={opaBalao}>{balao.texto}</Balao> : null}
    </AbsoluteFill>
  );
};
