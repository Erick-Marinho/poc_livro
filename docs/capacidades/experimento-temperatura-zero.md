# Experimento: temperatura zero basta para repetir uma resposta?

**Problema.** O texto trazido pelo Erick explica como o arredondamento e o agrupamento de requisições podem mudar
uma resposta mesmo com seleção gulosa. Há uma boa hipótese para experimentar, mas demonstrar três somas não equivale
a medir um LLM, e duas respostas diferentes de uma API não identificam sozinhas a causa. O leitor vai construir o
medidor na IDE, investigar a diferença e aprender o alcance da prova que obteve.

**Estado.** Etapa 1 aprovada pelo Erick em 26/10/2026. Etapa 2 entregue para revisão: projeto, coleta real em CPU,
construção pela IDE e mapa Remotion. A amostra CPU repetiu 90 de 90 respostas-alvo. O caminho CUDA está preparado;
a coleta na GPU da outra máquina permanece pendente e não recebe placar nesta versão.

## Pedido e decisões do Erick

- Criar um experimento sobre o texto fornecido, podendo contestá-lo quando necessário.
- Seguir o padrão do projeto: o leitor constrói pela IDE; animações e outros artefatos servem ao aprendizado.
- Há uma NVIDIA RTX 4060 disponível **em outra máquina**, com limite de **6 GB de VRAM informado pelo Erick**.
  Sistema, driver e identificação efetiva ainda serão registrados na coleta dessa máquina.
- (26/10/2026, Erick) “Feito, pode seguir”: a etapa 1 e a proposta CPU/GPU têm o ok; CPU é o caminho padrão e GPU
  uma extensão, sem exigir placa de vídeo de todo leitor.
- (26/10/2026, Erick) Pode usar Remotion nas animações. O mapa inicial terá controle do leitor e versão estática.
- (26/10/2026, Erick) Depois da revisão do experimento, "todas" as melhorias propostas, executadas pela sessão da
  moldura: o texto, o mapa e o resultado. A etapa 3 deste plano passa a ser feita lá
  (`temperatura-zero-revisao.md`).
- (26/10/2026, revisão da etapa 2, Erick) Refazer a figura de “O que vamos construir” para ser mais intuitiva, com
  gráfico animado quando ajudar o aprendizado. A revisão abaixo permanece na etapa 2, ainda sem ok.

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

Só a etapa 2 está detalhada abaixo. As animações numéricas e o comparador visual completo permanecem na etapa 3;
o mapa inicial já entra nesta versão. Nenhuma etapa se fecha sem o ok do Erick.

## Etapa atual: 2 — primeira versão construída na IDE

**Pergunta.** O leitor consegue construir um medidor, executar o modelo localmente e distinguir o mecanismo
numérico do que sua coleta realmente observou?

**Escopo.** Primeira página completa, com projeto Python, corpus congelado, coleta real em CPU, leitura offline da
coleta, roteiro desde a pasta vazia, previsões, variantes e mapa inicial em Remotion. A execução real usa seleção
gulosa; a leitura da coleta no build usa apenas arquivos. O caminho CUDA é opcional e separado das dependências CPU.

**Peças.** `experimentos/temperatura-zero/` (página, projeto, comandos, roteiro, passos, glossário e saídas);
componente específico do mapa e sua classificação no ritmo; testes do experimento; relatório da etapa 2.

**Critérios.**

- `numeros.py` mostra as somas, o controle com inteiros e a escolha sem sorteio; `comparar.py` trata sequência igual,
  token diferente e fim antecipado. O leitor encontra um erro de associatividade real e o investiga.
- `coletar.py` faz inferências novas somente quando chamado explicitamente; `medir.py` lê os registros. Importar ou
  montar o site não carrega pesos nem chama o modelo. Coleta tem revisão, ambiente, entradas e sequências completas.
- Corpus com três perguntas e dez repetições por lote, tamanhos 1, 4 e 16, limitado a 48 tokens novos. O padrão CPU
  usa float32, atenção eager e quatro threads; CUDA usa float16 e precisa registrar memória. Comparações separam os
  ambientes. Padding depois de EOS não conta como token gerado da resposta.
- O roteiro chega exatamente ao projeto final e grava cada comando no estado certo. A instalação do modelo e a
  coleta real são “sua vez”; a gravação mostrada no terminal é identificada e pode ser reanalisada sem os pesos.
- Modo direto, projeto na própria IDE e comandos digitados na página funcionam. Alterações de margem e ordem usam
  as variantes existentes. Perguntas de saída pedem interpretação e têm opções plausíveis.
- O mapa em Remotion explica onde a seleção acontece, sem apresentar uma simulação como medição da GPU. Controle
  manual, sem áudio ou autoplay; versão estática no modo direto, movimento reduzido e ausência de JavaScript.

### Revisão atual da etapa 2 — o gráfico de “O que vamos construir”

**Pergunta.** O leitor consegue acompanhar duas execuções e prever se a mesma regra escolhe o mesmo token quando
mudam os valores calculados?

**Escopo e peças.** Substituir a lista destacada do mapa por um diagrama com a mesma entrada, duas ordens de soma,
gráficos de barras na mesma escala, escolha e token voltando à entrada. A figura usa dois casos do exemplo de
`numeros.py`: troca de vencedor e controle com B à frente. Um rastro Python em `figuras/mapa.py`, registrado em
`saidas.json`, liga os valores à figura. O pare e pense equivalente depois do mapa é incorporado à previsão da
figura; `MapaTemperatura` passa a contar como ação no ritmo.

**Critérios e evidência.** Pausa antes de revelar o vencedor, previsão pelo leitor, retorno explicando os valores,
troca de condição reiniciando a previsão, escala comum sem barras enganosas, seis cenas e até 45 segundos, versão
mobile com letras legíveis e versão estática completa para direto/movimento reduzido/sem JS. Teste recalcula o
rastro a partir do projeto e recusa valores ou escolhas incoerentes; navegador confere a barreira, reprodução,
troca de condição, largura mobile e capturas. `npm test` e `npm run ritmo`.

**Limite.** A revisão é somente desta figura e do trecho imediatamente ligado a ela. Não fecha a etapa 2 nem
executa a etapa 3 inteira: não altera a IDE, o medidor ou a coleta CPU, não mede GPU e não cria o comparador de
tokens. A apresentação das duas somas fica no mapa, sem desenvolver as árvores de arredondamento da etapa 3.

**Evidência.** Coleta CPU real e análise, testes do projeto, roteiro aplicado em pasta vazia, saídas regravadas e
conferidas, `npm test`, `npm run ritmo` e página percorrida no computador e no celular. Relatório registra as falas
redigidas pelo modelo e as limitações da coleta. O caminho GPU só recebe evidência depois de executado na outra
máquina; a comparação vLLM comum/invariante depende dela e não recebe números antecipados.

**Limite.** Sem chamada paga, push, túnel ou acesso presumido à outra máquina. Nenhuma coleta GPU inventada, promessa
de divergência, mudança nos capítulos ou substituição da IDE compartilhada. Sem implementar as árvores animadas,
controle visual da margem ou comparador interativo de tokens da etapa 3.

### Para dimensionar a próxima etapa

- Registrar sistema, driver e GPU efetiva na outra máquina; respeitar o limite informado de 6 GB de VRAM.
- Executar a extensão GPU e, se o backend suportar, a comparação comum/invariante; até lá, marcar não medido.
- Preencher a voz dos autores somente quando eles fornecerem seu texto.

## Registro

| Etapa | Evidência | Estado |
|---|---|---|
| 1 — `32143e2` | [Auditoria e sondagem numérica](../relatorios/experimento-temperatura-zero-etapa-1.md); CPU/GPU aprovados, GPU em outra máquina; inferência real ainda não executada nesta etapa | Erick, 26/10/2026 |
| 2 — `c63f4fa` | [Projeto, coleta, perguntas e capturas](../relatorios/experimento-temperatura-zero-etapa-2.md): 90/90 respostas-alvo repetidas em CPU; 15 passos, 26 ações, 15 saídas offline; 9 testes Python, npm test com 168 testes do site e 5 da gravação; sem avisos de ritmo no experimento; mapa Remotion e três modos conferidos no computador e celular; coleta GPU pendente | aguardando revisão do Erick |
| 2 (revisão do mapa) — `3a8ca9f` | [Diagrama, barras, previsão e capturas](../relatorios/experimento-temperatura-zero-mapa.md): mesma entrada, duas execuções, escala comum e controle com folga; valores calculados por `numeros.py`; 173 testes do site e 5 da gravação em cópia isolada e na pasta compartilhada, 30 + 16 + 16 saídas conferidas; navegador no computador e celular; sem avisos de ritmo no experimento; etapa 3 não iniciada | aguardando revisão do Erick |
| 2 (correção do desenvolvimento) | [Diagnóstico e conferência](../relatorios/experimento-temperatura-zero-mapa.md#correção-do-servidor-de-desenvolvimento--26102026): limite de watchers esgotado pelo ambiente Python deixava o MDX antigo; pastas geradas excluídas da monitoração; teste real de mudança do MDX e das gravações; rota 4321 completa e controles conferidos no computador e celular; npm test com 177 testes do site e 5 da gravação, 30 + 16 + 16 saídas iguais | aguardando revisão do Erick |

(redação: gpt-6.1-sol)
