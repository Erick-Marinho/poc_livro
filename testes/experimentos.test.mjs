/** Os experimentos: a lista leva a páginas que existem, e cada experimento mostra a saída gravada do projeto dele. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { parse } from "node-html-parser";

const raiz = new URL("../", import.meta.url);
const pagina = (p) => parse(readFileSync(new URL(`dist${p}index.html`, raiz), "utf8"));
const experimentos = readdirSync(new URL("experimentos/", raiz), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);

test("a lista tem um link para cada experimento, e cada link abre uma página montada", () => {
  const links = pagina("/experimentos/").querySelectorAll(".experimentos-lista h2 a").map((a) => a.getAttribute("href"));
  assert.deepEqual(links.toSorted(), experimentos.map((g) => `/experimentos/${g}/`).toSorted());
  for (const href of links) assert.ok(existsSync(new URL(`dist${href}index.html`, raiz)), href);
});

test("cada saída gravada do experimento aparece na página, linha por linha: no terminal, ou nos dados da IDE e das figuras", () => {
  for (const g of experimentos) {
    const html = pagina(`/experimentos/${g}/`);
    const texto = html.querySelector("main").text;
    /* a IDE e as figuras são ilhas React: o que elas mostram vai nos dados da ilha, como texto JSON */
    const ide = html.querySelectorAll("astro-island").map((i) => i.getAttribute("props") ?? "").join("");
    const esta = (t) => texto.includes(t) || ide.includes(JSON.stringify(t).slice(1, -1));
    const saidas = JSON.parse(readFileSync(new URL(`experimentos/${g}/saidas.json`, raiz), "utf8"));
    for (const [id, s] of Object.entries(saidas)) {
      assert.ok(esta(s.comando), `${g}/${id}: o comando não está na página`);
      for (const [linha] of s.saida) assert.ok(esta(linha), `${g}/${id}: falta "${linha}"`);
    }
  }
});

test("os endereços antigos dos guias levam aos experimentos", () => {
  const velho = readFileSync(new URL("dist/guias/segundo-cerebro-local/index.html", raiz), "utf8");
  assert.match(velho, /url=\/experimentos\/segundo-cerebro-local\/?"/);
  assert.match(readFileSync(new URL("dist/guias/index.html", raiz), "utf8"), /url=\/experimentos\/?"/);
});

/* o molde (docs/capacidades/experimentos.md): os campos do topo o build já confere; aqui, as partes do texto */
const temChave = (v, chave) => v && typeof v === "object" && (chave in v || Object.values(v).some((x) => temChave(x, chave)));

test("cada experimento tem as partes do texto do molde: o que vamos construir, a IDE com aposta, o inventado e a voz dos autores", () => {
  for (const g of experimentos) {
    const mdx = readFileSync(new URL(`experimentos/${g}/experimento.mdx`, raiz), "utf8");
    assert.match(mdx, /^## O que vamos construir$/m, `${g}: falta "## O que vamos construir", mostrado antes da construção`);
    assert.match(mdx, /<IdeCapitulo\b/, `${g}: falta a construção na IDE`);
    const roteiros = readdirSync(new URL(`experimentos/${g}/roteiros/`, raiz)).filter((f) => /^\d+\.json$/.test(f));
    const apostas = roteiros.some((f) => temChave(JSON.parse(readFileSync(new URL(`experimentos/${g}/roteiros/${f}`, raiz), "utf8")), "aposta"));
    assert.ok(apostas, `${g}: o roteiro da IDE não tem nenhuma aposta`);
    assert.match(mdx, /<Nota titulo="o que é inventado">/, `${g}: falta a nota do que é inventado`);
    assert.match(mdx, /<Pendente\b/, `${g}: falta o lugar da voz dos autores (Pendente)`);
  }
});

test("a página abre com o que se testa e fecha com o que deu, com os números das saídas gravadas", () => {
  for (const g of experimentos) {
    const main = pagina(`/experimentos/${g}/`).querySelector("main");
    const partes = main.querySelectorAll(":scope > section, :scope > div.corpo").map((e) => e.classList.contains("corpo") ? "corpo" : e.querySelector("h2")?.text ?? "abertura");
    assert.deepEqual(partes, ["abertura", "O que se testa", "corpo", "O que deu"], g);
    const saidas = JSON.parse(readFileSync(new URL(`experimentos/${g}/saidas.json`, raiz), "utf8"));
    const numeros = main.querySelectorAll(".resultados .numero").map((n) => n.text);
    const comandos = main.querySelectorAll(".resultados .comando").map((c) => c.text.replace(/^\$ /, ""));
    for (const [i, comando] of comandos.entries()) {
      const s = Object.values(saidas).find((x) => x.comando === comando);
      const [, x, y] = s.saida.map(([l]) => l).join("\n").match(/(\d+) de (\d+) \(\d+%\)/);
      assert.equal(numeros[i], `${x} de ${y}`, `${g}: ${comando}`);
    }
    assert.ok(numeros.length > 0, `${g}: o que deu está sem resultado`);
  }
});
