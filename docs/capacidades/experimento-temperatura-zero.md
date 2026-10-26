# Experimento: temperatura zero basta para repetir uma resposta?

**Problema.** O texto trazido pelo Erick explica como o arredondamento e o agrupamento de requisições podem mudar
uma resposta mesmo com seleção gulosa. Há uma boa hipótese para experimentar, mas demonstrar três somas não equivale
a medir um LLM, e duas respostas diferentes de uma API não identificam sozinhas a causa. O leitor vai construir o
medidor na IDE, investigar a diferença e aprender o alcance da prova que obteve.

**Estado.** Etapa 1 preparada para revisão: desenho do experimento, fontes e sondagem numérica. Nenhum LLM foi
executado nesta etapa. A página ainda não foi criada. O resultado do estudo com modelo real permanece aberto.

## Pedido e decisões do Erick

- Criar um experimento sobre o texto fornecido, podendo contestá-lo quando necessário.
- Seguir o padrão do projeto: o leitor constrói pela IDE; animações e outros artefatos servem ao aprendizado.
- Há uma NVIDIA RTX 4060 disponível **em outra máquina**. VRAM, sistema e acesso ainda precisam ser conferidos.
- Erick levantou a escolha CPU ou GPU para quem replica. A proposta abaixo oferece os dois caminhos; ela ainda
  precisa de revisão. Ter uma GPU disponível não autoriza contratar infraestrutura nem publicar um servidor.

## Tese e fonte

**Título de trabalho:** “Temperatura zero: a mesma pergunta dá a mesma resposta?”

**Afirmação a testar:** escolher sempre a alternativa de maior pontuação basta para repetir a resposta quando o
ambiente de execução muda? A hipótese é que a seleção pode ser estável enquanto as pontuações mudam; a frequência
observada dessa mudança depende do sistema medido.

O anexo é a motivação editorial. A referência técnica principal é
[Horace He e Thinking Machines Lab, *Defeating Nondeterminism in LLM Inference*](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/).
Os números publicados por eles são resultados de terceiros, nunca placar do nosso experimento.
O [relatório da etapa 1](../relatorios/experimento-temperatura-zero-etapa-1.md) distingue o que manter, qualificar e
testar, com fontes primárias. O endereço e a autoria do texto anexado ainda não foram fornecidos.

## Percurso proposto para CPU e GPU

O leitor escolhe onde executará o modelo. O percurso na página usa código e gravações identificadas pelo ambiente;
a máquina do navegador não determina essa escolha. “Aqui no experimento” continua mostrando a execução gravada,
e “na minha IDE” orienta a execução real, como já acontece no projeto.

| Caminho | O que o leitor constrói e mede | Alcance da conclusão |
|---|---|---|
| Comum, em CPU | Aritmética binary16, seleção da maior pontuação, comparação de sequências e primeiro ponto diferente | Demonstra o mecanismo numérico; as pontuações construídas são uma ilustração, identificada como tal |
| CPU, padrão proposto | Um LLM pequeno real, sem amostragem, repetido com entrada e ambiente registrados; comparação de lotes quando o backend permitir | Mede repetição naquele ambiente; uma rodada toda igual é resultado válido |
| GPU, extensão proposta | O mesmo medidor sobre um backend com controle de lote; execução comum e modo invariante, se suportado | Compara as duas configurações na mesma GPU; não atribui diferenças entre CPU e GPU apenas à placa |

**Proposta técnica para dimensionar, não instalação decidida:** modelo `Qwen/Qwen3-0.6B`, revisão congelada;
Transformers em CPU e vLLM na extensão GPU. Conferir versões, template, modo sem raciocínio e compatibilidade na
máquina escolhida antes de fechar o projeto. O modelo é candidato pelo porte e pelo suporte documentado nos dois
backends; tempo, RAM e VRAM serão medidos, sem promessa antecipada. Instalação GPU não entra no caminho CPU.

No Transformers, a seleção gulosa é configurada por `do_sample=False` e `num_beams=1`; não se deve implementar
`softmax(logits / 0)`. Na extensão vLLM, conferir `temperature=0` e os demais parâmetros efetivos. Não comparar
backends diferentes como se lote fosse a única variável.

## Régua proposta antes de construir

O experimento mede **repetição**, não acerto factual ou qualidade. Um modelo pode repetir o mesmo erro.

1. Congelar um corpus curto antes da coleta principal: três perguntas, incluindo uma pergunta da Casa Bem-te-vi,
   uma continuação factual e uma resposta livre. Congelar também as requisições que completarão os lotes. Separar
   corpus de desenvolvimento de eventual busca exploratória por exemplos que divergem; não esconder essa seleção.
2. Registrar pesos e revisão, tokenizer, IDs de entrada, template, estratégia de geração, limite de tokens, precisão,
   backend, versão, dispositivo, sistema, drivers, cache, paralelismo e ordem das execuções. Usar avaliação sem
   dropout. A identidade do prompt é a sequência de entrada completa, não só o texto visível ao usuário.
3. Proposta inicial de coleta: dez repetições por pergunta e condição; lote de 1 no controle. Na comparação de lotes,
   tamanhos 1, 4 e 16, se couberem. Não reduzir silenciosamente: registrar configuração inviável e revisar a matriz
   antes da coleta. Dez repetições não são evidência de uma garantia universal.
4. Definir como referência a primeira sequência gerada no controle de lote 1 de cada pergunta, dentro do mesmo
   backend, precisão, modo e dispositivo. Contar sequências idênticas a essa referência, sequências únicas e índice
   do primeiro token diferente. O texto decodificado é informação adicional, sem normalizar diferenças para o placar.
5. Comparar modos comum e invariante também entre si, guardando referências separadas. O modo invariante pode ser
   estável e escolher outra sequência. Mais de uma saída única refuta repetição naquele conjunto de condições;
   uma única saída significa “não observamos divergência nesta amostra”. Falha técnica fica fora do denominador e
   aparece como falha, sem substituir a resposta por uma gravação bem-sucedida.
6. No GPU, medir lotes efetivamente executados. Concorrência enviada pelo cliente não comprova o tamanho do lote
   interno. Preferir batches explícitos com configuração registrada e verificar como o engine os particiona;
   se só o agendamento foi observado, dizer isso. Não inferir Split-K ou outro kernel só de uma diferença no texto.
7. Separar aquecimento, carregamento e geração. Comparar tempo e memória com o mesmo trabalho e configuração
   documentada. Números de custo ficam em artefato da coleta; não entram como constantes esperadas no build.

**Formato previsto:** `projeto/casos.jsonl` congela o corpus; os registros de execução guardam a entrada completa,
IDs gerados, ambiente e condição; `medir.py` só agrega esses registros. A captura de uma inferência real é distinta
da repetição dessa captura no site. Reproduzir uma gravação não é fazer outra medição de estabilidade do modelo.

Se forem exibidas margens entre alternativas de um LLM, elas precisam vir de logits ou logprobs realmente
capturados no mesmo prefixo. Texto diferente não fornece essa margem; probabilidades condicionadas a prefixos já
divergentes não isolam o primeiro desvio. Pontuações construídas permanecem apenas na ilustração numérica.

## Experiência de aprendizagem proposta

A página segue o molde existente: afirmação com fonte e régua, “O que vamos construir” com o mecanismo inteiro,
construção na IDE e “O que deu” com medição, achado e custo. O resultado fica no fim. As únicas opiniões e
experiências atribuídas aos autores são as que eles escreverem; os lugares reservados ficam `Pendente`.

### Construção na IDE

Uma IDE, começando em pasta vazia, com passos repartidos por entrega e pelo limite de cerca de 15 linhas novas.
Esta sequência descreve entregas, não fixa ainda quantos passos de código serão necessários:

| Entrega | O que o leitor faz | O que a ação demonstra |
|---|---|---|
| Um seletor guloso | Prevê a escolha e implementa `argmax` com desempate explícito | Pontuações iguais dão a mesma escolha sob a mesma regra |
| Uma soma com arredondamento | Converte entradas e resultados intermediários para binary16; muda os parênteses | A ordem pode mudar a pontuação mesmo sem sorteio |
| Um erro investigável | Executa uma asserção de associatividade que falha e localiza a operação que perdeu a fração | O erro vem do cálculo real, não de uma saída inventada |
| Controles | Repete a ordem fixa; troca os valores por inteiros exatos e aumenta a margem entre alternativas | Nem toda soma muda; nem toda mudança inverte a escolha |
| Um comparador | Testa sequências iguais, uma troca de token e uma sequência que termina antes | Aprende a medir a primeira divergência e a definir o denominador |
| O modelo real | Escolhe CPU ou GPU e executa a coleta disponível na própria máquina | Distingue medir o modelo de repetir uma gravação |
| A comparação de condições | Interpreta repetições e lotes; no GPU, confere o modo invariante suportado | Separa estabilidade observada, mecanismo possível e causalidade ainda não demonstrada |
| O relatório | Faz uma previsão para um caso novo e compara com a amostra coletada | Aprende a escrever uma conclusão limitada pela prova |

Reutilizar quadro por ação, perguntas que interpretam a saída, dúvidas pontuais, `variar` para modificar antes de
criar, retomada e modo direto. Não criar chat ao vivo nem exigir chamada paga. Na máquina sem GPU, a extensão GPU
tem gravação identificada e instruções opcionais; a conclusão principal continua executável pelo caminho CPU.
Se o mecanismo atual da IDE não comportar a escolha de caminho, detalhar a menor adaptação em etapa própria antes
de mexer em componentes compartilhados. Não duplicar o medidor para cada caminho.

### Artefatos visuais

Cada peça substitui uma explicação ou listagem que o leitor teria de reconstruir mentalmente:

| Peça e pergunta | Ação do leitor | Dados e limite | Modo direto |
|---|---|---|---|
| Mapa inicial: onde a temperatura atua? | Marca em qual ligação há sorteio | Entrada → cálculo → pontuações → escolha → próximo prefixo; desenho do mecanismo, sem resultado antecipado | Diagrama rotulado |
| Soma em duas árvores: onde a fração desaparece? | Prevê o total, muda os parênteses e acompanha um arredondamento por vez | Entradas e intermediários extraídos do código da CPU; animação numérica, sem se apresentar como kernel de GPU | Duas árvores com os valores e o arredondamento |
| Margem e escolha: quando a pequena diferença importa? | Altera a margem, prevê se a alternativa vencedora troca e confere | Pontuações construídas e identificadas; a sequência posterior é uma ilustração de dependência do prefixo | Casos com inversão e sem inversão lado a lado |
| Comparador de tokens: em que ponto as duas execuções se separam? | Escolhe duas execuções reais e localiza o primeiro desvio | IDs e texto das capturas; se a amostra for toda igual, mostra a igualdade em vez de inventar um desvio | Diff estático e condição de cada execução |

As animações têm controle do leitor, até seis cenas e 45 segundos, sem áudio. Respeitam movimento reduzido,
teclado, 360 px e os estados finais legíveis. Não animar barras de “carga do servidor” como se tivessem sido
medidas. Se aparecer uma explicação de lote → kernel, rotular como esquema do mecanismo descrito na fonte.

## Peças previstas

- `experimentos/temperatura-zero/`: página, projeto Python, corpus, roteiro, passos, glossário e saídas, criados
  juntos quando houver uma versão completa que satisfaça o molde. Uma pasta incompleta quebraria a conferência
  atual de todos os experimentos.
- O medidor comum recebe registros de CPU e GPU com o mesmo esquema. Os adaptadores de inferência são pequenos e
  o leitor enxerga seus parâmetros; dependências GPU ficam opcionais.
- Capturas reais trazem ambiente e procedência; a inferência não executa no build. Conferir a compatibilidade com
  `scripts/gravacao` antes de escolher o formato final: uma chamada local direta ao Transformers ou vLLM não está
  automaticamente coberta pelo gravador atual. Não fingir que já existe suporte.
- Figuras específicas leem rastros do projeto ou capturas identificadas. Reutilizar os componentes e o estilo do
  site; sem imagens raster de código ou números escritos à mão.
- Testes científicos do comparador e do rastro, testes do roteiro e verificações de acessibilidade. O molde atual
  aceita “X de Y (Z%)”; rotular esse número como sequências iguais à referência, nunca “acertos do modelo”.

## Etapas

| Etapa | Entrega | Evidência para revisão |
|---|---|---|
| 1 | Fontes, hipótese, régua, CPU/GPU e desenho pedagógico | Este plano e relatório com sondagem CPU reproduzível; nenhuma conclusão de inferência inventada |
| 2 | Primeira versão completa do experimento construído na IDE, com modelo real e mapa do mecanismo | Roteiro chega ao projeto; captura real e resultado inclusive se não houver divergência; saídas conferidas e página percorrida |
| 3 | Árvores de arredondamento, margem e comparação de tokens | Rastros conferidos com o projeto, previsões antes da resposta e capturas nos modos guiado/direto, computador/celular |
| 4 | Revisão do argumento e do percurso inteiro | Testes, ritmo, coleta reproduzida no ambiente registrado, caso novo e revisão do Erick |

Só a etapa 1 está detalhada nesta entrega. A etapa 2 começa depois da revisão desta proposta e do dimensionamento
dos ambientes; nenhuma etapa se fecha sem o ok do Erick.

## Etapa atual: 1 — hipótese, régua e desenho pedagógico

**Pergunta.** Que experiência permite ao leitor entender por que escolher o maior valor não garante repetição do
sistema, sem confundir exemplo numérico, inferência real e evidência de causalidade?

**Escopo.** Auditar o texto anexado com fontes primárias, fazer uma sondagem numérica em CPU e registrar a proposta
de medição e de ensino. Incorporar a GPU disponível em outra máquina e a escolha CPU/GPU levantada pelo Erick.

**Peças.** Este plano e `docs/relatorios/experimento-temperatura-zero-etapa-1.md`.

**Critérios.** A hipótese admite resultado negativo; a régua separa repetição e correção; a parte CPU tem valor
próprio e modelo real previsto; o GPU compara condições controladas; cada artefato tem ação, fonte e modo direto.
Todo dado da sondagem é obtido por código executável, com a distinção explícita de que não é inferência de LLM.

**Evidência.** Fontes conferidas no relatório; arredondamento em CPU produz duas somas diferentes; uma ordem fixa
repetida mil vezes produz uma única soma; valores inteiros escolhidos produzem a mesma soma nas duas ordens.

**Limite.** Não instalar modelo, chamar API paga, acessar a outra máquina, publicar página, abrir túnel ou alterar
componentes compartilhados nesta etapa. A implementação aguarda a revisão; não transformar a proposta CPU/GPU em
decisão atribuída ao Erick.

### Para dimensionar a próxima etapa

- Conferir VRAM, sistema, driver e forma de executar a coleta na outra máquina com a RTX 4060.
- Validar o modelo candidato, versões e tempo aceitável da rodada CPU antes de fixar a matriz final.
- Revisar a proposta dos dois caminhos e o percurso pedagógico com o Erick.
- Preencher a voz dos autores somente quando eles fornecerem seu texto.

## Registro

| Etapa | Evidência | Estado |
|---|---|---|
| 1 (proposta) | [Auditoria e sondagem numérica](../relatorios/experimento-temperatura-zero-etapa-1.md); CPU/GPU propostos, GPU informada em outra máquina; inferência real ainda não executada | aguardando revisão do Erick |

(redação: gpt-6.1-sol)
