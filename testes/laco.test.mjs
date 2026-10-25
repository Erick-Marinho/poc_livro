/** A figura 1.1 (docs/capacidades/laco-do-agente.md): o leitor faz o papel de cada jeito de usar um modelo, em três
 *  rodadas. As mensagens, os resultados e as respostas são os de tres-jeitos.json; as previsões e o caminho do agente
 *  batem com eles. E a base das animações cena a cena, que o mapa da introdução usa. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse } from "node-html-parser";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(ler(p));
const Q = await import("../src/components/livro/laco/quemDecide.ts");
const laco = json("livros/ciclo-de-vida/figuras/laco.json");
const tresJeitos = json("livros/ciclo-de-vida/figuras/tres-jeitos.json");
const clientes = json("livros/ciclo-de-vida/projeto/dados/clientes.json");
const r = Q.montarRodadas({ laco, tresJeitos, clientes });
const passos = (j, p) => tresJeitos.modos.find((m) => m.id === j).passos[p];
const ultima = (j, p) => passos(j, p)[passos(j, p).length - 1];

test("1. só o modelo: a Carla pergunta do BT-1003, e a resposta é a dos três jeitos, inventada; a previsão certa diz isso", () => {
  assert.equal(r.modelo.cliente, "Carla Mendes");
  assert.equal(r.modelo.mensagem, passos("modelo", "pedido")[0].texto);
  assert.deepEqual([r.modelo.resposta.texto, r.modelo.resposta.certo], [ultima("modelo", "pedido").texto, false]);
  assert.match(r.modelo.prever.opcoes[r.modelo.prever.certa], /cara de certa/);
});

test("2. fluxo fixo: o roteiro vai até o fim com o pedido e para no passo 1 com a frigideira, como nos três jeitos", () => {
  assert.equal(r.fluxo.pedido.passos.length, r.fluxo.roteiro.length);
  assert.ok(r.fluxo.pedido.resposta.certo && !r.fluxo.produto.resposta.certo);
  assert.equal(r.fluxo.produto.passos.length, 1);
  assert.deepEqual(r.fluxo.pedido.passos.map((p) => p.resultado), ["BT-1003", "previsão 14/11", ""], "o que voltou de cada passo");
  assert.equal(r.fluxo.produto.passos[0].resultado, "não acha");
  assert.match(r.fluxo.prever.opcoes[r.fluxo.prever.certa], /passo 1/);
  const errada = structuredClone(laco);
  errada.fluxo.prever.passo = 2;
  assert.throws(() => Q.montarRodadas({ laco: errada, tresJeitos, clientes }), /para no passo 1/);
});

test("3. agente: buscar no catálogo devolve o que a ferramenta dos três jeitos devolve; responder depois acerta, antes erra como o modelo sozinho", () => {
  const busca = r.agente.acoes.find((a) => a.id === "buscar_produto");
  assert.equal(busca.resultado, passos("agente", "produto").find((p) => p.quem === "ferramenta").texto.split(" → ")[1]);
  let t = Q.agir(r.agente, Q.inicio(), "responder");
  assert.deepEqual([t.resposta.texto, t.resposta.certo], [ultima("modelo", "produto").texto, false], "responder sem olhar é o que o modelo sozinho faz");
  t = Q.agir(r.agente, Q.agir(r.agente, Q.agir(r.agente, Q.inicio(), "consultar_pedido"), "buscar_produto"), "responder");
  assert.equal(t.passos.length, 2, "o laço com um desvio: consultar o pedido, depois buscar no catálogo");
  assert.deepEqual([t.resposta.texto, t.resposta.certo], [ultima("agente", "produto").texto, true]);
  assert.equal(Q.agir(r.agente, t, "buscar_produto"), t, "depois de responder, nada muda");
});

test("o fim diz quem decide em cada jeito, e o que cada um acertou, nos três jeitos", () => {
  assert.deepEqual(r.fim.map((f) => [f.nome, f.acertos]), [["só o modelo", [false, false]], ["fluxo fixo", [true, false]], ["agente", [true, true]]]);
});

test("o 1.1 tem a figura em que o leitor decide, no lugar dos três jeitos e do Pendente, com a figura em texto aberta sem JS", () => {
  const pagina = parse(ler("dist/ciclo-de-vida/01-o-problema-e-o-contrato/index.html"));
  const fig = pagina.querySelector("figure[data-laco]");
  assert.ok(fig, "a figura não está no 1.1");
  assert.ok(fig.querySelectorAll("astro-island").some((i) => (i.getAttribute("component-url") ?? "").includes("QuemDecide")), "a figura não tem a ilha");
  assert.ok(fig.querySelector("details.laco-texto[open] [data-caminho]"), "sem JS, a figura em texto não vem aberta");
  assert.equal(pagina.querySelectorAll(".rastro").length, 0, "os três jeitos ficaram");
  const mdx = ler("livros/ciclo-de-vida/capitulos/01-o-problema-e-o-contrato.mdx");
  assert.doesNotMatch(mdx, /<Pendente o="Figura: o laço/);
  assert.match(mdx, /observar o resultado e decidir de novo/);
  assert.match(mdx, /Faça o papel de cada um/);
});

test("a figura não é mais vídeo: saíram a composição do laço e o player contínuo", async () => {
  const { existsSync } = await import("node:fs");
  for (const f of ["laco/laco.ts", "laco/LacoAnimado.tsx", "laco/FiguraLacoVideo.tsx", "palco/TocaGrafico.tsx"])
    assert.ok(!existsSync(new URL(`../src/components/livro/${f}`, import.meta.url)), `${f} ficou`);
});

test("o mapa da introdução avança sobre a base das animações, e não tem um Player só dele", () => {
  const ilha = ler("src/components/livro/ciclo/FiguraCiclo.tsx");
  assert.match(ilha, /import AvancaCena from "\.\.\/palco\/AvancaCena"/);
  assert.doesNotMatch(ilha, /@remotion\/player/);
  assert.match(ler("src/components/livro/palco/AvancaCena.tsx"), /prefers-reduced-motion/);
});
