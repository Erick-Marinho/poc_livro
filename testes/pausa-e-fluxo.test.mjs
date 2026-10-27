/** O corpus do experimento da pausa e do fluxo (docs/capacidades/experimento-pausa-e-fluxo.md), congelado antes de medir. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { baloes, CENAS, DURACAO, FPS, montarPausa, pedacoEm, PERGUNTA, RESUMOS, SEGUNDOS } from "../src/components/livro/pausa/pausa.ts";

const projeto = new URL("../experimentos/pausa-e-fluxo/projeto/", import.meta.url);
const casos = readFileSync(new URL("casos.jsonl", projeto), "utf8").trim().split("\n").map((l) => JSON.parse(l));
/* o que o modelo lê: o material da loja, nesta ordem, e a pergunta no fim */
const texto = (c) => [...c.material.map((m) => readFileSync(new URL(`dados/${m}`, projeto), "utf8")), `Pergunta: ${c.pergunta}`].join("\n\n");
const palavras = (s) => s.split(/\s+/).filter(Boolean).length;

test("três casos, a mesma pergunta: só muda quanto o modelo tem de ler antes de responder", () => {
  assert.deepEqual(casos.map((c) => c.id), ["curta", "media", "longa"]);
  assert.equal(new Set(casos.map((c) => c.pergunta)).size, 1, "a pergunta é a mesma nos três");
  for (const c of casos) for (const m of c.material) assert.ok(existsSync(new URL(`dados/${m}`, projeto)), `${c.id}: falta dados/${m}`);
  const [curta, media, longa] = casos.map((c) => palavras(texto(c)));
  assert.ok(media >= 4 * curta && longa >= 4 * media, `cada caso lê ao menos 4 vezes o anterior: ${curta}, ${media}, ${longa} palavras`);
});

test("nenhum caso começa como outro, para o cache não encurtar a pausa medida", () => {
  const inicios = casos.map((c) => texto(c).slice(0, 40));
  assert.equal(new Set(inicios).size, casos.length, `começos repetidos: ${JSON.stringify(inicios)}`);
});

test("a figura: seis cenas em até 45 s, um balão curto por cena, sem adiantar o resultado nem o cache", () => {
  const pausa = montarPausa(JSON.parse(readFileSync(new URL("../experimentos/pausa-e-fluxo/figuras/pausa.json", import.meta.url), "utf8")));
  assert.equal(CENAS.length, 6);
  assert.ok(DURACAO / FPS <= 45);
  CENAS.forEach((c, i) => { if (i) assert.ok(c.de > CENAS[i - 1].de); });
  const bs = baloes();
  assert.equal(bs.length, CENAS.length, "um balão por cena");
  bs.forEach((b, i) => { if (i) assert.equal(b.de, bs[i - 1].ate); });
  assert.ok(bs.at(-1).ate >= SEGUNDOS, "o último balão fica até o fim");
  const textos = [...bs.map((b) => b.texto), ...RESUMOS, PERGUNTA];
  for (const s of textos) {
    assert.ok(s.split(/\s+/).length <= 14, `curto demais para ler de uma vez? "${s}"`);
    assert.doesNotMatch(s, /\d/, `sem número da coleta: "${s}"`);
    assert.doesNotMatch(s, /token|prefill|decode|cache/i, `a figura fala em ler, escrever, pausa e fluxo: "${s}"`);
  }
  assert.equal(RESUMOS.length, CENAS.length - 1, "um resumo por cena, menos a última");
  assert.deepEqual(pausa.mensagens.map((m) => m.palavras), casos.map((c) => palavras(texto(c))), "as palavras de cada mensagem são as do corpus");
  for (let i = 1; i < pausa.resposta.length; i++) assert.ok(pedacoEm(i) - pedacoEm(i - 1) > 0 && pedacoEm(i) < CENAS[3].de, "os pedaços saem na cena de escrever");
  assert.match(pausa.sobre, /ilustração/);
});

test("a figura está na página, em \"O que vamos construir\", antes da IDE", () => {
  const mdx = readFileSync(new URL("../experimentos/pausa-e-fluxo/experimento.mdx", import.meta.url), "utf8");
  const construir = mdx.indexOf("## O que vamos construir"), figura = mdx.indexOf("<PausaEFluxo"), ide = mdx.indexOf("<IdeCapitulo");
  assert.ok(construir >= 0 && construir < figura && figura < ide);
  const html = readFileSync(new URL("../dist/experimentos/pausa-e-fluxo/index.html", import.meta.url), "utf8");
  assert.match(html, /data-pausa-e-fluxo/);
  assert.match(html, /data-nivel="novato"/);
});
