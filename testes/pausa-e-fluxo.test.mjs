/** O corpus do experimento da pausa e do fluxo (docs/capacidades/experimento-pausa-e-fluxo.md), congelado antes de medir. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { baloes, CENAS, DURACAO, FPS, montarPausa, pedacoEm, FECHO, RESUMOS, SEGUNDOS } from "../src/components/livro/pausa/pausa.ts";

const projeto = new URL("../experimentos/pausa-e-fluxo/projeto/", import.meta.url);
const casos = readFileSync(new URL("casos.jsonl", projeto), "utf8").trim().split("\n").map((l) => JSON.parse(l));
/* o que o modelo lê: o material do regulamento, nesta ordem, e a pergunta no fim */
const texto = (c) => [...c.material.map((m) => readFileSync(new URL(`dados/${m}`, projeto), "utf8")), `Pergunta: ${c.pergunta}`].join("\n\n");
const palavras = (s) => s.split(/\s+/).filter(Boolean).length;

test("três casos, a mesma pergunta: só muda quanto o modelo tem de ler antes de responder", () => {
  assert.deepEqual(casos.map((c) => c.id), ["curta", "media", "longa"]);
  assert.equal(new Set(casos.map((c) => c.pergunta)).size, 1, "a pergunta é a mesma nos três");
  for (const c of casos) for (const m of c.material) assert.ok(existsSync(new URL(`dados/${m}`, projeto)), `${c.id}: falta dados/${m}`);
  const [curta, media, longa] = casos.map((c) => palavras(texto(c)));
  assert.ok(media >= 4 * curta && longa >= 4 * media, `cada caso lê ao menos 4 vezes o anterior: ${curta}, ${media}, ${longa} palavras`);
});

test("nenhum caso começa como outro, para o cache não encurtar a pausa medida", () => {
  const inicios = casos.map((c) => texto(c).slice(0, 40));
  assert.equal(new Set(inicios).size, casos.length, `começos repetidos: ${JSON.stringify(inicios)}`);
});

test("o regulamento: a resposta (o horário de sábado) só está no que a média e a longa leem, e ele diz que é inventado", () => {
  const [curta, media, longa] = casos.map(texto);
  const regra = "aos sábados, das 8h às 12h";
  assert.ok(!curta.includes(regra) && media.includes(regra) && longa.includes(regra));
  assert.match(longa, /\(condomínio inventado\)/);
});

test("a figura: seis cenas em até 45 s, um balão curto por cena, sem adiantar o resultado nem o cache", () => {
  const pausa = montarPausa(JSON.parse(readFileSync(new URL("../experimentos/pausa-e-fluxo/figuras/pausa.json", import.meta.url), "utf8")));
  assert.equal(CENAS.length, 6);
  assert.ok(DURACAO / FPS <= 45);
  CENAS.forEach((c, i) => { if (i) assert.ok(c.de > CENAS[i - 1].de); });
  const bs = baloes();
  assert.equal(bs.length, CENAS.length, "um balão por cena");
  bs.forEach((b, i) => { if (i) assert.equal(b.de, bs[i - 1].ate); });
  assert.ok(bs.at(-1).ate >= SEGUNDOS, "o último balão fica até o fim");
  const textos = [...bs.map((b) => b.texto), ...RESUMOS, FECHO];
  assert.doesNotMatch(FECHO, /\?/, "sem pergunta dentro da figura: a decisão fica no palpite");
  for (const s of textos) {
    assert.ok(s.split(/\s+/).length <= 14, `curto demais para ler de uma vez? "${s}"`);
    assert.doesNotMatch(s, /\d/, `sem número da coleta: "${s}"`);
    assert.doesNotMatch(s, /token|prefill|decode|cache/i, `a figura fala em ler, escrever, pausa e fluxo: "${s}"`);
  }
  assert.equal(RESUMOS.length, CENAS.length - 1, "um resumo por cena, menos a última");
  assert.deepEqual(pausa.mensagens.map((m) => m.palavras), casos.map((c) => palavras(texto(c))), "as palavras de cada mensagem são as do corpus");
  for (let i = 1; i < pausa.resposta.length; i++) assert.ok(pedacoEm(i) - pedacoEm(i - 1) > 0 && pedacoEm(i) < CENAS[3].de, "os pedaços saem na cena de escrever");
  assert.match(pausa.sobre, /ilustração/);
});

test("a figura está na página, em \"O que vamos construir\", antes da IDE", () => {
  const mdx = readFileSync(new URL("../experimentos/pausa-e-fluxo/experimento.mdx", import.meta.url), "utf8");
  const construir = mdx.indexOf("## O que vamos construir"), figura = mdx.indexOf("<PausaEFluxo"), ide = mdx.indexOf("<IdeCapitulo");
  assert.ok(construir >= 0 && construir < figura && figura < ide);
  const html = readFileSync(new URL("../dist/experimentos/pausa-e-fluxo/index.html", import.meta.url), "utf8");
  assert.match(html, /data-pausa-e-fluxo/);
  assert.match(html, /data-nivel="novato"/);
});

/* as ações do texto (docs/RITMO.md): o que cada uma diz bate com as saídas gravadas */
const pasta = new URL("../experimentos/pausa-e-fluxo/", import.meta.url);
const json = (nome) => JSON.parse(readFileSync(new URL(nome, pasta), "utf8"));
const saida = (id) => json("saidas.json")[id].saida.map(([l]) => l);
const linhaDe = (id, caso) => saida(id).find((l) => l.startsWith(`${caso} `));
const numero = (linha, nome) => Number(linha.match(new RegExp(`${nome}\\s+([\\d.]+)`))[1]);

test("as ações do texto dizem o que as coletas gravadas mostram", () => {
  const mdx = readFileSync(new URL("experimento.mdx", pasta), "utf8");
  assert.doesNotMatch(mdx, /<Rascunho\b/);
  // a primeira: a longa demora muito mais para começar; o ritmo, o achado diz como ficou, pelo que a coleta mostrou
  const [curta, longa] = ["curta", "longa"].map((c) => linhaDe("pf-limpa", c));
  assert.ok(numero(longa, "pausa") > 10 * numero(curta, "pausa"));
  const queda = Math.round(100 * (1 - numero(longa, "fluxo") / numero(curta, "fluxo")));
  const achado = mdx.match(/^achado: "(.*)"$/m)[1];
  if (queda > 20) assert.match(achado, new RegExp(`${queda}%.*não para o fluxo`), "o achado diz que o fluxo caiu mais que a régua aceita");
  else assert.doesNotMatch(achado, /não para o fluxo/);
  const p = json("previsoes.json").mensagens[0];
  assert.match(p.opcoes[p.fez], /^Demora mais para começar, e depois escreve quase no mesmo ritmo$/);
  assert.doesNotMatch(p.porque, /\d/, "o retorno não adianta os números de \"O que deu\"");
  // o pare e pense: os tokens das mesmas mensagens de 10 e 430 palavras, sem o número do atendimento (a coleta ingênua)
  const [curtaSem, longaSem] = ["curta", "longa"].map((c) => linhaDe("pf-ingenua", c));
  assert.ok(mdx.includes(`Mais: ${numero(longaSem, "lê")}.`) && mdx.includes(`com 10 palavras, vira ${numero(curtaSem, "lê")}.`));
  // a do artigo: na primeira coleta, da segunda vez em diante a longa veio quase toda do cache
  const vezes = saida("pf-vezes").map((l) => l.match(/(\d+) de (\d+) tokens vieram do cache/).slice(1).map(Number));
  assert.ok(vezes[0][0] < 100 && vezes.slice(1).every(([cache, lidos]) => cache > lidos - 5));
  const a = json("previsoes-artigo.json").mensagens[0];
  assert.match(a.opcoes[a.fez], /^Pode crescer menos/);
  assert.ok(a.opcoes.every((o) => !/começam iguais|cache/.test(o)), "as opções não trazem o porquê");
  assert.match(a.porque, /Não medimos o laboratório do artigo/);
});

test("os tempos de verdade: a linha do tempo usa as medianas gravadas, e a aposta de escala da IDE acerta a conta", async () => {
  const { montarTempos, legendas, fimDe, EIXO, DE_NOVO, SEGUNDOS } = await import("../src/components/livro/pausa/tempos.ts");
  const coleta = json("projeto/coleta.json");
  const escritos = Object.fromEntries(Object.keys(coleta.repeticoes[0]).map((c) => [c, coleta.repeticoes.map((r) => r[c].escritos)]));
  const t = montarTempos(saida("pf-limpa").map((l) => [l, ""]), json("figuras/pausa.json").mensagens, escritos);
  const [curta, media, longa] = ["curta", "media", "longa"].map((c) => linhaDe("pf-limpa", c));
  assert.deepEqual(t.linhas.map((l) => l.pausa), [curta, media, longa].map((l) => numero(l, "pausa")));
  assert.deepEqual(t.linhas.map((l) => l.fluxo), [curta, media, longa].map((l) => numero(l, "fluxo")));
  assert.equal(t.deNovo.pausa, numero(linhaDe("pf-limpa", "de_novo"), "pausa"));
  assert.ok(fimDe(t, t.linhas[2]) <= EIXO && DE_NOVO + fimDe(t, t.deNovo) < SEGUNDOS);
  assert.match(legendas(t)[1].texto, new RegExp(`${t.vezes} vezes`));
  const mediana = (xs) => { const o = [...xs].sort((x, y) => x - y), m = o.length >> 1; return o.length % 2 ? o[m] : (o[m - 1] + o[m]) / 2; };
  assert.deepEqual([...t.linhas, t.deNovo].map((l) => l.escritos), ["curta", "media", "longa", "de_novo"].map((c) => mediana(escritos[c])), "a mediana dos tokens escritos, caso a caso");
  assert.throws(() => montarTempos(saida("pf-limpa").map((l) => [l, ""]), json("figuras/pausa.json").mensagens, { curta: [64] }), /não está no coleta/);
  const aposta = json("roteiros/01.json").passos.find((p) => p.id === "pf-limpa").aposta;
  const vezes = (o) => Number(o.match(/\d+/)[0]);
  const perto = aposta.opcoes.reduce((a, o, i) => (Math.abs(vezes(o) - t.vezes) < Math.abs(vezes(aposta.opcoes[a]) - t.vezes) ? i : a), 0);
  assert.equal(aposta.certa, perto, "a certa é a mais perto da conta gravada");
  const mdx = readFileSync(new URL("experimento.mdx", pasta), "utf8");
  assert.ok(mdx.indexOf("<IdeCapitulo") < mdx.indexOf("<TemposReais") && mdx.indexOf("<TemposReais") < mdx.indexOf("## O tropeço"));
});
