/**
 * A linha do tempo da figura do agente em vídeo (AgenteAoVivo.tsx): quando cada coisa acontece, em segundos, em cada
 * cenário. O tempo de cada passo é do vídeo, não do `duracao` do roteiro. Sem JSX, para os testes lerem.
 */
import { type Cenario, FERRAMENTAS, type Passo } from "./cenarios.ts";

export type Props = { cenarios: Cenario[]; loja: string };
export const ARESTA = 0.45; // a bolinha atravessando uma seta
export const TRANSICAO = 0.6; // entre um cenário e outro
const FIM = 0.6; // parado no último quadro
const LETRAS_POR_SEGUNDO = 60; // o cliente digitando
const LEITURA_POR_SEGUNDO = 55; // quanto da resposta dá para ler por segundo
const DIGITANDO = 0.8; // os três pontinhos do agente, antes da resposta

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

// o tempo de cada passo é do vídeo; o `duracao` do roteiro era da figura interativa
const duracao = (p: Passo) => {
  if (p.no === "cliente") return 0.3;
  if (p.trajeto === "cliente-agente") return 0.8;
  if (FERRAMENTAS.includes(p.no)) return 1;
  if (p.trajeto?.endsWith("-agente")) return 0.8 + (p.marca ? 0.5 : 0);
  if (p.no === "decisao") return 1.1;
  if (p.no === "resposta" || p.no === "pessoa") return 0.5;
  return 0.8;
};

export function montar({ cenarios, loja }: Props) {
  let t = 0, conversa = -1, nomeAntes = "";
  const cenas: Cena[] = cenarios.map((cen) => {
    if (cen.nome === "cliente" || cen.nome !== nomeAntes) conversa++;
    nomeAntes = cen.nome;
    let v = 0;
    const segs: Seg[] = cen.passos.map((p) => {
      const seg: Seg = { ...p, de: v, ate: v };
      if (p.no === "pergunta") { seg.envia = v + 0.25 + cen.pergunta.length / LETRAS_POR_SEGUNDO; seg.ate = seg.envia + 0.5; }
      else if (p.no === "conversa") seg.ate = v + DIGITANDO + Math.max(1.8, p.texto.length / LEITURA_POR_SEGUNDO) + (cen.decisao === "passar" ? 1 : 0);
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

/** As medidas do vídeo, e o quadro em que ele fica parado antes do play: o fim do primeiro cenário. */
export function quadroDoVideo(props: Props) {
  const { cenas, total } = montar(props);
  return { fps: 30, largura: 1280, altura: 720, duracao: Math.ceil(total * 30), parado: Math.round(cenas[0].fim * 30) - 1 };
}

// as iniciais da loja, no avatar da conversa: "Casa Bem-te-vi" → "Bt"
export const iniciais = (loja: string) => {
  const palavra = loja.split(" ").find((p) => p.includes("-")) ?? loja.split(" ").pop()!;
  return palavra.split("-").map((p) => p[0]).slice(0, 2).join("");
};
