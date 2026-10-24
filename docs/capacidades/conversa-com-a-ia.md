# Conversa com a IA na IDE do capítulo

**Problema.** No chat da IDE quem fala com a IA é o Erick: o leitor assiste a uma conversa e aperta "seguir" numa barra
fora dela. O jeito real de construir hoje é conversando com um assistente; o leitor deveria ser quem pede, pergunta e
segue, e cada clique dele virar uma fala (docs/PRINCIPIOS.md: o leitor aprende com o que faz). As falas continuam
escritas pelos autores (ou gravadas de um modelo, com o ok deles), e a tela diz que é simulação.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| compositor do chat | a caixa de mensagem: a fala sugerida e o enviar | o quadro atual | a fala do leitor e o avanço | nova |
| "você" no chat | o leitor como quem fala com a IA (no lugar do Erick) | as ações do leitor | bolha da pessoa | troca o rótulo |
| pedido de cada passo (`passos/NN.json`) | o que o leitor envia para abrir o passo | o passo | a sugestão do compositor | existe |
| falas de passagem | o que o leitor diz para ir adiante ("fiz na minha IDE", "e o próximo?") | o quadro | a sugestão | nova |
| perguntas sugeridas | uma ou duas por ação, com a resposta dos autores | o roteiro | sugestões a mais | nova |

## Decisões

- (etapa 1) O leitor é "você" no chat, e o pedido de cada passo é ele quem envia: no começo e no fecho de cada passo,
  o compositor sugere o pedido do passo seguinte, e enviar abre o passo (no lugar do "próximo passo"). Responder onde
  faz o projeto não abre mais o primeiro passo sozinho: quem abre é o envio do primeiro pedido.
- (etapa 2) O caminho é o compositor: toda passagem é uma fala do leitor, e a barra de baixo fica só com as setas, o
  nome do passo e as perguntas do livro. As falas de passagem variam em quatro jeitos de dizer o mesmo, para não soar
  como botão.
- (etapa 3) O começo também é conversa: a IA pergunta onde o leitor vai fazer o projeto e se continua de onde parou;
  a resposta de onde fazer vai junto com o primeiro pedido, numa fala só.

## Etapas

1. "Você" no chat, e o pedido do passo enviado pelo leitor no compositor.
2. Toda passagem vira fala: o compositor sugere o que leva adiante, e o "seguir" da barra deixa de ser o caminho.
3. A IA pergunta no chat o que hoje a barra pergunta (onde você faz o projeto; continuar de onde parou).
4. Perguntas sugeridas por ação, escritas pelos autores, ao lado da fala que avança.

## Etapa 3 (detalhe)

- **Arquivos:** `src/components/livro/ide/IdeCapitulo.tsx` e `ide-capitulo.css`.
- **Muda:** as duas perguntas do livro saem da barra e viram falas da IA no começo da conversa, com as respostas como
  sugestões rápidas no compositor. "Você parou no passo N. Continuo de lá?" (continuar, ou começar do início). "Onde
  você vai fazer o projeto?" (na minha IDE, ou aqui no livro; a sugestão em destaque é a do aparelho). A resposta de
  onde fazer já leva o primeiro pedido junto ("Na minha IDE, ao lado do livro. Vamos começar…"), e o leitor novo volta
  aos mesmos cliques de quem já respondeu. A barra fica só com as setas e o nome do passo.
- **Evidência:** percurso do capítulo 1 só pelo compositor: leitor novo com 78 cliques (era 79), a resposta e o
  pedido na mesma fala; quem volta ao livro continua do passo em que parou pelo chat; nenhuma pergunta na barra;
  captura no computador e no celular.
- **Fica fora:** perguntas novas por ação (etapa 4).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `8824ff6` | percurso do capítulo 1: 18 pedidos enviados pelo compositor, 47 falas da pessoa, todas "você"; 78 cliques na minha IDE e 58 no direto, como antes; 79 para o leitor novo (1 para dizer onde faz). Capturas do compositor no computador e no celular | Erick, 24/10/2026 |
| 2 | `0e398ae` | percurso do capítulo 1 só pelo compositor, nenhum "seguir": 78 envios na minha IDE (18 pedidos, 20 "E o próximo?", 40 "Fiz…" em quatro jeitos), 78 cliques aqui no livro mais 1 para dizer onde faz, 58 no direto; 87 falas da pessoa, todas "você"; a caixa avisa quando é para digitar, apostar ou responder. Capturas no computador e no celular. De carona: as opções das perguntas do chat estavam com a cor da página (quase pretas no fundo escuro) | Erick, 24/10/2026 |
| 3 | `0765ce1` | percurso do capítulo 1 só pelo chat: leitor novo com 78 cliques (era 79), "Aqui no livro mesmo." e o primeiro pedido numa fala só; quem volta vê "Você parou no passo 5. Continuo de lá?" e continua dali (67 cliques) ou começa do início e responde onde fazer (79); direto, 58; a barra só com as duas setas. Capturas no computador e no celular (no celular, "Aqui no livro" em destaque) | pendente |

(redação: claude-opus-5-5)
