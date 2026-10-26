/** O ensaio do substituto, no 2.3 (docs/capacidades/capitulo-2-em-cenas.md, etapa 3): o modelo falso, dos testes reais. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { montarEnsaio, ensaiosDe, baloes, SEGUNDOS } from "../src/components/livro/roteiro/ensaio.ts";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const saidas = JSON.parse(ler("livros/ciclo-de-vida/saidas.json"));
const entrada = {
  arestas: saidas["grafo-02"],
  nos: JSON.parse(ler("livros/ciclo-de-vida/figuras/grafo-02.json")),
  referencia: ler("livros/ciclo-de-vida/projeto/referencia.jsonl"),
  testes: ler("livros/ciclo-de-vida/projeto/test_agente.py"),
  pytest: saidas["r02-pytest"],
};

test("os ensaios saem do test_agente.py: a escolha combinada, os textos e a pergunta de cada teste", () => {
  const es = ensaiosDe(entrada.testes);
  assert.deepEqual(es.map((e) => e.decisao).toSorted(), ["abrir_chamado", "passar", "recusar", "responder"]);
  const e = montarEnsaio(entrada);
  assert.deepEqual([e.fixo.decisao, e.fixo.textos], ["passar", []]);
  assert.deepEqual([e.escrito.decisao, e.escrito.textos], ["responder", ["Seu pedido sai amanhã."]]);
});

test("a saída do fim é a do pytest gravado, e uma saída com falha não monta", () => {
  assert.equal(montarEnsaio(entrada).passou, "11 passed");
  const falhou = { ...entrada.pytest, saida: [["1 failed, 10 passed in 0.9s", ""]] };
  assert.throws(() => montarEnsaio({ ...entrada, pytest: falhou }), /não termina com todos passando/);
});

test("os balões emendam, e nenhum diz o que os testes provam: isso fica para o pare e pense", () => {
  const bs = baloes(montarEnsaio(entrada));
  bs.forEach((b, i) => { if (i) assert.equal(b.de, bs[i - 1].ate); });
  assert.ok(bs.at(-1).ate >= SEGUNDOS);
  for (const b of bs) assert.doesNotMatch(b.texto, /encanamento|intelig/);
});

test("na página, o 2.3 tem o ensaio e um pare e pense só", () => {
  const html = ler("dist/ciclo-de-vida/02-o-primeiro-agente/index.html");
  const secao = html.slice(html.indexOf('<h2 id="s2-3"'), html.indexOf('<h2 id="s2-4"'));
  assert.match(secao, /data-ensaio/);
  assert.equal([...secao.matchAll(/Ver a resposta/g)].length, 1);
});
