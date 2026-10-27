# A torre do 1.1 como marcador do capítulo 2

**Problema.** O capítulo 1 define agente como um modelo que decide num ciclo, e diz que, no capítulo 2, o agente do
livro "é um roteador". O capítulo 2 se chama "O primeiro agente" e não diz isso em lugar nenhum: o parágrafo da escala
saiu do 2.1 por ser abstrato demais para o começo (grafos-no-capitulo-2.md). A revisão de narrativa (27/10/2026) apontou
a contradição como o problema mais grave, e sugeriu usar a torre do 1.1 como um segundo marcador de progresso, ao lado
da nota.

## Decisões

- (27/10/2026, Erick) "Vamos seguir o plano": depois dos acertos pequenos (a), a torre como marcador (b).
- (1) Um desenho, e não um parágrafo: a mesma torre do 1.1, pequena e parada, com o andar do agente aceso. No fim do
  2.1, "o agente deste capítulo está aqui", no andar do roteador. No fim do 2.6, o mesmo andar, e o de cima marcado
  para o capítulo 3. A legenda diz o que a torre mostra em uma ou duas frases.
- (1) Os andares são os da torre do 1.1: os nomes vêm da Aposta da escala (`escala.json`) e o resumo de cada um, do
  `quem-decide.json`. O teste confere que o andar aceso é o roteador, e o próximo, o agente.
- (1) Não conta como ação no ritmo: o leitor vê onde está, não decide nada. O título do capítulo fica como está.

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | A torre pequena no fim do 2.1 (aqui) e no fim do 2.6 (aqui, e o próximo andar) | vê em que andar o agente está e para onde sobe |

## Etapa atual: 1 — a torre no 2.1 e no 2.6

- Um componente parado (`AndarDaTorre`), sem JS: quatro andares, do topo ao térreo, com o andar de agora aceso e,
  quando houver, o próximo tracejado, com o capítulo em que chega.
- No 2.1, depois do Pare e pense; no 2.6, depois do parágrafo que pergunta se a nota sobe com as ferramentas.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | a69f518 | `testes/andar-da-torre.test.mjs` (2): os andares são os da Aposta, o aceso é o roteador e o próximo, o agente, acima dele; no 2.1 depois do Pare e pense, no 2.6 antes do ponto de volta; a página tem as duas torres e diz "roteador". `npm test` 192/192; ritmo do capítulo 2 sem aviso nas seções. Capturas a 1280 e 390 px das duas torres | aguardando revisão |

(redação: Claude Opus 5.5)
