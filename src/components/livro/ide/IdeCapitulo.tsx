/**
 * A IDE do capítulo: o projeto nasce numa pasta vazia e vai sendo construído, e o leitor acompanha pelo passador.
 * Cada passo tem três momentos: abre (o que vai existir no fim, e o que o autor pensa), as ações (um arquivo que nasce,
 * código que entra, um comando que roda) e fecha ("agora você tem"). Quem avança é o leitor; antes de um comando com
 * aposta, ele aposta, e só então o terminal mostra a saída gravada do projeto real. Quem faz o projeto aqui no livro, e
 * não na IDE dele (palco/onde.ts), digita o comando no terminal (Tab completa), e o cartão "sua vez" sai. Em alguns
 * comandos, depois da saída, uma palavra do código vira um seletor: o leitor troca, e vê a saída gravada da troca
 * (modificar antes de criar, etapa 6).
 */
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Check, ChevronLeft, ChevronRight, CircleAlert, Copy, FileBraces, FileCode, FileText, Maximize2, Minimize2, X } from "lucide-react";
import { useDireto } from "../palco/direto";
import { definirOnde, sugestaoOnde, useOnde } from "../palco/onde";
import type { Onde } from "../palco/onde";
import type { Trecho } from "../../../lib/codigo.ts";
import type { AcaoIde, Aposta, PassoCap, ProblemaIde, VersaoIde } from "../../../lib/ideCapitulo.ts";
import "./ide.css";
import "./ide-capitulo.css";

/* b: o bloco lógico da ação, quando o código entra por blocos */
type Quadro = { tipo: "abre"; p: number } | { tipo: "acao"; p: number; k: number; b?: number } | { tipo: "fecha"; p: number };

const icone = (nome: string) => nome.endsWith(".py") ? <FileCode size={14} /> : /\.(jsonl?|toml|lock)$/.test(nome) ? <FileBraces size={14} /> : <FileText size={14} />;
const SINAL = { ok: "✓", erro: "✗", engano: "!", nada: "•" };
/* texto curto do livro: `assim` vira código */
const Md = ({ t }: { t: string }) => <>{t.split(/(`[^`]+`)/).map((x, i) => x.startsWith("`") && x.endsWith("`") ? <code key={i}>{x.slice(1, -1)}</code> : <Fragment key={i}>{x}</Fragment>)}</>;
/* "sua vez": o que o leitor faz na IDE dele depois de ver a ação aqui */
const DADO = /(\.(jsonl?|md|toml)$|(^|\/)\.[^/]+$)/;
/* a pasta que uma cópia traz (dados/, cofre/…) */
const pastaCopiada = (a: Extract<AcaoIde, { tipo: "copiar" }>) => a.arquivos[0].nome.split("/")[0];
function suaVez(a: AcaoIde, obra: Obra): string {
  const troque = a.tipo === "rodar" && a.variar ? ` Depois, troque \`${a.variar.trecho}\` por \`${a.variar.por}\`${a.variar.arquivo ? ` no seu \`${a.variar.arquivo}\`` : " no comando"} e rode de novo.` : "";
  return (a.suavez ?? suaVezBase(a, obra)) + troque;
}
function suaVezBase(a: AcaoIde, obra: Obra): string {
  /* o comando que chama um modelo de verdade: na máquina do leitor ele custa, pede a chave, e pode responder diferente */
  if (a.tipo === "rodar" && a.gravacao) return `Execute o comando no seu terminal, na pasta do projeto, com a sua chave no ambiente (\`OPENAI_API_KEY\`). Ele chama o ${a.gravacao.modelo} de verdade, e cada execução custa centavos. A sua nota pode sair diferente da daqui: o modelo não responde sempre igual.`;
  if (a.tipo === "rodar") return `Execute o comando no seu terminal${a.onde === "~" ? ", na sua pasta de usuário" : ", na pasta do projeto"}. Compare a saída com a do terminal aqui.`;
  if (a.tipo === "apagar") return `Apague o \`${a.arquivo}\` no seu projeto.`;
  if (a.tipo === "copiar") return `Copie a pasta \`${pastaCopiada(a)}/\` do repositório do ${obra} para o seu projeto. Digitar dado inventado não ensina nada.`;
  if (DADO.test(a.arquivo)) return a.novo ? `Crie o \`${a.arquivo}\` com este conteúdo; copiar do repositório do ${obra} vale.` : `Faça a mesma mudança no seu \`${a.arquivo}\`.`;
  return a.novo ? `Crie o \`${a.arquivo}\` na sua IDE e digite este código. Digitar, e não colar, é o que faz perceber o que não ficou claro.` : `Digite as linhas novas no seu \`${a.arquivo}\`, no mesmo lugar em que elas aparecem aqui.`;
}
/* a palavra dentro da linha que o shiki pintou: às vezes ela vem colada (` Decisao.PASSAR` num pedaço só), e aí ganha um
   pedaço próprio, com a mesma cor, para poder virar o seletor */
function palavraNaLinha(linha: HTMLElement, palavra: string): HTMLElement | null {
  const folhas = [...linha.querySelectorAll<HTMLElement>("span")].filter((x) => !x.children.length);
  const exata = folhas.find((x) => x.textContent!.trim() === palavra);
  if (exata) return exata;
  const re = new RegExp(`\\b${palavra.replace(/[^\w]/g, "\\$&")}\\b`), dona = folhas.find((x) => re.test(x.textContent!));
  if (!dona) return null;
  const t = dona.textContent!, i = t.search(re);
  const nova = dona.cloneNode() as HTMLElement, resto = dona.cloneNode() as HTMLElement;
  dona.textContent = t.slice(0, i); nova.textContent = palavra; resto.textContent = t.slice(i + palavra.length);
  dona.after(nova, resto);
  return nova;
}
/* quem fala com a IA no chat: o leitor, que pede, pergunta e segue (docs/capacidades/conversa-com-a-ia.md) */
const AUTOR = "você";
/* as falas de passagem (etapa 2): quatro jeitos de dizer o mesmo, para a conversa não soar como um botão apertado */
const FIZ = ["Fiz na minha IDE.", "Feito aqui também.", "Pronto, fiz.", "Fiz. Pode seguir."];
const SEGUE = ["E agora?", "Pode seguir.", "Certo, e depois?", "Entendi. Próximo?"];
/* onde a IDE está: num livro ou num experimento; os textos dela dizem um ou outro */
type Obra = "livro" | "experimento";
const lugares = (obra: Obra): { id: Onde; nome: string }[] => [{ id: "ide", nome: "na minha IDE" }, { id: "livro", nome: `aqui no ${obra}` }];
const junta = (s: string) => s.trim().replace(/\s+/g, " ");

/* uma fala do chat, com chave estável. O componente fica fora da IDE de propósito: definido dentro, ele seria um tipo
   novo a cada render, e o React desmontaria e remontaria a conversa inteira (e a animação de entrada rodaria de novo) */
type Fala = { chave: string; quem: "ia" | "pessoa" | "divisa"; corpo: React.ReactNode };
function Mensagem({ f, ia }: { f: Fala; ia: string }) {
  if (f.quem === "divisa") return <p className="ic-divisa">{f.corpo}</p>;
  return <div className={`ic-msg ${f.quem === "ia" ? "ic-ia" : "ic-pessoa"}`}><span className="ic-quem">{f.quem === "ia" ? ia : AUTOR}</span><div className="ic-bolha">{f.corpo}</div></div>;
}

/* como a IA conta a ação que acabou de fazer (no comando, quem rodou pode ter sido o leitor) */
function feito(a: AcaoIde, leitor = false): string {
  if (a.tipo === "rodar" && leitor) return "Executou.";
  if (a.tipo === "rodar") return `Executei \`${a.comando.length > 60 ? a.comando.slice(0, 57) + "…" : a.comando}\` no terminal.`;
  if (a.tipo === "apagar") return `Apaguei o \`${a.arquivo}\`.`;
  if (a.tipo === "copiar") return `Copiei ${a.arquivos.length} arquivos para a pasta \`${pastaCopiada(a)}/\`.`;
  return a.novo ? `Criei o \`${a.arquivo}\`.` : `Mexi no \`${a.arquivo}\`.`;
}

export default function IdeCapitulo({ acoes, passos, versoes, python, iniciais = [], abreCom = null, pasta, obra = "livro" }: { acoes: AcaoIde[]; passos: PassoCap[]; versoes: VersaoIde[];
  python: { versao: string; desde: number } | null;
  /** os arquivos com que a IDE abre: o projeto como os capítulos anteriores o deixaram */
  iniciais?: { nome: string; versao: number }[];
  /** o arquivo à vista quando a IDE abre, antes de qualquer ação */
  abreCom?: string | null;
  /** a pasta do projeto do livro, como o leitor a vê (~/<projeto>) */
  pasta: string;
  /** "experimento" numa página de experimento: os textos da IDE dizem experimento onde diriam livro */
  obra?: Obra }) {
  const LUGARES = lugares(obra);
  const direto = useDireto();
  /* a sequência do passador: abre, as ações do passo, fecha */
  const quadros = useMemo(() => passos.flatMap((p, i): Quadro[] => direto ? [
    { tipo: "abre", p: i },
    ...acoes.slice(p.de - 1, p.ate).map((_, j): Quadro => ({ tipo: "acao", p: i, k: p.de - 1 + j })),
    { tipo: "fecha", p: i },
  ] : [
    { tipo: "abre", p: i },
    ...acoes.slice(p.de - 1, p.ate).flatMap((a, j): Quadro[] => a.tipo === "editar" && a.blocos.length
      ? a.blocos.map((_, b) => ({ tipo: "acao", p: i, k: p.de - 1 + j, b }))
      : [{ tipo: "acao", p: i, k: p.de - 1 + j }]),
    { tipo: "fecha", p: i },
  ]), [acoes, passos, direto]);
  const [q, setQ] = useState(0);
  const [apostas, setApostas] = useState<Record<number, number | "pulou">>({});
  const [aberto, setAberto] = useState<string | null>(abreCom);
  /* as abas que o leitor fechou para focar; um arquivo volta quando ele o abre, ou quando a ação da vez mexe nele */
  const [fechadas, setFechadas] = useState<Set<string>>(new Set());
  const abrir = (a: string) => { setFechadas((s) => { if (!s.has(a)) return s; const n = new Set(s); n.delete(a); return n; }); setAberto(a); };
  /* o painel de baixo, como o da IDE: o terminal, ou os problemas do último comando; e a linha que um problema apontou */
  const [painel, setPainel] = useState<"terminal" | "problemas">("terminal");
  const [apontada, setApontada] = useState<{ arquivo: string; linha: number } | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [abertas, setAbertas] = useState<Set<string>>(new Set());   /* dobras do caminho do erro abertas */
  const [perguntados, setPerguntados] = useState<Record<string, string[]>>({});   /* as palavras que o leitor perguntou, por "ação:bloco" */
  const [respostas, setRespostas] = useState<Record<string, number | "pulou">>({});   /* as perguntas dos blocos, por "ação:bloco" */
  /* onde o leitor faz o projeto; aqui no livro, quem roda o comando é ele: quem rodou cada um, e o que ele digitou antes
     de acertar o da vez */
  const fazer = useOnde();
  const perguntaOnde = fazer === null && !direto;
  const [rodou, setRodou] = useState<Record<number, "leitor" | "pediu">>({});
  const [tentativas, setTentativas] = useState<{ texto: string; aviso: string | null }[]>([]);
  const [entrada, setEntrada] = useState("");
  /* modificar antes de criar: a troca à vista no comando da vez, as que o leitor já tentou (por ação), as apostas delas,
     e o seletor aberto (onde, dentro do editor) */
  const [trocaAtual, setTrocaAtual] = useState<string | null>(null);
  const [tentadas, setTentadas] = useState<Record<number, string[]>>({});
  const [apostasTroca, setApostasTroca] = useState<Record<string, number | "pulou">>({});
  const [menu, setMenu] = useState<{ x: number; y?: number; baixo?: number } | null>(null);
  const editor = useRef<HTMLDivElement>(null), menuRef = useRef<HTMLDivElement>(null), gatilho = useRef<HTMLElement | null>(null);
  const raiz = useRef<HTMLDivElement>(null);
  const codigo = useRef<HTMLDivElement>(null), terminal = useRef<HTMLDivElement>(null), campo = useRef<HTMLInputElement>(null);

  const quadro = quadros[q], passo = passos[quadro.p];
  /* até que ação o projeto já andou: no "abre", o projeto como o passo anterior deixou */
  const feitaAte = quadro.tipo === "acao" ? quadro.k : quadro.tipo === "abre" ? passo.de - 2 : passo.ate - 1;
  const acao = quadro.tipo === "acao" ? acoes[quadro.k] : null;
  /* um comando só mostra a saída depois de rodado (no interativo, o leitor digita) e apostado (se tem aposta) */
  const interativo = !direto && fazer === "livro";
  const digitada = (k: number) => !interativo || acoes[k].tipo !== "rodar" || rodou[k] !== undefined;
  const apostada = (k: number) => { const a = acoes[k]; return direto || !(a.tipo === "rodar" && a.aposta) || apostas[k] !== undefined; };
  const respondida = (k: number) => digitada(k) && apostada(k);
  const bloco = quadro.tipo === "acao" && quadro.b !== undefined && acao?.tipo === "editar" ? acao.blocos[quadro.b] : null;
  const chaveBloco = quadro.tipo === "acao" ? `${quadro.k}:${quadro.b}` : "";
  const perguntando = !!bloco?.pergunta && !direto && respostas[chaveBloco] === undefined;
  const esperando = acao?.tipo === "rodar" && !respondida(quadro.k as number);
  const aDigitar = acao?.tipo === "rodar" && !digitada(quadro.k as number);
  /* a pausa para fazer na própria IDE: quando a ação já foi toda mostrada aqui (o último bloco, ou a saída depois da aposta) */
  const ultimoBloco = !bloco || (acao?.tipo === "editar" && quadro.tipo === "acao" && quadro.b === acao.blocos.length - 1);
  const pausa = !direto && fazer !== "livro" && quadro.tipo === "acao" && !!acao && !esperando && !perguntando && ultimoBloco ? suaVez(acao, obra) : null;
  /* a troca só se oferece depois que o comando do livro rodou; a aposta de uma troca segura o seguir, como a do livro */
  const variar = acao?.tipo === "rodar" && !esperando ? acao.variar ?? null : null;
  const troca = variar && trocaAtual ? variar.opcoes.find((o) => o.id === trocaAtual) ?? null : null;
  const apostandoTroca = !!troca?.aposta && !direto && apostasTroca[troca.id] === undefined;

  /* o projeto depois da ação feitaAte: a versão de cada arquivo, e o que nasceu ou mudou neste passo */
  const projeto = useMemo(() => {
    const arquivos: Record<string, number> = Object.fromEntries(iniciais.map((f) => [f.nome, f.versao]));
    const marcas = new Map<string, "U" | "M">();
    const marcar = (nome: string, novo: boolean, k: number) => { if (k >= passo.de - 1) marcas.set(nome, novo || marcas.get(nome) === "U" ? "U" : "M"); };
    for (let k = 0; k <= feitaAte; k++) {
      const a = acoes[k];
      if (a.tipo === "editar") { marcar(a.arquivo, a.novo, k); arquivos[a.arquivo] = a.versao; }
      if (a.tipo === "copiar") for (const f of a.arquivos) { marcar(f.nome, true, k); arquivos[f.nome] = f.versao; }
      if (a.tipo === "apagar") { delete arquivos[a.arquivo]; marcas.delete(a.arquivo); }
      if (a.tipo === "rodar" && (k < feitaAte || respondida(k) || quadro.tipo !== "acao")) {
        for (const g of a.gerados) { marcar(g.nome, g.novo, k); arquivos[g.nome] = g.versao; }
        for (const n of a.apagados) { delete arquivos[n]; marcas.delete(n); }
      }
    }
    return { arquivos, marcas };
  }, [feitaAte, acoes, iniciais, passo.de, apostas, rodou, interativo, direto, quadro.tipo]);

  /* o arquivo à vista: o da ação, ou o primeiro que o comando criou ou mudou, ou o que o leitor abriu */
  const daAcao = !acao ? null : acao.tipo === "editar" ? acao.arquivo : acao.tipo === "copiar" ? acao.arquivos[0].nome
    : acao.tipo === "rodar" && !esperando ? acao.gerados.find((g) => versoes[g.versao].html)?.nome ?? acao.variar?.arquivo ?? null : null;
  useEffect(() => { if (daAcao) abrir(daAcao); }, [q, daAcao]);
  const nomes = Object.keys(projeto.arquivos).sort((a, b) => Number(a.includes("/")) - Number(b.includes("/")) || a.localeCompare(b));
  /* as abas: o que nasceu ou mudou neste passo, e o que o leitor abriu; menos as que ele fechou */
  const legivel = (a: string) => projeto.arquivos[a] !== undefined && !!versoes[projeto.arquivos[a]].html;
  const abertoValido = aberto && projeto.arquivos[aberto] !== undefined && !fechadas.has(aberto) ? aberto : null;
  const abas = [...projeto.marcas.keys()].filter((a) => legivel(a) && !fechadas.has(a));
  if (abertoValido && !abas.includes(abertoValido) && legivel(abertoValido)) abas.push(abertoValido);
  /* sem nada aberto: no começo, o primeiro arquivo; depois que o leitor fechou tudo, o editor fica vazio */
  const vista = abertoValido ?? abas[0] ?? (fechadas.size ? null : nomes.find(legivel) ?? null);
  /* com muitas abas (uma cópia de onze notas), a faixa rola até a aba à vista, sem mexer na rolagem da página */
  const faixaAbas = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const f = faixaAbas.current, a = f?.querySelector<HTMLElement>(".ic-aba[data-ativa]");
    if (f && a && (a.offsetLeft < f.scrollLeft || a.offsetLeft + a.offsetWidth > f.scrollLeft + f.clientWidth)) f.scrollLeft = a.offsetLeft - 16;
  }, [vista, abas.length]);
  const fecharAba = (a: string) => {
    const i = abas.indexOf(a), resto = abas.filter((x) => x !== a);
    setFechadas((s) => new Set(s).add(a));
    if (a === vista) setAberto(resto[Math.min(i, resto.length - 1)] ?? null);
  };
  const trocado = !!troca && troca.versao !== undefined && variar?.arquivo === vista;
  const versao = vista ? versoes[trocado ? troca!.versao! : projeto.arquivos[vista]] : null;
  const alteradas = trocado ? troca!.alteradas ?? [] : !acao ? [] : acao.tipo === "editar" && acao.arquivo === vista ? acao.alteradas
    : acao.tipo === "rodar" && !esperando ? acao.gerados.find((g) => g.nome === vista)?.alteradas ?? [] : [];

  /* destaca as linhas da ação (e, no bloco, as do bloco), marca as palavras do bloco e leva o editor até elas */
  const blocoVisto = bloco && acao?.tipo === "editar" && acao.arquivo === vista ? bloco : null;
  useEffect(() => {
    const el = codigo.current;
    if (!el) return;
    el.classList.toggle("ic-com-bloco", !!blocoVisto);
    el.querySelectorAll<HTMLElement>(".ic-termo").forEach((t) => { t.classList.remove("ic-termo"); delete t.dataset.termo; });
    el.querySelectorAll<HTMLElement>(".line").forEach((l) => {
      const n = Number(l.dataset.n), noBloco = !!blocoVisto && n >= blocoVisto.a && n <= blocoVisto.z;
      l.classList.toggle("ide-novo", alteradas.includes(n));
      l.classList.toggle("ic-bloco", noBloco);
      if (noBloco) for (const sp of l.querySelectorAll<HTMLElement>("span")) {
        const t = blocoVisto!.termos.find((x) => x.marca && sp.textContent!.trim() === x.marca);
        if (t) { sp.classList.add("ic-termo"); sp.dataset.termo = t.chave; }
      }
    });
    /* a palavra que se troca: um toque nela abre as opções, como um seletor no próprio código */
    el.querySelectorAll<HTMLElement>(".ic-varia").forEach((t) => { t.classList.remove("ic-varia"); ["role", "tabindex", "aria-haspopup", "aria-label"].forEach((x) => t.removeAttribute(x)); });
    const noArquivo = variar?.arquivo === vista ? variar : null;
    if (noArquivo?.linha) {
      const palavra = troca?.rotulo ?? noArquivo.original;
      const linhaV = el.querySelector<HTMLElement>(`.line[data-n="${noArquivo.linha}"]`), sp = linhaV && palavraNaLinha(linhaV, palavra);
      if (sp) { sp.classList.add("ic-varia"); sp.setAttribute("role", "button"); sp.tabIndex = 0; sp.setAttribute("aria-haspopup", "menu"); sp.setAttribute("aria-label", `Trocar ${palavra}`); }
    }
    const naLinha = apontada?.arquivo === vista ? apontada.linha : undefined;
    el.querySelectorAll<HTMLElement>(".line").forEach((l) => l.classList.toggle("ic-linha-problema", Number(l.dataset.n) === naLinha));
    const alvo = naLinha ?? blocoVisto?.a ?? alteradas[0] ?? noArquivo?.linha;
    const linha = alvo ? el.querySelector<HTMLElement>(`.line[data-n="${alvo}"]`) : null;
    el.scrollTo({ top: linha ? Math.max(linha.offsetTop - 60, 0) : 0 });
  }, [versao, alteradas.join(","), blocoVisto, variar, troca, apontada]);
  /* perguntar o que é uma palavra: vira mais uma fala da conversa, e fica nela */
  const perguntar = (chave: string) => setPerguntados((v) => (v[chaveBloco] ?? []).includes(chave) ? v : { ...v, [chaveBloco]: [...(v[chaveBloco] ?? []), chave] });
  const clicarCodigo = (e: React.MouseEvent) => {
    const v = (e.target as HTMLElement).closest<HTMLElement>(".ic-varia");
    if (v) { abrirMenu(v); return; }
    const t = (e.target as HTMLElement).closest<HTMLElement>(".ic-termo"); if (t?.dataset.termo) perguntar(t.dataset.termo);
  };
  const teclaCodigo = (e: React.KeyboardEvent) => {
    const v = (e.target as HTMLElement).closest<HTMLElement>(".ic-varia");
    if (v && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); abrirMenu(v); }
  };
  /* o seletor abre junto da palavra: embaixo dela no editor; em cima dela no terminal, que fica no pé da janela */
  const abrirMenu = (alvo: HTMLElement) => {
    const base = editor.current?.getBoundingClientRect(), r = alvo.getBoundingClientRect();
    if (!base) return;
    gatilho.current = alvo;
    const x = Math.max(8, Math.min(r.left - base.left - 6, base.width - 236));
    setMenu(alvo.closest(".ide-terminal") ? { x, baixo: base.bottom - r.top + 6 } : { x, y: r.bottom - base.top + 6 });
  };
  const fecharMenu = () => { setMenu(null); gatilho.current?.focus({ preventScroll: true }); };
  const escolher = (id: string | null) => {
    setMenu(null);
    if (quadro.tipo !== "acao" || !variar) return;
    setTrocaAtual(id);
    if (id) setTentadas((t) => (t[quadro.k] ?? []).includes(id) ? t : { ...t, [quadro.k]: [...(t[quadro.k] ?? []), id] });
    if (variar.arquivo) abrir(variar.arquivo);
  };
  useEffect(() => {
    if (!menu) return;
    menuRef.current?.querySelector<HTMLElement>("[aria-checked='true']")?.focus({ preventScroll: true });
    const fora = (e: MouseEvent) => { if (!menuRef.current?.contains(e.target as Node) && !(e.target as HTMLElement).closest(".ic-varia")) setMenu(null); };
    addEventListener("mousedown", fora);
    return () => removeEventListener("mousedown", fora);
  }, [menu]);
  const teclaMenu = (e: React.KeyboardEvent) => {
    const itens = [...menuRef.current!.querySelectorAll<HTMLElement>("[role='menuitemradio']")], i = itens.indexOf(document.activeElement as HTMLElement);
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); fecharMenu(); }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); itens[(i + (e.key === "ArrowDown" ? 1 : itens.length - 1)) % itens.length]?.focus(); }
    if (e.key === "Tab") setMenu(null);
  };

  /* o terminal: tudo o que já rodou no capítulo, e o comando da vez (com a aposta, se houver) */
  const rodados = acoes.map((a, k) => ({ a, k })).filter(({ a, k }) => a.tipo === "rodar" && k <= feitaAte && (k < feitaAte || respondida(k) || quadro.tipo !== "acao"));
  useEffect(() => { const t = requestAnimationFrame(() => { const el = terminal.current; if (el) el.scrollTop = el.scrollHeight; }); return () => cancelAnimationFrame(t); }, [q, apostas, rodou, tentativas, tentadas, apostasTroca]);

  /* cada comando começa com a linha limpa; se o leitor está na IDE, o cursor já vai para o terminal (sem rolar a página) */
  useEffect(() => { setTentativas([]); setEntrada(""); setTrocaAtual(null); setMenu(null); setApontada(null); }, [q]);
  /* quando o terminal pede alguma coisa (digitar, apostar), ele volta para a frente */
  useEffect(() => { if (esperando || apostandoTroca) setPainel("terminal"); }, [esperando, apostandoTroca]);
  useEffect(() => { if (aDigitar && raiz.current?.contains(document.activeElement)) campo.current?.focus({ preventScroll: true }); }, [q, aDigitar]);
  const rodarComando = (quem: "leitor" | "pediu") => { if (quadro.tipo === "acao") setRodou((r) => ({ ...r, [quadro.k]: quem })); };
  /* o que o terminal do livro responde ao que o leitor digita: o comando da vez roda; o resto ganha uma dica do livro */
  const executar = (bruto: string) => {
    if (acao?.tipo !== "rodar") return;
    const cmd = junta(bruto), certo = junta(acao.comando), nome = cmd.split(" ")[0];
    if (cmd === certo) { rodarComando("leitor"); return; }
    const aviso = !cmd ? null
      : cmd === "help" ? `Este terminal mostra a saída gravada do projeto do ${obra}, e só executa o comando deste passo: ${acao.comando}`
      : certo.startsWith(cmd) ? "Quase: o comando é mais longo. Aperte Tab para completar."
      : nome === certo.split(" ")[0] ? `Não é esse. O comando deste passo é: ${acao.comando}`
      : `${nome}: este terminal do ${obra} só executa o comando deste passo. Digite help.`;
    setTentativas((t) => [...t, { texto: bruto, aviso }]);
  };
  const tecla = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (acao?.tipo !== "rodar") return;
    if (e.key === "Enter") { e.preventDefault(); const v = entrada; setEntrada(""); executar(v); return; }
    if (e.key === "Tab") { e.preventDefault(); if (junta(acao.comando).startsWith(junta(entrada))) setEntrada(acao.comando); return; }
    if (e.key === "c" && e.ctrlKey) { e.preventDefault(); setTentativas((t) => [...t, { texto: `${entrada}^C`, aviso: null }]); setEntrada(""); }
  };

  const apostar = (op: number | "pulou") => {
    if (quadro.tipo !== "acao" || acao?.tipo !== "rodar") return;
    setApostas((a) => ({ ...a, [quadro.k]: op }));
    dispatchEvent(new CustomEvent("fontmar:apostou", { detail: acao.id }));   /* o placar espera por isto */
  };
  const irPasso = (i: number) => setQ(quadros.findIndex((x) => x.tipo === "abre" && x.p === i));
  /* continuar de onde parou (docs/capacidades/imersao-ide.md, etapa 3): o passo em que o leitor está e os passos que
     ele já fechou ficam no navegador, por página; ao voltar, o livro oferece continuar dali */
  const chaveProgresso = typeof location === "undefined" ? "" : `fontmar:ide:${location.pathname}`;
  const [salvos, setSalvos] = useState<number[]>([]);
  const [retomar, setRetomar] = useState<number | null>(null);
  useEffect(() => {
    try {
      const g = JSON.parse(localStorage.getItem(chaveProgresso) || "null") as { atual: number; feitos: number[] } | null;
      if (!g) return;
      setSalvos(g.feitos.filter((n) => n >= 0 && n < passos.length));
      if (g.atual > 0 && g.atual < passos.length) setRetomar(g.atual);
    } catch { /* sem armazenamento: começa do começo */ }
  }, []);
  /* passo feito: o leitor já chegou ao "fecha" dele, agora ou numa visita anterior */
  const feitos = new Set([...salvos, ...quadros.slice(0, q + 1).filter((x) => x.tipo === "fecha").map((x) => x.p)]);
  useEffect(() => {
    if (q === 0 && retomar !== null) return;   /* ainda não decidiu se continua: não apaga o que estava guardado */
    /* no fecho de um passo, o lugar de voltar já é o próximo */
    const atual = quadro.tipo === "fecha" ? Math.min(quadro.p + 1, passos.length - 1) : quadro.p;
    try { localStorage.setItem(chaveProgresso, JSON.stringify({ atual, feitos: [...feitos].sort((a, b) => a - b) })); } catch { /* sem armazenamento */ }
  }, [q]);
  /* modo foco (etapa 4): a IDE toma a tela inteira, sem sumário, cabeçalho e pílula; Esc volta ao livro */
  const [foco, setFoco] = useState(false);
  useEffect(() => {
    if (!foco) return;
    const h = document.documentElement, antes = h.style.overflow;
    h.style.overflow = "hidden"; h.classList.add("ic-em-foco");
    raiz.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setFoco(false); };
    addEventListener("keydown", esc);
    return () => { h.style.overflow = antes; h.classList.remove("ic-em-foco"); removeEventListener("keydown", esc); };
  }, [foco]);
  const continuar = () => { if (retomar !== null) irPasso(retomar); setRetomar(null); };
  const doInicio = () => { setRetomar(null); setSalvos([]); try { localStorage.removeItem(chaveProgresso); } catch { /* sem armazenamento */ } };
  /* ao entrar ou sair do modo direto, a sequência muda: o leitor fica no mesmo passo */
  const passoAtual = useRef(0);
  passoAtual.current = quadro.p;
  useEffect(() => { setQ(quadros.findIndex((x) => x.tipo === "abre" && x.p === passoAtual.current)); }, [direto]);
  /* as setas do teclado avançam e voltam, quando o foco está na IDE */
  const teclas = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).closest("input, button.ic-opcao-aposta, .ide-opcoes, .ic-opcoes, .ic-menu-troca")) return;
    if (e.key === "ArrowRight" && podeSeguir) { setQ(q + 1); e.preventDefault(); }
    if (e.key === "ArrowLeft" && q > 0) { setQ(q - 1); e.preventDefault(); }
  };

  const prompt = (onde: string) => <><span className="ide-pr">voce@maquina</span>:<span className="ide-cwd">{onde}</span>$ </>;
  const saida = (t: Trecho[], k: number | string) => t.map((x, j) => x.tipo === "linha" ? <div key={j} className={x.c || undefined}>{x.l || " "}</div> : (
    <div key={j} className="ic-dobra">
      <button type="button" onClick={() => setAbertas((s) => { const n = new Set(s); const c = `${k}:${j}`; n.has(c) ? n.delete(c) : n.add(c); return n; })}>
        ⋯ {x.linhas.length} linhas do caminho do erro fora do seu código
      </button>
      {abertas.has(`${k}:${j}`) && x.linhas.map(([l, c], m) => <div key={m} className={`ic-dobrado ${c}`}>{l || " "}</div>)}
    </div>));

  /* o que o leitor digitou antes de acertar o comando da vez fica na tela, logo antes dele, como num terminal */
  const errados = acao?.tipo === "rodar" && tentativas.map((t, j) => <div key={`t${j}`}><div>{prompt(acao.onde)}{t.texto}</div>{t.aviso && <div className="ic-livro">{t.aviso}</div>}</div>);
  const cartaoAposta = (ap: Aposta, responder: (op: number | "pulou") => void) => <div className="ide-aposta" role="group" aria-label="Invista antes de ver">
    <b>invista antes de ver</b>
    <p>{ap.pergunta}</p>
    <div className="ide-opcoes">
      {ap.opcoes.map((o, j) => <button key={j} type="button" onClick={() => responder(j)}>{o}</button>)}
      <button type="button" className="ide-pular" onClick={() => responder("pulou")}>só mostrar</button>
    </div>
  </div>;
  const veredito = (ap: Aposta, feita: number) => <div className={`ide-veredito ${feita === ap.certa ? "ide-acertou" : "ide-errou"}`}>
    {feita === ap.certa ? <Check size={14} /> : <X size={14} />}
    {feita === ap.certa ? "Você acertou." : `Você investiu em "${ap.opcoes[feita]}". Saiu: ${ap.opcoes[ap.certa]}.`}
  </div>;
  /* as trocas que o leitor rodou num comando: cada uma com o comando, a aposta (se tem) e a saída gravada dela */
  const trocasRodadas = (a: Extract<AcaoIde, { tipo: "rodar" }>, k: number) => (tentadas[k] ?? []).map((id) => {
    const o = a.variar!.opcoes.find((x) => x.id === id)!, feita = apostasTroca[id];
    const pendente = !!o.aposta && !direto && feita === undefined;
    return <div key={id}><div>{prompt(a.onde)}{o.comando}</div>
      {pendente ? cartaoAposta(o.aposta!, (op) => setApostasTroca((v) => ({ ...v, [id]: op })))
        : <>{o.aposta && typeof feita === "number" && veredito(o.aposta, feita)}{saida(o.saida, `${k}:${id}`)}</>}</div>;
  });
  const secoes = [...new Set(passos.map((p) => p.secao))];
  const apostaFeita = acao?.tipo === "rodar" && acao.aposta && typeof apostas[quadro.k as number] === "number" ? apostas[quadro.k as number] as number : null;

  /* ===== a conversa do chat: o capítulo inteiro até aqui, como mensagens. O que já foi dito fica; só entra o novo ===== */
  const [aba, setAba] = useState<"Claude Code" | "Codex">("Claude Code");
  const conversa = useRef<HTMLDivElement>(null);
  const [digitando, setDigitando] = useState(false);
  /* quantas falas do quadro atual já entraram (o resto ainda vai entrar) */
  const [visiveis, setVisiveis] = useState(Number.POSITIVE_INFINITY);
  const visiveisRef = useRef(Number.POSITIVE_INFINITY);
  visiveisRef.current = visiveis;
  const ia = (chave: string, corpo: React.ReactNode): Fala => ({ chave, quem: "ia", corpo });
  const pessoa = (chave: string, corpo: React.ReactNode): Fala => ({ chave, quem: "pessoa", corpo });
  /* o capítulo começa com a conversa esperando o primeiro pedido do leitor; quem o envia é ele, no compositor */
  const [comecou, setComecou] = useState(false);
  const esperaPedido = q === 0 && !comecou && !direto;
  const enviou = useRef(false);
  /* o começo também é conversa (etapa 3): a IA pergunta se continua de onde o leitor parou e onde ele vai fazer o
     projeto; as respostas dele ficam na conversa (a de onde fazer, junto com o primeiro pedido) */
  const [inicio, setInicio] = useState<{ retomou?: { de: number; continuar: boolean }; onde?: Onde }>({});
  const perguntaRetomar = q === 0 && retomar !== null;
  const perguntandoOnde = q === 0 && perguntaOnde && !perguntaRetomar;
  const ondeNome = (o: Onde) => (o === "ide" ? `Na minha IDE, ao lado do ${obra}.` : `Aqui no ${obra} mesmo.`);
  const falasDoInicio = (ps: PassoCap): Fala[] => {
    const fs: Fala[] = [{ chave: "d", quem: "divisa", corpo: <>passo {ps.n} · {ps.titulo}</> }];
    const r = inicio.retomou ?? (perguntaRetomar ? { de: retomar!, continuar: undefined } : null);
    if (r) {
      fs.push(ia("rq", <p>Você parou no passo {r.de + 1}, <b>{passos[r.de].titulo}</b>. Continuo de lá?</p>));
      if (r.continuar === undefined) return fs;
      fs.push(pessoa("rr", <p>{r.continuar ? `Continua do passo ${r.de + 1}.` : "Começa do início."}</p>));
    }
    if (inicio.onde || perguntandoOnde) fs.push(ia("oq", <p>Antes de começar: você vai fazer o projeto na sua IDE, ao lado do {obra}, ou aqui mesmo? Na sua IDE, eu rodo os comandos aqui e você repete na sua máquina. Aqui, você digita os comandos no terminal da IDE.</p>));
    if (esperaPedido || perguntandoOnde) return fs;
    return [...fs, pessoa("p", <p>{inicio.onde && `${ondeNome(inicio.onde)} `}{ps.pedido}</p>)];
  };
  /* as dúvidas que o leitor perguntou, por ação (etapa 4): a pergunta e a resposta entram no fim do que a ação mostrou */
  const [duvidasFeitas, setDuvidasFeitas] = useState<Record<number, number[]>>({});
  const falas = (x: Quadro, i: number): Fala[] => {
    const f = falasDoQuadro(x, i);
    if (x.tipo !== "acao" || !duvidasFeitas[x.k]) return f;
    const a = acoes[x.k];
    if (a.tipo === "editar" && x.b !== undefined && x.b < a.blocos.length - 1) return f;
    return [...f, ...duvidasFeitas[x.k].flatMap((n) => [pessoa(`dq-${n}`, <p>{a.duvidas![n].pergunta}</p>), ia(`dr-${n}`, <p><Md t={a.duvidas![n].resposta} /></p>)])];
  };
  const falasDoQuadro = (x: Quadro, i: number): Fala[] => {
    const atual = i === q, ps = passos[x.p];
    if (x.tipo === "abre" && i === 0 && (esperaPedido || perguntandoOnde || perguntaRetomar)) return falasDoInicio(ps);
    if (x.tipo === "abre") return [
      ...(i === 0 ? falasDoInicio(ps) : [{ chave: "d", quem: "divisa", corpo: <>passo {ps.n} · {ps.titulo}</> } as Fala, pessoa("p", <p>{ps.pedido}</p>)]),
      ia("i", <>{ps.antes.map((t, k) => <p key={k}><Md t={t} /></p>)}<p><b>No fim deste passo:</b> <Md t={ps.objetivo} /></p></>),
    ];
    if (x.tipo === "fecha") return [ia("f", <><p className="ic-temos">✓ <b>Pronto. Agora você tem:</b> <Md t={ps.temos} /></p>{ps.depois.map((t, k) => <p key={k}><Md t={t} /></p>)}</>)];
    const a = acoes[x.k];
    if (x.b === undefined || a.tipo !== "editar") {
      const comAposta = a.tipo === "rodar" && !!a.aposta && !direto, aposta = comAposta ? apostas[x.k] : undefined;
      /* no terminal interativo, o leitor roda: o chat pede o comando, e a aposta vem depois do Enter, antes da saída */
      const doLeitor = a.tipo === "rodar" && interativo, quem = rodou[x.k];
      const vez = doLeitor ? [ia("c", <p>Agora é você: digite no terminal da IDE <code>{(a as Extract<AcaoIde, { tipo: "rodar" }>).comando}</code> e aperte Enter.</p>),
        ...(quem === "pediu" ? [pessoa("rp", <p>Executa pra mim.</p>)] : [])] : [];
      if (doLeitor && quem === undefined) return vez;
      const pede = comAposta ? [ia("e", doLeitor ? <p>Antes de ver a saída: o que você acha que vai acontecer? Invista comigo no terminal.</p>
        : <p>Antes de eu executar <code>{(a as Extract<AcaoIde, { tipo: "rodar" }>).comando.split(" ").slice(0, 3).join(" ")}</code>: o que você acha que vai acontecer? Invista comigo no terminal.</p>)] : [];
      if (comAposta && aposta === undefined) return [...vez, ...pede];
      return [
        ...vez,
        ...pede,
        ...(aposta !== undefined ? [pessoa("ap", <p>{aposta === "pulou" ? "Só me mostra." : `Meu investimento: ${(a as Extract<AcaoIde, { tipo: "rodar" }>).aposta!.opcoes[aposta]}.`}</p>)] : []),
        ia("n", <p><Md t={feito(a, quem === "leitor")} /> <Md t={a.nota} /></p>),
        ...(a.tipo === "rodar" && a.variar ? trocasNoChat(a, x.k) : []),
      ];
    }
    const b = a.blocos[x.b], chave = `${x.k}:${x.b}`, r = respostas[chave];
    const ja = perguntados[chave] ?? [];
    return [
      ...(x.b === 0 ? [ia("n0", <p><Md t={feito(a)} /> <Md t={a.nota} /> Vamos por partes: são {a.blocos.length} {a.blocos.length === 1 ? "bloco" : "blocos"}.</p>)] : []),
      ia("b", <>
        <p className="ic-bloco-titulo">bloco {x.b + 1} de {a.blocos.length} · {b.titulo} <span>(linhas {b.a}{b.z > b.a ? `–${b.z}` : ""})</span></p>
        <p><Md t={b.texto} /></p>
        {b.termos.length > 0 && <div className="ic-termos">{b.termos.map((t) => atual
          ? <button key={t.chave} type="button" aria-pressed={ja.includes(t.chave)} onClick={() => perguntar(t.chave)}><code>{t.rotulo}</code></button>
          : <code key={t.chave} className="ic-termo-fixo">{t.rotulo}</code>)}</div>}
      </>),
      ...ja.flatMap((c) => { const t = b.termos.find((y) => y.chave === c)!; return [pessoa(`tq-${c}`, <p>O que é <code>{t.rotulo}</code>?</p>), ia(`tr-${c}`, <p>{t.texto}</p>)]; }),
      ...(b.pergunta ? [
        ia("pq", <><p><b>Antes de seguir, me diz:</b> {b.pergunta.texto}</p>
          {r === undefined && atual && !direto && <div className="ic-opcoes">
            {b.pergunta.opcoes.map((o, j) => <button key={j} type="button" onClick={() => setRespostas((v) => ({ ...v, [chave]: j }))}>{o}</button>)}
            <button type="button" className="ic-pular" onClick={() => setRespostas((v) => ({ ...v, [chave]: "pulou" }))}>não sei, me mostra</button>
          </div>}</>),
        ...(r !== undefined ? [
          pessoa("pr", <p>{r === "pulou" ? "Não sei, me mostra." : b.pergunta.opcoes[r]}</p>),
          ia("pp", <p><b className={r === b.pergunta.certa ? "ic-ok" : "ic-nao"}>{r === b.pergunta.certa ? "Isso." : r === "pulou" ? `É "${b.pergunta.opcoes[b.pergunta.certa]}".` : `Não: é "${b.pergunta.opcoes[b.pergunta.certa]}".`}</b> {b.pergunta.porque}</p>),
        ] : []),
      ] : []),
    ];
  };
  /* o convite para trocar, e cada troca que o leitor fez: a pergunta dele, a aposta (se tem) e o comentário */
  function trocasNoChat(a: Extract<AcaoIde, { tipo: "rodar" }>, k: number): Fala[] {
    const fs: Fala[] = [ia("v", <p><Md t={a.variar!.convite} /></p>)];
    for (const id of tentadas[k] ?? []) {
      const o = a.variar!.opcoes.find((x) => x.id === id)!, feita = apostasTroca[id];
      fs.push(pessoa(`vp-${id}`, <p>E com <code>{o.rotulo}</code>?</p>));
      if (o.aposta && !direto) {
        if (feita === undefined) { fs.push(ia(`ve-${id}`, <p>Antes de ver: invista comigo no terminal.</p>)); break; }
        fs.push(pessoa(`va-${id}`, <p>{feita === "pulou" ? "Só me mostra." : `Meu investimento: ${o.aposta.opcoes[feita]}.`}</p>));
      }
      fs.push(ia(`vn-${id}`, <p><Md t={o.nota} /></p>));
    }
    return fs;
  }
  /* o ritmo de um chat de verdade: a fala do leitor entra na hora em que ele age; a da IA vem depois do "digitando".
     Só entra o que é novo; voltar, o modo direto e quem pede menos movimento veem tudo de uma vez. */
  const falasAgora = falas(quadro, q);
  const tipos = falasAgora.map((f) => f.quem[0]).join("");
  const qAnterior = useRef(q);
  const calmo = () => direto || (typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const avancou = q > qAnterior.current, voltou = q < qAnterior.current, pediu = enviou.current;
    qAnterior.current = q; enviou.current = false;
    /* a abertura de um passo não pede nada ao leitor: quando ele avança até ela, a conversa emenda sozinha na primeira
       ação (docs/capacidades/imersao-ide.md, etapa 2). Voltando, ela fica parada, para reler. */
    const emendar = (avancou || pediu) && quadros[q].tipo === "abre" && q < quadros.length - 1;
    const relogios: ReturnType<typeof setTimeout>[] = [];
    const seguirSozinho = (ms: number) => relogios.push(setTimeout(() => setQ((x) => (x === q ? x + 1 : x)), ms));
    if (calmo() || voltou) { setVisiveis(Number.POSITIVE_INFINITY); setDigitando(false); if (emendar) seguirSozinho(0); return () => relogios.forEach(clearTimeout); }
    let j = avancou ? 0 : Math.min(visiveisRef.current, tipos.length);
    if (j >= tipos.length) return;
    const proxima = () => {
      while (j < tipos.length && tipos[j] !== "i") j += 1;   /* o leitor e a divisa não "digitam" */
      setVisiveis(j);
      if (j >= tipos.length) { setDigitando(false); if (emendar) seguirSozinho(700); return; }
      setDigitando(true);
      relogios.push(setTimeout(() => { j += 1; setDigitando(false); setVisiveis(j); relogios.push(setTimeout(proxima, 180)); }, 650));
    };
    proxima();
    return () => relogios.forEach(clearTimeout);
  }, [q, tipos, direto, quadros]);
  /* seguir espera a aposta e a resposta; a conversa não segura o leitor: quem segue antes vê o resto já escrito */
  const podeSeguir = q < quadros.length - 1 && !esperando && !perguntando && !apostandoTroca && !esperaPedido && !perguntandoOnde && !perguntaRetomar;
  /* o que o leitor diz para sair de um quadro: entre blocos, pede o próximo; depois de uma ação, quem faz na própria IDE
     diz que fez, quem faz aqui pede para seguir; no fecho, o pedido do passo seguinte (que entra na abertura dele) */
  const passagem = (x: Quadro, i: number): string | null => {
    if (x.tipo === "fecha") return i < quadros.length - 1 ? passos[x.p + 1].pedido : null;
    if (x.tipo === "abre") return "Pode começar.";
    const a = acoes[x.k];
    if (a.tipo === "editar" && x.b !== undefined && x.b < a.blocos.length - 1) return "E o próximo?";
    return (!direto && fazer !== "livro" ? FIZ : SEGUE)[i % 4];
  };
  /* o compositor: a fala sugerida, que o leitor envia; quando o terminal ou o chat pedem outra coisa, a caixa diz o quê */
  const aguardando = aDigitar ? "Digite o comando no terminal." : esperando || apostandoTroca ? "Invista no terminal antes de ver a saída."
    : perguntando ? "Responda a pergunta acima." : null;
  /* enviar o primeiro pedido: a conversa do começo segue dali, e a abertura emenda na primeira ação */
  const comecar = () => { enviou.current = true; setVisiveis(falasAgora.length); setComecou(true); };
  const sugestao: { texto: string; enviar: () => void } | null = perguntandoOnde || perguntaRetomar ? null
    : esperaPedido ? { texto: passos[0].pedido, enviar: comecar }
    : aguardando || q === quadros.length - 1 ? null : { texto: passagem(quadro, q)!, enviar: () => setQ(q + 1) };
  /* as respostas rápidas das perguntas do começo; a que o aparelho sugere vem em destaque */
  const rapidas: { rotulo: string; texto: string; destaque: boolean; enviar: () => void }[] = perguntaRetomar ? [
    { rotulo: `Continuar do passo ${retomar! + 1}`, texto: `Continua do passo ${retomar! + 1}.`, destaque: true,
      enviar: () => { setInicio((v) => ({ ...v, retomou: { de: retomar!, continuar: true } })); setComecou(true); continuar(); } },
    { rotulo: "Começar do início", texto: "Começa do início.", destaque: false,
      enviar: () => { setVisiveis(falasAgora.length); setInicio((v) => ({ ...v, retomou: { de: retomar!, continuar: false } })); doInicio(); } },
  ] : perguntandoOnde ? LUGARES.map((l) => ({ rotulo: l.nome[0].toUpperCase() + l.nome.slice(1), texto: `${ondeNome(l.id)} ${passos[0].pedido}`, destaque: l.id === sugestaoOnde(),
    enviar: () => { setInicio((v) => ({ ...v, onde: l.id })); definirOnde(l.id); comecar(); } })) : [];
  /* as dúvidas da ação da vez, depois que ela foi toda mostrada; a que já foi perguntada sai das opções */
  const duvidasAgora = quadro.tipo === "acao" && acao?.duvidas && ultimoBloco && !aguardando
    ? acao.duvidas.map((d, n) => ({ ...d, n })).filter((d) => !(duvidasFeitas[quadro.k] ?? []).includes(d.n)) : [];
  const perguntarDuvida = (n: number) => {
    if (quadro.tipo !== "acao") return;
    setVisiveis(falasAgora.length);
    setDuvidasFeitas((v) => ({ ...v, [quadro.k]: [...(v[quadro.k] ?? []), n] }));
  };
  const vazia = rapidas.length ? "Escolha uma resposta acima." : aguardando ?? (q === quadros.length - 1 ? `Fim do ${obra === "experimento" ? "experimento" : "capítulo"}.` : `Mensagem para o ${aba}`);
  /* a conversa até aqui: o que já passou leva a fala com que o leitor saiu de cada ação */
  const historia = quadros.slice(0, q + 1).flatMap((x, i) => {
    const f = i === q ? falasAgora.slice(0, visiveis) : [...falas(x, i), ...(x.tipo === "acao" ? [pessoa("passa", <p>{passagem(x, i)}</p>)] : [])];
    return f.map((y) => <Mensagem key={`${i}:${y.chave}`} f={y} ia={aba} />);
  });
  /* desce a conversa quando entra fala nova; se o leitor subiu para reler, só desce quando ele avança */
  const ultimoQ = useRef(q);
  useEffect(() => {
    const el = conversa.current;
    if (!el) return;
    const mudouQ = ultimoQ.current !== q; ultimoQ.current = q;
    const perto = el.scrollHeight - el.scrollTop - el.clientHeight < 200;
    if (mudouQ || perto) el.scrollTo({ top: el.scrollHeight, behavior: calmo() || Math.abs(el.scrollHeight - el.scrollTop) > 4000 ? "auto" : "smooth" });
  }, [historia.length, digitando, q]);
  const cartaoSuaVez = pausa && <>
    <b><svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="1" width="3" height="10" rx="1" /><rect x="7" y="1" width="3" height="10" rx="1" /></svg>sua vez</b>
    <span><Md t={pausa} /></span>
    {passo.volta && <span className="ic-volta">Perdeu o ritmo? <code>git checkout {passo.volta.tag}</code> traz o projeto como estava no começo deste passo, no clone de <a href={passo.volta.repositorio}>{passo.volta.repositorio.replace(/^https:\/\//, "")}</a>.</span>}
  </>;
  /* o rodapé: o git existe depois do uv init; os problemas são os do último comando à vista; o Python, o do .python-version */
  const temGit = iniciais.length > 0 || (feitaAte >= 0 && rodados.length > 0);
  const ultimoRodado = rodados.at(-1)?.a;
  const fonteProblemas = troca ?? (ultimoRodado?.tipo === "rodar" ? ultimoRodado : null);
  const listaProblemas: ProblemaIde[] = fonteProblemas?.problemas ?? [];
  const problemas = listaProblemas.length;
  const irProblema = (p: ProblemaIde) => { if (p.arquivo && projeto.arquivos[p.arquivo] !== undefined) { abrir(p.arquivo); setApontada({ arquivo: p.arquivo, linha: p.linha! }); } };
  /* copiar o arquivo à vista, para quem não quer digitar: o texto do que o editor mostra */
  const copiar = () => {
    const texto = [...(codigo.current?.querySelectorAll<HTMLElement>(".line") ?? [])].map((l) => l.textContent).join("\n") + "\n";
    navigator.clipboard?.writeText(texto).then(() => { setCopiado(true); setTimeout(() => setCopiado(false), 1600); }, () => {});
  };
  const pv = projeto.arquivos[".python-version"];
  const pyRodape = python && feitaAte >= python.desde && (feitaAte > python.desde || respondida(python.desde) || quadro.tipo !== "acao") ? `${python.versao} ('.venv')`
    : pv !== undefined ? versoes[pv].html?.replace(/<[^>]+>/g, "").trim() || null : null;

  return <div ref={raiz} className={`ide ic${foco ? " ic-foco" : ""}`} data-direto={direto || undefined} onKeyDown={teclas} tabIndex={-1}
    role={foco ? "dialog" : undefined} aria-modal={foco || undefined} aria-label={foco ? `IDE do ${obra === "experimento" ? "experimento" : "capítulo"}, em tela cheia` : undefined}>
    {/* o caminho: os passos do capítulo, por seção; clique para ir */}
    <nav className="ic-trilha" aria-label={`Passos do ${obra === "experimento" ? "experimento" : "capítulo"}`}>
      {secoes.map((s) => <div key={s} className="ic-secao">
        <span className="ic-secao-nome"><b>{s}</b> {passos.find((p) => p.secao === s)!.nomeSecao}</span>
        <span className="ic-pontos">{passos.filter((p) => p.secao === s).map((p) => (
          <button key={p.id} type="button" onClick={() => irPasso(p.n - 1)} title={`${p.n}. ${p.titulo}`}
            className={`ic-ponto ic-${p.sinal}${p.n - 1 === quadro.p ? " ic-atual" : ""}${feitos.has(p.n - 1) ? " ic-feito" : ""}`}>{p.n}</button>
        ))}</span>
      </div>)}
    </nav>

    {/* a janela da IDE: separada da trilha, que é o mapa do livro e não parte da ferramenta */}
    <div className="ic-janela">
    <div className="ide-barra">
      {/* a luz verde maximiza, como numa janela de verdade; o botão da direita diz o mesmo em palavras */}
      <span className="ide-luzes" aria-hidden="true"><i /><i /><i className="ic-luz-foco" onClick={() => setFoco(!foco)} title={foco ? "Sair do modo foco" : "Modo foco"} /></span>
      <span className="ide-titulo">{pasta.split("/").pop()}{vista ? ` — ${vista}` : ""}</span>
      <button type="button" className="ic-foco-botao" onClick={() => setFoco(!foco)} aria-pressed={foco}
        aria-label={foco ? "Sair do modo foco (Esc)" : "Modo foco: a IDE na tela inteira"} title={foco ? "Sair do modo foco (Esc)" : "Modo foco"}>
        {foco ? <Minimize2 size={14} /> : <Maximize2 size={14} />}<span>{foco ? "sair" : "foco"}</span>
      </button>
    </div>
    <div className="ide-corpo">
      <nav className="ide-explorador" aria-label="Arquivos do projeto">
        <small>explorador</small>
        {nomes.length === 0 ? <p className="ic-vazio">pasta vazia</p> : <ul>
          {nomes.map((a) => {
            const pode = !!versoes[projeto.arquivos[a]].html, marca = projeto.marcas.get(a);
            return <li key={a}><button type="button" disabled={!pode} aria-current={a === vista || undefined} onClick={() => abrir(a)}>
              {icone(a)}<span>{a}</span>{marca && <i className={`ide-git ide-git-${marca}`} title={marca === "U" ? "novo neste passo" : "mudou neste passo"}>{marca}</i>}
            </button></li>;
          })}
          {acao?.tipo === "apagar" && <li><button type="button" disabled className="ic-apagado">{icone(acao.arquivo)}<span>{acao.arquivo}</span><i className="ide-git">D</i></button></li>}
        </ul>}
      </nav>
      <div className="ide-editor" ref={editor}>
        <div className="ide-abas" role="tablist" aria-label="Arquivos abertos" ref={faixaAbas}>
          {abas.map((a) => <span key={a} className="ic-aba" data-ativa={a === vista || undefined}
            onAuxClick={(e) => { if (e.button === 1) { e.preventDefault(); fecharAba(a); } }}>
            <button type="button" role="tab" aria-selected={a === vista} onClick={() => setAberto(a)}>{icone(a)}{a.split("/").pop()}</button>
            <button type="button" className="ic-fechar-aba" onClick={() => fecharAba(a)} aria-label={`Fechar ${a}`} title="Fechar"><X size={13} /></button>
          </span>)}
        </div>
        {versao?.html && <button type="button" className="ic-copiar" onClick={copiar} aria-label={`Copiar o conteúdo de ${vista}`} title="Copiar o arquivo">
          {copiado ? <><Check size={13} /> copiado</> : <><Copy size={13} /> copiar</>}</button>}
        {versao?.html
          ? <div className="ide-codigo" ref={codigo} onClick={clicarCodigo} onKeyDown={teclaCodigo} dangerouslySetInnerHTML={{ __html: versao.html }} />
          : <div className="ide-codigo ic-sem-arquivo" ref={codigo}><p>{nomes.length ? "Abra um arquivo no explorador." : "Nenhum arquivo ainda: o projeto começa no terminal."}</p></div>}
        {menu && variar && <div ref={menuRef} className="ic-menu-troca" role="menu" aria-label={`Trocar ${troca?.rotulo ?? variar.original}`} onKeyDown={teclaMenu}
          style={{ left: menu.x, ...(menu.baixo !== undefined ? { bottom: menu.baixo } : { top: menu.y }) }}>
          {[{ id: null as string | null, rotulo: variar.original }, ...variar.opcoes].map((o) => (
            <button key={o.id ?? "livro"} type="button" role="menuitemradio" aria-checked={(trocaAtual ?? null) === o.id} onClick={() => escolher(o.id)}>
              <code>{o.rotulo}</code>{o.id === null && <small>o do {obra}</small>}{(trocaAtual ?? null) === o.id && <Check size={14} />}
            </button>))}
        </div>}
        <div className="ide-painel">
          <div className="ide-painel-abas" role="tablist">
            <button type="button" role="tab" aria-selected={painel === "terminal"} onClick={() => setPainel("terminal")}>terminal</button>
            <button type="button" role="tab" aria-selected={painel === "problemas"} onClick={() => setPainel("problemas")}>problemas{problemas > 0 && <i className="ide-conta">{problemas}</i>}</button>
            {/* onde o leitor faz o projeto, à mão para trocar: na IDE dele, o comando roda sozinho aqui; no livro, ele digita */}
            {!direto && fazer !== undefined && <span className="ic-term-modos" role="radiogroup" aria-label="Onde você faz o projeto">
              {LUGARES.map((l) => <button key={l.id} type="button" role="radio" aria-checked={fazer === l.id} onClick={() => definirOnde(l.id)}>{l.nome}</button>)}
            </span>}
          </div>
          {painel === "problemas" && <div className="ide-problemas ic-problemas" role="tabpanel" aria-label="Problemas">
            {listaProblemas.length === 0 ? <p>Nenhum problema no último comando.</p> : <>
              <p className="ic-problemas-de">do último comando: <code>{fonteProblemas!.comando.length > 70 ? fonteProblemas!.comando.slice(0, 67) + "…" : fonteProblemas!.comando}</code></p>
              {listaProblemas.map((p, i) => <button key={i} type="button" disabled={!p.arquivo} onClick={() => irProblema(p)}>
                <CircleAlert size={14} /><span>{p.mensagem}</span>{p.arquivo && <small>{p.arquivo} [Ln {p.linha}]</small>}
              </button>)}</>}
          </div>}
          <div className="ide-terminal" hidden={painel !== "terminal"} ref={terminal} aria-live="polite" onClick={() => aDigitar && campo.current?.focus({ preventScroll: true })}>
            {rodados.map(({ a, k }) => a.tipo === "rodar" && <div key={k}>{k === quadro.k && errados}<div>{prompt(a.onde)}{a.comando}</div>{saida(a.saida, k)}
              {/* o veredito da aposta do comando da vez, logo depois da saída (antes das trocas que o leitor fizer) */}
              {k === quadro.k && apostaFeita !== null && a.aposta && veredito(a.aposta, apostaFeita)}
              {a.variar && trocasRodadas(a, k)}
              {a.gravacao && <div className="ic-gravado">↻ {a.variar ? "execução original com o" : "resposta do"} {a.gravacao.modelo} gravada em {a.gravacao.quando.split("-").reverse().join("/")} ({a.gravacao.chamadas} chamadas): o {obra} repete a gravação, não chama o modelo</div>}</div>)}
            {esperando && errados}
            {aDigitar && acao?.tipo === "rodar" && <div>
              <label className="ic-entrada">{prompt(acao.onde)}<span>{entrada}<span className="ide-cursor" /></span>
                <input ref={campo} value={entrada} onChange={(e) => setEntrada(e.target.value)} onKeyDown={tecla} aria-label={`Digite o comando: ${acao.comando}`}
                  autoCapitalize="off" autoComplete="off" autoCorrect="off" spellCheck={false} enterKeyHint="go" />
              </label>
              <div className="ic-entrada-dica">digite o comando do chat · Tab completa
                <button type="button" onClick={() => rodarComando("pediu")}>executa pra mim</button></div>
            </div>}
            {esperando && !aDigitar && acao?.tipo === "rodar" && <div>
              <div>{prompt(acao.onde)}{acao.comando}</div>
              {cartaoAposta(acao.aposta!, apostar)}
            </div>}
            {!esperando && !apostandoTroca && <div>{prompt(acao?.tipo === "rodar" ? acao.onde : rodados.length || iniciais.length ? pasta : "~")}
              {/* a troca no próprio comando: ele volta à linha (como a seta para cima), e a palavra é o seletor */}
              {variar && !variar.arquivo && acao?.tipo === "rodar" ? (() => {
                const palavra = troca?.rotulo ?? variar.original, cmd = troca?.comando ?? acao.comando, i = cmd.indexOf(palavra);
                return <span className="ic-relembrado">{cmd.slice(0, i)}<button type="button" className="ic-varia" aria-haspopup="menu" aria-label={`Trocar ${palavra}`}
                  onClick={(e) => abrirMenu(e.currentTarget)}>{palavra}</button>{cmd.slice(i + palavra.length)}</span>;
              })() : <span className="ide-cursor" />}</div>}
          </div>
        </div>
      </div>
      {/* a barra da direita: o chat que guia (uma simulação, escrita pelos autores) */}
      <aside className="ic-chat" aria-label="Chat que guia o passo">
        <div className="ic-chat-abas" role="tablist">
          {(["Claude Code", "Codex"] as const).map((n) => <button key={n} type="button" role="tab" aria-selected={aba === n} onClick={() => setAba(n)}>{n}</button>)}
        </div>
        <div className="ic-chat-topo"><b>{passo.titulo}</b><span>passo {passo.n} de {passos.length} · parte {passo.secao}</span></div>
        <div className="ic-conversa" ref={conversa} aria-live="polite">
          {historia}
          {digitando && <div className="ic-msg ic-ia" key="digitando"><span className="ic-quem">{aba}</span><div className="ic-bolha ic-digitando" aria-label="digitando"><i /><i /><i /></div></div>}
        </div>
        <div className="ic-compositor">
          {pausa && <div className="ic-suavez ic-suavez-chat" role="note">{cartaoSuaVez}</div>}
          {rapidas.length > 0 && <div className="ic-respostas" role="group" aria-label="Respostas">
            {rapidas.map((r) => <button key={r.rotulo} type="button" data-destaque={r.destaque || undefined} onClick={r.enviar} aria-label={`Enviar: ${r.texto}`}>{r.rotulo}</button>)}
          </div>}
          {rapidas.length === 0 && duvidasAgora.length > 0 && <div className="ic-respostas ic-duvidas" role="group" aria-label="Dúvidas que você pode perguntar">
            {duvidasAgora.map((d) => <button key={d.n} type="button" onClick={() => perguntarDuvida(d.n)} aria-label={`Perguntar: ${d.pergunta}`}>{d.pergunta}</button>)}
          </div>}
          {sugestao
            ? <button type="button" className="ic-caixa" onClick={sugestao.enviar} aria-label={`Enviar: ${sugestao.texto}`}>
                <span>{sugestao.texto}</span><i className="ic-enviar"><ArrowUp size={15} /></i></button>
            : <div className="ic-caixa ic-caixa-vazia" aria-hidden="true"><span>{vazia}</span><i className="ic-enviar"><ArrowUp size={15} /></i></div>}
          <p className="ic-simulacao">simulação: a conversa foi escrita pelos autores do {obra}, não por um modelo</p>
        </div>
      </aside>
    </div>

    {/* o rodapé, como o da IDE: o ramo do git, os problemas do último comando e o Python do projeto */}
    <footer className="ic-status">
      {temGit && <span>⎇ main</span>}
      <button type="button" className={`ic-st-problemas${problemas ? " ic-st-erro" : ""}`} onClick={() => setPainel("problemas")} aria-label={`${problemas} problemas: abrir a aba`}>⊗ {problemas} ⚠ 0</button>
      <span className="ic-st-esp" />
      <span>passo {passo.n}/{passos.length}</span>
      <span>UTF-8</span><span>LF</span>
      {pyRodape && <span className="ic-st-py">Python {pyRodape}</span>}
    </footer>
    </div>

    {/* os controles, fora da janela: são do livro, como a trilha em cima */}
    <nav className="ic-guia" aria-label={`Avançar no ${obra === "experimento" ? "experimento" : "capítulo"}`}>
      {/* as perguntas do livro (onde fazer, continuar de onde parou) são da conversa (etapa 3); aqui, as setas e o passo */}
      <button type="button" className="ic-voltar" onClick={() => setQ(q - 1)} disabled={q === 0} aria-label="Voltar"><ChevronLeft size={18} /></button>
      <span className="ic-onde"><b>passo {passo.n} de {passos.length}</b> · {passo.titulo}</span>
      {/* seguir é uma fala no chat (etapa 2); aqui fica só a seta, para reler e para o teclado */}
      <button type="button" className="ic-avancar" onClick={() => setQ(q + 1)} disabled={!podeSeguir} aria-label="Avançar"><ChevronRight size={18} /></button>
    </nav>
  </div>;
}
