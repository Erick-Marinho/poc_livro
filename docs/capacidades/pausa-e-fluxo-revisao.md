# A revisão do experimento "Pausa e fluxo"

**Problema.** Uma revisão do experimento (27/10/2026), com o artigo de referência ao lado (Janvi Kumari, *LLM Inference
Explained*, Analytics Vidhya), achou erros de fato, contrapontos ao artigo que podem soar injustos, desvios do padrão
do livro e uma ausência: o leitor nunca sente 0,39 s contra 9,84 s. Os dois contrapontos se sustentam na documentação
atual do Ollama: o `prompt_eval_duration` conta "uncached prompt tokens" (api/generate) e o `OLLAMA_NUM_PARALLEL` tem
"default 1" (faq).

## Decisões

- (27/10/2026, Erick) "Sim, e é novato": a revisão em três planos, cada um com o seu ok, começando pelos erros de fato;
  o nível continua novato.
- (1) Na etapa 1, só texto, dados e registro: nada de figura nova nem de ação nova. Sem coleta nova: os números vêm do
  que já está gravado (`pf-limpa`, `pf-ingenua`, `pf-vezes`).

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | Os erros de fato e a coerência com o artigo | lê números que batem com a gravação e um contraponto justo ao artigo |
| 2 | O padrão: a figura sem pergunta, os rótulos e as opções dos Invistas, a analogia do começo ao fim | decide com resposta incerta, e a figura ou a gravação responde |
| 3 | A cena com os tempos reais, com um Invista de escala antes | sente a pausa de cada mensagem, na proporção gravada |

## Etapa atual: 1 — os erros de fato e o artigo

- O processador: 8 núcleos e 16 threads (o 16 gravado é o `os.cpu_count()`), e a memória é a que o WSL2 enxerga.
- As coletas: quatro, e não duas (a primeira e a corrigida, gravada três vezes: etapas 3, 6 e 7).
- O Pare e pense dos tokens: palavras e tokens da mesma mensagem (10 → 45 e 430 → 1072, da `pf-ingenua`, sem o número
  do atendimento); o "começo fixo" vira o cabeçalho que o Ollama põe em todo pedido, de uns 20 tokens.
- A régua diz que o critério do cache foi ajustado depois da primeira coleta.
- O primeiro Invista não diz "Na medida" antes de medir: o que ele mostra é o que o artigo diz.
- A placa de vídeo: sem medida gravada, fica dito como expectativa.
- O artigo, com justiça: ele avisa, numa frase, que o cache pode influenciar a medida, e não mostra quanto; e avisa
  que a concorrência depende da configuração do Ollama, que por padrão atende um pedido por vez. O nosso medidor marca
  no relógio; o do artigo usa o número que o Ollama informa.
- "Quase não muda" vira "muda pouco" (caiu 17%, dentro dos 20% da régua), com a razão que o artigo dá.
- O código que o leitor vê diz "executar", não "rodar". No plano do experimento, os commits do registro passam a ser os
  que existem (o histórico foi reescrito) e o `procedencia.json`, que não existe, sai da tabela.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | a7e8b98 | Conferido na documentação do Ollama: `prompt_eval_duration` "uncached prompt tokens", `OLLAMA_NUM_PARALLEL` "default 1". O teste do Pare e pense passa a comparar com a `pf-ingenua` (45 e 1072 tokens, sem o número do atendimento). `npm test` 204/204; ritmo do experimento sem aviso (maior trecho, 164). Os nove hashes do plano do experimento trocados pelos que existem. A página mostra os acertos | aguardando revisão |

(redação: Claude Opus 5.5)
