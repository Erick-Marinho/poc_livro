import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { once } from "node:events";
import { watch } from "chokidar";
import config from "../astro.config.mjs";

test("o dev acompanha texto e gravações, sem monitorar ambientes Python e cópias geradas", async () => {
  const pasta = await mkdtemp(join(tmpdir(), "livro-watch-"));
  let watcher;
  try {
    const gerados = ["experimentos/temperatura-zero/projeto/.venv/lib/torch", ".leitor/projeto", ".tunel/livros", "experimentos/temperatura-zero/projeto/__pycache__"];
    const conteudo = "experimentos/temperatura-zero";
    for (const p of [...gerados, conteudo]) {
      await mkdir(join(pasta, p), { recursive: true });
      await writeFile(join(pasta, p, "arquivo"), "gerado");
    }
    for (const p of ["experimento.mdx", "saidas.json"]) await writeFile(join(pasta, conteudo, p), "antes");
    watcher = watch(pasta, { ...config.vite.server.watch, ignoreInitial: true });
    await once(watcher, "ready");
    const acompanhados = Object.keys(watcher.getWatched());
    for (const p of gerados) assert.ok(!acompanhados.includes(join(pasta, p)), p);
    assert.ok(acompanhados.includes(join(pasta, conteudo)));
    for (const p of ["experimento.mdx", "saidas.json"]) {
      const arquivo = join(pasta, conteudo, p);
      const mudou = once(watcher, "change", { signal: AbortSignal.timeout(5000) });
      await writeFile(arquivo, "depois");
      assert.equal((await mudou)[0], arquivo);
    }
  } finally {
    await watcher?.close();
    await rm(pasta, { recursive: true, force: true });
  }
});
