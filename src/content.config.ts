import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Cada texto do livro é um .mdx em livros/<livro>/capitulos/.
 * Capítulo exige número, "neste capítulo" e ponto de partida; prefácio não tem nada disso, mas tem assinatura.
 * Um texto sem os campos do seu tipo não monta.
 */
const capitulos = defineCollection({
  loader: glob({ pattern: "*/capitulos/*.mdx", base: "./livros" }),
  schema: z
    .object({
      livro: z.string(),
      tipo: z.enum(["capitulo", "prefacio"]).default("capitulo"),
      numero: z.number().int().positive().optional(),
      titulo: z.string(),
      lide: z.string(),
      neste: z.array(z.string()).min(1).optional(),
      partida: z.object({ texto: z.string(), tag: z.string().optional() }).optional(),
      assinatura: z.object({ autores: z.array(z.string()).min(1), quando: z.string() }).optional(),
      /* a frase que abre o texto; a fonte é obrigatória: citação sem origem não entra */
      epigrafe: z.object({ texto: z.string(), autor: z.string(), obra: z.string(), ano: z.number().int() }).optional(),
      em_breve: z.string().optional(),   /* o próximo texto, enquanto ele ainda não existe */
      aviso: z.string().optional(),
    })
    .superRefine((d, ctx) => {
      const falta = (campo: string) => ctx.addIssue({ code: "custom", path: [campo], message: `${d.tipo} precisa de "${campo}"` });
      if (d.tipo === "capitulo") (["numero", "neste", "partida"] as const).forEach((c) => d[c] === undefined && falta(c));
      if (d.tipo === "prefacio" && !d.assinatura) falta("assinatura");
    }),
});

/**
 * Cada guia é guias/<guia>/guia.mdx, com o projeto real ao lado (projeto/, comandos.json, saidas.json).
 * Tutorial curto do dia: título, lide, a data em que sai e a etiqueta do assunto. Sem um deles, não monta.
 */
const guias = defineCollection({
  loader: glob({ pattern: "*/guia.mdx", base: "./guias", generateId: ({ entry }) => entry.split("/")[0] }),
  schema: z.object({
    titulo: z.string(),
    lide: z.string(),
    data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "data no formato AAAA-MM-DD"),
    etiqueta: z.string(),
  }),
});

export const collections = { capitulos, guias };
