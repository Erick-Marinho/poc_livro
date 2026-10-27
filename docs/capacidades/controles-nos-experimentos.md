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
- (27/10/2026, Erick) A etapa 3 em três partes, cada uma com o seu ok, a partir da revisão dos três experimentos: os
  erros de fato (3a), nenhuma caixa entrega a resposta antes (3b) e o storytelling (3c).
- (1) Três etapas, cada uma com o seu ok: a pílula; os controles nos experimentos; a revisão dos experimentos (um
  revisor lê os três enquanto as duas primeiras andam).

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | A pílula se recolhe ao rolar e volta ao toque, no livro | lê sem a pílula na frente e a chama quando quer navegar |
| 2 | Os experimentos com o topo, o sumário, a pílula e as configurações do livro | navega entre experimentos, liga o foco e abre a IDE como no livro |
| 3 | A revisão dos experimentos: storytelling, padrão de caixas e conteúdo | lê experimentos no mesmo padrão dos capítulos |

## Etapa atual: 3a — os erros de fato

- Segundo cérebro: "uns 7 segundos" vira "uns 11 (de 4 a 16), nas respostas gravadas" (a média das gravadas é 10,8 s; o 7
  vinha de rodadas não gravadas), no custo e na IDE. "Só o e-mail diz 21/11" vira "só um e-mail diz que a entrega mudou
  para 21/11": o da clínica também diz 21/11, mas não fala de entrega, e a figura do cofre conta só as frases da entrega.
- Pausa e fluxo: o primeiro palpite diz o que o artigo afirma, e não como fato, e o fecho diz "você concordou com o
  artigo", porque a medida desmentiu metade dele. A IDE vira a figura 1 (não havia figura 1). O "Repetir" diz como
  instalar o uv.
- Temperatura zero: o comparador conta a resposta cortada como igual (ele mede repetição); quem avisa do corte é a
  figura. O link do PyTorch aponta a versão 2.8, a da coleta. As cinco cenas do mapa, e não seis.
- Nos dois projetos, "rodando" vira "executado"; no `RITMO.md` e no `ritmo.mjs`, o mapa não tem palpite antes.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | a542a3e | Num navegador, a 1280 e 390 px, no capítulo 1: no topo, a pílula; rolando 500 px, o círculo; tocando nele, a pílula de novo; rolando 400 px, o círculo. `npm test` 198/198 | Erick, 27/10/2026 |
| 2 | f88b321 | `testes/controles-experimentos.test.mjs` (2): em cada experimento, o sumário com os três, o atual marcado, o topo com a seção e os comandos, a pílula, as seções do molde; e a pílula que se recolhe ao rolar sem guardar. `npm test` 200/200. Num navegador, no Pausa e fluxo a 1280 e 390 px: o sumário, o topo, a pílula e o recolhimento ao rolar e ao tocar | Erick, 27/10/2026 |

(redação: Claude Opus 5.5)
