/**
 * A ilha da figura "o que vamos construir": a composição, que o leitor toca ou rola com a página, como as outras
 * figuras do livro (palco/RolaCena.tsx; docs/capacidades/controles-nos-experimentos.md, 3c). No modo direto, o último
 * quadro. Para quem não vê o vídeo, as legendas de cada passo vão como texto.
 */
import { useMemo } from "react";
import RolaCena from "../palco/RolaCena";
import { CaminhoDaPergunta } from "./CaminhoDaPergunta";
import { montar, type Props, QUADRO, visiveis } from "./caminho";
import "./cerebro.css";

export default function FiguraCaminhoVideo({ bruto, comando, regua }: Props) {
  const props = useMemo(() => ({ bruto, comando, regua }), [bruto, comando, regua]);
  const passos = useMemo(() => visiveis(montar(props)), [props]);
  return <div className="cdp">
    <RolaCena component={CaminhoDaPergunta} inputProps={props} duracao={QUADRO.duracao} fps={QUADRO.fps} largura={QUADRO.largura} altura={QUADRO.altura}
      telas={6} reserva={110} descricao={<ol>{passos.map((p) => <li key={p.em}>{p.texto}</li>)}</ol>} />
    {/* de onde vêm os números: o comando que gravou o rastro, executado no projeto do experimento */}
    <p className="cdp-fonte">os números vêm de <code>{comando}</code></p>
  </div>;
}
