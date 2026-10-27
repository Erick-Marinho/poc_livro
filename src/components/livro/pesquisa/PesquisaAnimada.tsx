/**
 * O vídeo da pesquisa sobre agentes em produção (Remotion; docs/capacidades/agentes-no-mundo.md, etapa 3), que o
 * leitor toca ou rola (palco/RolaCena.tsx). Em cada cena, o número sobe e a grade de 40 quadradinhos acende a parte
 * dele; nas três do meio, aparece a fase do livro que trata daquele problema; na última, os três lado a lado, com o
 * capítulo de cada um. Os balões explicam. O que se desenha sai de pesquisa.ts.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, kf, mono, suave, ui } from "../palco/video";
import { Balao, entre, opacidadeDoBalao, type Ponto } from "../roteiro/pecas";
import { baloes, CENAS, type Pesquisa, pct, QUADROS, acesos as quantos } from "./pesquisa.ts";

export type Desenho = "largo" | "estreito";
export const MEDIDAS = {
  largo: { w: 780, h: 380, x: 20, aw: 460, q: 34, gap: 6, balao: { lado: true, x: 500, w: 264, y: 0, fonte: 17 } },
  estreito: { w: 420, h: 590, x: 14, aw: 392, q: 31, gap: 5, balao: { lado: false, x: 14, w: 392, y: 380, fonte: 17 } },
} as const;

export type Props = { pesquisa: Pesquisa; desenho: Desenho };

export const PesquisaAnimada: React.FC<Props> = ({ pesquisa: p, desenho }) => {
  const M = MEDIDAS[desenho];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const k = CENAS.reduce((i, c, j) => (t >= c.de ? j : i), 0);
  const t0 = CENAS[k].de;
  const fim = k === CENAS.length - 1;

  /* o número da cena e a cor dela: o contexto em azul, o problema em laranja, o que poucos conseguem em verde */
  const atual = k === 0 ? { valor: p.operam, rotulo: `operam ao menos um agente; ${pct(p.dez)}, mais de dez`, cor: cor.acento }
    : !fim ? { valor: p.problemas[k - 1].valor, rotulo: p.problemas[k - 1].rotulo, cor: k === 1 ? cor.aviso : cor.ok } : null;
  const sobe = kf(t, [[t0 + 0.3, 0], [t0 + 1.6, 1]], suave);
  const entra = kf(t, [[t0, 0], [t0 + 0.4, 1]]);

  const lista = baloes(p);
  const balao = lista.find((x) => entre(t, x.de, x.ate)) ?? null;
  const opaBalao = balao ? opacidadeDoBalao(t, balao.de, balao.ate, balao === lista[lista.length - 1]) : 0;
  /* ao lado, no meio do vídeo: o balão mais longo cabe sem ser cortado */
  const alvo: Ponto = { x: M.x + M.aw, y: M.h / 2 };

  const grade = () => {
    const n = atual ? quantos(atual.valor) : 0;
    const lado = (M.aw - 9 * M.gap) / 10;
    const q = Math.min(M.q, lado);
    return <div style={{ position: "absolute", left: M.x, top: 162, width: M.aw, display: "grid", gridTemplateColumns: `repeat(10, ${q}px)`, gap: M.gap }}>
      {Array.from({ length: QUADROS }, (_, i) => {
        const aceso = atual && i < Math.round(n * sobe);
        return <div key={i} style={{ width: q, height: q, borderRadius: 6, boxSizing: "border-box", border: `1.5px solid ${aceso ? atual.cor : cor.linha}`,
          background: aceso ? atual.cor : cor.papel }} />;
      })}
    </div>;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui }}>
      <div style={{ position: "absolute", left: M.x, top: 12, width: M.aw, font: `700 13px ${mono}`, letterSpacing: ".06em", textTransform: "uppercase", color: cor.acento }}>
        {k + 1} de {CENAS.length} · {CENAS[k].nome}
      </div>

      {atual && <div style={{ opacity: entra }}>
        <div style={{ position: "absolute", left: M.x, top: 40, display: "flex", alignItems: "baseline", gap: 14, width: M.aw }}>
          <b style={{ font: `700 ${desenho === "largo" ? 52 : 46}px/1 ${mono}`, color: atual.cor, minWidth: desenho === "largo" ? 170 : 150 }}>{pct(Math.round(atual.valor * sobe * 10) / 10)}</b>
        </div>
        <div style={{ position: "absolute", left: M.x, top: 100, width: M.aw, font: `500 ${desenho === "largo" ? 17 : 16}px/1.35 ${ui}`, color: cor.texto }}>{atual.rotulo}</div>
        {grade()}
        {k > 0 && <div style={{ position: "absolute", left: M.x, top: 162 + 4 * (M.q + M.gap) + 8, font: `600 15px ${ui}`, color: cor.fraco, opacity: kf(t, [[t0 + 1.8, 0], [t0 + 2.2, 1]]) }}>
          no livro: <b style={{ color: cor.ok }}>{p.problemas[k - 1].fase}</b>, capítulo {p.problemas[k - 1].capitulo}: {p.problemas[k - 1].como}
        </div>}
      </div>}

      {fim && <div style={{ opacity: entra }}>
        {p.problemas.map((x, j) => {
          const aparece = kf(t, [[t0 + 0.3 + j * 0.5, 0], [t0 + 0.7 + j * 0.5, 1]]);
          return <div key={x.id} style={{ position: "absolute", left: M.x, top: 48 + j * 92, width: M.aw, height: 80, boxSizing: "border-box", borderRadius: 12,
            border: `2px solid ${cor.linha}`, background: cor.papel, padding: "8px 12px", opacity: aparece, transform: `translateX(${(1 - aparece) * 16}px)`,
            display: "grid", gridTemplateColumns: `${desenho === "largo" ? 92 : 80}px 1fr`, alignItems: "center", gap: 10 }}>
            <b style={{ font: `700 ${desenho === "largo" ? 26 : 22}px ${mono}`, color: j === 0 ? cor.aviso : cor.ok }}>{pct(x.valor)}</b>
            <div style={{ display: "grid", gap: 2 }}>
              <span style={{ font: `600 ${desenho === "largo" ? 16 : 15}px/1.25 ${ui}`, color: cor.texto }}>{x.como}</span>
              <span style={{ font: `600 13px ${ui}`, color: cor.ok }}>{x.fase} · capítulo {x.capitulo}</span>
            </div>
          </div>;
        })}
      </div>}

      {balao && M.balao.lado ? <svg width={M.w} height={M.h} style={{ position: "absolute", inset: 0 }}>
        <line x1={M.x + M.aw + 6} y1={alvo.y} x2={M.balao.x} y2={alvo.y} stroke={cor.acento} strokeWidth={2} strokeDasharray="5 4" opacity={opaBalao} />
      </svg> : null}
      {balao ? <Balao M={M as never} alvo={alvo} opacidade={opaBalao}>{balao.texto}</Balao> : null}
    </AbsoluteFill>
  );
};
