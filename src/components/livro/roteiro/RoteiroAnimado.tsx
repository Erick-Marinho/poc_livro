/**
 * A animação do roteiro do substituto (Remotion; docs/capacidades/capitulo-2-em-cenas.md, etapa 1), que anda com a
 * rolagem (palco/RolaCena.tsx): a mensagem chega, o substituto decide, ela segue um caminho só até um balcão, e uma
 * ficha vai junto; depois, outra mensagem, outro balcão; no fim, o roteiro vira o grafo do agente (nós, setas que
 * escolhem, estado). As explicações são balões, um por vez, apontando para o que está acontecendo. O que se desenha
 * sai de roteiro.ts, montado do projeto real. Cor com sentido fixo (docs/RITMO.md): acento é o que anda agora, verde é
 * o que o contrato pede, cinza é o que ficou de fora. Dois desenhos: o largo, com os balões ao lado; o estreito, do
 * celular, com os balões embaixo.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, kf, mono, suave, ui } from "../palco/video";
import { type Alvo, baloes, curta, type Roteiro, rotulo, T } from "./roteiro.ts";

export type Desenho = "largo" | "estreito";
export type Props = { roteiro: Roteiro; desenho: Desenho };
type Ponto = { x: number; y: number };

export const MEDIDAS = {
  largo: { w: 780, h: 640, msg: { x: 20, y: 14, w: 450, fonte: 20 }, cartao: { x: 245, y: 80 }, inicio: { x: 245, y: 120 },
    decide: { x: 95, y: 156, w: 300, h: 76, fonte: 25, sub: 17 }, balcao: { y: 300, w: 108, h: 88, passo: 116, x0: 13, fonte: 18, sub: 13 },
    fim: { x: 245, y: 438 }, ficha: { x: 20, y: 478, w: 450, h: 124, fonte: 17, titulo: 13 }, pilula: { w: 110, h: 34, fonte: 17 },
    token: { w: 104, h: 30, fonte: 14 }, nomeSetas: 14, balao: { lado: true, x: 500, w: 264, y: 0, fonte: 18 } },
  estreito: { w: 420, h: 772, msg: { x: 14, y: 12, w: 392, fonte: 19 }, cartao: { x: 210, y: 78 }, inicio: { x: 210, y: 118 },
    decide: { x: 70, y: 152, w: 280, h: 74, fonte: 25, sub: 17 }, balcao: { y: 296, w: 96, h: 92, passo: 100, x0: 12, fonte: 17, sub: 13 },
    fim: { x: 210, y: 438 }, ficha: { x: 14, y: 474, w: 392, h: 124, fonte: 17, titulo: 13 }, pilula: { w: 100, h: 32, fonte: 17 },
    token: { w: 96, h: 30, fonte: 14 }, nomeSetas: 15, balao: { lado: false, x: 14, w: 392, y: 618, fonte: 17 } },
} satisfies Record<Desenho, unknown>;

// onde a mensagem está: parada num ponto, ou entre dois, pelos tempos [segundo, ponto]
const ondeEsta = (t: number, rota: [number, Ponto][]): Ponto => {
  const i = rota.findIndex(([em]) => t < em);
  if (i === 0) return rota[0][1];
  if (i < 0) return rota[rota.length - 1][1];
  const [ea, pa] = rota[i - 1], [eb, pb] = rota[i];
  const q = kf(t, [[ea, 0], [eb, 1]], suave);
  return { x: pa.x + (pb.x - pa.x) * q, y: pa.y + (pb.y - pa.y) * q };
};
const entre = (t: number, a: number, b: number) => t >= a && t < b;

export const RoteiroAnimado: React.FC<Props> = ({ roteiro: r, desenho }) => {
  const M = MEDIDAS[desenho];
  const D = M.decide, B = M.balcao, F = M.ficha;
  const bx = (i: number) => B.x0 + i * B.passo;
  const meioDecide: Ponto = { x: D.x + D.w / 2, y: D.y + D.h / 2 };
  const meioBalcao = (i: number): Ponto => ({ x: bx(i) + B.w / 2, y: B.y + B.h / 2 });
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const grafo = kf(t, [[T.grafo[0], 0], [T.grafo[1], 1]]); // o roteiro vira grafo
  const [a, b] = r.mensagens;
  const ia = r.balcoes.findIndex((x) => x.id === a.balcao), ib = r.balcoes.findIndex((x) => x.id === b.balcao);
  const segunda = t >= T.b.troca[0];
  const msg = t >= (T.b.troca[0] + T.b.troca[1]) / 2 ? b : a;

  /* a mensagem andando: a primeira, depois a segunda */
  const rotaA: [number, Ponto][] = [[T.a.entra[0], M.cartao], [1.2, M.inicio], [T.a.entra[1], meioDecide], [T.a.balcao[0], meioDecide], [T.a.balcao[1], meioBalcao(ia)], [T.a.fim[0], meioBalcao(ia)], [T.a.fim[1], M.fim]];
  const rotaB: [number, Ponto][] = [[T.b.entra[0], M.cartao], [10.8, M.inicio], [T.b.entra[1], meioDecide], [T.b.balcao[0], meioDecide], [T.b.balcao[1], meioBalcao(ib)], [T.b.fim[0], meioBalcao(ib)], [T.b.fim[1], M.fim]];
  const token = segunda ? ondeEsta(t, rotaB) : ondeEsta(t, rotaA);
  const tokenOpa = segunda ? kf(t, [[T.b.entra[0] - 0.2, 0], [T.b.entra[0], 1], [T.b.fim[1], 1], [T.b.fim[1] + 0.4, 0]])
    : kf(t, [[T.a.entra[0] - 0.2, 0], [T.a.entra[0], 1], [T.a.fim[1], 1], [T.a.fim[1] + 0.4, 0]]);

  // o caminho aceso, e o balcão onde a mensagem chegou
  const ativo = entre(t, T.a.decide, T.b.troca[0]) ? ia : entre(t, T.b.decide, T.grafo[0]) ? ib : -1;
  const chegou = segunda ? t >= T.b.balcao[1] : t >= T.a.balcao[1];
  const decidindo = entre(t, T.a.entra[1], T.a.decide) || entre(t, T.b.entra[1], T.b.decide);

  // a ficha: o que já se sabe da mensagem de agora (zera quando a segunda entra)
  const fichaB = t >= T.b.troca[1];
  const fm = fichaB ? b : a, Tm = fichaB ? T.b : T.a;
  const temPergunta = t >= Tm.entra[1], temDecisao = t >= Tm.decide, temResposta = t >= Tm.balcao[1];
  const bm = r.balcoes.find((x) => x.id === fm.balcao)!;
  const limite = desenho === "largo" ? 40 : 34;
  const pergunta = curta(fm.pergunta);

  // o balão de agora, e o que ele aponta
  const lista = baloes(r);
  const balao = lista.find((x) => entre(t, x.de, x.ate)) ?? null;
  const ultimo = balao === lista[lista.length - 1];
  const opaBalao = balao ? kf(t, ultimo ? [[balao.de, 0], [balao.de + 0.3, 1]] : [[balao.de, 0], [balao.de + 0.3, 1], [balao.ate - 0.3, 1], [balao.ate, 0]]) : 0;
  const aponta = (al: Alvo) => balao?.alvo === al && opaBalao > 0.5;
  const alvoPonto = (al: Alvo): Ponto => al === "decidir" ? { x: D.x + D.w, y: meioDecide.y } : al === "balcao-a" ? { x: bx(ia) + B.w, y: meioBalcao(ia).y }
    : al === "balcao-b" ? { x: bx(ib) + B.w, y: meioBalcao(ib).y } : al === "ficha" ? { x: F.x + F.w, y: F.y + F.h / 2 } : { x: meioDecide.x + 60, y: (D.y + D.h + B.y) / 2 };

  const seta = (x1: number, y1: number, x2: number, y2: number, acesa: boolean, apagada: boolean, chave: string) => {
    const my = (y1 + y2) / 2;
    return <path key={chave} d={`M${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2 - 8}`} fill="none"
      stroke={acesa ? cor.acento : cor.linha} strokeWidth={acesa ? 3.5 : 2.5} opacity={apagada ? 0.35 : 1} markerEnd={`url(#ponta-${desenho}-${acesa ? "acesa" : "normal"})`} />;
  };
  const caixa = (x: number, y: number, w: number, h: number, borda: string, opacidade: number, filhos: React.ReactNode) => (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, border: `2.5px solid ${borda}`, borderRadius: 14, background: cor.papel,
      opacity: opacidade, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", boxSizing: "border-box", padding: "4px 6px" }}>{filhos}</div>
  );
  // um rótulo que troca, no fim, pelo nome do código
  const troca = (antes: string, depois: string, tam: number, peso = 700, cor_ = cor.texto) => (
    <div style={{ display: "grid", width: "100%" }}>
      <span style={{ gridArea: "1 / 1", opacity: 1 - grafo, font: `${peso} ${tam}px/1.15 ${ui}`, color: cor_ }}>{antes}</span>
      <span style={{ gridArea: "1 / 1", opacity: grafo, font: `${peso} ${peso === 700 ? tam - 3 : tam}px/1.15 ${peso === 700 ? mono : ui}`, color: cor_, overflowWrap: "anywhere" }}>{depois}</span>
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui }}>
      {/* a mensagem que chega */}
      <div style={{ position: "absolute", left: M.msg.x, top: M.msg.y, width: M.msg.w, boxSizing: "border-box", padding: "10px 16px", border: `2px solid ${cor.linha}`,
        borderRadius: 14, background: cor.papel, opacity: t >= T.grafo[0] ? kf(t, [[T.grafo[0], 1], [T.grafo[1], 0.4]]) : segunda ? kf(t, [[T.b.troca[0], 0.2], [T.b.troca[1], 1]]) : 1,
        font: `italic ${M.msg.fonte}px/1.35 ${ui}`, color: cor.texto }}>“{curta(msg.pergunta)}”</div>

      {/* as setas: do início ao substituto, dele a cada balcão, de cada balcão ao fim */}
      <svg width={M.w} height={M.h} style={{ position: "absolute", inset: 0 }}>
        <defs>
          {(["normal", "acesa"] as const).map((n) => (
            <marker key={n} id={`ponta-${desenho}-${n}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill={n === "acesa" ? cor.acento : cor.linha} />
            </marker>
          ))}
        </defs>
        {seta(M.inicio.x, M.inicio.y + M.pilula.h / 2, meioDecide.x, D.y, false, false, "inicio")}
        {r.balcoes.map((_, i) => seta(meioDecide.x, D.y + D.h, meioBalcao(i).x, B.y, i === ativo || aponta("setas"), ativo >= 0 && i !== ativo, `ida-${i}`))}
        {r.balcoes.map((_, i) => seta(meioBalcao(i).x, B.y + B.h, M.fim.x, M.fim.y - M.pilula.h / 2, i === ativo && chegou, ativo >= 0 && i !== ativo, `fim-${i}`))}
        {/* no desenho largo, o balão liga ao que aponta por uma linha (aos balcões, pela ponta da fileira, sem cruzar os outros) */}
        {balao && M.balao.lado ? (
          <line x1={(balao.alvo.startsWith("balcao") ? bx(r.balcoes.length - 1) + B.w : alvoPonto(balao.alvo).x) + 6} y1={alvoPonto(balao.alvo).y} x2={M.balao.x} y2={alvoPonto(balao.alvo).y}
            stroke={cor.acento} strokeWidth={2} strokeDasharray="5 4" opacity={opaBalao} />
        ) : null}
      </svg>

      {/* o início e o fim */}
      {[{ p: M.inicio, texto: "início" }, { p: M.fim, texto: "fim" }].map(({ p, texto }) => (
        <div key={texto} style={{ position: "absolute", left: p.x - M.pilula.w / 2, top: p.y - M.pilula.h / 2, width: M.pilula.w, height: M.pilula.h, borderRadius: M.pilula.h / 2,
          border: `2px solid ${cor.linha}`, background: cor.papel, display: "flex", alignItems: "center", justifyContent: "center", font: `600 ${M.pilula.fonte}px ${ui}`, color: cor.fraco }}>{texto}</div>
      ))}

      {/* o substituto, que vira o nó que decide */}
      {caixa(D.x, D.y, D.w, D.h, decidindo || aponta("decidir") ? cor.acento : cor.linha, 1, <>
        {troca("o substituto", r.rotuloDecide, D.fonte)}
        {troca("lê a mensagem e decide", "o modelo decide", D.sub, 400, cor.fraco)}
      </>)}

      {/* os balcões, que viram os nós dos caminhos */}
      {r.balcoes.map((x, i) => {
        const aqui = i === ativo;
        const borda = aqui && chegou ? cor.ok : aqui ? cor.acento : cor.linha;
        return <div key={x.id}>{caixa(bx(i), B.y, B.w, B.h, borda, ativo >= 0 && !aqui ? 0.45 : 1, <>
          {troca(x.rotulo, x.id.replace(/_/g, "_​"), x.rotulo.length > 12 ? B.fonte - 3 : B.fonte)}
          <div style={{ font: `400 ${B.sub}px/1.2 ${ui}`, color: cor.fraco, opacity: grafo, marginTop: 2 }}>{x.modelo === "não" ? "frase fixa" : "o modelo escreve"}</div>
        </>)}</div>;
      })}

      {/* as setas que escolhem, nomeadas quando o roteiro vira grafo */}
      <div style={{ position: "absolute", left: D.x - 40, width: D.w + 80, top: D.y + D.h + 8, textAlign: "center", opacity: grafo, font: `600 ${M.nomeSetas}px ${ui}`, color: cor.acento }}>
        as setas que escolhem
      </div>

      {/* a mensagem andando */}
      <div style={{ position: "absolute", left: token.x - M.token.w / 2, top: token.y - M.token.h / 2, width: M.token.w, height: M.token.h, borderRadius: M.token.h / 2,
        background: cor.acento, opacity: tokenOpa, display: "flex", alignItems: "center", justifyContent: "center", font: `700 ${M.token.fonte}px ${ui}`, color: cor.papel }}>mensagem</div>

      {/* a ficha, que vira o estado */}
      <div style={{ position: "absolute", left: F.x, top: F.y, width: F.w, height: F.h, boxSizing: "border-box", padding: "8px 16px",
        border: `2px dashed ${grafo > 0.5 || aponta("ficha") ? cor.acento : cor.linha}`, borderRadius: 14, background: cor.papel,
        display: "grid", alignContent: "center", gap: 2, font: `400 ${F.fonte}px/1.35 ${ui}`, color: cor.texto }}>
        <div style={{ display: "grid" }}>
          <b style={{ gridArea: "1 / 1", opacity: 1 - grafo, font: `700 ${F.titulo}px ${mono}`, letterSpacing: ".06em", textTransform: "uppercase", color: cor.fraco }}>a ficha que vai junto</b>
          <b style={{ gridArea: "1 / 1", opacity: grafo, font: `700 ${F.titulo}px ${mono}`, letterSpacing: ".06em", textTransform: "uppercase", color: cor.acento }}>o estado: de nó em nó</b>
        </div>
        <div><span style={{ color: cor.fraco }}>pergunta:</span> {temPergunta ? `${pergunta.slice(0, limite)}${pergunta.length > limite ? "…" : ""}` : "—"}</div>
        <div><span style={{ color: cor.fraco }}>decisão:</span> {temDecisao ? <b style={{ color: cor.ok }}>{rotulo(r, fm.balcao)}</b> : "—"}</div>
        <div><span style={{ color: cor.fraco }}>resposta:</span> {temResposta ? (bm.modelo === "não" ? "frase fixa, sem chamar o modelo" : "escrita pelo modelo") : "—"}</div>
      </div>

      {/* o balão de agora: ao lado, na altura do que aponta (largo), ou embaixo, com a ponta para cima (estreito) */}
      {balao ? (() => {
        const alvo = alvoPonto(balao.alvo);
        const topo = M.balao.lado ? Math.min(Math.max(alvo.y, 80), M.h - 80) : M.balao.y;
        const ponta = M.balao.lado ? { left: -9, top: "50%", marginTop: -8 } : { left: Math.min(Math.max(alvo.x - M.balao.x - 40, 18), M.balao.w - 34), top: -9 };
        return (
          <div style={{ position: "absolute", left: M.balao.x, top: topo, width: M.balao.w, transform: M.balao.lado ? "translateY(-50%)" : undefined,
            opacity: opaBalao, boxSizing: "border-box", padding: "12px 16px", borderRadius: 14, background: cor.papel, border: `2px solid ${cor.acento}`,
            boxShadow: "0 6px 18px rgba(0,0,0,.08)", font: `${M.balao.fonte}px/1.42 ${ui}`, color: cor.texto }}>
            <span style={{ position: "absolute", ...ponta, width: 16, height: 16, background: cor.papel, borderLeft: `2px solid ${cor.acento}`, borderTop: `2px solid ${cor.acento}`,
              transform: M.balao.lado ? "rotate(-45deg)" : "rotate(45deg)" }} />
            {balao.texto}
          </div>
        );
      })() : null}
    </AbsoluteFill>
  );
};
