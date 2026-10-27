# Temperatura zero: a revisão do texto, do mapa e do resultado

**Problema.** Na revisão do experimento (26/10/2026), três coisas pediam mudança: o texto usa termos antes de
explicá-los (temperatura, token, lote, modo guloso, binary16, IDs); o mapa em Remotion não tem o modo de rolar, é
alto demais para a tela, no celular não deixa comparar as duas execuções e não mostra nem por que a soma arredonda
nem por que o lote muda a ordem da conta; e o resultado é uma barra só, "90 de 90".

## Decisões

- (26/10/2026, Erick) "Todas" as etapas da revisão, e "você": esta sessão executa, no lugar da etapa 3 do plano do
  experimento (`experimento-temperatura-zero.md`), que fica apontando para cá.
- (1) As restrições do plano do experimento valem: até seis cenas e 45 segundos por animação, sem áudio; números do
  código (`numeros.py`, `figuras/mapa.py`); o esquema do lote diz que é esquema do mecanismo descrito na fonte; nada
  de GPU medida.
- (1) As três etapas em sequência, cada uma com o seu commit e o seu registro; o Erick revisa no fim.

## Etapas

| Etapa | O que | Por quê |
|---|---|---|
| 1 | O texto em linguagem simples: temperatura, token e lote definidos antes do uso; o primeiro Invista sem "guloso" nem "desempate"; a régua, o título da prova e a instalação reescritos | o leitor entende o que está testando antes de testar |
| 2 | O mapa na base de tocar ou rolar do livro, claro, com balões, em seis cenas: a escolha, a régua de 16 bits, sozinha ou em lote, as barras, o token que volta, a folga; a previsão num Invista antes | o modo de rolar, e o elo entre o lote e a soma |
| 3 | O resultado como figura: as 90 respostas, por pergunta e por lote, que o leitor compara lote a lote | o "inesperado" vira algo que o leitor vê e confere |

## Etapa 1 — o texto

- Abertura: um token é um pedaço de texto; a cada passo o modelo pontua os tokens possíveis e um sorteio escolhe; a
  temperatura regula o sorteio, e em zero vence sempre o maior. O lote: o servidor junta perguntas de várias pessoas
  numa conta só, e o tamanho do grupo pode mudar a ordem das somas.
- O primeiro Invista: "as pontuações são idênticas e a regra é a mesma, escolher a maior". Sem "modo guloso" nem
  "regra de desempate".
- A régua do topo, o achado e o custo em palavras do leitor: perguntas, repetições, grupos de 1, 4 e 16, a primeira
  resposta de cada pergunta como referência.
- "Uma prova de cada vez" vira "A primeira prova: uma soma", com binary16 explicado (perto de 1024, só inteiros).
- "Repetir na sua máquina": a instalação (extras, CUDA) sai do texto, que aponta para a IDE e o README.
- "O que esta medida não resolve": sem "kernels invariantes ao lote" nem "IDs".

## Etapa 2 — o mapa

Detalhada quando a etapa 1 fechar.

## Etapa 3 — o resultado

Detalhada quando a etapa 2 fechar.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `ae5e776` | textos reescritos (abertura, Invista, régua, achado, custo, prova, máquina, limites, nota); `npm test` 177/177; ritmo do experimento sem aviso (142 → Invista, maior trecho 184) | aguardando revisão |

(redação: Claude Opus 5.5)
