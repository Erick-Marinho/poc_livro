/**
 * O vídeo da nota (Remotion; docs/capacidades/a-nota-na-introducao.md, etapa 2), que o leitor toca ou rola
 * (palco/RolaCena.tsx): as mensagens viram cartões de uma prova; cada cartão ganha a resposta certa; o agente faz a
 * prova e os cartões viram ✓ e ✗, com o contador da nota; a nota de cada capítulo vira um gráfico, com uma queda; e o
 * gráfico vai para o botão nota do topo. Os balões explicam cada cena. O que se desenha sai de nota.ts.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, kf, mono, suave, ui } from "../palco/video";
import { Balao, entre, opacidadeDoBalao, type Ponto } from "../roteiro/pecas";
import { type Alvo, baloes, type Nota, T, titulo } from "./nota.ts";

export type Desenho = "largo" | "estreito";
export const MEDIDAS = {
  largo: { w: 780, h: 400, x: 20, aw: 460, topo: 52, cw: 84, ch: 58, gap: 10, balao: { lado: true, x: 500, w: 264, y: 0, fonte: 17 } },
  estreito: { w: 420, h: 540, x: 14, aw: 392, topo: 52, cw: 72, ch: 58, gap: 8, balao: { lado: false, x: 14, w: 392, y: 396, fonte: 17 } },
} as const;

export type Props = { nota: Nota; desenho: Desenho };

export const NotaAnimada: React.FC<Props> = ({ nota: n, desenho }) => {
  const M = MEDIDAS[desenho];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const linhas = Math.ceil(n.total / 5);
  const fimGrade = M.topo + linhas * M.ch + (linhas - 1) * M.gap;
  const conta = { y: fimGrade + 18, h: 46 };
  const grafico = { y: M.topo + 20, h: fimGrade - M.topo + 10 };
  const barraTopo = { y: M.topo + 4, h: 46 };
  const pilula = { w: 104, h: 32, x: M.x + M.aw - 104 - 10, y: barraTopo.y + 7 };

  /* a grade e o contador saem quando entra o gráfico; o gráfico sai quando entra o placar */
  const opaGrade = kf(t, [[T.grafico, 1], [T.grafico + 0.5, 0]]);
  const opaGrafico = kf(t, [[T.grafico + 0.4, 0], [T.grafico + 0.8, 1], [T.placar, 1], [T.placar + 0.5, 0]]);
  const opaPlacar = kf(t, [[T.placar + 0.4, 0], [T.placar + 0.8, 1]]);
  const acertosAgora = n.acertou.filter((a, k) => a && t >= T.corrige(k)).length;

  const lista = baloes(n);
  const balao = lista.find((x) => entre(t, x.de, x.ate)) ?? null;
  const opaBalao = balao ? opacidadeDoBalao(t, balao.de, balao.ate, balao === lista[lista.length - 1]) : 0;
  const alvo = (a: Alvo): Ponto => a === "prova" ? { x: M.x + M.aw, y: (M.topo + fimGrade) / 2 } : a === "conta" ? { x: M.x + M.aw, y: conta.y + conta.h / 2 }
    : a === "grafico" ? { x: M.x + M.aw, y: grafico.y + grafico.h / 2 } : { x: M.x + M.aw, y: pilula.y + pilula.h / 2 };

  const cartao = (k: number) => {
    const col = k % 5, lin = Math.floor(k / 5);
    const x = M.x + col * (M.cw + M.gap), y = M.topo + lin * (M.ch + M.gap);
    const entra = kf(t, [[T.cartao(k), 0], [T.cartao(k) + 0.3, 1]], suave);
    const certa = kf(t, [[T.certa(k), 0], [T.certa(k) + 0.3, 1]]);
    const corrigido = t >= T.corrige(k);
    const agora = entre(t, T.corrige(k) - 0.25, T.corrige(k) + 0.1);
    const borda = agora ? cor.acento : corrigido ? (n.acertou[k] ? cor.ok : cor.aviso) : cor.linha;
    return (
      <div key={k} style={{ position: "absolute", left: x, top: y + (1 - entra) * 12, width: M.cw, height: M.ch, opacity: entra * opaGrade, boxSizing: "border-box",
        border: `2px solid ${borda}`, borderRadius: 10, background: cor.papel, padding: "5px 7px", display: "flex", flexDirection: "column", justifyContent: "space-between",
        transform: agora ? "scale(1.06)" : "none" }}>
        <span style={{ font: `600 13px ${mono}`, color: cor.fraco }}>✉ {k + 1}</span>
        <span style={{ alignSelf: "flex-start", opacity: certa, font: `700 11px ${ui}`, color: cor.ok, background: "color-mix(in srgb, var(--ok, #1f7a4c) 14%, transparent)",
          borderRadius: 6, padding: "1px 6px" }}>certa</span>
        {corrigido && <span style={{ position: "absolute", top: -9, right: -9, width: 22, height: 22, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center",
          background: n.acertou[k] ? cor.ok : cor.aviso, color: cor.papel, font: `700 13px ${ui}` }}>{n.acertou[k] ? "✓" : "✗"}</span>}
      </div>
    );
  };

  /* o gráfico: uma barra por capítulo; as primeiras sobem (a quarta cai), as outras ainda são "?" */
  const nb = n.capitulos.length, gapB = 8, bw = (M.aw - 30 - (nb - 1) * gapB) / nb;
  const base = grafico.y + grafico.h - 26, alturaMax = grafico.h - 70;
  const barra = (k: number) => {
    const x = M.x + 30 + k * (bw + gapB);
    const tem = k < n.barras.length;
    const cresce = tem ? kf(t, [[T.barra(k), 0], [T.barra(k) + 0.5, 1]], suave) : kf(t, [[T.futuro + (k - n.barras.length) * 0.15, 0], [T.futuro + (k - n.barras.length) * 0.15 + 0.3, 1]]);
    const h = tem ? n.barras[k] * alturaMax * cresce : alturaMax * 0.5;
    const caiu = tem && k > 0 && n.barras[k] < n.barras[k - 1];
    return (
      <div key={k}>
        <div style={{ position: "absolute", left: x, top: base - h, width: bw, height: h, borderRadius: "6px 6px 0 0", boxSizing: "border-box",
          background: tem ? (caiu ? cor.aviso : cor.acento) : "transparent", border: tem ? "none" : `2px dashed ${cor.linha}`, opacity: tem ? 1 : cresce,
          display: "flex", alignItems: "center", justifyContent: "center", font: `700 16px ${ui}`, color: cor.fraco }}>{tem ? "" : "?"}</div>
        <span style={{ position: "absolute", left: x, top: base + 6, width: bw, textAlign: "center", font: `600 12px ${mono}`, color: cor.fraco }}>{n.capitulos[k]}</span>
        {caiu && <span style={{ position: "absolute", left: x - 20, top: base - h - 28, width: bw + 40, textAlign: "center", font: `700 13px ${ui}`, color: cor.aviso,
          opacity: kf(t, [[T.piorou, 0], [T.piorou + 0.3, 1]]) }}>piorou ↓</span>}
      </div>
    );
  };

  /* o placar: a barra do topo de um capítulo, com o botão nota, que abre o painel */
  const pulsa = entre(t, T.pulsa, T.clique) ? 1 + 0.06 * Math.sin((t - T.pulsa) * Math.PI * 3) : 1;
  const clique = kf(t, [[T.clique, 0], [T.clique + 0.15, 1], [T.clique + 0.5, 0]]);
  const painel = kf(t, [[T.painel, 0], [T.painel + 0.35, 1]], suave);
  const painelW = Math.min(300, M.aw - 20);

  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui }}>
      <div style={{ position: "absolute", left: M.x, top: 14, width: M.aw, font: `700 13px ${mono}`, letterSpacing: ".06em", textTransform: "uppercase", color: cor.acento }}>{titulo(t, n)}</div>

      {Array.from({ length: n.total }, (_, k) => cartao(k))}

      <div style={{ position: "absolute", left: M.x, top: conta.y, width: M.aw, height: conta.h, boxSizing: "border-box", borderRadius: 12, background: "#1e2127", color: "#e6e1d6",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", opacity: kf(t, [[T.correcao, 0], [T.correcao + 0.3, 1]]) * opaGrade, font: `600 15px ${ui}` }}>
        <span>a nota: os acertos</span>
        <b style={{ font: `700 22px ${mono}`, color: "#e5b567" }}>{acertosAgora} de {n.total}</b>
      </div>

      <div style={{ opacity: opaGrafico }}>
        <span style={{ position: "absolute", left: M.x, top: grafico.y, font: `600 12px ${ui}`, color: cor.fraco }}>nota</span>
        <div style={{ position: "absolute", left: M.x + 24, top: base, width: M.aw - 24, height: 2, background: cor.linha }} />
        <span style={{ position: "absolute", left: M.x, top: base + 24, width: M.aw, textAlign: "center", font: `600 12px ${ui}`, color: cor.fraco }}>capítulo</span>
        {n.capitulos.map((_, k) => barra(k))}
      </div>

      <div style={{ opacity: opaPlacar }}>
        <div style={{ position: "absolute", left: M.x, top: barraTopo.y, width: M.aw, height: barraTopo.h, boxSizing: "border-box", borderRadius: 12, border: `1.5px solid ${cor.linha}`,
          background: cor.papel, display: "flex", alignItems: "center", padding: "0 14px", font: `600 14px ${ui}`, color: cor.texto }}>
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: M.aw - pilula.w - 50 }}>O ciclo de vida de um agente</span>
        </div>
        <div style={{ position: "absolute", left: pilula.x, top: pilula.y, width: pilula.w, height: pilula.h, borderRadius: pilula.h / 2, boxSizing: "border-box",
          border: `1.5px solid ${entre(t, T.pulsa, T.painel + 3) ? cor.acento : cor.linha}`, background: cor.nota, transform: `scale(${pulsa})`,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6, font: `600 14px ${ui}`, color: cor.texto }}>
          <span style={{ color: cor.ok }}>◎</span> nota <b style={{ color: cor.ok }}>?</b>
        </div>
        <div style={{ position: "absolute", left: pilula.x + pilula.w / 2 - 20, top: pilula.y + pilula.h / 2 - 20, width: 40, height: 40, borderRadius: 20,
          border: `3px solid ${cor.acento}`, opacity: clique, transform: `scale(${0.6 + clique * 0.6})` }} />
        <div style={{ position: "absolute", left: M.x + M.aw - painelW, top: barraTopo.y + barraTopo.h + 10 + (1 - painel) * -8, width: painelW, opacity: painel, boxSizing: "border-box",
          borderRadius: 12, border: `1.5px solid ${cor.linha}`, background: cor.papel, boxShadow: "0 8px 22px rgba(0,0,0,.10)", padding: "12px 14px", display: "grid", gap: 8 }}>
          <b style={{ font: `700 12px ${mono}`, letterSpacing: ".06em", textTransform: "uppercase", color: cor.ok }}>o placar do agente</b>
          {n.capitulos.slice(0, 3).map((c, k) => (
            <div key={c} style={{ display: "grid", gridTemplateColumns: "48px 1fr 22px", alignItems: "center", gap: 8, font: `600 13px ${ui}`, color: cor.fraco }}>
              <span>cap. {c}</span>
              <div style={{ height: 10, borderRadius: 5, background: cor.linha, overflow: "hidden" }}>
                {k < 2 && <div style={{ width: `${n.barras[k] * 100 * 1.4}%`, height: "100%", background: cor.acento }} />}
              </div>
              <b style={{ color: k < 2 ? cor.acento : cor.fraco, textAlign: "center" }}>{k < 2 ? "✓" : "?"}</b>
            </div>
          ))}
        </div>
      </div>

      {balao && M.balao.lado ? <svg width={M.w} height={M.h} style={{ position: "absolute", inset: 0 }}>
        <line x1={M.x + M.aw + 6} y1={alvo(balao.alvo).y} x2={M.balao.x} y2={alvo(balao.alvo).y} stroke={cor.acento} strokeWidth={2} strokeDasharray="5 4" opacity={opaBalao} />
      </svg> : null}
      {balao ? <Balao M={M as never} alvo={alvo(balao.alvo)} opacidade={opaBalao}>{balao.texto}</Balao> : null}
    </AbsoluteFill>
  );
};
