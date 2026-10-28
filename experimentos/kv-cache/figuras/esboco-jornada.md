# Esboço da animação "A jornada de uma pergunta", versão 2 (etapa 8)

**O que mudou da versão 1:** cada cache ganha a sua cena, com o cenário em que ele age, o lugar onde ele fica no
caminho, o que ele faz e como seria sem ele. Na versão 1, o cache de prompt era só uma nota, o semântico só aparecia
errando, e o KV não mostrava o contraste. O nome de cada cache aparece na cena em que ele age, e não só no fim.

**Pergunta que ela responde:** onde fica cada cache, e o que ele poupa? **O que o leitor faz:** antes do play, a
previsão sobre a Carla (já no texto); depois, toca ou rola. **Regras (docs/RITMO.md):** 6 cenas, até 8 s cada, 42 s.

O caminho fica fixo na tela, como na versão 1: você → o aplicativo → o servidor (ou o provedor da API) → o modelo,
com a gaveta de cada ponto embaixo. Em cada cena, só o ponto daquele cache acende; o resto fica cinza.

## Como fica a cena 2 (o KV, na largura do computador)

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ 2 DE 6 · KV CACHE: AS ANOTAÇÕES, DENTRO DO MODELO                             │
│                                                                               │
│  [ você ] ──▶ [ aplicativo ] ──▶ [ servidor ] ──▶ ┏━━━━━━━━━━━━━━━━━━━━━━┓    │
│                                                   ┃ o modelo escreve     ┃    │
│                                                   ┃ "Não: aos sábados…"  ┃    │
│                                                   ┗━━━━━━━━━━━━━━━━━━━━━━┛    │
│                                                                               │
│   SEM AS ANOTAÇÕES                         COM AS ANOTAÇÕES (KV CACHE)        │
│   antes de cada palavra, relê tudo         antes de cada palavra, lê só a     │
│                                            última e consulta as anotações     │
│   "Não:"     ████████████████              "Não:"     ████████████████        │
│   "aos"      █████████████████             "aos"      ▌ + ▮▮▮▮▮▮▮▮            │
│   "sábados," ██████████████████            "sábados," ▌ + ▮▮▮▮▮▮▮▮▮           │
│   "só"       ███████████████████           "só"       ▌ + ▮▮▮▮▮▮▮▮▮▮          │
│                                                                               │
│   ✓ a pergunta da Ana percorre o caminho                                      │
│                                          ╭──────────────────────────────────╮ │
│                                          │ Com as anotações, cada palavra   │ │
│                                          │ nova lê uma palavra, não o pedido│ │
│                                          │ inteiro.                         │ │
│ ▶ Tocar                                  ╰──────────────────────────────────╯ │
└───────────────────────────────────────────────────────────────────────────────┘
```

## As seis cenas

| # | Cenário | Onde | O que acontece | Sem o cache | O balão (uma frase) |
|---|---|---|---|---|---|
| 1 | **Ana**, "Posso fazer a minha mudança no sábado à tarde?": nada guardado | o caminho inteiro | o aplicativo monta o pedido (instruções, regulamento, pergunta); o servidor manda ao modelo; o modelo lê tudo (uma barra longa: a pausa) e começa a escrever | — | A primeira pergunta faz o caminho inteiro: nada foi guardado ainda. |
| 2 | **Ana**, enquanto o modelo escreve: **KV cache** | dentro do modelo | lado a lado: sem as anotações, uma barra inteira por palavra; com elas, só a palavra nova, mais as anotações, que crescem uma por palavra. No fim da resposta, as anotações somem | relê o pedido inteiro a cada palavra | Com as anotações, cada palavra nova lê uma palavra, não o pedido inteiro. |
| 3 | **Bruno**, "Posso usar a piscina na segunda?": **cache de prefixo** | no servidor (o seu) | o pedido do Bruno começa igual ao da Ana; os blocos das instruções e do regulamento acendem como já lidos; o modelo lê só a pergunta (uma barra curta) | lê o regulamento inteiro de novo | O começo é igual ao da Ana: o servidor pula a leitura dele. |
| 4 | **Dani**, a mesma coisa num assistente de API paga: **cache de prompt** | no provedor da API | o mesmo salto da cena 3, agora com uma conta ao lado: a Ana pagou a leitura inteira, um pouco mais cara, para guardar; a Dani paga o começo repetido bem mais barato | paga o começo inteiro, de novo | Na API, o provedor faz o mesmo e cobra menos pelo começo repetido. |
| 5 | **Eduardo**, "Dá para mudar no sábado à tarde?": **cache semântico**, acertando | no aplicativo, antes do modelo | outras palavras, a mesma pergunta da Ana; o mural reconhece e devolve a resposta dela na hora; o servidor e o modelo nem são chamados; ✓ certa | o caminho inteiro de novo | Outras palavras, mesma pergunta: o mural responde na hora, sem o modelo. |
| 6 | **Carla**, "Posso fazer a minha mudança no sábado de manhã?": **cache semântico**, errando | no aplicativo | o mural acha parecida com a da Ana e devolve "Não"; ✗ de manhã pode, das 8h às 12h. O quadro final: o caminho com os quatro nomes, cada um no seu ponto, e a linha "três guardam leitura e nunca mudam a resposta; o mural guarda respostas e pode errar" | — | Parecida não é igual: o mural devolveu a resposta da Ana, errada. |

As respostas saem do regulamento do corpus: sábado à tarde não pode (das 8h às 12h); a piscina fecha às segundas. Os
preços da cena 4 não têm número: "um pouco mais caro" e "bem mais barato" (os números ficam no texto, com o link).

## No celular (estreito)

O caminho vira uma coluna, como na versão 1, com as gavetas ao lado. Na cena 2, o "sem" e o "com" ficam um embaixo do
outro. O balão fica embaixo.

## No modo direto

O quadro final da cena 6: o caminho com os quatro nomes, cada um no seu ponto, e a linha dos dois grupos.

## O que muda na página

- A jornada continua abrindo o texto, com a previsão sobre a Carla antes do play e as duas frases depois.
- A figura técnica dos quatro caches, depois de "Quando alguém fala em cache…", fica repetida com a jornada nova
  (as duas mostram o salto do prefixo, o preço e o semântico). Proposta: tirar a figura técnica e manter só a lista
  e as correções ao artigo, que trazem o que a jornada não mostra (o identificador encadeado, os preços com link).

(redação: Claude Opus 5.5)
