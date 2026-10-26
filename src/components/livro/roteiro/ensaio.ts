/**
 * O ensaio do substituto, no 2.3 (docs/capacidades/capitulo-2-em-cenas.md, etapa 3): ensaiar com um modelo de mentira, o
 * modelo falso, sem chamar a OpenAI. O que a animação mostra vem do projeto real: o grafo (por roteiro.ts), os testes do test_agente.py (o que se
 * combina com o modelo falso e a pergunta de cada um) e a saída gravada do pytest (saidas.json, r02-pytest). Puro de
 * propósito: o teste do livro chama isto direto, e a montagem falha se os testes mudarem e a figura não.
 */
import { montarRoteiro, type Entrada as EntradaGrafo, type Roteiro } from "./roteiro.ts";

export type Entrada = Omit<EntradaGrafo, "mensagens" | "referencia"> & {
  referencia: string;
  /** o test_agente.py do projeto */
  testes: string;
  /** a saída gravada do pytest (saidas.json, r02-pytest) */
  pytest: { comando: string; saida: [string, string][] };
};
/** um ensaio: o que se combinou com o falso (a escolha, e os textos que ele escreve se pedirem) e a pergunta que entra */
export type Ensaio = { teste: string; decisao: string; textos: string[]; pergunta: string };

export const FPS = 30;
export const SEGUNDOS = 18;
export const DURACAO = SEGUNDOS * FPS;
/** os momentos, em segundos: o modelo de verdade (0 a 3,4), o falso (3,4 a 6,6), o ensaio de passar (6,6 a 10,4), o de responder (10,4 a 14,2), os testes (14,2 ao fim) */
export const T = { verdade: [0, 3.4], falso: 3.4, testes: 14.2,
  a: { de: 6.6, entra: [6.8, 7.8], decide: 8.0, balcao: [8.2, 9.0], fim: [9.4, 9.9] },
  b: { de: 10.4, entra: [10.6, 11.6], decide: 11.8, balcao: [12.0, 12.8], fim: [13.2, 13.7] } };

const VALOR: Record<string, string> = { RESPONDER: "responder", ABRIR_CHAMADO: "abrir_chamado", RECUSAR: "recusar", PASSAR: "passar" };

/** os ensaios do test_agente.py: cada `falso(Decisao.X, "texto")` com a pergunta do `invoke` do mesmo teste */
export function ensaiosDe(testes: string): Ensaio[] {
  return testes.split(/\ndef /).slice(1).flatMap((bloco) => {
    const teste = bloco.match(/^(\w+)\(/)?.[1] ?? "";
    const pergunta = bloco.match(/invoke\(\{"pergunta": "([^"]+)"\}\)/)?.[1];
    if (!pergunta) return [];
    const m = bloco.match(/falso\(Decisao\.(\w+)((?:, "[^"]*")*)\)/);
    if (m) return [{ teste, decisao: VALOR[m[1]], textos: [...m[2].matchAll(/"([^"]*)"/g)].map((x) => x[1]), pergunta }];
    /* um laço: `for decisao, trecho in [(Decisao.X, "trecho"), …]` com `falso(decisao)`, sem texto combinado */
    if (!/falso\(decisao\)/.test(bloco)) return [];
    return [...bloco.matchAll(/\(Decisao\.(\w+), "([^"]*)"\)/g)].map((x) => ({ teste, decisao: VALOR[x[1]], textos: [], pergunta }));
  });
}

export function montarEnsaio({ arestas, nos, referencia, testes, pytest }: Entrada) {
  const r: Roteiro = montarRoteiro({ arestas, nos, referencia, mensagens: ["R16", "R16"] });
  const ensaios = ensaiosDe(testes);
  /* os dois ensaios da figura: um caminho com frase fixa (sem texto combinado) e um em que o modelo escreve */
  const fixo = ensaios.find((e) => e.textos.length === 0 && r.balcoes.find((b) => b.id === e.decisao)?.modelo === "não");
  const escrito = ensaios.find((e) => e.textos.length === 1 && r.balcoes.find((b) => b.id === e.decisao)?.modelo === "escreve");
  if (!fixo || !escrito) throw new Error("ensaio do 2.3: o test_agente.py não tem um teste de frase fixa e um em que o modelo escreve");
  const passou = pytest.saida.map(([l]) => l).find((l) => /^\d+ passed/.test(l));
  if (!passou || pytest.saida.some(([l]) => /failed|error/i.test(l))) throw new Error("ensaio do 2.3: a saída gravada do pytest não termina com todos passando");
  return { ...r, fixo, escrito, comando: pytest.comando, linhas: pytest.saida.map(([l]) => l.replace(/\s+(\[\d+%\])$/, " $1")), passou: passou.replace(/ in [\d.]+s$/, "") };
}
export type Montado = ReturnType<typeof montarEnsaio>;

export type Alvo = "decidir" | "roteiro" | "balcao-a" | "balcao-b" | "balcoes";
export type Balao = { de: number; ate: number; alvo: Alvo; texto: string };

/** os balões, um por vez; são também o texto da figura para quem não a vê */
export function baloes(e: Montado): Balao[] {
  const nome = (id: string) => e.balcoes.find((b) => b.id === id)!.rotulo;
  return [
    { de: 0.4, ate: 3.4, alvo: "decidir", texto: "Com o modelo de verdade, cada pergunta é cobrada pela OpenAI, demora e pode ter resposta diferente a cada vez. Um teste assim custa, e pode falhar sem você ter mexido em nada." },
    { de: 3.4, ate: 6.6, alvo: "roteiro", texto: "No lugar dele, um modelo de mentira, o modelo falso: como um ator com o roteiro na mão, ele devolve, na ordem, as respostas que você combinou. Não chama ninguém e não custa nada." },
    { de: 6.6, ate: 10.4, alvo: "balcao-a", texto: `Combina-se “escolha ${nome(e.fixo.decisao)}”. O caminho de ${nome(e.fixo.decisao)} não pede mais nada ao modelo: o falso só tinha a escolha, e o teste passa.` },
    { de: 10.4, ate: 14.2, alvo: "balcao-b", texto: `Combina-se “escolha ${nome(e.escrito.decisao)}, e escreva ‘${e.escrito.textos[0]}’”. Confere-se que a frase chegou.` },
    { de: 14.2, ate: SEGUNDOS + 1, alvo: "balcoes", texto: `Um teste por caminho, e mais os do contrato, sem gastar um centavo: ${e.passou}.` },
  ];
}
