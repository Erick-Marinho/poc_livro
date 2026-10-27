/** Fluxo ou agente, no 1.1 (docs/capacidades/fluxo-ou-agente.md): o grafo em cenas. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { baloes, CENAS, DURACAO, FPS, montarFluxo, SEGUNDOS } from "../src/components/livro/grafo/fluxo.ts";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(ler(p));
const dados = json("livros/ciclo-de-vida/figuras/fluxo-ou-agente.json");
const tresJeitos = json("livros/ciclo-de-vida/figuras/tres-jeitos.json");
const ferramentas = [...new Set(ler("livros/ciclo-de-vida/figuras/laco.json").match(/consultar_\w+|buscar_\w+/g))];

test("as mensagens e as ferramentas são as das histórias do 1.1, e o modelo entra no fluxo sem mudar as setas", () => {
  const f = montarFluxo(dados, tresJeitos, ferramentas);
  assert.deepEqual(f.ferramentas, ["consultar_pedido", "buscar_produto"]);
  assert.ok(f.fluxo.includes("consultar_pedido"));
  const outra = structuredClone(dados); outra.mensagens.produto = "Vocês vendem bicicleta?";
  assert.throws(() => montarFluxo(outra, tresJeitos, ferramentas), /não é uma das histórias/);
  const inventada = structuredClone(dados); inventada.ferramentas[1] = "consultar_estoque";
  assert.throws(() => montarFluxo(inventada, tresJeitos, ferramentas), /não é das histórias/);
});

test("seis cenas, dentro do limite, com um balão por cena e o teste no fim: quem escolhe a próxima seta", () => {
  assert.ok(CENAS.length <= 6 && DURACAO / FPS <= 45);
  const bs = baloes(montarFluxo(dados, tresJeitos, ferramentas));
  assert.equal(bs.length, CENAS.length);
  bs.forEach((b, i) => { if (i) assert.equal(b.de, bs[i - 1].ate); });
  assert.ok(bs.at(-1).ate >= SEGUNDOS);
  assert.match(bs[1].texto, /continua sendo fluxo/);
  assert.match(bs[2].texto, /um modelo em cada caixa: ainda é fluxo/);
  assert.match(bs.at(-1).texto, /quem escolhe a próxima seta/);
});

test("no 1.1, o grafo vem logo depois da definição e antes da escala, e a página o traz", () => {
  const cap = ler("livros/ciclo-de-vida/capitulos/01-o-problema-e-o-contrato.mdx");
  const secao = cap.slice(cap.indexOf("## 1.1"), cap.indexOf("## 1.2"));
  const def = secao.indexOf('<Nota titulo="a definição deste livro">'), grafo = secao.indexOf("<FluxoOuAgente"), escala = secao.indexOf("<QuemDecide");
  assert.ok(def < grafo && grafo < escala, "a ordem é: a definição, o grafo, a escala");
  assert.match(secao, /um modelo de linguagem dentro de um fluxo já faz dele um agente\. Não faz\./);
  assert.match(ler("dist/ciclo-de-vida/01-o-problema-e-o-contrato/index.html"), /data-fluxo-ou-agente/);
});
