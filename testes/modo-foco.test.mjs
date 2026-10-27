/** O modo foco, e o sumário que fecha (docs/capacidades/modo-foco.md). Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const pagina = ler("dist/ciclo-de-vida/01-o-problema-e-o-contrato/index.html");
const nav = ler("src/components/livro/Navegacao.astro");
const css = ler("src/components/livro/comandos/comandos.css");

test("as duas escolhas são aplicadas antes de pintar, pelo script do <head>", () => {
  const cabeca = pagina.slice(0, pagina.indexOf("</head>"));
  assert.match(cabeca, /localStorage\.getItem\("fontmar:sumario"\)==="fechado"\)document\.documentElement\.classList\.add\("sumario-fechado"\)/);
  assert.match(cabeca, /localStorage\.getItem\("fontmar:foco"\)==="sim"\)document\.documentElement\.setAttribute\("data-foco",""\)/);
});

test("no computador, o sumário fecha pelo ✕ e reabre pelo ☰ do topo ou da pílula, e o texto volta ao centro", () => {
  assert.match(pagina, /<button type="button" class="topo-sumario" data-abrir aria-controls="sumario"/);
  assert.match(pagina, /class="sm-fechar" data-fechar/);
  assert.match(nav, /html\.sumario-fechado, html\[data-foco\] \{ --sumario: 0px \}/);
  assert.match(nav, /html\.sumario-fechado \.sumario, html\[data-foco\] \.sumario \{ transform: translateX\(-100%\); visibility: hidden \}/);
  assert.match(nav, /gaveta\.matches \? definir\(false\) : fixar\(true\)/, "o ✕ fecha a gaveta no celular e recolhe o sumário no computador");
  assert.match(nav, /if \(!gaveta\.matches\) return fixar\(/, "o ☰ reabre no computador");
  assert.match(css, /html:not\(\.sumario-fechado\) \.cm-pilula \.cm-menu \{ display: none \}/, "o ☰ da pílula volta com o sumário fechado");
});

test("o modo foco: botão no topo, chave nas configurações, Esc para sair, e só o texto na página", () => {
  const comandos = ler("src/components/livro/comandos/Comandos.tsx");
  assert.match(comandos, /className="cm-foco" aria-pressed=\{foco\} onClick=\{\(\) => definirFoco\(!foco\)\}/);
  assert.match(comandos, /role="switch" aria-checked=\{foco\}[^\n]*definirFoco\(!foco\)/);
  assert.match(comandos, /e\.key === "Escape"[^\n]*definirFoco\(false\)/);
  assert.match(css, /html\[data-foco\] \.cm-ide, html\[data-foco\] \.cm-placar-canto, html\[data-foco\] \.cm-trilho, html\[data-foco\] \.cm-circulo \{ display: none \}/);
  assert.match(nav, /html\[data-foco\] \.sumario, html\[data-foco\] \.sm-veu \{ display: none \}/);
});
