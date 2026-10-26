/** O formulário do substituto, no 2.2 (docs/capacidades/capitulo-2-em-cenas.md, etapa 2): a saída estruturada, do projeto real. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { montarFormulario, baloes, T, SEGUNDOS, SOLTO } from "../src/components/livro/roteiro/formulario.ts";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const entrada = {
  arestas: JSON.parse(ler("livros/ciclo-de-vida/saidas.json"))["grafo-02"],
  nos: JSON.parse(ler("livros/ciclo-de-vida/figuras/grafo-02.json")),
  referencia: ler("livros/ciclo-de-vida/projeto/referencia.jsonl"),
  gravacao: JSON.parse(ler("livros/ciclo-de-vida/gravacoes/r02-medir.json")),
  agente: ler("livros/ciclo-de-vida/projeto/agente.py"),
  mensagem: "R15",
};

test("a decisão, o motivo e a resposta são os que o modelo deu na gravação", () => {
  const f = montarFormulario(entrada);
  assert.equal(f.decidiu, "recusar");
  assert.match(f.motivo, /CPF/);
  assert.match(f.escrita, /CPF/);
});

test("o molde é a Escolha do agente.py; um molde com outros campos não monta", () => {
  assert.throws(() => montarFormulario({ ...entrada, agente: entrada.agente.replace("motivo: str", "razao: str") }), /a Escolha tem decisao, razao/);
});

test("quem faz o quê sai do grafo-02.json: o modelo escreve no responder e no recusar, o código põe frase fixa no resto", () => {
  const f = montarFormulario(entrada);
  assert.deepEqual(Object.fromEntries(f.balcoes.map((b) => [b.id, b.modelo])), { responder: "escreve", abrir_chamado: "não", recusar: "escreve", passar: "não" });
});

test("os balões emendam, e o texto solto do começo é dito ilustração na figura", () => {
  const bs = baloes(montarFormulario(entrada));
  bs.forEach((b, i) => { if (i) assert.equal(b.de, bs[i - 1].ate); });
  assert.ok(bs.at(-1).ate >= SEGUNDOS && T.quinta[0] > T.formulario && T.caminho[0] > T.quinta[1]);
  assert.ok(SOLTO.includes("encaminhar"));
  assert.ok(readFileSync(new URL("../src/components/livro/roteiro/FormularioAnimado.tsx", import.meta.url), "utf8").includes("(ilustração)"));
});

test("na página, o 2.2 tem o formulário e o molde do agente.py, e não mais as pilhas", () => {
  const html = ler("dist/ciclo-de-vida/02-o-primeiro-agente/index.html");
  const secao = html.slice(html.indexOf('<h2 id="s2-2"'), html.indexOf('<h2 id="s2-3"'));
  assert.match(secao, /data-formulario/);
  assert.match(secao, /class Escolha/);
  assert.doesNotMatch(secao, /data-pilhas/);
});
