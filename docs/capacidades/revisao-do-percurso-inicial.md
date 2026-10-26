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
sem esperar observação e aprovada na mesma data. Depois dela, Victor revisa e lê o percurso com o kit preparado;
essa é a única leitura do plano. Cada etapa de produto tem um commit em português e evidência no
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

## Etapa atual: 7 — aplicar ao capítulo 2 o que funcionou no 1

### Pergunta que esta etapa responde

Como levar ao capítulo 2 a passagem por ação, a interpretação das saídas e os pontos naturais de parada sem
transformar a IDE em explicação passiva nem antecipar a pergunta da seção 2.6?

### Escopo

Somente a IDE do capítulo 2: conferir a montagem já compartilhada, acrescentar de três a cinco perguntas sobre
saídas gravadas, marcar de duas a três paradas, generalizar a contagem e testar o percurso. O texto do capítulo fora
da IDE, o projeto, as saídas, as duas apostas e a variante “sem a regra” não mudam.

**Decisões de Erick em 26/10/2026:**

- Vale no capítulo 2 o quadro por ação dos dois modos guiados, sem “E o próximo?” entre blocos. Cada ação continua
  terminando numa fala do leitor; a IDE não avança sozinha. O modo direto permanece um quadro por ação.
- As perguntas depois de comandos pedem para interpretar a prova: a resposta certa não aparece na saída nem na
  nota; as erradas são plausíveis; o porquê cita a saída e o código; as posições certas variam sem repetição seguida.
  No modo direto, essas perguntas não aparecem.
- As perguntas distinguem o desenho exercitado com o modelo falso da capacidade de o modelo decidir, e a decisão
  medida pela régua da qualidade do texto. A pergunta sobre o que o molde garante continua reservada à seção 2.6,
  por decisão de `contrato-em-camadas.md`.
- Erick aprovou em 26/10/2026 o texto das quatro perguntas de saída, com suas opções, respostas e explicações.
- As paradas dizem que é um bom lugar para parar, nomeiam o que ficou pronto e dão a tag de volta, sem interromper
  quem prefere seguir.

1. Confirmar que a montagem genérica já reúne os blocos de cada uma das 16 ações do capítulo 2 no mesmo quadro.
2. Acrescentar perguntas interpretativas às saídas dos passos 6, 7, 8 e 10, preservando as apostas e a variante.
3. Marcar paradas depois do grafo pronto (passo 5), dos testes sem pagar (passo 8) e da nota do agente (passo 10).
4. Fazer o contador receber `01` ou `02`, conservar a medida aprovada do capítulo 1 e registrar o antes e o depois
   do capítulo 2 por passo.

### Peças e fontes

| Peça | Papel nesta etapa |
|---|---|
| `livros/ciclo-de-vida/roteiros/02.json` | As quatro perguntas, opções, respostas, evidências e explicações. |
| `livros/ciclo-de-vida/passos/02.json` | Entrega e tag das três paradas naturais. |
| `livros/ciclo-de-vida/saidas.json` | Prova gravada citada pelas perguntas; não muda. |
| `livros/ciclo-de-vida/projeto/agente.py`, `test_agente.py` e `medir.py` | Código real que delimita o alcance de cada prova. |
| `scripts/contar-passagens-ide-capitulo-1.mjs` | Contagem reproduzível dos capítulos 1 e 2. |
| `testes/ide-capitulo.test.mjs` | Quadro por ação, bloqueios, ligação das perguntas à prova, posições e paradas. |
| `docs/relatorios/revisao-do-percurso-inicial-etapa-7.md` | Contagem, redação para aprovação, fontes, paradas e capturas. |

### Critérios de revisão

- O capítulo 2 tem 16 quadros de ação nos três modos; nos guiados, os blocos de uma ação aparecem juntos e as duas
  perguntas de bloco continuam segurando a passagem. Não há “E o próximo?”.
- Quatro perguntas bloqueiam somente os modos guiados. A evidência e o código sustentam a resposta, mas a saída e a
  nota não a escrevem; as posições certas são 1, 0, 2 e 1, sem repetição seguida.
- As perguntas não repetem a leitura visível da tela, não afirmam inteligência a partir do modelo falso, não usam a
  régua para julgar o texto e não entregam a pergunta do molde reservada à seção 2.6.
- As duas apostas e a variante `r02-medir-sem-regra` ficam iguais. As saídas gravadas e as tags do repositório do
  leitor não mudam.
- Os passos 5, 8 e 10 encerram com entrega e as tags `cap-02/passo-05`, `cap-02/passo-08` e `cap-02/fim`, sem criar
  passagem nova.
- A contagem do capítulo 1 permanece 79 → 53 passagens mecânicas e 28 → 33 decisões principais. No capítulo 2, o
  quadro por ação já trazia 38 → 26; nesta etapa, as perguntas levam 26 → 22 passagens mecânicas e 11 → 15 decisões.
  O modo direto permanece com 26 passagens.

### Evidência e verificação

- Executar o contador com `01` e `02` e guardar no relatório o antes e o depois de cada passo do capítulo 2.
- Rodar `npm run saidas:conferir`, `npm run leitor` e `npm test`; nenhuma saída nem tag pode mudar.
- Testar as quatro perguntas: evidência na saída e no porquê, conclusão ausente da saída e da nota, posições variadas,
  bloqueio no guiado e ausência no direto; testar também as três paradas e o quadro por ação do capítulo 2.
- Conferir na página o passo 5, que tem uma ação com quatro blocos, e o passo 8, com pergunta nova, nos três modos,
  no computador e numa largura de celular, com captura.

### Limite da etapa

Somente os dados da IDE do capítulo 2, o contador, os testes, este plano, o relatório e as capturas. Não mudar o
texto do capítulo fora da IDE, projeto, saídas ou componentes; não chamar modelo, publicar, abrir túnel nem inventar
opinião dos autores. A redação das quatro perguntas foi aprovada pelo Erick em 26/10/2026.

## Questões para detalhar nas próximas etapas

- **Etapa 2 (preparação aprovada):** o kit em `docs/leituras/` continua como está. Não haverá sessão entre as
  etapas; a leitura real foi transferida para o fim do plano e não bloqueia as etapas 5 a 7.
- **Etapa 3 (aprovada):** por decisão do Erick, os cinco casos vão para `meus-casos.jsonl`. A referência
  oficial permanece em 20; a medida opcional somada tem 25 casos e nota de partida 6/25 (24%).
- **Etapa 4 (aprovada):** clone, tags, PontoDeVolta, Modo direto e `variar` sustentam a recuperação e o exercício
  sem chave. O endereço foi decidido; a publicação continua fora deste plano.
- **Etapa 5 (aprovada):** casos antes dos nomes, glosas das fases antes do mapa, classificações sem duas respostas
  defensáveis e trechos longos abaixo das metas, sem mudar os desenhos.
- **Etapa 6b (aprovada):** A e C foram implementadas juntas; B foi descartada. Quadro por ação, cinco perguntas e
  quatro paradas têm o ok do Erick.
- **Etapa 7 (detalhada acima):** aplicar ao capítulo 2 o quadro por ação, perguntas interpretativas e paradas; o
  roteiro tem 16 ações em 10 passos.
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
| 6a | `8f4bf05` | [Contagem reproduzível e três propostas, sem mudança de produto](../relatorios/revisao-do-percurso-inicial-etapa-6a.md): 79 passagens nos modos guiados e 58 no direto; 28 decisões ou investigações principais e 12 opcionais; quatro pontos de parada; script conferido; npm test com 30 + 16 saídas, 116 testes do livro e 5 da gravação. | Erick, 26/10/2026 |
| 6b | `91b4659` | [A e C implementadas, com perguntas, paradas e 18 capturas](../relatorios/revisao-do-percurso-inicial-etapa-6b.md): passagens mecânicas guiadas 79 → 53 e decisões principais 28 → 33; modo direto em 58 e 4; saídas e leitor conferidos; npm test com 30 + 16 saídas, 120 testes do livro e 5 da gravação. | Erick, 26/10/2026 |
| 6b (correção) | `100525d` | [As cinco perguntas passaram de leitura literal a interpretação da prova](../relatorios/revisao-do-percurso-inicial-etapa-6b-correcao.md): 5 de 5 com evidência na saída e conclusão ausente da saída e da nota; contagem mantida em 79 → 53 passagens e 28 → 33 decisões; 30 saídas conferidas; npm test com 30 + 16 saídas, 120 testes do livro e 5 da gravação; quadro dos cinco blocos capturado no computador e a 360 px. | Erick, 26/10/2026 |
| 6b (ajuste final) | `7ab3a62` | Respostas certas nas posições fixas 1, 0, 2, 1 e 0, sem repetição consecutiva; teste impede posições todas iguais, repetição seguida e sorteio; 30 saídas conferidas; npm test com 30 + 16 saídas, 120 testes do livro e 5 da gravação. | Erick, 26/10/2026 |
| 7 | `ed1226f` | [Quadro por ação conferido e quatro perguntas interpretativas, três paradas e 12 capturas](../relatorios/revisao-do-percurso-inicial-etapa-7.md): capítulo 1 mantido em 79 → 53 passagens e 28 → 33 decisões; capítulo 2 em 26 → 22 e 11 → 15; saídas e leitor conferidos; npm test com 30 + 16 saídas, 123 testes do livro e 5 da gravação. | Erick, 26/10/2026 |

(redação: GPT-6; revisão do plano inicial: Claude Opus 5.5)
