/** O mapa do ciclo em anel, na introdução: o desenho e os cartões saem do ciclo.json. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse } from "node-html-parser";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const ciclo = JSON.parse(ler("livros/ciclo-de-vida/figuras/ciclo.json"));
const mapa = parse(ler("dist/ciclo-de-vida/00-introducao/index.html")).querySelector("#mapa-do-ciclo");
const normal = (s) => s.replace(/\s+/g, " ").trim();

test("o mapa é um anel e uma coluna, com um nó para cada fase do ciclo.json", () => {
  for (const desenho of ["anel", "coluna"]) {
    const svg = mapa.querySelector(`svg[data-desenho="${desenho}"]`);
    assert.ok(svg, `falta o desenho em ${desenho}`);
    assert.deepEqual(svg.querySelectorAll("[data-no]").map((n) => n.getAttribute("data-no")).toSorted(), ciclo.fases.map((f) => f.id).toSorted());
  }
});

test("a volta sai de 'quando dá errado' e entra em 'avaliar', e Evoluir volta de Observar a Construir", () => {
  for (const desenho of ["anel", "coluna"]) {
    const svg = mapa.querySelector(`svg[data-desenho="${desenho}"]`);
    assert.ok(svg.querySelector('[data-volta="errado-avaliar"]'), `${desenho}: falta a volta do erro`);
    assert.ok(svg.querySelector('[data-volta="observar-construir"]'), `${desenho}: falta a volta do Evoluir`);
  }
});

test("um cartão por fase, com o nome e a pergunta à vista, e o resto dentro", () => {
  const cartoes = mapa.querySelectorAll("details[data-cartao]");
  assert.equal(cartoes.length, ciclo.fases.length);
  for (const f of ciclo.fases) {
    const c = mapa.querySelector(`details[data-cartao="${f.id}"]`);
    const resumo = normal(c.querySelector("summary").text);
    assert.ok(resumo.includes(f.nome) && resumo.includes(f.pergunta), `o cartão de ${f.id} não mostra o nome e a pergunta`);
    assert.ok(normal(c.text).includes(f.ganha), `o cartão de ${f.id} não tem o que o agente ganha`);
  }
});

/* a animação (etapa 2): as cenas respondem a aposta, nos limites do docs/RITMO.md */
const { montarCenas, limites } = await import("../src/components/livro/ciclo/cenas.ts");
const cenas = JSON.parse(ler("livros/ciclo-de-vida/figuras/ciclo-animado.json"));
const aposta = JSON.parse(ler("livros/ciclo-de-vida/figuras/onde-se-pega.json"));
const pagina = parse(ler("dist/ciclo-de-vida/00-introducao/index.html"));

test("cada problema da aposta entra numa cena e para na fase que o pega, a resposta da aposta", () => {
  const m = montarCenas({ ciclo, cenas, aposta });
  const comProblema = m.cenas.filter((c) => c.problema !== undefined);
  assert.deepEqual(comProblema.map((c) => c.problema).toSorted(), aposta.mensagens.map((_, i) => i));
  for (const c of comProblema) {
    const msg = aposta.mensagens[c.problema];
    assert.equal(c.pega.nome, msg.opcoes[msg.fez], `"${msg.texto}"`);
    assert.equal(c.ida[c.ida.length - 1].fase, c.pega.id);
  }
  assert.ok(m.cenas.some((c) => c.chave && c.volta.some((x) => x.fase === "avaliar")), "o momento-chave não volta a Avaliar");
});

test("a animação cabe no docs/RITMO.md: até 6 cenas, 45 s, 8 s por cena e 12 palavras por legenda", () => {
  const m = montarCenas({ ciclo, cenas, aposta });
  assert.ok(m.cenas.length <= 6, `${m.cenas.length} cenas`);
  assert.ok(m.total <= 45, `${m.total} s`);
  for (const c of m.cenas) {
    assert.ok(c.segundos <= 8, `"${c.legenda}": ${c.segundos} s`);
    for (const l of [c.legenda, c.sabendo].filter(Boolean)) assert.ok(l.split(/\s+/).length <= 12, `"${l}" passa de 12 palavras`);
  }
  assert.equal(limites(m).length, m.cenas.length);
});

/* ajustes da introdução (etapa 6): os cartões abrem num modal, pelo nó, que mostra que é clicável */
test("cada nó do mapa mostra que abre o cartão, e o mapa tem o modal e a dica; a miniatura não abre nada", () => {
  for (const desenho of ["anel", "coluna"]) {
    for (const no of mapa.querySelectorAll(`svg[data-desenho="${desenho}"] [data-no]`)) {
      assert.ok(no.querySelector("svg.lucide-info"), `${desenho}: o nó ${no.getAttribute("data-no")} não mostra que é clicável`);
      assert.match(no.getAttribute("aria-label"), /o que o agente ganha/, `${desenho}: o nome do nó ${no.getAttribute("data-no")} não diz o que abre`);
    }
  }
  const modal = mapa.querySelector("dialog.mc-modal");
  assert.ok(modal, "o mapa não tem o modal");
  assert.ok(modal.getAttribute("aria-labelledby") && modal.querySelector(`#${modal.getAttribute("aria-labelledby")}`), "o modal não tem título");
  assert.ok(mapa.querySelector(".mc-dica"), "o mapa não diz que a fase se toca");
  const mini = parse(ler("dist/ciclo-de-vida/01-o-problema-e-o-contrato/index.html")).querySelector("[data-ciclo-aqui]");
  assert.equal(mini.querySelectorAll("svg.lucide-info").length, 0, "a miniatura mostra o ícone de abrir");
});

/* ajustes da introdução (etapa 3): quem já investiu não é perguntado de novo */
test("quem já investiu, ou está no modo direto, lê o caminho, e não a pergunta; quem não investiu, a pergunta", async () => {
  const { jaSabe, titulo, legenda } = await import("../src/components/livro/ciclo/cenas.ts");
  const m = montarCenas({ ciclo, cenas, aposta });
  assert.equal(jaSabe([null, null, null, null], false), false);
  assert.equal(jaSabe(undefined, false), false);
  assert.equal(jaSabe([null, 1, null, null], false), true);
  assert.equal(jaSabe([null, null, null, null], true), true, "no modo direto, a caixa já mostra as respostas");
  assert.equal(titulo(m, false), cenas.pergunta);
  assert.match(titulo(m, false), /\?$/);
  assert.doesNotMatch(titulo(m, true), /\?/, "o título pergunta o que o leitor já sabe");
  for (const c of m.cenas) assert.doesNotMatch(legenda(c, true), /\?/, `"${legenda(c, true)}" pergunta o que o leitor já sabe`);
  assert.match(legenda(m.cenas[0], false), /\?$/);
});

test("cenas que contradizem a aposta não montam a figura", () => {
  const trocada = structuredClone(cenas);
  trocada.cenas.find((c) => c.problema === 1).caminho = ["planejar", "construir"];
  assert.throws(() => montarCenas({ ciclo, cenas: trocada, aposta }), /a fase que pega o problema \(observar\) não está no caminho/);
});

test("o mapa da introdução tem a animação, além do desenho parado", () => {
  assert.ok(pagina.querySelectorAll("astro-island").some((i) => (i.getAttribute("component-url") ?? "").includes("FiguraCiclo")), "o mapa não tem a animação");
  assert.ok(pagina.querySelector('#mapa-do-ciclo svg[data-desenho="anel"]'), "sem JS, o desenho parado sumiu");
});

/* o "você está aqui" (etapa 3): o mesmo anel, em miniatura, com a fase do capítulo acesa */
test("na abertura dos capítulos, o anel em miniatura acende a fase do capítulo, e o leitor de tela lê a lista", () => {
  for (const [pasta, n] of [["01-o-problema-e-o-contrato", 1], ["02-o-primeiro-agente", 2]]) {
    const aqui = parse(ler(`dist/ciclo-de-vida/${pasta}/index.html`)).querySelector("[data-ciclo-aqui]");
    const fase = ciclo.fases.find((f) => f.capitulos.includes(n));
    const mini = aqui.querySelector('svg[data-desenho="anel"]');
    assert.ok(mini, `capítulo ${n}: falta o anel em miniatura`);
    assert.equal(mini.getAttribute("aria-hidden"), "true", `capítulo ${n}: a miniatura é desenho, não é lida`);
    assert.deepEqual(mini.querySelectorAll(".an-aceso").map((g) => g.getAttribute("data-no")), [fase.id], `capítulo ${n}`);
    assert.equal(mini.querySelectorAll("[tabindex]").length, 0, `capítulo ${n}: a miniatura não recebe foco`);
    assert.ok(aqui.querySelector('[aria-current="step"]')?.text.includes(fase.nome), `capítulo ${n}: a lista não marca ${fase.nome}`);
  }
});
