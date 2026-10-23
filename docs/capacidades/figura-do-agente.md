# Figura do agente funcionando

**Problema.** O leitor abandona cedo porque a recompensa demora. O agente só existe no fim do livro,
então mostramos o fim no começo: o agente atendendo perguntas de verdade da loja, por fora (a conversa)
e por dentro (o grafo).

**Regra que não muda.** O livro não pode mentir. A figura é uma *simulação* e diz isso na legenda.
A decisão final de cada cenário vem do `referencia.jsonl`, e o build falha se o roteiro contradisser o contrato.

## Decisões

- (etapa 1) SVG desenhado no servidor por um componente Astro, animado com `<script>` sem framework, como
  `Listagem` e `Classificador`. React Flow não: ele é um editor de grafos (arrastar, zoom), pede React,
  `@astrojs/react` e o CSS próprio, e um container com altura fixa. Aqui o grafo é fixo, e precisamos de
  algo que funcione sem JS e no modo escuro.
  Fontes: https://reactflow.dev/learn · https://docs.astro.build/en/guides/integrations-guide/react/ ·
  https://docs.astro.build/en/guides/client-side-scripts/ (o script é empacotado e entra uma vez por página).
- (etapa 1) Conversa e grafo juntos, sincronizados. Uma coisa se mexe por vez e a conversa conduz:
  a pergunta aparece → a conversa para e o grafo anima → o grafo para e a resposta aparece.
  No computador, a conversa fica à esquerda e o grafo à direita; abaixo de 640 px, a conversa fica em cima.
- (etapa 1) Lugar: prefácio, seção "O que você vai construir", logo depois da lista dos 8 capítulos
  (confirmado pelo responsável).
- (etapa 1) O roteiro toca uma vez: 2 segundos para a pergunta, 8 para o grafo e 2 para a resposta;
  depois permanece parado com a conversa inteira.
- (etapa 2) Ordem dos cenários: R01 primeiro (o fluxo simples), R12 em seguida (o pedido de outra pessoa:
  o grafo mostra a comparação do e-mail com o do dono e a recusa).
- (etapa 2) "abrir chamado" sai das ferramentas e fica só como decisão (sugestão do planejador; o responsável pode mudar).
- (etapa 2) As ferramentas são nós separados: pedidos, política, catálogo. O build falha se as ferramentas que o
  roteiro visita não forem as do `precisa` do caso, ou se a `escolha` do passo `decisao` não for a `decisao` do caso.
- (etapa 2) Duas saídas, que são canais e não decisões: **resposta** (o agente escreve; vale para responder, recusar
  e abrir chamado) e **pessoa da equipe** (só passar a vez). O build também falha se a saída não for a do canal da decisão.
- (etapa 2) O nome de quem pergunta vem do `clientes.json`, pelo e-mail do caso; sem e-mail, "cliente".
- (etapa 2) Ao entrar na tela, toca R01 e depois R12, uma vez. As abas tocam o cenário escolhido.
- (etapa 2) O grafo do R09 dura 10 segundos para mostrar as duas consultas; os demais duram 8, com 2 para a pergunta e 2 para a resposta.
- (etapa 2) Escolher uma aba cancela a sequência automática; as setas esquerda/direita, Home e End também escolhem a aba.
- (etapa 2) A pílula escolhida e o canal ficam acesos no fim; o andamento final usa o texto do passo do canal de saída.
- (etapa 3) Um painel estático do R01 mantém o estado final sem JS e na impressão, independente da aba ou do passo em tela.
- (etapa 3) Avançar e voltar pausam no início do passo; tocar retoma o progresso, e tocar de novo reinicia o cenário (pausado em movimento reduzido).
- (etapa 3) O anúncio acessível fica numa região separada do andamento visual; só ações do leitor atualizam essa região.
- (etapa 3) As pílulas usam texto `--ink` sobre `--papel-2`, borda `--ok` na escolha e fonte SVG de 20 px para compensar a escala.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `livros/ciclo-de-vida/figuras/agente.json` | o roteiro: os passos de cada cenário (nó, trajeto, texto, duração) | casos do `referencia.jsonl` | JSON | nova |
| `src/components/livro/FiguraAgente.astro` | desenha o grafo e toca o roteiro | roteiro + `referencia.jsonl` (`?raw`) + `clientes.json` | `<figure>` com SVG | nova |
| conferência do roteiro | o caso existe e a decisão final é a do contrato | roteiro + referência | erro de build | nova |
| `00-prefacio.mdx` | onde a figura aparece | componente | página | existe |
| roteiro gravado de um trace real | troca a simulação pelo agente de verdade | trace (cap. 5) | o mesmo JSON | depois |
| o grafo como mapa do livro | cada capítulo acende só o que o leitor já construiu | capítulo atual | o mesmo SVG | depois |

O grafo: **cliente** → **agente** (pensa) ⇄ **ferramentas** (pedidos, política, catálogo)
→ **decisão** (responder · abrir chamado · recusar · passar a vez) → **resposta** ou **pessoa da equipe**.

## Etapas (aceitas pelo responsável)

1. Conversa e grafo em SVG, sincronizados, com um cenário (R01, responder) no prefácio.
2. Os quatro cenários (R01, R12, R09, R16: um por decisão, nesta ordem) em abas, e a conferência do roteiro no build.
3. Controles, acesso e acabamento: pausar, passo a passo, `prefers-reduced-motion`, leitura sem JS, e os 4 ajustes da revisão da etapa 2.
4. A figura entra no `npm test`: um teste que falha se o roteiro divergir do contrato.

## Etapa 3, detalhada

- **Arquivos:** `FiguraAgente.astro` e `figuras/agente.json`.
- **Estado por passo:** o que a figura mostra é função de (cenário, passo, progresso). Pausar, avançar e voltar só
  mudam o passo; não há segundo caminho de animação.
- **Controles,** numa barra abaixo das abas: tocar/pausar, passo anterior, próximo passo, tocar de novo. São botões de
  verdade, com rótulo acessível. O andamento vira `aria-live="polite"`, mas só anuncia o passo que o leitor pediu,
  não os da reprodução automática.
- **Movimento reduzido** (`prefers-reduced-motion: reduce`): nada toca sozinho e a bolinha não anda. A figura abre no
  primeiro passo do R01, e o leitor avança com "próximo passo"; nó e aresta mudam sem transição.
- **Sem JS e na impressão:** o R01 no estado final, com a pergunta, a resposta, "pedidos" marcado, a pílula
  "responder" e o canal "resposta" acesos. Abas e controles ficam escondidos.
- **Acabamento (revisão da etapa 2):**
  (1) só as arestas do cenário atual aparecem; as outras somem, e com elas as pontas amontoadas no nó "agente";
  (2) pílulas de decisão com no mínimo 13 px e texto com contraste de 4,5:1 contra o fundo, nos dois modos;
  (3) campo opcional `marca` no passo: um selo curto (até 20 caracteres) junto ao nó do passo, que fica até o fim
  do cenário. R01: "e-mail = dono"; R12: "e-mail ≠ dono"; R09: "dentro dos 90 dias". A conferência rejeita marca longa;
  (4) abaixo de 640 px, as abas viram uma grade 2×2 de mesma largura.
- **Evidência:** `npm test` passa. Capturas: R12 em 1100 px no passo da comparação, com o selo "e-mail ≠ dono";
  390 px com as abas em 2×2, no claro e no escuro; com `--force-prefers-reduced-motion`, a figura parada no primeiro
  passo e depois de dois "próximo passo"; sem JS (`--blink-settings=scriptEnabled=false`), o estado final do R01.
  A conta de contraste das pílulas nos dois modos. O build falhando com uma marca de 21 caracteres.
- **Fora:** o teste no `npm test` (etapa 4), o mapa do livro, o roteiro gravado de um trace real.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `4acf2d2` | `npm test`; capturas dos três tempos em 1100/390 px, claro e escuro | Erick, 23/10/2026 |
| 2 | `9d5899c` | `npm test`; o build falha com a escolha do R12 trocada e com o R12 visitando "política"; capturas dos 4 cenários | Erick, 23/10/2026 |

(redação: claude-opus-5-5)
