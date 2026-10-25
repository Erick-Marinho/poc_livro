/** As perguntas de referência (o referencia.jsonl, passado como texto), escolhidas pelo id; caso que não existe não monta. */
export type Caso = { id: string; pergunta: string; decisao: string; motivo: string };
export const DECISOES: Record<string, { nome: string; quando: string }> = {
  responder: { nome: "responder", quando: "a resposta está nos dados da loja (pedido, catálogo) ou na política" },
  abrir_chamado: { nome: "abrir chamado", quando: "pede uma ação: o produto chegou com defeito" },
  recusar: { nome: "recusar", quando: "a loja não permite" },
  passar: { nome: "passar a vez", quando: "não é para o agente: é para uma pessoa" },
};
export function casos(referencia: string, ids: string[], quem: string): Caso[] {
  const todos: Caso[] = referencia.split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l));
  return ids.map((id) => todos.find((c) => c.id === id) ?? (() => { throw new Error(`${quem}: o caso ${id} não está no referencia.jsonl`); })());
}
