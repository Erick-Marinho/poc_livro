# O leitor decide no capítulo 2, e o bilhete volta

**Problema.** A revisão de narrativa (27/10/2026) apontou que as cinco figuras do capítulo 2 só tocam ou rolam, sem
nada a decidir, e mesmo assim o `ritmo.mjs` as conta como ação. Pela regra do próprio livro, assistir não é agir. E o
bilhete da colega (1.4), que o texto promete que o leitor vai reescrever muitas vezes, some no capítulo 2: a IDE chama
a instrução do modelo de "o contrato dito em palavras", e isso apaga a diferença entre bilhete e gabarito.

## Decisões

- (27/10/2026, Erick) "Invista antes": uma caixa de Invista logo antes das figuras-chave, e a figura responde. Nada muda
  dentro da rolagem; a pergunta dentro da figura já foi recusada em 26/10 (capitulo-2-em-cenas.md). As figuras do
  capítulo 2 passam a não contar como ação no ritmo.
- (27/10/2026, Erick) "Figura e Invista" para o bilhete: os dois bilhetes lado a lado, o da colega e o do substituto (a
  `INSTRUCAO` real), e um Invista no que o agente faz com o desconto (R11), com a resposta gravada.
- (1) As opções e a resposta de cada Invista vêm do projeto: os nós, do grafo real; a decisão, do `referencia.jsonl`
  ou da gravação. O teste confere.

## Etapas

| Etapa | Onde | O que o leitor faz |
|---|---|---|
| 1 | 2.1: Invista antes do grafo (para qual nó vai a mensagem do lençol, o R10); as figuras do capítulo 2 deixam de contar como ação | investe no caminho e vê a mensagem segui-lo na figura |
| 2 | 2.2: Invista antes do formulário (em que caixa cabe "acho melhor encaminhar") | investe e vê o molde recusar a quinta decisão |
| 3 | 2.4: o bilhete do substituto ao lado do da colega, e o Invista no desconto (R11); a IDE e o 2.6 passam a dizer bilhete | investe no que o agente faz com o desconto e vê a decisão gravada |

## Etapa atual: 2 — o texto solto, no 2.2

- Um Invista com o texto solto que a figura mostra ("Acho melhor encaminhar…"), entre a abertura do 2.2 e o formulário:
  para qual caixa do grafo o código segue? Três nós do grafo real e "nenhuma, teria de adivinhar", que é a resposta.
  O texto é ilustração, e a caixa diz.
- A abertura deixa de dizer que o código teria de adivinhar (era a resposta). A listagem da `Escolha` sai do 2.2, como
  saiu do 2.1: a figura mostra o formulário, e o código o leitor escreve na 2.5. Fica uma frase com o nome da classe.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | 7bf8c8e | `testes/escolhas-no-capitulo-2.test.mjs` (2): as opções são os nós do grafo real, na ordem da figura, a resposta é a do gabarito e as glosas, as do grafo-02.json; nada entre o Invista e a figura; as cinco figuras fora da conta. `npm test` 194/194. Ritmo: o 2.1 fica 56 → Invista e 44 → Pare e pense; o 2.2 passa a 241 (aviso), que a etapa 2 fecha. Capturas a 1280 e 390 px, antes e depois do clique | Erick, 27/10/2026 |

(redação: Claude Opus 5.5)
