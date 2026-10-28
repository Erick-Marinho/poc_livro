/**
 * A ilha das figuras do KV cache (docs/capacidades/experimento-kv-cache.md, etapas 5 a 8): a jornada de uma pergunta
 * (JornadaAnimada.tsx) ou a atendente com e sem anotações (AnotacoesAnimadas.tsx), que o leitor toca ou rola (palco/RolaCena.tsx), com balões. Escolhe o desenho pela largura:
 * no celular, o estreito. Para quem não vê o vídeo, os balões vão como texto, na ordem.
 */
import { useEffect, useMemo, useState } from "react";
import RolaCena from "../palco/RolaCena";
import { AnotacoesAnimadas } from "./AnotacoesAnimadas";
import { JornadaAnimada, MEDIDAS_JORNADA } from "./JornadaAnimada";
import { ANOTACOES, baloes, duracao, FPS, JORNADA, type Jornada, type Kv } from "./kv.ts";
import { type Desenho, MEDIDAS } from "./pecas";

export type Qual = "jornada" | "anotacoes";
const FIGURAS = {
  jornada: { f: JORNADA, component: JornadaAnimada, medidas: MEDIDAS_JORNADA, chave: "jornada" },
  anotacoes: { f: ANOTACOES, component: AnotacoesAnimadas, medidas: MEDIDAS, chave: "kv" },
};

export default function FiguraKv({ dados, qual }: { dados: Kv | Jornada; qual: Qual }) {
  const [desenho, setDesenho] = useState<Desenho>("largo");
  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const troca = () => setDesenho(mq.matches ? "estreito" : "largo");
    troca(); mq.addEventListener("change", troca);
    return () => mq.removeEventListener("change", troca);
  }, []);
  const { f, component, medidas, chave } = FIGURAS[qual];
  const M = medidas[desenho];
  const props = useMemo(() => ({ [chave]: dados, desenho }), [dados, desenho, chave]);
  return <RolaCena chave={desenho} component={component as never} inputProps={props} duracao={duracao(f)} fps={FPS} largura={M.w} altura={M.h}
    telas={qual === "jornada" ? 9 : 8} reserva={desenho === "estreito" ? 100 : 110}
    descricao={<ol>{baloes(f).map((b) => <li key={b.de}>{b.texto}</li>)}</ol>} />;
}
