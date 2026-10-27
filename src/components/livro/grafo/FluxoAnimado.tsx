/**
 * Fluxo ou agente (Remotion; docs/capacidades/fluxo-ou-agente.md), que o leitor toca ou rola (palco/RolaCena.tsx). Nas
 * três primeiras cenas, o fluxo: caixas em fila, setas marcadas "código", e a mensagem descendo por elas; o modelo
 * entra numa caixa, depois em duas, e as setas não mudam; a pergunta do produto para onde não há seta. Nas duas
 * seguintes, o agente: o modelo no meio, as ferramentas e a resposta embaixo, e a mensagem indo e voltando pelas setas
 * que o modelo escolhe. Na última, os dois lado a lado. O que se desenha sai de fluxo.ts.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, kf, mono, suave, ui } from "../palco/video";
import { Balao, entre, opacidadeDoBalao, type Ponto } from "../roteiro/pecas";
import { baloes, CENAS, type Fluxo, PASSOS_DO_AGENTE, PASSOS_DO_FLUXO, SEGUNDOS } from "./fluxo.ts";

export type Desenho = "largo" | "estreito";
export const MEDIDAS = {
  largo: { w: 780, h: 400, x: 20, aw: 460, balao: { lado: true, x: 500, w: 264, y: 0, fonte: 17 } },
  estreito: { w: 420, h: 640, x: 14, aw: 392, balao: { lado: false, x: 14, w: 392, y: 410, fonte: 17 } },
} as const;

export type Props = { fluxo: Fluxo; desenho: Desenho };

/* onde a mensagem está, entre os pontos [segundo, ponto] */
const andar = (t: number, rota: [number, Ponto][]): Ponto => {
  const i = rota.findIndex(([em]) => t < em);
  if (i === 0) return rota[0][1];
  if (i < 0) return rota[rota.length - 1][1];
  const [ea, pa] = rota[i - 1], [eb, pb] = rota[i];
  const q = kf(t, [[ea, 0], [eb, 1]], suave);
  return { x: pa.x + (pb.x - pa.x) * q, y: pa.y + (pb.y - pa.y) * q };
};

export const FluxoAnimado: React.FC<Props> = ({ fluxo: f, desenho }) => {
  const M = MEDIDAS[desenho];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const k = CENAS.reduce((i, c, j) => (t >= c.de ? j : i), 0);
  const t0 = CENAS[k].de;
  const fim = (j: number) => (j + 1 < CENAS.length ? CENAS[j + 1].de : SEGUNDOS);
  const largo = desenho === "largo";
  const opa = kf(t, k + 1 < CENAS.length ? [[t0, k ? 0 : 1], [t0 + 0.35, 1], [fim(k) - 0.25, 1], [fim(k), 0]] : [[t0, 0], [t0 + 0.35, 1]]);

  const lista = baloes(f);
  const balao = lista.find((x) => entre(t, x.de, x.ate)) ?? null;
  const opaBalao = balao ? opacidadeDoBalao(t, balao.de, balao.ate, balao === lista[lista.length - 1]) : 0;
  const alvo = { x: M.x + M.aw, y: M.h / 2 };

  const caixa = (x: number, y: number, w: number, h: number, texto: string, quem: "código" | "modelo" | "ferramenta" | "mensagem", aceso = false, chave = texto, empilha = false, recuo = 10) => {
    const borda = aceso ? cor.acento : quem === "modelo" ? cor.acento : cor.linha;
    return <div key={chave} style={{ position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box", borderRadius: 10, border: `2px solid ${borda}`,
      background: quem === "modelo" ? "color-mix(in srgb, var(--acento, #2a4fb5) 10%, var(--papel, #f6f2ea))" : cor.papel,
      boxShadow: aceso ? "0 0 0 4px color-mix(in srgb, var(--acento, #2a4fb5) 22%, transparent)" : "none",
      display: "flex", flexDirection: empilha ? "column" : "row", alignItems: empilha ? "flex-start" : "center", justifyContent: empilha ? "center" : "space-between", gap: empilha ? 3 : 6,
      padding: `0 10px 0 ${recuo}px` }}>
      <span style={{ font: `${quem === "ferramenta" ? `600 ${largo ? 13 : 12}px ${mono}` : `600 ${largo ? 14 : 13}px ${ui}`}`, color: cor.texto, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{texto}</span>
      {quem !== "mensagem" && <span style={{ flex: "none", font: `700 10px ${mono}`, textTransform: "uppercase", letterSpacing: ".04em", padding: "1px 6px", borderRadius: 999,
        color: quem === "modelo" ? cor.papel : cor.fraco, background: quem === "modelo" ? cor.acento : cor.linha }}>{quem}</span>}
    </div>;
  };
  const ponto = (p: Ponto, cor_: string = cor.aviso) => <div style={{ position: "absolute", left: p.x - 9, top: p.y - 9, width: 18, height: 18, borderRadius: 9, background: cor_,
    boxShadow: "0 0 0 3px var(--papel, #f6f2ea)" }} />;
  const mensagem = (texto: string, x: number, y: number, w: number) => (
    <div style={{ position: "absolute", left: x, top: y, width: w, boxSizing: "border-box", borderRadius: 10, border: `2px dashed ${cor.aviso}`, background: cor.papel, padding: "6px 10px" }}>
      <div style={{ font: `600 10px ${mono}`, color: cor.fraco }}>A MENSAGEM</div>
      <div style={{ font: `italic ${largo ? 15 : 14}px/1.3 ${ui}`, color: cor.texto }}>“{texto}”</div>
    </div>
  );

  /* o fluxo: as caixas em coluna, com as setas do código entre elas */
  const cenaFluxo = () => {
    const produto = k === 2 && t >= CENAS[2].de + 1.5;
    const modelos = k === 0 ? [] : k === 1 ? (t >= CENAS[1].de + 0.6 ? f.modelo_no_fluxo : []) : f.modelo_em_toda_caixa;
    const w = largo ? 300 : M.aw, h = largo ? 44 : 38, gap = largo ? 22 : 16;
    const x0 = M.x, y0 = largo ? 44 : 104;
    const trilho = x0 + 15;
    const centro = (i: number): Ponto => ({ x: trilho, y: y0 + i * (h + gap) + h / 2 });
    const passos = PASSOS_DO_FLUXO[k];
    const rota: [number, Ponto][] = passos.map((em, i) => [em, centro(i)]);
    const p = andar(t, rota);
    const travou = produto && t >= passos[passos.length - 1] + 0.4;
    return <>
      {f.fluxo.map((nome, i) => {
        const ferramenta = f.ferramentas.includes(nome);
        const quem = modelos.includes(i) ? "modelo" : ferramenta ? "ferramenta" : "código";
        const rotulo = modelos.includes(i) && i === 1 ? "o modelo acha o número" : modelos.includes(i) && i === 3 ? "o modelo escreve a resposta" : nome;
        return <div key={i}>
          {caixa(x0, y0 + i * (h + gap), w, h, rotulo, quem, Math.hypot(p.x - centro(i).x, p.y - centro(i).y) < 6, rotulo, false, 32)}
          {i < f.fluxo.length - 1 && <>
            <div style={{ position: "absolute", left: trilho - 1, top: y0 + i * (h + gap) + h, width: 2, height: gap, background: travou && i >= 1 ? cor.linha : cor.fraco, opacity: travou && i >= 1 ? 0.4 : 1 }} />
            <span style={{ position: "absolute", left: trilho + 8, top: y0 + i * (h + gap) + h + gap / 2 - 8, font: `600 10px ${mono}`, color: cor.fraco }}>código</span>
          </>}
        </div>;
      })}
      {mensagem(produto ? f.mensagens.produto : f.mensagens.pedido, largo ? x0 + w + 20 : x0, largo ? 44 : 40, largo ? M.aw - w - 20 : M.aw)}
      {ponto(p)}
      {travou && <div style={{ position: "absolute", left: largo ? x0 + w + 20 : x0 + 20, top: largo ? centro(2).y - 14 : y0 + f.fluxo.length * (h + gap) - 6, width: largo ? M.aw - w - 20 : M.aw - 40,
        font: `700 ${largo ? 14 : 13}px/1.3 ${ui}`, color: cor.aviso, opacity: kf(t, [[passos[passos.length - 1] + 0.4, 0], [passos[passos.length - 1] + 0.8, 1]]) }}>
        ✗ nenhum número de pedido, e nenhuma seta para produto</div>}
    </>;
  };

  /* o agente: o modelo no meio; embaixo, as ferramentas e a resposta; a mensagem vai e volta pelas setas que ele escolhe */
  const cenaAgente = () => {
    const j = k - 3, passos = PASSOS_DO_AGENTE[j];
    const ferramenta = f.ferramentas[j];
    const yMsg = 40, yDecide = largo ? 128 : 136, yBaixo = largo ? 262 : 272, hB = 54;
    const wB = (M.aw - 2 * 14) / 3;
    const decide = { x: M.x + M.aw / 2 - 100, y: yDecide, w: 200, h: 50 };
    const baixos = [...f.ferramentas, "responde ao cliente"];
    const cx = (i: number) => M.x + i * (wB + 14) + wB / 2;
    const centroDecide: Ponto = { x: M.x + M.aw / 2, y: yDecide + 25 };
    const iFerr = baixos.indexOf(ferramenta), iResp = 2;
    const naDecide: Ponto = { x: centroDecide.x, y: yDecide + 50 };
    const rota: [number, Ponto][] = [[passos[0], { x: M.x + M.aw / 2, y: yMsg + 52 }], [passos[1], naDecide], [passos[2], { x: cx(iFerr), y: yBaixo }],
      [passos[3], naDecide], [passos[4], { x: cx(iResp), y: yBaixo }]];
    const p = andar(t, rota);
    const usada = (i: number) => (i === iFerr && t >= passos[1] + 0.2) || (i === iResp && t >= passos[3] + 0.2);
    return <>
      {mensagem(j ? f.mensagens.produto : f.mensagens.pedido, M.x + M.aw / 2 - (largo ? 150 : 150), yMsg, 300)}
      <svg width={M.w} height={M.h} style={{ position: "absolute", inset: 0 }}>
        <defs><marker id={`fa-ponta-${desenho}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill={cor.acento} /></marker></defs>
        {baixos.map((_, i) => {
          const x2 = cx(i), y1 = yDecide + 50, y2 = yBaixo;
          const acesa = usada(i);
          return <g key={i}>
            <path d={`M${centroDecide.x} ${y1} C ${centroDecide.x} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2 - 4}`} fill="none" stroke={acesa ? cor.acento : cor.linha} strokeWidth={acesa ? 3 : 2}
              strokeDasharray={acesa ? "none" : "5 5"} markerEnd={acesa ? `url(#fa-ponta-${desenho})` : undefined} />
            {i < 2 && <path d={`M${x2 + 14} ${y2} C ${x2 + 14} ${(y1 + y2) / 2 + 10}, ${centroDecide.x + 30} ${y1 + 30}, ${centroDecide.x + 30} ${y1 + 2}`} fill="none"
              stroke={i === iFerr && t >= passos[2] + 0.2 ? cor.ok : "transparent"} strokeWidth={2.5} strokeDasharray="4 4" />}
          </g>;
        })}
      </svg>
      {caixa(decide.x, decide.y, decide.w, decide.h, "o modelo decide", "modelo", Math.hypot(p.x - naDecide.x, p.y - naDecide.y) < 6)}
      {baixos.map((b, i) => caixa(M.x + i * (wB + 14), yBaixo, wB, hB, b, i < 2 ? "ferramenta" : "código", Math.hypot(p.x - cx(i), p.y - yBaixo) < 6, `b${i}`, true))}
      {t >= passos[2] + 0.3 && t < passos[3] + 0.3 && <div style={{ position: "absolute", left: centroDecide.x + 40, top: yDecide + 70, font: `600 12px ${ui}`, color: cor.ok }}>o resultado volta</div>}
      <div style={{ position: "absolute", left: M.x, top: yDecide + 64, width: largo ? 150 : 140, font: `600 12px ${ui}`, color: cor.acento, opacity: kf(t, [[passos[1] + 0.2, 0], [passos[1] + 0.6, 1]]) }}>o modelo escolhe a seta</div>
      {ponto(p)}
    </>;
  };

  /* o teste: os dois lado a lado */
  const cenaTeste = () => {
    const meia = (M.aw - 14) / 2;
    const lado = (i: number) => {
      const x = M.x + i * (meia + 14);
      const nomes = i === 0 ? ["mensagem", "o modelo escreve", "fim"] : ["o modelo decide", f.ferramentas[0], f.ferramentas[1]];
      return <div key={i} style={{ opacity: kf(t, [[t0 + 0.3 + i * 0.6, 0], [t0 + 0.7 + i * 0.6, 1]]) }}>
        <div style={{ position: "absolute", left: x, top: 40, width: meia, font: `700 ${largo ? 15 : 14}px ${ui}`, color: cor.texto }}>{i ? "agente" : "fluxo"}</div>
        {nomes.map((n, j) => caixa(x, 70 + j * 66, meia, 46, n, i === 0 ? (j === 1 ? "modelo" : "código") : j === 0 ? "modelo" : "ferramenta", false, `${i}${j}`, i === 1 && j > 0))}
        {[0, 1].map((j) => <span key={j} style={{ position: "absolute", left: x + meia / 2 - 30, top: 116 + j * 66 + 2, width: 60, textAlign: "center", font: `700 11px ${mono}`, color: i ? cor.acento : cor.fraco }}>
          {i ? "↕ modelo" : "↓ código"}</span>)}
        <div style={{ position: "absolute", left: x, top: 278, width: meia, font: `700 ${largo ? 14 : 13}px/1.35 ${ui}`, color: i ? cor.acento : cor.fraco, textAlign: "center" }}>
          quem escolhe a seta: {i ? "o modelo, a cada volta" : "o código, sempre"}</div>
      </div>;
    };
    return <>{lado(0)}{lado(1)}</>;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui }}>
      <div style={{ position: "absolute", left: M.x, top: 12, width: M.aw, font: `700 13px ${mono}`, letterSpacing: ".06em", textTransform: "uppercase", color: cor.acento }}>
        {k + 1} de {CENAS.length} · {CENAS[k].nome}
      </div>
      <div style={{ opacity: opa }}>{k < 3 ? cenaFluxo() : k < 5 ? cenaAgente() : cenaTeste()}</div>
      {balao && M.balao.lado ? <svg width={M.w} height={M.h} style={{ position: "absolute", inset: 0 }}>
        <line x1={M.x + M.aw + 6} y1={alvo.y} x2={M.balao.x} y2={alvo.y} stroke={cor.acento} strokeWidth={2} strokeDasharray="5 4" opacity={opaBalao} />
      </svg> : null}
      {balao ? <Balao M={M as never} alvo={alvo} opacidade={opaBalao}>{balao.texto}</Balao> : null}
    </AbsoluteFill>
  );
};
