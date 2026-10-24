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

test("cada saída gravada do guia aparece na página, linha por linha: no terminal, ou nos dados da IDE do guia", () => {
  for (const g of guias) {
    const html = pagina(`/guias/${g}/`);
    const texto = html.querySelector("main").text;
    /* a IDE é uma ilha React: o que o terminal dela mostra vai nos dados da ilha, como texto JSON */
    const ide = html.querySelectorAll("astro-island").filter((i) => /IdeCapitulo/.test(i.getAttribute("component-url") ?? "")).map((i) => i.getAttribute("props") ?? "").join("");
    const esta = (t) => texto.includes(t) || ide.includes(JSON.stringify(t).slice(1, -1));
    const saidas = JSON.parse(readFileSync(new URL(`guias/${g}/saidas.json`, raiz), "utf8"));
    for (const [id, s] of Object.entries(saidas)) {
      assert.ok(esta(s.comando), `${g}/${id}: o comando não está na página`);
      for (const [linha] of s.saida) assert.ok(esta(linha), `${g}/${id}: falta "${linha}"`);
    }
  }
});
