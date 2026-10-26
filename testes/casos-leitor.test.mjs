/** Casos pessoais: exercitar o mesmo contrato sem alterar a régua oficial. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const marco = new URL("../livros/ciclo-de-vida/marcos/cap-01/", import.meta.url);

test("casos pessoais somam à nota opcional e passam pelas mesmas regras, preservando os 20 oficiais", () => {
  const pasta = mkdtempSync(join(tmpdir(), "casos-leitor-"));
  try {
    cpSync(marco, pasta, { recursive: true, filter: (p) => !/(^|\/)(\.venv|__pycache__|\.pytest_cache)(\/|$)/.test(String(p)) });
    const rodar = (...args) => {
      const r = spawnSync("uv", ["run", "--frozen", ...args], { cwd: pasta, encoding: "utf8",
        env: { ...process.env, UV_LINK_MODE: "copy", PYTHONDONTWRITEBYTECODE: "1" } });
      assert.ifError(r.error);
      return { status: r.status, texto: r.stdout + r.stderr };
    };
    const oficial = readFileSync(join(pasta, "referencia.jsonl"), "utf8");
    assert.match(rodar("python", "baseline.py").texto, /5 de 20 \(25%\)/);
    const referencia = oficial.trim().split("\n").map(JSON.parse);
    const extras = ["R02", "R10", "R11", "R16", "R12"].map((id, i) => ({
      ...referencia.find((c) => c.id === id), id: `R${21 + i}`,
    }));
    extras[4] = { ...extras[4], pedido: "BT-1005", email: "carla.mendes@exemplo.test",
      pergunta: "Quero saber do BT-1005. carla.mendes@exemplo.test", motivo: "o pedido é de Diego, não de Carla" };
    const gravar = () => writeFileSync(join(pasta, "meus-casos.jsonl"), extras.map((c) => JSON.stringify(c)).join("\n") + "\n");
    gravar();
    assert.equal(rodar("pytest", "-q").status, 0);
    assert.match(rodar("python", "baseline.py").texto, /5 de 20 \(25%\)/);
    const somada = rodar("python", "baseline.py", "meus-casos.jsonl");
    assert.equal(somada.status, 0, somada.texto);
    assert.match(somada.texto, /6 de 25 \(24%\)/);
    assert.match(somada.texto, /recusar\s+0 de\s+7/);
    assert.equal(readFileSync(join(pasta, "referencia.jsonl"), "utf8"), oficial);
    extras[4].decisao = "responder";
    gravar();
    const invalido = rodar("pytest", "-q");
    assert.equal(invalido.status, 1, invalido.texto);
    assert.match(invalido.texto, /R25: o e-mail não é do dono do pedido/);
  } finally {
    rmSync(pasta, { recursive: true, force: true });
  }
});
