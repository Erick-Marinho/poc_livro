# Caso novo — defeito em pedido de outra pessoa

Exercício elaborado para esta leitura com os dados fictícios do projeto. Não é saída gravada de um modelo.
Não adicionar à referência oficial nem mostrar a resposta esperada antes de recolher a tentativa.

## Cartão do leitor — entregar somente esta parte

No atendimento da Casa Bem-te-vi, chega esta mensagem:

> O jogo de lençol do pedido BT-1005 veio com defeito. Meu e-mail é carla.mendes@exemplo.test. Abram um chamado de troca.

Escolha uma das quatro decisões do contrato: responder, abrir chamado, recusar ou passar a vez. Explique o motivo e
aponte os dados ou a regra que sustentam sua escolha. O que pode ser enviado ao cliente nessa situação?

Você pode consultar o livro e os arquivos da loja que já tem no projeto ou na IDE da página. Não precisa escrever
programa nem chamar modelo. Registre sua resposta antes de conferir a solução.

---

## Resposta esperada — somente para o observador

**Recusar** o atendimento sobre esse pedido com o e-mail apresentado. O BT-1005 pertence ao cliente C04, Diego;
o e-mail da mensagem pertence à C03, Carla. O contrato da loja exige o número do pedido e o e-mail da compra.
Pedir troca por defeito não autoriza consultar ou expor o pedido de outra pessoa.

Basta explicar que não pode atender a solicitação com os dados apresentados e pedir a confirmação do e-mail da
compra; não informar quem é o dono, o e-mail dele nem outros dados do pedido. Isso é orientação de resposta para
correção da atividade, não resposta observada do agente. Não é preciso reproduzir uma frase exata para acertar.

Conta como resolvido sozinho se o leitor escolhe **recusar**, mostra a divergência entre titular e e-mail ao
observador e aplica a regra de não expor os dados ao cliente, sem pista ou explicação do observador. Se apenas
acerta a palavra sem justificativa, registrar “errado/incompleto”; se nem tenta ou o tempo acaba, registrar
“não resolveu” e o motivo. “Não aplicado” é outro estado e não entra como erro.

### Fontes do projeto

- [pedidos.json](../../livros/ciclo-de-vida/projeto/dados/pedidos.json), registro BT-1005: cliente C04, item P04 e
  entrega em 20/10/2026.
- [clientes.json](../../livros/ciclo-de-vida/projeto/dados/clientes.json), C03 e C04: o e-mail apresentado é de Carla;
  o comprador C04 é Diego, cujo e-mail é diferente.
- [catalogo.json](../../livros/ciclo-de-vida/projeto/dados/catalogo.json), P04: jogo de lençol casal.
- [politica.md](../../livros/ciclo-de-vida/projeto/dados/politica.md), “O que o atendimento não faz”: não informar
  pedido sem confirmação do número e do e-mail da compra, nem dado pessoal de cliente. “Troca e devolução”: prazo
  de 90 dias para defeito.
- [loja.json](../../livros/ciclo-de-vida/projeto/dados/loja.json): o “hoje” da loja é 10/11/2026. Os 21 dias desde a
  entrega estariam no prazo para reclamar; o impedimento deste caso é a identificação, não o prazo.

### Por que não é um caso decorado da referência

Em [referencia.jsonl](../../livros/ciclo-de-vida/projeto/referencia.jsonl), R10 pede troca de lençol do BT-1005 com o
e-mail do comprador, Diego, e espera abrir chamado. R12 combina o BT-1001 com o e-mail do Bruno e espera recusar.
O cartão acima combina o BT-1005 com o e-mail da Carla e um pedido de troca: essa combinação e essa mensagem não
estão nas vinte perguntas. O leitor precisa aplicar a regra de identificação antes de seguir o pedido de troca.

(redação: GPT-6)
