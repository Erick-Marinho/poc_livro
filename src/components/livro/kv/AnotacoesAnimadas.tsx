/**
 * O modelo com e sem as anotações (Remotion; docs/capacidades/experimento-kv-cache.md; esboço em
 * figuras/esboco-anotacoes.md), em "O que vamos construir". O modelo lê a mensagem uma vez e anota cada palavra, com a
 * palavra escrita na anotação; a leitura dá a primeira palavra da resposta. Com as anotações, cada palavra nova lê só
 * a última e consulta todas (sem dizer quanto isso custa: é o palpite). Sem elas, relê a mensagem inteira a cada
 * palavra. As anotações se repetem em cada camada e enchem a memória. O medidor cronometra a pausa e cada palavra, e o
 * quadro final são as quatro medições. Os textos saem de kv.ts e de figuras/kv.json; os tamanhos são ilustração.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, kf, mono, suave, ui } from "../palco/video";
import { ANOTACOES as F, ESCREVE, type Kv, LEITURA, passoEm } from "./kv.ts";
import { BalaoDaCena, Cabecalho, cenaEm, type Desenho, MEDIDAS, Resumos } from "./pecas";

export type Props = { kv: Kv; desenho: Desenho };

const preenchido = "color-mix(in srgb, var(--acento, #2a4fb5) 22%, transparent)";
const forte = "color-mix(in srgb, var(--acento, #2a4fb5) 45%, transparent)";
const rotulo = (texto: string, c: string = cor.fraco) => <div style={{ font: `700 11px ${mono}`, letterSpacing: ".05em", color: c }}>{texto}</div>;
const CAMADAS = ["camada 1", "camada 2", "camada 3", "⋮ até a última"];

export const AnotacoesAnimadas: React.FC<Props> = ({ kv: p, desenho }) => {
  const M = MEDIDAS[desenho];
  const t = useCurrentFrame() / useVideoConfig().fps;
  const k = cenaEm(F, t);
  const de = (n: number) => F.cenas[n].de;
  const s = t - de(k);   // o tempo dentro da cena
  const largo = desenho === "largo";
  const X = M.x, W = M.aw;
  const n = p.resposta.length, L = p.lidas.length;
  const Y = largo ? { resposta: 112, passo: 154, anotacoes: 186, resumos: 330 } : { resposta: 160, passo: 252, anotacoes: 300, resumos: 480 };

  /* a leitura (cena 1): quantas palavras da mensagem já foram lidas, e a que está sendo lida */
  const lidasAte = k === 0 ? Math.floor(L * kf(t, [[LEITURA.de, 0], [LEITURA.ate, 1]])) : L;
  const lendo = k === 0 && lidasAte < L && t >= LEITURA.de;

  /* a escrita (cenas 2 e 3): o passo j escreve a palavra j; a 0 sai da leitura */
  const passo = k === 1 || k === 2 ? p.resposta.reduce((a, _, j) => (j && t >= passoEm(de(k), j) ? j : a), 0) : 0;
  const escritas = k === 0 ? (t >= LEITURA.ate + 0.4 ? 1 : 0)
    : k === 1 || k === 2 ? 1 + p.resposta.filter((_, j) => j && t >= passoEm(de(k), j) + ESCREVE).length : n;
  const noPasso = passo ? t - passoEm(de(k), passo) : -1;
  const consulta = k === 1 && passo > 0 && noPasso >= 0.3 && noPasso < ESCREVE;
  /* sem as anotações, a mensagem inteira acende de novo a cada passo */
  const releitura = k === 2 && passo > 0 && noPasso < ESCREVE ? kf(noPasso, [[0, 0], [ESCREVE, 1]]) : 0;

  /* a mensagem, palavra a palavra */
  const mensagem = k <= 2 ? (
    <div style={{ position: "absolute", left: X, top: 40, width: W }}>
      {rotulo("A MENSAGEM LONGA: O REGULAMENTO E A PERGUNTA")}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 5px", marginTop: 5, font: `${M.fonte}px/1.45 ${ui}`, color: cor.texto }}>
        {p.lidas.map((w, i) => {
          const atual = lendo && i === lidasAte;
          const acesa = (k === 0 && i < lidasAte) || (k === 2 && i < Math.ceil(L * releitura));
          return <span key={i} style={{ padding: "0 3px", borderRadius: 3, background: atual ? forte : acesa ? preenchido : "transparent",
            color: w === "…" ? cor.fraco : cor.texto }}>{w}</span>;
        })}
      </div>
    </div>
  ) : null;

  /* o modelo e a resposta */
  const estado = k === 0 ? (lendo ? "lendo a mensagem" + ".".repeat(1 + (Math.floor(t * 3) % 3)) : escritas ? "leu tudo e escreveu a primeira palavra" : "")
    : escritas >= n ? "terminou" : k === 1 ? "escrevendo, com as anotações" : "escrevendo, sem as anotações";
  const escrevendo = (k === 1 || k === 2) && escritas < n;
  const resposta = k <= 2 ? (
    <div style={{ position: "absolute", left: X, top: Y.resposta, width: W, display: "flex", flexDirection: largo ? "row" : "column", gap: largo ? 24 : 6 }}>
      <div style={{ width: largo ? 300 : W }}>
        {rotulo("O MODELO")}
        <div style={{ marginTop: 3, font: `600 ${M.fonte + 1}px ${ui}`, color: lendo || escrevendo ? cor.acento : cor.texto }}>{estado}</div>
      </div>
      <div>
        {rotulo("A RESPOSTA")}
        <div style={{ marginTop: 3, display: "flex", flexWrap: "wrap", gap: "2px 6px", font: `700 ${M.fonte + 2}px ${mono}`, color: cor.texto }}>
          {p.resposta.slice(0, escritas).map((w, i) => <span key={i}>{w}</span>)}
          {escrevendo ? <span style={{ color: cor.acento, opacity: Math.floor(t * 2.5) % 2 ? 0.2 : 1 }}>▌</span> : null}
        </div>
      </div>
    </div>
  ) : null;

  /* o que o modelo lê para escrever a palavra do passo */
  const nova = `«${p.resposta[passo]}»`, ultima = `«${p.resposta[passo - 1]}»`;
  const linhaDoPasso = k === 1 && passo > 0 ? (
    <div style={{ position: "absolute", left: X, top: Y.passo, width: W, font: `${M.fonte + 1}px/1.4 ${ui}`, color: cor.texto }}>
      para escrever <b>{nova}</b>: lê apenas <b style={{ color: cor.acento }}>{ultima}</b> e <b style={{ color: cor.acento, opacity: consulta ? 1 : 0.55 }}>consulta as anotações</b>
    </div>
  ) : null;
  /* sem as anotações, uma linha por palavra: a mensagem inteira de novo, e a resposta até ali */
  const releituras = k === 2 ? (
    <div style={{ position: "absolute", left: X, top: Y.passo, width: W }}>
      {rotulo("SEM AS ANOTAÇÕES, NADA FICA GUARDADO. PARA ESCREVER CADA PALAVRA:")}
      {p.resposta.slice(1, passo + 1).map((w, i) => {
        const atual = i + 1 === passo && escritas <= passo;
        return <div key={i} style={{ marginTop: 4, font: `${largo ? M.fonte + 1 : M.fonte - 1}px/1.35 ${ui}`, color: atual ? cor.texto : cor.fraco }}>
          <b>«{w}»</b>: relê <b style={{ color: atual ? cor.aviso : cor.fraco }}>a mensagem inteira</b> + «{p.resposta.slice(0, i + 1).join(" ")}»
        </div>;
      })}
    </div>
  ) : null;

  /* as anotações: uma por palavra lida, com a palavra; a palavra escrita entra quando é lida no passo seguinte */
  const anotadas = k === 0 ? lidasAte : L + Math.max(0, passo - (k === 1 && noPasso < 0.2 ? 1 : 0));
  const cartoes = [...p.lidas, ...p.resposta.slice(0, n - 1)];
  const somem = k === 2 ? kf(s, [[0, 1], [0.5, 0]]) : 1;
  const anotacoes = k <= 1 || (k === 2 && s < 0.5) ? (
    <div style={{ position: "absolute", left: X, top: Y.anotacoes, width: W }}>
      {rotulo("AS ANOTAÇÕES: UMA POR PALAVRA LIDA, COM A PALAVRA")}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 6, opacity: somem }}>
        {cartoes.slice(0, k === 2 ? cartoes.length : anotadas).map((w, i) => {
          const entrou = k === 1 && i === anotadas - 1 && i >= L && noPasso < ESCREVE;
          return <span key={i} style={{ padding: "1px 4px", borderRadius: 3, font: `600 ${M.fonte - 2}px ${mono}`, color: w === "…" ? cor.fraco : cor.texto,
            border: `1.5px solid ${entrou ? cor.aviso : cor.acento}`, background: consulta ? forte : preenchido }}>{w}</span>;
        })}
        {k === 1 && passo > 0 ? <span style={{ font: `italic ${M.fonte - 1}px ${ui}`, color: cor.fraco, alignSelf: "center" }}>
          {consulta ? "← consulta todas" : "← a última entra agora"}</span> : null}
      </div>
    </div>
  ) : null;

  /* cena 4: as camadas do modelo, cada uma com a sua fileira, e a memória */
  const colunas = largo ? 30 : 18;
  const cheias = Math.round(colunas * kf(s, [[0.6, 0.15], [4.6, 1]]));
  const camadas = k === 3 ? (
    <div style={{ position: "absolute", left: X, top: 44, width: W, opacity: kf(s, [[0, 0], [0.3, 1]]) }}>
      {rotulo("DENTRO DO MODELO: AS CAMADAS, UMA SOBRE A OUTRA")}
      <div style={{ marginTop: 4, font: `${M.fonte}px/1.4 ${ui}`, color: cor.texto }}>cada palavra, lida ou escrita, ganha uma anotação <b>em cada camada</b></div>
      {CAMADAS.map((c, a) => <div key={c} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
        <span style={{ width: largo ? 110 : 92, font: `600 ${M.fonte - 1}px ${mono}`, color: cor.fraco, whiteSpace: "nowrap" }}>{c}</span>
        <div style={{ flex: 1, display: "flex", gap: 2 }}>
          {Array.from({ length: colunas }, (_, i) => <span key={i} style={{ flex: 1, height: 14, borderRadius: 2, boxSizing: "border-box",
            border: `1px solid ${i < cheias ? cor.acento : cor.linha}`, background: i < cheias ? preenchido : "transparent", opacity: a === 3 ? 0.6 : 1 }} />)}
        </div>
      </div>)}
      <div style={{ marginTop: 16 }}>{rotulo("A MEMÓRIA OCUPADA")}</div>
      <div style={{ marginTop: 5, height: 16, borderRadius: 4, border: `1.5px solid ${cor.fraco}`, boxSizing: "border-box", overflow: "hidden" }}>
        <div style={{ width: `${(cheias / colunas) * 100}%`, height: "100%", background: forte }} />
      </div>
      <div style={{ marginTop: 6, font: `italic ${M.fonte}px ${ui}`, color: cor.fraco, opacity: kf(s, [[4.6, 0], [5, 1]]) }}>
        mensagem mais longa, mais anotações em cada camada, mais memória</div>
    </div>
  ) : null;

  /* cena 5: a linha do tempo da resposta, com o que o medidor cronometra */
  const pausaCheia = kf(s, [[0.5, 0], [3, 1]], suave);
  const letras = p.resposta.reduce((a, w) => a + w.length + 1, 0), pausaW = Math.round(letras * (largo ? 1.3 : 0.7));
  const linhaDoTempo = k === 4 ? (
    <div style={{ position: "absolute", left: X, top: 44, width: W, opacity: kf(s, [[0, 0], [0.3, 1]]) }}>
      {rotulo("O QUE O MEDIDOR CRONOMETRA, DO ENTER AO FIM DA RESPOSTA")}
      <div style={{ display: "flex", gap: 3, marginTop: 26, height: 34 }}>
        <div style={{ position: "relative", flex: pausaW, borderRadius: 4, border: `1.5px solid ${cor.fraco}`, boxSizing: "border-box", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, width: `${pausaCheia * 100}%`, background: preenchido }} />
          <span style={{ position: "relative", display: "block", padding: "8px 6px", font: `${M.fonte - 1}px ${ui}`, color: cor.texto, whiteSpace: "nowrap" }}>o modelo lê a mensagem</span>
        </div>
        {p.resposta.map((w, i) => {
          const q = kf(s, [[3.2 + i * 0.4, 0], [3.4 + i * 0.4, 1]]);
          return <div key={i} style={{ position: "relative", flex: w.length + 1, borderRadius: 4, border: `1.5px solid ${cor.acento}`, boxSizing: "border-box", background: preenchido, opacity: q }}>
            <span style={{ position: "absolute", bottom: "100%", left: 0, marginBottom: 3, font: `700 ${M.fonte - 2}px ${mono}`, color: cor.texto, whiteSpace: "nowrap" }}>{w}</span>
          </div>;
        })}
      </div>
      <div style={{ display: "flex", gap: 3, marginTop: 6, font: `${M.fonte}px/1.35 ${ui}` }}>
        <div style={{ flex: largo ? pausaW : 1, color: cor.texto, opacity: kf(s, [[1.2, 0], [1.6, 1]]) }}>⏱ <b>a pausa</b>: do Enter até a primeira palavra</div>
        {largo ? <div style={{ flex: letras, color: cor.texto, opacity: kf(s, [[4.6, 0], [5, 1]]) }}>⏱ <b>cada palavra</b>: de uma palavra até a próxima</div> : null}
      </div>
      {!largo ? <div style={{ marginTop: 6, font: `${M.fonte}px/1.35 ${ui}`, color: cor.texto, opacity: kf(s, [[4.6, 0], [5, 1]]) }}>⏱ <b>cada palavra</b>: de uma palavra até a próxima</div> : null}
    </div>
  ) : null;

  /* cena 6: as quatro medições */
  const maior = Math.max(...p.mensagens.map((m) => m.palavras));
  const chip = (txt: string) => <span key={txt} style={{ font: `700 ${M.fonte - 1}px ${mono}`, color: cor.acento, border: `1.5px dashed ${cor.acento}`, borderRadius: 6, padding: "1px 6px", whiteSpace: "nowrap" }}>{txt}</span>;
  const rotuloW = largo ? 300 : 120;
  const medicoes = k === 5 ? (
    <div style={{ position: "absolute", left: X, top: 44, width: W, opacity: kf(s, [[0, 0], [0.4, 1]]) }}>
      {rotulo("AS QUATRO MEDIÇÕES: CADA MENSAGEM, COM E SEM AS ANOTAÇÕES")}
      <div style={{ display: "flex", marginTop: 10, font: `700 ${M.fonte}px ${ui}`, color: cor.texto }}>
        <span style={{ width: rotuloW }} />
        {["com as anotações", "sem as anotações"].map((c) => <span key={c} style={{ flex: 1 }}>{c}</span>)}
      </div>
      {p.mensagens.map((m, i) => {
        const q = kf(s, [[0.5 + i * 0.8, 0], [0.9 + i * 0.8, 1]], suave);
        return <div key={m.nome} style={{ display: "flex", alignItems: "center", marginTop: 10, paddingTop: 8, borderTop: `1px solid ${cor.linha}`, opacity: q }}>
          <div style={{ width: rotuloW, paddingRight: 8, boxSizing: "border-box" }}>
            <div style={{ font: `700 ${M.fonte + 1}px ${ui}`, color: cor.texto }}>{m.nome}</div>
            <div style={{ font: `${M.fonte - 1}px/1.3 ${ui}`, color: cor.fraco }}>{m.leva} · {m.palavras} palavras</div>
            <div style={{ marginTop: 4, width: Math.max(8, ((rotuloW - 16) * m.palavras * q) / maior), height: 8, borderRadius: 3, background: cor.linha, border: `1.5px solid ${cor.fraco}`, boxSizing: "border-box" }} />
          </div>
          {[0, 1].map((c) => <div key={c} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>{chip("pausa ?")}{chip("cada palavra ?")}</div>)}
        </div>;
      })}
    </div>
  ) : null;

  const alvo = [{ y: 70, x: X + 120 }, { y: Y.anotacoes + 20, x: X + 200 }, { y: Y.passo + 10, x: X + 200 }, { y: 150, x: X + W / 2 }, { y: 90, x: X + 80 }, { y: 120, x: X + W / 2 }][k];
  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui }}>
      <Cabecalho M={M} f={F} k={k} />
      {mensagem}{resposta}{linhaDoPasso}{releituras}{anotacoes}
      {camadas}{linhaDoTempo}{medicoes}
      <Resumos M={M} f={F} k={k} t={t} topo={Y.resumos} />
      {k < 5 ? <div style={{ position: "absolute", left: X, top: M.balao.y - 20, font: `italic 11px ${ui}`, color: cor.fraco }}>ilustração: o tamanho das barras e da memória não é medido</div> : null}
      <BalaoDaCena M={M} f={F} t={t} alvoY={alvo.y} alvoX={alvo.x} />
    </AbsoluteFill>
  );
};
