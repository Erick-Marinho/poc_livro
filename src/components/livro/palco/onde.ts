/**
 * Onde o leitor faz o projeto (docs/capacidades/imersao-ide.md, etapa 5): na IDE dele, ao lado do livro, ou aqui no
 * livro mesmo. Na IDE dele, os comandos do livro rodam sozinhos (ele digita na máquina dele, e o cartão "sua vez"
 * lembra); aqui, ele digita no terminal do livro, e o "sua vez" sai. Ninguém digita duas vezes.
 * A IDE do capítulo pergunta uma vez; a resposta fica no navegador, vale para todos os terminais e muda nas configurações.
 */
import { useEffect, useState } from "react";

export type Onde = "ide" | "livro";
export const EVENTO_ONDE = "fontmar:onde";
const CHAVE = "fontmar:onde";

export function lerOnde(): Onde | null {
  try { const v = localStorage.getItem(CHAVE); return v === "ide" || v === "livro" ? v : null; } catch { return null; }
}

export function definirOnde(o: Onde) {
  try { localStorage.setItem(CHAVE, o); } catch { /* sem armazenamento: vale até fechar a página */ }
  dispatchEvent(new CustomEvent(EVENTO_ONDE, { detail: o }));
}

/** a resposta sugerida a quem ainda não respondeu: no celular não há IDE ao lado, então é aqui no livro */
export const sugestaoOnde = (): Onde => typeof matchMedia !== "undefined" && matchMedia("(max-width: 760px)").matches ? "livro" : "ide";

/** undefined no servidor e na primeira pintura; null se o leitor ainda não respondeu; depois, a resposta. */
export function useOnde() {
  const [onde, setOnde] = useState<Onde | null | undefined>(undefined);
  useEffect(() => {
    setOnde(lerOnde());
    const ouvir = (e: Event) => setOnde((e as CustomEvent<Onde>).detail);
    addEventListener(EVENTO_ONDE, ouvir);
    return () => removeEventListener(EVENTO_ONDE, ouvir);
  }, []);
  return onde;
}
