/** Os termos explicáveis (docs/capacidades/ajustes-da-introducao.md, etapa 5): a régua, sublinhada no texto, mostra o que é ao tocar. A definição vem do termos.json do livro, e o capítulo que ela cita existe. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse } from "node-html-parser";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const termos = JSON.parse(ler("livros/ciclo-de-vida/termos.json"));
const sumario = JSON.parse(ler("livros/ciclo-de-vida/sumario.json"));
const { trechos } = await import("../src/lib/termos.ts");

test("cada termo tem uma definição curta e um capítulo do sumário", () => {
  const { sobre, ...lista } = termos;
  assert.ok(Object.keys(lista).length, "sem termos");
  for (const [nome, t] of Object.entries(lista)) {
    assert.ok(t.definicao.split(/\s+/).length <= 25, `${nome}: a definição passa de 25 palavras`);
    assert.ok(sumario.capitulos.some((c) => c.numero === t.capitulo), `${nome}: o capítulo ${t.capitulo} não está no sumário`);
  }
});

test("o termo é achado com maiúscula e no plural, e não dentro de outra palavra", () => {
  const achados = (s) => trechos(s, ["régua"]).filter((t) => t.termo).map((t) => `${t.texto}→${t.termo}`);
  assert.deepEqual(achados("vira caso novo da régua, e a Régua passa"), ["régua→régua", "Régua→régua"]);
  assert.deepEqual(achados("duas réguas"), ["réguas→régua"]);
  assert.deepEqual(achados("regular, réguazinha"), []);
  assert.equal(trechos("a régua mede", ["régua"]).map((t) => t.texto).join(""), "a régua mede", "o texto não muda");
});

test("a introdução tem os termos, e cada um aparece no corpo dela", () => {
  const pagina = parse(ler("dist/ciclo-de-vida/00-introducao/index.html"));
  const dados = pagina.querySelector("script[data-termos]");
  assert.ok(dados, "a introdução não tem o componente dos termos");
  const lidos = JSON.parse(dados.text);
  const corpo = pagina.querySelector(".corpo").text;
  for (const nome of Object.keys(lidos)) {
    assert.ok(trechos(corpo, [nome]).some((t) => t.termo), `"${nome}" não aparece no corpo`);
    assert.match(lidos[nome], /capítulo \d/, `${nome}: a definição não diz em que capítulo o termo nasce`);
  }
});
