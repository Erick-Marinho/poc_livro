/**
 * A ilha da figura do agente: o vídeo no Player do Remotion, só com tocar e pausar, num botão discreto no canto.
 * Parada, mostra o fim do primeiro cenário e quanto o vídeo dura; o primeiro play começa do início. No R12, antes da
 * decisão, o vídeo para e pergunta o que o agente deve fazer (a aposta); a resposta do contrato aparece ao lado da do
 * leitor. No modo direto e para quem pede menos movimento, mostra o último quadro; no modo direto, sem aposta.
 */
import { Player, type PlayerRef } from "@remotion/player";
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { useDireto } from "../palco/direto";
import { IC } from "../palco/Palco";
import { AgenteAoVivo, COR, type Props, quadroDoVideo } from "./AgenteAoVivo";
import { DECISOES, type Escolha } from "./cenarios";
import "../palco/palco.css";

// "45 s", ou "2 min" a partir de um minuto e meio
const duracaoLegivel = (s: number) => (s >= 90 ? `${Math.round(s / 60)} min` : `${Math.round(s)} s`);
type Aposta = { fase: "esperando" | "perguntando" | "feita"; escolha: Escolha | null };
const vidro = { background: "rgba(17, 19, 24, .78)", border: "1px solid rgba(231, 233, 238, .18)", color: "var(--palco-texto)" } as const;

export default function FiguraAgenteVideo({ cenarios, loja }: Props) {
  const ref = useRef<PlayerRef>(null);
  const direto = useDireto();
  const props = useMemo(() => ({ cenarios, loja }), [cenarios, loja]);
  const q = useMemo(() => quadroDoVideo(props), [props]);
  const [tocando, setTocando] = useState(false);
  const [comecou, setComecou] = useState(false);
  const [aposta, setAposta] = useState<Aposta>({ fase: "esperando", escolha: null });
  const [resultado, setResultado] = useState(false);
  const estado = useRef({ aposta, direto, resultado });
  estado.current = { aposta, direto, resultado };
  const primeira = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const toca = () => setTocando(true), para = () => setTocando(false);
    /* só muda o estado quando a aposta chega ou o resultado entra e sai, não a cada quadro */
    const quadro = (e: { detail: { frame: number } }) => {
      const f = e.detail.frame, s = estado.current, a = q.aposta;
      if (!a) return;
      if (s.aposta.fase === "esperando" && !s.direto && f >= a.quadro && f < a.quadro + 15) {
        p.pause(); p.seekTo(a.quadro); setAposta({ fase: "perguntando", escolha: null });
      }
      const mostra = s.aposta.fase === "feita" && f >= a.revela && f < a.fim;
      if (mostra !== s.resultado) setResultado(mostra);
    };
    p.addEventListener("play", toca); p.addEventListener("pause", para); p.addEventListener("ended", para);
    p.addEventListener("frameupdate", quadro);
    return () => {
      p.removeEventListener("play", toca); p.removeEventListener("pause", para); p.removeEventListener("ended", para);
      p.removeEventListener("frameupdate", quadro);
    };
  }, [q]);
  useEffect(() => {
    if (direto || matchMedia("(prefers-reduced-motion: reduce)").matches) { ref.current?.pause(); ref.current?.seekTo(q.duracao - 1); }
  }, [direto, q.duracao]);
  useEffect(() => { if (aposta.fase === "perguntando") primeira.current?.focus(); }, [aposta.fase]);

  const alternar = (e: MouseEvent) => {
    const p = ref.current;
    if (!p) return;
    if (p.isPlaying()) { p.pause(); return; }
    /* o primeiro play, e o play depois do fim, começam do início */
    if (!comecou || p.getCurrentFrame() >= q.duracao - 1) p.seekTo(0);
    setComecou(true);
    p.play(e);
  };
  const apostar = (escolha: Escolha | null, e: MouseEvent) => {
    setAposta({ fase: "feita", escolha });
    ref.current?.play(e);
  };

  const a = q.aposta;
  /* a pista da aposta: o passo do roteiro logo antes da decisão (a mesma frase da legenda, que o cartão cobre) */
  const pista = useMemo(() => {
    const passos = cenarios.find((c) => c.caso === a?.caso)?.passos ?? [];
    return passos[passos.findIndex((p) => p.no === "decisao") - 1]?.texto;
  }, [cenarios, a?.caso]);
  const perguntando = aposta.fase === "perguntando";
  return <div className="palco" style={{ position: "relative" }}>
    <Player ref={ref} component={AgenteAoVivo} inputProps={props} durationInFrames={q.duracao} fps={q.fps}
      compositionWidth={q.largura} compositionHeight={q.altura} initialFrame={q.parado} moveToBeginningWhenEnded={false}
      style={{ width: "100%", display: "block" }} acknowledgeRemotionLicense />

    {perguntando && a ? (
      <div role="group" aria-label="palpite" style={{ ...vidro, background: "var(--palco-fundo)", position: "absolute", left: "50%", bottom: 8,
        translate: "-50% 0", width: "min(620px, calc(100% - 16px))", borderRadius: 14, padding: "10px 14px 8px", display: "grid", gap: 8,
        boxShadow: "0 12px 40px rgba(0, 0, 0, .45)" }}>
        {pista ? <span style={{ font: "13px/1.35 var(--f-ui)", color: "var(--palco-fraco)" }}>{pista}</span> : null}
        <b style={{ font: "600 15px var(--f-ui)" }}>Antes de ver: o que o agente deve fazer?</b>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
          {(Object.keys(DECISOES) as Escolha[]).map((k, i) => (
            <button key={k} ref={i === 0 ? primeira : undefined} type="button" onClick={(e) => apostar(k, e)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "7px 4px", borderRadius: 999,
                border: `1px solid ${COR[k]}`, background: "transparent", font: "500 13px var(--f-ui)", whiteSpace: "nowrap" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: COR[k] }} />{DECISOES[k]}
            </button>
          ))}
        </div>
        <button type="button" onClick={(e) => apostar(null, e)}
          style={{ justifySelf: "end", background: "none", border: 0, padding: 0, font: "12.5px var(--f-ui)", color: "var(--palco-fraco)" }}>
          pular e ver
        </button>
      </div>
    ) : null}

    <p aria-live="polite" style={{ margin: 0 }}>
      {resultado && a ? (
        <span style={{ ...vidro, position: "absolute", left: "50%", top: 58, translate: "-50% 0", borderRadius: 999, padding: "6px 14px",
          font: "13px var(--f-ui)", whiteSpace: "nowrap" }}>
          {aposta.escolha ? <>O seu palpite: <b style={{ color: COR[aposta.escolha] }}>{DECISOES[aposta.escolha]}</b> · </> : null}
          o contrato decidiu <b style={{ color: COR[a.decisao] }}>{DECISOES[a.decisao]}</b>
          {aposta.escolha ? (aposta.escolha === a.decisao ? " ✓" : "") : ""}
        </span>
      ) : null}
    </p>

    {!comecou && !perguntando ? (
      <span aria-hidden="true" style={{ ...vidro, position: "absolute", right: 50, bottom: 14, borderRadius: 999, padding: "4px 10px",
        font: "12px var(--f-ui)", opacity: .85 }}>
        {duracaoLegivel(q.duracao / q.fps)} · {cenarios.length} situações
      </span>
    ) : null}
    {perguntando ? null : <button type="button" onClick={alternar} aria-label={tocando ? "pausar a simulação" : "tocar a simulação"}
      style={{ ...vidro, position: "absolute", right: 10, bottom: 10, width: 34, height: 34, borderRadius: "50%", display: "grid",
        placeItems: "center", opacity: tocando ? .55 : .9 }}>
      <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={tocando ? IC.pausar : IC.tocar} /></svg>
    </button>}
  </div>;
}
