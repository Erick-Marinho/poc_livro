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
  roteiro visita não forem as do `precisa` do caso, ou se a saída (resposta ou pessoa da equipe) não for a da `decisao`.
- (etapa 2) O nome de quem pergunta vem do `clientes.json`, pelo e-mail do caso; sem e-mail, "cliente".
- (etapa 2) Ao entrar na tela, toca R01 e depois R12, uma vez. As abas tocam o cenário escolhido.

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
3. Controles e acesso: pausar, passo a passo, `prefers-reduced-motion`, leitura sem JS.
4. A figura entra no `npm test`: um teste que falha se o roteiro divergir do contrato.

## Etapa 2, detalhada

- **Arquivos:** `FiguraAgente.astro`, `figuras/agente.json` (vira `{ "cenarios": [...] }`), `00-prefacio.mdx` (só as props).
- **Roteiro:** cada passo tem `no`, `trajeto` opcional (ex.: `"agente-politica"`), `texto` e `duracao`. Nada no componente
  fica preso a um caso: nome, caminho da bolinha, andamento final e `<desc>` do SVG saem do roteiro e dos dados.
- **Cenários e respostas** (simulação; conferir contra `pedidos.json` e `politica.md`):
  - R01 · pedidos → responder: a resposta da etapa 1.
  - R12 · pedidos, o agente compara o e-mail com o do dono → recusar: "Não consigo passar informações desse pedido:
    o e-mail informado não é o da compra. Se o pedido for seu, me diga o e-mail que você usou ao comprar."
    A resposta não diz de quem é o pedido.
  - R09 · pedidos → política → abrir chamado: "Ana, sinto muito pela tampa. O pedido BT-1004 foi entregue em 07/11/2026,
    dentro dos 90 dias para defeito. Abri um chamado de troca e vou mandar uma etiqueta de envio."
  - R16 · nenhuma ferramenta → passar a vez → pessoa da equipe: "Claro. Vou passar a conversa para uma pessoa da equipe."
- **Abas:** uma por cenário, rotuladas pela decisão ("responder", "recusar", "abrir chamado", "passar a vez").
- **Ajustes da revisão da etapa 1:** (a) "e-mail" e "BT-1002" nunca quebram no hífen; (b) espaço inquebrável em
  "capítulo 1" na legenda; (c) a animação começa quando o grafo, e não a figura, estiver 60% à vista; (d) erro claro
  no build para caso inexistente, nó ou trajeto desconhecido e cenário sem o passo `conversa`.
- **Evidência:** `npm test` passa; o build falha, com mensagem que diz o caso, quando o R12 do roteiro sai por
  "resposta" em vez de recusar, ou visita "política" (mostrar a saída e desfazer); capturas em 1100 px dos quatro cenários
  no meio do grafo e no fim, e em 390 px do R12 no fim, uma delas no modo escuro.
- **Fora:** pausar, passo a passo, `prefers-reduced-motion`, sem JS para outros cenários além do R01, teste no `npm test`.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `4acf2d2` | `npm test`; capturas dos três tempos em 1100/390 px, claro e escuro | Erick, 23/10/2026 |

(redação: claude-opus-5-5)
