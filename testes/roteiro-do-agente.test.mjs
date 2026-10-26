/** O roteiro do substituto, no 2.1 (docs/capacidades/capitulo-2-em-cenas.md, etapa 1): a figura sai do grafo real e do contrato. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { montarRoteiro, baloes, T, DURACAO, FPS, SEGUNDOS } from "../src/components/livro/roteiro/roteiro.ts";

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

test("cada mensagem vai ao balcão da decisão do contrato, e os balões dizem qual", () => {
  const r = montarRoteiro(entrada);
  assert.deepEqual(r.mensagens.map((m) => [m.id, m.balcao]), [["R10", "abrir_chamado"], ["R15", "recusar"]]);
  const bs = baloes(r);
  assert.match(bs.find((b) => b.alvo === "balcao-a").texto, /abrir chamado/);
  assert.match(bs.find((b) => b.alvo === "balcao-b").texto, /recusar/);
  assert.match(bs.at(-1).texto, /estado/);
});

test("figura que descreve um nó que o grafo não tem não monta", () => {
  const nos = structuredClone(entrada.nos);
  nos.nos.inventado = { papel: "não existe" };
  assert.throws(() => montarRoteiro({ ...entrada, nos }), /a figura e o grafo não batem/);
});

test("os balões se sucedem sem buraco nem sobreposição, e cobrem a animação inteira", () => {
  const bs = baloes(montarRoteiro(entrada));
  bs.forEach((b, i) => { if (i) assert.equal(b.de, bs[i - 1].ate, `o balão ${i + 1} não emenda no anterior`); assert.ok(b.ate > b.de); });
  assert.ok(bs.at(-1).ate >= SEGUNDOS, "o último balão fica até o fim");
  assert.ok(T.grafo[1] < SEGUNDOS && T.b.fim[1] < T.grafo[0], "o grafo vem depois das duas mensagens");
  assert.equal(DURACAO, SEGUNDOS * FPS);
});

test("na página, o 2.1 tem o roteiro, e não mais o grafo de clicar", () => {
  const html = ler("dist/ciclo-de-vida/02-o-primeiro-agente/index.html");
  const secao = html.slice(html.indexOf('<h2 id="s2-1"'), html.indexOf('<h2 id="s2-2"'));
  assert.match(secao, /data-roteiro/);
  assert.doesNotMatch(secao, /data-grafo/);
});
