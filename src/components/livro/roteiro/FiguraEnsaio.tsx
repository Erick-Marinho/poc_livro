/**
 * A ilha do ensaio do substituto, no 2.3 (docs/capacidades/capitulo-2-em-cenas.md, etapa 3): a animação
 * (EnsaioAnimado.tsx), que o leitor toca ou rola (palco/RolaCena.tsx), com as explicações em balões. Escolhe o
 * desenho pela largura: no celular, o estreito. Para quem não vê o vídeo, os balões vão como texto, na ordem.
 */
import { useEffect, useMemo, useState } from "react";
import RolaCena from "../palco/RolaCena";
import { baloes, DURACAO, type Entrada, FPS, montarEnsaio } from "./ensaio.ts";
import { EnsaioAnimado } from "./EnsaioAnimado";
import { type Desenho, MEDIDAS } from "./pecas";

export default function FiguraEnsaio(entrada: Entrada) {
  const e = useMemo(() => montarEnsaio(entrada), [entrada]);
  const [desenho, setDesenho] = useState<Desenho>("largo");
  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const troca = () => setDesenho(mq.matches ? "estreito" : "largo");
    troca(); mq.addEventListener("change", troca);
    return () => mq.removeEventListener("change", troca);
  }, []);
  const M = MEDIDAS[desenho];
  const props = useMemo(() => ({ ensaio: e, desenho }), [e, desenho]);
  return <RolaCena chave={desenho} component={EnsaioAnimado} inputProps={props} duracao={DURACAO} fps={FPS} largura={M.w} altura={M.h}
    telas={7} reserva={desenho === "estreito" ? 100 : 110}
    descricao={<ol>{baloes(e).map((b) => <li key={b.de}>{b.texto}</li>)}</ol>} />;
}
