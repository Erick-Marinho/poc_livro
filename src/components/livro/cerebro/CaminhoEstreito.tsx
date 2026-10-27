/**
 * "O que vamos construir", no celular: o mesmo caminho da pergunta, em pé (540×960), com as três cenas que tocam (a
 * pergunta, a busca e as frases que empatam; docs/capacidades/controles-nos-experimentos.md). No computador, o desenho
 * largo (CaminhoDaPergunta.tsx). Os números são os do rastro gravado, pelo mesmo montar.
 */
import { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { c, ComData, kf, mono, ui, useT } from "./CaminhoDaPergunta";
import { montar, type Props, T, titulo, visiveis } from "./caminho";

export const ESTREITO = { largura: 540, altura: 960 };

export const CaminhoEstreito: React.FC<Props> = (props) => {
  const m = useMemo(() => montar(props), [props]);
  const t = useT();
  const { r } = m;
  const passos = visiveis(m);
  const i = Math.max(0, passos.filter((p) => p.em <= t).length - 1);
  const notas = [...r.notas].sort((a, b) => b.pontos - a.pontos);
  const maximo = Math.max(...notas.map((n) => n.pontos));
  const achadas = notas.filter((n) => n.achada).length;
  const cena = (de: number, ate: number) => kf(t, [[de, 0], [de + 0.5, 1], [ate - 0.4, 1], [ate, 0]]);
  const etapas = [
    { nome: "a pergunta", valor: `${r.palavras.length} palavras`, de: T.pergunta },
    { nome: "a busca", valor: `${achadas} de ${r.notas.length} notas`, de: T.busca },
    { nome: "as frases", valor: `${m.empate.length} empatam`, de: T.frases },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: c.fundo, color: c.texto, fontFamily: ui }}>
      <div style={{ position: "absolute", left: 24, right: 24, top: 20, fontSize: 24, fontWeight: 700, lineHeight: 1.25 }}>“{r.pergunta}”</div>
      <div style={{ position: "absolute", left: 24, right: 24, top: 64, fontSize: 14, color: c.fraco }}>o rastro gravado do cerebro.py</div>

      {/* as três etapas, acesas uma a uma */}
      <div style={{ position: "absolute", left: 24, right: 24, top: 100, display: "flex", gap: 8 }}>
        {etapas.map((e) => {
          const viva = t >= e.de;
          return (
            <div key={e.nome} style={{ flex: 1, borderRadius: 10, padding: "8px 6px", textAlign: "center", border: `1.5px solid ${viva ? c.acento : c.linha}`,
              background: viva ? c.acentoFundo : c.cartao, opacity: viva ? 1 : 0.5 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{e.nome}</div>
              <div style={{ fontFamily: mono, fontSize: 13, color: c.fraco, marginTop: 2 }}>{viva ? e.valor : "…"}</div>
            </div>
          );
        })}
      </div>

      {/* 1. a pergunta vira palavras */}
      <div style={{ position: "absolute", left: 24, right: 24, top: 230, opacity: cena(T.pergunta, T.busca), display: "grid", gap: 14, justifyItems: "center" }}>
        <div style={{ fontSize: 16, color: c.fraco }}>as palavras que contam</div>
        {r.palavras.map((p, k) => (
          <div key={p} style={{ fontFamily: mono, fontSize: 34, fontWeight: 600, color: c.acento, border: `2px solid ${c.acento}`, borderRadius: 10, padding: "4px 18px",
            opacity: kf(t, [[0.6 + k * 0.5, 0], [1 + k * 0.5, 1]]) }}>{p}</div>
        ))}
      </div>

      {/* 2. a busca: a nota de cada uma das notas do cofre; as melhores seguem */}
      <div style={{ position: "absolute", left: 24, right: 24, top: 190, opacity: cena(T.busca, T.frases), display: "grid", gap: 6 }}>
        <div style={{ fontSize: 15, color: c.fraco, marginBottom: 4 }}>a nota que o BM25 deu a cada nota do cofre</div>
        {notas.map((n, k) => (
          <div key={n.arquivo} style={{ display: "grid", gridTemplateColumns: "1fr 64px", alignItems: "center", gap: 8, opacity: n.achada ? 1 : 0.4 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: n.achada ? 600 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{titulo(n.arquivo)} <span style={{ fontFamily: mono, fontSize: 12, color: c.fraco }}>{n.data}</span></div>
              <div style={{ height: 5, borderRadius: 3, background: n.achada ? c.acento : c.apagado, marginTop: 3,
                width: `${(100 * n.pontos) / maximo * kf(t, [[T.busca + 0.4 + k * 0.12, 0], [T.busca + 1 + k * 0.12, 1]])}%` }} />
            </div>
            <div style={{ fontFamily: mono, fontSize: 14, color: c.fraco, textAlign: "right" }}>{n.pontos.toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* 3. as frases que empatam, cada uma com a nota e a data */}
      <div style={{ position: "absolute", left: 24, right: 24, top: 190, opacity: kf(t, [[T.frases, 0], [T.frases + 0.5, 1]]), display: "grid", gap: 10 }}>
        <div style={{ fontSize: 15, color: c.fraco }}>as frases com mais palavras da pergunta: {m.empate.length} empatam</div>
        {m.empate.map((f, k) => (
          <div key={f.j} style={{ borderRadius: 10, background: c.cartao, border: `1px solid ${c.linha}`, padding: "10px 12px",
            opacity: kf(t, [[T.frases + 0.6 + k * 0.4, 0], [T.frases + 1 + k * 0.4, 1]]) }}>
            <div style={{ fontSize: 13, color: c.fraco }}>{titulo(f.nota)} · <span style={{ fontFamily: mono }}>{f.data}</span></div>
            <div style={{ fontSize: 18, lineHeight: 1.35, marginTop: 3 }}><ComData frase={f.frase} novo={m.novo} /></div>
          </div>
        ))}
        <div style={{ fontFamily: mono, fontSize: 16, textAlign: "right", opacity: kf(t, [[T.frases + 2.6, 0], [T.frases + 3, 1]]) }}>
          {m.contagem.map((x) => <span key={x.prazo} style={{ marginLeft: 14, color: x.prazo === m.novo ? c.ciano : c.ambar }}>{x.prazo} ×{x.vezes}</span>)}
        </div>
      </div>

      {/* o que acontece agora, em uma frase */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, minHeight: 120, padding: "14px 24px", borderTop: `1px solid ${c.linha}`, background: c.chao, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ fontFamily: mono, fontSize: 16, color: c.fraco }}>{i + 1}/{passos.length}</span>
        <span style={{ fontSize: 19, lineHeight: 1.35, opacity: kf(t, [[passos[i].em, 0], [passos[i].em + 0.3, 1]]) }}>{passos[i].texto}</span>
      </div>
    </AbsoluteFill>
  );
};
