# Achados da leitura do Victor

**Problema.** Na leitura da etapa 8 de `revisao-do-percurso-inicial.md`, o Victor, coautor, aponta trechos que travam
quem começa em engenharia de IA. Cada achado vira uma etapa aqui, e não um ajuste dentro da leitura. São achados de
autor: dizem onde o texto trava, mas não substituem a leitura de quem não escreveu o livro.

## Decisões

- (26/10/2026, Erick) O planejador passa a implementar as etapas direto, sem o Codex, com as mesmas regras: um commit
  de produto por etapa, evidência real e o ok do Erick para fechar.
- (1) As pilhas do 1.3 continuam sem nome, porque o 1.5 pergunta "que nome você daria a cada uma?". O critério entra
  pela pergunta (separar pelo que se faz, não pelo assunto) e por um exemplo já separado, e não pelos nomes.

## Etapas

| Etapa | Achado | Resultado esperado para revisão |
|---|---|---|
| 1 | O 1.3 está complexo e abstrato para quem começa (Victor, 26/10/2026, relatado pelo Erick). | O leitor separa as mensagens com um critério que entende, e a explicação mostra a ideia da seção: o que importa é o que se faz com a mensagem, não o assunto dela. |

## Etapa atual: 1 — o 1.3 para quem começa

### O que travava

- A pergunta das pilhas, "o mesmo tipo de resposta", não dava critério a quem começa, e as pilhas A a D não ajudavam.
- Quem começa separa pelo assunto (pedido, entrega, frigideira). O contrato separa pelo que o atendente faz: os três
  são responder. A ideia da seção ficava escondida, e o leitor "errava" sem saber que havia outro jeito de olhar.
- A explicação pedia até quatro pilhas e listava cinco tipos (dados, política, ação, não pode, pessoa).

### O que muda

- O 1.3 põe o leitor no lugar do atendente no primeiro dia.
- A pergunta dá o critério: separar pelo que você faria com cada mensagem, e não pelo assunto.
- O `Pilhas.astro` aceita um `exemplo`: a mensagem do pedido BT-1001 já vem na pilha A, travada, com o que o
  atendente faz ("olha o pedido no sistema, confere que o e-mail é da Ana e diz quando chegou"). No modo direto, o
  exemplo some com as letras.
- A explicação vira o "ah!": pedido, entrega e frigideira parecem assuntos diferentes, mas com os três se faz a mesma
  coisa. Depois, as outras três pilhas em linguagem simples. São quatro, como a tarefa pede.

### Fontes

- `projeto/referencia.jsonl`: R03, R06 e R07 são responder; R10 é abrir chamado; R15 é recusar; R16 é passar.
- `projeto/dados/pedidos.json` e `clientes.json`: o BT-1001 é da Ana (C01), entregue em 03/11/2026.

### Verificação

- `npm run ritmo`: o trecho antes das pilhas foi de 183 para 192 palavras, abaixo do aviso de 200.
- `npm test`, com um teste novo em `testes/acoes.test.mjs`: o exemplo vem na pilha A, travado, só na primeira carta,
  e a pergunta separa pelo que se faz.
- O 1.3 na página montada, no computador e no celular, antes e depois de separar.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|

(redação: Claude Opus 5.5)
