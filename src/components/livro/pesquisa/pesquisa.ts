/**
 * O vídeo da pesquisa sobre agentes em produção, na introdução (docs/capacidades/agentes-no-mundo.md, etapa 3): cinco
 * cenas que o leitor toca ou rola (palco/RolaCena.tsx). Uma grade de 40 quadradinhos, cada um 2,5% de quem respondeu,
 * acende a cada número: os que já têm agentes no ar, os que viram algo inesperado, os que conseguem rastrear, os que
 * conseguem parar; e, no fim, o capítulo do livro que trata de cada problema. Os números são os do JSON da pesquisa,
 * conferidos na fonte; a fase e o capítulo, os do ciclo.json. Puro de propósito: o teste do livro chama isto direto.
 */

type Barra = { id: string; valor: number; rotulo: string; fase?: string; como?: string };
type Dados = { titulo: string; fonte: { nome: string; url: string; amostra: string; aviso?: string }; barras: Barra[];
  contexto: { id: string; valor: number; rotulo: string }[]; detalhes: Record<string, string> };
type Fase = { nome: string; capitulos: number[] };

export const FPS = 30;
export const QUADROS = 40; // a grade: cada quadradinho é 2,5% de quem respondeu
export const CENAS = [
  { nome: "Os agentes no ar", de: 0 },
  { nome: "Algo inesperado", de: 5.5 },
  { nome: "Ver o que ele fez", de: 11.5 },
  { nome: "Parar a tempo", de: 17.5 },
  { nome: "O que o livro faz", de: 22.5 },
];
export const SEGUNDOS = 28;
export const DURACAO = SEGUNDOS * FPS;

export const pct = (v: number) => `${v.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
export const acesos = (v: number) => Math.round((v * QUADROS) / 100);

export type Problema = Barra & { capitulo: number; acesos: number; detalhe?: string };
export type Pesquisa = { fonte: Dados["fonte"]; operam: number; dez: number; problemas: Problema[] };

export function montarPesquisa(dados: Dados, ciclo: { fases: Fase[] }): Pesquisa {
  const ctx = (id: string) => dados.contexto.find((c) => c.id === id)?.valor ?? (() => { throw new Error(`pesquisa: falta o número "${id}"`); })();
  const ordem = ["inesperado", "rastrear", "parar"];
  const problemas = ordem.map((id) => {
    const b = dados.barras.find((x) => x.id === id) ?? (() => { throw new Error(`pesquisa: falta a barra "${id}"`); })();
    const f = ciclo.fases.find((x) => x.nome === b.fase) ?? (() => { throw new Error(`pesquisa: "${b.fase}" não é uma fase do ciclo.json`); })();
    return { ...b, capitulo: f.capitulos[0], acesos: acesos(b.valor), detalhe: dados.detalhes[id] };
  });
  return { fonte: dados.fonte, operam: ctx("operam"), dez: ctx("dez"), problemas };
}

export type Balao = { de: number; ate: number; texto: string };

/** os balões, um por cena; são também o texto da figura para quem não a vê */
export function baloes(p: Pesquisa): Balao[] {
  const [inesperado, rastrear, parar] = p.problemas;
  const textos = [
    `Numa pesquisa de outubro de 2026, com mais de 380 profissionais de segurança e tecnologia, ${pct(p.operam)} já operam ao menos um agente, e ${pct(p.dez)}, mais de dez. Cada quadradinho é 2,5% de quem respondeu.`,
    `${pct(inesperado.valor)} viram, ou suspeitam, que um agente fez algo inesperado ou não autorizado no último ano. ${inesperado.detalhe} Saber antes do que ele é capaz é ${inesperado.fase}, no capítulo ${inesperado.capitulo}.`,
    `Só ${pct(rastrear.valor)} conseguem rastrear tudo o que o agente fez, do pedido ao resultado. ${rastrear.detalhe} Ver o que ele fez é ${rastrear.fase}, no capítulo ${rastrear.capitulo}.`,
    `E só ${pct(parar.valor)} conseguem parar sozinhos um agente que começa a agir de forma inesperada. Parar a tempo é ${parar.fase}, no capítulo ${parar.capitulo}.`,
    "Os três problemas aparecem depois que o agente entra no ar, e cada um tem o seu capítulo. É disso que este livro trata.",
  ];
  return textos.map((texto, k) => ({ de: CENAS[k].de + 0.2, ate: k + 1 < CENAS.length ? CENAS[k + 1].de + 0.2 : SEGUNDOS + 1, texto }));
}
