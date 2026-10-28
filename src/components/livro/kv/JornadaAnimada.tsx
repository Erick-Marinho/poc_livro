/**
 * A jornada de uma pergunta (Remotion; docs/capacidades/experimento-kv-cache.md, etapa 8; esboço em
 * figuras/esboco-jornada.md), que abre o texto. O caminho fica fixo na tela (você, o aplicativo, o servidor, o
 * modelo), cada ponto com a sua gaveta: o mural de respostas, os começos já lidos e as anotações. Um cenário por cache,
 * com o nome dele na cena em que ele age: a Ana faz o caminho inteiro; enquanto o modelo escreve, as anotações (KV)
 * contra a releitura; o Bruno pula o começo (prefixo); a Dani pula o mesmo começo numa API paga, com a conta (prompt);
 * o Eduardo recebe do mural a resposta certa, e a Carla, a errada (semântico). Seis cenas (docs/RITMO.md). Os textos
 * saem de kv.ts e de figuras/jornada.json; as barras e a conta são ilustração.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, kf, mono, suave, ui } from "../palco/video";
import { JORNADA as F, type Jornada } from "./kv.ts";
import { BalaoDaCena, Cabecalho, cenaEm, type Desenho, type Medidas, Resumos } from "./pecas";

export type Props = { jornada: Jornada; desenho: Desenho };

export const MEDIDAS_JORNADA = {
  largo: { w: 780, h: 660, x: 20, aw: 740, fonte: 14, balao: { lado: false, x: 20, w: 740, y: 580, fonte: 17 } },
  estreito: { w: 420, h: 966, x: 14, aw: 392, fonte: 13, balao: { lado: false, x: 14, w: 392, y: 888, fonte: 16 } },
} as const;

const preenchido = "color-mix(in srgb, var(--acento, #2a4fb5) 22%, transparent)";
const fundoOk = "color-mix(in srgb, var(--ok, #1f7a4c) 12%, transparent)";
const fundoAviso = "color-mix(in srgb, var(--aviso, #9a5b00) 14%, transparent)";
const rotulo = (texto: string, c: string = cor.fraco) => <div style={{ font: `700 11px ${mono}`, letterSpacing: ".05em", color: c }}>{texto}</div>;
const entre = (t: number, a: number, b: number) => t >= a && t < b;

export const JornadaAnimada: React.FC<Props> = ({ jornada: j, desenho }) => {
  const M = MEDIDAS_JORNADA[desenho] as unknown as Medidas;
  const D = MEDIDAS_JORNADA[desenho];
  const t = useCurrentFrame() / useVideoConfig().fps;
  const k = cenaEm(F, t);
  const de = (n: number) => F.cenas[n].de;
  const s = t - de(k);   // o tempo dentro da cena
  const largo = desenho === "largo";
  const [ana, bruno, dani, , carla] = j.perguntas;
  const quem = [ana, ana, bruno, dani, j.perguntas[3], carla][k];

  /* a geometria: no largo, os quatro pontos numa linha e as gavetas embaixo; no estreito, numa coluna, gavetas ao lado */
  const no = largo
    ? (i: number) => ({ x: D.x + i * ((D.aw - 4 * 160) / 3 + 160), y: 40, w: 160, h: 78 })
    : (i: number) => ({ x: D.x, y: 40 + i * 108, w: 150, h: 100 });
  const gaveta = largo
    ? (i: number) => ({ x: no(i).x, y: 126, w: 160, h: 118 })
    : (i: number) => ({ x: D.x + 160, y: no(i).y, w: D.aw - 160, h: 100 });
  const palcoY = largo ? 258 : 480;
  const resumosY = largo ? 422 : 750;

  /* onde está quem pergunta: o índice do ponto, fracionário entre dois pontos */
  const rota: Record<number, [number, number][]> = {
    0: [[0.3, 0], [0.8, 0], [1.6, 1], [2.6, 1], [3.2, 2], [3.8, 2], [4.3, 3]],
    1: [[0, 3], [1, 3]],
    2: [[0.2, 0], [0.8, 1], [1.4, 1], [2.0, 2], [2.8, 2], [3.3, 3]],
    3: [[0.2, 0], [0.8, 1], [1.4, 1], [2.0, 2], [2.8, 2], [3.3, 3]],
    4: [[0.2, 0], [0.9, 1], [2.2, 1], [3.0, 0]],
    5: [[0.2, 0], [0.9, 1], [2.0, 1], [2.6, 0]],
  };
  const onde = kf(s, rota[k], suave);
  const pino = (() => {
    const a = no(Math.floor(onde)), b = no(Math.min(3, Math.floor(onde) + 1)), f = onde - Math.floor(onde);
    return { x: a.x + (b.x - a.x) * f + (largo ? a.w / 2 : a.w - 12), y: a.y + (b.y - a.y) * f + (largo ? -4 : a.h - 4) };
  })();
  const ativo = Math.round(onde);

  /* o que cada gaveta guarda, e quando ela é consultada */
  const muralCheio = t >= de(1) + 6.6;
  const muralOlha = (k === 0 && entre(s, 1.8, 2.6)) || ((k === 2 || k === 3) && entre(s, 0.8, 1.4)) || (k >= 4 && s >= 0.9);
  const muralAcha = k >= 4 && s >= 1.3;
  const comecosCheios = t >= 6;
  const comecosOlha = (k === 0 && entre(s, 3.2, 3.8)) || ((k === 2 || k === 3) && s >= 2.0);
  const comecosAcha = (k === 2 || k === 3) && s >= 2.0;
  const ignorados = k >= 4 && s >= 1.6;   // o servidor e o modelo nem são chamados
  const nomeVisivel = { kv: t >= de(1) + 0.3, prefixo: t >= de(2) + 2.0, prompt: t >= de(3) + 2.0, semantico: t >= de(4) + 1.2 };

  /* o pedido em três blocos, e quanto o modelo já leu de cada um */
  const lidoAna = kf(t, [[4.3, 0], [6.0, 1]]);
  const lidoCurto = kf(s, [[3.4, 0], [4.0, 1]]);
  const lido = (i: number) => (k === 0 ? Math.min(1, Math.max(0, (lidoAna - [0, 0.24, 0.7][i]) / [0.24, 0.46, 0.3][i])) : (k === 2 || k === 3) && i === 2 ? lidoCurto : 0);
  const pulados = (k === 2 || k === 3) && s >= 2.4;
  const lendo = (k === 0 && entre(t, 4.3, 6.0)) || ((k === 2 || k === 3) && entre(s, 3.4, 4.0));
  const respostaDe = k === 0 ? ana : k === 2 ? bruno : dani;
  /* na cena da Ana, só a primeira palavra: a escrita é a cena seguinte */
  const palavraEm = (i: number) => (k === 0 ? (i === 0 ? 6.2 : Infinity) : 4.2 + i * 0.25);
  const escritas = k === 0 || k === 2 || k === 3 ? respostaDe.resposta!.filter((_, i) => s >= palavraEm(i)).length : 0;

  /* a cena do KV: as quatro primeiras palavras, uma linha por palavra */
  const palavras = ana.resposta!.slice(0, 4);
  const linhaEm = (i: number) => 0.6 + i * 1.2;
  const linhas = k === 1 ? palavras.filter((_, i) => s >= linhaEm(i)).length : 0;

  /* as anotações na gaveta do modelo: crescem enquanto ele lê e escreve, e somem com a resposta pronta */
  const anotacoes = k === 0 ? Math.round(8 * lidoAna) + escritas : k === 1 ? 8 + linhas : 0;
  const anotacoesSomem = k === 1 ? kf(s, [[6.4, 1], [6.9, 0.15]]) : 1;

  const Caixa = ({ i, titulo, texto, apagada }: { i: number; titulo: string; texto: React.ReactNode; apagada?: boolean }) => {
    const n = no(i), aceso = ativo === i && !apagada;
    return <div style={{ position: "absolute", left: n.x, top: n.y, width: n.w, height: n.h, boxSizing: "border-box", padding: "6px 9px", borderRadius: 12,
      background: cor.papel, border: `2px solid ${aceso ? cor.acento : cor.linha}`, opacity: apagada ? 0.45 : 1 }}>
      {rotulo(titulo, aceso ? cor.acento : cor.fraco)}
      <div style={{ marginTop: 3, font: `${M.fonte}px/1.3 ${ui}`, color: cor.texto }}>{texto}</div>
    </div>;
  };
  const Nome = ({ texto, erra }: { texto: string; erra?: boolean }) => (
    <span style={{ padding: "0 6px", borderRadius: 6, background: cor.papel, border: `1.5px solid ${erra ? cor.aviso : cor.acento}`,
      font: `700 10.5px/1.5 ${mono}`, color: erra ? cor.aviso : cor.acento, whiteSpace: "nowrap" }}>{texto}</span>
  );
  const Gaveta = ({ i, titulo, nomes, olha, acha, erra, apagada, children }: { i: number; titulo: string; nomes: React.ReactNode; olha: boolean; acha?: boolean; erra?: boolean; apagada?: boolean; children: React.ReactNode }) => {
    const g = gaveta(i);
    const borda = acha ? (erra ? cor.aviso : cor.ok) : olha ? cor.acento : cor.fraco;
    return <div style={{ position: "absolute", left: g.x, top: g.y, width: g.w, height: g.h, boxSizing: "border-box", padding: "5px 8px", borderRadius: 8, overflow: "hidden",
      border: `2px ${olha || acha ? "solid" : "dashed"} ${borda}`, background: acha ? (erra ? fundoAviso : fundoOk) : cor.nota, opacity: apagada ? 0.45 : 1 }}>
      {rotulo(titulo)}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3, margin: "2px 0" }}>{nomes}</div>
      <div style={{ font: `${M.fonte - 1}px/1.3 ${ui}`, color: cor.texto }}>{children}</div>
    </div>;
  };
  const vazio = <span style={{ color: cor.fraco, fontStyle: "italic" }}>vazio</span>;
  const aviso = (texto: string, c: string) => <div style={{ color: c, fontWeight: 700 }}>{texto}</div>;

  const seta = (i: number) => {
    const a = no(i), b = no(i + 1);
    return largo
      ? <div key={i} style={{ position: "absolute", left: a.x + a.w, top: a.y + a.h / 2 - 10, width: b.x - a.x - a.w, textAlign: "center", font: `700 16px ${ui}`, color: cor.linha }}>→</div>
      : <div key={i} style={{ position: "absolute", left: a.x + a.w / 2 - 5, top: a.y + a.h - 1, height: b.y - a.y - a.h + 2, font: `700 13px ${ui}`, color: cor.linha, display: "flex", alignItems: "center" }}>↓</div>;
  };

  const estadoModelo = ignorados ? "nem foi chamado" : lendo ? "lendo…" : (k === 0 && s >= 6.2) || k === 1 || escritas > 0 ? "escrevendo…" : "lê, depois escreve";
  const servidor = k === 3 ? "O PROVEDOR DA API" : "O SERVIDOR";

  /* o palco, embaixo: o que cada cena mostra de perto */
  const W = D.aw;
  const pedido = (
    <div style={{ position: "absolute", left: D.x, top: palcoY, width: W }}>
      {rotulo(`O PEDIDO ${k === 0 ? "DA ANA" : k === 2 ? "DO BRUNO" : "DA DANI"}`)}
      <div style={{ display: "flex", gap: 4, marginTop: 5 }}>
        {[{ nome: "instruções", w: 0.24 }, { nome: "regulamento", w: 0.46 }, { nome: respostaDe.curta, w: 0.3 }].map((b, i) => {
          const q = k === 0 ? kf(s, [[1.4 + i * 0.3, 0], [1.7 + i * 0.3, 1]]) : kf(s, [[0.9 + i * 0.12, 0], [1.1 + i * 0.12, 1]]);
          const pulado = pulados && i < 2;
          return <div key={i} style={{ position: "relative", width: `${b.w * 100}%`, height: 30, borderRadius: 6, boxSizing: "border-box", overflow: "hidden", opacity: q,
            border: `1.5px ${pulado ? "dashed" : "solid"} ${pulado ? cor.ok : cor.fraco}`, background: pulado ? fundoOk : cor.papel }}>
            <div style={{ position: "absolute", inset: 0, width: `${lido(i) * 100}%`, background: preenchido }} />
            <div style={{ position: "relative", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", font: `600 ${M.fonte - 1}px ${ui}`,
              color: pulado ? cor.ok : cor.texto, whiteSpace: "nowrap", padding: "0 4px" }}>{pulado ? `✓ ${b.nome}` : b.nome}</div>
          </div>;
        })}
      </div>
      {pulados ? <div style={{ marginTop: 6, maxWidth: largo && k === 3 ? W - 350 : W, font: `${M.fonte - 1}px/1.4 ${ui}`, color: cor.fraco, opacity: kf(s, [[2.6, 0], [2.9, 1]]) }}>
        sem o cache, as instruções e o regulamento seriam lidos de novo; com ele, o modelo lê só a pergunta</div> : null}
      {k === 0 && lendo ? <div style={{ marginTop: 6, font: `${M.fonte - 1}px ${ui}`, color: cor.acento }}>o modelo lê o pedido inteiro: é a pausa antes da primeira palavra</div> : null}
      {escritas > 0 ? <div style={{ marginTop: 6, maxWidth: largo && k === 3 ? W - 350 : W, font: `${M.fonte + 1}px/1.4 ${ui}`, color: cor.texto }}>
        <span style={{ font: `700 11px ${mono}`, letterSpacing: ".05em", color: cor.fraco }}>A RESPOSTA </span>
        <span style={{ fontFamily: mono, fontWeight: 600 }}>{respostaDe.resposta!.slice(0, escritas).join(" ")}{k === 0 ? " …" : ""}</span>
      </div> : null}
    </div>
  );

  /* a cena do KV: sem as anotações, uma releitura inteira por palavra; com elas, a palavra nova e as anotações */
  const coluna = (com: boolean, x: number, y: number, w: number) => (
    <div style={{ position: "absolute", left: x, top: y, width: w }}>
      {rotulo(com ? "COM AS ANOTAÇÕES (KV CACHE)" : "SEM AS ANOTAÇÕES", com ? cor.acento : cor.fraco)}
      <div style={{ font: `${M.fonte - 1}px ${ui}`, color: cor.fraco, margin: "2px 0 4px" }}>
        {com ? "lê só a palavra nova e consulta as anotações" : "antes de cada palavra, relê o pedido inteiro"}</div>
      {palavras.map((p, i) => s >= linhaEm(i) ? <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, height: 19, opacity: kf(s, [[linhaEm(i), 0], [linhaEm(i) + 0.3, 1]]) }}>
        <span style={{ width: 66, flex: "none", font: `600 ${M.fonte - 1}px ${mono}`, color: cor.texto }}>{p}</span>
        {com
          ? <><span style={{ width: 8, height: 12, flex: "none", background: cor.acento, borderRadius: 2 }} />
            <span style={{ font: `${M.fonte - 2}px ${ui}`, color: cor.fraco }}>+</span>
            {Array.from({ length: 8 + i }, (_, n) => <span key={n} style={{ width: 6, height: 10, flex: "none", borderRadius: 1, background: preenchido, border: `1px solid ${cor.acento}` }} />)}</>
          : <span style={{ height: 12, width: (w - 76) * (0.86 + 0.04 * i), borderRadius: 3, background: cor.fraco, opacity: 0.55 }} />}
      </div> : null)}
    </div>
  );
  const kv = <>
    {largo ? <>{coluna(false, D.x, palcoY, W / 2 - 12)}{coluna(true, D.x + W / 2 + 12, palcoY, W / 2 - 12)}</>
      : <>{coluna(false, D.x, palcoY, W)}{coluna(true, D.x, palcoY + 112, W)}</>}
    <div style={{ position: "absolute", left: D.x, top: palcoY + (largo ? 124 : 224), width: W, font: `italic ${M.fonte - 1}px/1.35 ${ui}`, color: cor.fraco, opacity: kf(s, [[6.4, 0], [6.7, 1]]) }}>
      a resposta ficou pronta: as anotações vão embora, e o mural guarda a resposta da Ana</div>
  </>;

  /* a conta da API (a Dani): a Ana pagou para guardar; a Dani paga menos pelo começo repetido */
  const conta = k === 3 ? (
    <div style={{ position: "absolute", left: largo ? D.x + W - 330 : D.x, top: largo ? palcoY + 46 : palcoY + 150, width: largo ? 330 : W, boxSizing: "border-box",
      padding: "6px 10px", borderRadius: 8, border: `1.5px solid ${cor.fraco}`, background: cor.papel, font: `${M.fonte - 1}px/1.5 ${ui}`, color: cor.texto }}>
      {rotulo("A CONTA DA API")}
      <div style={{ opacity: kf(s, [[1.0, 0], [1.3, 1]]) }}>Ana · o começo, lido e guardado: <b style={{ color: cor.aviso }}>um pouco mais caro</b></div>
      <div style={{ opacity: kf(s, [[3.4, 0], [3.7, 1]]) }}>Dani · o começo repetido: <b style={{ color: cor.ok }}>bem mais barato</b></div>
    </div>
  ) : null;

  /* o mural: o Eduardo e a Carla recebem a resposta da Ana sem passar pelo modelo */
  const pronta = k >= 4 ? (
    <div style={{ position: "absolute", left: D.x, top: palcoY, width: W, font: `${M.fonte + 1}px/1.45 ${ui}`, color: cor.texto }}>
      {rotulo(`A RESPOSTA PARA ${quem.quem.toUpperCase()}, DIRETO DO MURAL`)}
      <div style={{ fontFamily: mono, fontWeight: 600, opacity: kf(s, [[2.4, 0], [2.7, 1]]) }}>{ana.resposta!.join(" ")}</div>
      {k === 4
        ? <div style={{ color: cor.ok, fontWeight: 700, opacity: kf(s, [[3.0, 0], [3.3, 1]]) }}>✓ certa: é a mesma pergunta da Ana, com outras palavras</div>
        : <div style={{ color: cor.aviso, fontWeight: 700, opacity: kf(s, [[3.0, 0], [3.3, 1]]) }}>✗ errada: {carla.certa}</div>}
      {k === 5 ? <div style={{ marginTop: 10, font: `${M.fonte}px/1.45 ${ui}`, opacity: kf(s, [[4.4, 0], [4.8, 1]]) }}>
        As anotações e os começos guardam <b>leitura</b> e nunca mudam a resposta. O mural guarda <b>respostas</b>, e pode errar.</div> : null}
    </div>
  ) : null;

  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui }}>
      <Cabecalho M={M} f={F} k={k} />

      {[0, 1, 2].map(seta)}
      <Caixa i={0} titulo={`VOCÊ · ${quem.quem.toUpperCase()}`} texto={quem.texto} />
      <Caixa i={1} titulo="O APLICATIVO" texto="monta o pedido" />
      <Caixa i={2} titulo={servidor} texto="recebe o pedido" apagada={ignorados} />
      <Caixa i={3} titulo="O MODELO" texto={estadoModelo} apagada={ignorados} />

      <Gaveta i={1} titulo="MURAL DE RESPOSTAS" nomes={nomeVisivel.semantico ? <Nome texto="cache semântico" erra /> : null} olha={muralOlha} acha={muralAcha} erra={k === 5}>
        {muralCheio ? <>Ana: <i>sábado à tarde?</i> → {ana.resposta!.join(" ")}</> : vazio}
        {muralOlha && !muralAcha ? aviso("nada parecido", cor.acento) : null}
        {muralAcha ? aviso(k === 4 ? "a mesma da Ana ✓" : "parece a da Ana!", k === 4 ? cor.ok : cor.aviso) : null}
      </Gaveta>
      <Gaveta i={2} titulo="COMEÇOS JÁ LIDOS" nomes={<>{nomeVisivel.prefixo ? <Nome texto="cache de prefixo" /> : null}{nomeVisivel.prompt ? <Nome texto="cache de prompt" /> : null}</>}
        olha={comecosOlha} acha={comecosAcha} apagada={ignorados}>
        {comecosCheios ? <>✓ instruções · ✓ regulamento</> : vazio}
        {comecosAcha ? aviso("esse começo, já li", cor.ok) : comecosOlha && !comecosCheios ? aviso("nada lido antes", cor.acento) : null}
      </Gaveta>
      <Gaveta i={3} titulo="ANOTAÇÕES" nomes={nomeVisivel.kv ? <Nome texto="KV cache" /> : null} olha={lendo || k === 1 || (k === 0 && s >= 6.2)} apagada={ignorados}>
        {anotacoes > 0 ? <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 2, opacity: anotacoesSomem }}>
          {Array.from({ length: anotacoes }, (_, i) => <span key={i} style={{ width: 9, height: 11, borderRadius: 2, background: preenchido, border: `1.5px solid ${cor.acento}` }} />)}
        </div> : vazio}
      </Gaveta>

      {/* quem está perguntando */}
      <div style={{ position: "absolute", left: pino.x - 24, top: pino.y - 10, padding: "1px 8px", borderRadius: 10, background: cor.acento, color: cor.papel,
        font: `700 ${M.fonte - 1}px ${ui}`, whiteSpace: "nowrap" }}>{quem.quem}</div>

      {k === 0 || k === 2 || k === 3 ? pedido : null}
      {k === 1 ? kv : null}
      {conta}
      {pronta}

      <Resumos M={M} f={F} k={k} t={t} topo={resumosY} />
      {k < 5 ? <div style={{ position: "absolute", left: D.x, top: D.balao.y - 20, font: `italic 11px ${ui}`, color: cor.fraco }}>ilustração: as barras, as anotações e a conta não são medidas</div> : null}
      <BalaoDaCena M={M} f={F} t={t} alvoY={no(Math.min(ativo, 3)).y} alvoX={no(Math.min(ativo, 3)).x + 40} />
    </AbsoluteFill>
  );
};
