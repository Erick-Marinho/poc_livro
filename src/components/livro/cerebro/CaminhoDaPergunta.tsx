/**
 * "O que vamos construir", em vídeo (Remotion; docs/capacidades/figura-em-video.md): a pergunta do prazo atravessando o
 * cérebro do experimento. Os mesmos objetos seguem de uma etapa para a outra: as palavras ficam ao lado da busca, as
 * notas achadas viram o cabeçalho das suas frases, e as frases que empatam viram os cartões que a regra da data põe
 * sobre o eixo do tempo. Os números são os do rastro gravado. O Studio do my-video importa esta composição.
 */
import { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CARTAO,
  EIXO,
  type Frase,
  type Montado,
  montar,
  type Props,
  T,
  titulo, visiveis } from "./caminho";

// As fontes que a página já carrega (o Studio carrega as mesmas).
export const ui = '"IBM Plex Sans", "Segoe UI", system-ui, sans-serif';
export const mono = '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace';

// As cores do palco (palco/palco.css).
export const c = {
  fundo: "#111318",
  chao: "#15181e",
  cartao: "#1c2028",
  linha: "#2c323d",
  texto: "#e7e9ee",
  fraco: "#8e95a3",
  apagado: "#5b6270",
  acento: "#5aa9ff",
  acentoFundo: "rgba(90, 169, 255, 0.14)",
  verde: "#2fd394",
  ambar: "#ffb547",
  ciano: "#5fd3e6",
  nada: "rgba(0, 0, 0, 0)",
};

const suave = Easing.bezier(0.16, 1, 0.3, 1);

// Um valor que passa pelos pontos [segundo, valor], parado antes do primeiro e depois do último.
export const kf = (t: number, pontos: [number, number][], easing = suave) =>
  interpolate(
    t,
    pontos.map((p) => p[0]),
    pontos.map((p) => p[1]),
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing },
  );

export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

// A data dentro da frase, marcada: a nova numa cor, a velha noutra.
export const ComData: React.FC<{ frase: string; novo: string }> = ({ frase, novo }) => (
  <>
    {frase.split(/(\d{2}\/\d{2})/).map((p, i) =>
      i % 2 ? (
        <mark
          key={i}
          style={{
            backgroundColor:
              p === novo ? "rgba(95, 211, 230, 0.16)" : "rgba(255, 181, 71, 0.18)",
            color: p === novo ? c.ciano : c.ambar,
            borderRadius: 4,
            padding: "0 4px",
            fontWeight: 600,
          }}
        >
          {p}
        </mark>
      ) : (
        p
      ),
    )}
  </>
);

const Barra: React.FC<{ m: Montado }> = ({ m }) => (
  <div
    style={{
      position: "absolute",
      inset: "0 0 auto 0",
      height: 56,
      padding: "0 32px",
      display: "flex",
      alignItems: "center",
      borderBottom: `1px solid ${c.linha}`,
    }}
  >
    <span style={{ flex: 1, fontSize: 24, fontWeight: 600 }}>“{m.r.pergunta}”</span>
    <span style={{ fontSize: 20, color: c.fraco }}>o rastro gravado do cerebro.py</span>
  </div>
);

const Fluxo: React.FC<{ m: Montado }> = ({ m }) => {
  const t = useT();
  const atual = m.passos.filter((p) => p.em <= t).pop()!.no;
  const inicio = (no: number) => m.passos.find((p) => p.no === no)!.em;

  return (
    <>
      {m.nos.map((n, i) => {
        const estado = i < atual ? "feito" : i === atual ? "agora" : "antes";
        const valor =
          i > atual ? "" : i === 3 && t < T.com + 1.4 ? "?" : n.valor;
        return (
          <div key={n.nome}>
            <div
              style={{
                position: "absolute",
                left: 40 + i * 248,
                top: 72,
                width: 208,
                height: 64,
                borderRadius: 12,
                border: `2px solid ${estado === "agora" ? c.acento : c.linha}`,
                backgroundColor: estado === "agora" ? c.acentoFundo : c.cartao,
                opacity: estado === "antes" ? 0.45 : 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <b
                style={{
                  fontSize: 20,
                  color:
                    estado === "agora" ? c.acento : estado === "feito" ? c.texto : c.fraco,
                }}
              >
                {n.nome}
              </b>
              <span style={{ fontFamily: mono, fontSize: 20, minHeight: 26 }}>{valor}</span>
            </div>
            {i < m.nos.length - 1 ? (
              <div
                style={{
                  position: "absolute",
                  left: 40 + i * 248 + 208,
                  top: 103,
                  width: 40,
                  height: 2,
                  backgroundColor: c.linha,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    backgroundColor: c.acento,
                    width: kf(t, [
                      [inicio(i + 1), 0],
                      [inicio(i + 1) + 0.5, 40],
                    ]),
                  }}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
};

// Um rótulo pequeno que explica o que está no palco, entrando e saindo nos segundos dados.
const Rotulo: React.FC<{
  x: number;
  y: number;
  pontos: [number, number][];
  italico?: boolean;
  children: React.ReactNode;
}> = ({ x, y, pontos, italico, children }) => {
  const t = useT();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontSize: 20,
        color: c.fraco,
        fontStyle: italico ? "italic" : "normal",
        opacity: kf(t, pontos),
      }}
    >
      {children}
    </div>
  );
};

const Palavra: React.FC<{ p: Montado["palavras"][number]; i: number; fonte: number }> = ({
  p,
  i,
  fonte,
}) => {
  const t = useT();
  const a = 0.2 + i * 0.15;

  return (
    <div
      style={{
        position: "absolute",
        left: p.fica ? kf(t, [[T.busca, p.x], [T.busca + 0.8, 40]]) : p.x,
        top: p.fica ? kf(t, [[T.busca, 360], [T.busca + 0.8, 186 + p.ordem * 56]]) : 360,
        scale: p.fica ? kf(t, [[T.busca, 1], [T.busca + 0.8, 0.7]]) : 1,
        transformOrigin: "top left",
        translate: `0px ${kf(t, [[a, 12], [a + 0.4, 0]])}px`,
        opacity: p.fica
          ? kf(t, [[a, 0], [a + 0.3, 1], [T.sem, 1], [T.sem + 0.4, 0]])
          : kf(t, [[a, 0], [a + 0.3, 1], [1.4, 1], [1.9, 0.35], [3.4, 0.35], [3.9, 0]]),
        fontFamily: mono,
        fontSize: fonte,
        fontWeight: 600,
        whiteSpace: "nowrap",
        padding: "10px 16px",
        borderRadius: 12,
        backgroundColor: p.fica
          ? interpolateColors(t, [1.4, 1.9], [c.cartao, c.acentoFundo])
          : c.cartao,
        color: p.fica ? interpolateColors(t, [1.4, 1.9], [c.texto, c.acento]) : c.texto,
        boxShadow: p.fica
          ? `inset 0 0 0 2px ${interpolateColors(t, [1.4, 1.9], [c.nada, c.acento])}`
          : "none",
      }}
    >
      {p.texto}
      {p.fica ? null : (
        <div
          style={{
            position: "absolute",
            left: 12,
            right: 12,
            top: "50%",
            height: 3,
            backgroundColor: c.fraco,
            transformOrigin: "left",
            scale: `${kf(t, [[1.4, 0], [1.9, 1]])} 1`,
          }}
        />
      )}
    </div>
  );
};

const LinhaNota: React.FC<{ m: Montado; i: number; maior: number }> = ({ m, i, maior }) => {
  const t = useT();
  const n = m.r.notas[i];
  const y0 = 186 + i * 36;
  const a = T.busca + 0.3 + i * 0.07;
  const marca =
    n.arquivo === m.r.sem_data.nota ? c.ambar : n.arquivo === m.r.com_data.nota ? c.ciano : null;
  const acende = kf(t, [[T.busca + 4.2, 0], [T.busca + 4.6, 1]]);

  return (
    <div
      style={{
        position: "absolute",
        left: 290,
        width: 950,
        height: 28,
        top: n.achada ? kf(t, [[T.frases, y0], [T.frases + 0.8, m.cabeca[n.arquivo]]]) : y0,
        opacity: n.achada
          ? kf(t, [[a, 0], [a + 0.3, 1], [T.sem, 1], [T.sem + 0.4, 0]])
          : kf(t, [
              [a, 0],
              [a + 0.3, 1],
              [T.busca + 3, 1],
              [T.busca + 3.4, 0.4],
              [T.frases, 0.4],
              [T.frases + 0.4, 0],
            ]),
        display: "flex",
        alignItems: "center",
        gap: 20,
      }}
    >
      {n.achada ? (
        <div
          style={{
            position: "absolute",
            left: -14,
            width: 4,
            height: 28,
            borderRadius: 2,
            backgroundColor: c.acento,
            opacity: kf(t, [[T.busca + 3, 0], [T.busca + 3.4, 1]]),
          }}
        />
      ) : null}
      <span
        style={{
          width: 300,
          fontSize: 20,
          fontWeight: 600,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {n.titulo}
      </span>
      <span
        style={{
          width: 80,
          textAlign: "center",
          fontFamily: mono,
          fontSize: 20,
          borderRadius: 6,
          color: marca ? interpolateColors(acende, [0, 1], [c.fraco, marca]) : c.fraco,
          boxShadow: marca
            ? `inset 0 0 0 2px ${interpolateColors(acende, [0, 1], [c.nada, marca])}`
            : "none",
        }}
      >
        {n.data}
      </span>
      <span
        style={{
          width: 440,
          height: 10,
          borderRadius: 5,
          backgroundColor: c.chao,
          opacity: kf(t, [[T.frases, 1], [T.frases + 0.4, 0]]),
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 5,
            backgroundColor: n.achada ? c.acento : c.apagado,
            width: kf(t, [[a + 0.4, 0], [a + 1, (n.pontos / maior) * 440]]),
          }}
        />
      </span>
      <span
        style={{
          width: 70,
          textAlign: "right",
          fontFamily: mono,
          fontSize: 20,
          color: c.fraco,
          opacity: kf(t, [[T.frases, 1], [T.frases + 0.4, 0]]),
        }}
      >
        {n.pontos.toFixed(2)}
      </span>
    </div>
  );
};

const Selo: React.FC<{ cor: string; opacity: number; children: React.ReactNode }> = ({
  cor,
  opacity,
  children,
}) => (
  <b
    style={{
      position: "absolute",
      right: "calc(100% + 14px)",
      top: "50%",
      translate: "0 -50%",
      whiteSpace: "nowrap",
      fontSize: 20,
      color: cor,
      opacity,
    }}
  >
    {children}
  </b>
);

const LinhaFrase: React.FC<{ m: Montado; f: Frase; j: number }> = ({ m, f, j }) => {
  const t = useT();
  const e = m.empate.find((x) => x.j === j);
  const a = T.frases + 0.9 + m.ordemNaLista.indexOf(j) * 0.15;
  const yLista = m.linhaDaFrase[j];
  const yCabeca = m.cabeca[f.nota];
  const escolhidaSem = e !== undefined && f.frase === m.r.sem_data.frase;
  const escolhidaCom = e !== undefined && f.frase === m.r.com_data.frase;
  const antes = e !== undefined && m.r.com_data.antes?.frase === f.frase;

  const borda = escolhidaSem
    ? interpolateColors(
        t,
        [T.sem, T.sem + 0.6, T.sem + 1.2, T.sem + 1.5, T.com, T.com + 0.4],
        [c.nada, c.linha, c.linha, c.ambar, c.ambar, c.linha],
      )
    : escolhidaCom
      ? interpolateColors(
          t,
          [T.sem, T.sem + 0.6, T.com + 1.4, T.com + 1.8],
          [c.nada, c.linha, c.linha, c.verde],
        )
      : interpolateColors(t, [T.sem, T.sem + 0.6], [c.nada, c.linha]);

  return (
    <div
      style={{
        position: "absolute",
        top: e
          ? kf(t, [
              [a, yCabeca],
              [a + 0.5, yLista],
              [T.sem, yLista],
              [T.sem + 0.8, e.semTopo],
              [T.com, e.semTopo],
              [T.com + 0.9, e.comTopo],
            ])
          : kf(t, [[a, yCabeca], [a + 0.5, yLista]]),
        left: e
          ? kf(t, [[T.sem, 330], [T.sem + 0.8, 350], [T.com, 350], [T.com + 0.9, e.comEsquerda]])
          : 330,
        width: e ? kf(t, [[T.sem, 910], [T.sem + 0.8, CARTAO.largura]]) : 910,
        height: e ? kf(t, [[T.sem, 32], [T.sem + 0.8, CARTAO.altura]]) : 32,
        opacity: e
          ? kf(t, [[a, 0], [a + 0.4, 1], [T.regua, 1], [T.regua + 0.4, 0]])
          : kf(t, [
              [a, 0],
              [a + 0.4, 1],
              [T.frases + 3, 1],
              [T.frases + 3.4, 0.4],
              [T.sem, 0.4],
              [T.sem + 0.4, 0],
            ]),
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: e ? `0 ${kf(t, [[T.sem, 0], [T.sem + 0.8, 16]])}px` : 0,
        borderRadius: 12,
        border: `2px solid ${borda}`,
        backgroundColor: e
          ? interpolateColors(t, [T.sem, T.sem + 0.6], [c.nada, c.cartao])
          : c.nada,
        fontSize: 21,
        whiteSpace: "nowrap",
      }}
    >
      {escolhidaCom ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 10,
            backgroundColor: "rgba(47, 211, 148, 0.08)",
            opacity: kf(t, [[T.com + 1.4, 0], [T.com + 1.8, 1]]),
          }}
        />
      ) : null}
      {e ? (
        <div
          style={{
            position: "absolute",
            left: -12,
            width: 4,
            height: 28,
            borderRadius: 2,
            backgroundColor: c.acento,
            opacity: kf(t, [[T.frases + 3, 0], [T.frases + 3.4, 1], [T.sem, 1], [T.sem + 0.4, 0]]),
          }}
        />
      ) : null}
      {/* o mesmo lugar mostra quantas palavras a frase tem, e depois a data da nota */}
      <span style={{ position: "relative", width: 64, height: 30, flex: "none" }}>
        <span
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: c.chao,
            fontFamily: mono,
            fontSize: 20,
            fontWeight: 600,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: e ? kf(t, [[T.sem, 1], [T.sem + 0.5, 0]]) : 1,
          }}
        >
          {f.palavras}
        </span>
        {e ? (
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 2,
              fontFamily: mono,
              fontSize: 20,
              fontWeight: 600,
              color: c.fraco,
              opacity: kf(t, [[T.sem + 0.3, 0], [T.sem + 0.8, 1]]),
            }}
          >
            {f.data}
          </span>
        ) : null}
      </span>
      <span
        style={{ position: "relative", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}
      >
        <ComData frase={f.frase} novo={m.novo} />
      </span>
      {escolhidaSem ? (
        <Selo
          cor={c.ambar}
          opacity={kf(t, [[T.sem + 1.2, 0], [T.sem + 1.5, 1], [T.com, 1], [T.com + 0.3, 0]])}
        >
          ✗ a velha
        </Selo>
      ) : null}
      {antes ? (
        <Selo cor={c.fraco} opacity={kf(t, [[T.com + 1.4, 0], [T.com + 1.8, 1]])}>
          antes
        </Selo>
      ) : null}
      {escolhidaCom ? (
        <Selo cor={c.verde} opacity={kf(t, [[T.com + 1.4, 0], [T.com + 1.8, 1]])}>
          ✓ vale esta
        </Selo>
      ) : null}
    </div>
  );
};

const Eixo: React.FC<{ m: Montado }> = ({ m }) => {
  const t = useT();
  const some: [number, number][] = [[T.regua, 1], [T.regua + 0.4, 0]];

  return (
    <div style={{ opacity: kf(t, [[T.com, 0], [T.com + 0.1, 1], ...some]) }}>
      <div
        style={{
          position: "absolute",
          left: EIXO.de,
          top: EIXO.y,
          height: 2,
          backgroundColor: c.fraco,
          width: kf(t, [[T.com + 0.5, 0], [T.com + 1.1, EIXO.ate - EIXO.de]]),
        }}
      />
      {m.empate.map((e) => (
        <div
          key={e.j}
          style={{
            position: "absolute",
            left: e.xDaData - 1,
            top: e.comTopo + CARTAO.altura,
            width: 2,
            height: EIXO.y - e.comTopo - CARTAO.altura,
            backgroundColor: e.frase === m.r.com_data.frase ? c.verde : c.linha,
            opacity: kf(t, [[T.com + 1, 0], [T.com + 1.4, 1]]),
          }}
        />
      ))}
      {m.marcas.map((d) => (
        <div
          key={d.data}
          style={{
            position: "absolute",
            left: d.x - 40,
            top: EIXO.y - 6,
            width: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            opacity: kf(t, [[T.com + 0.8, 0], [T.com + 1.2, 1]]),
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: c.fraco }} />
          <span style={{ fontFamily: mono, fontSize: 20, color: c.fraco }}>{d.data}</span>
        </div>
      ))}
    </div>
  );
};

const Contagem: React.FC<{ m: Montado }> = ({ m }) => {
  const t = useT();
  return (
    <div
      style={{
        position: "absolute",
        right: 40,
        top: 604,
        display: "flex",
        gap: 16,
        fontFamily: mono,
        fontSize: 22,
        opacity: kf(t, [[T.frases + 3.4, 0], [T.frases + 3.8, 1], [T.sem, 1], [T.sem + 0.4, 0]]),
      }}
    >
      {m.contagem.map((x) => (
        <span key={x.prazo} style={{ color: x.prazo === m.novo ? c.ciano : c.ambar }}>
          {x.prazo} ×{x.vezes}
        </span>
      ))}
    </div>
  );
};

const Resposta: React.FC<{
  m: Montado;
  escolha: { frase: string; nota: string; data: string };
  pontos: [number, number][];
}> = ({ m, escolha, pontos }) => {
  const t = useT();
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        top: 606,
        textAlign: "center",
        fontFamily: mono,
        fontSize: 20,
        color: c.fraco,
        opacity: kf(t, pontos),
      }}
    >
      resposta: <span style={{ color: c.texto }}><ComData frase={escolha.frase} novo={m.novo} /></span>
      {"  ←  "}
      {titulo(escolha.nota)}, {escolha.data}
    </div>
  );
};

const Medida: React.FC<{ m: Montado; i: number }> = ({ m, i }) => {
  const t = useT();
  const x = m.medidas[i];
  const a = T.regua + 0.5 + i * 0.9;
  const contadas = Math.round(kf(t, [[a + 0.4, 0], [a + 1.4, x.acertos]], Easing.linear));
  const errou = kf(t, [[a + 1.4, 0], [a + 1.7, 1]]);

  return (
    <div
      style={{
        position: "absolute",
        left: 140,
        top: 220 + i * 110,
        display: "flex",
        alignItems: "center",
        gap: 40,
        opacity: kf(t, [[a, 0], [a + 0.4, 1]]),
        translate: `0px ${kf(t, [[a, 16], [a + 0.5, 0]])}px`,
      }}
    >
      <div style={{ width: 320 }}>
        <div style={{ fontSize: 28, fontWeight: 600 }}>{x.nome}</div>
        <div style={{ fontSize: 20, color: c.fraco }}>{x.detalhe}</div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {Array.from({ length: m.total }, (_, q) => (
          <div
            key={q}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: q < contadas ? c.verde : c.chao,
              border: `2px solid ${
                q < contadas
                  ? c.verde
                  : q >= x.acertos
                    ? interpolateColors(errou, [0, 1], [c.linha, c.ambar])
                    : c.linha
              }`,
            }}
          />
        ))}
      </div>
      <div style={{ fontFamily: mono, fontSize: 30, fontWeight: 600, width: 170 }}>
        {contadas} de {m.total}
      </div>
    </div>
  );
};

const Narra: React.FC<{ m: Montado }> = ({ m }) => {
  const t = useT();
  const i = m.passos.filter((p) => p.em <= t).length - 1;
  const p = m.passos[i];

  return (
    <div
      style={{
        position: "absolute",
        inset: "auto 0 0 0",
        height: 64,
        padding: "0 32px",
        borderTop: `1px solid ${c.linha}`,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <span style={{ fontFamily: mono, fontSize: 20, color: c.fraco }}>
        {i + 1}/{visiveis(m).length}
      </span>
      <span style={{ fontSize: 21, lineHeight: 1.3, opacity: kf(t, [[p.em, 0], [p.em + 0.3, 1]]) }}>
        {p.texto}
      </span>
    </div>
  );
};

export const CaminhoDaPergunta: React.FC<Props> = ({ bruto, comando, regua }) => {
  const m = useMemo(() => montar({ bruto, comando, regua }), [bruto, comando, regua]);
  const maior = Math.max(...m.r.notas.map((n) => n.pontos));

  return (
    <AbsoluteFill style={{ backgroundColor: c.fundo, color: c.texto, fontFamily: ui }}>
      <Barra m={m} />
      <Fluxo m={m} />

      <Rotulo x={40} y={152} pontos={[[T.busca + 0.5, 0], [T.busca + 0.9, 1], [T.sem, 1], [T.sem + 0.4, 0]]}>
        as palavras
      </Rotulo>
      {m.palavras.map((p, i) => (
        <Palavra key={i} p={p} i={i} fonte={m.fonteP} />
      ))}

      <Rotulo x={290} y={152} pontos={[[T.busca + 0.5, 0], [T.busca + 0.9, 1], [T.frases, 1], [T.frases + 0.4, 0]]}>
        as {m.r.notas.length} notas do cofre, com a nota que o BM25 deu a cada uma
      </Rotulo>
      {m.r.notas.map((n, i) => (
        <LinhaNota key={n.arquivo} m={m} i={i} maior={maior} />
      ))}

      <Rotulo x={290} y={140} pontos={[[T.frases + 0.4, 0], [T.frases + 0.8, 1], [T.sem, 1], [T.sem + 0.4, 0]]}>
        as frases das notas achadas, com quantas palavras da pergunta cada uma tem
      </Rotulo>
      <Rotulo
        x={350}
        y={176}
        italico
        pontos={[[T.sem + 0.6, 0], [T.sem + 1, 1], [T.com, 1], [T.com + 0.3, 0]]}
      >
        na ordem da busca: a nota mais parecida em cima
      </Rotulo>
      <Rotulo
        x={40}
        y={176}
        italico
        pontos={[[T.com + 0.9, 0], [T.com + 1.3, 1], [T.regua, 1], [T.regua + 0.4, 0]]}
      >
        na ordem da data: a nota mais nova em cima, e cada uma no seu dia
      </Rotulo>

      <Eixo m={m} />
      {m.r.frases.map((f, j) => (
        <LinhaFrase key={j} m={m} f={f} j={j} />
      ))}
      <Contagem m={m} />
      <Resposta
        m={m}
        escolha={m.r.sem_data}
        pontos={[[T.sem + 1.6, 0], [T.sem + 1.9, 1], [T.com, 1], [T.com + 0.3, 0]]}
      />
      <Resposta
        m={m}
        escolha={m.r.com_data}
        pontos={[[T.com + 1.9, 0], [T.com + 2.2, 1], [T.regua, 1], [T.regua + 0.4, 0]]}
      />

      {m.medidas.map((x, i) => (
        <Medida key={x.nome} m={m} i={i} />
      ))}

      <Narra m={m} />
    </AbsoluteFill>
  );
};
