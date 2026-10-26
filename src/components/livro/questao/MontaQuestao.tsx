/**
 * Monte a sua primeira questão da prova (docs/capacidades/capitulo-1-dinamicas.md, etapa 1): uma mensagem do primeiro
 * dia e a linha dela no referencia.jsonl, com três buracos. Uma pergunta por vez (o que fazer, por quê, de onde vem a
 * resposta), e cada resposta preenche o seu buraco na linha. O contrato confere com as regras do contrato.py
 * (regras.ts): barra o motivo curto e o caso que precisa dos pedidos sem pedido; no fim, aceita a linha e a compara com
 * o gabarito da loja. No modo direto, a primeira mensagem aparece preenchida como no arquivo, e aceita.
 */
import { useEffect, useRef, useState } from "react";
import { useDireto } from "../palco/direto";
import { conferir, partes, type Questao, type Regras } from "./regras.ts";

type Props = { regras: Regras; mensagens: Questao[]; nomes: Record<string, string>; pergunta: string };
const FONTES: Record<string, string> = { pedidos: "dos pedidos", politica: "da política", catalogo: "do catálogo" };
/* os buracos da linha, na ordem em que o leitor os preenche */
const BURACOS = ["decisao", "motivo", "precisa"];
const PERGUNTAS = ["O que fazer com ela?", "Por quê? Em uma frase, como a colega diria.", "De onde vem a resposta?"];

const vazia = (m: Questao): Questao => ({ ...m, decisao: "", motivo: "", precisa: [] });

export default function MontaQuestao({ regras, mensagens, nomes, pergunta }: Props) {
  const direto = useDireto();
  const [sel, setSel] = useState(0);
  const [q, setQ] = useState<Questao>(() => vazia(mensagens[0]));
  const [passo, setPasso] = useState(0);
  const [barra, setBarra] = useState("");
  const campo = useRef<HTMLInputElement>(null);
  useEffect(() => { if (direto) { setSel(0); setQ({ ...mensagens[0] }); setPasso(3); setBarra(""); } }, [direto]);
  useEffect(() => { if (passo === 1) campo.current?.focus({ preventScroll: true }); }, [passo]);
  const m = mensagens[sel];
  const ir = (i: number) => { setSel(i); setQ(vazia(mensagens[i])); setPasso(0); setBarra(""); };

  /* o contrato confere o que acabou de entrar: se barra, o leitor fica no passo e lê por quê */
  const seguir = (campos: string[]) => {
    const erro = conferir(q, regras).find((e) => campos.includes(e.campo));
    if (erro) return setBarra(erro.texto);
    setBarra(""); setPasso((p) => p + 1);
  };
  const precisa = (f: string) => setQ((x) => ({ ...x, precisa: x.precisa.includes(f) ? x.precisa.filter((y) => y !== f) : regras.fontes.filter((y) => y === f || x.precisa.includes(y)) }));
  const feita = passo === 3;

  return <div className="mq">
    <p className="mq-rotulo">monte uma questão</p>
    <p className="mq-pergunta">{pergunta}</p>
    <div className="mq-msg">
      <q>{m.pergunta}</q>
      {!direto && <button type="button" className="mq-outra" onClick={() => ir((sel + 1) % mensagens.length)}>outra mensagem ↻</button>}
    </div>

    <p className="mq-sub">a linha dela no <code>referencia.jsonl</code></p>
    <pre className="mq-linha" aria-label="A linha da questão no referencia.jsonl"><code>{"{"}{partes(q).map(([k, v], i) => {
      const b = BURACOS.indexOf(k);
      const aberto = b >= 0 && b >= passo;
      return <span key={k}>{i > 0 && ", "}<span className="mq-chave">"{k}"</span>: {aberto
        ? <span className={b === passo ? "mq-buraco mq-agora" : "mq-buraco"}>{b === passo ? "?" : "…"}</span>
        : <span className={b >= 0 && b === passo - 1 ? "mq-novo" : undefined} key={v}>{v}</span>}</span>;
    })}{"}"}</code></pre>

    {!feita && <div className="mq-passo" aria-live="polite">
      <p className="mq-q"><span>{passo + 1} de 3</span> {PERGUNTAS[passo]}</p>
      {passo === 0 && <div className="mq-opcoes">
        {regras.decisoes.map((d) => <button key={d} type="button" onClick={() => { setQ((x) => ({ ...x, decisao: d })); setPasso(1); }}>{nomes[d] ?? d}</button>)}
      </div>}
      {passo === 1 && <form className="mq-form" onSubmit={(e) => { e.preventDefault(); seguir(["motivo"]); }}>
        <input ref={campo} value={q.motivo} onChange={(e) => setQ((x) => ({ ...x, motivo: e.target.value }))} placeholder="por exemplo: o catálogo diz que vai ao forno" />
        <button type="submit">pronto</button>
      </form>}
      {passo === 2 && <form className="mq-form" onSubmit={(e) => { e.preventDefault(); seguir(["precisa", "pedido"]); }}>
        <div className="mq-opcoes">
          {regras.fontes.map((f) => <label key={f} className="mq-marca"><input type="checkbox" checked={q.precisa.includes(f)} onChange={() => precisa(f)} /> {FONTES[f] ?? f}</label>)}
        </div>
        <button type="submit">pronto</button>
      </form>}
      {barra && <p className="mq-barra"><b>O contrato barra:</b> {barra}.</p>}
    </div>}

    {feita && <div className="mq-fim" aria-live="polite">
      <p className="mq-ok"><b>✓ O contrato aceita a linha.</b> É uma questão a mais na prova.</p>
      <p className={q.decisao === m.decisao ? "mq-igual" : "mq-diferente"}>
        {q.decisao === m.decisao ? `E é a decisão do gabarito da loja: ${nomes[m.decisao]}.`
          : `Mas o contrato confere a forma, não a decisão: no gabarito da loja, esta mensagem é ${nomes[m.decisao]}, porque “${m.motivo}”.`}
      </p>
      {!direto && <p className="mq-acoes">
        <button type="button" onClick={() => ir(sel)}>refazer</button>
        <button type="button" onClick={() => ir((sel + 1) % mensagens.length)}>monte outra →</button>
      </p>}
    </div>}
  </div>;
}
