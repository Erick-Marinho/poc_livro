/**
 * A atendente com e sem anotações (Remotion; docs/capacidades/experimento-kv-cache.md, etapa 5), em "O que vamos
 * construir". Com o cache, ela lê a mensagem uma vez e anota cada palavra; para a palavra nova, lê só a última e olha
 * as anotações (sem dizer quanto isso custa: é a aposta). Sem o cache, relê tudo antes de cada palavra, e o que ela lê
 * cresce. As anotações enchem uma gaveta, em cada andar do modelo. O medidor mostra as duas mensagens, com e sem cache,
 * e fica o fecho, com os resumos. Os textos saem de kv.ts; os tamanhos são ilustração.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, kf, mono, suave, ui } from "../palco/video";
import { ANOTACOES as F, type Kv, palavraEm } from "./kv.ts";
import { BalaoDaCena, Cabecalho, CAIXA, Caixa, cenaEm, type Desenho, Ilustracao, MEDIDAS, Resumos, rotulo, seta } from "./pecas";

export type Props = { kv: Kv; desenho: Desenho };

const LIDAS = 12; // anotações da leitura, na ilustração
const ANDARES = 5;
const preenchido = "color-mix(in srgb, var(--acento, #2a4fb5) 22%, transparent)";

export const AnotacoesAnimadas: React.FC<Props> = ({ kv: p, desenho }) => {
  const M = MEDIDAS[desenho];
  const t = useCurrentFrame() / useVideoConfig().fps;
  const k = cenaEm(F, t);
  const de = (j: number) => F.cenas[j].de;
  const X = M.x, W = M.aw;
  const msg = { x: X, w: W * 0.3 }, atendente = { x: X + W * 0.35, w: W * 0.26 }, resp = { x: X + W * 0.66, w: W * 0.34 };

  /* a resposta: escrita na cena 2 (com anotações) e de novo na 3 (sem); da 4 em diante, inteira */
  const escreve = k === 1 || k === 2 ? de(k) : null;
  const escritos = escreve === null ? (k >= 3 ? p.resposta.length : 0) : p.resposta.filter((_, i) => t >= palavraEm(escreve, i)).length;
  const le = kf(t, [[0.6, 0], [4, 1]]);
  const lendo = k === 0 && le > 0 && le < 1;
  const ultima = escritos ? p.resposta[escritos - 1] : p.pergunta.split(/\s+/).at(-1);
  const estado = k === 0 ? (lendo ? "lendo" + ".".repeat(1 + (Math.floor(t * 3) % 3)) : le >= 1 ? "leu ✓" : "")
    : escritos >= p.resposta.length ? "terminou" : k === 1 ? `lê só a última: "${ultima}"` : "relê tudo";
  const escrevendo = escreve !== null && escritos < p.resposta.length;
  const montagem = kf(t, [[de(4) - 0.3, 1], [de(4), 0]]);

  const caixas = <>
    <Caixa x={msg.x} w={msg.w} titulo="A MENSAGEM" acesa={lendo || (k === 2 && escrevendo)}>
      <div style={{ font: `${M.fonte - 1}px/1.3 ${ui}`, color: cor.texto }}>…{p.trecho}</div>
    </Caixa>
    {seta(msg.x + msg.w, atendente.x, lendo || (k === 2 && escrevendo))}
    <Caixa x={atendente.x} w={atendente.w} titulo="A ATENDENTE" acesa={lendo || escrevendo}>
      <div style={{ font: `600 ${M.fonte + 1}px/1.3 ${ui}`, color: lendo || escrevendo ? cor.acento : cor.texto }}>{estado}</div>
    </Caixa>
    {seta(atendente.x + atendente.w, resp.x, escrevendo)}
    <Caixa x={resp.x} w={resp.w} titulo="A RESPOSTA" acesa={escrevendo}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 5px", font: `600 ${M.fonte + 1}px ${mono}`, color: cor.texto }}>
        {p.resposta.slice(0, escritos).map((w, i) => <span key={i} style={{ opacity: escreve === null ? 1 : kf(t, [[palavraEm(escreve, i), 0], [palavraEm(escreve, i) + 0.2, 1]]) }}>{w}</span>)}
        {escrevendo ? <span style={{ color: cor.acento, opacity: Math.floor(t * 2.5) % 2 ? 0.2 : 1 }}>▌</span> : null}
      </div>
    </Caixa>
  </>;

  /* a fileira de anotações (cenas 1 e 2), apagada na 3 */
  const total = LIDAS + p.resposta.length;
  const anotadas = k === 0 ? Math.floor(LIDAS * le) : LIDAS + escritos;
  const celula = (W - 3 * total) / total;
  const fileira = (
    <div style={{ position: "absolute", left: X, top: 160, width: W, opacity: k === 2 ? kf(t, [[de(2), 1], [de(2) + 0.5, 0.25]]) : 1 }}>
      {rotulo(k === 2 ? "SEM ANOTAÇÕES" : "AS ANOTAÇÕES: UMA POR PALAVRA LIDA")}
      <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
        {Array.from({ length: total }, (_, i) => {
          const cheia = k < 2 && i < anotadas;
          return <div key={i} style={{ width: celula, height: 20, borderRadius: 3, boxSizing: "border-box", border: `1.5px ${k === 2 ? "dashed" : "solid"} ${cheia ? cor.acento : cor.linha}`,
            background: cheia ? preenchido : "transparent" }} />;
        })}
      </div>
    </div>
  );
  /* na cena 2, o "olha": da atendente até a fileira */
  const olha = k === 1 && escrevendo ? (
    <div style={{ position: "absolute", left: atendente.x + atendente.w / 2, top: CAIXA.y + CAIXA.h + 2, height: 156 - CAIXA.y - CAIXA.h, borderLeft: `2px dashed ${cor.acento}` }}>
      <span style={{ position: "absolute", left: 6, top: 2, font: `600 ${M.fonte}px ${ui}`, color: cor.acento }}>olha</span>
    </div>
  ) : null;

  /* cena 3: o que ela lê antes de cada palavra, uma barra por palavra, cada uma maior que a anterior */
  const releituras = k === 2 ? (
    <div style={{ position: "absolute", left: X, top: 200, width: W }}>
      {rotulo("O QUE ELA LÊ ANTES DE CADA PALAVRA")}
      {p.resposta.map((_, i) => t >= palavraEm(de(2), i) - 0.3 ? <div key={i} style={{ marginTop: 3, height: 6, borderRadius: 3, background: cor.fraco,
        width: W * (0.45 + (0.5 * i) / (p.resposta.length - 1)) * kf(t, [[palavraEm(de(2), i) - 0.3, 0.4], [palavraEm(de(2), i), 1]], suave) }} /> : null)}
    </div>
  ) : null;

  /* cena 4: a gaveta, um andar por camada do modelo, uma coluna por palavra */
  const colunas = 18;
  const cheias = Math.round(colunas * kf(t, [[de(3) + 0.5, 0], [de(3) + 3.5, 1]]));
  const gaveta = k === 3 ? (
    <div style={{ position: "absolute", left: X, top: 160, width: W, opacity: kf(t, [[de(3), 0], [de(3) + 0.3, 1]]) }}>
      {rotulo("A GAVETA: UMA ANOTAÇÃO POR PALAVRA, EM CADA ANDAR")}
      <div style={{ marginTop: 6, padding: 4, border: `2px solid ${cor.fraco}`, borderRadius: 8 }}>
        {Array.from({ length: ANDARES }, (_, a) => <div key={a} style={{ display: "flex", gap: 3, marginTop: a ? 3 : 0 }}>
          {Array.from({ length: colunas }, (_, c) => <div key={c} style={{ flex: 1, height: 11, borderRadius: 2, boxSizing: "border-box",
            border: `1px solid ${c < cheias ? cor.acento : cor.linha}`, background: c < cheias ? preenchido : "transparent" }} />)}
        </div>)}
      </div>
    </div>
  ) : null;

  /* cena 5: o medidor, nas duas mensagens, com e sem cache; o resultado fica para depois */
  const maior = Math.max(...p.mensagens.map((m) => m.palavras));
  const chip = (s: string) => <span key={s} style={{ font: `700 ${M.fonte}px ${mono}`, color: cor.acento, border: `1.5px dashed ${cor.acento}`, borderRadius: 6, padding: "1px 6px", whiteSpace: "nowrap" }}>{s}</span>;
  const medidor = (
    <div style={{ position: "absolute", left: X, top: 40, width: W, opacity: kf(t, [[de(4) + 0.1, 0], [de(4) + 0.5, 1], [de(5) - 0.3, 1], [de(5), 0]]) }}>
      {rotulo("O MEDIDOR, NAS DUAS MENSAGENS DO CONDOMÍNIO")}
      {p.mensagens.map((m, i) => {
        const q = kf(t, [[de(4) + 0.5 + i * 1.2, 0], [de(4) + 1.1 + i * 1.2, 1]], suave);
        return <div key={m.nome} style={{ marginTop: 10, opacity: q }}>
          <div style={{ font: `700 ${M.fonte + 1}px ${ui}`, color: cor.texto }}>{m.nome} <span style={{ font: `${M.fonte}px ${ui}`, color: cor.fraco }}>· {m.leva}</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <div style={{ width: Math.max(12, (W * 0.5 * m.palavras * q) / maior), height: 10, borderRadius: 3, background: cor.linha, border: `1.5px solid ${cor.fraco}`, boxSizing: "border-box" }} />
            <span style={{ font: `${M.fonte}px ${ui}`, color: cor.fraco, whiteSpace: "nowrap" }}>{m.palavras} palavras</span>
          </div>
          {["com cache", "sem cache"].map((modo) => <div key={modo} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <span style={{ width: 78, font: `600 ${M.fonte}px ${ui}`, color: cor.texto }}>{modo}</span>{chip("pausa ?")}{chip("cada palavra ?")}
          </div>)}
        </div>;
      })}
    </div>
  );

  const alvoY = [CAIXA.y + CAIXA.h / 2, 172, 220, 200, 120, 90][k];
  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui }}>
      <Cabecalho M={M} f={F} k={k} />
      {k <= 4 ? <div style={{ opacity: montagem }}>{caixas}{k <= 2 ? fileira : null}{olha}{releituras}{gaveta}</div> : null}
      {k >= 4 ? medidor : null}
      {k === 5 ? <div style={{ position: "absolute", left: X, top: 52, width: W, opacity: kf(t, [[de(5) + 0.2, 0], [de(5) + 0.6, 1]]), font: `700 ${M.fonte + 9}px/1.3 ${ui}`, color: cor.texto }}>{F.fecho}</div> : null}
      <Resumos M={M} f={F} k={k} t={t} topo={k === 5 ? 150 : 270} />
      {k <= 3 ? <Ilustracao M={M} texto="ilustração: o tamanho das fileiras e das barras não é medido" opacidade={montagem} /> : null}
      <BalaoDaCena M={M} f={F} t={t} alvoY={alvoY} />
    </AbsoluteFill>
  );
};
