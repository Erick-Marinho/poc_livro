/** As palavras que o leitor lê (docs/capacidades/ajustes-da-introducao.md): o problema é "capturado", e o leitor "investe", em vez de apostar. Confere as páginas montadas, os textos, os dados das figuras e as frases dos componentes. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const arquivos = (pasta, fim) => readdirSync(new URL(`../${pasta}/`, import.meta.url), { recursive: true })
  .filter((f) => f.endsWith(fim) && !/(^|\/)(node_modules|projeto|marcos)\//.test(f)).map((f) => `${pasta}/${f}`);
const visivel = (html) => html.replace(/<(script|style)[\s\S]*?<\/\1>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
// o que é texto num JSON do livro: todo valor, menos a descrição para quem mantém ("sobre")
const lido = (v) => (typeof v === "string" ? [v] : Array.isArray(v) ? v.flatMap(lido) : v && typeof v === "object" ? Object.entries(v).filter(([k]) => k !== "sobre").flatMap(([, x]) => lido(x)) : []);
// as frases de um componente (com espaço: nomes internos, como o realce "pego", ficam de fora), sem os comentários e
// sem as mensagens de erro da montagem, que são para quem escreve
const frases = (fonte) => fonte.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/[^\n]*/g, "$1").replace(/new Error\([^\n]*/g, "")
  .match(/"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`|>[^<>{}\n]+</g)?.map(semCodigo).filter((s) => s.includes(" ")) ?? [];
// numa template string, o que está em ${...} é código, não frase
const semCodigo = (s) => { let fora = "", fundo = 0; for (let i = 0; i < s.length; i++) {
  if (!fundo && s[i] === "$" && s[i + 1] === "{") { fundo = 1; i++; } else if (fundo) fundo += s[i] === "{" ? 1 : s[i] === "}" ? -1 : 0; else fora += s[i];
} return fora; };
const nenhuma = (s, palavra, onde) => assert.equal(s.match(palavra)?.[0], undefined, onde);

test("o leitor lê \"capturado\", e não \"pego\" nem \"apanhado\", na introdução: no texto, na aposta, nas cenas, nos cartões e na animação", () => {
  const pega = /.{0,40}\b(pego|pegos|pega|pegam|pegá-la|pegá-lo|pegou|apanhado|apanhá-la)\b.{0,20}/i;
  const texto = visivel(ler("dist/ciclo-de-vida/00-introducao/index.html"));
  nenhuma(texto, pega, "na página montada");
  for (const f of ["onde-se-pega", "ciclo-animado", "ciclo"]) for (const s of lido(JSON.parse(ler(`livros/ciclo-de-vida/figuras/${f}.json`)))) nenhuma(s, pega, `${f}.json`);
  for (const f of ["FiguraCiclo", "CicloAnimado"]) for (const s of frases(ler(`src/components/livro/ciclo/${f}.tsx`))) nenhuma(s, pega, `${f}.tsx`);
  assert.match(texto, /capturado/);
});

test("o leitor investe, e não aposta, no livro todo: nas páginas, nos textos, nos roteiros, nos dados e nos componentes", () => {
  // "a aposta da parte do modelo local" é a do artigo, no experimento, e não uma ação do leitor; colada a um nome
  // (`ic-opcao-aposta`, `fontmar:apostou`), é classe ou evento
  const aposta = /.{0,40}(?<![-.:\w])apost\w*\b(?! da parte do modelo local).{0,20}/i;
  const paginas = arquivos("dist", ".html");
  assert.ok(paginas.length > 5, "monte o site antes: astro build");
  for (const p of paginas) nenhuma(visivel(ler(p)), aposta, p);
  for (const p of [...arquivos("livros", ".mdx"), ...arquivos("experimentos", ".mdx")]) nenhuma(ler(p).replace(/^import .*$/gm, "").replace(/<Aposta\b/g, "").replace(/\baposta=\{/g, ""), aposta, p);
  for (const p of [...arquivos("livros", ".json"), ...arquivos("experimentos", ".json")]) for (const s of lido(JSON.parse(ler(p)))) nenhuma(s, aposta, p);
  for (const p of [...arquivos("src/components", ".astro"), ...arquivos("src/components", ".tsx")]) for (const s of frases(ler(p))) nenhuma(s, aposta, p);
  assert.match(visivel(ler("dist/ciclo-de-vida/00-introducao/index.html")), /\binvista\b/i);
});

test("o problema do custo diz que é o gasto com o modelo, e não \"a conta\": no texto, na caixa e na animação", () => {
  const conta = /.{0,40}\bconta (que cresce|só aparece)\b.{0,20}/i;
  const texto = visivel(ler("dist/ciclo-de-vida/00-introducao/index.html"));
  nenhuma(texto, conta, "na página montada");
  for (const f of ["onde-se-pega", "ciclo-animado"]) for (const s of lido(JSON.parse(ler(`livros/ciclo-de-vida/figuras/${f}.json`)))) nenhuma(s, conta, `${f}.json`);
  assert.match(texto, /o gasto com o modelo que cresce sem aviso/i);
});
