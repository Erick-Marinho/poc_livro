/**
 * A ilha do mapa da temperatura zero (docs/capacidades/temperatura-zero-revisao.md, etapa 2): o vídeo (MapaAnimado.tsx),
 * que o leitor toca ou rola (palco/RolaCena.tsx), como as figuras do livro, com as explicações em balões. Escolhe o
 * desenho pela largura: no celular, o estreito, com as duas execuções ainda lado a lado. Para quem não vê o vídeo, os
 * balões vão como texto, na ordem.
 */
import { useEffect, useMemo, useState } from "react";
import RolaCena from "../palco/RolaCena";
import { baloes, DURACAO, FPS, montarMapa } from "./mapa.ts";
import { type Desenho, MapaAnimado, MEDIDAS } from "./MapaAnimado";

export default function MapaTemperatura({ bruto }: { bruto: string }) {
  const dados = useMemo(() => montarMapa(bruto), [bruto]);
  const [desenho, setDesenho] = useState<Desenho>("largo");
  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const troca = () => setDesenho(mq.matches ? "estreito" : "largo");
    troca(); mq.addEventListener("change", troca);
    return () => mq.removeEventListener("change", troca);
  }, []);
  const M = MEDIDAS[desenho];
  const props = useMemo(() => ({ dados, desenho }), [dados, desenho]);
  return <RolaCena chave={desenho} component={MapaAnimado} inputProps={props} duracao={DURACAO} fps={FPS} largura={M.w} altura={M.h}
    telas={9} reserva={desenho === "estreito" ? 100 : 110}
    descricao={<ol>{baloes(dados).map((b) => <li key={b.de}>{b.texto}</li>)}</ol>} />;
}
