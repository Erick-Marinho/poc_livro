/** O passador do formato de um caso: o trecho é o do contrato.py real, e as perguntas não mentem. (Ele volta à página dentro da IDE, na etapa 7b.) */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const dados = JSON.parse(ler("livros/ciclo-de-vida/passadores/caso.json"));
const contrato = ler("livros/ciclo-de-vida/projeto/contrato.py");
const saidas = JSON.parse(ler("livros/ciclo-de-vida/saidas.json"));

test("o trecho do passador é o formato de um caso no contrato.py real", () => {
  const [de, ate] = dados.linhas.split("-").map(Number);
  const trecho = contrato.split("\n").slice(de - 1, ate);
  assert.match(trecho[0], /^class Caso\(BaseModel\):/);
  assert.match(trecho.at(-1), /^\s+email:/);
});

test("a pergunta do id: só a resposta certa segue o padrão do contrato real", () => {
  const padrao = new RegExp(contrato.match(/id: str = Field\(pattern=r"([^"]+)"\)/)[1]);
  const q = dados.blocos.find((b) => b.pergunta?.texto.includes("ids")).pergunta;
  q.opcoes.forEach((o, i) => assert.equal(padrao.test(o), i === q.certa, o));
});

test("a pergunta do pedido: o roteiro mostra o caso apressado passando antes da regra", () => {
  const q = dados.blocos.find((b) => b.pergunta?.texto.includes("pedidos")).pergunta;
  assert.equal(q.opcoes[q.certa], "deixam passar");
  assert.equal(saidas["r01-caso-sem-pedido-passa"].saiu_com, 0);
  assert.notEqual(saidas["r01-caso-sem-pedido-barrado"].saiu_com, 0);
});
