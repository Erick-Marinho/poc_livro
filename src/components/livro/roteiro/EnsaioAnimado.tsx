/**
 * A animação do ensaio do substituto (Remotion; docs/capacidades/capitulo-2-em-cenas.md, etapa 3), que o leitor toca
 * ou rola (palco/RolaCena.tsx): o mesmo grafo do 2.1. Com o modelo de verdade, cada ensaio custa, demora e varia; no
 * lugar dele, o modelo falso, que devolve o que se combinou. Dois ensaios dos testes reais: "escolha passar a vez"
 * (o caminho não pede mais nada ao modelo) e "escolha responder, e escreva tal frase" (a frase chega); no fim, um teste
 * por caminho e a saída gravada do pytest. O que a figura não diz, o que esses testes provam, fica para o pare e pense
 * do texto. Os balões explicam cada momento. O que se desenha sai de ensaio.ts, montado do projeto real.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, kf, mono, ui } from "../palco/video";
import { type Alvo, baloes, type Montado, T } from "./ensaio.ts";
import { Balao, Caixa, type Desenho, entre, lugares, MEDIDAS, Mensagem, ondeEsta, opacidadeDoBalao, Pilula, Pontas, type Ponto, seta } from "./pecas";

export type Props = { ensaio: Montado; desenho: Desenho };

export const EnsaioAnimado: React.FC<Props> = ({ ensaio: e, desenho }) => {
  const M = MEDIDAS[desenho];
  const D = M.decide, B = M.balcao, F = M.ficha;
  const { bx, meioDecide, meioBalcao } = lugares(M);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const largo = desenho === "largo";
  const falso = t >= T.falso, testes = t >= T.testes;
  /* o ensaio de agora: o da frase fixa, depois o da frase escrita */
  const segundo = t >= T.b.de;
  const en = segundo ? e.escrito : e.fixo, Tn = segundo ? T.b : T.a;
  const emEnsaio = entre(t, T.a.de, T.testes);
  const ib = e.balcoes.findIndex((x) => x.id === en.decisao);
  const decidiu = emEnsaio && t >= Tn.decide, chegou = emEnsaio && t >= Tn.balcao[1];

  const espera: Ponto = { x: meioDecide.x, y: D.y + D.h + 4 };
  const token = ondeEsta(t, [[Tn.entra[0], M.cartao], [Tn.entra[0] + 0.4, M.inicio], [Tn.entra[1], espera], [Tn.balcao[0], espera], [Tn.balcao[1], meioBalcao(ib)], [Tn.fim[0], meioBalcao(ib)], [Tn.fim[1], M.fim]]);
  const tokenOpa = emEnsaio ? kf(t, [[Tn.entra[0] - 0.2, 0], [Tn.entra[0], 1], [Tn.fim[1], 1], [Tn.fim[1] + 0.3, 0]]) : 0;

  const lista = baloes(e);
  const balao = lista.find((x) => entre(t, x.de, x.ate)) ?? null;
  const opaBalao = balao ? opacidadeDoBalao(t, balao.de, balao.ate, balao === lista[lista.length - 1]) : 0;
  const aponta = (al: Alvo) => balao?.alvo === al && opaBalao > 0.5;
  const fimFileira = bx(e.balcoes.length - 1) + B.w;
  const ia = e.balcoes.findIndex((x) => x.id === e.fixo.decisao), ie = e.balcoes.findIndex((x) => x.id === e.escrito.decisao);
  const alvoPonto = (al: Alvo): Ponto => al === "decidir" ? { x: D.x + D.w, y: meioDecide.y } : al === "roteiro" ? { x: F.x + F.w, y: F.y + F.h / 2 }
    : al === "balcao-a" ? { x: bx(ia) + B.w, y: meioBalcao(ia).y } : al === "balcao-b" ? { x: bx(ie) + B.w, y: meioBalcao(ie).y } : { x: fimFileira, y: meioBalcao(0).y };
  const linhaDe = (al: Alvo) => (al.startsWith("balcao") ? fimFileira : alvoPonto(al).x);

  const fonte = F.fonte - (largo ? 1 : 3);
  const titulo = (texto: string, c: string = cor.fraco) => <b style={{ font: `700 ${F.titulo}px ${mono}`, letterSpacing: ".06em", textTransform: "uppercase", color: c }}>{texto}</b>;
  const feito = (sim: boolean) => <span style={{ color: sim ? cor.ok : cor.linha, fontWeight: 700, marginRight: 6 }}>{sim ? "✓" : "○"}</span>;
  const nome = (id: string) => e.balcoes.find((b) => b.id === id)!.rotulo;

  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui }}>
      {/* a mensagem do ensaio de agora */}
      <div style={{ position: "absolute", left: M.msg.x, top: M.msg.y, width: M.msg.w, boxSizing: "border-box", padding: "10px 16px", border: `2px solid ${cor.linha}`,
        borderRadius: 14, background: cor.papel, opacity: emEnsaio ? kf(t, [[Tn.de, 0], [Tn.de + 0.3, 1]]) : 0, font: `italic ${M.msg.fonte}px/1.35 ${ui}`, color: cor.texto }}>
        “{en.pergunta}”
      </div>

      <svg width={M.w} height={M.h} style={{ position: "absolute", inset: 0 }}>
        <Pontas desenho={desenho} />
        {seta(desenho, M.inicio.x, M.inicio.y + M.pilula.h / 2, meioDecide.x, D.y, false, false, "inicio")}
        {e.balcoes.map((_, i) => seta(desenho, meioDecide.x, D.y + D.h, meioBalcao(i).x, B.y, decidiu && i === ib, decidiu && i !== ib, `ida-${i}`))}
        {e.balcoes.map((_, i) => seta(desenho, meioBalcao(i).x, B.y + B.h, M.fim.x, M.fim.y - M.pilula.h / 2, chegou && i === ib, decidiu && i !== ib, `fim-${i}`))}
        {balao && M.balao.lado ? <line x1={linhaDe(balao.alvo) + 6} y1={alvoPonto(balao.alvo).y} x2={M.balao.x} y2={alvoPonto(balao.alvo).y}
          stroke={cor.acento} strokeWidth={2} strokeDasharray="5 4" opacity={opaBalao} /> : null}
      </svg>

      <Pilula M={M} p={M.inicio} texto="início" />
      <Pilula M={M} p={M.fim} texto="fim" />

      {/* o nó que decide: com o modelo de verdade, ou com o falso */}
      <Caixa x={D.x} y={D.y} w={D.w} h={D.h} borda={!falso && t > 0.3 ? cor.aviso : aponta("decidir") || (emEnsaio && entre(t, Tn.entra[1], Tn.decide)) ? cor.acento : cor.linha}>
        <div style={{ font: `700 ${D.fonte - 3}px/1.15 ${mono}`, color: cor.texto }}>{e.rotuloDecide}</div>
        <div style={{ font: `600 ${D.sub}px/1.2 ${ui}`, color: falso ? cor.acento : cor.aviso }}>{falso ? "com o modelo falso" : "com o modelo de verdade"}</div>
      </Caixa>

      {/* os balcões; nos testes, um ✓ em cada caminho */}
      {e.balcoes.map((x, i) => (
        <div key={x.id}>
          <Caixa x={bx(i)} y={B.y} w={B.w} h={B.h} borda={chegou && i === ib ? cor.ok : decidiu && i === ib ? cor.acento : testes ? cor.ok : cor.linha} opacidade={decidiu && i !== ib ? 0.45 : 1}>
            <div style={{ font: `700 ${B.fonte - 3}px/1.15 ${mono}`, color: cor.texto, overflowWrap: "anywhere" }}>{x.id.replace(/_/g, "_​")}</div>
          </Caixa>
          <div style={{ position: "absolute", left: bx(i) + B.w - 22, top: B.y - 12, width: 28, height: 28, borderRadius: 14, background: cor.ok, color: cor.papel,
            display: "flex", alignItems: "center", justifyContent: "center", font: `700 16px ${ui}`, opacity: kf(t, [[T.testes + i * 0.25, 0], [T.testes + i * 0.25 + 0.3, 1]]) }}>✓</div>
        </div>
      ))}

      <Mensagem M={M} p={token} opacidade={tokenOpa} />

      {/* o cartão de baixo: o modelo de verdade, o que se combinou com o falso, ou a saída do pytest */}
      <div style={{ position: "absolute", left: F.x, top: F.y, width: F.w, minHeight: F.h, boxSizing: "border-box", padding: "8px 14px", borderRadius: 14,
        background: testes ? "#1e2127" : cor.papel, color: testes ? "#e6e1d6" : cor.texto, border: `2px ${falso && !testes ? "dashed" : "solid"} ${aponta("roteiro") ? cor.acento : testes ? "#1e2127" : cor.linha}`,
        display: "grid", alignContent: "center", gap: 3, font: `400 ${fonte}px/1.4 ${testes ? mono : ui}` }}>
        {!falso ? <>
          {titulo("o modelo de verdade", cor.aviso)}
          <span>Cada chamada custa, leva tempo e pode responder diferente da última.</span>
        </> : testes ? <>
          <span style={{ color: "#8b93a1" }}>$ {e.comando}</span>
          {e.linhas.map((l) => <span key={l} style={{ color: /passed/.test(l) ? "#6fcf97" : undefined, fontWeight: /passed/.test(l) ? 700 : 400 }}>{l}</span>)}
        </> : <>
          {titulo("o que se combinou com o modelo falso", cor.acento)}
          {!emEnsaio ? <span style={{ color: cor.fraco }}>as respostas, na ordem, sem chamar ninguém</span> : <>
            <div>{feito(t >= Tn.decide)}1. escolha: <b>{nome(en.decisao)}</b></div>
            {en.textos.map((tx, k) => <div key={tx}>{feito(chegou)}{k + 2}. escreva: “{tx}”</div>)}
            <div style={{ color: chegou ? cor.ok : cor.fraco, fontWeight: chegou ? 600 : 400 }}>
              {!chegou ? "resposta: —" : en.textos.length ? `resposta: “${en.textos[0]}”: a frase chegou` : "resposta: frase fixa, sem pedir nada ao modelo"}
            </div>
          </>}
        </>}
      </div>

      {balao ? <Balao M={M} alvo={alvoPonto(balao.alvo)} opacidade={opaBalao}>{balao.texto}</Balao> : null}
    </AbsoluteFill>
  );
};
