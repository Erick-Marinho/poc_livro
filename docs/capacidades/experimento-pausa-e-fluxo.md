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
- **Medida:** temperatura 0, resposta limitada a 64 tokens; uma chamada de aquecimento descartada (carrega o
  modelo). Dez rodadas de curta → média → longa, nunca o mesmo caso em seguida. **Pausa:** tempo até o primeiro
  pedaço da resposta, por streaming. **Fluxo:** tokens escritos por segundo (`eval_count / eval_duration`). Cada
  execução guarda os tokens lidos do cache.
- **Placar:** a pausa da longa maior que a da curta, X de 10 rodadas; o fluxo da longa a até 20% do da curta, X de 10.
  **Achado:** a longa repetida logo em seguida, com a segunda pausa menor e tokens vindos do cache, X de 10.

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

## Etapa 1 (detalhe)

- **Arquivos:** este plano; `rascunhos/pausa-e-fluxo/projeto/casos.jsonl`; `projeto/dados/` (cópia de `politica.md`,
  `catalogo.json` e `pedidos.json` do livro); `testes/pausa-e-fluxo.test.mjs`.
- **Evidência:** o teste passa (mesma pergunta, cada caso lê ao menos 4 vezes o anterior, começos diferentes) e
  falha quando a longa começa como a média.
- **Fica fora:** o medidor, o Ollama e a página.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|

(redação: Claude Opus 5.5)
