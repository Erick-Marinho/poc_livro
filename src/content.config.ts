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
 * Cada experimento é experimentos/<experimento>/experimento.mdx, com o projeto real ao lado (projeto/, comandos.json, saidas.json).
 * Além de título, lide, data e etiqueta, o molde (docs/capacidades/experimentos.md): a afirmação testada, com a fonte;
 * a régua (o arquivo e o que conta como acerto); o resultado, em que cada linha aponta uma saída gravada (o número sai
 * dela, nunca é escrito à mão); o que a medição mostrou de inesperado; e o custo. Sem um deles, não monta.
 */
const experimentos = defineCollection({
  loader: glob({ pattern: "*/experimento.mdx", base: "./experimentos", generateId: ({ entry }) => entry.split("/")[0] }),
  schema: z.object({
    titulo: z.string(),
    lide: z.string(),
    data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "data no formato AAAA-MM-DD"),
    etiqueta: z.string(),
    afirmacao: z.object({ texto: z.string().min(20), fonte: z.object({ titulo: z.string(), url: z.string().url() }) }),
    regua: z.object({ arquivo: z.string(), conta: z.string().min(20) }),
    resultado: z.array(z.object({ rotulo: z.string(), saida: z.string() })).min(1, "o resultado precisa de ao menos uma medição gravada"),
    achado: z.string().min(20),
    custo: z.string().min(20),
  }),
});

export const collections = { capitulos, experimentos };
