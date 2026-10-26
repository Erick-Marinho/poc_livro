/**
 * A base das animações que andam com a rolagem (docs/capacidades/capitulo-2-em-cenas.md): a figura fica presa na tela
 * enquanto o leitor rola por um trilho alto, e a posição da rolagem é a agulha do vídeo, para a frente e para trás.
 * Nada toca sozinho: quem anda é o leitor. A agulha segue a rolagem com um pouco de inércia, para a roda do mouse não
 * dar trancos. Sem dica de botão: só um aviso discreto, "role", enquanto ninguém rolou. No modo direto, sem trilho: o
 * quadro final. Para leitor de tela, o texto da figura vai à parte (`descricao`), porque o vídeo não se lê.
 * O Player: https://www.remotion.dev/docs/player/player (seekTo).
 */
import { Player, type PlayerRef } from "@remotion/player";
import { type ComponentType, type ReactNode, useEffect, useRef, useState } from "react";
import { useDireto } from "./direto";
import "./palco.css";

type Props<P extends Record<string, unknown>> = {
  component: ComponentType<P>; inputProps: P; duracao: number; fps: number; largura: number; altura: number;
  /** muda o desenho (largo ou estreito): o Player recomeça */
  chave?: string;
  /** quantas telas de rolagem a animação inteira ocupa */
  telas: number;
  /** o espaço da tela que fica para o resto (o topo do livro, a margem): o vídeo cabe no que sobra */
  reserva: number;
  descricao: ReactNode;
};

export default function RolaCena<P extends Record<string, unknown>>({ component, inputProps, duracao, fps, largura, altura, chave, telas, reserva, descricao }: Props<P>) {
  const ref = useRef<PlayerRef>(null);
  const trilho = useRef<HTMLDivElement>(null);
  const direto = useDireto();
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    if (direto) { ref.current?.seekTo(duracao - 1); return; }
    let alvo = 0, agora = 0, laco = 0;
    /* onde a rolagem está no trilho: 0 quando a figura chega ao topo, 1 quando o trilho acaba */
    const medir = () => {
      const t = trilho.current;
      if (!t) return;
      const caixa = t.getBoundingClientRect();
      const percurso = caixa.height - innerHeight;
      alvo = Math.min(1, Math.max(0, -caixa.top / Math.max(1, percurso))) * (duracao - 1);
      if (alvo > 0) setRolou(true);
      if (!laco) laco = requestAnimationFrame(andar);
    };
    /* a agulha vai até onde a rolagem pede, um pouco por quadro */
    const andar = () => {
      agora += (alvo - agora) * 0.18;
      if (Math.abs(alvo - agora) < 0.5) agora = alvo;
      ref.current?.seekTo(Math.round(agora));
      laco = agora === alvo ? 0 : requestAnimationFrame(andar);
    };
    medir();
    addEventListener("scroll", medir, { passive: true });
    addEventListener("resize", medir);
    return () => { removeEventListener("scroll", medir); removeEventListener("resize", medir); cancelAnimationFrame(laco); };
  }, [direto, duracao, chave]);

  const video = (
    <div className="rc-video" style={{ width: `min(100%, calc((100vh - ${reserva}px) * ${largura / altura}))` }}>
      <Player key={chave} ref={ref} component={component} inputProps={inputProps} durationInFrames={duracao} fps={fps}
        compositionWidth={largura} compositionHeight={altura} initialFrame={direto ? duracao - 1 : 0}
        numberOfSharedAudioTags={0} style={{ width: "100%", display: "block" }} acknowledgeRemotionLicense />
    </div>
  );
  return <>
    <div className="rc-leitor">{descricao}</div>
    {direto ? <div className="rc-quadro">{video}</div> : (
      <div ref={trilho} className="rc-trilho" style={{ height: `${telas * 100}vh` }}>
        <div className="rc-quadro rc-preso">
          {video}
          <p className="rc-role" aria-hidden="true" style={{ opacity: rolou ? 0 : 1 }}>role a página para a cena andar ↓</p>
        </div>
      </div>
    )}
  </>;
}
