/**
 * A ilha do mapa do ciclo animado (docs/capacidades/ciclo-animado.md): a composição (CicloAnimado.tsx) no Player, que o
 * leitor avança cena a cena, num botão discreto embaixo; nada toca sozinho. A aposta de cada problema é lida da aposta
 * da página (Aposta.astro), a cada avanço. A fase por onde o problema passa acende o cartão dela, e clicar num nó do
 * vídeo abre o cartão: a ilha só avisa a figura (evento "ciclo:fase"), e o MapaDoCiclo acende. Com menos movimento, o
 * avançar vai direto ao fim da cena; no modo direto, o quadro final, sem botão. Sem JS, fica o mapa parado.
 */
import { Player, type PlayerRef } from "@remotion/player";
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { useDireto } from "../palco/direto";
import type { Desenho } from "./Anel";
import { CicloAnimado, quadroDoCiclo } from "./CicloAnimado";
import { type Entrada, FPS, faseAcesa, limites, montarCenas } from "./cenas";

// a aposta da página com os mesmos problemas: o índice da opção que o leitor marcou em cada um, ou null
const lerApostas = (aposta: Entrada["aposta"]) => {
  const textos = aposta.mensagens.map((m) => (m.texto ?? "").trim());
  const caixa = [...document.querySelectorAll<HTMLElement>("[data-aposta]")]
    .find((a) => [...a.querySelectorAll(".apo-msg q")].map((q) => q.textContent?.trim()).join("|") === textos.join("|"));
  if (!caixa) return aposta.mensagens.map(() => null);
  return [...caixa.querySelectorAll(".apo-msg")].map((msg) => {
    const marcado = msg.querySelector<HTMLElement>('button[aria-pressed="true"]');
    return marcado ? Number(marcado.dataset.j) : null;
  });
};

const estreito = () => matchMedia("(max-width: 640px)").matches;

export default function FiguraCiclo({ ciclo, cenas, aposta }: Entrada) {
  const ref = useRef<PlayerRef>(null);
  const caixa = useRef<HTMLDivElement>(null);
  const direto = useDireto();
  const m = useMemo(() => montarCenas({ ciclo, cenas, aposta }), [ciclo, cenas, aposta]);
  const cortes = useMemo(() => limites(m), [m]);
  const [desenho, setDesenho] = useState<Desenho>("anel");
  const [apostas, setApostas] = useState<(number | null)[]>(() => aposta.mensagens.map(() => null));
  const [cena, setCena] = useState(-1); // a última cena vista; -1: nenhuma
  const [tocando, setTocando] = useState(false);
  const alvo = useRef(-1); // o quadro onde a cena de agora termina
  const acesa = useRef<string | undefined>(undefined);
  const q = useMemo(() => quadroDoCiclo({ ciclo, cenas, aposta }, desenho), [ciclo, cenas, aposta, desenho]);
  const props = useMemo(() => ({ ciclo, cenas, aposta, desenho, apostas }), [ciclo, cenas, aposta, desenho, apostas]);

  /* a figura passa a mostrar o vídeo no lugar do mapa parado; e escolhe anel ou coluna pela largura */
  useEffect(() => {
    const fig = caixa.current?.closest<HTMLElement>("[data-mapa-ciclo]");
    fig?.setAttribute("data-animado", "");
    const mq = matchMedia("(max-width: 640px)");
    const troca = () => setDesenho(estreito() ? "coluna" : "anel");
    troca(); mq.addEventListener("change", troca);
    return () => { fig?.removeAttribute("data-animado"); mq.removeEventListener("change", troca); };
  }, []);

  /* avisa a figura de qual fase acender (o cartão), só quando ela muda */
  const avisar = (id: string | undefined, abrir = false) => {
    if (!id || (id === acesa.current && !abrir)) return;
    acesa.current = id;
    caixa.current?.closest("[data-mapa-ciclo]")?.dispatchEvent(new CustomEvent("ciclo:fase", { detail: { id, abrir } }));
  };

  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const quadro = (e: { detail: { frame: number } }) => {
      avisar(faseAcesa(m, e.detail.frame / FPS));
      if (alvo.current >= 0 && e.detail.frame >= alvo.current) { p.pause(); p.seekTo(alvo.current); alvo.current = -1; setTocando(false); }
    };
    p.addEventListener("frameupdate", quadro);
    return () => p.removeEventListener("frameupdate", quadro);
  }, [m, desenho]);

  /* no modo direto, o quadro final */
  useEffect(() => { if (direto) ref.current?.seekTo(q.duracao - 1); }, [direto, q.duracao, desenho]);

  const avancar = (e: MouseEvent) => {
    const p = ref.current;
    if (!p || tocando) return;
    setApostas(lerApostas(aposta));
    const k = cena + 1 >= cortes.length ? 0 : cena + 1;
    setCena(k);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      p.seekTo(cortes[k].ate);
      avisar(faseAcesa(m, cortes[k].ate / FPS));
      return;
    }
    p.seekTo(cortes[k].de);
    alvo.current = cortes[k].ate;
    setTocando(true);
    p.play(e);
  };

  /* clicar num nó do vídeo abre o cartão dele */
  const clicar = (e: MouseEvent) => {
    const no = (e.target as Element).closest<SVGGElement>("[data-no]");
    if (no?.dataset.no) avisar(no.dataset.no, true);
  };

  const fim = cena === cortes.length - 1;
  const rotulo = tocando ? `cena ${cena + 1} de ${cortes.length}…` : cena < 0 ? "▶ Ver onde cada problema é capturado" : fim ? "↺ Ver de novo" : `▶ Próxima cena (${cena + 2} de ${cortes.length})`;
  return <div ref={caixa} className="mc-video" onClick={clicar}>
    <Player key={desenho} ref={ref} component={CicloAnimado} inputProps={props} durationInFrames={q.duracao} fps={q.fps}
      compositionWidth={q.largura} compositionHeight={q.altura} initialFrame={direto ? q.duracao - 1 : 0}
      moveToBeginningWhenEnded={false} style={{ width: "100%", display: "block" }} acknowledgeRemotionLicense />
    {direto ? null : (
      <div className="mc-avancar">
        <button type="button" onClick={avancar} disabled={tocando} aria-label={rotulo.replace(/^[▶↺] /, "")}>{rotulo}</button>
        <span>{cena >= 0 ? `cena ${cena + 1} de ${cortes.length}` : "cena a cena: você avança quando quiser"}</span>
        {/* para quem não vê o vídeo: a legenda de cada cena, anunciada */}
        <span className="mc-anuncio" aria-live="polite">{cena >= 0 ? m.cenas[cena].legenda : ""}</span>
      </div>
    )}
  </div>;
}
