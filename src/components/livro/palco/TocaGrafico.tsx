/**
 * A base dos gráficos animados contínuos (docs/capacidades/laco-do-agente.md): a composição no Player do Remotion,
 * parada até o leitor apertar o play; depois, só pausar, continuar e ver de novo, sem barra de tempo: o leitor vê o
 * todo. Nada toca sozinho (docs/RITMO.md). Com `pausa`, o gráfico para uma vez naquele quadro, quando chega lá tocando,
 * à espera de uma decisão do leitor (o que `conteudo` mostra por cima), e segue quando ele decide. No
 * modo direto, o quadro final, sem controles nem pausa. Para quem não vê o gráfico, o trecho de agora é anunciado. O
 * Player: https://www.remotion.dev/docs/player/player (play, pause, seekTo, isPlaying e os eventos play, pause e
 * frameupdate).
 */
import { Player, type PlayerRef } from "@remotion/player";
import { type ComponentType, type MouseEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { useDireto } from "./direto";
import "./palco.css";

type Props<P extends Record<string, unknown>> = {
  component: ComponentType<P>; inputProps: P; duracao: number; fps: number; largura: number; altura: number;
  /** muda o desenho (largo ou coluna): o Player recomeça */
  chave?: string;
  /** o rótulo do play, antes de começar */
  primeiro: string;
  /** o que se anuncia para o leitor de tela no quadro de agora (muda só quando o trecho muda) */
  anuncio: (quadro: number) => string;
  /** uma parada para o leitor decidir; `seguir` continua o gráfico */
  pausa?: { quadro: number; conteudo: (seguir: (e?: MouseEvent) => void) => ReactNode };
};


export default function TocaGrafico<P extends Record<string, unknown>>({ component, inputProps, duracao, fps, largura, altura, chave, primeiro, anuncio, pausa }: Props<P>) {
  const ref = useRef<PlayerRef>(null);
  const direto = useDireto();
  const [tocando, setTocando] = useState(false);
  const [comecou, setComecou] = useState(false);
  const [quadro, setQuadro] = useState(0);
  const [parado, setParado] = useState(false); // na pausa, à espera do leitor
  const decidiu = useRef(false); // a pausa vale uma vez
  const quadroDaPausa = useRef(pausa?.quadro);
  quadroDaPausa.current = direto ? undefined : pausa?.quadro;

  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const tocar = () => { setTocando(true); setComecou(true); };
    const parar = () => setTocando(false);
    const andar = (e: { detail: { frame: number } }) => {
      const f = e.detail.frame;
      setQuadro((q) => (Math.abs(f - q) >= 3 || f === 0 || f >= duracao - 1 ? f : q)); // o anúncio e o fim, sem refazer tudo a cada quadro
      const q = quadroDaPausa.current;
      if (q !== undefined && !decidiu.current && p.isPlaying() && f >= q && f < q + 15) { p.pause(); p.seekTo(q); setQuadro(q); setParado(true); }
    };
    p.addEventListener("play", tocar);
    p.addEventListener("pause", parar);
    p.addEventListener("frameupdate", andar);
    return () => { p.removeEventListener("play", tocar); p.removeEventListener("pause", parar); p.removeEventListener("frameupdate", andar); };
  }, [chave, duracao]);

  /* no modo direto, o quadro final */
  useEffect(() => { if (direto) { ref.current?.pause(); ref.current?.seekTo(duracao - 1); setQuadro(duracao - 1); } }, [direto, duracao, chave]);

  const fim = quadro >= duracao - 1;
  const alternar = (e: MouseEvent) => {
    const p = ref.current;
    if (!p) return;
    if (p.isPlaying()) { p.pause(); return; }
    if (fim) p.seekTo(0);
    p.play(e);
  };
  const seguir = (e?: MouseEvent) => { decidiu.current = true; setParado(false); ref.current?.play(e); };

  const rotulo = !comecou ? primeiro : tocando ? "❚❚ Pausar" : fim ? "↺ Ver de novo" : "▶ Continuar";
  return <>
    <div style={{ position: "relative" }}>
      <Player key={chave} ref={ref} component={component} inputProps={inputProps} durationInFrames={duracao} fps={fps}
        compositionWidth={largura} compositionHeight={altura} initialFrame={direto ? duracao - 1 : 0}
        moveToBeginningWhenEnded={false} style={{ width: "100%", display: "block" }} acknowledgeRemotionLicense />
      {parado && pausa ? pausa.conteudo(seguir) : null}
    </div>
    {direto ? null : (
      <div className="ac-avancar tg-controles">
        <button type="button" onClick={alternar} disabled={parado} aria-label={rotulo.replace(/^(▶|↺|❚❚) /, "")}>{rotulo}</button>
        <span className="ac-anuncio" aria-live="polite">{comecou ? anuncio(quadro) : ""}</span>
      </div>
    )}
  </>;
}
