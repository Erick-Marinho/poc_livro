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

## Etapa atual: 4 — o dia seguinte, animado, no 1.2

As etapas 1 a 3 fecharam com o ok do Erick (registro abaixo).

### O que muda

- Uma animação (`dia/`, na base de tocar ou rolar do capítulo 2) depois da Aposta do 1.2, no meio do parágrafo que
  dizia em abstrato que "sem essa definição, não existe erro". Quatro momentos, um balão por vez: uma tarde de testes
  (cinco perguntas, todas com a marca "parece certo"); o dia seguinte (as três da Aposta, com a mesma marca); o
  gabarito entra e as marcas viram ✓ e ✗, com o que era certo nas três erradas; e aparece a nota, 5 de 8, "que só
  existe com o gabarito".
- Não repete a Aposta: ela pergunta o que o agente faz com cada mensagem; a animação mostra que, sem gabarito, o erro
  tem a mesma cara do acerto.
- É ilustração e diz que é. As mensagens e o gabarito vêm do `referencia.jsonl`; as da tarde têm que ser de
  responder (o texto diz que ele "responde bem as cinco"), e as do dia seguinte, as da Aposta, na mesma ordem.
- No ritmo, não conta (toca ou rola); o trecho do 1.2 fica abaixo de 200 palavras.

### Verificação

- Teste: a tarde é de perguntas de responder; o dia seguinte é o da Aposta; a nota é a conta das marcas; caso
  inexistente, tarde com outra decisão ou dia seguinte fora de ordem não montam; os balões cobrem a animação.
- `npm run ritmo`, `npm test` e capturas, rolando com a página, no computador e no celular.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `f838161` | `testes/questao.test.mjs` (6): regras lidas do `contrato.py`, as 20 questões passam e a linha gerada é a do arquivo, cada regra barra o que deve; `npm test` 149/149; ritmo do 1.5: 87 → MontaQuestao → 107 → Classificador; capturas a 1280 e 390 px com cliques e digitação de verdade: barrada (id "R1"), aceita mas diferente do gabarito (recusar), aceita e igual (abrir chamado); modo direto com o R10 preenchido e aceito | substituída pela 2ª versão |
| 1 (2ª versão) | `3cd795b` | Uma pergunta por vez, com a linha com buracos (o Erick: "muita informação no espaço"). `npm test` 149/149; ritmo do 1.5: 85 → MontaQuestao → 107; capturas a 1280 e 390 px: decisão marcada com o buraco seguinte aceso, motivo "ok" barrado pelo contrato, aceita mas diferente do gabarito (recusar), refeita e igual (abrir chamado) | Erick, 26/10/2026 |
| 2 | `e550425` | `testes/decisao-fixa.test.mjs` (4): filas de 8, 2, 5 e 5 saídas do `referencia.jsonl`; notas 40%, 10%, 25% e 25% iguais às saídas gravadas; saída que não bate não monta; o R12 é recusar. `npm test` 153/153; ritmo do 1.7: 36 → DecisaoFixa → 213 → Exercicio (era 214 antes, pelo Resumo); capturas a 1280 e 390 px: antes de escolher, no passar e no responder com o balão do R12; modo direto no responder | Erick, 26/10/2026 |
| 3 | `cab020f` | `testes/quem-decide.test.mjs` (4): os pontos têm os nomes da Aposta, o modelo decide 0, 1, 2 e 3 vezes, os dados do pedido saem do `pedidos.json` (trocar a previsão na loja muda a figura), ponto renomeado, pedido inexistente ou dado inventado não montam. `npm test` 157/157; ritmo do 1.1: 179 → 136 palavras antes da Aposta; capturas a 1280 e 390 px no fluxo fixo, no agente (clique no nome) e em vários agentes (seta do teclado no controle) | Erick, 26/10/2026 |
| 4 | `d20bc16` | `testes/dia-seguinte.test.mjs` (4): a tarde é de responder, o dia seguinte é o da Aposta, a nota 5 de 8 sai da conta, caso inexistente, tarde com outra decisão ou ordem trocada não montam, os balões cobrem a animação. `npm test` 161/161 numa cópia limpa (HEAD mais esta etapa), porque o experimento temperatura-zero da outra sessão, ainda sem commit, quebra a montagem na pasta de trabalho; ritmo do 1.2: 195 → PrimeiroDia; capturas rolando com a página a 1280 e 390 px, da tarde à nota | aguardando revisão |

(redação: Claude Opus 5.5)
