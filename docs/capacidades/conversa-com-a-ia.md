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

## Etapas

1. "Você" no chat, e o pedido do passo enviado pelo leitor no compositor.
2. Toda passagem vira fala: o compositor sugere o que leva adiante, e o "seguir" da barra deixa de ser o caminho.
3. A IA pergunta no chat o que hoje a barra pergunta (onde você faz o projeto; continuar de onde parou).
4. Perguntas sugeridas por ação, escritas pelos autores, ao lado da fala que avança.

## Etapa 1 (detalhe)

- **Arquivos:** `src/components/livro/ide/IdeCapitulo.tsx` e `ide-capitulo.css`.
- **Muda:** o rótulo da pessoa passa de "Erick" a "você" (o pedido, as apostas, as perguntas, as trocas); o compositor
  ganha a caixa de mensagem com a fala sugerida e o enviar (↑); no começo do capítulo a conversa espera o primeiro
  pedido; no fecho de cada passo, a sugestão é o pedido do próximo, e enviar faz o mesmo que "próximo passo". Fora
  disso, a caixa fica vazia e o "seguir" da barra continua (a etapa 2 cuida).
- **Evidência:** percurso do capítulo 1 no Chrome headless: os 18 pedidos enviados pelo compositor aparecem como
  "você", nenhum "Erick" no chat; os cliques continuam 78 (o envio substitui o "próximo passo" e o primeiro "seguir"),
  mais 1 para quem ainda não disse onde faz o projeto (responder já não abre o passo); captura do compositor no
  computador e no celular.
- **Fica fora:** as outras passagens (etapa 2), a pergunta de onde fazer no chat (etapa 3), perguntas novas (etapa 4).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `938c8d5` | percurso do capítulo 1: 18 pedidos enviados pelo compositor, 47 falas da pessoa, todas "você"; 78 cliques na minha IDE e 58 no direto, como antes; 79 para o leitor novo (1 para dizer onde faz). Capturas do compositor no computador e no celular | pendente |

(redação: claude-opus-5-5)
