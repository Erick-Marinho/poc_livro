/**
 * Quanto o modelo decide, no 1.1 (docs/capacidades/capitulo-1-dinamicas.md, etapa 3; docs/capacidades/torre-de-autonomia.md):
 * uma torre de quatro andares, do fluxo fixo (o código decide tudo) aos vários agentes. Primeiro, a torre inteira, com
 * uma frase curta por andar: é a introdução. O leitor toca num andar, e a mesma mensagem atravessa o sistema daquele
 * andar, ao lado: os passos entram um a um, cada um com quem o decidiu, e o contador diz quantas vezes o modelo
 * decidiu. Os dados vêm de escala.ts.
 */
import { useState } from "react";
import type { Escala } from "./escala.ts";

const decidiu = (n: number) => (n === 0 ? "O modelo não decidiu nada." : `O modelo decidiu ${n === 1 ? "1 vez" : `${n} vezes`}.`);

export default function QuemDecide({ mensagem, pontos }: Escala) {
  const [i, setI] = useState<number | null>(null);
  const p = i === null ? null : pontos[i];
  /* do topo para o térreo: o andar mais alto é o que mais decide */
  const andares = pontos.map((x, k) => ({ ...x, k })).reverse();

  return <div className="qd">
    <p className="qd-rotulo">quanto o modelo decide</p>
    <div className="qd-corpo">
      <div className="qd-torre" role="group" aria-label="A torre de autonomia: toque num andar">
        <span className="qd-topo">mais o modelo decide ↑</span>
        {andares.map((a) => (
          <button key={a.nome} type="button" className="qd-andar" aria-pressed={a.k === i} onClick={() => setI(a.k)}
            style={{ ["--n" as string]: a.k }}>
            <span className="qd-num">{a.k + 1}</span>
            <span className="qd-andar-nome">{a.nome}</span>
            <span className="qd-resumo">{a.resumo}</span>
            <span className="qd-pontos" aria-hidden="true">{Array.from({ length: Math.max(a.decide, 0) }, (_, j) => <i key={j} />)}</span>
          </button>
        ))}
      </div>

      <div className="qd-palco" aria-live="polite">
        {!p ? <p className="qd-convite">Toque num andar e veja a mesma mensagem passar por ele.</p> : <>
          <p className="qd-msg"><span>chega</span> <q>{mensagem.replace(/-/g, "‑")}</q></p>
          <ol key={i} className="qd-passos">
            {p.passos.map((s, k) => (
              <li key={k} style={{ animationDelay: `${k * 260}ms` }} className={s.quem === "modelo" ? "qd-modelo" : "qd-codigo"}>
                <span className="qd-quem">{s.quem === "modelo" ? (s.papel ?? "o modelo") : "o código"} decide</span>
                <span className="qd-texto">{s.texto}</span>
                {s.executa && <span className="qd-executa">↳ o seu código executa: {s.executa}</span>}
              </li>
            ))}
          </ol>
          <p className="qd-conta"><b>{decidiu(p.decide)}</b> {p.frase}</p>
        </>}
      </div>
    </div>
  </div>;
}
