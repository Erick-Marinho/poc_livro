/**
 * A ilha dos tempos de verdade (docs/capacidades/pausa-e-fluxo-revisao.md, etapa 3): a linha do tempo da coleta
 * (TemposAnimados.tsx), que o leitor toca ou rola (palco/RolaCena.tsx). Tocando, corre em tempo real: o leitor sente a
 * pausa de cada mensagem. No celular, o desenho estreito. Para quem não vê o vídeo, as legendas vão como texto.
 */
import { useEffect, useMemo, useState } from "react";
import RolaCena from "../palco/RolaCena";
import { DURACAO, FPS, legendas, type Tempos } from "./tempos.ts";
import { type Desenho, MEDIDAS, TemposAnimados } from "./TemposAnimados";

export default function FiguraTempos({ tempos }: { tempos: Tempos }) {
  const [desenho, setDesenho] = useState<Desenho>("largo");
  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const troca = () => setDesenho(mq.matches ? "estreito" : "largo");
    troca(); mq.addEventListener("change", troca);
    return () => mq.removeEventListener("change", troca);
  }, []);
  const M = MEDIDAS[desenho];
  const props = useMemo(() => ({ tempos, desenho }), [tempos, desenho]);
  return <RolaCena chave={desenho} component={TemposAnimados} inputProps={props} duracao={DURACAO} fps={FPS} largura={M.w} altura={M.h}
    telas={7} reserva={desenho === "estreito" ? 100 : 110} velocidade={1}
    descricao={<ol>{legendas(tempos).map((l) => <li key={l.de}>{l.texto}</li>)}</ol>} />;
}
