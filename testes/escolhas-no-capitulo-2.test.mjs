/** O leitor decide no capítulo 2 (docs/capacidades/escolhas-no-capitulo-2.md): o palpite antes de cada figura-chave, com
 *  opções e resposta do projeto, e as figuras que só tocam ou rolam fora da conta das ações. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { eAcao } from "../scripts/ritmo.mjs";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(ler(p));
const referencia = ler("livros/ciclo-de-vida/projeto/referencia.jsonl");
const gabarito = Object.fromEntries(referencia.trim().split("\n").map((l) => JSON.parse(l)).map((c) => [c.id, c.decisao]));

test("o 2.1 abre direto no grafo, sem palpite (padrao-de-caixas.md), e as figuras do capítulo 2 não contam como ação", () => {
  const cap = ler("livros/ciclo-de-vida/capitulos/02-o-primeiro-agente.mdx");
  const s21 = cap.slice(cap.indexOf("## 2.1"), cap.indexOf("## 2.2"));
  assert.doesNotMatch(s21, /<Aposta\b/);
  for (const f of ["RoteiroDoAgente", "FormularioDoAgente", "EnsaioDoAgente", "ProvaDoAgente", "ResultadoDoAgente"]) assert.equal(eAcao(f), false, f);
  assert.match(ler("docs/RITMO.md"), /`ResultadoDoAgente` \(tocam ou rolam/);
});

test("o palpite do 2.2: o texto solto é o da figura, as opções são caixas do grafo real e a resposta é que nenhuma serve", async () => {
  const { SOLTO, QUINTA } = await import("../src/components/livro/roteiro/formulario.ts");
  const d = json("livros/ciclo-de-vida/figuras/texto-solto.json");
  const [m] = d.mensagens;
  assert.equal(m.texto, SOLTO);
  assert.match(m.texto.toLowerCase(), new RegExp(QUINTA));
  const nos = Object.keys(json("livros/ciclo-de-vida/figuras/grafo-02.json").nos);
  assert.ok(m.opcoes.slice(0, -1).every((o) => nos.includes(o)), "as caixas são nós do grafo");
  assert.equal(m.fez, m.opcoes.length - 1);
  assert.match(m.opcoes[m.fez], /^nenhuma/);
});

test("no 2.2, a abertura não entrega a resposta, o palpite vem logo antes do formulário, e o código fica para a 2.5", () => {
  const cap = ler("livros/ciclo-de-vida/capitulos/02-o-primeiro-agente.mdx");
  const s22 = cap.slice(cap.indexOf("## 2.2"), cap.indexOf("## 2.3"));
  const aposta = s22.indexOf("<Aposta dados={textoSolto}"), fig = s22.indexOf("<FormularioDoAgente");
  assert.ok(aposta > 0 && aposta < fig && !/<[A-Z]/.test(s22.slice(aposta + 10, fig)));
  assert.doesNotMatch(s22.slice(0, aposta), /adivinh/, "a abertura não diz que o código teria de adivinhar");
  assert.doesNotMatch(s22, /<Listagem/);
  assert.match(s22, /<Aposta [^>]*ilustracao="Ilustração:/);
});

test("o palpite do 2.4: a decisão e o motivo do desconto são os da gravação, e o gabarito é outro", async () => {
  const { caminhosDaGravacao } = await import("../src/lib/grafoAgente.ts");
  const d = json("livros/ciclo-de-vida/figuras/desconto-r11.json");
  const [m] = d.mensagens;
  const r11 = caminhosDaGravacao(json("livros/ciclo-de-vida/gravacoes/r02-medir.json"), referencia).find((c) => c.id === m.caso);
  assert.equal(m.opcoes[m.fez], r11.decidiu);
  assert.ok(m.porque.includes(`“${r11.motivo}”`), "o motivo, palavra por palavra");
  assert.notEqual(r11.decidiu, gabarito[m.caso]);
  assert.match(m.porque, new RegExp(`O gabarito manda ${gabarito[m.caso]}`));
});

test("os dois bilhetes: as regras da colega são as do 1.4, e o que falta é o que a INSTRUCAO não traz", () => {
  const d = json("livros/ciclo-de-vida/figuras/bilhetes.json");
  const cap1 = ler("livros/ciclo-de-vida/capitulos/01-o-problema-e-o-contrato.mdx");
  const bilhete = cap1.match(/A primeira é um bilhete explicando o trabalho: "([^"]+)"/)[1];
  assert.deepEqual(d.colega.map((r) => r.regra), bilhete.split("; "));
  const instrucao = ler("livros/ciclo-de-vida/projeto/agente.py").match(/^INSTRUCAO = """([\s\S]*?)"""/m)[1].toLowerCase();
  const html = ler("dist/ciclo-de-vida/02-o-primeiro-agente/index.html");
  const fig = html.slice(html.indexOf("data-bilhetes"), html.indexOf("</figure>", html.indexOf("data-bilhetes")));
  for (const r of d.colega) {
    assert.ok(r.regra.includes(r.chave) || r.falta.includes(r.chave), r.chave);
    assert.equal(fig.includes(r.falta), !instrucao.includes(r.chave.toLowerCase()), r.chave);
  }
  assert.ok(fig.includes("Quando a política não diz, não prometa: passe a vez."), "o bilhete do substituto é o do agente.py");
});

test("no 2.4, o palpite do desconto vem antes dos bilhetes; a IDE chama a instrução de bilhete, e o 2.6 liga o desconto", () => {
  const cap = ler("livros/ciclo-de-vida/capitulos/02-o-primeiro-agente.mdx");
  const s24 = cap.slice(cap.indexOf("## 2.4"), cap.indexOf("## 2.5")), s26 = cap.slice(cap.indexOf("## 2.6"));
  assert.ok(s24.indexOf("<ProvaDoAgente") < s24.indexOf("dados={descontoR11}") && s24.indexOf("dados={descontoR11}") < s24.indexOf("<DoisBilhetes"));
  assert.match(s26, /o desconto do 2\.4/);
  const ide = ler("livros/ciclo-de-vida/roteiros/02.json");
  assert.doesNotMatch(ide, /dito em palavras/);
  assert.match(ide, /o bilhete do substituto/);
});
