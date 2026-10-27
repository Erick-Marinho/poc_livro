/**
 * A ilha da pausa e do fluxo (docs/capacidades/experimento-pausa-e-fluxo.md, etapa 5): a animação (PausaAnimada.tsx),
 * que o leitor toca ou rola (palco/RolaCena.tsx), com balões. Escolhe o desenho pela largura: no celular, o estreito.
 * Para quem não vê o vídeo, os balões vão como texto, na ordem.
 */
import { useEffect, useMemo, useState } from "react";
import RolaCena from "../palco/RolaCena";
import { baloes, DURACAO, FPS, type Pausa } from "./pausa.ts";
import { type Desenho, MEDIDAS, PausaAnimada } from "./PausaAnimada";

export default function FiguraPausa({ pausa }: { pausa: Pausa }) {
  const [desenho, setDesenho] = useState<Desenho>("largo");
  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const troca = () => setDesenho(mq.matches ? "estreito" : "largo");
    troca(); mq.addEventListener("change", troca);
    return () => mq.removeEventListener("change", troca);
  }, []);
  const M = MEDIDAS[desenho];
  const props = useMemo(() => ({ pausa, desenho }), [pausa, desenho]);
  return <RolaCena chave={desenho} component={PausaAnimada} inputProps={props} duracao={DURACAO} fps={FPS} largura={M.w} altura={M.h}
    telas={8} reserva={desenho === "estreito" ? 100 : 110}
    descricao={<ol>{baloes().map((b) => <li key={b.de}>{b.texto}</li>)}</ol>} />;
}
