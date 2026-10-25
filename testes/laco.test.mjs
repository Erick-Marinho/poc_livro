/** A figura 1.1 (docs/capacidades/laco-do-agente.md): quem decide o próximo passo, um jeito por vez. Os passos são os de
 *  tres-jeitos.json, em frase curta; cada vez vira uma linha de resumo; o investimento é no fluxo fixo, antes da
 *  frigideira. Tudo sai dos dados do livro e cabe no docs/RITMO.md. E a base das animações cena a cena, que o mapa da
 *  introdução usa. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(ler(p));
const L = await import("../src/components/livro/laco/laco.ts");
const laco = json("livros/ciclo-de-vida/figuras/laco.json");
const tresJeitos = json("livros/ciclo-de-vida/figuras/tres-jeitos.json");
const clientes = json("livros/ciclo-de-vida/projeto/dados/clientes.json");
const m = L.montarTrechos({ laco, tresJeitos, clientes });

test("a cliente é a do e-mail da pergunta, nos clientes da loja", () => {
  assert.equal(L.montarElenco({ tresJeitos, clientes }).nome, "Carla Mendes");
  const outra = structuredClone(tresJeitos);
  outra.perguntas[0].texto = "Quando chega? E-mail ninguem@exemplo.test";
  assert.throws(() => L.montarElenco({ tresJeitos: outra, clientes }), /não é de um cliente da loja/);
});

test("um jeito por vez, na ordem da história: o modelo sozinho e o fluxo com o pedido, o fluxo e o agente com a frigideira", () => {
  assert.deepEqual(m.vezes.map((v) => [v.jeito, v.pergunta]), [["modelo", "pedido"], ["fluxo", "pedido"], ["fluxo", "produto"], ["agente", "produto"]]);
  assert.deepEqual(m.trechos.map((t) => t.tipo), ["abertura", "vez", "vez", "vez", "vez", "fim"]);
});

test("cada vez mostra os passos do seu jeito, em frase curta de uma linha, devagar, e termina como nos três jeitos", () => {
  for (const v of m.vezes) {
    const passos = tresJeitos.modos.find((x) => x.id === v.jeito).passos[v.pergunta];
    assert.equal(v.mensagem, passos[0].texto, "a mensagem é a da cliente");
    assert.deepEqual(v.cartoes.map((c) => c.texto), passos.slice(1).map((p) => p.texto), `${v.nome}, ${v.pergunta}`);
    for (const c of v.cartoes) if (c.quem !== "resposta") assert.ok(c.curto.length <= 48, `"${c.curto}" passa de uma linha`);
    for (let i = 1; i < v.cartoes.length; i++) assert.ok(v.cartoes[i].em - v.cartoes[i - 1].em >= 2.5, `${v.nome}: um passo com menos de 2,5 s`);
    const fim = passos[passos.length - 1];
    assert.equal(v.certo, !!fim.certo);
    assert.equal(v.porque, fim.certo ? laco.nomes.certo : fim.erro, "o resumo diz o porquê dos três jeitos");
  }
  const semCurto = structuredClone(tresJeitos);
  delete semCurto.modos[1].passos.pedido[1].curto;
  assert.throws(() => L.montarTrechos({ laco, tresJeitos: semCurto, clientes }), /não tem a frase curta/);
});

test("só o agente decide de novo; no fluxo fixo, quem decide é o código; o modelo sozinho não decide", () => {
  const vez = (j, q) => m.vezes.find((v) => v.jeito === j && v.pergunta === q);
  assert.equal(vez("modelo", "pedido").cartoes.filter((c) => c.decide).length, 0);
  for (const q of ["pedido", "produto"]) assert.ok(vez("fluxo", q).cartoes.filter((c) => c.decide).every((c) => c.quem === "código"));
  assert.ok(vez("agente", "produto").cartoes.some((c) => c.deNovo && c.quem === "modelo"));
  assert.ok(m.vezes.filter((v) => v.jeito !== "agente").every((v) => !v.cartoes.some((c) => c.deNovo)));
});

test("cada vez vira um resumo ao terminar, e o fim mostra só os resumos e a conclusão", () => {
  for (const t of m.trechos.filter((x) => x.tipo === "vez")) {
    const ultimo = t.vez.cartoes[t.vez.cartoes.length - 1];
    assert.equal(L.resumindo(t, ultimo.em + 1.5), 0, `${t.vez.nome}: a resposta some antes de dar para ler`);
    assert.ok(L.resumindo(t, t.segundos) > 0.99, `${t.vez.nome}: a vez não vira resumo`);
  }
  assert.equal(m.trechos[m.trechos.length - 1].tipo, "fim");
});

test("antes da frigideira, o leitor investe no que o fluxo fixo faz, e a certa é o primeiro passo dele", () => {
  const p = L.pausaDe(m);
  const t = m.trechos.find((x) => x.vez?.investir);
  assert.deepEqual([t.vez.jeito, t.vez.pergunta], ["fluxo", "produto"]);
  assert.ok(p.quadro > Math.round(t.inicio * L.FPS) && p.quadro < Math.round((t.inicio + t.vez.cartoes[0].em) * L.FPS), "a pausa não vem entre a mensagem e o primeiro passo");
  assert.match(t.vez.cartoes[0].texto.toLowerCase(), new RegExp(p.opcoes[p.certa]));
  const errada = structuredClone(laco);
  errada.vezes.find((v) => v.investir).investir.certa = 0;
  assert.throws(() => L.pausaDe(L.montarTrechos({ laco: errada, tresJeitos, clientes })), /não é o que o fluxo fixo faz primeiro/);
});

test("a figura cabe no docs/RITMO.md: até 45 s, legendas de até 12 palavras", () => {
  assert.ok(m.total <= 45, `${m.total} s`);
  for (const l of [laco.abertura.legenda, laco.fim.legenda]) assert.ok(l.split(/\s+/).length <= 12, l);
});

test("a composição mostra uma vez por vez, sem câmera, sem colunas lado a lado e sem o diagrama abstrato", () => {
  assert.equal(L.camera, undefined, "o laço ainda tem câmera");
  const comp = ler("src/components/livro/laco/LacoAnimado.tsx");
  assert.doesNotMatch(comp, /camera\(|setas\(|caixas\(/);
  assert.doesNotMatch(comp, /repeat\(3/, "as três colunas lado a lado voltaram");
});

test("o mapa da introdução avança sobre a base das animações, e não tem um Player só dele", () => {
  const ilha = ler("src/components/livro/ciclo/FiguraCiclo.tsx");
  assert.match(ilha, /import AvancaCena from "\.\.\/palco\/AvancaCena"/);
  assert.doesNotMatch(ilha, /@remotion\/player/);
  assert.match(ler("src/components/livro/palco/AvancaCena.tsx"), /prefers-reduced-motion/);
});

test("o 1.1 tem a figura do laço no lugar dos três jeitos e do Pendente, com a figura em texto, e diz \"observar\"", async () => {
  const { parse } = await import("node-html-parser");
  const pagina = parse(ler("dist/ciclo-de-vida/01-o-problema-e-o-contrato/index.html"));
  const fig = pagina.querySelector("figure[data-laco]");
  assert.ok(fig, "a figura do laço não está no 1.1");
  assert.ok(fig.querySelectorAll("astro-island").some((i) => (i.getAttribute("component-url") ?? "").includes("FiguraLacoVideo")), "a figura não tem a animação");
  assert.ok(fig.querySelector("details.laco-texto [data-caminho]"), "a figura não tem a versão em texto");
  assert.ok(fig.querySelector("details.laco-texto").hasAttribute("open"), "sem JS, a figura em texto tem de vir aberta (a ilha a fecha ao carregar)");
  assert.equal(pagina.querySelectorAll(".rastro").length, 0, "os três jeitos ficaram");
  const mdx = ler("livros/ciclo-de-vida/capitulos/01-o-problema-e-o-contrato.mdx");
  assert.doesNotMatch(mdx, /<Pendente o="Figura: o laço/);
  assert.match(mdx, /observar o resultado e decidir de novo/);
  assert.doesNotMatch(mdx, /cena a cena/, "o texto fala em cenas, e o gráfico é contínuo");
});

test("a figura do 1.1 toca contínua, só com play e pausar, e não cena a cena", () => {
  const ilha = ler("src/components/livro/laco/FiguraLacoVideo.tsx");
  assert.match(ilha, /import TocaGrafico from "\.\.\/palco\/TocaGrafico"/);
  assert.doesNotMatch(ilha, /AvancaCena/);
  const base = ler("src/components/livro/palco/TocaGrafico.tsx");
  assert.doesNotMatch(base, /type="range"/, "a barra do tempo ficou");
  assert.doesNotMatch(base, /tg-tempo/, "o tempo ficou");
  assert.match(base, /isPlaying\(\)/, "a pausa para investir não confere se está tocando");
});
