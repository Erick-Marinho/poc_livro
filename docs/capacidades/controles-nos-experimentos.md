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

## Etapa atual: 3c — o storytelling

- "A régua passou, a resposta não", nos três: no Temperatura zero, a caixa das 90 respostas (3b); no Segundo cérebro,
  a nota da régua do modelo na IDE lê a resposta da cliente (passou por conter "Clínica Aurora", mas diz que a cliente
  é a gerente); no Pausa e fluxo, um Pare e pense depois dos tempos de verdade conta a metade que a medida refutou (o
  ritmo caiu 25%, dentro dos 20% em só 4 de 10), com a razão do artigo, e um teste amarra os números à coleta.
- O Temperatura zero abre com a situação concreta (a mesma pergunta duas vezes, em temperatura zero) e deixa token,
  pontuação e sorteio para a animação. Não volta o palpite antes do mapa: o Erick o trocou pela animação na revisão do
  experimento.
- O fim de cada experimento vira um `Exercicio` que pede para anotar a previsão antes de executar: medir na sua
  máquina (Pausa e fluxo), coletar na sua máquina (Temperatura zero), medir o cérebro que você usa (Segundo cérebro,
  com a fonte conferida, como a da cliente).
- O teste do padrão de caixas vale também para os experimentos. A figura do Segundo cérebro toca ou rola, como as
  outras; e volta a desenhar: o corte da 3b tirava da lista as etapas que o desenho ainda procurava (o vídeo dava erro),
  e agora só a legenda e a contagem param nas frases que empatam. O Rowboat ganha nome no começo; a legenda dos tempos
  diz "demora 29 vezes mais para começar".

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | a542a3e | Num navegador, a 1280 e 390 px, no capítulo 1: no topo, a pílula; rolando 500 px, o círculo; tocando nele, a pílula de novo; rolando 400 px, o círculo. `npm test` 198/198 | Erick, 27/10/2026 |
| 2 | f88b321 | `testes/controles-experimentos.test.mjs` (2): em cada experimento, o sumário com os três, o atual marcado, o topo com a seção e os comandos, a pílula, as seções do molde; e a pílula que se recolhe ao rolar sem guardar. `npm test` 200/200. Num navegador, no Pausa e fluxo a 1280 e 390 px: o sumário, o topo, a pílula e o recolhimento ao rolar e ao tocar | Erick, 27/10/2026 |
| 3a | 325c753 | Conferido nas gravações (sc-nota-modelo: 3,7 a 16,1 s, média 10,8), no cofre (dois e-mails com 21/11, um sobre a entrega) e no PyTorch (2.8 responde). `npm test` 200/200; a página do Pausa e fluxo tem a Figura 1 | Erick, 27/10/2026 |
| 3b | 40dfedf | Testes (+3): os porquês sem as notas da régua nem as datas; o vídeo do caminho termina antes da escolha e da régua; a avaliação cita trechos da coleta e a resposta da água não diz 100 °C; o palpite da IDE no controle. `npm test` 202/202; ritmo dos experimentos sem aviso novo (o do Segundo cérebro caiu de 244 para 210). Captura da caixa da temperatura respondida até o fim | Erick, 27/10/2026 |

(redação: Claude Opus 5.5)
