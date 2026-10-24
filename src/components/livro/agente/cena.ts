/**
 * O que a figura do agente mostra em cada instante sai daqui: uma função de (cenário, passo, tempo no passo).
 * Nada aqui desenha; os nós, as arestas, a conversa e a linha do tempo só leem estas funções.
 */
export type Escolha = "responder" | "recusar" | "abrir_chamado" | "passar";
export type Passo = { no: string; trajeto?: string; escolha?: Escolha; marca?: string; texto: string; duracao: number; viu?: string };
export type Cenario = { caso: string; pergunta: string; decisao: Escolha; nome: string; resposta: string; passos: Passo[] };
export type Estado = { cen: number; passo: number; t: number; tocando: boolean; sequencia: boolean };

export const DECISOES: Record<Escolha, string> = { responder: "responder", recusar: "recusar", abrir_chamado: "abrir chamado", passar: "passar a vez" };
export const FERRAMENTAS = ["pedidos", "politica", "catalogo"];
export const ARESTAS = ["cliente-agente", "agente-pedidos", "pedidos-agente", "agente-politica", "politica-agente",
  "agente-catalogo", "catalogo-agente", "agente-decisao", "decisao-resposta", "decisao-pessoa"];

/** "pergunta" acende o cliente; "conversa" não acende nada no grafo: a resposta já saiu. */
const noDoPasso = (p: Passo) => (p.no === "pergunta" ? "cliente" : p.no);

export const ultimo = (c: Cenario) => c.passos.length - 1;
export const indice = (c: Cenario, no: string) => c.passos.findIndex((p) => p.no === no);
export const final = (cen: number, c: Cenario): Estado => ({ cen, passo: ultimo(c), t: c.passos[ultimo(c)].duracao, tocando: false, sequencia: false });

/** -1: ainda não chegou; 0 a 1: a bolinha está no caminho; 2: já passou. Só arestas do cenário existem. */
export function estadoAresta(c: Cenario, id: string, s: Estado): number {
  const i = c.passos.findIndex((p) => p.trajeto === id);
  if (i < 0 || s.passo < i) return -1;
  if (s.passo > i) return 2;
  /* parado no começo de um passo (passo a passo, movimento reduzido): mostra o passo inteiro */
  if (!s.tocando && s.t === 0) return 1;
  return Math.min(s.t / (c.passos[i].duracao * 0.75), 1);
}

export type EstadoNo = "fora" | "espera" | "ativo" | "feito";
export function estadoNo(c: Cenario, no: string, passo: number): EstadoNo {
  const atual = c.passos[passo];
  const primeiro = c.passos.findIndex((p) => noDoPasso(p) === no);
  if (primeiro < 0) return no === "cliente" || no === "agente" || no === "decisao" ? "espera" : "fora";
  if (atual.no !== "conversa" && noDoPasso(atual) === no) return "ativo";
  return passo > primeiro ? "feito" : "espera";
}

/** O que o agente já sabe neste passo: a pergunta, e cada coisa que uma ferramenta devolveu. */
export function memoria(c: Cenario, passo: number): string[] {
  const itens: string[] = [];
  c.passos.forEach((p, i) => {
    if (i > passo) return;
    if (p.trajeto === "cliente-agente") itens.push(`a pergunta de ${c.nome === "cliente" ? "quem escreveu" : c.nome.split(" ")[0]}`);
    if (p.viu) itens.push(p.viu);
  });
  return itens;
}

export function selo(c: Cenario, passo: number): string | undefined {
  return c.passos.find((p, i) => p.marca && i <= passo)?.marca;
}

export function conversa(c: Cenario, passo: number) {
  const fim = indice(c, "conversa");
  return { digitando: passo >= 1 && passo < fim, respondeu: passo >= fim, decidiu: passo >= indice(c, "decisao") };
}

/** Avança o relógio em `dt` milissegundos; devolve o estado novo. */
export function avancar(cenarios: Cenario[], s: Estado, dt: number): Estado {
  let { cen, passo, t } = s;
  t += dt;
  while (t >= cenarios[cen].passos[passo].duracao) {
    if (passo < ultimo(cenarios[cen])) { t -= cenarios[cen].passos[passo].duracao; passo++; continue; }
    if (s.sequencia && cen + 1 < Math.min(2, cenarios.length)) return { ...s, cen: cen + 1, passo: 0, t: 0 };
    return { ...final(cen, cenarios[cen]), sequencia: false };
  }
  return { ...s, cen, passo, t };
}
