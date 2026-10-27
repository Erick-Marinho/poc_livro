/** O grafo do agente, no 2.1 (docs/capacidades/grafos-no-capitulo-2.md, etapa 1): a figura sai do grafo real, do agente.py e do contrato. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { montarRoteiro, baloes, T, DURACAO, FPS, SEGUNDOS, estados, chavesDoEstado, fraseFixa } from "../src/components/livro/roteiro/roteiro.ts";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const entrada = {
  arestas: JSON.parse(ler("livros/ciclo-de-vida/saidas.json"))["grafo-02"],
  nos: JSON.parse(ler("livros/ciclo-de-vida/figuras/grafo-02.json")),
  referencia: ler("livros/ciclo-de-vida/projeto/referencia.jsonl"),
  mensagens: ["R10", "R15"],
};

test("os balcões são os nós para onde as setas que escolhem levam, no grafo real", () => {
  const r = montarRoteiro(entrada);
  assert.equal(r.decide, "decidir");
  assert.deepEqual(r.balcoes.map((b) => b.id), ["responder", "abrir_chamado", "recusar", "passar"]);
  assert.deepEqual(r.balcoes.map((b) => b.modelo), ["escreve", "não", "escreve", "não"]);
});

test("cada mensagem vai ao balcão da decisão do contrato, e os balões dizem qual", () => {
  const r = montarRoteiro(entrada);
  assert.deepEqual(r.mensagens.map((m) => [m.id, m.balcao]), [["R10", "abrir_chamado"], ["R15", "recusar"]]);
  const bs = baloes(r);
  assert.match(bs.find((b) => b.alvo === "balcao-a").texto, /abrir_chamado/);
  assert.match(bs.find((b) => b.alvo === "balcao-b").texto, /recusar/);
  assert.match(bs.at(-1).texto, /estado/);
});

test("figura que descreve um nó que o grafo não tem não monta", () => {
  const nos = structuredClone(entrada.nos);
  nos.nos.inventado = { papel: "não existe" };
  assert.throws(() => montarRoteiro({ ...entrada, nos }), /a figura e o grafo não batem/);
});

test("os balões se sucedem sem buraco nem sobreposição, e cobrem a animação inteira", () => {
  const bs = baloes(montarRoteiro(entrada));
  bs.forEach((b, i) => { if (i) assert.equal(b.de, bs[i - 1].ate, `o balão ${i + 1} não emenda no anterior`); assert.ok(b.ate > b.de); });
  assert.ok(bs.at(-1).ate >= SEGUNDOS, "o último balão fica até o fim");
  assert.ok(T.estado[1] <= T.a.entra && T.a.fim[1] < T.b.troca && T.b.fim[1] < SEGUNDOS, "primeiro as peças, depois as duas mensagens");
  assert.equal(DURACAO, SEGUNDOS * FPS);
});

test("na página, o 2.1 tem o roteiro, e não mais o grafo de clicar", () => {
  const html = ler("dist/ciclo-de-vida/02-o-primeiro-agente/index.html");
  const secao = html.slice(html.indexOf('<h2 id="s2-1"'), html.indexOf('<h2 id="s2-2"'));
  assert.match(secao, /data-roteiro/);
  assert.doesNotMatch(secao, /data-grafo/);
});

test("as peças vêm primeiro: os nós, as arestas fixas e as que escolhem, START e END, e o estado", () => {
  const bs = baloes(montarRoteiro(entrada));
  assert.deepEqual(bs.slice(0, 4).map((b) => b.alvo), ["nos", "setas", "pontas", "ficha"]);
  assert.match(bs[0].texto, /função do seu código que recebe o estado e devolve o que mudou/);
  assert.match(bs[1].texto, /As cheias são fixas/);
  assert.match(bs[1].texto, /As tracejadas escolhem/);
  assert.match(bs[2].texto, /START/);
  assert.match(bs[3].texto, /classe Conversa/);
});

test("o estado em JSON tem as chaves da classe Conversa, a frase fixa do agente.py e nenhuma frase inventada onde o modelo escreve", () => {
  const agente = ler("livros/ciclo-de-vida/projeto/agente.py");
  assert.deepEqual(chavesDoEstado(agente), ["pergunta", "decisao", "motivo", "resposta"]);
  const [r10, r15] = estados(montarRoteiro(entrada), agente);
  assert.equal(r10.decisao, "abrir_chamado");
  assert.equal(r10.resposta, fraseFixa(agente, "abrir_chamado"));
  assert.match(r10.resposta, /^Sinto muito pelo problema/);
  assert.equal(r15.decisao, "recusar");
  assert.equal(r15.resposta, null, "no recusar, o modelo escreve: a figura não inventa a frase");
  assert.throws(() => estados(montarRoteiro(entrada), agente.replace("class Conversa", "class Outra")), /classe Conversa/);
});

test("o 2.1 ensina pelo desenho: sem código, sem balcão, e a definição logo depois da figura", () => {
  const cap = ler("livros/ciclo-de-vida/capitulos/02-o-primeiro-agente.mdx");
  const secao = cap.slice(cap.indexOf("## 2.1"), cap.indexOf("## 2.2"));
  assert.doesNotMatch(secao, /<Listagem/, "o código o leitor vê na 2.5, quando constrói");
  assert.doesNotMatch(secao, /balc/, "o 2.1 fala em nós e setas, não em balcões");
  const fig = secao.indexOf("<RoteiroDoAgente"), def = secao.indexOf('<Nota titulo="a definição deste livro">'), pp = secao.indexOf("<PareEPense");
  assert.ok(fig > 0 && fig < def && def < pp, "abertura, figura, definição, pare e pense");
});
