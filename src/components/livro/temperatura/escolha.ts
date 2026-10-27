/**
 * Como o modelo escolhe, na temperatura zero (docs/capacidades/temperatura-zero-revisao.md, etapa 4): a animação que
 * desembaraça o texto de abertura do experimento, em seis cenas que o leitor toca ou rola (palco/RolaCena.tsx): um
 * token por vez, a pontuação de cada token possível, o sorteio com a temperatura, a temperatura zero, o cálculo antes da
 * escolha e o lote. É ilustração (figuras/escolha.json): os tokens e as pontuações são do exemplo; as chances saem da
 * conta com a temperatura, e cada sorteio, de um número fixo entre 0 e 1. Puro de propósito: o teste chama isto direto.
 */

type Dados = { pergunta: string; escrito: string[]; candidatos: { token: string; pontuacao: number }[]; temperatura: number; sorteios: number[] };

export const FPS = 30;
export const CENAS = [
  { nome: "Um token por vez", de: 0 },
  { nome: "A pontuação", de: 5 },
  { nome: "O sorteio", de: 10 },
  { nome: "Temperatura zero", de: 17 },
  { nome: "Antes da escolha", de: 22.5 },
  { nome: "O lote", de: 27.5 },
];
export const SEGUNDOS = 36;
export const DURACAO = SEGUNDOS * FPS;

/** a chance de cada token com a temperatura: maior pontuação, mais chance; em zero, tudo para o maior */
export function chances(pontuacoes: number[], temperatura: number): number[] {
  if (temperatura === 0) {
    const maior = pontuacoes.indexOf(Math.max(...pontuacoes));
    return pontuacoes.map((_, i) => (i === maior ? 1 : 0));
  }
  const pesos = pontuacoes.map((p) => Math.exp(p / temperatura));
  const soma = pesos.reduce((a, b) => a + b, 0);
  return pesos.map((w) => w / soma);
}

/** o sorteio: o número entre 0 e 1 cai na faixa de um token, e as faixas têm a largura das chances */
export function sortear(ch: number[], u: number): number {
  let acumulado = 0;
  for (const [i, c] of ch.entries()) { acumulado += c; if (u < acumulado) return i; }
  return ch.length - 1;
}

export const porcento = (x: number) => `${(100 * x).toLocaleString("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: x > 0 && x < 1 ? 1 : 0 })}%`;

export type Escolha = Dados & { quente: number[]; zero: number[]; quentes: number[]; zeros: number[] };

export function montarEscolha(d: Dados): Escolha {
  if (!d.escrito?.length || d.candidatos?.length < 2) throw new Error("como o modelo escolhe: faltam o texto escrito ou os candidatos");
  if (!(d.temperatura > 0)) throw new Error("como o modelo escolhe: a temperatura do sorteio tem que ser maior que zero");
  if (d.sorteios.some((u) => !(u >= 0 && u < 1))) throw new Error("como o modelo escolhe: cada sorteio é um número entre 0 e 1");
  const pontuacoes = d.candidatos.map((c) => c.pontuacao);
  const quente = chances(pontuacoes, d.temperatura), zero = chances(pontuacoes, 0);
  const quentes = d.sorteios.map((u) => sortear(quente, u)), zeros = d.sorteios.map((u) => sortear(zero, u));
  /* a cena do sorteio só ensina se as execuções escrevem coisas diferentes; a da temperatura zero, se escrevem a mesma */
  if (new Set(quentes).size < 2) throw new Error("como o modelo escolhe: com a temperatura do exemplo, os sorteios deram todos o mesmo token");
  if (new Set(zeros).size !== 1) throw new Error("como o modelo escolhe: em temperatura zero, as execuções tinham que dar o mesmo token");
  return { ...d, quente, zero, quentes, zeros };
}

export type Balao = { de: number; ate: number; texto: string };

/** os balões, um por cena; são também o texto da figura para quem não a vê */
export function baloes(e: Escolha): Balao[] {
  const nome = (i: number) => `“${e.candidatos[i].token}”`;
  const maior = e.zero.indexOf(1), menor = e.candidatos.reduce((m, c, i) => (c.pontuacao < e.candidatos[m].pontuacao ? i : m), 0);
  const diferentes = new Set(e.quentes).size;
  const textos = [
    `Um modelo escreve um pedaço de texto por vez, um token: uma palavra ou parte dela. Aqui, ele já escreveu “${e.escrito.join(" ")}” e vai escolher o próximo.`,
    `A cada passo, ele dá uma pontuação a cada token possível. ${nome(maior)} tem a maior; ${nome(menor)}, a menor.`,
    `Um sorteio escolhe, e a temperatura regula o sorteio. Com a temperatura em ${e.temperatura.toLocaleString("pt-BR")}, ${nome(maior)} tem ${porcento(e.quente[maior])} de chance, e não 100%: ${e.sorteios.length} execuções escreveram ${diferentes} respostas diferentes.`,
    `Em temperatura zero, não há sorteio: vence sempre o token de maior pontuação. As ${e.sorteios.length} execuções escrevem ${nome(maior)}. Parece suficiente para repetir a resposta.`,
    "Mas a escolha é só a última parte do caminho. Antes dela, alguém calculou as pontuações, com milhares de somas.",
    "Um servidor junta perguntas de várias pessoas numa conta só, um lote, e o tamanho do lote pode mudar a ordem dessas somas. As pontuações podem sair um pouco diferentes; a resposta só muda se a disputa estiver apertada. O vídeo abaixo mostra como.",
  ];
  return textos.map((texto, k) => ({ de: CENAS[k].de + 0.2, ate: k + 1 < CENAS.length ? CENAS[k + 1].de + 0.2 : SEGUNDOS + 1, texto }));
}
