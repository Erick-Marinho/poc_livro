/**
 * A figura do agente funcionando, por fora (a conversa) e por dentro (o grafo).
 * Os cenários chegam já conferidos contra o contrato pelo FiguraAgente.astro; aqui só se toca o roteiro.
 * O estado mora num relógio pequeno (cena.ts): cada nó e cada aresta assina só o pedaço que muda nele,
 * então só a aresta ativa redesenha a cada quadro.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Background, BackgroundVariant, Handle, Position, ReactFlow, ReactFlowProvider, useReactFlow } from "@xyflow/react";
import type { Edge, EdgeProps, Node, NodeProps } from "@xyflow/react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import "@xyflow/react/dist/base.css";
import { Abas, Controles, Conversa, IC, Icone, LinhaDoTempo } from "../palco/Palco";
import type { Mensagem } from "../palco/Palco";
import { lerDireto, useDireto } from "../palco/direto";
import "./agente.css";
import { ARESTAS, DECISOES, avancar, conversa, estadoAresta, estadoNo, final, memoria, selo, ultimo } from "./cena";
import type { Cenario, Escolha, Estado, EstadoNo } from "./cena";

/* ---------- relógio ---------- */

type Relogio = { get: () => Estado; assinar: (f: () => void) => () => void; definir: (s: Partial<Estado>) => void; cenarios: Cenario[] };
function criarRelogio(cenarios: Cenario[]): Relogio {
  let estado = final(0, cenarios[0]);
  const ouvintes = new Set<() => void>();
  return {
    cenarios,
    get: () => estado,
    assinar: (f) => { ouvintes.add(f); return () => { ouvintes.delete(f); }; },
    definir: (s) => { estado = { ...estado, ...s }; ouvintes.forEach((f) => f()); },
  };
}
const Ctx = createContext<Relogio | null>(null);
function useRelogio<T>(ler: (s: Estado, c: Cenario) => T): T {
  const r = useContext(Ctx)!;
  const pegar = () => ler(r.get(), r.cenarios[r.get().cen]);
  return useSyncExternalStore(r.assinar, pegar, pegar);
}

/* ---------- desenho do grafo (unidades do React Flow) ---------- */

type Id = "cliente" | "agente" | "grupo" | "pedidos" | "politica" | "catalogo" | "decisao" | "resposta" | "pessoa";
type Caixa = { x: number; y: number; w: number; h: number };
type Lado = "cima" | "baixo" | "esq" | "dir";
/* cada aresta: [lado em que sai, a quantos px do topo/da esquerda; lado em que chega, idem] */
type Desenho = { largura: number; altura: number; caixas: Record<Id, Caixa>; ligacoes: Record<string, [Lado, number, Lado, number]> };
const ida = (f: number, de: number): [Lado, number, Lado, number] => ["dir", f - 8 - de, "esq", 15];
const volta = (f: number, de: number): [Lado, number, Lado, number] => ["esq", 31, "dir", f + 8 - de];

/* deitado, para a coluna larga: o cliente à esquerda do agente, as ferramentas à direita */
const PAISAGEM: Desenho = {
  largura: 640, altura: 434,
  caixas: {
    cliente: { x: 0, y: 66, w: 150, h: 52 }, agente: { x: 186, y: 0, w: 236, h: 206 },
    grupo: { x: 456, y: 0, w: 184, h: 206 },
    pedidos: { x: 472, y: 36, w: 152, h: 46 }, politica: { x: 472, y: 92, w: 152, h: 46 }, catalogo: { x: 472, y: 148, w: 152, h: 46 },
    decisao: { x: 186, y: 248, w: 454, h: 92 },
    resposta: { x: 186, y: 384, w: 215, h: 50 }, pessoa: { x: 425, y: 384, w: 215, h: 50 },
  },
  ligacoes: {
    "cliente-agente": ["dir", 26, "esq", 92],
    "agente-pedidos": ida(59, 0), "pedidos-agente": volta(59, 0),
    "agente-politica": ida(115, 0), "politica-agente": volta(115, 0),
    "agente-catalogo": ida(171, 0), "catalogo-agente": volta(171, 0),
    "agente-decisao": ["baixo", 118, "cima", 118],
    "decisao-resposta": ["baixo", 107, "cima", 107], "decisao-pessoa": ["baixo", 346, "cima", 107],
  },
};
/* em pé, para o celular: tudo desce, as ferramentas ao lado do agente */
const RETRATO: Desenho = {
  largura: 440, altura: 524,
  caixas: {
    cliente: { x: 30, y: 0, w: 160, h: 50 }, agente: { x: 0, y: 88, w: 222, h: 214 },
    grupo: { x: 256, y: 76, w: 184, h: 208 },
    pedidos: { x: 272, y: 106, w: 152, h: 46 }, politica: { x: 272, y: 162, w: 152, h: 46 }, catalogo: { x: 272, y: 218, w: 152, h: 46 },
    decisao: { x: 0, y: 340, w: 440, h: 92 },
    resposta: { x: 20, y: 474, w: 190, h: 50 }, pessoa: { x: 230, y: 474, w: 190, h: 50 },
  },
  ligacoes: {
    "cliente-agente": ["baixo", 80, "cima", 110],
    "agente-pedidos": ida(129, 88), "pedidos-agente": volta(129, 88),
    "agente-politica": ida(185, 88), "politica-agente": volta(185, 88),
    "agente-catalogo": ida(241, 88), "catalogo-agente": volta(241, 88),
    "agente-decisao": ["baixo", 110, "cima", 110],
    "decisao-resposta": ["baixo", 115, "cima", 95], "decisao-pessoa": ["baixo", 325, "cima", 95],
  },
};
const POSICAO: Record<Lado, Position> = { cima: Position.Top, baixo: Position.Bottom, esq: Position.Left, dir: Position.Right };
type Ponta = { id: string; tipo: "source" | "target"; lado: Lado; em: number };
function pontas(d: Desenho, no: Id): Ponta[] {
  return Object.entries(d.ligacoes).flatMap(([aresta, [ls, es, lt, et]]) => {
    const [de, para] = aresta.split("-");
    return [
      ...(de === no ? [{ id: `${aresta}-s`, tipo: "source" as const, lado: ls, em: es }] : []),
      ...(para === no ? [{ id: `${aresta}-t`, tipo: "target" as const, lado: lt, em: et }] : []),
    ];
  });
}
/* posição de cada ponta, para o servidor desenhar sem medir nada (React Flow, SSR) */
function pontaSSR(d: Desenho, no: Id, p: Ponta) {
  const { w, h } = d.caixas[no];
  const deitado = p.lado === "esq" || p.lado === "dir";
  const x = deitado ? (p.lado === "dir" ? w : 0) : p.em;
  const y = deitado ? p.em : p.lado === "baixo" ? h : 0;
  return { id: p.id, type: p.tipo, position: POSICAO[p.lado], x: x - 1, y: y - 1, width: 2, height: 2 };
}
const DesenhoCtx = createContext<Desenho>(PAISAGEM);
function Pontas({ id }: { id: Id }) {
  const d = useContext(DesenhoCtx);
  return <>{pontas(d, id).map((p) => (
    <Handle key={p.id} id={p.id} type={p.tipo} position={POSICAO[p.lado]} isConnectable={false}
      style={p.lado === "esq" || p.lado === "dir" ? { top: p.em } : { left: p.em }} />
  ))}</>;
}

/* a cor de cada decisão, nas abas e nos nós */
const COR: Record<Escolha, string> = { responder: "verde", recusar: "ambar", abrir_chamado: "ciano", passar: "lilas" };

/* ---------- nós ---------- */

type Dados = { nome?: string };
const classeEstado = (e: EstadoNo) => `aav-no aav-${e}`;

function NoCliente({ data }: NodeProps<Node<Dados>>) {
  const e = useRelogio((s, c) => estadoNo(c, "cliente", s.passo));
  return <div className={classeEstado(e)}><Pontas id="cliente" />
    <span className="aav-ic"><Icone d={IC.pessoa} /></span>
    <span className="aav-txt"><small>cliente</small><b>{data.nome}</b></span>
  </div>;
}

function NoAgente() {
  const e = useRelogio((s, c) => estadoNo(c, "agente", s.passo));
  const itens = useRelogio((s, c) => memoria(c, s.passo).join("\n"));
  return <div className={`${classeEstado(e)} aav-agente`}><Pontas id="agente" />
    <div className="aav-topo"><span className="aav-ic"><Icone d={IC.agente} /></span><b>agente</b>
      <span className="aav-status">{e === "ativo" ? <span className="aav-pensa">pensando<i>.</i><i>.</i><i>.</i></span> : null}</span></div>
    <small className="aav-rotulo">o que ele já sabe</small>
    <ul className="aav-memoria">
      <AnimatePresence initial={false}>
        {itens ? itens.split("\n").map((t) => (
          <motion.li key={t} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .3 }}>{t}</motion.li>
        )) : <li className="aav-vazio" key="vazio">nada ainda</li>}
      </AnimatePresence>
    </ul>
  </div>;
}

const NOMES_FERRAMENTA: Record<string, [string, string]> = { pedidos: ["pedidos", IC.pedidos], politica: ["política", IC.politica], catalogo: ["catálogo", IC.catalogo] };
function NoFerramenta({ id }: NodeProps) {
  const e = useRelogio((s, c) => estadoNo(c, id, s.passo));
  const [nome, d] = NOMES_FERRAMENTA[id];
  return <div className={`${classeEstado(e)} aav-ferramenta`}><Pontas id={id as Id} />
    <span className="aav-ic"><Icone d={d} /></span><b>{nome}</b>
    {e === "feito" && <span className="aav-ok" aria-label="consultado"><Icone d={IC.certo} tam={14} /></span>}
    {e === "ativo" && <span className="aav-lendo" aria-label="consultando" />}
  </div>;
}

function NoGrupo() { return <div className="aav-grupo"><small>ferramentas</small></div>; }

function NoDecisao() {
  const e = useRelogio((s, c) => estadoNo(c, "decisao", s.passo));
  const escolha = useRelogio((s, c) => (estadoNo(c, "decisao", s.passo) === "espera" ? "" : c.decisao));
  return <div className={`${classeEstado(e)} aav-decisao`}><Pontas id="decisao" />
    <div className="aav-topo"><b>decisão</b><small>{e === "ativo" ? "o contrato decide" : e === "feito" ? "decidido" : "quatro saídas possíveis"}</small></div>
    <div className="aav-pilulas">
      {(Object.keys(DECISOES) as Escolha[]).map((k) => (
        <span key={k} className={`aav-pilula aav-d-${k}${escolha === k ? " aav-escolhida" : ""}`}>
          {escolha === k && <motion.span className="aav-fundo" layoutId="aav-escolha" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
          <span className="aav-rot">{DECISOES[k]}</span>
        </span>
      ))}
    </div>
  </div>;
}

function NoSaida({ id }: NodeProps) {
  const e = useRelogio((s, c) => estadoNo(c, id, s.passo));
  const decisao = useRelogio((_, c) => c.decisao);
  const [nome, d] = id === "resposta" ? ["resposta ao cliente", IC.resposta] : ["pessoa da equipe", IC.equipe];
  return <div className={`${classeEstado(e)} aav-saida aav-d-${decisao}`}><Pontas id={id as Id} />
    <span className="aav-ic"><Icone d={d} /></span><b>{nome}</b>
  </div>;
}

const TIPOS_NO = { cliente: NoCliente, agente: NoAgente, ferramenta: NoFerramenta, grupo: NoGrupo, decisao: NoDecisao, saida: NoSaida };

/* ---------- arestas ---------- */

/* o selo é o motivo da decisão: fica sobre a seta que vai do agente à decisão (em SVG, para sair também do servidor) */
function Selo({ x, y }: { x: number; y: number }) {
  const marca = useRelogio((s, c) => selo(c, s.passo));
  const decisao = useRelogio((_, c) => c.decisao);
  if (!marca) return null;
  const w = [...marca].length * 7.4 + 26;
  return <motion.g key={marca} className={`aav-selo aav-d-${decisao}`} initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring", stiffness: 420, damping: 24 }} style={{ x, y }}>
    <rect x={-w / 2} y={-13} width={w} height={26} rx={13} /><text y={4.5} textAnchor="middle">{marca}</text>
  </motion.g>;
}

function ArestaFluxo({ id, sourceX, sourceY, targetX, targetY }: EdgeProps) {
  const progresso = useRelogio((s, c) => estadoAresta(c, id, s));
  const dx = targetX - sourceX, dy = targetY - sourceY, len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len, ponta = 7;
  const fx = targetX - ux * ponta, fy = targetY - uy * ponta;
  const seta = `M ${targetX} ${targetY} L ${fx - uy * 4.5} ${fy + ux * 4.5} L ${fx + uy * 4.5} ${fy - ux * 4.5} Z`;
  const cheio = progresso === 2 ? 1 : Math.max(progresso, 0);
  const px = sourceX + (fx - sourceX) * cheio, py = sourceY + (fy - sourceY) * cheio;
  const classe = progresso === -1 ? "espera" : progresso === 2 ? "feito" : "ativo";
  return <g className={`aav-aresta aav-a-${classe}`}>
    <path className="aav-trilho" d={`M ${sourceX} ${sourceY} L ${fx} ${fy}`} />
    {progresso >= 0 && <path className="aav-cheio" d={`M ${sourceX} ${sourceY} L ${px} ${py}`} />}
    <path className="aav-seta" d={seta} />
    {classe === "ativo" && <circle className="aav-bolinha" cx={px} cy={py} r={5} />}
    {id === "agente-decisao" && <AnimatePresence initial={false}><Selo x={(sourceX + fx) / 2} y={(sourceY + fy) / 2} /></AnimatePresence>}
  </g>;
}
const TIPOS_ARESTA = { fluxo: ArestaFluxo };

function montar(c: Cenario, d: Desenho) {
  const no = (id: Id, type: string, extra: Partial<Node> = {}): Node => ({
    id, type, position: { x: d.caixas[id].x, y: d.caixas[id].y }, width: d.caixas[id].w, height: d.caixas[id].h,
    data: {}, handles: pontas(d, id).map((p) => pontaSSR(d, id, p)), draggable: false, selectable: false, ...extra,
  });
  const nodes: Node[] = [
    no("grupo", "grupo", { zIndex: -1 }),
    no("cliente", "cliente", { data: { nome: c.nome } }),
    no("agente", "agente"),
    no("pedidos", "ferramenta"), no("politica", "ferramenta"), no("catalogo", "ferramenta"),
    no("decisao", "decisao"),
    no("resposta", "saida"), no("pessoa", "saida"),
  ];
  const usadas = new Set(c.passos.map((p) => p.trajeto).filter(Boolean));
  const edges: Edge[] = ARESTAS.filter((a) => usadas.has(a)).map((a) => {
    const [source, target] = a.split("-");
    return { id: a, source, sourceHandle: `${a}-s`, target, targetHandle: `${a}-t`, type: "fluxo", selectable: false, focusable: false };
  });
  return { nodes, edges };
}

/* ---------- o grafo, com o enquadramento que acompanha a largura ---------- */

function Grafo() {
  const cen = useRelogio((s) => s.cen);
  const r = useContext(Ctx)!;
  const d = useContext(DesenhoCtx);
  const { nodes, edges } = useMemo(() => montar(r.cenarios[cen], d), [cen, r, d]);
  const caixa = useRef<HTMLDivElement>(null);
  const rf = useReactFlow();
  /* o desenho tem tamanho conhecido: o enquadramento sai da caixa medida, sem depender do que o React Flow mediu antes */
  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const enquadrar = () => {
      const { width: W, height: H } = el.getBoundingClientRect();
      if (!W || !H) return;
      const folga = 1.1, zoom = Math.min(W / (d.largura * folga), H / (d.altura * folga));
      rf.setViewport({ x: (W - d.largura * zoom) / 2, y: (H - d.altura * zoom) / 2, zoom }, { duration: 0 });
    };
    enquadrar();
    if (!("ResizeObserver" in window)) return;
    const ro = new ResizeObserver(enquadrar);
    ro.observe(el);
    return () => ro.disconnect();
  }, [rf, d]);
  /* no servidor, o tamanho da coluna do grafo no computador (920 − 320 da conversa) */
  const servidor = typeof window === "undefined";
  const ssr = { largura: 599, altura: Math.round(599 * d.altura / d.largura) };
  return <div className="aav-grafo" ref={caixa} style={{ aspectRatio: `${d.largura} / ${d.altura}` }}>
    <ReactFlow nodes={nodes} edges={edges} nodeTypes={TIPOS_NO} edgeTypes={TIPOS_ARESTA} colorMode="dark"
      fitView fitViewOptions={{ padding: 0.05 }} width={servidor ? ssr.largura : undefined} height={servidor ? ssr.altura : undefined}
      nodesDraggable={false} nodesConnectable={false} elementsSelectable={false} nodesFocusable={false} edgesFocusable={false}
      panOnDrag={false} panOnScroll={false} zoomOnScroll={false} zoomOnPinch={false} zoomOnDoubleClick={false}
      preventScrolling={false} disableKeyboardA11y minZoom={0.3} maxZoom={2}>
      <Background variant={BackgroundVariant.Dots} gap={18} size={1.2} color="var(--palco-pontos)" />
    </ReactFlow>
  </div>;
}

/* ---------- por fora: a conversa ---------- */

function ConversaDoAgente() {
  const cen = useRelogio((s) => s.cen);
  const r = useContext(Ctx)!;
  const c = r.cenarios[cen];
  const digitando = useRelogio((s, cc) => conversa(cc, s.passo).digitando);
  const respondeu = useRelogio((s, cc) => conversa(cc, s.passo).respondeu);
  const mensagens: Mensagem[] = [
    { chave: `${c.caso}-p`, tipo: "cliente", autor: c.nome, texto: c.pergunta },
    ...(digitando ? [{ chave: `${c.caso}-d`, tipo: "digitando" as const }] : []),
    ...(respondeu ? [{ chave: `${c.caso}-r`, tipo: "agente" as const, autor: "agente", texto: c.resposta, cor: COR[c.decisao] }] : []),
    ...(respondeu && c.decisao === "passar" ? [{ chave: `${c.caso}-s`, tipo: "sistema" as const, texto: "conversa transferida para a equipe" }] : []),
  ];
  return <Conversa mensagens={mensagens} />;
}

/* ---------- linha do tempo e controles ---------- */

function Linha({ ir }: { ir: (i: number) => void }) {
  const r = useContext(Ctx)!;
  const cen = useRelogio((s) => s.cen);
  const passo = useRelogio((s) => s.passo);
  const fracao = useRelogio((s, cc) => Math.min(s.t / cc.passos[s.passo].duracao, 1));
  return <LinhaDoTempo passos={r.cenarios[cen].passos} passo={passo} fracao={fracao} ir={ir} />;
}

/* ---------- a figura ---------- */

export default function AgenteAoVivo({ cenarios }: { cenarios: Cenario[] }) {
  const r = useMemo(() => criarRelogio(cenarios), [cenarios]);
  const raiz = useRef<HTMLDivElement>(null);
  const [anuncio, setAnuncio] = useState("");
  const [calmo, setCalmo] = useState(false);
  const s = useSyncExternalStore(r.assinar, r.get, r.get);

  /* ao hidratar: volta ao começo do R01 e fica pausada; quem dá o play é o leitor (pedido do Erick, 24/10/2026) */
  useEffect(() => {
    setCalmo(matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (lerDireto()) return;   /* modo direto: fica no fim do R01, como o servidor desenhou */
    r.definir({ cen: 0, passo: 0, t: 0, tocando: false, sequencia: false });
  }, [r]);

  /* o relógio anda enquanto toca */
  useEffect(() => {
    if (!s.tocando) return;
    let antes = performance.now(), quadro = 0;
    const andar = (agora: number) => {
      const novo = avancar(r.cenarios, r.get(), agora - antes);
      antes = agora;
      r.definir(novo);
      if (novo.tocando) quadro = requestAnimationFrame(andar);
    };
    quadro = requestAnimationFrame(andar);
    return () => cancelAnimationFrame(quadro);
  }, [s.tocando, r]);

  const direto = useDireto();
  useEffect(() => { if (direto) r.definir(final(r.get().cen, cenarios[r.get().cen])); }, [direto, r, cenarios]);
  const c = cenarios[s.cen];
  /* o servidor desenha o grafo do primeiro cenário já terminado: é o que fica para quem lê sem JS */
  const inicio = useMemo(() => montar(cenarios[0], PAISAGEM), [cenarios]);
  /* abaixo de 640 px o grafo fica em pé */
  const [desenho, setDesenho] = useState<Desenho>(PAISAGEM);
  useEffect(() => {
    const mq = matchMedia("(max-width: 639px)");
    const ver = () => setDesenho(mq.matches ? RETRATO : PAISAGEM);
    ver(); mq.addEventListener("change", ver);
    return () => mq.removeEventListener("change", ver);
  }, []);
  const anunciar = (passo: number) => setAnuncio(`Passo ${passo + 1} de ${c.passos.length}: ${c.passos[passo].texto}`);
  const ir = useCallback((i: number) => { r.definir({ passo: i, t: 0, tocando: false, sequencia: false }); anunciar(i); }, [r, c]);
  const escolher = (cen: number) => { r.definir(direto ? final(cen, cenarios[cen]) : { cen, passo: 0, t: 0, tocando: !calmo, sequencia: false }); setAnuncio(`Cenário: ${DECISOES[cenarios[cen].decisao]}.`); };
  const fim = s.passo === ultimo(c) && s.t >= c.passos[ultimo(c)].duracao;
  const alternar = () => {
    if (s.tocando) { r.definir({ tocando: false, sequencia: false }); return; }
    r.definir(fim ? { passo: 0, t: 0, tocando: true, sequencia: false } : { tocando: true, sequencia: false });
  };

  return <Ctx.Provider value={r}>
    <MotionConfig reducedMotion="user">
      <div className="palco aav" ref={raiz}>
        <div className="palco-barra">
          <Abas rotulo="O que o agente decide" atual={s.cen} escolher={escolher}
            itens={cenarios.map((k) => ({ chave: k.caso, texto: DECISOES[k.decisao], cor: COR[k.decisao], titulo: k.pergunta }))} />
          <span className="palco-selo">simulação · {c.caso}</span>
        </div>
        <div className="aav-palco">
          <ConversaDoAgente />
          <section className="aav-dentro" aria-label="Por dentro: o caminho da resposta">
            <ReactFlowProvider initialNodes={inicio.nodes} initialEdges={inicio.edges} initialWidth={599} initialHeight={Math.round(599 * PAISAGEM.altura / PAISAGEM.largura)} fitView>
              <DesenhoCtx.Provider value={desenho}><Grafo /></DesenhoCtx.Provider></ReactFlowProvider>
          </section>
        </div>
        <div className="palco-rodape">
          <Controles tocando={s.tocando} fim={fim} passo={s.passo} total={c.passos.length} alternar={alternar} ir={ir} />
          <Linha ir={ir} />
        </div>
        <p className="palco-anuncio" aria-live="polite">{anuncio}</p>
      </div>
    </MotionConfig>
  </Ctx.Provider>;
}

