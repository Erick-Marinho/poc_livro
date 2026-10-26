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

As etapas 1, 3, 4, 5, 6 e 7 estão concluídas com o ok do Erick. A preparação do kit de leitura também tem seu ok. A
etapa 6 foi dividida: a 6a contou e propôs; a 6b implementou A e C, aprovadas em 26/10/2026. A etapa 7 foi executada
sem esperar observação e aprovada na mesma data. A etapa 8 fica aberta para a revisão e a única leitura deste plano,
com Victor. Cada etapa de produto tem um commit em português e evidência no registro; só o ok do responsável fecha
a etapa.

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

**Quem executa.** Erick conduz e observa a etapa 8. Victor, coautor, lê e age; sua ficha tem origem **autor**.

## Etapa atual: 8 — revisão e leitura final

### Pergunta que esta etapa responde

Na versão aprovada depois das etapas 1 a 7, onde Victor cansa, pula, se perde ou diz “ah!”, como para e retoma, e
que achados de autor o Erick precisa registrar antes de decidir o próximo ajuste?

### Escopo

Uma leitura observada do percurso inicial — introdução, capítulo 1, exercício, caso novo e capítulo 2 quando Victor
continuar — em uma ou mais visitas previstas pelo protocolo. Erick conduz; Victor lê em voz alta no aparelho que
usaria e faz o que o livro pede. A observação usa o kit existente em `docs/leituras/`; somente nesta leitura, Victor
acessa o livro pelo túnel iniciado na máquina do Erick.

**Decisões de Erick em 26/10/2026:**

- Erick conduz a sessão; o agente não observa o leitor nem preenche a ficha por inferência.
- Victor é coautor. A ficha usa origem **autor**, e seus achados não confirmam nem descartam a experiência de quem
  não escreveu o livro.
- Esta é a única leitura do plano. Não há leitores de fora nesta etapa.
- O repositório público do leitor foi atualizado pelo planejador, com autorização do Erick: push forçado de `main`
  e das 31 tags. As 32 referências públicas conferem com as geradas por `npm run leitor`.
- Somente para esta leitura, Victor acessa o livro por `npm run tunel`. A decisão muda o “só local” de 25/10/2026;
  a máquina fica ligada, o livro permanece congelado no commit da ficha e nenhum agente trabalha nele durante a
  sessão.
- O restante do kit de `docs/leituras/` continua como está; somente o protocolo recebe o caminho excepcional pelo
  túnel. O estado da proposta de `sinal.md` é registrado pelo Erick antes da leitura; se continuar pendente, ou por
  não haver leitores de fora, o resultado conjunto permanece **sem sinal**.

### Preparação pendente do Erick

- **Decisão aberta:** preencher antes ou depois da leitura os cinco `Pendente` de voz dos autores — capítulo 1,
  linhas 93, 138 e 169; capítulo 2, linhas 75 e 127.
- **Pendente:** data, aparelho, sistema, navegador e preferência “Reduzir movimento” que Victor usará.
- **Pendente:** commit exato do livro que será lido e comando local usado para abrir a introdução.
- **Pendente:** marcar em `sinal.md` se a proposta foi adotada, alterada ou continua pendente. Nenhum limiar para
  leitores de fora será aplicado à ficha de Victor.

1. Antes da visita, copiar `ficha.md` para uma ficha identificada sem nome, com origem **autor**, observador Erick,
   commit, ambiente e estado do sinal. Separar uma `folha-de-campo.md` por visita e deixar somente o cartão do leitor
   de `caso-novo.md` disponível para Victor.
2. Anotar o commit, congelar o trabalho no livro e abrir a introdução para Victor por `npm run tunel`, seguindo o
   protocolo. Victor escolhe aparelho, modo e onde fará o projeto; Erick não escolhe por ele nem antecipa hipóteses.
3. Conduzir visitas de até 60 minutos. Victor lê em voz alta e age; Erick anota horário, seção ou passo e o que ele
   fez ou disse. Em silêncio ou trava, usar somente as perguntas neutras e os tempos definidos no protocolo.
4. No fim do capítulo 1, registrar o que Victor considera concluído e se pede o 2 espontaneamente, antes de Erick
   mencionar o capítulo seguinte. Depois, aplicar o caso novo sem mostrar a resposta esperada; só então deixar
   Victor começar o 2, se quiser. Se o caso não couber, marcar “não aplicado” e levar à retomada.
5. Em cada parada, registrar ponto, intenção seguinte e motivo. Na visita seguinte, manter versão e aparelho quando
   possível e deixar Victor encontrar sozinho o recurso de retomada.
6. Ao encerrar, perguntar “Onde você parou?” e “O que faria a seguir?”. Passar a folha de campo a limpo na mesma
   ficha, separando observação de interpretação, ajuda dada e falha técnica.
7. Depois das visitas, Erick relaciona os eventos a H3–H7b em `hipoteses.md`, sempre como achado de autor, e decide
   o encaminhamento. Defeito de aparelho reproduzível segue separado; ajuste de livro só nasce numa etapa posterior.

### Peças e fontes

| Peça | Papel nesta etapa |
|---|---|
| `docs/leituras/protocolo.md` | Preparação, acesso excepcional pelo túnel, fala inicial, duração, intervenção mínima, retomada e encerramento. |
| `docs/leituras/folha-de-campo.md` | Registro curto, durante cada visita, de horário, lugar e ação ou fala. |
| `docs/leituras/ficha.md` | Contexto técnico, percurso seção a seção, ajuda, parada, caso novo e síntese da sessão. |
| `docs/leituras/caso-novo.md` | Cartão aplicado depois do capítulo 1 e resposta que só Erick consulta após a tentativa. |
| `docs/leituras/hipoteses.md` | Ligação entre eventos observados e H3–H7b, sem promover ficha de autor a leitor externo. |
| `docs/leituras/sinal.md` | Proposta cujo estado Erick registra antes da leitura; não é decisão do agente. |
| `docs/PRINCIPIOS.md` e `docs/RITMO.md` | Leitura em voz alta com Victor e distinção entre agir e apenas avançar. |

### Critérios de revisão

- A ficha identifica Victor como **autor**, Erick como observador, o commit lido, aparelho, sistema, navegador,
  movimento reduzido, modo, lugar do projeto, comando, duração e eventual ajuda.
- A folha de campo registra apenas o que Victor fez ou disse, com horário e lugar; a ficha posterior separa esses
  eventos da interpretação do Erick.
- Erick não explica conceito, aponta controle, dá comando nem corrige resposta durante a tentativa. Se qualquer
  ajuda ocorrer, ela fica registrada e o trecho não conta como feito sem ajuda.
- Paradas, retomadas, cansaço, pulos, perdas de orientação e “ah!” têm seção ou passo e ação ou frase observável;
  silêncio e clique isolado não viram compreensão inferida.
- O caso novo só vem após a tentativa do capítulo 1; decisão, motivo e fonte são recolhidos antes da correção. “Não
  aplicado” não conta como erro.
- A vontade de continuar no capítulo 2 distingue pedido espontâneo, resposta à pergunta neutra e ausência de sinal.
- H3–H7b citam ficha, visita, seção e passo. Como a única ficha é de autor, a síntese não confirma nem descarta o
  percurso de quem não escreveu o livro.
- Falha técnica tem tempo separado e não vira desistência. Defeito de aparelho só gera encaminhamento após ser
  reproduzido; nenhuma correção é feita dentro desta etapa.

### Evidência e verificação

- **Nesta complementação da preparação:** Pendente da introdução, estado deste plano e
  [lista de prontidão](../relatorios/revisao-do-percurso-inicial-etapa-8-preparacao.md); nenhuma ficha preenchida ou
  sessão simulada. A lista registra as verificações locais e a comparação somente de leitura com o repositório
  público.
- **Decisões de 26/10/2026:** consulta somente de leitura confirmou 32 referências públicas iguais às 32 locais;
  o Pendente da introdução saiu, e o protocolo ganhou o acesso de Victor pelo túnel. O túnel não foi aberto nesta
  preparação.
- **Para fechar a etapa depois da leitura:** ficha de autor e folhas de campo das visitas, com commit e contexto;
  tentativa do caso novo ou “não aplicado”; paradas e retomadas que ocorrerem; eventos ligados às hipóteses; estado
  do sinal e encaminhamento registrados pelo Erick.
- A evidência é observação escrita, não áudio, telemetria ou conclusão inventada. Se Victor não alcançar um trecho,
  registrar “não alcançado”; se a situação não permitir avaliar uma hipótese, registrar “sem sinal”.

### Limite da etapa

Nesta parte, somente registrar as duas decisões no plano, retirar o Pendente resolvido da introdução e acrescentar
o caminho do túnel ao protocolo. Não realizar a leitura, preencher ficha ou folha de campo, decidir pelo Erick,
alterar outra parte do kit ou do livro, chamar modelo, fazer push ou abrir túnel. A etapa continua aberta até as
pendências restantes, a leitura e a revisão do encaminhamento pelo Erick.

## Estado das etapas e da leitura

- **Etapa 2 (preparação aprovada):** o kit em `docs/leituras/` foi preservado, com o caminho excepcional do túnel
  acrescentado ao protocolo na etapa 8. Não houve sessão entre as etapas; a leitura real foi transferida para o fim
  do plano e não bloqueou as etapas 5 a 7.
- **Etapa 3 (aprovada):** por decisão do Erick, os cinco casos vão para `meus-casos.jsonl`. A referência
  oficial permanece em 20; a medida opcional somada tem 25 casos e nota de partida 6/25 (24%).
- **Etapa 4 (aprovada):** clone, tags, PontoDeVolta, Modo direto e `variar` sustentam a recuperação e o exercício
  sem chave. Em 26/10/2026, o planejador atualizou `main` e as 31 tags públicas com autorização do Erick; as 32
  referências conferem com as geradas por `npm run leitor`.
- **Etapa 5 (aprovada):** casos antes dos nomes, glosas das fases antes do mapa, classificações sem duas respostas
  defensáveis e trechos longos abaixo das metas, sem mudar os desenhos.
- **Etapa 6b (aprovada):** A e C foram implementadas juntas; B foi descartada. Quadro por ação, cinco perguntas e
  quatro paradas têm o ok do Erick.
- **Etapa 7 (aprovada):** o capítulo 2 recebeu quadro por ação, quatro perguntas interpretativas e três paradas; o
  texto das perguntas tem o ok do Erick.
- **Etapa 8 (detalhada acima):** repositório público e acesso de Victor estão resolvidos. A preparação ainda aguarda
  as pendências listadas; depois delas, Victor revisa e lê pelo túnel, com origem `autor` na ficha.
- **Achados do Victor (26/10/2026):** viram etapas de `achados-da-leitura-do-victor.md`, e não ajustes nesta etapa. O
  primeiro, relatado pelo Erick: o 1.3 está complexo e abstrato para quem começa em engenharia de IA.

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
| 6a | `8f4bf05` | [Contagem reproduzível e três propostas, sem mudança de produto](../relatorios/revisao-do-percurso-inicial-etapa-6a.md): 79 passagens nos modos guiados e 58 no direto; 28 decisões ou investigações principais e 12 opcionais; quatro pontos de parada; script conferido; npm test com 30 + 16 saídas, 116 testes do livro e 5 da gravação. | Erick, 26/10/2026 |
| 6b | `91b4659` | [A e C implementadas, com perguntas, paradas e 18 capturas](../relatorios/revisao-do-percurso-inicial-etapa-6b.md): passagens mecânicas guiadas 79 → 53 e decisões principais 28 → 33; modo direto em 58 e 4; saídas e leitor conferidos; npm test com 30 + 16 saídas, 120 testes do livro e 5 da gravação. | Erick, 26/10/2026 |
| 6b (correção) | `100525d` | [As cinco perguntas passaram de leitura literal a interpretação da prova](../relatorios/revisao-do-percurso-inicial-etapa-6b-correcao.md): 5 de 5 com evidência na saída e conclusão ausente da saída e da nota; contagem mantida em 79 → 53 passagens e 28 → 33 decisões; 30 saídas conferidas; npm test com 30 + 16 saídas, 120 testes do livro e 5 da gravação; quadro dos cinco blocos capturado no computador e a 360 px. | Erick, 26/10/2026 |
| 6b (ajuste final) | `7ab3a62` | Respostas certas nas posições fixas 1, 0, 2, 1 e 0, sem repetição consecutiva; teste impede posições todas iguais, repetição seguida e sorteio; 30 saídas conferidas; npm test com 30 + 16 saídas, 120 testes do livro e 5 da gravação. | Erick, 26/10/2026 |
| 7 | `ed1226f` | [Quadro por ação conferido e quatro perguntas interpretativas, três paradas e 12 capturas](../relatorios/revisao-do-percurso-inicial-etapa-7.md): capítulo 1 mantido em 79 → 53 passagens e 28 → 33 decisões; capítulo 2 em 26 → 22 e 11 → 15; saídas e leitor conferidos; npm test com 30 + 16 saídas, 123 testes do livro e 5 da gravação. | Erick, 26/10/2026 |
| 8 (preparação) | `3e31279` | [Lista de prontidão com evidência real](../relatorios/revisao-do-percurso-inicial-etapa-8-preparacao.md): 31 tags públicas e locais; árvores finais diferentes em `baseline.py` e `test_referencia.py`; introdução local em HTTP 200; saídas e leitor conferidos; npm test com 30 + 16 saídas, 123 testes do livro e 5 da gravação. | aguardando as decisões do Erick |
| 8 (decisões) | `ed58084` | Push autorizado de `main` e 31 tags registrado; 32 referências públicas conferidas contra as locais; Pendente da introdução retirado; acesso de Victor pelo túnel acrescentado ao protocolo; npm test com 30 + 16 saídas, 123 testes do livro e 5 da gravação. | aguardando as pendências restantes |

(redação: GPT-6; complementos da preparação: GPT-5; revisão do plano inicial: Claude Opus 5.5)
