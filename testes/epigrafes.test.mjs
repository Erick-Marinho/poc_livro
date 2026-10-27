/** As epígrafes dos capítulos: a frase e a fonte, autor, obra e ano. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pagina = (p) => readFileSync(new URL(`../dist/ciclo-de-vida/${p}/index.html`, import.meta.url), "utf8");
const epigrafe = (html) => html.match(/<figure class="epigrafe"[^>]*>([\s\S]*?)<\/figure>/)?.[1] ?? "";
const legendaDe = (e) => (e.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/)?.[1] ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

test("o capítulo 2 abre com Ken Watanabe", () => {
  const e = epigrafe(pagina("02-o-primeiro-agente"));
  assert.match(e, /<blockquote[^>]*>Resolver problemas é uma combinação de pensar e agir\. Fazer apenas uma coisa ou outra não levará você a lugar nenhum\.<\/blockquote>/);
  assert.equal(legendaDe(e), "Ken Watanabe, em Problem Solving 101 (2009)");
});

test("o capítulo 1 segue com a epígrafe dele", () => {
  assert.equal(legendaDe(epigrafe(pagina("01-o-problema-e-o-contrato"))), "Uri Levine, cofundador do Waze, em Apaixone-se pelo problema, não pela solução (2023)");
});
