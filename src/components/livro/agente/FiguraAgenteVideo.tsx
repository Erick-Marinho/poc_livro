/**
 * A ilha da figura do agente: o vídeo no Player do Remotion, só com tocar e pausar, num botão discreto no canto.
 * Parada, mostra o fim do primeiro cenário; o primeiro play começa do início. No modo direto e para quem pede menos
 * movimento, mostra o último quadro. Nada toca sozinho.
 */
import { Player, type PlayerRef } from "@remotion/player";
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { useDireto } from "../palco/direto";
import { IC } from "../palco/Palco";
import { AgenteAoVivo, type Props, quadroDoVideo } from "./AgenteAoVivo";
import "../palco/palco.css";

export default function FiguraAgenteVideo({ cenarios, loja }: Props) {
  const ref = useRef<PlayerRef>(null);
  const direto = useDireto();
  const props = useMemo(() => ({ cenarios, loja }), [cenarios, loja]);
  const q = useMemo(() => quadroDoVideo(props), [props]);
  const [tocando, setTocando] = useState(false);
  const comecou = useRef(false);

  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const toca = () => setTocando(true), para = () => setTocando(false);
    p.addEventListener("play", toca); p.addEventListener("pause", para); p.addEventListener("ended", para);
    return () => { p.removeEventListener("play", toca); p.removeEventListener("pause", para); p.removeEventListener("ended", para); };
  }, []);
  useEffect(() => {
    if (direto || matchMedia("(prefers-reduced-motion: reduce)").matches) { ref.current?.pause(); ref.current?.seekTo(q.duracao - 1); }
  }, [direto, q.duracao]);

  const alternar = (e: MouseEvent) => {
    const p = ref.current;
    if (!p) return;
    if (p.isPlaying()) { p.pause(); return; }
    /* o primeiro play, e o play depois do fim, começam do início */
    if (!comecou.current || p.getCurrentFrame() >= q.duracao - 1) p.seekTo(0);
    comecou.current = true;
    p.play(e);
  };

  return <div className="palco" style={{ position: "relative" }}>
    <Player ref={ref} component={AgenteAoVivo} inputProps={props} durationInFrames={q.duracao} fps={q.fps}
      compositionWidth={q.largura} compositionHeight={q.altura} initialFrame={q.parado} moveToBeginningWhenEnded={false}
      style={{ width: "100%", display: "block" }} acknowledgeRemotionLicense />
    <button type="button" onClick={alternar} aria-label={tocando ? "pausar a simulação" : "tocar a simulação"}
      style={{ position: "absolute", right: 10, bottom: 10, width: 34, height: 34, borderRadius: "50%", display: "grid", placeItems: "center",
        background: "rgba(17, 19, 24, .72)", border: "1px solid rgba(231, 233, 238, .18)", color: "var(--palco-texto)", opacity: tocando ? .55 : .9 }}>
      <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={tocando ? IC.pausar : IC.tocar} /></svg>
    </button>
  </div>;
}
