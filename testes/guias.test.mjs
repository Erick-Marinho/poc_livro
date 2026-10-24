/** Os guias: a lista leva a páginas que existem, e cada guia mostra a saída gravada do projeto dele. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { parse } from "node-html-parser";

const raiz = new URL("../", import.meta.url);
const pagina = (p) => parse(readFileSync(new URL(`dist${p}index.html`, raiz), "utf8"));
const guias = readdirSync(new URL("guias/", raiz), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);

test("a lista tem um link para cada guia, e cada link abre uma página montada", () => {
  const links = pagina("/guias/").querySelectorAll(".guias h2 a").map((a) => a.getAttribute("href"));
  assert.deepEqual(links.toSorted(), guias.map((g) => `/guias/${g}/`).toSorted());
  for (const href of links) assert.ok(existsSync(new URL(`dist${href}index.html`, raiz)), href);
});

test("cada saída gravada do guia aparece no terminal da página, linha por linha", () => {
  for (const g of guias) {
    const texto = pagina(`/guias/${g}/`).querySelector("main").text;
    const saidas = JSON.parse(readFileSync(new URL(`guias/${g}/saidas.json`, raiz), "utf8"));
    for (const [id, s] of Object.entries(saidas)) {
      assert.ok(texto.includes(s.comando), `${g}/${id}: o comando não está na página`);
      for (const [linha] of s.saida) assert.ok(texto.includes(linha), `${g}/${id}: falta "${linha}"`);
    }
  }
});
