/**
 * O grafo do agente, no 2.1 (docs/capacidades/capitulo-2-em-cenas.md, etapa 1; docs/capacidades/grafos-no-capitulo-2.md):
 * o que a animação mostra, montado do projeto real. Os nós e as setas são os do grafo do capítulo 2 (a saída gravada grafo-02 e o figuras/grafo-02.json);
 * as mensagens e o balcão de cada uma são os do referencia.jsonl. Puro de propósito: o teste do livro chama isto direto,
 * e a montagem falha se a figura descrever um nó que o grafo não tem ou mandar uma mensagem a um balcão que não existe.
 */
import { casos, DECISOES } from "../../../lib/referencia.ts";
import { camadas, setas } from "../../../lib/grafoAgente.ts";

type Info = { rotulo?: string; papel: string; modelo?: "decide" | "escreve" | "não" };
export type Entrada = {
  arestas: { saida: [string, string][] };
  nos: { nos: Record<string, Info> };
  referencia: string;
  /** as mensagens, na ordem das cenas: a primeira é a que o leitor escolhe o balcão */
  mensagens: string[];
};
export type Balcao = { id: string; rotulo: string; modelo: "escreve" | "não"; papel: string };
export type Mensagem = { id: string; pergunta: string; balcao: string; motivo: string };

export const FPS = 30;
/** a animação inteira, em segundos; a rolagem a percorre de ponta a ponta */
export const SEGUNDOS = 31;
export const DURACAO = SEGUNDOS * FPS;
/**
 * Os momentos da animação, em segundos (docs/capacidades/grafos-no-capitulo-2.md): primeiro as peças, no próprio grafo
 * (os nós, as arestas, START e END, o estado); depois a primeira mensagem atravessa, e o estado ganha chaves; depois a
 * segunda, por outro caminho.
 */
export const T = {
  nos: [0.3, 4], arestas: [4, 8], fixas: 4.4, condicionais: 6, pontas: [8, 11], estado: [11, 14],
  a: { entra: 14.4, decide: [15.2, 16.4], vai: [16.8, 17.8], escreve: 18.4, fim: [19.2, 20] },
  b: { troca: 22, entra: 22.6, decide: [23.4, 24.6], vai: [25, 26], escreve: 26.6, fim: [27.4, 28.2] },
};

export function montarRoteiro({ arestas, nos, referencia, mensagens }: Entrada) {
  const s = setas(arestas.saida);
  const todos = camadas(s).flat();
  const falta = todos.filter((n) => !nos.nos[n]), sobra = Object.keys(nos.nos).filter((n) => !todos.includes(n));
  if (falta.length || sobra.length) throw new Error(`roteiro do 2.1: a figura e o grafo não batem (faltam ${falta.join(", ") || "nenhum"}; sobram ${sobra.join(", ") || "nenhum"})`);
  /* quem decide: o nó de onde saem as setas que escolhem; os balcões: para onde elas vão */
  const escolhem = s.filter((x) => x.escolhe);
  const decide = [...new Set(escolhem.map((x) => x.de))];
  if (decide.length !== 1) throw new Error(`roteiro do 2.1: as setas que escolhem saem de ${decide.length} nós, e a figura desenha um só`);
  const ordem = Object.keys(DECISOES);
  const balcoes: Balcao[] = escolhem.map((x) => x.para).sort((a, b) => ordem.indexOf(a) - ordem.indexOf(b)).map((id) => {
    const n = nos.nos[id];
    if (!n.modelo || n.modelo === "decide") throw new Error(`roteiro do 2.1: o balcão ${id} não diz se o modelo escreve`);
    return { id, rotulo: n.rotulo ?? DECISOES[id]?.nome ?? id, modelo: n.modelo, papel: n.papel };
  });
  for (const b of balcoes) if (!s.some((x) => x.de === b.id && x.para === "__end__")) throw new Error(`roteiro do 2.1: o balcão ${b.id} não termina no fim`);
  const msgs: Mensagem[] = casos(referencia, mensagens, "roteiro do 2.1").map((c) => {
    if (!balcoes.some((b) => b.id === c.decisao)) throw new Error(`roteiro do 2.1: ${c.id} iria ao balcão ${c.decisao}, que o grafo não tem`);
    return { id: c.id, pergunta: c.pergunta, balcao: c.decisao, motivo: c.motivo };
  });
  if (msgs.length !== 2) throw new Error("roteiro do 2.1: a figura conta duas mensagens, uma por cena");
  return { decide: decide[0], rotuloDecide: nos.nos[decide[0]].rotulo ?? decide[0], papelDecide: nos.nos[decide[0]].papel, balcoes, mensagens: msgs };
}
export type Roteiro = ReturnType<typeof montarRoteiro>;

const curta = (p: string) => p.replace(/\s+\S+@\S+$/, "").replace(/\s+/g, " ").trim();
const rotulo = (r: Roteiro, id: string) => r.balcoes.find((b) => b.id === id)!.rotulo;

/** O que o balão aponta: os nós, as arestas, START e END, o estado, e o caminho de cada mensagem. */
export type Alvo = "nos" | "setas" | "pontas" | "ficha" | "balcao-a" | "balcao-b";
export type Balao = { de: number; ate: number; alvo: Alvo; texto: string };

/** Os balões, na ordem: um por vez, cada um no seu trecho da animação. São também o texto da figura para quem não a vê. */
export function baloes(r: Roteiro): Balao[] {
  const [a, b] = r.mensagens;
  const ba = r.balcoes.find((x) => x.id === a.balcao)!, bb = r.balcoes.find((x) => x.id === b.balcao)!;
  const como = (x: Balcao) => x.modelo === "não" ? "uma frase fixa, sem chamar o modelo" : "o modelo escreve a resposta";
  return [
    { de: T.nos[0], ate: T.nos[1], alvo: "nos", texto: `Cada caixa é um nó: uma função do seu código que recebe o estado e devolve o que mudou. Este grafo tem ${r.balcoes.length + 1}: ${r.decide} e um para cada decisão do contrato.` },
    { de: T.arestas[0], ate: T.arestas[1], alvo: "setas", texto: `As setas são as arestas. As cheias são fixas: depois deste nó, sempre aquele. As tracejadas escolhem: saem de ${r.decide}, e o estado diz qual seguir.` },
    { de: T.pontas[0], ate: T.pontas[1], alvo: "pontas", texto: "START é por onde a mensagem entra; END, onde o caminho acaba." },
    { de: T.estado[0], ate: T.estado[1], alvo: "ficha", texto: "E o estado é o que viaja de nó em nó: um dicionário com o formato da classe Conversa. Começa só com a pergunta." },
    { de: T.estado[1], ate: T.b.troca, alvo: "balcao-a", texto: `${r.decide} lê a pergunta e acrescenta a decisão e o motivo. A aresta tracejada lê a decisão e leva a ${ba.id}, que acrescenta a resposta: ${como(ba)}.` },
    { de: T.b.troca, ate: SEGUNDOS + 1, alvo: "balcao-b", texto: `Outra mensagem, outro caminho: ${bb.id}. Aqui, ${como(bb)}. O desenho é o mesmo; o estado conta o que aconteceu.` },
  ];
}

/** As chaves do estado, na ordem da classe Conversa do agente.py: a figura só mostra chaves que o estado tem de verdade. */
export function chavesDoEstado(agente: string): string[] {
  const bloco = agente.match(/class Conversa\(TypedDict[^)]*\):([\s\S]*?)\n\n\n/)?.[1];
  if (!bloco) throw new Error("roteiro do 2.1: não achei a classe Conversa no agente.py");
  return [...bloco.matchAll(/^\s+(\w+): /gm)].map((m) => m[1]);
}

/** A frase fixa de um nó que não chama o modelo, como está no agente.py: as strings do return dele, juntas. */
export function fraseFixa(agente: string, no: string): string {
  const corpo = agente.match(new RegExp(`def ${no}\\(c: Conversa\\) -> Conversa:\\n([\\s\\S]*?)\\n\\n`))?.[1];
  const partes = corpo ? [...corpo.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]).filter((x) => x !== "resposta") : [];
  if (!partes.length) throw new Error(`roteiro do 2.1: não achei a frase fixa do nó ${no} no agente.py`);
  return partes.join("");
}

/** O estado de cada mensagem, chave por chave: pergunta (real), decisão e motivo (do gabarito), resposta (a frase fixa, ou
 *  o aviso de que o modelo escreve). Confere que as chaves são as da classe Conversa. */
export function estados(r: Roteiro, agente: string) {
  const chaves = chavesDoEstado(agente);
  for (const k of ["pergunta", "decisao", "motivo", "resposta"]) if (!chaves.includes(k)) throw new Error(`roteiro do 2.1: o estado não tem a chave ${k}`);
  return r.mensagens.map((m) => {
    const b = r.balcoes.find((x) => x.id === m.balcao)!;
    return { pergunta: m.pergunta, decisao: m.balcao, motivo: m.motivo, resposta: b.modelo === "não" ? fraseFixa(agente, b.id) : null };
  });
}
export type Estado = ReturnType<typeof estados>[number];

export { curta, rotulo };
