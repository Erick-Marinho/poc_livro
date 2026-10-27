# O capítulo 2 explica o grafo antes de usá-lo

**Problema.** O capítulo 2 monta o agente na LangGraph, mas não explica nó, aresta nem estado: o 2.1 mostra "o roteiro
do substituto" com balcões e uma ficha, e só numa nota define "grafo de agente". Quem nunca viu um grafo chega à IDE
sem saber o que é uma aresta condicional, nem o que viaja de um nó para o outro. O Erick propôs uma introdução a
grafos e arestas, com outros conceitos úteis, deixando a teoria dos grafos e as máquinas de estado (finita e
hierárquica) para outro livro; e a figura do 2.1 com nós de verdade e o estado viajando em JSON (27/10/2026).

## Decisões

- (27/10/2026, Erick) "Ok para ambas": a figura nova do 2.1 e o texto curto das peças, com a listagem de `montar()`.
- (1) Só o mínimo para ler o código da LangGraph, cada peça ligada a uma linha real do `agente.py`: nó, aresta, aresta
  condicional, START e END, estado (cada nó devolve só o que mudou) e compilar e executar. Ficam para o outro livro,
  com uma linha avisando: teoria dos grafos, máquina de estados finita e hierárquica, ciclos, subgrafos e memória. Os
  ciclos aparecem no capítulo 3, com as ferramentas.
- (27/10/2026, Erick) A etapa 2 com a listagem de `montar()` e o parágrafo da escala foi recusada: "apresentamos um
  conceito complexo com código raso e texto abstrato". Conceito se ensina com cenas, desenhando; o código o leitor vê
  quando constrói (2.5). O lugar do agente na escala, o laço e o capítulo 3 são "muito complexos para um início" e
  saem do 2.1 (o capítulo 1 já diz que, no capítulo 2, o agente é um roteador).
- (1) Sem seção nova (o capítulo e a IDE não se renumeram): tudo dentro do 2.1, numa animação só, e não duas coladas.
- (1) Na figura, é real: os nós e as arestas (a saída gravada `grafo-02`), o formato do estado (a classe `Conversa`) e
  as frases fixas dos nós que não chamam o modelo (o `agente.py`). É do gabarito, e a figura diz: a decisão e o motivo
  (o modelo entra no 2.2). Onde o modelo escreve, o estado mostra "o modelo escreve", e não uma frase inventada.

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | A figura do 2.1 com nós de verdade: as peças apresentadas no próprio grafo (nós, arestas fixas e condicionais, START e END, o estado) e as duas mensagens atravessando, com o estado em JSON crescendo a cada nó | toca ou rola e vê o estado ganhar chaves de nó em nó |
| 2 | O 2.1 enxuto em volta da figura: uma abertura curta, a figura, a definição e o Pare e pense; sem código e sem balcões | aprende as peças pelo desenho, e o código fica para a 2.5 |

## Etapa atual: 2 — o 2.1 enxuto

- A abertura apresenta o grafo em uma frase concreta (caixas, setas e um pacote de dados viajando), sem balcão nem
  roteiro. A figura ensina as peças; a definição de uma frase vem logo depois, e o Pare e pense fala em caminhos.
- Saem do 2.1: a listagem de `montar()`, a frase do `compile()` e do `invoke`, e o parágrafo da escala e do laço. O
  aviso do que fica para outro livro também sai do texto (fica nas decisões deste plano).
- A abertura do 2.2 deixa o balcão: "No 2.1, a decisão vinha do gabarito".

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | c44b6f6 | `npm test` 189/189; capturas por rolagem em 1280 e 390 px: as peças acendem uma a uma, o `{ }` para na borda de baixo de cada nó sem cobrir o nome, o estado ganha `decisao` e `motivo` em `decidir` e `resposta` no caminho (no R15, "o modelo escreve") | Erick, 27/10/2026 |
| 2 | d09c708 | `npm test` 190/190; ritmo 166 palavras; capturas da listagem | recusada pelo Erick, 27/10/2026: código e texto abstrato no início |
| 2 | 819b564 | `npm test` 190/190; `npm run ritmo`: 56 palavras até a figura e 44 entre a figura e o Pare e pense; o 2.1 sem `Listagem` e sem balcão (teste) | aguardando revisão |

(redação: Claude Opus 5.5)
