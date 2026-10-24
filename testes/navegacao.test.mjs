/** Anterior e próximo são links de verdade, para páginas que existem. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const pagina = (p) => readFileSync(new URL(`../dist${p}index.html`, import.meta.url), "utf8");
const links = (html) => [...html.matchAll(/<a href="([^"]+)" rel="(prev|next)">/g)].map((m) => [m[2], m[1]]);

test("o prefácio leva ao capítulo 1, o 1 ao 2, e cada um volta ao anterior", () => {
  assert.deepEqual(links(pagina("/ciclo-de-vida/00-prefacio/")), [["next", "/ciclo-de-vida/01-o-problema-e-o-contrato/"]]);
  assert.deepEqual(links(pagina("/ciclo-de-vida/01-o-problema-e-o-contrato/")),
    [["prev", "/ciclo-de-vida/00-prefacio/"], ["next", "/ciclo-de-vida/02-o-primeiro-agente/"]]);
  assert.deepEqual(links(pagina("/ciclo-de-vida/02-o-primeiro-agente/")), [["prev", "/ciclo-de-vida/01-o-problema-e-o-contrato/"]]);
});

test("todo link de anterior e próximo aponta para uma página montada", () => {
  for (const p of ["/ciclo-de-vida/00-prefacio/", "/ciclo-de-vida/01-o-problema-e-o-contrato/", "/ciclo-de-vida/02-o-primeiro-agente/"])
    for (const [, href] of links(pagina(p))) assert.ok(existsSync(new URL(`../dist${href}index.html`, import.meta.url)), href);
});
