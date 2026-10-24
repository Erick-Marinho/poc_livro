# Guias

**Problema.** O livro é o aprofundamento, e o leitor compra; falta o contato de todo dia. Os **guias** são
tutoriais curtos, publicados e enviados diariamente, que resolvem um problema de ponta a ponta. Eles são a porta de
entrada para os livros.

**Regra que não muda.** O padrão FontMar vale igual: código, saída e erro vêm do projeto real do guia, gravados e
conferidos pelo `saidas.py`, e o build falha se divergirem. Exemplo escrito à mão diz o que é.

## Decisões

- (24/10/2026, Erick) O nome é **Guias**: tutoriais diários, enviados e publicados. Livros são o aprofundamento, que o leitor compra.
- (24/10/2026, Erick) Os guias moram no poc_livro e reaproveitam `Listagem`, `Terminal`, `PareEPense` e o `saidas.py`; o FontMar.ai ganha o card com o link.
- (24/10/2026, Erick) Os guias passam a se chamar **Experimentos** (`/experimentos/`, com os endereços antigos
  redirecionando): a capacidade segue em `docs/capacidades/experimentos.md`.
- (24/10/2026, Erick) O guia de exemplo `validar-a-resposta` ("Confira a resposta do modelo antes de agir") saiu: era só
  para testar a estrutura. O primeiro guia publicado é o do segundo cérebro (`guias/segundo-cerebro-local/`).
- (1) Um guia é uma pasta `guias/<guia>/`: `guia.mdx`, `projeto/`, `comandos.json` e `saidas.json`, como um livro de um capítulo só.
- (1) O `saidas.py` aceita `guias/<guia>` no lugar do nome de um livro; nada muda para `ciclo-de-vida`.
- (1) A lista (`/guias/`) segue a referência: etiqueta, título, lide e data, com o mais novo em cima. Ela fica sem imagem de capa por enquanto.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| coleção `guias` (`content.config.ts`) | o que todo guia tem: título, lide, data, etiqueta | `guias/*/guia.mdx` | erro de build se faltar campo | nova |
| `src/pages/guias/index.astro` | a lista dos guias, o mais novo em cima | coleção | `/guias/` | nova |
| `src/layouts/Guia.astro` + `[guia].astro` | a página de um guia | um guia | `/guias/<guia>/` | nova |
| `scripts/saidas.py` | grava e confere as saídas também de um guia | `guias/<guia>` | `saidas.json` do guia | existe |
| `guias/validar-a-resposta/` | o guia de exemplo, com código real | projeto + comandos | página | nova |
| `testes/guias.test.mjs` | a lista leva a páginas que existem; a página mostra a saída gravada | `dist/` | `npm test` | nova |
| card "Guias" no FontMar.ai | a entrada a partir da página principal | `VITE_URL_LIVROS` | link para `/guias/` | existe |
| envio diário (newsletter) | o guia do dia chega por e-mail | um guia | e-mail | depois |

## Etapas

1. Estrutura (lista e página do guia) e um guia de exemplo com código real; o card no FontMar.ai.

As próximas etapas são do responsável.

## Etapa 1, detalhada

- **Arquivos:** `src/content.config.ts`, `src/pages/guias/index.astro`, `src/pages/guias/[guia].astro`,
  `src/layouts/Guia.astro`, `src/styles/guias.css`, `scripts/saidas.py`, `package.json` (o `npm test` confere os guias),
  `src/pages/index.astro` (o link para os guias), `guias/validar-a-resposta/`, `testes/guias.test.mjs`. No FontMar.ai, `src/App.tsx`.
- **Evidência:** `npm run guias:conferir` passa; ele falha com uma linha do `resposta.py` trocada; `node --test testes/guias.test.mjs`;
  capturas da lista e do guia no claro e no escuro, e do card no FontMar.ai.
- **Fora:** o envio por e-mail, a busca e as etiquetas clicáveis, a imagem de capa, a IDE dentro do guia e o texto final dos autores
  (a voz deles fica marcada com `Pendente`).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|

(redação: claude-opus-5-5)
