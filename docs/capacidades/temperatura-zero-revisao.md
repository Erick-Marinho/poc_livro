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

- O player de botões sai; o mapa usa a base de tocar ou rolar (`palco/RolaCena.tsx`), clara, com balões, em seis cenas
  (33 s): a escolha, sozinha ou em grupo (esquema), a régua de 16 bits, as pontuações, o token que volta, a folga.
- `figuras/mapa.py` calcula também cada soma parcial (antes e depois do binary16) e os valores guardáveis entre 1023
  e 1026; a figura não monta se a soma, as barras e a escolha não conferem. A régua mostrou um detalhe real: abaixo de
  1024 ainda cabem meios (1023,5); de 1024 para cima, só inteiros. O texto da etapa 1 foi acertado ("a partir de 1024").
- A previsão sai de dentro do vídeo e vira um Invista antes dele; o mapa deixa de contar como ação no ritmo.

## Etapa 3 — o resultado

- Uma seção nova, "O que a coleta mostrou", antes de "O que esta medida não resolve": a grade das 90 respostas
  (`RespostasDaColeta`), três perguntas por três grupos (sozinha, 4, 16), dez repetições cada. O leitor prevê se algum
  grupo muda alguma resposta e compara grupo a grupo; no fim, a contagem e a previsão dele.
- Os quadradinhos saem da coleta real (`coleta-cpu.json`) e têm que bater, linha por linha, com a saída gravada do
  `medir.py`; a resposta que usou os 48 tokens fica marcada como cortada. Sem JS e no modo direto, a grade comparada.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `ae5e776` | textos reescritos (abertura, Invista, régua, achado, custo, prova, máquina, limites, nota); `npm test` 177/177; ritmo do experimento sem aviso (142 → Invista, maior trecho 184) | aguardando revisão |
| 2 | `2c051ea` | `testes/temperatura-zero.test.mjs` (7, três reescritos): as somas parciais, as barras e as escolhas saem do `mapa.py` executado; abaixo de 1024 cabem meios, acima só inteiros; até seis cenas e 45 s; a previsão vem antes; o esquema diz que é esquema. `npm test` 177/177. Capturas rolando com a página a 1280 e 390 px das seis cenas; ajustes: a pista da régua, a cor dos tokens e a altura | aguardando revisão |
| 3 | `5b98faa` | teste novo em `testes/temperatura-zero.test.mjs`: a grade sai da coleta, bate com o `medir.py` gravado (uma repetição trocada não monta), 90 quadradinhos na página, só a "livre" cortada. `npm test` 178/178. Capturas a 1280 e 390 px: antes, o primeiro grupo e o fim | aguardando revisão |

(redação: Claude Opus 5.5)
