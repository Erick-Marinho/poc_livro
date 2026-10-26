# Para o Erick — menos abstração antes da primeira entrega

26/10/2026. Etapa 5 implementada, **aguardando revisão**. A etapa 4 foi fechada no commit `5f57bba`, com o ok
“Erick, 26/10/2026” registrado para `5b0e223` e `cab74ad`.

(redação: GPT-6)

## Antes e depois dos trechos

### Introdução: primeiro pare e pense

**Antes**

> No mapa, Avaliar vem depois de Construir. Por que, então, o capítulo 1 escreve a régua antes de existir agente?
>
> Porque avaliar começa no planejamento. A régua nasce com o contrato, antes do código, e a fase de avaliar só a
> amplia, com conversas inteiras e erros com peso. Medir só depois de construir é tarde: não haveria como saber se o
> primeiro agente melhorou alguma coisa.

**Depois**

> No mapa, Avaliar vem depois de Construir. Por que, então, o capítulo 1 já decide o que fazer quando o Bruno pede o
> pedido da Ana, antes de existir agente?
>
> Porque avaliar começa no planejamento. Antes do código, o capítulo guarda perguntas da loja e a decisão esperada
> para cada uma; mais tarde, a fase de avaliar amplia essa base com conversas inteiras e erros com peso. Medir só
> depois de construir seria tarde: não daria para saber se o primeiro agente melhorou alguma coisa.

O caso concreto substitui “régua” e antecipa somente o que a introdução já apresentou: Bruno não pode receber o
pedido da Ana. A fonte da decisão é R12 em `projeto/referencia.jsonl` e a titularidade em
`projeto/dados/pedidos.json`.

### Introdução: segundo pare e pense

**Antes**

> Responder uma que devia passar. O primeiro custa o tempo de uma pessoa da equipe; o segundo pode mostrar o pedido
> de um cliente a outro, como no caso R12 da régua. Por isso, no capítulo 4, os erros passam a ter peso.

**Depois**

> Responder uma que devia passar. O primeiro custa o tempo de uma pessoa da equipe; o segundo pode tentar responder
> ao Bruno sobre o pedido da Ana e expor dados de outra pessoa. Por isso, no capítulo 4, os erros passam a ter peso.

A pergunta não mudou. A resposta agora descreve o risco do caso em vez de depender do id e do nome da medida. A
fonte continua sendo R12; “tentar responder” não afirma que o agente chegou a mostrar a compra.

### Aposta das fases

O texto interno de manutenção também deixou de chamar R12 de “caso da régua” e passou a identificá-lo como o pedido
da Ana feito pelo Bruno.

**Perguntas imprevistas — antes**

> Ninguém escreve caso para o que não previu. Quando a pergunta aparece no uso, vira caso novo da régua, e a régua
> passa a capturá-la (capítulo 7).

**Depois**

> Quando a pergunta aparece no uso, Quando dá errado investiga a falha e a transforma numa pergunta nova com a
> decisão esperada (capítulo 7). Evoluir só entra se a correção pedir comparar uma troca de modelo ou de instrução.

Justificativa: `ciclo.json` define **Quando dá errado** como investigar falhas reais e transformá-las em caso de
teste; **Evoluir** compara uma mudança. A pergunta que apareceu no uso pertence à primeira fase até que uma mudança
precise ser comparada. A opção correta continua “Quando dá errado”.

**Pedido de outra pessoa — antes**

> É um caso escrito antes de existir agente: o R12 da régua do capítulo 1, em que o Bruno pede o pedido da Ana.

**Depois**

> Antes de existir agente, Planejar já registra que o Bruno pede o pedido da Ana e que a loja deve recusar
> (capítulo 1).

Justificativa: `ciclo.json` pergunta, em **Planejar**, o que o agente pode fazer e como saber se acertou. R12 registra
a decisão esperada antes do agente existir. As alternativas Pôr no ar e Observar dependem de uma execução já em uso.

**Versão nova do modelo — antes**

> Trocar de modelo é Evoluir (capítulo 9), e quem mostra o que estragou é a mesma régua, executada de novo antes da
> troca.

**Depois**

> Avaliar mede onde o agente atual erra. Evoluir compara a versão atual e a nova nas mesmas perguntas antes da troca,
> para descobrir se uma melhora esconde outra piora (capítulo 9).

Justificativa: `ciclo.json` separa **Avaliar**, que mede a versão corrente, de **Evoluir**, que compara a mudança sem
perder o que já funcionava. Como o item exige uma versão nova e a comparação entre versões, Evoluir é a resposta
mais específica. Construir apenas põe o primeiro agente de pé.

O item do gasto não mudou: Observar continua claramente melhor entre suas três opções, pois `ciclo.json` atribui à
fase a leitura de custo por conversa; impor um limite seria Governar, opção que não aparece ali.

### 1.1: a escala depois do caso

**Antes:** o parágrafo apresentava fluxo fixo, roteador, agente e vários agentes antes da figura 1.1.

**Depois:** a figura e a nota com a definição vêm primeiro. Imediatamente antes da aposta, o texto resume o que o
leitor acabou de ver:

> Com ferramentas na mesa, a pergunta deixa de ser “é agente ou não é” e vira “quanto o modelo decide”. Dá para
> pensar numa escala. Num ponto está o **fluxo fixo**: o seu código decide a ordem. Um passo adiante, o **roteador**:
> o modelo toma uma decisão só, entre caminhos desenhados por você. Mais adiante, o **agente** decide o próximo passo
> a cada volta: usar uma ferramenta, responder ou parar. No fim ficam **vários agentes**, cada um especialista,
> coordenados por um deles.

A citação da Anthropic permanece na nota logo anterior; a de Nicole Koenigstein permanece depois da aposta. A
figura 1.1 e seus componentes não mudaram.

### Aposta da escala

**Antes**

> Um coordenador que divide o atendimento entre um especialista em trocas e outro em entregas.

**Depois**

> Um agente coordenador que divide o atendimento entre um agente de trocas e outro de entregas.

Justificativa: “coordenador” e “especialista” sozinhos também podiam descrever um roteador com dois fluxos fixos.
Os três agentes explícitos tornam “vários agentes” a única resposta compatível com a definição. Os outros itens já
eram inequívocos: ordem sempre igual é fluxo fixo; uma escolha entre quatro caminhos é roteador; decidir novamente
depois da ferramenta é agente.

### 1.4: contrato até a primeira ação

**Antes:** três parágrafos explicavam a política, a origem jurídica e a variação do agente em 273 palavras antes da
troca de prompt.

**Depois**

> Na loja, o combinado já existe: a política de atendimento. Ela permite troca por defeito em até 90 dias, proíbe
> desconto e manda todo reembolso para uma pessoa. Um atendente a lê antes do primeiro cliente. O contrato torna esse
> combinado conferível: guarda perguntas com a decisão certa para cada uma.
>
> A ideia vem do direito: um acordo escrito antes. Em software, Bertrand Meyer chamou de projeto por contrato a
> rotina que declara o que exige e o que garante. A promessa deixa de ficar escondida no código e pode ser conferida.
>
> No agente, o modelo escolhe o caminho e pode escrever uma frase diferente a cada vez. Por isso o contrato deste
> livro fixa decisões, não frases: as palavras podem variar; a decisão, não.

O relógio agora mede 145 palavras até a troca. Permaneceram a política em `projeto/dados/politica.md`, Meyer, a
troca de prompt, a definição do contrato e as quatro camadas decididas nos planos anteriores.

### 1.5: Classificador

**Antes:** os oito casos incluíam R18, “Esta é a terceira vez que escrevo. Quero falar com alguém agora.”

**Depois:** R18 foi substituído por R16, “Quero falar com uma pessoa.”

Justificativa: a política não define o que fazer diante de insistência ou irritação; responder e passar eram
defensáveis em R18 apesar da referência marcar passar. R16 pede uma pessoa explicitamente e deixa passar como a
resposta inequívoca. R19 permaneceu: boleto em doze vezes não está na política, então o contrato manda passar, não
inventar uma proibição para recusar; o parágrafo logo abaixo explica esse limite.

## Auditoria sem mudança

- **Camadas:** os quatro exemplos continuam separados pelo contrato: texto livre em vez do enum é formato; decisão
  errada em R12 é comportamento; argumento inválido é ferramenta; instrução não identificável é execução.
- **Pilhas:** R03, R06 e R07 têm resposta nos dados; R10 pede chamado; R15 viola a proibição explícita de expor
  dados; R16 pede atendimento humano. Não apareceu segunda resposta igualmente sustentada pelo contrato.
- **Vocabulário antecipado:** “régua” e “R12” saíram dos dois pare e pense e das respostas em que o caso da loja
  bastava. O mapa ainda usa “régua” em cartões definidos por `ciclo.json`; isso foi preservado porque o termo recebe
  a explicação decidida em `termos.json` e mudar o mapa ultrapassaria a ordem aprovada.
- **Limite:** a partir de `## 1.6`, o capítulo está idêntico ao commit anterior. IDE, componentes, desenhos, projeto,
  roteiro e gravações não mudaram.

## Proposta não aplicada

A aposta das fases continua antes do mapa por decisão registrada em `ajustes-da-introducao.md`. Nesse ponto, o
leitor ainda não viu as definições das opções. Para o Erick decidir: ou a aposta passa para depois do mapa, revendo
essa decisão, ou cada opção ganha uma glosa curta, derivada de `ciclo.json`, que apresenta a fase sem entregar a
resposta. Nenhuma das duas mudanças foi aplicada nesta etapa.

## Verificação

`npm run ritmo`:

```text
introdução: 3 avisos
capítulo 1: 1 aviso (1.7, fora do escopo; antes eram 2)
capítulo 2: 0 avisos
1.4 até a primeira ação: 145 palavras (antes, 273)
```

`npm test`:

```text
conferidas 30 saídas: iguais às do livro
conferidas 16 saídas: iguais às do livro
tests 115
pass 115
fail 0

.....                                                                    [100%]
5 passed in 2.65s
```

Isso inclui os testes das apostas, do formato e do vocabulário. Não houve chamada paga nem regravação.

Na página montada, foram conferidos: as quatro respostas da aposta e suas justificativas; os dois pare e pense sem
“régua” ou “R12”; a figura 1.1 antes da escala e a escala antes da aposta; o novo início de 1.4; e R16 no lugar de
R18 no Classificador. Estado: **aguardando revisão do Erick**.
