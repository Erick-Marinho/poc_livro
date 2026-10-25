/** Nenhum endereço do site dá em nada: a raiz abre a estante, /<livro>/ abre o primeiro texto, e o resto cai em "em construção". Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const raiz = new URL("../", import.meta.url);
const ler = (p) => readFileSync(new URL(`dist${p}`, raiz), "utf8");
const destino = (p) => ler(p).match(/http-equiv="refresh" content="0;url=([^"]+)"/)?.[1];

test("a raiz leva à estante", () => assert.equal(destino("/index.html"), "/livros/"));

test("/ciclo-de-vida/ abre o livro pela introdução, uma página que existe", () => {
  const href = destino("/ciclo-de-vida/index.html");
  assert.equal(href, "/ciclo-de-vida/00-introducao/");
  assert.ok(existsSync(new URL(`dist${href}index.html`, raiz)));
});

test("o que não existe mostra a página em construção, com o caminho para os livros e os experimentos", () => {
  const html = ler("/404.html");
  assert.match(html, /em construção/);
  assert.match(html, /href="\/livros\/"/);
  assert.match(html, /href="\/experimentos\/"/);
});

test("em toda página a marca leva à home, e as páginas do site têm o Início no mesmo endereço", async () => {
  const { readdirSync } = await import("node:fs");
  const { parse } = await import("node-html-parser");
  const paginas = readdirSync(new URL("dist/", raiz), { recursive: true }).filter((f) => f.endsWith(".html"));
  const homes = new Set();
  for (const f of paginas) {
    const doc = parse(ler(`/${f}`));
    if (doc.querySelector('meta[http-equiv="refresh"]')) continue;
    const marcas = doc.querySelectorAll("a.marca, a.sm-marca");
    assert.ok(marcas.length, `${f}: sem a marca`);
    for (const a of marcas) homes.add(a.getAttribute("href"));
    for (const a of doc.querySelectorAll(".topo-site a")) if (a.text === "Início") homes.add(a.getAttribute("href"));
  }
  assert.equal(homes.size, 1, `a marca e o Início apontam para lugares diferentes: ${[...homes].join(", ")}`);
});

test("o endereço antigo do prefácio leva à introdução", () => {
  const html = readFileSync(new URL("../dist/ciclo-de-vida/00-prefacio/index.html", import.meta.url), "utf8");
  assert.match(html, /url=\/ciclo-de-vida\/00-introducao/);
});
