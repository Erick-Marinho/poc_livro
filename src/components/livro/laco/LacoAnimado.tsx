/**
 * A animação do laço, no 1.1 (Remotion; docs/capacidades/laco-do-agente.md): quem decide o próximo passo, em três jeitos
 * de usar um modelo. O elenco parado e com nome (docs/RITMO.md): a cliente e a mensagem, o laço (decidir, agir, observar,
 * de volta a decidir), o sistema da loja com as ferramentas, e a resposta. Em cada cena, a pergunta (um ponto) anda
 * pelos passos de um jeito dos "três jeitos", de peça em peça pelas setas; a ficha de quem decide acende, o que o jeito
 * não usa fica apagado, e embaixo vão a legenda e o passo de agora. O quadro final soma os acertos de cada jeito. Cor
 * com sentido fixo: acento é o que acontece agora, verde é o certo, âmbar é o erro. O desenho é da loja, com as palavras
 * do livro. O leitor avança cena a cena (a ilha, etapa 3); o último quadro é o do modo direto. O Studio do my-video
 * importa esta composição.
 */
import { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, kf, mono, suave, ui } from "../palco/video";
import { type Caixa, caixas, type Cena, cenaEm, type Desenho, type Entrada, montarCenas, montarElenco, type Peca, placar, pontoDaSeta, rota, type Seta, setas, VISTA } from "./laco";

export type Props = Entrada & { desenho: Desenho };

const TOPO = 56; // a pergunta
const FAIXA: Record<Desenho, number> = { largo: 92, coluna: 128 }; // a legenda e o passo de agora
export const tamanho = (desenho: Desenho) => ({ w: VISTA[desenho].w, h: TOPO + VISTA[desenho].h + FAIXA[desenho] });

const ANDA = 0.6; // o ponto leva isto para ir de uma peça à seguinte, e chega um pouco antes da parada
const APAGADO = 0.28;

type Estilo = { borda: string; grossa?: boolean; opacidade: number };
const Caixinha = ({ c, children, e }: { c: Caixa; children?: React.ReactNode; e: Estilo }) => (
  <g opacity={e.opacidade}>
    <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={12} fill={cor.papel} stroke={e.borda} strokeWidth={e.grossa ? 2.5 : 1.5} />
    {children}
  </g>
);

// o nome de uma peça do laço, no meio da caixa
const Nome = ({ c, texto, dy = 0 }: { c: Caixa; texto: string; dy?: number }) => (
  <text x={c.x + c.w / 2} y={c.y + c.h / 2 + 5 + dy} textAnchor="middle" style={{ font: `600 16px ${ui}`, fill: cor.texto }}>{texto}</text>
);

// as duas fichas de quem pode decidir, dentro de "decidir"; a de quem decide nesta cena acende
const Fichas = ({ c, quem, acesa }: { c: Caixa; quem: { modelo: string; codigo: string }; acesa?: "modelo" | "codigo" }) => {
  const larg = (t: string) => t.length * 7 + 20;
  const a = larg(quem.modelo), b = larg(quem.codigo), x0 = c.x + (c.w - a - b - 8) / 2, y = c.y + c.h - 34;
  return (
    <g style={{ font: `500 12.5px ${ui}` }}>
      {([["modelo", quem.modelo, x0, a], ["codigo", quem.codigo, x0 + a + 8, b]] as const).map(([id, t, x, w]) => {
        const sim = id === acesa;
        return (
          <g key={id}>
            <rect x={x} y={y} width={w} height={22} rx={11} fill={sim ? cor.acento : cor.nota} stroke={sim ? cor.acento : cor.linha} />
            <text x={x + w / 2} y={y + 15} textAnchor="middle" fill={sim ? cor.papel : cor.fraco} style={{ fontWeight: sim ? 700 : 500 }}>{t}</text>
          </g>
        );
      })}
    </g>
  );
};

const caminhoDaSeta = (s: Seta) => (s.curva ? `M ${s.de[0]} ${s.de[1]} Q ${s.curva[0]} ${s.curva[1]} ${s.para[0]} ${s.para[1]}` : `M ${s.de[0]} ${s.de[1]} L ${s.para[0]} ${s.para[1]}`);

const Flecha = ({ s, id, opacidade, acesa }: { s: Seta; id: string; opacidade: number; acesa?: boolean }) => (
  <g opacity={opacidade}>
    <path d={caminhoDaSeta(s)} fill="none" stroke={acesa ? cor.acento : cor.fraco} strokeWidth={acesa ? 2.4 : 1.6} strokeDasharray={s.volta ? "6 4" : undefined}
      markerEnd={`url(#${id}${acesa ? "-acesa" : ""})`} />
    {s.rotulo && s.em ? (
      <text x={s.em[0]} y={s.em[1]} textAnchor="middle" style={{ font: `italic 13px ${ui}`, fill: acesa ? cor.acento : cor.fraco, paintOrder: "stroke", stroke: cor.nota, strokeWidth: 4 }}>{s.rotulo}</text>
    ) : null}
  </g>
);

// quebra um texto em linhas de até n letras, sem cortar palavra
const linhas = (texto: string, n: number) => texto.split(" ").reduce<string[]>((ls, p) => {
  const u = ls[ls.length - 1];
  if (u !== undefined && (u + " " + p).length <= n) ls[ls.length - 1] = u + " " + p; else ls.push(p);
  return ls;
}, []);

/** Onde está o ponto (a pergunta) num momento da cena, e por que setas ele anda agora. */
function ponto(cena: Cena, v: number, sx: Record<string, Seta>, cx: Record<Peca, Caixa>) {
  const ps = cena.paradas;
  if (!ps.length || v < ps[0].em - 0.3) return null;
  const centro = (p: Peca): [number, number] => [cx[p].x + cx[p].w - 16, cx[p].y + 14];
  let i = ps.filter((p) => p.em <= v + ANDA + 0.1).length - 1; // a parada para onde ele vai, ou onde está
  i = Math.max(0, i);
  const chegada = ps[i].em - 0.1, partida = chegada - ANDA;
  if (i === 0 || v >= chegada || ps[i].peca === ps[i - 1].peca) return { xy: centro(ps[i].peca), andando: [] as string[], aparece: kf(v, [[ps[0].em - 0.3, 0], [ps[0].em, 1]]) };
  const ids = rota(ps[i - 1].peca, ps[i].peca);
  const k = kf(v, [[partida, 0], [chegada, 1]], suave) * ids.length;
  const seg = Math.min(ids.length - 1, Math.floor(k));
  return { xy: pontoDaSeta(sx[ids[seg]], k - seg), andando: ids, aparece: 1 };
}

export const LacoAnimado: React.FC<Props> = ({ laco, tresJeitos, clientes, desenho }) => {
  const elenco = useMemo(() => montarElenco({ laco, tresJeitos, clientes }), [laco, tresJeitos, clientes]);
  const m = useMemo(() => montarCenas({ laco, tresJeitos }), [laco, tresJeitos]);
  const soma = useMemo(() => placar(tresJeitos), [tresJeitos]);
  const cx = useMemo(() => caixas(desenho), [desenho]);
  const sx = useMemo(() => setas(desenho, elenco.setas), [desenho, elenco.setas]);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cena, v } = cenaEm(m, frame / fps);
  const vista = VISTA[desenho];
  const coluna = desenho === "coluna";
  const marca = `laco-${desenho}-seta`;
  const n = elenco.nomes;

  const jeito = !!cena.jeito;
  const chegou = cena.paradas.filter((p) => p.em <= v);
  const agora = chegou[chegou.length - 1];
  const fim = chegou.find((p) => p.resultado);
  const ficha = [...chegou].reverse().find((p) => p.ficha)?.ficha;
  const chamada = chegou.find((p) => p.ferramenta)?.ferramenta;
  const pt = ponto(cena, v, sx, cx);
  const usa = (id: string) => !jeito || cena.usa.includes(id);
  const estilo = (p: Peca): Estilo => {
    if (p === "responder" && fim) return { borda: fim.resultado === "certo" ? cor.ok : cor.aviso, grossa: true, opacidade: 1 };
    return { borda: agora?.peca === p ? cor.acento : cor.linha, grossa: agora?.peca === p, opacidade: usa(p) ? 1 : APAGADO };
  };
  const mensagem = cena.mensagem ?? elenco.cliente.mensagem;
  const quem = mensagem === elenco.cliente.mensagem ? elenco.cliente.nome : "outra cliente";

  // a faixa: a legenda da cena e, embaixo, o passo de agora (ou, no fim, o placar)
  const passo = cena.final ? (
    <>No pedido e na frigideira: {soma.map((s, i) => (
      <span key={s.nome}>{i ? " · " : ""}{s.nome} {s.acertos.map((a, j) => <b key={j} style={{ color: a ? cor.ok : cor.aviso }}>{a ? "✓" : "✗"}</b>).reduce<React.ReactNode[]>((xs, x, j) => (j ? [...xs, " ", x] : [x]), [])}</span>
    ))}</>
  ) : agora?.resultado ? (
    <span style={{ color: agora.resultado === "certo" ? cor.ok : cor.aviso }}>“{agora.texto}” <b>{agora.resultado === "certo" ? "✓" : "✗"}</b>{agora.erro ? <span style={{ color: cor.fraco }}> · {agora.erro}</span> : null}</span>
  ) : agora && agora.peca !== "cliente" ? <span style={{ fontFamily: agora.peca === "sistema" || agora.peca === "observar" ? mono : ui }}>{agora.texto}</span> : null;

  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui }}>
      <div style={{ height: TOPO, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "0 20px", font: `600 ${coluna ? 17 : 20}px ${ui}`, color: cor.texto }}>
        <span>{elenco.pergunta}</span>
        <span style={{ font: `600 11px ${mono}`, letterSpacing: ".08em", textTransform: "uppercase", color: cor.fraco }}>ilustração</span>
      </div>
      <svg viewBox={`0 0 ${vista.w} ${vista.h}`} width={vista.w} height={vista.h} style={{ position: "absolute", left: 0, top: TOPO }}>
        <defs>
          {([["", cor.fraco], ["-acesa", cor.acento]] as const).map(([sufixo, c]) => (
            <marker key={sufixo} id={`${marca}${sufixo}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
            </marker>
          ))}
        </defs>
        {Object.entries(sx).map(([id, s]) => {
          const op = s.extra ? (jeito && cena.usa.includes(id) ? kf(v, [[0, 0], [0.4, 1]]) : 0) : usa(id) ? 1 : APAGADO;
          return op ? <Flecha key={id} s={s} id={marca} opacidade={op} acesa={pt?.andando.includes(id)} /> : null;
        })}
        {/* a cliente e a mensagem dela */}
        <Caixinha c={cx.cliente} e={estilo("cliente")}>
          <text x={cx.cliente.x + 14} y={cx.cliente.y + 24} style={{ font: `600 13px ${ui}`, fill: cor.fraco }}>{quem}</text>
          {linhas(mensagem, coluna ? 40 : 22).map((l, i) => (
            <text key={i} x={cx.cliente.x + 14} y={cx.cliente.y + 48 + i * 21} style={{ font: `16px ${ui}`, fill: cor.texto }}>{l}</text>
          ))}
        </Caixinha>
        {/* o laço */}
        <Caixinha c={cx.decidir} e={estilo("decidir")}><Nome c={cx.decidir} texto={n.decidir} dy={-18} /><Fichas c={cx.decidir} quem={n.quem} acesa={ficha} /></Caixinha>
        <Caixinha c={cx.agir} e={estilo("agir")}><Nome c={cx.agir} texto={n.agir} /></Caixinha>
        <Caixinha c={cx.observar} e={estilo("observar")}><Nome c={cx.observar} texto={n.observar} /></Caixinha>
        <Caixinha c={cx.responder} e={estilo("responder")}>
          <Nome c={cx.responder} texto={fim ? `${n.responder} ${fim.resultado === "certo" ? "✓" : "✗"}` : n.responder} />
        </Caixinha>
        {/* o sistema da loja, com as ferramentas que o agente chama; a chamada desta cena acende */}
        <Caixinha c={cx.sistema} e={estilo("sistema")}>
          <text x={cx.sistema.x + 14} y={cx.sistema.y + 24} style={{ font: `600 14px ${ui}`, fill: cor.texto }}>{n.sistema}</text>
          {elenco.ferramentas.map((f, i) => (
            <text key={f} x={cx.sistema.x + 14} y={cx.sistema.y + 46 + i * 19} style={{ font: `${f === chamada ? 700 : 400} 12.5px ${mono}`, fill: f === chamada ? cor.acento : cor.fraco }}>{f}</text>
          ))}
        </Caixinha>
        {/* a pergunta, andando */}
        {pt ? <circle cx={pt.xy[0]} cy={pt.xy[1]} r={8} fill={cor.acento} stroke={cor.papel} strokeWidth={3} opacity={pt.aparece} /> : null}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: TOPO + vista.h, padding: coluna ? "6px 16px" : "8px 24px", display: "grid", gap: 6 }}>
        <div style={{ font: `${coluna ? 16 : 19}px/1.35 ${ui}`, color: cor.texto, opacity: kf(v, [[0, 0], [0.4, 1]]) }}>{cena.legenda}</div>
        <div style={{ font: `${coluna ? 13.5 : 15}px/1.4 ${ui}`, color: cor.fraco }}>{passo}</div>
      </div>
    </AbsoluteFill>
  );
};

/** As medidas do vídeo de cada desenho. */
export function quadroDoLaco(props: Pick<Entrada, "laco" | "tresJeitos">, desenho: Desenho) {
  const m = montarCenas(props);
  const { w, h } = tamanho(desenho);
  return { fps: 30, largura: w, altura: h, duracao: m.quadros };
}
