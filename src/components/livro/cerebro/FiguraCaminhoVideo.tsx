/**
 * A ilha da figura "o que vamos construir": a composição, que o leitor toca ou rola com a página, como as outras
 * figuras do livro (palco/RolaCena.tsx; docs/capacidades/controles-nos-experimentos.md, 3c). No celular, o desenho em
 * pé (CaminhoEstreito.tsx). No modo direto, o último quadro. Para quem não vê o vídeo, as legendas vão como texto.
 */
import { useEffect, useMemo, useState } from "react";
import RolaCena from "../palco/RolaCena";
import { CaminhoDaPergunta } from "./CaminhoDaPergunta";
import { CaminhoEstreito, ESTREITO } from "./CaminhoEstreito";
import { montar, type Props, QUADRO, visiveis } from "./caminho";
import "./cerebro.css";

export default function FiguraCaminhoVideo({ bruto, comando, regua }: Props) {
  const props = useMemo(() => ({ bruto, comando, regua }), [bruto, comando, regua]);
  const passos = useMemo(() => visiveis(montar(props)), [props]);
  const [estreito, setEstreito] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const troca = () => setEstreito(mq.matches);
    troca(); mq.addEventListener("change", troca);
    return () => mq.removeEventListener("change", troca);
  }, []);
  return <div className="cdp">
    <RolaCena chave={estreito ? "estreito" : "largo"} component={estreito ? CaminhoEstreito : CaminhoDaPergunta} inputProps={props} duracao={QUADRO.duracao} fps={QUADRO.fps}
      largura={estreito ? ESTREITO.largura : QUADRO.largura} altura={estreito ? ESTREITO.altura : QUADRO.altura}
      telas={6} reserva={estreito ? 100 : 110} descricao={<ol>{passos.map((p) => <li key={p.em}>{p.texto}</li>)}</ol>} />
    {/* de onde vêm os números: o comando que gravou o rastro, executado no projeto do experimento */}
    <p className="cdp-fonte">os números vêm de <code>{comando}</code></p>
  </div>;
}
