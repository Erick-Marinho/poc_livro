/**
 * As peças comuns das figuras que rodam: ícones, abas, controles e linha do tempo.
 * Cada figura guarda o próprio estado; estas peças só desenham e avisam o que o leitor pediu.
 */
import { useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import "./palco.css";

export const Icone = ({ d, tam = 16 }: { d: string; tam?: number }) => (
  <svg viewBox="0 0 24 24" width={tam} height={tam} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
export const IC = {
  pessoa: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
  agente: "M12 3v3m-6 3h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Zm3 4h.01M15 13h.01M9 17h6",
  modelo: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm7 12 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z",
  codigo: "M8 8l-4 4 4 4m8-8 4 4-4 4M14 5l-4 14",
  ferramenta: "M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5Z",
  pedidos: "M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Zm0 0 8 4.5m0 0 8-4.5M12 12v9",
  politica: "M7 3h7l5 5v13H7V3Zm7 0v5h5M10 13h6m-6 4h6",
  catalogo: "M3 12V4h8l10 10-8 8L3 12Zm5-4h.01",
  resposta: "M4 5h16v11H9l-5 4V5Z",
  equipe: "M4 14v-2a8 8 0 0 1 16 0v2m-16 0h3v5H4v-5Zm13 0h3v5h-3v-5Z",
  tocar: "M7 4v16l13-8L7 4Z",
  pausar: "M7 4h3v16H7V4Zm7 0h3v16h-3V4Z",
  antes: "M6 5v14M19 5 9 12l10 7V5Z",
  depois: "M18 5v14M5 5l10 7-10 7V5Z",
  denovo: "M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4",
  certo: "M5 12.5 10 17 19 7",
  errado: "M6 6l12 12M18 6 6 18",
};

/** Abas no padrão do WAI-ARIA: setas, Home e End mudam de aba. */
export function Abas({ itens, atual, escolher, rotulo }: {
  itens: { chave: string; texto: string; cor?: string; titulo?: string }[]; atual: number; escolher: (i: number) => void; rotulo: string;
}) {
  const botoes = useRef<(HTMLButtonElement | null)[]>([]);
  const tecla = (ev: KeyboardEvent, i: number) => {
    const n = itens.length, mapa: Record<string, number> = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 };
    if (!(ev.key in mapa)) return;
    ev.preventDefault(); escolher(mapa[ev.key]); botoes.current[mapa[ev.key]]?.focus();
  };
  return <div className="palco-abas" role="tablist" aria-label={rotulo}>
    {itens.map((it, i) => (
      <button key={it.chave} ref={(el) => { botoes.current[i] = el; }} type="button" role="tab" aria-selected={i === atual} tabIndex={i === atual ? 0 : -1}
        className={it.cor ? `cor-${it.cor}` : undefined} onClick={() => escolher(i)} onKeyDown={(ev) => tecla(ev, i)} title={it.titulo}>
        <i />{it.texto}
      </button>
    ))}
  </div>;
}

/** Tocar/pausar (ou tocar de novo, no fim), passo anterior e próximo passo. */
export function Controles({ tocando, fim, passo, total, alternar, ir }: {
  tocando: boolean; fim: boolean; passo: number; total: number; alternar: () => void; ir: (i: number) => void;
}) {
  return <div className="palco-controles">
    <button type="button" onClick={alternar} aria-label={tocando ? "Pausar" : fim ? "Tocar de novo" : "Tocar"}><Icone d={tocando ? IC.pausar : fim ? IC.denovo : IC.tocar} /></button>
    <button type="button" onClick={() => ir(Math.max(passo - 1, 0))} disabled={passo === 0} aria-label="Passo anterior"><Icone d={IC.antes} /></button>
    <button type="button" onClick={() => ir(Math.min(passo + 1, total - 1))} disabled={passo === total - 1} aria-label="Próximo passo"><Icone d={IC.depois} /></button>
  </div>;
}

/** Um segmento por passo, do tamanho da duração dele; clicar leva ao passo. Embaixo, a narração do passo atual. */
export function LinhaDoTempo({ passos, passo, fracao, ir, narracao }: {
  passos: { duracao: number; texto: string }[]; passo: number; fracao: number; ir: (i: number) => void; narracao?: React.ReactNode;
}) {
  return <div className="palco-linha">
    <div className="palco-segmentos">
      {passos.map((p, i) => (
        <button key={i} type="button" style={{ flexGrow: p.duracao }} onClick={() => ir(i)} aria-label={`ir ao passo ${i + 1}: ${p.texto}`}>
          <span style={{ transform: `scaleX(${i < passo ? 1 : i === passo ? fracao : 0})` }} />
        </button>
      ))}
    </div>
    <p className="palco-narra"><span>{passo + 1}/{passos.length}</span> {narracao ?? passos[passo].texto}</p>
  </div>;
}

export type Mensagem = { chave: string; tipo: "cliente" | "agente" | "digitando" | "sistema"; autor?: string; texto?: string; cor?: string; nota?: ReactNode };

/* "e-mail" e número de pedido não quebram no hífen */
const QUEBRA = /([Ee]-mail|BT-\d+)/g;
const semQuebra = (texto?: string) => texto?.split(QUEBRA).map((parte, i) => (i % 2 ? <span key={i} className="palco-junto">{parte}</span> : parte));

/** A conversa como o cliente vê: o cabeçalho da loja, os balões e uma caixa de mensagem só de enfeite. */
export function Conversa({ mensagens }: { mensagens: Mensagem[] }) {
  const entra = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: .35 } };
  return <section className="palco-chat" aria-label="A conversa, como o cliente vê">
    <header><span className="palco-avatar">Bt</span><span><b>Casa Bem-te-vi</b><small><i className="palco-online" />atendimento</small></span></header>
    <div className="palco-mensagens">
      <AnimatePresence mode="popLayout" initial={false}>
        {mensagens.map((m) => m.tipo === "cliente"
          ? <motion.div key={m.chave} className="palco-msg palco-dele" {...entra}><small>{m.autor}</small><p>{semQuebra(m.texto)}</p></motion.div>
          : m.tipo === "digitando"
            ? <motion.div key={m.chave} className="palco-msg palco-resp palco-digitando" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                aria-label="escrevendo"><i /><i /><i /></motion.div>
            : m.tipo === "sistema"
              ? <motion.div key={m.chave} className="palco-sistema" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}>{m.texto}</motion.div>
              : <motion.div key={m.chave} className={`palco-msg palco-resp${m.cor ? ` cor-${m.cor}` : ""}`} {...entra}>
                  <small>{m.autor}</small><p>{semQuebra(m.texto)}</p>{m.nota}</motion.div>)}
      </AnimatePresence>
    </div>
    <footer aria-hidden="true"><span>Escreva uma mensagem…</span><Icone d="M4 12 20 4l-6 16-2-7-8-1Z" /></footer>
  </section>;
}
