# Experimentos

**Problema.** "Guias" promete um caminho até um resultado, como os tutoriais que já existem. O que o FontMar publica é
outra coisa: uma afirmação que circula, testada com o projeto rodando, medida por uma régua, com o resultado gravado,
mesmo quando contraria o que se esperava. O nome passa a dizer isso: **Experimentos**.

## Decisões

- (24/10/2026, Erick) Os guias passam a se chamar **Experimentos**: `/experimentos/`, na landing e no site dos livros.
- (1) Os endereços antigos (`/guias/…`) continuam abrindo, com redirecionamento para os novos: link já compartilhado
  não quebra.
- (2) Todo experimento tem seis partes, conferidas no build: a afirmação testada, com a fonte; a régua, definida antes
  de construir; o que vamos construir, mostrado antes; a construção na IDE, com o chat e ao menos uma aposta; o
  resultado medido, gravado e conferido; e o que a medição mostrou de inesperado, com o custo. Mais o que vale para
  tudo: a nota do que é inventado e o lugar da voz dos autores.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `experimentos/<experimento>/` | o conteúdo (era `guias/`) | — | a página | troca |
| coleção, páginas, layout, vitrine | `/experimentos/`, a lista e o JSON da landing | o conteúdo | o site | troca |
| redirecionamentos | `/guias/…` leva a `/experimentos/…` | `astro.config.mjs` | páginas de redirecionamento | nova |
| landing (FontMarAI) | o card, a lista recente e a newsletter dizem experimento | `/experimentos/index.json` | a landing | troca |
| molde do experimento | as seis partes, conferidas no build | o `.mdx` | erro de build se faltar | nova (etapa 2) |

## Etapas

1. O nome: Experimentos em todo lugar, com os endereços antigos redirecionando.
2. O molde: as seis partes no topo do `.mdx` e no texto, conferidas por um teste; o experimento do segundo cérebro
   passa por ele.

## Etapa 1 (detalhe)

- **Arquivos:** `guias/` vira `experimentos/`; `src/content.config.ts`, `src/pages/guias/` vira `src/pages/experimentos/`,
  `src/layouts/Guia.astro`, `src/lib/guias.ts`, `src/lib/vitrine.ts`, `src/styles/guias.css`, `src/lib/livroDaPagina.ts`,
  as figuras e a IDE (que dizem "guia"), `TopoSite.astro`, `404.astro`, `package.json`, os testes; os planos ganham a
  decisão. No FontMarAI, `src/App.tsx`, `Vitrine.tsx`, `Newsletter.tsx`, `rotas.ts`, `README.md`.
- **Evidência:** `npm test`; `/experimentos/` e o experimento abrem; `/guias/` e `/guias/segundo-cerebro-local/`
  redirecionam; o JSON novo na landing, com "Experimentos recentes"; no `npm run local` e no túnel.
- **Fica fora:** o molde (etapa 2).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `c949877` (e o FontMarAI) | `npm test` com 52 testes (um novo: os endereços antigos redirecionam); pelo túnel, `/experimentos/`, o JSON e o experimento abrem, e `/guias/` e `/guias/segundo-cerebro-local/` levam aos novos; a landing com o card Experimentos, "O experimento do dia" e "Experimentos recentes"; capturas | pendente |

(redação: claude-opus-5-5)
