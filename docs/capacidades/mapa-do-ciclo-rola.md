# O mapa do ciclo toca ou rola, como as outras figuras

**Problema.** A figura 1, o mapa do ciclo na introdução, é a única animação do livro que o leitor avança cena a cena,
por um botão (`palco/AvancaCena.tsx`). Todas as outras tocam pelo play ou andam com a rolagem da página
(`palco/RolaCena.tsx`), e a escolha fica lembrada para o livro todo. O Erick pediu a opção de rolar também nesta e um
visual um pouco melhor (27/10/2026).

## Decisões

- (27/10/2026, Erick) "Na ilustração figura 1, vamos inserir a opção de scroll também e melhorar um pouco mais o visual."
- (1) O mapa passa para a base das outras figuras: tocar ou rolar com a página, e a mesma chave lembrada. O avançar
  cena a cena sai, e com ele a `AvancaCena`, que só o mapa usava. A animação continua avisando o mapa de qual fase
  acender, agora por um `aoQuadro` da `RolaCena`. O clique num nó continua abrindo o cartão da fase.
- (1) O visual, sem mudar o que o desenho diz (as fases, as voltas e os capítulos vêm do `ciclo.json`): nós com mais
  contraste sobre o fundo, setas da ida mais firmes, Evoluir dentro do halo no anel e deitado na coluna do celular (em
  pé, o nome e o ícone ficavam de lado).

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | O mapa toca ou rola, com o visual revisto no anel e na coluna | toca ou rola e vê cada problema andar até a fase que o captura |

## Etapa atual: 1 — tocar ou rolar, e o visual

- `FiguraCiclo` usa a `RolaCena`, com o texto das cenas para o leitor de tela; a `RolaCena` ganha o `aoQuadro`.
- A `AvancaCena` e o estilo dela saem; o teste que exigia a base cena a cena passa a exigir a `RolaCena`.
- A introdução troca "Avance o mapa" pelo que o leitor faz agora.
- No `Anel.tsx`: os nós e as setas da ida mais visíveis; Evoluir sobe para dentro do halo no anel e fica deitado na
  coluna.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | 9946916 | `npm test` 190/190 (o teste do laço exige a `RolaCena`, o `aoQuadro` e que a `AvancaCena` saiu). Capturas rolando com a página a 1280 px (o começo, o gasto em Observar, o modelo novo em Evoluir, Governar aceso no fim) e a 390 px (Evoluir deitado, sem encostar no ícone); ajustes: a curva de Evoluir passava rente a Pôr no ar, e o cap. 9 encostava no ícone | aguardando revisão |

(redação: Claude Opus 5.5)
