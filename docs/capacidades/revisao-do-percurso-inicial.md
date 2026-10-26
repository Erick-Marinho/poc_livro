# Revisão do percurso inicial do livro

**Problema.** A introdução e os capítulos 1 e 2 já sustentam uma história com projeto, contrato e medição reais.
Um defeito está conferido no texto: ele apresenta como comprovadas consequências que a régua não mede, e descreve a
execução na página como se toda chamada ao modelo fosse refeita. O resto é hipótese da revisão, ainda sem leitor
observado: o percurso pode cansar na condução da IDE e perder continuidade depois de um exercício. O objetivo dos
ajustes é ajudar o leitor a continuar e a tomar decisões sozinho, preservando o argumento de cada capítulo.

**Origem.** Review solicitado por Erick em 25/10/2026. Este documento organiza propostas para implementação;
as aprovações registradas são somente as comunicadas pelo responsável. Revisado no mesmo dia, a pedido do
Erick: a leitura observada vem logo depois da etapa 1, antes dos ajustes que dependem das hipóteses. Etapa 1 aprovada
pelo Erick em 25/10/2026; a etapa 2 fica preparada para ele conduzir a observação.

## O que preservar

- A mesma loja, os mesmos personagens e os casos que reaparecem.
- O contrato e a régua antes do agente.
- O resultado real de 30% e a necessidade de ferramentas que ele revela.
- As diferenças entre formato válido, caminho correto e decisão correta.
- Prever, modificar e investigar erros do projeto real.
- O modo direto, os pontos de volta e a retomada já existentes.

## Etapas

As etapas abaixo seguem uma ordem proposta. A etapa 1 está concluída com o ok do Erick. A etapa atual, 2, está
detalhada abaixo; as seguintes serão detalhadas com a evidência e a revisão da leitura. Cada etapa de produto terá
um commit em português e evidência real no registro; o ok do responsável fecha a etapa. As pendências dos outros planos continuam nos próprios planos.

A etapa 1 vem primeiro porque corrige o livro afirmando o que não mediu, e isso é regra. A 2 vem antes das outras
porque elas partem de hipóteses: a leitura observada diz quais delas valem o trabalho, e em que ordem. Uma etapa que a
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

## Etapa atual: 2 — leitura observada do percurso

### Pergunta que esta etapa responde

Quem não escreveu o livro chega ao fim do capítulo 1 e quer o 2? Onde cansa, pula, se perde e como retoma?

### Escopo

Preparar e, quando houver leitores, registrar a observação do percurso da introdução e dos capítulos 1 e 2.
**Esta entrega prepara os materiais; não realiza leitura nem preenche uma sessão. Quem observa os leitores é o Erick.**

Decisões comunicadas pelo Erick em 25/10/2026:

- Por enquanto, tudo só na máquina e na rede local: sem hospedagem, túnel ou endereço público.
- Ainda não há leitores de fora. Quando houver anotações do Erick, entram na mesma ficha dos leitores, marcadas
  como **autor**. A leitura em voz alta com o Victor segue `docs/PRINCIPIOS.md` e também é marcada como autor.
  As fichas dos autores não substituem a evidência de quem não escreveu o livro.

Preparar protocolo, ficha, um caso novo com resposta sustentada pelos dados do projeto, mapa de hipóteses das
etapas 3 a 7 e um critério de seguir ou mudar marcado **PROPOSTA**, para o Erick decidir antes da leitura. O leitor
lê em voz alta no aparelho que usaria; o observador não explica além do que o livro dá. A sessão registra o que ele
faz, não apenas a opinião final. O caso novo não entra em `referencia.jsonl` nem altera a régua oficial.

### Peças e fontes

| Peça | Papel nesta etapa |
|---|---|
| [protocolo.md](../leituras/protocolo.md) | Preparação local, duração, condução sem explicação adicional, travas, parada, retomada e encerramento. |
| [ficha.md](../leituras/ficha.md) | Modelo único para leitor e autor, com origem explícita, versão, aparelho, eventos por seção e resultados ainda em branco. |
| [caso-novo.md](../leituras/caso-novo.md) | Cartão separado da solução do observador; decisão, justificativa e fontes nos dados reais da loja fictícia. |
| [hipoteses.md](../leituras/hipoteses.md) | Evidência a favor, contra ou sem sinal para cada hipótese das etapas 3 a 7, sem aprovar as soluções. |
| [sinal.md](../leituras/sinal.md) | PROPOSTA de limiares anteriores à leitura; decisão do Erick pendente. |
| `livros/ciclo-de-vida/capitulos/{00,01,02}-*.mdx`, `passos/` e `roteiros/` | O percurso observado, incluindo exercício e IDE, sem ajustes nesta preparação. |
| `livros/ciclo-de-vida/projeto/dados/` e `referencia.jsonl` | Fontes do caso novo e conferência de que a combinação não está na referência. |
| `scripts/dev.sh`, `package.json`, `astro.config.mjs` e `README.md` | Comandos existentes e funcionamento real do acesso na máquina e na rede local. |
| `docs/PRINCIPIOS.md` e `docs/RITMO.md` | Leitura em voz alta com o Victor; distinguir ação do leitor de simples passagem ou exibição. |

### Critérios de revisão

- O protocolo pode ser seguido pelo Erick sem explicar o livro ao leitor; prevê duração, travas e encerramento.
- A ficha distingue autor de leitor que não escreveu o livro, ação de interpretação, não alcançado de erro,
  pedido espontâneo do 2 de resposta à pergunta final, desistência de limite de tempo e impedimento técnico.
- Aparelho, sistema, navegador, reduzir movimento e modo de leitura ficam registrados junto dos defeitos.
- Parada e retomada, conclusão do capítulo 1, vontade de continuar e solução do caso novo têm campo e evidência.
- O caso usa os dados do projeto, não consta na referência e tem resposta esperada separada da parte do leitor.
- Cada hipótese das etapas 3 a 7 tem observação discriminante; falta de oportunidade fica como sem sinal.
- Os limiares de seguir ou mudar são PROPOSTA, sem decisão tomada pelo modelo; autores ficam fora da contagem.
- Os comandos de abertura foram conferidos no script e no navegador, sem infraestrutura pública ou script novo.

### Evidência e verificação

Nesta preparação, entregar os cinco materiais, a conferência do caso contra os dados e a referência, e o teste de
acesso local no navegador. A evidência técnica vai no [relatório da preparação](../relatorios/revisao-do-percurso-inicial-etapa-2-preparacao.md).
Nenhuma ficha está preenchida; os testes do software não são leitura observada.

Depois, o Erick registra as sessões e relaciona os eventos às hipóteses; aplica somente o critério que tiver decidido
antes de observar. Sem leitores de fora ou sem oportunidade de observar uma hipótese, registrar sem sinal. As
anotações dos autores continuam identificadas e separadas do denominador. O responsável decide se uma hipótese
confirma um próximo ajuste, é descartada ou precisa de mais observação. A etapa só fecha com o ok do Erick.

### Limite da etapa

Agora, preparar apenas: sem recrutar, contatar ou observar leitores pelo agente, simular respostas, preencher fichas
com achados inventados ou concluir redução de abandono. Não detalhar nem executar as etapas 3 a 7. Não publicar,
hospedar, criar túnel, script novo, instrumentação automática, chamada paga ou alteração do produto para preparar a
leitura. Defeitos de aparelho, quando relatados e reproduzidos, seguem separados conforme o plano.

## Questões para detalhar nas próximas etapas

- **Etapa 2 (detalhada acima):** observar o que o leitor faz, onde avança sem pensar, como retoma e como resolve
  um caso novo. Em 25/10/2026, Erick decidiu preparar tudo só localmente; a proposta anterior de endereço fixo público
  fica fora desta preparação. Ainda não há leitores de fora; anotações dos autores usam a mesma ficha com origem
  autor, sem substituir esses leitores. O critério anterior à leitura está em `docs/leituras/sinal.md` como PROPOSTA
  pendente de decisão. Registrar observações e dúvidas, sem concluir redução de abandono por testes ou cliques.
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
| 1 (fecho) | `3a4e367` | “Sem dados da loja” restituído no resumo; npm test: 112 testes do livro e 5 da gravação passaram, 29 + 16 saídas conferidas. | Erick, 25/10/2026 |
| 2 (preparação) | este commit | Protocolo, ficha, caso novo, hipóteses e sinal PROPOSTA preparados para uso local; [relatório técnico](../relatorios/revisao-do-percurso-inicial-etapa-2-preparacao.md). Nenhuma sessão realizada; sem leitores de fora. | aguardando revisão da preparação; leitura pelo Erick pendente |

(redação: GPT-6; revisão do plano inicial: Claude Opus 5.5)
