/** O nível de cada experimento (docs/capacidades/niveis-dos-experimentos.md). Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { NIVEIS } from "../src/lib/niveis.ts";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const ids = readdirSync(new URL("../experimentos/", import.meta.url)).filter((d) => existsSync(new URL(`../experimentos/${d}/experimento.mdx`, import.meta.url)));
const nivelDe = (id) => ler(`experimentos/${id}/experimento.mdx`).match(/^nivel: "(\w+)"$/m)?.[1];

test("os três níveis dizem o que pedem do leitor, e só esses três existem", () => {
  assert.deepEqual(Object.keys(NIVEIS), ["novato", "intermediario", "avancado"]);
  assert.deepEqual(Object.values(NIVEIS).map((n) => n.degrau), [1, 2, 3]);
  for (const n of Object.values(NIVEIS)) assert.ok(n.pede.split(/\s+/).length >= 6, `${n.nome}: diga o que o nível pede`);
  assert.match(ler("src/content.config.ts"), /nivel: z\.enum\(IDS_DOS_NIVEIS/, "o molde exige o nível");
});

test("cada experimento tem um nível, que aparece no cabeçalho com o que ele pede, na lista e no index.json", () => {
  const lista = ler("dist/experimentos/index.html");
  const json = JSON.parse(ler("dist/experimentos/index.json"));
  assert.ok(ids.length >= 2);
  for (const id of ids) {
    const nivel = nivelDe(id);
    assert.ok(nivel in NIVEIS, `${id}: sem nível`);
    const pagina = ler(`dist/experimentos/${id}/index.html`);
    assert.match(pagina, new RegExp(`data-nivel="${nivel}"`));
    assert.ok(pagina.includes(`Pede ${NIVEIS[nivel].pede}.`), `${id}: o cabeçalho não diz o que o nível pede`);
    assert.match(lista, new RegExp(`href="/experimentos/${id}/"`));
    assert.equal(json.experimentos.find((e) => e.id === id)?.nivel, nivel, `${id}: o index.json não traz o nível`);
  }
  assert.equal(nivelDe("temperatura-zero"), "avancado");
  assert.equal(nivelDe("segundo-cerebro-local"), "intermediario");
});
