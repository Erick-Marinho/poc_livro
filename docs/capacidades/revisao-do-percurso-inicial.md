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
critério e os leitores. A etapa 3 também tem o ok do Erick em 25/10/2026; nesse dia ele autorizou a etapa 4 para
os problemas conferidos de preparação, recuperação e percurso sem chave.

## O que preservar

- A mesma loja, os mesmos personagens e os casos que reaparecem.
- O contrato e a régua antes do agente.
- O resultado real de 30% e a necessidade de ferramentas que ele revela.
- As diferenças entre formato válido, caminho correto e decisão correta.
- Prever, modificar e investigar erros do projeto real.
- O modo direto, os pontos de volta e a retomada já existentes.

## Etapas

As etapas 1 e 3 estão concluídas com o ok do Erick. A preparação da etapa 2 tem seu ok, mas a leitura espera o
critério e os leitores. A etapa atual, 4, trata de problemas conferidos e foi autorizada pelo Erick. As etapas
5 a 7 continuam dependendo da evidência e da revisão da leitura. Cada etapa de produto tem um commit em português
e evidência no registro; só o ok do responsável fecha a etapa.

A leitura observada continua necessária para as hipóteses restantes; os defeitos das etapas 3 e 4 puderam ser
conferidos no projeto. Uma hipótese que a leitura não confirmar sai do plano ou fica registrada como descartada.

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

## Etapa atual: 4 — preparação, recuperação e percurso sem chave

### Pergunta que esta etapa responde

O leitor distingue começar numa pasta vazia de recuperar uma versão por tag, preserva seus arquivos e consegue
concluir uma investigação do capítulo 2 sem chave nem chamada paga?

### Escopo

Problemas conferidos: os pontos de volta pressupõem tags sem explicar o clone; o repositório do leitor só existe
localmente em `.leitor/atendimento-bemtevi`; a introdução não apresenta o modo direto, promete testes de conclusão
para todo exercício e deixa o exercício do capítulo 2 dependente de chave.

**Decisões do Erick, 25/10/2026:**

- O repositório do leitor ainda não é público. Explicar clone e tags; o endereço fica em `Pendente`, com o texto
  “Endereço do repositório do leitor: quando os autores publicarem”. Nada será publicado ou enviado a um remoto.
- Está autorizada **uma gravação paga**, exclusivamente a variante de `medir.py` nas 20 perguntas oficiais com a
  `INSTRUCAO` sem “Quando a política não diz, não prometa: passe a vez.”. Nenhuma outra chamada paga está autorizada.
  Depois dessa execução, todas as verificações e montagens usam somente repetição das gravações.

1. Na introdução e na partida dos capítulos, distinguir pasta vazia e clone com tags. Explicar o alcance do checkout
   sobre arquivos versionados, alterações locais e arquivos pessoais não rastreados; verificar numa cópia real.
2. Mostrar onde ligar Modo direto, usando o painel existente. Corrigir a promessa dos exercícios: testes e totais
   no 1, comparação e justificativa no 2. Não criar componente nem comando de preparação novo.
3. Usar `variar` na medida do roteiro 02 para a variante sem a regra. O leitor prevê antes de revelar, compara a
   nota e o R12, justifica os casos e restaura o código. Com chave, pode optar por executar no próprio projeto;
   sem chave, realiza a mesma comparação com as duas gravações na IDE.
4. Deixar explícito o que conclui a atividade; testes do grafo não se tornam prova de acerto da decisão. Conservar
   projeto, referência, gravação original e pontos de volta. Ocultar os links de clone ainda não publicados nos
   dados dos passos, mantendo o mecanismo existente pronto para receber o endereço quando o Erick decidir.

### Peças e fontes

| Peça | Papel nesta etapa |
|---|---|
| `capitulos/00-introducao.mdx` e partidas dos capítulos 1 e 2 | Dois pontos de partida, endereço pendente, modo direto e alcance real da conferência do exercício. |
| `capitulos/02-o-primeiro-agente.mdx`, exercício | Investigação com previsão, comparação e justificativa, usando chave opcional. |
| `passos/{01,02}.json` | Publicação do endereço continua pendente; explicação do exercício no passo da medida. |
| `roteiros/02.json` e `02.estados.json` | Seletor `variar` existente, com remoção da regra e restauração ao final. |
| `gravacoes/r02-medir-sem-regra.json` e `saidas.json` | Evidência da única medição autorizada; repetição nas conferências. |
| `src/components/livro/PontoDeVolta.astro` e painel existente | Recuperação de arquivos versionados no clone e Modo direto sem componente novo. |
| `scripts/saidas.py`, `scripts/gravacao/` e `.leitor/atendimento-bemtevi` | Construção, variação, gravação, restauração e tags reais. Fontes de conferência. |
| `projeto/{agente.py,medir.py,referencia.jsonl}` e gravação original | O projeto e a referência permanecem iguais; só a cópia da variante perde a frase. |

Caminhos sem prefixo são relativos a `livros/ciclo-de-vida/`.

### Critérios de revisão

- O leitor sabe que as tags pertencem ao clone, não à pasta vazia criada no capítulo 1, e que o endereço aguarda
  publicação dos autores. Nenhum link anuncia que esse repositório já está acessível publicamente.
- A explicação do checkout corresponde ao comportamento real com arquivos versionados e pessoais; conflitos
  barram a troca e não são contornados com força ou limpeza de arquivos do leitor.
- Modo direto é encontrável no painel e muda o que o texto promete.
- O exercício sem chave exige uma previsão e uma conclusão sobre decisões observadas; não se limita a assistir.
- A única gravação nova corresponde à retirada da frase nas 20 perguntas; a original permanece intacta.
- O caminho com chave é opcional; o enunciado distingue testes do desenho de avaliação da decisão e diz como concluir.

### Evidência e verificação

- Gerar o leitor e, numa cópia local, clonar, usar as tags e conferir arquivo pessoal preservado, arquivo
  versionado restaurado e conflitos que barram a troca. Não publicar nem usar um endereço público de clone.
- Conferir a variante contra as mensagens gravadas e os 20 casos; registrar a execução paga, seu resultado e a
  integridade das gravações anteriores. Repetir o roteiro com `npm run saidas` sem chave e sem novas chamadas.
- Executar `npm run leitor`, `npm run ritmo` e `npm test`. Os testes relevantes conferem os dados gravados e o
  comportamento do seletor, sem testar apenas uma frase editorial.
- No navegador, conferir preparação, Pendente, ponto de volta, chave de Modo direto, previsão e comparação da
  variante; voltar ao código do livro. Apresentar antes/depois e evidências no relatório com marca de redação.
- Aguardar o ok do Erick para fechar a etapa. A etapa 2 segue aberta, sem observação inventada.

### Limite da etapa

Sem publicar repositório, site, túnel ou endereço; sem `.env`, credencial em arquivo, mudança no projeto oficial,
componente de IDE novo ou alteração das etapas 5 a 7. A única permissão paga é a variante acima, em uma medição;
nenhuma verificação chama novamente o serviço. A atividade com chave é uma alternativa futura do leitor, não
permissão para novas execuções do agente desta tarefa.

## Questões para detalhar nas próximas etapas

- **Etapa 2 (preparação aprovada, leitura pendente):** observar o que o leitor faz, onde avança sem pensar, como retoma e como resolve
  um caso novo. Em 25/10/2026, Erick decidiu preparar tudo só localmente; a proposta anterior de endereço fixo público
  fica fora desta preparação. Ainda não há leitores de fora; anotações dos autores usam a mesma ficha com origem
  autor, sem substituir esses leitores. O critério anterior à leitura está em `docs/leituras/sinal.md` como PROPOSTA
  pendente de decisão. Registrar observações e dúvidas, sem concluir redução de abandono por testes ou cliques.
- **Etapa 3 (aprovada):** por decisão do Erick, os cinco casos vão para `meus-casos.jsonl`. A referência
  oficial permanece em 20; a medida opcional somada tem 25 casos e nota de partida 6/25 (24%).
- **Etapa 4 (detalhada acima):** aproveitar clone, tags, PontoDeVolta, Modo direto e `variar`. A alternativa
  gratuita pede previsão, comparação e justificativa; a publicação continua pendente e a única gravação paga
  autorizada é a variante sem a regra de passar a vez.
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
| 4 | `Revisão do percurso inicial, etapa 4: recuperação e exercício sem chave` | [Relatório com antes/depois e evidência real](../relatorios/revisao-do-percurso-inicial-etapa-4.md): clone e tags locais conferidos com preservação e conflitos; uma gravação autorizada, 8/20 na variante contra 6/20 na original; saídas e leitor repetidos sem chamada; ritmo 3/2/0; npm test: 115 testes do livro e 5 da gravação; página montada conferida. | aguardando revisão |

(redação: GPT-6; revisão do plano inicial: Claude Opus 5.5)
