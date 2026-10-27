/** Os agentes no mundo (docs/capacidades/agentes-no-mundo.md): no 1.1, os números do Banco da Inglaterra, logo depois da escala. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const dados = JSON.parse(ler("livros/ciclo-de-vida/figuras/autonomia-no-mundo.json"));
const mdx = ler("livros/ciclo-de-vida/capitulos/01-o-problema-e-o-contrato.mdx");
const html = ler("dist/ciclo-de-vida/01-o-problema-e-o-contrato/index.html");

test("no 1.1, os números do Banco da Inglaterra vêm logo depois da escala, com fonte, amostra e o aviso de não somar", () => {
  const secao = mdx.slice(mdx.indexOf("## 1.1"), mdx.indexOf("## 1.2"));
  assert.ok(secao.indexOf("<Aposta dados={escala}") < secao.indexOf("<NumerosDaPesquisa dados={autonomiaNoMundo}"));
  assert.deepEqual(dados.barras.map((b) => [b.id, b.valor]), [["implantados", 80], ["apoio", 80], ["clientes", 16], ["ampla", 2]]);
  for (const b of dados.barras) assert.match(html, new RegExp(`data-barra="${b.id}"`));
  assert.ok(html.includes(dados.fonte.url));
  assert.match(dados.fonte.amostra, /105 instituições/);
  assert.match(dados.fonte.aviso, /não some/);
});

test("ficam de fora os números que não foram conferidos na fonte", () => {
  const tudo = [mdx, ler("livros/ciclo-de-vida/capitulos/00-introducao.mdx"), ler("livros/ciclo-de-vida/figuras/autonomia-no-mundo.json"),
    ler("livros/ciclo-de-vida/figuras/agentes-em-producao.json")].join("\n");
  for (const n of ["46%", "22%", "450 bilhões", "McKinsey"]) assert.ok(!tudo.includes(n), `${n} entrou sem fonte conferida`);
});
