/** As ações do leitor do capítulo 1 (Aposta, Pilhas, Troca): os dados vêm do referencia.jsonl, e a ilustração diz que é. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { casos } from "../src/lib/referencia.ts";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const html = ler("dist/ciclo-de-vida/01-o-problema-e-o-contrato/index.html").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const referencia = ler("livros/ciclo-de-vida/projeto/referencia.jsonl");
const caso = (id) => casos(referencia, [id], "teste")[0];

test("a aposta mostra três mensagens de verdade e diz que o agente é ilustração", () => {
  assert.equal([...html.matchAll(/class="apo-msg"/g)].length, 3);
  for (const id of ["R12", "R11", "R02"]) assert.ok(html.includes(caso(id).pergunta), id);
  assert.match(html, /Ilustração: o agente apressado não existe/);
});

test("as pilhas separam como o contrato, que vem do referencia.jsonl", () => {
  const cartas = [...html.matchAll(/class="pil-carta" data-decisao="(\w+)"/g)].map((m) => m[1]);
  assert.deepEqual(cartas, ["R03", "R06", "R07", "R10", "R15", "R16"].map((id) => caso(id).decisao));
  assert.equal(new Set(cartas).size, 4, "as quatro decisões aparecem");
});

test("a troca tem uma variante que o contrato pega, e o veredito sai da comparação", () => {
  assert.equal([...html.matchAll(/class="tro-ok"/g)].length, 2);
  assert.equal([...html.matchAll(/class="tro-nao"/g)].length, 1);
  assert.ok(html.includes(caso("R11").motivo));
});

test("caso que não existe não monta", () => {
  assert.throws(() => casos(referencia, ["R99"], "Pilhas"), /Pilhas: o caso R99 não está no referencia.jsonl/);
});
