/** O relógio do ritmo (docs/RITMO.md): o que conta como ação, e o relatório dos textos de verdade. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { medir, textos, AVISO, FALHA } from "../scripts/ritmo.mjs";

const texto = (corpo) => `---\ntitulo: x\n---\nimport X from "y";\n${corpo}`;
const vinte = "palavra ".repeat(20).trim();

test("o relógio conta as palavras até a ação, e recomeça depois dela", () => {
  const t = medir(texto(`## 1.1 A\n\n${vinte}\n\n<PareEPense pergunta="p?">\nresposta que só se lê depois\n</PareEPense>\n\n${vinte} ${vinte}`));
  assert.deepEqual(t.map((x) => [x.palavras, x.ate]), [[20, "PareEPense"], [40, null]]);
});

test("abrir, assistir ou rodar não desliga o relógio; escolher e comparar desliga", () => {
  const [a] = medir(texto(`${vinte}\n<Terminal saida={s} />\n${vinte}\n<GrafoAgente modo="desenho" numero="1" />\n${vinte}\n<GrafoAgente modo="caminhos" numero="2" />`));
  assert.deepEqual([a.palavras, a.ate], [60, "GrafoAgente"]);
});

test("o texto de uma nota conta; o de um Pendente, não", () => {
  const [a] = medir(texto(`<Nota titulo="t">${vinte}</Nota>\n<Pendente o="${vinte}" parte="x" />\n<Classificador referencia={r} />`));
  assert.equal(a.palavras, 20);
});

test("componente novo sem classificação para o relógio", () => {
  assert.throws(() => medir(texto(`${vinte}\n<FiguraNova numero="1" />`)), /FiguraNova não está classificado/);
});

test("nenhum texto passa de 400 palavras sem o leitor agir; acima de 200, só um aviso no relatório", (t) => {
  const falhas = [];
  for (const { nome, texto: mdx } of textos())
    for (const x of medir(mdx).filter((x) => x.palavras > AVISO)) {
      const linha = `${nome}, ${x.secao}: ${x.palavras} palavras até ${x.ate ?? "o fim"}`;
      if (x.palavras > FALHA) falhas.push(linha); else t.diagnostic(`aviso: ${linha}`);
    }
  assert.deepEqual(falhas, [], `trecho acima de ${FALHA} palavras sem ação (docs/RITMO.md); ponha uma ação do leitor antes:\n${falhas.join("\n")}`);
});

test("um Rascunho só aceita uma ação do leitor, e diz se o dado é real ou ilustração", async () => {
  const { conferirRascunho } = await import("../scripts/ritmo.mjs");
  assert.doesNotThrow(() => conferirRascunho({ acao: "Pilhas", dado: "real: grafo-02.json, campo modelo" }));
  assert.doesNotThrow(() => conferirRascunho({ acao: "GrafoAgente", dado: "real: a gravação r02-medir" }));
  assert.doesNotThrow(() => conferirRascunho({ acao: "Taximetro", nova: true, dado: "ilustração: preços inventados" }));
  assert.throws(() => conferirRascunho({ acao: "Nota", dado: "real: x" }), /Nota não pede uma decisão do leitor/);
  assert.throws(() => conferirRascunho({ acao: "Taximetro", dado: "real: x" }), /Taximetro não existe no livro/);
  assert.throws(() => conferirRascunho({ acao: "Aposta", dado: "o referencia.jsonl" }), /começa com "real: " ou "ilustração: "/);
});

test("nenhum capítulo ou experimento publica com Rascunho: cada um vira o componente de verdade, ou sai", () => {
  const sobram = textos().flatMap(({ nome, texto: mdx }) => mdx.split("\n").flatMap((l, i) => /^<Rascunho\b/.test(l)
    ? [`${nome}, linha ${i + 1}: ${l.match(/acao="([^"]+)"/)?.[1] ?? "?"}`] : []));
  assert.deepEqual(sobram, [], `rascunho de ação ainda no texto (docs/capacidades/ritmo-no-texto.md); troque pelo componente ou apague:\n${sobram.join("\n")}`);
});

test("o relógio conta o Rascunho como ação, e o texto de dentro não entra", () => {
  const t = medir(texto(`${vinte}\n<Rascunho acao="Pilhas" frase="f" verbo="separa" dado="real: x">\n${vinte}\n</Rascunho>\n${vinte}`));
  assert.deepEqual(t.map((x) => [x.palavras, x.ate]), [[20, "Rascunho"], [20, null]]);
});
