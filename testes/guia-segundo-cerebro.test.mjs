/** O guia do segundo cérebro: as figuras dizem o que as notas e o rastro gravado dizem. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse } from "node-html-parser";

const html = parse(readFileSync(new URL("../dist/guias/segundo-cerebro-local/index.html", import.meta.url), "utf8"));
const ilha = (nome) => html.querySelectorAll("astro-island").find((i) => (i.getAttribute("component-url") ?? "").includes(nome))?.getAttribute("props") ?? "";
const saidas = JSON.parse(readFileSync(new URL("../guias/segundo-cerebro-local/saidas.json", import.meta.url), "utf8"));

test("o cofre no tempo: três notas dizem que a entrega é 14/11 e uma diz 21/11; entregar as telas não conta", () => {
  const props = ilha("CofreNoTempo");
  const prazos = [...props.matchAll(/prazo&quot;:\[0,&quot;(\d{2}\/\d{2})|prazo":\[0,"(\d{2}\/\d{2})/g)].map((m) => m[1] ?? m[2]);
  assert.deepEqual(prazos.toSorted(), ["14/11", "14/11", "14/11", "21/11"]);
});

test("o caminho da pergunta: sem a data, 14/11 de uma nota velha; com ela, 21/11, com a velha ao lado", () => {
  const r = JSON.parse(saidas["rastro-prazo"].saida[0][0]);
  assert.match(r.sem_data.frase, /14\/11/);
  assert.match(r.com_data.frase, /21\/11/);
  assert.match(r.com_data.antes.frase, /14\/11/);
  assert.equal(r.frases.filter((f) => f.palavras === r.topo).length, 4);
});
