/**
 * O passeio de uma figura: passos com duração, tocando sozinho, parando, voltando. No modo direto e para quem pede
 * menos movimento, a figura abre no último passo e não toca sozinha.
 */
import { useEffect, useState } from "react";
import { useDireto } from "../palco/direto";

type Estado = { passo: number; t: number; tocando: boolean };

export function usePasseio(duracoes: number[]) {
  const direto = useDireto();
  const ultimo = duracoes.length - 1;
  const final: Estado = { passo: ultimo, t: duracoes[ultimo], tocando: false };
  const [s, setS] = useState<Estado>({ passo: 0, t: 0, tocando: false });
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) setS(final);
    else setS((x) => ({ ...x, tocando: true }));
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
    passo: s.passo, fracao: Math.min(s.t / duracoes[s.passo], 1), tocando: s.tocando, fim,
    ir: (i: number) => setS({ passo: i, t: duracoes[i], tocando: false }),
    alternar: () => setS((x) => x.tocando ? { ...x, tocando: false } : fim ? { passo: 0, t: 0, tocando: true } : { ...x, tocando: true }),
  };
}
