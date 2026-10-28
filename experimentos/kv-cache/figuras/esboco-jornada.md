# Esboço da animação "A jornada de uma pergunta" (etapa 7)

**Pergunta que ela responde:** o que acontece entre o Enter e a resposta, e onde cada cache pula trabalho? **O que o
leitor faz:** aperta o play (ou rola) e acompanha três perguntas de moradores, uma depois da outra. **Sem definição
antes:** o leitor vê cada cache agir; o nome aparece só quando ele age. Abre o texto, no lugar do caminho parado.

Três moradores do condomínio inventado, três perguntas:
1. **Ana:** "Posso fazer a minha mudança no sábado à tarde?" (nada guardado ainda: faz o caminho inteiro)
2. **Bruno:** "Posso usar a churrasqueira no domingo?" (o começo do pedido é o mesmo: o servidor pula a leitura dele)
3. **Carla:** "Posso fazer a minha mudança no domingo?" (parece a da Ana: o mural entrega a resposta dela, errada)

Sete cenas, uns 4 s cada depois do play, cerca de 30 s. O caminho fica inteiro à vista, sempre no mesmo lugar: a
pergunta anda por ele, da esquerda para a direita. O que já passou vira uma linha de resumo embaixo.

## O caminho, fixo na tela (a largura do computador)

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ 5 DE 7 · BRUNO: O COMEÇO JÁ FOI LIDO                                          │
│                                                                               │
│  ┌────────┐     ┌──────────────┐     ┌──────────────┐     ┌────────────────┐  │
│  │ você   │ ──▶ │ o aplicativo │ ──▶ │ o servidor   │ ──▶ │ o modelo       │  │
│  │ Enter  │     │ monta o      │     │ do modelo    │     │ lê e escreve   │  │
│  └────────┘     │ pedido       │     └──────────────┘     └────────────────┘  │
│                 └──────┬───────┘            │                     │           │
│                  ┌─────┴──────┐      ┌──────┴───────┐      ┌──────┴───────┐   │
│                  │ MURAL      │      │ COMEÇOS JÁ   │      │ ANOTAÇÕES    │   │
│                  │ Ana: sábado│      │ LIDOS        │      │ ▮▮▮▮▮▯▯▯     │   │
│                  └────────────┘      │ ✓ instruções │      └──────────────┘   │
│                                      │ ✓ regulamento│                         │
│   o pedido do Bruno:                 └──────────────┘                         │
│   [instruções ✓][regulamento ✓][churrasqueira no domingo?]                    │
│    └──────── já lido, pulado ───────┘└── lê só isto ──┘                       │
│                                                                               │
│   ✓ Ana: o caminho inteiro                     ╭──────────────────────────╮   │
│   ✓ Ana: as anotações enquanto escreve         │ O começo do pedido já foi│   │
│                                                │ lido para a Ana: o modelo│   │
│                                                │ lê só a pergunta nova.   │   │
│ ▶ Tocar                                        ╰──────────────────────────╯   │
└───────────────────────────────────────────────────────────────────────────────┘
```

Embaixo de cada ponto do caminho, a "gaveta" do que ele guarda: o **mural** (no aplicativo), os **começos já lidos**
(no servidor) e as **anotações** (no modelo). As gavetas começam vazias e enchem conforme as perguntas passam.

## As sete cenas

| # | Nome | O que acontece | O balão (uma frase) | O resumo que fica |
|---|---|---|---|---|
| 1 | O Enter | a pergunta da Ana sai do "você" e chega ao aplicativo | A Ana aperta Enter. | — |
| 2 | O pedido | o aplicativo junta três blocos: as instruções, o regulamento e a pergunta; olha o mural, vazio, e manda adiante | O aplicativo junta as instruções, o regulamento e a pergunta num pedido só. | Ana: o pedido montado |
| 3 | A leitura | o servidor olha os começos já lidos, vazio; o modelo lê os três blocos, devagar (uma barra longa: a pausa) | Nada foi lido antes: o modelo lê o pedido inteiro. | Ana: tudo lido do zero |
| 4 | As anotações | a resposta sai palavra por palavra; a cada palavra, a gaveta de anotações ganha uma marca; no fim, as anotações somem, o servidor guarda o começo lido e o mural guarda "Ana: sábado → Não, só de manhã" | Enquanto escreve, o modelo anota o que já leu, para não reler a cada palavra. | Ana: as anotações enquanto escreve |
| 5 | Bruno | o pedido do Bruno: os dois primeiros blocos acendem no servidor como já lidos; o modelo lê só a pergunta (uma barra curta) | O começo do pedido já foi lido para a Ana: o modelo lê só a pergunta nova. | Bruno: o começo pulado |
| 6 | Carla | a pergunta da Carla chega ao aplicativo; o mural acende: "parece a da Ana"; a resposta da Ana volta direto, sem passar pelo servidor nem pelo modelo; um ✗: aos domingos, não pode | O mural achou a pergunta parecida e devolveu a resposta da Ana. Domingo não é sábado. | Carla: a resposta pronta, errada |
| 7 | Os nomes | as três gavetas ganham os nomes: mural = cache semântico; começos já lidos = cache de prefixo (numa API paga, cache de prompt, mais barato); anotações = KV cache | Três guardam leitura e não mudam a resposta; o mural guarda respostas e pode errar. | — |

## No celular (estreito)

O caminho vira uma coluna: você, o aplicativo, o servidor e o modelo, um embaixo do outro, cada um com a sua gaveta
ao lado. A pergunta desce pela coluna. O balão fica embaixo.

## No modo direto

A cena 7 parada: o caminho com as três gavetas nomeadas e os resumos. Para leitor de tela, a descrição das sete cenas.

## O que muda na página

- A animação substitui o caminho parado (`CaminhoDaPergunta`) na abertura. O Pare e pense que vem depois fica.
- Os nomes técnicos aparecem só na cena 7, depois de o leitor ver cada cache agir.
- A figura técnica dos quatro caches (blocos, preço, semântico) continua depois de "Quando alguém fala em cache…":
  ela detalha o que a jornada só mostra de passagem (o identificador encadeado dos blocos, o preço).

## Fica de fora, de propósito

- Números de tempo e de preço: as barras são ilustração, e a figura diz isso.
- K, V, token, prefill, decode, hash: entram no texto técnico, depois.

(redação: Claude Opus 5.5)
