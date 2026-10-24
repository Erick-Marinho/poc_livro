/**
 * O que a figura do grafo do agente mostra, montado de duas fontes gravadas: as setas do grafo real (a saída do
 * comando grafo-02, em saidas.json) e o que o modelo respondeu a cada pergunta (gravacoes/r02-medir.json).
 * Puro de propósito: o teste do livro chama isto direto. Falha se a figura descrever um nó que o grafo não tem,
 * ou se uma pergunta de referência não estiver na gravação.
 */
export type Seta = { de: string; para: string; escolhe: boolean };
export type Caminho = { id: string; pergunta: string; esperado: string; decidiu: string; motivo: string; escrita: string | null };
type Mensagem = { kwargs: { content: unknown; additional_kwargs?: { parsed?: { decisao: string; motivo: string } }; tool_calls?: { args: Record<string, string> }[] } };
type ItemGravado = { mensagens: { kwargs: { content: string } }[]; resposta: { kwargs: { message: Mensagem } }[] };

/** As setas, como o comando grafo-02 imprimiu: "decidir -> passar (escolhe)". */
export function setas(saida: [string, string][]): Seta[] {
  return saida.map(([l]) => l.match(/^(\S+) -> (\S+)( \(escolhe\))?$/)).filter((m): m is RegExpMatchArray => !!m)
    .map((m) => ({ de: m[1], para: m[2], escolhe: !!m[3] }));
}

/** Os nós em camadas, do começo ao fim: cada nó fica na camada do caminho mais longo que chega nele. */
export function camadas(s: Seta[]): string[][] {
  const nivel = new Map<string, number>([["__start__", 0]]);
  for (let mudou = true, voltas = 0; mudou; voltas++) {
    if (voltas > s.length + 1) throw new Error("o grafo tem um ciclo: a figura ainda não sabe desenhar ciclos");
    mudou = false;
    for (const { de, para } of s) if (nivel.has(de) && (nivel.get(para) ?? -1) < nivel.get(de)! + 1) { nivel.set(para, nivel.get(de)! + 1); mudou = true; }
  }
  const total = Math.max(...nivel.values()) + 1;
  return Array.from({ length: total }, (_, i) => [...nivel].filter(([, n]) => n === i).map(([no]) => no).sort());
}

const texto = (c: unknown) => typeof c === "string" ? c : Array.isArray(c) ? c.map((b) => (b as { text?: string }).text ?? "").join("") : "";

/** O que o modelo decidiu (e escreveu, quando escreveu) para cada pergunta de referência, lido da gravação. */
export function caminhosDaGravacao(gravacao: Record<string, ItemGravado>, referencia: string): Caminho[] {
  const decisoes = new Map<string, { decidiu: string; motivo: string }>(), escritas = new Map<string, string>();
  for (const item of Object.values(gravacao)) {
    const pergunta = item.mensagens.at(-1)!.kwargs.content;
    const m = item.resposta[0].kwargs.message.kwargs;
    let escolha = m.additional_kwargs?.parsed ?? (m.tool_calls?.[0]?.args as { decisao: string; motivo: string } | undefined);
    if (!escolha) { try { const j = JSON.parse(texto(m.content)); if (j.decisao) escolha = j; } catch { /* é uma resposta escrita */ } }
    if (escolha) decisoes.set(pergunta, { decidiu: escolha.decisao, motivo: escolha.motivo });
    else escritas.set(pergunta, texto(m.content));
  }
  return referencia.split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l)).map((c: { id: string; pergunta: string; decisao: string }) => {
    const d = decisoes.get(c.pergunta);
    if (!d) throw new Error(`a pergunta ${c.id} não está na gravação: rode npm run gravar (pago)`);
    return { id: c.id, pergunta: c.pergunta, esperado: c.decisao, ...d, escrita: escritas.get(c.pergunta) ?? null };
  });
}
