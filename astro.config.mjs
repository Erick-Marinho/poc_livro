import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { unified } from "@astrojs/markdown-remark";
import { secoesNumeradas } from "./src/lib/secoes.mjs";

/* no desenvolvimento com a landing (npm run dev): o que é dela vai para ela, o resto é deste site, num endereço só,
   como no túnel. As páginas dela estão em FontMarAI/src/rotas.ts; os arquivos dela, em assets/ e favicon.svg */
const landing = process.env.URL_LANDING;
const daLanding = "^/(?:$|\\?|assets/|favicon\\.svg|newsletter|ferramentas|entrar)";

/* o astro dev guarda o cache de dependências do Vite numa pasta só dele: um astro build (o npm test) reescreve
   node_modules/.vite com o React de produção e sem as dependências das ilhas, e um astro dev que já estava rodando
   passa a responder 504 ("Outdated Optimize Dep"), e as ilhas não carregam */
const cacheDoDev = {
  name: "cache-do-dev",
  hooks: { "astro:config:setup": ({ command, updateConfig }) => { if (command === "dev") updateConfig({ vite: { cacheDir: "node_modules/.vite-dev" } }); } },
};

export default defineConfig({
  /* react: só nas figuras que precisam de uma ilha interativa (a do agente, na introdução) */
  integrations: [mdx(), react(), cacheDoDev],
  /* os guias viraram experimentos (docs/capacidades/experimentos.md): link antigo já compartilhado não quebra */
  redirects: { "/guias": "/experimentos", "/guias/[experimento]": "/experimentos/[experimento]",
    /* o prefácio virou introdução (25/10/2026): link já compartilhado não quebra */
    "/ciclo-de-vida/00-prefacio": "/ciclo-de-vida/00-introducao" },
  /* smartypants desligado: as aspas e os traços saem como o autor escreveu */
  markdown: { processor: unified({ rehypePlugins: [secoesNumeradas], smartypants: false }) },
  vite: landing ? { server: { proxy: { [daLanding]: { target: landing, changeOrigin: true } } } } : {},
});
