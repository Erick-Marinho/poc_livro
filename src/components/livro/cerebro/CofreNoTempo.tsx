/**
 * "O cofre no tempo": as notas surgindo na ordem das datas das propriedades, ligadas às pessoas e ao projeto pelos
 * [[links]], e o que o cofre diz da entrega a cada dia. Responde: por que uma busca devolveria a data velha? Porque o
 * cofre tem mais notas dizendo a data velha, e o resumo do projeto nunca foi atualizado. Tudo sai das notas do cofre.
 */
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Controles, LinhaDoTempo } from "../palco/Palco";
import { usePasseio } from "./passeio";
import "./cerebro.css";

export type NotaCofre = { arquivo: string; titulo: string; pasta: string; data: string; links: string[]; prazo?: string };

const W = 900, H = 430, X0 = 120, X1 = 820;
const RAIAS: Record<string, number> = { "Notas": 300, "E-mails": 230, "Reuniões": 160 };
const dia = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
const ms = (iso: string) => Date.parse(`${iso}T00:00:00Z`);

export default function CofreNoTempo({ notas, narracoes }: { notas: NotaCofre[]; narracoes: Record<string, string> }) {
  const centrais = notas.filter((n) => !(n.pasta in RAIAS));                 /* pessoas e projeto: os nós do grafo */
  const eventos = notas.filter((n) => n.pasta in RAIAS).sort((a, b) => a.data.localeCompare(b.data));
  const datas = [...new Set(eventos.map((n) => n.data))];
  const t0 = ms(datas[0]), t1 = ms(datas.at(-1)!);
  const x = (iso: string) => X0 + ((ms(iso) - t0) / (t1 - t0)) * (X1 - X0);
  const xc = (i: number) => X0 + 40 + (i * (X1 - X0 - 80)) / Math.max(centrais.length - 1, 1);
  const pos = new Map<string, { x: number; y: number }>();
  centrais.forEach((n, i) => pos.set(n.titulo, { x: xc(i), y: 60 }));
  /* eventos do mesmo dia na mesma raia não se sobrepõem */
  const ocupado = new Map<string, number>();
  eventos.forEach((n) => { const k = `${n.data}|${n.pasta}`, j = ocupado.get(k) ?? 0; ocupado.set(k, j + 1); pos.set(n.titulo, { x: x(n.data) + j * 22, y: RAIAS[n.pasta] }); });
  /* na mesma raia, uma nota perto demais da anterior escreve o título embaixo, para os dois não se encavalarem */
  const embaixo = new Set<string>();
  const ultimaDaRaia = new Map<string, { x: number; titulo: string }>();
  eventos.forEach((n) => { const c = pos.get(n.titulo)!, u = ultimaDaRaia.get(n.pasta);
    if (u && c.x - u.x < 130 && !embaixo.has(u.titulo)) embaixo.add(n.titulo);
    ultimaDaRaia.set(n.pasta, { x: c.x, titulo: n.titulo }); });

  const desce = datas.reduce<boolean[]>((acc, d, i) => [...acc, i > 0 && !acc[i - 1] && x(d) - x(datas[i - 1]) < 46], []);
  const passos = datas.map((d) => ({ duracao: 3600, texto: narracoes[d] ?? dia(d) }));
  const p = usePasseio(passos.map((q) => q.duracao));
  const hoje = datas[p.passo];
  const visivel = (n: NotaCofre) => n.data <= hoje;
  const dizem = notas.filter((n) => n.prazo && visivel(n));
  const vale = [...dizem].sort((a, b) => a.data.localeCompare(b.data)).at(-1)?.prazo;
  const contagem = [...new Set(dizem.map((n) => n.prazo!))].map((pz) => `${dizem.filter((n) => n.prazo === pz).length} ${dizem.filter((n) => n.prazo === pz).length === 1 ? "nota diz" : "notas dizem"} ${pz}`);
  const xHoje = x(datas[Math.max(p.passo - 1, 0)]) + (x(hoje) - x(datas[Math.max(p.passo - 1, 0)])) * (p.passo === 0 ? 1 : p.fracao);

  return <MotionConfig reducedMotion="user">
    <div className="palco cnt">
      <div className="palco-barra">
        <span className="cnt-diz">o cofre diz: entrega em <AnimatePresence mode="popLayout" initial={false}><motion.b key={vale} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>{vale ?? "?"}</motion.b></AnimatePresence></span>
        <span className="cnt-contagem">{contagem.join(" · ")}</span>
        <span className="palco-selo">desenhado das notas do cofre</span>
      </div>
      <div className="cnt-rolagem">
      <svg viewBox={`0 0 ${W} ${H}`} className="cnt-grafo" role="img" aria-label={`O cofre em ${dia(hoje)}: ${contagem.join(", ")}`}>
        {Object.entries(RAIAS).map(([nome, y]) => <g key={nome}><line x1={X0 - 10} x2={X1 + 30} y1={y} y2={y} className="cnt-raia" /><text x={14} y={y + 4} className="cnt-rotulo">{nome}</text></g>)}
        <text x={14} y={64} className="cnt-rotulo">pessoas e projeto</text>
        <line x1={X0} x2={X1} y1={378} y2={378} className="cnt-eixo" />
        {/* datas muito perto da anterior descem uma linha, para não se sobrepor */}
        {datas.map((d, i) => <text key={d} x={x(d)} y={desce[i] ? 412 : 398} className="cnt-dia" textAnchor="middle">{dia(d)}</text>)}
        <line x1={xHoje} x2={xHoje} y1={30} y2={384} className="cnt-hoje" />
        {/* os [[links]] de cada nota, para as pessoas e o projeto */}
        {notas.filter(visivel).flatMap((n) => n.links.filter((l) => pos.has(l) && l !== n.titulo).map((l) => {
          const a = pos.get(n.titulo)!, b = pos.get(l)!;
          return <motion.path key={`${n.titulo}>${l}`} d={`M${a.x},${a.y} C${a.x},${(a.y + b.y) / 2} ${b.x},${(a.y + b.y) / 2} ${b.x},${b.y}`}
            className="cnt-link" initial={p.vivo ? { pathLength: 0, opacity: 0 } : false} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: .7 }} />;
        }))}
        {notas.map((n) => {
          const c = pos.get(n.titulo)!, ve = visivel(n), centro = !(n.pasta in RAIAS);
          const parado = centro && n.prazo && vale && n.prazo !== vale;   /* o resumo que não acompanhou a mudança */
          return <motion.g key={n.arquivo} initial={false} animate={{ opacity: ve ? 1 : 0, scale: ve ? 1 : .6 }} transition={{ duration: .4 }} style={{ transformOrigin: `${c.x}px ${c.y}px` }}>
            <circle cx={c.x} cy={c.y} r={centro ? 9 : 7} className={`cnt-no cnt-${centro ? "centro" : "evento"}${n.prazo ? " cnt-com-prazo" : ""}`} />
            <text x={c.x} y={embaixo.has(n.titulo) ? c.y + 46 : c.y - 14} textAnchor="middle" className="cnt-titulo">{n.titulo.length > 22 ? n.titulo.slice(0, 21) + "…" : n.titulo}</text>
            {n.prazo && <g className={`cnt-prazo${n.prazo === vale ? " cnt-vale" : ""}${parado ? " cnt-parado" : ""}`}>
              <rect x={c.x - 22} y={c.y + 11} width={44} height={17} rx={8} /><text x={c.x} y={c.y + 23} textAnchor="middle">{n.prazo}</text>
              {parado && <text x={c.x} y={c.y + 42} textAnchor="middle" className="cnt-aviso">o resumo não mudou</text>}
            </g>}
          </motion.g>;
        })}
      </svg>
      </div>
      <div className="palco-rodape">
        <Controles tocando={p.tocando} fim={p.fim} passo={p.passo} total={passos.length} alternar={p.alternar} ir={p.ir} />
        <LinhaDoTempo passos={passos} passo={p.passo} fracao={p.fracao} ir={p.ir} />
      </div>
    </div>
  </MotionConfig>;
}
