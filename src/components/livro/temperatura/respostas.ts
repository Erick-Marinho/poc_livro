/**
 * As 90 respostas da coleta, na temperatura zero (docs/capacidades/temperatura-zero-revisao.md, etapa 3): cada
 * repetição de cada pergunta, sozinha e nos grupos, comparada com a referência (a primeira resposta da pergunta). Sai
 * da coleta real (projeto/coleta-cpu.json) e tem que bater, linha por linha, com a saída gravada do medir.py
 * (tz-medida); se não bater, a figura não monta. Puro de propósito: o teste do experimento chama isto direto.
 */

type Lote = { tamanho: number; sequencias: number[][] };
type CasoColeta = { id: string; pergunta: string; referencia: number[]; texto_referencia: string; lotes: Lote[] };
export type Coleta = { configuracao: { max_new_tokens: number; repeticoes: number }; casos: CasoColeta[] };
export type Linha = { id: string; pergunta: string; texto: string; cortada: boolean; lotes: { tamanho: number; iguais: boolean[] }[] };
export type Respostas = { linhas: Linha[]; tamanhos: number[]; iguais: number; total: number; limite: number };

const igual = (a: number[], b: number[]) => a.length === b.length && a.every((x, i) => x === b[i]);

export function montarRespostas(coleta: Coleta, medida: [string, string][]): Respostas {
  const saida = medida.map(([l]) => l);
  const limite = coleta.configuracao.max_new_tokens;
  const linhas = coleta.casos.map((c) => ({
    id: c.id, pergunta: c.pergunta, texto: c.texto_referencia,
    /* a resposta que usou todos os tokens permitidos foi cortada pelo limite, e não terminou sozinha */
    cortada: c.referencia.length >= limite,
    lotes: c.lotes.map((l) => {
      const iguais = l.sequencias.map((s) => igual(s, c.referencia));
      const gravada = saida.find((x) => x.startsWith(`${c.id}, lote ${l.tamanho}:`));
      const n = iguais.filter(Boolean).length;
      if (!gravada || !gravada.includes(`${n}/${iguais.length} iguais`))
        throw new Error(`respostas da coleta: ${c.id}, lote ${l.tamanho} dá ${n}/${iguais.length}, e a saída gravada do medir.py diz outra coisa`);
      return { tamanho: l.tamanho, iguais };
    }),
  }));
  const tamanhos = linhas[0].lotes.map((l) => l.tamanho);
  const todos = linhas.flatMap((l) => l.lotes.flatMap((x) => x.iguais));
  const iguais = todos.filter(Boolean).length;
  if (!saida.some((x) => x.startsWith(`iguais à referência: ${iguais} de ${todos.length}`)))
    throw new Error("respostas da coleta: o total não bate com a saída gravada do medir.py");
  return { linhas, tamanhos, iguais, total: todos.length, limite };
}
