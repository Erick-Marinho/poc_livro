/** A IDE do capítulo 1: o caminho inteiro da pasta vazia à nota zero, montado do roteiro e das saídas reais. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { montarIde } from "../src/lib/ideCapitulo.ts";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(ler(p));
const entrada = () => ({
  roteiro: json("livros/ciclo-de-vida/roteiros/01.json"), estados: json("livros/ciclo-de-vida/roteiros/01.estados.json"),
  saidas: json("livros/ciclo-de-vida/saidas.json"), capitulo: json("livros/ciclo-de-vida/passos/01.json"),
  secoes: { "1.5": "O projeto", "1.6": "O contrato", "1.7": "As perguntas", "1.8": "A nota zero" },
});
const { acoes, passos } = await montarIde(entrada());

test("18 passos cobrem as 40 ações do roteiro, sem buraco", () => {
  assert.equal(passos.length, 18);
  assert.equal(acoes.length, 40);
  passos.forEach((p, i) => assert.equal(p.de, i === 0 ? 1 : passos[i - 1].ate + 1, p.id));
  assert.equal(passos.at(-1).ate, 40);
});

test("o projeto nasce da pasta vazia: uv init em ~, o main.py apagado, e o que o uv add mudou", () => {
  assert.deepEqual([acoes[0].tipo, acoes[0].comando, acoes[0].onde], ["rodar", "uv init atendimento-bemtevi", "~"]);
  assert.deepEqual(acoes[0].gerados.map((g) => g.nome).sort(), [".gitignore", ".python-version", "README.md", "main.py", "pyproject.toml"]);
  assert.deepEqual([acoes[1].tipo, acoes[1].arquivo], ["apagar", "main.py"]);
  const add = acoes.find((a) => a.tipo === "rodar" && a.comando === "uv add pydantic");
  assert.deepEqual(add.gerados.find((g) => g.nome === "pyproject.toml").alteradas, [7, 8, 9]);   // "dependencies = []" vira a lista com o pydantic
  assert.ok(add.gerados.find((g) => g.nome === "uv.lock").novo);
});

test("o sinal de cada passo sai da saída gravada", () => {
  assert.deepEqual(passos.map((p) => `${p.id}:${p.sinal}`), ["projeto-nasce:ok", "pydantic:ok", "pytest:ok", "a-loja:nada", "decisoes:erro", "caso:erro",
    "ler-arquivo:nada", "tres-perguntas:ok", "caso-apressado:engano", "contrato-se-protege:erro", "vinte-perguntas:engano", "le-a-loja:ok",
    "o-que-os-testes-leem:nada", "testes-de-formato:engano", "regras-da-politica:erro", "r12-corrigido:ok", "agente-mais-simples:ok", "a-regua:ok"]);
});

test("o caminho do erro chega dobrado: o contrato.py à vista, as bibliotecas dentro da dobra", () => {
  const barrado = acoes.find((a) => a.tipo === "rodar" && a.id === "r01-caso-sem-pedido-barrado");
  const vis = barrado.saida.filter((t) => t.tipo === "linha").map((t) => t.l).join("\n");
  assert.match(vis, /contrato\.py", line 54/);
  assert.doesNotMatch(vis, /site-packages/);
  assert.ok(barrado.saida.some((t) => t.tipo === "dobra" && t.linhas.some(([l]) => l.includes("site-packages"))));
});

test("o livro não monta com buraco entre passos, nem com pensamento de quem não é autor", async () => {
  const buraco = entrada(); buraco.capitulo.passos[4].de += 1;
  await assert.rejects(montarIde(buraco), /nenhum pedaço do caminho pode sumir/);
  const fora = entrada(); fora.capitulo.passos[0].pensamento = { autor: "Fulano", pergunta: "x", por_que: "y" };
  await assert.rejects(montarIde(fora), /não está entre os autores/);
});

test("a página traz a IDE do capítulo, e nenhum texto de exemplo", () => {
  const html = ler("dist/ciclo-de-vida/01-o-problema-e-o-contrato/index.html");
  assert.match(html, /component-url="[^"]*IdeCapitulo[^"]*"/);
  assert.equal([...html.matchAll(/class="ic-ponto /g)].length, 18);
  assert.doesNotMatch(html, /EXEMPLO/);
});
