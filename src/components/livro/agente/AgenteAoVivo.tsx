/**
 * Figura do agente funcionando, em vídeo (Remotion; docs/capacidades/figura-do-agente.md, etapa 6): a conversa por fora,
 * como num aplicativo de mensagens, e o grafo por dentro. Os cenários chegam conferidos contra o contrato
 * (cenarios.ts); o mesmo cliente segue na mesma conversa. Sem controles no quadro: tocar e pausar são da ilha
 * (FiguraAgenteVideo.tsx). O Studio do my-video importa esta composição.
 */
import { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { DECISOES, type Escolha, FERRAMENTAS } from "./cenarios";
import { ARESTA, type Cena, iniciais, type Montado, montar, type Props, type Seg, TRANSICAO } from "./tempos";

export { type Props, quadroDoVideo } from "./tempos";

const ui = '"IBM Plex Sans", "Segoe UI", system-ui, sans-serif';
const mono = '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace';

// As cores do palco (poc_livro, palco/palco.css); cada decisão tem a sua.
const c = {
  fundo: "#111318",
  chao: "#15181e",
  cartao: "#1c2028",
  cartao2: "#232833",
  linha: "#2c323d",
  texto: "#e7e9ee",
  fraco: "#8e95a3",
  apagado: "#5b6270",
  pontos: "#262b35",
  acento: "#5aa9ff",
  acentoFundo: "rgba(90, 169, 255, 0.14)",
  acentoGasto: "#4574a8",
  meu: "#24426e",
  meuNome: "#a9c2e6",
};
const COR: Record<Escolha, string> = { responder: "#2fd394", recusar: "#ffb547", abrir_chamado: "#5fd3e6", passar: "#c6a2ff" };
const tinta = (cor: string, alfa: number) => `${cor}${Math.round(alfa * 255).toString(16).padStart(2, "0")}`;

// Os ícones da figura do livro (palco/Palco.tsx).
const IC = {
  pessoa: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
  agente: "M12 3v3m-6 3h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Zm3 4h.01M15 13h.01M9 17h6",
  pedidos: "M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Zm0 0 8 4.5m0 0 8-4.5M12 12v9",
  politica: "M7 3h7l5 5v13H7V3Zm7 0v5h5M10 13h6m-6 4h6",
  catalogo: "M3 12V4h8l10 10-8 8L3 12Zm5-4h.01",
  resposta: "M4 5h16v11H9l-5 4V5Z",
  equipe: "M4 14v-2a8 8 0 0 1 16 0v2m-16 0h3v5H4v-5Zm13 0h3v5h-3v-5Z",
  certo: "M5 12.5 10 17 19 7",
  enviar: "M4 12 20 4l-4 16-4-7-8-1Zm8 1 8-9",
};
const Icone: React.FC<{ d: string; tam?: number; cor?: string }> = ({ d, tam = 18, cor = "currentColor" }) => (
  <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const suave = Easing.bezier(0.16, 1, 0.3, 1);
const kf = (t: number, pontos: [number, number][], easing = suave) =>
  interpolate(
    t,
    pontos.map((p) => p[0]),
    pontos.map((p) => p[1]),
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing },
  );
const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};


/* ---------- o relógio: que cenário está na tela, e em que ponto dele ---------- */

type Quadro = { k: number; idx: number; cena: Cena; v: number; grafo: number; chat: number };
// Na transição, a primeira metade mostra o cenário que acabou sumindo; a segunda, o novo aparecendo.
const quadro = (m: Montado, t: number): Quadro => {
  const k = Math.max(0, m.cenas.filter((x) => x.inicio <= t).length - 1);
  const atual = m.cenas[k];
  const dentro = t - atual.inicio;
  const meio = TRANSICAO / 2;
  const troca = k === 0 || m.cenas[k - 1].conversa !== atual.conversa;
  if (k > 0 && dentro < meio) {
    const ant = m.cenas[k - 1];
    const sai = 1 - dentro / meio;
    return { k, idx: k - 1, cena: ant, v: ant.fim - ant.inicio - TRANSICAO, grafo: sai, chat: troca ? sai : 1 };
  }
  const entra = kf(dentro, [[meio, 0], [TRANSICAO, 1]], Easing.linear);
  return { k, idx: k, cena: atual, v: dentro - TRANSICAO, grafo: entra, chat: troca ? entra : 1 };
};

// O passo em andamento, e o estado de cada nó e de cada seta nele.
const segAtual = (cena: Cena, v: number) => cena.segs.filter((s) => s.de <= v).pop();
const noDoSeg = (s: Seg) => (s.no === "pergunta" ? "cliente" : s.no);
type EstadoNo = "fora" | "espera" | "ativo" | "feito";
const estadoNo = (cena: Cena, v: number, no: string): EstadoNo => {
  const primeiro = cena.segs.find((s) => noDoSeg(s) === no);
  if (!primeiro) return no === "cliente" || no === "agente" || no === "decisao" ? "espera" : "fora";
  const s = segAtual(cena, v);
  const comeca = (x: Seg) => (x.no === "pergunta" ? x.envia! : x.trajeto ? x.de + ARESTA : x.de);
  if (s && s.no !== "conversa" && noDoSeg(s) === no && v >= comeca(s)) return "ativo";
  return v >= comeca(primeiro) ? "feito" : "espera";
};
const progressoAresta = (cena: Cena, v: number, id: string) => {
  const s = cena.segs.find((x) => x.trajeto === id);
  if (!s || v < s.de) return -1;
  return Math.min((v - s.de) / ARESTA, 1);
};

/* ---------- a barra de cima: os cenários ---------- */

const Topo: React.FC<{ m: Montado; q: Quadro }> = ({ m, q }) => (
  <div
    style={{
      position: "absolute",
      inset: "0 0 auto 0",
      height: 64,
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      borderBottom: `1px solid ${c.linha}`,
    }}
  >
    {m.cenas.map((x, i) => {
      const agora = i === q.k;
      const cor = COR[x.decisao];
      return (
        <div
          key={x.caso}
          style={{
            height: 40,
            padding: "0 16px",
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            gap: 9,
            fontSize: 17,
            fontWeight: 600,
            border: `1.5px solid ${agora ? cor : c.linha}`,
            backgroundColor: agora ? tinta(cor, 0.14) : "transparent",
            color: agora ? c.texto : i < q.k ? c.fraco : c.apagado,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: cor, opacity: agora ? 1 : 0.6 }} />
          {DECISOES[x.decisao]}
        </div>
      );
    })}
    <span style={{ marginLeft: "auto", fontFamily: mono, fontSize: 14, letterSpacing: 2, color: c.apagado }}>
      SIMULAÇÃO · {m.cenas[q.k].caso}
    </span>
  </div>
);

/* ---------- a conversa ---------- */

// Uma mensagem entrando: abre espaço, empurrando as de cima, e aparece subindo.
const Entra: React.FC<{ em: number; v: number; lado: "esq" | "dir" | "meio"; children: React.ReactNode }> = ({ em, v, lado, children }) => (
  <div
    style={{
      alignSelf: lado === "esq" ? "flex-start" : lado === "dir" ? "flex-end" : "center",
      maxWidth: "82%",
      maxHeight: kf(v, [[em, 0], [em + 0.35, 420]]),
      opacity: kf(v, [[em, 0], [em + 0.25, 1]]),
      translate: `0px ${kf(v, [[em, 10], [em + 0.35, 0]])}px`,
      flex: "none",
    }}
  >
    {children}
  </div>
);

const Pontinhos: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ display: "flex", gap: 6, padding: "17px 18px", borderRadius: 18, borderBottomLeftRadius: 5, backgroundColor: c.cartao2 }}>
    {[0, 1, 2].map((i) => {
      const fase = Math.max(0, Math.sin(t * 5.7 - i * 0.9));
      return <span key={i} style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: c.fraco, opacity: 0.45 + 0.55 * fase, translate: `0px ${-5 * fase}px` }} />;
    })}
  </div>
);

const Mensagens: React.FC<{ m: Montado; q: Quadro; t: number }> = ({ m, q, t }) => {
  const daConversa = m.cenas.filter((x, j) => x.conversa === q.cena.conversa && j <= q.idx);
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        gap: 12,
        padding: "16px 18px",
        opacity: q.chat,
      }}
    >
      {daConversa.map((x) => {
        const v = x === q.cena ? q.v : Infinity;
        const pergunta = x.segs.find((s) => s.no === "pergunta")!;
        const recebe = x.segs.find((s) => s.trajeto === "cliente-agente")!;
        const lida = v >= recebe.de + ARESTA;
        const cor = COR[x.decisao];
        return (
          <div key={x.caso} style={{ display: "contents" }}>
            {v >= pergunta.envia! ? (
              <Entra em={pergunta.envia!} v={v} lado="dir">
                <div style={{ padding: "11px 15px 9px", borderRadius: 18, borderBottomRightRadius: 5, backgroundColor: c.meu }}>
                  {x.nome !== "cliente" ? <div style={{ fontSize: 14, color: c.meuNome, marginBottom: 3 }}>{x.nome}</div> : null}
                  <div style={{ fontSize: 21, lineHeight: 1.4, overflowWrap: "anywhere" }}>{x.pergunta}</div>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 2, color: lida ? c.acento : c.meuNome }}>
                    <Icone d={IC.certo} tam={15} />
                    {lida ? <span style={{ marginLeft: -9 }}><Icone d={IC.certo} tam={15} /></span> : null}
                  </div>
                </div>
              </Entra>
            ) : null}
            {v >= x.digitando && v < x.responde ? (
              <Entra em={x.digitando} v={v} lado="esq">
                <Pontinhos t={t} />
              </Entra>
            ) : null}
            {v >= x.responde ? (
              <Entra em={x.responde} v={v} lado="esq">
                <div style={{ padding: "11px 15px 12px", borderRadius: 18, borderBottomLeftRadius: 5, backgroundColor: c.cartao2, borderLeft: `3px solid ${cor}` }}>
                  <div style={{ fontSize: 14, color: cor, marginBottom: 3 }}>agente</div>
                  <div style={{ fontSize: 21, lineHeight: 1.4 }}>{x.resposta}</div>
                </div>
              </Entra>
            ) : null}
            {x.sistema !== undefined && v >= x.sistema ? (
              <Entra em={x.sistema} v={v} lado="meio">
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 14,
                    color: COR.passar,
                    border: `1px dashed ${tinta(COR.passar, 0.5)}`,
                    borderRadius: 999,
                    padding: "5px 14px",
                    whiteSpace: "nowrap",
                  }}
                >
                  conversa transferida para a equipe
                </div>
              </Entra>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

// A caixa de escrever: o cliente digita aqui antes de enviar.
const Escrever: React.FC<{ q: Quadro; t: number }> = ({ q, t }) => {
  const pergunta = q.cena.segs.find((s) => s.no === "pergunta")!;
  const v = q.v;
  const digitando = v >= 0.25 && v < pergunta.envia!;
  const letras = Math.floor(kf(v, [[0.25, 0], [pergunta.envia!, q.cena.pergunta.length]], Easing.linear));
  const texto = digitando ? q.cena.pergunta.slice(0, letras) : "";
  return (
    <div
      style={{
        margin: "0 18px 18px",
        padding: "13px 16px 13px 20px",
        minHeight: 56,
        borderRadius: 28,
        backgroundColor: c.cartao,
        display: "flex",
        alignItems: "flex-end",
        gap: 12,
        opacity: q.chat,
      }}
    >
      <div style={{ flex: 1, fontSize: 19, lineHeight: 1.4, color: texto ? c.texto : c.apagado, overflowWrap: "anywhere" }}>
        {texto || "Escreva uma mensagem…"}
        {digitando ? <span style={{ display: "inline-block", width: 2, height: 22, marginLeft: 1, verticalAlign: -4, backgroundColor: c.acento, opacity: Math.floor(t * 3) % 2 ? 1 : 0.2 }} /> : null}
      </div>
      <span
        style={{
          flex: "none",
          width: 32,
          height: 32,
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: texto ? c.acento : "transparent",
          color: texto ? c.fundo : c.apagado,
        }}
      >
        <Icone d={IC.enviar} tam={18} />
      </span>
    </div>
  );
};

const Conversa: React.FC<{ m: Montado; q: Quadro; t: number }> = ({ m, q, t }) => {
  const daConversa = m.cenas.filter((x, j) => x.conversa === q.cena.conversa && j <= q.idx);
  const digitando = daConversa.some((x) => {
    const v = x === q.cena ? q.v : Infinity;
    return v >= x.digitando && v < x.responde;
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 64,
        width: 400,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        backgroundColor: c.chao,
        borderRight: `1px solid ${c.linha}`,
      }}
    >
      <div style={{ height: 76, flex: "none", padding: "0 20px", display: "flex", alignItems: "center", gap: 14, borderBottom: `1px solid ${c.linha}` }}>
        <span
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            background: "linear-gradient(135deg, #2fd394, #1f8f66)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            fontSize: 18,
            color: "#0c1a14",
          }}
        >
          {iniciais(m.loja)}
        </span>
        <div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>{m.loja}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 15, color: digitando ? COR.responder : c.fraco }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COR.responder }} />
            {digitando ? <i>digitando…</i> : "atendimento"}
          </div>
        </div>
      </div>
      <Mensagens m={m} q={q} t={t} />
      <Escrever q={q} t={t} />
    </div>
  );
};

/* ---------- o grafo ---------- */

type Caixa = { x: number; y: number; w: number; h: number };
const G: Record<string, Caixa> = {
  cliente: { x: 424, y: 190, w: 180, h: 66 },
  agente: { x: 640, y: 100, w: 320, h: 290 },
  grupo: { x: 1000, y: 100, w: 256, h: 290 },
  pedidos: { x: 1016, y: 150, w: 224, h: 60 },
  politica: { x: 1016, y: 222, w: 224, h: 60 },
  catalogo: { x: 1016, y: 294, w: 224, h: 60 },
  decisao: { x: 640, y: 430, w: 616, h: 110 },
  resposta: { x: 640, y: 590, w: 288, h: 60 },
  pessoa: { x: 968, y: 590, w: 288, h: 60 },
};
const centroY = (no: string) => G[no].y + G[no].h / 2;
const ARESTAS: Record<string, [number, number, number, number]> = {
  "cliente-agente": [604, 223, 640, 223],
  ...Object.fromEntries(
    FERRAMENTAS.flatMap((f) => [
      [`agente-${f}`, [960, centroY(f) - 9, 1016, centroY(f) - 9]],
      [`${f}-agente`, [1016, centroY(f) + 9, 960, centroY(f) + 9]],
    ]),
  ),
  "agente-decisao": [800, 390, 800, 430],
  "decisao-resposta": [784, 540, 784, 590],
  "decisao-pessoa": [1112, 540, 1112, 590],
};

const Setas: React.FC<{ q: Quadro }> = ({ q }) => (
  <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
    {Object.entries(ARESTAS).map(([id, [x1, y1, x2, y2]]) => {
      const p = progressoAresta(q.cena, q.v, id);
      const px = x1 + (x2 - x1) * Math.max(p, 0);
      const py = y1 + (y2 - y1) * Math.max(p, 0);
      const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
      const feita = p >= 1;
      const cor = feita ? c.acentoGasto : c.acento;
      return (
        <g key={id}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.linha} strokeWidth={1.8} strokeDasharray="4 5" />
          {p >= 0 ? <line x1={x1} y1={y1} x2={px} y2={py} stroke={cor} strokeWidth={2.6} strokeLinecap="round" opacity={q.grafo} /> : null}
          <polygon points="0,0 -8,-4.5 -8,4.5" transform={`translate(${x2} ${y2}) rotate(${ang})`} fill={p >= 0 ? cor : c.linha} />
          {p > 0 && p < 1 ? (
            <circle cx={px} cy={py} r={6} fill="#fff" stroke={c.acento} strokeWidth={3} style={{ filter: `drop-shadow(0 0 6px ${c.acento})` }} />
          ) : null}
        </g>
      );
    })}
  </svg>
);

// O contorno de cada nó, conforme o estado: apagado, à espera, ativo (brilha) ou já visitado.
const estiloNo = (e: EstadoNo, caixa: Caixa, cor?: string): React.CSSProperties => ({
  position: "absolute",
  left: caixa.x,
  top: caixa.y,
  width: caixa.w,
  height: caixa.h,
  borderRadius: 14,
  backgroundColor: c.cartao,
  border: `1.5px solid ${cor && e !== "espera" && e !== "fora" ? cor : e === "ativo" ? c.acento : c.linha}`,
  boxShadow:
    e === "ativo"
      ? `0 0 0 5px ${cor ? tinta(cor, 0.16) : c.acentoFundo}, 0 0 30px ${cor ? tinta(cor, 0.3) : "rgba(90, 169, 255, 0.28)"}`
      : cor && e === "feito"
        ? `0 0 0 5px ${tinta(cor, 0.12)}`
        : "none",
  opacity: e === "fora" ? 0.32 : e === "espera" ? 0.8 : 1,
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "0 16px",
  boxSizing: "border-box",
});
const Ic: React.FC<{ d: string; e: EstadoNo; cor?: string }> = ({ d, e, cor }) => (
  <span
    style={{
      flex: "none",
      width: 36,
      height: 36,
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: e === "ativo" ? tinta(cor ?? c.acento, 0.16) : c.cartao2,
      color: e === "ativo" ? (cor ?? c.acento) : e === "feito" ? (cor ?? c.texto) : c.fraco,
    }}
  >
    <Icone d={d} tam={20} />
  </span>
);

const NoCliente: React.FC<{ q: Quadro }> = ({ q }) => {
  const e = estadoNo(q.cena, q.v, "cliente");
  return (
    <div style={estiloNo(e, G.cliente)}>
      <Ic d={IC.pessoa} e={e} />
      <div style={{ lineHeight: 1.2 }}>
        <div style={{ fontSize: 14, color: c.fraco }}>cliente</div>
        <div style={{ fontSize: 19, fontWeight: 600, whiteSpace: "nowrap" }}>{q.cena.nome}</div>
      </div>
    </div>
  );
};

const NoAgente: React.FC<{ q: Quadro; t: number }> = ({ q, t }) => {
  const e = estadoNo(q.cena, q.v, "agente");
  // o que ele já sabe: a pergunta, e o que cada ferramenta devolveu, na hora em que volta
  const memoria = q.cena.segs.flatMap((s) => {
    if (s.trajeto === "cliente-agente") return [{ texto: `a pergunta de ${q.cena.nome === "cliente" ? "quem escreveu" : q.cena.nome.split(" ")[0]}`, em: s.de + ARESTA }];
    return s.viu ? [{ texto: s.viu, em: s.de + ARESTA }] : [];
  });
  const marca = q.cena.segs.find((s) => s.marca);
  const cor = COR[q.cena.decisao];
  const pontos = ".".repeat(1 + (Math.floor(t * 3) % 3));
  return (
    <div style={{ ...estiloNo(e, G.agente), flexDirection: "column", alignItems: "stretch", gap: 8, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Ic d={IC.agente} e={e} />
        <b style={{ fontSize: 19 }}>agente</b>
        {e === "ativo" ? <span style={{ marginLeft: "auto", fontFamily: mono, fontSize: 15, color: c.acento }}>pensando{pontos}</span> : null}
      </div>
      <div style={{ fontFamily: mono, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", color: c.apagado }}>o que ele já sabe</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        {memoria.some((x) => q.v >= x.em) ? (
          memoria
            .filter((x) => q.v >= x.em)
            .map((x) => (
              <div
                key={x.texto}
                style={{
                  fontSize: 17,
                  lineHeight: 1.35,
                  padding: "5px 10px",
                  borderRadius: 7,
                  backgroundColor: c.cartao2,
                  color: "#cfd4dc",
                  opacity: kf(q.v, [[x.em, 0], [x.em + 0.3, 1]]),
                  translate: `${kf(q.v, [[x.em, -10], [x.em + 0.4, 0]])}px 0px`,
                }}
              >
                {x.texto}
              </div>
            ))
        ) : (
          <div style={{ fontSize: 17, color: c.apagado }}>nada ainda</div>
        )}
      </div>
      {marca && q.v >= marca.de + ARESTA + 0.2 ? (
        <span
          style={{
            alignSelf: "flex-start",
            fontSize: 16,
            fontWeight: 600,
            color: cor,
            backgroundColor: tinta(cor, 0.16),
            border: `1.5px solid ${cor}`,
            borderRadius: 8,
            padding: "3px 11px",
            opacity: kf(q.v, [[marca.de + ARESTA + 0.2, 0], [marca.de + ARESTA + 0.45, 1]]),
            scale: kf(q.v, [[marca.de + ARESTA + 0.2, 0.85], [marca.de + ARESTA + 0.5, 1]], Easing.bezier(0.34, 1.56, 0.64, 1)),
          }}
        >
          {marca.marca}
        </span>
      ) : null}
    </div>
  );
};

const NoFerramenta: React.FC<{ q: Quadro; id: string; nome: string; icone: string; t: number }> = ({ q, id, nome, icone, t }) => {
  const e = estadoNo(q.cena, q.v, id);
  return (
    <div style={{ ...estiloNo(e, G[id]), padding: "0 14px" }}>
      <Ic d={icone} e={e} />
      <b style={{ fontSize: 18, fontWeight: 600 }}>{nome}</b>
      {e === "feito" ? (
        <span style={{ marginLeft: "auto", color: COR.responder, display: "flex" }}>
          <Icone d={IC.certo} tam={18} />
        </span>
      ) : null}
      {e === "ativo" ? (
        <span
          style={{
            marginLeft: "auto",
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: c.acento,
            boxShadow: `0 0 10px ${c.acento}`,
            opacity: 0.35 + 0.65 * Math.abs(Math.sin(t * Math.PI)),
          }}
        />
      ) : null}
    </div>
  );
};

const NoDecisao: React.FC<{ q: Quadro }> = ({ q }) => {
  const e = estadoNo(q.cena, q.v, "decisao");
  const s = q.cena.segs.find((x) => x.no === "decisao")!;
  const escolhe = s.de + ARESTA + 0.2;
  const sub = e === "ativo" ? "o contrato decide" : e === "feito" ? "decidido" : "quatro saídas possíveis";
  return (
    <div style={{ ...estiloNo(e, G.decisao), flexDirection: "column", alignItems: "stretch", justifyContent: "center", gap: 12, padding: "12px 16px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <b style={{ fontSize: 19 }}>decisão</b>
        <span style={{ fontFamily: mono, fontSize: 14, color: c.fraco }}>{sub}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {(Object.keys(DECISOES) as Escolha[]).map((k) => {
          const escolhida = k === q.cena.decisao ? kf(q.v, [[escolhe, 0], [escolhe + 0.35, 1]]) : 0;
          return (
            <span
              key={k}
              style={{
                height: 44,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 17,
                fontWeight: 500,
                whiteSpace: "nowrap",
                border: `1.5px solid ${interpolateColors(escolhida, [0, 1], [c.linha, COR[k]])}`,
                backgroundColor: tinta(COR[k], 0.22 * escolhida),
                color: interpolateColors(escolhida, [0, 1], [c.fraco, c.texto]),
                boxShadow: `0 0 18px ${tinta(COR[k], 0.35 * escolhida)}`,
              }}
            >
              {DECISOES[k]}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const NoSaida: React.FC<{ q: Quadro; id: "resposta" | "pessoa" }> = ({ q, id }) => {
  const e = estadoNo(q.cena, q.v, id);
  const cor = COR[q.cena.decisao];
  return (
    <div style={estiloNo(e, G[id], cor)}>
      <Ic d={id === "resposta" ? IC.resposta : IC.equipe} e={e} cor={cor} />
      <b style={{ fontSize: 18, fontWeight: 600 }}>{id === "resposta" ? "resposta ao cliente" : "pessoa da equipe"}</b>
    </div>
  );
};

// Uma linha embaixo do grafo dizendo o que o agente está fazendo (o texto do roteiro do livro).
const Legenda: React.FC<{ q: Quadro }> = ({ q }) => {
  const s = q.cena.segs.filter((x) => x.de <= q.v && !["pergunta", "cliente", "conversa", "resposta", "pessoa"].includes(x.no)).pop();
  if (!s) return null;
  return (
    <div
      key={`${q.cena.caso}-${s.de}`}
      style={{
        position: "absolute",
        left: 424,
        right: 24,
        top: 670,
        fontSize: 17,
        color: c.fraco,
        textAlign: "center",
        opacity: kf(q.v, [[s.de, 0], [s.de + 0.3, 1]]) * q.grafo,
      }}
    >
      {s.texto}
    </div>
  );
};

const Grafo: React.FC<{ q: Quadro; t: number }> = ({ q, t }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: 400,
        top: 64,
        right: 0,
        bottom: 0,
        backgroundColor: c.fundo,
        backgroundImage: `radial-gradient(${c.pontos} 1.2px, transparent 1.2px)`,
        backgroundSize: "22px 22px",
      }}
    />
    <div style={{ position: "absolute", left: G.grupo.x, top: G.grupo.y, width: G.grupo.w, height: G.grupo.h, borderRadius: 16, border: `1.5px dashed ${c.linha}`, backgroundColor: "rgba(255, 255, 255, 0.015)" }} />
    <div style={{ position: "absolute", left: G.grupo.x + 16, top: G.grupo.y + 14, fontFamily: mono, fontSize: 13, letterSpacing: 1.5, color: c.apagado }}>FERRAMENTAS</div>
    <Setas q={q} />
    <div style={{ opacity: 0.55 + 0.45 * q.grafo }}>
      <NoCliente q={q} />
      <NoAgente q={q} t={t} />
      <NoFerramenta q={q} id="pedidos" nome="pedidos" icone={IC.pedidos} t={t} />
      <NoFerramenta q={q} id="politica" nome="política" icone={IC.politica} t={t} />
      <NoFerramenta q={q} id="catalogo" nome="catálogo" icone={IC.catalogo} t={t} />
      <NoDecisao q={q} />
      <NoSaida q={q} id="resposta" />
      <NoSaida q={q} id="pessoa" />
    </div>
    <Legenda q={q} />
  </>
);

export const AgenteAoVivo: React.FC<Props> = ({ cenarios, loja }) => {
  const m = useMemo(() => montar({ cenarios, loja }), [cenarios, loja]);
  const t = useT();
  const q = quadro(m, t);
  return (
    <AbsoluteFill style={{ backgroundColor: c.fundo, color: c.texto, fontFamily: ui }}>
      <Grafo q={q} t={t} />
      <Conversa m={m} q={q} t={t} />
      <Topo m={m} q={q} />
    </AbsoluteFill>
  );
};
