/**
 * O KV cache (docs/capacidades/experimento-kv-cache.md, etapa 5): as duas animações, em seis cenas cada, que o leitor
 * toca ou rola (palco/RolaCena.tsx). A primeira abre o texto: os quatro caches, em dois grupos. A segunda é "O que vamos
 * construir": a atendente com e sem anotações, o que elas ocupam e o medidor. Sem pergunta dentro da figura: a aposta
 * fica no palpite logo antes (docs/capacidades/pausa-e-fluxo-revisao.md). É ilustração (figuras/kv.json): sem número
 * medido, para não adiantar o resultado. Puro de propósito: o teste chama isto direto.
 */

type Mensagem = { nome: string; leva: string; palavras: number };
export type Kv = {
  sobre: string; pergunta: string; resposta: string[]; trecho: string; mensagens: Mensagem[];
};

export const FPS = 30;

export type Figura = { cenas: { nome: string; de: number }[]; segundos: number; textos: string[]; resumos: string[]; fecho?: string };

export const ANOTACOES: Figura = {
  cenas: [
    { nome: "Ler e anotar", de: 0 },
    { nome: "Com as anotações", de: 5 },
    { nome: "Sem as anotações", de: 10.5 },
    { nome: "O que elas ocupam", de: 16 },
    { nome: "O medidor", de: 21 },
    { nome: "Dois jeitos", de: 26.5 },
  ],
  segundos: 32,
  textos: [
    "Com o cache, ela lê tudo uma vez e anota cada palavra.",
    "Para a palavra nova, ela lê só a última e olha as anotações.",
    "Sem o cache, ela relê tudo antes de cada palavra nova.",
    "As anotações ocupam memória, e crescem com cada palavra.",
    "O medidor cronometra a pausa e cada palavra, nos quatro jeitos.",
    "Na IDE, você mede e confere o seu palpite.",
  ],
  resumos: ["lê tudo uma vez e anota", "com cache: lê só a última", "sem cache: relê tudo",
    "as anotações ocupam memória", "o medidor mede quatro jeitos"],
  fecho: "Com ou sem as anotações: o medidor cronometra a pausa e cada palavra.",
};

/** a jornada de uma pergunta, que abre o texto: cinco moradores, um cenário por cache (figuras/jornada.json) */
export type Jornada = { sobre: string; perguntas: { quem: string; texto: string; curta: string; resposta?: string[]; certa?: string }[] };

export const JORNADA: Figura = {
  cenas: [
    { nome: "Ana: o caminho inteiro", de: 0 },
    { nome: "KV cache: as anotações", de: 8 },
    { nome: "Cache de prefixo: o Bruno", de: 15.5 },
    { nome: "Cache de prompt: a Dani", de: 22.5 },
    { nome: "Cache semântico: o Eduardo", de: 29.5 },
    { nome: "Cache semântico: a Carla", de: 36 },
  ],
  segundos: 43,
  textos: [
    "Nada foi guardado ainda: o modelo lê o pedido inteiro e escreve a resposta.",
    "Para cada palavra, as anotações poupam reler o pedido inteiro.",
    "O começo é igual ao da Ana: o servidor pula a leitura dele.",
    "Na API, o provedor faz o mesmo e cobra menos pelo começo repetido.",
    "Outras palavras, mesma pergunta: o mural responde na hora, sem o modelo.",
    "Parecida não é igual: o mural devolveu a resposta da Ana, errada.",
  ],
  resumos: ["Ana: o caminho inteiro", "KV: lê só a palavra nova", "prefixo: pula o começo repetido",
    "prompt: o começo repetido sai barato", "semântico: responde sem o modelo"],
};

export function montarJornada(d: Jornada): Jornada {
  if (d.perguntas?.map((p) => p.quem).join() !== "Ana,Bruno,Dani,Eduardo,Carla") throw new Error("a jornada: Ana, Bruno, Dani, Eduardo e Carla, nessa ordem");
  if (d.perguntas.slice(0, 3).some((p) => !p.resposta?.length || p.resposta.length > 6)) throw new Error("a jornada: Ana, Bruno e Dani têm de 1 a 6 palavras de resposta");
  return d;
}

export const duracao = (f: Figura) => f.segundos * FPS;

/** quando cada palavra da resposta aparece, a partir do começo da cena que escreve */
export const COMPASSO = 0.8;
export const palavraEm = (de: number, i: number) => de + 0.4 + i * COMPASSO;

export function montarKv(d: Kv): Kv {
  if (!d.resposta?.length || d.resposta.length > 6) throw new Error("o KV cache: a resposta tem de 1 a 6 palavras");
  for (const [k, prox] of [[1, 2], [2, 3]]) {
    if (palavraEm(ANOTACOES.cenas[k].de, d.resposta.length - 1) > ANOTACOES.cenas[prox].de - 0.5) throw new Error("o KV cache: as palavras não cabem na cena");
  }
  if (d.mensagens?.length !== 2) throw new Error("o KV cache: são duas mensagens, a curta e a longa");
  return d;
}

export type Balao = { de: number; ate: number; texto: string };

/** os balões, um por cena; são também o texto da figura para quem não a vê */
export function baloes(f: Figura): Balao[] {
  return f.textos.map((texto, k) => ({ de: f.cenas[k].de + 0.2, ate: k + 1 < f.cenas.length ? f.cenas[k + 1].de + 0.2 : f.segundos + 1, texto }));
}
