# Experimento: por que a resposta demora para começar?

**Problema.** Quem usa um chat de IA vê um segundo parado e depois o texto escorrendo, sem saber que são dois
trabalhos diferentes. O artigo trazido pelo Erick (Janvi Kumari, [*LLM Inference Explained*](https://www.analyticsvidhya.com/blog/2026/10/llm-inference-explained-optimization-techniques/),
Analytics Vidhya, out/2026) explica isso, mas o laboratório dele mede errado em dois pontos (abaixo). O leitor novato
mede os dois trabalhos na própria máquina, com o Ollama, e descobre o cache ao tropeçar nele.

## Decisões

- (27/10/2026, Erick) A afirmação: a pausa antes da primeira palavra cresce com o tamanho do que o modelo lê
  (prefill); o fluxo depois dela quase não muda (decode). O cache é o achado inesperado. A concorrência fica fora.
- (27/10/2026, Erick) Nível **novato**: linguagem clara, conceito explicado do zero, poucas analogias.
- (27/10/2026, Erick) Remotion nas figuras em cenas, no padrão do livro; gráfico ou animação onde o conceito é difícil.
- (1) Uma analogia só, do começo ao fim: a atendente que **lê** a mensagem inteira e depois **escreve** a resposta.
- (1) Contra o artigo, pela documentação do Ollama: o `prompt_eval_duration` conta só os tokens fora do cache
  ([api/generate](https://docs.ollama.com/api/generate)), e os prompts do passo 5 dele começam iguais; e o
  `OLLAMA_NUM_PARALLEL` vale 1 por padrão ([faq](https://docs.ollama.com/faq)), então as perguntas "simultâneas" do
  passo 7 fazem fila.
- (1) Até a etapa 7, o experimento mora em `rascunhos/pausa-e-fluxo/`: o teste confere toda pasta de `experimentos/`.
- (1) O modelo é o `llama3.2:3b`, o mesmo do segundo cérebro (o leitor pode já tê-lo baixado).

## Régua (definida antes de construir)

- **Corpus:** a mesma pergunta ("O meu pedido BT-1003 já saiu? Quando ele chega?") em três casos que só mudam o
  quanto o modelo lê antes: nada, os pedidos, ou política + catálogo + pedidos (10, 82 e 430 palavras). Nenhum caso
  começa como outro. Os dados são os da loja do livro (inventada).
- **Medida:** temperatura 0, resposta limitada a 64 tokens, só na CPU (`num_gpu: 0`); o modelo sai da memória antes
  da coleta e uma chamada de aquecimento é descartada. Dez rodadas de curta → média → longa → longa de novo; cada
  pedido começa com o seu "Atendimento N.", e só a longa de novo repete o texto da longa. **Pausa:** tempo até o primeiro
  pedaço da resposta, por streaming. **Fluxo:** tokens escritos por segundo (`eval_count / eval_duration`). Cada
  execução guarda os tokens lidos do cache.
- **Placar:** a pausa da longa maior que a da curta, X de 10 rodadas; o fluxo da longa a até 20% do da curta, X de 10.
  **Achado:** a longa repetida logo em seguida, com a segunda pausa menor e a maior parte do que leu vinda do cache,
  X de 10.
- (3, 27/10/2026, Erick) Só na CPU: a pausa vai de 0,3 s a quase 10 s e o leitor sente; na GPU fica abaixo de 0,3 s.
- (3, 27/10/2026, Erick: "A") O Ollama 0.40 guarda várias leituras, não só a última: a primeira coleta leu do cache
  da rodada 2 em diante (pausa da longa maior em 1 de 10). Cada pedido passa a começar com o seu número. E todo pedido
  traz uns 20 tokens do cache (o começo fixo antes da pergunta): o achado conta a maior parte, não "algum".

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `projeto/casos.jsonl` e `projeto/dados/` | o corpus congelado | os dados da loja | três casos | nova (etapa 1) |
| `projeto/` (Python + `uv`) | mede a pausa e o fluxo no Ollama; testes que rodam sem o modelo | o corpus | um registro por execução | nova |
| coleta gravada | o placar vem do modelo real, com máquina e versão | os registros | `saidas.json`, `procedencia.json` | reuso |
| figura "O que vamos construir" | a pausa e o fluxo, um trabalho por vez | a coleta | cenas Remotion com play | nova |
| roteiro da IDE | o leitor monta o medidor, aposta e tropeça no cache | o projeto | os passos | reuso (`IdeCapitulo`) |
| página | o molde, `nivel: novato` | tudo acima | `/experimentos/<nome>/` | nova |

## Etapas

| Etapa | O que |
|---|---|
| 1 | O plano, a régua e o corpus congelado, com o teste do corpus |
| 2 | O medidor: projeto Python que mede a pausa e o fluxo, com testes que rodam sem o modelo |
| 3 | A coleta real: Ollama instalado, medidas gravadas com máquina e versão |
| 4 | O esboço da figura (ASCII), para o ok antes de animar |
| 5 | A figura animada (Remotion), com play e um passo por vez |
| 6 | A construção na IDE: passos, apostas e o tropeço no cache |
| 7 | A página no molde, movida para `experimentos/`, conferida pelo `npm test` |
| 8 | O ritmo (`npm run ritmo`, revisar-ritmo) e os ajustes finais |

## Etapa 5 (detalhe)

- **Arquivos:** `rascunhos/pausa-e-fluxo/figuras/pausa.json` (a ilustração: a pergunta, a resposta em pedaços, as
  três mensagens com as palavras do corpus); em `src/components/livro/pausa/`: `pausa.ts` (as cenas, os balões e os
  resumos, puro, para o teste), `PausaAnimada.tsx` (Remotion) e `FiguraPausa.tsx` (com `palco/RolaCena`, como a
  figura da temperatura zero); `src/components/livro/PausaEFluxo.astro`; `scripts/ritmo.mjs` (a figura não conta como
  ação); `testes/pausa-e-fluxo.test.mjs`.
- (5) A figura aparece só no `astro dev`, em `/rascunhos/pausa-e-fluxo/`: no build, a rota não gera página.
- **Evidência:** o teste (seis cenas em até 45 s, um balão de uma frase por cena, sem número da coleta, sem "token",
  "prefill", "decode" nem "cache", as palavras das mensagens iguais às do corpus); capturas das seis cenas a 1280 e
  390 px; o build sem a página de rascunho.
- **Fica fora:** a página do experimento (etapa 7).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `ee07fbb` | `testes/pausa-e-fluxo.test.mjs` (2): a mesma pergunta, cada caso lê ao menos 4 vezes o anterior (10, 82 e 430 palavras), começos diferentes; falha com a longa começando como a média. Testes do livro 189/189 | Erick, 27/10/2026 |
| 2 | `790450c` | `test_medidor.py` (6), sem o Ollama: a pausa acaba no primeiro pedaço com texto, as contas e o cache vêm do último pedaço, resposta cortada é erro, o placar respeita os 20% (8,0 conta, 7,9 não); falha (`1.0 != 2.5`) com a pausa medida no pedaço vazio | Erick, 27/10/2026 (seguiu para a etapa 3) |
| 3 | `673080f` | `coleta.json`: 10 rodadas na CPU (Ryzen 7 5700G, Ollama 0.40.11, `llama3.2:3b`); `medir.py`: pausa 0,38 → 3,12 → 9,74 s, fluxo 15,4 → 13,2 tokens/s, longa de novo 0,08 s com 1076 de 1077 do cache; placar 10 de 10 nas três partes. A primeira coleta (cache a partir da rodada 2) refeita. `test_medidor.py` 8/8; o critério antigo do cache falha 2 | Erick, 27/10/2026 |
| 4 | `74b912b` | `figuras/esboco.md`: a cena 2 em ASCII e as seis cenas (ler, a pausa, escrever, o fluxo, o medidor, a pergunta), sem números da coleta e sem o cache | Erick, 27/10/2026 |

(redação: Claude Opus 5.5)
