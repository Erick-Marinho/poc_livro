/**
 * A figura 1.1 (QuemDecide.tsx; docs/capacidades/laco-do-agente.md): o leitor faz o papel de cada jeito de usar um
 * modelo, em três rodadas. Aqui, sem JSX, para os testes lerem: as rodadas montadas dos "três jeitos" (as mensagens, os
 * resultados das ferramentas, as respostas) e das falas do laco.json, conferidas umas contra as outras; e o que acontece
 * a cada escolha do leitor no papel do agente.
 */
type Passo = { quem: string; texto: string; curto?: string; decide?: boolean; certo?: boolean; erro?: string };
type Modo = { id: string; nome: string; quem_decide: string; passos: Record<string, Passo[]> };
export type TresJeitos = { perguntas: { id: string; texto: string }[]; modos: Modo[] };
type Prever = { pergunta: string; opcoes: string[]; certa: number; passo?: number };
type Laco = {
  pergunta: string;
  modelo: { titulo: string; intro: string; prever: Prever; licao: string };
  fluxo: { titulo: string; intro: string; roteiro: string[]; prever: Prever & { passo: number }; licao: string };
  agente: { titulo: string; intro: string; acoes: { id: string; rotulo: string; sem_dado?: string }[]; licao: string };
  fim: { jeito: string; quem: string }[];
};
export type Entrada = { laco: Laco; tresJeitos: TresJeitos; clientes: { nome: string; email: string }[] };
export type Resposta = { texto: string; certo: boolean; erro?: string };
export type Execucao = { mensagem: string; cliente: string; passos: { rotulo: string; resultado: string }[]; resposta: Resposta };

const falhar = (motivo: string): never => { throw new Error(`Figura 1.1: ${motivo}`); };
const resposta = (p: Passo[]): Resposta => {
  const r = p[p.length - 1];
  if (r?.quem !== "resposta" || !(r.certo || r.erro)) falhar(`um caminho dos três jeitos não termina numa resposta certa ou com o erro.`);
  return { texto: r.texto, certo: !!r.certo, erro: r.erro };
};
const resultado = (p: Passo) => p.texto.split(" → ")[1] ?? falhar(`o passo "${p.texto}" não diz o que a ferramenta devolveu.`);

/** As três rodadas e o fim, montados dos três jeitos e conferidos. */
export function montarRodadas({ laco, tresJeitos, clientes }: Entrada) {
  const modo = (id: string) => tresJeitos.modos.find((m) => m.id === id) ?? falhar(`os três jeitos não têm o jeito "${id}".`);
  const caminho = (id: string, pergunta: string) => modo(id).passos[pergunta] ?? falhar(`o jeito "${id}" não tem a pergunta "${pergunta}".`);
  // a cliente: a do e-mail da pergunta do pedido, nos clientes da loja
  const email = tresJeitos.perguntas[0]?.texto.match(/[\w.]+@[\w.]+/)?.[0] ?? falhar("a pergunta do pedido não tem o e-mail da cliente.");
  const cliente = clientes.find((c) => c.email === email)?.nome ?? falhar(`o e-mail ${email} não é de um cliente da loja.`);
  const quem = (pergunta: string) => (pergunta === tresJeitos.perguntas[0].id ? cliente : "outra cliente");

  // 1. só o modelo: o pedido, e a resposta que ele escreve sem ver o sistema
  const soModelo = caminho("modelo", "pedido");
  const m = { ...laco.modelo, mensagem: soModelo[0].texto, cliente: quem("pedido"), resposta: resposta(soModelo) };
  if (m.resposta.certo) falhar("o modelo sozinho acerta o pedido; a rodada dele mostra o contrário.");

  // 2. o fluxo fixo: o mesmo roteiro com o pedido (até o fim) e com a frigideira (para onde os três jeitos dizem)
  const executar = (pergunta: string): Execucao => {
    const p = caminho("fluxo", pergunta);
    const meio = p.slice(1, -1);
    if (meio.length > laco.fluxo.roteiro.length) falhar(`o fluxo fixo, com "${pergunta}", tem mais passos que o roteiro.`);
    return { mensagem: p[0].texto, cliente: quem(pergunta), resposta: resposta(p),
      // o que voltou de cada passo: o que vem depois de ":", "→" ou "…" na frase curta ("BT-1003", "previsão 14/11", "não acha")
      passos: meio.map((x, i) => {
        const curto = x.curto ?? falhar(`o passo "${x.texto}" não tem a frase curta.`);
        const partes = curto.split(/\s*[:→…]\s*/);
        return { rotulo: laco.fluxo.roteiro[i], resultado: partes.length > 1 ? partes[partes.length - 1].replace(/^e /, "") : "" };
      }) };
  };
  const pedido = executar("pedido"), produto = executar("produto");
  if (!pedido.resposta.certo || pedido.passos.length !== laco.fluxo.roteiro.length) falhar("com o pedido, o roteiro do fluxo fixo não vai até o fim e acerta.");
  if (produto.resposta.certo) falhar("com a frigideira, o fluxo fixo acerta; a rodada dele mostra o contrário.");
  const { prever } = laco.fluxo;
  if (produto.passos.length !== prever.passo || !prever.opcoes[prever.certa]?.includes(String(prever.passo)))
    falhar(`com a frigideira, o fluxo fixo para no passo ${produto.passos.length}, e a previsão certa diz outra coisa.`);
  const f = { ...laco.fluxo, pedido, produto };

  // 3. o agente: a frigideira, as ações que o leitor escolhe, e a resposta com e sem ter olhado o catálogo
  const ag = caminho("agente", "produto");
  const ferramenta = ag.find((x) => x.quem === "ferramenta") ?? falhar("o agente, com a frigideira, não chama ferramenta.");
  const chamada = ferramenta.texto.match(/^(\w+)\(/)?.[1] ?? falhar(`o passo "${ferramenta.texto}" não começa pelo nome da ferramenta.`);
  const acoes = laco.agente.acoes.map((a) => ({ ...a, resultado: a.id === chamada ? resultado(ferramenta) : a.sem_dado }));
  if (!acoes.some((a) => a.id === chamada)) falhar(`o leitor não tem como chamar ${chamada}, a ferramenta que o agente chama.`);
  if (!acoes.some((a) => a.id === "responder")) falhar("o leitor não tem como responder.");
  for (const a of acoes) if (a.id !== "responder" && !a.resultado) falhar(`a ação "${a.rotulo}" não diz o que devolve.`);
  const sem = resposta(caminho("modelo", "produto")); // responder sem olhar é o que o modelo sozinho faz
  const a = { ...laco.agente, mensagem: ag[0].texto, cliente: quem("produto"), acoes, chamada, certa: resposta(ag), semOlhar: sem };
  if (!a.certa.certo || a.semOlhar.certo) falhar("o agente erra com a frigideira, ou responder sem olhar acerta.");

  // o fim: quem decide em cada jeito, e o que ele acertou nas duas perguntas
  const fim = laco.fim.map((x) => ({ ...x, nome: modo(x.jeito).nome,
    acertos: tresJeitos.perguntas.map((p) => resposta(caminho(x.jeito, p.id)).certo) }));
  return { pergunta: laco.pergunta, modelo: m, fluxo: f, agente: a, fim };
}
export type Rodadas = ReturnType<typeof montarRodadas>;

/** O que o leitor, no papel do agente, já fez: cada ação e o que voltou; e a resposta, quando ele responde. */
export type Trilha = { passos: { id: string; rotulo: string; resultado: string }[]; resposta?: Resposta };
export const inicio = (): Trilha => ({ passos: [] });

/** Uma escolha do leitor no papel do agente. Responder depois de ter chamado a ferramenta certa dá a resposta do agente;
 *  responder antes dá a do modelo sozinho, que escreve sem olhar. */
export function agir(r: Rodadas["agente"], trilha: Trilha, id: string): Trilha {
  if (trilha.resposta) return trilha;
  const acao = r.acoes.find((x) => x.id === id) ?? falhar(`a ação "${id}" não existe.`);
  if (acao.id === "responder") return { ...trilha, resposta: trilha.passos.some((p) => p.id === r.chamada) ? r.certa : r.semOlhar };
  return { passos: [...trilha.passos, { id: acao.id, rotulo: acao.rotulo, resultado: acao.resultado ?? "" }] };
}
