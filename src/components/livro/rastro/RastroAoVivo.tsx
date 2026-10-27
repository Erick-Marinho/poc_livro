/**
 * Figura 1.1: o caminho de uma pergunta em três jeitos de montar o sistema (só o modelo, fluxo, agente).
 * O que importa é quem decide o próximo passo: o grafo mostra quem age, e o selo "decide" mostra quem escolheu.
 * Os passos chegam conferidos pelo Rastro.astro; aqui o leitor avança no próprio ritmo.
 */
import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Background, BackgroundVariant, Handle, Position, ReactFlow, ReactFlowProvider, useReactFlow } from "@xyflow/react";
import type { Edge, EdgeProps, Node, NodeProps } from "@xyflow/react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import "@xyflow/react/dist/base.css";
import { Abas, Controles, Conversa, IC, Icone, LinhaDoTempo } from "../palco/Palco";
import type { Mensagem } from "../palco/Palco";
import { lerDireto, useDireto } from "../palco/direto";
import "./rastro.css";

export type Quem = "cliente" | "codigo" | "modelo" | "ferramenta" | "resposta";
export type PassoRastro = { quem: Quem; texto: string; decide?: boolean; erro?: string; certo?: boolean; duracao: number };
export type Modo = { id: string; nome: string; quem_decide: string; cor: string; passos: Record<string, PassoRastro[]> };
export type DadosRastro = { perguntas: { id: string; texto: string; curta: string }[]; modos: Modo[] };

/* ---------- desenho: caixas e arestas em coordenadas do React Flow ---------- */

type Caixa = { x: number; y: number; w: number; h: number };
type Desenho = { largura: number; altura: number; caixas: Record<Quem, Caixa>; arestas: Record<string, [number, number][]> };
export const ARESTAS_RASTRO = ["cliente-modelo", "cliente-codigo", "codigo-ferramenta", "ferramenta-modelo", "modelo-ferramenta", "modelo-resposta", "codigo-resposta"];
const PAISAGEM: Desenho = {
  largura: 600, altura: 330,
  caixas: {
    cliente: { x: 0, y: 137, w: 130, h: 56 }, codigo: { x: 200, y: 0, w: 170, h: 56 }, modelo: { x: 200, y: 137, w: 170, h: 56 },
    ferramenta: { x: 420, y: 112, w: 180, h: 106 }, resposta: { x: 200, y: 274, w: 170, h: 56 },
  },
  arestas: {
    "cliente-modelo": [[130, 165], [200, 165]], "cliente-codigo": [[130, 150], [200, 40]],
    "codigo-ferramenta": [[370, 40], [470, 112]], "ferramenta-modelo": [[420, 182], [370, 182]], "modelo-ferramenta": [[370, 150], [420, 150]],
    "modelo-resposta": [[285, 193], [285, 274]], "codigo-resposta": [[370, 46], [400, 46], [400, 296], [370, 296]],
  },
};
const RETRATO: Desenho = {
  largura: 340, altura: 382,
  caixas: {
    cliente: { x: 95, y: 0, w: 150, h: 50 }, codigo: { x: 0, y: 92, w: 150, h: 52 }, ferramenta: { x: 190, y: 80, w: 150, h: 100 },
    modelo: { x: 95, y: 216, w: 150, h: 52 }, resposta: { x: 95, y: 330, w: 150, h: 52 },
  },
  arestas: {
    "cliente-modelo": [[170, 50], [170, 216]], "cliente-codigo": [[130, 50], [100, 92]],
    "codigo-ferramenta": [[150, 118], [190, 118]], "modelo-ferramenta": [[200, 216], [225, 180]], "ferramenta-modelo": [[275, 180], [245, 226]],
    "modelo-resposta": [[170, 268], [170, 330]], "codigo-resposta": [[40, 144], [40, 356], [95, 356]],
  },
};
const DesenhoCtx = createContext<Desenho>(PAISAGEM);

/* ---------- estado: (modo, pergunta, passo, tempo no passo) ---------- */

type Estado = { modo: number; perg: number; passo: number; t: number; tocando: boolean };
type Relogio = { get: () => Estado; assinar: (f: () => void) => () => void; definir: (s: Partial<Estado>) => void; dados: DadosRastro };
const caminho = (d: DadosRastro, s: Estado) => d.modos[s.modo].passos[d.perguntas[s.perg].id];
function criarRelogio(dados: DadosRastro, modo: number): Relogio {
  const ultimo = dados.modos[modo].passos[dados.perguntas[0].id].length - 1;
  let estado: Estado = { modo, perg: 0, passo: ultimo, t: 0, tocando: false };
  const ouvintes = new Set<() => void>();
  return { dados, get: () => estado, assinar: (f) => { ouvintes.add(f); return () => { ouvintes.delete(f); }; },
    definir: (s) => { estado = { ...estado, ...s }; ouvintes.forEach((f) => f()); } };
}
const Ctx = createContext<Relogio | null>(null);
/* cada nó e cada aresta assina só o que muda nele: o seletor devolve valores simples ou referências dos dados */
function useRastro<T>(ler: (s: Estado, passos: PassoRastro[], modo: Modo) => T): T {
  const r = useContext(Ctx)!;
  const pegar = () => { const s = r.get(); return ler(s, caminho(r.dados, s), r.dados.modos[s.modo]); };
  return useSyncExternalStore(r.assinar, pegar, pegar);
}

type EstadoNo = "fora" | "espera" | "ativo" | "feito";
function estadoNo(passos: PassoRastro[], quem: Quem, passo: number): EstadoNo {
  const i = passos.findIndex((p) => p.quem === quem);
  if (i < 0) return "fora";
  if (passos[passo].quem === quem) return "ativo";
  return passo > i ? "feito" : "espera";
}
/** -1: ainda não; 0 a 1: a bolinha anda; 2: já passou. A aresta é usada no passo em que se chega ao nó de destino. */
function estadoAresta(passos: PassoRastro[], id: string, s: Estado): number {
  const i = passos.findIndex((p, k) => k > 0 && `${passos[k - 1].quem}-${p.quem}` === id);
  if (i < 0 || s.passo < i) return -1;
  if (s.passo > i) return 2;
  if (!s.tocando && s.t === 0) return 1;
  return Math.min(s.t / (passos[i].duracao * 0.6), 1);
}

/* ---------- nós ---------- */

const NOMES: Record<Quem, [string, string]> = {
  cliente: ["cliente", IC.pessoa], codigo: ["seu código", IC.codigo], modelo: ["modelo", IC.modelo], ferramenta: ["ferramenta", IC.ferramenta], resposta: ["resposta", IC.resposta],
};
function Pontas() {
  return <><Handle type="target" id="t" position={Position.Left} isConnectable={false} /><Handle type="source" id="s" position={Position.Right} isConnectable={false} /></>;
}
function NoSimples({ id }: NodeProps) {
  const quem = id as Quem;
  const e = useRastro((s, p) => estadoNo(p, quem, s.passo));
  const decide = useRastro((s, p) => p[s.passo].quem === quem && !!p[s.passo].decide);
  const [nome, d] = NOMES[quem];
  return <div className={`rs-no rs-${e}`}><Pontas />
    <span className="rs-ic"><Icone d={d} /></span><b>{nome}</b>
    <AnimatePresence>{decide && <motion.span key="d" className="rs-decide" initial={{ opacity: 0, y: 4, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}>decide</motion.span>}</AnimatePresence>
  </div>;
}
function NoFerramenta() {
  const e = useRastro((s, p) => estadoNo(p, "ferramenta", s.passo));
  const texto = useRastro((_, p) => p.find((x) => x.quem === "ferramenta")?.texto ?? "");
  const [chamada, volta] = texto.split(" → ");
  const nome = chamada ? chamada.split("(")[0] : "ferramenta";
  return <div className={`rs-no rs-${e} rs-ferramenta`}><Pontas />
    {/* o nome da função só quebra no sublinhado */}
    <div className="rs-topo"><span className="rs-ic"><Icone d={IC.ferramenta} /></span><b>{nome.split("_").flatMap((p, i) => (i ? [<wbr key={i} />, `_${p}`] : [p]))}</b></div>
    {(e === "ativo" || e === "feito") && volta && <motion.small initial={{ opacity: 0 }} animate={{ opacity: 1 }}>→ {volta}</motion.small>}
  </div>;
}
function NoResposta() {
  const e = useRastro((s, p) => estadoNo(p, "resposta", s.passo));
  const fim = useRastro((_, p) => p[p.length - 1]);
  const chegou = e === "ativo" || e === "feito";
  return <div className={`rs-no rs-${e} rs-resposta${chegou ? (fim.certo ? " cor-verde rs-certo" : " cor-ambar rs-erro") : ""}`}><Pontas />
    <span className="rs-ic"><Icone d={chegou ? (fim.certo ? IC.certo : IC.errado) : IC.resposta} /></span>
    <b>{chegou ? (fim.certo ? "certa" : "errada") : "resposta"}</b>
  </div>;
}
const TIPOS_NO = { simples: NoSimples, ferramenta: NoFerramenta, resposta: NoResposta };

/* ---------- arestas: polilinha, com a bolinha andando pelo comprimento ---------- */

function ArestaRastro({ id }: EdgeProps) {
  const d = useContext(DesenhoCtx);
  const progresso = useRastro((s, p) => estadoAresta(p, id, s));
  const pts = d.arestas[id];
  const segs = pts.slice(1).map((b, i) => { const a = pts[i]; return { a, b, len: Math.hypot(b[0] - a[0], b[1] - a[1]) }; });
  const total = segs.reduce((n, s) => n + s.len, 0) - 7;
  const ponto = (dist: number): [number, number] => {
    for (const s of segs) { if (dist <= s.len) { const k = dist / s.len; return [s.a[0] + (s.b[0] - s.a[0]) * k, s.a[1] + (s.b[1] - s.a[1]) * k]; } dist -= s.len; }
    const u = segs[segs.length - 1]; return u.b;
  };
  const [fx, fy] = ponto(total), [tx, ty] = pts[pts.length - 1];
  const len = Math.hypot(tx - fx, ty - fy) || 1, ux = (tx - fx) / len, uy = (ty - fy) / len;
  const seta = `M ${tx} ${ty} L ${fx - uy * 4.5} ${fy + ux * 4.5} L ${fx + uy * 4.5} ${fy - ux * 4.5} Z`;
  const linha = (ate: number) => { let out = `M ${pts[0][0]} ${pts[0][1]}`, resto = ate;
    for (const s of segs) { if (resto <= s.len) { const [x, y] = ponto(ate); return out + ` L ${x} ${y}`; } out += ` L ${s.b[0]} ${s.b[1]}`; resto -= s.len; } return out; };
  const cheio = progresso === 2 ? 1 : Math.max(progresso, 0);
  const [px, py] = ponto(total * cheio);
  const classe = progresso === -1 ? "espera" : progresso === 2 ? "feito" : "ativo";
  return <g className={`rs-aresta rs-a-${classe}`}>
    <path className="rs-trilho" d={linha(total)} />
    {progresso >= 0 && <path className="rs-cheio" d={linha(total * cheio)} />}
    <path className="rs-seta" d={seta} />
    {classe === "ativo" && <circle className="rs-bolinha" cx={px} cy={py} r={5} />}
  </g>;
}
const TIPOS_ARESTA = { rastro: ArestaRastro };

function montar(passos: PassoRastro[], d: Desenho) {
  const nodes: Node[] = (Object.keys(d.caixas) as Quem[]).map((q) => {
    const c = d.caixas[q];
    return { id: q, type: q === "ferramenta" ? "ferramenta" : q === "resposta" ? "resposta" : "simples", position: { x: c.x, y: c.y }, width: c.w, height: c.h, data: {},
      handles: [{ id: "t", type: "target" as const, position: Position.Left, x: 0, y: c.h / 2, width: 1, height: 1 }, { id: "s", type: "source" as const, position: Position.Right, x: c.w, y: c.h / 2, width: 1, height: 1 }],
      draggable: false, selectable: false };
  });
  const usadas = new Set(passos.slice(1).map((p, i) => `${passos[i].quem}-${p.quem}`));
  const edges: Edge[] = ARESTAS_RASTRO.filter((a) => usadas.has(a)).map((a) => {
    const [source, target] = a.split("-");
    return { id: a, source, target, sourceHandle: "s", targetHandle: "t", type: "rastro", selectable: false, focusable: false };
  });
  return { nodes, edges };
}

function Grafo() {
  const r = useContext(Ctx)!;
  const d = useContext(DesenhoCtx);
  const chave = useRastro((s) => `${s.modo}/${s.perg}`);
  const { nodes, edges } = useMemo(() => montar(caminho(r.dados, r.get()), d), [chave, d, r]);
  const rf = useReactFlow();
  const [caixa, setCaixa] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!caixa) return;
    const enquadrar = () => {
      const { width: W, height: H } = caixa.getBoundingClientRect();
      if (!W || !H) return;
      const zoom = Math.min(W / (d.largura * 1.1), H / (d.altura * 1.16));
      rf.setViewport({ x: (W - d.largura * zoom) / 2, y: (H - d.altura * zoom) / 2 + 10, zoom }, { duration: 0 });
    };
    enquadrar();
    if (!("ResizeObserver" in window)) return;
    const ro = new ResizeObserver(enquadrar); ro.observe(caixa);
    return () => ro.disconnect();
  }, [caixa, rf, d]);
  const servidor = typeof window === "undefined";
  return <div className="rs-grafo" ref={setCaixa} style={{ aspectRatio: `${d.largura} / ${d.altura * 1.16}` }}>
    <ReactFlow nodes={nodes} edges={edges} nodeTypes={TIPOS_NO} edgeTypes={TIPOS_ARESTA} colorMode="dark"
      fitView fitViewOptions={{ padding: 0.06 }} width={servidor ? 559 : undefined} height={servidor ? Math.round(559 * d.altura * 1.16 / d.largura) : undefined}
      nodesDraggable={false} nodesConnectable={false} elementsSelectable={false} nodesFocusable={false} edgesFocusable={false}
      panOnDrag={false} panOnScroll={false} zoomOnScroll={false} zoomOnPinch={false} zoomOnDoubleClick={false}
      preventScrolling={false} disableKeyboardA11y minZoom={0.3} maxZoom={2}>
      <Background variant={BackgroundVariant.Dots} gap={18} size={1.2} color="var(--palco-pontos)" />
    </ReactFlow>
  </div>;
}

/* ---------- a conversa e a narração ---------- */

function ConversaDoRastro({ loja }: { loja: string }) {
  const r = useContext(Ctx)!;
  const pergunta = useRastro((s) => r.dados.perguntas[s.perg]);
  const chave = useRastro((s) => `${s.modo}/${s.perg}`);
  const passo = useRastro((s) => s.passo);
  const passos = useRastro((_, p) => p);
  const fim = passos[passos.length - 1];
  const respondeu = passo === passos.length - 1;
  const mensagens: Mensagem[] = [
    { chave: `${chave}-p`, tipo: "cliente", autor: "cliente", texto: pergunta.texto },
    ...(passo >= 1 && !respondeu ? [{ chave: `${chave}-d`, tipo: "digitando" as const }] : []),
    ...(respondeu ? [{ chave: `${chave}-r`, tipo: "agente" as const, autor: "atendimento", texto: fim.texto, cor: fim.certo ? "verde" : "ambar",
      nota: <span className="palco-veredito"><Icone d={fim.certo ? IC.certo : IC.errado} tam={14} />{fim.certo ? "veio dos dados da loja" : fim.erro}</span> }] : []),
  ];
  return <Conversa mensagens={mensagens} loja={loja} />;
}

const ROTULO: Record<Quem, string> = { cliente: "cliente", codigo: "seu código", modelo: "modelo", ferramenta: "ferramenta", resposta: "resposta" };
function Linha({ ir }: { ir: (i: number) => void }) {
  const passos = useRastro((_, p) => p);
  const passo = useRastro((s) => s.passo);
  const fracao = useRastro((s, p) => Math.min(s.t / p[s.passo].duracao, 1));
  const p = passos[passo];
  return <LinhaDoTempo passos={passos} passo={passo} fracao={fracao} ir={ir}
    narracao={<><b className={`rs-quem rs-q-${p.quem}`}>{ROTULO[p.quem]}</b>{p.decide && <i className="rs-decide-mini">decide</i>} {p.texto}</>} />;
}

/* ---------- a figura ---------- */

export default function RastroAoVivo({ dados, inicio = 0, loja }: { dados: DadosRastro; inicio?: number; loja: string }) {
  const r = useMemo(() => criarRelogio(dados, inicio), [dados, inicio]);
  const s = useSyncExternalStore(r.assinar, r.get, r.get);
  /* o servidor desenha o primeiro caminho já terminado: é o que fica para quem lê sem JS */
  const semente = useMemo(() => montar(caminho(dados, r.get()), PAISAGEM), [dados, r]);
  const [anuncio, setAnuncio] = useState("");
  const [desenho, setDesenho] = useState<Desenho>(PAISAGEM);
  /* ao hidratar, volta ao primeiro passo: quem lê avança no próprio ritmo */
  useEffect(() => { if (!lerDireto()) r.definir({ passo: 0, t: 0, tocando: false }); }, [r]);
  /* modo direto: cada caminho aparece inteiro */
  const direto = useDireto();
  const fimDe = (modo: number, perg: number) => caminho(dados, { ...r.get(), modo, perg }).length - 1;
  useEffect(() => { if (direto) { const s0 = r.get(); r.definir({ passo: fimDe(s0.modo, s0.perg), t: 0, tocando: false }); } }, [direto, r]);
  useEffect(() => {
    const mq = matchMedia("(max-width: 639px)");
    const ver = () => setDesenho(mq.matches ? RETRATO : PAISAGEM);
    ver(); mq.addEventListener("change", ver);
    return () => mq.removeEventListener("change", ver);
  }, []);
  const passos = caminho(dados, s), ultimo = passos.length - 1;
  useEffect(() => {
    if (!s.tocando) return;
    let antes = performance.now(), quadro = 0;
    const andar = (agora: number) => {
      const atual = r.get(), ps = caminho(dados, atual);
      let { passo, t } = atual; t += agora - antes; antes = agora;
      while (t >= ps[passo].duracao && passo < ps.length - 1) { t -= ps[passo].duracao; passo++; }
      const acabou = passo === ps.length - 1 && t >= ps[passo].duracao;
      r.definir({ passo, t: acabou ? ps[passo].duracao : t, tocando: !acabou });
      if (!acabou) quadro = requestAnimationFrame(andar);
    };
    quadro = requestAnimationFrame(andar);
    return () => cancelAnimationFrame(quadro);
  }, [s.tocando, r, dados]);

  const ir = (i: number) => { r.definir({ passo: i, t: 0, tocando: false }); setAnuncio(`Passo ${i + 1} de ${passos.length}: ${ROTULO[passos[i].quem]}. ${passos[i].texto}`); };
  const fim = s.passo === ultimo && s.t >= passos[ultimo].duracao;
  const alternar = () => r.definir(s.tocando ? { tocando: false } : fim || s.passo === ultimo ? { passo: 0, t: 0, tocando: true } : { tocando: true });
  const escolherModo = (modo: number) => { r.definir({ modo, passo: direto ? fimDe(modo, r.get().perg) : 0, t: 0, tocando: false }); setAnuncio(`${dados.modos[modo].nome}: quem decide é ${dados.modos[modo].quem_decide}.`); };
  const escolherPergunta = (perg: number) => { r.definir({ perg, passo: direto ? fimDe(r.get().modo, perg) : 0, t: 0, tocando: false }); setAnuncio(`Pergunta: ${dados.perguntas[perg].texto}`); };
  const modo = dados.modos[s.modo];

  return <Ctx.Provider value={r}>
    <MotionConfig reducedMotion="user">
      <div className="palco rs">
        <div className="palco-barra">
          <Abas rotulo="Jeito de montar o sistema" atual={s.modo} escolher={escolherModo}
            itens={dados.modos.map((m) => ({ chave: m.id, texto: m.nome, cor: m.cor }))} />
          <span className="palco-selo">ilustração</span>
          <div className="rs-perguntas" role="group" aria-label="Pergunta">
            <span>pergunta</span>
            {dados.perguntas.map((p, i) => (
              <button key={p.id} type="button" aria-pressed={i === s.perg} onClick={() => escolherPergunta(i)}>“{p.curta}”</button>
            ))}
          </div>
        </div>
        <div className="rs-palco">
          <ConversaDoRastro loja={loja} />
          <section className={`rs-dentro cor-${modo.cor}`} aria-label="Por dentro: quem faz cada passo">
            <p className="rs-quem-decide">quem decide o próximo passo: <b>{modo.quem_decide}</b></p>
            <ReactFlowProvider initialNodes={semente.nodes} initialEdges={semente.edges} initialWidth={559} initialHeight={Math.round(559 * PAISAGEM.altura * 1.16 / PAISAGEM.largura)} fitView>
              <DesenhoCtx.Provider value={desenho}><Grafo /></DesenhoCtx.Provider></ReactFlowProvider>
          </section>
        </div>
        <div className="palco-rodape">
          <Controles tocando={s.tocando} fim={fim} passo={s.passo} total={passos.length} alternar={alternar} ir={ir} />
          <Linha ir={ir} />
        </div>
        <p className="palco-anuncio" aria-live="polite">{anuncio}</p>
      </div>
    </MotionConfig>
  </Ctx.Provider>;
}
