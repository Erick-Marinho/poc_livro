/** As ações do leitor dos capítulos 1 e 2 (Aposta, Pilhas, Troca): os dados vêm do referencia.jsonl, e a ilustração diz que é. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { casos, DECISOES } from "../src/lib/referencia.ts";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const html = ler("dist/ciclo-de-vida/01-o-problema-e-o-contrato/index.html").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const referencia = ler("livros/ciclo-de-vida/projeto/referencia.jsonl");
const caso = (id) => casos(referencia, [id], "teste")[0];

test("a aposta mostra três mensagens de verdade e diz que o agente é ilustração", () => {
  assert.equal([...html.matchAll(/class="apo-msg"/g)].length, 3);
  for (const id of ["R12", "R11", "R02"]) assert.ok(html.includes(caso(id).pergunta), id);
  assert.match(html, /Ilustração: o agente apressado não existe/);
});

test("as pilhas separam como o contrato, que vem do referencia.jsonl", () => {
  const cartas = [...html.matchAll(/class="pil-carta" data-decisao="(\w+)"/g)].map((m) => m[1]);
  assert.deepEqual(cartas, ["R03", "R06", "R07", "R10", "R15", "R16"].map((id) => caso(id).decisao));
  assert.equal(new Set(cartas).size, 4, "as quatro decisões aparecem");
});

test("a troca tem uma variante que o contrato pega, e o veredito sai da comparação", () => {
  assert.equal([...html.matchAll(/class="tro-ok"/g)].length, 2);
  assert.equal([...html.matchAll(/class="tro-nao"/g)].length, 1);
  assert.ok(html.includes(caso("R11").motivo));
});

test("caso que não existe não monta", () => {
  assert.throws(() => casos(referencia, ["R99"], "Pilhas"), /Pilhas: o caso R99 não está no referencia.jsonl/);
});

test("capítulo 2: as pilhas de quem faz cada passo saem do grafo-02.json, e a recusa é do modelo", () => {
  const h2 = ler("dist/ciclo-de-vida/02-o-primeiro-agente/index.html");
  const nos = JSON.parse(ler("livros/ciclo-de-vida/figuras/grafo-02.json")).nos;
  const cartas = [...h2.matchAll(/class="pil-carta" data-decisao="(\w+)"[^>]*>\s*<q>([^<]+)<\/q>/g)].map((m) => [m[2], m[1]]);
  const esperado = Object.values(nos).filter((n) => n.tarefa).map((n) => [n.tarefa, n.modelo === "não" ? "codigo" : "modelo"]);
  assert.deepEqual(cartas.toSorted(), esperado.toSorted());
  assert.deepEqual(Object.fromEntries(cartas)["Escrever a recusa"], "modelo");
  assert.equal([...h2.matchAll(/class="pil-grupo"/g)].length, 2);
});

test("capítulo 1: os pare e pense da ferramenta e dos nomes das pilhas falam de dado que existe", () => {
  const pedidos = ler("livros/ciclo-de-vida/projeto/dados/pedidos.json");
  assert.match(html, /consulta o pedido BT-1003/); assert.ok(pedidos.includes('"BT-1003"'), "o BT-1003 não está nos pedidos da loja");
  const resposta = html.match(/separou as mensagens em pilhas sem nome[\s\S]*?<div class="r">([\s\S]*?)<\/div>/)?.[1] ?? "";
  for (const { nome } of Object.values(DECISOES)) assert.ok(resposta.includes(nome), `a resposta não nomeia "${nome}"`);
});

/* ajustes da introdução (etapa 4): o pare e pense com os ícones do Lucide, no lugar do losango de texto */
test("todo pare e pense tem a lâmpada no rótulo e o olho no \"Ver a resposta\", e nenhum losango", async () => {
  const { parse } = await import("node-html-parser");
  for (const p of ["00-introducao", "01-o-problema-e-o-contrato", "02-o-primeiro-agente"]) {
    const caixas = parse(ler(`dist/ciclo-de-vida/${p}/index.html`)).querySelectorAll(".pense");
    assert.ok(caixas.length, `${p}: sem pare e pense`);
    for (const c of caixas) {
      assert.ok(c.querySelector(":scope > b svg.lucide-lightbulb"), `${p}: o rótulo sem a lâmpada`);
      assert.ok(c.querySelector("summary svg.lucide-eye"), `${p}: o "Ver a resposta" sem o olho`);
      assert.equal(c.querySelector("svg").getAttribute("aria-hidden"), "true", `${p}: o ícone é lido pelo leitor de tela`);
      assert.doesNotMatch(c.querySelector(":scope > b").text, /◆/, `${p}: o losango de texto ficou`);
    }
  }
});
