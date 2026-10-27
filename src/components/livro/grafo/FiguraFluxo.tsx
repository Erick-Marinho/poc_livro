/**
 * A ilha de "fluxo ou agente", no 1.1 (docs/capacidades/fluxo-ou-agente.md): o grafo animado (FluxoAnimado.tsx), que o
 * leitor toca ou rola (palco/RolaCena.tsx), com balões. Escolhe o desenho pela largura: no celular, o estreito. Para quem
 * não vê o vídeo, os balões vão como texto, na ordem.
 */
import { useEffect, useMemo, useState } from "react";
import RolaCena from "../palco/RolaCena";
import { baloes, DURACAO, type Fluxo, FPS } from "./fluxo.ts";
import { type Desenho, FluxoAnimado, MEDIDAS } from "./FluxoAnimado";

export default function FiguraFluxo({ fluxo }: { fluxo: Fluxo }) {
  const [desenho, setDesenho] = useState<Desenho>("largo");
  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const troca = () => setDesenho(mq.matches ? "estreito" : "largo");
    troca(); mq.addEventListener("change", troca);
    return () => mq.removeEventListener("change", troca);
  }, []);
  const M = MEDIDAS[desenho];
  const props = useMemo(() => ({ fluxo, desenho }), [fluxo, desenho]);
  return <RolaCena chave={desenho} component={FluxoAnimado} inputProps={props} duracao={DURACAO} fps={FPS} largura={M.w} altura={M.h}
    telas={9} reserva={desenho === "estreito" ? 100 : 110}
    descricao={<ol>{baloes(fluxo).map((b) => <li key={b.de}>{b.texto}</li>)}</ol>} />;
}
