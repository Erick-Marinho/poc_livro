// O áudio de um experimento (docs/capacidades/audio-nos-experimentos.md): o arquivo existe em public/audios/, é MP3, vai
// para o build, e a página monta o player sem baixar o áudio inteiro antes do play.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";

const raiz = new URL("../", import.meta.url);
const experimentos = readdirSync(new URL("experimentos/", raiz)).filter((e) => existsSync(new URL(`experimentos/${e}/experimento.mdx`, raiz)));
const audioDe = (e) => readFileSync(new URL(`experimentos/${e}/experimento.mdx`, raiz), "utf8").match(/^audio:\n {2}arquivo: "(.*)"$/m)?.[1];
const ehMp3 = (b) => b.subarray(0, 3).toString("latin1") === "ID3" || (b[0] === 0xff && (b[1] & 0xe0) === 0xe0);

test("o kv-cache tem áudio, e o pausa-e-fluxo não", () => {
  assert.equal(audioDe("kv-cache"), "/audios/kv-cache-teste.mp3");
  assert.equal(audioDe("pausa-e-fluxo"), undefined);
});

for (const e of experimentos) {
  const arquivo = audioDe(e);
  if (!arquivo) continue;
  test(`${e}: o áudio existe, é MP3, vai para o build e a página monta o player`, () => {
    const fonte = new URL(`public${arquivo}`, raiz);
    assert.ok(existsSync(fonte), `falta public${arquivo}`);
    assert.ok(ehMp3(readFileSync(fonte)), `public${arquivo} não é MP3`);
    assert.ok(existsSync(new URL(`dist${arquivo}`, raiz)), `o build não copiou ${arquivo}`);
    const pagina = readFileSync(new URL(`dist/experimentos/${e}/index.html`, raiz), "utf8");
    assert.match(pagina, new RegExp(`<audio controls preload="metadata" src="${arquivo}"`));
    assert.match(pagina, /data-vel="1\.25"/);
    assert.match(pagina, /Ouça este experimento\./);
  });
}

test("sem áudio, a página não tem player", () => {
  for (const e of experimentos.filter((x) => !audioDe(x))) {
    const pagina = readFileSync(new URL(`dist/experimentos/${e}/index.html`, raiz), "utf8");
    assert.doesNotMatch(pagina, /<audio/, `${e} não declarou áudio`);
  }
});
