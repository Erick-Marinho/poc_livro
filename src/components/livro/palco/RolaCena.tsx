/**
 * A base das animações que o leitor toca ou rola (docs/capacidades/capitulo-2-em-cenas.md). Dois modos, e a escolha
 * fica lembrada para todas as figuras (rolar.ts):
 * - tocar (o começo): a página rola normalmente; um play discreto toca a animação inteira, no ritmo de leitura (metade
 *   da velocidade), com pausar e ver de novo. Nada toca sozinho: quem aperta é o leitor.
 * - rolar com a página: a figura fica presa na tela enquanto o leitor rola por um trilho alto, e a posição da rolagem
 *   é a agulha do vídeo, para a frente e para trás, com um pouco de inércia (pelo seekTo, que o navegador deixa sem
 *   clique). Desligado, o trilho some, para quem não quer rolar várias telas para passar da figura.
 * Trocar de modo mantém a figura no mesmo lugar da tela e a animação no mesmo quadro. No modo direto, o quadro final,
 * sem controles. Para leitor de tela, o texto da figura vai à parte (`descricao`), porque o vídeo não se lê.
 * O Player: https://www.remotion.dev/docs/player/player (play, pause, seekTo, getCurrentFrame e os eventos).
 */
import { Player, type PlayerRef } from "@remotion/player";
import { type ComponentType, type MouseEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { useDireto } from "./direto";
import { definirRolar, useRolar } from "./rolar";
import "./palco.css";

type Props<P extends Record<string, unknown>> = {
  component: ComponentType<P>; inputProps: P; duracao: number; fps: number; largura: number; altura: number;
  /** muda o desenho (largo ou estreito): o Player recomeça */
  chave?: string;
  /** quantas telas de rolagem a animação inteira ocupa, no modo de rolar */
  telas: number;
  /** o espaço da tela que fica para o resto (o topo do livro, os controles): o vídeo cabe no que sobra */
  reserva: number;
  descricao: ReactNode;
  /** a velocidade do play: metade (o ritmo de leitura) por padrão; 1 quando o tempo da figura é o tempo de verdade */
  velocidade?: number;
  /** ouve cada quadro, tocando ou rolando, para acender o que está fora do vídeo (o cartão do mapa do ciclo) */
  aoQuadro?: (quadro: number) => void;
};
type Toque = "parado" | "tocando" | "fim";
const TOPO = 58; // a barra do livro: a figura presa fica logo abaixo dela

export default function RolaCena<P extends Record<string, unknown>>({ component, inputProps, duracao, fps, largura, altura, chave, telas, reserva, descricao, aoQuadro, velocidade = 0.5 }: Props<P>) {
  const ref = useRef<PlayerRef>(null);
  const caixa = useRef<HTMLDivElement>(null);
  const trilho = useRef<HTMLDivElement>(null);
  const direto = useDireto();
  const rolar = useRolar();
  const [toque, setToque] = useState<Toque>("parado");
  const [andou, setAndou] = useState(false);
  const ouvir = useRef(aoQuadro);
  ouvir.current = aoQuadro;

  /* o que o Player conta: tocou, pausou, chegou ao fim */
  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const tocou = () => setToque("tocando"), pausou = () => setToque((t) => (t === "fim" ? t : "parado")), acabou = () => setToque("fim");
    p.addEventListener("play", tocou); p.addEventListener("pause", pausou); p.addEventListener("ended", acabou);
    return () => { p.removeEventListener("play", tocou); p.removeEventListener("pause", pausou); p.removeEventListener("ended", acabou); };
  }, [chave, direto]);

  /* cada quadro, para quem ouve: o seekTo da rolagem também muda o quadro */
  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const quadro = (e: { detail: { frame: number } }) => ouvir.current?.(e.detail.frame);
    p.addEventListener("frameupdate", quadro); p.addEventListener("seeked", quadro);
    return () => { p.removeEventListener("frameupdate", quadro); p.removeEventListener("seeked", quadro); };
  }, [chave, direto]);

  /* rolar com a página: a agulha segue a rolagem, de onde o vídeo está */
  useEffect(() => {
    const p = ref.current;
    if (direto) { p?.seekTo(duracao - 1); return; }
    if (!rolar || !p) return;
    p.pause();
    let alvo = p.getCurrentFrame(), agora = alvo, laco = 0;
    const andar = () => {
      agora += (alvo - agora) * 0.12;
      if (Math.abs(alvo - agora) < 0.5) agora = alvo;
      ref.current?.seekTo(Math.round(agora));
      laco = agora === alvo ? 0 : requestAnimationFrame(andar);
    };
    /* onde a rolagem está no trilho: 0 quando a figura chega ao topo, 1 quando o trilho acaba */
    const medir = () => {
      const t = trilho.current;
      if (!t) return;
      const c = t.getBoundingClientRect();
      alvo = Math.min(1, Math.max(0, (TOPO - c.top) / Math.max(1, c.height - innerHeight))) * (duracao - 1);
      if (alvo > 0) setAndou(true);
      setToque(alvo >= duracao - 1 ? "fim" : "parado");
      if (!laco) laco = requestAnimationFrame(andar);
    };
    addEventListener("scroll", medir, { passive: true });
    addEventListener("resize", medir);
    return () => { removeEventListener("scroll", medir); removeEventListener("resize", medir); cancelAnimationFrame(laco); };
  }, [direto, rolar, duracao, chave]);

  const tocar = (e: MouseEvent) => {
    const p = ref.current;
    if (!p) return;
    if (toque === "tocando") { p.pause(); return; }
    if (toque === "fim" || p.getCurrentFrame() >= duracao - 1) p.seekTo(0);
    setAndou(true);
    p.play(e);
  };

  /* trocar de modo sem perder o lugar: ao ligar, a rolagem vai até onde o vídeo está; ao desligar, a figura fica no
     topo da tela, solta */
  const alternar = () => {
    const quadro = ref.current?.getCurrentFrame() ?? 0;
    const ligar = !rolar;
    definirRolar(ligar);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const c = caixa.current;
      if (!c) return;
      const topo = c.getBoundingClientRect().top + scrollY - TOPO;
      const percurso = ligar && trilho.current ? trilho.current.offsetHeight - innerHeight : 0;
      scrollTo({ top: topo + (percurso * quadro) / Math.max(1, duracao - 1), behavior: "instant" as ScrollBehavior });
    }));
  };

  const rotulo = toque === "tocando" ? "❚❚ Pausar" : toque === "fim" ? "↺ Ver de novo" : andou ? "▶ Continuar" : "▶ Tocar";
  const quadro = (preso: boolean) => (
    <div className={`rc-quadro${preso ? " rc-preso" : ""}`}>
      <div className="rc-video" style={{ width: `min(100%, calc((100vh - ${reserva}px) * ${largura / altura}))` }}>
        <Player key={chave} ref={ref} component={component} inputProps={inputProps} durationInFrames={duracao} fps={fps}
          compositionWidth={largura} compositionHeight={altura} initialFrame={direto ? duracao - 1 : 0} playbackRate={velocidade}
          moveToBeginningWhenEnded={false} numberOfSharedAudioTags={0} style={{ width: "100%", display: "block" }} acknowledgeRemotionLicense />
      </div>
      {direto ? null : (
        <div className="rc-controles">
          {rolar ? <span className="rc-dica" style={{ opacity: andou ? 0 : 1 }}>role a página para a cena andar ↓</span>
            : <button type="button" className="rc-tocar" onClick={tocar} aria-label={rotulo.replace(/^\S+ /, "")}>{rotulo}</button>}
          <button type="button" role="switch" aria-checked={rolar} className="rc-chave" onClick={alternar}
            title={rolar ? "Desligar: a página rola normalmente, e a animação toca pelo play" : "Ligar: a figura fica presa na tela, e a rolagem anda a animação"}>
            <span aria-hidden="true">↕</span> Rolar com a página <span className="rc-trilho-chave" aria-hidden="true"><i /></span>
          </button>
        </div>
      )}
    </div>
  );

  return <div ref={caixa}>
    <div className="rc-leitor">{descricao}</div>
    {/* o mesmo lugar na árvore nos dois modos: trocar de modo não recria o Player, e o vídeo fica no quadro em que estava */}
    <div ref={trilho} className="rc-trilho" style={!direto && rolar ? { height: `${telas * 100}vh` } : undefined}>{quadro(!direto && rolar)}</div>
  </div>;
}
