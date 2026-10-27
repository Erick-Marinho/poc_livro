# O "Pausa e fluxo" mede um regulamento de condomínio, e não a loja do livro

**Problema.** O experimento mede três mensagens feitas com os dados da Casa Bem-te-vi, a loja do livro. O Erick decidiu
que os experimentos não precisam usar o caso do livro (27/10/2026). E a loja pede contexto que o leitor do experimento
não tem: pedido, catálogo, política de troca.

## Decisões

- (27/10/2026, Erick) O exemplo novo é o regulamento de um condomínio: a mesma pergunta ("Posso fazer a minha mudança no
  sábado à tarde?"), só ela; com o capítulo de mudanças; com o regulamento inteiro. É ler um documento longo antes de
  responder, o caso que o artigo chama de RAG.
- (27/10/2026, Erick) As coletas novas são feitas nesta máquina: o Ollama e o `llama3.2:3b` instalados aqui. A máquina
  muda, e o texto passa a descrever esta.
- (1) O condomínio e o regulamento são inventados, e a página diz. A resposta depende de ler: aos sábados, mudança só
  até as 12h.
- (1) A régua não muda: os mesmos tamanhos (cerca de 10, 80 e 430 palavras), começos diferentes, os mesmos critérios.

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | O corpus novo: o regulamento em quatro partes e os três casos, com o teste do corpus | (nada ainda: o corpus é congelado antes de medir) |
| 2 | As coletas: o Ollama nesta máquina, a primeira coleta (sem número, que tropeça no cache) e a corrigida, gravadas com a máquina | (os números que o texto vai citar) |
| 3 | O texto, a figura e a IDE trocam a loja pelo condomínio; as saídas regravadas e os números do texto conferidos | mede o regulamento, tropeça no cache e vê os tempos de verdade |

## Etapa atual: 2 — as coletas

- O Ollama 0.40.11 (a mesma versão das coletas antigas) na pasta do usuário, sem `sudo`, e o `llama3.2:3b` com o mesmo
  digest (`a80c4f17…`). A máquina: Intel i7-1355U (notebook, 10 núcleos e 12 threads), 23 GB, Linux nativo.
- A coleta ingênua com o código do passo 15 da IDE, de servidor recém-aberto, e a corrigida com o código final, em que
  o prefixo de cada pedido passa a ser "Consulta N.". As duas, e o que o `medir.py` imprime de cada uma, ficam em
  `rascunhos/pausa-e-fluxo-condominio/coletas/`.
- **O que deu:** a pausa cresce em 10 de 10 (0,95 → 5,70 → 27,24 s), e a longa de novo começa em 0,13 s, com 833 de 834
  tokens do cache, em 10 de 10. Mas o fluxo da longa caiu 25% (10,6 → 7,9 tokens/s) e ficou a até 20% do da curta só
  em 4 de 10. Neste notebook, a afirmação vale para a pausa e não para o fluxo. A régua não foi mexida depois de medir;
  o que fazer com isso é decisão do Erick.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | 19749fb | `testes/pausa-e-fluxo-condominio.test.mjs` (2): a mesma pergunta, 10 → 97 → 462 palavras (cada uma ao menos 4 vezes a anterior), começos diferentes, a regra de sábado só na média e na longa, o aviso de inventado. `npm test` 207/207; o experimento publicado não muda | Erick, 27/10/2026 |

(redação: Claude Opus 5.5)
