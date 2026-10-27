# A revisão do experimento "Pausa e fluxo"

**Problema.** Uma revisão do experimento (27/10/2026), com o artigo de referência ao lado (Janvi Kumari, *LLM Inference
Explained*, Analytics Vidhya), achou erros de fato, contrapontos ao artigo que podem soar injustos, desvios do padrão
do livro e uma ausência: o leitor nunca sente 0,39 s contra 9,84 s. Os dois contrapontos se sustentam na documentação
atual do Ollama: o `prompt_eval_duration` conta "uncached prompt tokens" (api/generate) e o `OLLAMA_NUM_PARALLEL` tem
"default 1" (faq).

## Decisões

- (27/10/2026, Erick) "Sim, e é novato": a revisão em três planos, cada um com o seu ok, começando pelos erros de fato;
  o nível continua novato.
- (27/10/2026, Erick) "Os experimentos não têm que ter exemplos relacionados ao caso do livro; podemos diversificar":
  a regra do elenco da loja (docs/RITMO.md) vale para os livros, e a analogia volta a ser "uma atendente", sem a loja.
  O corpus deste experimento fica como está: trocar pede coleta nova.
- (1) Na etapa 1, só texto, dados e registro: nada de figura nova nem de ação nova. Sem coleta nova: os números vêm do
  que já está gravado (`pf-limpa`, `pf-ingenua`, `pf-vezes`).

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | Os erros de fato e a coerência com o artigo | lê números que batem com a gravação e um contraponto justo ao artigo |
| 2 | O padrão: a figura sem pergunta, os rótulos e as opções dos Invistas, a analogia do começo ao fim | decide com resposta incerta, e a figura ou a gravação responde |
| 3 | A cena com os tempos reais, com um Invista de escala antes | sente a pausa de cada mensagem, na proporção gravada |

## Etapa atual: 3 — os tempos de verdade

- Uma cena nova depois da IDE (`TemposReais`, sobre a `RolaCena`): uma faixa por mensagem, cinza enquanto o modelo lê
  e azul enquanto escreve, e um cursor no relógio da coleta. Tocando, corre em tempo real (a `RolaCena` ganha a
  `velocidade`; as outras figuras seguem na metade). Depois, a longa pedida de novo, ao lado da sombra da longa.
- Os números são as medianas da saída gravada `pf-limpa`; os tokens escritos, a mediana de cada caso no `coleta.json`
  (64, 64, 64 e 50: nem toda resposta chegou a 64, e a figura não arredonda isso).
- A aposta do passo 25 da IDE vira a de escala: a pausa da longa fica quantas vezes a da curta (umas 2, 5 ou 25)? A
  certa é a mais perto da conta gravada (25).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | a7e8b98 | Conferido na documentação do Ollama: `prompt_eval_duration` "uncached prompt tokens", `OLLAMA_NUM_PARALLEL` "default 1". O teste do Pare e pense passa a comparar com a `pf-ingenua` (45 e 1072 tokens, sem o número do atendimento). `npm test` 204/204; ritmo do experimento sem aviso (maior trecho, 164). Os nove hashes do plano do experimento trocados pelos que existem. A página mostra os acertos | Erick, 27/10/2026 |
| 2 | 2801629 | `testes/pausa-e-fluxo.test.mjs`: o fecho da figura sem "?" e sem número; as opções do Invista do artigo sem o porquê, e a resposta é "pode crescer menos". `npm test` 204/204; ritmo sem aviso (maior trecho, 190). Capturas: a cena 6 rolando com a página a 1280 e 390 px, e o Invista do artigo antes e depois do clique | Erick, 27/10/2026 |

(redação: Claude Opus 5.5)
