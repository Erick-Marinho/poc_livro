/**
 * O KV cache (docs/capacidades/experimento-kv-cache.md): as duas animações, em seis cenas cada, que o leitor toca ou
 * rola (palco/RolaCena.tsx). A jornada abre o texto: um cenário por cache. A das anotações é "O que vamos construir"
 * (esboço em figuras/esboco-anotacoes.md): o modelo lê a mensagem e anota cada palavra, escreve com e sem as
 * anotações, o que elas ocupam e o que o medidor cronometra. Sem pergunta dentro da figura: a aposta fica no palpite
 * logo antes (docs/capacidades/pausa-e-fluxo-revisao.md). É ilustração (figuras/kv.json): sem número medido, para não
 * adiantar o resultado. Puro de propósito: o teste chama isto direto.
 */

type Mensagem = { nome: string; leva: string; palavras: number };
export type Kv = {
  sobre: string; pergunta: string; resposta: string[];
  /** as palavras da mensagem longa que a figura mostra, com "…" no lugar do que fica de fora */
  lidas: string[]; mensagens: Mensagem[];
};

export const FPS = 30;

export type Figura = { cenas: { nome: string; de: number }[]; segundos: number; textos: string[]; resumos: string[] };

export const ANOTACOES: Figura = {
  cenas: [
    { nome: "Ler e anotar", de: 0 },
    { nome: "Escrever com as anotações", de: 7 },
    { nome: "Escrever sem as anotações", de: 14 },
    { nome: "O que as anotações ocupam", de: 21 },
    { nome: "O que o medidor cronometra", de: 28 },
    { nome: "Quatro medições", de: 35 },
  ],
  segundos: 42,
  textos: [
    "O modelo lê a mensagem uma vez e anota cada palavra.",
    "Para escrever, lê só a última palavra e consulta as anotações.",
    "Sem as anotações, relê a mensagem inteira antes de cada palavra.",
    "Cada camada guarda as suas anotações: a memória cresce a cada palavra.",
    "O medidor cronometra a pausa e o tempo de cada palavra.",
    "Quatro medições: na IDE, você confere o seu palpite.",
  ],
  resumos: ["lê a mensagem uma vez e anota", "com as anotações: lê só a última", "sem as anotações: relê tudo",
    "as anotações ocupam memória", "o medidor: a pausa e cada palavra"],
};

/** a jornada de uma pergunta, que abre o texto: cinco moradores, um cenário por cache (figuras/jornada.json) */
type Bloco = { nome?: string; origem: string };
export type Jornada = {
  sobre: string; perguntas: { quem: string; texto: string; curta: string; resposta?: string[]; certa?: string }[];
  /** o que vai no pedido, e de onde vem cada parte */
  pedido: { instrucoes: Bloco; regulamento: Bloco; pergunta: Bloco };
  /** um exemplo de verdade para cada ponto do caminho */
  pontos: { aplicativo: string; servidor: string; provedor: string; modelo: string };
};

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
  if (!d.pedido?.instrucoes?.origem || !d.pedido?.regulamento?.origem || !d.pedido?.pergunta?.origem) throw new Error("a jornada: cada parte do pedido diz de onde vem");
  return d;
}

export const duracao = (f: Figura) => f.segundos * FPS;

/** na cena 1, a leitura da mensagem, do primeiro ao último segundo; a primeira palavra sai logo depois */
export const LEITURA = { de: 0.8, ate: 5 };
/** nas cenas 2 e 3, o passo que escreve a palavra j da resposta (a 0 sai da leitura), a partir do começo da cena */
export const PASSO = 1.2;
export const passoEm = (de: number, j: number) => de + 0.5 + (j - 1) * PASSO;
/** dentro do passo: quando a palavra nova aparece */
export const ESCREVE = 0.8;

export function montarKv(d: Kv): Kv {
  if (!d.resposta?.length || d.resposta.length > 6) throw new Error("o KV cache: a resposta tem de 1 a 6 palavras");
  for (const k of [1, 2]) {
    if (passoEm(ANOTACOES.cenas[k].de, d.resposta.length - 1) + ESCREVE > ANOTACOES.cenas[k + 1].de - 0.4) throw new Error("o KV cache: as palavras não cabem na cena");
  }
  if (!d.lidas?.length || d.lidas.at(-1) !== d.pergunta.split(/\s+/).at(-1)) throw new Error("o KV cache: a mensagem termina na pergunta");
  if (d.mensagens?.length !== 2) throw new Error("o KV cache: são duas mensagens, a curta e a longa");
  return d;
}

export type Balao = { de: number; ate: number; texto: string };

/** os balões, um por cena; são também o texto da figura para quem não a vê */
export function baloes(f: Figura): Balao[] {
  return f.textos.map((texto, k) => ({ de: f.cenas[k].de + 0.2, ate: k + 1 < f.cenas.length ? f.cenas[k + 1].de + 0.2 : f.segundos + 1, texto }));
}

/** A legenda de cada figura: na página e no Markdown do experimento (src/lib/markdownExperimento.ts). */
export const LEGENDAS = {
  jornada: "Ilustração: cinco moradores do condomínio inventado, um cenário por cache, e as respostas que o regulamento dá. As barras, as anotações e a conta não são medidas; a ordem dos passos é a de um sistema de verdade.",
  anotacoes: "Ilustração: a resposta foi escrita para o exemplo, e o tamanho das barras e da memória não é medido. As palavras são as da mensagem longa, e as duas mensagens são as que o medidor vai cronometrar.",
};
