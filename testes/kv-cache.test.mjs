/** O corpus do experimento do KV cache (docs/capacidades/experimento-kv-cache.md), congelado antes de medir. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";

const projeto = new URL("../rascunhos/kv-cache/projeto/", import.meta.url);
const origem = new URL("../experimentos/pausa-e-fluxo/projeto/dados/", import.meta.url);
const casos = readFileSync(new URL("casos.jsonl", projeto), "utf8").trim().split("\n").map((l) => JSON.parse(l));
/* o que o modelo lê: o material do regulamento, nesta ordem, e a pergunta no fim */
const texto = (c) => [...c.material.map((m) => readFileSync(new URL(`dados/${m}`, projeto), "utf8")), `Pergunta: ${c.pergunta}`].join("\n\n");
const palavras = (s) => s.split(/\s+/).filter(Boolean).length;

test("dois casos, a mesma pergunta: a longa lê o regulamento inteiro antes dela", () => {
  assert.deepEqual(casos.map((c) => c.id), ["curta", "longa"]);
  assert.equal(new Set(casos.map((c) => c.pergunta)).size, 1, "a pergunta é a mesma nos dois");
  for (const c of casos) for (const m of c.material) assert.ok(existsSync(new URL(`dados/${m}`, projeto)), `${c.id}: falta dados/${m}`);
  const [curta, longa] = casos.map((c) => palavras(texto(c)));
  assert.ok(longa >= 40 * curta, `a longa lê ao menos 40 vezes a curta: ${curta} e ${longa} palavras`);
});

test("o regulamento é o do pausa-e-fluxo, byte a byte, e diz que é inventado", () => {
  const nomes = readdirSync(origem).sort();
  assert.deepEqual(readdirSync(new URL("dados/", projeto)).sort(), nomes);
  for (const n of nomes) assert.ok(readFileSync(new URL(`dados/${n}`, projeto)).equals(readFileSync(new URL(n, origem))), `dados/${n} difere do pausa-e-fluxo`);
  assert.match(texto(casos[1]), /\(condomínio inventado\)/);
});

import { ANOTACOES, baloes, CACHES, duracao, FPS, montarKv, palavraEm } from "../src/components/livro/kv/kv.ts";

const kv = montarKv(JSON.parse(readFileSync(new URL("../rascunhos/kv-cache/figuras/kv.json", import.meta.url), "utf8")));

for (const [nome, f] of [["dos quatro caches", CACHES], ["da atendente", ANOTACOES]]) {
  test(`a figura ${nome}: seis cenas em até 45 s, um balão curto por cena, sem número nem nome técnico`, () => {
    assert.equal(f.cenas.length, 6);
    assert.ok(duracao(f) / FPS <= 45);
    f.cenas.forEach((c, i) => { if (i) assert.ok(c.de > f.cenas[i - 1].de); });
    const bs = baloes(f);
    assert.equal(bs.length, f.cenas.length, "um balão por cena");
    bs.forEach((b, i) => { if (i) assert.equal(b.de, bs[i - 1].ate); });
    assert.ok(bs.at(-1).ate >= f.segundos, "o último balão fica até o fim");
    assert.equal(f.resumos.length, f.cenas.length - 1, "um resumo por cena, menos a última");
    for (const s of [...bs.map((b) => b.texto), ...f.resumos, ...(f.fecho ? [f.fecho] : [])]) {
      assert.ok(s.split(/\s+/).length <= 14, `curto demais para ler de uma vez? "${s}"`);
      assert.doesNotMatch(s, /\d/, `sem número: "${s}"`);
      assert.doesNotMatch(s, /token|prefill|decode/i, `a figura fala em ler, escrever e anotar: "${s}"`);
    }
  });
}

test("a figura da atendente fecha sem pergunta, e as palavras e o trecho são os do corpus", () => {
  assert.doesNotMatch(ANOTACOES.fecho + ANOTACOES.textos.at(-1), /\?/, "a aposta fica no palpite antes da figura");
  assert.deepEqual(kv.mensagens.map((m) => m.palavras), casos.map((c) => palavras(texto(c))));
  assert.ok(texto(casos[1]).includes(kv.trecho), "o trecho é do regulamento");
  assert.equal(kv.pergunta, casos[0].pergunta);
  for (const k of [1, 2]) assert.ok(palavraEm(ANOTACOES.cenas[k].de, kv.resposta.length - 1) < ANOTACOES.cenas[k + 1].de, "as palavras saem dentro da cena");
  assert.match(kv.sobre, /ilustração/);
});

test("as figuras só aparecem no astro dev: o build não gera a página de rascunho", () => {
  assert.ok(existsSync(new URL("../dist/experimentos/index.html", import.meta.url)), "rode depois de astro build");
  assert.ok(!existsSync(new URL("../dist/rascunhos/", import.meta.url)));
});
