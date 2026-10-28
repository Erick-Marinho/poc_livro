/**
 * A jornada de uma pergunta (Remotion; docs/capacidades/experimento-kv-cache.md, etapa 7), que abre o texto. O caminho
 * fica fixo na tela (você, o aplicativo, o servidor, o modelo), e cada ponto tem embaixo a sua gaveta: o mural de
 * respostas, os começos já lidos e as anotações. Três moradores passam por ele: a Ana faz o caminho inteiro e enche as
 * gavetas; o Bruno pula a leitura do começo; a Carla recebe do mural a resposta da Ana, errada. Só a última cena dá os
 * nomes. Seis cenas (docs/RITMO.md): o Enter e o pedido dividem a primeira. Os textos saem de kv.ts e de
 * figuras/jornada.json; as barras são ilustração.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, kf, mono, suave, ui } from "../palco/video";
import { JORNADA as F, type Jornada } from "./kv.ts";
import { BalaoDaCena, Cabecalho, cenaEm, type Desenho, type Medidas, Resumos } from "./pecas";

export type Props = { jornada: Jornada; desenho: Desenho };

export const MEDIDAS_JORNADA = {
  largo: { w: 780, h: 600, x: 20, aw: 740, fonte: 14, balao: { lado: false, x: 20, w: 740, y: 514, fonte: 17 } },
  estreito: { w: 420, h: 810, x: 14, aw: 392, fonte: 13, balao: { lado: false, x: 14, w: 392, y: 712, fonte: 16 } },
} as const;

const preenchido = "color-mix(in srgb, var(--acento, #2a4fb5) 22%, transparent)";
const avisoFundo = "color-mix(in srgb, var(--aviso, #9a5b00) 14%, transparent)";
const rotulo = (texto: string, c: string = cor.fraco) => <div style={{ font: `700 11px ${mono}`, letterSpacing: ".05em", color: c }}>{texto}</div>;

export const JornadaAnimada: React.FC<Props> = ({ jornada: j, desenho }) => {
  const M = MEDIDAS_JORNADA[desenho] as unknown as Medidas;
  const D = MEDIDAS_JORNADA[desenho];
  const t = useCurrentFrame() / useVideoConfig().fps;
  /* a cena da tela (F, seis) e os marcos da história, um a mais: o Enter e o pedido dividem a primeira cena */
  const kn = cenaEm(F, t);
  const MARCOS = [0, 2.5, 7.5, 12, 18, 23.5, 28.5];
  const de = (n: number) => MARCOS[n];
  const k = MARCOS.reduce((i, m, n) => (t >= m ? n : i), 0);
  const largo = desenho === "largo";
  const [ana, bruno, carla] = j.perguntas;

  /* a geometria: no largo, os quatro pontos numa linha e as gavetas embaixo; no estreito, numa coluna, gavetas ao lado */
  const no = largo
    ? (i: number) => ({ x: D.x + i * ((D.aw - 4 * 160) / 3 + 160), y: 44, w: 160, h: 78 })
    : (i: number) => ({ x: D.x, y: 44 + i * 94, w: 158, h: 84 });
  const gaveta = largo
    ? (i: number) => ({ x: no(i).x, y: 134, w: 160, h: 108 })
    : (i: number) => ({ x: D.x + 168, y: no(i).y, w: D.aw - 168, h: 84 });
  const pedidoY = largo ? 262 : 428;
  const respostaY = pedidoY + 58;
  const resumosY = largo ? 370 : 556;

  /* quem está andando, e onde: o índice do ponto (fracionário, entre dois pontos) */
  const quem = t < de(4) ? ana : t < de(5) ? bruno : carla;
  const onde = t < de(4)
    ? kf(t, [[0.6, 0], [1.8, 1], [de(1) + 3.2, 1], [de(1) + 4.2, 2], [de(2) + 0.9, 2], [de(2) + 1.6, 3]], suave)
    : t < de(5)
      ? kf(t, [[de(4) + 0.2, 0], [de(4) + 0.8, 1], [de(4) + 1.6, 1], [de(4) + 2.1, 2], [de(4) + 2.9, 2], [de(4) + 3.3, 3]], suave)
      : kf(t, [[de(5) + 0.2, 0], [de(5) + 0.8, 1], [de(5) + 2.0, 1], [de(5) + 2.8, 0]], suave);
  const pino = (() => {
    const a = no(Math.floor(onde)), b = no(Math.min(3, Math.floor(onde) + 1)), f = onde - Math.floor(onde);
    return { x: a.x + (b.x - a.x) * f + (largo ? a.w / 2 : a.w - 10), y: a.y + (b.y - a.y) * f + (largo ? -6 : a.h / 2) };
  })();
  const ativo = Math.round(onde);

  /* as gavetas: o que cada uma guarda em cada momento */
  const muralCheio = t >= de(3) + 4.8;
  const muralOlha = (t >= de(1) + 2 && t < de(1) + 3.2) || (t >= de(4) + 0.9 && t < de(4) + 1.6) || (t >= de(5) + 0.9 && t < de(5) + 2.2);
  const muralAcha = t >= de(5) + 1.3 && t < de(6);
  const comecosCheios = t >= de(3) + 4.2;
  const comecosOlha = (t >= de(2) + 0.2 && t < de(2) + 0.9) || (t >= de(4) + 2.1 && t < de(4) + 2.9);
  const comecosAcha = t >= de(4) + 2.3 && t < de(5);

  /* o pedido em três blocos, e quanto de cada um o modelo já leu */
  const blocos = [{ nome: "instruções", w: 0.24 }, { nome: "regulamento", w: 0.46 }, { nome: quem.curta, w: 0.3 }];
  const lidoAna = kf(t, [[de(2) + 1.7, 0], [de(2) + 4.2, 1]]);
  const lidoBruno = kf(t, [[de(4) + 3.3, 0], [de(4) + 3.9, 1]]);
  const pulados = t >= de(4) && t < de(5) && t >= de(4) + 2.4;
  const lido = (i: number) => (t < de(4) ? Math.min(1, Math.max(0, (lidoAna - [0, 0.24, 0.7][i]) / blocos[i].w)) : t < de(5) ? (i < 2 ? 0 : lidoBruno) : 0);
  const pedidoVisivel = t >= de(1) + 0.2 && !(t >= de(5));
  const blocoEm = (i: number) => (t < de(4) ? de(1) + 0.3 + i * 0.5 : de(4) + 0.9 + i * 0.15);

  /* a resposta, palavra por palavra (Ana e Bruno), e as anotações enquanto ela sai */
  const palavraEm = (i: number) => (t < de(4) ? de(3) + 0.4 + i * 0.55 : de(4) + 4.0 + i * 0.12);
  const resp = t < de(4) ? ana.resposta! : bruno.resposta!;
  const escritas = t >= de(5) ? 0 : resp.filter((_, i) => t >= palavraEm(i)).length;
  const lendo = (t >= de(2) + 1.7 && t < de(2) + 4.2) || (t >= de(4) + 3.3 && t < de(4) + 3.9);
  const escrevendo = escritas > 0 && escritas < resp.length;
  const anotacoes = t < de(4) ? (t >= de(2) + 1.7 ? Math.round(8 * lidoAna) + escritas : 0) : t < de(5) ? Math.round(3 * lidoBruno) + escritas : 0;
  const anotacoesSomem = t < de(4) ? kf(t, [[de(3) + 3.9, 1], [de(3) + 4.3, 0.15]]) : kf(t, [[de(4) + 4.9, 1], [de(4) + 5.3, 0.15]]);
  const nomes = kf(t, [[de(6) + 0.3, 0], [de(6) + 0.8, 1]]);

  const Caixa = ({ i, titulo, texto }: { i: number; titulo: string; texto: React.ReactNode }) => {
    const n = no(i), aceso = ativo === i && k < 6;
    return <div style={{ position: "absolute", left: n.x, top: n.y, width: n.w, height: n.h, boxSizing: "border-box", padding: "6px 9px", borderRadius: 12,
      background: cor.papel, border: `2px solid ${aceso ? cor.acento : cor.linha}` }}>
      {rotulo(titulo, aceso ? cor.acento : cor.fraco)}
      <div style={{ marginTop: 3, font: `${M.fonte}px/1.3 ${ui}`, color: cor.texto }}>{texto}</div>
    </div>;
  };
  const Gaveta = ({ i, titulo, nome, olha, acha, erra, children }: { i: number; titulo: string; nome: string; olha: boolean; acha?: boolean; erra?: boolean; children: React.ReactNode }) => {
    const g = gaveta(i);
    const borda = acha ? (erra ? cor.aviso : cor.ok) : olha ? cor.acento : cor.fraco;
    return <div style={{ position: "absolute", left: g.x, top: g.y, width: g.w, height: g.h, boxSizing: "border-box", padding: "6px 9px", borderRadius: 8,
      border: `2px ${olha || acha ? "solid" : "dashed"} ${borda}`, background: acha && erra ? avisoFundo : cor.nota }}>
      {rotulo(titulo)}
      <div style={{ marginTop: 3, font: `${M.fonte - 1}px/1.3 ${ui}`, color: cor.texto }}>{children}</div>
      {nomes > 0 ? <div style={{ position: "absolute", left: 8, bottom: -11, opacity: nomes, padding: "1px 7px", borderRadius: 6, background: cor.papel,
        border: `1.5px solid ${erra ? cor.aviso : cor.acento}`, font: `700 ${M.fonte - 1}px ${mono}`, color: erra ? cor.aviso : cor.acento, whiteSpace: "nowrap" }}>{nome}</div> : null}
    </div>;
  };
  const vazio = <span style={{ color: cor.fraco, fontStyle: "italic" }}>vazio</span>;

  const seta = (i: number) => {
    const a = no(i), b = no(i + 1);
    return largo
      ? <div key={i} style={{ position: "absolute", left: a.x + a.w, top: a.y + a.h / 2 - 10, width: b.x - a.x - a.w, textAlign: "center", font: `700 16px ${ui}`, color: cor.linha }}>→</div>
      : <div key={i} style={{ position: "absolute", left: a.x + a.w / 2 - 6, top: a.y + a.h - 1, height: b.y - a.y - a.h + 2, font: `700 14px ${ui}`, color: cor.linha, display: "flex", alignItems: "center" }}>↓</div>;
  };

  const estadoModelo = lendo ? "lendo…" : escrevendo ? "escrevendo…" : t >= de(5) && t < de(6) ? <span style={{ color: cor.fraco }}>nem foi chamado</span> : "lê, depois escreve";

  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui }}>
      <Cabecalho M={M} f={F} k={kn} />

      {[0, 1, 2].map(seta)}
      <Caixa i={0} titulo={`VOCÊ · ${quem.quem.toUpperCase()}`} texto={quem.texto} />
      <Caixa i={1} titulo="O APLICATIVO" texto="monta o pedido" />
      <Caixa i={2} titulo="O SERVIDOR" texto="recebe o pedido" />
      <Caixa i={3} titulo="O MODELO" texto={estadoModelo} />

      <Gaveta i={1} titulo="MURAL DE RESPOSTAS" nome="cache semântico" olha={muralOlha} acha={muralAcha} erra>
        {muralCheio ? <>Ana: <i>sábado à tarde?</i> → {ana.resposta!.join(" ")}</> : vazio}
        {muralOlha && !muralAcha ? <div style={{ color: cor.acento, fontWeight: 600 }}>{t < de(4) + 2 ? "nada parecido" : "procurando…"}</div> : null}
        {muralAcha ? <div style={{ color: cor.aviso, fontWeight: 700 }}>parece a da Ana!</div> : null}
      </Gaveta>
      <Gaveta i={2} titulo="COMEÇOS JÁ LIDOS" nome="cache de prefixo" olha={comecosOlha} acha={comecosAcha}>
        {comecosCheios ? <>✓ instruções<br />✓ regulamento</> : vazio}
        {comecosAcha ? <div style={{ color: cor.ok, fontWeight: 700 }}>esse começo, já li</div> : null}
        {comecosOlha && !comecosCheios ? <div style={{ color: cor.acento, fontWeight: 600 }}>nada lido antes</div> : null}
      </Gaveta>
      <Gaveta i={3} titulo="ANOTAÇÕES" nome="KV cache" olha={lendo || escrevendo}>
        {anotacoes > 0 ? <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 3, opacity: anotacoesSomem }}>
          {Array.from({ length: anotacoes }, (_, i) => <span key={i} style={{ width: 10, height: 12, borderRadius: 2, background: preenchido, border: `1.5px solid ${cor.acento}` }} />)}
        </div> : vazio}
        {anotacoesSomem < 0.5 && anotacoes > 0 ? <div style={{ color: cor.fraco, fontStyle: "italic" }}>resposta pronta: apagadas</div> : null}
      </Gaveta>
      {nomes > 0 ? <div style={{ position: "absolute", left: D.x, top: pedidoY + 6, width: D.aw, opacity: nomes, font: `${M.fonte}px/1.4 ${ui}`, color: cor.texto }}>
        Numa API paga, o cache de prefixo se chama <b>cache de prompt</b>, e a parte reaproveitada sai mais barata.</div> : null}

      {/* quem está andando */}
      {k < 6 ? <div style={{ position: "absolute", left: pino.x - 22, top: pino.y - 10, padding: "1px 8px", borderRadius: 10, background: cor.acento, color: cor.papel,
        font: `700 ${M.fonte - 1}px ${ui}`, whiteSpace: "nowrap" }}>{quem.quem}</div> : null}

      {/* o pedido, em três blocos, e quanto o modelo já leu de cada um */}
      {pedidoVisivel ? <div style={{ position: "absolute", left: D.x, top: pedidoY, width: D.aw }}>
        {rotulo(`O PEDIDO DE ${quem.quem.toUpperCase()}`)}
        <div style={{ display: "flex", gap: 4, marginTop: 5 }}>
          {blocos.map((b, i) => {
            const q = kf(t, [[blocoEm(i), 0], [blocoEm(i) + 0.3, 1]]);
            const pulado = pulados && i < 2;
            return <div key={i} style={{ position: "relative", width: `${b.w * 100}%`, height: 30, borderRadius: 6, boxSizing: "border-box", overflow: "hidden", opacity: q,
              border: `1.5px ${pulado ? "dashed" : "solid"} ${pulado ? cor.ok : cor.fraco}`, background: cor.papel }}>
              <div style={{ position: "absolute", inset: 0, width: `${lido(i) * 100}%`, background: preenchido }} />
              <div style={{ position: "relative", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", font: `600 ${M.fonte - 1}px ${ui}`,
                color: pulado ? cor.ok : cor.texto, whiteSpace: "nowrap", padding: "0 4px" }}>{pulado ? `✓ ${b.nome}` : b.nome}</div>
            </div>;
          })}
        </div>
      </div> : null}

      {/* a resposta */}
      {k >= 3 && k < 6 ? <div style={{ position: "absolute", left: D.x, top: respostaY, width: D.aw, font: `${M.fonte + 1}px/1.4 ${ui}`, color: cor.texto }}>
        <span style={{ font: `700 10.5px ${mono}`, letterSpacing: ".05em", color: cor.fraco }}>A RESPOSTA PARA {quem.quem.toUpperCase()} </span>
        {k < 5
          ? <span style={{ fontFamily: mono, fontWeight: 600 }}>{resp.slice(0, escritas).join(" ")}{escrevendo ? <span style={{ color: cor.acento }}> ▌</span> : null}</span>
          : t >= de(5) + 2.4 ? <>
            <span style={{ fontFamily: mono, fontWeight: 600, opacity: kf(t, [[de(5) + 2.4, 0], [de(5) + 2.7, 1]]) }}>{ana.resposta!.join(" ")}</span>
            <div style={{ marginTop: 4, color: cor.aviso, fontWeight: 700, opacity: kf(t, [[de(5) + 3.3, 0], [de(5) + 3.6, 1]]) }}>✗ errada: {carla.certa}</div>
          </> : null}
      </div> : null}

      <Resumos M={M} f={F} k={kn} t={t} topo={k === 6 ? (largo ? 316 : 490) : resumosY} />
      {k < 6 ? <div style={{ position: "absolute", left: D.x, top: D.balao.y - 20, font: `italic 11px ${ui}`, color: cor.fraco }}>ilustração: as barras e as anotações não são medidas</div> : null}
      <BalaoDaCena M={M} f={F} t={t} alvoY={k === 6 ? gaveta(1).y : no(Math.min(ativo, 3)).y} alvoX={no(Math.min(ativo, 3)).x + 40} />
    </AbsoluteFill>
  );
};
