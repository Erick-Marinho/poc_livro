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

## Etapas

1. "Você" no chat, e o pedido do passo enviado pelo leitor no compositor.
2. Toda passagem vira fala: o compositor sugere o que leva adiante, e o "seguir" da barra deixa de ser o caminho.
3. A IA pergunta no chat o que hoje a barra pergunta (onde você faz o projeto; continuar de onde parou).
4. Perguntas sugeridas por ação, escritas pelos autores, ao lado da fala que avança.

## Etapa 2 (detalhe)

- **Arquivos:** `src/components/livro/ide/IdeCapitulo.tsx` e `ide-capitulo.css`.
- **Muda:** cada passagem é uma fala que o leitor envia pelo compositor, e ela fica na conversa depois de enviada. Entre
  blocos de código, "E o próximo?"; depois de uma ação, quem faz na própria IDE diz que fez ("Fiz na minha IDE." e
  variações), quem faz aqui no livro diz para seguir ("E agora?" e variações); no fecho, o pedido do passo seguinte
  (etapa 1). Quando o terminal ou o chat pedem algo (digitar, apostar, responder), a caixa diz o quê, sem envio. A
  barra de baixo perde o botão "seguir": ficam as setas de voltar e avançar (para reler e para o teclado), o nome do
  passo e as perguntas de onde fazer e de continuar (etapa 3).
- **Evidência:** percurso do capítulo 1 só pelo compositor, nos três modos: o mesmo número de cliques (78, 78 e 58),
  nenhum "seguir"; as falas de passagem na conversa como "você"; captura no computador e no celular.
- **Fica fora:** a pergunta de onde fazer e o continuar no chat (etapa 3), perguntas novas (etapa 4).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `8824ff6` | percurso do capítulo 1: 18 pedidos enviados pelo compositor, 47 falas da pessoa, todas "você"; 78 cliques na minha IDE e 58 no direto, como antes; 79 para o leitor novo (1 para dizer onde faz). Capturas do compositor no computador e no celular | Erick, 24/10/2026 |
| 2 | `0e398ae` | percurso do capítulo 1 só pelo compositor, nenhum "seguir": 78 envios na minha IDE (18 pedidos, 20 "E o próximo?", 40 "Fiz…" em quatro jeitos), 78 cliques aqui no livro mais 1 para dizer onde faz, 58 no direto; 87 falas da pessoa, todas "você"; a caixa avisa quando é para digitar, apostar ou responder. Capturas no computador e no celular. De carona: as opções das perguntas do chat estavam com a cor da página (quase pretas no fundo escuro) | pendente |

(redação: claude-opus-5-5)
