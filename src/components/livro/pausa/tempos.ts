/**
 * Os tempos de verdade (docs/capacidades/pausa-e-fluxo-revisao.md, etapa 3): a coleta corrigida numa linha do tempo,
 * no relógio da coleta. Os números são as medianas que o medir.py imprimiu (a saída gravada pf-limpa); as palavras, as
 * da figura do experimento; os tokens escritos, a mediana de cada caso no coleta.json (como o medir.py faz com os tempos). Nada aqui é ilustração,
 * só o desenho. Puro de propósito: o teste chama isto direto.
 */
export type Linha = { caso: string; rotulo: string; palavras: number; le: number; pausa: number; fluxo: number; cache: number; escritos: number };
type Mensagem = { nome: string; palavras: number };

export const FPS = 30;
/** a cena 1 corre no relógio da coleta; a cena 2, a longa de novo, recomeça o relógio em DE_NOVO */
export const DE_NOVO = 36.3;
export const SEGUNDOS = 45;
export const DURACAO = SEGUNDOS * FPS;
/** o eixo do tempo, em segundos: cabe a longa inteira, lendo e escrevendo */
export const EIXO = 36;

const virgula = (n: number, casas: number) => n.toFixed(casas).replace(".", ",");
export const segundos = (n: number) => `${virgula(n, 2)} s`;
export const porSegundo = (n: number) => `${virgula(n, 1)} tokens/s`;

const mediana = (xs: number[]) => { const o = [...xs].sort((a, b) => a - b), m = o.length >> 1; return o.length % 2 ? o[m] : (o[m - 1] + o[m]) / 2; };

export function montarTempos(saida: [string, string][], mensagens: Mensagem[], escritos: Record<string, number[]>) {
  const ler = (caso: string) => {
    const l = saida.map(([x]) => x).find((x) => x.startsWith(`${caso} `));
    const m = l?.match(/lê\s+(\d+) tokens\s+pausa\s+([\d.]+) s\s+fluxo\s+([\d.]+) tokens\/s\s+do cache\s+(\d+)/);
    if (!m) throw new Error(`os tempos: o caso ${caso} não está na saída gravada`);
    return { le: +m[1], pausa: +m[2], fluxo: +m[3], cache: +m[4] };
  };
  const escreveu = (caso: string) => {
    if (!escritos[caso]?.length) throw new Error(`os tempos: o caso ${caso} não está no coleta.json`);
    return mediana(escritos[caso]);
  };
  const nomes = { curta: "curta", media: "média", longa: "longa" } as Record<string, string>;
  const linhas: Linha[] = ["curta", "media", "longa"].map((caso) => {
    const msg = mensagens.find((x) => x.nome === nomes[caso]);
    if (!msg) throw new Error(`os tempos: a mensagem ${nomes[caso]} não está na figura`);
    return { caso, rotulo: nomes[caso], palavras: msg.palavras, ...ler(caso), escritos: escreveu(caso) };
  });
  const deNovo: Linha = { caso: "de_novo", rotulo: "de novo", palavras: linhas[2].palavras, ...ler("de_novo"), escritos: escreveu("de_novo") };
  const fim = (l: Linha) => l.pausa + l.escritos / l.fluxo;
  if (fim(linhas[2]) > EIXO || fim(deNovo) + DE_NOVO > SEGUNDOS - 0.5) throw new Error("os tempos: a longa não cabe no eixo");
  return { linhas, deNovo, vezes: Math.round(linhas[2].pausa / linhas[0].pausa) };
}
export type Tempos = ReturnType<typeof montarTempos>;
export const fimDe = (_t: Tempos, l: Linha) => l.pausa + l.escritos / l.fluxo;

/** o ritmo, pelo que a coleta mostrou, e não "parecido" por princípio: a régua aceita até 20% de queda */
const ritmo = (curta: Linha, longa: Linha) => longa.fluxo >= 0.8 * curta.fluxo
  ? "Escrevendo, as três vão num ritmo parecido."
  : `Escrevendo, a longa vai mais devagar: ${porSegundo(longa.fluxo)} contra ${porSegundo(curta.fluxo)}.`;

/** o texto embaixo, um por momento; é também o texto da figura para quem não a vê */
export function legendas(t: Tempos) {
  const [curta, , longa] = t.linhas;
  return [
    { de: 0, ate: fimDe(t, longa) + 0.3, texto: "As três saem juntas, no relógio da coleta. Cinza é ler; azul é escrever." },
    { de: fimDe(t, longa) + 0.3, ate: DE_NOVO, texto: `A longa demora ${t.vezes} vezes mais que a curta para começar (${segundos(longa.pausa)} contra ${segundos(curta.pausa)}). ${ritmo(curta, longa)}` },
    { de: DE_NOVO, ate: SEGUNDOS + 1, texto: `A longa, pedida de novo: ${t.deNovo.cache} de ${t.deNovo.le} tokens vieram do cache, e ela começa em ${segundos(t.deNovo.pausa)}.` },
  ];
}
