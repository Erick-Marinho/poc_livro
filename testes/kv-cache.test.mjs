/** O corpus do experimento do KV cache (docs/capacidades/experimento-kv-cache.md), congelado antes de medir. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";

const projeto = new URL("../experimentos/kv-cache/projeto/", import.meta.url);
const origem = new URL("../experimentos/pausa-e-fluxo/projeto/dados/", import.meta.url);
const casos = readFileSync(new URL("casos.jsonl", projeto), "utf8").trim().split("\n").map((l) => JSON.parse(l));
/* o que o modelo lê: o material do regulamento, nesta ordem, e a pergunta no fim */
const texto = (c) => [...c.material.map((m) => readFileSync(new URL(`dados/${m}`, projeto), "utf8")), `Pergunta: ${c.pergunta}`].join("\n\n");
const palavras = (s) => s.split(/\s+/).filter(Boolean).length;

test("dois casos, a mesma pergunta: a longa lê o regulamento inteiro antes dela", () => {
  assert.deepEqual(casos.map((c) => c.id), ["curta", "longa"]);
  assert.equal(new Set(casos.map((c) => c.pergunta)).size, 1, "a pergunta é a mesma nos dois");
  for (const c of casos) for (const m of c.material) assert.ok(existsSync(new URL(`dados/${m}`, projeto)), `${c.id}: falta dados/${m}`);
  const [curta, longa] = casos.map((c) => palavras(texto(c)));
  assert.ok(longa >= 40 * curta, `a longa lê ao menos 40 vezes a curta: ${curta} e ${longa} palavras`);
});

test("o regulamento é o do pausa-e-fluxo, byte a byte, e diz que é inventado", () => {
  const nomes = readdirSync(origem).sort();
  assert.deepEqual(readdirSync(new URL("dados/", projeto)).sort(), nomes);
  for (const n of nomes) assert.ok(readFileSync(new URL(`dados/${n}`, projeto)).equals(readFileSync(new URL(n, origem))), `dados/${n} difere do pausa-e-fluxo`);
  assert.match(texto(casos[1]), /\(condomínio inventado\)/);
});

import { ANOTACOES, baloes, duracao, FPS, JORNADA, montarJornada, montarKv, palavraEm } from "../src/components/livro/kv/kv.ts";

const kv = montarKv(JSON.parse(readFileSync(new URL("../experimentos/kv-cache/figuras/kv.json", import.meta.url), "utf8")));

for (const [nome, f, cenas] of [["da jornada", JORNADA, 6], ["da atendente", ANOTACOES, 6]]) {
  test(`a figura ${nome}: ${cenas} cenas em até 45 s, um balão curto por cena, sem número nem nome técnico`, () => {
    assert.equal(f.cenas.length, cenas);
    assert.ok(duracao(f) / FPS <= 45);
    f.cenas.forEach((c, i) => assert.ok((f.cenas[i + 1]?.de ?? f.segundos) - c.de <= 8, `${c.nome}: até 8 s por cena (docs/RITMO.md)`));
    f.cenas.forEach((c, i) => { if (i) assert.ok(c.de > f.cenas[i - 1].de); });
    const bs = baloes(f);
    assert.equal(bs.length, f.cenas.length, "um balão por cena");
    bs.forEach((b, i) => { if (i) assert.equal(b.de, bs[i - 1].ate); });
    assert.ok(bs.at(-1).ate >= f.segundos, "o último balão fica até o fim");
    assert.equal(f.resumos.length, f.cenas.length - 1, "um resumo por cena, menos a última");
    for (const s of [...bs.map((b) => b.texto), ...f.resumos, ...(f.fecho ? [f.fecho] : [])]) {
      assert.ok(s.split(/\s+/).length <= 14, `curto demais para ler de uma vez? "${s}"`);
      assert.doesNotMatch(s, /\d/, `sem número: "${s}"`);
      assert.doesNotMatch(s, /token|prefill|decode/i, `a figura fala em ler, escrever e anotar: "${s}"`);
    }
  });
}

test("a figura da atendente fecha sem pergunta, e as palavras e o trecho são os do corpus", () => {
  assert.doesNotMatch(ANOTACOES.fecho + ANOTACOES.textos.at(-1), /\?/, "a aposta fica no palpite antes da figura");
  assert.deepEqual(kv.mensagens.map((m) => m.palavras), casos.map((c) => palavras(texto(c))));
  assert.ok(texto(casos[1]).includes(kv.trecho), "o trecho é do regulamento");
  assert.equal(kv.pergunta, casos[0].pergunta);
  for (const k of [1, 2]) assert.ok(palavraEm(ANOTACOES.cenas[k].de, kv.resposta.length - 1) < ANOTACOES.cenas[k + 1].de, "as palavras saem dentro da cena");
  assert.match(kv.sobre, /ilustração/);
});

test("a jornada abre a página: um cenário por cache, as respostas do regulamento; a do mural certa para o Eduardo e errada para a Carla", () => {
  const jornada = montarJornada(JSON.parse(readFileSync(new URL("../experimentos/kv-cache/figuras/jornada.json", import.meta.url), "utf8")));
  const dados = (n) => readFileSync(new URL(`dados/${n}`, projeto), "utf8");
  const [ana, bruno, dani, eduardo, carla] = jornada.perguntas;
  assert.match(dados("mudancas.md"), /aos sábados, das 8h às 12h/, "sábado à tarde não pode; de manhã, pode");
  assert.equal(ana.resposta.join(" "), "Não: aos sábados, só de manhã.");
  assert.match(dados("areas-comuns.md"), /Às segundas, fecha para manutenção/);
  assert.equal(bruno.resposta.join(" "), "Não: às segundas, fecha para manutenção.");
  assert.match(dados("areas-comuns.md"), /Visitantes usam as áreas comuns só acompanhados de um morador/);
  assert.equal(dani.resposta.join(" "), "Só acompanhada de um morador.");
  assert.match(eduardo.texto, /sábado à tarde/, "o Eduardo pergunta o mesmo que a Ana, com outras palavras: a resposta do mural está certa");
  assert.ok(!eduardo.resposta, "o Eduardo não passa pelo modelo");
  assert.match(carla.texto, /sábado de manhã/, "a Carla pergunta quase o mesmo que a Ana");
  assert.match(carla.certa, /das 8h às 12h/, "e a resposta certa é a outra");
  assert.match(jornada.sobre, /ilustração/);
  assert.match(jornada.pedido.regulamento.origem, /cola em todo pedido/, "o leitor sabe de onde vem o regulamento, e por que o começo se repete");
  assert.match(jornada.pedido.instrucoes.origem, /quem fez o assistente/);
  assert.match(jornada.pedido.instrucoes.origem, /system prompt/, "o leitor reconhece as instruções no código que já usa");
  assert.match(jornada.pedido.pergunta.origem, /digitou/);
  const mdx = readFileSync(new URL("../experimentos/kv-cache/experimento.mdx", import.meta.url), "utf8");
  const corpo = mdx.slice(mdx.indexOf("\n---\n", 4));
  const jornadaEm = corpo.indexOf('qual="jornada"'), tecnico = corpo.indexOf("O [artigo da Analytics Vidhya]");
  assert.ok(jornadaEm >= 0 && jornadaEm < tecnico);
  assert.match(corpo, /documento fixo/, "o texto diz o que é o regulamento na jornada");
  assert.match(corpo, /anexa o arquivo no chat/); assert.match(corpo, /RAG/);
  assert.match(corpo, /system_prompt/, "as instruções têm o nome que o leitor vê no LangGraph");
  assert.ok(Object.values(jornada.pontos).every((e) => e.startsWith("ex.: ")), "cada ponto do caminho tem um exemplo de verdade");
  assert.doesNotMatch(corpo, /qual="caches"/, "a jornada mostra os quatro caches: a figura técnica saiu");
  const html = readFileSync(new URL("../dist/experimentos/kv-cache/index.html", import.meta.url), "utf8");
  assert.match(html, /data-kv-cache="jornada"/);
});

test("as figuras estão na página: a jornada na abertura, a atendente em \"O que vamos construir\", antes da IDE", () => {
  const mdx = readFileSync(new URL("../experimentos/kv-cache/experimento.mdx", import.meta.url), "utf8");
  const jornada = mdx.indexOf('qual="jornada"'), construir = mdx.indexOf("## O que vamos construir");
  const aposta = mdx.indexOf("<Aposta dados={previsoes}"), anotacoes = mdx.indexOf('qual="anotacoes"'), ide = mdx.indexOf("<IdeCapitulo");
  assert.ok(jornada >= 0 && jornada < construir && construir < aposta && aposta < anotacoes && anotacoes < ide);
  const html = readFileSync(new URL("../dist/experimentos/kv-cache/index.html", import.meta.url), "utf8");
  assert.match(html, /data-kv-cache="jornada"/);
  assert.match(html, /data-kv-cache="anotacoes"/);
  assert.match(html, /data-nivel="avancado"/);
});

/* os números do texto saem das saídas gravadas (o ponto do texto é a vírgula; o do terminal, o ponto) */
test("os números do texto são os das saídas gravadas", () => {
  const pasta = new URL("../experimentos/kv-cache/", import.meta.url);
  const mdx = readFileSync(new URL("experimento.mdx", pasta), "utf8");
  const saidas = JSON.parse(readFileSync(new URL("saidas.json", pasta), "utf8"));
  const saida = (id) => saidas[id].saida.map(([l]) => l).join("\n");
  const confere = (texto, id, terminal) => {
    assert.ok(mdx.includes(texto), `o texto não diz ${texto}`);
    assert.ok(saida(id).includes(terminal), `${id} não mostra ${terminal}`);
  };
  confere("201,1 ms", "kv-ingenua", "cada passo de escrita 201.1 ms");
  confere("131,9 ms", "kv-placar", "com cache: pausa 9.035 s; cada passo de escrita 131.9 ms");
  confere("74,5 ms", "kv-placar", "com cache: pausa 0.360 s; cada passo de escrita 74.5 ms");
  confere("207,6 MiB", "kv-placar", "o cache no fim: 207.6 MiB; a conta: 207.6 MiB (iguais)");
  confere("822 tokens", "kv-placar", "longa: 822 tokens lidos");
  confere("27 tokens", "kv-placar", "curta: 27 tokens lidos");
  assert.equal(Math.round((131.9 / 74.5 - 1) * 100), 77, "os 77% do texto");
  assert.ok(mdx.includes("77%"));
  const previsoes = JSON.parse(readFileSync(new URL("previsoes.json", pasta), "utf8"));
  assert.match(previsoes.mensagens[0].texto, /27 para 822 tokens/);
});

test("as ações da abertura: a previsão antes da jornada e o palpite do hash antes da explicação, sem pilhas", () => {
  const pasta = new URL("../experimentos/kv-cache/", import.meta.url);
  const mdx = readFileSync(new URL("experimento.mdx", pasta), "utf8");
  assert.doesNotMatch(mdx, /<Rascunho\b/);
  assert.ok(mdx.indexOf("<PareEPense pergunta=\"Antes de tocar") < mdx.indexOf('qual="jornada"'), "a decisão vem antes do momento-chave");
  assert.ok(mdx.indexOf("<Aposta dados={prefixo}") < mdx.indexOf("No [vLLM]"), "o palpite vem antes da resposta");
  assert.doesNotMatch(mdx, /<Pilhas\b/, "a separação em pilhas (A, B, C, D) confundia o leitor: saiu (Erick, 28/10/2026)");
  assert.ok(mdx.indexOf('<Nota titulo="o que é inventado">') > mdx.indexOf("</Exercicio>"), "a nota fica no fim");
});
