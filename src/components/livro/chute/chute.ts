/**
 * A decisão fixa, no 1.7 (docs/capacidades/capitulo-1-dinamicas.md, etapa 2): um agente que nem lê a mensagem e repete
 * sempre a mesma decisão. As 20 perguntas saem do referencia.jsonl, agrupadas pela decisão do gabarito; a nota de cada
 * decisão, das saídas gravadas do baseline.py com o decisor trocado (as mesmas da IDE do 1.6). A conta dos quadradinhos
 * tem que bater com a saída gravada, ou a figura não monta. Puro de propósito: o teste do livro chama isto direto.
 */

type Saida = { comando: string; saida: [string, string][] };
export type Pergunta = { id: string; pergunta: string; decisao: string; motivo: string };
export type Nota = { certos: number; total: number; texto: string };
export type Chute = { perguntas: Pergunta[]; ordem: string[]; notas: Record<string, Nota>; comando: string };

/* a saída gravada de cada decisão fixa: o baseline.py como está (passar) e com o decisor trocado */
export const SAIDAS: Record<string, string> = {
  passar: "r01-nota-de-partida",
  responder: "r01-nota-sempre-responder",
  recusar: "r01-nota-sempre-recusar",
  abrir_chamado: "r01-nota-sempre-chamado",
};

export function montarChute(referencia: string, saidas: Record<string, Saida>, ordem: string[]): Chute {
  const perguntas: Pergunta[] = referencia.split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l));
  const notas: Record<string, Nota> = {};
  for (const d of ordem) {
    const s = saidas[SAIDAS[d]];
    if (!s) throw new Error(`decisão fixa: falta a saída gravada ${SAIDAS[d]} (${d})`);
    const texto = s.saida.map(([l]) => l).find((l) => l.startsWith("nota de partida:"));
    const m = texto?.match(/^nota de partida: (\d+) de (\d+) \(\d+%\)$/);
    if (!m) throw new Error(`decisão fixa: a saída ${SAIDAS[d]} não tem a linha da nota`);
    const certos = perguntas.filter((p) => p.decisao === d).length;
    if (Number(m[1]) !== certos || Number(m[2]) !== perguntas.length)
      throw new Error(`decisão fixa: a figura conta ${certos} de ${perguntas.length} em ${d}, e a saída gravada diz ${m[1]} de ${m[2]}`);
    notas[d] = { certos, total: perguntas.length, texto };
  }
  return { perguntas, ordem, notas, comando: saidas[SAIDAS.passar].comando };
}

/** a porcentagem como o baseline.py escreve (f"{x:.0%}") */
export const porcento = (n: Nota) => `${Math.round((100 * n.certos) / n.total)}%`;
