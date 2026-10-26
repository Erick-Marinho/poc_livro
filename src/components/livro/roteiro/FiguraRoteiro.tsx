/**
 * A ilha do roteiro do substituto, no 2.1 (docs/capacidades/capitulo-2-em-cenas.md, etapa 1): a animação
 * (RoteiroAnimado.tsx) andando com a rolagem da página (palco/RolaCena.tsx), com as explicações em balões. Escolhe o
 * desenho pela largura: no celular, o estreito. Para quem não vê o vídeo, os balões vão como texto, na ordem.
 */
import { useEffect, useMemo, useState } from "react";
import RolaCena from "../palco/RolaCena";
import { baloes, DURACAO, type Entrada, FPS, montarRoteiro } from "./roteiro.ts";
import { type Desenho, MEDIDAS } from "./pecas";
import { RoteiroAnimado } from "./RoteiroAnimado";

export default function FiguraRoteiro(entrada: Entrada) {
  const r = useMemo(() => montarRoteiro(entrada), [entrada]);
  const [desenho, setDesenho] = useState<Desenho>("largo");
  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const troca = () => setDesenho(mq.matches ? "estreito" : "largo");
    troca(); mq.addEventListener("change", troca);
    return () => mq.removeEventListener("change", troca);
  }, []);
  const M = MEDIDAS[desenho];
  const props = useMemo(() => ({ roteiro: r, desenho }), [r, desenho]);
  return <RolaCena chave={desenho} component={RoteiroAnimado} inputProps={props} duracao={DURACAO} fps={FPS} largura={M.w} altura={M.h}
    telas={8} reserva={desenho === "estreito" ? 100 : 110}
    descricao={<ol>{baloes(r).map((b) => <li key={b.de}>{b.texto}</li>)}</ol>} />;
}
