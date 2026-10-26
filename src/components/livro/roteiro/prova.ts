/**
 * A prova do substituto, no 2.4 (docs/capacidades/capitulo-2-em-cenas.md, etapa 4): como a régua mede. As 20 perguntas
 * e o gabarito vêm do referencia.jsonl; o decisor do capítulo 1, que passa tudo para a equipe, é medido nelas, e a conta
 * é conferida contra a saída gravada do baseline.py (saidas.json, nota-de-partida). A nota do agente não aparece: o
 * leitor investe o palpite dele na IDE, logo depois, e o resultado está no fim do capítulo. Puro de propósito.
 */
import { DECISOES } from "../../../lib/referencia.ts";

export type Entrada = {
  referencia: string;
  /** a saída gravada do baseline.py: a nota de partida */
  baseline: { comando: string; saida: [string, string][] };
};
export type Questao = { id: string; gabarito: string; rotulo: string; certa: boolean };

export const FPS = 30;
export const SEGUNDOS = 19;
export const DURACAO = SEGUNDOS * FPS;
/** os momentos, em segundos: o gabarito (0 a 3,4), o decisor do capítulo 1 respondendo (3,4 a 10), o grafo no lugar (10 a 14), a pergunta (14 ao fim) */
export const T = { gabarito: [0, 3.4], partida: [3.6, 9.2], troca: 10.4, pergunta: 14.4 };
export const DECISOR = "passar";

export function montarProva({ referencia, baseline }: Entrada) {
  const casos = referencia.split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l) as { id: string; decisao: string });
  if (casos.length !== 20) throw new Error(`prova do 2.4: a figura desenha 20 perguntas, e a referência tem ${casos.length}`);
  const questoes: Questao[] = casos.map((c) => ({ id: c.id, gabarito: c.decisao, rotulo: DECISOES[c.decisao]?.nome ?? c.decisao, certa: c.decisao === DECISOR }));
  const acertos = questoes.filter((q) => q.certa).length;
  /* a conta da figura tem que ser a do baseline.py gravado */
  const nota = baseline.saida.map(([l]) => l).find((l) => l.startsWith("nota de partida"));
  const m = nota?.match(/(\d+) de (\d+) \((\d+)%\)/);
  if (!m || +m[1] !== acertos || +m[2] !== questoes.length) throw new Error(`prova do 2.4: a figura conta ${acertos} de ${questoes.length}, e o baseline.py gravado diz ${nota}`);
  return { questoes, acertos, total: questoes.length, porcento: +m[3], comando: baseline.comando };
}
export type Prova = ReturnType<typeof montarProva>;

export type Alvo = "grade" | "decisor" | "placar";
export type Balao = { de: number; ate: number; alvo: Alvo; texto: string };

/** os balões, um por vez; são também o texto da figura para quem não a vê */
export function baloes(p: Prova): Balao[] {
  return [
    { de: 0.4, ate: 3.4, alvo: "grade", texto: `A régua é a mesma do capítulo 1: as ${p.total} perguntas, cada uma com a decisão do gabarito.` },
    { de: 3.4, ate: 10.2, alvo: "placar", texto: `O decisor do capítulo 1 passava tudo para a equipe. A régua compara cada decisão com o gabarito e conta: ${p.acertos} de ${p.total}, ${p.porcento}%. É a nota de partida.` },
    { de: 10.2, ate: 14.4, alvo: "decisor", texto: "Agora só o decisor muda: o grafo deste capítulo, com o GPT-6 Luna. Mesma régua, mesmas perguntas, mesmo gabarito." },
    { de: 14.4, ate: SEGUNDOS + 1, alvo: "placar", texto: `Sem acesso aos pedidos, ao catálogo e à política, quanto ele tira? Ele bate os ${p.porcento}%? Guarde o seu palpite: a IDE vai pedir que você invista nele antes de executar.` },
  ];
}
