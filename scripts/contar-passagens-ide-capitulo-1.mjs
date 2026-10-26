#!/usr/bin/env node

/**
 * Conta as passagens e as decisões oferecidas pela IDE do capítulo 1.
 *
 * A base vem das três fontes que determinam o percurso: o roteiro (ações), os
 * passos (agrupamento e pedidos) e a lógica do IdeCapitulo (quadros e falas).
 * As saídas gravadas entram para distinguir os comandos que mostram erro e
 * conferir as perguntas novas. A base anterior, da etapa 6a, fica na mesma
 * tabela para a redução ser verificável.
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
exigir(componente.includes("quadrosDaIde(passos)"), "a IDE não usa mais um quadro por ação");
exigir(componente.includes("a.blocos.flatMap((b, bi)"), "os blocos da ação não aparecem juntos");
exigir(!componente.includes("E o próximo?"), "a fala entre blocos voltou para a IDE");
exigir(componente.includes("(!direto && fazer !== \"livro\" ? FIZ : SEGUE)"), "a escolha entre FIZ e SEGUE mudou");
exigir(componente.includes("a resposta do leitor é a passagem"), "a pergunta da saída não substitui a confirmação");
exigir(componente.includes('aria-label="Avançar"'), "o atalho Avançar não está mais na IDE");
exigir(componente.includes("localStorage.setItem(chaveProgresso"), "a memória de retomada da IDE mudou");

exigir(passos.length === 18, `esperava 18 passos, encontrei ${passos.length}`);
exigir(passos[0].de === 1 && passos.at(-1).ate === roteiro.length, "os passos não cobrem o roteiro inteiro");
passos.slice(1).forEach((passo, i) => exigir(passos[i].ate + 1 === passo.de, `há um vão antes do passo ${i + 2}`));
exigir(JSON.stringify(passos.filter((p) => p.parada).map((p, i) => [passos.indexOf(p) + 1, p.parada.tag])) === JSON.stringify([
  [4, "cap-01/passo-04"], [10, "cap-01/passo-10"], [16, "cap-01/passo-16"], [18, "cap-01/fim"],
]), "as quatro paradas ou suas tags mudaram");

const erroEm = (saida) => saida.saiu_com !== 0 || saida.saida.some(([, canal]) => canal === "err");
const soma = (linhas, campo) => linhas.reduce((total, linha) => total + linha[campo], 0);

const linhas = passos.map((passo, indice) => {
  const acoes = roteiro.slice(passo.de - 1, passo.ate);
  const extras = acoes.reduce((total, acao) => total + Math.max(0, (acao.blocos?.length ?? 0) - 1), 0);
  const comandos = acoes.filter((acao) => acao.acao === "rodar");
  const variantes = acoes.flatMap((acao) => acao.variar?.opcoes ?? []);
  const perguntasDeBloco = acoes.flatMap((acao) => acao.blocos ?? []).filter((bloco) => bloco.pergunta).length;
  const perguntasDeSaida = comandos.filter((acao) => acao.pergunta_saida).length;
  const principal = {
    apostas: comandos.filter((acao) => acao.aposta).length,
    perguntasDeBloco,
    perguntasDeSaida,
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
  return {
    n: indice + 1,
    id: passo.id,
    acoes: acoes.length,
    extras,
    pedido: 1,
    perguntasDeSaida,
    antes: 1 + acoes.length + extras,
    fiz: acoes.length - perguntasDeSaida,
    segueLivro: acoes.length - perguntasDeSaida,
    guiado: 1 + acoes.length - perguntasDeSaida,
    direto: 1 + acoes.length,
    principal: Object.values(principal).reduce((a, b) => a + b, 0),
    opcionais: Object.values(opcionais).reduce((a, b) => a + b, 0),
    decisoesDiretas: direto.principais,
    opcionaisDiretas: direto.opcionais,
    detalhes: { principal, opcionais },
  };
});

const totais = {
  acoes: soma(linhas, "acoes"),
  extras: soma(linhas, "extras"),
  pedido: soma(linhas, "pedido"),
  fiz: soma(linhas, "fiz"),
  segueLivro: soma(linhas, "segueLivro"),
  antes: soma(linhas, "antes"),
  guiado: soma(linhas, "guiado"),
  direto: soma(linhas, "direto"),
  principal: soma(linhas, "principal"),
  opcionais: soma(linhas, "opcionais"),
  decisoesDiretas: soma(linhas, "decisoesDiretas"),
  opcionaisDiretas: soma(linhas, "opcionaisDiretas"),
  perguntasDeSaida: soma(linhas, "perguntasDeSaida"),
};

exigir(totais.acoes === roteiro.length, "a soma das ações por passo diverge do roteiro");
exigir(JSON.stringify(linhas.filter((l) => l.perguntasDeSaida).map((l) => l.n)) === JSON.stringify([6, 8, 12, 16, 17]), "as perguntas da saída não estão nos cinco passos escolhidos");
exigir(totais.guiado === 53 && totais.principal === 33, `esperava 53 passagens mecânicas e 33 decisões; encontrei ${totais.guiado} e ${totais.principal}`);

console.log("# Contagem da IDE do capítulo 1\n");
console.log("Passagens são transições acionadas pelo leitor. A seta Avançar e ArrowRight são atalhos para a mesma transição e não entram outra vez na soma.\n");
console.log("| Passo | Ações | Blocos extras | Perguntas da saída | Antes: guiado | Depois: minha IDE | Depois: aqui no livro | Direto | Decisões principais | Opcionais |");
console.log("|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|");
for (const l of linhas) {
  console.log(`| ${l.n} | ${l.acoes} | ${l.extras} | ${l.perguntasDeSaida} | ${l.antes} | ${l.pedido} + ${l.fiz} = ${l.guiado} | ${l.pedido} + ${l.segueLivro} = ${l.guiado} | ${l.direto} | ${l.principal} | ${l.opcionais} |`);
}
console.log(`| **Total** | **${totais.acoes}** | **${totais.extras}** | **${totais.perguntasDeSaida}** | **${totais.antes}** | **${totais.pedido} + ${totais.fiz} = ${totais.guiado}** | **${totais.pedido} + ${totais.segueLivro} = ${totais.guiado}** | **${totais.direto}** | **${totais.principal}** | **${totais.opcionais}** |`);

const categoriasPrincipais = Object.fromEntries(Object.keys(linhas[0].detalhes.principal).map((campo) =>
  [campo, linhas.reduce((total, linha) => total + linha.detalhes.principal[campo], 0)]));
const categoriasOpcionais = Object.fromEntries(Object.keys(linhas[0].detalhes.opcionais).map((campo) =>
  [campo, linhas.reduce((total, linha) => total + linha.detalhes.opcionais[campo], 0)]));

console.log("\n## Decisões e investigações\n");
console.log(`Caminho principal: ${totais.principal} (${Object.entries(categoriasPrincipais).map(([k, v]) => `${k}: ${v}`).join(", ")}).`);
console.log(`Se explorar tudo que é opcional: +${totais.opcionais} (${Object.entries(categoriasOpcionais).map(([k, v]) => `${k}: ${v}`).join(", ")}), total ${totais.principal + totais.opcionais}.`);
console.log(`Avançar pode acionar ${totais.guiado - 1} das ${totais.guiado} passagens guiadas (o primeiro pedido só sai pelo chat) e as ${totais.direto} do modo direto.`);

console.log("\n| Passo | Apostas | Perguntas de bloco | Perguntas da saída | Comandos | Erros | Variantes | Dúvidas | Apostas de variante | Erros de variante |");
console.log("|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|");
for (const l of linhas) {
  const p = l.detalhes.principal, o = l.detalhes.opcionais;
  console.log(`| ${l.n} | ${p.apostas} | ${p.perguntasDeBloco} | ${p.perguntasDeSaida} | ${p.comandos} | ${p.erros} | ${o.variantes} | ${o.duvidas} | ${o.apostasDeVariante} | ${o.errosDeVariante} |`);
}
console.log(`| **Total** | **${categoriasPrincipais.apostas}** | **${categoriasPrincipais.perguntasDeBloco}** | **${categoriasPrincipais.perguntasDeSaida}** | **${categoriasPrincipais.comandos}** | **${categoriasPrincipais.erros}** | **${categoriasOpcionais.variantes}** | **${categoriasOpcionais.duvidas}** | **${categoriasOpcionais.apostasDeVariante}** | **${categoriasOpcionais.errosDeVariante}** |`);
console.log(`\nNo modo direto, apostas, perguntas de bloco e digitação dos comandos saem. Permanecem ${totais.decisoesDiretas} investigações de erro no caminho principal e ${totais.opcionaisDiretas} oportunidades opcionais (variantes, dúvidas e o erro de variante), total ${totais.decisoesDiretas + totais.opcionaisDiretas}.`);

console.log(`\nAntes/depois: ${totais.antes} → ${totais.guiado} passagens mecânicas nos modos guiados; ${28} → ${totais.principal} decisões principais. O modo direto permanece em ${totais.direto} passagens.`);
