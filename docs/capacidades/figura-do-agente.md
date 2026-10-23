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

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `livros/ciclo-de-vida/figuras/agente.json` | o roteiro: os passos de cada cenário (nó, texto, duração) | casos do `referencia.jsonl` | JSON | nova |
| `src/components/livro/FiguraAgente.astro` | desenha o grafo e toca o roteiro | roteiro + `referencia.jsonl` (`?raw`) | `<figure>` com SVG | nova |
| conferência do roteiro | o caso existe e a decisão final é a do contrato | roteiro + referência | erro de build | nova |
| `00-prefacio.mdx` | onde a figura aparece | componente | página | existe |
| roteiro gravado de um trace real | troca a simulação pelo agente de verdade | trace (cap. 5) | o mesmo JSON | depois |
| o grafo como mapa do livro | cada capítulo acende só o que o leitor já construiu | capítulo atual | o mesmo SVG | depois |

O grafo: **cliente** → **agente** (pensa) ⇄ **ferramentas** (pedidos, política, catálogo, abrir chamado)
→ **decisão** (responder · abrir chamado · recusar · passar a vez) → **resposta** ou **pessoa da equipe**.

## Etapas (aceitas pelo responsável)

1. Conversa e grafo em SVG, sincronizados, com um cenário (R01, responder) no prefácio.
2. Os quatro cenários (R01, R12, R09, R16: um por decisão, nesta ordem) em abas, e a conferência do roteiro no build.
3. Controles e acesso: pausar, passo a passo, `prefers-reduced-motion`, leitura sem JS.
4. A figura entra no `npm test`: um teste que falha se o roteiro divergir do contrato.

## Etapa 1, detalhada

- **Arquivos:** `FiguraAgente.astro` (novo), `figuras/agente.json` (novo, só o R01), `00-prefacio.mdx`.
- **O que muda:** duas colunas, a conversa e o grafo. Sem JS, aparecem a conversa inteira do R01 e o grafo estático.
  Com JS, quando a figura entra na tela (IntersectionObserver, como em `Listagem`), tudo toca em três tempos:
  (1) a pergunta do R01 entra na conversa; (2) a conversa para e uma bolinha percorre cliente → agente →
  pedidos → agente → decisão "responder" → resposta, acendendo o nó ativo; (3) o grafo para e a resposta,
  escrita no roteiro, entra na conversa.
  Cores só pelos tokens de `livro.css` (`--acento`, `--ok`, `--linha`…), para o modo escuro sair de graça.
  Legenda: "Figura P.1 · Simulação do agente que você vai construir. A pergunta e a decisão vêm do contrato do capítulo 1."
- **Evidência:** `npm test` passa, e capturas do prefácio em 1100 px e 390 px, nos modos claro e escuro,
  com a figura parada e em cada um dos três tempos.
- **Fora:** outros cenários, abas, conferência no build, botões de controle.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|

(redação: claude-opus-5-5)
