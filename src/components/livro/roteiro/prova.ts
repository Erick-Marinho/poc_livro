/**
 * A prova do substituto, no 2.4 (docs/capacidades/capitulo-2-em-cenas.md, etapa 4): como a régua mede. As 20 perguntas
 * e o gabarito vêm do referencia.jsonl; o decisor do capítulo 1, que passa tudo para a equipe, é medido nelas, e a conta
 * é conferida contra a saída gravada do baseline.py (saidas.json, nota-de-partida). A nota do agente não aparece: o
 * leitor investe o palpite dele na IDE, logo depois, e o resultado está no fim do capítulo. No 2.6, a mesma grade
 * mostra a prova corrigida (montarResultado): o que o agente decidiu em cada pergunta, lido da gravação do capítulo, e
 * a conta conferida contra a saída gravada do medir.py. Puro de propósito.
 */
import { caminhosDaGravacao } from "../../../lib/grafoAgente.ts";
import { DECISOES } from "../../../lib/referencia.ts";

export type Entrada = {
  referencia: string;
  /** a saída gravada do baseline.py: a nota de partida */
  baseline: { comando: string; saida: [string, string][] };
};
export type Questao = { id: string; gabarito: string; rotulo: string; certa: boolean; decidiu?: string; motivo?: string };

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
  return { questoes, acertos, total: questoes.length, porcento: +m[3], partida: { acertos, porcento: +m[3] }, comando: baseline.comando };
}
export type Prova = ReturnType<typeof montarProva>;

/** A prova corrigida, no 2.6: o que o agente decidiu em cada pergunta (a gravação), e a conta do medir.py gravado. */
export function montarResultado({ referencia, baseline, medir, gravacao }: Entrada & { medir: { saida: [string, string][] }; gravacao: Record<string, unknown> }) {
  const partida = montarProva({ referencia, baseline });
  const c = caminhosDaGravacao(gravacao as Parameters<typeof caminhosDaGravacao>[0], referencia);
  const questoes: Questao[] = partida.questoes.map((q) => {
    const x = c.find((y) => y.id === q.id)!;
    return { ...q, decidiu: x.decidiu, motivo: x.motivo, certa: x.decidiu === q.gabarito };
  });
  const acertos = questoes.filter((q) => q.certa).length;
  const nota = medir.saida.map(([l]) => l).find((l) => l.startsWith("nota do agente"));
  const m = nota?.match(/(\d+) de (\d+) \((\d+)%\)/);
  if (!m || +m[1] !== acertos || +m[2] !== questoes.length) throw new Error(`resultado do 2.6: a figura conta ${acertos} de ${questoes.length}, e o medir.py gravado diz ${nota}`);
  return { ...partida, questoes, acertos, porcento: +m[3] };
}

/** os balões da prova corrigida: a nota, o padrão (quase tudo passar a vez), um motivo, o R12 */
export function baloesDoResultado(p: Prova, motivo: string, seguro: string): Balao[] {
  const passou = p.questoes.filter((q) => q.decidiu === "passar").length;
  const outras = p.questoes.filter((q) => q.decidiu !== "passar");
  const m = p.questoes.find((q) => q.id === motivo)!, s = p.questoes.find((q) => q.id === seguro)!;
  if (outras.length !== 1 || outras[0].id !== "R15") throw new Error("resultado do 2.6: o balão do padrão conta uma decisão só fora de passar a vez, a do CPF da prima (R15)");
  const nome = (d: string) => DECISOES[d]?.nome ?? d;
  const a = (n: number) => `${n === 1 ? "um acerto" : `${n} acertos`}`;
  return [
    { de: 0.4, ate: 6.6, alvo: "grade", texto: `A prova voltou corrigida: o agente respondeu as ${p.total} perguntas, uma por uma.` },
    { de: 6.6, ate: 9.8, alvo: "placar", texto: `${p.acertos} de ${p.total}, ${p.porcento}%: ${a(p.acertos - p.partida.acertos)} a mais que quem chuta. Passou da nota de partida, raspando.` },
    { de: 9.8, ate: 13.6, alvo: `card:${outras[0].id}`, texto: `Repare no padrão: ele passou a vez em ${passou} das ${p.total}. A única que ele quis ${nome(outras[0].decidiu!)} foi ${outras[0].id}, a do CPF da prima: a única que não precisa de nenhum dado da loja.` },
    { de: 13.6, ate: 17.6, alvo: `card:${m.id}`, texto: `O porquê está nos motivos dele. No ${m.id}: “${m.motivo}” Sem os dados da loja, a política nunca diz nada, e a instrução manda passar a vez.` },
    { de: 17.6, ate: SEGUNDOS_RESULTADO + 1, alvo: `card:${s.id}`, texto: `E o ${s.id}, o Bruno pedindo o pedido da Ana: devia ${nome(s.gabarito)}, e ele passou a vez. Errou, mas para o lado seguro: uma pessoa da equipe resolveria.` },
  ];
}
export const SEGUNDOS_RESULTADO = 22;
export const DURACAO_RESULTADO = SEGUNDOS_RESULTADO * FPS;
/** os momentos da prova corrigida, em segundos: as respostas, uma por uma */
export const T_RESULTADO = { respostas: [0.6, 6.2] };

export type Alvo = "grade" | "decisor" | "placar" | `card:${string}`;
export type Balao = { de: number; ate: number; alvo: Alvo; texto: string };

/** os balões, um por vez; são também o texto da figura para quem não a vê */
export function baloes(p: Prova): Balao[] {
  return [
    { de: 0.4, ate: 3.4, alvo: "grade", texto: `A prova é a mesma do capítulo 1: as ${p.total} perguntas, cada uma com a resposta do gabarito.` },
    { de: 3.4, ate: 10.2, alvo: "placar", texto: `Primeiro, a prova de quem chuta: o “agente” do capítulo 1, que passa toda mensagem para a equipe. Corrigida pelo gabarito, ela acerta só as ${p.acertos} em que a resposta certa era mesmo passar a vez: ${p.acertos} de ${p.total}, ${p.porcento}%. É a nota de partida.` },
    { de: 10.2, ate: 14.4, alvo: "decisor", texto: "Agora quem faz a prova é o agente deste capítulo, o grafo com o GPT-6 Luna. Mesma prova, mesmo gabarito, mesma correção." },
    { de: 14.4, ate: SEGUNDOS + 1, alvo: "placar", texto: `Sem acesso aos pedidos, ao catálogo e à política, quantas ele acerta? Passa da nota de quem chuta, os ${p.porcento}%? Guarde o seu palpite: a IDE vai pedir que você invista nele antes de executar.` },
  ];
}
