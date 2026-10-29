/** O experimento num Markdown só, em /experimentos/<experimento>.md, para os que pedem `markdown: true` no topo do .mdx
 *  (docs/capacidades/markdown-dos-experimentos.md). */
import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { markdownDoExperimento } from "../../lib/markdownExperimento";
import { resultadosDo, type Saidas } from "../../lib/resultados";
import { ENDERECO } from "../../lib/site";

/** Fica de fora do projeto: o que é da máquina (pastas com ponto, caches) e o que é grande demais para ler (a coleta
 *  gravada, o uv.lock). */
const GRANDE = 50_000;
const ORDEM = ["toml", "json", "jsonl", "md", "py"];

export const getStaticPaths = (async () =>
  (await getCollection("experimentos")).filter((e) => e.data.markdown).map((experimento) => ({ params: { experimento: experimento.id }, props: { experimento } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { id, data, body } = props.experimento;
  const pasta = join("experimentos", id);
  const json = (p: string) => JSON.parse(readFileSync(join(pasta, p), "utf8"));
  const importados = Object.fromEntries([...(body ?? "").matchAll(/^import (\w+) from "\.\/(.+\.json)";$/gm)].map(([, nome, p]) => [nome, json(p)]));
  const saidas: Saidas = json("saidas.json");

  const arquivos: string[] = [];
  const andar = (dir: string) => readdirSync(dir).filter((n) => !n.startsWith(".") && n !== "__pycache__").forEach((n) => {
    const p = join(dir, n);
    statSync(p).isDirectory() ? andar(p) : arquivos.push(relative(join(pasta, "projeto"), p));
  });
  andar(join(pasta, "projeto"));
  const tamanho = (c: string) => statSync(join(pasta, "projeto", c)).size;
  const fora = arquivos.filter((c) => c === "uv.lock" || tamanho(c) > GRANDE);
  const ext = (c: string) => ORDEM.indexOf(c.split(".").pop()!);
  const projeto = arquivos.filter((c) => !fora.includes(c)).sort((a, b) => ext(a) - ext(b) || a.localeCompare(b))
    .map((caminho) => ({ caminho, texto: readFileSync(join(pasta, "projeto", caminho), "utf8") }));
  const deFora = fora.length ? `Ficam de fora, pelo tamanho: ${fora.map((c) => `\`${c}\` (${Math.round(tamanho(c) / 1024)} KB)`).join(" e ")}.` : "";

  const md = markdownDoExperimento({ id, origem: ENDERECO, dados: data, corpo: body ?? "", importados, resultados: resultadosDo(id, data.resultado, saidas), saidas, projeto, deFora });
  return new Response(md, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
};
