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

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `palco/AvancaCena.tsx` | o Player cena a cena, com o botão, o modo direto e o menos movimento | a composição e os cortes | a ilha | nova (etapa 1) |
| `palco/video.ts` | as cores e as curvas das composições | — | — | nova (etapa 1) |
| `ciclo/FiguraCiclo.tsx` | o mapa animado da introdução, sobre a base | — | a ilha | troca (etapa 1) |
| `figuras/laco.json` + `laco/laco.ts` | o elenco, o desenho do laço e as cenas | `tres-jeitos.json` | as caixas e a linha do tempo | nova (etapas 1 e 2) |
| `laco/LacoAnimado.tsx` | a composição: o laço, quem decide, o caminho de cada jeito | `laco.json` | o vídeo | nova (etapas 1 e 2) |
| `FiguraLaco.astro` + ilha | a animação no 1.1, com a pausa para investir | a composição | a figura | nova (etapa 3) |

## Etapas

1. A base comum do player (o mapa da introdução passa a usá-la, igual para o leitor) e o elenco parado da animação, no
   Studio.
2. As cenas da animação no Studio: só o modelo, fluxo fixo com as duas perguntas, o agente e o quadro final.
3. A animação no 1.1, no lugar dos "três jeitos" e do `Pendente`: a pausa para investir, o modo direto, o menos
   movimento, sem JS; "olhar" vira "observar".
4. A animação de agir e observar, no capítulo 3, com a gravação real.

## Etapa atual: 1

**Arquivos.** `palco/AvancaCena.tsx` e `palco/video.ts` (novos), `ciclo/FiguraCiclo.tsx` e `ciclo/CicloAnimado.tsx`
(sobre a base, sem mudar o que o leitor vê), `MapaDoCiclo.astro` (o estilo do botão vai para a base),
`figuras/laco.json`, `laco/laco.ts` e `laco/LacoAnimado.tsx` (novos: o elenco parado, em largo e em coluna), o Studio
do my-video (a composição nova), `testes/laco.test.mjs` (novo).

**Evidência.** Os testes do livro passam; os testes novos falham sem o código; no navegador, o mapa da introdução avança
as 6 cenas como antes, com menos movimento e no modo direto; o elenco parado renderizado pelo Remotion, em largo e a
360 px.

**Fora.** As cenas (etapa 2); a página (etapa 3).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|

(redação: claude-opus-5-5)
