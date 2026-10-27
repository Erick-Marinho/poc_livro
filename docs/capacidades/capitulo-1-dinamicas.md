# O capítulo 1 com dinâmicas variadas

**Problema.** O capítulo 1 repete três dinâmicas: leitura com pare e pense (quatro), classificar mensagens (quatro
vezes, de jeitos parecidos) e código em listagens paradas, com a prática toda concentrada na IDE de 18 passos. O Erick
pediu animações e outras dinâmicas "diversificadas e focadas na experiência do usuário e no aprendizado", sem precisar
ser iguais às do capítulo 2 (26/10/2026).

## Decisões

- (26/10/2026, Erick) Quatro dinâmicas, cada uma escolhida pelo que o leitor precisa aprender ali, na ordem do ganho
  no aprendizado; o Erick deixou a ordem com o planejador ("siga como quiser").
- (26/10/2026, Erick) Ficam como estão: a figura 1.1 (nove voltas, com ok), o primeiro dia do 1.3, o bilhete e o
  gabarito do 1.4 e a IDE do 1.6 (da outra sessão).
- (26/10/2026, Erick) Na primeira versão da etapa 1, "muita informação no espaço, fica difícil acompanhar"; ficou o que
  ele gostou: ir marcando e ver o arquivo se construindo. Daí: uma pergunta por vez, e a linha com buracos.
- (26/10/2026, Erick) "1.5 tem muita pergunta": cartões que aparecem um por vez, responde, vê o retorno e passa
  para o próximo, na horizontal. "Podemos fazer em todas as perguntas": vale para todo componente de lista de
  perguntas (Classificador, PrimeiroDia, Aposta), no livro e nos experimentos.
- (1) Uma etapa por vez: faz, mostra no túnel, ajusta, e só então a próxima. O que a dinâmica mostra do projeto vem do
  projeto real (o `contrato.py`, o `referencia.jsonl`, as saídas gravadas); o que for ilustração diz que é.

## Etapas

| Etapa | Seção | Dinâmica | O que o leitor faz | O que aprende |
|---|---|---|---|---|
| 1 | 1.5 | Monte a sua primeira questão da prova | escolhe uma mensagem, marca a decisão, escreve o motivo e vê a linha do `referencia.jsonl` nascer, com o contrato barrando o que está errado | a ponte entre o gabarito e o código, com as regras reais do `contrato.py` |
| 2 | 1.7 | Chute uma letra | escolhe a decisão que o "agente que chuta" repete e vê a nota de cada chute (saídas gravadas) e o R12 do chute "responder" | uma nota que conta todo erro igual engana |
| 3 | 1.1 | Quem decide, num controle deslizante | arrasta de fluxo fixo a vários agentes e vê quem decide cada passo | agente é uma escala de quanto o modelo decide |
| 4 | 1.2 | O dia seguinte, animado | toca ou rola: o agente apressado passa nos testes de uma tarde e erra as mensagens do dia seguinte | sem gabarito, não há como saber que errou |
| 5 | livro todo | As perguntas em cartões, uma por vez | responde, vê o retorno e passa para a próxima, que entra deslizando | o mesmo de antes, sem a parede de perguntas |

## Plano fechado (26/10/2026)

As cinco etapas fecharam com o ok do Erick (registro abaixo). O que segue é o detalhe da última, a 5.

### Etapa 5 — as perguntas em cartões, uma por vez

#### O que muda

- Uma peça só, `src/lib/cartoes.ts`, que o Classificador, o PrimeiroDia e a Aposta chamam: a lista de perguntas vira
  cartões no mesmo lugar, um visível por vez. O leitor responde, o retorno aparece no cartão (o de cada componente,
  como hoje) e surge "próxima →"; o próximo cartão entra deslizando da direita. Embaixo, "2 de 8" e um ponto por
  cartão (os já vistos e o próximo são clicáveis, para voltar). No último, o placar ou o fecho de cada componente,
  como hoje.
- Só o cartão de agora aparece, com a altura dele: empilhados, o maior (já com o retorno aberto) deixava um vazio
  nos outros, no celular.
- Sem JavaScript e no modo direto, a lista continua inteira, como hoje. No Classificador, "recomeçar" volta ao
  primeiro cartão.
- Vale onde esses componentes estão: introdução, capítulo 1 e os experimentos.
- (26/10/2026, Erick: "pode usar esse padrão onde tem perguntas e respostas") Conferido no livro e nos experimentos:
  as listas de perguntas e respostas são só essas três, e as três já usam os cartões (introdução, 1.1, 1.2, 1.3, 1.5,
  segundo cérebro e temperatura zero). Ficam de fora, de propósito: o Pilhas (separar em grupos pede ver as cartas
  juntas), os pare e pense (cada um é uma pergunta só, e nenhum está colado a outro), o Troca (já é uma variante por
  vez) e as dúvidas da IDE (são conversa, na IDE).

#### Verificação

- `npm test` (os testes de cada componente seguem valendo; um teste novo confere que os três usam os cartões e que o
  modo direto mostra a lista inteira).
- Capturas no computador e no celular: o primeiro cartão, o retorno com "próxima →", o cartão seguinte entrando e o
  fim, no 1.5; e um cartão do PrimeiroDia e da Aposta.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `f838161` | `testes/questao.test.mjs` (6): regras lidas do `contrato.py`, as 20 questões passam e a linha gerada é a do arquivo, cada regra barra o que deve; `npm test` 149/149; ritmo do 1.5: 87 → MontaQuestao → 107 → Classificador; capturas a 1280 e 390 px com cliques e digitação de verdade: barrada (id "R1"), aceita mas diferente do gabarito (recusar), aceita e igual (abrir chamado); modo direto com o R10 preenchido e aceito | substituída pela 2ª versão |
| 1 (2ª versão) | `3cd795b` | Uma pergunta por vez, com a linha com buracos (o Erick: "muita informação no espaço"). `npm test` 149/149; ritmo do 1.5: 85 → MontaQuestao → 107; capturas a 1280 e 390 px: decisão marcada com o buraco seguinte aceso, motivo "ok" barrado pelo contrato, aceita mas diferente do gabarito (recusar), refeita e igual (abrir chamado) | Erick, 26/10/2026 |
| 2 | `e550425` | `testes/decisao-fixa.test.mjs` (4): filas de 8, 2, 5 e 5 saídas do `referencia.jsonl`; notas 40%, 10%, 25% e 25% iguais às saídas gravadas; saída que não bate não monta; o R12 é recusar. `npm test` 153/153; ritmo do 1.7: 36 → DecisaoFixa → 213 → Exercicio (era 214 antes, pelo Resumo); capturas a 1280 e 390 px: antes de escolher, no passar e no responder com o balão do R12; modo direto no responder | Erick, 26/10/2026 |
| 3 | `cab020f` | `testes/quem-decide.test.mjs` (4): os pontos têm os nomes da Aposta, o modelo decide 0, 1, 2 e 3 vezes, os dados do pedido saem do `pedidos.json` (trocar a previsão na loja muda a figura), ponto renomeado, pedido inexistente ou dado inventado não montam. `npm test` 157/157; ritmo do 1.1: 179 → 136 palavras antes da Aposta; capturas a 1280 e 390 px no fluxo fixo, no agente (clique no nome) e em vários agentes (seta do teclado no controle) | Erick, 26/10/2026 |
| 4 | `d20bc16` | `testes/dia-seguinte.test.mjs` (4): a tarde é de responder, o dia seguinte é o da Aposta, a nota 5 de 8 sai da conta, caso inexistente, tarde com outra decisão ou ordem trocada não montam, os balões cobrem a animação. `npm test` 161/161 numa cópia limpa (HEAD mais esta etapa), porque o experimento temperatura-zero da outra sessão, ainda sem commit, quebra a montagem na pasta de trabalho; ritmo do 1.2: 195 → PrimeiroDia; capturas rolando com a página a 1280 e 390 px, da tarde à nota | Erick, 26/10/2026 |
| 5 | `d5c818c` | `testes/cartoes.test.mjs` (2): os três componentes usam os cartões com a sua marca de respondido, recomeçar volta ao primeiro, o modo direto mostra a lista inteira. `npm test` 163/163 numa cópia limpa (HEAD mais esta etapa; a pasta de trabalho segue com o experimento temperatura-zero da outra sessão, que quebra a montagem). Capturas a 1280 e 390 px com cliques de verdade: o primeiro cartão do 1.5, o retorno com "próxima →", o segundo entrando, o oitavo com o placar (8 de 8), o PrimeiroDia e a Aposta; no modo direto, 8/8, 6/6 e 4/4 visíveis e sem navegação. Na primeira versão, empilhados, os cartões deixavam um vazio no celular: cada um passou a ter a sua altura | Erick, 26/10/2026 |

(redação: Claude Opus 5.5)
