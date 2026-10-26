#!/usr/bin/env node

/**
 * Conta as passagens e as decisões oferecidas pela IDE do capítulo 1.
 *
 * A base vem das três fontes que determinam o percurso: o roteiro (ações), os
 * passos (agrupamento e pedidos) e a lógica do IdeCapitulo (quadros e falas).
 * As saídas gravadas entram somente para distinguir os comandos que mostram um
 * erro real. As propostas são projeções: este script não muda o produto.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lerJson = (nome) => JSON.parse(fs.readFileSync(path.join(raiz, nome), "utf8"));
const roteiro = lerJson("livros/ciclo-de-vida/roteiros/01.json").passos;
const passos = lerJson("livros/ciclo-de-vida/passos/01.json").passos;
const saidas = lerJson("livros/ciclo-de-vida/saidas.json");
const componente = fs.readFileSync(path.join(raiz, "src/components/livro/ide/IdeCapitulo.tsx"), "utf8");

function exigir(condicao, mensagem) {
  if (!condicao) throw new Error(`contagem da IDE: ${mensagem}`);
}

function listaDaConstante(nome) {
  const achado = componente.match(new RegExp(`const ${nome} = (\\[[^;]+\\]);`));
  exigir(achado, `não achei a lista ${nome} no IdeCapitulo.tsx`);
  return JSON.parse(achado[1]);
}

const fiz = listaDaConstante("FIZ");
const segue = listaDaConstante("SEGUE");
exigir(fiz.length === 4 && segue.length === 4, "FIZ e SEGUE deixaram de ter quatro variações");
exigir(componente.includes("a.blocos.map((_, b)"), "o modo guiado não abre mais um quadro por bloco");
exigir(componente.includes("a.blocos.length - 1) return \"E o próximo?\""), "a passagem entre blocos mudou");
exigir(componente.includes("(!direto && fazer !== \"livro\" ? FIZ : SEGUE)"), "a escolha entre FIZ e SEGUE mudou");
exigir(componente.includes('aria-label="Avançar"'), "o atalho Avançar não está mais na IDE");
exigir(componente.includes("localStorage.setItem(chaveProgresso"), "a memória de retomada da IDE mudou");

exigir(passos.length === 18, `esperava 18 passos, encontrei ${passos.length}`);
exigir(passos[0].de === 1 && passos.at(-1).ate === roteiro.length, "os passos não cobrem o roteiro inteiro");
passos.slice(1).forEach((passo, i) => exigir(passos[i].ate + 1 === passo.de, `há um vão antes do passo ${i + 2}`));

const erroEm = (saida) => saida.saiu_com !== 0 || saida.saida.some(([, canal]) => canal === "err");
const soma = (linhas, campo) => linhas.reduce((total, linha) => total + linha[campo], 0);

const linhas = passos.map((passo, indice) => {
  const acoes = roteiro.slice(passo.de - 1, passo.ate);
  const extras = acoes.reduce((total, acao) => total + Math.max(0, (acao.blocos?.length ?? 0) - 1), 0);
  const comandos = acoes.filter((acao) => acao.acao === "rodar");
  const variantes = acoes.flatMap((acao) => acao.variar?.opcoes ?? []);
  const gruposSemComando = acoes.reduce((total, acao, i) =>
    total + (acao.acao !== "rodar" && (i === 0 || acoes[i - 1].acao === "rodar") ? 1 : 0), 0);
  const perguntasDeBloco = acoes.flatMap((acao) => acao.blocos ?? []).filter((bloco) => bloco.pergunta).length;
  const principal = {
    apostas: comandos.filter((acao) => acao.aposta).length,
    perguntasDeBloco,
    comandos: comandos.length,
    erros: comandos.filter((acao) => erroEm(saidas[acao.id])).length,
  };
  const opcionais = {
    variantes: acoes.filter((acao) => acao.variar).length,
    duvidas: acoes.reduce((total, acao) => total + (acao.duvidas?.length ?? 0), 0),
    apostasDeVariante: variantes.filter((opcao) => opcao.aposta).length,
    errosDeVariante: variantes.filter((opcao) => erroEm(saidas[opcao.id])).length,
  };
  const direto = {
    principais: principal.erros,
    opcionais: opcionais.variantes + opcionais.duvidas + opcionais.errosDeVariante,
  };
  const podeVirarPrevisao = comandos.filter((acao) => {
    const posicao = acoes.indexOf(acao);
    return !acao.aposta && posicao > 0 && acoes[posicao - 1].acao !== "rodar";
  }).length;
  return {
    n: indice + 1,
    id: passo.id,
    acoes: acoes.length,
    extras,
    pedido: 1,
    fiz: acoes.length,
    segueIde: extras,
    segueLivro: acoes.length + extras,
    guiado: 1 + acoes.length + extras,
    direto: 1 + acoes.length,
    agrupado: 1 + comandos.length + gruposSemComando,
    principal: Object.values(principal).reduce((a, b) => a + b, 0),
    opcionais: Object.values(opcionais).reduce((a, b) => a + b, 0),
    decisoesDiretas: direto.principais,
    opcionaisDiretas: direto.opcionais,
    podeVirarPrevisao,
    detalhes: { principal, opcionais },
  };
});

const totais = {
  acoes: soma(linhas, "acoes"),
  extras: soma(linhas, "extras"),
  pedido: soma(linhas, "pedido"),
  fiz: soma(linhas, "fiz"),
  segueIde: soma(linhas, "segueIde"),
  segueLivro: soma(linhas, "segueLivro"),
  guiado: soma(linhas, "guiado"),
  direto: soma(linhas, "direto"),
  agrupado: soma(linhas, "agrupado"),
  principal: soma(linhas, "principal"),
  opcionais: soma(linhas, "opcionais"),
  decisoesDiretas: soma(linhas, "decisoesDiretas"),
  opcionaisDiretas: soma(linhas, "opcionaisDiretas"),
  previsoes: soma(linhas, "podeVirarPrevisao"),
};

exigir(totais.acoes === roteiro.length, "a soma das ações por passo diverge do roteiro");

console.log("# Contagem da IDE do capítulo 1\n");
console.log("Passagens são transições acionadas pelo leitor. A seta Avançar e ArrowRight são atalhos para a mesma transição e não entram outra vez na soma.\n");
console.log("| Passo | Ações | Blocos extras | Na minha IDE (pedido + FIZ + SEGUE) | Aqui no livro (pedido + SEGUE) | Direto (começo/pedido + SEGUE) | Decisões principais | Opcionais |");
console.log("|---:|---:|---:|---:|---:|---:|---:|---:|");
for (const l of linhas) {
  console.log(`| ${l.n} | ${l.acoes} | ${l.extras} | ${l.pedido} + ${l.fiz} + ${l.segueIde} = ${l.guiado} | ${l.pedido} + ${l.segueLivro} = ${l.guiado} | ${l.pedido} + ${l.acoes} = ${l.direto} | ${l.principal} | ${l.opcionais} |`);
}
console.log(`| **Total** | **${totais.acoes}** | **${totais.extras}** | **${totais.pedido} + ${totais.fiz} + ${totais.segueIde} = ${totais.guiado}** | **${totais.pedido} + ${totais.segueLivro} = ${totais.guiado}** | **${totais.pedido} + ${totais.acoes} = ${totais.direto}** | **${totais.principal}** | **${totais.opcionais}** |`);

const categoriasPrincipais = Object.fromEntries(Object.keys(linhas[0].detalhes.principal).map((campo) =>
  [campo, linhas.reduce((total, linha) => total + linha.detalhes.principal[campo], 0)]));
const categoriasOpcionais = Object.fromEntries(Object.keys(linhas[0].detalhes.opcionais).map((campo) =>
  [campo, linhas.reduce((total, linha) => total + linha.detalhes.opcionais[campo], 0)]));

console.log("\n## Decisões e investigações\n");
console.log(`Caminho principal: ${totais.principal} (${Object.entries(categoriasPrincipais).map(([k, v]) => `${k}: ${v}`).join(", ")}).`);
console.log(`Se explorar tudo que é opcional: +${totais.opcionais} (${Object.entries(categoriasOpcionais).map(([k, v]) => `${k}: ${v}`).join(", ")}), total ${totais.principal + totais.opcionais}.`);
console.log(`Avançar pode acionar ${totais.guiado - 1} das ${totais.guiado} passagens guiadas (o primeiro pedido só sai pelo chat) e as ${totais.direto} do modo direto.`);

console.log("\n| Passo | Apostas | Perguntas de bloco | Comandos | Erros | Variantes | Dúvidas | Apostas de variante | Erros de variante |");
console.log("|---:|---:|---:|---:|---:|---:|---:|---:|---:|");
for (const l of linhas) {
  const p = l.detalhes.principal, o = l.detalhes.opcionais;
  console.log(`| ${l.n} | ${p.apostas} | ${p.perguntasDeBloco} | ${p.comandos} | ${p.erros} | ${o.variantes} | ${o.duvidas} | ${o.apostasDeVariante} | ${o.errosDeVariante} |`);
}
console.log(`| **Total** | **${categoriasPrincipais.apostas}** | **${categoriasPrincipais.perguntasDeBloco}** | **${categoriasPrincipais.comandos}** | **${categoriasPrincipais.erros}** | **${categoriasOpcionais.variantes}** | **${categoriasOpcionais.duvidas}** | **${categoriasOpcionais.apostasDeVariante}** | **${categoriasOpcionais.errosDeVariante}** |`);
console.log(`\nNo modo direto, apostas, perguntas de bloco e digitação dos comandos saem. Permanecem ${totais.decisoesDiretas} investigações de erro no caminho principal e ${totais.opcionaisDiretas} oportunidades opcionais (variantes, dúvidas e o erro de variante), total ${totais.decisoesDiretas + totais.opcionaisDiretas}.`);

console.log("\n## Projeções para a etapa 6b\n");
console.log("| Proposta | Mecânicas: minha IDE | Mecânicas: aqui | Mecânicas: direto | Decisões guiadas: principais/todas | Decisões diretas: principais/todas |");
console.log("|---|---:|---:|---:|---:|---:|");
console.log(`| Estado atual | ${totais.guiado} | ${totais.guiado} | ${totais.direto} | ${totais.principal}/${totais.principal + totais.opcionais} | ${totais.decisoesDiretas}/${totais.decisoesDiretas + totais.opcionaisDiretas} |`);
console.log(`| A — um quadro por ação | ${totais.direto} | ${totais.direto} | ${totais.direto} | ${totais.principal}/${totais.principal + totais.opcionais} | ${totais.decisoesDiretas}/${totais.decisoesDiretas + totais.opcionaisDiretas} |`);
console.log(`| B — agrupar ações sem comando | ${totais.agrupado} | ${totais.agrupado} | ${totais.agrupado} | ${totais.principal}/${totais.principal + totais.opcionais} | ${totais.decisoesDiretas}/${totais.decisoesDiretas + totais.opcionaisDiretas} |`);
console.log(`| C — cinco confirmações viram previsões | ${totais.guiado - totais.previsoes} | ${totais.guiado - totais.previsoes} | ${totais.direto} | ${totais.principal + totais.previsoes}/${totais.principal + totais.opcionais + totais.previsoes} | ${totais.decisoesDiretas}/${totais.decisoesDiretas + totais.opcionaisDiretas} |`);
console.log(`\nNa proposta C, as ${totais.previsoes} passagens continuam existindo, mas deixam de ser mecânicas; no modo direto, as perguntas continuam omitidas.`);
