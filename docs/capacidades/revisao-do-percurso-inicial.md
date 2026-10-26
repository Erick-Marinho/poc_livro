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

As etapas 1, 3, 4, 5 e 6 estão concluídas com o ok do Erick. A preparação do kit de leitura também tem seu ok. A
etapa 6 foi dividida: a 6a contou e propôs; a 6b implementou A e C, aprovadas em 26/10/2026. A etapa 7 segue sem
esperar observação. Depois dela, Victor revisa e lê o percurso com o kit
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

- **6a — contar e propor (concluída):** mediu o percurso, localizou retomadas e comparou três alternativas sem
  mudar o produto.
- **6b — implementar (concluída):** junta as propostas A e C, escolhidas por Erick em 26/10/2026. A proposta B fica
  descartada.

### Pergunta que esta etapa responde

Como juntar os blocos de uma ação e transformar cinco confirmações em leitura da saída real, sem a IDE agir
sozinha nem retirar as decisões do percurso?

### Escopo

Somente a etapa 6b no capítulo 1: um quadro por ação nos dois modos guiados, cinco perguntas sobre saídas gravadas e
quatro avisos de parada. Não muda o modo direto, as saídas, o projeto, o capítulo 2 nem o texto do capítulo 1 fora
da IDE.

**Decisões de Erick em 26/10/2026:**

- As propostas A e C são implementadas juntas; a B não segue.
- Nos dois modos guiados, todos os blocos de uma ação entram juntos, com notas, termos e perguntas; saem as falas
  “E o próximo?”. Isso revoga, somente nesse ponto, o bloco a bloco decidido em `passo-a-passo.md` e
  `imersao-ide.md`: cada ação ainda termina numa fala do leitor, e a IDE não avança sozinha.
- Nos passos 6, 8, 12, 16 e 17, a confirmação depois do comando vira uma pergunta curta que interpreta a saída
  gravada: pergunta o que ela prova, ainda não prova ou por que aconteceu. A resposta do leitor é a passagem; no
  modo direto, a pergunta não aparece. Na revisão de 26/10/2026, Erick recusou perguntas que apenas pediam para ler
  o texto já visível.
- Erick aprovou em 26/10/2026 o texto das cinco perguntas, suas opções, respostas e explicações. As respostas certas
  ficam em posições fixas e variadas, sem repetir a posição em perguntas seguidas.
- Depois dos passos 4, 10, 16 e 18, a IA avisa que aquele é um bom lugar para parar, nomeia a entrega e dá a tag de
  volta, sem interromper quem prefere seguir.
- Permanecem as apostas, o “modificar antes de criar”, as dúvidas, as perguntas de bloco, o teto de cerca de 15
  linhas novas por passo e as diferenças entre “na minha IDE”, “aqui no livro” e modo direto.

1. Montar um quadro por ação nos modos guiados, preservando dentro dele todos os blocos e o bloqueio separado das
   duas perguntas do passo 6.
2. Ligar cada uma das cinco perguntas a uma evidência presente na saída gravada, sem escrever a conclusão correta
   na própria saída ou na nota, e usar a resposta do leitor como passagem para o quadro seguinte.
3. Acrescentar os quatro avisos de parada ao fecho dos passos, sem criar uma nova passagem.
4. Atualizar a contagem reproduzível para a estrutura implementada e conservar os dados do antes para comparação.

### Peças e fontes

| Peça | Papel nesta etapa |
|---|---|
| `livros/ciclo-de-vida/roteiros/01.json` | As cinco perguntas de saída, suas opções, resposta e explicação. |
| `livros/ciclo-de-vida/passos/01.json` | Entrega e tag dos quatro avisos de parada. |
| `livros/ciclo-de-vida/saidas.json` | Evidência que cada pergunta pede para interpretar; não muda. |
| `src/components/livro/ide/IdeCapitulo.tsx` | Quadro por ação, bloqueios, passagem por resposta e aviso de parada. |
| `src/lib/ideCapitulo.ts` | Tipos, validação e montagem dos quadros e das perguntas pendentes. |
| `scripts/contar-passagens-ide-capitulo-1.mjs` | Comparação passo a passo do antes com a implementação. |
| `testes/ide-capitulo.test.mjs` | Estrutura, limite de linhas, bloqueios, ligação às saídas e paradas. |
| `passo-a-passo.md` e `imersao-ide.md` | Registro da revogação pontual da passagem bloco a bloco. |

### Critérios de revisão

- Há 40 quadros de ação nos modos guiados, um por ação; nenhuma fala “E o próximo?” permanece. As duas perguntas de
  bloco do passo 6 continuam exigindo respostas separadas antes da passagem.
- As cinco perguntas bloqueiam somente o guiado; cada uma aponta uma evidência da saída, mas a opção certa não está
  escrita literalmente nela nem na nota. As alternativas exigem decidir o que a prova sustenta, e responder já
  leva ao quadro seguinte. O modo direto não mostra essas perguntas.
- As posições certas não são todas iguais nem se repetem em duas perguntas seguidas; a ordem mora nos dados, sem
  sorteio na página.
- Nenhum quadro acrescenta mais que cerca de 15 linhas novas; apostas, variantes, dúvidas e erros permanecem.
- Os passos 4, 10, 16 e 18 encerram com aviso curto, entrega e a tag decidida, sem impedir a continuação.
- A contagem passa de 79 para cerca de 53 passagens mecânicas nos modos guiados e de 28 para 33 decisões principais;
  o modo direto permanece com 58 passagens mecânicas e 4 decisões principais.
- Saídas e tags do repositório do leitor não mudam; nenhuma peça do capítulo 2 ou do texto fora da IDE é alterada.

### Evidência e verificação

- Executar o script de contagem e guardar no relatório a tabela, com antes e depois por passo.
- Rodar `npm run saidas:conferir`, `npm run leitor` e `npm test`; as saídas gravadas e as tags devem permanecer.
- Testar quadro por ação, perguntas de bloco, perguntas de saída nos dois percursos guiados e sua ausência no modo
  direto, presença da evidência e ausência literal da resposta na saída e na nota, além dos quatro avisos de parada.
- Conferir na página os passos 6, 10 e 16 nos três modos, no computador e numa largura de celular, com captura.

### Limite da etapa

Somente a implementação escolhida no capítulo 1, os testes, o contador, os dois registros de decisão, este plano e
o relatório. Não mudar capítulo 2, texto do capítulo fora da IDE, projeto nem saídas; não chamar modelo, publicar,
abrir túnel ou inventar opinião dos autores.

## Questões para detalhar nas próximas etapas

- **Etapa 2 (preparação aprovada):** o kit em `docs/leituras/` continua como está. Não haverá sessão entre as
  etapas; a leitura real foi transferida para o fim do plano e não bloqueia as etapas 5 a 7.
- **Etapa 3 (aprovada):** por decisão do Erick, os cinco casos vão para `meus-casos.jsonl`. A referência
  oficial permanece em 20; a medida opcional somada tem 25 casos e nota de partida 6/25 (24%).
- **Etapa 4 (aprovada):** clone, tags, PontoDeVolta, Modo direto e `variar` sustentam a recuperação e o exercício
  sem chave. O endereço foi decidido; a publicação continua fora deste plano.
- **Etapa 5 (aprovada):** casos antes dos nomes, glosas das fases antes do mapa, classificações sem duas respostas
  defensáveis e trechos longos abaixo das metas, sem mudar os desenhos.
- **Etapa 6b (detalhada acima):** implementar A e C juntas; B foi descartada. A etapa fecha somente após a revisão
  do Erick sobre o percurso implementado.
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
| 6a | `8f4bf05` | [Contagem reproduzível e três propostas, sem mudança de produto](../relatorios/revisao-do-percurso-inicial-etapa-6a.md): 79 passagens nos modos guiados e 58 no direto; 28 decisões ou investigações principais e 12 opcionais; quatro pontos de parada; script conferido; npm test com 30 + 16 saídas, 116 testes do livro e 5 da gravação. | Erick, 26/10/2026 |
| 6b | `91b4659` | [A e C implementadas, com perguntas, paradas e 18 capturas](../relatorios/revisao-do-percurso-inicial-etapa-6b.md): passagens mecânicas guiadas 79 → 53 e decisões principais 28 → 33; modo direto em 58 e 4; saídas e leitor conferidos; npm test com 30 + 16 saídas, 120 testes do livro e 5 da gravação. | Erick, 26/10/2026 |
| 6b (correção) | `100525d` | [As cinco perguntas passaram de leitura literal a interpretação da prova](../relatorios/revisao-do-percurso-inicial-etapa-6b-correcao.md): 5 de 5 com evidência na saída e conclusão ausente da saída e da nota; contagem mantida em 79 → 53 passagens e 28 → 33 decisões; 30 saídas conferidas; npm test com 30 + 16 saídas, 120 testes do livro e 5 da gravação; quadro dos cinco blocos capturado no computador e a 360 px. | Erick, 26/10/2026 |
| 6b (ajuste final) | `7ab3a62` | Respostas certas nas posições fixas 1, 0, 2, 1 e 0, sem repetição consecutiva; teste impede posições todas iguais, repetição seguida e sorteio; 30 saídas conferidas; npm test com 30 + 16 saídas, 120 testes do livro e 5 da gravação. | Erick, 26/10/2026 |

(redação: GPT-6; revisão do plano inicial: Claude Opus 5.5)
