/**
 * O modo direto (docs/PRINCIPIOS.md: guia demais atrapalha quem já sabe). Ligado nas configurações, ele recolhe
 * o passo a passo: figuras abrem no estado final, terminais mostram comando e saída, respostas ficam abertas.
 * Mora no atributo data-direto do <html> (o script do <head> aplica antes de pintar) e avisa com o evento abaixo.
 */
import { useEffect, useState } from "react";

export const EVENTO_DIRETO = "fontmar:direto";
export const lerDireto = () => typeof document !== "undefined" && document.documentElement.hasAttribute("data-direto");

export function definirDireto(sim: boolean) {
  document.documentElement.toggleAttribute("data-direto", sim);
  try { sim ? localStorage.setItem("fontmar:direto", "sim") : localStorage.removeItem("fontmar:direto"); } catch { /* sem armazenamento */ }
  dispatchEvent(new CustomEvent(EVENTO_DIRETO, { detail: sim }));
}

/** false no servidor e na primeira pintura; depois, o valor de verdade, e muda junto com a chave. */
export function useDireto() {
  const [direto, setDireto] = useState(false);
  useEffect(() => {
    const ver = () => setDireto(lerDireto());
    ver(); addEventListener(EVENTO_DIRETO, ver);
    return () => removeEventListener(EVENTO_DIRETO, ver);
  }, []);
  return direto;
}
