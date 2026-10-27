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

## Etapa atual: 1 — o corpus

- Em `rascunhos/pausa-e-fluxo-condominio/` (como o experimento original, até a página ficar inteira; o experimento
  publicado não muda até a etapa 3): `dados/` com `convivencia.md`, `areas-comuns.md`, `garagem.md` e `mudancas.md`, de
  um condomínio inventado, e `casos.jsonl`: curta (só a pergunta), média (`mudancas.md`), longa (as quatro partes,
  começando pela convivência).
- O teste do corpus vale para os dois corpos: a mesma pergunta, cada caso lê ao menos 4 vezes o anterior, nenhum começa
  como outro. No do condomínio, confere também que a resposta (o horário de sábado) está na média e na longa.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | 19749fb | `testes/pausa-e-fluxo-condominio.test.mjs` (2): a mesma pergunta, 10 → 97 → 462 palavras (cada uma ao menos 4 vezes a anterior), começos diferentes, a regra de sábado só na média e na longa, o aviso de inventado. `npm test` 207/207; o experimento publicado não muda | aguardando revisão |

(redação: Claude Opus 5.5)
