/**
 * A escala de quem decide, no 1.1 (docs/capacidades/capitulo-1-dinamicas.md, etapa 3): os quatro pontos da escala com a
 * mesma mensagem atravessando cada um. Os nomes dos pontos têm que ser os da Aposta (escala.json), e os dados do pedido
 * vêm do pedidos.json da loja, nunca escritos à mão. Puro de propósito: o teste do livro chama isto direto.
 */

export type Passo = { quem: "código" | "modelo"; papel?: string; texto: string; executa?: string };
export type Ponto = { nome: string; resumo: string; frase: string; passos: Passo[]; decide: number };
export type Escala = { mensagem: string; pontos: Ponto[] };
type Dados = { mensagem: string; pedido: string; pontos: Omit<Ponto, "decide">[] };
type Pedido = { id: string; status: string; transportadora: string; previsao_entrega: string };

export function montarEscala(dados: Dados, aposta: { mensagens: { opcoes: string[] }[] }, pedidos: Pedido[]): Escala {
  const nomes = aposta.mensagens[0].opcoes;
  if (dados.pontos.map((p) => p.nome).join() !== nomes.join())
    throw new Error(`escala: os pontos da figura (${dados.pontos.map((p) => p.nome).join(", ")}) não são os da Aposta (${nomes.join(", ")})`);
  for (const pt of dados.pontos) if (!pt.resumo || pt.resumo.split(/\s+/).length > 6) throw new Error(`escala: o andar "${pt.nome}" precisa de um resumo de até seis palavras`);
  const p = pedidos.find((x) => x.id === dados.pedido);
  if (!p) throw new Error(`escala: o pedido ${dados.pedido} não está no pedidos.json`);
  const [, m, d] = p.previsao_entrega.split("-");
  const valores: Record<string, string> = { status: p.status, transportadora: p.transportadora, previsao: `${d}/${m}` };
  const encher = (t: string) => t.replace(/\{(\w+)\}/g, (_, k) => {
    if (!(k in valores)) throw new Error(`escala: {${k}} não é um dado do pedido`);
    return valores[k];
  });
  return {
    mensagem: dados.mensagem,
    pontos: dados.pontos.map((pt) => ({
      ...pt,
      passos: pt.passos.map((s) => ({ ...s, texto: encher(s.texto), executa: s.executa && encher(s.executa) })),
      decide: pt.passos.filter((s) => s.quem === "modelo").length,
    })),
  };
}
