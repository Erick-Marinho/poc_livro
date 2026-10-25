# Figura do agente funcionando

**Problema.** O leitor abandona cedo porque a recompensa demora. O agente só existe no fim do livro,
então mostramos o fim no começo: o agente atendendo perguntas de verdade da loja, por fora (a conversa)
e por dentro (o grafo).

**Regra que não muda.** O livro não pode mentir. A figura é uma *simulação* e diz isso na legenda.
A decisão final de cada cenário vem do `referencia.jsonl`, e o build falha se o roteiro contradisser o contrato.

## Decisões

- (24/10/2026, a pedido do Erick) A figura começa pausada: nada toca sozinho ao chegar na tela; quem dá o play é o leitor.
- (etapa 1) SVG desenhado no servidor por um componente Astro, animado com `<script>` sem framework, como
  `Listagem` e `Classificador`. React Flow não: ele é um editor de grafos (arrastar, zoom), pede React,
  `@astrojs/react` e o CSS próprio, e um container com altura fixa. Aqui o grafo é fixo, e precisamos de
  algo que funcione sem JS e no modo escuro.
  Fontes: https://reactflow.dev/learn · https://docs.astro.build/en/guides/integrations-guide/react/ ·
  https://docs.astro.build/en/guides/client-side-scripts/ (o script é empacotado e entra uma vez por página).
- (etapa 4, substitui a de cima) Ilha React com React Flow (`@xyflow/react` 12.12.0) e Motion (`motion` 14.6.0),
  via `@astrojs/react` 7.1.1, hidratada com `client:visible`. Motivo: a primeira impressão em SVG feito à mão não
  entregou a experiência que o responsável espera. O build continua conferindo o roteiro contra o contrato
  (`FiguraAgente.astro`); a ilha só toca. O servidor desenha o R01 terminado (React Flow SSR: nós com
  `width`/`height` e `handles`, provider com `initialNodes`). Fontes: https://reactflow.dev/learn/advanced-use/ssr-ssg-configuration ·
  https://reactflow.dev/api-reference/react-flow · https://motion.dev/docs/react
- (etapa 4) Palco escuro, como o terminal do livro. A conversa imita um app de atendimento ("digitando…" enquanto o
  grafo trabalha). O agente mostra "o que ele já sabe": o que cada ferramenta devolveu, lido de `pedidos.json` e
  de um `trecho` de `politica.md` (o build falha se o trecho não estiver lá). O selo fica sobre a seta agente → decisão.
- (etapa 4) Dois desenhos do grafo: deitado (640 × 434) no computador, em pé (440 × 524) abaixo de 640 px.
  A figura sai da coluna de texto (até 920 px).
- (etapa 4) Capturas de celular: o Chrome headless não abre janela com menos de 500 px; o celular é a página dentro
  de um iframe de 390 px. As capturas "390 px" das etapas 1 a 3 foram feitas, na verdade, em 500 px.
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

- (25/10/2026, Erick) A figura vira um vídeo (Remotion, como a figura 1 do experimento: `docs/capacidades/figura-em-video.md`),
  aprovado antes no Studio do `my-video`. Até 45 s, os quatro cenários seguidos; a conversa imita um app de mensagens
  (o cliente digita na caixa, ✓✓, "digitando…"), e o mesmo cliente segue na mesma conversa (R01 → R12).
- (25/10/2026, Erick) Só tocar e pausar, discretos: saem as abas clicáveis, o passo a passo e as teclas (etapas 2 e 3).
  Continua valendo: começa pausada, quem dá o play é o leitor.
- (25/10/2026, Erick) No celular, o mesmo vídeo deitado, pequeno (sai o desenho em pé da etapa 4).
- (25/10/2026, Erick) Sem JS e na impressão: a conversa do R01 em texto (etapa 7).
- (6) A conferência do roteiro contra o contrato sai do `FiguraAgente.astro` para `agente/cenarios.ts`, sem mudar
  de regra: o Astro e o Studio montam os cenários pela mesma função. O tempo de cada passo é do vídeo; o `duracao`
  do roteiro deixa de ser usado.
- (6) Parada, a figura mostra o fim do R01 (como o servidor desenhava na etapa 4); o play começa do início. No modo
  direto e com movimento reduzido, mostra o último quadro.
- (25/10/2026, Erick, revisão da etapa 6) Seis ajustes de experiência, sobre os quadros renderizados: (a) uma câmera
  acompanha quem age (a conversa, o agente e as ferramentas, a decisão); (b) o R01 vai devagar e os outros mais
  rápido, com uma pausa no selo e na decisão; (c) a legenda vira uma faixa grande embaixo do quadro, como legenda de
  vídeo; (d) pedido e e-mail não quebram no meio, "nova conversa" marca a troca de cliente, e quem não se identificou
  aparece como "anônimo"; (e) parada, a figura diz a duração ao lado do play; uma linha fina mostra o
  progresso, e no fim as quatro abas ficam com ✓; (f) no R12, antes da decisão, o vídeo para e pergunta o que o
  agente deve fazer; o leitor escolhe uma das quatro (ou pula), e o vídeo mostra a do contrato ao lado da dele.
- (25/10/2026, Erick, ao ver a etapa 7) Até 60 s, e não 45: em 45 ficou acelerado. O tempo a mais vai para digitar, ler, o
  passo do grafo, as pausas do selo e da decisão, a câmera e o fim parado.
- (25/10/2026, Erick) Cerca de 2 min (até 130 s), e não 60: em 60 não dava para ler a legenda e acompanhar ao mesmo
  tempo. O tempo de cada passo vem do texto na tela: legenda a 13 letras/s (mínimo 2 s), resposta a 15 (mínimo 2,6 s),
  1 s para ler a pergunta enviada; abaixo das ~17 letras/s da legendagem, que contam com o olho só no texto.
- (6) A aposta não aparece no modo direto. Ela é da ilha, não do vídeo: a composição só marca o quadro em que ela para.
- (6) A linha do tempo fica em `agente/tempos.ts`, sem JSX, para o teste conferir os 45 s.
- (6) A etapa 5 não foi feita; o teste da etapa 6 faz o que ela pedia (a figura no `npm test`).

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `livros/ciclo-de-vida/figuras/agente.json` | o roteiro: os passos de cada cenário (nó, trajeto, texto, duração) | casos do `referencia.jsonl` | JSON | nova |
| `src/components/livro/FiguraAgente.astro` | desenha o grafo e toca o roteiro | roteiro + `referencia.jsonl` (`?raw`) + `clientes.json` | `<figure>` com SVG | nova |
| conferência do roteiro | o caso existe e a decisão final é a do contrato | roteiro + referência | erro de build | nova |
| `00-prefacio.mdx` | onde a figura aparece | componente | página | existe |
| `agente/cenarios.ts` | os cenários conferidos contra o contrato (sai do `FiguraAgente.astro`) | roteiro, contrato, dados | os cenários | nova (etapa 6) |
| `agente/AgenteAoVivo.tsx` | a figura em vídeo: a conversa e o grafo, quadro a quadro | cenários + nome da loja | a composição | troca (etapa 6; sai o React Flow) |
| `agente/FiguraAgenteVideo.tsx` | a ilha: o Player, com tocar e pausar | as mesmas props | o vídeo na figura | nova (etapa 6) |
| roteiro gravado de um trace real | troca a simulação pelo agente de verdade | trace (cap. 5) | o mesmo JSON | depois |
| o grafo como mapa do livro | cada capítulo acende só o que o leitor já construiu | capítulo atual | o mesmo SVG | depois |

O grafo: **cliente** → **agente** (pensa) ⇄ **ferramentas** (pedidos, política, catálogo)
→ **decisão** (responder · abrir chamado · recusar · passar a vez) → **resposta** ou **pessoa da equipe**.

## Etapas (aceitas pelo responsável)

1. Conversa e grafo em SVG, sincronizados, com um cenário (R01, responder) no prefácio.
2. Os quatro cenários (R01, R12, R09, R16: um por decisão, nesta ordem) em abas, e a conferência do roteiro no build.
3. Controles, acesso e acabamento: pausar, passo a passo, `prefers-reduced-motion`, leitura sem JS, e os 4 ajustes da revisão da etapa 2.
4. A figura refeita em React Flow e Motion, com a mesma conferência no build (pedido do responsável depois da etapa 3).
5. A figura entra no `npm test`: um teste que falha se o roteiro divergir do contrato.
6. A figura vira vídeo (Remotion): a composição aprovada no Studio, a ilha com tocar e pausar, o nome da loja do
   livro, o modo direto e o movimento reduzido no último quadro, e o teste.
7. Sem JS e na impressão: a conversa do R01 em texto.

## Etapa 7, detalhada

- **Arquivos:** `FiguraAgente.astro`; `testes/figura-agente.test.mjs`.
- **Muda:** abaixo do vídeo, um trecho estático com a conversa do R01 (a pergunta, a resposta e uma linha com o que o
  agente consultou, o selo e a decisão), montado dos mesmos cenários. Escondido na tela; aparece na impressão
  (`@media print`, que esconde o vídeo) e sem JS (`<noscript>` com a mesma troca). Cores do papel, para imprimir.
- **Evidência:** `npm test`; o teste novo falha antes do código; capturas sem JS e com a mídia de impressão.
- **Fora:** o vídeo no celular (decidido: fica pequeno).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `4acf2d2` | `npm test`; capturas dos três tempos em 1100/390 px, claro e escuro | Erick, 23/10/2026 |
| 2 | `9d5899c` | `npm test`; o build falha com a escolha do R12 trocada e com o R12 visitando "política"; capturas dos 4 cenários | Erick, 23/10/2026 |
| 3 | `94ea90d` + correção `1d22089` | `npm test`; capturas do selo R12, abas 2×2, movimento reduzido, sem JS e impressão; contraste das pílulas; build rejeita marca de 21 caracteres; selo corrigido por palavras conferido em 1100 px | Erick, 23/10/2026 |
| 4 | `4d862d3` | `npm test`; o build falha com a escolha do R12 trocada e com trecho fora da política; capturas dos 4 cenários em 1100 px, celular em 390 px (iframe), movimento reduzido e sem JS; console sem mensagens | Erick, 23/10/2026 |
| 6 | `c5618ab` + revisão `cd7bc20` | `npm test` com 75 testes (4 da figura: o vídeo, os 45 s, a aposta antes da decisão, o roteiro que contradiz o contrato); o teste falha com a figura antiga (worktree); no navegador (Chrome headless, build de produção): pôster "45 s · 4 situações", parada na aposta aos 17,9 s com o foco no 1º botão, resultado "o contrato decidiu recusar", fim aos 45,8 s, console limpo; quadros renderizados da câmera e da legenda | Erick, 25/10/2026 |

(redação: claude-opus-5-5)
