import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { unified } from "@astrojs/markdown-remark";
import { secoesNumeradas } from "./src/lib/secoes.mjs";

export default defineConfig({
  /* react: só nas figuras que precisam de uma ilha interativa (a do agente, no prefácio) */
  integrations: [mdx(), react()],
  /* smartypants desligado: as aspas e os traços saem como o autor escreveu */
  markdown: { processor: unified({ rehypePlugins: [secoesNumeradas], smartypants: false }) },
});
