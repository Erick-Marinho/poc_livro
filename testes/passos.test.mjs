/** Seção 1.6 em passos de construção: começo e fim à vista, sem a IDE no meio, e as saídas do projeto real. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const html = ler("dist/ciclo-de-vida/01-o-problema-e-o-contrato/index.html");
const saidas = JSON.parse(ler("livros/ciclo-de-vida/saidas.json"));
const secao = html.slice(html.indexOf('id="s1-6"'), html.indexOf('id="s1-7"'));
const MARCA = /data-passo data-passo-id="[^"]+" aria-label="/;
const passos = secao.split(MARCA).slice(1);

test("a 1.6 tem os seis primeiros passos, cada um com o fim do passo e o 'agora você tem'", () => {
  assert.equal(passos.length, 6);
  passos.forEach((p, i) => {
    assert.ok(p.startsWith(`Passo ${i + 1} de 14`), p.slice(0, 40));
    assert.match(p, /no fim deste passo:/);
    assert.match(p, /agora você tem:/);
  });
});

test("a IDE completa saiu da 1.6, e o passador entrou dentro do passo 2", () => {
  assert.doesNotMatch(secao, /class="ide-figura"/);
  assert.equal([...secao.matchAll(/data-passador="true" class="passador/g)].length, 1);
  assert.match(passos[1], /data-passador="true" class="passador embutido"/);
});

test("os comandos dos passos mostram as saídas gravadas do projeto real", () => {
  for (const id of ["r01-decisao-talvez", "r01-caso-id-torto", "r01-tres-casos", "r01-caso-sem-pedido-passa", "r01-caso-sem-pedido-barrado"]) {
    const ultima = saidas[id].saida.at(-1)[0].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;");
    assert.ok(secao.includes(ultima) || secao.includes(saidas[id].saida.at(-1)[0]), `${id}: ${ultima}`);
  }
});

test("o passo 1 pede a aposta antes de mostrar o erro do 'talvez'", () => {
  assert.match(passos[0], /aposte antes de rodar:<\/b> E se alguém escrever &quot;talvez&quot; como decisão\?/);
  assert.match(passos[0], /class="ps-saida" hidden/);
});

const trecho = (de, ate) => html.slice(html.indexOf(`id="${de}"`), ate ? html.indexOf(`id="${ate}"`) : undefined);
const contar = (t) => [...t.matchAll(/data-passo-id="[^"]+" aria-label="Passo (\d+) de (\d+)/g)].map((m) => `${m[1]}/${m[2]}`);

test("a 1.7 tem seis passos e a 1.8 tem dois, e o capítulo não tem mais a IDE no meio do texto", () => {
  assert.deepEqual(contar(trecho("s1-7", "s1-8")), ["7/14", "8/14", "9/14", "10/14", "11/14", "12/14"]);
  assert.deepEqual(contar(trecho("s1-8")), ["13/14", "14/14"]);
  assert.doesNotMatch(html, /class="ide-figura"/);
});

test("o R12 fica à vista no passo das vinte perguntas, mesmo com o resto do arquivo dobrado", () => {
  const p = trecho("s1-7", "s1-8").split(MARCA)[1];
  assert.match(p, /<span class="line novo depois-da-dobra" data-n="12">/);
  assert.match(p, /<span class="line novo dobrada" data-n="7">/);
});

test("o passo da nota zero avisa o placar quando o leitor aposta", () => {
  assert.match(trecho("s1-8"), /data-id="r01-nota-zero"/);
  assert.match(html, /fontmar:apostou/);
});

test("a trilha leva aos 14 passos, e o sinal de cada um sai da saída gravada", () => {
  const trilha = html.slice(html.indexOf("data-trilha"), html.indexOf("</figure>", html.indexOf("data-trilha")));
  const itens = [...trilha.matchAll(/data-ir-passo="([^"]+)"[^>]*>.*?class="tr-sinal (\w+)"/g)].map((m) => `${m[1]}:${m[2]}`);
  assert.deepEqual(itens, ["decisoes:erro", "caso:erro", "ler-arquivo:nada", "tres-perguntas:ok", "caso-apressado:engano", "contrato-se-protege:erro",
    "vinte-perguntas:engano", "le-a-loja:ok", "o-que-os-testes-leem:nada", "testes-de-formato:engano", "regras-da-politica:erro", "r12-corrigido:ok",
    "agente-mais-simples:ok", "a-regua:ok"]);
  for (const m of trilha.matchAll(/href="#passo-([^"]+)"/g)) assert.match(html, new RegExp(`id="passo-${m[1]}"`));
});

test("cada passo abre o projeto inteiro até ali, com os arquivos daquele momento", () => {
  const p6 = passos[5];
  assert.match(p6, /ver o projeto inteiro até aqui/);
  assert.match(p6, /<template data-projeto>/);
  assert.match(p6, /model_validator/);   // no fim do passo 6, o contrato já tem a regra
  assert.doesNotMatch(passos[0].slice(passos[0].indexOf("<template data-projeto>")), /test_referencia\.py/);   // no passo 1 ainda não há testes
});

test("o caminho do erro dobra o que passa por fora do código do leitor, e deixa à vista o contrato.py e a mensagem", () => {
  const i = html.indexOf('data-id="r01-caso-sem-pedido-barrado"');
  const pre = html.slice(html.indexOf('<pre class="ps-saida"', i), html.indexOf("</pre>", i));
  const visivel = pre.replace(/<span class="ps-dobrado">[\s\S]*?<\/span><\/span>/g, "");
  assert.match(visivel, /contrato\.py&quot;, line 54/);
  assert.match(visivel, /ValueError: referencia\.jsonl, linha 4/);
  assert.doesNotMatch(visivel, /site-packages\/pydantic\/main\.py/);
  assert.match(pre, /site-packages\/pydantic\/main\.py/);   // dobrado, mas não some
});

test("linha em branco nova não acende", () => {
  for (const m of html.matchAll(/<span class="line novo[^"]*" data-n="\d+">(.*?)<\/span>(?=<span class="line|<\/code>)/g))
    assert.ok(m[1].replace(/<[^>]+>/g, "").trim(), m[0].slice(0, 80));
});
