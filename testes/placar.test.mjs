/** O placar de cada página: os marcos até aquele capítulo, e a pergunta sobre o capítulo seguinte. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const placar = (p) => {
  const html = readFileSync(new URL(`../dist${p}index.html`, import.meta.url), "utf8").replace(/&quot;/g, '"');
  return { notas: [...html.matchAll(/"nota":\[0,"(\d+%)"\]/g)].map((m) => m[1]), proximo: html.match(/"proximo":\[0,\{"capitulo":\[0,(\d+)\],"pergunta":\[0,"([^"]+)"\]/)?.slice(1) };
};

test("o capítulo 1 tem a nota de partida e pergunta pelo capítulo 2", () => {
  assert.deepEqual(placar("/ciclo-de-vida/01-o-problema-e-o-contrato/"), { notas: ["25%"], proximo: ["2", "O seu agente bate os 25%?"] });
});

test("o capítulo 2 soma a nota do agente e pergunta pelo capítulo 3", () => {
  assert.deepEqual(placar("/ciclo-de-vida/02-o-primeiro-agente/"), { notas: ["25%", "30%"], proximo: ["3", "Com as ferramentas, ele passa dos 30% sem perder o cuidado?"] });
});
