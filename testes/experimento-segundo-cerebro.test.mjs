/** O experimento do segundo cérebro: as figuras dizem o que as notas e o rastro gravado dizem. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse } from "node-html-parser";

const html = parse(readFileSync(new URL("../dist/experimentos/segundo-cerebro-local/index.html", import.meta.url), "utf8"));
const ilha = (nome) => html.querySelectorAll("astro-island").find((i) => (i.getAttribute("component-url") ?? "").includes(nome))?.getAttribute("props") ?? "";
const saidas = JSON.parse(readFileSync(new URL("../experimentos/segundo-cerebro-local/saidas.json", import.meta.url), "utf8"));

test("o cofre no tempo: três notas dizem que a entrega é 14/11 e uma diz 21/11; entregar as telas não conta", () => {
  const props = ilha("CofreNoTempo");
  const prazos = [...props.matchAll(/prazo&quot;:\[0,&quot;(\d{2}\/\d{2})|prazo":\[0,"(\d{2}\/\d{2})/g)].map((m) => m[1] ?? m[2]);
  assert.deepEqual(prazos.toSorted(), ["14/11", "14/11", "14/11", "21/11"]);
});

/* as props de uma ilha, como o Astro serializa: cada valor vem como [tipo, valor] (0: valor ou objeto; 1: lista) */
const valor = (v) => !Array.isArray(v) ? v : v[0] === 1 ? v[1].map(valor)
  : v[1] && typeof v[1] === "object" ? Object.fromEntries(Object.entries(v[1]).map(([k, x]) => [k, valor(x)])) : v[1];
const propsDa = (nome) => {
  const bruto = ilha(nome).replaceAll("&quot;", '"').replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&#39;", "'").replaceAll("&amp;", "&");
  return Object.fromEntries(Object.entries(JSON.parse(bruto || "{}")).map(([k, x]) => [k, valor(x)]));
};

test("o caminho da pergunta é o vídeo do Remotion, e os números dele são os das saídas gravadas", () => {
  const p = propsDa("FiguraCaminhoVideo");
  const nota = (id) => saidas[id].saida.map(([l]) => l).find((l) => l.startsWith("nota:"));
  assert.equal(p.bruto, saidas["rastro-prazo"].saida[0][0], "a figura 1 não é o vídeo, ou o rastro dele não é o gravado");
  assert.equal(p.comando, saidas["rastro-prazo"].comando);
  assert.deepEqual(p.regua, { sem: nota("sc-nota-ingenua"), com: nota("sc-nota"), modelo: nota("sc-nota-modelo") });
});

test("o caminho da pergunta: sem a data, 14/11 de uma nota velha; com ela, 21/11, com a velha ao lado", () => {
  const r = JSON.parse(saidas["rastro-prazo"].saida[0][0]);
  assert.match(r.sem_data.frase, /14\/11/);
  assert.match(r.com_data.frase, /21\/11/);
  assert.match(r.com_data.antes.frase, /14\/11/);
  assert.equal(r.frases.filter((f) => f.palavras === r.topo).length, 4);
});

test("o palpite da abertura: as três promessas, sem adiantar as notas da régua nem as datas do prazo", () => {
  const promessas = JSON.parse(readFileSync(new URL("../experimentos/segundo-cerebro-local/promessas.json", import.meta.url), "utf8"));
  const nota = (id) => saidas[id].saida.map(([l]) => l).find((l) => l.startsWith("nota:")).match(/(\d+) de (\d+)/)[0];
  const porques = promessas.mensagens.map((m) => m.porque).join(" ");
  for (const id of ["sc-nota-ingenua", "sc-nota", "sc-nota-modelo"]) assert.ok(!porques.includes(nota(id)), `o palpite adianta ${nota(id)} (${id})`);
  assert.doesNotMatch(porques, /\d{2}\/\d{2}/, "o palpite adianta uma data do prazo");
  const r = JSON.parse(saidas["rastro-prazo"].saida[0][0]);
  assert.match(r.sem_data.frase, /14\/11/); assert.match(r.com_data.frase, /21\/11/);
  const apo = html.querySelector("[data-aposta]");
  assert.equal(apo.querySelectorAll(".apo-msg").length, 3);
  assert.match(apo.querySelector(".apo-fez").text, /^O experimento mostrou: vale só em parte\./);
  assert.match(apo.getAttribute("data-alguns"), /\{n\} de \{total\}/);
});

test("as pilhas do fim: três peças ficam na máquina, três saem dela, e a explicação só aparece depois", () => {
  const pil = html.querySelector("[data-pilhas]");
  const cartas = pil.querySelectorAll(".pil-carta").map((c) => c.getAttribute("data-decisao"));
  assert.deepEqual(cartas.toSorted(), ["fica", "fica", "fica", "sai", "sai", "sai"]);
  assert.deepEqual(pil.querySelectorAll(".pil-grupo b").map((b) => b.text), ["fica na sua máquina", "sai dela"]);
  assert.ok(pil.querySelector("[data-revelado]").hasAttribute("hidden"));
  assert.match(pil.querySelector(".pil-explica").text, /localhost/);
});

test("o vídeo do caminho para nas frases que empatam: a escolha e a régua ficam para a IDE", async () => {
  const { T, QUADRO, montar, visiveis } = await import("../src/components/livro/cerebro/caminho.ts");
  assert.equal(QUADRO.duracao, T.sem * QUADRO.fps);
  const p = { bruto: saidas["rastro-prazo"].saida[0][0], comando: saidas["rastro-prazo"].comando, regua: { sem: "nota: 7 de 10", com: "nota: 9 de 10" } };
  assert.ok(visiveis(montar(p)).every((x) => x.em < T.sem && !/régua|vale a/i.test(x.texto)));
  assert.equal(montar(p).passos.length, 6, "o desenho guarda todas as etapas, para saber onde cada uma começa");
});

test("o inesperado diz só o que está gravado: o modelo tirou 10 de 10, e a resposta da cliente passou dizendo outra coisa", () => {
  const mdx = readFileSync(new URL("../experimentos/segundo-cerebro-local/experimento.mdx", import.meta.url), "utf8");
  const achado = mdx.match(/^achado: "(.*)"$/m)[1];
  assert.doesNotMatch(achado, /acento/, "sem prova na página, o caso dos acentos saiu");
  const linhas = saidas["sc-nota-modelo"].saida.map(([l]) => l);
  const nota = linhas.find((l) => l.startsWith("nota:")).match(/\d+ de \d+/)[0];
  assert.ok(achado.includes(`tirou ${nota}`));
  assert.ok(linhas.some((l) => l.startsWith("✓ Quem é a cliente do piloto?") && /a Gerente/.test(l)), "a resposta da cliente que passou é a gravada");
});

test("no celular, o caminho tem um desenho em pé, com as mesmas três cenas", () => {
  const ilha = readFileSync(new URL("../src/components/livro/cerebro/FiguraCaminhoVideo.tsx", import.meta.url), "utf8");
  assert.match(ilha, /matchMedia\("\(max-width: 640px\)"\)/);
  assert.match(ilha, /component=\{estreito \? CaminhoEstreito : CaminhoDaPergunta\}/);
  const est = readFileSync(new URL("../src/components/livro/cerebro/CaminhoEstreito.tsx", import.meta.url), "utf8");
  assert.match(est, /export const ESTREITO = \{ largura: 540, altura: 960 \}/);
  assert.match(est, /visiveis\(m\)/, "o estreito usa os mesmos passos visíveis do largo");
});
