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
/** as cenas, em segundos: a chegada, o primeiro caminho, o segundo, e o roteiro virando grafo */
export const CENAS = [{ de: 0, ate: 3.5 }, { de: 3.5, ate: 9 }, { de: 9, ate: 13.5 }, { de: 13.5, ate: 18 }];
export const DURACAO = Math.round(CENAS.at(-1)!.ate * FPS);

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

/** A legenda de cada cena, para a faixa do vídeo e para o leitor de tela. */
export function legenda(r: Roteiro, k: number): string {
  const [a, b] = r.mensagens;
  const ba = r.balcoes.find((x) => x.id === a.balcao)!, bb = r.balcoes.find((x) => x.id === b.balcao)!;
  return [
    `Chega uma mensagem: “${curta(a.pergunta).replace(/\.$/, "")}”. O substituto lê e decide para qual balcão ela vai.`,
    `Ele decide uma vez e segue um caminho só: ${ba.rotulo}. ${ba.modelo === "não" ? "Neste balcão, uma frase fixa: o caso vai para uma pessoa da equipe." : "Neste balcão, o modelo escreve a resposta."}`,
    `Outra mensagem, outro balcão: ${bb.rotulo}. ${bb.modelo === "não" ? "Uma frase fixa." : "O modelo escreve a resposta."} O roteiro é o mesmo.`,
    "Esse roteiro, escrito como desenho, é um grafo: cada passo é um nó, as setas dizem o que vem depois, e a ficha que passa de nó em nó é o estado.",
  ][k];
}

export { curta, rotulo };
