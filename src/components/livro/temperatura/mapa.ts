export type Execucao = { ordem: string; soma: number; pontuacoes: number[]; escolha: number };
export type Caso = { id: string; nome: string; b: number; execucoes: Execucao[] };
export type DadosMapa = { tipo: string; casos: Caso[] };

export const FPS = 30;
export const CENAS = [
  "A mesma entrada", "Duas ordens de cálculo", "Compare as pontuações",
  "A mesma regra de escolha", "O token volta à entrada", "O que mudou?",
];
export const POR_CENA = FPS * 4;
export const PERGUNTA = POR_CENA * 3 - 1;
export const DURACAO = POR_CENA * CENAS.length;
export const numero = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
export const muda = (c: Caso) => c.execucoes[0].escolha !== c.execucoes[1].escolha;
export const token = (e: Execucao) => e.escolha === 0 ? "A" : "B";
export const cenaDe = (frame: number) => Math.min(CENAS.length - 1, Math.floor(frame / POR_CENA));
export const limitarQuadro = (frame: number, respondeu: boolean) =>
  Math.max(0, Math.min(DURACAO - 1, respondeu ? frame : Math.min(PERGUNTA, frame)));

export function montarMapa(bruto: string): DadosMapa {
  const d: DadosMapa = JSON.parse(bruto);
  if (d.tipo !== "ilustração numérica, não logits de LLM" || d.casos?.length !== 2)
    throw new Error("MapaTemperatura: falta o rastro numérico identificado");
  if (new Set(d.casos.map(c => c.id)).size !== 2)
    throw new Error("MapaTemperatura: condições repetidas");
  for (const c of d.casos) {
    if (!c.nome?.trim() || !Number.isFinite(c.b) || c.b < 0 || c.execucoes?.length !== 2)
      throw new Error("MapaTemperatura: condição incompleta");
    for (const [i, e] of c.execucoes.entries()) {
      if (e.ordem !== ["esquerda", "direita"][i] || !Number.isFinite(e.soma) || e.pontuacoes?.length !== 2 ||
          !e.pontuacoes.every(n => Number.isFinite(n) && n >= 0) ||
          e.pontuacoes[0] !== e.soma - 1024 || e.pontuacoes[1] !== c.b ||
          e.escolha !== (e.pontuacoes[0] >= e.pontuacoes[1] ? 0 : 1))
        throw new Error("MapaTemperatura: soma, barras e escolha não conferem");
    }
  }
  if (!muda(d.casos[0]) || muda(d.casos[1]))
    throw new Error("MapaTemperatura: faltam o contraste e seu controle");
  return d;
}

export function descricao(c: Caso, cena: number) {
  if (cena === 0) return "A mesma entrada chega às duas execuções.";
  if (cena === 1) return "Os parênteses mudam a ordem em que as parcelas são somadas.";
  if (cena === 2) return c.execucoes.map((e, i) =>
    `Execução ${i + 1}: A vale ${numero(e.pontuacoes[0])}; B vale ${numero(e.pontuacoes[1])}.`).join(" ");
  if (cena === 3) return "A regra é igual nos dois lados: escolher o maior valor. " +
    c.execucoes.map((e, i) => `Execução ${i + 1} escolhe ${token(e)}.`).join(" ");
  if (cena === 4) return "O token escolhido entra no próximo cálculo. " +
    (muda(c) ? "As duas entradas agora são diferentes." : "As duas entradas continuam iguais.");
  return muda(c) ? "A escolha não sorteou: as pontuações mudaram e o vencedor trocou." :
    "A pontuação de A mudou, mas B venceu nos dois lados. Nem toda diferença muda a escolha.";
}
