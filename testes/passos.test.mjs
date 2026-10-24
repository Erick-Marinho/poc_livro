/** Seção 1.6 em passos de construção: começo e fim à vista, sem a IDE no meio, e as saídas do projeto real. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const html = ler("dist/ciclo-de-vida/01-o-problema-e-o-contrato/index.html");
const saidas = JSON.parse(ler("livros/ciclo-de-vida/saidas.json"));
const secao = html.slice(html.indexOf('id="s1-6"'), html.indexOf('id="s1-7"'));
const passos = secao.split('data-passo aria-label="').slice(1);

test("a 1.6 tem seis passos, cada um com o fim do passo e o 'agora você tem'", () => {
  assert.equal(passos.length, 6);
  passos.forEach((p, i) => {
    assert.ok(p.startsWith(`Passo ${i + 1} de 6`), p.slice(0, 40));
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
