/**
 * A animação do mapa do ciclo (Remotion; docs/capacidades/ciclo-animado.md): os quatro problemas da aposta andando pelo
 * anel até a fase que pega cada um, com a aposta do leitor ao lado. É o mesmo desenho do mapa parado (Anel.tsx), com
 * os problemas por cima, nas mesmas coordenadas. Cor com sentido fixo (docs/RITMO.md): acento é o que anda agora,
 * âmbar é o que falhou, verde é o que foi pego. O leitor avança cena a cena (a ilha, FiguraCiclo.tsx); o último quadro
 * é o do modo direto. O Studio do my-video importa esta composição.
 */
import { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import Anel, { type Caixa, caixas, type Desenho, ESTILO, type Realce, VISTA } from "./Anel";
import { type Cena, cenaEm, type Entrada, faseAcesa, montarCenas } from "./cenas";

export type Props = Entrada & { desenho: Desenho; apostas?: (number | null)[] };

const TOPO = 56; // a pergunta
const FAIXA: Record<Desenho, number> = { anel: 124, coluna: 156 }; // a legenda e o resultado
export const tamanho = (desenho: Desenho) => ({ w: VISTA[desenho].w, h: TOPO + VISTA[desenho].h + FAIXA[desenho] });

const ui = 'var(--f-ui, "IBM Plex Sans", system-ui, sans-serif)';
const cor = { texto: "var(--ink, #24201a)", fraco: "var(--ink-2, #6b6357)", acento: "var(--acento, #2a4fb5)", ok: "var(--ok, #1f7a4c)", aviso: "var(--aviso, #9a5b00)", papel: "var(--papel, #f6f2ea)", nota: "var(--nota, #fbf8f2)" };

const suave = Easing.bezier(0.45, 0, 0.2, 1);
const kf = (t: number, pontos: [number, number][], easing = Easing.linear) =>
  interpolate(t, pontos.map((p) => p[0]), pontos.map((p) => p[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// a etiqueta do problema fica logo abaixo da caixa da fase, sem tampar o nome nem o capítulo
const ancora = (c: Caixa) => ({ x: c.x + c.w / 2, y: c.y + c.h + 15 });

// onde a etiqueta está num momento da cena: parada numa fase, ou entre duas
const posicao = (passos: { fase: string; em: number }[], v: number, cx: Record<string, Caixa>) => {
  const i = Math.max(0, passos.filter((p) => p.em <= v).length - 1);
  const a = ancora(cx[passos[i].fase]);
  const prox = passos[i + 1];
  if (!prox) return a;
  const b = ancora(cx[prox.fase]);
  const k = kf(v, [[passos[i].em + 0.1, 0], [prox.em, 1]], suave);
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
};

const Etiqueta = ({ x, y, texto, borda, fantasma, opacidade = 1, largura }: { x: number; y: number; texto: string; borda: string; fantasma?: boolean; opacidade?: number; largura: number }) => {
  const w = texto.length * 7.1 + 24;
  // dentro do desenho, mesmo perto da borda
  const cx = Math.min(Math.max(x, w / 2 + 4), largura - w / 2 - 4);
  return (
    <g opacity={opacidade} transform={`translate(${cx} ${y})`}>
      <rect x={-w / 2} y={-13} width={w} height={26} rx={13} fill={fantasma ? "none" : cor.papel} stroke={borda} strokeWidth={2} strokeDasharray={fantasma ? "4 3" : undefined} />
      <text x={0} y={5} textAnchor="middle" style={{ font: `600 13px ${ui}`, fill: fantasma ? borda : cor.texto }}>{texto}</text>
    </g>
  );
};

export const CicloAnimado: React.FC<Props> = ({ ciclo, cenas, aposta, desenho, apostas }) => {
  const m = useMemo(() => montarCenas({ ciclo, cenas, aposta }), [ciclo, cenas, aposta]);
  const cx = useMemo(() => caixas(desenho), [desenho]);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { k, cena, v } = cenaEm(m, t);
  const vista = VISTA[desenho];
  const coluna = desenho === "coluna";

  // as fases já pegas (verde), e a que falhou na cena de agora (âmbar)
  const realces: Record<string, Realce> = {};
  m.cenas.forEach((c, j) => {
    if (!c.pega) return;
    const pegaEm = c.ida[c.ida.length - 1].em;
    if (j < k || (j === k && v >= pegaEm)) realces[c.pega.id] = "pego";
    if (j === k && c.falha && v >= (c.ida.find((x) => x.fase === c.falha)?.em ?? Infinity) && v < pegaEm) realces[c.falha] = "erro";
  });
  const chave = m.cenas.findIndex((c) => c.chave);

  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui }}>
      <style>{`${ESTILO} .ca-anel svg { display: block; width: 100%; height: auto }`}</style>
      <div style={{ height: TOPO, display: "flex", alignItems: "center", padding: "0 20px", font: `600 ${coluna ? 17 : 20}px ${ui}`, color: cor.texto }}>
        {m.pergunta}
      </div>
      {/* o desenho, e por cima, nas mesmas coordenadas, os problemas andando */}
      <div className="ca-anel" style={{ position: "absolute", left: 0, top: TOPO, width: vista.w, height: vista.h }}>
        <Anel fases={ciclo.fases} desenho={desenho} aceso={faseAcesa(m, t)} realces={realces} governar={!!cena.governar} prefixo={`video-${desenho}`} />
      </div>
      <svg viewBox={`0 0 ${vista.w} ${vista.h}`} width={vista.w} height={vista.h} style={{ position: "absolute", left: 0, top: TOPO, pointerEvents: "none" }}>
        {/* o caso novo da régua, que o momento-chave deixa em Avaliar */}
        {chave >= 0 && m.cenas[chave].volta.length && (k > chave || (k === chave && v >= m.cenas[chave].volta[m.cenas[chave].volta.length - 1].em)) ? (
          <Etiqueta x={ancora(cx.avaliar).x} y={cx.avaliar.y - 15} texto="+1 caso da régua" borda={cor.ok} largura={vista.w}
            opacidade={k > chave ? 1 : kf(v, [[m.cenas[chave].volta[m.cenas[chave].volta.length - 1].em, 0], [m.cenas[chave].volta[m.cenas[chave].volta.length - 1].em + 0.3, 1]])} />
        ) : null}
        {m.cenas.map((c, j) => {
          if (!c.pega || j > k || !c.rotulo) return null;
          const pegaEm = c.ida[c.ida.length - 1].em;
          if (j < k) { const a = ancora(cx[c.pega.id]); return <Etiqueta key={j} x={a.x} y={a.y} texto={c.rotulo} borda={cor.ok} largura={vista.w} />; }
          const p = posicao(c.ida, v, cx);
          const falhou = c.falha && v >= (c.ida.find((x) => x.fase === c.falha)?.em ?? Infinity);
          const borda = v >= pegaEm ? cor.ok : falhou ? cor.aviso : cor.acento;
          // a volta: um fantasma sai da fase que pegou e percorre o resto do caminho
          const fantasma = c.volta.length && v >= pegaEm + 0.4 ? posicao([{ fase: c.pega.id, em: pegaEm + 0.6 }, ...c.volta], v, cx) : null;
          const fimDaVolta = c.volta.length ? c.volta[c.volta.length - 1].em : 0;
          return (
            <g key={j}>
              {fantasma ? <Etiqueta x={fantasma.x} y={fantasma.y} texto={c.rotulo} borda={cor.aviso} fantasma largura={vista.w}
                opacidade={kf(v, [[pegaEm + 0.4, 0], [pegaEm + 0.6, 1], [fimDaVolta, 1], [fimDaVolta + 0.4, 0]])} /> : null}
              <Etiqueta x={p.x} y={p.y} texto={c.rotulo} borda={borda} largura={vista.w} opacidade={kf(v, [[c.ida[0].em - 0.3, 0], [c.ida[0].em, 1]])} />
            </g>
          );
        })}
      </svg>
      <Faixa cena={cena} v={v} apostas={apostas} aposta={aposta} coluna={coluna} top={TOPO + vista.h} />
    </AbsoluteFill>
  );
};

// a legenda da cena e, depois que o problema é pego, quem pegou e o que o leitor apostou
const Faixa = ({ cena, v, apostas, aposta, coluna, top }: { cena: Cena; v: number; apostas?: (number | null)[]; aposta: Entrada["aposta"]; coluna: boolean; top: number }) => {
  const pegaEm = cena.ida.length ? cena.ida[cena.ida.length - 1].em : Infinity;
  const m = cena.problema !== undefined ? aposta.mensagens[cena.problema] : undefined;
  const escolha = cena.problema !== undefined ? apostas?.[cena.problema] : undefined;
  const acertou = m && escolha !== undefined && escolha !== null && escolha === m.fez;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, padding: coluna ? "6px 16px" : "8px 24px", display: "grid", gap: 8, alignContent: "start" }}>
      <div style={{ font: `${coluna ? 16 : 19}px/1.35 ${ui}`, color: cor.texto, opacity: kf(v, [[0, 0], [0.4, 1]]) }}>{cena.legenda}</div>
      {cena.pega && m ? (
        <div style={{ font: `${coluna ? 14 : 16}px/1.4 ${ui}`, color: cor.fraco, opacity: kf(v, [[pegaEm + 0.2, 0], [pegaEm + 0.6, 1]]) }}>
          Capturado em: <b style={{ color: cor.ok }}>{cena.pega.nome}</b> <span>· cap. {cena.pega.capitulos.join(" e ")}</span>
          {" · "}
          {escolha === undefined || escolha === null ? "você não apostou" : (
            <>você apostou: <b style={{ color: acertou ? cor.ok : cor.aviso }}>{m.opcoes[escolha]} {acertou ? "✓" : "✗"}</b></>
          )}
        </div>
      ) : null}
    </div>
  );
};

/** As medidas do vídeo de cada desenho. */
export function quadroDoCiclo(props: Entrada, desenho: Desenho) {
  const m = montarCenas(props);
  const { w, h } = tamanho(desenho);
  return { fps: 30, largura: w, altura: h, duracao: m.quadros };
}
