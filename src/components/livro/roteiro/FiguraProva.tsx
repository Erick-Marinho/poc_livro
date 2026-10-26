/**
 * A ilha da prova do substituto, no 2.4 (docs/capacidades/capitulo-2-em-cenas.md, etapa 4): a animação
 * (ProvaAnimado.tsx), que o leitor toca ou rola (palco/RolaCena.tsx), com as explicações em balões. Escolhe o
 * desenho pela largura: no celular, o estreito. Para quem não vê o vídeo, os balões vão como texto, na ordem.
 */
import { useEffect, useMemo, useState } from "react";
import RolaCena from "../palco/RolaCena";
import { type Desenho, MEDIDAS } from "./pecas";
import { baloes, DURACAO, type Entrada, FPS, montarProva } from "./prova.ts";
import { ProvaAnimado } from "./ProvaAnimado";

export default function FiguraProva(entrada: Entrada) {
  const p = useMemo(() => montarProva(entrada), [entrada]);
  const [desenho, setDesenho] = useState<Desenho>("largo");
  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const troca = () => setDesenho(mq.matches ? "estreito" : "largo");
    troca(); mq.addEventListener("change", troca);
    return () => mq.removeEventListener("change", troca);
  }, []);
  const M = MEDIDAS[desenho];
  const props = useMemo(() => ({ prova: p, desenho }), [p, desenho]);
  return <RolaCena chave={desenho} component={ProvaAnimado} inputProps={props} duracao={DURACAO} fps={FPS} largura={M.w} altura={M.h}
    telas={7} reserva={desenho === "estreito" ? 100 : 110}
    descricao={<ol>{baloes(p).map((b) => <li key={b.de}>{b.texto}</li>)}</ol>} />;
}
