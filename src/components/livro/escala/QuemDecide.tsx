/**
 * Quem decide, num controle deslizante, no 1.1 (docs/capacidades/capitulo-1-dinamicas.md, etapa 3): o leitor arrasta
 * pelos quatro pontos da escala e vê a mesma mensagem atravessar o sistema daquele ponto. Os passos entram um a um,
 * cada um com quem o decidiu, e o contador diz quantas vezes o modelo decidiu. Os dados vêm de escala.ts.
 */
import { useState } from "react";
import type { Escala } from "./escala.ts";

const decidiu = (n: number) => (n === 0 ? "O modelo não decidiu nada." : `O modelo decidiu ${n === 1 ? "1 vez" : `${n} vezes`}.`);

export default function QuemDecide({ mensagem, pontos }: Escala) {
  const [i, setI] = useState(0);
  const p = pontos[i];

  return <div className="qd">
    <p className="qd-rotulo">quanto o modelo decide</p>
    <div className="qd-escala">
      <input type="range" min={0} max={pontos.length - 1} step={1} value={i} onChange={(e) => setI(Number(e.target.value))}
        aria-label="O ponto da escala" aria-valuetext={p.nome} />
      <div className="qd-nomes">
        {pontos.map((x, k) => <button key={x.nome} type="button" aria-pressed={k === i} onClick={() => setI(k)}
          style={{ left: `${(100 * k) / (pontos.length - 1)}%` }}>{x.nome}</button>)}
      </div>
    </div>

    <div className="qd-palco" aria-live="polite">
      <p className="qd-msg"><span>chega</span> <q>{mensagem.replace(/-/g, "\u2011")}</q></p>
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
    </div>
  </div>;
}
