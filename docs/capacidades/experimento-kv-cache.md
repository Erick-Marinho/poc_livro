# Experimento: o que o modelo anota enquanto escreve

**Problema.** "Cache" virou uma palavra só para quatro coisas diferentes, e o leitor não sabe qual delas faz a resposta
sair rápida. O artigo trazido pelo Erick (Shaik Hamzah, [*The Four Caches in LLM Serving*](https://www.analyticsvidhya.com/blog/2026/09/four-caches-in-llm-serving/),
Analytics Vidhya, set/2026) separa os quatro, mas erra o hash do cache de prefixo e trata o KV cache como ganho sem
custo. O [Daily Dose of DS](https://www.dailydoseofds.com/p/kv-vs-prefix-vs-prompt-vs-semantic-caching/) (Avi Chawla,
ago/2026) é a segunda referência. O leitor liga e desliga o KV cache num modelo de verdade e mede o preço de cada palavra.

## Decisões

- (27/10/2026, Erick) O experimento é sobre o KV cache: os caches de prompt e semântico já são os mais comentados.
- (27/10/2026, Erick) O texto abre explicando os quatro tipos de cache; o experimento vem depois.
- (1) Os quatro em dois grupos: três reaproveitam a leitura do modelo (KV, prefixo, prompt: o mesmo estado K/V em três
  alcances) e nunca mudam a resposta; um reaproveita a resposta pronta (semântico) e pode errar.
- (1) Contra o artigo, pela documentação: o hash do bloco junta o hash do bloco anterior, os tokens e as chaves extras,
  e não "o conteúdo e a posição" ([vLLM, prefix caching](https://docs.vllm.ai/en/latest/design/prefix_caching.html));
  um bloco igual depois de um diferente não é reaproveitado. E o KV cache tem preço: memória por token e a leitura do
  cache inteiro a cada palavra (o achado do `pausa-e-fluxo`: o ritmo caiu 25% com a mensagem longa).
- (1) A mesma atendente do `pausa-e-fluxo`: com o cache, ela guarda uma anotação de cada palavra já lida; sem ele,
  relê tudo antes de cada palavra nova.
- (1) O corpus é o regulamento do `pausa-e-fluxo` (condomínio inventado), copiado e conferido igual ao de lá.
- (1) Até a etapa 7, o experimento mora em `rascunhos/kv-cache/`.
- (27/10/2026, Erick) O fecho traz o que o KV cache muda no trabalho de quem lê, cada consequência presa a uma medida:
  as regras do cache de prompt (o item 4), o contexto longo pesando também na escrita (o item 3), a pausa e o passo
  como duas métricas de latência, e a capacidade de quem hospeda o modelo (a conferência dos bytes). Etapa 6 ou 7.
- (27/10/2026, Erick) Nível **avançado**: pede PyTorch e a leitura do custo por passo.
- (27/10/2026, Erick) O modelo é o `Qwen/Qwen3-0.6B`, com `torch==2.8.0` e `transformers==4.57.1`: a pilha fixada do
  `temperatura-zero` (o leitor pode já tê-la instalado).

## Régua (definida antes de construir)

- **Corpus:** a mesma pergunta ("Posso fazer a minha mudança no sábado à tarde?") em dois casos: só a pergunta (curta)
  e o regulamento inteiro antes dela (longa, 452 palavras de material).
- **Medida:** um laço de geração próprio, sem o `generate`, com a escolha gulosa (o token de maior pontuação), 128 tokens
  novos, só na CPU e com as threads fixadas. **Com cache:** um `DynamicCache` e, a cada passo, só o token novo
  ([transformers, cache strategies](https://huggingface.co/docs/transformers/en/kv_cache)). **Sem cache:** a sequência
  inteira a cada passo, com `use_cache=False`. Grava o tempo de cada passo e o tamanho do cache em bytes. Cinco
  repetições por caso e modo; uma chamada de aquecimento, descartada.
- **Placar (X de 5 em cada):**
  1. sem cache, na curta, os 16 últimos passos custam ao menos o dobro dos 16 primeiros (a rampa);
  2. na longa, o passo sem cache custa ao menos 10 vezes o passo com cache (cada palavra paga a pausa de novo);
  3. com cache, o passo da longa fica a até 20% do da curta (o que o artigo dá a entender);
  4. os mesmos 128 tokens com e sem cache (o Daily Dose chama os três primeiros caches de "correctness-neutral").
- **Conferência, fora do placar:** o cache medido em bytes é igual a 2 × camadas × cabeças K/V × dimensão × bytes por
  número × tokens.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `projeto/casos.jsonl` e `projeto/dados/` | o corpus congelado | o regulamento do `pausa-e-fluxo` | dois casos | reuso (etapa 1) |
| `projeto/` (Python + `uv`) | gera com e sem cache, cronometra cada passo; testes com um modelo de mentira | o corpus | um registro por passo | nova |
| coleta gravada | o placar vem do modelo real, com máquina e versões | os registros | `saidas.json` e o `coleta.json` | reuso |
| figuras | os quatro caches em dois grupos; a atendente com e sem anotações | o plano | cenas Remotion com play | nova |
| roteiro da IDE | o leitor monta o laço, aposta e mede | o projeto | os passos | reuso (`IdeCapitulo`) |
| página | o molde, com o nível decidido | tudo acima | `/experimentos/kv-cache/` | nova |

## Etapas

| Etapa | O que |
|---|---|
| 1 | O plano, a régua e o corpus congelado, com o teste do corpus |
| 2 | O medidor: o laço com e sem cache, cronometrado por passo, com testes que rodam sem o modelo |
| 3 | A coleta real: o modelo na CPU, medidas gravadas com máquina e versões |
| 4 | O esboço das figuras (ASCII), para o ok antes de animar |
| 5 | As figuras animadas (Remotion), com play e uma cena por vez |
| 6 | A construção na IDE: passos, apostas e o tropeço |
| 7 | A página no molde, movida para `experimentos/`, conferida pelo `npm test` |
| 8 | O ritmo (`npm run ritmo`, revisar-ritmo) e os ajustes finais |

## Etapa 4 (detalhe)

- **Arquivo:** `rascunhos/kv-cache/figuras/esboco.md`: duas figuras em ASCII, seis cenas cada. A primeira, os quatro
  caches em dois grupos (abre o texto); a segunda, a atendente com e sem anotações, o medidor e a pergunta que vai para
  a aposta da IDE. O celular, o modo direto e o que fica de fora.
- **Decisão:** (4) A figura 2 mostra que, com o cache, a atendente olha as anotações, sem dizer quanto isso custa: o
  item 3 do placar é a aposta.
- **Evidência:** o esboço lido e aprovado pelo Erick, antes de qualquer código de animação.
- **Fica fora:** o Remotion (etapa 5) e o texto.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `11bec6d` | `testes/kv-cache.test.mjs` (2): a mesma pergunta, a longa lendo 46 vezes a curta (10 e 462 palavras), o regulamento igual byte a byte ao do `pausa-e-fluxo`; falha com `mudancas.md` alterado. Testes do livro 207/207 (o `gravacao:testar` já quebrava antes, sem `pytest` no ambiente) | Erick, 27/10/2026 |
| 2 | `149d50b` | `test_laco.py` (9), sem PyTorch: com cache o laço lê `[4, 1, 1, 1, 1]`, sem cache `[4, 5, 6, 7, 8]`, os mesmos tokens; o placar conta no limite e não logo abaixo; os 40 GiB do Daily Dose; falha (`[4, 1, 1, 1, 1] != [4, 5, 6, 7, 8]`) com o laço sem cache lendo só o token novo. Testes do livro 207/207 | Erick, 27/10/2026 |
| 3 | `5020ded` | `coleta.json`: 5 repetições na CPU (x86_64, torch 2.8.0, transformers 4.57.1, `sdpa`), 1 h 56 min; `medir.py`: passo com cache 74,5 e 131,9 ms, sem cache 934,9 e 8862 ms (curta e longa); placar 5, 5, 1 e 10 de 10 (o item 3 não se confirmou: em 4 de 5, o passo da longa custou 70% a 77% a mais); cache igual à conta (33,7 e 207,6 MiB); o modelo errou o sábado na longa. `test_laco.py` 9/9 | Erick, 28/10/2026 |

(redação: Claude Opus 5.5)
