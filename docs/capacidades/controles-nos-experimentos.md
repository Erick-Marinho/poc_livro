# Os experimentos com os controles do livro, e a pílula que sai da frente

**Problema.** Na leitura de 27/10/2026, o Erick pediu três coisas: que a pílula de navegação saia da tela quando o
leitor rola o texto, com o movimento para a direita que ela já faz ao ser arrastada, e só volte quando ele quiser
navegar; que os experimentos tenham os mesmos controles do livro (hoje têm só o topo do site, sem o sumário, a pílula,
as configurações, o foco nem o botão da IDE); e uma revisão dos experimentos em storytelling, padrão de caixas e
conteúdo.

## Decisões

- (27/10/2026, Erick) A pílula se recolhe ao rolar e só volta quando o leitor toca no círculo; vale no livro e nos
  experimentos.
- (1) Ao rolar uns 120 px, a pílula vira o círculo, sem guardar nada: a escolha guardada do leitor (pílula sempre
  recolhida) não muda. Tocando no círculo, ela volta e fica até ele rolar de novo, para dar tempo de navegar. É o mesmo
  mecanismo da licença que ela já dá à barra da IDE.
- (1) Três etapas, cada uma com o seu ok: a pílula; os controles nos experimentos; a revisão dos experimentos (um
  revisor lê os três enquanto as duas primeiras andam).

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | A pílula se recolhe ao rolar e volta ao toque, no livro | lê sem a pílula na frente e a chama quando quer navegar |
| 2 | Os experimentos com o topo, o sumário, a pílula e as configurações do livro | navega entre experimentos, liga o foco e abre a IDE como no livro |
| 3 | A revisão dos experimentos: storytelling, padrão de caixas e conteúdo | lê experimentos no mesmo padrão dos capítulos |

## Etapa atual: 2 — os controles nos experimentos

- A página do experimento troca o topo do site pelo do livro (o ☰, a seção em que o leitor está, o foco e "Leia com a
  IDE aberta"; sem o botão da nota, porque experimento não tem placar) e ganha a `Navegacao` do livro: o sumário, com
  os experimentos, o mais novo em cima, e as seções do atual (com "O que se testa" e "O que deu", do molde); a pílula,
  com o anterior e o próximo, na mesma ordem; e as configurações. O script do `<head>` é o do livro (tema, pílula,
  sumário fechado, foco).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | a542a3e | Num navegador, a 1280 e 390 px, no capítulo 1: no topo, a pílula; rolando 500 px, o círculo; tocando nele, a pílula de novo; rolando 400 px, o círculo. `npm test` 198/198 | Erick, 27/10/2026 |

(redação: Claude Opus 5.5)
