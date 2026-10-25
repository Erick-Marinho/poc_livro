/**
 * A base das animações que o leitor avança cena a cena (docs/capacidades/laco-do-agente.md): a composição no Player do
 * Remotion, parada, e um botão discreto embaixo que toca a cena seguinte e para no fim dela; nada toca sozinho
 * (docs/RITMO.md). Com menos movimento, o avançar vai direto ao fim da cena; no modo direto, o quadro final, sem botão.
 * Para quem não vê o vídeo, a legenda de cada cena é anunciada. Quem usa diz os cortes (o quadro de início e de fim de
 * cada cena), o rótulo do primeiro avanço e o anúncio; e pode ouvir cada quadro (`aoQuadro`), para acender o que está
 * fora do vídeo. O Player: https://www.remotion.dev/docs/player/player (seekTo, play, pause e o evento frameupdate).
 */
import { Player, type PlayerRef } from "@remotion/player";
import { type ComponentType, type MouseEvent, useEffect, useRef, useState } from "react";
import { useDireto } from "./direto";
import "./palco.css";

export type Corte = { de: number; ate: number };
type Props<P extends Record<string, unknown>> = {
  component: ComponentType<P>; inputProps: P; duracao: number; fps: number; largura: number; altura: number;
  /** muda o desenho (anel ou coluna): o Player recomeça */
  chave?: string;
  cortes: Corte[];
  /** o rótulo do primeiro avanço, antes de qualquer cena */
  primeiro: string;
  /** o que se anuncia para o leitor de tela na cena k */
  anuncio: (k: number) => string;
  aoQuadro?: (quadro: number) => void;
};

export default function AvancaCena<P extends Record<string, unknown>>({ component, inputProps, duracao, fps, largura, altura, chave, cortes, primeiro, anuncio, aoQuadro }: Props<P>) {
  const ref = useRef<PlayerRef>(null);
  const direto = useDireto();
  const [cena, setCena] = useState(-1); // a última cena vista; -1: nenhuma
  const [tocando, setTocando] = useState(false);
  const alvo = useRef(-1); // o quadro onde a cena de agora termina
  const ouvir = useRef(aoQuadro);
  ouvir.current = aoQuadro;

  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const quadro = (e: { detail: { frame: number } }) => {
      ouvir.current?.(e.detail.frame);
      if (alvo.current >= 0 && e.detail.frame >= alvo.current) { p.pause(); p.seekTo(alvo.current); alvo.current = -1; setTocando(false); }
    };
    p.addEventListener("frameupdate", quadro);
    return () => p.removeEventListener("frameupdate", quadro);
  }, [chave]);

  /* no modo direto, o quadro final */
  useEffect(() => { if (direto) ref.current?.seekTo(duracao - 1); }, [direto, duracao, chave]);

  const avancar = (e: MouseEvent) => {
    const p = ref.current;
    if (!p || tocando) return;
    const k = cena + 1 >= cortes.length ? 0 : cena + 1;
    setCena(k);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      p.seekTo(cortes[k].ate);
      ouvir.current?.(cortes[k].ate);
      return;
    }
    p.seekTo(cortes[k].de);
    alvo.current = cortes[k].ate;
    setTocando(true);
    p.play(e);
  };

  const fim = cena === cortes.length - 1;
  const rotulo = tocando ? `cena ${cena + 1} de ${cortes.length}…` : cena < 0 ? primeiro : fim ? "↺ Ver de novo" : `▶ Próxima cena (${cena + 2} de ${cortes.length})`;
  return <>
    <Player key={chave} ref={ref} component={component} inputProps={inputProps} durationInFrames={duracao} fps={fps}
      compositionWidth={largura} compositionHeight={altura} initialFrame={direto ? duracao - 1 : 0}
      moveToBeginningWhenEnded={false} style={{ width: "100%", display: "block" }} acknowledgeRemotionLicense />
    {direto ? null : (
      <div className="ac-avancar">
        <button type="button" onClick={avancar} disabled={tocando} aria-label={rotulo.replace(/^[▶↺] /, "")}>{rotulo}</button>
        <span>{cena >= 0 ? `cena ${cena + 1} de ${cortes.length}` : "cena a cena: você avança quando quiser"}</span>
        <span className="ac-anuncio" aria-live="polite">{cena >= 0 ? anuncio(cena) : ""}</span>
      </div>
    )}
  </>;
}
