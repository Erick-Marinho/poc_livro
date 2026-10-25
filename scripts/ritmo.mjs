/**
 * O relógio de um texto do livro (docs/RITMO.md): quantas palavras o leitor lê sem agir, de uma ação à próxima.
 *
 *     node scripts/ritmo.mjs              os capítulos e os experimentos, com as barras e os avisos
 *     node scripts/ritmo.mjs --estrito    sai com 1 se algum trecho passar do limite de falha
 *
 * Puro de propósito: o teste chama medir() direto.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";

export const AVISO = 200, FALHA = 400;

/* cada componente: conta como ação (pede uma decisão do leitor) ou não. Novo componente sem classificação para tudo. */
const CONTA = { IdeCapitulo: true, Classificador: true, PareEPense: true, Exercicio: true, Rastro: true, Aposta: true, Pilhas: true, Troca: true,
  Rascunho: true, /* a ação sugerida pela skill: conta como se aceita, para o relógio mostrar o ritmo da proposta */
  GrafoAgente: (tag) => /modo="caminhos"/.test(tag),
  Nota: false, Terminal: false, FiguraAgente: false, FiguraCaminho: false, FiguraCofre: false,
  MapaDoCiclo: false, Termos: false, Pendente: false, Resumo: false, PontoDeVolta: false, Listagem: false };
/* o texto destes não é lido pelo leitor como texto corrido (ainda não existe, ou é fecho) */
const SEM_TEXTO = new Set(["Pendente", "PontoDeVolta"]);

/** Se um componente pede uma decisão do leitor. Com regra por modo (GrafoAgente), basta que um modo peça. */
export const eAcao = (nome) => typeof CONTA[nome] === "function" || CONTA[nome] === true;

/** O que um Rascunho precisa dizer (docs/capacidades/ritmo-no-texto.md): uma ação de verdade, e de onde vem o dado. */
export function conferirRascunho({ acao, nova = false, dado }) {
  if (!nova && !(acao in CONTA)) throw new Error(`Rascunho: o componente ${acao} não existe no livro; se é um componente novo, diga com nova`);
  if (!nova && !eAcao(acao)) throw new Error(`Rascunho: ${acao} não pede uma decisão do leitor, então não é ação (docs/RITMO.md)`);
  if (!/^(real|ilustração): \S/.test(dado ?? "")) throw new Error(`Rascunho: o dado de ${acao} começa com "real: " ou "ilustração: ", e diz de onde vem`);
}

const palavras = (t) => t.replace(/<[^>]+>/g, " ").replace(/\{[^}]*\}/g, " ").replace(/[*`#|_>-]+/g, " ").split(/\s+/).filter((p) => /\p{L}|\d/u.test(p)).length;

/** Os trechos de um texto: { secao, palavras, ate } — `ate` é a ação que fecha o trecho (null no fim do texto). */
export function medir(mdx) {
  const corpo = mdx.replace(/^---\n[\s\S]*?\n---\n/, "").replace(/^import .*$/gm, "");
  const linhas = corpo.split("\n");
  const trechos = [];
  let secao = "", conta = 0, comecoSecao = "";
  const fecha = (ate) => { trechos.push({ secao: comecoSecao || secao, palavras: conta, ate }); conta = 0; comecoSecao = ""; };
  for (let i = 0; i < linhas.length; i++) {
    const l = linhas[i];
    if (l.startsWith("## ")) { secao = l.slice(3).trim(); if (!conta) comecoSecao = ""; continue; }
    const m = l.match(/^<([A-Z][A-Za-z]*)\b/);
    if (!m) { if (!comecoSecao && palavras(l)) comecoSecao = secao; conta += palavras(l); continue; }
    const nome = m[1];
    if (!(nome in CONTA)) throw new Error(`o componente ${nome} não está classificado em scripts/ritmo.mjs: ele pede uma decisão do leitor ou não? (docs/RITMO.md)`);
    /* o componente inteiro, da abertura ao fechamento */
    let bloco = l;
    const fechou = (b) => new RegExp(`/>\\s*$|</${nome}>`).test(b);
    while (!fechou(bloco) && i + 1 < linhas.length) bloco += "\n" + linhas[++i];
    const tag = bloco.match(new RegExp(`^<${nome}\\b[\\s\\S]*?>`))?.[0] ?? bloco;
    const regra = CONTA[nome];
    const acao = typeof regra === "function" ? regra(tag) : regra;
    if (acao) fecha(nome);
    else if (!SEM_TEXTO.has(nome)) { const dentro = bloco.slice(tag.length).replace(new RegExp(`</${nome}>\\s*$`), ""); conta += palavras(dentro); if (!comecoSecao && conta) comecoSecao = secao; }
  }
  fecha(null);
  return trechos.filter((t) => t.palavras > 0 || t.ate);
}

/** Os textos medidos: a introdução, os capítulos e experimentos. */
export function textos(raiz = new URL("../", import.meta.url)) {
  const lista = [];
  for (const livro of readdirSync(new URL("livros/", raiz))) {
    const pasta = new URL(`livros/${livro}/capitulos/`, raiz);
    if (!existsSync(pasta)) continue;
    for (const f of readdirSync(pasta).filter((f) => /^\d\d-.*\.mdx$/.test(f)).sort())
      lista.push({ nome: `${livro}/${f.replace(/\.mdx$/, "")}`, texto: readFileSync(new URL(f, pasta), "utf8") });
  }
  const exp = new URL("experimentos/", raiz);
  if (existsSync(exp)) for (const e of readdirSync(exp).sort()) {
    const arq = new URL(`experimentos/${e}/experimento.mdx`, raiz);
    if (existsSync(arq)) lista.push({ nome: `experimentos/${e}`, texto: readFileSync(arq, "utf8") });
  }
  return lista;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const estrito = process.argv.includes("--estrito");
  let falhas = 0;
  for (const { nome, texto } of textos()) {
    console.log(`\n${nome}`);
    for (const t of medir(texto).filter((t) => t.palavras > 0)) {
      const marca = t.palavras > FALHA ? "✖" : t.palavras > AVISO ? "⚠" : " ";
      if (t.palavras > FALHA) falhas++;
      const barra = "█".repeat(Math.round(t.palavras / 25));
      console.log(`  ${marca} ${t.secao.slice(0, 28).padEnd(28)} ${String(t.palavras).padStart(4)} palavras ~${(t.palavras / 200).toFixed(1)} min  ${barra}${t.ate ? `  → ${t.ate}` : "  (fim)"}`);
    }
  }
  console.log(`\naviso acima de ${AVISO} palavras sem ação; falha acima de ${FALHA} (docs/RITMO.md)`);
  if (estrito && falhas) { console.error(`${falhas} trecho(s) acima de ${FALHA}`); process.exit(1); }
}
