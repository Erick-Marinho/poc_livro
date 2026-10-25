/**
 * Os cenários da figura do agente, conferidos contra o contrato: o caso existe, a escolha é a do referencia.jsonl,
 * as ferramentas visitadas são as do `precisa`, a saída é a do canal da decisão. O que cada ferramenta devolve
 * ("o que o agente já sabe") sai dos dados da loja, não do roteiro. Usado pelo FiguraAgente.astro e pelo Studio do
 * my-video, para os dois montarem a mesma coisa.
 */
export type Escolha = "responder" | "recusar" | "abrir_chamado" | "passar";
export type Passo = { no: string; trajeto?: string; escolha?: Escolha; marca?: string; texto: string; duracao: number; viu?: string };
export type Cenario = { caso: string; pergunta: string; decisao: Escolha; nome: string; resposta: string; passos: Passo[] };

export const DECISOES: Record<Escolha, string> = { responder: "responder", recusar: "recusar", abrir_chamado: "abrir chamado", passar: "passar a vez" };
export const FERRAMENTAS = ["pedidos", "politica", "catalogo"];

type PassoDoRoteiro = { no: string; trajeto?: string; escolha?: string; marca?: string; trecho?: string; texto: string; duracao: number };
type Caso = { id: string; pergunta: string; decisao: string; precisa: string[]; pedido?: string; email?: string };
type Pedido = { id: string; cliente: string; status: string; [data: string]: unknown };
export type Entrada = {
  roteiro: { cenarios: { caso: string; passos: PassoDoRoteiro[] }[] };
  referencia: string;
  clientes: { nome: string; email: string }[];
  pedidos: Pedido[];
  politica: string;
};

const escolhas = Object.keys(DECISOES);
const nos = new Set(["pergunta", "cliente", "agente", ...FERRAMENTAS, "decisao", "resposta", "pessoa", "conversa"]);
const trajetos = new Set(["cliente-agente", "agente-decisao", "decisao-resposta", "decisao-pessoa", ...FERRAMENTAS.flatMap((f) => [`agente-${f}`, `${f}-agente`])]);
const falhar = (caso: string, motivo: string): never => { throw new Error(`Figura do agente · ${caso}: ${motivo}`); };
const dia = (iso: unknown) => { const [, m, d] = String(iso).split("-"); return `${d}/${m}`; };
const resumoPedido: Record<string, (p: Pedido) => string> = {
  preparando: (p) => `preparando · envio ${dia(p.previsao_envio)}`,
  enviado: (p) => `enviado · chega ${dia(p.previsao_entrega)}`,
  entregue: (p) => `entregue em ${dia(p.entregue_em)}`,
  cancelado: (p) => `cancelado em ${dia(p.cancelado_em)}`,
};

export function montarCenarios({ roteiro, referencia, clientes, pedidos, politica }: Entrada): Cenario[] {
  const casos: Caso[] = referencia.split("\n").filter((linha) => linha.trim()).map((linha) => JSON.parse(linha));
  if (!Array.isArray(roteiro.cenarios) || !roteiro.cenarios.length) falhar("roteiro", "nenhum cenário informado.");
  return roteiro.cenarios.map((cenario) => {
    const caso = casos.find((item) => item.id === cenario.caso) ?? falhar(cenario.caso, "caso inexistente no referencia.jsonl.");
    if (!Array.isArray(cenario.passos) || !cenario.passos.length) falhar(caso.id, "cenário sem passos.");
    const visitadas = new Set<string>();
    for (const passo of cenario.passos) {
      if (!nos.has(passo.no)) falhar(caso.id, `nó desconhecido: "${passo.no}".`);
      if (passo.trajeto && !trajetos.has(passo.trajeto)) falhar(caso.id, `trajeto desconhecido: "${passo.trajeto}".`);
      if (!Number.isFinite(passo.duracao) || passo.duracao <= 0) falhar(caso.id, `duração inválida no passo "${passo.no}".`);
      if (typeof passo.texto !== "string") falhar(caso.id, `texto ausente no passo "${passo.no}".`);
      if (passo.marca !== undefined && (typeof passo.marca !== "string" || [...passo.marca].length > 20)) falhar(caso.id, `marca do passo "${passo.no}" deve ter no máximo 20 caracteres.`);
      for (const no of [passo.no, ...(passo.trajeto?.split("-") ?? [])]) if (FERRAMENTAS.includes(no)) visitadas.add(no);
    }
    if (!cenario.passos.some((passo) => passo.no === "conversa")) falhar(caso.id, "cenário sem o passo conversa.");
    const decisoes = cenario.passos.filter((passo) => passo.no === "decisao");
    if (decisoes.length !== 1) falhar(caso.id, "o cenário precisa de exatamente um passo decisao.");
    if (!escolhas.includes(caso.decisao)) falhar(caso.id, `decisão desconhecida: "${caso.decisao}".`);
    if (decisoes[0].escolha !== caso.decisao) falhar(caso.id, `escolha "${decisoes[0].escolha}" diverge da decisão "${caso.decisao}" no contrato.`);
    const precisa = new Set(caso.precisa);
    if (visitadas.size !== precisa.size || [...visitadas].some((no) => !precisa.has(no))) {
      falhar(caso.id, `ferramentas visitadas [${[...visitadas].join(", ")}] divergem de precisa [${caso.precisa.join(", ")}].`);
    }
    const canal = caso.decisao === "passar" ? "pessoa" : "resposta";
    const saidas = cenario.passos.filter((passo) => passo.no === "resposta" || passo.no === "pessoa");
    const canaisDosTrajetos = cenario.passos.filter((passo) => passo.trajeto?.startsWith("decisao-")).map((passo) => passo.trajeto!.slice("decisao-".length));
    if (saidas.length !== 1 || saidas[0].no !== canal || canaisDosTrajetos.some((saida) => saida !== canal)) {
      falhar(caso.id, `canal de saída incorreto: a decisão "${caso.decisao}" exige "${canal}".`);
    }
    /* o que volta de cada ferramenta, lido dos dados da loja */
    const viu = (ferramenta: string, passo: PassoDoRoteiro): string => {
      if (ferramenta === "pedidos") {
        const p = pedidos.find((x) => x.id === caso.pedido) ?? falhar(caso.id, `o pedido ${caso.pedido} não está no pedidos.json.`);
        return `${p.id} · ${(resumoPedido[p.status] ?? falhar(caso.id, `status sem resumo: "${p.status}".`))(p)} · dono ${p.cliente}`;
      }
      if (ferramenta === "politica") {
        if (!passo.trecho || !politica.includes(passo.trecho)) falhar(caso.id, `o trecho da política não está no politica.md: "${passo.trecho ?? ""}".`);
        return `política: “${passo.trecho}”`;
      }
      return falhar(caso.id, "o catálogo ainda não tem dados na figura.");
    };
    const passos = cenario.passos.map((passo, i) => {
      const volta = passo.trajeto?.match(/^(\w+)-agente$/)?.[1];
      const ida = volta ? cenario.passos.slice(0, i).reverse().find((p) => p.no === volta) : undefined;
      const { trecho: _trecho, ...resto } = passo;
      return { ...resto, escolha: passo.escolha as Escolha | undefined, ...(volta && volta !== "cliente" ? { viu: viu(volta, ida ?? passo) } : {}) };
    });
    return {
      caso: caso.id, pergunta: caso.pergunta, decisao: caso.decisao as Escolha, passos,
      nome: clientes.find((cliente) => cliente.email === caso.email)?.nome ?? "cliente",
      resposta: cenario.passos.find((passo) => passo.no === "conversa")!.texto,
    };
  });
}
