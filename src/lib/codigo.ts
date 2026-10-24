/** Peças comuns de quem mostra o código e o terminal do livro: o que mudou entre duas versões, e o caminho do erro. */

/** As linhas (contadas a partir de 1, no texto novo) que entraram ou mudaram; as em branco não contam. */
export function mudadas(antes: string | null | undefined, depois: string): number[] {
  const a = antes ? semFim(antes).split("\n") : [], b = semFim(depois).split("\n");
  const t = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) t[i][j] = a[i] === b[j] ? t[i + 1][j + 1] + 1 : Math.max(t[i + 1][j], t[i][j + 1]);
  const novas: number[] = [];
  let i = 0, j = 0;
  while (j < b.length) {
    if (i < a.length && a[i] === b[j]) { i++; j++; }
    else if (i < a.length && t[i + 1][j] >= t[i][j + 1]) i++;
    else { if (b[j].trim()) novas.push(j + 1); j++; }
  }
  return novas;
}
export const semFim = (s: string) => s.replace(/\n$/, "");

/** Um pedaço da saída do terminal: uma linha, ou um trecho dobrado do caminho do erro. */
export type Trecho = { tipo: "linha"; l: string; c: string } | { tipo: "dobra"; linhas: [string, string][] };

/**
 * O caminho do erro: os trechos que passam por fora do código do leitor (bibliotecas, o Python, o `-c` do comando)
 * dobram; ficam à vista a linha "Traceback", os trechos do código do leitor e a mensagem do erro.
 */
export function dobrarErro(saida: [string, string][]): Trecho[] {
  const fora: Trecho[] = [];
  let dentro = false, quadro: [string, string][] = [], doLeitor = false;
  const fechar = () => {
    if (!quadro.length) return;
    if (doLeitor) quadro.forEach(([l, c]) => fora.push({ tipo: "linha", l, c }));
    else { const ult = fora.at(-1); if (ult?.tipo === "dobra") ult.linhas.push(...quadro); else fora.push({ tipo: "dobra", linhas: quadro }); }
    quadro = [];
  };
  for (const [l, c] of saida) {
    if (/^Traceback \(most recent call last\):/.test(l)) { dentro = true; fora.push({ tipo: "linha", l, c }); continue; }
    if (dentro && /^  File "/.test(l)) { fechar(); doLeitor = !/\/\.venv\/|"<string>"|\/lib\/python\d/.test(l); quadro.push([l, c]); continue; }
    if (dentro && /^\s/.test(l)) { quadro.push([l, c]); continue; }
    if (dentro) { fechar(); dentro = false; }
    fora.push({ tipo: "linha", l, c });
  }
  fechar();
  return fora;
}
