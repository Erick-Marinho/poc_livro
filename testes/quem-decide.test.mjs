/** Quem decide, num controle deslizante, no 1.1 (docs/capacidades/capitulo-1-dinamicas.md, etapa 3). */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { montarEscala } from "../src/components/livro/escala/escala.ts";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(ler(p));
const dados = json("livros/ciclo-de-vida/figuras/quem-decide.json");
const aposta = json("livros/ciclo-de-vida/figuras/escala.json");
const pedidos = json("livros/ciclo-de-vida/projeto/dados/pedidos.json");

test("os quatro pontos têm os nomes da Aposta, e o modelo decide mais a cada ponto", () => {
  const e = montarEscala(dados, aposta, pedidos);
  assert.deepEqual(e.pontos.map((p) => p.nome), aposta.mensagens[0].opcoes);
  assert.deepEqual(e.pontos.map((p) => p.decide), [0, 1, 2, 3]);
});

test("os dados do pedido vêm da loja, e não do texto da figura", () => {
  const e = montarEscala(dados, aposta, pedidos);
  const texto = JSON.stringify(e.pontos);
  assert.match(texto, /enviado, pela Transportadora Asa Leve/);
  assert.match(texto, /14\/11/);
  assert.doesNotMatch(texto, /\{\w+\}/);
  const outra = pedidos.map((p) => (p.id === "BT-1003" ? { ...p, previsao_entrega: "2026-11-20" } : p));
  assert.match(JSON.stringify(montarEscala(dados, aposta, outra).pontos), /20\/11/);
});

test("ponto com outro nome, pedido que não existe ou dado inventado não montam", () => {
  const renomeado = structuredClone(dados); renomeado.pontos[1].nome = "classificador";
  assert.throws(() => montarEscala(renomeado, aposta, pedidos), /não são os da Aposta/);
  assert.throws(() => montarEscala({ ...dados, pedido: "BT-9999" }, aposta, pedidos), /não está no pedidos.json/);
  const inventado = structuredClone(dados); inventado.pontos[0].passos[0].texto = "{rastreio_falso}";
  assert.throws(() => montarEscala(inventado, aposta, pedidos), /não é um dado do pedido/);
});

test("no 1.1, a figura toma o lugar do parágrafo da escala, antes da Aposta, e diz que é ilustração", () => {
  const cap = ler("livros/ciclo-de-vida/capitulos/01-o-problema-e-o-contrato.mdx");
  const secao = cap.slice(cap.indexOf("## 1.1"), cap.indexOf("## 1.2"));
  assert.ok(secao.indexOf("<QuemDecide") < secao.indexOf("<Aposta dados={escala}"));
  assert.match(secao, /<QuemDecide [^>]*ilustracao="Ilustração:/);
  assert.doesNotMatch(secao, /Um passo adiante, o \*\*roteador\*\*/);
});

test("a torre: um andar por ponto, do térreo ao topo, cada um com uma frase curta, e a página traz os quatro andares", () => {
  const e = montarEscala(dados, aposta, pedidos);
  assert.deepEqual(e.pontos.map((p) => p.resumo), ["o código decide tudo", "o modelo decide uma vez", "o modelo decide a cada passo", "vários modelos dividem o trabalho"]);
  const longo = structuredClone(dados); longo.pontos[0].resumo = "o código decide absolutamente tudo o tempo todo";
  assert.throws(() => montarEscala(longo, aposta, pedidos), /resumo de até seis palavras/);
  const pagina = readFileSync(new URL("../dist/ciclo-de-vida/01-o-problema-e-o-contrato/index.html", import.meta.url), "utf8");
  assert.equal([...pagina.matchAll(/class="qd-andar"/g)].length, 4);
  assert.ok(pagina.indexOf("vários agentes</span>") < pagina.indexOf("fluxo fixo</span>"), "o topo vem primeiro");
  assert.match(ler("livros/ciclo-de-vida/capitulos/01-o-problema-e-o-contrato.mdx"), /Pense numa torre/);
});
