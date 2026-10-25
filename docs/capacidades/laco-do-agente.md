# O laço do agente, animado

**Problema.** No 1.1, a diferença entre fluxo e agente aparece em duas peças que mostram a mesma ideia: os "três
jeitos" (um passo a passo por abas) e um `Pendente` para o laço do atendente. Nenhuma mostra o laço girando, nem pede
uma decisão do leitor antes do momento-chave. E agir e observar, por dentro de uma volta, ainda não têm figura.

## Decisões

- (25/10/2026, Erick) No 1.1, uma animação no padrão da do mapa do ciclo (Remotion, o leitor avança cena a cena) mostra
  quem decide o próximo passo: só o modelo, fluxo fixo e agente, com o BT-1003 e a frigideira dos "três jeitos". Ela
  substitui os "três jeitos" e o `Pendente` do laço.
- (25/10/2026, Erick) O laço se diz com as palavras do livro: decidir · agir · observar · responder; no 1.1, "olhar o
  resultado" vira "observar". Nada de texto, tabela ou figura de *AI Agents: The Definitive Guide*: o desenho é da loja,
  e o livro fica citado (decisão do "Capítulo 1 revisado").
- (25/10/2026, Erick) A segunda animação, agir e observar por dentro de uma volta, entra no capítulo 3, com a gravação
  real do agente com ferramentas, quando o capítulo existir.
- (1) As animações dividem uma base só (`palco/AvancaCena.tsx`): o Player do Remotion avançado cena a cena com `seekTo`,
  `play` e `pause`, parado pelo evento `frameupdate` (https://www.remotion.dev/docs/player/player); o modo direto, o menos
  movimento e o anúncio para leitor de tela. As cores e as curvas das composições ficam em `palco/video.ts`.
- (2) Cada cena é um jeito com uma pergunta dos "três jeitos", e anda pelos passos de lá: o ponto que é a pergunta vai
  de peça em peça pelas setas do laço; a ficha de quem decide acende; embaixo, a legenda da cena e o passo de agora (a
  chamada, o resultado, a resposta com ✓ ou ✗). O que o jeito não usa fica apagado. O quadro final soma os acertos
  de cada jeito nas duas perguntas, saídos dos mesmos dados. "Decide de novo" é só do agente: o modelo sozinho faz "uma
  passada", e o fluxo fixo "segue a ordem", duas setas que só aparecem na cena que as usa.
- (25/10/2026, Erick) A figura 1.1 é um gráfico animado contínuo, com câmera, e não cena a cena: começa no play do
  leitor (play, pausar e uma barra para voltar), e para quando a pergunta chega a decidir, na parte do agente, para o
  leitor investir. As "cenas" do laco.json viram trechos de um gráfico só.
- (25/10/2026, Erick) Sem câmera e sem a barra do tempo: o leitor vê o laço inteiro o tempo todo, e controla só com
  play e pausar ("a experiência piorou com a câmera, melhor ele ver o todo"). Vale da etapa 5 em diante.
- (25/10/2026, Erick) A figura 1.1 com o laço abstrato ficou "confusa, abstrata e trazendo mais dúvidas": refeita na
  etapa 6, com "a melhor experiência possível".
- (6) Os três jeitos lado a lado, com a mesma mensagem da cliente no topo: os passos de cada um (os dos "três jeitos")
  aparecem juntos, como cartões concretos (quem fez, o que fez, o selo "decide" ou "decide de novo"), e cada coluna
  termina na resposta, ✓ ou ✗, com o porquê. Primeiro o pedido, depois a frigideira; antes da frigideira, o leitor
  investe no que o fluxo fixo faz. No fim, o placar das duas perguntas em cada coluna. No celular, três faixas, uma
  embaixo da outra, com o passo de agora e os anteriores em miniatura. Sai o diagrama do laço (caixas e setas).
- (25/10/2026, Erick) As três colunas ao mesmo tempo também perderam o leitor ("muita informação… fiquei confuso e
  perdido… o tempo também não ajudou"): na etapa 7, um jeito por vez, com um resumo de uma linha no topo quando
  termina, tocando sozinho e devagar (cerca de 3 s por passo), com a pausa para investir.
- (7) Quatro vezes, na ordem que conta a história: só o modelo com o pedido, o fluxo fixo com o pedido, o fluxo fixo
  com a frigideira (antes dela, o investimento) e o agente com a frigideira. Cada passo, em frase curta (o `curto` de
  cada passo nos três jeitos); a frase inteira fica na figura em texto. No fim, só os quatro resumos e a conclusão.
- (25/10/2026, Erick) "Ainda não está bom… não se limite às minhas referências, faça o que proporcionará a melhor
  experiência": na etapa 8, a figura 1.1 deixa de ser vídeo e vira uma figura em que o leitor faz o papel de cada
  jeito (docs/PRINCIPIOS.md: o leitor aprende com o que faz). Três rodadas, uma por vez: prevê o que o modelo sozinho
  responde; executa o roteiro do fluxo fixo com o pedido e, depois de prever, com a frigideira; e, como o modelo de um
  agente, escolhe cada passo até responder, vendo o laço que fez. Sai do Remotion: a composição do laço, o player
  contínuo e as composições do Studio deixam de existir.
- (3, até a 5) A câmera aproximava o que estava acontecendo (a peça de agora e a seguinte) e abre para o quadro inteiro entre um
  trecho e outro; com menos movimento, ela fica parada e o ponto pula de peça em peça. A opção certa do investimento é
  a decisão dos "três jeitos" (o teste confere). O player fluido é uma base nova (`palco/TocaGrafico.tsx`); a de cena a
  cena (`AvancaCena`) segue no mapa da introdução. No modo direto, o quadro final, sem pausa. Sem JS, a figura em
  texto, aberta.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `palco/AvancaCena.tsx` | o Player cena a cena, com o botão, o modo direto e o menos movimento | a composição e os cortes | a ilha | nova (etapa 1) |
| `palco/video.ts` | as cores e as curvas das composições | — | — | nova (etapa 1) |
| `ciclo/FiguraCiclo.tsx` | o mapa animado da introdução, sobre a base | — | a ilha | troca (etapa 1) |
| `figuras/laco.json` + `laco/laco.ts` | o elenco, o desenho do laço e as cenas | `tres-jeitos.json` | as caixas e a linha do tempo | nova (etapas 1 e 2) |
| `laco/LacoAnimado.tsx` | a composição: o laço, quem decide, o caminho de cada jeito | `laco.json` | o vídeo | nova (etapas 1 e 2) |
| `palco/TocaGrafico.tsx` | o gráfico contínuo: play, pausar, a barra, a pausa para investir | a composição | a ilha | nova (etapa 3) |
| `FiguraLaco.astro` + ilha | o gráfico no 1.1, com a pausa para investir e a figura em texto | a composição | a figura | nova (etapa 3) |

## Etapas

1. A base comum do player (o mapa da introdução passa a usá-la, igual para o leitor) e o elenco parado da animação, no
   Studio.
2. As cenas da animação no Studio: só o modelo, fluxo fixo com as duas perguntas, o agente e o quadro final.
3. O gráfico animado no 1.1, contínuo e com câmera, no lugar dos "três jeitos" e do `Pendente`: o play do leitor, a
   pausa para investir, o modo direto, o menos movimento, sem JS; "olhar" vira "observar".
4. A animação de agir e observar, no capítulo 3, com a gravação real.
5. O laço inteiro à vista, na figura 1.1: sem câmera e sem a barra do tempo.
6. A figura 1.1 refeita: os três jeitos lado a lado, com os passos concretos e o investimento no fluxo fixo.
7. Um jeito por vez, com o resumo que se acumula no topo, devagar e com frases curtas.
8. A figura 1.1 em que o leitor decide: três rodadas, e o laço que ele mesmo faz.

## Etapa atual: 8

**Arquivos.** `figuras/laco.json` (as três rodadas), `laco/quemDecide.ts` (novo: as rodadas montadas dos três jeitos e
conferidas), `laco/QuemDecide.tsx` (novo: a ilha), `FiguraLaco.astro`; saem `laco/laco.ts`, `laco/LacoAnimado.tsx`,
`laco/FiguraLacoVideo.tsx`, `palco/TocaGrafico.tsx` e as composições do laço no my-video; `testes/laco.test.mjs`.

**Evidência.** Os testes do livro passam; os testes novos falham com o código de antes; no navegador, com clique de
verdade, as três rodadas do começo ao fim (as previsões certas e erradas, o laço com um desvio), em 1280 e 390 px; com
menos movimento, no modo direto e sem JS.

**Fora.** A etapa 4, que segue esperando o capítulo 3.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `37a2834` | 107 testes do livro; os 3 novos falham sem o código; no navegador, o mapa da introdução sobre a base: as 6 cenas com clique de verdade (5, 6, 7, 8, 7 e 5 s), com menos movimento e no modo direto, iguais a antes; o elenco renderizado em 720 e 360 px | Erick, 25/10/2026 |
| 2 | `55578ca` | 110 testes do livro; os 3 novos falham sem o código; quadros das 6 cenas e os vídeos inteiros renderizados pelo Remotion, em 720 e 360 px | Erick, 25/10/2026 |
| 3 | `0b53f39` | 114 testes do livro; os 4 novos falham sem o código; no navegador, com clique de verdade: o play, a pausa aos 25 s e o investimento certo e o errado, o fim, a barra e o pausar, em 1280 e 390 px; com menos movimento, no modo direto e sem JS; os vídeos inteiros renderizados pelo Remotion | Erick, 25/10/2026 |
| 5 | `353dc88` | 114 testes do livro; os novos falham com o código de antes; no navegador, o laço inteiro do começo ao fim, a pausa e o investimento, em 1280 e 390 px | não: "confuso, abstrato" (refeita na 6) |
| 6 | sem commit | os três jeitos lado a lado, renderizados em 720 e 360 px | não: "muita informação de uma vez" (refeita na 7) |
| 7 | `7d74e64` | 115 testes do livro; no navegador, do play ao fim, com o investimento, em 1280 e 390 px; os vídeos inteiros | não: "ainda não está bom" (refeita na 8) |

(redação: claude-opus-5-5)
