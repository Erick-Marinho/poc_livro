import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { parse } from "node-html-parser";
import { montarIde, perguntaSustentada, respostaEntregue } from "../src/lib/ideCapitulo.ts";

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

test("temperatura zero: o mapa tem Remotion e alternativa legível sem JS; GPU ainda não recebe placar", () => {
  const mapa=html.querySelector(".tz-mapa");
  assert.equal(mapa.querySelectorAll("[data-tz-estatico] li").length,5);
  assert.match(mapa.text,/Esquema do mecanismo/);
  assert.match(html.text,/GPU.*ainda não foi medida/);
  assert.equal(html.querySelectorAll(".resultados li").length,1);
  assert.match(html.text,/CPU ou GPU/);
  assert.match(html.text,/90|Três perguntas/);
});
