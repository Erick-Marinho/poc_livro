# Revisão do percurso inicial do livro

**Problema.** A introdução e os capítulos 1 e 2 já sustentam uma história com projeto, contrato e medição reais.
Um defeito está conferido no texto: ele apresenta como comprovadas consequências que a régua não mede, e descreve a
execução na página como se toda chamada ao modelo fosse refeita. O resto é hipótese da revisão, ainda sem leitor
observado: o percurso pode cansar na condução da IDE e perder continuidade depois de um exercício. O objetivo dos
ajustes é ajudar o leitor a continuar e a tomar decisões sozinho, preservando o argumento de cada capítulo.

**Origem.** Review solicitado por Erick em 25/10/2026. Este documento organiza propostas para implementação;
não registra aprovação das soluções nem fecha etapas em nome do responsável. Revisado no mesmo dia, a pedido do
Erick: a leitura observada vem logo depois da etapa 1, antes dos ajustes que dependem das hipóteses.

## O que preservar

- A mesma loja, os mesmos personagens e os casos que reaparecem.
- O contrato e a régua antes do agente.
- O resultado real de 30% e a necessidade de ferramentas que ele revela.
- As diferenças entre formato válido, caminho correto e decisão correta.
- Prever, modificar e investigar erros do projeto real.
- O modo direto, os pontos de volta e a retomada já existentes.

## Etapas

As etapas abaixo seguem uma ordem proposta. Só a etapa 1 está detalhada. As seguintes serão detalhadas com a
evidência e a revisão da anterior. Cada etapa de produto terá um commit em português e evidência real no registro;
o ok do responsável fecha a etapa. As pendências dos outros planos continuam nos próprios planos.

A etapa 1 vem primeiro porque corrige o livro afirmando o que não mediu, e isso é regra. A 2 vem antes das outras
porque elas partem de hipóteses: a leitura observada diz quais delas valem o trabalho, e em que ordem. Uma etapa que a
leitura não confirmar sai do plano ou fica registrada como descartada.

| Etapa | Ajuste | Resultado esperado para revisão |
|---|---|---|
| 1 | Precisão sobre execução e resultados | A introdução descreve a experiência que a página oferece; a leitura dos resultados distingue decisão medida, risco possível e comportamento observado. |
| 2 | Leitura observada do percurso | O Victor e mais dois ou três leitores de fora, do público do livro, leem a introdução e os capítulos 1 e 2 no aparelho que usariam (computador, tablet, celular). O registro diz onde cansaram, onde avançaram sem pensar, onde pararam e como retomaram, se terminaram, se pediram o capítulo seguinte e o que não funcionou no aparelho. Cada hipótese das etapas 3 a 7 sai confirmada, descartada ou sem sinal. |
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

## Etapa atual: 1 — precisão sobre execução e resultados

### Pergunta que esta etapa responde

O leitor consegue distinguir o que foi executado e gravado, o que ele executa na própria máquina e o que cada
medição permite concluir?

### Escopo

Revisar os trechos abaixo, com as implementações e as saídas existentes como fonte:

1. **Introdução, “Um livro que executa”** (`00-introducao.mdx`, linhas 39 e 41). Hoje: "o terminal executa quando
   você aperta o botão" e "antes de cada versão do livro ir para o ar, tudo é executado de novo". O código é executado
   de novo, mas as respostas do modelo são repetidas das gravações (`scripts/saidas.py`). Descrever a exploração de
   execuções registradas na página e a execução do projeto na máquina do leitor. Alinhar a descrição das figuras ao
   controle que o leitor tem. Explicar a conferência das saídas sem sugerir que toda publicação faz novas chamadas ao
   modelo ou comprova sua qualidade atual no serviço externo.
2. **Capítulo 1, “O que ficou de pé”** (`01-o-problema-e-o-contrato.mdx`, linha 176). O texto já põe "respondeu"
   entre aspas e fala em "pior erro possível": é um ajuste de palavra, não uma correção. A escolha indevida no R12 é
   medida; a exposição de dados é uma consequência possível, e a frase deve deixar isso claro.
3. **Capítulo 2, “O que ficou de pé” e resumo** (`02-o-primeiro-agente.mdx`, linhas 124 e 139). É o erro de fato:
   a linha 124 diz que o decisor de 40% "mostrou a compra de uma pessoa para outra", e esse decisor só devolve uma
   decisão, sem texto. Corrigir. Descrever o comportamento conservador observado nos 20 casos, sem transformá-lo numa
   garantia geral de segurança. Preservar o gancho das ferramentas com essa mesma precisão.
4. **Textos da IDE relacionados aos resultados.** Conferir `passos/01.json`, `passos/02.json` e as notas dos
   roteiros, para que a explicação guiada e o texto principal sustentem a mesma conclusão.

### Peças e fontes

| Peça | Papel nesta etapa |
|---|---|
| `livros/ciclo-de-vida/capitulos/00-introducao.mdx` | A promessa de execução e interação. |
| `livros/ciclo-de-vida/capitulos/01-o-problema-e-o-contrato.mdx` | A interpretação do decisor que sempre responde. |
| `livros/ciclo-de-vida/capitulos/02-o-primeiro-agente.mdx` | A interpretação dos 30% e a ligação com o próximo capítulo. |
| `livros/ciclo-de-vida/passos/{01,02}.json` e `roteiros/{01,02}.json` | As explicações que o leitor encontra dentro da IDE. |
| `livros/ciclo-de-vida/projeto/baseline.py`, `agente.py` e `medir.py` | O que a régua conta e o que o agente executa. Fontes de conferência. |
| `livros/ciclo-de-vida/saidas.json` e `gravacoes/r02-medir.json` | Os resultados e respostas registrados. Fontes de conferência. |
| `src/components/livro/ide/IdeCapitulo.tsx` e `scripts/saidas.py` | Como a página apresenta a execução e como as saídas são conferidas. Fontes de conferência. |

### Critérios de revisão

- Na introdução, fica claro o que o leitor faz na página e na própria máquina.
- A conferência das gravações é descrita de acordo com seu alcance real.
- O texto não afirma que o decisor fixo produziu uma resposta ou vazou dados.
- As conclusões sobre o primeiro agente se referem à execução e aos casos observados.
- A diferença entre acerto da decisão, qualidade da resposta e segurança continua compreensível.
- O capítulo continua defendendo uma ideia: medir a decisão ajuda, mas essa medida tem limites.

### Evidência e verificação

- Apresentar os trechos alterados com antes/depois e indicar a fonte que sustenta cada correção.
- Conferir os trechos na página montada, incluindo as explicações relacionadas dentro da IDE.
- Executar `npm run ritmo` e comparar com os avisos anteriores: três na introdução, dois no capítulo 1 e nenhum
  no capítulo 2. O contador não substitui a leitura do texto.
- Executar `npm test`, usando as gravações existentes. Avaliar falhas relacionadas às alterações e concluir os
  checks exigidos pelo repositório. Uma correção textual simples não pede teste novo que apenas repita sua frase.
- Registrar um commit de produto em português, as evidências e o estado “aguardando revisão”. A etapa fecha
  somente com o ok do responsável.

### Limite da etapa

A etapa trata da precisão das explicações. A leitura observada, a escolha de como preservar a régua depois do
exercício, a preparação do ambiente e a redução de interações pertencem às próximas etapas; a voz dos autores corre
em paralelo. Chamadas pagas continuam
dependendo do ok dos autores, conforme o `AGENTS.md`; esta etapa usa as gravações existentes.

## Questões para detalhar nas próximas etapas

- **Etapa 2:** observar o que o leitor faz, onde avança sem pensar, como retoma e como resolve um caso novo.
  Leitores de fora valem mais que conhecidos dos autores; ninguém recebe explicação além do que o livro dá. A página
  precisa estar num endereço fixo (o túnel muda de endereço e depende da máquina ligada); publicar pede a decisão
  escrita do responsável. Decidir antes da leitura o que conta como sinal: por exemplo, quantos terminam o capítulo 1
  e quantos pedem o 2. Registrar observações e dúvidas, sem concluir redução de abandono apenas pelos testes ou pela
  contagem de cliques.
- **Etapa 3:** a proposta inicial é fazer os casos adicionais numa cópia da referência, preservando a comparação
  oficial. Conferir o projeto real antes de definir os arquivos e os critérios de conclusão. Com os cinco casos
  pedidos hoje, a referência passa a 25 perguntas e a nota de partida passa a 6/25 (24%).
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

(redação: GPT-6; revisão: Claude Opus 5.5)
