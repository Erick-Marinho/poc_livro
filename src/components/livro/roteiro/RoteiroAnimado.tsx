/**
 * A animação do roteiro do substituto (Remotion; docs/capacidades/capitulo-2-em-cenas.md, etapa 1): a mensagem chega, o
 * substituto decide, ela segue um caminho só até um balcão, e uma ficha vai junto; na última cena, o roteiro vira o grafo
 * do agente (nós, setas que escolhem, estado). O que se desenha sai de roteiro.ts, montado do projeto real. Cor com
 * sentido fixo (docs/RITMO.md): acento é o que anda agora, verde é o que o contrato pede, cinza é o que ficou de fora.
 * Dois desenhos: o largo, com a legenda dentro do vídeo; e o estreito, do celular, com letra maior e a legenda fora do
 * vídeo (a ilha a escreve embaixo), para a figura caber inteira na tela enquanto o leitor rola.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, kf, mono, suave, ui } from "../palco/video";
import { CENAS, curta, legenda, type Roteiro, rotulo } from "./roteiro.ts";

export type Desenho = "largo" | "estreito";
export type Props = { roteiro: Roteiro; escolha: string | null; desenho: Desenho };
type Ponto = { x: number; y: number };

export const MEDIDAS = {
  largo: { w: 720, h: 830, msg: { x: 40, y: 18, w: 640, fonte: 22 }, cartao: { x: 360, y: 102 }, inicio: { x: 360, y: 140 },
    decide: { x: 200, y: 186, w: 320, h: 84, fonte: 26, sub: 18 }, balcao: { y: 352, w: 150, h: 92, passo: 170, x0: 30, fonte: 22, sub: 15 },
    fim: { x: 360, y: 512 }, ficha: { x: 40, y: 566, w: 640, h: 124, fonte: 18, titulo: 15 }, pilula: { w: 120, h: 36, fonte: 18 },
    token: { w: 116, h: 34, fonte: 16 }, nomeSetas: 17, legenda: { y: 704, fonte: 21 } as { y: number; fonte: number } | null },
  estreito: { w: 420, h: 606, msg: { x: 14, y: 12, w: 392, fonte: 19 }, cartao: { x: 210, y: 78 }, inicio: { x: 210, y: 118 },
    decide: { x: 70, y: 152, w: 280, h: 74, fonte: 25, sub: 17 }, balcao: { y: 296, w: 96, h: 92, passo: 100, x0: 12, fonte: 17, sub: 13 },
    fim: { x: 210, y: 438 }, ficha: { x: 14, y: 474, w: 392, h: 124, fonte: 17, titulo: 13 }, pilula: { w: 100, h: 32, fonte: 17 },
    token: { w: 96, h: 30, fonte: 14 }, nomeSetas: 15, legenda: null },
} satisfies Record<Desenho, unknown>;

/** em que cena e em que segundo dela o vídeo está */
const cenaEm = (t: number) => {
  const i = CENAS.findIndex((c) => t < c.ate);
  const k = i < 0 ? CENAS.length - 1 : i;
  return { k, v: t - CENAS[k].de };
};

// onde a mensagem está: parada num ponto, ou entre dois, pelos tempos [segundo, ponto]
const ondeEsta = (v: number, rota: [number, Ponto][]): Ponto => {
  const i = rota.findIndex(([em]) => v < em);
  if (i === 0) return rota[0][1];
  if (i < 0) return rota[rota.length - 1][1];
  const [ea, pa] = rota[i - 1], [eb, pb] = rota[i];
  const q = kf(v, [[ea, 0], [eb, 1]], suave);
  return { x: pa.x + (pb.x - pa.x) * q, y: pa.y + (pb.y - pa.y) * q };
};

export const RoteiroAnimado: React.FC<Props> = ({ roteiro: r, escolha, desenho }) => {
  const M = MEDIDAS[desenho];
  const D = M.decide, B = M.balcao;
  const bx = (i: number) => B.x0 + i * B.passo;
  const meioDecide: Ponto = { x: D.x + D.w / 2, y: D.y + D.h / 2 };
  const meioBalcao = (i: number): Ponto => ({ x: bx(i) + B.w / 2, y: B.y + B.h / 2 });
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { k, v } = cenaEm(t);
  const grafo = kf(t, [[CENAS[3].de + 0.3, 0], [CENAS[3].de + 1.3, 1]]); // a última cena: o roteiro vira grafo
  const [a, b] = r.mensagens;
  const msg = k >= 2 ? b : a;
  const ia = r.balcoes.findIndex((x) => x.id === a.balcao), ib = r.balcoes.findIndex((x) => x.id === b.balcao);

  /* os tempos de cada cena (em segundos dentro dela): a mensagem entra, decide, vai ao balcão e ao fim */
  const T: Record<string, number> = k === 0 ? { entra: 2.2 } : k === 1 ? { decide: 0.6, chega: 2.4, some: 4.6 } : k === 2 ? { entra: 1.4, decide: 1.5, chega: 2.8, some: 4.2 } : {};
  const rota: [number, Ponto][] = k === 0 ? [[0.4, M.cartao], [1.2, M.inicio], [2.2, meioDecide]]
    : k === 1 ? [[0.9, meioDecide], [2.4, meioBalcao(ia)], [3.0, meioBalcao(ia)], [3.9, M.fim]]
    : k === 2 ? [[0.6, M.cartao], [1.0, M.inicio], [1.4, meioDecide], [1.6, meioDecide], [2.8, meioBalcao(ib)], [3.2, meioBalcao(ib)], [3.9, M.fim]] : [];
  const token = rota.length ? ondeEsta(v, rota) : null;
  const tokenOpa = k === 0 ? kf(v, [[0.2, 0], [0.4, 1]]) : k === 1 ? kf(v, [[T.some - 0.4, 1], [T.some, 0]]) : k === 2 ? kf(v, [[0.4, 0], [0.6, 1], [T.some - 0.3, 1], [T.some, 0]]) : 0;

  // o caminho aceso agora, e o balcão onde a mensagem chegou
  const ativo = k === 1 ? ia : k === 2 ? ib : -1;
  const chegou = (k === 1 || k === 2) && v >= T.chega;
  const decidindo = (k === 0 && v >= T.entra) || (k === 1 && v < T.decide) || (k === 2 && v >= T.entra && v < T.decide);

  // a ficha: o que já se sabe da mensagem de agora
  const balcaoDe = k >= 2 ? b.balcao : a.balcao;
  const b0 = r.balcoes.find((x) => x.id === balcaoDe)!;
  const temPergunta = (k === 0 && v >= T.entra) || k === 1 || (k === 2 && v >= T.entra) || k === 3;
  const temDecisao = ((k === 1 || k === 2) && v >= T.decide) || k === 3;
  const temResposta = chegou || k === 3;
  const resposta = b0.modelo === "não" ? "frase fixa, sem chamar o modelo" : "escrita pelo modelo";
  const limite = desenho === "largo" ? 46 : 34;
  const pergunta = curta(msg.pergunta);

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
        borderRadius: 14, background: cor.papel, opacity: k === 3 ? 0.4 : k === 2 ? kf(v, [[0, 0], [0.5, 1]]) : 1,
        font: `italic ${M.msg.fonte}px/1.35 ${ui}`, color: cor.texto }}>“{pergunta}”</div>

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
        {r.balcoes.map((_, i) => seta(meioDecide.x, D.y + D.h, meioBalcao(i).x, B.y, i === ativo, ativo >= 0 && i !== ativo, `ida-${i}`))}
        {r.balcoes.map((_, i) => seta(meioBalcao(i).x, B.y + B.h, M.fim.x, M.fim.y - M.pilula.h / 2, i === ativo && chegou, ativo >= 0 && i !== ativo, `fim-${i}`))}
      </svg>

      {/* o início e o fim */}
      {[{ p: M.inicio, texto: "início" }, { p: M.fim, texto: "fim" }].map(({ p, texto }) => (
        <div key={texto} style={{ position: "absolute", left: p.x - M.pilula.w / 2, top: p.y - M.pilula.h / 2, width: M.pilula.w, height: M.pilula.h, borderRadius: M.pilula.h / 2,
          border: `2px solid ${cor.linha}`, background: cor.papel, display: "flex", alignItems: "center", justifyContent: "center", font: `600 ${M.pilula.fonte}px ${ui}`, color: cor.fraco }}>{texto}</div>
      ))}

      {/* o substituto, que vira o nó que decide */}
      {caixa(D.x, D.y, D.w, D.h, decidindo ? cor.acento : cor.linha, 1, <>
        {troca("o substituto", r.rotuloDecide, D.fonte)}
        {troca("lê a mensagem e decide", "o modelo decide", D.sub, 400, cor.fraco)}
      </>)}

      {/* os balcões, que viram os nós dos caminhos */}
      {r.balcoes.map((x, i) => {
        const aqui = i === ativo;
        const borda = aqui && chegou ? cor.ok : aqui ? cor.acento : cor.linha;
        return <div key={x.id}>{caixa(bx(i), B.y, B.w, B.h, borda, ativo >= 0 && !aqui ? 0.45 : 1, <>
          {troca(x.rotulo, x.id.replace(/_/g, "_\u200b"), x.rotulo.length > 12 ? B.fonte - 3 : B.fonte)}
          <div style={{ font: `400 ${B.sub}px/1.2 ${ui}`, color: cor.fraco, opacity: grafo, marginTop: 2 }}>{x.modelo === "não" ? "frase fixa" : "o modelo escreve"}</div>
        </>)}</div>;
      })}

      {/* as setas que escolhem, nomeadas quando o roteiro vira grafo */}
      <div style={{ position: "absolute", left: 0, width: M.w, top: D.y + D.h + 10, textAlign: "center", opacity: grafo, font: `600 ${M.nomeSetas}px ${ui}`, color: cor.acento }}>
        as setas que escolhem: um caminho só
      </div>

      {/* a mensagem andando */}
      {token ? <div style={{ position: "absolute", left: token.x - M.token.w / 2, top: token.y - M.token.h / 2, width: M.token.w, height: M.token.h, borderRadius: M.token.h / 2,
        background: cor.acento, opacity: tokenOpa, display: "flex", alignItems: "center", justifyContent: "center", font: `700 ${M.token.fonte}px ${ui}`, color: cor.papel }}>mensagem</div> : null}

      {/* a ficha, que vira o estado */}
      <div style={{ position: "absolute", left: M.ficha.x, top: M.ficha.y, width: M.ficha.w, height: M.ficha.h, boxSizing: "border-box", padding: "8px 16px",
        border: `2px dashed ${grafo > 0.5 ? cor.acento : cor.linha}`, borderRadius: 14, background: cor.papel,
        display: "grid", alignContent: "center", gap: 2, font: `400 ${M.ficha.fonte}px/1.35 ${ui}`, color: cor.texto }}>
        <div style={{ display: "grid" }}>
          <b style={{ gridArea: "1 / 1", opacity: 1 - grafo, font: `700 ${M.ficha.titulo}px ${mono}`, letterSpacing: ".06em", textTransform: "uppercase", color: cor.fraco }}>a ficha que vai junto</b>
          <b style={{ gridArea: "1 / 1", opacity: grafo, font: `700 ${M.ficha.titulo}px ${mono}`, letterSpacing: ".06em", textTransform: "uppercase", color: cor.acento }}>o estado: de nó em nó</b>
        </div>
        <div><span style={{ color: cor.fraco }}>pergunta:</span> {temPergunta ? `${pergunta.slice(0, limite)}${pergunta.length > limite ? "…" : ""}` : "—"}</div>
        <div><span style={{ color: cor.fraco }}>decisão:</span> {temDecisao ? <b style={{ color: cor.ok }}>{rotulo(r, balcaoDe)}</b> : "—"}</div>
        <div><span style={{ color: cor.fraco }}>resposta:</span> {temResposta ? resposta : "—"}</div>
      </div>

      {/* a legenda da cena (no desenho largo) e, no primeiro caminho, o balcão que o leitor escolheu */}
      {M.legenda ? (
        <div style={{ position: "absolute", left: M.msg.x, width: M.msg.w, top: M.legenda.y, display: "grid", gap: 6 }}>
          <div style={{ font: `${M.legenda.fonte}px/1.38 ${ui}`, color: cor.texto, opacity: k === 0 ? 1 : kf(v, [[0, 0], [0.4, 1]]) }}>{legenda(r, k)}</div>
          {k === 1 && escolha && chegou ? <Veredito r={r} escolha={escolha} certa={a.balcao} fonte={18} /> : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/** se o leitor escolheu o balcão do contrato */
export const Veredito = ({ r, escolha, certa, fonte }: { r: Roteiro; escolha: string; certa: string; fonte: number }) => (
  <div style={{ font: `600 ${fonte}px ${ui}`, color: escolha === certa ? cor.ok : cor.aviso }}>
    {escolha === certa ? "✓ o balcão que você escolheu" : `você escolheu ${rotulo(r, escolha)}; o contrato manda ${rotulo(r, certa)}`}
  </div>
);
