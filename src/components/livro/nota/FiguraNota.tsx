/**
 * A ilha do vídeo da nota, na introdução (docs/capacidades/a-nota-na-introducao.md, etapa 2): a animação
 * (NotaAnimada.tsx), que o leitor toca ou rola (palco/RolaCena.tsx), com as explicações em balões. Escolhe o desenho
 * pela largura: no celular, o estreito. Para quem não vê o vídeo, os balões vão como texto, na ordem.
 */
import { useEffect, useMemo, useState } from "react";
import RolaCena from "../palco/RolaCena";
import { baloes, DURACAO, FPS, type Nota } from "./nota.ts";
import { type Desenho, MEDIDAS, NotaAnimada } from "./NotaAnimada";

export default function FiguraNota({ nota }: { nota: Nota }) {
  const [desenho, setDesenho] = useState<Desenho>("largo");
  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const troca = () => setDesenho(mq.matches ? "estreito" : "largo");
    troca(); mq.addEventListener("change", troca);
    return () => mq.removeEventListener("change", troca);
  }, []);
  const M = MEDIDAS[desenho];
  const props = useMemo(() => ({ nota, desenho }), [nota, desenho]);
  return <RolaCena chave={desenho} component={NotaAnimada} inputProps={props} duracao={DURACAO} fps={FPS} largura={M.w} altura={M.h}
    telas={8} reserva={desenho === "estreito" ? 100 : 110}
    descricao={<ol>{baloes(nota).map((b) => <li key={b.de}>{b.texto}</li>)}</ol>} />;
}
