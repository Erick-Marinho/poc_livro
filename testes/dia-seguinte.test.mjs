/** O dia seguinte, no 1.2 (docs/capacidades/capitulo-1-dinamicas.md, etapa 4): ilustração presa ao gabarito e à Aposta. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { baloes, montarDia, SEGUNDOS, T } from "../src/components/livro/dia/dia.ts";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const referencia = ler("livros/ciclo-de-vida/marcos/cap-01/referencia.jsonl");
const dados = JSON.parse(ler("livros/ciclo-de-vida/figuras/dia-seguinte.json"));
const aposta = JSON.parse(ler("livros/ciclo-de-vida/figuras/agente-apressado.json"));
const nomes = { responder: "responder", abrir_chamado: "abrir chamado", recusar: "recusar", passar: "passar a vez" };

test("a tarde é de perguntas de responder, o dia seguinte é o da Aposta, e a nota sai da conta", () => {
  const d = montarDia(referencia, dados, aposta, nomes);
  assert.equal(d.tarde.length, 5);
  assert.deepEqual(d.seguinte.map((l) => l.id), aposta.mensagens.map((m) => m.caso));
  assert.deepEqual([d.certos, d.total], [5, 8]);
  assert.equal(d.seguinte[0].gabarito, "recusar");
  assert.match(d.seguinte[0].porque, /outra pessoa/);
  assert.equal(d.seguinte[0].pergunta, JSON.parse(referencia.split("\n").find((l) => l.includes('"R12"'))).pergunta);
});

test("tarde com pergunta que não é de responder, dia seguinte fora da Aposta ou caso inexistente não montam", () => {
  const tarde = structuredClone(dados); tarde.tarde[0].caso = "R15";
  assert.throws(() => montarDia(referencia, tarde, aposta, nomes), /o gabarito do R15 é recusar/);
  const fora = structuredClone(dados); fora.seguinte.reverse();
  assert.throws(() => montarDia(referencia, fora, aposta, nomes), /não são as da Aposta/);
  const nenhum = structuredClone(dados); nenhum.tarde[1].caso = "R99";
  assert.throws(() => montarDia(referencia, nenhum, aposta, nomes), /R99 não está no referencia.jsonl/);
});

test("os balões se sucedem sem buraco e cobrem a animação; a última marca vem antes da nota", () => {
  const d = montarDia(referencia, dados, aposta, nomes);
  const bs = baloes(d);
  bs.forEach((b, i) => { if (i) assert.equal(b.de, bs[i - 1].ate); });
  assert.ok(bs.at(-1).ate >= SEGUNDOS);
  assert.ok(T.marca(d.total - 1) + 0.3 < T.nota);
  assert.match(bs.at(-1).texto, /5 de 8/);
});

test("no 1.2, a figura vem depois da Aposta e diz que é ilustração", () => {
  const cap = ler("livros/ciclo-de-vida/capitulos/01-o-problema-e-o-contrato.mdx");
  const secao = cap.slice(cap.indexOf("## 1.2"), cap.indexOf("## 1.3"));
  assert.ok(secao.indexOf("<Aposta") < secao.indexOf("<DiaSeguinte"));
  assert.match(secao, /<DiaSeguinte [^>]*ilustracao="Ilustração:/);
});
