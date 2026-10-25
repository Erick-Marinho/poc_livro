/**
 * A linha do tempo da figura do agente em vídeo (AgenteAoVivo.tsx): quando cada coisa acontece, em segundos, em cada
 * cenário. O tempo de cada passo é do vídeo, não do `duracao` do roteiro: vem do texto que está na tela, no ritmo de
 * quem lê e acompanha a animação ao mesmo tempo. Sem JSX, para os testes lerem.
 */
import { type Cenario, type Passo } from "./cenarios.ts";

export type Props = { cenarios: Cenario[]; loja: string };
export const ARESTA = 0.6; // a bolinha atravessando uma seta
export const TRANSICAO = 0.8; // entre um cenário e outro (a câmera volta para o quadro inteiro)
const FIM = 1.8; // no fim, o quadro inteiro, com as quatro abas feitas
const DIGITA_POR_SEGUNDO = 46; // o cliente digitando
const LER_PERGUNTA = 1; // depois de enviada, o tempo de ler a pergunta
/* a legenda se lê enquanto a animação anda: abaixo das ~17 letras por segundo da legendagem, que contam com o olho só
   no texto */
const LEGENDA_POR_SEGUNDO = 13;
const LEGENDA_MINIMA = 2;
const RESPOSTA_POR_SEGUNDO = 15;
const RESPOSTA_MINIMA = 2.6;
const DIGITANDO = 1; // os três pontinhos do agente, antes da resposta
const SELO = 0.6; // a pausa quando o selo aparece
export const APOSTA = "R12"; // o cenário em que o vídeo para e pergunta o que o agente deve fazer

/** Os passos sem legenda: a pergunta e a resposta estão na conversa; chegar ao cliente e à saída é só a seta. */
export const SEM_LEGENDA = ["pergunta", "cliente", "conversa", "resposta", "pessoa"];

export type Seg = Passo & { de: number; ate: number; envia?: number };
export type Cena = Cenario & {
  conversa: number; // cenários do mesmo cliente seguem na mesma conversa
  inicio: number; // no vídeo
  fim: number;
  segs: Seg[]; // tempos contados do fim da transição
  digitando: number; // o agente começa a digitar
  responde: number;
  sistema?: number; // a conversa passa para a equipe
};

// o tempo de cada passo do grafo: o da legenda dele, ou o da seta quando ele não tem legenda
const duracao = (p: Passo) => {
  if (p.no === "cliente") return 0.6;
  if (p.no === "resposta" || p.no === "pessoa") return 0.9;
  return Math.max(LEGENDA_MINIMA, p.texto.length / LEGENDA_POR_SEGUNDO) + (p.marca ? SELO : 0);
};

export function montar({ cenarios, loja }: Props) {
  let t = 0, conversa = -1, nomeAntes = "";
  const cenas: Cena[] = cenarios.map((cen) => {
    if (cen.nome === "cliente" || cen.nome !== nomeAntes) conversa++;
    nomeAntes = cen.nome;
    let v = 0;
    const segs: Seg[] = cen.passos.map((p) => {
      const seg: Seg = { ...p, de: v, ate: v };
      if (p.no === "pergunta") { seg.envia = v + 0.3 + cen.pergunta.length / DIGITA_POR_SEGUNDO; seg.ate = seg.envia + LER_PERGUNTA; }
      else if (p.no === "conversa") seg.ate = v + DIGITANDO + Math.max(RESPOSTA_MINIMA, p.texto.length / RESPOSTA_POR_SEGUNDO) + (cen.decisao === "passar" ? 1.2 : 0);
      else seg.ate = v + duracao(p);
      v = seg.ate;
      return seg;
    });
    const fala = segs.find((s) => s.no === "conversa")!;
    const cena: Cena = { ...cen, conversa, inicio: t, fim: t + TRANSICAO + v, segs, digitando: fala.de, responde: fala.de + DIGITANDO,
      ...(cen.decisao === "passar" ? { sistema: fala.de + DIGITANDO + 0.8 } : {}) };
    t = cena.fim;
    return cena;
  });
  return { cenas, total: t + FIM, loja };
}
export type Montado = ReturnType<typeof montar>;

/** As medidas do vídeo, o quadro em que ele fica parado antes do play (o fim do primeiro cenário) e o da aposta. */
export function quadroDoVideo(props: Props) {
  const { cenas, total } = montar(props);
  const fps = 30;
  const cena = cenas.find((c) => c.caso === APOSTA);
  const decisao = cena?.segs.find((s) => s.no === "decisao");
  return {
    fps, largura: 1280, altura: 720, duracao: Math.ceil(total * fps), parado: Math.round(cenas[0].fim * fps) - 1,
    /* a aposta: o vídeo para logo antes de a bolinha sair do agente para a decisão (e antes de a legenda contar qual é) */
    aposta: cena && decisao ? { quadro: Math.round((cena.inicio + TRANSICAO + decisao.de) * fps) - 2, caso: cena.caso, decisao: cena.decisao,
      revela: Math.round((cena.inicio + TRANSICAO + decisao.de + ARESTA + 0.2) * fps), fim: Math.round(cena.fim * fps) } : null,
  };
}

// as iniciais da loja, no avatar da conversa: "Casa Bem-te-vi" → "Bt"
export const iniciais = (loja: string) => {
  const palavra = loja.split(" ").find((p) => p.includes("-")) ?? loja.split(" ").pop()!;
  return palavra.split("-").map((p) => p[0]).slice(0, 2).join("");
};
