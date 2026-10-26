/**
 * Rolar com a página (docs/capacidades/capitulo-2-em-cenas.md): nas animações que andam com a rolagem (RolaCena.tsx),
 * ligado, a figura fica presa na tela e a rolagem é a agulha; desligado (o começo), a página rola normalmente e o
 * leitor toca a animação pelo play. A escolha fica no navegador, vale para todas as figuras e muda também nas
 * configurações; avisa com o evento abaixo.
 */
import { useEffect, useState } from "react";

export const EVENTO_ROLAR = "fontmar:rolar";
const CHAVE = "fontmar:rolar";

export function lerRolar(): boolean {
  try { return localStorage.getItem(CHAVE) === "sim"; } catch { return false; }
}

export function definirRolar(sim: boolean) {
  try { sim ? localStorage.setItem(CHAVE, "sim") : localStorage.removeItem(CHAVE); } catch { /* sem armazenamento: vale até fechar a página */ }
  dispatchEvent(new CustomEvent(EVENTO_ROLAR, { detail: sim }));
}

/** false no servidor e na primeira pintura; depois, o valor de verdade, e muda junto com a chave. */
export function useRolar() {
  const [rolar, setRolar] = useState(false);
  useEffect(() => {
    setRolar(lerRolar());
    const ouvir = (e: Event) => setRolar((e as CustomEvent<boolean>).detail);
    addEventListener(EVENTO_ROLAR, ouvir);
    return () => removeEventListener(EVENTO_ROLAR, ouvir);
  }, []);
  return rolar;
}
