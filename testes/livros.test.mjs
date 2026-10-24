/** A estante: um card por livro, que abre uma página montada e diz quantos capítulos do sumário já estão escritos. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { parse } from "node-html-parser";

const raiz = new URL("../", import.meta.url);
const estante = parse(readFileSync(new URL("dist/livros/index.html", raiz), "utf8"));
const livros = readdirSync(new URL("livros/", raiz), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);

test("cada livro tem um card, e o card abre uma página montada do próprio livro", () => {
  const links = estante.querySelectorAll(".card-livro").map((a) => a.getAttribute("href"));
  assert.equal(links.length, livros.length);
  for (const [i, href] of links.toSorted().entries()) {
    assert.ok(href.startsWith(`/${livros.toSorted()[i]}/`), href);
    assert.ok(existsSync(new URL(`dist${href}index.html`, raiz)), href);
  }
});

test("o card conta os capítulos escritos contra os do sumário", () => {
  for (const livro of livros) {
    const planejados = JSON.parse(readFileSync(new URL(`livros/${livro}/sumario.json`, raiz), "utf8")).capitulos.length;
    const escritos = readdirSync(new URL(`livros/${livro}/capitulos/`, raiz)).filter((f) => /^\d+-/.test(f) && !f.startsWith("00-")).length;
    const card = estante.querySelectorAll(".card-livro").find((a) => a.getAttribute("href").startsWith(`/${livro}/`));
    assert.ok(card.text.includes(`${escritos} de ${planejados} capítulos escritos`), card.text);
  }
});
