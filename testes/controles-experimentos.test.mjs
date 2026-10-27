/** Os experimentos com os controles do livro, e a pílula que sai da frente ao rolar
 *  (docs/capacidades/controles-nos-experimentos.md). Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const nomes = readdirSync(new URL("../experimentos/", import.meta.url)).filter((n) => !n.startsWith("."));

test("cada experimento tem o sumário com todos os experimentos, o topo do livro e a pílula com os vizinhos", () => {
  for (const n of nomes) {
    const html = ler(`dist/experimentos/${n}/index.html`);
    assert.match(html, /<aside id="sumario" class="sumario"/, `${n}: sem o sumário`);
    for (const outro of nomes) assert.ok(html.includes(`href="/experimentos/${outro}/"`), `${n}: o sumário não leva a ${outro}`);
    assert.match(html, /class="sm-item atual"/, `${n}: o atual não está marcado`);
    assert.match(html, /id="topo-comandos"/, `${n}: sem o lugar do foco e da IDE no topo`);
    assert.match(html, /<span id="onde">/, `${n}: o topo não diz a seção`);
    assert.ok(html.includes("Comandos"), `${n}: sem a pílula e as configurações`);
    assert.match(html, /href="#o-que-se-testa"[\s\S]*href="#o-que-deu"/, `${n}: o sumário não tem as seções do molde`);
  }
});

test("a pílula se recolhe ao rolar e volta ao toque, sem guardar a escolha", () => {
  const c = ler("src/components/livro/comandos/Comandos.tsx");
  assert.match(c, /const \[lendo, setLendo\] = useState\(false\)/);
  assert.match(c, /addEventListener\("scroll", rolou/);
  assert.match(c, /\{!recolhida && !licenca && !lendo && \(/, "a pílula some enquanto o leitor lê");
  assert.match(c, /onClick=\{\(\) => \{ setLicenca\(false\); setLendo\(false\);/, "o toque no círculo a traz de volta");
  assert.doesNotMatch(c.slice(c.indexOf("const rolou"), c.indexOf("const rolou") + 200), /guardar\(/, "rolar não guarda nada");
});
