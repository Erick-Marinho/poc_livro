/**
 * A figura 1.1 (Remotion; docs/capacidades/laco-do-agente.md): quem decide o próximo passo, um jeito por vez. Na tela, só
 * a vez de agora: o jeito, quem decide nele, a mensagem da cliente e os passos, em frase curta, aparecendo um a um, com o
 * selo "decide" (no agente, a segunda vez é "decide de novo"), até a resposta, certa (verde) ou errada (âmbar), com o
 * porquê. Quando a vez termina, ela vira uma linha de resumo no topo, e a comparação se monta aos poucos; no fim, só os
 * resumos e a conclusão. Com `movimento` falso, os passos aparecem sem deslizar. O leitor toca e pausa (a ilha); o
 * último quadro é o do modo direto. O Studio do my-video importa esta composição.
 */
import { Brain, Check, Code, MessageSquare, Wrench, X } from "lucide-react";
import { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, kf, mono, suave, ui } from "../palco/video";
import { ANIMA, type Cartao, type Desenho, type Entrada, montarTrechos, resumindo, trechoEm, type Vez } from "./laco";

/** `movimento`: falso para quem pede menos movimento (os passos aparecem sem deslizar) */
export type Props = Entrada & { desenho: Desenho; movimento?: boolean };

const TAMANHO: Record<Desenho, { w: number; h: number }> = { largo: { w: 720, h: 540 }, coluna: { w: 360, h: 720 } };
export const tamanho = (desenho: Desenho) => TAMANHO[desenho];

const verde = "color-mix(in srgb, var(--ok, #1f7a4c) 12%, var(--papel, #f6f2ea))";
const ambar = "color-mix(in srgb, var(--aviso, #9a5b00) 12%, var(--papel, #f6f2ea))";

// quem fez o passo: o ícone e o nome
const QUEM: Record<string, { icone: typeof Brain; nome: (n: Record<string, string>) => string }> = {
  modelo: { icone: Brain, nome: (n) => n.modelo },
  "código": { icone: Code, nome: (n) => n["código"] },
  ferramenta: { icone: Wrench, nome: (n) => n.ferramenta },
  resposta: { icone: MessageSquare, nome: (n) => n.resposta },
};

const Marca = ({ certo, tam = 20 }: { certo: boolean; tam?: number }) => (
  <span style={{ flex: "none", display: "inline-grid", placeItems: "center", width: tam, height: tam, borderRadius: 999, background: certo ? cor.ok : cor.aviso, color: cor.papel }}>
    {certo ? <Check size={tam * 0.65} strokeWidth={3.2} /> : <X size={tam * 0.65} strokeWidth={3.2} />}
  </span>
);

// a linha de resumo de uma vez que já passou
const Resumo = ({ vez, opacidade, coluna }: { vez: Vez; opacidade: number; coluna: boolean }) => (
  <div style={{ opacity: opacidade, display: "flex", alignItems: "flex-start", gap: 8, font: `${coluna ? 14 : 15}px/1.4 ${ui}`, color: cor.texto }}>
    <Marca certo={vez.certo} />
    <span><b>{vez.nome}</b> <span style={{ color: cor.fraco }}>com {vez.rotulo}:</span> <span style={{ color: vez.certo ? cor.ok : cor.aviso }}>{vez.porque}</span></span>
  </div>
);

// um passo: aparece deslizando um pouco; quem fez, o que fez, e o selo de decisão
const PassoVisto = ({ c, v, nomes, movimento, coluna }: { c: Cartao; v: number; nomes: Record<string, string>; movimento: boolean; coluna: boolean }) => {
  const k = movimento ? kf(v, [[c.em, 0], [c.em + ANIMA, 1]], suave) : 1;
  const q = QUEM[c.quem];
  const Icone = q.icone;
  const resposta = c.quem === "resposta";
  const ferramenta = c.quem === "ferramenta";
  const quem = (
    <span style={{ flex: "none", display: "inline-flex", alignItems: "center", gap: 5, width: coluna ? undefined : 118, font: `600 11.5px ${ui}`, color: cor.fraco, textTransform: "uppercase", letterSpacing: ".03em", whiteSpace: "nowrap" }}>
      <Icone size={15} strokeWidth={2.2} />{q.nome(nomes)}
    </span>
  );
  const frase = (
    <span style={{ flex: 1, minWidth: 0, font: `${ferramenta ? 14 : 15}px/1.35 ${ferramenta ? mono : ui}`, color: cor.texto }}>
      {resposta ? <>“{c.curto}”</> : c.curto}
    </span>
  );
  const selo = c.decide ? (
    <span style={{ flex: "none", marginLeft: "auto", padding: "0 7px", borderRadius: 999, border: `1.5px solid ${cor.acento}`, color: cor.acento, font: `700 10.5px/18px ${ui}`, textTransform: "uppercase", letterSpacing: ".03em", whiteSpace: "nowrap" }}>
      {c.deNovo ? nomes.de_novo : nomes.decide}
    </span>
  ) : resposta ? <span style={{ marginLeft: "auto" }}><Marca certo={!!c.certo} tam={22} /></span> : null;
  const caixa = { opacity: k, transform: `translateY(${(1 - k) * 10}px)`, padding: coluna ? "7px 10px" : "8px 12px", borderRadius: 10,
    background: resposta ? (c.certo ? verde : ambar) : cor.papel, border: `${resposta ? 2 : 1.5}px solid ${resposta ? (c.certo ? cor.ok : cor.aviso) : cor.linha}` };
  // no celular, quem fez (e o selo) em cima, a frase embaixo; no computador, tudo numa linha
  return coluna
    ? <div style={{ ...caixa, display: "grid", gap: 3 }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}>{quem}{selo}</div>{frase}</div>
    : <div style={{ ...caixa, display: "flex", alignItems: "center", gap: 10 }}>{quem}{frase}{selo}</div>;
};

export const LacoAnimado: React.FC<Props> = ({ laco, tresJeitos, clientes, desenho, movimento = true }) => {
  const m = useMemo(() => montarTrechos({ laco, tresJeitos, clientes }), [laco, tresJeitos, clientes]);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { trecho, v } = trechoEm(m, frame / fps);
  const coluna = desenho === "coluna";
  const n = m.nomes;
  const r = resumindo(trecho, v);
  const vez = trecho.vez;
  // os resumos à vista: os das vezes que já passaram; o da vez de agora entra quando ela termina
  const passadas = trecho.tipo === "fim" ? m.vezes : m.vezes.slice(0, trecho.tipo === "vez" ? trecho.k : 0);
  const entra = (t: number) => (movimento ? kf(v, [[0, 0], [t, 1]]) : 1);

  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui, padding: coluna ? "14px 14px" : "18px 22px", display: "flex", flexDirection: "column", gap: coluna ? 12 : 14 }}>
      <div style={{ display: "flex", flexDirection: coluna ? "column" : "row", alignItems: coluna ? "flex-start" : "baseline", justifyContent: "space-between", gap: coluna ? 2 : 12 }}>
        <span style={{ font: `700 ${coluna ? 18 : 21}px ${ui}`, color: cor.texto }}>{m.pergunta}</span>
        <span style={{ font: `600 10.5px ${mono}`, letterSpacing: ".08em", textTransform: "uppercase", color: cor.fraco }}>ilustração</span>
      </div>

      {/* o que já passou: uma linha por vez */}
      {passadas.length || r ? (
        <div style={{ display: "grid", gap: trecho.tipo === "fim" ? 10 : 6, ...(trecho.tipo === "fim" ? { marginTop: "auto" } : {}) }}>
          {passadas.map((p) => <Resumo key={`${p.jeito}-${p.pergunta}`} vez={p} opacidade={1} coluna={coluna} />)}
          {vez && r ? <Resumo vez={vez} opacidade={r} coluna={coluna} /> : null}
        </div>
      ) : null}

      {/* a abertura: os três jeitos que vão passar */}
      {trecho.tipo === "abertura" ? (
        <div style={{ opacity: entra(0.5), display: "grid", gap: 14, alignContent: "center", flex: 1 }}>
          <div style={{ font: `${coluna ? 18 : 21}px/1.4 ${ui}`, color: cor.texto }}>{trecho.legenda}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {tresJeitos.modos.map((j, i) => (
              <span key={j.id} style={{ padding: "6px 12px", borderRadius: 999, border: `1.5px solid ${cor.linha}`, background: cor.papel, font: `600 ${coluna ? 14 : 15}px ${ui}`, color: cor.texto }}>
                {i + 1}. {j.nome}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* a vez de agora */}
      {vez ? (
        <div style={{ opacity: 1 - r, display: "grid", gap: coluna ? 9 : 10, alignContent: "start", padding: coluna ? "12px 12px" : "14px 16px", borderRadius: 14, border: `1.5px solid ${cor.linha}`, background: "color-mix(in srgb, var(--papel, #f6f2ea) 55%, transparent)" }}>
          <div style={{ opacity: entra(0.4), display: "grid", gap: 2 }}>
            <b style={{ font: `700 ${coluna ? 17 : 19}px ${ui}`, color: cor.texto }}>{vez.nome}</b>
            <span style={{ font: `${coluna ? 13 : 14}px ${ui}`, color: cor.fraco }}>quem decide: <b style={{ color: cor.texto, fontWeight: 600 }}>{vez.quemDecide}</b></span>
          </div>
          <div style={{ opacity: entra(0.6), display: "grid", gap: 2, padding: coluna ? "8px 10px" : "9px 12px", borderRadius: 10, background: cor.papel, border: `1.5px solid ${cor.linha}` }}>
            <span style={{ font: `600 12px ${ui}`, color: cor.fraco }}>{vez.cliente} escreve:</span>
            <span style={{ font: `${coluna ? 16 : 17}px/1.35 ${ui}`, color: cor.texto }}>“{vez.mensagem}”</span>
          </div>
          {vez.cartoes.filter((c) => c.em <= v).map((c, i) => <PassoVisto key={i} c={c} v={v} nomes={n} movimento={movimento} coluna={coluna} />)}
          {vez.cartoes[vez.cartoes.length - 1].em <= v ? (
            <div style={{ font: `600 ${coluna ? 13 : 14}px/1.35 ${ui}`, color: vez.certo ? cor.ok : cor.aviso, paddingLeft: 2 }}>{vez.porque}</div>
          ) : null}
        </div>
      ) : null}

      {/* no fim, a conclusão, logo depois dos resumos */}
      {trecho.tipo === "fim" ? (
        <div style={{ opacity: entra(0.5), marginBottom: "auto", padding: coluna ? "12px 12px" : "14px 16px", borderRadius: 12, background: cor.papel, border: `1.5px solid ${cor.linha}`, font: `600 ${coluna ? 17 : 19}px/1.4 ${ui}`, color: cor.texto }}>
          {trecho.legenda}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/** As medidas do vídeo de cada desenho. */
export function quadroDoLaco(props: Entrada, desenho: Desenho) {
  const m = montarTrechos(props);
  const { w, h } = tamanho(desenho);
  return { fps: 30, largura: w, altura: h, duracao: m.quadros };
}
