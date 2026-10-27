# A nota, explicada na introdução

**Problema.** A nota é o fio do livro (o botão "nota" no topo, o placar de cada capítulo, a pergunta "ele bate os
25%?"), e a introdução não diz o que ela é, para que serve, de onde vem nem como acompanhar. O Erick pediu que a
introdução explique "detalhadamente o que é a nota no livro, o que é, para que serve, como usar" (26/10/2026).

## Decisões

- (26/10/2026, Erick) A introdução explica a nota: o que é, para que serve, como usar.
- (1) Sem os números do livro: a nota de partida e a do capítulo 2 ficam escondidas até o leitor investir nelas
  (placar.json, `revela_com`); a introdução não pode estragar isso. A explicação usa uma prova pequena, de mentira na
  parte do agente, e diz que é ilustração.
- (1) O leitor aprende fazendo (docs/PRINCIPIOS.md): ele mesmo corrige a prova pequena, no papel da régua, nos cartões
  de uma pergunta por vez (src/lib/cartoes.ts). O "como usar" é o botão de verdade: a figura termina abrindo o placar.
- (1) Texto curto em volta: para que serve, de onde vem e o que ela não diz. O "qual erro é pior" já está na
  introdução, num pare e pense; a seção nova vem logo depois dele e se apoia nele.

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | A seção "A nota" na introdução, com a prova pequena e o link para o placar | corrige quatro perguntas, vê a nota se formar e abre o placar |

## Etapa atual: 1 — a seção "A nota"

### O que muda

- Uma seção nova, "A nota", entre "O que este livro não é" e "Como ler". Abre dizendo que um agente não fica pronto,
  fica melhor ou pior, e que a nota é a prova que diz qual dos dois: as perguntas da loja, a decisão certa de cada uma
  (o gabarito, que o leitor escreve no capítulo 1) e a régua, o programa que compara e conta.
- Uma figura nova, `CorrijaAProva`: quatro cartões, um por vez. Cada um traz uma mensagem e a decisão do gabarito
  (do `referencia.jsonl`) e o que um agente decidiu (ilustração). O leitor diz se conta como acerto; o retorno diz se
  ele corrigiu como a régua, e a nota se forma embaixo ("2 de 3"). No fim, a nota da prova pequena e um botão que abre
  o placar de verdade, no topo.
- Depois da figura, dois parágrafos curtos: para que serve (comparar: a primeira nota é a de um "agente" que não
  decide nada, e cada capítulo tenta empurrar o número) e de onde vem (do projeto real, gravada; na máquina do leitor
  pode sair diferente). O que ela não diz vira um pare e pense ("a nota subiu: o que você sabe, e o que não sabe?"):
  conta decisões, não a resposta, e todo erro igual até o capítulo 4. Texto corrido no lugar, o fim da introdução
  passava de 400 palavras sem ação.
- O "?" do placar, no capítulo em que uma nota nasce, fica no fim da figura, ao lado do botão que abre o placar.
- No modo direto, a figura abre corrigida, com a nota.

### Verificação

- Teste: os casos existem no `referencia.jsonl`; o gabarito mostrado é o dele; a nota da figura é a conta dos cartões;
  a introdução não mostra a nota de partida nem a do capítulo 2; o link abre o placar.
- `npm run ritmo`, `npm test` e capturas no computador e no celular: um cartão corrigido, o fim com a nota e o placar
  aberto pelo link.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|

(redação: Claude Opus 5.5)
