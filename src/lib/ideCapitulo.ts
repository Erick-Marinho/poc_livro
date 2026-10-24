/**
 * O que a IDE do capítulo mostra, montado a partir do roteiro, dos estados e das saídas gravadas (scripts/saidas.py).
 * Falha (e o livro não monta) se os passos não emendarem e cobrirem o roteiro inteiro, se faltar uma saída, ou se uma
 * aposta não tiver a resposta certa entre as opções.
 * Puro de propósito: o teste do livro chama isto direto, sem montar a página.
 */
import { codeToHtml } from "shiki";
import { dobrarErro, mudadas } from "./codigo.ts";
import type { Trecho } from "./codigo.ts";

export type Aposta = { pergunta: string; opcoes: string[]; certa: number };
export type VersaoIde = { nome: string; html: string | null };
export type TermoIde = { chave: string; rotulo: string; texto: string; marca?: string };
export type PerguntaIde = { texto: string; opcoes: string[]; certa: number; porque: string };
/** um bloco lógico do código que entrou: as linhas (no arquivo daquele momento), o que ele faz, e as palavras dele */
export type BlocoIde = { a: number; z: number; titulo: string; texto: string; termos: TermoIde[]; pergunta?: PerguntaIde };
export type AcaoIde = { nota: string } & (
  | { tipo: "editar"; arquivo: string; versao: number; alteradas: number[]; novo: boolean; blocos: BlocoIde[] }
  | { tipo: "copiar"; arquivos: { nome: string; versao: number }[] }
  | { tipo: "apagar"; arquivo: string }
  | { tipo: "rodar"; id: string; comando: string; onde: string; saida: Trecho[]; erro: boolean; aposta?: Aposta;
      gerados: { nome: string; versao: number; alteradas: number[]; novo: boolean }[]; apagados: string[] });
export type PassoCap = { n: number; id: string; secao: string; nomeSecao: string; titulo: string; curta: string; de: number; ate: number;
  objetivo: string; temos: string; engano?: string; antes: string[]; depois: string[]; sinal: "ok" | "erro" | "engano" | "nada";
  /** a mensagem do autor ao chat que abre o passo; `rascunho` enquanto o autor não revisou */
  pedido: string; rascunho: boolean;
  /** o ponto de volta: a tag do fim do passo anterior, no repositório do leitor (só quando ele existe) */
  volta?: { repositorio: string; tag: string } };

type DefBloco = { linhas: string; titulo: string; texto: string; termos?: string[]; pergunta?: PerguntaIde };
type PassoRoteiro = { acao: string; arquivo?: string; id?: string; nota: string; aposta?: Aposta; onde?: string; blocos?: DefBloco[] };
type Estado = { passo: number; arquivo?: string; conteudo?: string; arquivos?: Record<string, string | null>; rodou?: string;
  gerados?: Record<string, string | null>; apagados?: string[]; apagado?: string };
type Saida = { comando: string; saiu_com: number; saida: [string, string][] };
type DefPasso = { id: string; secao: string; titulo: string; curta: string; de: number; ate: number; objetivo: string; temos: string;
  engano?: string; antes?: string[]; depois?: string[]; pedido?: string; pedido_revisado?: boolean };
export type Entrada = {
  roteiro: { passos: PassoRoteiro[] };
  estados: Estado[];
  saidas: Record<string, Saida>;
  /** `repositorio`: o endereço do repositório do leitor (npm run leitor); sem ele, a IDE não mostra o ponto de volta */
  capitulo: { autores?: string[]; repositorio?: string; prefixo_tag?: string; passos: DefPasso[] };
  secoes: Record<string, string>;
  glossario: { termos: Record<string, { marca?: string; rotulo?: string; texto: string }> };
  pasta?: string;
  numero?: string;
};

export async function montarIde({ roteiro, estados, saidas, capitulo, secoes, glossario, pasta = "~/atendimento-bemtevi", numero = "" }: Entrada) {
  const falhar = (m: string): never => { throw new Error(`IDE do capítulo (figura ${numero}): ${m}`); };

  /* os passos emendam um no outro e cobrem o roteiro inteiro */
  capitulo.passos.forEach((p, i) => {
    const antes = capitulo.passos[i - 1];
    if (i === 0 && p.de !== 1) falhar(`o primeiro passo começa no ${p.de} do roteiro, e não no 1`);
    if (antes && antes.ate + 1 !== p.de) falhar(`o passo ${p.id} começa no ${p.de}, e o anterior termina no ${antes.ate}: nenhum pedaço do caminho pode sumir`);
    if (p.ate < p.de) falhar(`o passo ${p.id} termina antes de começar`);
    if (!secoes[p.secao]) falhar(`falta o nome da seção ${p.secao}`);
  });
  if (capitulo.passos.at(-1)!.ate !== roteiro.passos.length) falhar(`o último passo termina no ${capitulo.passos.at(-1)!.ate}, e o roteiro tem ${roteiro.passos.length}`);

  /* cada versão de arquivo vira HTML uma vez só */
  const LINGUA: Record<string, string> = { py: "python", jsonl: "json", json: "json", md: "markdown", toml: "toml" };
  const versoes: VersaoIde[] = [];
  const idDe = new Map<string, number>();
  async function versao(nome: string, texto: string | null): Promise<number> {
    const chave = `${nome}\u0000${texto}`;
    if (idDe.has(chave)) return idDe.get(chave)!;
    const html = texto === null ? null : await codeToHtml(texto.replace(/\n$/, ""), {
      lang: LINGUA[nome.split(".").pop() ?? ""] ?? "text", theme: "dark-plus",
      transformers: [{ code(no) { no.children = no.children.filter((c) => c.type === "element"); }, line(no, n) { no.properties["data-n"] = String(n); } }],
    });
    versoes.push({ nome, html });
    idDe.set(chave, versoes.length - 1);
    return versoes.length - 1;
  }

  /* o fim de cada arquivo (é igual ao projeto/, o saidas.py garante): os blocos apontam linhas dele, como as partes do roteiro */
  const finais: Record<string, string> = {};
  for (const e of estados) { if (e.arquivo) finais[e.arquivo] = e.conteudo!; for (const [n, t] of Object.entries({ ...(e.arquivos ?? {}), ...(e.gerados ?? {}) })) if (t !== null) finais[n] = t; }
  /* um bloco: acha as linhas dele no arquivo daquele momento, pelo texto, e confere as palavras e a pergunta */
  function blocosDe(k: number, arquivo: string, conteudo: string, defs: DefBloco[]): BlocoIde[] {
    const agora = conteudo.replace(/\n$/, "").split("\n"), fim = finais[arquivo].replace(/\n$/, "").split("\n");
    return defs.map((d, i) => {
      const [de, ate = de] = d.linhas.split("-").map(Number);
      const alvo = fim.slice(de - 1, ate);
      if (!alvo.length) falhar(`ação ${k}: o bloco ${i + 1} (${d.linhas}) está fora de ${arquivo}`);
      const onde = agora.findIndex((_, j) => alvo.every((l, m) => agora[j + m] === l));
      if (onde < 0) falhar(`ação ${k}: o bloco ${i + 1} (${d.titulo}) não está em ${arquivo} nesse momento`);
      const termos = (d.termos ?? []).map((t) => {
        const g = glossario.termos[t] ?? falhar(`ação ${k}, bloco "${d.titulo}": "${t}" não está no glossário`);
        return { chave: t, rotulo: g.rotulo ?? t, texto: g.texto, marca: g.marca };
      });
      if (d.pergunta && !(d.pergunta.certa >= 0 && d.pergunta.certa < d.pergunta.opcoes.length)) falhar(`ação ${k}, bloco "${d.titulo}": a resposta certa não está entre as opções`);
      return { a: onde + 1, z: onde + alvo.length, titulo: d.titulo, texto: d.texto, termos, pergunta: d.pergunta };
    });
  }

  /* as ações do roteiro, na ordem, cada uma com o que muda no projeto */
  const atual: Record<string, string | null> = {};
  const acoes: AcaoIde[] = [];
  const cwdLeitor = (onde?: string) => (onde === "acima" ? pasta.replace(/\/[^/]+$/, "") || "~" : pasta);
  for (const e of estados) {
    const p = roteiro.passos[e.passo - 1];
    if (e.rodou) {
      const s = saidas[e.rodou] ?? falhar(`a saída ${e.rodou} não está no saidas.json; rode npm run saidas`);
      if (p.aposta && !(Number.isInteger(p.aposta.certa) && p.aposta.opcoes[p.aposta.certa])) falhar(`a aposta de ${e.rodou} não tem a resposta certa entre as opções`);
      const gerados = [];
      for (const [nome, texto] of Object.entries(e.gerados ?? {})) {
        gerados.push({ nome, versao: await versao(nome, texto), alteradas: texto === null ? [] : mudadas(atual[nome], texto), novo: !(nome in atual) });
        atual[nome] = texto;
      }
      for (const nome of e.apagados ?? []) delete atual[nome];
      acoes.push({ tipo: "rodar", nota: p.nota, id: e.rodou, comando: s.comando, onde: cwdLeitor(p.onde), saida: dobrarErro(s.saida),
        erro: s.saiu_com !== 0 || s.saida.some(([, c]) => c === "err"), aposta: p.aposta, gerados, apagados: e.apagados ?? [] });
    } else if (e.arquivos) {
      const arquivos = [];
      for (const [nome, texto] of Object.entries(e.arquivos)) { arquivos.push({ nome, versao: await versao(nome, texto) }); atual[nome] = texto; }
      acoes.push({ tipo: "copiar", nota: p.nota, arquivos });
    } else if (e.apagado) {
      delete atual[e.apagado];
      acoes.push({ tipo: "apagar", nota: p.nota, arquivo: e.apagado });
    } else if (e.arquivo) {
      const alteradas = mudadas(atual[e.arquivo], e.conteudo!);
      const novo = !(e.arquivo in atual);
      atual[e.arquivo] = e.conteudo!;
      const blocos = p.blocos ? blocosDe(e.passo, e.arquivo, e.conteudo!, p.blocos) : [];
    acoes.push({ tipo: "editar", nota: p.nota, arquivo: e.arquivo, versao: await versao(e.arquivo, e.conteudo!), alteradas, novo, blocos });
    }
  }
  if (acoes.length !== roteiro.passos.length) falhar(`o roteiro tem ${roteiro.passos.length} ações e os estados, ${acoes.length}; rode npm run saidas`);

  /* os passos do capítulo, com o sinal do comando do fim (para o progresso no topo) */
  const passos: PassoCap[] = capitulo.passos.map((p, i) => {
    const runs = acoes.slice(p.de - 1, p.ate).filter((a) => a.tipo === "rodar");
    const ultimo = runs.at(-1);
    const sinal = !ultimo ? "nada" : p.engano ? "engano" : ultimo.tipo === "rodar" && ultimo.erro ? "erro" : "ok";
    return { n: i + 1, id: p.id, secao: p.secao, nomeSecao: secoes[p.secao], titulo: p.titulo, curta: p.curta, de: p.de, ate: p.ate,
      objetivo: p.objetivo, temos: p.temos, engano: p.engano, antes: p.antes ?? [], depois: p.depois ?? [], sinal,
    pedido: p.pedido ?? falhar(`o passo ${p.id} não tem o pedido do autor ao chat`), rascunho: !p.pedido_revisado,
    volta: capitulo.repositorio && i > 0 ? { repositorio: capitulo.repositorio, tag: `${capitulo.prefixo_tag ?? "cap-01"}/passo-${String(i).padStart(2, "0")}` } : undefined };
  });
  /* o Python do projeto, como o uv contou ao criar o ambiente (o .venv): é o que o rodapé da IDE mostra */
  let python: { versao: string; desde: number } | null = null;
  acoes.forEach((a, k) => {
    if (python || a.tipo !== "rodar") return;
    for (const t of a.saida) { const m = t.tipo === "linha" && t.l.match(/^Using CPython (\S+)/); if (m) { python = { versao: m[1], desde: k }; break; } }
  });
  return { acoes, passos, versoes, python };
}
