/** A torre do 1.1 como marcador do capítulo 2 (docs/capacidades/torre-como-marcador.md). Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { andaresDaTorre } from "../src/components/livro/escala/escala.ts";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(ler(p));
const dados = json("livros/ciclo-de-vida/figuras/quem-decide.json");
const aposta = json("livros/ciclo-de-vida/figuras/escala.json");

test("os andares são os da torre do 1.1, e o próximo fica acima de onde o agente está", () => {
  const a = andaresDaTorre(dados, aposta, "roteador", "agente");
  assert.deepEqual(a.map((x) => x.nome), aposta.mensagens[0].opcoes);
  assert.deepEqual(a.filter((x) => x.aqui).map((x) => x.nome), ["roteador"]);
  assert.deepEqual(a.filter((x) => x.proximo).map((x) => x.nome), ["agente"]);
  assert.throws(() => andaresDaTorre(dados, aposta, "agente", "roteador"), /acima/);
  assert.throws(() => andaresDaTorre(dados, aposta, "classificador"), /não é um andar/);
});

test("no capítulo 2, a torre fecha o 2.1 no roteador e o 2.6 com o agente como próximo andar, no capítulo 3", () => {
  const cap = ler("livros/ciclo-de-vida/capitulos/02-o-primeiro-agente.mdx");
  const s21 = cap.slice(cap.indexOf("## 2.1"), cap.indexOf("## 2.2")), s26 = cap.slice(cap.indexOf("## 2.6"));
  assert.ok(s21.indexOf("<PareEPense") < s21.indexOf("<AndarDaTorre"), "no 2.1, depois do Pare e pense");
  assert.match(s21, /<AndarDaTorre [^>]*aqui="roteador"/);
  assert.doesNotMatch(s21, /<AndarDaTorre [^>]*proximo=/);
  assert.match(s26, /<AndarDaTorre [^>]*aqui="roteador" proximo="agente" capitulo=\{3\}/);
  assert.ok(s26.indexOf("<AndarDaTorre") < s26.indexOf("<PontoDeVolta"));
  const html = ler("dist/ciclo-de-vida/02-o-primeiro-agente/index.html");
  assert.equal([...html.matchAll(/data-andar-torre/g)].length, 2);
  assert.equal([...html.matchAll(/class="at-andar[^"]*at-aqui/g)].length, 2);
  assert.match(html, /roteador/, "o capítulo 2 diz que o agente dele é um roteador");
});
