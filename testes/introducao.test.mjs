/** A introdução: a pesquisa sobre agentes em produção, o mapa do ciclo e onde cada problema é capturado. Os dados batem com o sumário, o texto e a régua. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(ler(p));
const ciclo = json("livros/ciclo-de-vida/figuras/ciclo.json");
const aposta = json("livros/ciclo-de-vida/figuras/onde-se-pega.json");
const sumario = json("livros/ciclo-de-vida/sumario.json");
const mdx = ler("livros/ciclo-de-vida/capitulos/00-introducao.mdx");
const html = ler("dist/ciclo-de-vida/00-introducao/index.html");

test("cada capítulo do sumário está em uma fase do ciclo, e só em uma", () => {
  const nas = ciclo.fases.flatMap((f) => f.capitulos).toSorted((a, b) => a - b);
  assert.deepEqual(nas, sumario.capitulos.map((c) => c.numero));
});

test("a aposta usa os problemas do primeiro parágrafo, e cada resposta é uma fase que diz o capítulo certo", () => {
  const paragrafo = mdx.match(/Depois da primeira resposta vêm ([^\n]+)/)[1].toLowerCase();
  for (const m of aposta.mensagens) {
    assert.ok(paragrafo.includes(m.texto.replace(/\.$/, "").toLowerCase()), `"${m.texto}" não está no primeiro parágrafo`);
    const fase = ciclo.fases.find((f) => f.nome === m.opcoes[m.fez]);
    assert.ok(fase, `${m.opcoes[m.fez]} não é uma fase do ciclo`);
    const citado = Number(m.porque.match(/capítulo (\d)/)?.[1]);
    assert.ok(fase.capitulos.includes(citado), `"${m.texto}": a fase ${fase.nome} não é a do capítulo ${citado}`);
  }
  const r12 = ler("livros/ciclo-de-vida/projeto/referencia.jsonl").split("\n").find((l) => l.includes('"R12"'));
  assert.match(r12, /bruno/); assert.match(r12, /outra cliente/);
});

test("a página tem o Invista da pesquisa, a figura dos números e o mapa com as oito fases e as referências, sem o Invista das fases", () => {
  const previsao = json("livros/ciclo-de-vida/figuras/agentes-em-producao-previsao.json");
  assert.equal([...html.matchAll(/class="apo-msg"/g)].length, previsao.mensagens.length);
  assert.doesNotMatch(mdx, /Invista em qual/);
  assert.equal([...html.matchAll(/data-cartao="/g)].length, ciclo.fases.length);
  for (const r of ciclo.fontes) assert.ok(html.includes(r.url), r.nome);
});

test("a pesquisa: o Invista e a figura usam os mesmos números, com fonte e amostra, e cada fase aponta o capítulo dela", () => {
  const dados = json("livros/ciclo-de-vida/figuras/agentes-em-producao.json");
  const previsao = json("livros/ciclo-de-vida/figuras/agentes-em-producao-previsao.json");
  const pct = (v) => `${v.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
  /* a resposta certa de cada pergunta é a faixa em que cai o número da pesquisa */
  const faixa = { "Perto de 1 em cada 10": [5, 15], "Perto de metade": [40, 60], "Quase todos": [85, 100], "Menos de 1 em cada 5": [0, 20], "A maioria": [50, 100] };
  for (const m of previsao.mensagens) {
    const b = dados.barras.find((x) => x.id === m.barra);
    assert.ok(b, `a pergunta "${m.texto}" aponta uma barra que não existe`);
    assert.ok(m.porque.includes(pct(b.valor)), `a resposta não traz ${pct(b.valor)}`);
    const [de, ate] = faixa[m.opcoes[m.fez]];
    assert.ok(b.valor >= de && b.valor <= ate, `${pct(b.valor)} não cai em "${m.opcoes[m.fez]}"`);
    m.opcoes.forEach((o, k) => { if (k !== m.fez) { const [x, y] = faixa[o]; assert.ok(b.valor < x || b.valor > y, `"${o}" também estaria certa`); } });
  }
  for (const b of dados.barras) {
    assert.match(html, new RegExp(`data-barra="${b.id}"`));
    assert.ok(html.includes(pct(b.valor)), `a figura não mostra ${pct(b.valor)}`);
    const fase = ciclo.fases.find((f) => f.nome === b.fase);
    assert.ok(fase, `${b.fase} não é uma fase do ciclo`);
    assert.ok(html.includes(`<b>${fase.nome}</b>, cap. ${fase.capitulos[0]}`), `${b.id}: a fase não leva ao capítulo dela`);
  }
  assert.ok(html.includes(dados.fonte.url) && html.includes("mais de 380 profissionais"));
  assert.match(mdx, /o \[Gartner previu\]\(https:\/\/www\.gartner\.com\/[^)]+\) que mais de 40% [^.]+\. É uma previsão/);
});


test("na abertura de cada capítulo, a fase acesa é a do ciclo.json, e o link leva ao mapa da introdução", () => {
  assert.match(html, /id="mapa-do-ciclo"/);
  for (const [arq, n] of [["01-o-problema-e-o-contrato", 1], ["02-o-primeiro-agente", 2]]) {
    const pagina = ler(`dist/ciclo-de-vida/${arq}/index.html`);
    const fase = ciclo.fases.find((f) => f.capitulos.includes(n));
    assert.match(pagina, new RegExp(`data-ciclo-aqui="${fase.id}"`), `capítulo ${n}`);
    assert.equal([...pagina.matchAll(/aria-current="step"/g)].length, 1);
    assert.match(pagina, /href="\/ciclo-de-vida\/00-introducao\/#mapa-do-ciclo"/);
  }
});
