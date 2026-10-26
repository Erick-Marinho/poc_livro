/**
 * A animação da prova do substituto (Remotion; docs/capacidades/capitulo-2-em-cenas.md, etapa 4), que o leitor toca ou
 * rola (palco/RolaCena.tsx): as 20 perguntas com o gabarito; o decisor do capítulo 1, que passa tudo para a equipe,
 * responde uma por uma, e a régua marca ✓ ou ✗ e conta a nota de partida (a do baseline.py gravado); depois, o decisor
 * vira o grafo com o GPT-6 Luna, e o placar fica em "? de 20": a nota do agente é o palpite que o leitor investe na
 * IDE, logo depois. No modo "resultado", no 2.6, a mesma grade é a prova corrigida: o agente responde as 20 (a gravação),
 * a régua marca, e os balões apontam o padrão, um motivo e o R12. O que se desenha sai de prova.ts, montado do projeto real.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, kf, mono, ui } from "../palco/video";
import { Balao, type Desenho, entre, MEDIDAS, opacidadeDoBalao, type Ponto } from "./pecas";
import { type Alvo, baloes, baloesDoResultado, type Prova, T, T_RESULTADO } from "./prova.ts";

export type Props = { prova: Prova; desenho: Desenho; modo?: "prova" | "resultado"; motivo?: string; seguro?: string };

/** o que o agente decidiu, como a carta diz */
const DECIDIU: Record<string, string> = { responder: "respondeu", abrir_chamado: "abriu chamado", recusar: "recusou", passar: "passou a vez" };
/** o que devia ter decidido, curto, para caber na carta */
const DEVIA: Record<string, string> = { abrir_chamado: "chamado" };

const LUGAR = {
  largo: { decisor: { x: 20, y: 14, w: 450, h: 64 }, card: { w: 104, h: 70, px: 115, py: 76, x0: 20, y0: 90, id: 15, rot: 12 }, placar: { x: 20, y: 478, w: 450, h: 134 }, fonte: 17 },
  estreito: { decisor: { x: 14, y: 12, w: 392, h: 62 }, card: { w: 92, h: 66, px: 100, py: 72, x0: 14, y0: 86, id: 14, rot: 11.5 }, placar: { x: 14, y: 450, w: 392, h: 150 }, fonte: 16 },
};

export const ProvaAnimado: React.FC<Props> = ({ prova: p, desenho, modo = "prova", motivo = "", seguro = "" }) => {
  const M = MEDIDAS[desenho], L = LUGAR[desenho], C = L.card;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const resultado = modo === "resultado";
  const faixa = resultado ? T_RESULTADO.respostas : T.partida;
  const passo = (faixa[1] - faixa[0]) / p.total; // quanto leva cada resposta
  const respondeuEm = (i: number) => faixa[0] + i * passo;
  const naPartida = resultado || t < T.troca;
  const respondidas = naPartida ? p.questoes.filter((_, i) => t >= respondeuEm(i) + passo * 0.6) : [];
  const acertos = respondidas.filter((q) => q.certa).length;
  const grafo = resultado ? 1 : kf(t, [[T.troca, 0], [T.troca + 0.8, 1]]);
  const pergunta = !resultado && t >= T.pergunta;

  const lista = resultado ? baloesDoResultado(p, motivo, seguro) : baloes(p);
  const balao = lista.find((x) => entre(t, x.de, x.ate)) ?? null;
  const opaBalao = balao ? opacidadeDoBalao(t, balao.de, balao.ate, balao === lista[lista.length - 1]) : 0;
  const aponta = (al: Alvo) => balao?.alvo === al && opaBalao > 0.5;
  const alvoPonto = (al: Alvo): Ponto => al === "decisor" ? { x: L.decisor.x + L.decisor.w, y: L.decisor.y + L.decisor.h / 2 }
    : al === "placar" ? { x: L.placar.x + L.placar.w, y: L.placar.y + L.placar.h / 2 }
    : al.startsWith("card:") ? { x: C.x0 + 3 * C.px + C.w, y: C.y0 + Math.floor(p.questoes.findIndex((q) => q.id === al.slice(5)) / 4) * C.py + C.h / 2 }
    : { x: C.x0 + 3 * C.px + C.w, y: C.y0 + 2 * C.py + C.h / 2 };

  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui }}>
      {/* o decisor: o do capítulo 1, depois o grafo */}
      <div style={{ position: "absolute", left: L.decisor.x, top: L.decisor.y, width: L.decisor.w, height: L.decisor.h, boxSizing: "border-box", borderRadius: 14,
        border: `2.5px solid ${aponta("decisor") ? cor.acento : cor.linha}`, background: cor.papel, display: "grid", alignContent: "center", padding: "0 16px" }}>
        <span style={{ font: `700 ${L.fonte - 4}px ${mono}`, letterSpacing: ".06em", textTransform: "uppercase", color: cor.fraco }}>o decisor</span>
        <div style={{ display: "grid" }}>
          <span style={{ gridArea: "1 / 1", opacity: 1 - grafo, font: `600 ${L.fonte + 2}px ${ui}`, color: cor.texto }}>o do capítulo 1: sempre passa a vez</span>
          <span style={{ gridArea: "1 / 1", opacity: grafo, font: `600 ${L.fonte + 2}px ${ui}`, color: cor.acento }}>o grafo deste capítulo, com o GPT-6 Luna</span>
        </div>
      </div>

      {/* as 20 perguntas: o gabarito, e, na partida, o que o decisor respondeu */}
      {p.questoes.map((q, i) => {
        const x = C.x0 + (i % 4) * C.px, y = C.y0 + Math.floor(i / 4) * C.py;
        const aparece = kf(t, [[0.1 + i * 0.06, 0], [0.4 + i * 0.06, 1]]);
        const resp = naPartida && t >= respondeuEm(i) + passo * 0.6;
        const agora = naPartida && entre(t, respondeuEm(i), respondeuEm(i) + passo * 0.6);
        const veredito = resp ? (resultado ? 1 : kf(t, [[T.troca - 0.3, 1], [T.troca, 0]])) : 0;
        const destaque = aponta(`card:${q.id}`);
        const borda = agora || destaque ? cor.acento : resp ? (q.certa ? cor.ok : cor.aviso) : aponta("grade") ? cor.acento : cor.linha;
        return (
          <div key={q.id} style={{ position: "absolute", left: x, top: y, width: C.w, height: C.h, boxSizing: "border-box", borderRadius: 10, border: `${destaque ? 3 : 2}px solid ${borda}`,
            background: cor.papel, opacity: aparece, padding: "5px 7px", display: "grid", alignContent: "space-between",
            boxShadow: destaque ? `0 0 0 4px color-mix(in srgb, ${cor.acento} 22%, transparent)` : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b style={{ font: `700 ${C.id}px ${mono}`, color: cor.texto }}>{q.id}</b>
              <b style={{ font: `700 ${C.id}px ${ui}`, color: q.certa ? cor.ok : cor.aviso, opacity: veredito }}>{q.certa ? "✓" : "✗"}</b>
            </div>
            {resultado && resp ? (
              <span style={{ font: `600 ${C.rot}px/1.15 ${ui}`, color: q.certa ? cor.ok : cor.aviso }}>
                <span style={{ display: "block", whiteSpace: "nowrap" }}>{DECIDIU[q.decidiu!] ?? q.decidiu}</span>
                {q.certa ? null : <span style={{ display: "block", whiteSpace: "nowrap", fontWeight: 400, fontSize: C.rot - 1.5, letterSpacing: "-.02em", color: cor.fraco }}>devia: {DEVIA[q.gabarito] ?? q.rotulo}</span>}
              </span>
            ) : <span style={{ font: `500 ${C.rot}px/1.15 ${ui}`, color: cor.fraco }}>{q.rotulo}</span>}
          </div>
        );
      })}

      {/* o placar: a nota de partida, depois a pergunta */}
      <div style={{ position: "absolute", left: L.placar.x, top: L.placar.y, width: L.placar.w, minHeight: L.placar.h, boxSizing: "border-box", borderRadius: 14, padding: "10px 16px",
        border: `2px solid ${aponta("placar") ? cor.acento : cor.linha}`, background: cor.papel, display: "grid", gap: 8, alignContent: "center" }}>
        <span style={{ font: `700 ${L.fonte - 4}px ${mono}`, letterSpacing: ".06em", textTransform: "uppercase", color: cor.fraco }}>o placar da régua</span>
        <div style={{ font: `700 ${L.fonte + 9}px ${ui}`, color: pergunta ? cor.acento : cor.texto }}>
          {naPartida ? `${acertos} de ${p.total}${respondidas.length === p.total ? ` (${p.porcento}%)` : ""}` : pergunta ? `? de ${p.total}` : `… de ${p.total}`}
        </div>
        {/* a barra: uma casa por acerto, enchendo da esquerda, e a marca da nota de partida */}
        <div style={{ position: "relative", display: "flex", gap: 3 }}>
          {p.questoes.map((q, i) => (
            <span key={q.id} style={{ flex: 1, height: 12, borderRadius: 3, background: naPartida && i < acertos ? cor.ok : cor.linha }} />
          ))}
          <span style={{ position: "absolute", left: `${(p.partida.acertos / p.total) * 100}%`, top: -6, bottom: -6, width: 2, background: cor.texto, opacity: naPartida && respondidas.length < p.total ? 0 : 1 }} />
        </div>
        <span style={{ font: `${L.fonte - 2}px ${ui}`, color: cor.fraco, opacity: naPartida && respondidas.length < p.total ? 0 : 1 }}>
          a marca: a nota de partida, {p.partida.acertos} de {p.total} ({p.partida.porcento}%){pergunta ? ": é ela que o agente tem de bater" : ""}
        </span>
      </div>

      {balao ? (
        <>
          {M.balao.lado ? <svg width={M.w} height={M.h} style={{ position: "absolute", inset: 0 }}>
            <line x1={alvoPonto(balao.alvo).x + 6} y1={alvoPonto(balao.alvo).y} x2={M.balao.x} y2={alvoPonto(balao.alvo).y} stroke={cor.acento} strokeWidth={2} strokeDasharray="5 4" opacity={opaBalao} />
          </svg> : null}
          <Balao M={M} alvo={alvoPonto(balao.alvo)} opacidade={opaBalao}>{balao.texto}</Balao>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
