/**
 * A ilha do grafo do agente, no 2.1 (docs/capacidades/grafos-no-capitulo-2.md, etapa 1): a animação
 * (RoteiroAnimado.tsx) andando com a rolagem da página (palco/RolaCena.tsx), com as explicações em balões. Escolhe o
 * desenho pela largura: no celular, o estreito. Para quem não vê o vídeo, os balões vão como texto, na ordem.
 */
import { useEffect, useMemo, useState } from "react";
import RolaCena from "../palco/RolaCena";
import { baloes, DURACAO, type Entrada, estados as estadosDe, FPS, montarRoteiro } from "./roteiro.ts";
import { type Desenho, MEDIDAS } from "./pecas";
import { RoteiroAnimado } from "./RoteiroAnimado";

export default function FiguraRoteiro({ agente, ...entrada }: Entrada & { agente: string }) {
  const r = useMemo(() => montarRoteiro(entrada), [entrada]);
  const estados = useMemo(() => estadosDe(r, agente), [r, agente]);
  const [desenho, setDesenho] = useState<Desenho>("largo");
  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const troca = () => setDesenho(mq.matches ? "estreito" : "largo");
    troca(); mq.addEventListener("change", troca);
    return () => mq.removeEventListener("change", troca);
  }, []);
  const M = MEDIDAS[desenho];
  const props = useMemo(() => ({ roteiro: r, estados, desenho }), [r, estados, desenho]);
  return <RolaCena chave={desenho} component={RoteiroAnimado} inputProps={props} duracao={DURACAO} fps={FPS} largura={M.w} altura={M.h}
    telas={8} reserva={desenho === "estreito" ? 100 : 110}
    descricao={<ol>{baloes(r).map((b) => <li key={b.de}>{b.texto}</li>)}</ol>} />;
}
