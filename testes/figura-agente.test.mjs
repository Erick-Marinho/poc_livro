/** A figura do agente no prefácio: o vídeo recebe os cenários do contrato e cabe em 45 s. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse } from "node-html-parser";
import { montarCenarios } from "../src/components/livro/agente/cenarios.ts";
import { quadroDoVideo } from "../src/components/livro/agente/tempos.ts";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(ler(p));
const livro = "livros/ciclo-de-vida/";
const html = parse(ler("dist/ciclo-de-vida/00-prefacio/index.html"));
/* as props de uma ilha, como o Astro serializa: cada valor vem como [tipo, valor] (0: valor ou objeto; 1: lista) */
const valor = (v) => !Array.isArray(v) ? v : v[0] === 1 ? v[1].map(valor)
  : v[1] && typeof v[1] === "object" ? Object.fromEntries(Object.entries(v[1]).map(([k, x]) => [k, valor(x)])) : v[1];
const ilha = html.querySelectorAll("astro-island").find((i) => (i.getAttribute("component-url") ?? "").includes("FiguraAgenteVideo"));
const props = ilha && Object.fromEntries(Object.entries(JSON.parse(ilha.getAttribute("props").replaceAll("&quot;", '"').replaceAll("&amp;", "&")))
  .map(([k, x]) => [k, valor(x)]));
const contrato = ler(`${livro}projeto/referencia.jsonl`).split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l));

test("a figura do prefácio é o vídeo, com um cenário para cada decisão, e as decisões são as do contrato", () => {
  assert.ok(props, "a figura P.1 não é o vídeo");
  assert.deepEqual(props.cenarios.map((c) => c.caso), ["R01", "R12", "R09", "R16"]);
  assert.deepEqual(props.cenarios.map((c) => c.decisao).toSorted(), ["abrir_chamado", "passar", "recusar", "responder"]);
  for (const c of props.cenarios) assert.equal(c.decisao, contrato.find((x) => x.id === c.caso).decisao, c.caso);
  assert.equal(props.loja, json(`${livro}projeto/dados/loja.json`).nome);
});

test("o vídeo cabe em 45 segundos", () => {
  const q = quadroDoVideo({ cenarios: props.cenarios, loja: props.loja });
  assert.ok(q.duracao / q.fps <= 45, `o vídeo tem ${(q.duracao / q.fps).toFixed(1)} s`);
});

test("um roteiro que contradiz o contrato não monta a figura", () => {
  const roteiro = json(`${livro}figuras/agente.json`);
  const entrada = { roteiro, referencia: ler(`${livro}projeto/referencia.jsonl`), clientes: json(`${livro}projeto/dados/clientes.json`),
    pedidos: json(`${livro}projeto/dados/pedidos.json`), politica: ler(`${livro}projeto/dados/politica.md`) };
  assert.equal(montarCenarios(entrada).length, 4);
  const trocado = structuredClone(roteiro);
  trocado.cenarios[1].passos.find((p) => p.no === "decisao").escolha = "responder";
  assert.throws(() => montarCenarios({ ...entrada, roteiro: trocado }), /R12: escolha "responder" diverge/);
});
