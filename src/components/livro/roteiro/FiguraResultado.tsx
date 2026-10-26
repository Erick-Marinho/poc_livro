/**
 * A ilha da prova corrigida, no 2.6 (docs/capacidades/capitulo-2-em-cenas.md): a mesma grade do 2.4
 * (ProvaAnimado.tsx, no modo "resultado"), que o leitor toca ou rola (palco/RolaCena.tsx), com o que o agente decidiu
 * em cada pergunta e os balões do padrão. Escolhe o desenho pela largura. Para quem não vê o vídeo, os balões vão como
 * texto, na ordem.
 */
import { useEffect, useMemo, useState } from "react";
import RolaCena from "../palco/RolaCena";
import { type Desenho, MEDIDAS } from "./pecas";
import { baloesDoResultado, DURACAO_RESULTADO, type Entrada, FPS, montarResultado } from "./prova.ts";
import { ProvaAnimado } from "./ProvaAnimado";

type Props = Entrada & { medir: { saida: [string, string][] }; gravacao: Record<string, unknown>; motivo: string; seguro: string };

export default function FiguraResultado({ motivo, seguro, ...entrada }: Props) {
  const p = useMemo(() => montarResultado(entrada), [entrada]);
  const [desenho, setDesenho] = useState<Desenho>("largo");
  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const troca = () => setDesenho(mq.matches ? "estreito" : "largo");
    troca(); mq.addEventListener("change", troca);
    return () => mq.removeEventListener("change", troca);
  }, []);
  const M = MEDIDAS[desenho];
  const props = useMemo(() => ({ prova: p, desenho, modo: "resultado" as const, motivo, seguro }), [p, desenho, motivo, seguro]);
  return <RolaCena chave={desenho} component={ProvaAnimado} inputProps={props} duracao={DURACAO_RESULTADO} fps={FPS} largura={M.w} altura={M.h}
    telas={7} reserva={desenho === "estreito" ? 100 : 110}
    descricao={<ol>{baloesDoResultado(p, motivo, seguro).map((b) => <li key={b.de}>{b.texto}</li>)}</ol>} />;
}
