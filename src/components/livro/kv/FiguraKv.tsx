/**
 * A ilha das duas figuras do KV cache (docs/capacidades/experimento-kv-cache.md, etapa 5): os quatro caches
 * (CachesAnimados.tsx) ou a atendente com e sem anotações (AnotacoesAnimadas.tsx), que o leitor toca ou rola
 * (palco/RolaCena.tsx), com balões. Escolhe o desenho pela largura: no celular, o estreito. Para quem não vê o vídeo,
 * os balões vão como texto, na ordem.
 */
import { useEffect, useMemo, useState } from "react";
import RolaCena from "../palco/RolaCena";
import { AnotacoesAnimadas } from "./AnotacoesAnimadas";
import { CachesAnimados } from "./CachesAnimados";
import { ANOTACOES, baloes, CACHES, duracao, FPS, type Kv } from "./kv.ts";
import { type Desenho, MEDIDAS } from "./pecas";

export type Qual = "caches" | "anotacoes";
const FIGURAS = { caches: { f: CACHES, component: CachesAnimados }, anotacoes: { f: ANOTACOES, component: AnotacoesAnimadas } };

export default function FiguraKv({ kv, qual }: { kv: Kv; qual: Qual }) {
  const [desenho, setDesenho] = useState<Desenho>("largo");
  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const troca = () => setDesenho(mq.matches ? "estreito" : "largo");
    troca(); mq.addEventListener("change", troca);
    return () => mq.removeEventListener("change", troca);
  }, []);
  const M = MEDIDAS[desenho];
  const { f, component } = FIGURAS[qual];
  const props = useMemo(() => ({ kv, desenho }), [kv, desenho]);
  return <RolaCena chave={desenho} component={component} inputProps={props} duracao={duracao(f)} fps={FPS} largura={M.w} altura={M.h}
    telas={8} reserva={desenho === "estreito" ? 100 : 110}
    descricao={<ol>{baloes(f).map((b) => <li key={b.de}>{b.texto}</li>)}</ol>} />;
}
