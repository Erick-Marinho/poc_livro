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
- (etapa 4) Poucas dúvidas, onde o leitor costuma travar, escritas no roteiro com a resposta; o modelo redige, os
  autores revisam. Começa por seis lugares do capítulo 1; a leitura em voz alta com o Victor diz onde faltou.

## Etapas

1. "Você" no chat, e o pedido do passo enviado pelo leitor no compositor.
2. Toda passagem vira fala: o compositor sugere o que leva adiante, e o "seguir" da barra deixa de ser o caminho.
3. A IA pergunta no chat o que hoje a barra pergunta (onde você faz o projeto; continuar de onde parou).
4. Perguntas sugeridas por ação, escritas pelos autores, ao lado da fala que avança.

## Etapa 4 (detalhe)

- **Arquivos:** `livros/ciclo-de-vida/roteiros/01.json` (o campo `duvidas` em seis ações), `src/lib/ideCapitulo.ts`
  (passa e confere), `IdeCapitulo.tsx` e `ide-capitulo.css`, e um teste em `testes/ide-capitulo.test.mjs`.
- **Muda:** depois que a ação foi toda mostrada, as dúvidas dela aparecem como respostas rápidas acima da caixa, ao
  lado da fala que segue. Tocar numa põe a pergunta na conversa como fala do leitor, e a IA responde; a dúvida sai das
  opções. Não segura ninguém: quem não pergunta segue com o mesmo clique. Seis lugares no capítulo 1: o `uv add
  pydantic` (pydantic ou dataclass; o uv.lock), o `--dev`, o erro do id torto (por onde ler um erro), a regra de pedido
  e e-mail (por que no contrato), os testes do R12 (carregou, mas falhou) e a nota de partida (por que 25%).
- **Evidência:** o teste confere que as dúvidas chegam às ações certas; percurso do capítulo 1 sem perguntar, com os
  mesmos cliques; perguntando todas, cada pergunta e resposta na conversa; captura.
- **Fica fora:** responder pergunta escrita pelo leitor (pediria um modelo de verdade, pago, com o ok dos autores).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `8824ff6` | percurso do capítulo 1: 18 pedidos enviados pelo compositor, 47 falas da pessoa, todas "você"; 78 cliques na minha IDE e 58 no direto, como antes; 79 para o leitor novo (1 para dizer onde faz). Capturas do compositor no computador e no celular | Erick, 24/10/2026 |
| 2 | `0e398ae` | percurso do capítulo 1 só pelo compositor, nenhum "seguir": 78 envios na minha IDE (18 pedidos, 20 "E o próximo?", 40 "Fiz…" em quatro jeitos), 78 cliques aqui no livro mais 1 para dizer onde faz, 58 no direto; 87 falas da pessoa, todas "você"; a caixa avisa quando é para digitar, apostar ou responder. Capturas no computador e no celular. De carona: as opções das perguntas do chat estavam com a cor da página (quase pretas no fundo escuro) | Erick, 24/10/2026 |
| 3 | `0765ce1` | percurso do capítulo 1 só pelo chat: leitor novo com 78 cliques (era 79), "Aqui no livro mesmo." e o primeiro pedido numa fala só; quem volta vê "Você parou no passo 5. Continuo de lá?" e continua dali (67 cliques) ou começa do início e responde onde fazer (79); direto, 58; a barra só com as duas setas. Capturas no computador e no celular (no celular, "Aqui no livro" em destaque) | Erick, 24/10/2026 |
| 4 | `8dc979f` | 8 dúvidas em 6 ações do capítulo 1 (o teste confere onde e quantas; o livro não monta com mais de duas por ação). Percurso sem perguntar: 78 cliques, como antes; perguntando todas: cada pergunta como "você" e a resposta da IA na conversa, e a dúvida sai das opções. Captura no computador; no celular, só a caixa | Erick, 24/10/2026 |

(redação: claude-opus-5-5)
