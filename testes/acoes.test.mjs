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
  const apressado = html.split("data-aposta").slice(1).find((b) => b.includes("agente apressado"));
  assert.equal([...apressado.matchAll(/class="apo-msg"/g)].length, 3);
  for (const id of ["R12", "R11", "R02"]) assert.ok(html.includes(caso(id).pergunta), id);
  assert.match(html, /Ilustração: o agente apressado não existe/);
});

test("as pilhas separam como o contrato, que vem do referencia.jsonl", () => {
  const cartas = [...html.matchAll(/class="pil-carta" data-decisao="(\w+)"/g)].map((m) => m[1]);
  assert.deepEqual(cartas, ["R03", "R06", "R07", "R10", "R15", "R16"].map((id) => caso(id).decisao));
  assert.equal(new Set(cartas).size, 4, "as quatro decisões aparecem");
});

test("as pilhas do 1.3 dão o critério: o exemplo já vem na pilha A, travado, e a pergunta separa pelo que se faz", () => {
  const pil = html.split("data-pilhas")[1];
  const primeira = pil.split('class="pil-carta"')[1];
  assert.match(primeira, /data-p="A" aria-pressed="true" disabled/);
  assert.match(primeira, /class="pil-exemplo"/);
  assert.equal([...pil.matchAll(/class="pil-exemplo"/g)].length, 1, "só a primeira carta é exemplo");
  assert.match(pil, /pelo que você faria com cada uma, e não pelo assunto/);
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

test("capítulo 1: a aposta da escala tem um item em cada ponto, e o roteador é o agente do capítulo 2, de quatro decisões", () => {
  const escala = JSON.parse(ler("livros/ciclo-de-vida/figuras/escala.json"));
  const pontos = escala.mensagens[0].opcoes;
  assert.deepEqual(escala.mensagens.map((m) => m.opcoes[m.fez]), pontos);
  const roteador = escala.mensagens.find((m) => m.opcoes[m.fez] === "roteador");
  assert.match(roteador.texto, new RegExp(["uma", "duas", "três", "quatro", "cinco"][Object.keys(DECISOES).length - 1] + " decisões"));
  assert.match(roteador.porque, /capítulo 2/);
  for (const m of escala.mensagens) assert.ok(html.includes(m.texto), m.texto);
});

test("capítulo 2: o agente do desenho fica no roteador da escala do capítulo 1", () => {
  const h2 = ler("dist/ciclo-de-vida/02-o-primeiro-agente/index.html");
  assert.match(h2, /Na escala do capítulo 1/);
  assert.match(h2, /No roteador\./);
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

test("capítulo 1: a aposta das camadas usa o R12 como aconteceu na gravação do capítulo 2, e cada camada aponta um capítulo do sumário", () => {
  const camadas = JSON.parse(ler("livros/ciclo-de-vida/figuras/camadas.json"));
  const saidas = JSON.parse(ler("livros/ciclo-de-vida/saidas.json"));
  const linhas = saidas["r02-medir"].saida.map(([l]) => l);
  assert.ok(linhas.some((l) => /R12: o contrato pede recusar, o agente decidiu passar/.test(l)), "o R12 não está gravado como passar contra recusar");
  const r12 = camadas.mensagens.find((m) => m.texto.includes("R12"));
  assert.equal(r12.opcoes[r12.fez], "comportamento");
  assert.equal(caso("R12").decisao, "recusar");
  const sumario = JSON.parse(ler("livros/ciclo-de-vida/sumario.json")).capitulos.map((c) => c.numero);
  for (const m of camadas.mensagens) for (const [, n] of m.porque.matchAll(/capítulo (\d)/g)) assert.ok(sumario.includes(+n), `capítulo ${n} fora do sumário`);
  assert.deepEqual(camadas.mensagens.map((m) => m.opcoes[m.fez]).toSorted(), ["comportamento", "execução", "ferramenta", "formato"]);
  for (const m of camadas.mensagens) assert.ok(html.includes(m.texto.replace(/"/g, "&quot;")) || html.includes(m.texto), m.texto);
});

test("capítulo 2: o molde garantiu a forma das 20 e não a decisão; os números são os da gravação", () => {
  const saidas = JSON.parse(ler("livros/ciclo-de-vida/saidas.json"));
  const linhas = saidas["r02-medir"].saida.map(([l]) => l);
  const [, certas, total] = linhas.find((l) => /nota do agente: \d+ de \d+/.test(l)).match(/nota do agente: (\d+) de (\d+)/).map(Number);
  const erros = linhas.filter((l) => /R\d\d: o contrato pede \w+, o agente decidiu (\w+)/.test(l));
  assert.equal(total, 20); assert.equal(total - certas, erros.length);
  for (const l of erros) assert.ok(Object.keys(DECISOES).includes(l.match(/decidiu (\w+)/)[1]), `decisão fora do molde: ${l}`);
  const h2 = ler("dist/ciclo-de-vida/02-o-primeiro-agente/index.html");
  assert.match(h2, new RegExp(`nenhuma das ${total} respostas|recusou nenhuma das ${total} respostas`));
  assert.match(h2, new RegExp(`${total - certas} estavam erradas`));
});
