/** A prova do substituto, no 2.4 (docs/capacidades/capitulo-2-em-cenas.md, etapa 4): a régua, sem entregar a nota do agente. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { montarProva, baloes, SEGUNDOS } from "../src/components/livro/roteiro/prova.ts";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const saidas = JSON.parse(ler("livros/ciclo-de-vida/saidas.json"));
const entrada = { referencia: ler("livros/ciclo-de-vida/projeto/referencia.jsonl"), baseline: saidas["nota-de-partida"] };

test("as 20 perguntas e o gabarito vêm da referência, e a conta é a do baseline.py gravado", () => {
  const p = montarProva(entrada);
  assert.equal(p.total, 20);
  assert.deepEqual([p.acertos, p.porcento], [5, 25]);
  const outra = { ...entrada.baseline, saida: [["nota de partida: 6 de 20 (30%)", ""]] };
  assert.throws(() => montarProva({ ...entrada, baseline: outra }), /a figura conta 5 de 20/);
});

test("nenhum balão e nada da figura entregam a nota do agente: ela é o palpite da IDE", () => {
  const medir = saidas["r02-medir"].saida.map(([l]) => l).find((l) => l.startsWith("nota do agente"));
  const nota = medir.match(/(\d+) de 20 \((\d+)%\)/);
  const bs = baloes(montarProva(entrada));
  for (const b of bs) assert.ok(!b.texto.includes(`${nota[1]} de 20`) && !b.texto.includes(`${nota[2]}%`), b.texto);
  assert.match(bs.at(-1).texto, /palpite/);
  assert.ok(bs.at(-1).ate >= SEGUNDOS);
  const fonte = ler("src/components/livro/roteiro/ProvaAnimado.tsx");
  assert.ok(!fonte.includes("r02-medir") && !fonte.includes("gravacao"), "a animação não lê a gravação do agente");
});

test("na página, o 2.4 tem a prova, e não mais o pare e pense do palpite", () => {
  const html = ler("dist/ciclo-de-vida/02-o-primeiro-agente/index.html");
  const secao = html.slice(html.indexOf('<h2 id="s2-4"'), html.indexOf('<h2 id="s2-5"'));
  assert.match(secao, /data-prova/);
  assert.doesNotMatch(secao, /Ver a resposta/);
});
