/**
 * A ilha da figura "o que vamos construir": a composição no Player do Remotion, com controles. Não toca sozinha (o
 * leitor aperta o play); no modo direto e para quem pede menos movimento, abre no último quadro.
 */
import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useMemo, useRef } from "react";
import { useDireto } from "../palco/direto";
import { CaminhoDaPergunta } from "./CaminhoDaPergunta";
import { type Props, QUADRO } from "./caminho";
import "../palco/palco.css";
import "./cerebro.css";

export default function FiguraCaminhoVideo({ bruto, comando, regua }: Props) {
  const ref = useRef<PlayerRef>(null);
  const direto = useDireto();
  const props = useMemo(() => ({ bruto, comando, regua }), [bruto, comando, regua]);
  useEffect(() => {
    if (direto || matchMedia("(prefers-reduced-motion: reduce)").matches) { ref.current?.pause(); ref.current?.seekTo(QUADRO.duracao - 1); }
  }, [direto]);

  return <div className="palco cdp">
    <Player ref={ref} component={CaminhoDaPergunta} inputProps={props} durationInFrames={QUADRO.duracao} fps={QUADRO.fps}
      compositionWidth={QUADRO.largura} compositionHeight={QUADRO.altura} controls style={{ width: "100%" }}
      acknowledgeRemotionLicense />
    {/* de onde vêm os números: o comando que gravou o rastro, rodado no projeto do experimento */}
    <p className="cdp-fonte">os números vêm de <code>{comando}</code></p>
  </div>;
}
