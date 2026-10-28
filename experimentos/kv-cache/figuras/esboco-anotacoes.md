# Esboço da animação "O que vamos construir", versão 2 (depois do fecho)

**O que trava na versão 1:** ainda é a atendente, a analogia que saiu da abertura, enquanto a jornada fala em "o
modelo". As anotações são quadrados vazios, sem a palavra de onde vieram. As barras da cena 3 não dizem o que são.
"Em cada andar" não diz que andar é esse. "Pausa ?" e "cada palavra ?" aparecem sem dizer o que se cronometra. A cena
6 é só texto.

**Pergunta que ela responde:** o que o modelo guarda enquanto escreve, o que isso poupa e custa, e o que o medidor vai
cronometrar? **O que o leitor faz:** antes do play, o palpite (já no texto); depois, toca ou rola. **Regras
(docs/RITMO.md):** 6 cenas, até 7 s cada, 42 s; nenhum número medido na figura.

O pedido é o da Ana, o mesmo da jornada, para o leitor reconhecer: instruções, regulamento, pergunta. Na tela, ele
aparece em palavras, com "…" no meio do regulamento.

## Como fica a cena 2 (na largura do computador)

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ 2 DE 6 · ESCREVER COM AS ANOTAÇÕES                                            │
│                                                                               │
│  O PEDIDO DA ANA                                                              │
│  [instruções…] […aos sábados, das 8h às 12h…] [Posso fazer a minha mudança…]  │
│                                                                               │
│  A RESPOSTA   Não: aos ▌                                                      │
│                                                                               │
│  para escrever «sábados,»: lê só «aos» ──┐                                    │
│                                          ▼ e consulta                         │
│  AS ANOTAÇÕES: UMA POR PALAVRA, COM A PALAVRA DE ONDE VEIO                    │
│  [Você][é]…[aos][sábados,][das]…[Posso][fazer]…[tarde?][Não:][aos]            │
│   ▔▔▔▔ todas acendem: o modelo consulta todas ▔▔▔▔        ↑ nova, entra agora │
│                                          ╭─────────────────────────────────╮  │
│  ✓ lê o pedido uma vez e anota           │ Para escrever, lê só a última   │  │
│                                          │ palavra e consulta as anotações.│  │
│                                          ╰─────────────────────────────────╯  │
└───────────────────────────────────────────────────────────────────────────────┘
```

## As seis cenas

| # | Nome | O que acontece | O balão (até 14 palavras, sem número) |
|---|---|---|---|
| 1 | Ler e anotar | um marcador passa pelo pedido, palavra a palavra; para cada palavra lida, cai uma anotação com a palavra escrita nela | O modelo lê o pedido uma vez e anota cada palavra. |
| 2 | Escrever com as anotações | o desenho acima: para cada palavra nova, lê só a última, todas as anotações acendem (consulta), a palavra sai e vira anotação também | Para escrever, lê só a última palavra e consulta as anotações. |
| 3 | Escrever sem as anotações | as anotações somem; uma linha por palavra nova: "para escrever «aos»: relê o pedido inteiro + «Não:»", e a faixa do pedido passa de novo, inteira, a cada linha | Sem as anotações, relê o pedido inteiro antes de cada palavra. |
| 4 | O que as anotações ocupam | o modelo se abre em camadas empilhadas (a de cima diz "e assim por diante"); cada camada tem a sua fileira de anotações; ao lado, um medidor de memória sobe a cada palavra | Cada camada guarda as suas anotações: a memória cresce a cada palavra. |
| 5 | O que o medidor cronometra | uma linha do tempo da resposta: um trecho longo, "a pausa: o modelo lendo o pedido", e depois um trecho por palavra, "cada palavra"; um cronômetro marca cada trecho | O medidor cronometra a pausa e o tempo de cada palavra. |
| 6 | Quatro medições | o quadro final: uma tabela 2 × 2. Nas linhas, o pedido curto (só a pergunta) e o longo (o regulamento e a pergunta), com a faixa de cada um; nas colunas, com e sem as anotações; em cada casa, "pausa ?" e "cada palavra ?" | Quatro medições: na IDE, você confere o seu palpite. |

Na cena 2, todas as anotações acendem a cada consulta: o leitor vê que a consulta passa por todas, sem a figura dizer
quanto custa. Isso fica para o palpite e para o medidor.

## No celular (estreito)

Uma coluna: o pedido em três linhas, a resposta, a linha "para escrever…" e as anotações quebrando em várias linhas.
Na cena 4, as camadas ficam mais estreitas, com o medidor de memória embaixo. Na cena 6, a tabela vira quatro linhas
("curto · com as anotações: pausa ? cada palavra ?"). O balão fica embaixo.

## No modo direto

O quadro final da cena 6, com os resumos.

## O que muda na página

- "Volte à atendente do experimento A pausa e o fluxo" vira uma frase sobre o modelo da jornada: "O modelo da jornada
  lê o pedido e depois escreve, uma palavra de cada vez."
- Os nomes técnicos, depois da figura, continuam iguais: anotação = chave e valor, camada, token, prefill, decode.

(redação: Claude Opus 5.5)
