/**
 * O que o site tem para mostrar, montado do próprio conteúdo: a estante (um item por livro) e a lista dos experimentos.
 * As páginas (/livros/, /experimentos/) e os JSON que a landing lê (/livros/index.json, /experimentos/index.json) saem daqui,
 * então a landing nunca mostra algo diferente do site.
 */
import { getCollection } from "astro:content";

export type Livro = {
  id: string; titulo: string; lide: string; autores: string[];
  href: string; comeca: string; escritos: number; planejados: number;
};
export type Experimento = { id: string; titulo: string; lide: string; data: string; etiqueta: string; href: string };

const sumarios = import.meta.glob<{ capitulos: { numero: number; titulo: string }[] }>("../../livros/*/sumario.json", { eager: true, import: "default" });

/* o título e o lide do prefácio, os autores da assinatura, e os capítulos escritos contra os do sumario.json */
export async function estante(): Promise<Livro[]> {
  const textos = await getCollection("capitulos");
  const ids = [...new Set(textos.map((t) => t.id.split("/")[0]))].sort();
  return ids.map((id) => {
    const doLivro = textos.filter((t) => t.id.startsWith(`${id}/`)).sort((a, b) => (a.data.numero ?? 0) - (b.data.numero ?? 0));
    const abertura = doLivro.find((t) => t.data.tipo === "prefacio") ?? doLivro[0];
    const escritos = doLivro.filter((t) => t.data.tipo === "capitulo").length;
    const planejados = Object.entries(sumarios).find(([p]) => p.includes(`/livros/${id}/`))?.[1].capitulos.length ?? escritos;
    return {
      id, titulo: abertura.data.livro, lide: abertura.data.lide, autores: abertura.data.assinatura?.autores ?? [],
      href: `/${id}/${abertura.id.split("/").pop()}/`, comeca: abertura.data.titulo, escritos, planejados,
    };
  });
}

/* o mais novo em cima; no mesmo dia, a ordem do título */
export async function experimentos(): Promise<Experimento[]> {
  return (await getCollection("experimentos"))
    .sort((a, b) => b.data.data.localeCompare(a.data.data) || a.data.titulo.localeCompare(b.data.titulo))
    .map((g) => ({ id: g.id, ...g.data, href: `/experimentos/${g.id}/` }));
}
