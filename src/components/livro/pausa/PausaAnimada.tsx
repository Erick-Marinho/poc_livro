/**
 * A pausa e o fluxo (Remotion; docs/capacidades/experimento-pausa-e-fluxo.md, etapa 5), que o leitor toca ou rola
 * (palco/RolaCena.tsx). O desenho se monta inteiro à vista, uma coisa por vez: a mensagem chega e o modelo lê (a barra
 * "lê" cresce na linha do tempo); a primeira palavra fecha a pausa; os outros pedaços saem no mesmo compasso, um tique
 * por pedaço; a chave do fluxo abraça os tiques; o medidor mostra as três mensagens; e só a pergunta fica. O que já
 * passou vira uma linha de resumo. Os tempos e os textos saem de pausa.ts; o tamanho das barras é ilustração.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, kf, mono, suave, ui } from "../palco/video";
import { Balao, entre, opacidadeDoBalao } from "../roteiro/pecas";
import { baloes, CENAS, PERGUNTA, type Pausa, pedacoEm, RESUMOS } from "./pausa.ts";

export type Desenho = "largo" | "estreito";
export const MEDIDAS = {
  largo: { w: 780, h: 416, x: 20, aw: 460, fonte: 13, balao: { lado: true, x: 500, w: 264, y: 0, fonte: 17 } },
  estreito: { w: 420, h: 520, x: 14, aw: 392, fonte: 12, balao: { lado: false, x: 14, w: 392, y: 418, fonte: 17 } },
} as const;

export type Props = { pausa: Pausa; desenho: Desenho };

const rotulo = (texto: string) => <div style={{ font: `600 10.5px ${mono}`, letterSpacing: ".05em", color: cor.fraco }}>{texto}</div>;

export const PausaAnimada: React.FC<Props> = ({ pausa: p, desenho }) => {
  const M = MEDIDAS[desenho];
  const t = useCurrentFrame() / useVideoConfig().fps;
  const k = CENAS.reduce((i, c, j) => (t >= c.de ? j : i), 0);
  const de = (j: number) => CENAS[j].de;

  /* a geometria: três caixas numa linha (a mensagem, o modelo, a resposta) e a linha do tempo embaixo */
  const X = M.x, W = M.aw;
  const caixa = { y: 40, h: 108 };
  const msg = { x: X, w: W * 0.29 }, modelo = { x: X + W * 0.34, w: W * 0.22 }, resp = { x: X + W * 0.61, w: W * 0.39 };
  const linha = { y: 184 };
  const fimLe = X + W * 0.36;
  const passo = (X + W - 12 - fimLe) / (p.resposta.length - 1);
  const tique = (i: number) => fimLe + i * passo;

  /* os tempos de cada coisa */
  const le = kf(t, [[0.9, 0], [3.9, 1]], suave);
  const escritos = p.resposta.filter((_, i) => t >= pedacoEm(i)).length;
  const lendo = t >= 0.6 && escritos === 0;
  const estado = escritos === 0 ? (lendo ? "lendo" + ".".repeat(1 + (Math.floor(t * 3) % 3)) : "") : k === 1 ? "leu ✓" : escritos < p.resposta.length ? "escrevendo" : "terminou";
  const chave = (de0: number) => kf(t, [[de0, 0], [de0 + 0.6, 1]], suave);
  const montagem = kf(t, [[de(4) - 0.3, 1], [de(4), 0]]);
  const medidor = kf(t, [[de(4) + 0.1, 0], [de(4) + 0.5, 1], [de(5) - 0.3, 1], [de(5), 0]]);
  const pergunta = kf(t, [[de(5) + 0.2, 0], [de(5) + 0.6, 1]]);

  const lista = baloes();
  const balao = lista.find((b) => entre(t, b.de, b.ate)) ?? null;
  const opaBalao = balao ? opacidadeDoBalao(t, balao.de, balao.ate, balao === lista[lista.length - 1]) : 0;
  const alvoY = [caixa.y + caixa.h / 2, linha.y + 20, caixa.y + caixa.h / 2, linha.y + 40, 120, 90][k];
  const alvo = { x: X + W, y: alvoY };

  const Caixa = ({ x, w, titulo, acesa, children }: { x: number; w: number; titulo: string; acesa: boolean; children: React.ReactNode }) => (
    <div style={{ position: "absolute", left: x, top: caixa.y, width: w, height: caixa.h, boxSizing: "border-box", padding: "6px 8px", borderRadius: 12,
      border: `2px solid ${acesa ? cor.acento : cor.linha}`, background: cor.papel, overflow: "hidden" }}>
      {rotulo(titulo)}
      <div style={{ marginTop: 4 }}>{children}</div>
    </div>
  );
  const seta = (x1: number, x2: number, acesa: boolean) => (
    <div style={{ position: "absolute", left: x1 + 3, top: caixa.y + caixa.h / 2 - 9, width: x2 - x1 - 6, textAlign: "center", font: `700 15px ${ui}`, color: acesa ? cor.acento : cor.linha }}>→</div>
  );

  /* uma chave embaixo de um trecho da linha do tempo, com o nome */
  const Chave = ({ x1, x2, nome, de0 }: { x1: number; x2: number; nome: string; de0: number }) => {
    const q = chave(de0);
    return <div style={{ position: "absolute", left: x1, top: linha.y + 34, width: x2 - x1, opacity: q }}>
      <div style={{ height: 8, borderLeft: `2px solid ${cor.acento}`, borderRight: `2px solid ${cor.acento}`, borderBottom: `2px solid ${cor.acento}`, borderRadius: "0 0 6px 6px",
        transform: `scaleX(${0.4 + 0.6 * q})` }} />
      <div style={{ textAlign: "center", marginTop: 3, font: `700 ${M.fonte + 1}px ${ui}`, color: cor.acento, whiteSpace: "nowrap" }}>{nome}</div>
    </div>;
  };

  const montado = (
    <div style={{ opacity: montagem }}>
      <div style={{ opacity: kf(t, [[0.1, 0], [0.5, 1]]) }}>
        <Caixa x={msg.x} w={msg.w} titulo="A MENSAGEM" acesa={k === 0}>
          <div style={{ font: `${M.fonte}px/1.35 ${ui}`, color: cor.texto }}>Pergunta: {p.pergunta}</div>
        </Caixa>
      </div>
      {seta(msg.x + msg.w, modelo.x, lendo)}
      <Caixa x={modelo.x} w={modelo.w} titulo="O MODELO" acesa={t >= 0.6 && escritos < p.resposta.length}>
        <div style={{ font: `600 ${M.fonte + 1}px ${ui}`, color: lendo ? cor.acento : cor.texto }}>{estado}</div>
      </Caixa>
      {seta(modelo.x + modelo.w, resp.x, escritos > 0 && escritos < p.resposta.length)}
      <Caixa x={resp.x} w={resp.w} titulo="A RESPOSTA" acesa={escritos > 0 && escritos < p.resposta.length}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 5px", font: `600 ${M.fonte + 1}px ${mono}`, color: cor.texto }}>
          {p.resposta.slice(0, escritos).map((pd, i) => <span key={i} style={{ opacity: kf(t, [[pedacoEm(i), 0], [pedacoEm(i) + 0.25, 1]]) }}>{pd}</span>)}
          {escritos < p.resposta.length ? <span style={{ color: cor.acento, opacity: Math.floor(t * 2.5) % 2 ? 0.2 : 1 }}>▌</span> : null}
        </div>
      </Caixa>

      {/* a linha do tempo */}
      <div style={{ position: "absolute", left: X, top: linha.y - 18, font: `600 10.5px ${mono}`, color: cor.fraco, letterSpacing: ".05em" }}>O TEMPO →</div>
      <div style={{ position: "absolute", left: X, top: linha.y + 8, width: W, height: 2, background: cor.linha }} />
      <div style={{ position: "absolute", left: X, top: linha.y + 1, width: (fimLe - X) * le, height: 16, borderRadius: 4, background: "color-mix(in srgb, var(--acento, #2a4fb5) 22%, transparent)",
        border: le > 0 ? `1.5px solid ${cor.acento}` : "none", boxSizing: "border-box", font: `700 11px ${ui}`, color: cor.acento, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>{le > 0.3 ? "lê" : ""}</div>
      {p.resposta.map((_, i) => t >= pedacoEm(i) ? <div key={i} style={{ position: "absolute", left: tique(i) - (i ? 1.5 : 6), top: linha.y + (i ? 0 : 3), width: i ? 3 : 12, height: i ? 18 : 12,
        borderRadius: i ? 2 : 6, background: i ? cor.texto : cor.acento, opacity: kf(t, [[pedacoEm(i), 0], [pedacoEm(i) + 0.2, 1]]) }} /> : null)}
      <div style={{ position: "absolute", left: fimLe + 10, top: linha.y - 18, font: `600 ${M.fonte}px ${ui}`, color: cor.acento, opacity: kf(t, [[pedacoEm(0), 0], [pedacoEm(0) + 0.3, 1], [de(2), 1], [de(2) + 0.3, 0]]) }}>
        a primeira palavra
      </div>
      {t >= de(1) + 0.9 ? <Chave x1={X} x2={fimLe} nome="pausa" de0={de(1) + 0.9} /> : null}
      {t >= de(3) + 0.4 ? <Chave x1={fimLe} x2={tique(p.resposta.length - 1)} nome="fluxo: pedaços ÷ segundos" de0={de(3) + 0.4} /> : null}
    </div>
  );

  /* o medidor: as três mensagens, com o tamanho do que cada uma leva; o resultado fica para depois */
  const maior = Math.max(...p.mensagens.map((m) => m.palavras));
  const barraMax = W * 0.36;
  const medicao = (
    <div style={{ position: "absolute", left: X, top: 40, width: W, opacity: medidor }}>
      {rotulo("O MEDIDOR, NAS TRÊS MENSAGENS DA LOJA")}
      {p.mensagens.map((m, i) => {
        const q = kf(t, [[de(4) + 0.5 + i * 0.6, 0], [de(4) + 1.1 + i * 0.6, 1]], suave);
        return <div key={m.nome} style={{ marginTop: 10, opacity: q }}>
          <div style={{ font: `700 ${M.fonte + 1}px ${ui}`, color: cor.texto }}>{m.nome} <span style={{ font: `${M.fonte}px ${ui}`, color: cor.fraco }}>· {m.leva}</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <div style={{ width: Math.max(6, (barraMax * m.palavras * q) / maior), height: 12, borderRadius: 3, background: cor.linha, border: `1.5px solid ${cor.fraco}`, boxSizing: "border-box" }} />
            <span style={{ font: `${M.fonte}px ${ui}`, color: cor.fraco, opacity: q, whiteSpace: "nowrap" }}>{m.palavras} palavras</span>
            <span style={{ flex: 1 }} />
            {["pausa ?", "fluxo ?"].map((s) => <span key={s} style={{ font: `700 ${M.fonte}px ${mono}`, color: cor.acento, border: `1.5px dashed ${cor.acento}`, borderRadius: 6, padding: "1px 6px", whiteSpace: "nowrap" }}>{s}</span>)}
          </div>
        </div>;
      })}
    </div>
  );

  /* o que fica de cada cena, embaixo, uma linha por vez */
  const resumos = (
    <div style={{ position: "absolute", left: X, top: k === 5 ? 150 : 270, width: W }}>
      {RESUMOS.map((r, i) => t >= de(i + 1) ? <div key={i} style={{ font: `${M.fonte + (k === 5 ? 2 : 0)}px/1.7 ${ui}`, color: k === 5 ? cor.texto : cor.fraco,
        opacity: kf(t, [[de(i + 1), 0], [de(i + 1) + 0.4, 1]]) }}><span style={{ color: cor.ok, fontWeight: 700 }}>✓</span> {r}</div> : null)}
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui }}>
      <div style={{ position: "absolute", left: X, top: 12, width: W, font: `700 13px ${mono}`, letterSpacing: ".06em", textTransform: "uppercase", color: cor.acento }}>
        {k + 1} de {CENAS.length} · {CENAS[k].nome}
      </div>
      {k <= 4 ? montado : null}
      {k >= 4 ? medicao : null}
      {k === 5 ? <div style={{ position: "absolute", left: X, top: 52, width: W, opacity: pergunta, font: `700 ${M.fonte + 9}px/1.3 ${ui}`, color: cor.texto }}>{PERGUNTA}</div> : null}
      {resumos}
      {k <= 3 ? <div style={{ position: "absolute", left: X, top: M.balao.lado ? M.h - 22 : M.balao.y - 22, width: W, font: `italic 11px ${ui}`, color: cor.fraco, opacity: montagem }}>ilustração: a linha do tempo não é medida</div> : null}
      {balao && M.balao.lado ? <svg width={M.w} height={M.h} style={{ position: "absolute", inset: 0 }}>
        <line x1={X + W + 6} y1={alvo.y} x2={M.balao.x} y2={alvo.y} stroke={cor.acento} strokeWidth={2} strokeDasharray="5 4" opacity={opaBalao} />
      </svg> : null}
      {balao ? <Balao M={M as never} alvo={alvo} opacidade={opaBalao}>{balao.texto}</Balao> : null}
    </AbsoluteFill>
  );
};

