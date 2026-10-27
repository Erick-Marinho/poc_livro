/** O vídeo da nota, na introdução (docs/capacidades/a-nota-na-introducao.md, etapa 2): sem termos novos e sem os números do livro. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { baloes, montarNota, SEGUNDOS, T } from "../src/components/livro/nota/nota.ts";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const referencia = ler("livros/ciclo-de-vida/projeto/referencia.jsonl");
const sumario = JSON.parse(ler("livros/ciclo-de-vida/sumario.json"));
const intro = ler("livros/ciclo-de-vida/capitulos/00-introducao.mdx");

test("o total de mensagens é o da prova do livro, e o gráfico tem um capítulo por item do sumário", () => {
  const n = montarNota(referencia, sumario);
  assert.equal(n.total, referencia.split("\n").filter((l) => l.trim()).length);
  assert.deepEqual(n.capitulos, sumario.capitulos.map((c) => c.numero));
  assert.equal(n.acertos, n.acertou.filter(Boolean).length);
  assert.ok(n.barras.some((b, k) => k > 0 && b < n.barras[k - 1]), "o gráfico mostra uma queda");
  assert.ok(n.barras.length < n.capitulos.length, "e capítulos ainda sem nota");
});

test("os balões se sucedem, cobrem o vídeo e falam a língua de quem ainda não abriu o capítulo 1", () => {
  const bs = baloes(montarNota(referencia, sumario));
  bs.forEach((b, i) => { if (i) assert.equal(b.de, bs[i - 1].ate); });
  assert.ok(bs.at(-1).ate >= SEGUNDOS);
  assert.ok(T.corrige(19) + 0.3 < T.grafico, "a correção termina antes do gráfico");
  for (const b of bs) assert.doesNotMatch(b.texto, /régua|contrato|decis|abrir chamado|passar a vez|recusar/i, b.texto);
});

test("a introdução explica a nota com o vídeo, sem a prova pequena e sem os números do livro", () => {
  const saidas = JSON.parse(ler("livros/ciclo-de-vida/saidas.json"));
  const secao = intro.slice(intro.indexOf("## A nota"), intro.indexOf("## Como ler"));
  assert.match(secao, /<NotaDoLivro [^>]*ilustracao="Ilustração:/);
  assert.match(secao, /<PareEPense pergunta="A nota caiu/);
  assert.match(secao, /data-abrir-placar/);
  assert.doesNotMatch(intro, /CorrijaAProva|\*\*régua\*\*/);
  for (const id of ["nota-de-partida", "r02-medir"]) {
    const linha = saidas[id].saida.map(([l]) => l).find((l) => /^nota /.test(l));
    const [, n, t, p] = linha.match(/(\d+) de (\d+) \((\d+%)\)/);
    assert.doesNotMatch(intro, new RegExp(`${n} de ${t}|${p.replace("%", "\\s*%")}`), `a introdução mostra a nota de ${id}`);
  }
  assert.match(ler("src/components/livro/comandos/Comandos.tsx"), /closest\?\.\("\[data-abrir-placar\]"\)\)[^\n]*setPlacarAberto\(true\)/);
});
