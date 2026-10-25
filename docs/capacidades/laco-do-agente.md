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
- (3) A câmera aproxima o que está acontecendo (a peça de agora e a seguinte) e abre para o quadro inteiro entre um
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

## Etapa atual: 3

**Arquivos.** `laco/laco.ts` (a câmera de cada momento e a pausa, conferidas), `laco/LacoAnimado.tsx` (a câmera sobre o
desenho), `palco/TocaGrafico.tsx` (novo), `laco/FiguraLacoVideo.tsx` e `FiguraLaco.astro` (novos), `figuras/laco.json`
(o investimento), `01-o-problema-e-o-contrato.mdx`, `scripts/ritmo.mjs`, `testes/laco.test.mjs`.

**Evidência.** Os testes do livro passam; os testes novos falham sem o código; no navegador, com clique de verdade: o
play, a câmera, a pausa e o investimento certo e o errado, a barra para voltar, em 1280 e 390 px; com menos movimento,
no modo direto e sem JS; o vídeo inteiro renderizado pelo Remotion.

**Fora.** O componente `Rastro`, que fica no repositório sem uso; o capítulo 3 (etapa 4).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `37a2834` | 107 testes do livro; os 3 novos falham sem o código; no navegador, o mapa da introdução sobre a base: as 6 cenas com clique de verdade (5, 6, 7, 8, 7 e 5 s), com menos movimento e no modo direto, iguais a antes; o elenco renderizado em 720 e 360 px | Erick, 25/10/2026 |
| 2 | `55578ca` | 110 testes do livro; os 3 novos falham sem o código; quadros das 6 cenas e os vídeos inteiros renderizados pelo Remotion, em 720 e 360 px | Erick, 25/10/2026 |

(redação: claude-opus-5-5)
