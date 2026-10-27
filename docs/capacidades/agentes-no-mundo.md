# Os agentes no mundo: pesquisas de 2026 na introdução e no 1.1

**Problema.** O primeiro Invista da introdução pede ao leitor que aposte em qual de sete fases cada problema é
capturado, antes de ele ver as fases: é chutar vocabulário, não prever. O Erick propôs contextualizar com um gráfico
ligado aos agentes e à indústria (27/10/2026), com referências: a previsão do Gartner (2025), a matéria do Valor
(2026), o relatório do Banco da Inglaterra e a pesquisa da Salt Security (outubro de 2026).

## Decisões

- (27/10/2026, Erick) "Pode fazer": a introdução troca o Invista das fases por um Invista sobre a pesquisa da Salt
  Security e uma figura com os números; o 1.1 ganha o dado do Banco da Inglaterra; o Gartner entra numa frase, como
  previsão.
- (1) Só entra número conferido na fonte, com data, fonte, link e o tipo de amostra. Conferidos: Salt Security, pela
  reportagem da Campus Technology (49,8%, 12,5%, 17,5%, mais de 380 profissionais); Banco da Inglaterra, no relatório
  (80% implantados, 80% em apoio à decisão, 2% com autonomia ampla; 105 instituições no questionário completo); o
  Gartner, pelas reproduções do comunicado (a página original devolve 403). Ficam de fora, até alguém conferir: os 46%
  e 22% atribuídos ao Banco da Inglaterra (não estão no texto do relatório), os números da McKinsey (sem link) e o
  Valor (só título e subtítulo; os US$ 450 bilhões não dizem de quem é a estimativa).
- (1) Uma peça só para os dois lugares (`NumerosDaPesquisa`): barras com o número, o rótulo e, quando há, a fase do
  livro que trata daquilo; os números e a fonte vêm de um JSON por pesquisa, e o capítulo, do `ciclo.json`.
- (1) O mapa do ciclo continua usando o `onde-se-pega.json` como dado (onde cada problema é capturado); sem a caixa do
  Invista na página, ele mostra a própria pergunta e as respostas.

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | Introdução: o Invista da pesquisa da Salt Security, a figura com os três números e a fase que trata de cada um, e a frase do Gartner; sai o Invista das fases | prevê quantos viram um agente agir de forma inesperada e quantos conseguem rastrear, e vê onde o livro trata de cada problema |
| 2 | 1.1: os números do Banco da Inglaterra, logo depois da escala de quem decide | compara a escala que arrastou com o que as instituições fazem |

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `eeb0452` | `testes/introducao.test.mjs` reescrito: o Invista e a figura usam os mesmos números, a resposta certa é a faixa em que o número cai (e só ela), cada fase leva ao capítulo dela, fonte e amostra na página, o Gartner dito como previsão; sem o Invista das fases. `npm test` 178/178. Ritmo da introdução: 164 → Invista, os mesmos avisos de antes (303 onde eram 308). Capturas a 1280 e 390 px: o Invista em cartões, o retorno e a figura | aguardando revisão |
| 2 | `424bf6e` | `testes/agentes-no-mundo.test.mjs` (2): os números do Banco da Inglaterra vêm depois da escala, com fonte, amostra e o aviso de não somar; os não conferidos (46%, 22%, 450 bilhões, McKinsey) ficaram de fora. `npm test` 180/180. Ritmo do 1.1: 169 → PareEPense. Capturas a 1280 e 390 px | aguardando revisão |

(redação: Claude Opus 5.5)
