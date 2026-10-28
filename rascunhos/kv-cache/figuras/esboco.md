# Esboço das figuras (etapa 4)

Duas figuras, no mesmo formato do `pausa-e-fluxo`: seis cenas cada, uns 3 s por cena depois do play, o desenho inteiro
à vista, sem câmera e sem zoom; o que já passou vira uma linha de resumo embaixo, à esquerda. **Nenhuma mostra o
resultado:** sem números da coleta; os tamanhos são ilustração e a figura diz isso.

## Figura 1: os quatro caches (abre o texto)

**Pergunta que ela responde:** quando alguém diz "cache", o que fica guardado, e por quanto tempo? **O que o leitor
faz:** aperta o play e sai com os dois grupos na cabeça, antes do experimento.

### Como fica na cena 6 (a largura do computador)

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ 6 DE 6 · DOIS GRUPOS                                                          │
│                                                                               │
│   guardam a leitura                            guarda a resposta              │
│  ┌──────────────────────────────────────┐     ┌──────────────────────────┐    │
│  │ KV          dentro de uma resposta   │     │ semântico                │    │
│  │ prefixo     entre pedidos, no        │     │ pergunta parecida,       │    │
│  │             mesmo servidor           │     │ resposta já pronta       │    │
│  │ prompt      entre pedidos, na API    │     │                          │    │
│  └──────────────────────────────────────┘     └──────────────────────────┘    │
│   = a mesma resposta, mais rápida               ≈ pode errar                  │
│                                                                               │
│   ✓ KV  ✓ prefixo  ✓ prompt  ✓ semântico     ╭─────────────────────────────╮  │
│                                              │ Três guardam a leitura e    │  │
│                                              │ não mudam a resposta. Um    │  │
│                                              │ guarda a resposta e pode    │  │
│                                              │ errar.                      │  │
│                                              ╰─────────────────────────────╯  │
│ ▶ Tocar                                                 ↕ Rolar com a página  │
└───────────────────────────────────────────────────────────────────────────────┘
```

### As seis cenas

| # | Nome | O que entra | O balão (uma frase) | O resumo que fica |
|---|---|---|---|---|
| 1 | Ler e escrever | a mensagem, o modelo e a resposta, como no `pausa-e-fluxo`: ele lê tudo, depois escreve uma palavra por vez | O modelo lê a mensagem e escreve a resposta. | lê, depois escreve |
| 2 | KV | embaixo do modelo, uma fileira de anotações cresce, uma por palavra lida ou escrita; a resposta acaba e a fileira some | O KV guarda a leitura de cada palavra, até a resposta acabar. | KV: dentro de uma resposta |
| 3 | Prefixo | dois pedidos que começam igual, em blocos; os blocos iguais acendem e são reaproveitados; no terceiro pedido, um bloco do meio muda e os seguintes apagam, mesmo iguais | O servidor reaproveita o começo igual, bloco a bloco, até o primeiro diferente. | prefixo: entre pedidos, no servidor |
| 4 | Prompt | o mesmo começo igual, agora do lado do provedor; ao lado, uma etiqueta de preço: "1ª vez: um pouco mais caro" e "depois: bem mais barato" | Na API, o provedor faz o mesmo e cobra menos pelo começo repetido. | prompt: entre pedidos, na API |
| 5 | Semântico | "Posso fazer mudança no sábado?" e "Não posso fazer mudança no sábado?" caem na mesma resposta pronta, porque o texto é parecido | O semântico devolve uma resposta pronta para perguntas parecidas, e pode errar. | semântico: a resposta pronta |
| 6 | Dois grupos | o desenho acima | Três guardam a leitura e não mudam a resposta. Um guarda a resposta e pode errar. | — |

## Figura 2: o que vamos construir

**Pergunta que ela responde:** o que muda quando o modelo guarda (ou não) as anotações, e o que o medidor vai
cronometrar? **O que o leitor faz:** aperta o play e, no fim, leva a pergunta para a aposta da IDE.

### Como fica na cena 2 (a largura do computador)

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ 2 DE 6 · ESCREVER COM AS ANOTAÇÕES                                            │
│                                                                               │
│   a mensagem             a atendente               a resposta                 │
│  ┌──────────────┐      ┌───────────────┐      ┌───────────────────────────┐   │
│  │ Mudanças: de │      │ lê só: "você" │ ───▶ │ Sim, você ▌               │   │
│  │ segunda a    │      └───────┬───────┘      └───────────────────────────┘   │
│  │ sexta…       │              │ olha                                         │
│  └──────────────┘              ▼                                              │
│                        as anotações                                           │
│                       ┌┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┐  uma por palavra lida           │
│                       └┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┘                                 │
│                                                ╭────────────────────────────╮ │
│   ✓ lê tudo uma vez e anota                    │ Para a palavra nova, ela   │ │
│                                                │ lê só a última e olha as   │ │
│                                                │ anotações.                 │ │
│                                                ╰────────────────────────────╯ │
│ ▶ Tocar                                                 ↕ Rolar com a página  │
└───────────────────────────────────────────────────────────────────────────────┘
```

### As seis cenas

| # | Nome | O que entra | O balão (uma frase) | O resumo que fica |
|---|---|---|---|---|
| 1 | Ler e anotar | a mensagem desliza para a atendente; a cada palavra lida, uma anotação cai na fileira | Com o cache, ela lê tudo uma vez e anota cada palavra. | lê tudo uma vez e anota |
| 2 | Escrever com as anotações | o desenho acima: a palavra nova sai depois de ler só a última; a fileira ganha uma anotação | Para a palavra nova, ela lê só a última e olha as anotações. | com cache: lê só a última |
| 3 | Escrever sem anotações | a fileira some; antes de cada palavra nova, a mensagem inteira e a resposta até ali passam de novo pela atendente, e a pilha cresce a cada palavra | Sem o cache, ela relê tudo antes de cada palavra nova. | sem cache: relê tudo |
| 4 | O que as anotações ocupam | a fileira vira uma gaveta que enche, uma anotação por palavra, em cada andar do modelo | As anotações ocupam memória, e crescem com cada palavra. | as anotações ocupam memória |
| 5 | O medidor | as duas mensagens, a curta (só a pergunta) e a longa (o regulamento antes dela), cada uma com e sem cache; ao lado, "pausa ?" e "cada palavra ?" | O medidor cronometra a pausa e cada palavra, nos quatro jeitos. | o medidor mede quatro jeitos |
| 6 | A pergunta | só os resumos e a pergunta, grande | Com as anotações, a palavra nova custa o mesmo na mensagem curta e na longa? Você aposta na IDE. | — |

## No celular (estreito)

Uma coluna. Na figura 1, os quatro caches empilhados, cada um com o alcance numa linha; na cena 6, os dois grupos um
embaixo do outro. Na figura 2, a mensagem, a atendente e a resposta empilhadas, a fileira de anotações na largura
toda e o balão logo abaixo dela; na cena 5, as quatro combinações viram quatro linhas curtas ("curta · com cache"…).

## No modo direto

A cena 6 de cada figura parada, com os resumos. Para leitor de tela, a descrição em texto das seis cenas.

## Fica de fora, de propósito

- Os números da coleta e o resultado do item 3 do placar: a aposta da IDE é justamente se olhar as anotações custa
  alguma coisa; a figura mostra que ela olha, sem dizer quanto custa.
- O erro do modelo na longa (as 18h no sábado): é do "inesperado", no fim da página.
- Os preços exatos do cache de prompt (1,25× e 0,1×) e o hash encadeado do vLLM: entram no texto, com o link, logo
  depois da figura 1.
- K, V, token, prefill e decode como palavras da figura: ela fala em "palavra", "anotação", "ler" e "escrever", como a
  atendente do `pausa-e-fluxo`; os nomes técnicos entram no texto, uma vez, depois dela.

(redação: Claude Opus 5.5)
