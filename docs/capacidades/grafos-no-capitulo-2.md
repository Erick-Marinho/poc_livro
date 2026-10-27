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

## Etapa atual: 2 — o texto e a listagem

- O parágrafo antes da figura apresenta o grafo (caixas, setas e um pacote de dados viajando), sem balcão nem roteiro.
- Depois da figura, a listagem das oito linhas do fim de `montar()` (66 a 73), com uma nota por linha: o grafo e o
  estado, o nó, um nó por decisão, a aresta fixa, a entrada, a aresta condicional e o `compile()`. Um teste confere
  que cada nota cai na linha que ela explica no `agente.py` real.
- Uma frase sobre o estado (cada nó devolve só o que mudou) e o `compile()` (não executa; o agente anda no `invoke`).
- A nota "a definição deste livro" fica, mais curta, com o aviso do que vai para outro livro. Os balcões saem do
  Pare e pense do 2.1 e da abertura do 2.2.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | c44b6f6 | `npm test` 189/189; capturas por rolagem em 1280 e 390 px: as peças acendem uma a uma, o `{ }` para na borda de baixo de cada nó sem cobrir o nome, o estado ganha `decisao` e `motivo` em `decidir` e `resposta` no caminho (no R15, "o modelo escreve") | Erick, 27/10/2026 |

(redação: Claude Opus 5.5)
