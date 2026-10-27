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
- (1) Sem seção nova (o capítulo e a IDE não se renumeram): tudo dentro do 2.1, numa animação só, e não duas coladas.
- (1) Na figura, é real: os nós e as arestas (a saída gravada `grafo-02`), o formato do estado (a classe `Conversa`) e
  as frases fixas dos nós que não chamam o modelo (o `agente.py`). É do gabarito, e a figura diz: a decisão e o motivo
  (o modelo entra no 2.2). Onde o modelo escreve, o estado mostra "o modelo escreve", e não uma frase inventada.

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | A figura do 2.1 com nós de verdade: as peças apresentadas no próprio grafo (nós, arestas fixas e condicionais, START e END, o estado) e as duas mensagens atravessando, com o estado em JSON crescendo a cada nó | toca ou rola e vê o estado ganhar chaves de nó em nó |
| 2 | O texto curto das peças, a listagem de `montar()` com uma nota por linha, e o aviso do que fica para o outro livro | lê o código da LangGraph sabendo o que cada linha faz |

## Etapa atual: 1 — a figura

- O roteiro do substituto sai: os nós aparecem com o nome do código (`decidir`, `responder`, `abrir_chamado`,
  `recusar`, `passar`), START e END como pílulas escuras, as arestas condicionais tracejadas e as fixas cheias.
- Quatro cenas curtas apresentam as peças; depois, o R10 e o R15 atravessam o grafo, e um cartão JSON mostra o
  estado: começa com `pergunta`, `decidir` acrescenta `decisao` e `motivo`, o nó do caminho acrescenta `resposta`. A
  chave nova acende.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|

(redação: Claude Opus 5.5)
