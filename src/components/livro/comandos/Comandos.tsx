/**
 * Os comandos fixos da página: a pílula de navegação e o botão de configurações.
 * Arrastar a pílula para a direita a recolhe num círculo ao lado da engrenagem; tocar no círculo a abre de novo.
 * A escolha (tema e pílula recolhida) fica guardada no navegador; o script no <head> do layout aplica antes de pintar.
 * O sumário (Navegacao.astro) ouve o botão de menu por delegação: aqui o botão só carrega data-abrir.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useMotionValue, useTransform } from "motion/react";
import { BookOpen, Check, ChevronLeft, ChevronRight, Menu, Moon, ScrollText, Settings, Sun } from "lucide-react";
import "./comandos.css";

type Vizinho = { href: string; rotulo: string };
type Tema = "claro" | "papel" | "escuro";
const TEMAS: { id: Tema; nome: string; Icone: typeof Sun }[] = [
  { id: "claro", nome: "Claro", Icone: Sun },
  { id: "papel", nome: "Papel", Icone: ScrollText },
  { id: "escuro", nome: "Escuro", Icone: Moon },
];
const CHAVE_TEMA = "fontmar:tema", CHAVE_PILULA = "fontmar:pilula";
const guardar = (k: string, v: string | null) => { try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch { /* sem armazenamento: vale só nesta visita */ } };
const temaAtual = (): Tema => {
  const t = document.documentElement.dataset.theme as Tema | undefined;
  if (t === "claro" || t === "papel" || t === "escuro") return t;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "papel";
};

export default function Comandos({ livro, onde, anterior, proximo, emBreve }: {
  livro: string; onde: string; anterior?: Vizinho; proximo?: Vizinho; emBreve?: string;
}) {
  const [recolhida, setRecolhida] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [tema, setTema] = useState<Tema>("papel");
  const x = useMotionValue(0);
  const sumindo = useTransform(x, [0, 160], [1, 0.35]);
  const painel = useRef<HTMLDivElement>(null);
  const engrenagem = useRef<HTMLButtonElement>(null);

  /* ao hidratar: lê o que o script do <head> já aplicou */
  useEffect(() => {
    setTema(temaAtual());
    setRecolhida(document.documentElement.classList.contains("pilula-recolhida"));
    document.documentElement.classList.remove("pilula-recolhida");
  }, []);

  /* o painel fecha com Esc ou com um clique fora dele */
  useEffect(() => {
    if (!aberto) return;
    const fora = (e: PointerEvent) => { if (!painel.current?.contains(e.target as Node) && !engrenagem.current?.contains(e.target as Node)) setAberto(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setAberto(false); engrenagem.current?.focus(); } };
    addEventListener("pointerdown", fora); addEventListener("keydown", esc);
    painel.current?.querySelector<HTMLElement>("[aria-checked='true']")?.focus();
    return () => { removeEventListener("pointerdown", fora); removeEventListener("keydown", esc); };
  }, [aberto]);

  const escolherTema = (t: Tema) => { setTema(t); document.documentElement.dataset.theme = t; guardar(CHAVE_TEMA, t); };
  const recolher = (sim: boolean) => { setRecolhida(sim); guardar(CHAVE_PILULA, sim ? "circulo" : null); };
  const curto = onde.replace(/^Capítulo (\d+) · /, "Cap. $1 · ");
  const numero = onde.match(/^Capítulo (\d+)/)?.[1];
  const teclaRadio = (e: React.KeyboardEvent, i: number) => {
    const n = TEMAS.length, prox = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1 + n, ArrowUp: i - 1 + n }[e.key];
    if (prox === undefined) return;
    e.preventDefault(); escolherTema(TEMAS[prox % n].id);
    (painel.current?.querySelectorAll<HTMLElement>("[role='radio']")[prox % n])?.focus();
  };

  return <MotionConfig reducedMotion="user"><LayoutGroup>
    <div className="cm-trilho">
      <AnimatePresence initial={false}>
        {!recolhida && (
          <motion.nav key="pilula" layoutId="cm-pilula" className="cm-pilula" aria-label="Navegação entre capítulos"
            drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={{ left: 0, right: 0.8 }} dragSnapToOrigin style={{ x, opacity: sumindo }}
            onDragEnd={(_, info) => { if (info.offset.x > 90 || info.velocity.x > 600) recolher(true); }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}>
            <button type="button" className="cm-botao cm-menu" data-abrir aria-controls="sumario" aria-label="Abrir o sumário"><Menu size={18} /></button>
            {anterior
              ? <a className="cm-botao" href={anterior.href} rel="prev" aria-label={`Anterior: ${anterior.rotulo}`} title={anterior.rotulo} draggable={false}><ChevronLeft size={18} /></a>
              : <span className="cm-botao cm-off" aria-hidden="true"><ChevronLeft size={18} /></span>}
            <span className="cm-onde" title="Arraste para a direita para recolher"><small>{livro}</small><b>{curto}</b></span>
            {proximo
              ? <a className="cm-botao" href={proximo.href} rel="next" aria-label={`Próximo: ${proximo.rotulo}`} title={proximo.rotulo} draggable={false}><ChevronRight size={18} /></a>
              : <span className="cm-botao cm-off" title={emBreve ? `${emBreve} · em breve` : undefined} aria-hidden="true"><ChevronRight size={18} /></span>}
            <i className="cm-progresso" />
          </motion.nav>
        )}
      </AnimatePresence>
    </div>

    <div className="cm-canto">
      <AnimatePresence initial={false}>
        {recolhida && (
          <motion.button key="circulo" layoutId="cm-pilula" type="button" className="cm-circulo" onClick={() => recolher(false)}
            aria-label={`Mostrar a navegação (${curto})`} title={curto} transition={{ type: "spring", stiffness: 420, damping: 34 }}>
            <svg className="cm-anel" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="19" /><circle className="cm-anel-lido" cx="22" cy="22" r="19" /></svg>
            {numero ? <b>{numero}</b> : <BookOpen size={18} />}
          </motion.button>
        )}
      </AnimatePresence>
      <button ref={engrenagem} type="button" className="cm-engrenagem" aria-label="Configurações" aria-haspopup="dialog" aria-expanded={aberto}
        onClick={() => setAberto((a) => !a)}><Settings size={20} /></button>
      <AnimatePresence>
        {aberto && (
          <motion.div ref={painel} className="cm-painel" role="dialog" aria-label="Configurações"
            initial={{ opacity: 0, y: 8, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: .97 }} transition={{ duration: .16 }}>
            <p className="cm-titulo">Aparência</p>
            <div role="radiogroup" aria-label="Cor da página" className="cm-temas">
              {TEMAS.map(({ id, nome, Icone }, i) => (
                <button key={id} type="button" role="radio" aria-checked={tema === id} tabIndex={tema === id ? 0 : -1}
                  className={`cm-tema cm-tema-${id}`} onClick={() => escolherTema(id)} onKeyDown={(e) => teclaRadio(e, i)}>
                  <span className="cm-amostra"><Icone size={16} /></span>{nome}{tema === id && <Check size={15} className="cm-marca" />}
                </button>
              ))}
            </div>
            {/* o mesmo que arrastar a pílula, para quem usa teclado ou leitor de tela */}
            <p className="cm-titulo cm-titulo-2">Navegação</p>
            <button type="button" role="switch" aria-checked={recolhida} className="cm-chave" onClick={() => recolher(!recolhida)}>
              Recolher num círculo<span className="cm-trilho-chave" aria-hidden="true"><i /></span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </LayoutGroup></MotionConfig>;
}
