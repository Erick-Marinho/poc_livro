/**
 * A figura 1.1 (QuemDecide.tsx; docs/capacidades/laco-do-agente.md): três histórias de atendentes da loja, para quem
 * começa do zero. Aqui, sem JSX, para os testes lerem: as histórias montadas dos "três jeitos" (as mensagens, o que o
 * sistema e o catálogo devolvem, as respostas) e das falas do laco.json, conferidas umas contra as outras; e o que
 * acontece a cada escolha do leitor no papel da atendente.
 */
type Passo = { quem: string; texto: string; curto?: string; decide?: boolean; certo?: boolean; erro?: string };
type Modo = { id: string; nome: string; quem_decide: string; passos: Record<string, Passo[]> };
export type TresJeitos = { perguntas: { id: string; texto: string }[]; modos: Modo[] };
type Prever = { pergunta: string; opcoes: string[]; certa: number; passo?: number };
type Nome = { nome: string; explica: string; conclusao: string; titulo: string };
type Laco = {
  pergunta: string;
  historias: {
    modelo: Nome & { pensa: string; prever: Prever };
    fluxo: Nome & { ficha: string[]; ficha_diz: string; outra: string; prever: Prever & { passo: number }; nao_preve: string };
    agente: Nome & { diz: string; acoes: { id: string; rotulo: string; fez: string; sem_dado?: string }[]; de_novo: string; sem_olhar: string; caminho: string };
  };
  fim: { titulo: string; linhas: { jeito: string; quem: string; decide: string }[]; quebra: string };
};
export type Entrada = { laco: Laco; tresJeitos: TresJeitos; clientes: { nome: string; email: string }[] };
export type Resposta = { texto: string; certo: boolean; erro?: string };
export type Seguiu = { mensagem: string; cliente: string; passos: { rotulo: string; achou: string }[]; resposta: Resposta };

const falhar = (motivo: string): never => { throw new Error(`Figura 1.1: ${motivo}`); };
const resposta = (p: Passo[]): Resposta => {
  const r = p[p.length - 1];
  if (r?.quem !== "resposta" || !(r.certo || r.erro)) falhar("um caminho dos três jeitos não termina numa resposta certa ou com o erro.");
  return { texto: r.texto, certo: !!r.certo, erro: r.erro };
};
const devolveu = (p: Passo) => p.texto.split(" → ")[1] ?? falhar(`o passo "${p.texto}" não diz o que voltou.`);

/** As três histórias e o fim, montados dos três jeitos e conferidos. */
export function montarHistorias({ laco, tresJeitos, clientes }: Entrada) {
  const modo = (id: string) => tresJeitos.modos.find((m) => m.id === id) ?? falhar(`os três jeitos não têm o jeito "${id}".`);
  const caminho = (id: string, pergunta: string) => modo(id).passos[pergunta] ?? falhar(`o jeito "${id}" não tem a pergunta "${pergunta}".`);
  // a cliente: a do e-mail da pergunta do pedido, nos clientes da loja
  const email = tresJeitos.perguntas[0]?.texto.match(/[\w.]+@[\w.]+/)?.[0] ?? falhar("a pergunta do pedido não tem o e-mail da cliente.");
  const cliente = clientes.find((c) => c.email === email)?.nome ?? falhar(`o e-mail ${email} não é de um cliente da loja.`);
  const quem = (pergunta: string) => (pergunta === tresJeitos.perguntas[0].id ? cliente : "Outra cliente");
  const { historias: h } = laco;

  // 1. o atendente sem acesso ao sistema: o pedido, e a resposta que ele chuta
  const so = caminho("modelo", "pedido");
  const modelo = { ...h.modelo, mensagem: so[0].texto, cliente: quem("pedido"), resposta: resposta(so) };
  if (modelo.resposta.certo) falhar("o atendente sem sistema acerta o pedido; a história dele mostra o contrário.");

  // 2. o atendente com a ficha: o pedido (até o fim) e a frigideira (trava onde os três jeitos dizem)
  const seguir = (pergunta: string): Seguiu => {
    const p = caminho("fluxo", pergunta);
    const meio = p.slice(1, -1);
    if (meio.length > h.fluxo.ficha.length) falhar(`com "${pergunta}", o fluxo fixo tem mais passos que a ficha.`);
    return { mensagem: p[0].texto, cliente: quem(pergunta), resposta: resposta(p),
      // o que ele achou em cada passo: o que vem depois de ":", "→" ou "…" na frase curta ("BT-1003", "previsão 14/11", "não acha")
      passos: meio.map((x, i) => {
        const partes = (x.curto ?? falhar(`o passo "${x.texto}" não tem a frase curta.`)).split(/\s*[:→…]\s*/);
        return { rotulo: h.fluxo.ficha[i], achou: partes.length > 1 ? partes[partes.length - 1].replace(/^e /, "") : "" };
      }) };
  };
  const pedido = seguir("pedido"), produto = seguir("produto");
  if (!pedido.resposta.certo || pedido.passos.length !== h.fluxo.ficha.length) falhar("com o pedido, a ficha não vai até o fim e acerta.");
  if (produto.resposta.certo) falhar("com a frigideira, a ficha acerta; a história dela mostra o contrário.");
  if (produto.passos.length !== h.fluxo.prever.passo || !h.fluxo.prever.opcoes[h.fluxo.prever.certa]?.includes(`passo ${h.fluxo.prever.passo}`))
    falhar(`com a frigideira, a ficha trava no passo ${produto.passos.length}, e a previsão certa diz outra coisa.`);
  const fluxo = { ...h.fluxo, pedido, produto };

  // 3. a atendente é o leitor: a frigideira, o que cada coisa à mão devolve, e a resposta com e sem ter olhado
  const ag = caminho("agente", "produto");
  const ferramenta = ag.find((x) => x.quem === "ferramenta") ?? falhar("o agente, com a frigideira, não usa ferramenta.");
  const chamada = ferramenta.texto.match(/^(\w+)\(/)?.[1] ?? falhar(`o passo "${ferramenta.texto}" não começa pelo nome da ferramenta.`);
  const usadas = new Set(Object.values(modo("agente").passos).flat().filter((x) => x.quem === "ferramenta").map((x) => x.texto.match(/^(\w+)\(/)?.[1]));
  const acoes = h.agente.acoes.map((a) => {
    if (a.id !== "responder" && !usadas.has(a.id)) falhar(`"${a.rotulo}" não é uma ferramenta que o agente dos três jeitos usa.`);
    return { ...a, resultado: a.id === chamada ? devolveu(ferramenta) : a.sem_dado };
  });
  if (!acoes.some((a) => a.id === chamada) || !acoes.some((a) => a.id === "responder")) falhar("a atendente não tem como olhar o catálogo ou responder.");
  for (const a of acoes) if (a.id !== "responder" && !a.resultado) falhar(`"${a.rotulo}" não diz o que devolve.`);
  const agente = { ...h.agente, mensagem: ag[0].texto, cliente: quem("produto"), acoes, chamada,
    certa: resposta(ag), semOlhar: resposta(caminho("modelo", "produto")) }; // responder sem olhar é o que o atendente sem sistema faz
  if (!agente.certa.certo || agente.semOlhar.certo) falhar("a atendente erra depois de olhar, ou acerta sem olhar.");

  // o fim: quem decide em cada história, e o que cada jeito acertou nas duas perguntas
  const fim = { ...laco.fim, linhas: laco.fim.linhas.map((x) => ({ ...x, nome: modo(x.jeito).nome,
    acertos: tresJeitos.perguntas.map((p) => resposta(caminho(x.jeito, p.id)).certo) })) };
  return { pergunta: laco.pergunta, modelo, fluxo, agente, fim };
}
export type Historias = ReturnType<typeof montarHistorias>;

/** O que o leitor, no papel da atendente, já fez: o que olhou e o que viu; e a resposta, quando ele responde. */
export type Trilha = { passos: { id: string; fez: string; resultado: string }[]; resposta?: Resposta };
export const inicio = (): Trilha => ({ passos: [] });

/** Uma escolha do leitor no papel da atendente. Responder depois de olhar o catálogo dá a resposta do agente; antes, a
 *  do atendente sem sistema, que responde sem olhar. */
export function agir(a: Historias["agente"], trilha: Trilha, id: string): Trilha {
  if (trilha.resposta) return trilha;
  const acao = a.acoes.find((x) => x.id === id) ?? falhar(`a ação "${id}" não existe.`);
  if (acao.id === "responder") return { ...trilha, resposta: trilha.passos.some((p) => p.id === a.chamada) ? a.certa : a.semOlhar };
  return { passos: [...trilha.passos, { id: acao.id, fez: acao.fez, resultado: acao.resultado ?? "" }] };
}
