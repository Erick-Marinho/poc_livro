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
  tudo: a nota do que é inventado.
- (25/10/2026, Erick) Sem voz dos autores, em livro e experimento: não faz sentido para a proposta.

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

## Etapa 2 (detalhe)

- **Arquivos:** `src/content.config.ts` (os campos do molde), `src/pages/experimentos/[experimento].astro` e
  `src/layouts/Experimento.astro` (a página mostra o molde), `src/styles/experimentos.css`,
  `experimentos/segundo-cerebro-local/experimento.mdx` (os campos dele), `testes/experimentos.test.mjs`, `docs/FORMATO.md`.
- **Muda:** no topo do `.mdx`, a afirmação (com a fonte), a régua (o arquivo e o que conta como acerto), o resultado
  (cada linha aponta uma saída gravada; o número sai dela), o achado e o custo. Faltando um, o build não monta. A
  página abre com "O que se testa" (a afirmação e a régua) e fecha com "O que deu" (os resultados lidos das saídas, o
  achado e o custo): o resultado fica no fim, para não estragar as apostas. Um teste confere as partes do texto: "O
  que vamos construir", a IDE com ao menos uma aposta no roteiro, a nota do que é inventado e o lugar da voz dos
  autores.
- **Evidência:** `npm test`; o build falha sem um campo do molde e com um resultado que não aponta saída gravada; o
  teste falha sem uma parte do texto; captura da página.
- **Fica fora:** a landing mostrar a afirmação no card (depois, se fizer sentido).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `c949877` (e o FontMarAI) | `npm test` com 52 testes (um novo: os endereços antigos redirecionam); pelo túnel, `/experimentos/`, o JSON e o experimento abrem, e `/guias/` e `/guias/segundo-cerebro-local/` levam aos novos; a landing com o card Experimentos, "O experimento do dia" e "Experimentos recentes"; capturas | Erick, 24/10/2026 |
| 2 | `4f5b94a` | `npm test` com 54 testes; o build falha sem um campo do molde, com resultado que aponta saída inexistente ou sem "X de Y", e com régua que aponta arquivo inexistente; o teste falha sem "O que vamos construir", sem aposta no roteiro, sem a nota do inventado e sem o `Pendente`; capturas no claro, no escuro e no celular | Erick, 24/10/2026 |

(redação: claude-opus-5-5)
