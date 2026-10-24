/** O formato de um capítulo (docs/FORMATO.md): as partes na ordem, uma IDE só e dentro da mão na massa, o fecho completo.
 *  Lê o .mdx direto, sem montar a página. O prefácio não é capítulo e fica de fora. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const pasta = new URL("../livros/ciclo-de-vida/capitulos/", import.meta.url);
const capitulos = readdirSync(pasta).filter((f) => /^\d\d-.*\.mdx$/.test(f) && !f.startsWith("00-"));

/* um capítulo em pedaços: o cabeçalho, as seções (## N.k Título) e o que vem depois da última seção */
export function partes(texto) {
  const [, cabeca, corpo] = texto.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const numero = Number(cabeca.match(/^numero: (\d+)$/m)?.[1]);
  const secoes = [...corpo.matchAll(/^## (\d+)\.(\d+) (.+)$/gm)].map((m) => ({ cap: Number(m[1]), k: Number(m[2]), titulo: m[3], em: m.index }));
  const trecho = (i) => corpo.slice(secoes[i].em, secoes[i + 1]?.em ?? corpo.length);
  return { cabeca, corpo, numero, secoes, trecho };
}

/* o que está errado no formato; vazio se está certo */
export function conferir(texto) {
  const erros = [];
  const { cabeca, corpo, numero, secoes, trecho } = partes(texto);
  const n = String(numero).padStart(2, "0");
  if (!numero) return ["falta o número do capítulo no cabeçalho"];
  for (const campo of ["titulo", "lide", "neste", "partida"]) if (!new RegExp(`^${campo}:`, "m").test(cabeca)) erros.push(`falta "${campo}" no cabeçalho`);
  const neste = cabeca.match(/^neste:\n((?: {2}- .+\n?)+)/m)?.[1].trim().split("\n").length ?? 0;
  if (neste < 3 || neste > 4) erros.push(`"neste capítulo" tem ${neste} itens, e o formato pede 3 ou 4`);
  const partida = cabeca.match(/^partida:\n(?: {2}.+\n)*? {2}tag: (.+)$/m)?.[1].trim();
  if (partida !== `cap-${n}/inicio`) erros.push(`o ponto de partida é "${partida}", e devia ser cap-${n}/inicio`);

  /* as seções: N.1, N.2... sem buraco; a penúltima é a mão na massa, a última é o que ficou de pé */
  secoes.forEach((s, i) => { if (s.cap !== numero || s.k !== i + 1) erros.push(`a seção "${s.cap}.${s.k} ${s.titulo}" devia ser ${numero}.${i + 1}`); });
  const mao = secoes.length - 2;
  if (secoes.length < 4) erros.push(`o capítulo tem ${secoes.length} seções, e o formato pede pelo menos 4`);
  else {
    if (secoes[mao].titulo !== "Mão na massa") erros.push(`a penúltima seção é "${secoes[mao].titulo}", e devia ser "Mão na massa"`);
    if (secoes[mao + 1].titulo !== "O que ficou de pé") erros.push(`a última seção é "${secoes[mao + 1].titulo}", e devia ser "O que ficou de pé"`);
  }

  /* o código só aparece na IDE, que é uma só e mora na mão na massa; as partes dela são N.5a, N.5b... */
  if (/^```/m.test(corpo)) erros.push("há bloco de código no texto: código só aparece na IDE do capítulo");
  const ides = [...corpo.matchAll(/<IdeCapitulo\b/g)];
  if (ides.length !== 1) erros.push(`o capítulo tem ${ides.length} IDEs, e o formato pede uma`);
  else if (secoes.length >= 4) {
    const dentro = trecho(mao);
    if (!dentro.includes("<IdeCapitulo")) erros.push(`a IDE não está na seção "${secoes[mao].titulo}"`);
    const chaves = Object.keys(JSON.parse(`{${dentro.match(/secoes=\{\{([^}]*)\}\}/)?.[1] ?? ""}}`));
    const base = `${numero}.${mao + 1}`;
    const esperadas = chaves.map((_, i) => base + "abcdefghij"[i]);
    if (chaves.join() !== esperadas.join()) erros.push(`as partes da IDE são ${chaves.join(", ")}, e deviam ser ${esperadas.join(", ")} (dentro da seção ${base})`);
    /* saída de terminal só depois que o leitor construiu: na mão na massa ou no que ficou de pé */
    const antes = corpo.slice(0, secoes[mao].em);
    if (/<Terminal\b/.test(antes)) erros.push("há saída de terminal antes da mão na massa");
  }

  /* o fecho, depois da última seção e nesta ordem: ponto de volta, resumo e exercício */
  if (secoes.length) {
    const fim = trecho(secoes.length - 1);
    const ordem = [`<PontoDeVolta tag="cap-${n}/fim"`, "<Resumo>", "<Exercicio"].map((m) => fim.indexOf(m));
    if (ordem.some((i) => i < 0) || ordem.some((i, j) => j && i < ordem[j - 1])) erros.push(`o fecho precisa de PontoDeVolta (cap-${n}/fim), Resumo e Exercicio, nesta ordem`);
    const itens = fim.match(/<Resumo>([\s\S]*?)<\/Resumo>/)?.[1].trim().split("\n").filter((l) => l.startsWith("- ")).length ?? 0;
    if (itens < 5 || itens > 6) erros.push(`o resumo tem ${itens} itens, e o formato pede 5 ou 6`);
    if (!/<\/Exercicio>\s*$/.test(fim)) erros.push("o capítulo termina no exercício: nada depois dele");
  }
  return erros;
}

for (const f of capitulos) test(`o capítulo ${f} segue o formato`, () => {
  assert.deepEqual(conferir(readFileSync(new URL(f, pasta), "utf8")), []);
});

test("o formato pega o capítulo que sai dele", () => {
  const certo = readFileSync(new URL(capitulos[0], pasta), "utf8");
  assert.deepEqual(conferir(certo.replace("## 1.5 Mão na massa", "## 1.5 Código")), [
    'a penúltima seção é "Código", e devia ser "Mão na massa"']);
  assert.match(conferir(certo.replace("## 1.2 ", "## 1.3 ")).join(), /devia ser 1\.2/);
  assert.match(conferir(certo.replace("<Resumo>", "<Resumo>\n- a mais\n- e mais")).join(), /o resumo tem 8 itens/);
  assert.match(conferir(certo.replace("## 1.6 O que ficou de pé", "```py\nx = 1\n```\n\n## 1.6 O que ficou de pé")).join(), /bloco de código/);
  assert.match(conferir(certo.replace("## 1.3 As perguntas", "<Terminal saida={x} />\n\n## 1.3 As perguntas")).join(), /terminal antes da mão na massa/);
});
