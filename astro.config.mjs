import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { unified } from "@astrojs/markdown-remark";
import { secoesNumeradas } from "./src/lib/secoes.mjs";

/* no desenvolvimento com a landing (npm run local): o que é dela vai para ela, o resto é deste site, num endereço só,
   como no túnel. As páginas dela estão em FontMarAI/src/rotas.ts; os arquivos dela, em assets/ e favicon.svg */
const landing = process.env.URL_LANDING;
const daLanding = "^/(?:$|\\?|assets/|favicon\\.svg|newsletter|ferramentas|entrar)";

export default defineConfig({
  /* react: só nas figuras que precisam de uma ilha interativa (a do agente, no prefácio) */
  integrations: [mdx(), react()],
  /* smartypants desligado: as aspas e os traços saem como o autor escreveu */
  markdown: { processor: unified({ rehypePlugins: [secoesNumeradas], smartypants: false }) },
  vite: landing ? { server: { proxy: { [daLanding]: { target: landing, changeOrigin: true } } } } : {},
});
