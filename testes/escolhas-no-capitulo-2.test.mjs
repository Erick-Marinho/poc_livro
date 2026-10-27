/** O leitor decide no capítulo 2 (docs/capacidades/escolhas-no-capitulo-2.md): o Invista antes de cada figura-chave, com
 *  opções e resposta do projeto, e as figuras que só tocam ou rolam fora da conta das ações. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { montarRoteiro } from "../src/components/livro/roteiro/roteiro.ts";
import { eAcao } from "../scripts/ritmo.mjs";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(ler(p));
const referencia = ler("livros/ciclo-de-vida/projeto/referencia.jsonl");
const gabarito = Object.fromEntries(referencia.trim().split("\n").map((l) => JSON.parse(l)).map((c) => [c.id, c.decisao]));

test("o Invista do 2.1: as opções são os nós de caminho do grafo real, e a resposta é a do gabarito", () => {
  const d = json("livros/ciclo-de-vida/figuras/caminho-do-r10.json");
  const grafo = json("livros/ciclo-de-vida/figuras/grafo-02.json"), nos = grafo.nos;
  const r = montarRoteiro({ arestas: json("livros/ciclo-de-vida/saidas.json")["grafo-02"], nos: grafo, referencia, mensagens: ["R10", "R15"] });
  const [m] = d.mensagens;
  assert.deepEqual(m.opcoes, r.balcoes.map((b) => b.id), "os nós, na ordem da figura");
  assert.equal(m.opcoes[m.fez], gabarito[m.caso]);
  for (const o of m.opcoes) assert.equal(d.glosas[o], nos[o].modelo === "escreve" ? "o modelo escreve" : "frase fixa", o);
});

test("no 2.1, o Invista vem logo antes do grafo, e as figuras do capítulo 2 não contam como ação", () => {
  const cap = ler("livros/ciclo-de-vida/capitulos/02-o-primeiro-agente.mdx");
  const s21 = cap.slice(cap.indexOf("## 2.1"), cap.indexOf("## 2.2"));
  const aposta = s21.indexOf("<Aposta referencia={referencia} dados={caminhoDoR10}"), fig = s21.indexOf("<RoteiroDoAgente");
  assert.ok(aposta > 0 && aposta < fig && !/<[A-Z]/.test(s21.slice(aposta + 10, fig)), "nada entre o Invista e a figura");
  for (const f of ["RoteiroDoAgente", "FormularioDoAgente", "EnsaioDoAgente", "ProvaDoAgente", "ResultadoDoAgente"]) assert.equal(eAcao(f), false, f);
  assert.match(ler("docs/RITMO.md"), /`ResultadoDoAgente` \(tocam ou rolam/);
});
