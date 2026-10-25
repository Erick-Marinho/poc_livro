/**
 * O laço do agente, para a animação do 1.1 (LacoAnimado.tsx; docs/capacidades/laco-do-agente.md): o elenco, montado
 * dos dados do livro e conferido contra eles, e onde cada peça fica, em largo (computador) e em coluna (celular). A
 * cliente é a do e-mail da pergunta, nos clientes da loja; as ferramentas são as que o agente chama nos "três jeitos".
 * Sem JSX, para os testes lerem.
 */
export type Desenho = "largo" | "coluna";
export type Caixa = { x: number; y: number; w: number; h: number };
export type Seta = { de: [number, number]; para: [number, number]; curva?: [number, number]; rotulo?: string; em?: [number, number]; volta?: boolean };

type Passo = { quem: string; texto: string };
type TresJeitos = { perguntas: { id: string; texto: string }[]; modos: { id: string; nome: string; passos: Record<string, Passo[]> }[] };
type Laco = { pergunta: string; legenda: string; elenco: { decidir: string; agir: string; observar: string; responder: string; sistema: string; quem: { modelo: string; codigo: string } };
  setas: { pede: string; volta: string; de_novo: string } };
export type Entrada = { laco: Laco; tresJeitos: TresJeitos; clientes: { nome: string; email: string }[] };

export const PECAS = ["cliente", "decidir", "responder", "agir", "observar", "sistema"] as const;
export type Peca = (typeof PECAS)[number];

/** O elenco: os nomes do laço, a cliente e a mensagem dela, e as ferramentas que o agente chama. */
export function montarElenco({ laco, tresJeitos, clientes }: Entrada) {
  const falhar = (motivo: string): never => { throw new Error(`Laço do agente: ${motivo}`); };
  const pergunta = tresJeitos.perguntas[0] ?? falhar("os três jeitos não têm pergunta.");
  const email = pergunta.texto.match(/[\w.]+@[\w.]+/)?.[0] ?? falhar(`a pergunta "${pergunta.texto}" não tem o e-mail da cliente.`);
  const cliente = clientes.find((c) => c.email === email) ?? falhar(`o e-mail ${email} não é de um cliente da loja.`);
  const agente = tresJeitos.modos.find((m) => m.id === "agente") ?? falhar("os três jeitos não têm o agente.");
  const ferramentas = [...new Set(Object.values(agente.passos).flat().filter((p) => p.quem === "ferramenta")
    .map((p) => p.texto.match(/^(\w+)\(/)?.[1] ?? falhar(`o passo "${p.texto}" não começa pelo nome da ferramenta.`)))];
  return { pergunta: laco.pergunta, legenda: laco.legenda, nomes: laco.elenco, setas: laco.setas, ferramentas,
    cliente: { nome: cliente.nome, mensagem: pergunta.texto.replace(/\s*E-mail\s+\S+$/i, ""), email } };
}
export type Elenco = ReturnType<typeof montarElenco>;

/** O tamanho do desenho, nas unidades do viewBox (sem a pergunta do topo e a legenda de baixo). */
export const VISTA: Record<Desenho, { w: number; h: number }> = { largo: { w: 720, h: 420 }, coluna: { w: 360, h: 500 } };

const CAIXAS: Record<Desenho, Record<Peca, Caixa>> = {
  largo: {
    cliente: { x: 16, y: 24, w: 196, h: 96 },
    decidir: { x: 250, y: 24, w: 220, h: 88 },
    responder: { x: 540, y: 36, w: 164, h: 64 },
    agir: { x: 196, y: 212, w: 150, h: 56 },
    observar: { x: 392, y: 212, w: 150, h: 56 },
    sistema: { x: 156, y: 326, w: 230, h: 80 },
  },
  coluna: {
    cliente: { x: 16, y: 12, w: 328, h: 80 },
    decidir: { x: 16, y: 128, w: 208, h: 88 },
    responder: { x: 240, y: 144, w: 104, h: 56 },
    agir: { x: 16, y: 290, w: 150, h: 56 },
    observar: { x: 194, y: 290, w: 150, h: 56 },
    sistema: { x: 16, y: 400, w: 180, h: 84 },
  },
};
export const caixas = (desenho: Desenho) => CAIXAS[desenho];

const meio = (c: Caixa): [number, number] => [c.x + c.w / 2, c.y + c.h / 2];

/** As setas do laço: a mensagem chega, o laço gira (decidir, agir, o sistema, observar, de volta a decidir), e sai a
 *  resposta. A de volta (observar → decidir) é a que faz o laço. */
export function setas(desenho: Desenho, rotulos: Laco["setas"]): Record<string, Seta> {
  const c = CAIXAS[desenho];
  if (desenho === "largo") return {
    chega: { de: [c.cliente.x + c.cliente.w + 3, meio(c.decidir)[1]], para: [c.decidir.x - 4, meio(c.decidir)[1]] },
    sai: { de: [c.decidir.x + c.decidir.w + 3, meio(c.responder)[1]], para: [c.responder.x - 4, meio(c.responder)[1]] },
    pede: { de: [c.decidir.x + 50, c.decidir.y + c.decidir.h + 3], para: [meio(c.agir)[0], c.agir.y - 4], rotulo: rotulos.pede, em: [226, 168] },
    chama: { de: [meio(c.agir)[0], c.agir.y + c.agir.h + 3], para: [meio(c.agir)[0], c.sistema.y - 4] },
    volta: { de: [c.sistema.x + c.sistema.w + 3, meio(c.sistema)[1]], curva: [meio(c.observar)[0], meio(c.sistema)[1]], para: [meio(c.observar)[0], c.observar.y + c.observar.h + 4],
      rotulo: rotulos.volta, em: [530, 352] },
    de_novo: { de: [meio(c.observar)[0], c.observar.y - 3], curva: [meio(c.observar)[0], meio(c.decidir)[1] + 30], para: [c.decidir.x + c.decidir.w - 40, c.decidir.y + c.decidir.h + 4],
      rotulo: rotulos.de_novo, em: [540, 168], volta: true },
  };
  return {
    chega: { de: [110, c.cliente.y + c.cliente.h + 3], para: [110, c.decidir.y - 4] },
    sai: { de: [c.decidir.x + c.decidir.w + 3, meio(c.responder)[1]], para: [c.responder.x - 4, meio(c.responder)[1]] },
    pede: { de: [80, c.decidir.y + c.decidir.h + 3], para: [80, c.agir.y - 4], rotulo: rotulos.pede, em: [104, 258] },
    chama: { de: [80, c.agir.y + c.agir.h + 3], para: [80, c.sistema.y - 4] },
    volta: { de: [c.sistema.x + c.sistema.w + 3, meio(c.sistema)[1]], curva: [meio(c.observar)[0], meio(c.sistema)[1]], para: [meio(c.observar)[0], c.observar.y + c.observar.h + 4],
      rotulo: rotulos.volta, em: [290, 476] },
    de_novo: { de: [meio(c.observar)[0], c.observar.y - 3], curva: [meio(c.observar)[0], meio(c.decidir)[1] + 40], para: [c.decidir.x + c.decidir.w - 30, c.decidir.y + c.decidir.h + 4],
      rotulo: rotulos.de_novo, em: [262, 258], volta: true },
  };
}
