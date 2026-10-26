/**
 * A base das animações que o leitor avança cena a cena (docs/capacidades/laco-do-agente.md): a composição no Player do
 * Remotion, parada, e um botão discreto embaixo que toca a cena seguinte e para no fim dela; nada toca sozinho
 * (docs/RITMO.md). Com menos movimento, o avançar vai direto ao fim da cena; no modo direto, o quadro final, sem botão.
 * Para quem não vê o vídeo, a legenda de cada cena é anunciada. Quem usa diz os cortes (o quadro de início e de fim de
 * cada cena), o rótulo do primeiro avanço e o anúncio; e pode ouvir cada quadro (`aoQuadro`), para acender o que está
 * fora do vídeo. O Player: https://www.remotion.dev/docs/player/player (seekTo, play, pause e o evento frameupdate).
 * Sem trilhas de áudio (numberOfSharedAudioTags 0): nenhuma figura tem som, e sem elas o Player toca mesmo quando quem
 * pede não é um clique (a rolagem da página não conta como gesto para o navegador).
 * Opcionais, para figuras em que o leitor decide no meio (docs/capacidades/capitulo-2-em-cenas.md): uma `trava` segura uma
 * cena até ele escolher; `irPara` pede, de fora, para tocar até uma cena (a escolha feita, a rolagem da página); `abaixo`
 * fica entre o vídeo e o botão; e `aoMudar` conta a cena vista e se está tocando.
 */
import { Player, type PlayerRef } from "@remotion/player";
import { type ComponentType, type MouseEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { useDireto } from "./direto";
import "./palco.css";

export type Corte = { de: number; ate: number };
type Props<P extends Record<string, unknown>> = {
  component: ComponentType<P>; inputProps: P; duracao: number; fps: number; largura: number; altura: number;
  /** muda o desenho (anel ou coluna): o Player recomeça */
  chave?: string;
  cortes: Corte[];
  /** o rótulo do primeiro avanço, antes de qualquer cena */
  primeiro: string;
  /** o que se anuncia para o leitor de tela na cena k */
  anuncio: (k: number) => string;
  aoQuadro?: (quadro: number) => void;
  /** a cena que espera o leitor, e o que o botão diz enquanto espera */
  trava?: { cena: number; texto: string };
  /** tocar até esta cena; `vez` muda a cada pedido */
  irPara?: { cena: number; vez: number };
  abaixo?: ReactNode;
  aoMudar?: (cena: number, tocando: boolean) => void;
};

export default function AvancaCena<P extends Record<string, unknown>>({ component, inputProps, duracao, fps, largura, altura, chave, cortes, primeiro, anuncio, aoQuadro, trava, irPara, abaixo, aoMudar }: Props<P>) {
  const ref = useRef<PlayerRef>(null);
  const direto = useDireto();
  const [cena, setCena] = useState(-1); // a última cena vista; -1: nenhuma
  const [tocando, setTocando] = useState(false);
  const alvo = useRef(-1); // o quadro onde a cena de agora termina
  const ouvir = useRef(aoQuadro);
  ouvir.current = aoQuadro;

  /* o ouvinte dos quadros, ligado no Player que existe agora: na montagem ele pode ainda não ter chegado (e aí se liga
     no primeiro avanço), e quando a chave muda o Player é outro */
  const ligado = useRef<PlayerRef | null>(null);
  const desligar = useRef<() => void>(() => {});
  const ligar = () => {
    const p = ref.current;
    if (!p || ligado.current === p) return;
    desligar.current();
    const quadro = (e: { detail: { frame: number } }) => {
      ouvir.current?.(e.detail.frame);
      if (alvo.current >= 0 && e.detail.frame >= alvo.current) { p.pause(); p.seekTo(alvo.current); alvo.current = -1; setTocando(false); }
    };
    p.addEventListener("frameupdate", quadro);
    ligado.current = p;
    desligar.current = () => { p.removeEventListener("frameupdate", quadro); ligado.current = null; };
  };
  useEffect(() => { ligar(); return () => desligar.current(); }, [chave]);

  /* no modo direto, o quadro final */
  useEffect(() => { if (direto) ref.current?.seekTo(duracao - 1); }, [direto, duracao, chave]);

  const preso = !!trava && cena + 1 === trava.cena;
  const avancar = (e?: MouseEvent) => {
    const p = ref.current;
    if (!p || tocando || preso) return;
    ligar();
    const k = cena + 1 >= cortes.length ? 0 : cena + 1;
    setCena(k);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      p.seekTo(cortes[k].ate);
      ouvir.current?.(cortes[k].ate);
      return;
    }
    p.seekTo(cortes[k].de);
    setTocando(true);
    if (e) { alvo.current = cortes[k].ate; p.play(e); return; }
    /* sem clique (a rolagem, ou uma escolha que pediu a cena), o navegador não deixa o Player dar play: os quadros
       andam pelo seekTo, no ritmo do vídeo */
    const { de, ate } = cortes[k], ini = performance.now();
    const passo = (agora: number) => {
      const f = Math.min(ate, de + Math.round(((agora - ini) / 1000) * fps));
      p.seekTo(f);
      ouvir.current?.(f);
      if (f >= ate) { setTocando(false); return; }
      quadroManual.current = requestAnimationFrame(passo);
    };
    quadroManual.current = requestAnimationFrame(passo);
  };
  const quadroManual = useRef(0);
  useEffect(() => () => cancelAnimationFrame(quadroManual.current), []);

  /* um pedido de fora (a escolha, a rolagem): toca a cena seguinte, e a próxima quando essa acabar, até chegar */
  useEffect(() => {
    if (!direto && irPara && irPara.cena > cena && !tocando && !preso) avancar();
  }, [irPara, cena, tocando, preso, direto]);
  useEffect(() => { aoMudar?.(cena, tocando); }, [cena, tocando]);

  const fim = cena === cortes.length - 1;
  const rotulo = tocando ? `cena ${cena + 1} de ${cortes.length}…` : preso ? trava!.texto : cena < 0 ? primeiro : fim ? "↺ Ver de novo" : `▶ Próxima cena (${cena + 2} de ${cortes.length})`;
  return <>
    <Player key={chave} ref={ref} component={component} inputProps={inputProps} durationInFrames={duracao} fps={fps}
      compositionWidth={largura} compositionHeight={altura} initialFrame={direto ? duracao - 1 : 0}
      moveToBeginningWhenEnded={false} numberOfSharedAudioTags={0} style={{ width: "100%", display: "block" }} acknowledgeRemotionLicense />
    {direto ? null : abaixo}
    {direto ? null : (
      <div className="ac-avancar">
        <button type="button" onClick={avancar} disabled={tocando || preso} aria-label={rotulo.replace(/^[▶↺] /, "")}>{rotulo}</button>
        <span>{cena >= 0 ? `cena ${cena + 1} de ${cortes.length}` : "cena a cena: você avança quando quiser"}</span>
        <span className="ac-anuncio" aria-live="polite">{cena >= 0 ? anuncio(cena) : ""}</span>
      </div>
    )}
  </>;
}
