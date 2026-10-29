// O experimento num Markdown só (docs/capacidades/markdown-dos-experimentos.md): o arquivo montado traz o texto inteiro,
// sem componente cru, com as respostas recolhidas, o resultado da página, o projeto e as saídas; e o botão só aparece
// em quem pediu (markdown: true).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { corpoEmMarkdown } from "../src/lib/markdownExperimento.ts";

const raiz = new URL("../", import.meta.url);
const ler = (p) => readFileSync(new URL(p, raiz), "utf8");
const mdx = ler("experimentos/kv-cache/experimento.mdx");
const corpo = mdx.slice(mdx.indexOf("\n---", 4) + 4);
const md = ler("dist/experimentos/kv-cache.md");
const fora = md.replace(/^(`{3,})[^\n]*\n[\s\S]*?^\1$/gm, ""); // o texto, sem os blocos de código

test("o Markdown do kv-cache traz o texto inteiro, na ordem, sem componente cru", () => {
  assert.ok(md.startsWith(`# ${mdx.match(/^titulo: "(.*)"$/m)[1]}\n`));
  const secoes = [...corpo.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
  let antes = 0;
  for (const s of ["O que se testa", ...secoes, "O que deu", "O projeto", "As saídas gravadas"]) {
    const i = md.indexOf(`\n## ${s}\n`);
    assert.ok(i > antes, `a seção "${s}" falta ou está fora de ordem`);
    antes = i;
  }
  assert.doesNotMatch(fora, /<[A-Z][A-Za-z]+[\s/>]/, "sobrou um componente");
  assert.doesNotMatch(fora, /^import /m);
  assert.doesNotMatch(fora, /\]\(\//, "link relativo não funciona fora do site");
  assert.doesNotMatch(fora, /Opinião dos autores/, "o Pendente não vai para o arquivo");
});

test("cada Pare e pense e cada palpite chega com a resposta recolhida", () => {
  for (const [, pergunta] of corpo.matchAll(/<PareEPense pergunta="([^"]+)"/g)) assert.ok(md.includes(`**Pare e pense: ${pergunta}**\n\n<details><summary>Ver a resposta</summary>`), pergunta);
  for (const [, nome] of corpo.matchAll(/<Aposta dados=\{(\w+)\}/g)) {
    const arquivo = mdx.match(new RegExp(`^import ${nome} from "\\./(.+)";$`, "m"))[1];
    const m = JSON.parse(ler(`experimentos/kv-cache/${arquivo}`)).mensagens[0];
    const i = md.indexOf(m.texto);
    assert.ok(i > 0 && m.opcoes.every((o) => md.indexOf(`- ${o}`, i) > i), `o palpite de ${arquivo}`);
    assert.ok(md.indexOf("<details><summary>Ver o que aconteceu</summary>", i) > md.indexOf(`- ${m.opcoes.at(-1)}`, i), "a resposta vem depois das opções");
  }
});

test("o resultado é o da página, e o projeto e as saídas vão inteiros", () => {
  const pagina = ler("dist/experimentos/kv-cache/index.html");
  for (const [, n] of pagina.matchAll(/<span class="numero"[^>]*>(\d+ de \d+)<\/span>/g)) assert.match(md, new RegExp(`\\*\\*${n} \\(\\d+%\\)\\*\\*`));
  for (const f of ["laco.py", "modelo.py", "medir.py", "placar.py", "coletar.py", "test_laco.py", "pyproject.toml"])
    assert.ok(md.includes(`### \`${f}\`\n\n\`\`\``) && md.includes(ler(`experimentos/kv-cache/projeto/${f}`).trim()), f);
  assert.match(md, /Ficam de fora, pelo tamanho: `coleta\.json` \(\d+ KB\) e `uv\.lock` \(\d+ KB\)/);
  for (const s of Object.values(JSON.parse(ler("experimentos/kv-cache/saidas.json")))) assert.ok(md.includes(`### \`$ ${s.comando}\``), s.comando);
});

test("o botão só aparece em quem pediu, e só quem pediu ganha o arquivo", () => {
  assert.match(ler("dist/experimentos/kv-cache/index.html"), /<a href="\/experimentos\/kv-cache\.md" download>/);
  assert.doesNotMatch(ler("dist/experimentos/pausa-e-fluxo/index.html"), /Baixar em Markdown/);
  assert.ok(!existsSync(new URL("dist/experimentos/pausa-e-fluxo.md", raiz)));
});

test("componente que o conversor não conhece faz a montagem falhar", () => {
  const e = { id: "x", origem: "https://exemplo", importados: {}, corpo: "texto\n\n<Novidade a=\"1\" />\n" };
  assert.throws(() => corpoEmMarkdown(e), /não sabe converter <Novidade>/);
  assert.equal(corpoEmMarkdown({ ...e, corpo: 'a\n\n<Nota titulo="t">uma\nduas</Nota>\n\n[l](/x/)' }), "a\n\n> **t.** uma\n> duas\n\n[l](https://exemplo/x/)");
});
