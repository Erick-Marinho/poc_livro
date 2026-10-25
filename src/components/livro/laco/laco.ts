/**
 * A figura 1.1 (LacoAnimado.tsx; docs/capacidades/laco-do-agente.md): quem decide o próximo passo, um jeito por vez.
 * Cada vez é um jeito com uma pergunta dos "três jeitos": a mensagem da cliente e os passos, em frase curta, um a um,
 * até a resposta; quando termina, vira uma linha de resumo no topo. Aqui, sem JSX, para os testes lerem: a cliente (a
 * do e-mail da pergunta, nos clientes da loja), a linha do tempo, quando cada passo aparece, os resumos e a pausa para
 * investir. Tudo conferido contra os dados do livro e os limites do docs/RITMO.md.
 */
export type Desenho = "largo" | "coluna";
type Passo = { quem: string; texto: string; curto?: string; decide?: boolean; certo?: boolean; erro?: string };
type Modo = { id: string; nome: string; quem_decide: string; passos: Record<string, Passo[]> };
export type TresJeitos = { perguntas: { id: string; texto: string }[]; modos: Modo[] };
type Investir = { pergunta: string; opcoes: string[]; certa: number };
type Laco = { pergunta: string; nomes: Record<string, string>; rotulos: Record<string, string>; abertura: { legenda: string; segundos: number };
  vezes: { jeito: string; pergunta: string; investir?: Investir }[]; fim: { legenda: string; segundos: number } };
export type Entrada = { laco: Laco; tresJeitos: TresJeitos; clientes: { nome: string; email: string }[] };

export const FPS = 30;
const PRIMEIRO = 1.2; // o primeiro passo aparece depois da mensagem
const ENTRE = 2.6; // um passo a cada tanto: devagar, para ler
const LEITURA = 2.2; // depois da resposta, o tempo de lê-la
const TROCA = 0.6; // a vez vira uma linha de resumo, e entra a próxima
export const ANIMA = 0.4; // o passo aparece neste tempo

/** Um passo da vez: os dos três jeitos, menos a mensagem da cliente, que fica em cima. */
export type Cartao = Passo & { curto: string; em: number; deNovo?: boolean };
export type Vez = { jeito: string; nome: string; quemDecide: string; pergunta: string; rotulo: string; mensagem: string; cliente: string;
  cartoes: Cartao[]; certo: boolean; porque: string; investir?: Investir };
export type Trecho = { tipo: "abertura" | "vez" | "fim"; inicio: number; fim: number; segundos: number; legenda?: string; vez?: Vez; k?: number };

/** A cliente: a do e-mail da pergunta do pedido, nos clientes da loja. */
export function montarElenco({ tresJeitos, clientes }: Pick<Entrada, "tresJeitos" | "clientes">) {
  const falhar = (motivo: string): never => { throw new Error(`Figura 1.1: ${motivo}`); };
  const pergunta = tresJeitos.perguntas[0] ?? falhar("os três jeitos não têm pergunta.");
  const email = pergunta.texto.match(/[\w.]+@[\w.]+/)?.[0] ?? falhar(`a pergunta "${pergunta.texto}" não tem o e-mail da cliente.`);
  const cliente = clientes.find((c) => c.email === email) ?? falhar(`o e-mail ${email} não é de um cliente da loja.`);
  return { nome: cliente.nome, email, pergunta: pergunta.id };
}

/** A linha do tempo: a abertura, as vezes e o fim, conferidos contra os três jeitos e o docs/RITMO.md (45 s; 12 palavras
 *  por legenda; frases curtas, de uma linha). */
export function montarTrechos({ laco, tresJeitos, clientes }: Entrada) {
  const falhar = (motivo: string): never => { throw new Error(`Figura 1.1: ${motivo}`); };
  const elenco = montarElenco({ tresJeitos, clientes });
  const vezes: Vez[] = laco.vezes.map((v, k) => {
    const modo = tresJeitos.modos.find((m) => m.id === v.jeito) ?? falhar(`a vez ${k + 1} pede o jeito "${v.jeito}", que os três jeitos não têm.`);
    const passos = modo.passos[v.pergunta] ?? falhar(`o jeito ${modo.nome} não tem a pergunta "${v.pergunta}".`);
    if (passos[0]?.quem !== "cliente") falhar(`o jeito ${modo.nome}, na pergunta "${v.pergunta}", não começa pela cliente.`);
    const fim = passos[passos.length - 1];
    if (fim?.quem !== "resposta" || !(fim.certo || fim.erro)) falhar(`o jeito ${modo.nome}, na pergunta "${v.pergunta}", não termina numa resposta certa ou com o erro.`);
    let decidiu = false;
    const cartoes = passos.slice(1).map((p, i) => {
      const curto = p.quem === "resposta" ? p.texto : p.curto ?? falhar(`o passo "${p.texto}" (${modo.nome}) não tem a frase curta.`);
      const deNovo = !!p.decide && decidiu;
      if (p.decide) decidiu = true;
      return { ...p, curto, em: PRIMEIRO + i * ENTRE, deNovo };
    });
    return { jeito: modo.id, nome: modo.nome, quemDecide: modo.quem_decide, pergunta: v.pergunta, rotulo: laco.rotulos[v.pergunta] ?? v.pergunta,
      mensagem: passos[0].texto, cliente: v.pergunta === elenco.pergunta ? elenco.nome : "outra cliente",
      cartoes, certo: !!fim.certo, porque: fim.certo ? laco.nomes.certo : fim.erro ?? "", investir: v.investir };
  });
  let t = 0;
  const em = (segundos: number) => { const de = t; t += segundos; return { inicio: de, fim: t, segundos }; };
  const trechos: Trecho[] = [
    { tipo: "abertura", legenda: laco.abertura.legenda, ...em(laco.abertura.segundos) },
    ...vezes.map((vez, k): Trecho => ({ tipo: "vez", vez, k, ...em(PRIMEIRO + (vez.cartoes.length - 1) * ENTRE + LEITURA + TROCA) })),
    { tipo: "fim", legenda: laco.fim.legenda, ...em(laco.fim.segundos) },
  ];
  if (t > 45) falhar(`são ${t.toFixed(1)} s; o limite é 45.`);
  for (const l of [laco.abertura.legenda, laco.fim.legenda]) if (l.split(/\s+/).length > 12) falhar(`"${l}" passa de 12 palavras.`);
  for (const v of vezes) for (const c of v.cartoes) if (c.quem !== "resposta" && c.curto.length > 48) falhar(`"${c.curto}" passa de uma linha (48 letras).`);
  return { pergunta: laco.pergunta, nomes: laco.nomes, vezes, trechos, total: t, quadros: Math.round(t * FPS) };
}
export type Montado = ReturnType<typeof montarTrechos>;

/** O trecho de um momento (em segundos), e quanto dele já passou. */
export const trechoEm = (m: Montado, t: number) => {
  const k = Math.max(0, m.trechos.filter((c) => c.inicio <= t).length - 1);
  return { k, trecho: m.trechos[k], v: t - m.trechos[k].inicio };
};

/** Quanto da vez de agora já virou resumo: 0 enquanto ela está na tela, 1 quando já é uma linha no topo. */
export const resumindo = (trecho: Trecho, v: number) => (trecho.tipo !== "vez" ? 0 : Math.min(1, Math.max(0, (v - (trecho.segundos - TROCA)) / TROCA)));

/** A pausa para investir: o quadro em que o gráfico para (a mensagem à vista, antes do primeiro passo), a pergunta e as
 *  opções. A certa tem de ser o primeiro passo do jeito, nos três jeitos. */
export function pausaDe(m: Montado) {
  const trecho = m.trechos.find((c) => c.vez?.investir);
  const vez = trecho?.vez;
  if (!trecho || !vez?.investir) return undefined;
  const { pergunta, opcoes, certa } = vez.investir;
  const primeiro = vez.cartoes[0];
  if (!opcoes[certa] || !primeiro.texto.toLowerCase().includes(opcoes[certa].toLowerCase()))
    throw new Error(`Figura 1.1: "${opcoes[certa]}" não é o que o ${vez.nome} faz primeiro ("${primeiro.texto}").`);
  return { quadro: Math.round((trecho.inicio + primeiro.em - 0.3) * FPS), pergunta, opcoes, certa, pista: vez.mensagem, jeito: vez.nome };
}
