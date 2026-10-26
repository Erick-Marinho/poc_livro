# Para o Erick — precisão sobre execução e resultados

25/10/2026. Etapa 1 de `docs/capacidades/revisao-do-percurso-inicial.md`.
Estado: **aguardando revisão**. O ok do Erick ainda é necessário para fechar a etapa.

(redação: GPT-6)

Esta marca se aplica aos trechos novos transcritos abaixo e ao relatório. As opiniões dos autores continuam nos
`Pendente` existentes. O plano foi registrado primeiro no commit `bf308b4`, sem alterações de produto.

A correção separa a decisão medida da consequência possível: o decisor de 40% não escreveu uma resposta nem mostrou
compras. Na gravação do primeiro agente, 19 decisões foram passar a vez e uma foi recusar; seus 14 erros foram passar
quando o contrato esperava outra decisão. Isso descreve os 20 casos observados, sem garantir segurança geral.
A introdução agora distingue a exploração de saídas gravadas na página da execução na máquina do leitor e limita o
alcance da conferência: repetir respostas gravadas não mede a qualidade atual do modelo no serviço externo.

## Antes e depois, com a fonte de cada correção

Os caminhos abaixo são relativos à raiz do repositório. As fontes de resultados foram lidas, sem alteração de
código, saídas ou gravações. Nas alterações de JSON, as aspas e os caracteres de escape são apresentados como texto
para facilitar a revisão; somente os campos explicativos mudaram.

### 1. `livros/ciclo-de-vida/capitulos/00-introducao.mdx`

**Antes**

> Este não é um livro para só ler. Ao longo dos capítulos, o código vai se montando na página, as figuras se mexem quando você chega nelas, e o terminal executa quando você aperta o botão.

**Depois**

> Este não é um livro para só ler. Na página, você avança a construção do código, faz previsões e explora saídas gravadas do projeto real; o terminal mostra essas saídas quando você digita o comando do passo. Nas figuras, você decide, avança e compara caminhos. Na sua máquina, você escreve o código e executa os comandos no próprio terminal.

**Fonte:** src/components/livro/ide/IdeCapitulo.tsx: digitada, executar, suaVezBase; scripts/saidas.py: construir e variantes; componentes das figuras já presentes na introdução.

### 2. `livros/ciclo-de-vida/capitulos/00-introducao.mdx`

**Antes**

> Por trás disso há uma regra que levamos a sério: o livro não pode mentir. Todo trecho de código que aparece aqui é lido do arquivo real do projeto, e não de uma cópia que alguém esqueceu de atualizar. Toda saída de terminal foi gravada executando esse código. E antes de cada versão do livro ir para o ar, tudo é executado de novo: se alguma saída mudou, a montagem do livro falha, e a gente corrige antes de você ler.

**Depois**

> Por trás disso há uma regra: o livro não pode mentir. O código mostrado vem dos arquivos do projeto; as saídas foram gravadas executando esse código. A conferência executa os comandos e compara as saídas com as gravadas, descontando variações como tempo e caminho da máquina. As respostas do modelo são repetidas das gravações, sem novas chamadas ao serviço. Se uma chamada não estiver gravada ou uma saída divergir, a conferência falha.

**Fonte:** scripts/saidas.py: com_gravacao, executar, sem_tempo e principal; scripts/gravacao; package.json: test e saidas:conferir.

### 3. `livros/ciclo-de-vida/capitulos/00-introducao.mdx`

**Antes**

> Bibliotecas de inteligência artificial mudam a cada poucos meses. Livro técnico costuma envelhecer em silêncio. Este foi feito para avisar quando envelhece.

**Depois**

> Bibliotecas de inteligência artificial mudam. Essa conferência detecta divergências entre o projeto executado e o livro; não mede a qualidade atual do modelo no serviço externo. Na sua máquina, os comandos que chamam o modelo fazem chamadas reais, pagas, e podem produzir respostas diferentes.

**Fonte:** scripts/saidas.py: com_gravacao; livros/ciclo-de-vida/projeto/medir.py; src/components/livro/ide/IdeCapitulo.tsx: suaVezBase.

### 4. `livros/ciclo-de-vida/capitulos/01-o-problema-e-o-contrato.mdx`

**Antes**

> Na vida real, é o pior erro possível.

**Depois**

> Num atendimento real, essa escolha poderia expor dados de outra pessoa.

**Fonte:** projeto/baseline.py: avaliar só compara decisões; saidas.json: sempre-responder devolve somente Decisao.RESPONDER; projeto/referencia.jsonl: R12.

### 5. `livros/ciclo-de-vida/capitulos/02-o-primeiro-agente.mdx`

**Antes**

> Pela nota, sim. Pelo tipo de erro, não. O que respondia tudo "respondeu" a pergunta do Bruno sobre o pedido da Ana, e mostrou a compra de uma pessoa para outra. Este errou sempre para o lado seguro: passou a vez, e uma pessoa da equipe resolveria. A nota conta os dois erros igual, e por isso ainda engana. No capítulo 4, os erros passam a ter peso.

**Depois**

> Pela nota, sim. Mas o decisor de 40% só devolve a decisão responder: não escreve resposta nem mostra compras. No R12, escolheu responder quando devia recusar, o que num atendimento poderia expor dados. Nesta execução, os 14 erros do agente foram passar a vez. É um comportamento conservador nestes casos, sem garantia de segurança geral: a régua mede decisões, não a qualidade das respostas. No capítulo 4, os erros passam a ter peso.

**Fonte:** projeto/baseline.py: avaliar; saidas.json: sempre-responder e r02-medir; projeto/medir.py: decidir retorna apenas decisao; gravacoes/r02-medir.json; projeto/agente.py: passar tem frase fixa.

### 6. `livros/ciclo-de-vida/capitulos/02-o-primeiro-agente.mdx`

**Antes**

> O cuidado está no agente. O que falta é informação: os pedidos, o catálogo e a política estão na pasta `dados/`, e ele não tem como olhar. Dar a ele esse jeito de olhar é o assunto do capítulo 3, as ferramentas. E a pergunta continua a mesma: a nota sobe sem que ele perca o cuidado?

**Depois**

> Nestes 20 casos, o agente quase sempre passou a vez. Os pedidos, o catálogo e a política estão em `dados/`, sem acesso pelo agente. As ferramentas do capítulo 3 dão esse acesso. A nota sobe? Que erros aparecem?

**Fonte:** projeto/agente.py: montar não consulta dados; gravacoes/r02-medir.json: 19 passar e 1 recusar; saidas.json: r02-medir.

### 7. `livros/ciclo-de-vida/capitulos/02-o-primeiro-agente.mdx`

**Antes**

> - Com o GPT-6 Luna e sem dados da loja, o agente tira 30%: passa a vez quase sempre, que é o erro seguro. Falta informação, e ela vem com as ferramentas.

**Depois**

> - Nesta execução com o GPT-6 Luna, sem dados da loja, o agente acertou 6 de 20 (30%) e passou a vez em 19 casos. A nota mede decisões, não garante segurança. As ferramentas dão acesso à informação.

**Fonte:** saidas.json: r02-medir; gravacoes/r02-medir.json; projeto/baseline.py: avaliar; projeto/agente.py.

### 8. `livros/ciclo-de-vida/passos/01.json`

**Antes**

> Ainda não existe agente, mas já dá para medir um. O mais simples possível: um \"agente\" que passa toda pergunta para uma pessoa da equipe. Ele nunca erra feio: não inventa prazo, não mostra pedido alheio, não promete desconto. Mas também não ajuda ninguém.

**Depois**

> Ainda não existe agente, mas já dá para medir um decisor. O mais simples possível: uma função que sempre devolve passar, sem escrever resposta nem consultar dados. A régua vai contar em quantos dos vinte casos essa decisão coincide com o contrato.

**Fonte:** projeto/baseline.py: sempre_passar e avaliar.

### 9. `livros/ciclo-de-vida/passos/01.json`

**Antes**

> Vinte e cinco por cento. Esta é a nota de partida do livro. Todo agente que você construir daqui para a frente tem que passar dela, senão é melhor mandar tudo para a equipe e desligar o agente. A partir daqui ela fica no placar, no canto de cima da página, e cada capítulo vai tentar empurrá-la.

**Depois**

> Vinte e cinco por cento: cinco decisões certas em vinte. Esta é a nota de partida do livro, que cada agente vai tentar superar. Na variante RESPONDER, são oito acertos (40%), mas o R12 recebe a decisão errada. Essa função só devolve uma decisão: não escreve resposta nem expõe compras. Num atendimento, responder sobre pedido alheio poderia expor dados; a nota não mede essa consequência. O placar permite comparar decisões, mas não basta para julgar as respostas.

**Fonte:** projeto/baseline.py: avaliar; saidas.json: r01-nota-de-partida e r01-nota-sempre-responder; projeto/referencia.jsonl: R12.

### 10. `livros/ciclo-de-vida/roteiros/01.json`

**Antes**

> A explicação do arquivo: um \"agente\" que passa tudo para a equipe. Ele nunca erra feio, mas também não ajuda ninguém.

**Depois**

> A nota de partida usa uma função que sempre devolve passar. Ela não escreve resposta nem consulta dados: o que será medido é a decisão.

**Fonte:** projeto/baseline.py: sempre_passar e avaliar.

### 11. `livros/ciclo-de-vida/roteiros/01.json`

**Antes**

> Para cada decisão esperada, conta quantos casos existem e quantos o decisor acertou. A régua não sabe qual decisor está medindo: serve para este e para todo agente depois.

**Depois**

> Para cada decisão esperada, conta os casos e compara a decisão devolvida com a do contrato. Serve para este decisor e para os próximos agentes; não avalia o texto da resposta nem mede exposição de dados.

**Fonte:** projeto/baseline.py: avaliar.

### 12. `livros/ciclo-de-vida/roteiros/01.json`

**Antes**

> 40%: oito acertos, mais que o passar. E é o mais perigoso dos quatro: responderia ao Bruno sobre o pedido da Ana. A nota sozinha não diz se o agente presta; por isso a régua conta cada decisão em separado.

**Depois**

> 40%: oito decisões certas. No R12, devolveu responder quando o contrato pede recusar. A função não escreve resposta nem mostra compras; num atendimento, essa escolha poderia expor dados da Ana ao Bruno. A nota conta decisões e dá o mesmo peso a todo erro, sem medir essa consequência.

**Fonte:** projeto/baseline.py: avaliar; saidas.json: r01-nota-sempre-responder; projeto/referencia.jsonl: R12.

### 13. `livros/ciclo-de-vida/passos/02.json`

**Antes**

> A régua do capítulo 1 não sabe qual decisor está medindo. Agora ela mede o agente de verdade, nas 20 perguntas.

**Depois**

> A régua do capítulo 1 agora recebe a decisão do agente nas mesmas 20 perguntas. O agente percorre o grafo inteiro, mas a nota compara só a decisão com o contrato, sem avaliar o texto da resposta. Aqui, repetimos as respostas gravadas; na sua máquina, medir.py chama o modelo de verdade.

**Fonte:** projeto/medir.py: decidir; projeto/baseline.py: avaliar; scripts/saidas.py: com_gravacao.

### 14. `livros/ciclo-de-vida/passos/02.json`

**Antes**

> 30%. Sem dados da loja, o agente seguiu a regra da instrução, quando a política não diz, não prometa, e passou a vez em quase tudo. O cuidado está aí; falta a informação. É o assunto do capítulo 3.

**Depois**

> 30% nesta execução gravada: 6 de 20, 19 decisões de passar a vez e uma de recusar. Os 14 erros foram passar quando o contrato pedia outra decisão, inclusive no R12. É um comportamento conservador nestes casos, sem garantia de segurança geral. O decisor fixo de 40% só devolvia responder, sem escrever resposta ou mostrar compras. A nota conta decisões, não a qualidade das respostas. As ferramentas do capítulo 3 dão acesso aos dados que faltam; veremos como mudam a nota e os erros.

**Fonte:** saidas.json: r02-medir e sempre-responder; gravacoes/r02-medir.json; projeto/agente.py; projeto/baseline.py: avaliar.

### 15. `livros/ciclo-de-vida/roteiros/02.json`

**Antes**

> avaliar é a régua do capítulo 1: recebe um decisor e conta acertos. O decisor aqui executa o agente inteiro e guarda o que ele decidiu, para listar os erros depois sem pagar de novo.

**Depois**

> avaliar é a régua do capítulo 1: compara decisões com o contrato, sem avaliar o texto da resposta. O decisor executa o agente inteiro e guarda apenas a decisão, para listar os erros sem executar o agente de novo.

**Fonte:** projeto/medir.py: decidir e decidiu; projeto/baseline.py: avaliar.

### 16. `livros/ciclo-de-vida/roteiros/02.json`

**Antes**

> O agente com o GPT-6 Luna, nas 20 perguntas, pela régua da nota de partida.

**Depois**

> Nesta execução gravada com o GPT-6 Luna: 6 de 20 (30%), 19 decisões de passar e uma de recusar. Os 14 erros foram passar a vez, inclusive no R12. Isso descreve estes casos, sem garantir segurança geral; a nota mede decisões, não a qualidade das respostas. Aqui repetimos a gravação; na sua máquina, o comando chama o modelo de verdade.

**Fonte:** saidas.json: r02-medir; gravacoes/r02-medir.json; projeto/agente.py: passar; projeto/medir.py; scripts/saidas.py: com_gravacao.

## Evidência do projeto

- `projeto/baseline.py`, função `avaliar`: compara a decisão devolvida com `c.decisao` e soma acertos. Não lê resposta
  textual, não consulta compras e não mede exposição de dados.
- `saidas.json`, entrada `sempre-responder`: o comando usa `lambda q: Decisao.RESPONDER`; os oito acertos são oito
  decisões, sem resposta ao cliente. A variante `r01-nota-sempre-responder` também dá 8/20 (40%).
- `projeto/medir.py`, função local `decidir`: executa o grafo inteiro, mas devolve apenas `["decisao"]` para `avaliar`.
- `saidas.json`, `r02-medir`: 6/20 (30%) e 14 erros, todos com decisão `passar`, incluindo R12.
- `gravacoes/r02-medir.json`: 20 escolhas estruturadas, sendo 19 `passar` e uma `recusar` (o pedido do CPF da prima).
  Há 21 chamadas gravadas: a recusa pede uma chamada adicional para escrever a resposta. O motivo do R12 diz:
  “Não há dados disponíveis sobre o pedido BT-1001 para consultar seu status.”
- `projeto/agente.py`, `montar`: nenhum nó consulta os arquivos em `dados/`. O nó `passar` devolve a frase fixa
  “Vou passar a sua mensagem para uma pessoa da equipe.”
- `scripts/saidas.py`, `com_gravacao`: usa `repetir` por padrão; `scripts/gravacao/gravacao.py` interrompe chamada sem
  gravação antes da rede. `executar` normaliza o caminho da máquina e `sem_tempo` desconsidera tempos e outros ruídos
  declarados. A comparação cobre saídas e estados construídos pelos roteiros, não a qualidade atual do serviço.

## Conferência na página montada

O `dist` produzido pelo `npm test` foi servido apenas em `127.0.0.1:4387`. No Chrome headless, com viewport
1440 × 1100, foram lidos os textos renderizados e acionados os controles reais da IDE pelo navegador:

- `/ciclo-de-vida/00-introducao/`: os três parágrafos de “Um livro que executa”, com inspeção visual da renderização.
- `/ciclo-de-vida/01-o-problema-e-o-contrato/`: explicações dos passos 17 e 18, bloco da régua, comando
  `uv run python baseline.py` digitado no terminal da página, investimento em 25%, troca de `PASSAR` para `RESPONDER`
  no editor e investimento em “Sobe”. A saída mostrou 8/20 (40%) e o chat explicou que a função não escreve resposta
  nem mostra compras. O fecho do passo 18 apresentou a mesma distinção. O “Pare e pense” de 1.7 foi aberto e
  inspecionado visualmente: “essa escolha poderia expor dados de outra pessoa”.
- `/ciclo-de-vida/02-o-primeiro-agente/`: abertura do passo 10, os quatro blocos de `medir.py`, comando
  `uv run python medir.py` digitado no terminal da página e investimento em “um pouco mais que a nota de partida”.
  A nota e o fecho apareceram no chat com os limites da medição. O terminal identificou a gravação de 24/10/2026,
  `gpt-6-luna`, 21 chamadas. Foram abertos e inspecionados o “Pare e pense” de comparação de 2.6, o gancho das
  ferramentas e o último item do resumo.

Esses comandos foram digitados na página, que revelou as saídas existentes; não foram executadas chamadas pagas.
Não se acrescentou interação, não se alteraram ações dos roteiros nem se criou teste que repete a redação.

## Ritmo

`npm run ritmo` terminou com código 0 antes e depois. Os avisos permaneceram **3 / 2 / 0** na introdução e nos
capítulos 1 e 2, respectivamente. Nenhum trecho ultrapassou 400 palavras. A maior faixa da introdução aumentou
36 palavras; seu aviso já existia.

| Faixa afetada | Antes | Depois |
|---|---:|---:|
| Introdução, de Aposta até PareEPense, incluindo “Um livro que executa” | 319 | 355 |
| Capítulo 1, 1.7 até Exercicio | 211 | 214 |
| Capítulo 2, final de 2.6 até Exercicio | 199 | 186 |

Os demais trechos mantiveram a contagem. O experimento continuou com seu aviso de 244 palavras. A contagem não
substitui a revisão de leitura do Erick.

Saída completa depois:

```text
> ritmo
> node scripts/ritmo.mjs


ciclo-de-vida/00-introducao
    Por que este livro existe      76 palavras ~0.4 min  ███  → Aposta
  ⚠ Por que este livro existe     355 palavras ~1.8 min  ██████████████  → PareEPense
  ⚠ O que você vai construir      246 palavras ~1.2 min  ██████████  → PareEPense
  ⚠ Como ler                      210 palavras ~1.1 min  ████████  (fim)

ciclo-de-vida/01-o-problema-e-o-contrato
    1.1 O que é um agente         161 palavras ~0.8 min  ██████  → PareEPense
    1.1 O que é um agente         200 palavras ~1.0 min  ████████  → FiguraLaco
    1.1 O que é um agente          97 palavras ~0.5 min  ████  → Aposta
    1.1 O que é um agente         134 palavras ~0.7 min  █████  → PareEPense
    1.2 Um agente começa antes d   39 palavras ~0.2 min  ██  → Aposta
    1.2 Um agente começa antes d  183 palavras ~0.9 min  ███████  → Pilhas
  ⚠ 1.4 O que é um contrato       273 palavras ~1.4 min  ███████████  → Troca
    1.4 O que é um contrato       177 palavras ~0.9 min  ███████  → Aposta
    1.4 O que é um contrato       115 palavras ~0.6 min  █████  → PareEPense
    1.5 As quatro decisões        108 palavras ~0.5 min  ████  → Classificador
    1.5 As quatro decisões        198 palavras ~1.0 min  ████████  → IdeCapitulo
  ⚠ 1.7 O que ficou de pé         214 palavras ~1.1 min  █████████  → Exercicio

ciclo-de-vida/02-o-primeiro-agente
    2.1 Um agente desenhado       111 palavras ~0.6 min  ████  → PareEPense
    2.1 Um agente desenhado        67 palavras ~0.3 min  ███  → PareEPense
    2.2 O modelo decide, o contr   33 palavras ~0.2 min  █  → PareEPense
    2.2 O modelo decide, o contr   65 palavras ~0.3 min  ███  → Pilhas
    2.3 Testar sem pagar          147 palavras ~0.7 min  ██████  → PareEPense
    2.4 Medir com a mesma régua   150 palavras ~0.8 min  ██████  → PareEPense
    2.5 Mão na massa               67 palavras ~0.3 min  ███  → IdeCapitulo
    2.6 O que ficou de pé          48 palavras ~0.2 min  ██  → PareEPense
    2.6 O que ficou de pé          86 palavras ~0.4 min  ███  → GrafoAgente
    2.6 O que ficou de pé         186 palavras ~0.9 min  ███████  → Exercicio

experimentos/segundo-cerebro-local
                                   67 palavras ~0.3 min  ███  → Aposta
  ⚠ O que vamos construir         244 palavras ~1.2 min  ██████████  → PareEPense
    Por que o prazo engana        102 palavras ~0.5 min  ████  → IdeCapitulo
    Mão na massa                   75 palavras ~0.4 min  ███  → Pilhas
    O que fica local               66 palavras ~0.3 min  ███  (fim)

aviso acima de 200 palavras sem ação; falha acima de 400 (docs/RITMO.md)
```

## Testes

`npm test` terminou com código 0, usando as gravações existentes:

- build: 9 páginas;
- conferência: 29 saídas do livro e 16 do experimento, iguais às gravadas;
- testes do livro: 112 passaram, 0 falharam;
- testes da gravação: 5 passaram.

Na primeira tentativa, o sandbox impediu escrita no cache do uv; a execução autorizada com acesso ao cache concluiu
as conferências. Uma execução intermediária encontrou o teste existente que exige o percentual no início do fecho
da IDE do capítulo 2. A explicação passou a começar com “30% nesta execução gravada”; o teste foi preservado.
Não se alteraram testes. `git diff --check` também passou.

Saída completa da execução final:

```text
> test
> astro build && npm run saidas:conferir && npm run experimentos:conferir && node --test "testes/*.test.mjs" && npm run gravacao:testar

22:00:29 [content] Syncing content
22:00:29 [content] Synced content
22:00:29 [types] Generated 343ms
22:00:29 [build] output: "static"
22:00:29 [build] mode: "static"
22:00:29 [build] directory: /home/erick-marinho/mentoria-estudos/poc_livro/dist/
22:00:29 [build] Collecting build info...
22:00:29 [build] ✓ Completed in 377ms.
22:00:29 [build] Building static entrypoints...
22:00:30 [vite] ✓ built in 369ms
22:00:30 [vite] ✓ built in 363ms
22:00:30 [build] Rearranging server assets...

 generating static routes 
22:00:30   ├─ /404.html (+14ms) 
22:00:30   ├─ /ciclo-de-vida/00-prefacio/index.html (+1ms) 
22:00:30   ├─ /experimentos/index.json (+2ms) 
22:00:30   ├─ /experimentos/segundo-cerebro-local/index.html (+266ms) 
22:00:31   ├─ /experimentos/index.html (+2ms) 
22:00:31   ├─ /guias/segundo-cerebro-local/index.html (+1ms) 
22:00:31   ├─ /guias/index.html (+0ms) 
22:00:31   ├─ /livros/index.json (+1ms) 
22:00:31   ├─ /livros/index.html (+1ms) 
22:00:31   ├─ /ciclo-de-vida/00-introducao/index.html (+22ms) 
22:00:31   ├─ /ciclo-de-vida/01-o-problema-e-o-contrato/index.html (+80ms) 
22:00:31   ├─ /ciclo-de-vida/02-o-primeiro-agente/index.html (+52ms) 
22:00:31   ├─ /ciclo-de-vida/index.html (+1ms) 
22:00:31   ├─ /index.html (+1ms) 
22:00:31 ✓ Completed in 554ms.

22:00:31 [build] ✓ Completed in 1.31s.
22:00:31 [build] 9 page(s) built in 1.69s
22:00:31 [build] Complete!

> saidas:conferir
> for l in livros/*/; do python3 scripts/saidas.py "$(basename "$l")" --conferir || { echo "falhou no livro $(basename "$l")" >&2; exit 1; }; done

conferidas 29 saídas: iguais às do livro

> experimentos:conferir
> for g in experimentos/*/; do python3 scripts/saidas.py "${g%/}" --conferir || exit 1; done

conferidas 16 saídas: iguais às do livro
✔ a aposta mostra três mensagens de verdade e diz que o agente é ilustração (14.162182ms)
✔ as pilhas separam como o contrato, que vem do referencia.jsonl (2.036963ms)
✔ a troca tem uma variante que o contrato pega, e o veredito sai da comparação (0.928984ms)
✔ caso que não existe não monta (0.998263ms)
✔ capítulo 2: as pilhas de quem faz cada passo saem do grafo-02.json, e a recusa é do modelo (3.126015ms)
✔ capítulo 1: os pare e pense da ferramenta e dos nomes das pilhas falam de dado que existe (0.645919ms)
✔ capítulo 1: a aposta da escala tem um item em cada ponto, e o roteador é o agente do capítulo 2, de quatro decisões (0.587598ms)
✔ capítulo 2: o agente do desenho fica no roteador da escala do capítulo 1 (2.076107ms)
✔ todo pare e pense tem a lâmpada no rótulo e o olho no "Ver a resposta", e nenhum losango (173.235234ms)
✔ capítulo 1: a aposta das camadas usa o R12 como aconteceu na gravação do capítulo 2, e cada camada aponta um capítulo do sumário (6.137695ms)
✔ capítulo 2: o molde garantiu a forma das 20 e não a decisão; os números são os da gravação (6.660012ms)
✔ a epígrafe sai com autor, obra e ano (1.56783ms)
✔ os três jeitos da figura 1.1 têm um caminho para cada jeito e cada pergunta (1.190429ms)
✔ o que as ferramentas devolvem na figura bate com os dados da loja (0.507053ms)
✔ a pergunta da figura com pedido traz o e-mail do dono, como o contrato exige (2.16243ms)
✔ o mapa é um anel e uma coluna, com um nó para cada fase do ciclo.json (25.887022ms)
✔ a volta sai de 'quando dá errado' e entra em 'avaliar', e Evoluir volta de Observar a Construir (2.038484ms)
✔ um cartão por fase, com o nome e a pergunta à vista, e o resto dentro (2.655213ms)
✔ cada problema da aposta entra numa cena e para na fase que o pega, a resposta da aposta (1.061466ms)
✔ a animação cabe no docs/RITMO.md: até 6 cenas, 45 s, 8 s por cena e 12 palavras por legenda (0.602728ms)
✔ cada nó do mapa mostra que abre o cartão, e o mapa tem o modal e a dica; a miniatura não abre nada (22.733159ms)
✔ quem já investiu, ou está no modo direto, lê o caminho, e não a pergunta; quem não investiu, a pergunta (1.002426ms)
✔ cenas que contradizem a aposta não montam a figura (1.316096ms)
✔ o mapa da introdução tem a animação, além do desenho parado (4.01829ms)
✔ na abertura dos capítulos, o anel em miniatura acende a fase do capítulo, e o leitor de tela lê a lista (41.085791ms)
✔ o cofre no tempo: três notas dizem que a entrega é 14/11 e uma diz 21/11; entregar as telas não conta (14.196276ms)
✔ o caminho da pergunta é o vídeo do Remotion, e os números dele são os das saídas gravadas (3.536858ms)
✔ o caminho da pergunta: sem a data, 14/11 de uma nota velha; com ela, 21/11, com a velha ao lado (0.546258ms)
✔ a aposta da abertura: as três promessas, e os números do que o experimento mostrou são os da régua gravada (4.455132ms)
✔ as pilhas do fim: três peças ficam na máquina, três saem dela, e a explicação só aparece depois (53.734733ms)
✔ a lista tem um link para cada experimento, e cada link abre uma página montada (8.00025ms)
✔ cada saída gravada do experimento aparece na página, linha por linha: no terminal, ou nos dados da IDE e das figuras (70.321823ms)
✔ os endereços antigos dos guias levam aos experimentos (0.772463ms)
✔ cada experimento tem as partes do texto do molde: o que vamos construir, a IDE com aposta, o inventado e a opinião dos autores (1.184379ms)
✔ a página abre com o que se testa e fecha com o que deu, com os números das saídas gravadas (50.778556ms)
✔ a figura da introdução é o vídeo, com um cenário para cada decisão, e as decisões são as do contrato (3.156673ms)
✔ o vídeo cabe em 130 segundos (1.226528ms)
✔ a aposta é no R12 e para antes da decisão: nem a pílula nem a legenda contam a resposta antes (1.284139ms)
✔ sem JS e na impressão, fica a conversa do R01 em texto: a pergunta do contrato e a resposta do roteiro (12.801919ms)
✔ um roteiro que contradiz o contrato não monta a figura (8.157884ms)
✔ o capítulo 01-o-problema-e-o-contrato.mdx segue o formato (4.033889ms)
✔ o capítulo 02-o-primeiro-agente.mdx segue o formato (1.21416ms)
✔ o formato pega o capítulo que sai dele (3.668827ms)
✔ o desenho sai das setas gravadas do grafo real, em camadas (3.622234ms)
✔ a figura descreve exatamente os nós que o grafo tem (0.492681ms)
✔ um ciclo no grafo para a figura, em vez de desenhar errado (0.744116ms)
✔ os caminhos são os da gravação, e somam a nota do agente (5.265998ms)
✔ a página traz as duas figuras: o desenho na 2.1 e os caminhos na 2.6 (2.765366ms)
✔ 18 passos cobrem as 40 ações do roteiro, sem buraco (1.1734ms)
✔ o projeto nasce da pasta vazia: uv init em ~, o main.py apagado, e o que o uv add mudou (0.989768ms)
✔ o sinal de cada passo sai da saída gravada (0.495244ms)
✔ o caminho do erro chega dobrado: o contrato.py à vista, as bibliotecas dentro da dobra (0.535293ms)
✔ o livro não monta com buraco entre passos (1.837242ms)
✔ a página traz a IDE do capítulo, e nenhum texto de exemplo (2.758198ms)
✔ o código entra por blocos lógicos, e cada bloco cai nas linhas certas do arquivo daquele momento (0.683816ms)
✔ a pergunta do id: só a resposta certa segue o padrão do contrato real (0.478933ms)
✔ a pergunta do pedido: o roteiro mostra o caso apressado passando antes da regra (0.570355ms)
✔ o livro não monta com um bloco que não está no arquivo, nem com palavra fora do glossário (89.808034ms)
✔ o ponto de volta só aparece com o repositório do leitor, e aponta a tag do fim do passo anterior (170.233897ms)
✔ todo passo abre com a mensagem do autor ao chat, e o rascunho fica marcado até o autor revisar (161.446886ms)
✔ o rodapé sabe o Python do projeto: o que o uv achou ao criar o .venv (90.1643ms)
✔ o capítulo 1 abre numa pasta vazia; o 2, com o projeto do fim do 1 (81.326047ms)
✔ o comando que chamou o modelo diz quando e com qual foi gravado; os outros, não (0.161454ms)
✔ o resumo da gravação sai do arquivo gravado de verdade (1.100134ms)
✔ o capítulo 2: 10 passos sem buraco, um erro de verdade no caminho, e a IDE abre no contrato (0.18715ms)
✔ o texto do capítulo 2 diz a nota que a gravação deu (0.635457ms)
✔ modificar antes de criar: as variantes trazem a saída gravada de cada troca, e a linha certa do arquivo (0.181473ms)
✔ a aba de problemas sai da saída gravada: arquivo e linha quando a saída diz, só a mensagem quando não diz (0.202838ms)
✔ as dúvidas chegam às ações do roteiro, no máximo duas, cada uma com resposta (0.220206ms)
✔ o livro não monta com dúvida demais numa ação (75.023095ms)
✔ a pasta do projeto vem do livro: sem ela, a IDE não monta (0.989546ms)
✔ cada capítulo do sumário está em uma fase do ciclo, e só em uma (1.972941ms)
✔ a aposta usa os problemas do primeiro parágrafo, e cada resposta é uma fase que diz o capítulo certo (1.014051ms)
✔ a página tem a aposta, o mapa com as oito fases e as quatro referências (0.436997ms)
✔ na abertura de cada capítulo, a fase acesa é a do ciclo.json, e o link leva ao mapa da introdução (6.644203ms)
✔ 1. o atendente sem acesso ao sistema: a Carla pergunta do BT-1003, e ele chuta a resposta dos três jeitos (3.321859ms)
✔ 2. o atendente com a ficha: com o pedido, a ficha vai até o fim; com a frigideira, trava no passo 1, que não prevê produto (1.409198ms)
✔ 3. a atendente é o leitor: o catálogo devolve o que a ferramenta dos três jeitos devolve; responder depois acerta, antes erra (1.1692ms)
✔ os quadros falam como para quem começa do zero: sem jargão; o nome técnico só no fim de cada história (1.067758ms)
✔ o fim diz quem decide em cada história, e o que cada jeito acertou, nos três jeitos (0.569718ms)
✔ o 1.1 tem a figura das histórias, no lugar dos três jeitos e do Pendente, sem a figura em texto (89.43244ms)
✔ a figura não é mais vídeo: saíram a composição do laço e o player contínuo (1.007637ms)
✔ o mapa da introdução avança sobre a base das animações, e não tem um Player só dele (2.956723ms)
✔ cada livro tem um card, e o card abre uma página montada do próprio livro (4.724972ms)
✔ o card conta os capítulos escritos contra os do sumário (1.443582ms)
✔ a introdução leva ao capítulo 1, o 1 ao 2, e cada um volta ao anterior (10.920725ms)
✔ todo link de anterior e próximo aponta para uma página montada (7.241579ms)
✔ o capítulo 1 tem a nota de partida e pergunta pelo capítulo 2 (17.550182ms)
✔ o capítulo 2 soma a nota do agente e pergunta pelo capítulo 3 (6.424845ms)
✔ o relógio conta as palavras até a ação, e recomeça depois dela (4.198116ms)
✔ abrir, assistir ou rodar não desliga o relógio; escolher e comparar desliga (0.864113ms)
✔ o texto de uma nota conta; o de um Pendente, não (0.670343ms)
✔ componente novo sem classificação para o relógio (0.821043ms)
✔ nenhum texto passa de 400 palavras sem o leitor agir; acima de 200, só um aviso no relatório (12.298457ms)
ℹ aviso: ciclo-de-vida/00-introducao, Por que este livro existe: 355 palavras até PareEPense
ℹ aviso: ciclo-de-vida/00-introducao, O que você vai construir: 246 palavras até PareEPense
ℹ aviso: ciclo-de-vida/00-introducao, Como ler: 210 palavras até o fim
ℹ aviso: ciclo-de-vida/01-o-problema-e-o-contrato, 1.4 O que é um contrato: 273 palavras até Troca
ℹ aviso: ciclo-de-vida/01-o-problema-e-o-contrato, 1.7 O que ficou de pé: 214 palavras até Exercicio
ℹ aviso: experimentos/segundo-cerebro-local, O que vamos construir: 244 palavras até PareEPense
✔ um Rascunho só aceita uma ação do leitor, e diz se o dado é real ou ilustração (1.251553ms)
✔ nenhum capítulo ou experimento publica com Rascunho: cada um vira o componente de verdade, ou sai (1.865841ms)
✔ o relógio conta o Rascunho como ação, e o texto de dentro não entra (0.734229ms)
✔ a raiz leva à estante (4.043583ms)
✔ /ciclo-de-vida/ abre o livro pela introdução, uma página que existe (1.223758ms)
✔ o que não existe mostra a página em construção, com o caminho para os livros e os experimentos (0.981596ms)
✔ em toda página a marca leva à home, e as páginas do site têm o Início no mesmo endereço (121.530708ms)
✔ o endereço antigo do prefácio leva à introdução (0.496253ms)
✔ cada termo tem uma definição curta e um capítulo do sumário (3.624102ms)
✔ o termo é achado com maiúscula e no plural, e não dentro de outra palavra (5.132864ms)
✔ a introdução tem os termos, e cada um aparece no corpo dela (29.808476ms)
✔ /livros/index.json tem os livros da estante, na mesma ordem (13.157798ms)
✔ /experimentos/index.json tem os experimentos da lista, o mais novo em cima (5.389049ms)
✔ o leitor lê "capturado", e não "pego" nem "apanhado", na introdução: no texto, na aposta, nas cenas, nos cartões e na animação (18.728076ms)
✔ o leitor investe, e não aposta, no livro todo: nas páginas, nos textos, nos roteiros, nos dados e nos componentes (505.257686ms)
✔ o problema do custo diz que é o gasto com o modelo, e não "a conta": no texto, na caixa e na animação (3.646703ms)
✔ capítulo 1: a ferramenta é a primeira etapa, e não "o primeiro conserto" (8.413873ms)
✔ o livro executa, e não roda: nas páginas, nos textos, nos roteiros, nos dados e nos componentes; e a caixa das camadas diz "Onde é capturado" (349.51635ms)
ℹ tests 112
ℹ suites 0
ℹ pass 112
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1394.812031

> gravacao:testar
> uv run --frozen --project livros/ciclo-de-vida/projeto pytest -q -p no:cacheprovider testes/test_gravacao.py

.....                                                                    [100%]
5 passed in 1.84s
```
