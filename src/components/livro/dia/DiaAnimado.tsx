/**
 * A animação do dia seguinte (Remotion; docs/capacidades/capitulo-1-dinamicas.md, etapa 4), que o leitor toca ou rola
 * (palco/RolaCena.tsx): as cinco perguntas de uma tarde e as três do dia seguinte, todas com a mesma marca, "parece
 * certo"; quando o gabarito entra, as marcas viram ✓ e ✗, e aparece a nota. Os balões explicam cada momento. O que se
 * desenha sai de dia.ts.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, kf, mono, ui } from "../palco/video";
import { Balao, entre, opacidadeDoBalao, type Ponto } from "../roteiro/pecas";
import { type Alvo, baloes, type Dia, type Linha, T } from "./dia.ts";

export type Desenho = "largo" | "estreito";
/* no estreito, o vídeo encolhe menos que a letra precisa: letra e linhas maiores, e o porquê do gabarito fica de fora */
export const MEDIDAS = {
  largo: { w: 780, h: 660, x: 20, lw: 460, fonte: 16, porque: true, balao: { lado: true, x: 500, w: 264, y: 0, fonte: 18 },
    Y: { tarde: 14, linhasTarde: 44, passoTarde: 56, altTarde: 50, seguinte: 334, linhasSeguinte: 364, passoSeguinte: 70, altSeguinte: 64, nota: 584, altNota: 52 } },
  estreito: { w: 420, h: 900, x: 14, lw: 392, fonte: 18, porque: false, balao: { lado: false, x: 14, w: 392, y: 700, fonte: 18 },
    Y: { tarde: 14, linhasTarde: 46, passoTarde: 60, altTarde: 54, seguinte: 352, linhasSeguinte: 384, passoSeguinte: 80, altSeguinte: 74, nota: 630, altNota: 54 } },
} as const;

export type Props = { dia: Dia; desenho: Desenho };

export const DiaAnimado: React.FC<Props> = ({ dia, desenho }) => {
  const M = MEDIDAS[desenho], Y = M.Y;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const com = t >= T.gabarito;

  const lista = baloes(dia);
  const balao = lista.find((x) => entre(t, x.de, x.ate)) ?? null;
  const opaBalao = balao ? opacidadeDoBalao(t, balao.de, balao.ate, balao === lista[lista.length - 1]) : 0;
  const fimTarde = Y.linhasTarde + (dia.tarde.length - 1) * Y.passoTarde + Y.altTarde;
  const fimSeguinte = Y.linhasSeguinte + (dia.seguinte.length - 1) * Y.passoSeguinte + Y.altSeguinte;
  const alvoY: Record<Alvo, number> = { tarde: (Y.linhasTarde + fimTarde) / 2, seguinte: (Y.linhasSeguinte + fimSeguinte) / 2, lista: (Y.linhasTarde + fimSeguinte) / 2, nota: Y.nota + Y.altNota / 2 };
  const alvo = (a: Alvo): Ponto => ({ x: M.x + M.lw, y: alvoY[a] });

  const cabeca = (y: number, de: number, texto: string) => (
    <div style={{ position: "absolute", left: M.x, top: y, width: M.lw, display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: kf(t, [[de, 0], [de + 0.3, 1]]) }}>
      <b style={{ font: `700 ${M.fonte - 3}px ${mono}`, letterSpacing: ".06em", textTransform: "uppercase", color: cor.fraco }}>{texto}</b>
      <span style={{ font: `600 ${M.fonte - 3}px ${ui}`, color: com ? cor.ok : cor.fraco }}>{com ? "com o gabarito" : "sem gabarito"}</span>
    </div>
  );

  const linha = (l: Linha, y: number, alt: number, de: number, k: number) => {
    const marcou = t >= T.marca(k);
    const mostra = kf(t, [[de, 0], [de + 0.35, 1]]);
    const cerca = marcou ? (l.acertou ? cor.ok : cor.aviso) : cor.linha;
    return (
      <div key={l.id} style={{ position: "absolute", left: M.x, top: y + (1 - mostra) * 10, width: M.lw, height: alt, opacity: mostra, boxSizing: "border-box",
        border: `2px solid ${cerca}`, borderRadius: 12, background: cor.papel, padding: "5px 10px", display: "grid", gridTemplateColumns: "1fr auto", columnGap: 8, alignContent: "center" }}>
        <div style={{ minWidth: 0, display: "grid", gap: 1 }}>
          <div style={{ font: `italic ${M.fonte}px/1.3 ${ui}`, color: cor.texto, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            <b style={{ font: `600 ${M.fonte - 4}px ${mono}`, fontStyle: "normal", color: cor.fraco, marginRight: 6 }}>{l.id}</b>“{l.pergunta}”
          </div>
          <div style={{ font: `${M.fonte - 2}px/1.3 ${ui}`, color: cor.fraco, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            textDecoration: marcou && !l.acertou ? "line-through" : "none" }}>o agente {l.fez}</div>
          {!l.acertou && <div style={{ font: `600 ${M.fonte - 2}px/1.3 ${ui}`, color: cor.ok, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            opacity: kf(t, [[T.marca(k), 0], [T.marca(k) + 0.3, 1]]) }}>gabarito: {l.gabarito}{M.porque && l.porque ? ` (${l.porque})` : ""}</div>}
        </div>
        <span style={{ alignSelf: "center", font: `700 ${M.fonte - 2}px ${ui}`, color: marcou ? cerca : cor.fraco, whiteSpace: "nowrap" }}>
          {marcou ? (l.acertou ? "✓ certo" : "✗ errado") : "parece certo"}
        </span>
      </div>
    );
  };

  const nota = kf(t, [[T.nota, 0], [T.nota + 0.4, 1]]);
  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui }}>
      {cabeca(Y.tarde, T.tarde, "uma tarde de testes")}
      {dia.tarde.map((l, k) => linha(l, Y.linhasTarde + k * Y.passoTarde, Y.altTarde, T.linhaTarde(k), k))}
      {cabeca(Y.seguinte, T.seguinte, "o dia seguinte")}
      {dia.seguinte.map((l, k) => linha(l, Y.linhasSeguinte + k * Y.passoSeguinte, Y.altSeguinte, T.linhaSeguinte(k), dia.tarde.length + k))}

      <div style={{ position: "absolute", left: M.x, top: Y.nota, width: M.lw, height: Y.altNota, boxSizing: "border-box", borderRadius: 12, background: "#1e2127",
        color: "#e6e1d6", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", opacity: nota, font: `600 16px ${ui}` }}>
        <span>a nota, que só existe com o gabarito</span>
        <b style={{ font: `700 22px ${mono}`, color: "#e5b567" }}>{dia.certos} de {dia.total}</b>
      </div>

      {balao && M.balao.lado ? <svg width={M.w} height={M.h} style={{ position: "absolute", inset: 0 }}>
        <line x1={M.x + M.lw + 6} y1={alvo(balao.alvo).y} x2={M.balao.x} y2={alvo(balao.alvo).y} stroke={cor.acento} strokeWidth={2} strokeDasharray="5 4" opacity={opaBalao} />
      </svg> : null}
      {balao ? <Balao M={M as never} alvo={alvo(balao.alvo)} opacidade={opaBalao}>{balao.texto}</Balao> : null}
    </AbsoluteFill>
  );
};
