import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { parse } from "node-html-parser";
import { montarIde, perguntaSustentada, respostaEntregue } from "../src/lib/ideCapitulo.ts";
import { montarMapa, muda, baloes, DURACAO, CENAS, FPS, SEGUNDOS } from "../src/components/livro/temperatura/mapa.ts";
import { eAcao } from "../scripts/ritmo.mjs";
import { montarRespostas } from "../src/components/livro/temperatura/respostas.ts";

const base = new URL("../experimentos/temperatura-zero/", import.meta.url);
const ler = (nome) => readFileSync(new URL(nome, base), "utf8");
const json = (nome) => JSON.parse(ler(nome));
const coleta = json("projeto/coleta-cpu.json");
const roteiro = json("roteiros/01.json");
const estados = json("roteiros/01.estados.json");
const capitulo = json("passos/01.json");
const saidas = json("saidas.json");
const secoes = {1:"O cálculo",2:"O instrumento",3:"A coleta",4:"Na sua máquina"};
const html = parse(readFileSync(new URL("../dist/experimentos/temperatura-zero/index.html", import.meta.url), "utf8"));

test("temperatura zero: o instrumento e a coleta passam sem importar torch nem acessar um modelo", () => {
  const r = spawnSync("python3", ["-m", "unittest", "-q"], {cwd:new URL("projeto/",base), encoding:"utf8",
    env:{...process.env, HF_HUB_OFFLINE:"1", TRANSFORMERS_OFFLINE:"1"}});
  assert.equal(r.status,0,r.stdout+r.stderr);
  assert.match(r.stderr,/Ran 9 tests/);
  const importar = spawnSync("python3",["-c","import sys, coletar; assert 'torch' not in sys.modules"],
    {cwd:new URL("projeto/",base),encoding:"utf8"});
  assert.equal(importar.status,0,importar.stderr);
});

test("temperatura zero: o placar é recalculado dos IDs, com uma referência por pergunta", () => {
  assert.equal(coleta.ambiente.dispositivo,"cpu");
  assert.equal(coleta.ambiente.modo,"greedy_search");
  assert.equal(coleta.ambiente.amostragem,false);
  assert.equal(coleta.casos.length,3);
  let iguais=0,total=0;
  for(const c of coleta.casos){
    assert.deepEqual(c.referencia,c.lotes[0].sequencias[0]);
    for(const lote of c.lotes){
      assert.deepEqual(lote.entrada,c.lotes[0].entrada);
      assert.equal(lote.sequencias.length,10);
      for(const s of lote.sequencias){total++; if(JSON.stringify(s)===JSON.stringify(c.referencia))iguais++;}
    }
  }
  assert.equal(total,90);
  const texto=saidas["tz-medida"].saida.map(([l])=>l).join("\n");
  assert.ok(texto.includes(`${iguais} de ${total} (${Math.floor(100*iguais/total)}%)`));
  assert.match(html.querySelector(".resultados .rotulo").text,/iguais à referência/);
  const origem=json("procedencia.json");
  assert.equal(createHash("sha256").update(ler("projeto/coleta-cpu.json")).digest("hex"),origem.coleta_sha256);
  assert.equal(createHash("sha256").update(ler("projeto/coletar.py")).digest("hex"),origem.coletor_sha256);
});

test("temperatura zero: a IDE chega ao projeto e mantém cada passo dentro de 15 linhas novas", async () => {
  const ide=await montarIde({roteiro,estados,saidas,capitulo,secoes,glossario:json("glossario.json"),pasta:"~/temperatura-zero"});
  assert.equal(ide.passos.length,15);
  assert.equal(ide.acoes.length,roteiro.passos.length);
  const instrucoes=ide.passos.find(p=>p.id==="modelo").antes.join(" ");
  assert.match(instrucoes,/--extra modelo python coletar.py cpu/);
  assert.match(instrucoes,/--extra gpu python coletar.py cuda/);
  for(const p of ide.passos){
    let novas=0;
    for(const e of estados.filter(e=>e.passo>=p.de&&e.passo<=p.ate)){
      if(!e.arquivo?.endsWith(".py"))continue;
      const a=ide.acoes[e.passo-1];
      const linhas=e.conteudo.split("\n");
      novas+=a.alteradas.filter(n=>linhas[n-1]?.trim()).length;
    }
    assert.ok(novas<=15,`${p.titulo}: ${novas} linhas`);
  }
});

test("temperatura zero: as perguntas interpretam comandos reais e a variante é um controle de margem", () => {
  const perguntas=roteiro.passos.filter(a=>a.pergunta_saida);
  assert.equal(perguntas.length,4);
  for(const [i,a] of perguntas.entries()){
    assert.ok(perguntaSustentada(saidas[a.id].saida,a.pergunta_saida));
    assert.equal(respostaEntregue(saidas[a.id].saida,a.nota,a.pergunta_saida),false);
    if(i)assert.notEqual(a.pergunta_saida.certa,perguntas[i-1].pergunta_saida.certa);
  }
  const variante=saidas["tz-margem-larga"].saida.map(([l])=>l).join("\n");
  assert.match(variante,/\[1, 1\]/);
  assert.match(saidas["tz-assert"].saida.map(([l])=>l).join("\n"),/AssertionError.*1024\.0.*1025\.0/);
  assert.ok(!roteiro.passos.some(a=>a.comando?.includes("coletar.py")),"o build executaria inferências novas");
});

test("temperatura zero: o mapa é um vídeo de tocar ou rolar, com os balões em texto sem JS; GPU ainda não recebe placar", () => {
  const mapa=html.querySelector("[data-tz-mapa]");
  assert.ok(mapa,"a figura do mapa está na página");
  assert.match(mapa.text,/Ilustração numérica/);
  assert.match(mapa.text,/a biblioteca pode repartir a soma de outro jeito/,"os balões vão como texto");
  assert.match(html.text,/GPU.*ainda não foi medida/);
  assert.equal(html.querySelectorAll(".resultados li").length,1);
  assert.match(html.text,/CPU ou GPU/);
  assert.match(html.text,/90|Três perguntas/);
});

test("temperatura zero: as somas, as barras e os vencedores saem do código executado, com um controle que não troca", () => {
  const bruto=saidas["tz-mapa"].saida[0][0];
  const d=montarMapa(bruto);
  assert.deepEqual(d.casos.map(muda),[true,false]);
  assert.deepEqual(d.caminhos.map(c=>c.passos.at(-1).guardado),[1024,1025]);
  assert.ok(d.guardaveis.filter(g=>g>=1024).every(Number.isInteger),"a partir de 1024, o binary16 só guarda inteiros");
  assert.ok(d.guardaveis.some(g=>g<1024&&!Number.isInteger(g)),"abaixo de 1024, ainda guarda meios");
  const real=spawnSync("python3",["figuras/mapa.py"],{cwd:base,encoding:"utf8"});
  assert.equal(real.status,0,real.stderr);
  assert.deepEqual(montarMapa(real.stdout),d);
  const errado=structuredClone(d);
  errado.casos[0].execucoes[0].escolha=0;
  assert.throws(()=>montarMapa(JSON.stringify(errado)),/barras e escolha/);
  const desalinhado=structuredClone(d);
  desalinhado.casos[1].execucoes[1].pontuacoes[1]=0.5;
  assert.throws(()=>montarMapa(JSON.stringify(desalinhado)),/barras e escolha/);
  const fora=structuredClone(d);
  fora.caminhos[1].passos[1].guardado=1024.5;
  assert.throws(()=>montarMapa(JSON.stringify(fora)));
});

test("temperatura zero: o vídeo cabe no limite do experimento, a previsão vem antes, e o esquema do lote diz que é esquema", () => {
  assert.ok(CENAS.length<=6);
  assert.ok(DURACAO/FPS<=45);
  const d=montarMapa(saidas["tz-mapa"].saida[0][0]);
  const bs=baloes(d);
  bs.forEach((b,i)=>{ if(i) assert.equal(b.de,bs[i-1].ate); });
  assert.ok(bs.at(-1).ate>=SEGUNDOS);
  assert.match(bs[1].texto,/esquema do que o estudo descreve/);
  assert.equal(eAcao("MapaTemperatura"),false);
  const mdx=ler("experimento.mdx");
  assert.ok(mdx.indexOf("<Aposta dados={previsoesMapa}")<mdx.indexOf("<MapaTemperatura"),"a previsão vem antes do vídeo");
});

test("temperatura zero: a grade das 90 respostas sai da coleta e bate com a saída gravada do medir.py", () => {
  const r=montarRespostas(coleta,saidas["tz-medida"].saida);
  assert.equal(r.total,90);
  assert.deepEqual(r.tamanhos,[1,4,16]);
  assert.equal(r.iguais,r.linhas.flatMap(l=>l.lotes.flatMap(x=>x.iguais)).filter(Boolean).length);
  assert.deepEqual(r.linhas.filter(l=>l.cortada).map(l=>l.id),["livre"],"só a resposta que usou os 48 tokens foi cortada");
  const outra=structuredClone(coleta);
  outra.casos[0].lotes[1].sequencias[3]=[...outra.casos[0].referencia,1];
  assert.throws(()=>montarRespostas(outra,saidas["tz-medida"].saida),/saída gravada do medir.py/);
  const fig=html.querySelector("[data-tz-respostas]");
  assert.equal(fig.querySelectorAll(".tzr-q").length,90);
  assert.equal(fig.querySelectorAll(".tzr-q.tzr-igual").length,r.iguais);
  assert.match(fig.text,/cortada no limite de 48 tokens/);
  assert.equal(eAcao("RespostasDaColeta"),true);
});
