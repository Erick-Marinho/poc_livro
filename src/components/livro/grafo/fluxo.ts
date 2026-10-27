/**
 * Fluxo ou agente, no 1.1 (docs/capacidades/fluxo-ou-agente.md): o grafo em seis cenas que o leitor toca ou rola
 * (palco/RolaCena.tsx). Um fluxo, com as setas no código; um modelo dentro dele, que não muda as setas; um modelo em cada
 * caixa, e a pergunta que o desenho não previa; um agente, em que o modelo escolhe a próxima seta e volta (o laço); a
 * pergunta nova no agente; e o teste: quem escolhe a seta. É ilustração (figuras/fluxo-ou-agente.json); as mensagens e as
 * ferramentas têm que ser as das histórias do 1.1 (tres-jeitos.json). Puro de propósito: o teste chama isto direto.
 */

type Dados = { mensagens: { pedido: string; produto: string }; fluxo: string[]; modelo_no_fluxo: number[]; modelo_em_toda_caixa: number[]; ferramentas: string[] };
type TresJeitos = { perguntas: { id: string; texto: string }[] };

export const FPS = 30;
export const CENAS = [
  { nome: "Um fluxo", de: 0 },
  { nome: "Um modelo dentro do fluxo", de: 6 },
  { nome: "Um modelo em cada caixa", de: 12 },
  { nome: "Um agente", de: 19 },
  { nome: "A pergunta nova", de: 26 },
  { nome: "O teste", de: 32 },
];
export const SEGUNDOS = 38;
export const DURACAO = SEGUNDOS * FPS;
/** quando a mensagem chega a cada caixa do fluxo, em cada uma das três primeiras cenas (na terceira, ela para na segunda) */
export const PASSOS_DO_FLUXO = [[1, 1.9, 2.8, 3.7, 4.6], [7.4, 8.3, 9.2, 10.1, 11], [14.2, 15]];
/** e no agente: a mensagem, o modelo decide, a ferramenta, volta ao modelo, a resposta */
export const PASSOS_DO_AGENTE = [[19.8, 20.6, 21.6, 22.6, 23.6], [26.6, 27.4, 28.4, 29.4, 30.4]];

export type Fluxo = Dados;

export function montarFluxo(d: Dados, tresJeitos: TresJeitos, ferramentasDoLaco: string[]): Fluxo {
  const textos = tresJeitos.perguntas.map((p) => p.texto);
  for (const m of Object.values(d.mensagens)) {
    const curta = m.replace(/[?.]$/, "").toLowerCase();
    if (!textos.some((t) => t.toLowerCase().replace(/antiaderente /, "").includes(curta.replace(/\?$/, ""))))
      throw new Error(`fluxo ou agente: a mensagem "${m}" não é uma das histórias do 1.1`);
  }
  for (const f of d.ferramentas) if (!ferramentasDoLaco.includes(f)) throw new Error(`fluxo ou agente: a ferramenta ${f} não é das histórias do 1.1`);
  if (!d.fluxo.includes(d.ferramentas[0])) throw new Error("fluxo ou agente: o fluxo tem que usar a ferramenta do pedido");
  if (d.modelo_no_fluxo.some((i) => !d.modelo_em_toda_caixa.includes(i))) throw new Error("fluxo ou agente: o modelo da cena 2 tem que continuar na cena 3");
  return d;
}

export type Balao = { de: number; ate: number; texto: string };

/** os balões, um por cena; são também o texto da figura para quem não a vê */
export function baloes(f: Fluxo): Balao[] {
  const [pedido, produto] = f.ferramentas;
  const textos = [
    "Num fluxo, o caminho está desenhado no código: cada seta foi escrita por alguém antes de a mensagem chegar, e a mensagem só anda por elas.",
    "Agora um modelo de linguagem escreve a resposta. O texto fica melhor, mas continua sendo fluxo: o modelo está dentro de uma caixa, e as setas seguem no código.",
    "Pode haver um modelo em cada caixa: ainda é fluxo. E quando chega uma pergunta que o desenho não previa, a do produto, não existe seta para ela.",
    `Num agente, o modelo fica no meio e escolhe a próxima seta: pede ${pedido}, lê o que volta e decide de novo se já pode responder. É o laço.`,
    `A pergunta do produto não precisa de um caminho novo: o modelo escolhe outra ferramenta, ${produto}. Ninguém desenhou essa seta antes.`,
    "O teste não é ter um modelo de linguagem: é quem escolhe a próxima seta. Se é o código, é fluxo, mesmo com um modelo em cada caixa. Se é o modelo, a cada volta, é agente.",
  ];
  return textos.map((texto, k) => ({ de: CENAS[k].de + 0.2, ate: k + 1 < CENAS.length ? CENAS[k + 1].de + 0.2 : SEGUNDOS + 1, texto }));
}
