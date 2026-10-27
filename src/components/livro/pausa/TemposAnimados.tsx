/**
 * Os tempos de verdade (Remotion; docs/capacidades/pausa-e-fluxo-revisao.md, etapa 3), que o leitor toca ou rola: uma
 * faixa por mensagem, cinza enquanto o modelo lê e azul enquanto escreve, e um cursor que corre no relógio da coleta
 * (tocando, em tempo real). Depois, a longa pedida de novo, ao lado da sombra da longa. Os números vêm de tempos.ts.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, kf, mono, ui } from "../palco/video";
import { DE_NOVO, EIXO, fimDe, legendas, type Linha, porSegundo, segundos, type Tempos } from "./tempos.ts";

export type Desenho = "largo" | "estreito";
export const MEDIDAS = {
  largo: { w: 780, h: 400, x0: 170, x1: 760, topo: 64, faixa: 26, passo: 62, rotulo: 150, fonte: 13 },
  estreito: { w: 420, h: 560, x0: 14, x1: 406, topo: 72, faixa: 24, passo: 92, rotulo: 392, fonte: 13 },
} as const;

export const TemposAnimados: React.FC<{ tempos: Tempos; desenho: Desenho }> = ({ tempos: T, desenho }) => {
  const M = MEDIDAS[desenho];
  const t = useCurrentFrame() / useVideoConfig().fps;
  const largo = desenho === "largo";
  const x = (s: number) => M.x0 + (Math.min(s, EIXO) / EIXO) * (M.x1 - M.x0);
  const cena2 = t >= DE_NOVO;
  const agora = cena2 ? t - DE_NOVO : Math.min(t, EIXO);
  const legenda = legendas(T).find((l) => t >= l.de && t < l.ate) ?? legendas(T).at(-1)!;

  const Faixa = ({ l, y, relogio, sombra }: { l: Linha; y: number; relogio: number; sombra?: boolean }) => {
    const fim = fimDe(T, l);
    const lendo = Math.min(relogio, l.pausa), escrevendo = Math.max(0, Math.min(relogio, fim) - l.pausa);
    const escritos = Math.min(l.escritos, Math.floor(escrevendo * l.fluxo));
    const op = sombra ? 0.28 : 1;
    const ty = largo ? y : y + 22;
    return <div style={{ position: "absolute", inset: 0, opacity: op }}>
      <div style={{ position: "absolute", left: largo ? 14 : M.x0, top: largo ? y + 3 : y, width: M.rotulo, font: `600 ${M.fonte + 1}px ${ui}`, color: cor.texto }}>
        {l.rotulo} <span style={{ font: `${M.fonte - 1}px ${mono}`, color: cor.fraco }}>· {l.palavras} palavras</span>
      </div>
      <div style={{ position: "absolute", left: x(0), top: ty, width: x(EIXO) - x(0), height: M.faixa, borderRadius: 6, background: cor.papel, border: `1px solid ${cor.linha}` }} />
      <div style={{ position: "absolute", left: x(0), top: ty, width: Math.max(2, x(lendo) - x(0)), height: M.faixa, borderRadius: 6, background: cor.fraco, opacity: 0.45 }} />
      {escrevendo > 0 ? <div style={{ position: "absolute", left: x(l.pausa), top: ty, width: Math.max(2, x(l.pausa + escrevendo) - x(l.pausa)), height: M.faixa, borderRadius: 6, background: cor.acento }} /> : null}
      {relogio >= l.pausa ? <div style={{ position: "absolute", left: x(l.pausa) - 1, top: ty - 5, width: 2, height: M.faixa + 10, background: cor.texto }} /> : null}
      {relogio >= l.pausa ? <div style={{ position: "absolute", ...(x(l.pausa) > (M.x0 + M.x1) / 2 ? { right: M.w - x(l.pausa) + 6, textAlign: "right" as const } : { left: x(l.pausa) + 6 }), top: ty + M.faixa + 3, font: `600 ${M.fonte}px ${ui}`, color: cor.texto, whiteSpace: "nowrap" }}>
        primeira palavra em {segundos(l.pausa)}{relogio >= fim ? <span style={{ color: cor.fraco, fontWeight: 400 }}> · {porSegundo(l.fluxo)}</span> : <span style={{ color: cor.fraco, fontWeight: 400 }}> · {escritos} de {l.escritos} tokens</span>}
      </div> : relogio > 0.15 ? <div style={{ position: "absolute", left: x(lendo) + 6, top: ty + 5, font: `italic ${M.fonte}px ${ui}`, color: cor.fraco, whiteSpace: "nowrap" }}>lendo {l.le} tokens…</div> : null}
    </div>;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui }}>
      <div style={{ position: "absolute", left: 14, top: 14, font: `700 13px ${mono}`, letterSpacing: ".06em", textTransform: "uppercase", color: cor.acento }}>
        {cena2 ? "2 de 2 · a longa, de novo" : "1 de 2 · as três mensagens"}
      </div>
      <div style={{ position: "absolute", right: 14, top: 10, font: `700 20px ${mono}`, color: cor.texto }}>{segundos(agora)}</div>
      {!cena2 ? T.linhas.map((l, i) => <Faixa key={l.caso} l={l} y={M.topo + i * M.passo} relogio={agora} />) : <>
        <Faixa l={T.linhas[2]} y={M.topo} relogio={EIXO} sombra />
        <Faixa l={T.deNovo} y={M.topo + M.passo} relogio={agora} />
      </>}
      {/* o eixo e o cursor do relógio */}
      <div style={{ position: "absolute", left: x(0), top: M.topo + 3 * M.passo + (largo ? 2 : 12), width: x(EIXO) - x(0), height: 1, background: cor.linha }} />
      {[0, 5, 10, 15].map((s) => <div key={s} style={{ position: "absolute", left: x(s) - 20, top: M.topo + 3 * M.passo + (largo ? 6 : 16), width: 40, textAlign: "center", whiteSpace: "nowrap", font: `11px ${mono}`, color: cor.fraco }}>{s} s</div>)}
      <div style={{ position: "absolute", left: x(agora) - 1, top: M.topo - 8, width: 2, height: 3 * M.passo + (largo ? 8 : 18), background: cor.acento, opacity: kf(agora, [[0, 0.4], [0.2, 0.9]]) }} />
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, font: `${largo ? 17 : 16}px/1.4 ${ui}`, color: cor.texto,
        opacity: kf(t, [[legenda.de, 0], [legenda.de + 0.4, 1]]) }}>{legenda.texto}</div>
    </AbsoluteFill>
  );
};
