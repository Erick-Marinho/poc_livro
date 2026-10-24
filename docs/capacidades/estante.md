# A estante dos livros

**Problema.** "Livros", no FontMar.ai, levava direto para dentro do primeiro livro. O primeiro livro é o primeiro
de vários: a entrada é uma estante, com um card por livro disponível.

**Regra que não muda.** O card não tem texto escrito à mão: título, lide e autores saem do prefácio, e o quanto
está escrito sai dos capítulos contra o `sumario.json`.

## Decisões

- (24/10/2026, Erick) "Livros" abre a estante de cards, e não o livro.
- (1) A estante fica em `/livros/` no poc_livro, ao lado de `/guias/`; o FontMar.ai aponta para ela.
- (1) O card leva ao prefácio (o primeiro texto do livro) e mostra "em andamento" enquanto faltar capítulo do sumário.
- (1) A capa é tipográfica (o título sobre o acento) até existir uma capa desenhada.
- (24/10/2026, Erick) As rotas estavam confusas: onde não tem nada, entra "em construção".
- (2) A raiz `/` leva à estante; `/<livro>/` abre o primeiro texto do livro; qualquer outro endereço (um capítulo por
  escrever, um link errado) mostra a página "em construção" (`404.astro`), com o caminho para os livros e os guias.
- (2) Os redirecionamentos são imediatos (`Redirecionar.astro`): o `Astro.redirect` estático espera 2 s numa página em inglês.
- (2) No FontMar.ai, Cursos, Newsletter, Ferramentas e Entrar deixam de ser links mortos: levam à página "em construção".

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `src/pages/livros/index.astro` | a estante: um card por livro | coleção `capitulos` + `sumario.json` | `/livros/` | nova |
| `testes/livros.test.mjs` | um card por livro, o link abre, a conta dos capítulos bate | `dist/` | `npm test` | nova |
| links do FontMar.ai | "Livros", "Começar" e "Começar pelos livros" apontam para a estante | `VITE_URL_LIVROS` | `/livros/` | existe |
| capa desenhada | a capa de verdade de cada livro | arte | imagem | depois |

## Etapas

1. A estante com o card do primeiro livro, e os links do FontMar.ai apontando para ela.
2. As rotas: nenhum endereço dá em nada; onde não tem conteúdo, "em construção".

## Etapa 1, detalhada

- **Arquivos:** `src/pages/livros/index.astro`, `src/styles/guias.css`, `src/pages/guias/index.astro` (link para os livros),
  `testes/livros.test.mjs`. No FontMar.ai, `src/App.tsx`.
- **Evidência:** `node --test testes/livros.test.mjs`; capturas da estante no claro e no escuro, e o clique no FontMar.ai abrindo a estante.
- **Fora:** compra e acesso pago, capa desenhada, filtro por assunto.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|

(redação: claude-opus-5-5)
