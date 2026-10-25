/** A figura 1.1 (docs/capacidades/laco-do-agente.md): três histórias de atendentes da loja, para quem começa do zero.
 *  As mensagens, o que o sistema e o catálogo devolvem e as respostas são os de tres-jeitos.json; as previsões, os
 *  passos da ficha e o caminho da atendente batem com eles; os quadros não usam jargão, e o nome técnico só vem no fim
 *  de cada história. E a base das animações cena a cena, que o mapa da introdução usa. Rode depois de `astro build`. */
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
const h = Q.montarHistorias({ laco, tresJeitos, clientes });
const passos = (j, p) => tresJeitos.modos.find((m) => m.id === j).passos[p];
const ultima = (j, p) => passos(j, p)[passos(j, p).length - 1];

test("1. o atendente sem acesso ao sistema: a Carla pergunta do BT-1003, e ele chuta a resposta dos três jeitos", () => {
  assert.equal(h.modelo.cliente, "Carla Mendes");
  assert.equal(h.modelo.mensagem, passos("modelo", "pedido")[0].texto);
  assert.deepEqual([h.modelo.resposta.texto, h.modelo.resposta.certo], [ultima("modelo", "pedido").texto, false]);
  assert.match(h.modelo.prever.opcoes[h.modelo.prever.certa], /parece certa/);
});

test("2. o atendente com a ficha: com o pedido, a ficha vai até o fim; com a frigideira, trava no passo 1, que não prevê produto", () => {
  assert.equal(h.fluxo.pedido.passos.length, h.fluxo.ficha.length);
  assert.ok(h.fluxo.pedido.resposta.certo && !h.fluxo.produto.resposta.certo);
  assert.deepEqual(h.fluxo.pedido.passos.map((p) => p.achou), ["BT-1003", "previsão 14/11", ""], "o que ele achou em cada passo");
  assert.deepEqual(h.fluxo.produto.passos.map((p) => p.achou), ["não acha"]);
  assert.match(h.fluxo.prever.opcoes[h.fluxo.prever.certa], /passo 1/);
  assert.match(h.fluxo.nao_preve, /não prevê/);
  const errada = structuredClone(laco);
  errada.historias.fluxo.prever.passo = 2;
  assert.throws(() => Q.montarHistorias({ laco: errada, tresJeitos, clientes }), /trava no passo 1/);
});

test("3. a atendente é o leitor: o catálogo devolve o que a ferramenta dos três jeitos devolve; responder depois acerta, antes erra", () => {
  const catalogo = h.agente.acoes.find((a) => a.id === "buscar_produto");
  assert.equal(catalogo.resultado, passos("agente", "produto").find((p) => p.quem === "ferramenta").texto.split(" → ")[1]);
  let t = Q.agir(h.agente, Q.inicio(), "responder");
  assert.deepEqual([t.resposta.texto, t.resposta.certo], [ultima("modelo", "produto").texto, false], "responder sem olhar é o que o atendente sem sistema faz");
  t = Q.agir(h.agente, Q.agir(h.agente, Q.agir(h.agente, Q.inicio(), "consultar_pedido"), "buscar_produto"), "responder");
  assert.equal(t.passos.length, 2, "com um desvio: o sistema de pedidos, depois o catálogo");
  assert.deepEqual([t.resposta.texto, t.resposta.certo], [ultima("agente", "produto").texto, true]);
  const outra = structuredClone(laco);
  outra.historias.agente.acoes[0].id = "ligar_para_o_fornecedor";
  assert.throws(() => Q.montarHistorias({ laco: outra, tresJeitos, clientes }), /não é uma ferramenta que o agente dos três jeitos usa/);
});

test("os quadros falam como para quem começa do zero: sem jargão; o nome técnico só no fim de cada história", () => {
  const jargao = /\b(modelo|agente|fluxo|código|ferramenta|LLM|API|prompt)\b/i;
  const { historias } = laco;
  const quadros = [historias.modelo.pensa, historias.modelo.prever.pergunta, ...historias.modelo.prever.opcoes, historias.modelo.conclusao,
    historias.fluxo.ficha_diz, ...historias.fluxo.ficha, historias.fluxo.outra, historias.fluxo.prever.pergunta, ...historias.fluxo.prever.opcoes, historias.fluxo.nao_preve, historias.fluxo.conclusao,
    historias.agente.diz, ...historias.agente.acoes.map((a) => a.rotulo), historias.agente.de_novo, historias.agente.conclusao];
  for (const q of quadros) assert.doesNotMatch(q, jargao, `"${q}" usa jargão antes da hora`);
  assert.deepEqual([historias.modelo.nome, historias.fluxo.nome, historias.agente.nome], ["Isto é um modelo sozinho", "Isto é um fluxo fixo", "Isto é um agente"]);
  assert.match(laco.fim.quebra, /^Onde a comparação quebra/, "o fim diz onde a analogia quebra (docs/RITMO.md)");
});

test("o fim diz quem decide em cada história, e o que cada jeito acertou, nos três jeitos", () => {
  assert.deepEqual(h.fim.linhas.map((f) => [f.nome, f.acertos]), [["só o modelo", [false, false]], ["fluxo fixo", [true, false]], ["agente", [true, true]]]);
});

test("o 1.1 tem a figura das histórias, no lugar dos três jeitos e do Pendente, sem a figura em texto", () => {
  const pagina = parse(ler("dist/ciclo-de-vida/01-o-problema-e-o-contrato/index.html"));
  const fig = pagina.querySelector("figure[data-laco]");
  assert.ok(fig, "a figura não está no 1.1");
  assert.ok(fig.querySelectorAll("astro-island").some((i) => (i.getAttribute("component-url") ?? "").includes("QuemDecide")), "a figura não tem a ilha");
  assert.equal(fig.querySelectorAll(".laco-texto, [data-caminho]").length, 0, "a figura em texto ficou");
  assert.equal(pagina.querySelectorAll(".rastro").length, 0, "os três jeitos ficaram");
  const mdx = ler("livros/ciclo-de-vida/capitulos/01-o-problema-e-o-contrato.mdx");
  assert.doesNotMatch(mdx, /<Pendente o="Figura: o laço/);
  assert.match(mdx, /observar o resultado e decidir de novo/);
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
