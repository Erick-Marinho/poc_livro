/** Monte a sua primeira questão, no 1.5 (docs/capacidades/capitulo-1-dinamicas.md, etapa 1): as regras saem do contrato.py. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { conferir, lerRegras, linha } from "../src/components/livro/questao/regras.ts";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const contrato = ler("livros/ciclo-de-vida/marcos/cap-01/contrato.py");
const linhas = ler("livros/ciclo-de-vida/marcos/cap-01/referencia.jsonl").split("\n").filter((l) => l.trim());
const regras = lerRegras(contrato);
const caso = (id) => JSON.parse(linhas.find((l) => l.includes(`"id": "${id}"`)));
const barra = (q) => conferir(q, regras).map((e) => e.texto).join(" | ");

test("as regras são lidas do contrato.py, e não escritas à mão", () => {
  assert.deepEqual(regras.decisoes, ["responder", "abrir_chamado", "recusar", "passar"]);
  assert.deepEqual(regras.fontes, ["pedidos", "politica", "catalogo"]);
  assert.equal(regras.id, String.raw`^R\d{2}$`);
  assert.equal(regras.pedido, String.raw`^BT-\d{4}$`);
  assert.match(regras.juntos, /pedido e e-mail andam juntos/);
  assert.match(regras.qualPedido, /tem que dizer qual pedido/);
});

test("contrato que a figura não sabe ler não monta", () => {
  assert.throws(() => lerRegras(contrato.replace("class Fonte(StrEnum)", "class Origem(StrEnum)")), /não achei a classe Fonte/);
  assert.throws(() => lerRegras(contrato.replace(/raise ValueError\("pedido e e-mail[^"]+"\)/, 'raise ValueError("outra")')), /pedido e do e-mail/);
});

test("as 20 questões do referencia.jsonl passam nas regras, e a linha gerada é a do arquivo", () => {
  assert.equal(linhas.length, 20);
  for (const l of linhas) {
    const q = JSON.parse(l);
    assert.deepEqual(conferir(q, regras), [], `${q.id} foi barrada`);
    assert.equal(linha(q), l, `${q.id}: a linha gerada não é a do arquivo`);
  }
});

test("cada regra barra o que deve, com a mensagem do contrato", () => {
  const r10 = caso("R10");
  assert.match(barra({ ...r10, id: "R1" }), /R e dois dígitos/);
  assert.match(barra({ ...r10, decisao: "" }), /uma destas: responder, abrir_chamado, recusar, passar/);
  assert.match(barra({ ...r10, motivo: "ok" }), /ao menos 5 letras/);
  assert.match(barra({ ...r10, pedido: "1005" }), /BT- e quatro dígitos/);
  assert.match(barra({ ...r10, email: "" }), /andam juntos/);
  assert.match(barra({ ...caso("R06"), precisa: ["pedidos"] }), /tem que dizer qual pedido/);
});

test("sem pedido nem e-mail, a linha não tem as duas chaves", () => {
  const r15 = caso("R15");
  assert.ok(!linha({ ...r15, pedido: "", email: "" }).includes("pedido\":"));
});

test("o 1.5 monta a questão no lugar das duas linhas abertas do referencia.jsonl", () => {
  const cap = ler("livros/ciclo-de-vida/capitulos/01-o-problema-e-o-contrato.mdx");
  const secao = cap.slice(cap.indexOf("## 1.5"), cap.indexOf("## 1.6"));
  assert.match(secao, /<MontaQuestao contrato=\{contratoPy\} referencia=\{referencia\} casos=\{\["R10"/);
  assert.doesNotMatch(secao, /nome="referencia\.jsonl"/);
  assert.match(secao, /nome="contrato\.py" linhas="12-18"/, "a listagem do Enum fica");
});
