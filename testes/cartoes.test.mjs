/** As perguntas em cartões, uma por vez (docs/capacidades/capitulo-1-dinamicas.md, etapa 5). */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

test("o Classificador, o PrimeiroDia e a Aposta passam a lista para os cartões, cada um com a sua marca de respondido", () => {
  const marcas = { Classificador: '"feito"', PrimeiroDia: '"feito"', Aposta: '"feita"' };
  for (const [nome, marca] of Object.entries(marcas)) {
    const c = ler(`src/components/livro/${nome}.astro`);
    assert.match(c, /import \{ emCartoes \} from "\.\.\/\.\.\/lib\/cartoes"/, `${nome} não usa os cartões`);
    assert.match(c, new RegExp(`emCartoes\\(fig, [^\\n]*classList\\.contains\\(${marca}\\)\\)`), `${nome}: a marca de respondido não é ${marca}`);
  }
  assert.match(ler("src/components/livro/Classificador.astro"), /cartoes\.ir\(0\)/, "recomeçar volta ao primeiro cartão");
});

test("só o cartão de agora aparece, e o modo direto mostra a lista inteira, sem a navegação", () => {
  const css = ler("src/styles/cartoes.css");
  assert.match(css, /\.cartoes-trilho > :not\(\.cartao-atual\) \{ display: none !important \}/);
  assert.match(css, /html\[data-direto\] \.cartoes-trilho > :not\(\.cartao-atual\) \{ display: block !important \}/);
  assert.match(css, /html\[data-direto\] \.cartoes-nav \{ display: none \}/);
});
