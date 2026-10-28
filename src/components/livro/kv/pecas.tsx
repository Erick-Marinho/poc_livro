/**
 * O que as duas animações do KV cache dividem (docs/capacidades/experimento-kv-cache.md, etapa 5): as medidas dos dois
 * desenhos, as caixas, o título da cena, os resumos embaixo e o balão. O mesmo desenho da figura do pausa-e-fluxo
 * (pausa/PausaAnimada.tsx).
 */
import { cor, kf, mono, ui } from "../palco/video";
import { Balao as BalaoDoRoteiro, entre, opacidadeDoBalao } from "../roteiro/pecas";
import { baloes, type Figura } from "./kv.ts";

export type Desenho = "largo" | "estreito";
export const MEDIDAS = {
  largo: { w: 780, h: 416, x: 20, aw: 460, fonte: 13, balao: { lado: true, x: 500, w: 264, y: 0, fonte: 17 } },
  estreito: { w: 420, h: 520, x: 14, aw: 392, fonte: 12, balao: { lado: false, x: 14, w: 392, y: 418, fonte: 17 } },
} as const;
export type Medidas = (typeof MEDIDAS)[Desenho];

/** a cena em que o tempo t está */
export const cenaEm = (f: Figura, t: number) => f.cenas.reduce((i, c, j) => (t >= c.de ? j : i), 0);

export const rotulo = (texto: string) => <div style={{ font: `600 10.5px ${mono}`, letterSpacing: ".05em", color: cor.fraco }}>{texto}</div>;

export const CAIXA = { y: 40, h: 96 };
export const Caixa = ({ x, w, titulo, acesa, children }: { x: number; w: number; titulo: string; acesa: boolean; children: React.ReactNode }) => (
  <div style={{ position: "absolute", left: x, top: CAIXA.y, width: w, height: CAIXA.h, boxSizing: "border-box", padding: "6px 8px", borderRadius: 12,
    border: `2px solid ${acesa ? cor.acento : cor.linha}`, background: cor.papel, overflow: "hidden" }}>
    {rotulo(titulo)}
    <div style={{ marginTop: 4 }}>{children}</div>
  </div>
);

export const seta = (x1: number, x2: number, acesa: boolean) => (
  <div style={{ position: "absolute", left: x1 + 3, top: CAIXA.y + CAIXA.h / 2 - 9, width: x2 - x1 - 6, textAlign: "center", font: `700 15px ${ui}`, color: acesa ? cor.acento : cor.linha }}>→</div>
);

export const Cabecalho = ({ M, f, k }: { M: Medidas; f: Figura; k: number }) => (
  <div style={{ position: "absolute", left: M.x, top: 12, width: M.aw, font: `700 13px ${mono}`, letterSpacing: ".06em", textTransform: "uppercase", color: cor.acento }}>
    {k + 1} de {f.cenas.length} · {f.cenas[k].nome}
  </div>
);

/** o que fica de cada cena, embaixo, uma linha por vez; na última cena, sobe e cresce */
export const Resumos = ({ M, f, k, t, topo }: { M: Medidas; f: Figura; k: number; t: number; topo: number }) => {
  const ultima = k === f.cenas.length - 1;
  return (
    <div style={{ position: "absolute", left: M.x, top: topo, width: M.aw }}>
      {f.resumos.map((r, i) => t >= f.cenas[i + 1].de ? <div key={i} style={{ font: `${M.fonte + (ultima ? 2 : 0)}px/1.7 ${ui}`, color: ultima ? cor.texto : cor.fraco,
        opacity: kf(t, [[f.cenas[i + 1].de, 0], [f.cenas[i + 1].de + 0.4, 1]]) }}><span style={{ color: cor.ok, fontWeight: 700 }}>✓</span> {r}</div> : null)}
    </div>
  );
};

/** o balão da cena, ao lado (com a linha tracejada até o que ele explica) ou embaixo, no estreito */
export const BalaoDaCena = ({ M, f, t, alvoY }: { M: Medidas; f: Figura; t: number; alvoY: number }) => {
  const lista = baloes(f);
  const balao = lista.find((b) => entre(t, b.de, b.ate)) ?? null;
  if (!balao) return null;
  const opacidade = opacidadeDoBalao(t, balao.de, balao.ate, balao === lista[lista.length - 1]);
  const alvo = { x: M.x + M.aw, y: alvoY };
  return <>
    {M.balao.lado ? <svg width={M.w} height={M.h} style={{ position: "absolute", inset: 0 }}>
      <line x1={alvo.x + 6} y1={alvo.y} x2={M.balao.x} y2={alvo.y} stroke={cor.acento} strokeWidth={2} strokeDasharray="5 4" opacity={opacidade} />
    </svg> : null}
    <BalaoDoRoteiro M={M as never} alvo={alvo} opacidade={opacidade}>{balao.texto}</BalaoDoRoteiro>
  </>;
};

export const Ilustracao = ({ M, texto, opacidade }: { M: Medidas; texto: string; opacidade: number }) => (
  <div style={{ position: "absolute", left: M.x, top: M.balao.lado ? M.h - 22 : M.balao.y - 22, width: M.aw, font: `italic 11px ${ui}`, color: cor.fraco, opacity: opacidade }}>{texto}</div>
);
