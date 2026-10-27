/**
 * A pausa e o fluxo (docs/capacidades/experimento-pausa-e-fluxo.md, etapa 5): a animação de "O que vamos construir",
 * em seis cenas que o leitor toca ou rola (palco/RolaCena.tsx): o modelo lê, a pausa até a primeira palavra, a
 * resposta escrita um pedaço por vez, o fluxo, o medidor nas três mensagens e o fecho: dois trabalhos, dois cronômetros. Sem pergunta dentro da figura: a
 * decisão do leitor fica no Invista logo antes (docs/capacidades/pausa-e-fluxo-revisao.md). É
 * ilustração (figuras/pausa.json): sem número medido, para não adiantar o resultado. Puro de propósito: o teste chama
 * isto direto.
 */

type Mensagem = { nome: string; leva: string; palavras: number };
export type Pausa = { sobre: string; pergunta: string; resposta: string[]; mensagens: Mensagem[] };

export const FPS = 30;
export const CENAS = [
  { nome: "Ler", de: 0 },
  { nome: "A pausa", de: 4.5 },
  { nome: "Escrever", de: 9 },
  { nome: "O fluxo", de: 15 },
  { nome: "O medidor", de: 19.5 },
  { nome: "Dois cronômetros", de: 25 },
];
export const SEGUNDOS = 30;
export const DURACAO = SEGUNDOS * FPS;

/** quando cada pedaço da resposta aparece: o primeiro fecha a pausa; os outros, na cena "Escrever", no mesmo compasso */
export const COMPASSO = 0.8;
export const pedacoEm = (i: number) => (i === 0 ? CENAS[1].de + 0.5 : CENAS[2].de + 0.3 + (i - 1) * COMPASSO);

export function montarPausa(d: Pausa): Pausa {
  if (!d.resposta?.length || d.resposta.length > 8) throw new Error("a pausa e o fluxo: a resposta tem de 1 a 8 pedaços");
  if (pedacoEm(d.resposta.length - 1) > CENAS[3].de - 0.5) throw new Error("a pausa e o fluxo: os pedaços não cabem na cena de escrever");
  if (d.mensagens?.length !== 3) throw new Error("a pausa e o fluxo: são três mensagens, a curta, a média e a longa");
  return d;
}

/** o que fica de cada cena, numa linha, embaixo; a última cena junta tudo, com o fecho em cima */
export const RESUMOS = ["lê tudo antes de escrever", "pausa: até a primeira palavra", "escreve um pedaço por vez",
  "fluxo: pedaços por segundo", "o medidor mede três mensagens"];

export const FECHO = "Dois trabalhos, dois cronômetros: a pausa mede a leitura, e o fluxo, a escrita.";

export type Balao = { de: number; ate: number; texto: string };

/** os balões, um por cena; são também o texto da figura para quem não a vê */
export function baloes(): Balao[] {
  const textos = [
    "Antes de escrever, o modelo lê tudo o que recebeu.",
    "A pausa: o tempo até a primeira palavra.",
    "Depois, ele escreve um pedaço por vez.",
    "O fluxo: quantos pedaços saem por segundo.",
    "O medidor cronometra os dois, nas três mensagens.",
    "Na IDE, você mede e confere o seu palpite.",
  ];
  return textos.map((texto, k) => ({ de: CENAS[k].de + 0.2, ate: k + 1 < CENAS.length ? CENAS[k + 1].de + 0.2 : SEGUNDOS + 1, texto }));
}
