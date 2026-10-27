/**
 * O dia seguinte, no 1.2 (docs/capacidades/capitulo-1-dinamicas.md, etapa 4): o agente apressado passa nas cinco
 * perguntas de uma tarde e erra três no dia seguinte, sem que nada na resposta mostre o erro, até o gabarito entrar.
 * É ilustração (dia-seguinte.json); as mensagens e o gabarito vêm do referencia.jsonl, e as do dia seguinte têm que ser
 * as da Aposta do 1.2, na mesma ordem. Puro de propósito: o teste do livro chama isto direto.
 */

type Caso = { id: string; pergunta: string; decisao: string; motivo: string };
type Dados = { tarde: { caso: string; fez: string }[]; seguinte: { caso: string; fez: string; certo: string }[] };
export type Linha = { id: string; pergunta: string; fez: string; acertou: boolean; gabarito: string; porque?: string };
export type Dia = { tarde: Linha[]; seguinte: Linha[]; certos: number; total: number };

export const FPS = 30;
export const SEGUNDOS = 17;
export const DURACAO = SEGUNDOS * FPS;
/** os momentos, em segundos: a tarde, o dia seguinte, o gabarito (uma marca por linha) e a nota */
export const T = { tarde: 0.3, linhaTarde: (k: number) => 0.6 + k * 0.5, seguinte: 4.4, linhaSeguinte: (k: number) => 4.8 + k * 0.6,
  gabarito: 8.6, marca: (k: number) => 9.0 + k * 0.3, nota: 12.6 };

export function montarDia(referencia: string, dados: Dados, aposta: { mensagens: { caso: string }[] }, nomes: Record<string, string>): Dia {
  const casos: Caso[] = referencia.split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l));
  const achar = (id: string) => casos.find((c) => c.id === id) ?? (() => { throw new Error(`dia seguinte: o caso ${id} não está no referencia.jsonl`); })();
  const daAposta = aposta.mensagens.map((m) => m.caso).join();
  if (dados.seguinte.map((s) => s.caso).join() !== daAposta)
    throw new Error(`dia seguinte: as mensagens do dia seguinte (${dados.seguinte.map((s) => s.caso).join(", ")}) não são as da Aposta (${daAposta})`);
  const tarde = dados.tarde.map((x) => {
    const c = achar(x.caso);
    /* a tarde é a do texto: ele "responde bem as cinco perguntas que você testou" */
    if (c.decisao !== "responder") throw new Error(`dia seguinte: na tarde, o agente responde, e o gabarito do ${c.id} é ${c.decisao}`);
    return { id: c.id, pergunta: c.pergunta, fez: x.fez, acertou: true, gabarito: nomes[c.decisao] };
  });
  const seguinte = dados.seguinte.map((x) => {
    const c = achar(x.caso);
    return { id: c.id, pergunta: c.pergunta, fez: x.fez, acertou: false, gabarito: nomes[c.decisao], porque: x.certo };
  });
  return { tarde, seguinte, certos: tarde.length, total: tarde.length + seguinte.length };
}

export type Alvo = "tarde" | "seguinte" | "lista" | "nota";
export type Balao = { de: number; ate: number; alvo: Alvo; texto: string };

/** os balões, um por vez; são também o texto da figura para quem não a vê */
export function baloes(d: Dia): Balao[] {
  return [
    { de: T.tarde, ate: T.seguinte, alvo: "tarde", texto: `Uma tarde: você testa ${d.tarde.length} perguntas, e o agente responde bem a todas. Parece pronto.` },
    { de: T.seguinte, ate: T.gabarito, alvo: "seguinte", texto: `No dia seguinte chegam estas ${d.seguinte.length}. O agente faz o que você acabou de ver, e a resposta tem a mesma cara das da tarde.` },
    { de: T.gabarito, ate: T.nota, alvo: "lista", texto: `Agora entra o gabarito: para cada mensagem, o que é certo. Com ele, ${d.total - d.certos} respostas viram erro.` },
    { de: T.nota, ate: SEGUNDOS + 1, alvo: "nota", texto: `Com o gabarito, o erro tem nome, e aparece uma nota: ${d.certos} de ${d.total}. Sem ele, as ${d.total} pareciam certas.` },
  ];
}
