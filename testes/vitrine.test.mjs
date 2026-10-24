/** Os JSON que a landing lê mostram o mesmo que as páginas do site, e cada link abre uma página montada. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { parse } from "node-html-parser";

const raiz = new URL("../", import.meta.url);
const ler = (p) => readFileSync(new URL(`dist${p}`, raiz), "utf8");
const abre = (href) => assert.ok(existsSync(new URL(`dist${href}index.html`, raiz)), href);

test("/livros/index.json tem os livros da estante, na mesma ordem", () => {
  const { livros } = JSON.parse(ler("/livros/index.json"));
  assert.deepEqual(livros.map((l) => l.href), parse(ler("/livros/index.html")).querySelectorAll(".card-livro").map((a) => a.getAttribute("href")));
  for (const l of livros) { abre(l.href); assert.ok(l.escritos <= l.planejados); }
});

test("/experimentos/index.json tem os experimentos da lista, o mais novo em cima", () => {
  const { experimentos } = JSON.parse(ler("/experimentos/index.json"));
  assert.deepEqual(experimentos.map((g) => g.href), parse(ler("/experimentos/index.html")).querySelectorAll(".experimentos-lista h2 a").map((a) => a.getAttribute("href")));
  assert.deepEqual(experimentos.map((g) => g.data), experimentos.map((g) => g.data).toSorted().reverse());
  for (const g of experimentos) abre(g.href);
});
