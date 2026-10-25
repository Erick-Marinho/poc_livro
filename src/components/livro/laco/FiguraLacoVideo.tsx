/**
 * A ilha do gráfico do laço, no 1.1 (docs/capacidades/laco-do-agente.md): a composição (LacoAnimado.tsx), contínua e com
 * câmera, no player do leitor (palco/TocaGrafico.tsx). Na parte do agente, o gráfico para quando a pergunta chega a
 * decidir, e o leitor investe no que o agente decide; depois, segue, e a figura diz se bateu. Com menos movimento, a
 * câmera fica parada.
 * Largo no computador, coluna no celular. Ao carregar, a ilha mostra o vídeo e fecha a figura em texto, que sem JS fica
 * aberta (FiguraLaco.astro). No celular, a figura sobe para o topo da tela quando o pedido para investir aparece: o
 * pedido cobre a parte de baixo, e decidir, onde a decisão acontece, fica à vista.
 */
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import TocaGrafico from "../palco/TocaGrafico";
import { cenaEm, type Desenho, type Entrada, FPS, montarCenas, pausaDe } from "./laco";
import { LacoAnimado, quadroDoLaco } from "./LacoAnimado";

const estreito = () => matchMedia("(max-width: 640px)").matches;

export default function FiguraLacoVideo({ laco, tresJeitos, clientes }: Entrada) {
  const [desenho, setDesenho] = useState<Desenho>("largo");
  const m = useMemo(() => montarCenas({ laco, tresJeitos }), [laco, tresJeitos]);
  const [movimento, setMovimento] = useState(true);
  const pausa = useMemo(() => pausaDe(m), [m]);
  const q = useMemo(() => quadroDoLaco({ laco, tresJeitos }, desenho), [laco, tresJeitos, desenho]);
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
      primeiro="▶ Ver quem decide" anuncio={(f) => cenaEm(m, f / FPS).cena.legenda} pausa={pausa ? { quadro: pausa.quadro, conteudo: perguntar } : undefined} />
    <p className="laco-resultado" aria-live="polite">
      {pausa && typeof escolha === "number" ? (
        <>Você investiu em <b>{pausa.opcoes[escolha]}</b> · o agente decidiu <b>{pausa.opcoes[pausa.certa]}</b> {escolha === pausa.certa ? "✓" : "✗"}</>
      ) : null}
    </p>
  </div>;
}
