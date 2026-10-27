/**
 * O vídeo da nota, na introdução (docs/capacidades/a-nota-na-introducao.md, etapa 2): a nota contada como uma prova de
 * escola, para quem ainda não abriu o capítulo 1. A prova, o gabarito, a correção, o gráfico por capítulo e o placar.
 * É ilustração: o que o agente acerta e a altura das barras são de exemplo, e o gráfico não tem escala, para não
 * estragar a nota de partida nem a do capítulo 2. O número de mensagens sai do referencia.jsonl, e os capítulos, do
 * sumário. Puro de propósito: o teste do livro chama isto direto.
 */

export const FPS = 30;
export const SEGUNDOS = 25;
export const DURACAO = SEGUNDOS * FPS;

/** os momentos, em segundos: a prova, o gabarito, a correção, o gráfico e o placar */
export const T = {
  prova: 0.3, cartao: (k: number) => 0.5 + k * 0.08,
  gabarito: 4.2, certa: (k: number) => 4.6 + k * 0.08,
  correcao: 8.4, corrige: (k: number) => 8.8 + k * 0.2,
  grafico: 13.4, barra: (k: number) => 14.2 + k * 0.6, piorou: 17.0, futuro: 17.6,
  placar: 19.4, pulsa: 20.4, clique: 21.6, painel: 21.9,
};

/* de exemplo: as mensagens em que o agente erra, e a altura das barras dos primeiros capítulos (a quarta cai) */
const ERROS = [2, 5, 9, 11, 14, 16, 18, 19];
const BARRAS = [0.16, 0.22, 0.44, 0.36, 0.62];

export type Nota = { total: number; acertou: boolean[]; acertos: number; capitulos: number[]; barras: number[] };

export function montarNota(referencia: string, sumario: { capitulos: { numero: number }[] }): Nota {
  const total = referencia.split("\n").filter((l) => l.trim()).length;
  if (ERROS.some((k) => k >= total)) throw new Error(`vídeo da nota: a prova tem ${total} mensagens, e o exemplo erra numa que não existe`);
  const acertou = Array.from({ length: total }, (_, k) => !ERROS.includes(k));
  const capitulos = sumario.capitulos.map((c) => c.numero);
  if (capitulos.length <= BARRAS.length) throw new Error("vídeo da nota: o gráfico precisa de capítulos ainda sem nota");
  return { total, acertou, acertos: acertou.filter(Boolean).length, capitulos, barras: BARRAS };
}

export type Alvo = "prova" | "conta" | "grafico" | "placar";
export type Balao = { de: number; ate: number; alvo: Alvo; texto: string };

/** os balões, um por vez; são também o texto da figura para quem não a vê */
export function baloes(n: Nota): Balao[] {
  return [
    { de: T.prova, ate: T.gabarito, alvo: "prova", texto: `Pense numa prova de escola. Aqui, as perguntas são ${n.total} mensagens de clientes da loja, e a prova é a mesma do começo ao fim do livro.` },
    { de: T.gabarito, ate: T.correcao, alvo: "prova", texto: "Antes de existir agente, você escreve a resposta certa de cada uma: é o gabarito da prova." },
    { de: T.correcao, ate: T.grafico, alvo: "conta", texto: "O agente faz a prova, e o livro corrige: compara cada resposta com o gabarito e conta os acertos. Essa conta é a nota." },
    { de: T.grafico, ate: T.placar, alvo: "grafico", texto: "A cada capítulo, o agente muda uma coisa e faz a mesma prova de novo. A nota mostra se a mudança melhorou ou piorou, em vez de um “parece melhor”." },
    { de: T.placar, ate: SEGUNDOS + 1, alvo: "placar", texto: "No topo de cada capítulo, o botão nota guarda essa história. No capítulo em que uma nota nasce, ela fica em “?” até você dar o seu palpite." },
  ];
}

/** o título de cada cena, no alto do vídeo */
export const titulo = (t: number, n: Nota) =>
  t < T.gabarito ? `a prova: ${n.total} mensagens` : t < T.correcao ? "e a resposta certa de cada uma" : t < T.grafico ? "o agente faz a prova; o livro corrige"
    : t < T.placar ? "a nota, capítulo a capítulo" : "onde a nota fica";
