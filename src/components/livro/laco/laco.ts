/**
 * O laço do agente, para a animação do 1.1 (LacoAnimado.tsx; docs/capacidades/laco-do-agente.md): o elenco, montado
 * dos dados do livro e conferido contra eles, e onde cada peça fica, em largo (computador) e em coluna (celular). A
 * cliente é a do e-mail da pergunta, nos clientes da loja; as ferramentas são as que o agente chama nos "três jeitos".
 * E a linha do tempo: cada cena anda pelos passos de um jeito, de peça em peça pelas setas do laço. Sem JSX, para os
 * testes lerem.
 */
export type Desenho = "largo" | "coluna";
export type Caixa = { x: number; y: number; w: number; h: number };
/** `extra`: a seta só aparece na cena que a usa (a passada do modelo sozinho, a ordem do fluxo fixo) */
export type Seta = { de: [number, number]; para: [number, number]; curva?: [number, number]; rotulo?: string; em?: [number, number]; volta?: boolean; extra?: boolean };

type Passo = { quem: string; texto: string; decide?: boolean; certo?: boolean; erro?: string };
type TresJeitos = { perguntas: { id: string; texto: string }[]; modos: { id: string; nome: string; passos: Record<string, Passo[]> }[] };
/** `investir`: na cena-chave, o vídeo para antes de o modelo decidir, e o leitor investe numa das opções */
export type Investir = { pergunta: string; opcoes: string[]; certa: number };
export type CenaDados = { legenda: string; segundos: number; jeito?: string; pergunta?: string; chave?: boolean; final?: boolean; investir?: Investir };
type Laco = { pergunta: string; cenas: CenaDados[]; elenco: { decidir: string; agir: string; observar: string; responder: string; sistema: string; quem: { modelo: string; codigo: string } };
  setas: { pede: string; volta: string; de_novo: string; direto: string; segue: string } };
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
  return { pergunta: laco.pergunta, nomes: laco.elenco, setas: laco.setas, ferramentas,
    cliente: { nome: cliente.nome, mensagem: pergunta.texto.replace(/\s*E-mail\s+\S+$/i, ""), email } };
}
export type Elenco = ReturnType<typeof montarElenco>;

/** O tamanho do desenho, nas unidades do viewBox (sem a pergunta do topo e a legenda de baixo). */
export const VISTA: Record<Desenho, { w: number; h: number }> = { largo: { w: 720, h: 440 }, coluna: { w: 360, h: 500 } };

const CAIXAS: Record<Desenho, Record<Peca, Caixa>> = {
  largo: {
    cliente: { x: 16, y: 44, w: 196, h: 96 },
    decidir: { x: 250, y: 44, w: 220, h: 88 },
    responder: { x: 540, y: 56, w: 164, h: 64 },
    agir: { x: 196, y: 232, w: 150, h: 56 },
    observar: { x: 392, y: 232, w: 150, h: 56 },
    sistema: { x: 156, y: 346, w: 230, h: 80 },
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
    pede: { de: [c.decidir.x + 50, c.decidir.y + c.decidir.h + 3], para: [meio(c.agir)[0], c.agir.y - 4], rotulo: rotulos.pede, em: [226, 188] },
    chama: { de: [meio(c.agir)[0], c.agir.y + c.agir.h + 3], para: [meio(c.agir)[0], c.sistema.y - 4] },
    volta: { de: [c.sistema.x + c.sistema.w + 3, meio(c.sistema)[1]], curva: [meio(c.observar)[0], meio(c.sistema)[1]], para: [meio(c.observar)[0], c.observar.y + c.observar.h + 4],
      rotulo: rotulos.volta, em: [530, 372] },
    de_novo: { de: [meio(c.observar)[0], c.observar.y - 3], curva: [meio(c.observar)[0], meio(c.decidir)[1] + 30], para: [c.decidir.x + c.decidir.w - 40, c.decidir.y + c.decidir.h + 4],
      rotulo: rotulos.de_novo, em: [540, 188], volta: true },
    direto: { de: [c.cliente.x + c.cliente.w - 20, c.cliente.y - 3], curva: [370, -16], para: [c.responder.x + 30, c.responder.y - 4], rotulo: rotulos.direto, em: [370, 30], extra: true },
    segue: { de: [c.observar.x + c.observar.w + 3, meio(c.observar)[1]], curva: [meio(c.responder)[0], meio(c.observar)[1]], para: [meio(c.responder)[0], c.responder.y + c.responder.h + 4],
      rotulo: rotulos.segue, em: [656, 214], extra: true },
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
    direto: { de: [300, c.cliente.y + c.cliente.h + 3], para: [292, c.responder.y - 4], rotulo: rotulos.direto, em: [250, 122], extra: true },
    segue: { de: [c.observar.x + c.observar.w - 8, c.observar.y - 3], curva: [356, 250], para: [c.responder.x + c.responder.w - 14, c.responder.y + c.responder.h + 4], extra: true },
  };
}

/* ---------- a linha do tempo ---------- */

export const FPS = 30;
/** Uma parada do ponto (a pergunta) numa peça, em segundos desde o início da cena, com o que se lê ali. */
export type Parada = { peca: Peca; em: number; texto: string; ficha?: "modelo" | "codigo"; ferramenta?: string; resultado?: "certo" | "erro"; erro?: string };
/** `usa`: as peças e as setas do caminho da cena (o resto fica apagado); uma lista, e não um Set, para as props do Remotion */
export type Cena = CenaDados & { inicio: number; fim: number; paradas: Parada[]; usa: string[]; mensagem?: string };

/* por onde o ponto anda de uma peça à seguinte: as setas do laço, em ordem (de decidir ao sistema, passa por agir) */
const ROTAS: Record<string, string[]> = {
  "cliente>decidir": ["chega"], "decidir>sistema": ["pede", "chama"], "sistema>observar": ["volta"],
  "observar>decidir": ["de_novo"], "decidir>responder": ["sai"],
  "cliente>responder": ["direto"], "observar>responder": ["segue"], "responder>responder": [],
};
export const rota = (de: Peca, para: Peca) => ROTAS[`${de}>${para}`];
/* as peças por onde o ponto passa sem parar: de decidir ao sistema, ele passa por agir */
const PASSA: Record<string, Peca[]> = { "decidir>sistema": ["agir"] };

const PRIMEIRA = 0.3; // o ponto aparece na cliente
const LEITURA = 1.6; // depois da resposta, o tempo de ler
const PASSO_MINIMO = 1; // abaixo disso, não dá para ler o passo

/** As paradas de um caminho dos "três jeitos": a cliente, quem decide, a ferramenta (a chamada no sistema, o resultado
 *  em observar) e a resposta. O modelo que decide para em decidir; o que só escreve, em responder. */
function paradasDe(passos: Passo[], falhar: (m: string) => never): Omit<Parada, "em">[] {
  return passos.flatMap((p): Omit<Parada, "em">[] => {
    if (p.quem === "cliente") return [{ peca: "cliente", texto: p.texto }];
    if (p.quem === "código") return [{ peca: "decidir", texto: p.texto, ficha: "codigo" }];
    if (p.quem === "modelo") return [p.decide ? { peca: "decidir", texto: p.texto, ficha: "modelo" } : { peca: "responder", texto: p.texto }]; // quem só escreve, escreve a resposta
    if (p.quem === "ferramenta") {
      const [chamada, resultado] = p.texto.split(" → ");
      if (!resultado) falhar(`o passo "${p.texto}" não diz o que a ferramenta devolveu.`);
      return [{ peca: "sistema", texto: chamada, ferramenta: chamada.match(/^(\w+)\(/)?.[1] }, { peca: "observar", texto: `→ ${resultado}` }];
    }
    if (p.quem === "resposta") return [{ peca: "responder", texto: p.texto, resultado: p.certo ? "certo" : "erro", erro: p.erro }];
    return falhar(`o passo de "${p.quem}" não tem lugar no laço.`);
  });
}

/** As cenas do laço, conferidas contra os três jeitos e os limites do docs/RITMO.md (6 cenas, 45 s, 8 s por cena,
 *  12 palavras por legenda). */
export function montarCenas({ laco, tresJeitos }: Pick<Entrada, "laco" | "tresJeitos">) {
  const falhar = (motivo: string): never => { throw new Error(`Laço do agente: ${motivo}`); };
  let t = 0;
  const cenas: Cena[] = laco.cenas.map((c, k) => {
    const cena: Cena = { ...c, inicio: t, fim: t + c.segundos, paradas: [], usa: [...PECAS] };
    t = cena.fim;
    if (!c.jeito) return cena;
    const modo = tresJeitos.modos.find((m) => m.id === c.jeito) ?? falhar(`a cena ${k + 1} pede o jeito "${c.jeito}", que os três jeitos não têm.`);
    const passos = modo.passos[c.pergunta ?? ""] ?? falhar(`a cena ${k + 1} pede a pergunta "${c.pergunta}", que o jeito ${modo.nome} não tem.`);
    const ps = paradasDe(passos, falhar);
    ps.forEach((p, i) => { if (i && !rota(ps[i - 1].peca, p.peca)) falhar(`na cena ${k + 1}, não há seta de ${ps[i - 1].peca} para ${p.peca}.`); });
    if (ps[0]?.peca !== "cliente" || ps[ps.length - 1]?.peca !== "responder") falhar(`a cena ${k + 1} não vai da cliente à resposta.`);
    const passo = (c.segundos - PRIMEIRA - LEITURA) / (ps.length - 1);
    if (passo < PASSO_MINIMO) falhar(`a cena ${k + 1} é curta demais para os ${ps.length} passos dela.`);
    cena.paradas = ps.map((p, i) => ({ ...p, em: PRIMEIRA + i * passo }));
    cena.mensagem = ps[0].texto;
    cena.usa = [...new Set<string>([...ps.map((p) => p.peca), // o que o jeito não usa fica apagado (no modelo sozinho, até decidir)
      ...ps.slice(1).flatMap((p, i) => [...rota(ps[i].peca, p.peca), ...(PASSA[`${ps[i].peca}>${p.peca}`] ?? [])])])];
    return cena;
  });
  if (cenas.length > 6) falhar(`são ${cenas.length} cenas; o limite é 6.`);
  if (t > 45) falhar(`são ${t} s; o limite é 45.`);
  for (const c of cenas) {
    if (c.segundos > 8) falhar(`"${c.legenda}" tem ${c.segundos} s; o limite é 8.`);
    if (c.legenda.split(/\s+/).length > 12) falhar(`"${c.legenda}" passa de 12 palavras.`);
  }
  return { pergunta: laco.pergunta, cenas, total: t, quadros: Math.round(t * FPS) };
}
export type Montado = ReturnType<typeof montarCenas>;

/** Onde cada cena começa e termina, em quadros: o avançar toca de um até o outro e para. */
export const cortes = (m: Montado) => m.cenas.map((c) => ({ de: Math.round(c.inicio * FPS), ate: Math.round(c.fim * FPS) - 1 }));

/** A cena de um momento (em segundos), e quanto dela já passou. */
export const cenaEm = (m: Montado, t: number) => {
  const k = Math.max(0, m.cenas.filter((c) => c.inicio <= t).length - 1);
  return { k, cena: m.cenas[k], v: t - m.cenas[k].inicio };
};

/** O placar do quadro final: o que cada jeito acertou em cada pergunta, nos três jeitos. */
export const placar = (tresJeitos: TresJeitos) => tresJeitos.modos.map((m) => ({
  nome: m.nome, acertos: tresJeitos.perguntas.map((p) => !!m.passos[p.id]?.find((x) => x.quem === "resposta")?.certo),
}));

/** Um ponto de uma seta, de 0 (o começo) a 1 (a ponta). */
export function pontoDaSeta(s: Seta, k: number): [number, number] {
  const [x0, y0] = s.de, [x1, y1] = s.para;
  if (!s.curva) return [x0 + (x1 - x0) * k, y0 + (y1 - y0) * k];
  const [cx, cy] = s.curva, u = 1 - k;
  return [u * u * x0 + 2 * u * k * cx + k * k * x1, u * u * y0 + 2 * u * k * cy + k * k * y1];
}

/** A pausa para investir: o quadro em que o vídeo para (a pergunta chegando a decidir, antes de a ficha acender), a
 *  pergunta e as opções. A certa tem de ser a decisão do jeito, nos três jeitos. */
export function pausaDe(m: Montado) {
  const cena = m.cenas.find((c) => c.investir);
  if (!cena?.investir) return undefined;
  const { pergunta, opcoes, certa } = cena.investir;
  const decide = cena.paradas.find((p) => p.peca === "decidir") ?? (() => { throw new Error("Laço do agente: a cena de investir não passa por decidir."); })();
  if (!opcoes[certa] || !decide.texto.toLowerCase().includes(opcoes[certa].toLowerCase()))
    throw new Error(`Laço do agente: "${opcoes[certa]}" não é a decisão do passo "${decide.texto}".`);
  return { quadro: Math.round((cena.inicio + decide.em - 0.25) * FPS), pergunta, opcoes, certa, pista: cena.mensagem ?? "" };
}

/* ---------- a câmera ---------- */

/** O ponto (a pergunta) leva isto para ir de uma peça à seguinte, e chega um pouco antes da parada; a câmera anda junto. */
export const ANDA = 0.6;
const CHEGA_ANTES = 0.1;
const CAMERA = 1; // a câmera sai antes do ponto e chega com ele: anda devagar, sem tranco
const MOVE_MINIMO = 0.7; // se falta tempo, ela chega um pouco depois do ponto, mas nunca dá tranco
const ENTRA = 0.7; // no começo de um trecho, a câmera sai do quadro inteiro para a primeira peça
const SAI = 0.9; // no fim, volta ao quadro inteiro
const FOLGA = 36;
const ZOOM_MAXIMO: Record<Desenho, number> = { largo: 1.7, coluna: 1.5 };

export type Janela = { x: number; y: number; w: number; h: number };
const inteira = (desenho: Desenho): Janela => ({ x: 0, y: 0, ...VISTA[desenho] });

/** A janela que mostra estas peças, com folga, na proporção do desenho, sem passar do zoom máximo nem sair dele. */
function enquadrar(pecas: Peca[], desenho: Desenho): Janela {
  const c = CAIXAS[desenho], v = VISTA[desenho];
  const x0 = Math.min(...pecas.map((p) => c[p].x)) - FOLGA, y0 = Math.min(...pecas.map((p) => c[p].y)) - FOLGA;
  const x1 = Math.max(...pecas.map((p) => c[p].x + c[p].w)) + FOLGA, y1 = Math.max(...pecas.map((p) => c[p].y + c[p].h)) + FOLGA;
  const escala = Math.min(ZOOM_MAXIMO[desenho], Math.max(1, Math.min(v.w / (x1 - x0), v.h / (y1 - y0))));
  const w = v.w / escala, h = v.h / escala;
  const x = Math.min(Math.max(0, (x0 + x1) / 2 - w / 2), v.w - w), y = Math.min(Math.max(0, (y0 + y1) / 2 - h / 2), v.h - h);
  return { x, y, w, h };
}

const misturar = (a: Janela, b: Janela, k: number): Janela => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, w: a.w + (b.w - a.w) * k, h: a.h + (b.h - a.h) * k });
const suavizar = (k: number) => (k <= 0 ? 0 : k >= 1 ? 1 : k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
const entre = (v: number, de: number, ate: number) => suavizar((v - de) / (ate - de));

/** O que a câmera mostra num momento (em segundos): a peça de agora e a seguinte, aproximadas; no elenco, no quadro
 *  final e entre um trecho e outro, o quadro inteiro. Entre dois pontos-chave (a hora e o enquadramento), ela anda suave,
 *  e um movimento só começa quando o anterior acaba. Com menos movimento, fica parada no quadro inteiro. */
export function camera(m: Montado, t: number, desenho: Desenho, movimento = true): Janela {
  const tudo = inteira(desenho);
  const { cena, v } = cenaEm(m, t);
  const ps = cena.paradas;
  if (!movimento || !ps.length) return tudo;
  // a janela de cada parada: a peça dela, a seguinte e as que ficam no caminho (de decidir ao sistema, agir)
  const alvo = (i: number) => enquadrar([...new Set([ps[i].peca, ...(ps[i + 1] ? [ps[i + 1].peca, ...(PASSA[`${ps[i].peca}>${ps[i + 1].peca}`] ?? [])] : [])])], desenho);
  const chave: [number, Janela][] = [[0, tudo]];
  const ir = (ate: number, j: Janela, saida: number) => { // fica onde está até `saida`, e chega a `j` em `ate`
    const ultimo = chave[chave.length - 1];
    const de = Math.min(Math.max(ultimo[0], saida), ate);
    if (de > ultimo[0]) chave.push([de, ultimo[1]]);
    chave.push([Math.max(ate, de + 0.01), j]);
  };
  ir(ps[0].em + ENTRA, alvo(0), 0);
  for (let i = 1; i < ps.length; i++) { const chega = ps[i].em - CHEGA_ANTES; ir(Math.max(chega, chave[chave.length - 1][0] + MOVE_MINIMO), alvo(i), chega - CAMERA); }
  ir(cena.segundos - 0.05, tudo, cena.segundos - SAI);
  const j = chave.findIndex(([h]) => h > v);
  if (j < 0) return chave[chave.length - 1][1];
  const [h0, a] = chave[j - 1], [h1, b] = chave[j];
  return misturar(a, b, entre(v, h0, h1));
}
