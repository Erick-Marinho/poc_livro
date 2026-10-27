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

test("o primeiro dia do 1.3: o que a colega faz é a decisão do contrato, e as quatro aparecem", () => {
  const ids = [...html.matchAll(/<li data-caso="(R\d+)" data-decisao="(\w+)"[^>]*>\s*<p class="pd-msg">/g)];
  assert.deepEqual(ids.map((m) => m[1]), ["R03", "R06", "R07", "R10", "R15", "R17"]);
  for (const [, id, decisao] of ids) assert.equal(decisao, caso(id).decisao, id);
  assert.equal(new Set(ids.map((m) => m[2])).size, 4, "as quatro decisões aparecem");
});

test("o primeiro dia do 1.3 fala como quem atende: escolhas em frases, sem o nome do contrato, e a primeira já mostrada", () => {
  const pd = html.split("data-primeiro-dia")[1].split("</ol>")[0];
  const itens = pd.split("<li ").slice(1);
  for (const li of itens) {
    const botoes = [...li.matchAll(/<button type="button" data-v="(\w+)"[^>]*>([^<]+)<\/button>/g)];
    assert.deepEqual(botoes.map((m) => m[1]), Object.keys(DECISOES), "uma escolha por decisão");
    for (const [, , texto] of botoes) assert.ok(!Object.values(DECISOES).some(({ nome }) => texto === nome), `"${texto}" é o nome do contrato`);
    assert.match(li, /<b>A colega:<\/b>/);
  }
  assert.match(itens[0], /class="[^"]*pd-exemplo/);
  assert.doesNotMatch(itens[0], /pd-resposta" hidden/, "a resposta do exemplo já aparece");
  assert.equal(itens.filter((li) => /pd-resposta" hidden/.test(li)).length, 5, "as outras esperam o leitor");
});

test("você é o gabarito: três tentativas, uma que o gabarito pega, o veredito pela comparação, e o primeiro bilhete é o da colega", () => {
  assert.equal([...html.matchAll(/class="tro-fez tro-ok"/g)].length, 2);
  assert.equal([...html.matchAll(/class="tro-fez tro-nao"/g)].length, 1);
  assert.equal([...html.matchAll(/class="tro-cartao"/g)].length, 3);
  assert.ok(html.includes(caso("R11").motivo));
  const cap1 = ler("livros/ciclo-de-vida/capitulos/01-o-problema-e-o-contrato.mdx");
  const palavras = (t) => t.toLowerCase().replace(/[.;:,]/g, "").replace(/\s+/g, " ").trim();
  const daColega = cap1.match(/A primeira é um bilhete explicando o trabalho: "([^"]+)"/)[1];
  assert.equal(palavras(JSON.parse(ler("livros/ciclo-de-vida/figuras/troca-de-prompt.json")).variantes[0].bilhete), palavras(daColega));
});

test("caso que não existe não monta", () => {
  assert.throws(() => casos(referencia, ["R99"], "Pilhas"), /Pilhas: o caso R99 não está no referencia.jsonl/);
});

test("capítulo 1: os pare e pense da data do pedido e dos nomes das pilhas falam de dado que existe", () => {
  const pedidos = ler("livros/ciclo-de-vida/projeto/dados/pedidos.json");
  assert.match(html, /acertar a data do BT-1003/); assert.ok(pedidos.includes('"BT-1003"'), "o BT-1003 não está nos pedidos da loja");
  const resposta = html.match(/escolheu entre quatro coisas para fazer com cada mensagem[\s\S]*?<div class="r">([\s\S]*?)<\/div>/)?.[1] ?? "";
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

/* o lugar do agente do capítulo 2 na escala fica no capítulo 1: o 2.1 começa pelo desenho (docs/capacidades/grafos-no-capitulo-2.md) */
test("capítulo 2: o agente do desenho fica no roteador da escala, dito no capítulo 1", () => {
  const h1 = ler("dist/ciclo-de-vida/01-o-problema-e-o-contrato/index.html");
  assert.match(h1, /No capítulo 2 ele é um roteador/);
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

test("a aposta das camadas, guardada fora do 1.4 até os capítulos 3 e 5: usa o R12 como aconteceu na gravação do capítulo 2, e cada camada aponta um capítulo do sumário", () => {
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
  assert.ok(!html.includes("Que camada do contrato pega cada uma?"), "a aposta das camadas saiu do 1.4 (achados-da-leitura-do-victor.md, etapa 2)");
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
