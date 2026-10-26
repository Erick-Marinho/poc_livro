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

## Etapa atual: 2 — a decisão fixa, no 1.7

A etapa 1 fechou com o ok do Erick (registro abaixo). A lição dela vale para as próximas: uma coisa por vez no mesmo
espaço.

### O que muda

- Uma dinâmica nova (`chute/`) no lugar do pare e pense "E um agente que responde tudo?": as 20 perguntas da prova
  viram 20 quadradinhos, agrupados pela decisão do gabarito. O leitor escolhe a decisão que um agente que nem lê a
  mensagem repete; os quadradinhos acendem (✓ onde o gabarito é aquela decisão, ✗ nos outros) e a nota aparece. Ele
  pode tentar as outras três com um clique. A nota de uma decisão fixa é o tamanho da fatia dela.
- No "responder", o maior placar (40%), o R12 ganha um balão: o Bruno pergunta do pedido da Ana; responder poderia
  mostrar a compra dela a ele, e a nota conta isso como um erro igual aos outros onze.
- O que é do projeto vem do projeto: os quadradinhos e os grupos, do `referencia.jsonl`; a nota de cada decisão, das
  saídas gravadas do `baseline.py` com o decisor trocado (`r01-nota-de-partida`, `r01-nota-sempre-*`, as mesmas da
  IDE do 1.6). Se a conta dos quadradinhos não bater com a saída gravada, o build falha.
- A lição fica no texto, depois da figura: uma nota que conta todo erro igual engana; no capítulo 4, os erros
  passam a ter peso.
- No modo direto, a figura abre no "responder", com o balão do R12.

### Verificação

- Teste: os grupos e os totais saem do `referencia.jsonl` (8, 2, 5, 5); cada nota bate com a saída gravada; uma saída
  que não bate não monta; o balão do R12 só aparece no "responder".
- `npm run ritmo`, `npm test` e capturas no computador e no celular: antes de escolher, no "passar" e no "responder".

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `f838161` | `testes/questao.test.mjs` (6): regras lidas do `contrato.py`, as 20 questões passam e a linha gerada é a do arquivo, cada regra barra o que deve; `npm test` 149/149; ritmo do 1.5: 87 → MontaQuestao → 107 → Classificador; capturas a 1280 e 390 px com cliques e digitação de verdade: barrada (id "R1"), aceita mas diferente do gabarito (recusar), aceita e igual (abrir chamado); modo direto com o R10 preenchido e aceito | substituída pela 2ª versão |
| 1 (2ª versão) | `3cd795b` | Uma pergunta por vez, com a linha com buracos (o Erick: "muita informação no espaço"). `npm test` 149/149; ritmo do 1.5: 85 → MontaQuestao → 107; capturas a 1280 e 390 px: decisão marcada com o buraco seguinte aceso, motivo "ok" barrado pelo contrato, aceita mas diferente do gabarito (recusar), refeita e igual (abrir chamado) | Erick, 26/10/2026 |

(redação: Claude Opus 5.5)
