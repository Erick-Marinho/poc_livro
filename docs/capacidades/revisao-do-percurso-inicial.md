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

As etapas 1, 3 e 4 estão concluídas com o ok do Erick. A preparação do kit de leitura também tem seu ok. A etapa
atual, 5, reduz abstrações e ambiguidades antes da primeira entrega. As etapas 5 a 7 seguem sem esperar observação.
Depois delas, Victor revisa e lê o percurso com o kit preparado; essa é a única leitura do plano. Cada etapa de
produto tem um commit em português e evidência no registro; só o ok do responsável fecha a etapa.

| Etapa | Ajuste | Resultado esperado para revisão |
|---|---|---|
| 1 | Precisão sobre execução e resultados | A introdução descreve a experiência que a página oferece; a leitura dos resultados distingue decisão medida, risco possível e comportamento observado. |
| 2 | Preparação da leitura final | Protocolo, ficha, caso novo, hipóteses, sinal e folha de campo preparados para uso local. Nenhuma leitura acontece nesta etapa. |
| 3 | Continuidade e conclusão dos exercícios | Quem faz o exercício do capítulo 1 consegue começar o 2 com a referência correta; o critério de conclusão verifica o que a atividade pediu. |
| 4 | Preparação, recuperação e percurso sem chave | O leitor sabe preparar o ambiente, usar os pontos de volta, encontrar o modo direto e concluir uma atividade sem chamada paga. |
| 5 | Menos abstração antes da primeira entrega | A introdução e a parte conceitual do capítulo 1 apresentam os conceitos quando um caso da loja pede por eles; as perguntas evitam classificações ambíguas. |
| 6 | Menos condução mecânica na IDE do capítulo 1 | Menos passagens para confirmar ou continuar, preservando as previsões, os erros e as decisões; entregas intermediárias deixam claro onde parar e retomar. |
| 7 | Aplicar ao capítulo 2 o que funcionou no 1 | A condução do capítulo 2 aproveita a revisão da etapa 6 e pede uma decisão que demonstre compreensão do grafo e dos testes. |
| 8 | Revisão e leitura final | Depois das etapas 5 a 7, Victor, coautor, revisa e lê o percurso com o kit de `docs/leituras/`; a ficha marca a origem como autor. Esta é a única leitura do plano. |

**Em paralelo, fora da fila:**

- **Voz dos autores.** Só os autores escrevem as próprias experiências e opiniões; o modelo não executa esta parte, e
  ela não trava as etapas. Os lugares reservados ficam como `Pendente` até o texto deles chegar.
- **Defeitos de aparelho.** O que a leitura apontar como quebrado é corrigido como defeito, à parte, assim que
  reproduzido. Não espera a etapa da vez.

**Quem executa.** A IDE do capítulo é da outra sessão de trabalho (`docs/capacidades/passo-a-passo.md`). As etapas 6
e 7 mexem nela: antes de detalhá-las, combinar com o responsável quem as faz.

## Etapa atual: 5 — menos abstração antes da primeira entrega

### Pergunta que esta etapa responde

Quem chega sem o vocabulário do livro encontra primeiro os casos da loja e, quando precisa classificar algo, tem uma
resposta claramente melhor segundo as definições já apresentadas?

### Escopo

Somente a introdução e o capítulo 1, das seções 1.1 a 1.5. Corrigir conceitos usados antes do caso que lhes dá
sentido, classificações com duas respostas defensáveis e o trecho de 1.4 que passa de 200 palavras antes da primeira
ação. Não alterar a partir de 1.6, a IDE, outros componentes nem os desenhos da figura 1.1 e do mapa.

**Decisões anteriores que esta etapa preserva:**

- A aposta das fases continua antes do mapa (`ajustes-da-introducao.md`). Por decisão do Erick em 26/10/2026, cada
  fase nas opções recebe uma glosa curta, derivada de `figuras/ciclo.json`, que explica sua função sem marcar a
  resposta. A mesma fase usa a mesma glosa em todas as perguntas.
- A figura 1.1 continua nas três histórias de atendentes, sem figura em texto, componente novo ou mudança visual
  (`laco-do-agente.md`). Os casos vêm antes dos nomes da escala.
- A política da loja abre 1.4; a palavra contrato, Meyer, a troca de prompt e a definição permanecem
  (`capitulo-1-revisado.md`).
- As quatro camadas — comportamento, formato, ferramenta e execução — permanecem (`contrato-em-camadas.md`).
  As citações da Anthropic e de Nicole Koenigstein também ficam.

1. Nos dois pare e pense da introdução, substituir “régua” e “R12” pelo caso de um cliente pedindo o pedido de outra
   pessoa, sem antecipar os nomes que só chegam no capítulo 1. Fazer o mesmo nas respostas da aposta quando o caso
   resolve o jargão.
2. Em `onde-se-pega.json`, distinguir “Quando dá errado” de “Evoluir” e “Avaliar” de “Evoluir” pelas perguntas e
   ganhos de `ciclo.json`. Auditar também escala, camadas, Pilhas e Classificador contra o contrato e a política;
   mudar apenas classificações realmente concorrentes.
3. Mover o parágrafo da escala em 1.1 para depois da figura e imediatamente antes da aposta. Os nomes passam a
   resumir os atendentes que o leitor viu, sem mudar a figura nem suas fontes.
4. Enxugar o começo de 1.4 até sair do aviso de 200 palavras, preservando política, Meyer, troca de prompt,
   definição e camadas.
5. Enxugar os trechos ampliados nas etapas 1 e 4: até 319 palavras no primeiro aviso da introdução e até 210 em
   “Como ler”, preservando a distinção entre código reexecutado, modelo repetido da gravação e chamada real paga.

### Peças e fontes

| Peça | Papel nesta etapa |
|---|---|
| `capitulos/00-introducao.mdx` | Pare e pense concretos, sem depender do vocabulário do capítulo 1. |
| `figuras/onde-se-pega.json` e `figuras/ciclo.json` | Classificações das fases e as definições que justificam cada distinção. |
| `src/components/livro/Aposta.astro` e `testes/introducao.test.mjs` | Glosa opcional somente onde os dados a fornecem, sem mudar as outras apostas. |
| `capitulos/01-o-problema-e-o-contrato.mdx`, 1.1–1.5 | Escala depois do caso, 1.4 mais curto e Classificador sem caso ambíguo. |
| `figuras/escala.json` e `figuras/camadas.json` | Sistemas e camadas com uma opção claramente melhor. |
| `projeto/referencia.jsonl`, `projeto/contrato.py` e `projeto/dados/politica.md` | Fonte das Pilhas, do Classificador e das decisões da loja. |
| Os quatro planos citados acima | Decisões do Erick que limitam a revisão de texto e dados. |

Caminhos sem prefixo são relativos a `livros/ciclo-de-vida/`.

### Critérios de revisão

- Os dois pare e pense da introdução fazem sentido sem “régua” nem id de caso; Bruno, Ana e o pedido sustentam a
  diferença entre definir antes, medir depois e dar peso aos erros.
- As respostas da aposta das fases citam as duas fases que concorriam e as distinguem com `ciclo.json`; a opção
  marcada continua pertencendo ao capítulo citado.
- Cada fase usada nas opções tem uma glosa de até oito palavras, idêntica em todas as ocorrências; as apostas sem
  glosas conservam sua apresentação.
- Escala, camadas, Pilhas e Classificador concordam com o contrato e a política. Caso com duas decisões defensáveis
  sai da classificação de resposta única ou é tornado inequívoco sem mudar o contrato.
- Em 1.1, o leitor vê os atendentes antes de receber os quatro nomes da escala; as citações permanecem.
- O primeiro trecho de 1.4 fica em até 200 palavras no relógio, sem retirar nenhuma peça decidida.
- O primeiro aviso da introdução fica em até 319 palavras e “Como ler”, em até 210, sem perder a precisão sobre
  execução, gravação e chamadas pagas.
- O número de avisos não aumenta, e nenhuma mudança alcança 1.6, IDE, outros componentes, desenhos ou projeto.

### Evidência e verificação

- Comparar `npm run ritmo` com 3 avisos na introdução, 2 no capítulo 1 e 0 no capítulo 2; 1.4 precisa sair do aviso.
- Executar `npm test`, incluindo apostas, formato e vocabulário. Não regravar nem chamar modelo.
- Conferir na página montada a aposta e os dois pare e pense da introdução, a ordem da figura e da escala em 1.1 e
  o começo de 1.4. Conferir as glosas em largura de computador e de celular.
- Relatar antes/depois, justificativa das classificações e propostas não aplicadas por decisão anterior. Aguardar o
  ok do Erick para fechar a etapa.

### Limite da etapa

Somente introdução e 1.1–1.5, com a menor extensão opcional em `Aposta.astro` para mostrar as glosas. Sem mudança
em 1.6 ou depois, capítulo 2, IDE, outros componentes, desenhos, projeto, gravações ou etapas 6 a 8. Sem chamada
paga, push, túnel ou opinião inventada dos autores. Os `Pendente` ficam.

## Questões para detalhar nas próximas etapas

- **Etapa 2 (preparação aprovada):** o kit em `docs/leituras/` continua como está. Não haverá sessão entre as
  etapas; a leitura real foi transferida para o fim do plano e não bloqueia as etapas 5 a 7.
- **Etapa 3 (aprovada):** por decisão do Erick, os cinco casos vão para `meus-casos.jsonl`. A referência
  oficial permanece em 20; a medida opcional somada tem 25 casos e nota de partida 6/25 (24%).
- **Etapa 4 (aprovada):** clone, tags, PontoDeVolta, Modo direto e `variar` sustentam a recuperação e o exercício
  sem chave. O endereço foi decidido; a publicação continua fora deste plano.
- **Etapa 5 (detalhada acima):** casos antes dos nomes, glosas das fases antes do mapa, classificações sem duas
  respostas defensáveis e trechos longos abaixo das metas, sem mudar os desenhos.
- **Etapas 6 e 7:** contar passagens mecânicas e decisões dentro da IDE. Os roteiros atuais têm 40 ações em 18
  passos no capítulo 1 e 16 ações em 10 passos no capítulo 2; quantidade menor, sozinha, não comprova melhoria.
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
| 5 | `3ccfdf5` | [Antes/depois, fontes, auditoria e proposta não aplicada](../relatorios/revisao-do-percurso-inicial-etapa-5.md): casos antes dos nomes, fases e classificações desambiguadas, 1.4 com 145 palavras até a ação; ritmo 3/1/0; npm test com 30 + 16 saídas, 115 testes do livro e 5 da gravação; trechos montados conferidos, sem chamada paga. | aguardando revisão |
| 5 (correção) | `877fbdb` | [Antes/depois somente dos trechos corrigidos](../relatorios/revisao-do-percurso-inicial-etapa-5-correcao.md): glosas opcionais antes do mapa, nomes retirados da introdução, porquê do contrato e texto enxugado; ritmo 366→294, 246→246, 323→209 e 214→214; npm test com 30 + 16 saídas, 116 testes do livro e 5 da gravação; página conferida no computador e a 360 px, sem chamada paga. | aguardando revisão |

(redação: GPT-6; revisão do plano inicial: Claude Opus 5.5)
