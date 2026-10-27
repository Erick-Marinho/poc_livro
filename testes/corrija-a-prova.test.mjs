/** A nota, explicada na introdução (docs/capacidades/a-nota-na-introducao.md): a prova pequena, sem os números do livro. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { casos, DECISOES } from "../src/lib/referencia.ts";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const referencia = ler("livros/ciclo-de-vida/projeto/referencia.jsonl");
const prova = JSON.parse(ler("livros/ciclo-de-vida/figuras/prova-pequena.json"));
const intro = ler("livros/ciclo-de-vida/capitulos/00-introducao.mdx");
const pagina = ler("dist/ciclo-de-vida/00-introducao/index.html");

test("a prova pequena usa perguntas e gabarito do arquivo de referência, com acerto e erro, e decisões do contrato", () => {
  const lista = prova.mensagens.map((m) => ({ ...casos(referencia, [m.caso], "teste")[0], decidiu: m.decidiu }));
  lista.forEach((c) => assert.ok(DECISOES[c.decidiu], `${c.id}: "${c.decidiu}" não é decisão do contrato`));
  const certos = lista.filter((c) => c.decidiu === c.decisao).length;
  assert.ok(certos > 0 && certos < lista.length);
  for (const c of lista) assert.match(pagina, new RegExp(`data-caso="${c.id}" data-acertou="${c.decidiu === c.decisao}"`));
  assert.match(pagina, new RegExp(`${certos} de ${lista.length}, ${Math.round((100 * certos) / lista.length)}%`));
});

test("a introdução explica a nota sem mostrar a nota de partida nem a do capítulo 2", () => {
  const saidas = JSON.parse(ler("livros/ciclo-de-vida/saidas.json"));
  const secao = intro.slice(intro.indexOf("## A nota"), intro.indexOf("## Como ler"));
  assert.match(secao, /<CorrijaAProva /);
  assert.match(secao, /\*\*régua\*\*/);
  assert.match(secao, /<PareEPense pergunta="A nota do seu agente subiu/);
  for (const id of ["nota-de-partida", "r02-medir"]) {
    const linha = saidas[id].saida.map(([l]) => l).find((l) => /^nota /.test(l));
    const [, n, t, p] = linha.match(/(\d+) de (\d+) \((\d+%)\)/);
    assert.doesNotMatch(intro, new RegExp(`${n} de ${t}|${p.replace("%", "\\s*%")}`), `a introdução mostra a nota de ${id}`);
  }
});

test("o botão do fim da prova abre o placar de verdade", () => {
  assert.match(pagina, /data-abrir-placar/);
  assert.match(ler("src/components/livro/comandos/Comandos.tsx"), /closest\?\.\("\[data-abrir-placar\]"\)\)[^\n]*setPlacarAberto\(true\)/);
});
