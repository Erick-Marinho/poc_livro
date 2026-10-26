/**
 * A animação do formulário do substituto (Remotion; docs/capacidades/capitulo-2-em-cenas.md, etapa 2), que o leitor
 * toca ou rola (palco/RolaCena.tsx): o mesmo grafo do 2.1. Primeiro, o modelo devolve texto solto, e o código não sabe
 * por qual seta seguir; depois, a Escolha: um formulário com as quatro decisões do contrato e o motivo, que o modelo
 * preenche (a resposta gravada), e uma quinta caixa que o pydantic recusa; com a decisão numa caixa, o caminho é um
 * só, e no balcão o modelo escreve para o cliente (a escrita gravada); no fim, quem faz o quê, modelo ou código.
 * Os balões explicam cada momento. O que se desenha sai de formulario.ts, montado do projeto real.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, kf, mono, ui } from "../palco/video";
import { type Alvo, baloes, curta, type Formulario, QUINTA, SOLTO, T } from "./formulario.ts";
import { Balao, Caixa, type Desenho, entre, lugares, MEDIDAS, Mensagem, ondeEsta, opacidadeDoBalao, Pilula, Pontas, type Ponto, seta } from "./pecas";

export type Props = { formulario: Formulario; desenho: Desenho };

export const FormularioAnimado: React.FC<Props> = ({ formulario: f, desenho }) => {
  const M = MEDIDAS[desenho];
  const D = M.decide, B = M.balcao, F = M.ficha;
  const { bx, meioDecide, meioBalcao } = lugares(M);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const ib = f.balcoes.findIndex((x) => x.id === f.decidiu);
  const largo = desenho === "largo";

  const solto = entre(t, T.solto[0], T.formulario);
  const duvida = entre(t, 3.4, T.formulario); // o código sem saber por qual seta seguir
  const formulario = t >= T.formulario;
  const marcou = t >= T.marca, quinta = kf(t, [[T.quinta[0], 0], [T.quinta[0] + 0.4, 1], [T.quinta[1] - 0.4, 1], [T.quinta[1], 0]]);
  const caminho = t >= T.caminho[0];
  const chegou = t >= T.caminho[1];
  const quem = kf(t, [[T.quem, 0], [T.quem + 0.8, 1]]);

  /* enquanto o modelo escolhe, a mensagem espera logo abaixo do nó, no começo das setas, sem cobrir o nome dele */
  const espera: Ponto = { x: meioDecide.x, y: D.y + D.h + 4 };
  const token = ondeEsta(t, [[T.entra[0], M.cartao], [1.2, M.inicio], [T.entra[1] - 0.3, meioDecide], [T.entra[1], espera], [T.caminho[0], espera], [T.caminho[1], meioBalcao(ib)]]);
  const tokenOpa = kf(t, [[T.entra[0] - 0.2, 0], [T.entra[0], 1], [T.quem - 0.3, 1], [T.quem, 0]]);

  const lista = baloes(f);
  const balao = lista.find((x) => entre(t, x.de, x.ate)) ?? null;
  const opaBalao = balao ? opacidadeDoBalao(t, balao.de, balao.ate, balao === lista[lista.length - 1]) : 0;
  const aponta = (al: Alvo) => balao?.alvo === al && opaBalao > 0.5;
  const fimFileira = bx(f.balcoes.length - 1) + B.w;
  const alvoPonto = (al: Alvo): Ponto => al === "decidir" ? { x: D.x + D.w, y: meioDecide.y } : al === "setas" ? { x: meioDecide.x + 60, y: (D.y + D.h + B.y) / 2 }
    : al === "formulario" ? { x: F.x + F.w, y: F.y + F.h / 2 } : al === "balcao" ? { x: bx(ib) + B.w, y: meioBalcao(ib).y } : { x: fimFileira, y: meioBalcao(0).y };
  const linhaDe = (al: Alvo) => (al === "balcao" || al === "balcoes" ? fimFileira : alvoPonto(al).x);

  // o que o cartão de baixo mostra: o texto solto, o formulário, ou a resposta ao cliente
  const fonte = F.fonte - (largo ? 1 : 3);
  const titulo = (texto: string, acento = false) => <b style={{ font: `700 ${F.titulo}px ${mono}`, letterSpacing: ".06em", textTransform: "uppercase", color: acento ? cor.acento : cor.fraco }}>{texto}</b>;
  const caixinha = (rot: string, marcada: boolean, recusada = false) => (
    <span key={rot} style={{ display: "inline-flex", alignItems: "center", gap: 5, marginRight: 12, whiteSpace: "nowrap", color: recusada ? cor.aviso : marcada ? cor.ok : cor.texto, fontWeight: marcada || recusada ? 700 : 400 }}>
      <span style={{ width: 15, height: 15, borderRadius: 4, border: `2px solid ${recusada ? cor.aviso : marcada ? cor.ok : cor.linha}`, display: "inline-flex", alignItems: "center", justifyContent: "center",
        font: `700 12px ${ui}`, background: marcada ? cor.ok : "transparent", color: cor.papel }}>{marcada ? "✓" : recusada ? <span style={{ color: cor.aviso }}>✗</span> : ""}</span>
      {rot}
    </span>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: cor.nota, fontFamily: ui }}>
      {/* a mensagem */}
      <div style={{ position: "absolute", left: M.msg.x, top: M.msg.y, width: M.msg.w, boxSizing: "border-box", padding: "10px 16px", border: `2px solid ${cor.linha}`,
        borderRadius: 14, background: cor.papel, opacity: t >= T.quem ? 0.45 : 1, font: `italic ${M.msg.fonte}px/1.35 ${ui}`, color: cor.texto }}>“{curta(f.pergunta)}”</div>

      <svg width={M.w} height={M.h} style={{ position: "absolute", inset: 0 }}>
        <Pontas desenho={desenho} />
        {seta(desenho, M.inicio.x, M.inicio.y + M.pilula.h / 2, meioDecide.x, D.y, false, false, "inicio")}
        {f.balcoes.map((_, i) => seta(desenho, meioDecide.x, D.y + D.h, meioBalcao(i).x, B.y, (caminho && t < T.quem && i === ib) || aponta("setas"), caminho && t < T.quem && i !== ib, `ida-${i}`))}
        {f.balcoes.map((_, i) => seta(desenho, meioBalcao(i).x, B.y + B.h, M.fim.x, M.fim.y - M.pilula.h / 2, false, caminho && t < T.quem && i !== ib, `fim-${i}`))}
        {balao && M.balao.lado ? <line x1={linhaDe(balao.alvo) + 6} y1={alvoPonto(balao.alvo).y} x2={M.balao.x} y2={alvoPonto(balao.alvo).y}
          stroke={cor.acento} strokeWidth={2} strokeDasharray="5 4" opacity={opaBalao} /> : null}
      </svg>

      <Pilula M={M} p={M.inicio} texto="início" />
      <Pilula M={M} p={M.fim} texto="fim" />

      {/* o nó que decide: o modelo escolhe */}
      <Caixa x={D.x} y={D.y} w={D.w} h={D.h} borda={entre(t, T.entra[1], T.caminho[0]) || aponta("decidir") ? cor.acento : cor.linha}>
        <div style={{ font: `700 ${D.fonte - 3}px/1.15 ${mono}`, color: cor.texto }}>{f.rotuloDecide}</div>
        <div style={{ font: `400 ${D.sub}px/1.2 ${ui}`, color: cor.fraco }}>o modelo escolhe</div>
      </Caixa>

      {/* os balcões: na dúvida, um ponto de interrogação em cada; no fim, quem faz o quê */}
      {f.balcoes.map((x, i) => {
        const aqui = i === ib;
        const borda = aqui && chegou && t < T.quem ? cor.ok : aqui && caminho && t < T.quem ? cor.acento : cor.linha;
        return (
          <div key={x.id}>
            <Caixa x={bx(i)} y={B.y} w={B.w} h={B.h} borda={borda} opacidade={caminho && t < T.quem && !aqui ? 0.45 : 1}>
              <div style={{ font: `700 ${B.fonte - 3}px/1.15 ${mono}`, color: cor.texto, overflowWrap: "anywhere" }}>{x.id.replace(/_/g, "_​")}</div>
              <div style={{ font: `600 ${B.sub}px/1.2 ${ui}`, marginTop: 4, opacity: quem, color: x.modelo === "não" ? cor.fraco : cor.acento }}>{x.modelo === "não" ? "código: frase fixa" : "modelo escreve"}</div>
            </Caixa>
            <div style={{ position: "absolute", left: bx(i) + B.w - 22, top: B.y - 12, width: 28, height: 28, borderRadius: 14, background: cor.aviso, color: cor.papel,
              display: "flex", alignItems: "center", justifyContent: "center", font: `700 17px ${ui}`, opacity: duvida ? kf(t, [[3.4, 0], [3.8, 1], [5.8, 1], [6.2, 0]]) : 0 }}>?</div>
          </div>
        );
      })}

      <Mensagem M={M} p={token} opacidade={tokenOpa} />

      {/* o cartão de baixo: o texto solto (ilustração), a Escolha, ou a resposta que o modelo escreveu */}
      <div style={{ position: "absolute", left: F.x, top: F.y, width: F.w, minHeight: F.h, boxSizing: "border-box", padding: "8px 14px", borderRadius: 14, background: cor.papel,
        border: `2px ${formulario ? "solid" : "dashed"} ${aponta("formulario") ? cor.acento : solto ? cor.aviso : cor.linha}`, display: "grid", alignContent: "center", gap: 4,
        font: `400 ${fonte}px/1.35 ${ui}`, color: cor.texto, opacity: t < T.solto[0] ? kf(t, [[T.solto[0] - 0.4, 0], [T.solto[0], 1]]) : 1 }}>
        {!formulario ? <>
          {titulo("se o agente pedisse texto (ilustração)")}
          <i style={{ color: cor.texto }}>“{SOLTO}”</i>
        </> : entre(t, T.escreve, T.quem) ? <>
          {titulo(`a resposta ao cliente: o modelo escreve, no ${f.decidiu}`, true)}
          <span>“{f.escrita.length > 110 ? `${f.escrita.slice(0, 108)}…` : f.escrita}”</span>
        </> : <>
          {titulo("a Escolha: a saída estruturada", true)}
          <div style={{ lineHeight: 1.6 }}>
            <span style={{ color: cor.fraco, marginRight: 8 }}>decisao:</span>
            {f.balcoes.map((x) => caixinha(x.rotulo, marcou && x.id === f.decidiu))}
            {quinta > 0 ? <span style={{ opacity: quinta }}>{caixinha(`${QUINTA}: o pydantic recusa`, false, true)}</span> : null}
          </div>
          <div><span style={{ color: cor.fraco }}>motivo:</span> {t >= T.marca + 0.4 ? f.motivo : "—"}</div>
        </>}
      </div>

      {balao ? <Balao M={M} alvo={alvoPonto(balao.alvo)} opacidade={opaBalao}>{balao.texto}</Balao> : null}
    </AbsoluteFill>
  );
};
