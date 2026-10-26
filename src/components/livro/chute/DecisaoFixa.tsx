/**
 * A decisão fixa, no 1.7 (docs/capacidades/capitulo-1-dinamicas.md, etapa 2): o leitor escolhe a decisão que um agente
 * que nem lê a mensagem repete, e as 20 perguntas da prova acendem: ✓ onde o gabarito é aquela decisão, ✗ nas outras.
 * A nota é o tamanho da fatia. No "responder", o R12 ganha um balão: o erro que a nota conta igual aos outros. Os dados
 * vêm de chute.ts. No modo direto, abre no "responder".
 */
import { useEffect, useState } from "react";
import { useDireto } from "../palco/direto";
import { porcento, type Chute } from "./chute.ts";

type Props = Chute & { nomes: Record<string, string>; pergunta: string; destaque: string };

export default function DecisaoFixa({ perguntas, ordem, notas, comando, nomes, pergunta, destaque }: Props) {
  const direto = useDireto();
  const [chute, setChute] = useState("");
  const [tentou, setTentou] = useState<string[]>([]);
  useEffect(() => { if (direto) escolher("responder"); }, [direto]);
  const escolher = (d: string) => { setChute(d); setTentou((t) => (t.includes(d) ? t : [...t, d])); };
  const nota = chute ? notas[chute] : null;
  const partida = notas.passar;
  const r = perguntas.find((p) => p.id === destaque)!;
  const comparar = !nota || chute === "passar" ? "" : nota.certos > partida.certos ? ", acima da nota de partida" : nota.certos < partida.certos ? ", abaixo da nota de partida" : ", a mesma da nota de partida";

  return <div className="df">
    <p className="df-rotulo">a decisão fixa</p>
    <p className="df-pergunta">{pergunta}</p>
    <div className="df-opcoes" role="radiogroup" aria-label="A decisão que o agente repete">
      {ordem.map((d) => (
        <button key={d} type="button" role="radio" aria-checked={chute === d} onClick={() => escolher(d)}>
          sempre {nomes[d]}{tentou.includes(d) && <span> · {porcento(notas[d])}</span>}
        </button>
      ))}
    </div>

    <div className={chute ? "df-prova df-feita" : "df-prova"} aria-label="As 20 perguntas da prova, agrupadas pela decisão do gabarito">
      {ordem.map((d) => {
        const grupo = perguntas.filter((p) => p.decisao === d);
        return <div key={d} className="df-grupo">
          <p className="df-nome"><b>{nomes[d]}</b> · {grupo.length}</p>
          <div className="df-quadros">
            {grupo.map((p, i) => {
              const certo = chute === d;
              const marca = chute === "responder" && p.id === destaque;
              return <span key={p.id} title={p.pergunta} style={{ transitionDelay: `${i * 30}ms` }}
                className={["df-q", chute && (certo ? "df-certo" : "df-errado"), marca && "df-marca"].filter(Boolean).join(" ")}>
                {p.id}<i aria-hidden="true">{chute ? (certo ? "✓" : "✗") : ""}</i>
              </span>;
            })}
          </div>
        </div>;
      })}
    </div>

    {nota ? <div className="df-nota" aria-live="polite">
      <p><b>{nota.certos} de {nota.total} · {porcento(nota)}</b>{comparar}. Acerta só as {nota.certos} em que o gabarito é {nomes[chute]}.
        {!direto && tentou.length < ordem.length && <span className="df-tente"> Tente as outras.</span>}</p>
      <p className="df-gravado"><code>$ {comando}</code> → <code>{nota.texto}</code> <span>{chute === "passar" ? "gravado" : "gravado, com o decisor trocado"}</span></p>
    </div> : <p className="df-antes">As 20 perguntas da prova, uma fila para cada decisão do gabarito.</p>}

    {chute === "responder" && <div className="df-balao" aria-live="polite">
      <p><b>{r.id}.</b> <q>{r.pergunta}</q></p>
      <p>O gabarito é {nomes[r.decisao]}, porque “{r.motivo}”. Responder poderia mostrar a compra da Ana ao Bruno. Para a nota, é um erro igual aos outros {nota!.total - nota!.certos - 1}.</p>
    </div>}
  </div>;
}
