# O formato de um capítulo

Tirado do capítulo 1. O `testes/formato.test.mjs` confere o que está marcado com ✓; o build falha se um capítulo sair.

| Parte | O que tem | Regra |
|---|---|---|
| Abertura | número, título, lide (a ideia em uma frase), epígrafe se houver, "neste capítulo" e o ponto de partida | ✓ 3 ou 4 itens no "neste capítulo"; ✓ partida em `cap-NN/inicio` (o 1 parte da pasta vazia, sem tag) |
| N.1 | o conceito do capítulo: a definição numa caixa "a definição deste livro", uma figura interativa e um pare e pense | sem código |
| N.2 em diante | o conceito na Casa Bem-te-vi, com uma figura em que o leitor decide, e os `Pendente` da voz dos autores | sem código; ✓ sem saída de terminal |
| N.x Mão na massa | um parágrafo e a IDE do capítulo | ✓ a penúltima seção; ✓ uma IDE só, e só aqui; ✓ as partes dela são N.xa, N.xb… |
| N.y O que ficou de pé | um pare e pense que liga o que o leitor fez à ideia, as saídas gravadas, o placar e o gancho para o próximo | ✓ a última seção; só saída, sem código novo |
| Fecho | ponto de volta, resumo e exercício que pede para prever antes de rodar | ✓ `PontoDeVolta` em `cap-NN/fim`, `Resumo` (5 ou 6 itens) e `Exercicio`, nesta ordem, e nada depois |

Em todo capítulo:
- ✓ as seções são N.1, N.2… sem buraco; ✓ não há bloco de código no texto: código só aparece na IDE.
- Começa onde o anterior terminou (`cap-NN/fim` do anterior) e mede com a mesma régua.
- O que o modelo responde é gravado uma vez e repetido no build; o terminal diz quando e com que modelo.
