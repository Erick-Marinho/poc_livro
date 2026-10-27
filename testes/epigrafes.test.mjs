/** As epígrafes dos capítulos: a frase e a fonte inteira, com o trecho e a nota quando houver. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pagina = (p) => readFileSync(new URL(`../dist/ciclo-de-vida/${p}/index.html`, import.meta.url), "utf8");
const epigrafe = (html) => html.match(/<figure class="epigrafe"[^>]*>([\s\S]*?)<\/figure>/)?.[1] ?? "";

test("o capítulo 2 abre com Ken Watanabe, com o capítulo da obra e o aviso de que a tradução é nossa", () => {
  const e = epigrafe(pagina("02-o-primeiro-agente"));
  assert.match(e, /<blockquote[^>]*>Resolver problemas é uma combinação de pensar e agir\. Fazer apenas uma coisa ou outra não levará você a lugar nenhum\.<\/blockquote>/);
  const legenda = e.replace(/<[^>]+>/g, "").replace(/\s+/g, " ");
  assert.match(legenda, /Ken Watanabe, em Problem Solving 101 \(2009\), capítulo 1\. Tradução livre do original em inglês\./);
});

test("o capítulo 1 segue com a epígrafe dele, sem trecho nem nota", () => {
  const legenda = epigrafe(pagina("01-o-problema-e-o-contrato")).replace(/<[^>]+>/g, "").replace(/\s+/g, " ");
  assert.match(legenda, /Uri Levine, cofundador do Waze, em Apaixone-se pelo problema, não pela solução \(2023\)\./);
});
