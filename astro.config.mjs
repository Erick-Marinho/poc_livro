import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import { secoesNumeradas } from "./src/lib/secoes.mjs";

export default defineConfig({
  integrations: [mdx()],
  /* smartypants desligado: as aspas e os traços saem como o autor escreveu */
  markdown: { processor: unified({ rehypePlugins: [secoesNumeradas], smartypants: false }) },
});
