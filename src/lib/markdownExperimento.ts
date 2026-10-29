/**
 * Um experimento num arquivo Markdown só (docs/capacidades/markdown-dos-experimentos.md): o texto, com cada componente
 * virado texto (a resposta do Pare e pense e do palpite fica recolhida num <details>), o resultado lido das saídas
 * gravadas, o projeto final e as saídas. Componente que o conversor não conhece faz a montagem falhar: nada sai calado.
 */
import { ANOTACOES, baloes, JORNADA, LEGENDAS } from "../components/livro/kv/kv.ts";
import { dataLonga } from "./datas.ts";
import { NIVEIS, type Nivel } from "./niveis.ts";
import type { Saidas } from "./resultados.ts";

export interface Dados {
  titulo: string; lide: string; data: string; etiqueta: string; nivel: Nivel;
  afirmacao: { texto: string; fonte: { titulo: string; url: string } };
  regua: { arquivo: string; conta: string };
  achado: string; custo: string;
  audio?: { arquivo: string; sobre: string };
}
export interface Entrada {
  id: string;
  /** o endereço do site, sem a barra do fim: os links do texto que começam com "/" passam a apontar para ele */
  origem: string;
  dados: Dados;
  /** o corpo do .mdx, sem o frontmatter */
  corpo: string;
  /** o JSON de cada import do .mdx, pelo nome do import */
  importados: Record<string, any>;
  resultados: { rotulo: string; acertos: number; total: number; nota: string; comando: string }[];
  saidas: Saidas;
  /** os arquivos do projeto, na ordem em que entram, com o caminho a partir de projeto/ */
  projeto: { caminho: string; texto: string }[];
  /** o que ficou de fora do projeto, e por quê */
  deFora: string;
}

type Tag = { nome: string; attrs: Record<string, string>; corpo?: string; fim: number };

/** Lê a tag que começa em s[i] ("<Nome"), respeitando aspas e chaves aninhadas nos atributos. */
function lerTag(s: string, i: number): Tag {
  const nome = s.slice(i + 1).match(/^[A-Za-z]+/)![0];
  const attrs: Record<string, string> = {};
  let j = i + 1 + nome.length;
  for (;;) {
    while (/\s/.test(s[j])) j++;
    if (s.startsWith("/>", j)) return { nome, attrs, fim: j + 2 };
    if (s[j] === ">") {
      const fecha = s.indexOf(`</${nome}>`, j);
      if (fecha < 0) throw new Error(`<${nome}> sem </${nome}>`);
      return { nome, attrs, corpo: s.slice(j + 1, fecha).trim(), fim: fecha + nome.length + 3 };
    }
    const a = s.slice(j).match(/^[\w-]+/)?.[0];
    if (!a) throw new Error(`<${nome}>: atributo ilegível perto de "${s.slice(j, j + 30)}"`);
    j += a.length;
    if (s[j] !== "=") { attrs[a] = "true"; continue; }
    j++;
    if (s[j] === '"') { const k = s.indexOf('"', j + 1); attrs[a] = s.slice(j + 1, k); j = k + 1; continue; }
    let prof = 0, k = j, aspas = false;
    for (; k < s.length; k++) {
      if (s[k] === '"') aspas = !aspas;
      else if (!aspas && s[k] === "{") prof++;
      else if (!aspas && s[k] === "}" && --prof === 0) break;
    }
    attrs[a] = s.slice(j + 1, k).trim();
    j = k + 1;
  }
}

const detalhes = (resumo: string, texto: string) => `<details><summary>${resumo}</summary>\n\n${texto}\n\n</details>`;

function palpite(dados: any, pergunta: string) {
  const msgs = (dados.mensagens as { texto: string; opcoes: string[]; fez: number; porque: string }[]).map((m) =>
    `${m.texto}\n\n${m.opcoes.map((o) => `- ${o}`).join("\n")}\n\n${detalhes("Ver o que aconteceu", `**${dados.resultado ?? "O que aconteceu"}: ${m.opcoes[m.fez]}.** ${m.porque}`)}`);
  return `**Palpite: ${pergunta}** Escolha uma opção antes de abrir.\n\n${msgs.join("\n\n")}`;
}

/** Cada componente do .mdx vira texto. Sem conversor, erro. */
function converter(t: Tag, e: Entrada): string {
  const a = t.attrs;
  const dados = (nome: string) => {
    if (!(nome in e.importados)) throw new Error(`experimentos/${e.id}: <${t.nome}> usa "${nome}", que não é um import JSON do .mdx`);
    return e.importados[nome];
  };
  switch (t.nome) {
    case "PareEPense": return `**${a.titulo ? a.titulo[0].toUpperCase() + a.titulo.slice(1) : "Pare e pense"}: ${a.pergunta}**\n\n${detalhes("Ver a resposta", t.corpo ?? "")}`;
    case "Aposta": return palpite(dados(a.dados), a.pergunta);
    case "KvCache": {
      const f = { jornada: JORNADA, anotacoes: ANOTACOES }[a.qual as "jornada" | "anotacoes"];
      if (!f) throw new Error(`experimentos/${e.id}: <KvCache qual="${a.qual}"> não existe`);
      return `**Figura** (animada na página):\n\n${baloes(f).map((b, k) => `${k + 1}. ${b.texto}`).join("\n")}\n\n*${LEGENDAS[a.qual as keyof typeof LEGENDAS]}*`;
    }
    case "IdeCapitulo": return `**A IDE.** Na página, a IDE monta o projeto desde a pasta vazia, passo a passo. Aqui, o projeto final está em "O projeto", e o que cada comando imprimiu, em "As saídas gravadas", no fim do arquivo.\n\n*${a.legenda}*`;
    case "Exercicio": return `### Exercício: ${a.titulo}\n\n${t.corpo}`;
    case "Nota": return `> **${a.titulo ?? "por que assim"}.** ${(t.corpo ?? "").replace(/\n/g, "\n> ")}`;
    case "Pendente": return "";
    default: throw new Error(`experimentos/${e.id}: o Markdown não sabe converter <${t.nome}>; ensine em src/lib/markdownExperimento.ts`);
  }
}

/** O corpo do .mdx em Markdown: sem os imports, com os componentes convertidos e os links absolutos. */
export function corpoEmMarkdown(e: Entrada): string {
  const s = e.corpo.replace(/^import .*\n/gm, "");
  let saida = "", i = 0;
  for (;;) {
    const k = s.slice(i).search(/<[A-Z]/);
    if (k < 0) { saida += s.slice(i); break; }
    saida += s.slice(i, i + k);
    const t = lerTag(s, i + k);
    saida += converter(t, e);
    i = t.fim;
  }
  return saida.replace(/\]\(\//g, `](${e.origem}/`).replace(/\n{3,}/g, "\n\n").trim();
}

const cerca = (texto: string) => "`".repeat(Math.max(3, ...[...texto.matchAll(/`+/g)].map((m) => m[0].length + 1)));
const LINGUA: Record<string, string> = { py: "python", toml: "toml", json: "json", jsonl: "json", md: "markdown" };
const bloco = (texto: string, lingua = "") => { const c = cerca(texto); return `${c}${lingua}\n${texto.replace(/\n$/, "")}\n${c}`; };

export function markdownDoExperimento(e: Entrada): string {
  const d = e.dados, n = NIVEIS[d.nivel], pagina = `${e.origem}/experimentos/${e.id}/`;
  const partes = [
    `# ${d.titulo}`,
    d.lide,
    [`- **Para quem é:** ${n.nome.toLowerCase()}. Pede ${n.pede}.`, `- ${d.etiqueta} · ${dataLonga(d.data)}`,
      `- **Na página**, com as figuras animadas e a IDE: ${pagina}`, ...(d.audio ? [`- **Áudio:** ${e.origem}${d.audio.arquivo}. ${d.audio.sobre}`] : [])].join("\n"),
    "## O que se testa",
    `> ${d.afirmacao.texto}\n>\n> A afirmação, de [${d.afirmacao.fonte.titulo}](${d.afirmacao.fonte.url})`,
    `**A régua.** ${d.regua.conta} \`${d.regua.arquivo}\``,
    corpoEmMarkdown(e),
    "## O que deu",
    e.resultados.map((r) => `- ${r.rotulo}: **${r.acertos} de ${r.total} (${r.nota})** — \`$ ${r.comando}\``).join("\n"),
    `**O inesperado.** ${d.achado}`,
    `**O custo.** ${d.custo}`,
    "## O projeto",
    `Os arquivos do projeto como ficam no fim da IDE, em \`projeto/\`. ${e.deFora}`,
    ...e.projeto.map((f) => `### \`${f.caminho}\`\n\n${bloco(f.texto, LINGUA[f.caminho.split(".").pop()!] ?? "")}`),
    "## As saídas gravadas",
    "O que cada comando imprimiu no projeto real, como o livro gravou. Um comando que aparece mais de uma vez foi gravado em passos diferentes da IDE, cada vez com o código daquele passo.",
    ...Object.values(e.saidas).map((s, _, todas) => {
      const repete = todas.filter((x) => x.comando === s.comando).length > 1 ? " (num passo da IDE, com o código daquele passo)" : "";
      return `### \`$ ${s.comando}\`${repete}\n\n${bloco(s.saida.map(([l]) => l).join("\n"), "text")}`;
    }),
  ];
  return partes.filter(Boolean).join("\n\n") + "\n";
}
