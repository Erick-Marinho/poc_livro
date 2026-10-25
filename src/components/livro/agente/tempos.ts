/**
 * A linha do tempo da figura do agente em vídeo (AgenteAoVivo.tsx): quando cada coisa acontece, em segundos, em cada
 * cenário. O tempo de cada passo é do vídeo, não do `duracao` do roteiro. Sem JSX, para os testes lerem.
 * O primeiro cenário vai devagar (é nele que o leitor aprende a ler a figura); os outros, mais rápido.
 */
import { type Cenario, FERRAMENTAS, type Passo } from "./cenarios.ts";

export type Props = { cenarios: Cenario[]; loja: string };
export const ARESTA = 0.45; // a bolinha atravessando uma seta
export const TRANSICAO = 0.6; // entre um cenário e outro (a câmera volta para o quadro inteiro)
const FIM = 1.2; // no fim, o quadro inteiro, com as quatro abas feitas
const LETRAS_POR_SEGUNDO = 60; // o cliente digitando
const LEITURA_POR_SEGUNDO = 55; // quanto da resposta dá para ler por segundo
const DIGITANDO = 0.7; // os três pontinhos do agente, antes da resposta
const RITMO = [1.3, 0.7]; // o passo do grafo: o primeiro cenário, e os outros
const SELO = 0.5; // a pausa quando o selo aparece
const ESCOLHA = 0.5; // a pausa depois de a decisão acender
export const APOSTA = "R12"; // o cenário em que o vídeo para e pergunta o que o agente deve fazer

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

// o tempo de cada passo do grafo, antes do ritmo do cenário
const duracao = (p: Passo) => {
  if (p.no === "cliente") return 0.4;
  if (p.trajeto === "cliente-agente") return 0.9;
  if (FERRAMENTAS.includes(p.no)) return 1;
  if (p.trajeto?.endsWith("-agente")) return 0.9;
  if (p.no === "decisao") return 1.1;
  if (p.no === "resposta" || p.no === "pessoa") return 0.6;
  return 0.8;
};

export function montar({ cenarios, loja }: Props) {
  let t = 0, conversa = -1, nomeAntes = "";
  const cenas: Cena[] = cenarios.map((cen, k) => {
    if (cen.nome === "cliente" || cen.nome !== nomeAntes) conversa++;
    nomeAntes = cen.nome;
    const ritmo = RITMO[Math.min(k, 1)];
    let v = 0;
    const segs: Seg[] = cen.passos.map((p) => {
      const seg: Seg = { ...p, de: v, ate: v };
      if (p.no === "pergunta") { seg.envia = v + 0.3 + cen.pergunta.length / LETRAS_POR_SEGUNDO; seg.ate = seg.envia + 0.6; }
      else if (p.no === "conversa") seg.ate = v + DIGITANDO + Math.max(1.8, p.texto.length / LEITURA_POR_SEGUNDO) + (cen.decisao === "passar" ? 1 : 0);
      else seg.ate = v + duracao(p) * ritmo + (p.marca ? SELO : 0) + (p.no === "decisao" ? ESCOLHA : 0);
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
