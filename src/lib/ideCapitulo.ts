/**
 * O que a IDE do capítulo mostra, montado a partir do roteiro, dos estados e das saídas gravadas (scripts/saidas.py).
 * Falha (e o livro não monta) se os passos não emendarem e cobrirem o roteiro inteiro, se faltar uma saída, ou se uma
 * aposta não tiver a resposta certa entre as opções. Do capítulo 2 em diante, a IDE abre com o projeto como os
 * capítulos anteriores o deixaram (os estados deles), e o comando que chamou um modelo diz quando e com qual foi gravado.
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
/** o que um modelo de verdade respondeu num comando, gravado uma vez e repetido no livro (scripts/gravacao) */
export type GravacaoIde = { quando: string; modelo: string; chamadas: number };
/** um problema que o comando mostrou: a mensagem, e onde no código do leitor (quando a saída diz) */
export type ProblemaIde = { mensagem: string; arquivo?: string; linha?: number };
/** modificar antes de criar: uma troca do trecho (no arquivo ou no comando), com a saída que ela gravou de verdade */
export type OpcaoVariar = { id: string; rotulo: string; comando: string; saida: Trecho[]; erro: boolean; problemas: ProblemaIde[]; nota: string; aposta?: Aposta;
  versao?: number; alteradas?: number[] };
/** `linha`: onde o trecho está no arquivo (sem `arquivo`, o trecho está no comando); `original`: a palavra do livro */
export type VariarIde = { arquivo?: string; linha?: number; trecho: string; original: string; convite: string; por: string; opcoes: OpcaoVariar[] };
/** uma dúvida comum naquele ponto, com a resposta escrita no roteiro: o leitor pergunta no chat, se quiser */
export type DuvidaIde = { pergunta: string; resposta: string };
export type AcaoIde = { nota: string; duvidas?: DuvidaIde[]; suavez?: string } & (
  | { tipo: "editar"; arquivo: string; versao: number; alteradas: number[]; novo: boolean; blocos: BlocoIde[] }
  | { tipo: "copiar"; arquivos: { nome: string; versao: number }[] }
  | { tipo: "apagar"; arquivo: string }
  | { tipo: "rodar"; id: string; comando: string; onde: string; saida: Trecho[]; erro: boolean; problemas: ProblemaIde[]; aposta?: Aposta; gravacao?: GravacaoIde; variar?: VariarIde;
      gerados: { nome: string; versao: number; alteradas: number[]; novo: boolean }[]; apagados: string[] });
export type PassoCap = { n: number; id: string; secao: string; nomeSecao: string; titulo: string; curta: string; de: number; ate: number;
  objetivo: string; temos: string; engano?: string; antes: string[]; depois: string[]; sinal: "ok" | "erro" | "engano" | "nada";
  /** a mensagem do autor ao chat que abre o passo; `rascunho` enquanto o autor não revisou */
  pedido: string; rascunho: boolean;
  /** o ponto de volta: a tag do fim do passo anterior, no repositório do leitor (só quando ele existe) */
  volta?: { repositorio: string; tag: string } };

type DefBloco = { linhas: string; titulo: string; texto: string; termos?: string[]; pergunta?: PerguntaIde };
type DefVariar = { arquivo?: string; trecho: string; original: string; convite: string;
  opcoes: { id: string; rotulo: string; por: string; nota: string; aposta?: Aposta }[] };
type PassoRoteiro = { acao: string; arquivo?: string; id?: string; nota: string; aposta?: Aposta; onde?: string; blocos?: DefBloco[]; variar?: DefVariar;
  duvidas?: DuvidaIde[];
  /** o que o leitor faz na máquina dele, quando o texto genérico não serve (instalar um programa, criar o cofre) */
  suavez?: string };
type Estado = { passo: number; arquivo?: string; conteudo?: string; arquivos?: Record<string, string | null>; rodou?: string;
  gerados?: Record<string, string | null>; apagados?: string[]; apagado?: string;
  variantes?: Record<string, { arquivo?: string; conteudo?: string; alteradas?: number[] }> };
type Saida = { comando: string; saiu_com: number; saida: [string, string][] };
type DefPasso = { id: string; secao: string; titulo: string; curta: string; de: number; ate: number; objetivo: string; temos: string;
  engano?: string; antes?: string[]; depois?: string[]; pedido?: string; pedido_revisado?: boolean };
export type Entrada = {
  roteiro: { passos: PassoRoteiro[] };
  estados: Estado[];
  saidas: Record<string, Saida>;
  /** `repositorio`: o endereço do repositório do leitor (npm run leitor); sem ele, a IDE não mostra o ponto de volta */
  /** `abre_com`: o arquivo que a IDE mostra ao abrir, antes do primeiro passo (do capítulo 2 em diante) */
  capitulo: { autores?: string[]; repositorio?: string; prefixo_tag?: string; abre_com?: string; passos: DefPasso[] };
  secoes: Record<string, string>;
  glossario: { termos: Record<string, { marca?: string; rotulo?: string; texto: string }> };
  /** a pasta do projeto, como o leitor a vê (~/<projeto>): vem do comandos.json do livro (pasta_do_leitor) */
  pasta: string;
  numero?: string;
  /** os estados dos capítulos anteriores, em ordem: a IDE abre com o projeto como eles o deixaram */
  anteriores?: Estado[][];
  /** o que os comandos gravaram do modelo, por id do comando (resumirGravacao) */
  gravacoes?: Record<string, GravacaoIde>;
};

/** O resumo de um arquivo de gravação (livros/<livro>/gravacoes/<id>.json): o dia, o modelo e quantas chamadas. */
export function resumirGravacao(itens: Record<string, { quando: string; modelo: string }>): GravacaoIde {
  const lista = Object.values(itens);
  /* o nome do modelo, como a LangChain guarda (a OpenAI usa model_name; outros, model) */
  /* a LangChain descreve o modelo em JSON (OpenAI) ou como uma lista do Python (Ollama: [('_type', 'chat-ollama'), …]),
     e nesta o nome do modelo nem sempre vem: aí fica o tipo */
  const nome = (i: { modelo: string }) => {
    if (i.modelo.startsWith("[(")) return i.modelo.match(/\('model', '([^']+)'\)/)?.[1] ?? i.modelo.match(/\('_type', '([^']+)'\)/)?.[1] ?? "modelo desconhecido";
    const k = JSON.parse(i.modelo.split("---")[0]).kwargs ?? {};
    return k.model ?? k.model_name ?? "modelo desconhecido";
  };
  const modelos = new Set(lista.map(nome));
  const dias = lista.map((i) => i.quando).sort();
  return { quando: dias.at(-1) ?? "", modelo: [...modelos].join(", "), chamadas: lista.length };
}

/**
 * Os problemas de uma saída gravada, como a aba "problemas" da IDE mostra: tirados do que o comando imprimiu, sem
 * inventar nada. No pytest, cada falha dá o arquivo e a linha (`test_x.py:33: AssertionError`) e a primeira linha `E`
 * dela; num traceback, a mensagem final e o último trecho que é do projeto (o que está no .venv é biblioteca); sem
 * nenhum dos dois, a linha de erro que sobrou, sem lugar.
 */
export function problemasDe(saida: [string, string][], pasta: string): ProblemaIde[] {
  const linhas = saida.map(([l]) => l), raiz = `${pasta.replace(/^~/, "/home/voce")}/`;
  const curta = (m: string) => m.trim().replace(/^([\w.]+\.)(\w+(Error|Exception)\b)/, "$2");
  const achados: ProblemaIde[] = [];
  linhas.forEach((l, i) => {
    const m = l.match(/^([\w./-]+\.py):(\d+): \w+/);
    if (!m || m[1].startsWith("/")) return;
    let e = i - 1;
    while (e >= 0 && !/^_{3,}/.test(linhas[e])) e--;
    const msg = linhas.slice(e + 1, i).find((x) => x.startsWith("E "));
    achados.push({ mensagem: curta(msg ? msg.slice(1) : l), arquivo: m[1], linha: Number(m[2]) });
  });
  if (achados.length) return achados;
  if (linhas.some((l) => l.startsWith("Traceback"))) {
    const final = [...linhas].reverse().find((l) => /^([\w.]+\.)?\w+(Error|Exception)\b/.test(l));
    const quadro = [...linhas].reverse().map((l) => l.match(/^\s*File "([^"]+)", line (\d+)/)).find((m) => m && m[1].startsWith(raiz) && !m[1].includes("/.venv/"));
    if (final) return [{ mensagem: curta(final), ...(quadro ? { arquivo: quadro[1].slice(raiz.length), linha: Number(quadro[2]) } : {}) }];
  }
  const resto = [...saida].reverse().find(([l, c]) => c === "err" && !/^\d+ (failed|errors?)\b|^FAILED|^ERROR/.test(l) && /(Error|Exception)\b/.test(l));
  return resto ? [{ mensagem: curta(resto[0].replace(/^E\s+/, "")) }] : [];
}

/** O projeto como os estados deixaram: o conteúdo de cada arquivo (null: grande demais para mostrar). */
function projetoDepois(estados: Estado[], de: Record<string, string | null> = {}): Record<string, string | null> {
  const atual = { ...de };
  for (const e of estados) {
    if (e.arquivo) atual[e.arquivo] = e.conteudo!;
    for (const [n, t] of Object.entries({ ...(e.arquivos ?? {}), ...(e.gerados ?? {}) })) atual[n] = t;
    for (const n of e.apagados ?? []) delete atual[n];
    if (e.apagado) delete atual[e.apagado];
  }
  return atual;
}

export async function montarIde({ roteiro, estados, saidas, capitulo, secoes, glossario, pasta, numero = "",
  anteriores = [], gravacoes = {} }: Entrada) {
  const falhar = (m: string): never => { throw new Error(`IDE do capítulo (figura ${numero}): ${m}`); };
  if (!pasta) falhar("falta a pasta do projeto (pasta_do_leitor, no comandos.json do livro)");

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

  /* o fim de cada arquivo (é igual ao fim do capítulo, o saidas.py garante): os blocos apontam linhas dele, como as partes do roteiro */
  const inicio = anteriores.reduce<Record<string, string | null>>((proj, est) => projetoDepois(est, proj), {});
  const finais: Record<string, string> = Object.fromEntries(Object.entries(inicio).filter(([, t]) => t !== null)) as Record<string, string>;
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
  const atual: Record<string, string | null> = { ...inicio };
  /* os arquivos com que a IDE abre: os que os capítulos anteriores deixaram (no capítulo 1, nenhum) */
  const iniciais: { nome: string; versao: number }[] = [];
  for (const [nome, texto] of Object.entries(inicio)) iniciais.push({ nome, versao: await versao(nome, texto) });
  if (capitulo.abre_com && !(capitulo.abre_com in inicio)) falhar(`a IDE abriria com ${capitulo.abre_com}, que o capítulo anterior não deixou`);
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
      /* as variantes: cada uma com a saída gravada dela, e o arquivo trocado como mais uma versão do editor */
      let variar: VariarIde | undefined;
      if (p.variar) {
        const v = p.variar, opcoes: OpcaoVariar[] = [];
        const texto = v.arquivo ? atual[v.arquivo] ?? falhar(`${e.rodou}: a variante mexe em ${v.arquivo}, que não existe nesse momento`) : s.comando;
        if (texto.split(v.trecho).length !== 2) falhar(`${e.rodou}: o trecho a variar não aparece uma vez só: ${v.trecho}`);
        if (!v.trecho.includes(v.original)) falhar(`${e.rodou}: a palavra do livro (${v.original}) não está no trecho (${v.trecho})`);
        for (const op of v.opcoes) {
          const so = saidas[op.id] ?? falhar(`a saída da variante ${op.id} não está no saidas.json; rode npm run saidas`);
          const est = e.variantes?.[op.id] ?? falhar(`a variante ${op.id} não está nos estados; rode npm run saidas`);
          if (op.aposta && !op.aposta.opcoes[op.aposta.certa]) falhar(`a aposta da variante ${op.id} não tem a resposta certa entre as opções`);
          if (!op.por.includes(op.rotulo)) falhar(`a variante ${op.id}: o rótulo (${op.rotulo}) não está no que entra (${op.por})`);
          opcoes.push({ id: op.id, rotulo: op.rotulo, comando: so.comando, saida: dobrarErro(so.saida), erro: so.saiu_com !== 0 || so.saida.some(([, c]) => c === "err"),
            problemas: problemasDe(so.saida, pasta),
            nota: op.nota, aposta: op.aposta, ...(v.arquivo ? { versao: await versao(v.arquivo, est.conteudo!), alteradas: est.alteradas } : {}) });
        }
        const linha = v.arquivo ? texto.slice(0, texto.indexOf(v.trecho)).split("\n").length : undefined;
        variar = { arquivo: v.arquivo, linha, trecho: v.trecho, original: v.original, convite: v.convite, por: v.opcoes[0].por, opcoes };
      }
      acoes.push({ tipo: "rodar", nota: p.nota, id: e.rodou, comando: s.comando, onde: cwdLeitor(p.onde), saida: dobrarErro(s.saida),
        erro: s.saiu_com !== 0 || s.saida.some(([, c]) => c === "err"), problemas: problemasDe(s.saida, pasta), aposta: p.aposta, gravacao: gravacoes[e.rodou], variar, gerados, apagados: e.apagados ?? [] });
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
  /* as dúvidas: poucas por ação (duas no máximo), cada uma uma pergunta de verdade, com resposta */
  acoes.forEach((a, k) => {
    const d = roteiro.passos[k].duvidas;
    if (!d) return;
    if (d.length > 2) falhar(`ação ${k + 1}: ${d.length} dúvidas; no máximo duas, para não virar menu`);
    for (const x of d) if (!x.pergunta.trim().endsWith("?") || !x.resposta.trim()) falhar(`ação ${k + 1}: dúvida sem pergunta ou sem resposta: ${x.pergunta}`);
    a.duvidas = d;
  });
  acoes.forEach((a, k) => { const sv = roteiro.passos[k].suavez; if (sv) a.suavez = sv; });
  if (acoes.length !== roteiro.passos.length) falhar(`o roteiro tem ${roteiro.passos.length} ações e os estados, ${acoes.length}; rode npm run saidas`);

  /* os passos do capítulo, com o sinal do comando do fim (para o progresso no topo) */
  const passos: PassoCap[] = capitulo.passos.map((p, i) => {
    const runs = acoes.slice(p.de - 1, p.ate).filter((a) => a.tipo === "rodar");
    const ultimo = runs.at(-1);
    const sinal = !ultimo ? "nada" : p.engano ? "engano" : ultimo.tipo === "rodar" && ultimo.erro ? "erro" : "ok";
    return { n: i + 1, id: p.id, secao: p.secao, nomeSecao: secoes[p.secao], titulo: p.titulo, curta: p.curta, de: p.de, ate: p.ate,
      objetivo: p.objetivo, temos: p.temos, engano: p.engano, antes: p.antes ?? [], depois: p.depois ?? [], sinal,
    pedido: p.pedido ?? falhar(`o passo ${p.id} não tem o pedido do autor ao chat`), rascunho: !p.pedido_revisado,
    /* voltar ao começo de um passo: o fim do anterior; no primeiro passo, o início do capítulo (que só existe do 2 em diante) */
    volta: !capitulo.repositorio ? undefined
      : i > 0 ? { repositorio: capitulo.repositorio, tag: `${capitulo.prefixo_tag ?? "cap-01"}/passo-${String(i).padStart(2, "0")}` }
      : anteriores.length ? { repositorio: capitulo.repositorio, tag: `${capitulo.prefixo_tag}/inicio` } : undefined };
  });
  /* o Python do projeto, como o uv contou ao criar o ambiente (o .venv): é o que o rodapé da IDE mostra */
  let python: { versao: string; desde: number } | null = null;
  acoes.forEach((a, k) => {
    if (python || a.tipo !== "rodar") return;
    for (const t of a.saida) { const m = t.tipo === "linha" && t.l.match(/^Using CPython (\S+)/); if (m) { python = { versao: m[1], desde: k }; break; } }
  });
  return { acoes, passos, versoes, python, iniciais, abreCom: capitulo.abre_com ?? null, pasta };
}
