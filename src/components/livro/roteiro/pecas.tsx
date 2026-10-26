/**
 * As peças que as animações do capítulo 2 dividem (docs/capacidades/capitulo-2-em-cenas.md): as medidas dos dois
 * desenhos (o largo, com os balões ao lado; o estreito, do celular, com os balões embaixo), o caminho da mensagem, e o
 * desenho de uma caixa, de uma pílula, das setas, da mensagem andando e do balão. Cor com sentido fixo (palco/video.ts).
 */
import { cor, kf, suave, ui } from "../palco/video";

export type Desenho = "largo" | "estreito";
export type Ponto = { x: number; y: number };

export const MEDIDAS = {
  largo: { w: 780, h: 640, msg: { x: 20, y: 14, w: 450, fonte: 20 }, cartao: { x: 245, y: 80 }, inicio: { x: 245, y: 120 },
    decide: { x: 95, y: 156, w: 300, h: 76, fonte: 25, sub: 17 }, balcao: { y: 300, w: 108, h: 88, passo: 116, x0: 13, fonte: 18, sub: 13 },
    fim: { x: 245, y: 438 }, ficha: { x: 20, y: 478, w: 450, h: 124, fonte: 17, titulo: 13 }, pilula: { w: 110, h: 34, fonte: 17 },
    token: { w: 104, h: 30, fonte: 14 }, nomeSetas: 14, balao: { lado: true, x: 500, w: 264, y: 0, fonte: 18 } },
  estreito: { w: 420, h: 772, msg: { x: 14, y: 12, w: 392, fonte: 19 }, cartao: { x: 210, y: 78 }, inicio: { x: 210, y: 118 },
    decide: { x: 70, y: 152, w: 280, h: 74, fonte: 25, sub: 17 }, balcao: { y: 296, w: 96, h: 92, passo: 100, x0: 12, fonte: 17, sub: 13 },
    fim: { x: 210, y: 438 }, ficha: { x: 14, y: 474, w: 392, h: 124, fonte: 17, titulo: 13 }, pilula: { w: 100, h: 32, fonte: 17 },
    token: { w: 96, h: 30, fonte: 14 }, nomeSetas: 15, balao: { lado: false, x: 14, w: 392, y: 618, fonte: 17 } },
} satisfies Record<Desenho, unknown>;
export type Medidas = (typeof MEDIDAS)[Desenho];

/** onde as peças do grafo ficam num desenho */
export function lugares(M: Medidas) {
  const D = M.decide, B = M.balcao;
  const bx = (i: number) => B.x0 + i * B.passo;
  return { bx, meioDecide: { x: D.x + D.w / 2, y: D.y + D.h / 2 } as Ponto, meioBalcao: (i: number): Ponto => ({ x: bx(i) + B.w / 2, y: B.y + B.h / 2 }) };
}

/** onde a mensagem está: parada num ponto, ou entre dois, pelos tempos [segundo, ponto] */
export const ondeEsta = (t: number, rota: [number, Ponto][]): Ponto => {
  const i = rota.findIndex(([em]) => t < em);
  if (i === 0) return rota[0][1];
  if (i < 0) return rota[rota.length - 1][1];
  const [ea, pa] = rota[i - 1], [eb, pb] = rota[i];
  const q = kf(t, [[ea, 0], [eb, 1]], suave);
  return { x: pa.x + (pb.x - pa.x) * q, y: pa.y + (pb.y - pa.y) * q };
};
export const entre = (t: number, a: number, b: number) => t >= a && t < b;

/** as pontas das setas, uma vez por desenho */
export const Pontas = ({ desenho }: { desenho: Desenho }) => (
  <defs>
    {(["normal", "acesa"] as const).map((n) => (
      <marker key={n} id={`ponta-${desenho}-${n}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill={n === "acesa" ? cor.acento : cor.linha} />
      </marker>
    ))}
  </defs>
);

/** uma seta curva de um ponto a outro: acesa (o caminho de agora) ou apagada (os que ficaram de fora) */
export const seta = (desenho: Desenho, x1: number, y1: number, x2: number, y2: number, acesa: boolean, apagada: boolean, chave: string) => {
  const my = (y1 + y2) / 2;
  return <path key={chave} d={`M${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2 - 8}`} fill="none"
    stroke={acesa ? cor.acento : cor.linha} strokeWidth={acesa ? 3.5 : 2.5} opacity={apagada ? 0.35 : 1} markerEnd={`url(#ponta-${desenho}-${acesa ? "acesa" : "normal"})`} />;
};

export const Caixa = ({ x, y, w, h, borda, opacidade = 1, children }: { x: number; y: number; w: number; h: number; borda: string; opacidade?: number; children: React.ReactNode }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, border: `2.5px solid ${borda}`, borderRadius: 14, background: cor.papel,
    opacity: opacidade, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", boxSizing: "border-box", padding: "4px 6px" }}>{children}</div>
);

export const Pilula = ({ M, p, texto }: { M: Medidas; p: Ponto; texto: string }) => (
  <div style={{ position: "absolute", left: p.x - M.pilula.w / 2, top: p.y - M.pilula.h / 2, width: M.pilula.w, height: M.pilula.h, borderRadius: M.pilula.h / 2,
    border: `2px solid ${cor.linha}`, background: cor.papel, display: "flex", alignItems: "center", justifyContent: "center", font: `600 ${M.pilula.fonte}px ${ui}`, color: cor.fraco }}>{texto}</div>
);

export const Mensagem = ({ M, p, opacidade }: { M: Medidas; p: Ponto; opacidade: number }) => (
  <div style={{ position: "absolute", left: p.x - M.token.w / 2, top: p.y - M.token.h / 2, width: M.token.w, height: M.token.h, borderRadius: M.token.h / 2,
    background: cor.acento, opacity: opacidade, display: "flex", alignItems: "center", justifyContent: "center", font: `700 ${M.token.fonte}px ${ui}`, color: cor.papel }}>mensagem</div>
);

/** o balão: ao lado, na altura do que aponta (largo), ou embaixo, com a ponta para cima (estreito) */
export const Balao = ({ M, alvo, opacidade, children }: { M: Medidas; alvo: Ponto; opacidade: number; children: React.ReactNode }) => {
  /* ao lado: centrado na altura do que aponta; se o alvo está embaixo, o balão cresce para cima, para não passar do vídeo */
  const embaixo = M.balao.lado && alvo.y > M.h * 0.55;
  const lugar = !M.balao.lado ? { top: M.balao.y } : embaixo ? { bottom: Math.max(M.h - alvo.y - 34, 10) } : { top: Math.min(Math.max(alvo.y, 80), M.h - 80), transform: "translateY(-50%)" };
  const ponta = !M.balao.lado ? { left: Math.min(Math.max(alvo.x - M.balao.x - 40, 18), M.balao.w - 34), top: -9 }
    : embaixo ? { left: -9, bottom: Math.max(M.h - alvo.y - 34, 10) === 10 ? alvo.y - (M.h - 10) + 26 : 26 } : { left: -9, top: "50%", marginTop: -8 };
  return (
    <div style={{ position: "absolute", left: M.balao.x, ...lugar, width: M.balao.w,
      opacity: opacidade, boxSizing: "border-box", padding: "12px 16px", borderRadius: 14, background: cor.papel, border: `2px solid ${cor.acento}`,
      boxShadow: "0 6px 18px rgba(0,0,0,.08)", font: `${M.balao.fonte}px/1.42 ${ui}`, color: cor.texto }}>
      <span style={{ position: "absolute", ...ponta, width: 16, height: 16, background: cor.papel, borderLeft: `2px solid ${cor.acento}`, borderTop: `2px solid ${cor.acento}`,
        transform: M.balao.lado ? "rotate(-45deg)" : "rotate(45deg)" }} />
      {children}
    </div>
  );
};

/** a opacidade de um balão no seu trecho: entra e sai em 0,3 s; o último fica */
export const opacidadeDoBalao = (t: number, de: number, ate: number, ultimo: boolean) =>
  kf(t, ultimo ? [[de, 0], [de + 0.3, 1]] : [[de, 0], [de + 0.3, 1], [ate - 0.3, 1], [ate, 0]]);
