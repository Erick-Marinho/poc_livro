/**
 * A ilha do formulário do substituto, no 2.2 (docs/capacidades/capitulo-2-em-cenas.md, etapa 2): a animação
 * (FormularioAnimado.tsx), que o leitor toca ou rola (palco/RolaCena.tsx), com as explicações em balões. Escolhe o
 * desenho pela largura: no celular, o estreito. Para quem não vê o vídeo, os balões vão como texto, na ordem.
 */
import { useEffect, useMemo, useState } from "react";
import RolaCena from "../palco/RolaCena";
import { baloes, DURACAO, type Entrada, FPS, montarFormulario } from "./formulario.ts";
import { FormularioAnimado } from "./FormularioAnimado";
import { type Desenho, MEDIDAS } from "./pecas";

export default function FiguraFormulario(entrada: Entrada) {
  const f = useMemo(() => montarFormulario(entrada), [entrada]);
  const [desenho, setDesenho] = useState<Desenho>("largo");
  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const troca = () => setDesenho(mq.matches ? "estreito" : "largo");
    troca(); mq.addEventListener("change", troca);
    return () => mq.removeEventListener("change", troca);
  }, []);
  const M = MEDIDAS[desenho];
  const props = useMemo(() => ({ formulario: f, desenho }), [f, desenho]);
  return <RolaCena chave={desenho} component={FormularioAnimado} inputProps={props} duracao={DURACAO} fps={FPS} largura={M.w} altura={M.h}
    telas={8} reserva={desenho === "estreito" ? 100 : 110}
    descricao={<ol>{baloes(f).map((b) => <li key={b.de}>{b.texto}</li>)}</ol>} />;
}
