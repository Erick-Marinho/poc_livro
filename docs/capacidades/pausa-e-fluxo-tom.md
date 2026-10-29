# O tom do experimento "Pausa e fluxo"

**Problema.** O experimento ficou provocativo: o corpo contestava o artigo de referência (Janvi Kumari, *LLM Inference
Explained*, Analytics Vidhya) em quatro lugares, um deles um Pare e pense que perguntava "O artigo errou?". E, para o
nível novato, faltavam imagens do dia a dia para tokens, cache e o ritmo que cai.

## Decisões

- (29/10/2026, Erick) "Está muito provocativo, vamos remover menções ao artigo da Analytics": o corpo não cita o
  artigo. Ele fica só como a fonte da afirmação, no topo da página (o esquema exige a fonte).
- (29/10/2026, Erick) "Por ser nível novato, a linguagem deve ser bem intuitiva, vamos incluir analogias".
- (29/10/2026, Erick) "Pode deixar a fonte": o artigo continua como fonte da afirmação.
- (29/10/2026, Erick) "Esse experimento pode ser linkado e referencia o nível mais avançado, o experimento kv cache":
  um parágrafo no fim aponta para `/experimentos/kv-cache/`. A analogia do ritmo passa a ser a das anotações, a mesma
  do kv-cache; a primeira versão ("passa os olhos de novo pela mensagem") era o que o kv-cache chama de "sem o cache".
- (29/10/2026, Erick) "Quem ler poderá usar esses conceitos em que momento no dia a dia?" → "sim, da forma que você
  faria": uma seção "Onde isso aparece no seu dia a dia", antes de "Repetir na sua máquina", só texto (Pare e pense e
  palpites estão no teto), cada item com um número gravado. Fora: preço e o cache dos serviços na nuvem, que não
  medimos.
- (1) Sem coleta nova nem figura nova: os números e as saídas continuam os gravados.

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | O corpo sem o artigo, e as analogias | lê a mesma medida sem disputa com um autor, e dá um palpite sobre como driblar o cache |

## Última etapa: 1 — sem o artigo, com analogias

- O palpite sobre o laboratório do artigo sai; no lugar, `previsoes-cache.json`: para medir a leitura do zero, o que
  mudar na mensagem? A certa é o número no começo, que é o que o `medidor.py` faz (`Consulta N.`).
- O Pare e pense do ritmo pergunta "por que a longa escreveu mais devagar?", em vez de "o artigo errou?".
- O parágrafo sobre o tempo de leitura que o Ollama informa fica, citando a documentação, sem comparar com o artigo; o
  das perguntas em paralelo também.
- Analogias: o bilhete e a carta (a pausa), a atendente que lê e a que digita (pausa e fluxo), as peças de
  quebra-cabeça (tokens), as anotações que a atendente confere antes de cada palavra (o ritmo que cai, a mesma imagem do kv-cache), o marcador de livro
  (cache), as duas listas conferidas de cima para baixo (por que o número vai no começo), a carta repartida entre
  vinte leitores (placa de vídeo) e o guichê só (`OLLAMA_NUM_PARALLEL`).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | | `testes/pausa-e-fluxo.test.mjs`: o corpo e os palpites sem "artigo" nem "Analytics"; a certa do palpite do cache é o número no começo; os números do dia a dia são os da `pf-limpa` e da `pf-ingenua`. `npm test` 215/215; ritmo do experimento sem aviso (maior trecho, 184). A página em `astro dev` sem o artigo, fora da fonte da afirmação | |

(redação: Claude Opus 5.5)
