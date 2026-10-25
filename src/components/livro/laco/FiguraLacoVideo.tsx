/**
 * A ilha da figura 1.1 (docs/capacidades/laco-do-agente.md): a composição (LacoAnimado.tsx), um jeito por vez, no
 * player do leitor (palco/TocaGrafico.tsx). Antes da vez do fluxo fixo com a frigideira, o gráfico para e o leitor
 * investe no que ele faz; depois, segue, e a figura diz se bateu. Com menos movimento, os passos aparecem sem deslizar.
 * Largo no computador, coluna no celular. Ao carregar, a ilha mostra o vídeo e fecha a figura em texto, que sem JS fica
 * aberta (FiguraLaco.astro). No celular, a figura sobe para o topo da tela quando o pedido para investir aparece: o
 * pedido cobre a parte de baixo, e a mensagem fica à vista.
 */
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import TocaGrafico from "../palco/TocaGrafico";
import { type Desenho, type Entrada, FPS, montarTrechos, pausaDe, trechoEm } from "./laco";
import { LacoAnimado, quadroDoLaco } from "./LacoAnimado";

const estreito = () => matchMedia("(max-width: 640px)").matches;

export default function FiguraLacoVideo({ laco, tresJeitos, clientes }: Entrada) {
  const [desenho, setDesenho] = useState<Desenho>("largo");
  const m = useMemo(() => montarTrechos({ laco, tresJeitos, clientes }), [laco, tresJeitos, clientes]);
  const [movimento, setMovimento] = useState(true);
  const pausa = useMemo(() => pausaDe(m), [m]);
  const q = useMemo(() => quadroDoLaco({ laco, tresJeitos, clientes }, desenho), [laco, tresJeitos, clientes, desenho]);
  const props = useMemo(() => ({ laco, tresJeitos, clientes, desenho, movimento }), [laco, tresJeitos, clientes, desenho, movimento]);
  const [escolha, setEscolha] = useState<number | null | undefined>(undefined); // undefined: ainda não investiu; null: pulou
  const primeira = useRef<HTMLButtonElement>(null);
  const caixa = useRef<HTMLDivElement>(null);

  /* a figura passa a mostrar o vídeo, e a versão em texto se fecha (sem JS, ela é a figura) */
  useEffect(() => {
    const fig = caixa.current?.closest<HTMLElement>("figure[data-laco]");
    fig?.setAttribute("data-animado", "");
    const texto = fig?.querySelector<HTMLDetailsElement>("details.laco-texto");
    if (texto) texto.open = false;
    return () => fig?.removeAttribute("data-animado");
  }, []);

  /* largo ou coluna, pela largura; e a câmera parada para quem pede menos movimento */
  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)"), menos = matchMedia("(prefers-reduced-motion: reduce)");
    const troca = () => { setDesenho(estreito() ? "coluna" : "largo"); setMovimento(!menos.matches); };
    troca(); mq.addEventListener("change", troca); menos.addEventListener("change", troca);
    return () => { mq.removeEventListener("change", troca); menos.removeEventListener("change", troca); };
  }, []);

  const perguntar = (seguir: (e?: MouseEvent) => void) => {
    if (!pausa) return null;
    const investir = (k: number | null, e: MouseEvent) => { setEscolha(k); seguir(e); };
    return (
      <div role="group" aria-label="invista" className="laco-investir" ref={(el) => {
        if (!el) return;
        primeira.current?.focus({ preventScroll: true }); // o foco não rola a página no meio do toque
        if (estreito()) caixa.current?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      }}>
        <span className="laco-pista">“{pausa.pista}”</span>
        <b>{pausa.pergunta}</b>
        <div className="laco-opcoes">
          {pausa.opcoes.map((o, k) => (
            <button key={o} ref={k === 0 ? primeira : undefined} type="button" onClick={(e) => investir(k, e)}>{o}</button>
          ))}
        </div>
        <button type="button" className="laco-pular" onClick={(e) => investir(null, e)}>pular e ver</button>
      </div>
    );
  };

  return <div ref={caixa} className="laco-video">
    <TocaGrafico chave={desenho} component={LacoAnimado} inputProps={props} duracao={q.duracao} fps={q.fps} largura={q.largura} altura={q.altura}
      primeiro="▶ Ver quem decide" anuncio={(f) => { const t = trechoEm(m, f / FPS).trecho; return t.vez ? `${t.vez.nome}, com ${t.vez.rotulo}: quem decide é ${t.vez.quemDecide}.` : t.legenda ?? ""; }} pausa={pausa ? { quadro: pausa.quadro, conteudo: perguntar } : undefined} />
    <p className="laco-resultado" aria-live="polite">
      {pausa && typeof escolha === "number" ? (
        <>Você investiu em <b>{pausa.opcoes[escolha]}</b> · o {pausa.jeito} <b>{pausa.opcoes[pausa.certa]}</b> {escolha === pausa.certa ? "✓" : "✗"}</>
      ) : null}
    </p>
  </div>;
}
