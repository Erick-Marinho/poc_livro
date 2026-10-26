# Achados da leitura do Victor

**Problema.** Na leitura da etapa 8 de `revisao-do-percurso-inicial.md`, o Victor, coautor, aponta trechos que travam
quem começa em engenharia de IA. Cada achado vira uma etapa aqui, e não um ajuste dentro da leitura. São achados de
autor: dizem onde o texto trava, mas não substituem a leitura de quem não escreveu o livro.

## Decisões

- (26/10/2026, Erick) O planejador passa a implementar as etapas direto, sem o Codex, com as mesmas regras: um commit
  de produto por etapa, evidência real e o ok do Erick para fechar.
- (1) As pilhas do 1.3 continuam sem os nomes do contrato, que chegam no 1.5. O critério entra pela pergunta (o que você
  faz com a mensagem, não o assunto) e por um exemplo já feito.
- (26/10/2026, Erick) As letras A, B, C e D confundiam: "o que são o A B C D?". No lugar delas, o que o atendente
  faria, em palavras dele: "Respondo eu mesmo", "Abro um chamado", "Digo que não posso, e por quê", "Chamo alguém da
  equipe". O 1.5 passa a perguntar que nome curto o leitor daria a cada uma, para caber num contrato.

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
- O `Pilhas.astro` aceita `acoes` (as letras viram o que o leitor faria; a conferência é com a decisão de cada
  mensagem, e a leitura diz onde ele fez outra coisa) e `exemplo` (a mensagem do pedido BT-1001 já vem com
  "Respondo eu mesmo", travada, e o que o atendente faz). No modo direto, as escolhas e o exemplo somem. Os outros
  usos do componente (capítulo 2 e experimento) continuam com as letras.
- O 1.5 deixa de falar em "pilhas sem nome": "você escolheu entre quatro coisas para fazer com cada mensagem".
- A explicação vira o "ah!": pedido, entrega e frigideira parecem assuntos diferentes, mas com os três se faz a mesma
  coisa. Depois, as outras três pilhas em linguagem simples. São quatro, como a tarefa pede.

### Fontes

- `projeto/referencia.jsonl`: R03, R06 e R07 são responder; R10 é abrir chamado; R15 é recusar; R16 é passar.
- `projeto/dados/pedidos.json` e `clientes.json`: o BT-1001 é da Ana (C01), entregue em 03/11/2026.

### Verificação

- `npm run ritmo`: o trecho antes das pilhas foi de 183 para 192 palavras, abaixo do aviso de 200.
- `npm test`, com um teste novo em `testes/acoes.test.mjs`: as escolhas são frases, uma por decisão, e o exemplo vem
  escolhido e travado só na primeira carta.
- O 1.3 na página montada, no computador e no celular, antes e depois de separar.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `d3b50a3` | 1.3 de 183 para 192 palavras antes da ação (sem aviso); `npm test`: 30 + 16 saídas conferidas, 124 testes do livro e 5 da gravação passaram; [capturas](../relatorios/capturas/achados-da-leitura-do-victor-etapa-1/) antes e depois de separar, no computador e em 360 px. | aguardando revisão |

(redação: Claude Opus 5.5)
