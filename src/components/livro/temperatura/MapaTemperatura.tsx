import { Player, type PlayerRef } from "@remotion/player";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useEffect, useRef, useState } from "react";
import { useDireto } from "../palco/direto";
import "./temperatura.css";

export const ETAPAS = [
  { nome: "A pergunta", detalhe: "Vira uma sequência de tokens." },
  { nome: "O cálculo", detalhe: "Pesos e entrada produzem pontuações." },
  { nome: "As pontuações", detalhe: "Cada próximo token recebe um valor." },
  { nome: "A escolha", detalhe: "O modo guloso escolhe o maior valor." },
  { nome: "O novo prefixo", detalhe: "O token escolhido volta para a entrada." },
];
export const FPS = 30, CENAS = 5, DURACAO = FPS * 4 * CENAS;

export function CaminhoTemperatura() {
  const frame = useCurrentFrame();
  const cena = Math.min(CENAS - 1, Math.floor(frame / (FPS * 4)));
  const progresso = interpolate(frame, [0, DURACAO - 1], [0, 100]);
  return <AbsoluteFill style={{ background: "#111318", color: "#e7e9ee", padding: "28px 28px 64px",
    fontFamily: '"IBM Plex Sans", system-ui, sans-serif' }}>
    <p style={{ margin: "0 0 22px", fontSize: 30, fontWeight: 600 }}>Onde a temperatura atua?</p>
    <div style={{ display: "flex", gap: 20, alignItems: "center", flex: 1 }}>
      <div style={{ display: "grid", gap: 8, width: 260 }}>
        {ETAPAS.map((e, i) => <div key={e.nome} style={{ padding: "9px 14px", fontSize: 23,
          border: `2px solid ${i === cena ? "#5aa9ff" : "#2c323d"}`, borderRadius: 10,
          background: i === cena ? "#172c43" : "#1c2028", color: i > cena ? "#a3a8b2" : "#e7e9ee" }}>
          {i + 1}. {e.nome}
        </div>)}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 29, lineHeight: 1.35, margin: 0 }}>{ETAPAS[cena].detalhe}</p>
        <p style={{ fontSize: 23, lineHeight: 1.4, color: "#ffb547", marginBottom: 0 }}>
          {cena === 3 ? "Escolha fixa não congela o cálculo anterior." : cena === 4 ? "Uma escolha diferente muda a próxima entrada." : "Ainda estamos antes da escolha do token."}
        </p>
      </div>
    </div>
    <div style={{ height: 4, marginTop: 20, background: "#2c323d" }}>
      <div style={{ height: "100%", width: `${progresso}%`, background: "#5aa9ff" }} />
    </div>
  </AbsoluteFill>;
}

export default function MapaTemperatura() {
  const player = useRef<PlayerRef>(null);
  const direto = useDireto();
  const [montado, setMontado] = useState(false);
  const [reduzido, setReduzido] = useState(false);
  const [tocando, setTocando] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const atualizar = () => setReduzido(media.matches);
    atualizar(); setMontado(true);
    media.addEventListener("change", atualizar);
    return () => media.removeEventListener("change", atualizar);
  }, []);
  const video = montado && !direto && !reduzido;
  useEffect(() => {
    const p = player.current;
    if (!p) return;
    const sincronizar = () => setTocando(p.isPlaying());
    sincronizar();
    p.addEventListener("play", sincronizar);
    p.addEventListener("pause", sincronizar);
    p.addEventListener("ended", sincronizar);
    return () => {
      p.removeEventListener("play", sincronizar);
      p.removeEventListener("pause", sincronizar);
      p.removeEventListener("ended", sincronizar);
    };
  }, [video]);
  return <div className="tz-mapa" data-vivo={video || undefined}>
    <div data-tz-estatico>
      <p><strong>Onde a temperatura atua?</strong></p>
      <ol>{ETAPAS.map((e) => <li key={e.nome}><b>{e.nome}</b><span>{e.detalhe}</span></li>)}</ol>
      <p>Escolher sempre o maior valor não congela o cálculo que veio antes dele.</p>
    </div>
    {video && <>
      <Player ref={player} component={CaminhoTemperatura} durationInFrames={DURACAO} fps={FPS}
        compositionWidth={700} compositionHeight={520} controls={false} autoPlay={false} loop={false}
        style={{ width: "100%" }} acknowledgeRemotionLicense />
      <div className="tz-controles" role="group" aria-label="Controles da animação">
        <button type="button" onClick={() => player.current?.isPlaying() ? player.current.pause() : player.current?.play()}>
          {tocando ? "Pausar" : "Reproduzir"}
        </button>
        <button type="button" onClick={() => { player.current?.pause(); player.current?.seekTo(0); }}>Recomeçar</button>
        <span>20 segundos · sem áudio</span>
      </div>
    </>}
    <p className="tz-origem">Esquema do mecanismo. Não é uma gravação de uma GPU.</p>
  </div>;
}
