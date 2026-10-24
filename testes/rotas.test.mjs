/** Nenhum endereço do site dá em nada: a raiz abre a estante, /<livro>/ abre o primeiro texto, e o resto cai em "em construção". Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const raiz = new URL("../", import.meta.url);
const ler = (p) => readFileSync(new URL(`dist${p}`, raiz), "utf8");
const destino = (p) => ler(p).match(/http-equiv="refresh" content="0;url=([^"]+)"/)?.[1];

test("a raiz leva à estante", () => assert.equal(destino("/index.html"), "/livros/"));

test("/ciclo-de-vida/ abre o livro pelo prefácio, uma página que existe", () => {
  const href = destino("/ciclo-de-vida/index.html");
  assert.equal(href, "/ciclo-de-vida/00-prefacio/");
  assert.ok(existsSync(new URL(`dist${href}index.html`, raiz)));
});

test("o que não existe mostra a página em construção, com o caminho para os livros e os guias", () => {
  const html = ler("/404.html");
  assert.match(html, /em construção/);
  assert.match(html, /href="\/livros\/"/);
  assert.match(html, /href="\/guias\/"/);
});
