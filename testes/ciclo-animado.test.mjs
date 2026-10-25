/** O mapa do ciclo em anel, na introdução: o desenho e os cartões saem do ciclo.json. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse } from "node-html-parser";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const ciclo = JSON.parse(ler("livros/ciclo-de-vida/figuras/ciclo.json"));
const mapa = parse(ler("dist/ciclo-de-vida/00-introducao/index.html")).querySelector("#mapa-do-ciclo");
const normal = (s) => s.replace(/\s+/g, " ").trim();

test("o mapa é um anel e uma coluna, com um nó para cada fase do ciclo.json", () => {
  for (const desenho of ["anel", "coluna"]) {
    const svg = mapa.querySelector(`svg[data-desenho="${desenho}"]`);
    assert.ok(svg, `falta o desenho em ${desenho}`);
    assert.deepEqual(svg.querySelectorAll("[data-no]").map((n) => n.getAttribute("data-no")).toSorted(), ciclo.fases.map((f) => f.id).toSorted());
  }
});

test("a volta sai de 'quando dá errado' e entra em 'avaliar', e Evoluir volta de Observar a Construir", () => {
  for (const desenho of ["anel", "coluna"]) {
    const svg = mapa.querySelector(`svg[data-desenho="${desenho}"]`);
    assert.ok(svg.querySelector('[data-volta="errado-avaliar"]'), `${desenho}: falta a volta do erro`);
    assert.ok(svg.querySelector('[data-volta="observar-construir"]'), `${desenho}: falta a volta do Evoluir`);
  }
});

test("um cartão por fase, com o nome e a pergunta à vista, e o resto dentro", () => {
  const cartoes = mapa.querySelectorAll("details[data-cartao]");
  assert.equal(cartoes.length, ciclo.fases.length);
  for (const f of ciclo.fases) {
    const c = mapa.querySelector(`details[data-cartao="${f.id}"]`);
    const resumo = normal(c.querySelector("summary").text);
    assert.ok(resumo.includes(f.nome) && resumo.includes(f.pergunta), `o cartão de ${f.id} não mostra o nome e a pergunta`);
    assert.ok(normal(c.text).includes(f.ganha), `o cartão de ${f.id} não tem o que o agente ganha`);
  }
});
