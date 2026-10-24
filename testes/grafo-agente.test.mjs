/** A figura do grafo do agente: o desenho vem do grafo real, e os caminhos vêm da gravação. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { setas, camadas, caminhosDaGravacao } from "../src/lib/grafoAgente.ts";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(ler(p));
const s = setas(json("livros/ciclo-de-vida/saidas.json")["grafo-02"].saida);

test("o desenho sai das setas gravadas do grafo real, em camadas", () => {
  assert.equal(s.length, 9);
  assert.deepEqual(camadas(s), [["__start__"], ["decidir"], ["abrir_chamado", "passar", "recusar", "responder"], ["__end__"]]);
  assert.deepEqual(s.filter((x) => x.escolhe).map((x) => x.de), ["decidir", "decidir", "decidir", "decidir"]);
});

test("a figura descreve exatamente os nós que o grafo tem", () => {
  assert.deepEqual(Object.keys(json("livros/ciclo-de-vida/figuras/grafo-02.json").nos).sort(), camadas(s).flat().sort());
});

test("um ciclo no grafo para a figura, em vez de desenhar errado", () => {
  assert.throws(() => camadas([{ de: "__start__", para: "a", escolhe: false }, { de: "a", para: "b", escolhe: false }, { de: "b", para: "a", escolhe: true }]), /ciclo/);
});

test("os caminhos são os da gravação, e somam a nota do agente", () => {
  const c = caminhosDaGravacao(json("livros/ciclo-de-vida/gravacoes/r02-medir.json"), ler("livros/ciclo-de-vida/projeto/referencia.jsonl"));
  assert.equal(c.length, 20);
  assert.equal(c.filter((x) => x.decidiu === x.esperado).length, 6);   // 6 de 20, a nota do medir.py
  assert.equal(c.filter((x) => x.decidiu === "passar").length, 19);
  const r12 = c.find((x) => x.id === "R12");
  assert.deepEqual([r12.esperado, r12.decidiu, r12.escrita], ["recusar", "passar", null]);
  const cpf = c.find((x) => x.decidiu === "recusar");
  assert.equal(cpf.id, "R15");
  assert.match(cpf.escrita, /CPF/);   // recusar escreve com o modelo, e a escrita também foi gravada
});

test("a página traz as duas figuras: o desenho na 2.1 e os caminhos na 2.6", () => {
  const html = ler("dist/ciclo-de-vida/02-o-primeiro-agente/index.html");
  assert.deepEqual([...html.matchAll(/data-grafo data-modo="(\w+)"/g)].map((m) => m[1]), ["desenho", "caminhos"]);
  assert.equal([...html.matchAll(/class="ga-(certo|errado)"/g)].length, 20);
  assert.match(html, /gravados em 24\/10\/2026/);
});
