/** A variante investigável repete as vinte perguntas do projeto com apenas a regra removida. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { caminhosDaGravacao } from "../src/lib/grafoAgente.ts";

const ler = (p) => readFileSync(new URL(`../livros/ciclo-de-vida/${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(ler(p));
const regra = "Quando a política não diz, não prometa: passe a vez.";
const original = json("gravacoes/r02-medir.json");
const variante = json("gravacoes/r02-medir-sem-regra.json");
const referencia = ler("projeto/referencia.jsonl");

test("a gravação da variante usa só a instrução sem a regra, com as mesmas vinte perguntas", () => {
  const instrucao = Object.values(original)[0].mensagens.find((m) => m.kwargs.type === "system").kwargs.content;
  const esperada = instrucao.replace(regra, "");
  const perguntas = referencia.trim().split("\n").map((l) => JSON.parse(l).pergunta);
  const escolhas = Object.values(variante).filter((g) => g.resposta[0].kwargs.message.kwargs.additional_kwargs?.parsed);
  assert.equal(escolhas.length, 20);
  assert.deepEqual(escolhas.map((g) => g.mensagens.find((m) => m.kwargs.type === "human").kwargs.content).sort(), perguntas.sort());
  for (const g of escolhas) assert.equal(g.mensagens.find((m) => m.kwargs.type === "system").kwargs.content, esperada);
  assert.ok(ler("projeto/agente.py").includes(regra), "o projeto oficial mantém a regra");
});

test("o roteiro restaura a instrução e sua aposta corresponde ao resultado gravado", () => {
  const r = json("roteiros/02.json").passos.find((p) => p.id === "r02-medir");
  const op = r.variar.opcoes[0];
  const estados = json("roteiros/02.estados.json");
  const e = estados.find((e) => e.rodou === r.id);
  const ultimaEdicao = estados.filter((e) => e.arquivo === "agente.py").at(-1).conteudo;
  assert.ok(ultimaEdicao.includes(regra));
  assert.ok(!e.variantes[op.id].conteudo.includes(regra));
  const a = caminhosDaGravacao(original, referencia);
  const b = caminhosDaGravacao(variante, referencia);
  const acertos = (casos) => casos.filter((c) => c.esperado === c.decidiu).length;
  const direcao = acertos(b) > acertos(a) ? "Sobe" : acertos(b) < acertos(a) ? "Desce" : "Fica igual";
  assert.equal(op.aposta.opcoes[op.aposta.certa], direcao);
  const saida = json("saidas.json")[op.id].saida.map(([l]) => l).join("\n");
  assert.ok(saida.includes(`nota do agente: ${acertos(b)} de ${b.length}`));
});
