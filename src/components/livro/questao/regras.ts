/**
 * As regras de uma questão da prova, lidas do contrato.py do projeto (docs/capacidades/capitulo-1-dinamicas.md, etapa 1):
 * o que a classe Caso exige de cada campo e as duas regras do model_validator, com as mensagens dele. A dinâmica do 1.5
 * confere a questão que o leitor monta com elas, sem reescrevê-las à mão: se o contrato mudar e isto não souber ler,
 * o build falha. Puro de propósito: o teste do livro chama isto direto.
 */

export type Regras = {
  decisoes: string[];
  fontes: string[];
  id: string;          // o padrão do id (regex, como no contrato)
  pedido: string;      // o padrão do pedido
  minPergunta: number;
  minMotivo: number;
  juntos: string;      // a mensagem de "pedido e e-mail andam juntos"
  qualPedido: string;  // a mensagem de "um caso que precisa dos pedidos tem que dizer qual pedido"
};
export type Questao = { id: string; pergunta: string; decisao: string; motivo: string; precisa: string[]; pedido?: string | null; email?: string | null };

const achar = (fonte: string, re: RegExp, o: string) => {
  const m = fonte.match(re);
  if (!m) throw new Error(`questão do 1.5: não achei ${o} no contrato.py`);
  return m[1];
};
const valores = (fonte: string, classe: string) => {
  const bloco = achar(fonte, new RegExp(`class ${classe}\\(StrEnum\\):([\\s\\S]*?)\\n\\n\\n`), `a classe ${classe}`);
  return [...bloco.matchAll(/^\s+\w+ = "(\w+)"/gm)].map((m) => m[1]);
};

export function lerRegras(contrato: string): Regras {
  const caso = achar(contrato, /class Caso\(BaseModel\):([\s\S]*?)\n\n\ndef /, "a classe Caso");
  return {
    decisoes: valores(contrato, "Decisao"),
    fontes: valores(contrato, "Fonte"),
    id: achar(caso, /id: str = Field\(pattern=r"([^"]+)"\)/, "o padrão do id"),
    pedido: achar(caso, /pedido: str \| None = Field\(default=None, pattern=r"([^"]+)"\)/, "o padrão do pedido"),
    minPergunta: Number(achar(caso, /pergunta: str = Field\(min_length=(\d+)\)/, "o tamanho mínimo da pergunta")),
    minMotivo: Number(achar(caso, /motivo: str = Field\(min_length=(\d+)/, "o tamanho mínimo do motivo")),
    juntos: achar(caso, /raise ValueError\("(pedido e e-mail[^"]+)"\)/, "a regra do pedido e do e-mail"),
    qualPedido: achar(caso, /raise ValueError\("(um caso que precisa dos pedidos[^"]+)"\)/, "a regra do caso que precisa dos pedidos"),
  };
}

/** O que o contrato barra nesta questão: uma frase por regra quebrada, na ordem dos campos. Vazio: aceita. */
export function conferir(q: Questao, r: Regras): { campo: string; texto: string }[] {
  const erros: { campo: string; texto: string }[] = [];
  const pedido = q.pedido?.trim() || null, email = q.email?.trim() || null;
  if (!new RegExp(r.id).test(q.id)) erros.push({ campo: "id", texto: "o id tem que ser R e dois dígitos, como R07" });
  if (q.pergunta.trim().length < r.minPergunta) erros.push({ campo: "pergunta", texto: `a pergunta tem que ter ao menos ${r.minPergunta} letras` });
  if (!r.decisoes.includes(q.decisao)) erros.push({ campo: "decisao", texto: `a decisão tem que ser uma destas: ${r.decisoes.join(", ")}` });
  if (q.motivo.trim().length < r.minMotivo) erros.push({ campo: "motivo", texto: `o motivo tem que ter ao menos ${r.minMotivo} letras: por que esta decisão, em uma frase` });
  for (const f of q.precisa) if (!r.fontes.includes(f)) erros.push({ campo: "precisa", texto: `"${f}" não é uma fonte do contrato` });
  if (pedido && !new RegExp(r.pedido).test(pedido)) erros.push({ campo: "pedido", texto: "o pedido tem que ser BT- e quatro dígitos, como BT-1001" });
  if ((pedido === null) !== (email === null)) erros.push({ campo: "pedido", texto: r.juntos });
  else if (q.precisa.includes("pedidos") && pedido === null) erros.push({ campo: "pedido", texto: r.qualPedido });
  return erros;
}

/** Os campos da linha do referencia.jsonl, na ordem do arquivo, já escritos; pedido e e-mail só entram quando existem. */
export function partes(q: Questao): [string, string][] {
  const pedido = q.pedido?.trim() || null, email = q.email?.trim() || null;
  const o: Record<string, unknown> = { id: q.id, pergunta: q.pergunta, decisao: q.decisao, motivo: q.motivo.trim(), precisa: q.precisa };
  if (pedido || email) Object.assign(o, { pedido, email });
  /* como o json.dumps do Python escreve: ", " entre os itens e ": " depois da chave */
  const valor = (v: unknown): string => (Array.isArray(v) ? `[${v.map(valor).join(", ")}]` : JSON.stringify(v));
  return Object.entries(o).map(([k, v]) => [k, valor(v)]);
}

/** A linha do referencia.jsonl, como no arquivo. */
export function linha(q: Questao): string {
  return `{${partes(q).map(([k, v]) => `${JSON.stringify(k)}: ${v}`).join(", ")}}`;
}
