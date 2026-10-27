/**
 * A ilha de "como o modelo escolhe", no experimento da temperatura zero (docs/capacidades/temperatura-zero-revisao.md,
 * etapa 4): a animação (EscolhaAnimada.tsx), que o leitor toca ou rola (palco/RolaCena.tsx), com balões. Escolhe o
 * desenho pela largura: no celular, o estreito. Para quem não vê o vídeo, os balões vão como texto, na ordem.
 */
import { useEffect, useMemo, useState } from "react";
import RolaCena from "../palco/RolaCena";
import { baloes, DURACAO, type Escolha, FPS } from "./escolha.ts";
import { type Desenho, EscolhaAnimada, MEDIDAS } from "./EscolhaAnimada";

export default function FiguraEscolha({ escolha }: { escolha: Escolha }) {
  const [desenho, setDesenho] = useState<Desenho>("largo");
  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const troca = () => setDesenho(mq.matches ? "estreito" : "largo");
    troca(); mq.addEventListener("change", troca);
    return () => mq.removeEventListener("change", troca);
  }, []);
  const M = MEDIDAS[desenho];
  const props = useMemo(() => ({ escolha, desenho }), [escolha, desenho]);
  return <RolaCena chave={desenho} component={EscolhaAnimada} inputProps={props} duracao={DURACAO} fps={FPS} largura={M.w} altura={M.h}
    telas={9} reserva={desenho === "estreito" ? 100 : 110}
    descricao={<ol>{baloes(escolha).map((b) => <li key={b.de}>{b.texto}</li>)}</ol>} />;
}
