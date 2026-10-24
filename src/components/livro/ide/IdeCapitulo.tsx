/**
 * A IDE do capítulo: o projeto nasce numa pasta vazia e vai sendo construído, e o leitor acompanha pelo passador.
 * Cada passo tem três momentos: abre (o que vai existir no fim, e o que o autor pensa), as ações (um arquivo que nasce,
 * código que entra, um comando que roda) e fecha ("agora você tem"). Quem avança é o leitor; antes de um comando com
 * aposta, ele aposta, e só então o terminal mostra a saída gravada do projeto real.
 */
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, FileBraces, FileCode, FileText, X } from "lucide-react";
import { useDireto } from "../palco/direto";
import type { Trecho } from "../../../lib/codigo.ts";
import type { AcaoIde, PassoCap, VersaoIde } from "../../../lib/ideCapitulo.ts";
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
function suaVez(a: AcaoIde): string {
  if (a.tipo === "rodar") return `Rode o comando no seu terminal${a.onde === "~" ? ", na sua pasta de usuário" : ", na pasta do projeto"}. Compare a saída com a do terminal aqui.`;
  if (a.tipo === "apagar") return `Apague o \`${a.arquivo}\` no seu projeto.`;
  if (a.tipo === "copiar") return "Copie a pasta `dados/` do repositório do livro para o seu projeto. Digitar dado inventado não ensina nada.";
  if (DADO.test(a.arquivo)) return a.novo ? `Crie o \`${a.arquivo}\` com este conteúdo; copiar do repositório do livro vale.` : `Faça a mesma mudança no seu \`${a.arquivo}\`.`;
  return a.novo ? `Crie o \`${a.arquivo}\` na sua IDE e digite este código. Digitar, e não colar, é o que faz perceber o que não ficou claro.` : `Digite as linhas novas no seu \`${a.arquivo}\`, no mesmo lugar em que elas aparecem aqui.`;
}
/* quem fala com a IA no chat: o autor, construindo junto com o leitor */
const AUTOR = "Erick";

/* uma fala do chat, com chave estável. O componente fica fora da IDE de propósito: definido dentro, ele seria um tipo
   novo a cada render, e o React desmontaria e remontaria a conversa inteira (e a animação de entrada rodaria de novo) */
type Fala = { chave: string; quem: "ia" | "pessoa" | "divisa"; corpo: React.ReactNode };
function Mensagem({ f, ia }: { f: Fala; ia: string }) {
  if (f.quem === "divisa") return <p className="ic-divisa">{f.corpo}</p>;
  return <div className={`ic-msg ${f.quem === "ia" ? "ic-ia" : "ic-pessoa"}`}><span className="ic-quem">{f.quem === "ia" ? ia : AUTOR}</span><div className="ic-bolha">{f.corpo}</div></div>;
}

/* como a IA conta a ação que acabou de fazer */
function feito(a: AcaoIde): string {
  if (a.tipo === "rodar") return `Rodei \`${a.comando.length > 60 ? a.comando.slice(0, 57) + "…" : a.comando}\` no terminal.`;
  if (a.tipo === "apagar") return `Apaguei o \`${a.arquivo}\`.`;
  if (a.tipo === "copiar") return "Copiei a pasta `dados/` para o projeto.";
  return a.novo ? `Criei o \`${a.arquivo}\`.` : `Mexi no \`${a.arquivo}\`.`;
}

export default function IdeCapitulo({ acoes, passos, versoes, python }: { acoes: AcaoIde[]; passos: PassoCap[]; versoes: VersaoIde[]; python: { versao: string; desde: number } | null }) {
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
  const [aberto, setAberto] = useState<string | null>(null);
  const [abertas, setAbertas] = useState<Set<string>>(new Set());   /* dobras do caminho do erro abertas */
  const [perguntados, setPerguntados] = useState<Record<string, string[]>>({});   /* as palavras que o leitor perguntou, por "ação:bloco" */
  const [respostas, setRespostas] = useState<Record<string, number | "pulou">>({});   /* as perguntas dos blocos, por "ação:bloco" */
  const codigo = useRef<HTMLDivElement>(null), terminal = useRef<HTMLDivElement>(null);

  const quadro = quadros[q], passo = passos[quadro.p];
  /* até que ação o projeto já andou: no "abre", o projeto como o passo anterior deixou */
  const feitaAte = quadro.tipo === "acao" ? quadro.k : quadro.tipo === "abre" ? passo.de - 2 : passo.ate - 1;
  const acao = quadro.tipo === "acao" ? acoes[quadro.k] : null;
  const respondida = (k: number) => { const a = acoes[k]; return direto || !(a.tipo === "rodar" && a.aposta) || apostas[k] !== undefined; };
  const bloco = quadro.tipo === "acao" && quadro.b !== undefined && acao?.tipo === "editar" ? acao.blocos[quadro.b] : null;
  const chaveBloco = quadro.tipo === "acao" ? `${quadro.k}:${quadro.b}` : "";
  const perguntando = !!bloco?.pergunta && !direto && respostas[chaveBloco] === undefined;
  const esperando = acao?.tipo === "rodar" && !respondida(quadro.k as number);
  /* a pausa para fazer na própria IDE: quando a ação já foi toda mostrada aqui (o último bloco, ou a saída depois da aposta) */
  const ultimoBloco = !bloco || (acao?.tipo === "editar" && quadro.tipo === "acao" && quadro.b === acao.blocos.length - 1);
  const pausa = !direto && quadro.tipo === "acao" && !!acao && !esperando && !perguntando && ultimoBloco ? suaVez(acao) : null;

  /* o projeto depois da ação feitaAte: a versão de cada arquivo, e o que nasceu ou mudou neste passo */
  const projeto = useMemo(() => {
    const arquivos: Record<string, number> = {};
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
  }, [feitaAte, acoes, passo.de, apostas, direto, quadro.tipo]);

  /* o arquivo à vista: o da ação, ou o primeiro que o comando criou ou mudou, ou o que o leitor abriu */
  const daAcao = !acao ? null : acao.tipo === "editar" ? acao.arquivo : acao.tipo === "copiar" ? acao.arquivos[0].nome
    : acao.tipo === "rodar" && !esperando ? acao.gerados.find((g) => versoes[g.versao].html)?.nome ?? null : null;
  useEffect(() => { if (daAcao) setAberto(daAcao); }, [q, daAcao]);
  const nomes = Object.keys(projeto.arquivos).sort((a, b) => Number(a.includes("/")) - Number(b.includes("/")) || a.localeCompare(b));
  const vista = aberto && projeto.arquivos[aberto] !== undefined ? aberto : nomes.find((n) => versoes[projeto.arquivos[n]].html) ?? null;
  const versao = vista ? versoes[projeto.arquivos[vista]] : null;
  const alteradas = !acao ? [] : acao.tipo === "editar" && acao.arquivo === vista ? acao.alteradas
    : acao.tipo === "rodar" && !esperando ? acao.gerados.find((g) => g.nome === vista)?.alteradas ?? [] : [];
  const abas = [...projeto.marcas.keys()].filter((a) => projeto.arquivos[a] !== undefined && versoes[projeto.arquivos[a]].html);
  if (vista && !abas.includes(vista) && versao?.html) abas.push(vista);

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
    const alvo = blocoVisto?.a ?? alteradas[0];
    const linha = alvo ? el.querySelector<HTMLElement>(`.line[data-n="${alvo}"]`) : null;
    el.scrollTo({ top: linha ? Math.max(linha.offsetTop - 60, 0) : 0 });
  }, [versao, alteradas.join(","), blocoVisto]);
  /* perguntar o que é uma palavra: vira mais uma fala da conversa, e fica nela */
  const perguntar = (chave: string) => setPerguntados((v) => (v[chaveBloco] ?? []).includes(chave) ? v : { ...v, [chaveBloco]: [...(v[chaveBloco] ?? []), chave] });
  const clicarCodigo = (e: React.MouseEvent) => { const t = (e.target as HTMLElement).closest<HTMLElement>(".ic-termo"); if (t?.dataset.termo) perguntar(t.dataset.termo); };

  /* o terminal: tudo o que já rodou no capítulo, e o comando da vez (com a aposta, se houver) */
  const rodados = acoes.map((a, k) => ({ a, k })).filter(({ a, k }) => a.tipo === "rodar" && k <= feitaAte && (k < feitaAte || respondida(k) || quadro.tipo !== "acao"));
  useEffect(() => { const t = requestAnimationFrame(() => { const el = terminal.current; if (el) el.scrollTop = el.scrollHeight; }); return () => cancelAnimationFrame(t); }, [q, apostas]);

  const apostar = (op: number | "pulou") => {
    if (quadro.tipo !== "acao" || acao?.tipo !== "rodar") return;
    setApostas((a) => ({ ...a, [quadro.k]: op }));
    dispatchEvent(new CustomEvent("fontmar:apostou", { detail: acao.id }));   /* o placar espera por isto */
  };
  const irPasso = (i: number) => setQ(quadros.findIndex((x) => x.tipo === "abre" && x.p === i));
  /* passo feito: o leitor já chegou ao "fecha" dele */
  const feitos = new Set(quadros.slice(0, q + 1).filter((x) => x.tipo === "fecha").map((x) => x.p));
  /* ao entrar ou sair do modo direto, a sequência muda: o leitor fica no mesmo passo */
  const passoAtual = useRef(0);
  passoAtual.current = quadro.p;
  useEffect(() => { setQ(quadros.findIndex((x) => x.tipo === "abre" && x.p === passoAtual.current)); }, [direto]);
  /* as setas do teclado avançam e voltam, quando o foco está na IDE */
  const teclas = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).closest("button.ic-opcao-aposta, .ide-opcoes, .ic-opcoes")) return;
    if (e.key === "ArrowRight" && podeSeguir) { setQ(q + 1); e.preventDefault(); }
    if (e.key === "ArrowLeft" && q > 0) { setQ(q - 1); e.preventDefault(); }
  };

  const prompt = (onde: string) => <><span className="ide-pr">voce@maquina</span>:<span className="ide-cwd">{onde}</span>$ </>;
  const saida = (t: Trecho[], k: number) => t.map((x, j) => x.tipo === "linha" ? <div key={j} className={x.c || undefined}>{x.l || " "}</div> : (
    <div key={j} className="ic-dobra">
      <button type="button" onClick={() => setAbertas((s) => { const n = new Set(s); const c = `${k}:${j}`; n.has(c) ? n.delete(c) : n.add(c); return n; })}>
        ⋯ {x.linhas.length} linhas do caminho do erro fora do seu código
      </button>
      {abertas.has(`${k}:${j}`) && x.linhas.map(([l, c], m) => <div key={m} className={`ic-dobrado ${c}`}>{l || " "}</div>)}
    </div>));

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
  const falas = (x: Quadro, i: number): Fala[] => {
    const atual = i === q, ps = passos[x.p];
    if (x.tipo === "abre") return [
      { chave: "d", quem: "divisa", corpo: <>passo {ps.n} · {ps.titulo}</> },
      pessoa("p", <p>{ps.pedido}</p>),
      ia("i", <>{ps.antes.map((t, k) => <p key={k}><Md t={t} /></p>)}<p><b>No fim deste passo:</b> <Md t={ps.objetivo} /></p></>),
    ];
    if (x.tipo === "fecha") return [ia("f", <><p className="ic-temos">✓ <b>Pronto. Agora você tem:</b> <Md t={ps.temos} /></p>{ps.depois.map((t, k) => <p key={k}><Md t={t} /></p>)}</>)];
    const a = acoes[x.k];
    if (x.b === undefined || a.tipo !== "editar") {
      const comAposta = a.tipo === "rodar" && !!a.aposta && !direto, aposta = comAposta ? apostas[x.k] : undefined;
      const pede = comAposta ? [ia("e", <p>Antes de eu rodar <code>{(a as Extract<AcaoIde, { tipo: "rodar" }>).comando.split(" ").slice(0, 3).join(" ")}</code>: o que você acha que vai acontecer? Aposta comigo no terminal.</p>)] : [];
      if (comAposta && aposta === undefined) return pede;
      return [
        ...pede,
        ...(aposta !== undefined ? [pessoa("ap", <p>{aposta === "pulou" ? "Só me mostra." : `Aposto: ${(a as Extract<AcaoIde, { tipo: "rodar" }>).aposta!.opcoes[aposta]}.`}</p>)] : []),
        ia("n", <p><Md t={feito(a)} /> <Md t={a.nota} /></p>),
      ];
    }
    const b = a.blocos[x.b], chave = `${x.k}:${x.b}`, r = respostas[chave];
    const ja = perguntados[chave] ?? [];
    return [
      ...(x.b === 0 ? [ia("n0", <p><Md t={feito(a)} /> <Md t={a.nota} /> Vamos por partes: são {a.blocos.length} {a.blocos.length === 1 ? "bloco" : "blocos"}.</p>)] : [pessoa("mais", <p>E o próximo?</p>)]),
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
  /* o ritmo de um chat de verdade: a fala do leitor entra na hora em que ele age; a da IA vem depois do "digitando".
     Só entra o que é novo; voltar, o modo direto e quem pede menos movimento veem tudo de uma vez. */
  const falasAgora = falas(quadro, q);
  const tipos = falasAgora.map((f) => f.quem[0]).join("");
  const qAnterior = useRef(q);
  const calmo = () => direto || (typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const avancou = q > qAnterior.current, voltou = q < qAnterior.current;
    qAnterior.current = q;
    /* a abertura de um passo não pede nada ao leitor: quando ele avança até ela, a conversa emenda sozinha na primeira
       ação (docs/capacidades/imersao-ide.md, etapa 2). Voltando, ela fica parada, para reler. */
    const emendar = avancou && quadros[q].tipo === "abre" && q < quadros.length - 1;
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
  const podeSeguir = q < quadros.length - 1 && !esperando && !perguntando;
  const historia = quadros.slice(0, q + 1).flatMap((x, i) => {
    const f = i === q ? falasAgora.slice(0, visiveis) : falas(x, i);
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
  const temGit = feitaAte >= 0 && rodados.length > 0;
  const ultimoRodado = rodados.at(-1)?.a;
  const problemas = ultimoRodado?.tipo === "rodar" && ultimoRodado.erro ? 1 : 0;
  const pv = projeto.arquivos[".python-version"];
  const pyRodape = python && feitaAte >= python.desde && (feitaAte > python.desde || respondida(python.desde) || quadro.tipo !== "acao") ? `${python.versao} ('.venv')`
    : pv !== undefined ? versoes[pv].html?.replace(/<[^>]+>/g, "").trim() || null : null;

  return <div className="ide ic" data-direto={direto || undefined} onKeyDown={teclas} tabIndex={-1}>
    {/* o caminho: os passos do capítulo, por seção; clique para ir */}
    <nav className="ic-trilha" aria-label="Passos do capítulo">
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
      <span className="ide-luzes" aria-hidden="true"><i /><i /><i /></span>
      <span className="ide-titulo">atendimento-bemtevi{vista ? ` — ${vista}` : ""}</span>
    </div>
    <div className="ide-corpo">
      <nav className="ide-explorador" aria-label="Arquivos do projeto">
        <small>explorador</small>
        {nomes.length === 0 ? <p className="ic-vazio">pasta vazia</p> : <ul>
          {nomes.map((a) => {
            const pode = !!versoes[projeto.arquivos[a]].html, marca = projeto.marcas.get(a);
            return <li key={a}><button type="button" disabled={!pode} aria-current={a === vista || undefined} onClick={() => setAberto(a)}>
              {icone(a)}<span>{a}</span>{marca && <i className={`ide-git ide-git-${marca}`} title={marca === "U" ? "novo neste passo" : "mudou neste passo"}>{marca}</i>}
            </button></li>;
          })}
          {acao?.tipo === "apagar" && <li><button type="button" disabled className="ic-apagado">{icone(acao.arquivo)}<span>{acao.arquivo}</span><i className="ide-git">D</i></button></li>}
        </ul>}
      </nav>
      <div className="ide-editor">
        <div className="ide-abas" role="tablist" aria-label="Arquivos abertos">
          {abas.map((a) => <button key={a} type="button" role="tab" aria-selected={a === vista} onClick={() => setAberto(a)}>{icone(a)}{a.split("/").pop()}</button>)}
        </div>
        {pausa && <div className="ic-suavez ic-suavez-editor" role="note">{cartaoSuaVez}</div>}
        {versao?.html
          ? <div className="ide-codigo" ref={codigo} onClick={clicarCodigo} dangerouslySetInnerHTML={{ __html: versao.html }} />
          : <div className="ide-codigo ic-sem-arquivo" ref={codigo}><p>{nomes.length ? "Abra um arquivo no explorador." : "Nenhum arquivo ainda: o projeto começa no terminal."}</p></div>}
        <div className="ide-painel">
          <div className="ide-painel-abas"><button type="button" aria-selected="true">terminal</button></div>
          <div className="ide-terminal" ref={terminal} aria-live="polite">
            {rodados.map(({ a, k }) => a.tipo === "rodar" && <div key={k}><div>{prompt(a.onde)}{a.comando}</div>{saida(a.saida, k)}</div>)}
            {esperando && acao?.tipo === "rodar" && <div>
              <div>{prompt(acao.onde)}{acao.comando}</div>
              <div className="ide-aposta" role="group" aria-label="Aposte antes de ver">
                <b>aposte antes de ver</b>
                <p>{acao.aposta!.pergunta}</p>
                <div className="ide-opcoes">
                  {acao.aposta!.opcoes.map((o, j) => <button key={j} type="button" onClick={() => apostar(j)}>{o}</button>)}
                  <button type="button" className="ide-pular" onClick={() => apostar("pulou")}>só mostrar</button>
                </div>
              </div>
            </div>}
            {apostaFeita !== null && acao?.tipo === "rodar" && (
              <div className={`ide-veredito ${apostaFeita === acao.aposta!.certa ? "ide-acertou" : "ide-errou"}`}>
                {apostaFeita === acao.aposta!.certa ? <Check size={14} /> : <X size={14} />}
                {apostaFeita === acao.aposta!.certa ? "Você acertou." : `Você apostou "${acao.aposta!.opcoes[apostaFeita]}". Saiu: ${acao.aposta!.opcoes[acao.aposta!.certa]}.`}
              </div>
            )}
            {!esperando && <div>{prompt(acao?.tipo === "rodar" ? acao.onde : rodados.length ? "~/atendimento-bemtevi" : "~")}<span className="ide-cursor" /></div>}
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
          <p className="ic-simulacao">simulação: a conversa foi escrita pelos autores do livro, não por um modelo</p>
        </div>
      </aside>
    </div>

    {/* o rodapé, como o da IDE: o ramo do git, os problemas do último comando e o Python do projeto */}
    <footer className="ic-status">
      {temGit && <span>⎇ main</span>}
      <span className={problemas ? "ic-st-erro" : undefined}>⊗ {problemas} ⚠ 0</span>
      <span className="ic-st-esp" />
      <span>passo {passo.n}/{passos.length}</span>
      <span>UTF-8</span><span>LF</span>
      {pyRodape && <span className="ic-st-py">Python {pyRodape}</span>}
    </footer>
    </div>

    {/* os controles, fora da janela: são do livro, como a trilha em cima */}
    <nav className="ic-guia" aria-label="Avançar no capítulo">
      <button type="button" className="ic-voltar" onClick={() => setQ(q - 1)} disabled={q === 0} aria-label="Voltar"><ChevronLeft size={18} /></button>
      <span className="ic-onde"><b>passo {passo.n} de {passos.length}</b> · {passo.titulo}</span>
      <button type="button" className="ic-seguir" onClick={() => setQ(q + 1)} disabled={!podeSeguir}>
        {esperando ? "aposte no terminal" : perguntando ? "responda no chat" : q === quadros.length - 1 ? "fim do capítulo" : pausa ? "fiz na minha IDE" : quadro.tipo === "fecha" ? "próximo passo" : "seguir"}
        {!esperando && !perguntando && q < quadros.length - 1 && <ChevronRight size={16} />}
      </button>
    </nav>
  </div>;
}
