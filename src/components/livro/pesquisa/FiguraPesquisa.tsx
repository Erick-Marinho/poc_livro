/**
 * A ilha do vídeo da pesquisa sobre agentes em produção, na introdução (docs/capacidades/agentes-no-mundo.md, etapa 3):
 * a animação (PesquisaAnimada.tsx), que o leitor toca ou rola (palco/RolaCena.tsx), com as explicações em balões.
 * Escolhe o desenho pela largura: no celular, o estreito. Para quem não vê o vídeo, os balões vão como texto, na ordem.
 */
import { useEffect, useMemo, useState } from "react";
import RolaCena from "../palco/RolaCena";
import { baloes, DURACAO, FPS, type Pesquisa } from "./pesquisa.ts";
import { type Desenho, MEDIDAS, PesquisaAnimada } from "./PesquisaAnimada";

export default function FiguraPesquisa({ pesquisa }: { pesquisa: Pesquisa }) {
  const [desenho, setDesenho] = useState<Desenho>("largo");
  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const troca = () => setDesenho(mq.matches ? "estreito" : "largo");
    troca(); mq.addEventListener("change", troca);
    return () => mq.removeEventListener("change", troca);
  }, []);
  const M = MEDIDAS[desenho];
  const props = useMemo(() => ({ pesquisa, desenho }), [pesquisa, desenho]);
  return <RolaCena chave={desenho} component={PesquisaAnimada} inputProps={props} duracao={DURACAO} fps={FPS} largura={M.w} altura={M.h}
    telas={8} reserva={desenho === "estreito" ? 100 : 110}
    descricao={<ol>{baloes(pesquisa).map((b) => <li key={b.de}>{b.texto}</li>)}</ol>} />;
}
