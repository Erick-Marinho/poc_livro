/**
 * A animação do grafo do agente, no 2.1 (Remotion; docs/capacidades/grafos-no-capitulo-2.md, etapa 1), que o leitor toca
 * ou rola (palco/RolaCena.tsx). Primeiro as peças, no próprio grafo do projeto: os nós (com o nome do código), as
 * arestas (cheias, as fixas; tracejadas, as que escolhem), START e END, e o estado. Depois, duas mensagens atravessam o
 * grafo, e o estado, em JSON, ganha chaves a cada nó: a chave nova acende. As explicações são balões, um por vez. O que
 * se desenha sai de roteiro.ts, montado do projeto real. Cor com sentido fixo (docs/RITMO.md): acento é o que anda
 * agora, verde é o que o contrato pede, cinza é o que ficou de fora. Dois desenhos: o largo, com os balões ao lado; o
 * estreito, do celular, com os balões embaixo.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, kf, mono, ui } from "../palco/video";
import { Balao, Caixa, type Desenho, entre, lugares, MEDIDAS, ondeEsta, opacidadeDoBalao, Pontas, type Ponto } from "./pecas";
import { type Alvo, baloes, curta, type Estado, type Roteiro, T } from "./roteiro.ts";

export type Props = { roteiro: Roteiro; estados: Estado[]; desenho: Desenho };

export const RoteiroAnimado: React.FC<Props> = ({ roteiro: r, estados, desenho }) => {
  const M = MEDIDAS[desenho];
  const D = M.decide, B = M.balcao, F = M.ficha;
  const { bx, meioDecide, meioBalcao } = lugares(M);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const largo = desenho === "largo";
  const [a, b] = r.mensagens;
  const ia = r.balcoes.findIndex((x) => x.id === a.balcao), ib = r.balcoes.findIndex((x) => x.id === b.balcao);
  const segunda = t >= T.b.troca;
  const Tm = segunda ? T.b : T.a, m = segunda ? b : a, est = segunda ? estados[1] : estados[0], im = segunda ? ib : ia;
  const andando = t >= T.a.entra - 0.3;

  /* o estado viajando: START, decidir, o nó do caminho, END */
  /* o selo para na borda de baixo de cada nó, para não cobrir o nome */
  const noDecide: Ponto = { x: meioDecide.x, y: D.y + D.h }, noCaminho: Ponto = { x: meioBalcao(im).x, y: B.y + B.h };
  const rota: [number, Ponto][] = [[Tm.entra, M.inicio], [Tm.decide[0], noDecide], [Tm.decide[1], noDecide], [Tm.vai[0], noDecide], [Tm.vai[1], noCaminho],
    [Tm.fim[0], noCaminho], [Tm.fim[1], M.fim]];
  const p = ondeEsta(t, rota);
  const viaja = andando ? kf(t, [[Tm.entra - 0.3, 0], [Tm.entra, 1], [Tm.fim[1], 1], [Tm.fim[1] + 0.3, 0]]) : 0;
  const temResposta = t >= Tm.escreve;
  const ativo = andando && t >= Tm.vai[0] - 0.2 && t < (segunda ? T.b.fim[1] + 0.8 : T.b.troca) ? im : -1;

  /* o balão de agora, e o que ele aponta */
  const lista = baloes(r);
  const balao = lista.find((x) => entre(t, x.de, x.ate)) ?? null;
  const opaBalao = balao ? opacidadeDoBalao(t, balao.de, balao.ate, balao === lista[lista.length - 1]) : 0;
  const aponta = (al: Alvo) => balao?.alvo === al && opaBalao > 0.5;
  const alvoPonto = (al: Alvo): Ponto => al === "nos" ? { x: D.x + D.w, y: meioDecide.y } : al === "pontas" ? { x: M.inicio.x + 30, y: M.inicio.y }
    : al === "ficha" ? { x: F.x + F.w, y: F.y + F.h / 2 } : al === "setas" ? { x: meioDecide.x + 60, y: (D.y + D.h + B.y) / 2 }
    : { x: bx(al === "balcao-a" ? ia : ib) + B.w, y: meioBalcao(al === "balcao-a" ? ia : ib).y };

  /* as peças acendem na sua cena: os nós um a um, as arestas fixas e depois as que escolhem, START e END */
  const noAceso = (k: number) => entre(t, T.nos[0] + 0.4 + k * 0.6, T.nos[1]);
  const fixasAcesas = entre(t, T.fixas, T.arestas[1]), condAcesas = entre(t, T.condicionais, T.arestas[1]);
  const pontasAcesas = entre(t, T.pontas[0], T.pontas[1]);

  const linha = (x1: number, y1: number, x2: number, y2: number, tipo: "fixa" | "escolhe", acesa: boolean, apagada: boolean, chave: string) => {
    const my = (y1 + y2) / 2;
    return <path key={chave} d={`M${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2 - 8}`} fill="none" stroke={acesa ? cor.acento : cor.linha} strokeWidth={acesa ? 3.5 : 2.5}
      strokeDasharray={tipo === "escolhe" ? "7 6" : undefined} opacity={apagada ? 0.35 : 1} markerEnd={`url(#ponta-${desenho}-${acesa ? "acesa" : "normal"})`} />;
  };
  const ponta = (q: Ponto, texto: string) => (
    <div style={{ position: "absolute", left: q.x - 30, top: q.y - 18, width: 60, height: 36, borderRadius: 18, boxSizing: "border-box",
      border: `2.5px solid ${pontasAcesas || aponta("pontas") ? cor.acento : cor.texto}`, background: cor.texto, display: "flex", alignItems: "center", justifyContent: "center",
      font: `700 ${largo ? 13 : 12}px ${mono}`, color: cor.papel, letterSpacing: ".04em" }}>{texto}</div>
  );

  /* o estado em JSON: cada chave entra no seu momento, e a nova acende por um instante */
  const valor = (v: string, max: number) => (v.length > max ? `${v.slice(0, max - 1)}…` : v);
  const max = largo ? 34 : 26;
  const chave = (k: string, v: React.ReactNode, desde: number) => {
    if (!andando || t < desde) return null;
    const nova = kf(t, [[desde, 1], [desde + 1.4, 0]]);
    return <div key={k} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", borderRadius: 4, padding: "0 4px", margin: "0 -4px",
      background: `rgba(229, 181, 103, ${0.32 * nova})` }}>&nbsp;&nbsp;<span style={{ color: "#8fb6ff" }}>"{k}"</span>: {v},</div>;
  };
  const texto = (v: string) => <span style={{ color: "#c8e6a0" }}>"{valor(v, max)}"</span>;

  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui }}>
      {/* a mensagem que chega, quando as mensagens andam */}
      <div style={{ position: "absolute", left: M.msg.x, top: M.msg.y, width: M.msg.w, boxSizing: "border-box", padding: "8px 14px", border: `2px solid ${cor.linha}`,
        borderRadius: 12, background: cor.papel, opacity: andando ? 1 : 0.35, font: `italic ${M.msg.fonte - 1}px/1.35 ${ui}`, color: cor.texto,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {andando ? `“${curta(m.pergunta)}”` : "o grafo do agente deste capítulo"}
      </div>

      {/* as arestas: START a decidir e cada nó ao END são fixas; de decidir a cada nó, escolhem */}
      <svg width={M.w} height={M.h} style={{ position: "absolute", inset: 0 }}>
        <Pontas desenho={desenho} />
        {linha(M.inicio.x, M.inicio.y + 18, meioDecide.x, D.y, "fixa", fixasAcesas || (andando && t < Tm.decide[0] && t >= Tm.entra), false, "inicio")}
        {r.balcoes.map((_, i) => linha(meioDecide.x, D.y + D.h, meioBalcao(i).x, B.y, "escolhe", condAcesas || aponta("setas") || i === ativo, ativo >= 0 && i !== ativo, `ida-${i}`))}
        {r.balcoes.map((_, i) => linha(meioBalcao(i).x, B.y + B.h, M.fim.x, M.fim.y - 18, "fixa", fixasAcesas || (i === ativo && t >= Tm.fim[0]), ativo >= 0 && i !== ativo, `fim-${i}`))}
        {balao && M.balao.lado ? (
          <line x1={(balao.alvo.startsWith("balcao") ? bx(r.balcoes.length - 1) + B.w : alvoPonto(balao.alvo).x) + 6} y1={alvoPonto(balao.alvo).y} x2={M.balao.x} y2={alvoPonto(balao.alvo).y}
            stroke={cor.acento} strokeWidth={2} strokeDasharray="5 4" opacity={opaBalao} />
        ) : null}
      </svg>

      {/* rótulos das arestas, na cena delas */}
      <div style={{ position: "absolute", left: D.x + D.w + 8, width: largo ? 88 : 60, top: D.y + D.h - 18, textAlign: "left", font: `600 ${M.nomeSetas - 1}px/1.25 ${ui}`, color: cor.acento,
        opacity: kf(t, [[T.condicionais, 0], [T.condicionais + 0.4, 1], [T.arestas[1] - 0.3, 1], [T.arestas[1], 0]]) }}>- - - estas escolhem</div>

      {ponta(M.inicio, "START")}
      {ponta(M.fim, "END")}

      {/* o nó que decide */}
      <Caixa x={D.x} y={D.y} w={D.w} h={D.h} borda={noAceso(0) || aponta("nos") || (andando && entre(t, Tm.decide[0], Tm.vai[0])) ? cor.acento : cor.linha}>
        <div style={{ font: `700 ${D.fonte - 3}px/1.15 ${mono}`, color: cor.texto }}>{r.decide}</div>
        <div style={{ font: `600 ${D.sub}px/1.2 ${ui}`, color: cor.acento }}>o modelo decide</div>
      </Caixa>

      {/* os nós dos caminhos */}
      {r.balcoes.map((x, i) => {
        const aqui = i === ativo;
        const borda = aqui && temResposta ? cor.ok : aqui ? cor.acento : noAceso(i + 1) ? cor.acento : cor.linha;
        return <Caixa key={x.id} x={bx(i)} y={B.y} w={B.w} h={B.h} borda={borda} opacidade={ativo >= 0 && !aqui ? 0.45 : 1}>
          <div style={{ font: `700 ${B.fonte - 3}px/1.15 ${mono}`, color: cor.texto, overflowWrap: "anywhere" }}>{x.id.replace(/_/g, "_​")}</div>
          <div style={{ font: `400 ${B.sub}px/1.2 ${ui}`, color: cor.fraco, marginTop: 2 }}>{x.modelo === "não" ? "frase fixa" : "o modelo escreve"}</div>
        </Caixa>;
      })}

      {/* o estado que viaja: um selo pequeno no caminho */}
      <div style={{ position: "absolute", left: p.x - 34, top: p.y - 14, width: 68, height: 28, borderRadius: 8, background: "#1e2127", border: "2px solid #e5b567",
        opacity: viaja, display: "flex", alignItems: "center", justifyContent: "center", font: `700 13px ${mono}`, color: "#e5b567" }}>{"{ }"}</div>

      {/* o estado em JSON, embaixo: a chave nova acende */}
      <div style={{ position: "absolute", left: F.x, top: F.y, width: F.w, minHeight: F.h, boxSizing: "border-box", padding: "8px 14px", borderRadius: 12,
        background: "#1e2127", border: `2px solid ${aponta("ficha") ? cor.acento : "#1e2127"}`, color: "#e6e1d6", font: `${largo ? 13.5 : 12.5}px/1.35 ${mono}`,
        opacity: kf(t, [[T.estado[0] - 0.4, 0.35], [T.estado[0], 1]]) }}>
        <div>{"{"}<span style={{ color: "#8b93a1" }}>{"   // o estado (Conversa)"}</span></div>
        {!andando && <div style={{ color: "#8b93a1" }}>&nbsp;&nbsp;"pergunta": …</div>}
        {chave("pergunta", texto(est.pergunta), Tm.entra)}
        {chave("decisao", texto(est.decisao), Tm.decide[0] + 0.9)}
        {chave("motivo", texto(est.motivo), Tm.decide[0] + 0.9)}
        {chave("resposta", est.resposta ? texto(est.resposta) : <i style={{ color: "#8b93a1" }}>o modelo escreve</i>, Tm.escreve)}
        <div>{"}"}</div>
      </div>

      {balao ? <Balao M={M} alvo={alvoPonto(balao.alvo)} opacidade={opaBalao}>{balao.texto}</Balao> : null}
    </AbsoluteFill>
  );
};
