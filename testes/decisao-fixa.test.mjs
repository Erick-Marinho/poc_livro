/** A decisão fixa, no 1.7 (docs/capacidades/capitulo-1-dinamicas.md, etapa 2): a figura sai do gabarito e das saídas gravadas. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { montarChute, porcento, SAIDAS } from "../src/components/livro/chute/chute.ts";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const referencia = ler("livros/ciclo-de-vida/marcos/cap-01/referencia.jsonl");
const saidas = JSON.parse(ler("livros/ciclo-de-vida/saidas.json"));
const ordem = ["responder", "abrir_chamado", "recusar", "passar"];

test("os grupos saem do gabarito, e a nota de cada decisão é a da saída gravada", () => {
  const c = montarChute(referencia, saidas, ordem);
  assert.deepEqual(ordem.map((d) => c.perguntas.filter((p) => p.decisao === d).length), [8, 2, 5, 5]);
  assert.deepEqual(ordem.map((d) => porcento(c.notas[d])), ["40%", "10%", "25%", "25%"]);
  assert.equal(c.notas.passar.texto, "nota de partida: 5 de 20 (25%)");
});

test("saída gravada que não bate com o gabarito não monta", () => {
  const errada = structuredClone(saidas);
  errada[SAIDAS.responder].saida = errada[SAIDAS.responder].saida.map(([l, e]) => [l.replace("8 de 20 (40%)", "9 de 20 (45%)"), e]);
  assert.throws(() => montarChute(referencia, errada, ordem), /conta 8 de 20 em responder, e a saída gravada diz 9 de 20/);
  const sem = { ...saidas }; delete sem[SAIDAS.recusar];
  assert.throws(() => montarChute(referencia, sem, ordem), /falta a saída gravada r01-nota-sempre-recusar/);
});

test("o R12 é um erro do sempre responder: o gabarito é recusar", () => {
  const r12 = montarChute(referencia, saidas, ordem).perguntas.find((p) => p.id === "R12");
  assert.equal(r12.decisao, "recusar");
  assert.match(r12.motivo, /outra cliente/);
});

test("no 1.7, a figura toma o lugar do pare e pense do agente que responde tudo, e a lição fica no texto", () => {
  const cap = ler("livros/ciclo-de-vida/capitulos/01-o-problema-e-o-contrato.mdx");
  const secao = cap.slice(cap.indexOf("## 1.7"), cap.indexOf("<PontoDeVolta"));
  assert.match(secao, /<DecisaoFixa referencia=\{referencia\} saidas=\{saidas\} destaque="R12"/);
  assert.doesNotMatch(secao, /E um agente que responde tudo\?/);
  assert.match(secao, /uma nota que conta todo erro igual engana/);
});
