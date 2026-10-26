/**
 * Monte a sua primeira questão da prova (docs/capacidades/capitulo-1-dinamicas.md, etapa 1): o leitor escolhe uma
 * mensagem do primeiro dia, preenche o id, marca a decisão, escreve o motivo e diz de que dados a resposta precisa; a
 * linha do referencia.jsonl se escreve enquanto ele preenche, e o contrato confere com as regras do contrato.py
 * (regras.ts). Quando o contrato aceita, a decisão é comparada com o gabarito da loja. No modo direto, a primeira
 * mensagem aparece preenchida como no arquivo, e aceita.
 */
import { useEffect, useState } from "react";
import { useDireto } from "../palco/direto";
import { conferir, linha, type Questao, type Regras } from "./regras.ts";

type Mensagem = Questao & { pergunta: string };
type Props = { regras: Regras; mensagens: Mensagem[]; nomes: Record<string, string>; pergunta: string };
const FONTES: Record<string, string> = { pedidos: "pedidos", politica: "política", catalogo: "catálogo" };

const vazia = (m: Mensagem): Questao => ({ id: m.id, pergunta: m.pergunta, decisao: "", motivo: "", precisa: [], pedido: m.pedido ?? "", email: m.email ?? "" });

export default function MontaQuestao({ regras, mensagens, nomes, pergunta }: Props) {
  const direto = useDireto();
  const [sel, setSel] = useState(0);
  const [q, setQ] = useState<Questao>(() => vazia(mensagens[0]));
  useEffect(() => { if (direto) { setSel(0); setQ({ ...mensagens[0] }); } }, [direto]);
  const m = mensagens[sel];
  const erros = conferir(q, regras);
  const aceita = erros.length === 0;
  const mudar = (parte: Partial<Questao>) => setQ((x) => ({ ...x, ...parte }));
  const escolher = (i: number) => { setSel(i); setQ(vazia(mensagens[i])); };
  const precisa = (f: string) => mudar({ precisa: q.precisa.includes(f) ? q.precisa.filter((x) => x !== f) : regras.fontes.filter((x) => x === f || q.precisa.includes(x)) });

  return <div className="mq">
    <p className="mq-rotulo">monte uma questão</p>
    <p className="mq-pergunta">{pergunta}</p>
    <div className="mq-mensagens" role="group" aria-label="As mensagens do primeiro dia">
      {mensagens.map((x, i) => (
        <button key={x.id} type="button" aria-pressed={i === sel} onClick={() => escolher(i)} disabled={direto}>“{x.pergunta.replace(/[,.]?\s+\S+@\S+$/, "")}”</button>
      ))}
    </div>

    <div className="mq-corpo">
      <div className="mq-campos">
        <label className="mq-campo"><span>id</span>
          <input value={q.id} onChange={(e) => mudar({ id: e.target.value })} disabled={direto} aria-invalid={erros.some((x) => x.campo === "id")} spellCheck={false} />
        </label>
        <div className="mq-campo"><span>pergunta</span><q>{q.pergunta}</q></div>
        <div className="mq-campo"><span>decisão</span>
          <div className="mq-opcoes" role="radiogroup" aria-label="A decisão">
            {regras.decisoes.map((d) => <button key={d} type="button" role="radio" aria-checked={q.decisao === d} onClick={() => mudar({ decisao: d })} disabled={direto}>{nomes[d] ?? d}</button>)}
          </div>
        </div>
        <label className="mq-campo"><span>motivo</span>
          <input value={q.motivo} onChange={(e) => mudar({ motivo: e.target.value })} placeholder="por que esta decisão, em uma frase" disabled={direto} />
        </label>
        <div className="mq-campo"><span>precisa</span>
          <div className="mq-opcoes">
            {regras.fontes.map((f) => (
              <label key={f} className="mq-marca"><input type="checkbox" checked={q.precisa.includes(f)} onChange={() => precisa(f)} disabled={direto} /> {FONTES[f] ?? f}</label>
            ))}
          </div>
        </div>
        <div className="mq-dupla">
          <label className="mq-campo"><span>pedido</span>
            <input value={q.pedido ?? ""} onChange={(e) => mudar({ pedido: e.target.value })} placeholder="nenhum" disabled={direto} spellCheck={false} />
          </label>
          <label className="mq-campo"><span>e-mail</span>
            <input value={q.email ?? ""} onChange={(e) => mudar({ email: e.target.value })} placeholder="nenhum" disabled={direto} spellCheck={false} />
          </label>
        </div>
      </div>

      <div className="mq-saida">
        <p className="mq-sub">a linha no <code>referencia.jsonl</code></p>
        <pre className="mq-linha"><code>{linha(q)}</code></pre>
        {aceita ? (
          <div className="mq-ok" aria-live="polite">
            <p><b>✓ O contrato aceita esta questão.</b> É uma linha a mais na prova.</p>
            <p className={q.decisao === m.decisao ? "mq-igual" : "mq-diferente"}>
              {q.decisao === m.decisao ? `E é a decisão do gabarito da loja: ${nomes[m.decisao]}.` : `O contrato confere a forma, não a decisão: no gabarito da loja, esta mensagem é ${nomes[m.decisao]}, porque “${m.motivo}”.`}
            </p>
          </div>
        ) : (
          <div className="mq-barra" aria-live="polite">
            <p><b>O contrato barra:</b></p>
            <ul>{erros.map((x) => <li key={x.texto}>{x.texto}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  </div>;
}
