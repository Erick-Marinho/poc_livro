/**
 * O desenho da figura "o que vamos construir" em vídeo (CaminhoDaPergunta.tsx): o rastro gravado lido, os momentos do
 * passeio e onde cada coisa fica em cada etapa, num quadro de 1280×720. As props são as do FiguraCaminho.astro.
 */
export type Frase = { palavras: number; nota: string; data: string; frase: string };
type Escolha = { frase: string; nota: string; data: string };
export type Rastro = {
  pergunta: string; palavras: string[]; topo: number;
  notas: { arquivo: string; titulo: string; data: string; pontos: number; achada: boolean }[];
  frases: Frase[]; sem_data: Escolha; com_data: Escolha & { antes: Escolha | null };
};
export type Props = { bruto: string; comando: string; regua: { sem: string; com: string; modelo?: string } };

// Os momentos do passeio, em segundos. Cada um acende uma etapa do fluxo.
export const T = { pergunta: 0, busca: 4, frases: 10.5, sem: 17, com: 23, regua: 30, fim: 36 };
export const QUADRO = { fps: 30, largura: 1280, altura: 720, duracao: T.fim * 30 };
export const CARTAO = { largura: 580, altura: 56 };
export const EIXO = { y: 548, de: 120, ate: 1160 };

const sem = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();
const diaNum = (d: string) => { const [dd, mm] = d.split("/").map(Number); return mm * 100 + dd; };
const dias = (d: string) => { const [dd, mm] = d.split("/").map(Number); return new Date(2026, mm - 1, dd).getTime() / 86400000; };
export const titulo = (arquivo: string) => arquivo.split("/").pop()!.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2} /, "");
export const prazoDe = (frase: string) => frase.match(/\d{2}\/\d{2}/)?.[0] ?? "";

export const montar = ({ bruto, comando, regua }: Props) => {
  const r: Rastro = JSON.parse(bruto);
  const nota = (l: string) => l.match(/(\d+) de (\d+)/)!.slice(1).map(Number);
  const [semA, total] = nota(regua.sem), [comA] = nota(regua.com), modA = regua.modelo ? nota(regua.modelo)[0] : null;

  // a pergunta, palavra por palavra, numa linha no meio do palco (JetBrains Mono: 0,6em por letra)
  const fonteP = 40;
  const larguraP = (w: string) => w.length * fonteP * 0.6 + 32;
  const ditas = r.pergunta.replace(/[?.,!]/g, "").split(/\s+/);
  let xP = (1280 - ditas.reduce((s, w) => s + larguraP(w), 0) - (ditas.length - 1) * 14) / 2, k = 0;
  const palavras = ditas.map((w) => {
    const fica = r.palavras.includes(sem(w));
    const p = { texto: w, fica, x: xP, ordem: fica ? k++ : -1 };
    xP += larguraP(w) + 14;
    return p;
  });

  // as notas achadas, cada uma com as frases dela embaixo
  const achadas = r.notas.filter((n) => n.achada);
  const cabeca: Record<string, number> = {}, linhaDaFrase: number[] = [];
  let y = 172;
  for (const n of achadas) {
    cabeca[n.arquivo] = y; y += 28;
    r.frases.forEach((f, j) => { if (f.nota === n.arquivo) { linhaDaFrase[j] = y; y += 32; } });
    y += 6;
  }
  const ordemNaLista = r.frases.map((_, j) => j).sort((a, b) => linhaDaFrase[a] - linhaDaFrase[b]);

  // o empate: na ordem da busca (sem a data) e na ordem da data, sobre o eixo do tempo (com a data)
  const empatadas = r.frases.map((f, j) => ({ ...f, j })).filter((f) => f.palavras === r.topo);
  const ordemBusca = (f: Frase) => r.notas.findIndex((n) => n.arquivo === f.nota);
  const porBusca = [...empatadas].sort((a, b) => ordemBusca(a) - ordemBusca(b));
  const porData = [...empatadas].sort((a, b) => diaNum(b.data) - diaNum(a.data));
  const datas = empatadas.map((f) => dias(f.data));
  const [d0, d1] = [Math.min(...datas), Math.max(...datas)];
  const xDaData = (d: string) => EIXO.de + ((dias(d) - d0) / (d1 - d0)) * (EIXO.ate - EIXO.de);
  const empate = empatadas.map((f) => {
    const x = xDaData(f.data);
    return { ...f, xDaData: x, semTopo: 220 + porBusca.indexOf(f) * 80, comTopo: 220 + porData.indexOf(f) * 80,
      comEsquerda: Math.min(Math.max(x - CARTAO.largura, 40), 1240 - CARTAO.largura) };
  });
  const marcas = [...new Set(empatadas.map((f) => f.data))].map((d) => ({ data: d, x: xDaData(d) }));

  const novo = prazoDe(r.com_data.frase);
  const contagem = [...new Set(empatadas.map((f) => prazoDe(f.frase)))]
    .map((p) => ({ prazo: p, vezes: empatadas.filter((f) => prazoDe(f.frase) === p).length }));

  const passos = [
    { em: T.pergunta, no: 0, texto: "A pergunta vira palavras: sem acento, e sem as que não dizem nada sozinhas." },
    { em: T.busca, no: 1, texto: `O BM25 dá nota a cada uma das ${r.notas.length} notas do cofre; as ${achadas.length} melhores seguem. A mais parecida é de ${r.sem_data.data}, mas há uma de ${r.com_data.data}.` },
    { em: T.frases, no: 2, texto: `Nas notas achadas, as frases com mais palavras da pergunta: ${empatadas.length} empatam. ${contagem.map((c) => `${c.vezes} ${c.vezes > 1 ? "dizem" : "diz"} ${c.prazo}`).join("; ")}.` },
    { em: T.sem, no: 3, texto: `Sem a data, vale a frase da nota mais parecida: ${prazoDe(r.sem_data.frase)}, de uma nota de ${r.sem_data.data}.` },
    { em: T.com, no: 3, texto: `Com a data, entre as que empatam, vale a mais nova: ${novo}, de ${r.com_data.data}, com a velha ao lado.` },
    { em: T.regua, no: 4, texto: `A régua: sem a data, ${semA} de ${total}; com ela, ${comA} de ${total}${modA !== null ? `; com um modelo local, ${modA} de ${total}` : ""}.` },
  ];
  const nos = [
    { nome: "a pergunta", valor: `${r.palavras.length} palavras` },
    { nome: "a busca", valor: `${achadas.length} de ${r.notas.length} notas` },
    { nome: "as frases", valor: `${empatadas.length} empatam` },
    { nome: "a regra da data", valor: r.com_data.data },
    { nome: "a régua", valor: `${modA ?? comA} de ${total}` },
  ];
  const medidas = [
    { nome: "sem a data", detalhe: "o cérebro ingênuo", acertos: semA },
    { nome: "com a data", detalhe: "a nota mais nova vale", acertos: comA },
    ...(modA !== null ? [{ nome: "com um modelo local", detalhe: "llama3.2:3b no Ollama", acertos: modA }] : []),
  ];

  return { r, comando, total, palavras, fonteP, cabeca, linhaDaFrase, ordemNaLista, empate, marcas, novo, contagem, passos, nos, medidas };
};

export type Montado = ReturnType<typeof montar>;
