# Revisão do percurso inicial do livro

**Problema.** A introdução e os capítulos 1 e 2 já sustentam uma história com projeto, contrato e medição reais.
Um defeito está conferido no texto: ele apresenta como comprovadas consequências que a régua não mede, e descreve a
execução na página como se toda chamada ao modelo fosse refeita. O resto é hipótese da revisão, ainda sem leitor
observado: o percurso pode cansar na condução da IDE e perder continuidade depois de um exercício. O objetivo dos
ajustes é ajudar o leitor a continuar e a tomar decisões sozinho, preservando o argumento de cada capítulo.

**Origem.** Review solicitado por Erick em 25/10/2026. Este documento organiza propostas para implementação;
as aprovações registradas são somente as comunicadas pelo responsável. Etapa 1 aprovada pelo Erick em 25/10/2026;
a preparação do kit de leitura também tem seu ok. A etapa 3 tem o ok do Erick na mesma data; nesse dia ele autorizou
a etapa 4 para os problemas conferidos de preparação, recuperação e percurso sem chave. Em 26/10/2026, aprovou a
etapa 4 e autorizou a 5. Também decidiu que não haverá leitura com pessoas entre as etapas: as etapas 5 a 7 seguem,
e a única leitura acontece no fim, com o Victor, coautor, registrado como autor na ficha preparada.

## O que preservar

- A mesma loja, os mesmos personagens e os casos que reaparecem.
- O contrato e a régua antes do agente.
- O resultado real de 30% e a necessidade de ferramentas que ele revela.
- As diferenças entre formato válido, caminho correto e decisão correta.
- Prever, modificar e investigar erros do projeto real.
- O modo direto, os pontos de volta e a retomada já existentes.

## Etapas

As etapas 1, 3, 4 e 5 estão concluídas com o ok do Erick. A preparação do kit de leitura também tem seu ok. A etapa
6 foi dividida: a 6a conta o percurso atual e oferece alternativas; a 6b implementa somente a alternativa que Erick
escolher. As etapas 6 e 7 seguem sem esperar observação. Depois delas, Victor revisa e lê o percurso com o kit
preparado; essa é a única leitura do plano. Cada etapa de produto tem um commit em português e evidência no
registro; só o ok do responsável fecha a etapa.

| Etapa | Ajuste | Resultado esperado para revisão |
|---|---|---|
| 1 | Precisão sobre execução e resultados | A introdução descreve a experiência que a página oferece; a leitura dos resultados distingue decisão medida, risco possível e comportamento observado. |
| 2 | Preparação da leitura final | Protocolo, ficha, caso novo, hipóteses, sinal e folha de campo preparados para uso local. Nenhuma leitura acontece nesta etapa. |
| 3 | Continuidade e conclusão dos exercícios | Quem faz o exercício do capítulo 1 consegue começar o 2 com a referência correta; o critério de conclusão verifica o que a atividade pediu. |
| 4 | Preparação, recuperação e percurso sem chave | O leitor sabe preparar o ambiente, usar os pontos de volta, encontrar o modo direto e concluir uma atividade sem chamada paga. |
| 5 | Menos abstração antes da primeira entrega | A introdução e a parte conceitual do capítulo 1 apresentam os conceitos quando um caso da loja pede por eles; as perguntas evitam classificações ambíguas. |
| 6a | Contar e propor menos condução mecânica | A contagem reproduzível separa passagem mecânica de decisão nos três modos e compara propostas sem mudar o produto. |
| 6b | Implementar a proposta escolhida | A alternativa escolhida pelo Erick reduz confirmações ou as transforma em decisões, sem perder previsões, erros, dúvidas, variantes, modo direto e retomada. |
| 7 | Aplicar ao capítulo 2 o que funcionou no 1 | A condução do capítulo 2 aproveita a revisão da etapa 6 e pede uma decisão que demonstre compreensão do grafo e dos testes. |
| 8 | Revisão e leitura final | Depois das etapas 5 a 7, Victor, coautor, revisa e lê o percurso com o kit de `docs/leituras/`; a ficha marca a origem como autor. Esta é a única leitura do plano. |

**Em paralelo, fora da fila:**

- **Voz dos autores.** Só os autores escrevem as próprias experiências e opiniões; o modelo não executa esta parte, e
  ela não trava as etapas. Os lugares reservados ficam como `Pendente` até o texto deles chegar.
- **Defeitos de aparelho.** O que a leitura apontar como quebrado é corrigido como defeito, à parte, assim que
  reproduzido. Não espera a etapa da vez.

**Quem executa.** A IDE do capítulo é da outra sessão de trabalho (`docs/capacidades/passo-a-passo.md`). As etapas 6
e 7 mexem nela: antes de detalhá-las, combinar com o responsável quem as faz.

## Etapa atual: 6 — menos condução mecânica na IDE do capítulo 1

### Divisão

- **6a — contar e propor (atual):** medir o percurso existente, localizar retomadas e comparar alternativas. Não
  muda capítulo, IDE, roteiro nem passos.
- **6b — implementar:** começa apenas depois da escolha do Erick. Seu escopo, critérios e evidência serão
  detalhados a partir da proposta escolhida; nenhuma alternativa está aprovada por este documento.

### Pergunta que esta etapa responde

Quantas vezes o leitor apenas confirma ou pede para seguir nos 18 passos do capítulo 1, quantas vezes decide ou
investiga, e quais passagens podem sair ou ganhar uma pergunta sem a IDE agir sozinha?

### Escopo

Somente a etapa 6a: um script reproduzível de contagem e um relatório com o percurso atual, pontos de parada e duas
a três alternativas para a etapa 6b. A contagem lê `roteiros/01.json`, `passos/01.json`, as saídas reais e a lógica
do `IdeCapitulo.tsx`; não altera nenhuma dessas fontes de produto.

**Decisões anteriores que esta etapa preserva:**

- Toda passagem continua sendo uma fala do leitor no chat; a barra inferior conserva apenas setas, nome do passo e
  perguntas (`conversa-com-a-ia.md`). Uma proposta que queira alterar isso precisa nomear a decisão e justificar.
- A IDE não toca sozinha. No modo guiado atual, cada bloco de código entra quando o leitor passa; apostas impedem a
  saída antes da resposta (`imersao-ide.md` e `ide-e-terminal.md`).
- Cada passo acrescenta no máximo cerca de 15 linhas novas, fora dados copiados. Apostas antes da saída, erros reais,
  “modificar antes de criar”, oito dúvidas abertas, pontos de volta e “Agora você tem” permanecem
  (`passo-a-passo.md`).
- “Na minha IDE” pausa para o leitor repetir a ação; “aqui no livro” pede que ele digite os comandos no terminal;
  o modo direto mostra uma ação por quadro, sem apostas, perguntas de bloco nem digitação, mas conserva dúvidas e
  variantes (`imersao-ide.md`).

1. Contar, passo a passo, pedidos, `FIZ`, `SEGUE` e o atalho `Avançar`, sem contar duas vezes a mesma transição.
2. Contar apostas, perguntas de bloco, variantes, dúvidas abertas, comandos digitados e erros investigados. Separar
   o caminho principal das escolhas opcionais e registrar o que some ou permanece no modo direto.
3. Descrever o que a IDE guarda no navegador, o ponto de volta por tag e o fechamento “Agora você tem”; propor de
   dois a quatro pontos naturais de parada.
4. Comparar de duas a três propostas. Para cada uma, projetar a contagem pelo mesmo script, mostrar o chat antes e
   depois nos passos 6 e 16, dizer o que o leitor faz a mais ou a menos, quais decisões anteriores ela toca e o custo
   de implementação.

### Peças e fontes

| Peça | Papel nesta etapa |
|---|---|
| `livros/ciclo-de-vida/roteiros/01.json` | As 40 ações, blocos, apostas, variantes e dúvidas. |
| `livros/ciclo-de-vida/passos/01.json` | Os 18 agrupamentos, pedidos, entregas e tags de retomada. |
| `livros/ciclo-de-vida/saidas.json` | Quais comandos do caminho principal e das variantes exibem erro real. |
| `src/components/livro/ide/IdeCapitulo.tsx` | Regras de quadros, `FIZ`, `SEGUE`, `Avançar`, modos e memória local. |
| `src/lib/ideCapitulo.ts` | Montagem dos passos, estados e tags de ponto de volta. |
| `scripts/contar-passagens-ide-capitulo-1.mjs` | Contagem atual e projeções das propostas, sem mudar o produto. |
| Os quatro planos citados acima | Decisões do Erick que limitam as alternativas. |

### Critérios de revisão

- O script falha se os passos deixarem de cobrir as ações ou se a lógica que sustenta a contagem mudar; a saída traz
  os 18 passos e separa os três modos.
- `Avançar` é contado como atalho da mesma passagem, não como uma segunda ação. Caminho principal e ofertas opcionais
  aparecem separados; perguntas de bloco e apostas de variante não somem da conta.
- O relatório explica a memória local, as tags e “Agora você tem”, e propõe entre dois e quatro pontos de parada.
- Há de duas a três alternativas, cada uma com contagem projetada, passos 6 e 16 antes/depois, efeito para o leitor,
  decisões anteriores tocadas e arquivos, testes e saídas que uma implementação exigiria.
- Nenhuma alternativa é tratada como melhoria só por reduzir um número, nem como decisão já tomada pelo Erick.
- Nenhum arquivo da IDE, roteiro, passos, capítulo ou saída muda na 6a.

### Evidência e verificação

- Executar `node scripts/contar-passagens-ide-capitulo-1.mjs`; guardar no relatório a tabela produzida e as regras da
  contagem.
- Conferir no Git se `IdeCapitulo.tsx`, `src/lib/ideCapitulo.ts`, `roteiros/` ou `passos/` mudaram desde `f499020` e
  listar qualquer commit encontrado.
- Conferir as projeções do script contra os exemplos dos passos 6 e 16 e registrar a proposta que depende de mudar
  uma decisão anterior.
- Aguardar a escolha do Erick. A evidência da 6b será definida somente com a alternativa escolhida.

### Limite da etapa

Somente plano, script de contagem e relatório. Não mudar IDE, biblioteca que a monta, roteiro, passos, capítulo,
saídas, testes do produto nem projeto. Não detalhar nem começar a 6b; não chamar modelo, regravar, publicar, abrir
túnel ou inventar opinião dos autores.

## Questões para detalhar nas próximas etapas

- **Etapa 2 (preparação aprovada):** o kit em `docs/leituras/` continua como está. Não haverá sessão entre as
  etapas; a leitura real foi transferida para o fim do plano e não bloqueia as etapas 5 a 7.
- **Etapa 3 (aprovada):** por decisão do Erick, os cinco casos vão para `meus-casos.jsonl`. A referência
  oficial permanece em 20; a medida opcional somada tem 25 casos e nota de partida 6/25 (24%).
- **Etapa 4 (aprovada):** clone, tags, PontoDeVolta, Modo direto e `variar` sustentam a recuperação e o exercício
  sem chave. O endereço foi decidido; a publicação continua fora deste plano.
- **Etapa 5 (aprovada):** casos antes dos nomes, glosas das fases antes do mapa, classificações sem duas respostas
  defensáveis e trechos longos abaixo das metas, sem mudar os desenhos.
- **Etapa 6a (detalhada acima):** contar e propor sem mudar o produto. A 6b só será detalhada quando Erick escolher
  uma alternativa. Quantidade menor, sozinha, não comprova melhoria.
- **Etapa 7:** aplicar ao capítulo 2 o que for escolhido e conferido no capítulo 1; o roteiro atual tem 16 ações em
  10 passos.
- **Etapa 8 (leitura final):** depois das etapas 5 a 7, Victor revisa e lê o percurso com o kit já preparado. A ficha
  marca `autor`; não há leitura anterior para comparar nem leitores de fora previstos neste plano.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| — | — | Plano proposto em 25/10/2026; implementação ainda não iniciada. | — |
| — | — | Plano revisado em 25/10/2026: leitura observada como etapa 2, voz dos autores e defeitos de aparelho em paralelo, linhas no escopo da etapa 1. | — |
| 1 | `aa3784f` | Precisão sobre execução e resultados; [relatório com antes/depois e fontes](../relatorios/revisao-do-percurso-inicial-etapa-1.md); ritmo 3/2/0 avisos, como antes; npm test: 29 + 16 saídas conferidas, 112 testes do livro e 5 da gravação passaram; texto e IDE conferidos no navegador. | Erick, 25/10/2026 |
| 1 (correção) | `7513682` | Revisão de redação solicitada pelo Erick em 25/10/2026: [antes/depois e fontes somente dos trechos corrigidos](../relatorios/revisao-do-percurso-inicial-etapa-1-correcao.md); ritmo 3/2/0 avisos; npm test: 29 + 16 saídas conferidas, 112 testes do livro e 5 da gravação passaram; HTML e dados da IDE montados conferidos. | Erick, 25/10/2026 |
| 1 (fecho) | `3a4e367` | “Sem dados da loja” restituído no resumo; npm test: 112 testes do livro e 5 da gravação passaram, 29 + 16 saídas conferidas. | Erick, 25/10/2026 |
| 2 (preparação) | `4983c63` | Protocolo, ficha, caso novo, hipóteses e sinal PROPOSTA preparados para uso local; [relatório técnico](../relatorios/revisao-do-percurso-inicial-etapa-2-preparacao.md). Nenhuma sessão realizada; em 26/10/2026, a única leitura foi transferida para a etapa final, com Victor marcado como autor. | Erick, 25/10/2026 |
| 3 | `872f71e` | [Relatório com antes/depois e saídas reais](../relatorios/revisao-do-percurso-inicial-etapa-3.md): na cópia do leitor, 7 testes verdes, 5/20 sem argumento e 6/25 com os casos; e-mail inválido falha em R21; arquivo pessoal preservado ao chegar ao 2 e medida gravada 6/20; saidas e leitor conferidos; ritmo 3/2/0; npm test: 113 testes do livro e 5 da gravação passaram; trechos e IDE montados conferidos. | Erick, 25/10/2026 |
| 3 (correção) | `5cb28ef` | [Antes/depois só dos trechos corrigidos](../relatorios/revisao-do-percurso-inicial-etapa-3-correcao.md): previsão sem totais prontos, carga dos casos junto da referência, sys.argv e explicação do if na IDE; saidas e leitor conferidos; ritmo 3/2/0; npm test: 113 testes do livro e 5 da gravação passaram, casos-leitor.test.mjs intacto; soma de dois arquivos e página montada conferidas. | Erick, 25/10/2026 |
| 4 | `5b0e223` | [Relatório com antes/depois e evidência real](../relatorios/revisao-do-percurso-inicial-etapa-4.md): clone e tags locais conferidos com preservação e conflitos; uma gravação autorizada, 8/20 na variante contra 6/20 na original; saídas e leitor repetidos sem chamada; ritmo 3/2/0; npm test: 115 testes do livro e 5 da gravação; página montada conferida. | Erick, 26/10/2026 |
| 4 (correção) | `cab74ad` | [Revisão de endereço, pontos de volta, partidas e ordem da leitura](../relatorios/revisao-do-percurso-inicial-etapa-4-correcao.md): ritmo 3/2/0; 30 saídas conferidas; npm test com 115 testes do livro e 5 da gravação; página montada conferida, sem nova chamada paga. | Erick, 26/10/2026 |
| 5 | `3ccfdf5` | [Antes/depois, fontes, auditoria e proposta não aplicada](../relatorios/revisao-do-percurso-inicial-etapa-5.md): casos antes dos nomes, fases e classificações desambiguadas, 1.4 com 145 palavras até a ação; ritmo 3/1/0; npm test com 30 + 16 saídas, 115 testes do livro e 5 da gravação; trechos montados conferidos, sem chamada paga. | Erick, 26/10/2026 |
| 5 (correção) | `877fbdb` | [Antes/depois somente dos trechos corrigidos](../relatorios/revisao-do-percurso-inicial-etapa-5-correcao.md): glosas opcionais antes do mapa, nomes retirados da introdução, porquê do contrato e texto enxugado; ritmo 366→294, 246→246, 323→209 e 214→214; npm test com 30 + 16 saídas, 116 testes do livro e 5 da gravação; página conferida no computador e a 360 px, sem chamada paga. | Erick, 26/10/2026 |
| 5 (segunda correção) | `c814914` | [Antes/depois somente dos três ajustes](../relatorios/revisao-do-percurso-inicial-etapa-5-correcao-2.md): glosas sem palavras das perguntas, duas frases restituídas e dois começos separados; ponto de volta conferido na cópia do leitor; ritmo 76→76, 294→308 e 209→239; npm test com 30 + 16 saídas, 116 testes do livro e 5 da gravação, sem chamada paga. | Erick, 26/10/2026 |
| 5 (ajuste das glosas) | `f499020` | Glosas restauradas de `877fbdb`, exceto Avaliar; Observar sem custo nem gasto. npm test: 30 + 16 saídas conferidas, 116 testes do livro e 5 da gravação passaram. | Erick, 26/10/2026 |

(redação: GPT-6; revisão do plano inicial: Claude Opus 5.5)
