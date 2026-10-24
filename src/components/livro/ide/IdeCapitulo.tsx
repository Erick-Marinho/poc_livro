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

type Quadro = { tipo: "abre"; p: number } | { tipo: "acao"; p: number; k: number } | { tipo: "fecha"; p: number };

const icone = (nome: string) => nome.endsWith(".py") ? <FileCode size={14} /> : /\.(jsonl?|toml|lock)$/.test(nome) ? <FileBraces size={14} /> : <FileText size={14} />;
const SINAL = { ok: "✓", erro: "✗", engano: "!", nada: "•" };
/* texto curto do livro: `assim` vira código */
const Md = ({ t }: { t: string }) => <>{t.split(/(`[^`]+`)/).map((x, i) => x.startsWith("`") && x.endsWith("`") ? <code key={i}>{x.slice(1, -1)}</code> : <Fragment key={i}>{x}</Fragment>)}</>;
const iniciais = (nome: string) => nome.split(/\s+/).map((x) => x[0]).join("").slice(0, 2).toUpperCase();
const primeiro = (nome: string) => nome.split(/\s+/)[0];

export default function IdeCapitulo({ acoes, passos, versoes }: { acoes: AcaoIde[]; passos: PassoCap[]; versoes: VersaoIde[] }) {
  const direto = useDireto();
  /* a sequência do passador: abre, as ações do passo, fecha */
  const quadros = useMemo(() => passos.flatMap((p, i): Quadro[] => [
    { tipo: "abre", p: i },
    ...acoes.slice(p.de - 1, p.ate).map((_, j): Quadro => ({ tipo: "acao", p: i, k: p.de - 1 + j })),
    { tipo: "fecha", p: i },
  ]), [acoes, passos]);
  const [q, setQ] = useState(0);
  const [apostas, setApostas] = useState<Record<number, number | "pulou">>({});
  const [aberto, setAberto] = useState<string | null>(null);
  const [abertas, setAbertas] = useState<Set<string>>(new Set());   /* dobras do caminho do erro abertas */
  const codigo = useRef<HTMLDivElement>(null), terminal = useRef<HTMLDivElement>(null);

  const quadro = quadros[q], passo = passos[quadro.p];
  /* até que ação o projeto já andou: no "abre", o projeto como o passo anterior deixou */
  const feitaAte = quadro.tipo === "acao" ? quadro.k : quadro.tipo === "abre" ? passo.de - 2 : passo.ate - 1;
  const acao = quadro.tipo === "acao" ? acoes[quadro.k] : null;
  const respondida = (k: number) => { const a = acoes[k]; return direto || !(a.tipo === "rodar" && a.aposta) || apostas[k] !== undefined; };
  const esperando = acao?.tipo === "rodar" && !respondida(quadro.k as number);

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

  /* destaca as linhas da ação e leva o editor até elas */
  useEffect(() => {
    const el = codigo.current;
    if (!el) return;
    el.querySelectorAll<HTMLElement>(".line").forEach((l) => l.classList.toggle("ide-novo", alteradas.includes(Number(l.dataset.n))));
    const linha = alteradas.length ? el.querySelector<HTMLElement>(`.line[data-n="${alteradas[0]}"]`) : null;
    el.scrollTo({ top: linha ? Math.max(linha.offsetTop - 60, 0) : 0 });
  }, [versao, alteradas.join(",")]);

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
  useEffect(() => { if (direto) setQ(quadros.length - 1); }, [direto]);

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

  return <div className="ide ic" data-direto={direto || undefined}>
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
        {versao?.html
          ? <div className="ide-codigo" ref={codigo} dangerouslySetInnerHTML={{ __html: versao.html }} />
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
    </div>

    {/* o passador: o que este momento do passo quer dizer */}
    <div className="ic-passador">
      <p className="ic-onde">passo {passo.n} de {passos.length} · seção {passo.secao} · <b>{passo.titulo}</b>
        {quadro.tipo === "acao" && <span> · ação {quadro.k - passo.de + 2} de {passo.ate - passo.de + 1}</span>}</p>

      {quadro.tipo === "abre" && <div className="ic-quadro">
        {passo.antes.map((t, i) => <p key={i} className="ic-texto"><Md t={t} /></p>)}
        <p className="ic-objetivo"><b>no fim deste passo:</b> <Md t={passo.objetivo} /></p>
        {passo.pensamento ? <div className="ic-pensa">
          <span className="ic-autor" title={passo.pensamento.autor}>{iniciais(passo.pensamento.autor)}</span>
          <div><p className="ic-pensa-rot">o que eu penso · {primeiro(passo.pensamento.autor)}</p>
            <p><b>me pergunto:</b> {passo.pensamento.pergunta}</p>
            <p><b>por que assim:</b> {passo.pensamento.por_que}</p>
            {passo.pensamento.espero && !acoes.slice(passo.de - 1, passo.ate).some((a) => a.tipo === "rodar" && a.aposta) && <p><b>espero:</b> {passo.pensamento.espero}</p>}
          </div>
        </div> : <p className="ic-pendente" data-pendente="pensamento">💭 o que eu penso: <span>pendente · as palavras dos autores entram aqui</span></p>}
      </div>}

      {quadro.tipo === "acao" && acao && <div className="ic-quadro">
        {esperando ? <p className="ic-texto">Antes de rodar: o que você acha que vai acontecer? Aposte no terminal.</p> : <>
          <p className="ic-texto"><Md t={acao.nota} /></p>
          {apostaFeita !== null && passo.pensamento?.espero && <p className="ic-apostou"><span className="ic-autor">{iniciais(passo.pensamento.autor)}</span>
            <span><b>{primeiro(passo.pensamento.autor)} tinha apostado:</b> {passo.pensamento.espero}</span></p>}
        </>}
      </div>}

      {quadro.tipo === "fecha" && <div className="ic-quadro">
        <p className="ic-temos">✓ <b>agora você tem:</b> <Md t={passo.temos} /></p>
        {passo.depois.map((t, i) => <p key={i} className="ic-texto"><Md t={t} /></p>)}
      </div>}

      {!direto && <div className="ide-controles ic-controles">
        <button type="button" onClick={() => setQ(q - 1)} disabled={q === 0} aria-label="Voltar"><ChevronLeft size={18} /></button>
        <button type="button" className="ide-proximo" onClick={() => setQ(q + 1)} disabled={q === quadros.length - 1 || esperando}>
          {esperando ? "aposte para seguir" : q === quadros.length - 1 ? "fim do capítulo" : quadro.tipo === "fecha" ? "próximo passo" : "seguir"}
          {!esperando && q < quadros.length - 1 && <ChevronRight size={16} />}
        </button>
      </div>}
    </div>
  </div>;
}
