/** O corpus novo do "Pausa e fluxo", o regulamento de um condomínio (docs/capacidades/pausa-e-fluxo-condominio.md, etapa 1),
 *  congelado antes de medir. Mora em rascunhos/ até a etapa 3, quando toma o lugar do corpus da loja. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const pasta = new URL("../rascunhos/pausa-e-fluxo-condominio/", import.meta.url);
const casos = readFileSync(new URL("casos.jsonl", pasta), "utf8").trim().split("\n").map((l) => JSON.parse(l));
/* o que o modelo lê: o material, nesta ordem, e a pergunta no fim (como o montar do medidor) */
const texto = (c) => [...c.material.map((m) => readFileSync(new URL(`dados/${m}`, pasta), "utf8")), `Pergunta: ${c.pergunta}`].join("\n\n");
const palavras = (s) => s.split(/\s+/).filter(Boolean).length;

test("o regulamento: três casos, a mesma pergunta, cada um lê ao menos 4 vezes o anterior", () => {
  assert.deepEqual(casos.map((c) => c.id), ["curta", "media", "longa"]);
  assert.equal(new Set(casos.map((c) => c.pergunta)).size, 1);
  for (const c of casos) for (const m of c.material) assert.ok(existsSync(new URL(`dados/${m}`, pasta)), `${c.id}: falta dados/${m}`);
  const [curta, media, longa] = casos.map((c) => palavras(texto(c)));
  assert.ok(media >= 4 * curta && longa >= 4 * media, `${curta}, ${media}, ${longa} palavras`);
});

test("o regulamento: nenhum caso começa como outro, e a resposta está no que a média e a longa leem", () => {
  const inicios = casos.map((c) => texto(c).slice(0, 40));
  assert.equal(new Set(inicios).size, casos.length, JSON.stringify(inicios));
  const [curta, media, longa] = casos.map(texto);
  const regra = "aos sábados, das 8h às 12h";
  assert.ok(!curta.includes(regra) && media.includes(regra) && longa.includes(regra));
  assert.match(longa, /\(condomínio inventado\)/, "a página e os dados dizem que é inventado");
});
