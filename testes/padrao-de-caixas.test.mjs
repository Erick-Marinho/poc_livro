/** Quantas caixas de pergunta cabem num capítulo (docs/RITMO.md, "Quantas caixas por capítulo";
 *  docs/capacidades/padrao-de-caixas.md): só a página, sem a IDE. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { eAcao } from "../scripts/ritmo.mjs";

const pasta = new URL("../livros/ciclo-de-vida/capitulos/", import.meta.url);
const TETO = { PareEPense: 3, Aposta: 2, dinamicas: 3, Exercicio: 1, total: 9 };
const FORA = new Set(["PareEPense", "Aposta", "Exercicio", "IdeCapitulo", "Rascunho"]);

test("cada capítulo tem até 3 Pare e pense, 2 palpites, 3 dinâmicas próprias e 1 exercício: no máximo 9 caixas", () => {
  for (const f of readdirSync(pasta).filter((x) => x.endsWith(".mdx"))) {
    const caixas = [...readFileSync(new URL(f, pasta), "utf8").matchAll(/^<([A-Z][A-Za-z]*)\b([^\n]*)/gm)]
      .map(([, nome, resto]) => nome === "GrafoAgente" ? (/modo="caminhos"/.test(resto) ? nome : null) : nome)
      .filter((nome) => nome && eAcao(nome) && nome !== "IdeCapitulo" && nome !== "Rascunho");
    const conta = (n) => caixas.filter((x) => x === n).length;
    const dinamicas = caixas.filter((x) => !FORA.has(x));
    assert.ok(conta("PareEPense") <= TETO.PareEPense, `${f}: ${conta("PareEPense")} Pare e pense`);
    assert.ok(conta("Aposta") <= TETO.Aposta, `${f}: ${conta("Aposta")} palpites`);
    assert.ok(dinamicas.length <= TETO.dinamicas, `${f}: ${dinamicas.length} dinâmicas próprias (${dinamicas.join(", ")})`);
    assert.ok(conta("Exercicio") <= TETO.Exercicio, `${f}: ${conta("Exercicio")} exercícios`);
    assert.ok(caixas.length <= TETO.total, `${f}: ${caixas.length} caixas`);
  }
});
