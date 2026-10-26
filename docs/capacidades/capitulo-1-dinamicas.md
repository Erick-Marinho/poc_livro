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
- (1) Uma etapa por vez: faz, mostra no túnel, ajusta, e só então a próxima. O que a dinâmica mostra do projeto vem do
  projeto real (o `contrato.py`, o `referencia.jsonl`, as saídas gravadas); o que for ilustração diz que é.

## Etapas

| Etapa | Seção | Dinâmica | O que o leitor faz | O que aprende |
|---|---|---|---|---|
| 1 | 1.5 | Monte a sua primeira questão da prova | escolhe uma mensagem, marca a decisão, escreve o motivo e vê a linha do `referencia.jsonl` nascer, com o contrato barrando o que está errado | a ponte entre o gabarito e o código, com as regras reais do `contrato.py` |
| 2 | 1.7 | Chute uma letra | escolhe a decisão que o "agente que chuta" repete e vê a nota de cada chute (saídas gravadas) e o R12 do chute "responder" | uma nota que conta todo erro igual engana |
| 3 | 1.1 | Quem decide, num controle deslizante | arrasta de fluxo fixo a vários agentes e vê quem decide cada passo | agente é uma escala de quanto o modelo decide |
| 4 | 1.2 | O dia seguinte, animado | toca ou rola: o agente apressado passa nos testes de uma tarde e erra as mensagens do dia seguinte | sem gabarito, não há como saber que errou |

## Etapa atual: 1 — monte a sua primeira questão, no 1.5

### O que muda

- Uma dinâmica nova (`questao/`): uma mensagem do primeiro dia (com "outra mensagem" para trocar) e, embaixo, a linha
  dela no `referencia.jsonl` com três buracos: decisão, motivo e de onde vem a resposta. Uma pergunta por vez; cada
  resposta preenche o seu buraco, que acende na linha. O contrato confere o que entra: barra o motivo curto e o caso
  que precisa dos pedidos sem pedido, com a mensagem da regra. No fim, aceita a linha e a compara com o gabarito da
  loja: se a decisão é outra, diz que o contrato confere a forma, não a decisão.
- As regras não são reescritas à mão: saem do `contrato.py` (o padrão do id e do pedido, o tamanho mínimo da pergunta
  e do motivo, as decisões, as fontes e as duas regras do `model_validator`, com as mensagens dele). Se o contrato
  mudar e a figura não souber ler, o build falha.
- A dinâmica toma o lugar da listagem das duas linhas do `referencia.jsonl`; a listagem do `Enum` fica.
- No modo direto, a questão do lençol (R10) aparece preenchida e aceita, sem pedir nada.

### Verificação

- Teste das regras: lidas do `contrato.py`; cada caso do `referencia.jsonl` passa nelas; cada regra barra o que deve
  (id sem dois dígitos, pedido sem e-mail, pedido fora do padrão, caso que precisa dos pedidos sem pedido, motivo
  curto); a linha gerada tem as chaves na ordem do arquivo.
- `npm run ritmo`, `npm test` e capturas no computador e no celular, com uma questão barrada e uma aceita.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `f838161` | `testes/questao.test.mjs` (6): regras lidas do `contrato.py`, as 20 questões passam e a linha gerada é a do arquivo, cada regra barra o que deve; `npm test` 149/149; ritmo do 1.5: 87 → MontaQuestao → 107 → Classificador; capturas a 1280 e 390 px com cliques e digitação de verdade: barrada (id "R1"), aceita mas diferente do gabarito (recusar), aceita e igual (abrir chamado); modo direto com o R10 preenchido e aceito | aguardando revisão |
| 1 (2ª versão) | `3cd795b` | Uma pergunta por vez, com a linha com buracos (o Erick: "muita informação no espaço"). `npm test` 149/149; ritmo do 1.5: 85 → MontaQuestao → 107; capturas a 1280 e 390 px: decisão marcada com o buraco seguinte aceso, motivo "ok" barrado pelo contrato, aceita mas diferente do gabarito (recusar), refeita e igual (abrir chamado) | aguardando revisão |

(redação: Claude Opus 5.5)
