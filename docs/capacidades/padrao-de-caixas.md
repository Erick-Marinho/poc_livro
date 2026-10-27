# Um máximo de caixas de pergunta por capítulo

**Problema.** O capítulo 1 tinha 14 caixas de pergunta na página (2 palpites, 5 Pare e pense, 6 dinâmicas próprias e
o exercício), o dobro do capítulo 2 (7) e mais que o triplo da introdução (4). O Erick: "vamos equilibrar e estabelecer
o máximo por padrões; muitos também fica chata a leitura" (27/10/2026).

## Decisões

- (27/10/2026, Erick) O padrão, só na página (a IDE fica de fora): até 3 Pare e pense, 2 palpites, 3 dinâmicas
  próprias (figura em que o leitor age) e 1 exercício, no fim; no máximo 9 caixas. Fica no `docs/RITMO.md`, e um teste
  confere em cada capítulo.
- (27/10/2026, Erick: "você escolhe, sem perder o storytelling e a qualidade") O que sai:
  - Capítulo 1, das dinâmicas: o Monte a questão e o Classificador (1.5) e a Decisão fixa (1.7). O leitor escreve as
    vinte questões e troca a decisão do agente preguiçoso na IDE, logo depois; ficam as histórias da 1.1 (o que é
    agente), o Primeiro dia (as quatro coisas a fazer) e a caixa da colega (o bilhete leva ao gabarito).
  - Capítulo 1, dos Pare e pense: o do 1.4 (o bilhete num tom mais seco), que repete a caixa da colega logo antes, e o do
    1.7 (a regra do pedido e do e-mail), que repete o passo 20 da IDE.
  - Capítulo 2, dos palpites: o do 2.1 (o lençol), cuja resposta é lembrar o gabarito do capítulo 1; ficam o do texto
    solto (2.2) e o do desconto (2.4).
- (1) As sementes ficam no texto: o "quando a política não diz, passa a vez" (o boleto em 12 vezes, no 1.5) e os 40%
  do sempre responder com o R12 no meio (no 1.7, agora dito como o que o leitor viu na IDE), que o 2.6 cobra.
- (1) Os componentes que saem do livro saem do código, com os testes deles: `Classificador`, `MontaQuestao` (e
  `questao/`), `DecisaoFixa` (e `chute/`). A IDE do capítulo 1 passa a ser a figura 1.2.

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | O padrão no `RITMO.md` e no teste; os cortes no capítulo 1 e no 2, com o texto em volta | lê com menos interrupções, e as que ficam carregam a história |

## Última etapa: 1 (concluída)

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | c67981c | `testes/padrao-de-caixas.test.mjs`: introdução 4, capítulo 1 9 (3 Pare e pense, 2 palpites, 3 dinâmicas, 1 exercício), capítulo 2 6. `npm test` 198/198 (saem os testes das peças removidas). Ritmo: 1.4 192, 1.5 199 e 1.7 200 palavras, depois de enxugar o texto; os avisos que sobram são os de antes. Captura do 1.5 | Erick, 27/10/2026 |

(redação: Claude Opus 5.5)
