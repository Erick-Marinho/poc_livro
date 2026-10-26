/**
 * O roteiro do substituto, no 2.1 (docs/capacidades/capitulo-2-em-cenas.md, etapa 1): o que a animação mostra, montado
 * do projeto real. Os nós e as setas são os do grafo do capítulo 2 (a saída gravada grafo-02 e o figuras/grafo-02.json);
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
export type Mensagem = { id: string; pergunta: string; balcao: string };

export const FPS = 30;
/** a animação inteira, em segundos; a rolagem a percorre de ponta a ponta */
export const SEGUNDOS = 21;
export const DURACAO = SEGUNDOS * FPS;
/**
 * Os momentos da animação, em segundos: a primeira mensagem entra (0 a 2), o substituto decide (2 a 3), ela vai ao
 * balcão e ao fim (3 a 6,5); a segunda entra e faz o mesmo (9,5 a 14); de 15 a 17, o roteiro vira o grafo.
 */
export const T = {
  a: { entra: [0.4, 2], decide: 3, balcao: [3.2, 5], fim: [5.6, 6.6] },
  b: { troca: [9.4, 10], entra: [10.2, 11.4], decide: 11.8, balcao: [12, 13.2], fim: [13.6, 14.4] },
  grafo: [15, 16.6],
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
    return { id: c.id, pergunta: c.pergunta, balcao: c.decisao };
  });
  if (msgs.length !== 2) throw new Error("roteiro do 2.1: a figura conta duas mensagens, uma por cena");
  return { decide: decide[0], rotuloDecide: nos.nos[decide[0]].rotulo ?? decide[0], papelDecide: nos.nos[decide[0]].papel, balcoes, mensagens: msgs };
}
export type Roteiro = ReturnType<typeof montarRoteiro>;

const curta = (p: string) => p.replace(/\s+\S+@\S+$/, "").replace(/\s+/g, " ").trim();
const rotulo = (r: Roteiro, id: string) => r.balcoes.find((b) => b.id === id)!.rotulo;

/** O que o balão aponta: o substituto (que vira o nó decidir), o balcão de uma mensagem, a ficha (o estado) ou as setas. */
export type Alvo = "decidir" | "balcao-a" | "balcao-b" | "ficha" | "setas";
export type Balao = { de: number; ate: number; alvo: Alvo; texto: string };

/** Os balões, na ordem: um por vez, cada um no seu trecho da animação. São também o texto da figura para quem não a vê. */
export function baloes(r: Roteiro): Balao[] {
  const [a, b] = r.mensagens;
  const ba = r.balcoes.find((x) => x.id === a.balcao)!, bb = r.balcoes.find((x) => x.id === b.balcao)!;
  const como = (x: Balcao) => x.modelo === "não" ? "uma frase fixa, e o caso vai para uma pessoa da equipe" : "o modelo escreve a resposta";
  return [
    { de: 1.2, ate: 3.2, alvo: "decidir", texto: `Chega uma mensagem: “${curta(a.pergunta).replace(/\.$/, "")}”. O substituto lê e decide para qual balcão ela vai.` },
    { de: 3.2, ate: 6.4, alvo: "balcao-a", texto: `Ele decide uma vez e segue um caminho só: ${ba.rotulo}. Neste balcão, ${como(ba)}.` },
    { de: 6.4, ate: 9.6, alvo: "ficha", texto: "Uma ficha vai junto, e cada passo escreve nela: a pergunta, a decisão, a resposta." },
    { de: 9.6, ate: 15, alvo: "balcao-b", texto: `Outra mensagem, outro balcão: ${bb.rotulo}. Neste, ${como(bb)}. O roteiro é o mesmo.` },
    { de: 15, ate: 17, alvo: "decidir", texto: `Escrito como desenho, o roteiro é um grafo. Cada passo é um nó: o substituto é o nó ${r.rotuloDecide}, onde o modelo decide.` },
    { de: 17, ate: 19, alvo: "setas", texto: "As setas dizem o que vem depois. Estas escolhem: a decisão manda a mensagem por um caminho só." },
    { de: 19, ate: SEGUNDOS + 1, alvo: "ficha", texto: "E a ficha é o estado: o que passa de nó em nó, do começo ao fim." },
  ];
}

export { curta, rotulo };
