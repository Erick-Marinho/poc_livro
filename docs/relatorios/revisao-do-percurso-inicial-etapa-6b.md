# Para o Erick — etapa 6b, propostas A e C implementadas

26/10/2026. Implementação concluída, **aguardando revisão do Erick**.

(redação: GPT-5)

## O que mudou

As propostas A e C da etapa 6a foram aplicadas juntas; a B foi descartada. Nos modos **Na minha IDE** e **Aqui no
livro**, as 40 ações agora ocupam 40 quadros: todos os blocos de uma ação entram juntos, com suas notas, termos e
perguntas. Saíram as 21 passagens “E o próximo?”. Cada ação ainda termina numa fala do leitor, e as duas perguntas
de bloco do passo 6 continuam pedindo respostas separadas.

Cinco confirmações depois de comandos viraram perguntas sobre a saída real. A resposta do leitor já é a passagem
para o quadro seguinte: não há um `FIZ` ou `SEGUE` adicional. No modo direto, continuam 40 quadros de ação e nenhuma
dessas perguntas aparece.

A mudança revoga somente a passagem bloco a bloco registrada nas decisões de
[`passo-a-passo.md`](../capacidades/passo-a-passo.md) e
[`imersao-ide.md`](../capacidades/imersao-ide.md). Os dois registros trazem a data, o motivo e o que permanece: as
perguntas seguram a saída, a IDE não avança sozinha e o leitor encerra cada ação com a própria fala.

## Contagem antes e depois

O resultado abaixo é produzido por `node scripts/contar-passagens-ide-capitulo-1.mjs`, que lê roteiro, passos,
saídas e a lógica da IDE. “Depois” é igual nos dois modos guiados. Uma pergunta de saída deixa de ser passagem
mecânica e passa a ser decisão principal.

| Passo | Ações | Blocos extras | Perguntas de saída | Mecânicas antes | Mecânicas depois | Decisões antes | Decisões depois |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 4 | 0 | 0 | 5 | 5 | 1 | 1 |
| 2 | 1 | 0 | 0 | 2 | 2 | 1 | 1 |
| 3 | 1 | 0 | 0 | 2 | 2 | 1 | 1 |
| 4 | 1 | 0 | 0 | 2 | 2 | 0 | 0 |
| 5 | 2 | 3 | 0 | 6 | 3 | 3 | 3 |
| 6 | 3 | 4 | 1 | 8 | 3 | 4 | 5 |
| 7 | 3 | 2 | 0 | 6 | 4 | 0 | 0 |
| 8 | 2 | 0 | 1 | 3 | 2 | 1 | 2 |
| 9 | 2 | 0 | 0 | 3 | 3 | 2 | 2 |
| 10 | 3 | 2 | 0 | 6 | 4 | 3 | 3 |
| 11 | 3 | 0 | 0 | 4 | 4 | 2 | 2 |
| 12 | 4 | 0 | 1 | 5 | 4 | 1 | 2 |
| 13 | 1 | 2 | 0 | 4 | 2 | 0 | 0 |
| 14 | 2 | 3 | 0 | 6 | 3 | 2 | 2 |
| 15 | 2 | 2 | 0 | 5 | 3 | 3 | 3 |
| 16 | 2 | 0 | 1 | 3 | 2 | 1 | 2 |
| 17 | 2 | 1 | 1 | 4 | 2 | 1 | 2 |
| 18 | 2 | 2 | 0 | 5 | 3 | 2 | 2 |
| **Total** | **40** | **21** | **5** | **79** | **53** | **28** | **33** |

As 53 mecânicas são 18 pedidos mais 35 confirmações de ação. As 33 decisões principais são 7 apostas, 2 perguntas
de bloco, 5 perguntas de saída, 15 comandos e 4 erros investigados; há ainda 12 escolhas opcionais. O modo direto
permaneceu com 58 passagens mecânicas, 4 investigações principais e 11 opcionais. O maior quadro de código tem 16
linhas novas, dentro do limite de cerca de 15 já adotado pelo roteiro.

## As cinco perguntas e a prova gravada

As perguntas e explicações abaixo são **redação do modelo, não opinião dos autores**. (redação: GPT-5)

| Passo e ação | Pergunta para revisão | Resposta certa | Trecho de `saidas.json` que a sustenta |
|---|---|---|---|
| 6 — `r01-caso-id-torto` | “Qual campo a saída aponta como inválido?” | `id` | A saída traz uma linha isolada `id`, seguida de `String should match pattern '^R\d{2}$'`. |
| 8 — `r01-tres-casos` | “Quantas perguntas entraram nesta primeira referência?” | `3 perguntas de referência` | `3 perguntas de referência` |
| 12 — `r01-seis-pedidos` | “Quantos pedidos o código encontrou nos dados da loja?” | `6 pedidos na loja` | `6 pedidos na loja` |
| 16 — `r01-testes-passam` | “O que a última linha confirma depois da correção?” | `7 passed` | `7 passed in 0.28s` |
| 17 — `r01-sempre-passar` | “Que decisão o decisor devolveu para esta pergunta?” | `passar` | `passar` |

`perguntaSustentada` e o teste novo recusam a montagem se a opção marcada como certa não aparecer na saída gravada
do próprio comando. O teste também prova que cada pergunta bloqueia o guiado até a resposta e desaparece no direto.
As duas perguntas de bloco do passo 6 continuam pendentes e são liberadas uma por uma.

## Paradas naturais

Os quatro avisos entram na última fala da IA do passo, junto de “Agora você tem”. Não criam quadro, resposta nem
bloqueio. (redação: GPT-5)

| Depois do passo | Entrega dita pela IA | Tag de volta |
|---:|---|---|
| 4 | o projeto, as dependências e os dados da loja | `cap-01/passo-04` |
| 10 | o contrato que barra casos mal escritos | `cap-01/passo-10` |
| 16 | as vinte perguntas conferidas contra os dados da loja | `cap-01/passo-16` |
| 18 | a régua e a nota de partida | `cap-01/fim` |

## Página montada e capturas

Os passos 6, 10 e 16 foram percorridos até o fecho em cada modo. A conferência foi feita a 1120 px e a 360 px; no
celular, a página foi aberta num iframe de 360 px, como orienta o `AGENTS.md`. As capturas registram o estado final
de cada percurso, depois de passar por todas as ações e perguntas do passo.

| Modo | Passo 6 | Passo 10 | Passo 16 |
|---|---|---|---|
| Na minha IDE — computador | [captura](capturas/revisao-do-percurso-inicial-etapa-6b/ide-passo-06-computador.png) | [captura](capturas/revisao-do-percurso-inicial-etapa-6b/ide-passo-10-computador.png) | [captura](capturas/revisao-do-percurso-inicial-etapa-6b/ide-passo-16-computador.png) |
| Na minha IDE — celular | [captura](capturas/revisao-do-percurso-inicial-etapa-6b/ide-passo-06-celular-360.png) | [captura](capturas/revisao-do-percurso-inicial-etapa-6b/ide-passo-10-celular-360.png) | [captura](capturas/revisao-do-percurso-inicial-etapa-6b/ide-passo-16-celular-360.png) |
| Aqui no livro — computador | [captura](capturas/revisao-do-percurso-inicial-etapa-6b/livro-passo-06-computador.png) | [captura](capturas/revisao-do-percurso-inicial-etapa-6b/livro-passo-10-computador.png) | [captura](capturas/revisao-do-percurso-inicial-etapa-6b/livro-passo-16-computador.png) |
| Aqui no livro — celular | [captura](capturas/revisao-do-percurso-inicial-etapa-6b/livro-passo-06-celular-360.png) | [captura](capturas/revisao-do-percurso-inicial-etapa-6b/livro-passo-10-celular-360.png) | [captura](capturas/revisao-do-percurso-inicial-etapa-6b/livro-passo-16-celular-360.png) |
| Direto — computador | [captura](capturas/revisao-do-percurso-inicial-etapa-6b/direto-passo-06-computador.png) | [captura](capturas/revisao-do-percurso-inicial-etapa-6b/direto-passo-10-computador.png) | [captura](capturas/revisao-do-percurso-inicial-etapa-6b/direto-passo-16-computador.png) |
| Direto — celular | [captura](capturas/revisao-do-percurso-inicial-etapa-6b/direto-passo-06-celular-360.png) | [captura](capturas/revisao-do-percurso-inicial-etapa-6b/direto-passo-10-celular-360.png) | [captura](capturas/revisao-do-percurso-inicial-etapa-6b/direto-passo-16-celular-360.png) |

Na inspeção, os blocos ficaram juntos sem “E o próximo?”; as perguntas de saída seguraram os dois modos guiados; o
modo direto não as mostrou; e os avisos dos passos 10 e 16 apareceram sem retirar a fala que leva ao passo seguinte.
Não houve corte horizontal da janela a 360 px.

## Verificação executada

```text
$ node scripts/contar-passagens-ide-capitulo-1.mjs
| **Total** | **40** | **21** | **5** | **79** | **18 + 35 = 53** | **18 + 35 = 53** | **58** | **33** | **12** |
Caminho principal: 33 (apostas: 7, perguntasDeBloco: 2, perguntasDeSaida: 5, comandos: 15, erros: 4).
Antes/depois: 79 → 53 passagens mecânicas nos modos guiados; 28 → 33 decisões principais. O modo direto permanece em 58 passagens.

$ npm run saidas:conferir
conferidas 30 saídas: iguais às do livro

$ npm run leitor
conferidas 30 saídas: iguais às do livro

$ npm test
30 saídas do livro e 16 dos experimentos conferidas
120 testes do livro passaram
5 testes da gravação passaram
```

Nenhuma saída, tag ou arquivo do capítulo 2 mudou. Não houve chamada paga, publicação, túnel nem uso de chave.
