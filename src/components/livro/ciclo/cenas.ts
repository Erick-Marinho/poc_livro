/**
 * A linha do tempo da animação do mapa do ciclo (CicloAnimado.tsx; docs/capacidades/ciclo-animado.md): as cenas de
 * `figuras/ciclo-animado.json`, conferidas contra a aposta (`figuras/onde-se-pega.json`) e o `ciclo.json`, e quando o
 * problema de cada uma chega a cada fase. O problema para na fase que o pega (a resposta da aposta); o resto do caminho
 * é a volta, percorrida por um fantasma. Sem JSX, para os testes lerem.
 */
type Fase = { id: string; nome: string; capitulos: number[]; transversal?: boolean };
type Mensagem = { texto?: string; opcoes: string[]; fez: number };
export type CenaDados = { legenda: string; sabendo?: string; segundos: number; problema?: number; rotulo?: string; caminho?: string[]; falha?: string; chave?: boolean; governar?: boolean };
export type Entrada = { ciclo: { fases: Fase[] }; cenas: { pergunta: string; sabendo: string; cenas: CenaDados[] }; aposta: { mensagens: Mensagem[] } };
export type Chegada = { fase: string; em: number };
export type Cena = CenaDados & {
  inicio: number; // no vídeo, em segundos
  fim: number;
  pega?: Fase; // a fase que pega o problema: a resposta da aposta
  ida: Chegada[]; // até a fase que pega, em segundos desde o início da cena
  volta: Chegada[]; // depois dela, o fantasma
};

export const FPS = 30;
const APARECE = 0.5; // o problema aparece na primeira fase do caminho
const PRIMEIRO_PASSO = 1; // e sai dela
const RESULTADO = 2.2; // depois de pego, o tempo de ler quem pegou e a aposta
const PASSO_DA_VOLTA = 0.9;
const PASSO_MAXIMO = 1;
const PASSO_MINIMO = 0.35; // abaixo disso, a cena é curta demais para o caminho

export function montarCenas({ ciclo, cenas, aposta }: Entrada) {
  const falhar = (motivo: string): never => { throw new Error(`Ciclo animado: ${motivo}`); };
  const fase = (id: string) => ciclo.fases.find((f) => f.id === id) ?? falhar(`a fase "${id}" não está no ciclo.json.`);
  let t = 0;
  const lista: Cena[] = cenas.cenas.map((c, k) => {
    const cena: Cena = { ...c, inicio: t, fim: t + c.segundos, ida: [], volta: [] };
    t = cena.fim;
    if (c.problema === undefined) return cena;
    const m = aposta.mensagens[c.problema] ?? falhar(`a cena ${k + 1} aponta o problema ${c.problema}, que a aposta não tem.`);
    if (!c.caminho?.length || !c.rotulo) falhar(`a cena ${k + 1} tem problema, mas não tem caminho ou rótulo.`);
    c.caminho!.forEach(fase);
    if (c.falha) fase(c.falha);
    const pega = ciclo.fases.find((f) => f.nome === m.opcoes[m.fez]) ?? falhar(`a resposta da aposta "${m.opcoes[m.fez]}" não é uma fase.`);
    const i = c.caminho!.indexOf(pega.id);
    if (i < 0) falhar(`na cena ${k + 1}, a fase que pega o problema (${pega.id}) não está no caminho.`);
    const ida = c.caminho!.slice(0, i + 1), volta = c.caminho!.slice(i + 1);
    const passo = ida.length > 1 ? Math.min(PASSO_MAXIMO, (c.segundos - PRIMEIRO_PASSO - RESULTADO - volta.length * PASSO_DA_VOLTA) / (ida.length - 1)) : 0;
    if (ida.length > 1 && passo < PASSO_MINIMO) falhar(`a cena ${k + 1} é curta demais para o caminho dela.`);
    cena.pega = pega;
    cena.ida = ida.map((f, j) => ({ fase: f, em: j === 0 ? APARECE : PRIMEIRO_PASSO + j * passo }));
    const pegaEm = cena.ida[cena.ida.length - 1].em;
    cena.volta = volta.map((f, j) => ({ fase: f, em: pegaEm + 0.6 + (j + 1) * PASSO_DA_VOLTA }));
    return cena;
  });
  const usados = lista.flatMap((c) => (c.problema === undefined ? [] : [c.problema]));
  if (new Set(usados).size !== aposta.mensagens.length || usados.length !== aposta.mensagens.length) falhar("cada problema da aposta entra em uma cena, e só em uma.");
  return { pergunta: cenas.pergunta, sabendo: cenas.sabendo, cenas: lista, total: t, quadros: Math.round(t * FPS) };
}
export type Montado = ReturnType<typeof montarCenas>;

/** O leitor já sabe onde cada problema é capturado: deu palpite em ao menos um, ou está no modo direto, em que a caixa
 *  mostra as respostas sem pedir. Para ele, o título e a legenda afirmam, em vez de perguntar. */
export const jaSabe = (apostas: (number | null)[] | undefined, direto: boolean) => direto || !!apostas?.some((a) => a !== null && a !== undefined);
export const titulo = (m: Montado, sabe: boolean) => (sabe ? m.sabendo : m.pergunta);
export const legenda = (c: CenaDados, sabe: boolean) => (sabe && c.sabendo ? c.sabendo : c.legenda);

/** A cena de um momento (em segundos), e quanto dela já passou. */
export const cenaEm = (m: Montado, t: number) => {
  const k = Math.max(0, m.cenas.filter((c) => c.inicio <= t).length - 1);
  return { k, cena: m.cenas[k], v: t - m.cenas[k].inicio };
};

/** A fase acesa num momento, para o nó e o cartão: por onde o problema passou por último; no fim, Governar. */
export function faseAcesa(m: Montado, t: number): string | undefined {
  const { cena, v } = cenaEm(m, t);
  if (cena.governar) return m.cenas.length ? "governar" : undefined;
  const passou = [...cena.ida, ...cena.volta].filter((x) => x.em <= v);
  return passou[passou.length - 1]?.fase;
}
