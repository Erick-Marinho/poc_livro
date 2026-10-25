/**
 * O desenho do ciclo de vida de um agente (docs/capacidades/ciclo-animado.md): só SVG, sem estado, montado no
 * servidor. Dois desenhos: o anel (computador) e a coluna (celular). As seis fases de ida em volta; a volta de
 * "quando dá errado" para "avaliar" por dentro, em destaque; Evoluir por fora, de Observar de volta a Construir;
 * Governar como halo em volta de tudo. Cada nó tem `data-no` com o id da fase do ciclo.json, para o mapa ligar o nó
 * ao cartão; o nó que não é decorativo mostra, com o ícone de informação, que abre o cartão da fase (num modal, no
 * MapaDoCiclo). O mesmo desenho serve ao mapa parado, à animação (CicloAnimado.tsx) e à miniatura; as cores vêm do
 * ESTILO abaixo, com as variáveis do livro e uma cor de reserva para fora dele (o Studio).
 */
import { Info } from "lucide-react";

type Fase = { id: string; nome: string; capitulos: number[]; transversal?: boolean };
export type Desenho = "anel" | "coluna";
export type Realce = "erro" | "pego";
/** `prefixo`: os ids dos marcadores das setas; cada desenho da página precisa do seu, ou as pontas somem */
/** `decorativo`: só o desenho (a miniatura do "você está aqui"), oculto para leitor de tela e sem foco nos nós */
type Props = { fases: Fase[]; desenho: Desenho; aceso?: string; realces?: Record<string, Realce>; governar?: boolean; prefixo?: string; decorativo?: boolean };

const IDA = ["planejar", "construir", "avaliar", "por-no-ar", "observar", "errado"];
export type Caixa = { x: number; y: number; w: number; h: number };
const ABRE = 15; // o ícone que diz que o nó abre o cartão
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
const EVOLUIR_COLUNA = { cx: 40, w: 132, h: 30 }; // em pé, na faixa da esquerda
const meioEvoluir = (noDaColuna(1).y + noDaColuna(4).y + COL.h) / 2;
const GOVERNAR_COLUNA: Caixa = { x: 55, y: 14, w: 250, h: 34 };
const alturaDaColuna = noDaColuna(5).y + COL.h + 40;

/** O tamanho do desenho, nas unidades do viewBox. */
export const VISTA: Record<Desenho, { w: number; h: number }> = { anel: { w: 720, h: 660 }, coluna: { w: 360, h: alturaDaColuna } };

/** Onde fica a caixa de cada fase, nas unidades do viewBox (a de Evoluir, na coluna, já em pé). */
export function caixas(desenho: Desenho): Record<string, Caixa> {
  const ida = desenho === "anel" ? IDA.map((_, i) => noDoAnel(i)) : IDA.map((_, i) => noDaColuna(i));
  return {
    ...Object.fromEntries(IDA.map((id, i) => [id, ida[i]])),
    evoluir: desenho === "anel" ? EVOLUIR_ANEL : { x: EVOLUIR_COLUNA.cx - EVOLUIR_COLUNA.h / 2, y: meioEvoluir - EVOLUIR_COLUNA.w / 2, w: EVOLUIR_COLUNA.h, h: EVOLUIR_COLUNA.w },
    governar: desenho === "anel" ? GOVERNAR_ANEL : GOVERNAR_COLUNA,
  };
}

/* ---------- as cores: as variáveis do livro, com uma reserva para fora dele ---------- */

export const ESTILO = `
.an-halo { fill: none; stroke: var(--linha, #ddd4c4); stroke-width: 1.5; stroke-dasharray: 6 6; transition: stroke .3s }
.an-halo.an-halo-aceso { stroke: var(--acento, #2a4fb5); stroke-width: 2.5 }
.an-ida { fill: none; stroke: var(--ink-2, #6b6357); stroke-width: 1.6; opacity: .75 }
.an-seta, .an-seta-evoluir { fill: var(--ink-2, #6b6357) }
.an-erro { fill: none; stroke: var(--aviso, #9a5b00); stroke-width: 3 }
.an-seta-erro { fill: var(--aviso, #9a5b00) }
.an-rotulo-erro { font: 600 13px var(--f-ui, "IBM Plex Sans", system-ui, sans-serif); fill: var(--aviso, #9a5b00) }
.an-fundo-rotulo { fill: var(--nota, #fbf8f2) }
.an-evoluir { fill: none; stroke: var(--ink-2, #6b6357); stroke-width: 1.6; stroke-dasharray: 5 4 }
.an-no { cursor: pointer; outline: none }
.an-caixa { fill: var(--papel, #f6f2ea); stroke: var(--linha, #ddd4c4); stroke-width: 1.5 }
.an-no:hover .an-caixa, .an-no:focus-visible .an-caixa { stroke: var(--acento, #2a4fb5) }
.an-no.an-aceso .an-caixa { stroke: var(--acento, #2a4fb5); stroke-width: 2.5; fill: color-mix(in srgb, var(--acento, #2a4fb5) 10%, var(--papel, #f6f2ea)) }
.an-no.an-realce-erro .an-caixa { stroke: var(--aviso, #9a5b00); stroke-width: 2.5 }
.an-no.an-realce-pego .an-caixa { stroke: var(--ok, #1f7a4c); stroke-width: 2.5 }
.an-nome { font: 600 15px var(--f-ui, "IBM Plex Sans", system-ui, sans-serif); fill: var(--ink, #24201a) }
.an-abre { color: var(--ink-2, #6b6357); pointer-events: none }
.an-no:hover .an-abre, .an-no:focus-visible .an-abre, .an-no.an-aceso .an-abre { color: var(--acento, #2a4fb5) }
.an-cap { font: 12px var(--f-mono, "JetBrains Mono", ui-monospace, monospace); fill: var(--ink-2, #6b6357) }
`;

/* ---------- as peças ---------- */

const Seta = ({ id, classe }: { id: string; classe: string }) => (
  <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M 0 0 L 10 5 L 0 10 z" className={classe} />
  </marker>
);

const No = ({ f, caixa, aceso, realce, compacto, decorativo }: { f: Fase; caixa: Caixa; aceso: boolean; realce?: Realce; compacto?: boolean; decorativo?: boolean }) => (
  <g data-no={f.id} {...(decorativo ? {} : { role: "button", tabIndex: 0, "aria-label": `${f.nome}, ${caps(f)}: ver o que o agente ganha`, "aria-pressed": aceso })}
    className={["an-no", aceso ? "an-aceso" : "", realce ? `an-realce-${realce}` : ""].filter(Boolean).join(" ")}>
    <rect x={caixa.x} y={caixa.y} width={caixa.w} height={caixa.h} rx={compacto ? caixa.h / 2 : 12} className="an-caixa" />
    {compacto ? (
      <text x={caixa.x + (caixa.w - (decorativo ? 0 : ABRE + 6)) / 2} y={caixa.y + caixa.h / 2 + 5} textAnchor="middle" className="an-nome">
        {f.nome} <tspan className="an-cap">· {caps(f)}</tspan>
      </text>
    ) : (
      <>
        <text x={caixa.x + 12} y={caixa.y + 23} className="an-nome">{f.nome}</text>
        <text x={caixa.x + 12} y={caixa.y + caixa.h - 11} className="an-cap">{caps(f)}</text>
      </>
    )}
    {/* abre o cartão: no canto de baixo, onde o nome não chega; na pílula, na ponta */}
    {decorativo ? null : <Info className="an-abre" size={ABRE} strokeWidth={2} x={caixa.x + caixa.w - ABRE - (compacto ? 12 : 8)}
      y={compacto ? caixa.y + (caixa.h - ABRE) / 2 : caixa.y + caixa.h - ABRE - 8} />}
  </g>
);

export default function Anel({ fases, desenho, aceso, realces = {}, governar: haloAceso, prefixo = desenho, decorativo }: Props) {
  const fase = (id: string) => fases.find((f) => f.id === id) ?? (() => { throw new Error(`Anel: a fase ${id} não está no ciclo.json`); })();
  const ida = IDA.map(fase);
  const evoluir = fase("evoluir"), governar = fases.find((f) => f.transversal) ?? fase("governar");
  const m = (nome: string) => `${prefixo}-${nome}`;
  const halo = haloAceso ? "an-halo an-halo-aceso" : "an-halo";
  const no = (f: Fase, caixa: Caixa, compacto?: boolean) => <No key={f.id} f={f} caixa={caixa} aceso={f.id === aceso} realce={realces[f.id]} compacto={compacto} decorativo={decorativo} />;
  const leitura = decorativo ? { "aria-hidden": true } : { role: "group" };

  if (desenho === "anel") {
    const e = noDoAnel(5), a = noDoAnel(2);
    return (
      <svg data-desenho="anel" viewBox={`0 0 ${VISTA.anel.w} ${VISTA.anel.h}`} className="an an-anel" {...leitura} aria-label={decorativo ? undefined : "O ciclo de vida de um agente, em anel"}>
        <defs>
          <Seta id={m("ida")} classe="an-seta" />
          <Seta id={m("erro")} classe="an-seta-erro" />
          <Seta id={m("evoluir")} classe="an-seta-evoluir" />
        </defs>
        {/* Governar: o halo em volta de tudo */}
        <ellipse cx={CENTRO.x} cy={CENTRO.y} rx={340} ry={300} className={halo} />
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
        {ida.map((f, i) => no(f, noDoAnel(i)))}
        {no(evoluir, EVOLUIR_ANEL)}
        {no(governar, GOVERNAR_ANEL, true)}
      </svg>
    );
  }

  return (
    <svg data-desenho="coluna" viewBox={`0 0 ${VISTA.coluna.w} ${VISTA.coluna.h}`} className="an an-coluna" {...leitura} aria-label={decorativo ? undefined : "O ciclo de vida de um agente, em coluna"}>
      <defs>
        <Seta id={m("ida")} classe="an-seta" />
        <Seta id={m("erro")} classe="an-seta-erro" />
        <Seta id={m("evoluir")} classe="an-seta-evoluir" />
      </defs>
      <rect x={6} y={GOVERNAR_COLUNA.y + GOVERNAR_COLUNA.h / 2} width={348} height={alturaDaColuna - GOVERNAR_COLUNA.h / 2 - 22} rx={22} className={halo} />
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
      {ida.map((f, i) => no(f, noDaColuna(i)))}
      <g transform={`rotate(-90 ${EVOLUIR_COLUNA.cx} ${meioEvoluir})`}>
        {no(evoluir, { x: EVOLUIR_COLUNA.cx - EVOLUIR_COLUNA.w / 2, y: meioEvoluir - EVOLUIR_COLUNA.h / 2, w: EVOLUIR_COLUNA.w, h: EVOLUIR_COLUNA.h }, true)}
      </g>
      {no(governar, GOVERNAR_COLUNA, true)}
    </svg>
  );
}
