# O nível de cada experimento

**Problema.** Os experimentos não dizem para quem são: o leitor só descobre que "Temperatura zero" pede aritmética de
ponto flutuante e inferência local depois de começar. O Erick pediu etiquetas de nível de complexidade: novato,
intermediário e avançado (27/10/2026).

## Decisões

- (27/10/2026, Erick) Três níveis: novato, intermediário e avançado.
- (1) Cada nível diz o que pede do leitor, em uma frase, e não só o nome:
  - **Novato:** abrir o terminal e seguir os passos; o conceito é explicado do zero.
  - **Intermediário:** Python e terminal no básico, e já ter usado um modelo de linguagem; o experimento explica o resto.
  - **Avançado:** entender o que acontece dentro do modelo ou da máquina (contas, precisão, inferência), e Python com
    folga.
- (1) A classificação de hoje, para o Erick confirmar: "Um segundo cérebro…" é **intermediário** (constrói a busca e
  as respostas sobre as notas, com o chat guiando); "Temperatura zero" é **avançado** (binary16, pontuações, lotes,
  inferência com PyTorch).
- (1) O nível é obrigatório no molde: experimento sem nível não monta. Aparece no cabeçalho do experimento (com a frase
  do que pede), nos cartões da lista e no `index.json` que a landing lê.

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | O campo `nivel` no molde, a etiqueta no cabeçalho e na lista, e os dois experimentos classificados | vê, antes de começar, o que o experimento pede dele |

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|

(redação: Claude Opus 5.5)
