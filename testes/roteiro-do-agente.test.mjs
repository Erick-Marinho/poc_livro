/** O roteiro do substituto, no 2.1 (docs/capacidades/capitulo-2-em-cenas.md, etapa 1): a figura sai do grafo real e do contrato. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { montarRoteiro, legenda, CENAS, DURACAO, FPS } from "../src/components/livro/roteiro/roteiro.ts";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const entrada = {
  arestas: JSON.parse(ler("livros/ciclo-de-vida/saidas.json"))["grafo-02"],
  nos: JSON.parse(ler("livros/ciclo-de-vida/figuras/grafo-02.json")),
  referencia: ler("livros/ciclo-de-vida/projeto/referencia.jsonl"),
  mensagens: ["R10", "R15"],
};

test("os balcões são os nós para onde as setas que escolhem levam, no grafo real", () => {
  const r = montarRoteiro(entrada);
  assert.equal(r.decide, "decidir");
  assert.deepEqual(r.balcoes.map((b) => b.id), ["responder", "abrir_chamado", "recusar", "passar"]);
  assert.deepEqual(r.balcoes.map((b) => b.modelo), ["escreve", "não", "escreve", "não"]);
});

test("cada mensagem vai ao balcão da decisão do contrato", () => {
  const r = montarRoteiro(entrada);
  assert.deepEqual(r.mensagens.map((m) => [m.id, m.balcao]), [["R10", "abrir_chamado"], ["R15", "recusar"]]);
  assert.match(legenda(r, 1), /abrir chamado/);
  assert.match(legenda(r, 2), /recusar/);
  assert.match(legenda(r, 3), /grafo/);
});

test("figura que descreve um nó que o grafo não tem não monta", () => {
  const nos = structuredClone(entrada.nos);
  nos.nos.inventado = { papel: "não existe" };
  assert.throws(() => montarRoteiro({ ...entrada, nos }), /a figura e o grafo não batem/);
});

test("as cenas emendam e o vídeo tem a duração delas", () => {
  CENAS.forEach((c, i) => { if (i) assert.equal(c.de, CENAS[i - 1].ate); });
  assert.equal(DURACAO, Math.round(CENAS.at(-1).ate * FPS));
});

test("na página, o 2.1 tem o roteiro com a escolha do balcão, e não mais o grafo de clicar", () => {
  const html = ler("dist/ciclo-de-vida/02-o-primeiro-agente/index.html");
  const secao = html.slice(html.indexOf('<h2 id="s2-1"'), html.indexOf('<h2 id="s2-2"'));
  assert.match(secao, /data-roteiro/);
  assert.doesNotMatch(secao, /data-grafo/);
});
