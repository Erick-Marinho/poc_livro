/**
 * A ilha do dia seguinte, no 1.2 (docs/capacidades/capitulo-1-dinamicas.md, etapa 4): a animação (DiaAnimado.tsx), que
 * o leitor toca ou rola (palco/RolaCena.tsx), com as explicações em balões. Escolhe o desenho pela largura: no celular,
 * o estreito. Para quem não vê o vídeo, os balões vão como texto, na ordem.
 */
import { useEffect, useMemo, useState } from "react";
import RolaCena from "../palco/RolaCena";
import { baloes, type Dia, DURACAO, FPS } from "./dia.ts";
import { DiaAnimado, type Desenho, MEDIDAS } from "./DiaAnimado";

export default function FiguraDia({ dia }: { dia: Dia }) {
  const [desenho, setDesenho] = useState<Desenho>("largo");
  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const troca = () => setDesenho(mq.matches ? "estreito" : "largo");
    troca(); mq.addEventListener("change", troca);
    return () => mq.removeEventListener("change", troca);
  }, []);
  const M = MEDIDAS[desenho];
  const props = useMemo(() => ({ dia, desenho }), [dia, desenho]);
  return <RolaCena chave={desenho} component={DiaAnimado} inputProps={props} duracao={DURACAO} fps={FPS} largura={M.w} altura={M.h}
    telas={7} reserva={desenho === "estreito" ? 100 : 110}
    descricao={<ol>{baloes(dia).map((b) => <li key={b.de}>{b.texto}</li>)}</ol>} />;
}
