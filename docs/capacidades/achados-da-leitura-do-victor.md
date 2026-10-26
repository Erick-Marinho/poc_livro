# Achados da leitura do Victor

**Problema.** Na leitura da etapa 8 de `revisao-do-percurso-inicial.md`, o Victor, coautor, aponta trechos que travam
quem começa em engenharia de IA. Cada achado vira uma etapa aqui, e não um ajuste dentro da leitura. São achados de
autor: dizem onde o texto trava, mas não substituem a leitura de quem não escreveu o livro.

## Decisões

- (26/10/2026, Erick) O planejador passa a implementar as etapas direto, sem o Codex, com as mesmas regras: um commit
  de produto por etapa, evidência real e o ok do Erick para fechar.
- (26/10/2026, Erick) As letras A, B, C e D confundiam: "o que são o A B C D?".
- (26/10/2026, Erick) Trocar as letras por frases ainda ficou "abstrato e complexo quando comparado à resposta": a
  resposta era "o contrato", que o leitor só conhece no 1.4. Como o 1.3 introduz o contrato, ele vira o primeiro dia
  no atendimento, com uma colega que atende há anos ao lado. O leitor diz o que faria com cada mensagem, e ela
  responde na hora o que faz e por quê. No fim, o que ela sabe de cor, escrito de um jeito que dê para conferir, é o
  contrato. Os nomes do contrato continuam no 1.5.
- (1) Componente próprio, `PrimeiroDia.astro`, e não mais o `Pilhas.astro`, que volta ao que era (capítulo 2 e
  experimento). O que a colega faz é a decisão do `referencia.jsonl`; o porquê é escrito no capítulo, com fonte nos
  dados e na política da loja.
- (1) O R16 ("quero falar com um atendente de verdade") não cabe numa cena com uma atendente de verdade: entra o R17,
  o reembolso, que a política manda para uma pessoa da equipe.

## Etapas

| Etapa | Achado | Resultado esperado para revisão |
|---|---|---|
| 1 | O 1.3 está complexo e abstrato para quem começa (Victor, 26/10/2026, relatado pelo Erick). | O leitor separa as mensagens com um critério que entende, e a explicação mostra a ideia da seção: o que importa é o que se faz com a mensagem, não o assunto dela. |
| 2 | O 1.4 também está abstrato e nada intuitivo (Erick, 26/10/2026). | O contrato chega como continuação da cena da colega, com uma imagem que o iniciante já conhece, e sem conceitos que só servem em capítulos futuros. |
| 3 | O 1.5 evolui sem mostrar um contrato, abstrato, com exemplos desconexos: "é um gabarito, mas como ele é em código?" (Erick, 26/10/2026). | O leitor vê o gabarito virar código real antes de escrevê-lo, e os exemplos são os do primeiro dia. |

## Etapa 3 — o gabarito em código, no 1.5

### O que travava

- O 1.5 dava os nomes das quatro decisões e uma tabela, sem mostrar como o contrato fica em código.
- Os exemplos da tabela ("a tampa veio rachada", "quero falar com um atendente") não eram os do primeiro dia.
- O Classificador repetia o reembolso do Bruno, que agora está no 1.3.

### O que muda

- Depois dos nomes, o gabarito em código, lido do projeto real (`marcos/cap-01/`): a lista fechada `Decisao` do
  `contrato.py` (as quatro coisas da colega) e dois casos do `referencia.jsonl` do primeiro dia (o CPF e o lençol),
  abertos para ler, com notas na decisão, no motivo e no par pedido e e-mail. O texto diz que no arquivo cada caso
  ocupa uma linha, e que o leitor escreve os dois arquivos na 1.6.
- A tabela das regras usa as mensagens do primeiro dia.
- O Classificador troca o R17 (já no 1.3) pelo R13, o endereço de um pedido já enviado, que a política não muda.

### Verificação

- `npm run ritmo`: 199 palavras do pare e pense ao Classificador (sem aviso).
- `npm test`: 124 testes do livro e 5 da gravação.
- [Capturas](../relatorios/capturas/achados-da-leitura-do-victor-etapa-3/) do 1.5.

## Etapa 2 — o 1.4 como gabarito

### O que travava

- O 1.4 abria com a política e passava logo ao direito, ao Bertrand Meyer e a "rotina que declara o que exige e o que
  garante", sem caso que pedisse esses conceitos.
- "Fixa decisões, não frases" e "o contrato não é o prompt" vinham em termos técnicos, sem imagem.
- A aposta e o quadro das quatro camadas (comportamento, formato, ferramenta, execução) pediam ao leitor que
  classificasse falhas de capítulos que ele ainda não leu.

### O que muda

- O 1.4 continua a cena do 1.3: a colega vai sair de férias, e o agente fica no lugar dela. Como saber se ele aprendeu?
  Como a escola sabe se o aluno aprendeu: com uma prova que já tem gabarito. O contrato é esse gabarito, e as
  respostas saem da política e dos dados da loja.
- (26/10/2026, Erick) "Fala-se do prompt, porém sem ligação com o contrato": antes de sair, a colega deixa duas
  coisas ao substituto. Um bilhete explicando o trabalho, que com um modelo se chama prompt; e o gabarito para
  conferir se ele aprendeu, que é o contrato. A troca de prompt (o `Troca`, que fica) mostra por que o bilhete não
  basta: com dois bilhetes e depois com outro modelo, a terceira tentativa promete o desconto, e quem pega é o
  gabarito. O pare e pense pergunta o que muda no contrato quando se reescreve o prompt. (Nada.)
- O Meyer fica numa frase, depois da imagem; a definição fica, com as três partes ligadas à colega.
- A aposta e o quadro das camadas saem do 1.4 (decisão registrada em `contrato-em-camadas.md`). Fica uma frase: as
  outras conferências chegam nos capítulos 2, 3 e 5.

### Verificação

- `npm run ritmo`: o 1.4 tem 159 palavras até a troca, 63 até o pare e pense novo e 153 até o 1.5, sem aviso.
- `npm test`: 124 testes do livro e 5 da gravação, 30 + 16 saídas conferidas. O teste das camadas confere os dados e
  que a aposta saiu do 1.4.
- [Capturas](../relatorios/capturas/achados-da-leitura-do-victor-etapa-2/) do 1.4 no computador e em 360 px.

## Etapa 1 — o 1.3 para quem começa

### O que travava

- A pergunta das pilhas, "o mesmo tipo de resposta", não dava critério a quem começa, e as letras A a D não diziam nada.
- Quem começa separa pelo assunto (pedido, entrega, frigideira). O contrato separa pelo que o atendente faz: os três
  são responder. A ideia da seção ficava escondida.
- A resposta comparava com "o contrato", que só aparece no 1.4, e mostrava uma tabela de grupos com descrições.
- A explicação pedia até quatro pilhas e listava cinco tipos (dados, política, ação, não pode, pessoa).

### O que muda

- O 1.3 é o primeiro dia do leitor no atendimento, com uma colega que atende há anos ao lado.
- Para cada mensagem, quatro escolhas em palavras de quem atende: "Respondo", "Abro um chamado", "Digo que não posso",
  "Chamo alguém da equipe". Ao escolher, a colega diz na hora o que faz e por quê, e o leitor vê se faria o mesmo.
- A primeira mensagem, a do pedido da Ana, a colega já mostrou.
- Quando as seis estão feitas, o fecho: a colega não pensou no assunto, pensou no que fazer; seis mensagens, só
  quatro coisas a fazer; escrever o que ela sabe de cor, de um jeito que dê para conferir, é o contrato. O 1.4 abre
  logo depois com a política da loja.
- O 1.5 deixa de falar em "pilhas sem nome": "você escolheu entre quatro coisas para fazer com cada mensagem. Que
  nome curto você daria a cada uma, para caber num contrato?".
- No modo direto, as falas da colega e o fecho aparecem abertos, sem as escolhas.

### Fontes

- `projeto/referencia.jsonl`: R03, R06 e R07 são responder; R10 é abrir chamado; R15 é recusar; R17 é passar.
- `projeto/dados/pedidos.json` e `clientes.json`: o BT-1001 é da Ana, entregue em 03/11; o BT-1005 é do Diego,
  entregue em 20/10 (21 dias antes do "hoje" da loja); o BT-1006 é do Bruno, cancelado e pago.
- `projeto/dados/catalogo.json`: a frigideira vai ao forno até 180 °C, sem o cabo de silicone.
- `projeto/dados/politica.md`: entrega em todo o Brasil; 90 dias para reclamar de defeito; reembolso passa por uma
  pessoa da equipe; dado pessoal de cliente não se informa.

### Verificação

- `npm run ritmo`: o trecho antes da ação tem 189 palavras (antes, 183), abaixo do aviso de 200. Saiu a frase "a loja
  é inventada", que a introdução já diz.
- `npm test`, com dois testes novos em `testes/acoes.test.mjs`: o que a colega faz é a decisão do contrato em cada
  mensagem, e as quatro aparecem; as escolhas são frases sem o nome do contrato; a primeira já vem mostrada, e as
  outras esperam o leitor.
- O 1.3 na página montada, no computador e no celular, antes e depois de responder (com uma escolha diferente da
  colega, na frigideira, para mostrar o aviso).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `d3b50a3`, `1437a2f`, `ecea077` | o primeiro dia com a colega, no lugar das pilhas; 189 palavras antes da ação (sem aviso); `npm test`: 30 + 16 saídas conferidas, 124 testes do livro e 5 da gravação passaram; [capturas](../relatorios/capturas/achados-da-leitura-do-victor-etapa-1/) antes e depois de responder, no computador e em 360 px. | Erick, 26/10/2026 |
| 2 | `2972d5d`, `653bacc` | o 1.4 com o bilhete (prompt) e o gabarito (contrato) que a colega deixa; sem a aposta das camadas; 159 · 63 · 153 palavras entre as ações (sem aviso); `npm test`: 124 testes do livro e 5 da gravação; [capturas](../relatorios/capturas/achados-da-leitura-do-victor-etapa-2/). | Erick, 26/10/2026 |
| 3 | `998c72a` | o `Enum` e dois casos reais no 1.5; tabela com o primeiro dia; R13 no Classificador; 199 palavras até a ação; `npm test`: 124 testes do livro e 5 da gravação; [capturas](../relatorios/capturas/achados-da-leitura-do-victor-etapa-3/). | Erick, 26/10/2026 |

(redação: Claude Opus 5.5)
