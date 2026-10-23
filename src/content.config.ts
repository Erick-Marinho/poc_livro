import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/** Cada capítulo é um .mdx em livros/<livro>/capitulos/. Um capítulo sem estes campos não monta. */
const capitulos = defineCollection({
  loader: glob({ pattern: "*/capitulos/*.mdx", base: "./livros" }),
  schema: z.object({
    livro: z.string(),
    numero: z.number().int().positive(),
    titulo: z.string(),
    lide: z.string(),
    neste: z.array(z.string()).min(1),
    partida: z.object({ texto: z.string(), tag: z.string() }),
    anterior: z.string().optional(),
    proximo: z.string().optional(),
    aviso: z.string().optional(),
  }),
});

export const collections = { capitulos };
