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
- (7) O endereço é `/experimentos/kv-cache/`: a pasta sai de `rascunhos/` inteira; a página de rascunho e o
  reconhecimento de `/rascunhos/` na IDE saem junto (sem uso), como no `pausa-e-fluxo`.
- (7, 28/10/2026, Erick) O texto abre com a jornada de uma pergunta, animada (`kv/JornadaAnimada.tsx`,
  `figuras/jornada.json`, esboço em `figuras/esboco-jornada.md`): três moradores pelo mesmo caminho; a Ana enche as
  gavetas, o Bruno pula o começo, a Carla leva do mural a resposta errada; os nomes só na última cena. A Carla pergunta
  "sábado de manhã", e não "domingo" (a resposta da Ana, "Não", serviria por acaso); o Bruno, a piscina na segunda
  (o regulamento não dá horário à churrasqueira). A checagem do hash vira palpite (`previsoes-prefixo.json`): o molde
  aceita até 3 Pare e pense e 2 palpites.
- (8, 28/10/2026, Erick) A jornada, versão 2 (esboço em `figuras/esboco-jornada.md`): um cenário por cache, com o nome na
  cena em que ele age: a Ana faz o caminho inteiro; o KV contra a releitura; o Bruno pula o começo (prefixo); a Dani, o
  mesmo numa API paga, com a conta (prompt); o Eduardo recebe do mural a resposta certa, e a Carla, a errada
  (semântico). A figura técnica dos quatro caches sai: a jornada mostra o que ela mostrava.
- (8, 28/10/2026, Erick) Sem a separação em pilhas (A, B, C, D): confunde e quebra a fluidez da leitura. Sem
  dinâmica no lugar; o parágrafo repetido depois da jornada sai, e a abertura fica em 190 palavras sem ação.
- (depois do fecho, 28/10/2026, Erick) A jornada sem salto, para quem não sabe nada do assunto: a primeira cena mostra a
  resposta inteira da Ana, palavra por palavra; a cena do KV compara, em texto, o que o modelo lê para cada palavra, sem e
  com as anotações; as anotações só aparecem na cena que as explica.
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

## Etapa 8 (detalhe)

- **Primeiro, os rascunhos** (skill `revisar-ritmo`, pelo `docs/RITMO.md`): `Rascunho` no texto, só acrescentando
  linhas, onde o relógio passa de 200 palavras sem ação (hoje: 273 antes do palpite do hash e 231 na "Mão na massa").
  O Erick ajusta no arquivo ou pede "preenche".
- **Depois, os ajustes finais:** preencher (ou tirar) os rascunhos, com teste do dado contra a fonte.
- **Evidência:** `npm run ritmo` sem aviso no experimento; `npm test`; capturas do que mudou a 1280 e 390 px.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `11bec6d` | `testes/kv-cache.test.mjs` (2): a mesma pergunta, a longa lendo 46 vezes a curta (10 e 462 palavras), o regulamento igual byte a byte ao do `pausa-e-fluxo`; falha com `mudancas.md` alterado. Testes do livro 207/207 (o `gravacao:testar` já quebrava antes, sem `pytest` no ambiente) | Erick, 27/10/2026 |
| 2 | `149d50b` | `test_laco.py` (9), sem PyTorch: com cache o laço lê `[4, 1, 1, 1, 1]`, sem cache `[4, 5, 6, 7, 8]`, os mesmos tokens; o placar conta no limite e não logo abaixo; os 40 GiB do Daily Dose; falha (`[4, 1, 1, 1, 1] != [4, 5, 6, 7, 8]`) com o laço sem cache lendo só o token novo. Testes do livro 207/207 | Erick, 27/10/2026 |
| 3 | `5020ded` | `coleta.json`: 5 repetições na CPU (x86_64, torch 2.8.0, transformers 4.57.1, `sdpa`), 1 h 56 min; `medir.py`: passo com cache 74,5 e 131,9 ms, sem cache 934,9 e 8862 ms (curta e longa); placar 5, 5, 1 e 10 de 10 (o item 3 não se confirmou: em 4 de 5, o passo da longa custou 70% a 77% a mais); cache igual à conta (33,7 e 207,6 MiB); o modelo errou o sábado na longa. `test_laco.py` 9/9 | Erick, 28/10/2026 |
| 4 | `7af014f` | `figuras/esboco.md`: duas figuras em ASCII, seis cenas cada (os quatro caches em dois grupos; a atendente com e sem anotações, o medidor e a pergunta da aposta), sem números da coleta e sem o resultado do item 3 | Erick, 28/10/2026 |
| 5 | `0422e83` | `testes/kv-cache.test.mjs` (6): seis cenas em até 45 s em cada figura, balões de até 14 palavras, sem número nem "token/prefill/decode", palavras e trecho iguais aos do corpus, a figura 2 sem pergunta, o build sem a página de rascunho; falha com uma pergunta no último balão. Testes do livro 211/211. Capturas das 12 cenas a 1280 e 390 px; ajustes: o trecho cortado, os blocos no celular, o aviso antes da hora | Erick, 28/10/2026 |
| 6 | `7898870` | `scripts/saidas.py rascunhos/kv-cache`: 22 passos da pasta vazia ao `projeto/`, `--conferir` com 8 saídas iguais; a primeira leitura com a pausa na média (201,1 ms, 0 de 5), a corrigida (131,9 ms, 1 de 5); os 3 testes do placar falham com a `escrita` errada. Testes 211/211. A IDE percorrida no navegador, com capturas da aposta, do tropeço, do porquê e do placar | Erick, 28/10/2026 |
| 7 | `3a2e7b2` | A página em `/experimentos/kv-cache/`, nível avançado, no molde: a jornada animada (7 cenas) na abertura, as correções ao artigo com fonte, o palpite do hash, a IDE, o tropeço, o que muda no trabalho; "O que deu" 5, 5, 1 de 5 e 10 de 10. `testes/kv-cache.test.mjs` (9): os números do texto contra as saídas, as respostas da jornada contra o regulamento. Testes 214/214; ritmo com dois avisos (273 e 231). Capturas a 1280 e 390 px | Erick, 28/10/2026 |
| 8 | `b71be23`, `992d1f8`, `7b98ead`, `4ede1af` | O rascunho do ritmo (Pilhas), preenchido e depois tirado a pedido do Erick (confundia); pelo `docs/RITMO.md`: a previsão sobre a Carla antes do play, o palpite do hash antes da explicação, a nota no fim; a jornada versão 2, um cenário por cache em seis cenas de até 8 s (Ana, KV, Bruno, Dani com a conta, Eduardo certo, Carla errada), e a figura técnica fora. `npm run ritmo` sem aviso (maior trecho, 190). Testes 214/214; capturas das seis cenas a 1280 e 390 px | Erick, 28/10/2026 |

(redação: Claude Opus 5.5)
