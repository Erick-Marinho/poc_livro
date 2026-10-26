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
import { cor, kf, mono, ui } from "../palco/video";
import { Balao, Caixa, type Desenho, entre, lugares, MEDIDAS, Mensagem, ondeEsta, opacidadeDoBalao, Pilula, Pontas, type Ponto, seta as setaDe } from "./pecas";
import { type Alvo, baloes, curta, type Roteiro, rotulo, T } from "./roteiro.ts";

export type Props = { roteiro: Roteiro; desenho: Desenho };

export const RoteiroAnimado: React.FC<Props> = ({ roteiro: r, desenho }) => {
  const M = MEDIDAS[desenho];
  const D = M.decide, B = M.balcao, F = M.ficha;
  const { bx, meioDecide, meioBalcao } = lugares(M);
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
  const opaBalao = balao ? opacidadeDoBalao(t, balao.de, balao.ate, ultimo) : 0;
  const aponta = (al: Alvo) => balao?.alvo === al && opaBalao > 0.5;
  const alvoPonto = (al: Alvo): Ponto => al === "decidir" ? { x: D.x + D.w, y: meioDecide.y } : al === "balcao-a" ? { x: bx(ia) + B.w, y: meioBalcao(ia).y }
    : al === "balcao-b" ? { x: bx(ib) + B.w, y: meioBalcao(ib).y } : al === "ficha" ? { x: F.x + F.w, y: F.y + F.h / 2 } : { x: meioDecide.x + 60, y: (D.y + D.h + B.y) / 2 };

  const seta = (x1: number, y1: number, x2: number, y2: number, acesa: boolean, apagada: boolean, chave: string) => setaDe(desenho, x1, y1, x2, y2, acesa, apagada, chave);
  const caixa = (x: number, y: number, w: number, h: number, borda: string, opacidade: number, filhos: React.ReactNode) =>
    <Caixa x={x} y={y} w={w} h={h} borda={borda} opacidade={opacidade}>{filhos}</Caixa>;
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
        <Pontas desenho={desenho} />
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
      <Pilula M={M} p={M.inicio} texto="início" />
      <Pilula M={M} p={M.fim} texto="fim" />

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
      <Mensagem M={M} p={token} opacidade={tokenOpa} />

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
      {balao ? <Balao M={M} alvo={alvoPonto(balao.alvo)} opacidade={opaBalao}>{balao.texto}</Balao> : null}
    </AbsoluteFill>
  );
};
