/**
 * O modo foco (docs/capacidades/modo-foco.md): a página só com o texto. O sumário fecha, a barra do topo fica com o
 * lugar do leitor e o botão de sair, e a pílula de navegação some. Mora no atributo data-foco do <html> (o script do
 * <head> aplica antes de pintar), fica guardado no navegador e avisa com o evento abaixo, como o modo direto.
 */
import { useEffect, useState } from "react";

export const EVENTO_FOCO = "fontmar:foco";
export const lerFoco = () => typeof document !== "undefined" && document.documentElement.hasAttribute("data-foco");

export function definirFoco(sim: boolean) {
  document.documentElement.toggleAttribute("data-foco", sim);
  try { sim ? localStorage.setItem("fontmar:foco", "sim") : localStorage.removeItem("fontmar:foco"); } catch { /* sem armazenamento */ }
  dispatchEvent(new CustomEvent(EVENTO_FOCO, { detail: sim }));
}

/** false no servidor e na primeira pintura; depois, o valor de verdade, e muda junto com a chave. */
export function useFoco() {
  const [foco, setFoco] = useState(false);
  useEffect(() => {
    const ver = () => setFoco(lerFoco());
    ver(); addEventListener(EVENTO_FOCO, ver);
    return () => removeEventListener(EVENTO_FOCO, ver);
  }, []);
  return foco;
}
