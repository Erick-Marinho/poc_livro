/**
 * Evidência da parte 1a: o capítulo 3 montado pelo Astro tem o mesmo texto e o mesmo código
 * do artefato de referência (testes/referencia/capitulo-3.html).
 * Ficam de fora o que entra na 1b: figuras, "pare e pense" e exercício.
 * Rode depois de `astro build` (o `npm test` faz os dois).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse } from "node-html-parser";

const raiz = new URL("../", import.meta.url);
const ler = (p) => readFileSync(new URL(p, raiz), "utf8");
const opcoes = { blockTextElements: { script: true, style: true } };   /* o <pre> do código precisa ser lido como HTML */
const ref = parse(ler("testes/referencia/capitulo-3.html"), opcoes);
const pagina = parse(ler("dist/agente-do-clima/03-a-ferramenta/index.html"), opcoes);
const clima = ler("livros/agente-do-clima/projeto/clima.py").replace(/\n$/, "");
const saidas = JSON.parse(ler("livros/agente-do-clima/saidas.json"));
const roteiroRef = ref.querySelectorAll("script").map((s) => s.text).join("\n");

const limpo = (t) => t.replace(/\s+/g, " ").trim();
const fora = (el) => el.closest("figure, .pense, .exercicio, .pendente");
const textos = (doc, sel) => doc.querySelectorAll(sel).filter((el) => !fora(el)).map((el) => limpo(el.text));
/* o mesmo seletor nos dois lados: o que importa é o texto, na mesma ordem */
const PROSA = "main h1, main .lide, main .neste li, main h2, main p, main .nota, main .resumo li";

test("o texto do capítulo é o mesmo do artefato", () => {
  const avisoRef = /^Amostra:/, avisoNovo = /^Teste do formato:/;
  const a = textos(ref, PROSA).filter((t) => !avisoRef.test(t));
  const b = textos(pagina, PROSA).filter((t) => !avisoNovo.test(t));
  assert.ok(a.length > 20, `poucos trechos de texto: ${a.length}`);
  assert.deepEqual(b, a);
});

test("o código do capítulo é o clima.py de verdade, e é o mesmo do artefato", () => {
  const dados = JSON.parse(roteiroRef.match(/const D = (\{[\s\S]*?\});\n/)[1]);
  assert.equal(dados.clima, clima, "o clima.py do repositório mudou em relação ao artefato");
  const L = clima.split("\n");
  const esperado = [[1, 3], [5, 6], [9, 17], [20, 34]];   /* trecho novo de cada listagem, sem as linhas em branco do começo */
  const listagens = pagina.querySelectorAll(".listagem");
  assert.equal(listagens.length, 4);
  listagens.forEach((el, i) => {
    const linhas = el.querySelectorAll(".line");
    const texto = linhas.map((l) => { const c = l.clone(); c.querySelectorAll(".chave").forEach((x) => x.remove()); return c.text; }).join("\n");
    assert.equal(texto, L.slice(0, esperado[i][1]).join("\n"), `listagem ${i + 1}: código diferente do arquivo`);
    const novas = linhas.filter((l) => l.classList.contains("novo")).map((l) => +l.getAttribute("data-n"));
    assert.deepEqual([novas[0], novas.at(-1)], esperado[i], `listagem ${i + 1}: trecho novo errado`);
  });
});

test("as notas numeradas das listagens são as do artefato", () => {
  const marcas = new Function("return " + roteiroRef.match(/const MARCAS = (\[[\s\S]*?\]);\n/)[1])();
  pagina.querySelectorAll(".listagem").forEach((el, i) => {
    const naLinha = el.querySelectorAll(".line").filter((l) => l.querySelector(".chave")).map((l) => [+l.getAttribute("data-n"), l.querySelector(".chave").getAttribute("title")]);
    assert.deepEqual(naLinha, marcas[i], `listagem ${i + 1}: notas diferentes`);
  });
});

test("os terminais mostram as saídas gravadas, as mesmas do artefato", () => {
  const terms = pagina.querySelectorAll("[data-terminal]").map((el) => JSON.parse(el.getAttribute("data-terminal")));
  assert.equal(terms.length, 2);
  for (const [t, chave] of [[terms[0], "coord"], [terms[1], "args"]]) {
    assert.equal(t.comando, saidas[chave].comando);
    assert.deepEqual(t.saida, saidas[chave].saida);
    assert.ok(roteiroRef.includes(t.comando), `comando de ${chave} não está no artefato`);
    for (const [linha] of t.saida) assert.ok(roteiroRef.includes(JSON.stringify(linha).slice(1, -1)) || roteiroRef.includes(linha), `saída de ${chave} não está no artefato`);
  }
});

test("o que ainda não existe está guardado no lugar certo, para a 1b", () => {
  const pendentes = pagina.querySelectorAll("[data-pendente]").map((el) => el.getAttribute("data-pendente").split(" · ")[0]);
  assert.deepEqual(pendentes, ["Figura 3.1", "Teste rápido", "Figura 3.2", "Pare e pense", "Figura 3.3", "Pare e pense", "Exercício"]);
});
