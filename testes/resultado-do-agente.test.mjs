/** A prova corrigida, no 2.6 (docs/capacidades/capitulo-2-em-cenas.md): a mesma grade do 2.4, com o que o agente decidiu. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { montarResultado, baloesDoResultado, SEGUNDOS_RESULTADO } from "../src/components/livro/roteiro/prova.ts";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const saidas = JSON.parse(ler("livros/ciclo-de-vida/saidas.json"));
const entrada = { referencia: ler("livros/ciclo-de-vida/projeto/referencia.jsonl"), baseline: saidas["nota-de-partida"], medir: saidas["r02-medir"],
  gravacao: JSON.parse(ler("livros/ciclo-de-vida/gravacoes/r02-medir.json")) };

test("as decisões são as da gravação, e a nota é a do medir.py gravado", () => {
  const r = montarResultado(entrada);
  assert.deepEqual([r.acertos, r.porcento, r.partida.porcento], [6, 30, 25]);
  assert.equal(r.questoes.filter((q) => q.decidiu === "passar").length, 19);
  const outro = { ...entrada.medir, saida: [["nota do agente: 7 de 20 (35%)", ""]] };
  assert.throws(() => montarResultado({ ...entrada, medir: outro }), /a figura conta 6 de 20/);
});

test("os balões contam o padrão, um motivo real e o R12, e emendam", () => {
  const r = montarResultado(entrada);
  const bs = baloesDoResultado(r, "R07", "R12");
  bs.forEach((b, i) => { if (i) assert.equal(b.de, bs[i - 1].ate); });
  assert.ok(bs.at(-1).ate >= SEGUNDOS_RESULTADO);
  assert.match(bs[2].texto, /19 das 20/);
  assert.ok(bs[3].texto.includes(r.questoes.find((q) => q.id === "R07").motivo), "o motivo é o da gravação");
  assert.match(bs[4].texto, /R12.*devia recusar/);
});

test("na página, o 2.6 abre com a prova corrigida e tem um pare e pense só", () => {
  const html = ler("dist/ciclo-de-vida/02-o-primeiro-agente/index.html");
  const secao = html.slice(html.indexOf('<h2 id="s2-6"'));
  assert.match(secao, /data-resultado/);
  assert.equal([...secao.slice(0, secao.indexOf("data-ponto-de-volta") > 0 ? secao.indexOf("data-ponto-de-volta") : secao.length).matchAll(/Ver a resposta/g)].length >= 1, true);
  assert.doesNotMatch(secao, /camadas de formato e de comportamento/);
});
