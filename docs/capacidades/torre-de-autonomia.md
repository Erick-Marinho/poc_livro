# A torre de autonomia, no 1.1

**Problema.** A figura "quanto o modelo decide" do 1.1 abria direto num controle deslizante, sem uma visão de conjunto
da escala. O Erick pediu uma introdução, "um gráfico com as escalas em camadas ou uma torre de autonomia", e depois a
execução de cada uma, sem verbosidade e para um público leigo (27/10/2026).

## Decisões

- (27/10/2026, Erick) A torre de autonomia, entre as duas opções mostradas.
- (1) A torre é a própria navegação: primeiro os quatro andares, cada um com uma frase de até seis palavras (o código
  decide tudo; o modelo decide uma vez; o modelo decide a cada passo; vários modelos dividem o trabalho) e uma bolinha
  por decisão do modelo; o leitor toca num andar, e a execução daquele andar aparece ao lado, como antes.
- (1) O resto da figura não muda: os passos, os dados do pedido vindos da loja, os nomes iguais aos da Aposta.

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | A torre no lugar do controle deslizante, a frase curta de cada andar e a abertura reescrita | vê a escala inteira e toca num andar para ver a mensagem passar |

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `e9e311d` | teste novo em `testes/quem-decide.test.mjs`: uma frase de até seis palavras por andar (uma longa não monta), os quatro andares na página com o topo primeiro, a abertura fala da torre. `npm test` 187/187. Ritmo do 1.1: 196 → Aposta. Capturas a 1280 e 390 px: a torre antes de tocar e com o andar "agente"; ajuste: uma classe que colidia com a da figura das histórias | aguardando revisão |

(redação: Claude Opus 5.5)
