#!/usr/bin/env node

/**
 * Conta passagens e decisões da IDE dos capítulos 1 e 2.
 *
 * Uso: node scripts/contar-passagens-ide-capitulo-1.mjs 01
 *      node scripts/contar-passagens-ide-capitulo-1.mjs 02
 *
 * A base vem das três fontes que determinam o percurso: roteiro, passos e
 * lógica da IDE. As saídas gravadas distinguem erros e sustentam as perguntas.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lerJson = (nome) => JSON.parse(fs.readFileSync(path.join(raiz, nome), "utf8"));
const numero = process.argv[2] ?? "01";

function exigir(condicao, mensagem) {
  if (!condicao) throw new Error(`contagem da IDE: ${mensagem}`);
}

exigir(["01", "02"].includes(numero), `capítulo deve ser 01 ou 02, e não ${numero}`);
const roteiro = lerJson(`livros/ciclo-de-vida/roteiros/${numero}.json`).passos;
const passos = lerJson(`livros/ciclo-de-vida/passos/${numero}.json`).passos;
const saidas = lerJson("livros/ciclo-de-vida/saidas.json");
const componente = fs.readFileSync(path.join(raiz, "src/components/livro/ide/IdeCapitulo.tsx"), "utf8");

const esperado = {
  "01": {
    passos: 18, acoes: 40, perguntas: [6, 8, 12, 16, 17],
    paradas: [[4, "cap-01/passo-04"], [10, "cap-01/passo-10"], [16, "cap-01/passo-16"], [18, "cap-01/fim"]],
    baseBloco: 79, entrada: 58, depois: 53, decisoesAntes: 28, decisoesDepois: 33, direto: 58,
  },
  "02": {
    passos: 10, acoes: 16, perguntas: [6, 7, 8, 10],
    paradas: [[5, "cap-02/passo-05"], [8, "cap-02/passo-08"], [10, "cap-02/fim"]],
    baseBloco: 38, entrada: 26, depois: 22, decisoesAntes: 11, decisoesDepois: 15, direto: 26,
  },
}[numero];

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

exigir(passos.length === esperado.passos, `esperava ${esperado.passos} passos, encontrei ${passos.length}`);
exigir(passos[0].de === 1 && passos.at(-1).ate === roteiro.length, "os passos não cobrem o roteiro inteiro");
passos.slice(1).forEach((passo, i) => exigir(passos[i].ate + 1 === passo.de, `há um vão antes do passo ${i + 2}`));
const paradas = passos.flatMap((passo, i) => passo.parada ? [[i + 1, passo.parada.tag]] : []);
exigir(JSON.stringify(paradas) === JSON.stringify(esperado.paradas), `as paradas ou suas tags mudaram: ${JSON.stringify(paradas)}`);

const erroEm = (saida) => saida.saiu_com !== 0 || saida.saida.some(([, canal]) => canal === "err");
const soma = (itens, campo) => itens.reduce((total, item) => total + item[campo], 0);
const minusculas = (texto) => texto.trim().toLocaleLowerCase("pt-BR");
const interpretaSaida = (acao) => {
  const q = acao.pergunta_saida, correta = minusculas(q.opcoes[q.certa]);
  const linhasSaida = saidas[acao.id].saida.map(([linha]) => linha);
  return linhasSaida.some((linha) => linha.includes(q.evidencia))
    && q.porque.includes(q.evidencia)
    && !linhasSaida.some((linha) => minusculas(linha).includes(correta))
    && !minusculas(acao.nota).includes(correta);
};

const linhas = passos.map((passo, indice) => {
  const acoes = roteiro.slice(passo.de - 1, passo.ate);
  const extras = acoes.reduce((total, acao) => total + Math.max(0, (acao.blocos?.length ?? 0) - 1), 0);
  const comandos = acoes.filter((acao) => acao.acao === "rodar");
  const variantes = acoes.flatMap((acao) => acao.variar?.opcoes ?? []);
  const perguntasDeBloco = acoes.flatMap((acao) => acao.blocos ?? []).filter((bloco) => bloco.pergunta).length;
  const perguntasDeSaida = comandos.filter((acao) => acao.pergunta_saida).length;
  const perguntasInterpretativas = comandos.filter((acao) => acao.pergunta_saida && interpretaSaida(acao)).length;
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
  const somaPrincipal = Object.values(principal).reduce((a, b) => a + b, 0);
  return {
    n: indice + 1,
    id: passo.id,
    acoes: acoes.length,
    extras,
    pedido: 1,
    perguntasDeSaida,
    perguntasInterpretativas,
    baseBloco: 1 + acoes.length + extras,
    entrada: 1 + acoes.length,
    fiz: acoes.length - perguntasDeSaida,
    segueLivro: acoes.length - perguntasDeSaida,
    guiado: 1 + acoes.length - perguntasDeSaida,
    direto: 1 + acoes.length,
    principalAntes: somaPrincipal - perguntasDeSaida,
    principal: somaPrincipal,
    opcionais: Object.values(opcionais).reduce((a, b) => a + b, 0),
    decisoesDiretas: direto.principais,
    opcionaisDiretas: direto.opcionais,
    detalhes: { principal, opcionais },
  };
});

const totais = Object.fromEntries([
  "acoes", "extras", "pedido", "fiz", "segueLivro", "baseBloco", "entrada", "guiado", "direto", "principalAntes",
  "principal", "opcionais", "decisoesDiretas", "opcionaisDiretas", "perguntasDeSaida", "perguntasInterpretativas",
].map((campo) => [campo, soma(linhas, campo)]));

exigir(totais.acoes === roteiro.length && totais.acoes === esperado.acoes, "a soma das ações por passo diverge do roteiro");
const passosComPergunta = linhas.filter((linha) => linha.perguntasDeSaida).map((linha) => linha.n);
exigir(JSON.stringify(passosComPergunta) === JSON.stringify(esperado.perguntas), `as perguntas da saída não estão nos passos escolhidos: ${passosComPergunta}`);
exigir(totais.perguntasInterpretativas === esperado.perguntas.length, `esperava ${esperado.perguntas.length} perguntas interpretativas; encontrei ${totais.perguntasInterpretativas}`);
const posicoes = roteiro.filter((acao) => acao.pergunta_saida).map((acao) => acao.pergunta_saida.certa);
exigir(new Set(posicoes).size > 1, "as respostas certas ficaram todas na mesma posição");
exigir(posicoes.slice(1).every((certa, i) => certa !== posicoes[i]), "duas perguntas seguidas repetem a posição certa");
const chavesEsperadas = { baseBloco: "baseBloco", entrada: "entrada", guiado: "depois", principalAntes: "decisoesAntes", principal: "decisoesDepois", direto: "direto" };
for (const [campo, chave] of Object.entries(chavesEsperadas))
  exigir(totais[campo] === esperado[chave], `${campo}: esperava ${esperado[chave]}, encontrei ${totais[campo]}`);

console.log(`# Contagem da IDE do capítulo ${Number(numero)}\n`);
console.log("Passagens são transições acionadas pelo leitor. A seta Avançar e ArrowRight são atalhos para a mesma transição e não entram outra vez na soma.\n");
console.log("| Passo | Ações | Blocos extras | Perguntas da saída | Base bloco a bloco | Entrada da etapa | Depois: minha IDE | Depois: aqui no livro | Direto | Decisões antes | Decisões depois | Opcionais |");
console.log("|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|");
for (const linha of linhas) {
  console.log(`| ${linha.n} | ${linha.acoes} | ${linha.extras} | ${linha.perguntasDeSaida} | ${linha.baseBloco} | ${linha.entrada} | ${linha.pedido} + ${linha.fiz} = ${linha.guiado} | ${linha.pedido} + ${linha.segueLivro} = ${linha.guiado} | ${linha.direto} | ${linha.principalAntes} | ${linha.principal} | ${linha.opcionais} |`);
}
console.log(`| **Total** | **${totais.acoes}** | **${totais.extras}** | **${totais.perguntasDeSaida}** | **${totais.baseBloco}** | **${totais.entrada}** | **${totais.pedido} + ${totais.fiz} = ${totais.guiado}** | **${totais.pedido} + ${totais.segueLivro} = ${totais.guiado}** | **${totais.direto}** | **${totais.principalAntes}** | **${totais.principal}** | **${totais.opcionais}** |`);

const categoriasPrincipais = Object.fromEntries(Object.keys(linhas[0].detalhes.principal).map((campo) =>
  [campo, linhas.reduce((total, linha) => total + linha.detalhes.principal[campo], 0)]));
const categoriasOpcionais = Object.fromEntries(Object.keys(linhas[0].detalhes.opcionais).map((campo) =>
  [campo, linhas.reduce((total, linha) => total + linha.detalhes.opcionais[campo], 0)]));

console.log("\n## Decisões e investigações\n");
console.log(`Caminho principal: ${totais.principal} (${Object.entries(categoriasPrincipais).map(([k, v]) => `${k}: ${v}`).join(", ")}).`);
console.log(`Perguntas de saída interpretativas: ${totais.perguntasInterpretativas} de ${totais.perguntasDeSaida}; a evidência aparece na saída e no porquê, e a resposta não aparece na saída nem na nota.`);
console.log(`Se explorar tudo que é opcional: +${totais.opcionais} (${Object.entries(categoriasOpcionais).map(([k, v]) => `${k}: ${v}`).join(", ")}), total ${totais.principal + totais.opcionais}.`);
console.log(`Avançar pode acionar ${totais.guiado - 1} das ${totais.guiado} passagens guiadas (o primeiro pedido só sai pelo chat) e as ${totais.direto} do modo direto.`);

console.log("\n| Passo | Apostas | Perguntas de bloco | Perguntas da saída | Comandos | Erros | Variantes | Dúvidas | Apostas de variante | Erros de variante |");
console.log("|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|");
for (const linha of linhas) {
  const p = linha.detalhes.principal, o = linha.detalhes.opcionais;
  console.log(`| ${linha.n} | ${p.apostas} | ${p.perguntasDeBloco} | ${p.perguntasDeSaida} | ${p.comandos} | ${p.erros} | ${o.variantes} | ${o.duvidas} | ${o.apostasDeVariante} | ${o.errosDeVariante} |`);
}
console.log(`| **Total** | **${categoriasPrincipais.apostas}** | **${categoriasPrincipais.perguntasDeBloco}** | **${categoriasPrincipais.perguntasDeSaida}** | **${categoriasPrincipais.comandos}** | **${categoriasPrincipais.erros}** | **${categoriasOpcionais.variantes}** | **${categoriasOpcionais.duvidas}** | **${categoriasOpcionais.apostasDeVariante}** | **${categoriasOpcionais.errosDeVariante}** |`);
console.log(`\nNo modo direto, apostas, perguntas de bloco, perguntas de saída e digitação dos comandos saem. Permanecem ${totais.decisoesDiretas} investigações de erro no caminho principal e ${totais.opcionaisDiretas} oportunidades opcionais.`);

if (numero === "01") {
  console.log(`\nAntes/depois: ${totais.baseBloco} → ${totais.guiado} passagens mecânicas nos modos guiados; ${totais.principalAntes} → ${totais.principal} decisões principais. O modo direto permanece em ${totais.direto} passagens.`);
} else {
  console.log(`\nO quadro por ação já reduzia a base de ${totais.baseBloco} para ${totais.entrada} passagens. Nesta etapa: ${totais.entrada} → ${totais.guiado} passagens mecânicas nos modos guiados; ${totais.principalAntes} → ${totais.principal} decisões principais. O modo direto permanece em ${totais.direto} passagens.`);
}
