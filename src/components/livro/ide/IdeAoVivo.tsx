/**
 * A IDE do livro: explorador, abas, editor e o painel com terminal e problemas.
 * Ninguém digita sozinho aqui (docs/PRINCIPIOS.md): o leitor avança um passo por vez, o código muda de uma vez
 * com as linhas alteradas destacadas, e antes de cada comando com aposta ele aposta no que vai acontecer.
 * Só depois da aposta o terminal mostra a saída gravada do projeto. No modo direto, tudo aparece de uma vez.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, CircleAlert, FileBraces, FileCode, FileText, X } from "lucide-react";
import { useDireto } from "../palco/direto";
import "./ide.css";

export type Versao = { arquivo: string; html: string | null; linhas: number };
type Aposta = { pergunta: string; opcoes: string[]; certa: number };
type Marca = { arquivo: string; linha: number; texto: string };
export type PassoIde = { n: number; nota: string } & (
  | { tipo: "editar"; arquivo: string; versao: number; alteradas: number[]; novo: boolean }
  | { tipo: "copiar"; arquivos: { nome: string; versao: number }[] }
  | { tipo: "rodar"; comando: string; saida: [string, string][]; saiuCom: number; aposta?: Aposta; marca?: Marca });

const icone = (nome: string) => nome.endsWith(".py") ? <FileCode size={14} /> : nome.endsWith(".json") || nome.endsWith(".jsonl") ? <FileBraces size={14} /> : <FileText size={14} />;

export default function IdeAoVivo({ passos, inicio, versoes, pasta }: { passos: PassoIde[]; inicio: Record<string, number>; versoes: Versao[]; pasta: string }) {
  const direto = useDireto();
  const ultimo = passos.length - 1;
  /* o servidor desenha o trecho já percorrido: é o que fica para quem lê sem JS */
  const [i, setI] = useState(ultimo);
  const [apostas, setApostas] = useState<Record<number, number | "pulou">>({});
  const [aberto, setAberto] = useState<string | null>(null);
  const [painel, setPainel] = useState<"terminal" | "problemas">("terminal");
  const codigo = useRef<HTMLDivElement>(null), terminal = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!direto) setI(0); }, []);   // ao hidratar, o leitor começa do primeiro passo
  useEffect(() => { if (direto) setI(ultimo); }, [direto, ultimo]);

  /* o estado do projeto depois do passo i: que versão de cada arquivo, e o que mudou neste trecho */
  const estado = useMemo(() => {
    const arquivos = { ...inicio };
    const mexidos = new Map<string, "U" | "M">();
    for (const p of passos.slice(0, i + 1)) {
      if (p.tipo === "editar") { arquivos[p.arquivo] = p.versao; mexidos.set(p.arquivo, p.novo || mexidos.get(p.arquivo) === "U" ? "U" : "M"); }
      if (p.tipo === "copiar") for (const a of p.arquivos) { arquivos[a.nome] = a.versao; mexidos.set(a.nome, "U"); }
    }
    return { arquivos, mexidos };
  }, [i, inicio, passos]);
  const passo = passos[i];
  const respondida = (k: number) => direto || apostas[k] !== undefined || !(passos[k].tipo === "rodar" && passos[k].aposta);
  const esperando = passo.tipo === "rodar" && !respondida(i);
  const rodados = passos.slice(0, i + 1).map((p, k) => ({ p, k })).filter(({ p, k }) => p.tipo === "rodar" && (k < i || respondida(k)));
  const problemas = rodados.filter(({ p, k }) => p.tipo === "rodar" && p.marca && p.saiuCom !== 0 && k === lastRun(i)).map(({ p }) => (p as Extract<PassoIde, { tipo: "rodar" }>).marca!);
  function lastRun(ate: number) { for (let k = ate; k >= 0; k--) if (passos[k].tipo === "rodar") return k; return -1; }

  /* o arquivo à vista: o do passo, ou o da marca de erro, ou o que o leitor abriu */
  const doPasso = passo.tipo === "editar" ? passo.arquivo : passo.tipo === "rodar" && passo.marca && !esperando ? passo.marca.arquivo : null;
  useEffect(() => { if (doPasso) setAberto(doPasso); }, [i, doPasso]);
  const abas = [...estado.mexidos.keys()].filter((a) => versoes[estado.arquivos[a]]?.html);
  const vista = aberto && estado.arquivos[aberto] !== undefined ? aberto : abas[abas.length - 1] ?? Object.keys(estado.arquivos).find((a) => versoes[estado.arquivos[a]]?.html) ?? null;
  const versao = vista ? versoes[estado.arquivos[vista]] : null;
  const alteradas = passo.tipo === "editar" && passo.arquivo === vista ? passo.alteradas : [];
  const erro = problemas.find((m) => m.arquivo === vista);

  /* destaca as linhas alteradas e a do erro, e leva o editor até elas */
  useEffect(() => {
    const el = codigo.current;
    if (!el) return;
    el.querySelectorAll<HTMLElement>(".line").forEach((l) => {
      const n = Number(l.dataset.n);
      l.classList.toggle("ide-novo", alteradas.includes(n));
      l.classList.toggle("ide-erro", erro?.linha === n);
      if (erro?.linha === n) l.setAttribute("title", erro.texto); else l.removeAttribute("title");
    });
    const alvo = erro?.linha ?? alteradas[0];
    const linha = alvo ? el.querySelector<HTMLElement>(`.line[data-n="${alvo}"]`) : null;
    if (linha) el.scrollTo({ top: Math.max(linha.offsetTop - 60, 0) });
  }, [versao, alteradas.join(","), erro?.linha]);
  /* o terminal desce até o fim (a aposta, ou a saída nova) depois de pintar */
  useEffect(() => { const q = requestAnimationFrame(() => { const el = terminal.current; if (el) el.scrollTop = el.scrollHeight; }); return () => cancelAnimationFrame(q); }, [i, apostas, painel]);
  /* o terminal fica à vista depois da aposta (é onde está a saída e o veredito); os problemas ganham só o número na aba */
  useEffect(() => { setPainel("terminal"); }, [i]);

  const apostar = (op: number | "pulou") => { setApostas((a) => ({ ...a, [i]: op })); setPainel("terminal"); };
  const prompt = <><span className="ide-pr">voce@maquina</span>:<span className="ide-cwd">{pasta}</span>$ </>;

  return <div className="ide" data-direto={direto || undefined}>
    <div className="ide-barra">
      <span className="ide-luzes" aria-hidden="true"><i /><i /><i /></span>
      <span className="ide-titulo">{pasta.split("/").pop()}{vista ? ` — ${vista}` : ""}</span>
    </div>
    <div className="ide-corpo">
      <nav className="ide-explorador" aria-label="Arquivos do projeto">
        <small>explorador</small>
        <ul>
          {Object.keys(estado.arquivos).sort().map((a) => {
            const pode = !!versoes[estado.arquivos[a]]?.html;
            const marca = estado.mexidos.get(a);
            return <li key={a}>
              <button type="button" disabled={!pode} aria-current={a === vista || undefined} onClick={() => setAberto(a)}
                className={problemas.some((m) => m.arquivo === a) ? "ide-com-erro" : undefined}>
                {icone(a)}<span>{a}</span>{marca && <i className={`ide-git ide-git-${marca}`} title={marca === "U" ? "novo" : "alterado"}>{marca}</i>}
              </button>
            </li>;
          })}
        </ul>
      </nav>
      <div className="ide-editor">
        <div className="ide-abas" role="tablist" aria-label="Arquivos abertos">
          {abas.map((a) => <button key={a} type="button" role="tab" aria-selected={a === vista} onClick={() => setAberto(a)}>{icone(a)}{a.split("/").pop()}</button>)}
        </div>
        <div className="ide-codigo" ref={codigo} dangerouslySetInnerHTML={{ __html: versao?.html ?? "" }} />
        <div className="ide-painel">
          <div className="ide-painel-abas" role="tablist" aria-label="Painel">
            <button type="button" role="tab" aria-selected={painel === "terminal"} onClick={() => setPainel("terminal")}>terminal</button>
            <button type="button" role="tab" aria-selected={painel === "problemas"} onClick={() => setPainel("problemas")}>
              problemas{problemas.length > 0 && <i className="ide-conta">{problemas.length}</i>}
            </button>
          </div>
          {painel === "terminal"
            ? <div className="ide-terminal" ref={terminal} aria-live="polite">
                {rodados.map(({ p, k }) => p.tipo === "rodar" && <div key={k}>
                  <div>{prompt}{p.comando}</div>
                  {p.saida.map(([t, c], j) => <div key={j} className={c}>{t || " "}</div>)}
                </div>)}
                {esperando && passo.tipo === "rodar" && <div>
                  <div>{prompt}{passo.comando}</div>
                  <div className="ide-aposta" role="group" aria-label="Aposte antes de ver">
                    <b>aposte antes de ver</b>
                    <p>{passo.aposta!.pergunta}</p>
                    <div className="ide-opcoes">
                      {passo.aposta!.opcoes.map((o, k) => <button key={k} type="button" onClick={() => apostar(k)}>{o}</button>)}
                      <button type="button" className="ide-pular" onClick={() => apostar("pulou")}>só mostrar</button>
                    </div>
                  </div>
                </div>}
                {passo.tipo === "rodar" && passo.aposta && typeof apostas[i] === "number" && (
                  <div className={`ide-veredito ${apostas[i] === passo.aposta.certa ? "ide-acertou" : "ide-errou"}`}>
                    {apostas[i] === passo.aposta.certa ? <Check size={14} /> : <X size={14} />}
                    {apostas[i] === passo.aposta.certa ? "Você acertou." : `Você apostou "${passo.aposta.opcoes[apostas[i] as number]}". Saiu: ${passo.aposta.opcoes[passo.aposta.certa]}.`}
                  </div>
                )}
                {!esperando && <div>{prompt}<span className="ide-cursor" /></div>}
              </div>
            : <div className="ide-problemas">
                {problemas.length === 0 ? <p>Nenhum problema.</p> : problemas.map((m, k) => (
                  <button key={k} type="button" onClick={() => setAberto(m.arquivo)}><CircleAlert size={14} /><span>{m.texto}</span><small>{m.arquivo}, linha {m.linha}</small></button>
                ))}
              </div>}
        </div>
      </div>
    </div>
    <div className="ide-rodape">
      {!direto && <div className="ide-controles">
        <button type="button" onClick={() => setI(i - 1)} disabled={i === 0} aria-label="Passo anterior"><ChevronLeft size={18} /></button>
        <button type="button" className="ide-proximo" onClick={() => setI(i + 1)} disabled={i === ultimo || esperando}>
          {esperando ? "aposte para seguir" : i === ultimo ? "fim do trecho" : "próximo passo"}{!esperando && i < ultimo && <ChevronRight size={16} />}
        </button>
      </div>}
      <p className="ide-nota"><span>{direto ? "modo direto" : `passo ${i + 1} de ${passos.length}`}</span> {direto ? "O trecho inteiro: o código como ficou e o que cada comando mostrou."
        : esperando ? "Antes de rodar: o que você acha que vai acontecer? A nota deste passo aparece depois da aposta." : passo.nota}</p>
    </div>
  </div>;
}
