/**
 * O passeio de uma figura: passos com duração, tocando sozinho, parando, voltando. A primeira pintura (a do servidor,
 * antes de a figura acordar) é o último passo, inteiro: é o que fica para quem lê sem JS, e ninguém vê um quadro vazio
 * num celular lento. Ao acordar, volta ao começo e toca; no modo direto e para quem pede menos movimento, fica no fim.
 * `vivo` diz se a figura já acordou: antes disso, as animações de entrada não valem (o elemento já nasce no lugar).
 */
import { useEffect, useState } from "react";
import { useDireto } from "../palco/direto";

type Estado = { passo: number; t: number; tocando: boolean };

export function usePasseio(duracoes: number[]) {
  const direto = useDireto();
  const ultimo = duracoes.length - 1;
  const final: Estado = { passo: ultimo, t: duracoes[ultimo], tocando: false };
  const [s, setS] = useState<Estado>(final);
  const [vivo, setVivo] = useState(false);
  useEffect(() => {
    setVivo(true);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches && !document.documentElement.hasAttribute("data-direto")) setS({ passo: 0, t: 0, tocando: true });
  }, []);
  useEffect(() => { if (direto) setS(final); }, [direto]);
  useEffect(() => {
    if (!s.tocando) return;
    let antes = performance.now(), quadro = 0;
    const andar = (agora: number) => {
      const dt = agora - antes; antes = agora;
      setS((x) => {
        if (!x.tocando) return x;
        if (x.t + dt < duracoes[x.passo]) return { ...x, t: x.t + dt };
        return x.passo >= ultimo ? final : { passo: x.passo + 1, t: 0, tocando: true };
      });
      quadro = requestAnimationFrame(andar);
    };
    quadro = requestAnimationFrame(andar);
    return () => cancelAnimationFrame(quadro);
  }, [s.tocando]);
  const fim = s.passo === ultimo && s.t >= duracoes[ultimo];
  return {
    passo: s.passo, fracao: Math.min(s.t / duracoes[s.passo], 1), tocando: s.tocando, fim, vivo,
    ir: (i: number) => setS({ passo: i, t: duracoes[i], tocando: false }),
    alternar: () => setS((x) => x.tocando ? { ...x, tocando: false } : fim ? { passo: 0, t: 0, tocando: true } : { ...x, tocando: true }),
  };
}
