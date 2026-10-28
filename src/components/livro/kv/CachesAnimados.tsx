/**
 * Os quatro caches (Remotion; docs/capacidades/experimento-kv-cache.md, etapa 5), que abrem o texto. O modelo lê e
 * escreve; o KV guarda a leitura de cada palavra até a resposta acabar; o prefixo reaproveita, entre pedidos, os blocos
 * iguais do começo até o primeiro diferente (o hash de cada bloco leva o do anterior:
 * https://docs.vllm.ai/en/latest/design/prefix_caching.html); o prompt faz o mesmo no provedor, com preço; o semântico
 * devolve uma resposta pronta para uma pergunta parecida, e erra; e ficam os dois grupos. Os textos saem de kv.ts.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, kf, mono, suave, ui } from "../palco/video";
import { CACHES as F, type Kv } from "./kv.ts";
import { BalaoDaCena, Cabecalho, CAIXA, Caixa, cenaEm, type Desenho, Ilustracao, MEDIDAS, Resumos, rotulo, seta } from "./pecas";

export type Props = { kv: Kv; desenho: Desenho };

type Estado = "lido" | "reaproveitado" | "diferente" | "de novo";
const PEDIDOS: { nome: string; blocos: [string, Estado][] }[] = [
  { nome: "primeiro", blocos: [["regras", "lido"], ["garagem", "lido"], ["mudanças", "lido"], ["pergunta", "lido"]] },
  { nome: "segundo", blocos: [["regras", "reaproveitado"], ["garagem", "reaproveitado"], ["mudanças", "reaproveitado"], ["outra pergunta", "lido"]] },
  { nome: "terceiro", blocos: [["regras", "reaproveitado"], ["áreas comuns", "diferente"], ["mudanças", "de novo"], ["pergunta", "de novo"]] },
];

export const CachesAnimados: React.FC<Props> = ({ kv: p, desenho }) => {
  const M = MEDIDAS[desenho];
  const t = useCurrentFrame() / useVideoConfig().fps;
  const k = cenaEm(F, t);
  const de = (j: number) => F.cenas[j].de;
  const X = M.x, W = M.aw;

  /* cenas 1 e 2: a mensagem, o modelo e a resposta; na 2, a mesma rodada de novo, com as anotações */
  const msg = { x: X, w: W * 0.3 }, modelo = { x: X + W * 0.35, w: W * 0.22 }, resp = { x: X + W * 0.62, w: W * 0.38 };
  const base = k >= 1 ? de(1) : 0;
  const le = kf(t, [[base + 0.4, 0], [base + 1.9, 1]]);
  const palavraEm = (i: number) => base + 2.2 + i * 0.45;
  const escritos = p.resposta.filter((_, i) => t >= palavraEm(i)).length;
  const lendo = le > 0 && le < 1;
  const estado = lendo ? "lendo" + ".".repeat(1 + (Math.floor(t * 3) % 3)) : escritos === 0 ? (le >= 1 ? "leu ✓" : "") : escritos < p.resposta.length ? "escrevendo" : "terminou";
  const lidas = p.pergunta.split(/\s+/).length;
  const anotacoes = Math.floor(lidas * le) + escritos;
  const total = lidas + p.resposta.length;
  const somem = kf(t, [[de(1) + 5.0, 1], [de(1) + 5.4, 0]]);
  const montagem = kf(t, [[de(2) - 0.3, 1], [de(2), 0]]);

  const montado = (
    <div style={{ opacity: montagem }}>
      <Caixa x={msg.x} w={msg.w} titulo="A MENSAGEM" acesa={lendo}>
        <div style={{ font: `${M.fonte}px/1.35 ${ui}`, color: cor.texto }}>{p.pergunta}</div>
      </Caixa>
      {seta(msg.x + msg.w, modelo.x, lendo)}
      <Caixa x={modelo.x} w={modelo.w} titulo="O MODELO" acesa={le > 0 && escritos < p.resposta.length}>
        <div style={{ font: `600 ${M.fonte + 1}px ${ui}`, color: lendo ? cor.acento : cor.texto }}>{estado}</div>
      </Caixa>
      {seta(modelo.x + modelo.w, resp.x, escritos > 0 && escritos < p.resposta.length)}
      <Caixa x={resp.x} w={resp.w} titulo="A RESPOSTA" acesa={escritos > 0 && escritos < p.resposta.length}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 5px", font: `600 ${M.fonte + 1}px ${mono}`, color: cor.texto }}>
          {p.resposta.slice(0, escritos).map((w, i) => <span key={i} style={{ opacity: kf(t, [[palavraEm(i), 0], [palavraEm(i) + 0.2, 1]]) }}>{w}</span>)}
        </div>
      </Caixa>
      {k === 1 ? <div style={{ position: "absolute", left: X, top: 160, width: W, opacity: somem }}>
        {rotulo("AS ANOTAÇÕES DO KV: UMA POR PALAVRA")}
        <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
          {Array.from({ length: total }, (_, i) => <div key={i} style={{ width: W / total - 3, height: 20, borderRadius: 3, boxSizing: "border-box",
            border: `1.5px solid ${i < anotacoes ? cor.acento : cor.linha}`, background: i < anotacoes ? "color-mix(in srgb, var(--acento, #2a4fb5) 22%, transparent)" : "transparent" }} />)}
        </div>
        <div style={{ marginTop: 6, font: `${M.fonte}px ${ui}`, color: cor.fraco, opacity: kf(t, [[de(1) + 4.55, 0], [de(1) + 4.8, 1]]) }}>a resposta acabou: as anotações vão embora</div>
      </div> : null}
    </div>
  );

  /* cenas 3 e 4: os pedidos em blocos; acende o que é reaproveitado */
  const rotuloW = M.balao.lado ? 70 : 58;
  const blocoW = (W - rotuloW - 4) / 4 - 4;
  const fundo: Record<Estado, string> = { lido: cor.papel, reaproveitado: "color-mix(in srgb, var(--acento, #2a4fb5) 22%, transparent)", diferente: cor.papel, "de novo": cor.papel };
  const borda: Record<Estado, string> = { lido: `1.5px solid ${cor.linha}`, reaproveitado: `1.5px solid ${cor.acento}`, diferente: `2px solid ${cor.aviso}`, "de novo": `1.5px dashed ${cor.fraco}` };
  const Pedido = ({ y, nome, blocos, de0 }: { y: number; nome: string; blocos: [string, Estado][]; de0: number }) => (
    <div style={{ position: "absolute", left: X, top: y, width: W, display: "flex", alignItems: "center", gap: 4, opacity: kf(t, [[de0, 0], [de0 + 0.3, 1]]) }}>
      <div style={{ width: rotuloW, font: `600 ${M.fonte - (M.balao.lado ? 0 : 1)}px/1.2 ${ui}`, color: cor.fraco }}>{nome}</div>
      {blocos.map(([b, e], i) => {
        const q = kf(t, [[de0 + 0.2 + i * 0.3, 0], [de0 + 0.4 + i * 0.3, 1]]);
        return <div key={i} style={{ width: blocoW, height: 30, borderRadius: 6, boxSizing: "border-box", border: q ? borda[e] : `1.5px solid ${cor.linha}`, background: q ? fundo[e] : cor.papel,
          display: "flex", alignItems: "center", justifyContent: "center", font: `600 ${M.fonte - (M.balao.lado ? 1 : 2.5)}px ${ui}`, color: e === "diferente" && q ? cor.aviso : cor.texto, whiteSpace: "nowrap", overflow: "hidden" }}>
          {e === "reaproveitado" && q ? "✓ " : ""}{b}</div>;
      })}
    </div>
  );
  const legenda = (y: number, o: number) => (
    <div style={{ position: "absolute", left: X + rotuloW + 4, top: y, font: `${M.fonte - 1}px ${ui}`, color: cor.fraco, opacity: o, display: "flex", gap: 12 }}>
      <span><span style={{ color: cor.acento, fontWeight: 700 }}>✓</span> reaproveitado</span><span>□ lido</span>
    </div>
  );
  const prefixo = (
    <div style={{ opacity: kf(t, [[de(2), 0], [de(2) + 0.3, 1], [de(3) - 0.3, 1], [de(3), 0]]) }}>
      <div style={{ position: "absolute", left: X, top: 40 }}>{rotulo("NO SERVIDOR, ENTRE PEDIDOS")}</div>
      {PEDIDOS.map((pd, i) => <Pedido key={pd.nome} y={64 + i * 44} nome={pd.nome} blocos={pd.blocos} de0={de(2) + 0.3 + i * 1.6} />)}
      <div style={{ position: "absolute", left: X + rotuloW + 4, top: 64 + 3 * 44, width: W - rotuloW - 4, font: `600 ${M.fonte}px/1.35 ${ui}`, color: cor.aviso, opacity: kf(t, [[de(2) + 4.2, 0], [de(2) + 4.6, 1]]) }}>
        iguais, mas depois de um diferente: lidos de novo
      </div>
      {legenda(64 + 3 * 44 + 24 + (M.balao.lado ? 0 : 16), kf(t, [[de(2) + 4.6, 0], [de(2) + 5, 1]]))}
    </div>
  );
  const PRECO = [{ nome: "primeira vez", blocos: PEDIDOS[0].blocos, preco: "guarda o começo: um pouco mais caro" },
    { nome: "vez seguinte", blocos: PEDIDOS[1].blocos, preco: "o começo repetido: bem mais barato" }];
  const prompt = (
    <div style={{ opacity: kf(t, [[de(3), 0], [de(3) + 0.3, 1], [de(4) - 0.3, 1], [de(4), 0]]) }}>
      <div style={{ position: "absolute", left: X, top: 40 }}>{rotulo("NO PROVEDOR, NA API")}</div>
      {PRECO.map((pd, i) => <div key={pd.nome}>
        <Pedido y={64 + i * 76} nome={pd.nome} blocos={pd.blocos} de0={de(3) + 0.3 + i * 2} />
        <div style={{ position: "absolute", left: X + rotuloW + 4, top: 64 + i * 76 + 36, font: `700 ${M.fonte}px ${mono}`, color: i ? cor.ok : cor.aviso,
          opacity: kf(t, [[de(3) + 1.6 + i * 2, 0], [de(3) + 1.9 + i * 2, 1]]) }}>{pd.preco}</div>
      </div>)}
    </div>
  );

  /* cena 5: a pergunta guardada, a nova parecida e a mesma resposta pronta */
  const cartao = (y: number, titulo: string, texto: string, de0: number, aviso = false) => (
    <div style={{ position: "absolute", left: X, top: y, width: W * 0.52, boxSizing: "border-box", padding: "5px 8px", borderRadius: 10, background: cor.papel,
      border: `2px solid ${aviso ? cor.aviso : cor.linha}`, opacity: kf(t, [[de0, 0], [de0 + 0.3, 1]]) }}>
      {rotulo(titulo)}<div style={{ font: `${M.fonte}px/1.35 ${ui}`, color: cor.texto }}>{texto}</div>
    </div>
  );
  const nova = de(4) + 1.8;
  const errou = de(4) + 3.2;
  const semantico = (
    <div style={{ opacity: kf(t, [[de(4), 0], [de(4) + 0.3, 1], [de(5) - 0.3, 1], [de(5), 0]]) }}>
      <div style={{ position: "absolute", left: X, top: 40 }}>{rotulo("UMA RESPOSTA PRONTA, GUARDADA")}</div>
      {cartao(62, "GUARDADA", p.parecidas.guardada, de(4) + 0.3)}
      {cartao(128, "NOVA, PARECIDA", p.parecidas.nova, nova, t >= errou)}
      <div style={{ position: "absolute", left: X + W * 0.62, top: 62, width: W * 0.38, height: 110, boxSizing: "border-box", padding: "6px 8px", borderRadius: 10,
        border: `2px solid ${cor.acento}`, background: cor.papel, opacity: kf(t, [[de(4) + 0.8, 0], [de(4) + 1.1, 1]]) }}>
        {rotulo("A RESPOSTA PRONTA")}<div style={{ marginTop: 6, font: `600 ${M.fonte + 1}px/1.35 ${ui}`, color: cor.texto }}>{p.parecidas.resposta}</div>
      </div>
      {[[86, de(4) + 0.8], [152, nova + 0.5]].map(([y, d]) => <div key={y} style={{ position: "absolute", left: X + W * 0.52, top: y - 9, width: W * 0.1, textAlign: "center",
        font: `700 15px ${ui}`, color: cor.acento, opacity: kf(t, [[d, 0], [d + 0.3, 1]]) }}>→</div>)}
      <div style={{ position: "absolute", left: X, top: 196, width: W, font: `600 ${M.fonte}px/1.4 ${ui}`, color: cor.aviso, opacity: kf(t, [[errou, 0], [errou + 0.4, 1]]) }}>
        ✗ parecida no texto, outra pergunta: aos domingos, o regulamento diz que não
      </div>
    </div>
  );

  /* cena 6: os dois grupos */
  const grupo = (y: number, h: number, titulo: string, linhas: [string, string][], rodape: string, de0: number, aviso = false) => (
    <div style={{ position: "absolute", left: X, top: y, width: W, height: h, boxSizing: "border-box", padding: "6px 10px", borderRadius: 12, background: cor.papel,
      border: `2px solid ${aviso ? cor.aviso : cor.acento}`, opacity: kf(t, [[de0, 0], [de0 + 0.4, 1]], suave) }}>
      {rotulo(titulo)}
      {linhas.map(([n, a]) => <div key={n} style={{ marginTop: 3, font: `${M.fonte + 1}px/1.35 ${ui}`, color: cor.texto }}><b>{n}</b> <span style={{ color: cor.fraco }}>· {a}</span></div>)}
      <div style={{ marginTop: 4, font: `700 ${M.fonte}px ${ui}`, color: aviso ? cor.aviso : cor.ok }}>{rodape}</div>
    </div>
  );
  const grupos = <>
    {grupo(40, 124, "GUARDAM A LEITURA", [["KV", "dentro de uma resposta"], ["prefixo", "entre pedidos, no servidor"], ["prompt", "entre pedidos, na API"]], "= a mesma resposta, mais rápida", de(5) + 0.2)}
    {grupo(176, 76, "GUARDA A RESPOSTA", [["semântico", "pergunta parecida, resposta pronta"]], "≈ pode errar", de(5) + 0.8, true)}
  </>;

  const alvoY = [CAIXA.y + CAIXA.h / 2, 180, 130, 140, 120, 110][k];
  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui }}>
      <Cabecalho M={M} f={F} k={k} />
      {k <= 2 ? montado : null}
      {k === 2 || k === 3 ? prefixo : null}
      {k === 3 || k === 4 ? prompt : null}
      {k >= 4 && k <= 5 ? semantico : null}
      {k === 5 ? grupos : null}
      {k < 5 ? <Resumos M={M} f={F} k={k} t={t} topo={270} /> : null}
      {k === 1 ? <Ilustracao M={M} texto="ilustração: o número de anotações não é medido" opacidade={1} /> : null}
      <BalaoDaCena M={M} f={F} t={t} alvoY={alvoY} />
    </AbsoluteFill>
  );
};
