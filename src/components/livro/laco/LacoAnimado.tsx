/**
 * A animação do laço, no 1.1 (Remotion; docs/capacidades/laco-do-agente.md): quem decide o próximo passo, em três jeitos
 * de usar um modelo. Nesta etapa, o elenco parado e com nome (docs/RITMO.md): a cliente e a mensagem, o laço (decidir,
 * agir, observar, de volta a decidir), o sistema da loja com as ferramentas, e a resposta. O desenho é da loja, com as
 * palavras do livro. As cores e as curvas são as das outras composições (palco/video.ts). O Studio do my-video importa
 * esta composição.
 */
import { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { cor, mono, ui } from "../palco/video";
import { type Caixa, caixas, type Desenho, type Elenco, type Seta, setas, VISTA } from "./laco";

export type Props = { elenco: Elenco; desenho: Desenho };

const TOPO = 56; // a pergunta
const FAIXA: Record<Desenho, number> = { largo: 72, coluna: 88 }; // a legenda
export const tamanho = (desenho: Desenho) => ({ w: VISTA[desenho].w, h: TOPO + VISTA[desenho].h + FAIXA[desenho] });

const Caixinha = ({ c, children, borda = cor.linha }: { c: Caixa; children?: React.ReactNode; borda?: string }) => (
  <g>
    <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={12} fill={cor.papel} stroke={borda} strokeWidth={1.5} />
    {children}
  </g>
);

// o nome de uma peça do laço, no meio da caixa
const Nome = ({ c, texto, dy = 0 }: { c: Caixa; texto: string; dy?: number }) => (
  <text x={c.x + c.w / 2} y={c.y + c.h / 2 + 5 + dy} textAnchor="middle" style={{ font: `600 16px ${ui}`, fill: cor.texto }}>{texto}</text>
);

// as duas fichas de quem pode decidir, dentro de "decidir"
const Fichas = ({ c, quem }: { c: Caixa; quem: { modelo: string; codigo: string } }) => {
  const larg = (t: string) => t.length * 7 + 20;
  const a = larg(quem.modelo), b = larg(quem.codigo), x0 = c.x + (c.w - a - b - 8) / 2, y = c.y + c.h - 34;
  return (
    <g style={{ font: `500 12.5px ${ui}` }}>
      {[[quem.modelo, x0, a], [quem.codigo, x0 + a + 8, b]].map(([t, x, w]) => (
        <g key={t as string}>
          <rect x={x as number} y={y} width={w as number} height={22} rx={11} fill={cor.nota} stroke={cor.linha} />
          <text x={(x as number) + (w as number) / 2} y={y + 15} textAnchor="middle" fill={cor.fraco}>{t as string}</text>
        </g>
      ))}
    </g>
  );
};

const Flecha = ({ s, id }: { s: Seta; id: string }) => {
  const d = s.curva ? `M ${s.de[0]} ${s.de[1]} Q ${s.curva[0]} ${s.curva[1]} ${s.para[0]} ${s.para[1]}` : `M ${s.de[0]} ${s.de[1]} L ${s.para[0]} ${s.para[1]}`;
  return (
    <g>
      <path d={d} fill="none" stroke={cor.fraco} strokeWidth={1.6} strokeDasharray={s.volta ? "6 4" : undefined} markerEnd={`url(#${id})`} />
      {s.rotulo && s.em ? (
        <text x={s.em[0]} y={s.em[1]} textAnchor="middle" style={{ font: `italic 13px ${ui}`, fill: cor.fraco, paintOrder: "stroke", stroke: cor.nota, strokeWidth: 4 }}>{s.rotulo}</text>
      ) : null}
    </g>
  );
};

// quebra um texto em linhas de até n letras, sem cortar palavra
const linhas = (texto: string, n: number) => texto.split(" ").reduce<string[]>((ls, p) => {
  const u = ls[ls.length - 1];
  if (u !== undefined && (u + " " + p).length <= n) ls[ls.length - 1] = u + " " + p; else ls.push(p);
  return ls;
}, []);

export const LacoAnimado: React.FC<Props> = ({ elenco, desenho }) => {
  const cx = useMemo(() => caixas(desenho), [desenho]);
  const sx = useMemo(() => setas(desenho, elenco.setas), [desenho, elenco.setas]);
  const vista = VISTA[desenho];
  const coluna = desenho === "coluna";
  const marca = `laco-${desenho}-seta`;
  const n = elenco.nomes;
  const c = cx.cliente;
  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui }}>
      <div style={{ height: TOPO, display: "flex", alignItems: "center", padding: "0 20px", font: `600 ${coluna ? 17 : 20}px ${ui}`, color: cor.texto }}>
        {elenco.pergunta}
      </div>
      <svg viewBox={`0 0 ${vista.w} ${vista.h}`} width={vista.w} height={vista.h} style={{ position: "absolute", left: 0, top: TOPO }}>
        <defs>
          <marker id={marca} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={cor.fraco} />
          </marker>
        </defs>
        {Object.entries(sx).map(([id, s]) => <Flecha key={id} s={s} id={marca} />)}
        {/* a cliente e a mensagem dela */}
        <Caixinha c={c}>
          <text x={c.x + 14} y={c.y + 24} style={{ font: `600 13px ${ui}`, fill: cor.fraco }}>{elenco.cliente.nome}</text>
          {linhas(elenco.cliente.mensagem, coluna ? 40 : 22).map((l, i) => (
            <text key={i} x={c.x + 14} y={c.y + 48 + i * 21} style={{ font: `16px ${ui}`, fill: cor.texto }}>{l}</text>
          ))}
        </Caixinha>
        {/* o laço */}
        <Caixinha c={cx.decidir}><Nome c={cx.decidir} texto={n.decidir} dy={-18} /><Fichas c={cx.decidir} quem={n.quem} /></Caixinha>
        <Caixinha c={cx.agir}><Nome c={cx.agir} texto={n.agir} /></Caixinha>
        <Caixinha c={cx.observar}><Nome c={cx.observar} texto={n.observar} /></Caixinha>
        <Caixinha c={cx.responder}><Nome c={cx.responder} texto={n.responder} /></Caixinha>
        {/* o sistema da loja, com as ferramentas que o agente chama */}
        <Caixinha c={cx.sistema}>
          <text x={cx.sistema.x + 14} y={cx.sistema.y + 24} style={{ font: `600 14px ${ui}`, fill: cor.texto }}>{n.sistema}</text>
          {elenco.ferramentas.map((f, i) => (
            <text key={f} x={cx.sistema.x + 14} y={cx.sistema.y + 46 + i * 19} style={{ font: `12.5px ${mono}`, fill: cor.fraco }}>{f}</text>
          ))}
        </Caixinha>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: TOPO + vista.h, padding: coluna ? "6px 16px" : "8px 24px", font: `${coluna ? 16 : 19}px/1.35 ${ui}`, color: cor.texto }}>
        {elenco.legenda}
      </div>
    </AbsoluteFill>
  );
};

/** As medidas do vídeo de cada desenho. Nesta etapa, só o elenco: uma cena parada de 5 s. */
export function quadroDoLaco(desenho: Desenho) {
  const { w, h } = tamanho(desenho);
  return { fps: 30, largura: w, altura: h, duracao: 150 };
}
