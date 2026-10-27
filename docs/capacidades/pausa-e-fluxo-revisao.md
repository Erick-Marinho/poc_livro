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

## Etapa atual: 2 — o padrão

- A figura deixa de terminar numa pergunta: a cena 6 vira "Dois cronômetros", com o fecho ("a pausa mede a leitura,
  e o fluxo, a escrita") e os resumos. A decisão fica no Invista, que passa a vir logo antes da figura.
- A analogia não entrega mais a resposta antes do Invista: a atendente da Casa Bem-te-vi lê e escreve, e só. Ela volta
  no tropeço, onde quebra: uma pessoa reconheceria a mensagem com outro número no topo; o modelo relê do zero.
- O token é definido antes do Pare e pense que pergunta por tokens, e a frase que dava a resposta sai.
- O Invista do artigo ganha opções neutras ("cresce como o texto", "pode crescer menos", "não cresce"); o porquê fica
  só na resposta.
- Fica para a etapa 3 a aposta do passo 25 da IDE, que vira a de escala, junto com a cena dos tempos reais.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | a7e8b98 | Conferido na documentação do Ollama: `prompt_eval_duration` "uncached prompt tokens", `OLLAMA_NUM_PARALLEL` "default 1". O teste do Pare e pense passa a comparar com a `pf-ingenua` (45 e 1072 tokens, sem o número do atendimento). `npm test` 204/204; ritmo do experimento sem aviso (maior trecho, 164). Os nove hashes do plano do experimento trocados pelos que existem. A página mostra os acertos | Erick, 27/10/2026 |
| 2 | 2801629 | `testes/pausa-e-fluxo.test.mjs`: o fecho da figura sem "?" e sem número; as opções do Invista do artigo sem o porquê, e a resposta é "pode crescer menos". `npm test` 204/204; ritmo sem aviso (maior trecho, 190). Capturas: a cena 6 rolando com a página a 1280 e 390 px, e o Invista do artigo antes e depois do clique | aguardando revisão |

(redação: Claude Opus 5.5)
