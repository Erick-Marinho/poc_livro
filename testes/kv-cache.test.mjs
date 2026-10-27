/** O corpus do experimento do KV cache (docs/capacidades/experimento-kv-cache.md), congelado antes de medir. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";

const projeto = new URL("../rascunhos/kv-cache/projeto/", import.meta.url);
const origem = new URL("../experimentos/pausa-e-fluxo/projeto/dados/", import.meta.url);
const casos = readFileSync(new URL("casos.jsonl", projeto), "utf8").trim().split("\n").map((l) => JSON.parse(l));
/* o que o modelo lê: o material do regulamento, nesta ordem, e a pergunta no fim */
const texto = (c) => [...c.material.map((m) => readFileSync(new URL(`dados/${m}`, projeto), "utf8")), `Pergunta: ${c.pergunta}`].join("\n\n");
const palavras = (s) => s.split(/\s+/).filter(Boolean).length;

test("dois casos, a mesma pergunta: a longa lê o regulamento inteiro antes dela", () => {
  assert.deepEqual(casos.map((c) => c.id), ["curta", "longa"]);
  assert.equal(new Set(casos.map((c) => c.pergunta)).size, 1, "a pergunta é a mesma nos dois");
  for (const c of casos) for (const m of c.material) assert.ok(existsSync(new URL(`dados/${m}`, projeto)), `${c.id}: falta dados/${m}`);
  const [curta, longa] = casos.map((c) => palavras(texto(c)));
  assert.ok(longa >= 40 * curta, `a longa lê ao menos 40 vezes a curta: ${curta} e ${longa} palavras`);
});

test("o regulamento é o do pausa-e-fluxo, byte a byte, e diz que é inventado", () => {
  const nomes = readdirSync(origem).sort();
  assert.deepEqual(readdirSync(new URL("dados/", projeto)).sort(), nomes);
  for (const n of nomes) assert.ok(readFileSync(new URL(`dados/${n}`, projeto)).equals(readFileSync(new URL(n, origem))), `dados/${n} difere do pausa-e-fluxo`);
  assert.match(texto(casos[1]), /\(condomínio inventado\)/);
});
