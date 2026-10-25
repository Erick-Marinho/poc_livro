/** A introdução: o mapa do ciclo e a aposta de onde cada problema se pega. Os dados batem com o sumário, o texto e a régua. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(ler(p));
const ciclo = json("livros/ciclo-de-vida/figuras/ciclo.json");
const aposta = json("livros/ciclo-de-vida/figuras/onde-se-pega.json");
const sumario = json("livros/ciclo-de-vida/sumario.json");
const mdx = ler("livros/ciclo-de-vida/capitulos/00-introducao.mdx");
const html = ler("dist/ciclo-de-vida/00-introducao/index.html");

test("cada capítulo do sumário está em uma fase do ciclo, e só em uma", () => {
  const nas = ciclo.fases.flatMap((f) => f.capitulos).toSorted((a, b) => a - b);
  assert.deepEqual(nas, sumario.capitulos.map((c) => c.numero));
});

test("a aposta usa os problemas do primeiro parágrafo, e cada resposta é uma fase que diz o capítulo certo", () => {
  const paragrafo = mdx.match(/Depois da primeira resposta vêm ([^\n]+)/)[1].toLowerCase();
  for (const m of aposta.mensagens) {
    assert.ok(paragrafo.includes(m.texto.replace(/\.$/, "").toLowerCase()), `"${m.texto}" não está no primeiro parágrafo`);
    const fase = ciclo.fases.find((f) => f.nome === m.opcoes[m.fez]);
    assert.ok(fase, `${m.opcoes[m.fez]} não é uma fase do ciclo`);
    const citado = Number(m.porque.match(/capítulo (\d)/)?.[1]);
    assert.ok(fase.capitulos.includes(citado), `"${m.texto}": a fase ${fase.nome} não é a do capítulo ${citado}`);
  }
  const r12 = ler("livros/ciclo-de-vida/projeto/referencia.jsonl").split("\n").find((l) => l.includes('"R12"'));
  assert.match(r12, /bruno/); assert.match(r12, /outra cliente/);
});

test("a página tem a aposta, o mapa com as oito fases e as quatro referências", () => {
  assert.equal([...html.matchAll(/class="apo-msg"/g)].length, 4);
  assert.equal([...html.matchAll(/data-detalhe="/g)].length, ciclo.fases.length);
  for (const r of ciclo.fontes) assert.ok(html.includes(r.url), r.nome);
});

test("na abertura de cada capítulo, a fase acesa é a do ciclo.json, e o link leva ao mapa da introdução", () => {
  assert.match(html, /id="mapa-do-ciclo"/);
  for (const [arq, n] of [["01-o-problema-e-o-contrato", 1], ["02-o-primeiro-agente", 2]]) {
    const pagina = ler(`dist/ciclo-de-vida/${arq}/index.html`);
    const fase = ciclo.fases.find((f) => f.capitulos.includes(n));
    assert.match(pagina, new RegExp(`data-ciclo-aqui="${fase.id}"`), `capítulo ${n}`);
    assert.equal([...pagina.matchAll(/aria-current="step"/g)].length, 1);
    assert.match(pagina, /href="\/ciclo-de-vida\/00-introducao\/#mapa-do-ciclo"/);
  }
});
