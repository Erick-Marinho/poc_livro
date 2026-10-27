/**
 * O mapa da temperatura zero (docs/capacidades/temperatura-zero-revisao.md, etapa 2): o vídeo que o leitor toca ou rola
 * (palco/RolaCena.tsx), em seis cenas: a escolha sem sorteio, a mesma pergunta sozinha ou num grupo (esquema do que a
 * fonte descreve), a régua de 16 bits que arredonda, as pontuações e o vencedor, o token que volta à entrada e o
 * controle com folga. Todo número sai de figuras/mapa.py (a saída gravada tz-mapa); se a soma, as barras e a escolha
 * não conferem, a figura não monta. Puro de propósito: o teste do experimento chama isto direto.
 */

export type Execucao = { ordem: string; soma: number; pontuacoes: number[]; escolha: number };
export type Caso = { id: string; nome: string; b: number; execucoes: Execucao[] };
export type Passo = { parcelas: number[]; exato: number; guardado: number };
export type Caminho = { ordem: string; passos: Passo[] };
export type DadosMapa = { tipo: string; guardaveis: number[]; caminhos: Caminho[]; casos: Caso[] };

export const FPS = 30;
/** as seis cenas, com o começo de cada uma em segundos; a última vai até o fim */
export const CENAS = [
  { nome: "A escolha", de: 0 },
  { nome: "Sozinha ou em grupo", de: 5 },
  { nome: "A régua de 16 bits", de: 10.5 },
  { nome: "As pontuações", de: 18.5 },
  { nome: "O token volta", de: 23.5 },
  { nome: "Com folga", de: 27.5 },
];
export const SEGUNDOS = 33;
export const DURACAO = SEGUNDOS * FPS;
/** na régua: cada soma parcial aparece no valor exato e, depois, escorrega para o que o binary16 guarda */
export const REGUA = { passo: (ordem: number, k: number) => 11 + ordem * 3.6 + k * 1.7, escorrega: 0.8 };

export const numero = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1, useGrouping: false });
export const muda = (c: Caso) => c.execucoes[0].escolha !== c.execucoes[1].escolha;
export const token = (e: Execucao) => (e.escolha === 0 ? "A" : "B");
export const cenaDe = (t: number) => CENAS.reduce((i, c, k) => (t >= c.de ? k : i), 0);
const fim = (k: number) => (k + 1 < CENAS.length ? CENAS[k + 1].de : SEGUNDOS);

export function montarMapa(bruto: string): DadosMapa {
  const d: DadosMapa = JSON.parse(bruto);
  if (!/^ilustração numérica/.test(d.tipo ?? "") || d.casos?.length !== 2 || d.caminhos?.length !== 2)
    throw new Error("MapaTemperatura: falta o rastro numérico identificado");
  if (new Set(d.casos.map((c) => c.id)).size !== 2) throw new Error("MapaTemperatura: condições repetidas");
  const ordenados = [...d.guardaveis].sort((a, b) => a - b);
  if (!d.guardaveis?.length || d.guardaveis.some((g, i) => g !== ordenados[i])) throw new Error("MapaTemperatura: a régua de 16 bits não está em ordem");
  d.caminhos.forEach((c, i) => {
    if (c.ordem !== ["esquerda", "direita"][i] || !c.passos?.length) throw new Error("MapaTemperatura: caminho da soma incompleto");
    for (const p of c.passos) {
      if (p.parcelas.reduce((a, b) => a + b, 0) !== p.exato) throw new Error("MapaTemperatura: a soma parcial não confere");
      if (p.guardado >= ordenados[0] && !d.guardaveis.includes(p.guardado)) throw new Error("MapaTemperatura: um valor guardado fora da régua de 16 bits");
    }
  });
  for (const c of d.casos) {
    if (!c.nome?.trim() || !Number.isFinite(c.b) || c.b < 0 || c.execucoes?.length !== 2) throw new Error("MapaTemperatura: condição incompleta");
    for (const [i, e] of c.execucoes.entries()) {
      if (e.ordem !== ["esquerda", "direita"][i] || e.soma !== d.caminhos[i].passos.at(-1)!.guardado || e.pontuacoes?.length !== 2 ||
          e.pontuacoes[0] !== e.soma - 1024 || e.pontuacoes[1] !== c.b || e.escolha !== (e.pontuacoes[0] >= e.pontuacoes[1] ? 0 : 1))
        throw new Error("MapaTemperatura: soma, barras e escolha não conferem");
    }
  }
  if (!muda(d.casos[0]) || muda(d.casos[1])) throw new Error("MapaTemperatura: faltam o contraste e seu controle");
  return d;
}

export type Alvo = "escolha" | "grupo" | "regua" | "barras" | "volta";
export type Balao = { de: number; ate: number; alvo: Alvo; texto: string };

/** os balões, um por cena; são também o texto da figura para quem não a vê */
export function baloes(d: DadosMapa): Balao[] {
  const [disputa, folga] = d.casos;
  const [e1, e2] = disputa.execucoes;
  const [esq, dir] = d.caminhos;
  const conta = (p: Passo) => `${numero(p.parcelas[0])} + ${numero(p.parcelas[1])}`;
  const textos: [Alvo, string][] = [
    ["escolha", `Em temperatura zero, não há sorteio: vence o token de maior pontuação. Aqui, B (${numero(e1.pontuacoes[1])}) passa de A (${numero(e1.pontuacoes[0])}). Com as mesmas pontuações, sai sempre o mesmo token.`],
    ["grupo", "A mesma pergunta pode ir sozinha ou num grupo com outras. Em cada caso, a biblioteca pode repartir a soma de outro jeito, e a ordem das parcelas muda. É um esquema do que o estudo descreve."],
    ["regua", `A partir de ${numero(1024)}, o formato de 16 bits só guarda inteiros: ${numero(esq.passos[0].exato)} escorrega para ${numero(esq.passos[0].guardado)}. Somando ${numero(esq.passos[0].parcelas[1])} de cada vez, a fração some duas vezes; somando ${conta(dir.passos[0])} = ${numero(dir.passos[0].guardado)} antes, o total vira ${numero(dir.passos.at(-1)!.guardado)}.`],
    ["barras", `Neste exemplo, a pontuação de A é a soma menos ${numero(1024)}. Uma diferença de ${numero(e2.soma - e1.soma)} na soma basta: a execução 1 escolhe ${token(e1)}, a 2 escolhe ${token(e2)}, sem sorteio nenhum.`],
    ["volta", "O token escolhido entra na próxima conta. Uma troca no começo muda o resto da resposta."],
    ["barras", `Agora B vale ${numero(folga.b)}. A conta de A ainda muda, mas B vence nos dois lados: nem toda diferença troca a escolha.`],
  ];
  return textos.map(([alvo, texto], k) => ({ de: CENAS[k].de + 0.2, ate: k + 1 < CENAS.length ? CENAS[k + 1].de + 0.2 : SEGUNDOS + 1, alvo, texto }));
}

export { fim as fimDaCena };
