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
- (27/10/2026, Erick) "Publicar o que deu": neste notebook, a pausa cresce (10 de 10) e o cache funciona (10 de 10),
  mas o fluxo da longa cai 25% (4 de 10). A afirmação fica como está, a régua também, e o texto conta o resultado
  dividido, com a explicação que o artigo dá.
- (1) O condomínio e o regulamento são inventados, e a página diz. A resposta depende de ler: aos sábados, mudança só
  até as 12h.
- (1) A régua não muda: os mesmos tamanhos (cerca de 10, 80 e 430 palavras), começos diferentes, os mesmos critérios.

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | O corpus novo: o regulamento em quatro partes e os três casos, com o teste do corpus | (nada ainda: o corpus é congelado antes de medir) |
| 2 | As coletas: o Ollama nesta máquina, a primeira coleta (sem número, que tropeça no cache) e a corrigida, gravadas com a máquina | (os números que o texto vai citar) |
| 3 | O texto, a figura e a IDE trocam a loja pelo condomínio; as saídas regravadas e os números do texto conferidos | mede o regulamento, tropeça no cache e vê os tempos de verdade |

## Etapa atual: 3 — o texto, a figura e a IDE

- O projeto: os dados e os casos do condomínio, as duas coletas novas, e o prefixo de cada pedido "Consulta N." (era
  "Atendimento N."), com os testes do medidor. A IDE (roteiro e passos) troca a loja pelo regulamento, e a aposta de
  escala passa a umas 3, 10 ou 30 vezes (deu 29). As saídas regravadas pelo `scripts/saidas.py`.
- A página: a régua com as palavras novas (10, 97 e 462), o achado e o custo com o que deu nesta máquina, o resultado
  dividido (a pausa e o cache confirmam; o fluxo cai 25%) com a razão que o artigo dá, e a nota do inventado com o
  condomínio. A figura de "O que vamos construir" com a pergunta e a resposta do regulamento.
- A cena dos tempos de verdade passa a caber a longa deste notebook (27 s de pausa): o eixo vai a 36 s, e a legenda diz
  o ritmo de cada uma pelo que a coleta mostra, e não "parecido" por princípio.
- O corpus e as coletas saem de `rascunhos/` e entram no experimento.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | 19749fb | `testes/pausa-e-fluxo-condominio.test.mjs` (2): a mesma pergunta, 10 → 97 → 462 palavras (cada uma ao menos 4 vezes a anterior), começos diferentes, a regra de sábado só na média e na longa, o aviso de inventado. `npm test` 207/207; o experimento publicado não muda | Erick, 27/10/2026 |
| 2 | c16cb81 | `coletas/medir.txt`: pausa 0,95 → 5,70 → 27,24 s (10 de 10); longa de novo 0,13 s, 833 de 834 do cache (10 de 10); fluxo 10,6 → 7,9 tokens/s (4 de 10). `coletas/medir-sem-numero.txt`: a longa em 38,85 s na primeira vez e uns 0,2 s depois (5 de 10). Mesmo Ollama e mesmo digest do modelo; a máquina, um i7-1355U | Erick, 27/10/2026 ("publicar o que deu") |

(redação: Claude Opus 5.5)
