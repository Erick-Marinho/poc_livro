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

## Etapa atual: 3 — quem decide, num controle deslizante, no 1.1

As etapas 1 e 2 fecharam com o ok do Erick (registro abaixo).

### O que muda

- Uma figura nova (`escala/`) no lugar do parágrafo que descreve a escala só em texto ("Num ponto está o fluxo
  fixo… No fim ficam vários agentes"). O leitor arrasta um controle pelos quatro pontos da escala (fluxo fixo,
  roteador, agente, vários agentes) e vê a mesma mensagem, "Quando chega o meu pedido BT-1003?", atravessar o
  sistema daquele ponto: os passos entram um a um, cada um com quem decidiu (o código ou o modelo), e um contador diz
  quantas vezes o modelo decidiu. Uma frase por ponto.
- A Aposta da escala fica logo depois: a figura mostra, a Aposta confere.
- É ilustração, e diz que é: os passos foram escritos para mostrar o padrão; os dados do pedido (Transportadora Asa
  Leve, previsão em 14/11) são os da loja, e o teste confere. Os nomes dos quatro pontos são os da Aposta, e o
  teste confere também.
- No ritmo, não conta como ação (arrastar e ver, sem decidir); quem conta é a Aposta logo depois.
- O modo direto não muda nada: não há passo a passo a recolher.

### Verificação

- Teste: os quatro pontos têm os nomes da Aposta, na ordem; o contador de cada ponto é o número de passos em que
  o modelo decide, e cresce de um ponto para o outro; os dados do pedido batem com os da loja.
- `npm run ritmo`, `npm test` e capturas no computador e no celular, em dois pontos da escala.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `f838161` | `testes/questao.test.mjs` (6): regras lidas do `contrato.py`, as 20 questões passam e a linha gerada é a do arquivo, cada regra barra o que deve; `npm test` 149/149; ritmo do 1.5: 87 → MontaQuestao → 107 → Classificador; capturas a 1280 e 390 px com cliques e digitação de verdade: barrada (id "R1"), aceita mas diferente do gabarito (recusar), aceita e igual (abrir chamado); modo direto com o R10 preenchido e aceito | substituída pela 2ª versão |
| 1 (2ª versão) | `3cd795b` | Uma pergunta por vez, com a linha com buracos (o Erick: "muita informação no espaço"). `npm test` 149/149; ritmo do 1.5: 85 → MontaQuestao → 107; capturas a 1280 e 390 px: decisão marcada com o buraco seguinte aceso, motivo "ok" barrado pelo contrato, aceita mas diferente do gabarito (recusar), refeita e igual (abrir chamado) | Erick, 26/10/2026 |
| 2 | `e550425` | `testes/decisao-fixa.test.mjs` (4): filas de 8, 2, 5 e 5 saídas do `referencia.jsonl`; notas 40%, 10%, 25% e 25% iguais às saídas gravadas; saída que não bate não monta; o R12 é recusar. `npm test` 153/153; ritmo do 1.7: 36 → DecisaoFixa → 213 → Exercicio (era 214 antes, pelo Resumo); capturas a 1280 e 390 px: antes de escolher, no passar e no responder com o balão do R12; modo direto no responder | Erick, 26/10/2026 |

(redação: Claude Opus 5.5)
