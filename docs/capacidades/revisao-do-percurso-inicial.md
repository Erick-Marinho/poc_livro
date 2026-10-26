# Revisão do percurso inicial do livro

**Problema.** A introdução e os capítulos 1 e 2 já sustentam uma história com projeto, contrato e medição reais.
Um defeito está conferido no texto: ele apresenta como comprovadas consequências que a régua não mede, e descreve a
execução na página como se toda chamada ao modelo fosse refeita. O resto é hipótese da revisão, ainda sem leitor
observado: o percurso pode cansar na condução da IDE e perder continuidade depois de um exercício. O objetivo dos
ajustes é ajudar o leitor a continuar e a tomar decisões sozinho, preservando o argumento de cada capítulo.

**Origem.** Review solicitado por Erick em 25/10/2026. Este documento organiza propostas para implementação;
as aprovações registradas são somente as comunicadas pelo responsável. Revisado no mesmo dia, a pedido do
Erick: a leitura observada vem logo depois da etapa 1, antes dos ajustes que dependem das hipóteses. Etapa 1 aprovada
pelo Erick em 25/10/2026; a preparação da etapa 2 também tem seu ok. A leitura continua aberta, aguardando o
critério e os leitores. No mesmo dia, Erick autorizou a etapa 3 pelo defeito conferido na continuidade dos casos.

## O que preservar

- A mesma loja, os mesmos personagens e os casos que reaparecem.
- O contrato e a régua antes do agente.
- O resultado real de 30% e a necessidade de ferramentas que ele revela.
- As diferenças entre formato válido, caminho correto e decisão correta.
- Prever, modificar e investigar erros do projeto real.
- O modo direto, os pontos de volta e a retomada já existentes.

## Etapas

A etapa 1 está concluída. A preparação da etapa 2 tem o ok do Erick; a leitura continua pendente. A etapa atual,
3, foi autorizada pelo Erick para corrigir a continuidade dos exercícios, um problema conferido no projeto. As
etapas 4 a 7 continuam dependendo da evidência e da revisão da leitura. Cada etapa de produto terá
um commit em português e evidência real no registro; o ok do responsável fecha a etapa. As pendências dos outros planos continuam nos próprios planos.

A etapa 1 veio primeiro porque corrigia o livro afirmando o que não mediu. A leitura da etapa 2 orienta as
hipóteses restantes; o defeito da etapa 3 já foi conferido e sua correção foi autorizada pelo Erick. Para as demais, a leitura observada diz quais delas valem o trabalho, e em que ordem. Uma etapa que a
leitura não confirmar sai do plano ou fica registrada como descartada.

| Etapa | Ajuste | Resultado esperado para revisão |
|---|---|---|
| 1 | Precisão sobre execução e resultados | A introdução descreve a experiência que a página oferece; a leitura dos resultados distingue decisão medida, risco possível e comportamento observado. |
| 2 | Leitura observada do percurso | Protocolo e ficha para o Erick observar a introdução e os capítulos 1 e 2 no aparelho do leitor, só localmente. Registrar cansaço, passagens sem pensar, parada/retomada, conclusão do 1, vontade de ler o 2, caso novo e defeitos de aparelho. Ainda não há leitores de fora; anotações de Erick e Victor usam a mesma ficha com origem autor. Após as leituras, cada hipótese das etapas 3 a 7 sai confirmada, descartada ou sem sinal. |
| 3 | Continuidade e conclusão dos exercícios | Quem faz o exercício do capítulo 1 consegue começar o 2 com a referência correta; o critério de conclusão verifica o que a atividade pediu. |
| 4 | Preparação, recuperação e percurso sem chave | O leitor sabe preparar o ambiente, usar os pontos de volta, encontrar o modo direto e concluir uma atividade sem chamada paga. |
| 5 | Menos abstração antes da primeira entrega | A introdução e a parte conceitual do capítulo 1 apresentam os conceitos quando um caso da loja pede por eles; as perguntas evitam classificações ambíguas. |
| 6 | Menos condução mecânica na IDE do capítulo 1 | Menos passagens para confirmar ou continuar, preservando as previsões, os erros e as decisões; entregas intermediárias deixam claro onde parar e retomar. |
| 7 | Aplicar ao capítulo 2 o que funcionou no 1 | A condução do capítulo 2 aproveita a revisão da etapa 6 e pede uma decisão que demonstre compreensão do grafo e dos testes. |
| 8 | Nova leitura observada | Os mesmos critérios da etapa 2, com leitores que não leram a versão anterior, comparados com o registro dela. |

**Em paralelo, fora da fila:**

- **Voz dos autores.** Só os autores escrevem as próprias experiências e opiniões; o modelo não executa esta parte, e
  ela não trava as etapas. Os lugares reservados ficam como `Pendente` até o texto deles chegar.
- **Defeitos de aparelho.** O que a leitura ou um leitor relatar como quebrado (por exemplo, as animações que não
  funcionaram num iPad, relatadas em 25/10/2026) é corrigido como defeito, à parte, assim que reproduzido. Não espera
  a etapa da vez.

**Quem executa.** A IDE do capítulo é da outra sessão de trabalho (`docs/capacidades/passo-a-passo.md`). As etapas 6
e 7 mexem nela: antes de detalhá-las, combinar com o responsável quem as faz.

## Etapa atual: 3 — continuidade e conclusão dos exercícios

### Pergunta que esta etapa responde

Quem faz as cinco perguntas novas consegue conferir o exercício e chegar ao capítulo 2 com a mesma régua oficial
do livro, sem perder os próprios casos?

### Escopo

Defeito conferido: o exercício do capítulo 1 acrescentava R21 a R25 a `referencia.jsonl`; o leitor passava a medir
25 casos no capítulo 2, que compara 20, inclusive no exercício de remover a regra da instrução.

**Decisão do Erick, 25/10/2026:** os casos do leitor vão para um arquivo à parte, `meus-casos.jsonl`; a referência
oficial continua com as 20 perguntas. O `carregar_referencia` já recebe um caminho e será reaproveitado.

1. Aceitar em `baseline.py` caminhos opcionais para somar os casos de cada arquivo aos oficiais só
   naquela medida. Sem argumento, conservar os 5 de 20 (25%); `medir.py` continua lendo só a referência oficial.
2. Fazer os testes de coerência existentes incluírem `meus-casos.jsonl` se ele existir ao lado da referência,
   inclusive ids, existência do pedido, titularidade e prazo. Não escrever a solução R21–R25 no projeto do livro.
3. Alterar o exercício do capítulo 1: arquivo separado, previsão, testes verdes, comparação da nota com e sem
   argumento e totais por decisão. Acrescentar uma única frase no 2.4 sobre a referência oficial e o arquivo pessoal.
4. Atualizar somente as ações necessárias do roteiro 01, os textos relacionados dos passos e os estados/saídas
   gravados; manter `marcos/cap-01` igual ao fim do roteiro e as tags do repositório do leitor válidas.

A etapa 2 continua aberta. A preparação aprovada está em `docs/leituras/`, incluindo a folha de campo; faltam o
critério de `sinal.md` decidido pelo Erick e os leitores. Esta implementação não realiza a observação.

### Peças e fontes

| Peça | Papel nesta etapa |
|---|---|
| `projeto/baseline.py` e `projeto/test_referencia.py` | Medida opcional somada e mesmas regras aplicadas aos casos pessoais. |
| `projeto/contrato.py`, `projeto/dados/` e `referencia.jsonl` | Leitor de caminho existente, dados fictícios e as 20 perguntas oficiais preservadas. |
| `marcos/cap-01/{baseline.py,test_referencia.py}` | O projeto congelado que o roteiro 01 deve reproduzir. |
| `capitulos/01-o-problema-e-o-contrato.mdx` e `02-o-primeiro-agente.mdx` | Exercício verificável e uma frase de continuidade. |
| `roteiros/01.json`, `passos/01.json`, `roteiros/{01,02}.estados.json` e `saidas.json` | Mudanças mínimas no percurso, com execução e estados reais conferidos. |
| `testes/casos-leitor.test.mjs` | Regressão de execução: nota com/sem casos, integridade da referência e teste de titularidade que falha. |
| `.leitor/atendimento-bemtevi`, gerado por `npm run leitor` | Tags e cópia externa para produzir a evidência do exercício e da passagem ao capítulo 2. |

Os caminhos sem prefixo da tabela são relativos a `livros/ciclo-de-vida/`.

### Critérios de revisão

- Sem arquivo pessoal, notas e testes permanecem os mesmos; o medir gravado continua 6 de 20 (30%).
- Os mesmos testes conferem também os casos pessoais quando o arquivo existe; pedido de outra pessoa marcado
  como responder falha com o id do caso e a mensagem de que o e-mail não é do dono.
- O exercício permite conferir cinco casos pela nota de partida somada e pelos totais: 9 responder, 3 abrir
  chamado, 7 recusar e 6 passar, enquanto os totais oficiais permanecem 8/2/5/5.
- O arquivo pessoal sobrevive à troca para o capítulo 2, cuja medida ignora esses casos e usa os 20 oficiais.
- Roteiro e IDE mantêm o percurso; nenhum componente da IDE nem as etapas 4 a 7 são alterados.

### Evidência e verificação

- Em cópia do repositório do leitor, fora do projeto do livro, criar cinco casos válidos no `cap-01/fim` e executar
  testes, nota sem argumento e nota com argumento: 5 de 20 e 6 de 25. Depois mostrar uma falha de titularidade real.
- Restaurar os casos válidos e, na mesma cópia com o arquivo pessoal presente, seguir até o projeto do capítulo 2
  para executar `medir.py` usando exclusivamente `gravacoes/r02-medir.json`: 6 de 20.
- Executar `npm run saidas`, `npm run leitor`, `npm run ritmo` (antes: 3/2/0 avisos) e `npm test`.
- Conferir na página montada o exercício do 1, a frase do 2 e o passo do baseline na IDE.
- Apresentar antes/depois, mudanças do roteiro e saídas reais no relatório, com marca de redação; registrar o hash
  do commit de produto e deixar aguardando revisão. Só o ok do Erick fecha a etapa.

### Limite da etapa

Só continuidade e conclusão dos exercícios. Sem comando novo de conferência, componentes da IDE, alteração da
referência oficial, casos resolvidos no projeto, chamada paga, push, túnel ou `.env`. A etapa 7 de `imersao-ide.md`
(`uv run conferir`) continua parada. Não alterar as etapas 4 a 7 deste plano nem realizar a leitura pendente da 2.

## Questões para detalhar nas próximas etapas

- **Etapa 2 (preparação aprovada, leitura pendente):** observar o que o leitor faz, onde avança sem pensar, como retoma e como resolve
  um caso novo. Em 25/10/2026, Erick decidiu preparar tudo só localmente; a proposta anterior de endereço fixo público
  fica fora desta preparação. Ainda não há leitores de fora; anotações dos autores usam a mesma ficha com origem
  autor, sem substituir esses leitores. O critério anterior à leitura está em `docs/leituras/sinal.md` como PROPOSTA
  pendente de decisão. Registrar observações e dúvidas, sem concluir redução de abandono por testes ou cliques.
- **Etapa 3 (detalhada acima):** por decisão do Erick, os cinco casos vão para `meus-casos.jsonl`. A referência
  oficial permanece em 20; a medida opcional somada tem 25 casos e nota de partida 6/25 (24%).
- **Etapa 4:** aproveitar os mecanismos existentes. A preparação deve esclarecer a diferença entre criar um
  projeto vazio e recuperar uma tag no clone do repositório do leitor. A alternativa gratuita precisa exercitar
  uma decisão relevante; observar a gravação, sozinho, não cumpre a atividade.
- **Etapa 5:** reduzir ou reposicionar explicações antes de acrescentar componentes. Rever associações de um
  problema a uma única fase quando mais de uma resposta é defensável.
- **Etapas 6 e 7:** contar passagens mecânicas e decisões dentro da IDE. Os roteiros atuais têm 40 ações em 18
  passos no capítulo 1 e 16 ações em 10 passos no capítulo 2; quantidade menor, sozinha, não comprova melhoria.
- **Etapa 8:** comparar com o registro da etapa 2, nos mesmos critérios. Uma etapa que não mudou o que os leitores
  fizeram não é dada como melhoria.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| — | — | Plano proposto em 25/10/2026; implementação ainda não iniciada. | — |
| — | — | Plano revisado em 25/10/2026: leitura observada como etapa 2, voz dos autores e defeitos de aparelho em paralelo, linhas no escopo da etapa 1. | — |
| 1 | `aa3784f` | Precisão sobre execução e resultados; [relatório com antes/depois e fontes](../relatorios/revisao-do-percurso-inicial-etapa-1.md); ritmo 3/2/0 avisos, como antes; npm test: 29 + 16 saídas conferidas, 112 testes do livro e 5 da gravação passaram; texto e IDE conferidos no navegador. | Erick, 25/10/2026 |
| 1 (correção) | `7513682` | Revisão de redação solicitada pelo Erick em 25/10/2026: [antes/depois e fontes somente dos trechos corrigidos](../relatorios/revisao-do-percurso-inicial-etapa-1-correcao.md); ritmo 3/2/0 avisos; npm test: 29 + 16 saídas conferidas, 112 testes do livro e 5 da gravação passaram; HTML e dados da IDE montados conferidos. | Erick, 25/10/2026 |
| 1 (fecho) | `3a4e367` | “Sem dados da loja” restituído no resumo; npm test: 112 testes do livro e 5 da gravação passaram, 29 + 16 saídas conferidas. | Erick, 25/10/2026 |
| 2 (preparação) | `4983c63` | Protocolo, ficha, caso novo, hipóteses e sinal PROPOSTA preparados para uso local; [relatório técnico](../relatorios/revisao-do-percurso-inicial-etapa-2-preparacao.md). Nenhuma sessão realizada; etapa 2 aberta, aguardando o critério do sinal.md e os leitores. | Erick, 25/10/2026 |
| 3 | `872f71e` | [Relatório com antes/depois e saídas reais](../relatorios/revisao-do-percurso-inicial-etapa-3.md): na cópia do leitor, 7 testes verdes, 5/20 sem argumento e 6/25 com os casos; e-mail inválido falha em R21; arquivo pessoal preservado ao chegar ao 2 e medida gravada 6/20; saidas e leitor conferidos; ritmo 3/2/0; npm test: 113 testes do livro e 5 da gravação passaram; trechos e IDE montados conferidos. | Erick, 25/10/2026 |
| 3 (correção) | `5cb28ef` | [Antes/depois só dos trechos corrigidos](../relatorios/revisao-do-percurso-inicial-etapa-3-correcao.md): previsão sem totais prontos, carga dos casos junto da referência, sys.argv e explicação do if na IDE; saidas e leitor conferidos; ritmo 3/2/0; npm test: 113 testes do livro e 5 da gravação passaram, casos-leitor.test.mjs intacto; soma de dois arquivos e página montada conferidas. | Erick, 25/10/2026 |

(redação: GPT-6; revisão do plano inicial: Claude Opus 5.5)
