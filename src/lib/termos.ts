/**
 * Os termos explicáveis de um livro (`livros/<livro>/termos.json`; Termos.astro): onde cada um aparece num texto, com
 * maiúscula ou no plural, e nunca dentro de outra palavra. Sem DOM, para os testes.
 */
export type Termo = { definicao: string; capitulo: number };
export type Trecho = { texto: string; termo?: string };

const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** O texto em pedaços: o que é termo leva o nome dele, como está no termos.json; juntos, os pedaços são o texto. */
export function trechos(texto: string, termos: string[]): Trecho[] {
  if (!termos.length) return [{ texto }];
  const padrao = new RegExp(`(?<!\\p{L})(${termos.map(escapar).join("|")})s?(?!\\p{L})`, "giu");
  const nome = (achado: string) => termos.find((t) => achado.toLowerCase().startsWith(t.toLowerCase()))!;
  const saida: Trecho[] = [];
  let ate = 0;
  for (const m of texto.matchAll(padrao)) {
    if (m.index > ate) saida.push({ texto: texto.slice(ate, m.index) });
    saida.push({ texto: m[0], termo: nome(m[0]) });
    ate = m.index + m[0].length;
  }
  if (ate < texto.length) saida.push({ texto: texto.slice(ate) });
  return saida;
}
