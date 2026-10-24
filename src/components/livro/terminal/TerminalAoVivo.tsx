/**
 * O terminal do livro, uma réplica de um terminal de verdade, com dois modos:
 * - guiado: o livro digita o comando e mostra o que ele imprime;
 * - interativo: o leitor digita (Tab completa, ↑ e ↓ andam no histórico, Ctrl+L limpa, `help` ajuda).
 * Nos dois, a saída é a gravada do projeto real (saidas.json, pelo scripts/saidas.py): no navegador não há
 * Python, então este terminal não inventa saída. O que não é do projeto aparece como aviso do livro, em outra cor.
 * O modo escolhido vale para todos os terminais (fica guardado no navegador).
 */
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import "./terminal.css";

export type Linha = [string, string?];
export type Saida = { comando: string; saida?: Linha[]; variantes?: Record<string, Linha[]> };
type Item = { tipo: "prompt"; texto: string; cursor?: boolean } | { tipo: "linha"; texto: string; classe?: string } | { tipo: "livro"; texto: string };
type Modo = "guiado" | "interativo";
const CHAVE = "fontmar:terminal", EVENTO = "fontmar:terminal-modo";
const junta = (s: string) => s.trim().replace(/\s+/g, " ");
const calmo = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function TerminalAoVivo({ saida, pasta = "~/projeto", rotulos = {} }: { saida: Saida; pasta?: string; rotulos?: Record<string, string> }) {
  const variantes = saida.variantes ? Object.keys(saida.variantes) : [];
  const [modo, setModo] = useState<Modo>("guiado");
  const [variante, setVariante] = useState(variantes[0] ?? "");
  /* o servidor desenha o comando e a saída inteira: é o que fica para quem lê sem JS */
  const [tela, setTela] = useState<Item[]>(() => [{ tipo: "prompt", texto: saida.comando }, ...linhas(variantes[0]).map(([t, c]) => ({ tipo: "linha" as const, texto: t, classe: c }))]);
  const [entrada, setEntrada] = useState("");
  const [rodando, setRodando] = useState(false);
  const historico = useRef<string[]>([]), posHist = useRef(-1), vez = useRef(0);
  const corpo = useRef<HTMLDivElement>(null), campo = useRef<HTMLInputElement>(null);

  function linhas(v: string) { return (saida.variantes ? saida.variantes[v] : saida.saida) ?? []; }
  const inicio = (m: Modo): Item[] => m === "guiado"
    ? [{ tipo: "prompt", texto: saida.comando }, { tipo: "livro", texto: "aperte ▶ Rodar" }]
    : [{ tipo: "livro", texto: "Digite o comando desta seção (Tab completa; help mostra o que este terminal sabe)." }];

  /* ao hidratar: o modo guardado, e a tela limpa esperando o leitor */
  useEffect(() => {
    let m: Modo = "guiado";
    try { if (localStorage.getItem(CHAVE) === "interativo") m = "interativo"; } catch { /* sem armazenamento */ }
    setModo(m); setTela(inicio(m));
    const ouvir = (e: Event) => { const n = (e as CustomEvent<Modo>).detail; vez.current++; setRodando(false); setModo(n); setTela(inicio(n)); };
    addEventListener(EVENTO, ouvir);
    return () => removeEventListener(EVENTO, ouvir);
  }, []);
  useEffect(() => { corpo.current?.scrollTo({ top: corpo.current.scrollHeight }); }, [tela, entrada]);

  const espera = (ms: number) => new Promise((r) => setTimeout(r, calmo() ? 0 : ms));
  const imprimir = async (v: number, ls: Linha[]) => {
    for (const [t, c] of ls) { if (v !== vez.current) return false; setTela((x) => [...x, { tipo: "linha", texto: t, classe: c }]); await espera(ls.length > 4 ? 25 : 80); }
    return true;
  };

  /* modo guiado: digita o comando, espera um instante, imprime a saída */
  const rodar = async () => {
    const v = ++vez.current; setRodando(true);
    const cmd = saida.comando, passo = Math.max(1, Math.ceil(cmd.length / 60));
    for (let i = 0; i <= cmd.length; i += passo) {
      if (v !== vez.current) return;
      setTela([{ tipo: "prompt", texto: cmd.slice(0, i), cursor: true }]); await espera(16);
    }
    setTela([{ tipo: "prompt", texto: cmd }]); await espera(260);
    if (await imprimir(v, linhas(variante))) { setTela((x) => [...x, { tipo: "prompt", texto: "", cursor: true }]); setRodando(false); }
  };

  /* modo interativo: o que o terminal do livro sabe responder */
  const executar = async (bruto: string) => {
    const cmd = junta(bruto);
    setTela((x) => [...x, { tipo: "prompt", texto: bruto }]);
    if (!cmd) return;
    historico.current.push(bruto); posHist.current = -1;
    const nome = cmd.split(" ")[0];
    if (cmd === "clear") { setTela([]); return; }
    if (cmd === "help") {
      setTela((x) => [...x, { tipo: "livro", texto: "Este terminal mostra a saída gravada do projeto do livro. Ele conhece:" },
        { tipo: "linha", texto: `  ${saida.comando}` }, { tipo: "livro", texto: "e também: clear, history, pwd. Rode o mesmo comando no terminal da sua IDE para ver a saída de verdade na sua máquina." }]);
      return;
    }
    if (cmd === "pwd") { setTela((x) => [...x, { tipo: "linha", texto: pasta.replace(/^~/, "/home/voce") }]); return; }
    if (cmd === "history") { setTela((x) => [...x, ...historico.current.map((h, i) => ({ tipo: "linha" as const, texto: `  ${i + 1}  ${h}` }))]); return; }
    if (cmd === junta(saida.comando)) {
      const v = ++vez.current; setRodando(true); await espera(220);
      await imprimir(v, linhas(variante)); setRodando(false); return;
    }
    const perto = junta(saida.comando).startsWith(cmd) || saida.comando.startsWith(nome);
    setTela((x) => [...x, { tipo: "livro", texto: perto
      ? `Quase: o comando desta seção é mais longo. Aperte Tab para completar.`
      : `${nome}: este terminal do livro só conhece o comando desta seção. Digite help.` }]);
  };

  const tecla = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); if (!rodando) { const v = entrada; setEntrada(""); executar(v); } return; }
    if (e.key === "Tab") { e.preventDefault(); if (!entrada.trim() || junta(saida.comando).startsWith(junta(entrada))) setEntrada(saida.comando); return; }
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const h = historico.current; if (!h.length) return; e.preventDefault();
      const i = e.key === "ArrowUp" ? (posHist.current < 0 ? h.length - 1 : Math.max(posHist.current - 1, 0)) : posHist.current + 1;
      if (i >= h.length) { posHist.current = -1; setEntrada(""); } else { posHist.current = i; setEntrada(h[i]); }
      return;
    }
    if (e.key === "l" && e.ctrlKey) { e.preventDefault(); setTela([]); return; }
    if (e.key === "c" && e.ctrlKey) { e.preventDefault(); vez.current++; setRodando(false); setTela((x) => [...x, { tipo: "prompt", texto: `${entrada}^C` }]); setEntrada(""); }
  };

  const trocarModo = (m: Modo) => {
    try { localStorage.setItem(CHAVE, m); } catch { /* sem armazenamento */ }
    dispatchEvent(new CustomEvent(EVENTO, { detail: m }));   /* todos os terminais da página mudam juntos */
    if (m === "interativo") setTimeout(() => campo.current?.focus(), 0);
  };
  const escolherVariante = (v: string) => { vez.current++; setRodando(false); setVariante(v); setTela(inicio(modo)); };

  const prompt = <><span className="tm-pr">voce@maquina</span>:<span className="tm-cwd">{pasta}</span>$ </>;
  return <div className="tm" data-modo={modo}>
    <div className="tm-barra">
      <span className="tm-luzes" aria-hidden="true"><i /><i /><i /></span>
      <span className="tm-titulo">voce@maquina: {pasta}</span>
      <div className="tm-modos" role="radiogroup" aria-label="Modo do terminal">
        {(["guiado", "interativo"] as Modo[]).map((m) => (
          <button key={m} type="button" role="radio" aria-checked={modo === m} onClick={() => trocarModo(m)}>{m}</button>
        ))}
      </div>
    </div>
    {(variantes.length > 0 || modo === "guiado") && (
      <div className="tm-acoes">
        {variantes.map((v) => <button key={v} type="button" className="tm-sec" aria-pressed={v === variante} onClick={() => escolherVariante(v)}>{rotulos[v] ?? v}</button>)}
        <span className="tm-esp" />
        {modo === "guiado" && <button type="button" className="tm-rodar" onClick={rodar}>▶ Rodar</button>}
      </div>
    )}
    <div className="tm-corpo" ref={corpo} onClick={() => modo === "interativo" && campo.current?.focus()} aria-live="polite">
      {tela.map((it, i) => it.tipo === "prompt"
        ? <div key={i} className="tm-l">{prompt}{it.texto}{it.cursor && <span className="tm-cursor" />}</div>
        : it.tipo === "livro" ? <div key={i} className="tm-l tm-livro">{it.texto}</div>
          : <div key={i} className={`tm-l ${it.classe ?? ""}`}>{it.texto || " "}</div>)}
      {modo === "interativo" && !rodando && (
        <label className="tm-l tm-entrada">{prompt}
          <span className="tm-digitado">{entrada}<span className="tm-cursor" /></span>
          <input ref={campo} value={entrada} onChange={(e) => setEntrada(e.target.value)} onKeyDown={tecla} aria-label="Digite um comando"
            autoCapitalize="off" autoComplete="off" autoCorrect="off" spellCheck={false} />
        </label>
      )}
    </div>
  </div>;
}
