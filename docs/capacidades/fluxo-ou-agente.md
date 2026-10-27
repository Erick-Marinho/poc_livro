# Fluxo ou agente: quem escolhe a próxima seta

**Problema.** Muita gente acha que pôr um modelo de linguagem dentro de um fluxo o transforma em agente. O 1.1 mostra
quem decide cada passo (a figura das histórias, o controle da escala), mas não ataca essa confusão de frente. O Erick
pediu a diferença entre fluxo e agente, "acompanhada de um gráfico de grafo em cenas" (27/10/2026).

## Decisões

- (27/10/2026, Erick) No 1.1, a diferença entre fluxo e agente, contra a ideia de que um modelo no fluxo basta; com um
  grafo animado, em cenas.
- (1) O critério da figura é o da definição do livro (e da Anthropic): quem escolhe a próxima seta. No fluxo, as setas
  estão no código, mesmo com um modelo em cada caixa; no agente, o modelo escolhe a seta, e pode voltar (o laço).
- (1) Entra logo depois da definição ("a definição deste livro"), antes da escala; não repete a figura das histórias:
  aqui o leitor vê o grafo, as caixas e as setas, e o que muda é quem desenha as setas.
- (1) É ilustração e diz que é. As mensagens e as ferramentas (`consultar_pedido`, `buscar_produto`) são as das figuras
  do 1.1 (`tres-jeitos.json`); o teste confere.

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | O grafo em seis cenas: um fluxo; um modelo dentro dele; um modelo em cada caixa, e a pergunta que o desenho não previa; um agente; a pergunta nova no agente; o teste (quem escolhe a seta) | toca ou rola e vê a mesma confusão desfeita |

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `e9c5051` | `testes/fluxo-ou-agente.test.mjs` (3): as mensagens e as ferramentas são as das histórias do 1.1 (uma inventada não monta), seis cenas em 38 s com um balão por cena, o último sobre quem escolhe a próxima seta, e o grafo entre a definição e a escala. `npm test` 186/186. Ritmo do 1.1: 180 → Aposta. Capturas rolando com a página a 1280 e 390 px das seis cenas; ajustes: os nomes cortados nas caixas, a bolinha sobre o texto e o aviso do produto | aguardando revisão |

(redação: Claude Opus 5.5)
