/** O corpus do experimento da pausa e do fluxo (docs/capacidades/experimento-pausa-e-fluxo.md), congelado antes de medir. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const projeto = new URL("../rascunhos/pausa-e-fluxo/projeto/", import.meta.url);
const casos = readFileSync(new URL("casos.jsonl", projeto), "utf8").trim().split("\n").map((l) => JSON.parse(l));
/* o que o modelo lê: o material da loja, nesta ordem, e a pergunta no fim */
const texto = (c) => [...c.material.map((m) => readFileSync(new URL(`dados/${m}`, projeto), "utf8")), `Pergunta: ${c.pergunta}`].join("\n\n");
const palavras = (s) => s.split(/\s+/).filter(Boolean).length;

test("três casos, a mesma pergunta: só muda quanto o modelo tem de ler antes de responder", () => {
  assert.deepEqual(casos.map((c) => c.id), ["curta", "media", "longa"]);
  assert.equal(new Set(casos.map((c) => c.pergunta)).size, 1, "a pergunta é a mesma nos três");
  for (const c of casos) for (const m of c.material) assert.ok(existsSync(new URL(`dados/${m}`, projeto)), `${c.id}: falta dados/${m}`);
  const [curta, media, longa] = casos.map((c) => palavras(texto(c)));
  assert.ok(media >= 4 * curta && longa >= 4 * media, `cada caso lê ao menos 4 vezes o anterior: ${curta}, ${media}, ${longa} palavras`);
});

test("nenhum caso começa como outro, para o cache não encurtar a pausa medida", () => {
  const inicios = casos.map((c) => texto(c).slice(0, 40));
  assert.equal(new Set(inicios).size, casos.length, `começos repetidos: ${JSON.stringify(inicios)}`);
});
