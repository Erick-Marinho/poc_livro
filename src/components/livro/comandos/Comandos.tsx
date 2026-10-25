/**
 * Os comandos fixos da página: a pílula de navegação e o botão de configurações.
 * Arrastar a pílula para a direita a recolhe num círculo ao lado da engrenagem; tocar no círculo a abre de novo.
 * A escolha (tema e pílula recolhida) fica guardada no navegador; o script no <head> do layout aplica antes de pintar.
 * O sumário (Navegacao.astro) ouve o botão de menu por delegação: aqui o botão só carrega data-abrir.
 */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useMotionValue, useTransform } from "motion/react";
import { BookOpen, Check, ChevronLeft, ChevronRight, GraduationCap, Laptop, Menu, Moon, ScrollText, Settings, Sun, Target, X } from "lucide-react";
import { definirDireto, useDireto } from "../palco/direto";
import { definirOnde, useOnde } from "../palco/onde";
import type { Onde } from "../palco/onde";
import type { Placar } from "../Navegacao.astro";
import "./comandos.css";

type Vizinho = { href: string; rotulo: string };
type Tema = "claro" | "papel" | "escuro";
const TEMAS: { id: Tema; nome: string; Icone: typeof Sun }[] = [
  { id: "claro", nome: "Claro", Icone: Sun },
  { id: "papel", nome: "Papel", Icone: ScrollText },
  { id: "escuro", nome: "Escuro", Icone: Moon },
];
type Fonte = "serifada" | "sem-serifa";
type Tamanho = "pequeno" | "medio" | "grande";
const FONTES: { id: Fonte; nome: string }[] = [{ id: "serifada", nome: "Serifada" }, { id: "sem-serifa", nome: "Sem serifa" }];
const TAMANHOS: { id: Tamanho; nome: string }[] = [{ id: "pequeno", nome: "Pequeno" }, { id: "medio", nome: "Médio" }, { id: "grande", nome: "Grande" }];
const LUGARES: { id: Onde; nome: string }[] = [{ id: "ide", nome: "Na minha IDE" }, { id: "livro", nome: "Aqui no livro" }];
const CHAVE_TEMA = "fontmar:tema", CHAVE_PILULA = "fontmar:pilula", CHAVE_IDE = "fontmar:ide";
const guardar = (k: string, v: string | null) => { try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch { /* sem armazenamento: vale só nesta visita */ } };
const temaAtual = (): Tema => {
  const t = document.documentElement.dataset.theme as Tema | undefined;
  if (t === "claro" || t === "papel" || t === "escuro") return t;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "papel";
};

export default function Comandos({ livro, onde, anterior, proximo, emBreve, placar }: {
  livro: string; onde: string; anterior?: Vizinho; proximo?: Vizinho; emBreve?: string; placar?: Placar;
}) {
  const [recolhida, setRecolhida] = useState(false);
  /* a pílula dá licença: enquanto os controles de uma figura (a barra da IDE do capítulo) estão à vista, ela vira o
     círculo, para não ficar por cima deles; quando eles saem da tela, ela volta. Não fica guardado. */
  const [licenca, setLicenca] = useState(false);
  /* e o canto (círculo e engrenagem) sobe quando a barra passa por baixo dele, como um botão flutuante que abre espaço
     para um aviso: o botão de seguir da IDE nunca fica coberto */
  const canto = useRef<HTMLDivElement>(null);
  const [sobe, setSobe] = useState(0);
  useEffect(() => {
    const alvos = [...document.querySelectorAll<HTMLElement>(".ic-guia")];
    if (!alvos.length) return;
    /* pela rolagem, como o sumário e o placar: a barra está na faixa de baixo da tela, onde a pílula fica */
    const ver = () => {
      setLicenca(alvos.some((a) => { const r = a.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }));
      const c = canto.current;
      if (!c) return;
      /* onde o canto fica sem subir: a 14px do pé e da direita (o padding de segurança do celular é pequeno, cabe na folga) */
      const base = innerHeight - 14, topo = base - c.offsetHeight, esquerda = innerWidth - 14 - c.offsetWidth;
      const cobre = alvos.find((a) => { const r = a.getBoundingClientRect(); return r.top < base && r.bottom > topo && r.right > esquerda; });
      setSobe(cobre ? Math.max(0, base - cobre.getBoundingClientRect().top + 10) : 0);
    };
    addEventListener("scroll", ver, { passive: true }); addEventListener("resize", ver); ver();
    return () => { removeEventListener("scroll", ver); removeEventListener("resize", ver); };
  }, []);
  const [aberto, setAberto] = useState(false);
  const [tema, setTema] = useState<Tema>("papel");
  const [fonte, setFonte] = useState<Fonte>("serifada");
  const [tamanho, setTamanho] = useState<Tamanho>("medio");
  const direto = useDireto();
  const fazer = useOnde();
  const x = useMotionValue(0);
  const sumindo = useTransform(x, [0, 160], [1, 0.35]);
  const painel = useRef<HTMLDivElement>(null);
  const engrenagem = useRef<HTMLButtonElement>(null);
  /* o lembrete da IDE: fixo no canto de cima; depois de lido, encolhe para só o ícone */
  const [porQue, setPorQue] = useState(false);
  const [alvoTopo, setAlvoTopo] = useState<HTMLElement | null>(null);
  useEffect(() => { setAlvoTopo(document.getElementById("topo-comandos")); }, []);
  const [ideVisto, setIdeVisto] = useState(false);
  const fecharPorQue = useRef<HTMLButtonElement>(null);
  const lembrete = useRef<HTMLButtonElement>(null);
  /* o placar: a nota mais recente; no capítulo em que ela nasce, "?" até o leitor apostar no comando que a mede
     (a IDE avisa com o evento fontmar:apostou), chegar ao fim do capítulo, ou estar no modo direto */
  const [placarAberto, setPlacarAberto] = useState(false);
  const atualMarco = placar?.marcos[placar.marcos.length - 1];
  const [revelado, setRevelado] = useState(!atualMarco?.revelaCom);
  const botaoPlacar = useRef<HTMLButtonElement>(null), painelPlacar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const id = atualMarco?.revelaCom;
    if (!id) return;
    /* por livro e capítulo: o capítulo 2 de um livro não marca o do outro */
    const chave = `fontmar:placar:${location.pathname.split("/").filter(Boolean)[0]}:${atualMarco.capitulo}`;
    try { if (localStorage.getItem(chave) === "visto") { setRevelado(true); return; } } catch { /* sem armazenamento */ }
    const revelar = () => { setRevelado(true); guardar(chave, "visto"); removeEventListener("scroll", fim); removeEventListener("fontmar:apostou", apostou); };
    const apostou = (e: Event) => { if ((e as CustomEvent<string>).detail === id) revelar(); };
    const fim = () => { const h = document.documentElement; if (h.scrollTop + h.clientHeight >= h.scrollHeight - 40) revelar(); };
    if (document.documentElement.hasAttribute("data-direto")) { revelar(); return; }
    addEventListener("fontmar:apostou", apostou); addEventListener("scroll", fim, { passive: true });
    return () => { removeEventListener("fontmar:apostou", apostou); removeEventListener("scroll", fim); };
  }, [atualMarco?.revelaCom]);
  useEffect(() => {
    if (!placarAberto) return;
    const fora = (e: PointerEvent) => { if (!painelPlacar.current?.contains(e.target as Node) && !botaoPlacar.current?.contains(e.target as Node)) setPlacarAberto(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setPlacarAberto(false); botaoPlacar.current?.focus(); } };
    addEventListener("pointerdown", fora); addEventListener("keydown", esc);
    return () => { removeEventListener("pointerdown", fora); removeEventListener("keydown", esc); };
  }, [placarAberto]);

  /* ao hidratar: lê o que o script do <head> já aplicou */
  useEffect(() => {
    setTema(temaAtual());
    const h = document.documentElement.dataset;
    if (h.fonte === "sem-serifa") setFonte("sem-serifa");
    if (h.tamanho === "pequeno" || h.tamanho === "grande") setTamanho(h.tamanho);
    setRecolhida(document.documentElement.classList.contains("pilula-recolhida"));
    document.documentElement.classList.remove("pilula-recolhida");
    try { setIdeVisto(localStorage.getItem(CHAVE_IDE) === "visto"); } catch { /* sem armazenamento */ }
    /* qualquer botão com data-abrir-ide (o da introdução, por exemplo) abre a fundamentação */
    const abrir = (e: MouseEvent) => { if ((e.target as Element).closest?.("[data-abrir-ide]")) setPorQue(true); };
    document.addEventListener("click", abrir);
    return () => document.removeEventListener("click", abrir);
  }, []);

  useEffect(() => {
    if (!porQue) return;
    fecharPorQue.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") fechar(); };
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [porQue]);
  const fechar = () => { setPorQue(false); setIdeVisto(true); guardar(CHAVE_IDE, "visto"); lembrete.current?.focus(); };

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
  /* fonte e tamanho: o padrão (serifada, médio) não fica guardado; o resto vira atributo do <html>, como o tema */
  const escolherFonte = (f: Fonte) => { setFonte(f); f === "serifada" ? delete document.documentElement.dataset.fonte : (document.documentElement.dataset.fonte = f); guardar("fontmar:fonte", f === "serifada" ? null : f); };
  const escolherTamanho = (z: Tamanho) => { setTamanho(z); z === "medio" ? delete document.documentElement.dataset.tamanho : (document.documentElement.dataset.tamanho = z); guardar("fontmar:tamanho", z === "medio" ? null : z); };
  /* setas andam dentro do próprio grupo de opções, como num grupo de rádio */
  const teclaRadio = (e: React.KeyboardEvent<HTMLElement>, i: number, n: number, escolher: (k: number) => void) => {
    const prox = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1 + n, ArrowUp: i - 1 + n }[e.key];
    if (prox === undefined) return;
    e.preventDefault(); escolher(prox % n);
    (e.currentTarget.parentElement?.querySelectorAll<HTMLElement>("[role='radio']")[prox % n])?.focus();
  };

  /* o lembrete da IDE e o placar moram na barra do topo da página (um portal para #topo-comandos, no layout):
     fixos por cima do texto, eles cobriam a trilha da IDE e o próprio texto */
  const topo = <>
    <button ref={lembrete} type="button" className={`cm-ide${ideVisto ? " cm-ide-visto" : ""}`} onClick={() => setPorQue(true)}
      aria-haspopup="dialog" aria-label="Este livro rende mais com uma IDE aberta: por quê" title="Leia com a IDE aberta">
      <Laptop size={16} /><span>Leia com a IDE aberta</span>
    </button>
    {placar && (
      <div className="cm-placar-canto">
        <button ref={botaoPlacar} type="button" className="cm-placar" aria-haspopup="dialog" aria-expanded={placarAberto} onClick={() => setPlacarAberto((a) => !a)}
          aria-label={atualMarco && revelado ? `Placar: ${atualMarco.rotulo}, ${atualMarco.nota}` : "Placar do agente"}>
          <Target size={15} /><span>{atualMarco ? <>nota <b>{revelado ? atualMarco.nota : "?"}</b></> : "placar"}</span>
        </button>
        <AnimatePresence>
          {placarAberto && (
            <motion.div ref={painelPlacar} className="cm-painel-placar" role="dialog" aria-label="O placar do agente"
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .16 }}>
              <p className="cm-titulo">o placar do agente</p>
              {!atualMarco ? <p className="cm-placar-texto">Ainda não há nota. Ela nasce no capítulo 1, antes de existir agente, e cada capítulo depois tenta empurrar o número.</p>
                : !revelado ? <p className="cm-placar-texto">A primeira nota deste livro sai neste capítulo. Ela aparece aqui depois que você investir nela, e não antes.</p>
                : <>
                  <ol className="cm-marcos">
                    {placar.marcos.map((m) => (
                      <li key={m.capitulo}><span className="cm-cap">cap. {m.capitulo}</span><b>{m.nota}</b><span>{m.rotulo}: {m.acertos} de {m.total}, {m.quem}</span></li>
                    ))}
                    {placar.proximo && <li className="cm-proximo"><span className="cm-cap">cap. {placar.proximo.capitulo}</span><b>?</b><span>{placar.proximo.pergunta}</span></li>}
                  </ol>
                  <p className="cm-placar-texto">Confira na sua IDE: <code>{atualMarco.comando}</code></p>
                </>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )}
  </>;

  return <MotionConfig reducedMotion="user"><LayoutGroup>
    {alvoTopo && createPortal(<>{topo}</>, alvoTopo)}
    <AnimatePresence>
      {porQue && (
        <motion.div key="veu" className="cm-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={fechar}>
          <motion.div className="cm-porque" role="dialog" aria-modal="true" aria-labelledby="cm-porque-titulo" onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 16, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: .2 }}>
            <button ref={fecharPorQue} type="button" className="cm-fechar" onClick={fechar} aria-label="Fechar"><X size={18} /></button>
            <p className="cm-titulo"><GraduationCap size={14} /> o que a pesquisa diz</p>
            <h2 id="cm-porque-titulo">Por que ler com a IDE aberta</h2>
            <p>Ler sobre código e escrever código são atividades diferentes, e só a segunda deixa claro o que você não entendeu.
              Uma meta-análise de 225 estudos em cursos de ciência, engenharia e matemática comparou aulas expositivas com aprendizagem ativa:
              as notas subiram em média 0,47 desvio-padrão, e quem só assistia tinha cerca de 1,5 vez mais chance de reprovar <cite>(Freeman et al., 2014)</cite>.</p>
            <p>Em programação, a ordem que funciona é conhecida: prever o que o código faz, rodar, investigar, modificar, e só então criar o seu.
              Numa avaliação com 493 estudantes de 13 escolas, quem aprendeu nessa ordem foi melhor no teste final do que o grupo de controle
              <cite> (Sentance, Waite e Kallia, 2019)</cite>. O livro segue esse caminho: o "pare e pense" pede a previsão, e a IDE e o terminal são onde você roda e investiga.</p>
            <p>Errar também ensina, desde que o erro seja corrigido logo depois. Errar e receber a correção fixa mais do que acertar de primeira <cite>(Metcalfe, 2017)</cite>,
              e tentar resolver antes de receber a explicação melhora a compreensão <cite>(Kapur, 2008)</cite>. Por isso o código deste livro erra de propósito no caminho, como erra o de qualquer projeto de verdade.</p>
            <ol className="cm-refs">
              <li>Freeman, S. et al. (2014). Active learning increases student performance in science, engineering, and mathematics. <i>PNAS</i>, 111(23), 8410–8415. <a href="https://doi.org/10.1073/pnas.1319030111">doi:10.1073/pnas.1319030111</a></li>
              <li>Sentance, S., Waite, J. e Kallia, M. (2019). Teaching computer programming with PRIMM: a sociocultural perspective. <i>Computer Science Education</i>, 29(2–3), 136–176. <a href="https://doi.org/10.1080/08993408.2019.1608781">doi:10.1080/08993408.2019.1608781</a></li>
              <li>Metcalfe, J. (2017). Learning from errors. <i>Annual Review of Psychology</i>, 68, 465–489. <a href="https://doi.org/10.1146/annurev-psych-010416-044022">doi:10.1146/annurev-psych-010416-044022</a></li>
              <li>Kapur, M. (2008). Productive failure. <i>Cognition and Instruction</i>, 26(3), 379–424. <a href="https://doi.org/10.1080/07370000802212669">doi:10.1080/07370000802212669</a></li>
            </ol>
            <button type="button" className="cm-entendi" onClick={fechar}>Vou abrir a IDE</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    <div className="cm-trilho">
      <AnimatePresence initial={false}>
        {!recolhida && !licenca && (
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

    <div className="cm-canto" ref={canto} style={sobe ? { transform: `translateY(${-sobe}px)` } : undefined}>
      <AnimatePresence initial={false}>
        {(recolhida || licenca) && (
          <motion.button key="circulo" layoutId="cm-pilula" type="button" className="cm-circulo" onClick={() => { setLicenca(false); recolher(false); }}
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
                  className={`cm-tema cm-tema-${id}`} onClick={() => escolherTema(id)} onKeyDown={(e) => teclaRadio(e, i, TEMAS.length, (k) => escolherTema(TEMAS[k].id))}>
                  <span className="cm-amostra"><Icone size={16} /></span>{nome}{tema === id && <Check size={15} className="cm-marca" />}
                </button>
              ))}
            </div>
            <p className="cm-titulo cm-titulo-2">Fonte</p>
            <div role="radiogroup" aria-label="Fonte do texto" className="cm-segmentos">
              {FONTES.map(({ id, nome }, i) => (
                <button key={id} type="button" role="radio" aria-checked={fonte === id} tabIndex={fonte === id ? 0 : -1} className={`cm-seg cm-fonte-${id}`}
                  onClick={() => escolherFonte(id)} onKeyDown={(e) => teclaRadio(e, i, FONTES.length, (k) => escolherFonte(FONTES[k].id))}>
                  <b aria-hidden="true">Aa</b>{nome}
                </button>
              ))}
            </div>
            <p className="cm-titulo cm-titulo-2">Tamanho</p>
            <div role="radiogroup" aria-label="Tamanho do texto" className="cm-segmentos">
              {TAMANHOS.map(({ id, nome }, i) => (
                <button key={id} type="button" role="radio" aria-checked={tamanho === id} tabIndex={tamanho === id ? 0 : -1} className={`cm-seg cm-tam-${id}`}
                  onClick={() => escolherTamanho(id)} onKeyDown={(e) => teclaRadio(e, i, TAMANHOS.length, (k) => escolherTamanho(TAMANHOS[k].id))}>
                  <b aria-hidden="true">A</b>{nome}
                </button>
              ))}
            </div>
            <p className="cm-titulo cm-titulo-2">Leitura</p>
            <button type="button" role="switch" aria-checked={direto} className="cm-chave cm-chave-2" onClick={() => definirDireto(!direto)}>
              <span>Modo direto<small>sem passo a passo: código, saídas e respostas já abertos</small></span><span className="cm-trilho-chave" aria-hidden="true"><i /></span>
            </button>
            {/* a mesma pergunta da IDE do capítulo (palco/onde.ts): muda os terminais e o "sua vez" */}
            <p className="cm-titulo cm-titulo-2">Onde você faz o projeto</p>
            <div role="radiogroup" aria-label="Onde você faz o projeto" className="cm-segmentos">
              {LUGARES.map(({ id, nome }, i) => (
                <button key={id} type="button" role="radio" aria-checked={fazer === id} tabIndex={fazer === id || (!fazer && i === 0) ? 0 : -1} className="cm-seg"
                  onClick={() => definirOnde(id)} onKeyDown={(e) => teclaRadio(e, i, LUGARES.length, (k) => definirOnde(LUGARES[k].id))}>{nome}</button>
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
