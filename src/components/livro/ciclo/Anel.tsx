/**
 * O desenho do ciclo de vida de um agente (docs/capacidades/ciclo-animado.md): só SVG, sem estado, montado no
 * servidor. Dois desenhos: o anel (computador) e a coluna (celular). As seis fases de ida em volta; a volta de
 * "quando dá errado" para "avaliar" por dentro, em destaque; Evoluir por fora, de Observar de volta a Construir;
 * Governar como halo em volta de tudo. Cada nó tem `data-no` com o id da fase do ciclo.json, para o mapa ligar o nó
 * ao cartão. As cores vêm das classes `an-*` (MapaDoCiclo.astro).
 */
type Fase = { id: string; nome: string; capitulos: number[]; transversal?: boolean };
type Props = { fases: Fase[]; desenho: "anel" | "coluna"; aceso?: string };

const IDA = ["planejar", "construir", "avaliar", "por-no-ar", "observar", "errado"];
type Caixa = { x: number; y: number; w: number; h: number };
const caps = (f: Fase) => `cap. ${f.capitulos.join(" e ")}`;

/* ---------- o anel ---------- */

const CENTRO = { x: 360, y: 340 };
const RAIO = 180;
const NO = { w: 148, h: 54 };
const angulo = (i: number) => ((-90 + 60 * i) * Math.PI) / 180;
const noDoAnel = (i: number): Caixa => ({
  x: CENTRO.x + RAIO * Math.cos(angulo(i)) - NO.w / 2,
  y: CENTRO.y + RAIO * Math.sin(angulo(i)) - NO.h / 2,
  ...NO,
});
const dentro = (c: Caixa, x: number, y: number, folga = 6) => x > c.x - folga && x < c.x + c.w + folga && y > c.y - folga && y < c.y + c.h + folga;
const ponto = (a: number) => ({ x: CENTRO.x + RAIO * Math.cos(a), y: CENTRO.y + RAIO * Math.sin(a) });
// o arco do anel entre duas fases vizinhas, começando e terminando fora das caixas delas
const arco = (i: number) => {
  const de = noDoAnel(i), para = noDoAnel(i + 1);
  let a0 = angulo(i), a1 = angulo(i + 1);
  while (dentro(de, ponto(a0).x, ponto(a0).y)) a0 += 0.005;
  while (dentro(para, ponto(a1).x, ponto(a1).y)) a1 -= 0.005;
  const p0 = ponto(a0), p1 = ponto(a1);
  return `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} A ${RAIO} ${RAIO} 0 0 1 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
};
const EVOLUIR_ANEL: Caixa = { x: 490, y: 536, w: 140, h: 48 };
const GOVERNAR_ANEL: Caixa = { x: 210, y: 20, w: 300, h: 40 };

/* ---------- a coluna ---------- */

const COL = { x: 80, w: 200, h: 48, y0: 74, passo: 76 };
const noDaColuna = (i: number): Caixa => ({ x: COL.x, y: COL.y0 + i * COL.passo, w: COL.w, h: COL.h });
const EVOLUIR_COLUNA = { cx: 40, cy: 0, w: 132, h: 30 }; // em pé, na faixa da esquerda
const GOVERNAR_COLUNA: Caixa = { x: 55, y: 14, w: 250, h: 34 };

/* ---------- as peças ---------- */

const Seta = ({ id, classe }: { id: string; classe: string }) => (
  <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M 0 0 L 10 5 L 0 10 z" className={classe} />
  </marker>
);

const No = ({ f, caixa, aceso, compacto }: { f: Fase; caixa: Caixa; aceso: boolean; compacto?: boolean }) => (
  <g data-no={f.id} role="button" tabIndex={0} aria-label={`${f.nome}, ${caps(f)}`} aria-pressed={aceso} className={aceso ? "an-no an-aceso" : "an-no"}>
    <rect x={caixa.x} y={caixa.y} width={caixa.w} height={caixa.h} rx={compacto ? caixa.h / 2 : 12} className="an-caixa" />
    {compacto ? (
      <text x={caixa.x + caixa.w / 2} y={caixa.y + caixa.h / 2 + 5} textAnchor="middle" className="an-nome">
        {f.nome} <tspan className="an-cap">· {caps(f)}</tspan>
      </text>
    ) : (
      <>
        <text x={caixa.x + 12} y={caixa.y + 23} className="an-nome">{f.nome}</text>
        <text x={caixa.x + 12} y={caixa.y + caixa.h - 11} className="an-cap">{caps(f)}</text>
      </>
    )}
  </g>
);

export default function Anel({ fases, desenho, aceso }: Props) {
  const fase = (id: string) => fases.find((f) => f.id === id) ?? (() => { throw new Error(`Anel: a fase ${id} não está no ciclo.json`); })();
  const ida = IDA.map(fase);
  const evoluir = fase("evoluir"), governar = fases.find((f) => f.transversal) ?? fase("governar");
  const m = (nome: string) => `${desenho}-${nome}`;

  if (desenho === "anel") {
    const e = noDoAnel(5), a = noDoAnel(2);
    return (
      <svg data-desenho="anel" viewBox="0 0 720 660" className="an an-anel" role="group" aria-label="O ciclo de vida de um agente, em anel">
        <defs>
          <Seta id={m("ida")} classe="an-seta" />
          <Seta id={m("erro")} classe="an-seta-erro" />
          <Seta id={m("evoluir")} classe="an-seta-evoluir" />
        </defs>
        {/* Governar: o halo em volta de tudo */}
        <ellipse cx={CENTRO.x} cy={CENTRO.y} rx={340} ry={300} className="an-halo" />
        {ida.slice(0, -1).map((f, i) => <path key={f.id} d={arco(i)} className="an-ida" markerEnd={`url(#${m("ida")})`} />)}
        {/* a volta do erro, por dentro do anel: a falha vira caso da régua */}
        <g data-volta="errado-avaliar">
          <line x1={e.x + e.w * 0.86} y1={e.y + e.h + 4} x2={a.x + a.w * 0.14} y2={a.y - 4} className="an-erro" markerEnd={`url(#${m("erro")})`} />
          <g transform={`translate(${CENTRO.x} ${CENTRO.y}) rotate(30)`}>
            <rect x={-104} y={-24} width={208} height={20} rx={6} className="an-fundo-rotulo" />
            <text x={0} y={-9} textAnchor="middle" className="an-rotulo-erro">a falha vira caso da régua</text>
          </g>
        </g>
        {/* Evoluir, por fora: de Observar de volta a Construir, medido pela mesma régua */}
        <g data-volta="observar-construir">
          <path d={`M 204 ${noDoAnel(4).y + NO.h + 4} C 204 560, 380 575, ${EVOLUIR_ANEL.x - 4} ${EVOLUIR_ANEL.y + EVOLUIR_ANEL.h / 2}`} className="an-evoluir" />
          <path d={`M ${EVOLUIR_ANEL.x + EVOLUIR_ANEL.w - 18} ${EVOLUIR_ANEL.y - 4} C 660 470, 650 330, ${noDoAnel(1).x + NO.w * 0.8} ${noDoAnel(1).y + NO.h + 6}`}
            className="an-evoluir" markerEnd={`url(#${m("evoluir")})`} />
        </g>
        {ida.map((f, i) => <No key={f.id} f={f} caixa={noDoAnel(i)} aceso={f.id === aceso} />)}
        <No f={evoluir} caixa={EVOLUIR_ANEL} aceso={evoluir.id === aceso} />
        <No f={governar} caixa={GOVERNAR_ANEL} aceso={governar.id === aceso} compacto />
      </svg>
    );
  }

  const ultimo = noDaColuna(5);
  const altura = ultimo.y + ultimo.h + 40;
  const meioEvoluir = (noDaColuna(1).y + noDaColuna(4).y + COL.h) / 2;
  return (
    <svg data-desenho="coluna" viewBox={`0 0 360 ${altura}`} className="an an-coluna" role="group" aria-label="O ciclo de vida de um agente, em coluna">
      <defs>
        <Seta id={m("ida")} classe="an-seta" />
        <Seta id={m("erro")} classe="an-seta-erro" />
        <Seta id={m("evoluir")} classe="an-seta-evoluir" />
      </defs>
      <rect x={6} y={GOVERNAR_COLUNA.y + GOVERNAR_COLUNA.h / 2} width={348} height={altura - GOVERNAR_COLUNA.h / 2 - 22} rx={22} className="an-halo" />
      {ida.slice(0, -1).map((f, i) => (
        <line key={f.id} x1={180} y1={noDaColuna(i).y + COL.h + 3} x2={180} y2={noDaColuna(i + 1).y - 4} className="an-ida" markerEnd={`url(#${m("ida")})`} />
      ))}
      {/* a volta do erro, pela direita */}
      <g data-volta="errado-avaliar">
        <path d={`M ${COL.x + COL.w + 3} ${noDaColuna(5).y + COL.h / 2} H 318 V ${noDaColuna(2).y + COL.h / 2} H ${COL.x + COL.w + 6}`} className="an-erro" markerEnd={`url(#${m("erro")})`} />
        <text transform={`translate(338 ${(noDaColuna(2).y + noDaColuna(5).y + COL.h) / 2}) rotate(-90)`} textAnchor="middle" className="an-rotulo-erro">a falha vira caso da régua</text>
      </g>
      {/* Evoluir, pela esquerda */}
      <g data-volta="observar-construir">
        <path d={`M ${COL.x - 3} ${noDaColuna(4).y + COL.h / 2} H ${EVOLUIR_COLUNA.cx} V ${noDaColuna(1).y + COL.h / 2} H ${COL.x - 6}`} className="an-evoluir" markerEnd={`url(#${m("evoluir")})`} />
      </g>
      {ida.map((f, i) => <No key={f.id} f={f} caixa={noDaColuna(i)} aceso={f.id === aceso} />)}
      <g transform={`rotate(-90 ${EVOLUIR_COLUNA.cx} ${meioEvoluir})`}>
        <No f={evoluir} caixa={{ x: EVOLUIR_COLUNA.cx - EVOLUIR_COLUNA.w / 2, y: meioEvoluir - EVOLUIR_COLUNA.h / 2, w: EVOLUIR_COLUNA.w, h: EVOLUIR_COLUNA.h }} aceso={evoluir.id === aceso} compacto />
      </g>
      <No f={governar} caixa={GOVERNAR_COLUNA} aceso={governar.id === aceso} compacto />
    </svg>
  );
}
