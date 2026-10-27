# A nota, explicada na introdução

**Problema.** A nota é o fio do livro (o botão "nota" no topo, o placar de cada capítulo, a pergunta "ele bate os
25%?"), e a introdução não diz o que ela é, para que serve, de onde vem nem como acompanhar. O Erick pediu que a
introdução explique "detalhadamente o que é a nota no livro, o que é, para que serve, como usar" (26/10/2026).

## Decisões

- (26/10/2026, Erick) A introdução explica a nota: o que é, para que serve, como usar.
- (1) Sem os números do livro: a nota de partida e a do capítulo 2 ficam escondidas até o leitor investir nelas
  (placar.json, `revela_com`); a introdução não pode estragar isso. A explicação usa uma prova pequena, de mentira na
  parte do agente, e diz que é ilustração.
- (1) O leitor aprende fazendo (docs/PRINCIPIOS.md): ele mesmo corrige a prova pequena, no papel da régua, nos cartões
  de uma pergunta por vez (src/lib/cartoes.ts). O "como usar" é o botão de verdade: a figura termina abrindo o placar.
- (26/10/2026, Erick) A prova pequena "não ficou boa": falava de gabarito, régua e decisões, que o leitor ainda não
  viu, e o processo não ficou claro. No lugar, um vídeo no Remotion, "criativo, didático e intuitivo", um gráfico ou
  fluxo. Daí a etapa 2: a nota contada como uma prova de escola, em linguagem de quem ainda não abriu o capítulo 1.
- (1) Texto curto em volta: para que serve, de onde vem e o que ela não diz. O "qual erro é pior" já está na
  introdução, num pare e pense; a seção nova vem logo depois dele e se apoia nele.

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | A seção "A nota" na introdução, com a prova pequena e o link para o placar | corrige quatro perguntas, vê a nota se formar e abre o placar |
| 2 | No lugar da prova pequena, o vídeo da nota: da prova ao placar | toca ou rola, pensa no que uma nota que cai diz, e abre o placar |

## Etapa atual: 2 — o vídeo da nota

### O que muda

- Sai a prova pequena (`CorrijaAProva`, a figura e o teste). Entra um vídeo (`nota/`, na base de tocar ou rolar do
  capítulo 2, com balões), em cinco cenas, sem nenhum termo que o leitor ainda não viu:
  1. a prova: as mensagens de clientes viram cartões ("pense numa prova de escola"; a mesma do começo ao fim);
  2. o gabarito: cada cartão ganha a resposta certa, escrita antes de existir agente;
  3. a correção: o agente faz a prova, os cartões viram ✓ e ✗, e um contador sobe: essa conta é a nota;
  4. o gráfico: uma barra por capítulo, subindo, com uma queda marcada ("piorou") e "?" nos que ainda vêm;
  5. o placar: o botão "nota" do topo, que guarda essa história, com o "?" de quando a nota ainda não foi investida.
- É ilustração, e diz que é. O número de mensagens sai do `referencia.jsonl` e os capítulos, do sumário; o gráfico
  não tem escala nem números, para não estragar a nota de partida e a do capítulo 2.
- Em volta, pouco texto: uma frase que convida a tocar ou rolar; depois, a nota da máquina do leitor e o link que abre
  o placar; e um pare e pense simples ("a nota caiu de um capítulo para o outro: o que isso diz da mudança?").
- No ritmo, o vídeo não conta; o pare e pense conta.

### Verificação

- Teste: o total de mensagens é o do `referencia.jsonl`; os capítulos são os do sumário; os balões se sucedem e não
  usam régua, contrato nem decisão; a introdução não mostra a nota de partida nem a do capítulo 2; o link abre o placar.
- `npm run ritmo`, `npm test` e capturas, rolando com a página, no computador e no celular, das cinco cenas.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `bcefcd8` | `testes/corrija-a-prova.test.mjs` (3): a prova pequena usa perguntas e gabarito do `referencia.jsonl`, com acerto e erro; a nota da figura é a conta (3 de 4, 75%); a introdução não mostra a nota de partida nem a do capítulo 2; o botão abre o placar. `npm test` 171/171 numa cópia limpa (HEAD mais esta etapa; na pasta de trabalho, o experimento temperatura-zero da outra sessão quebra a montagem). Ritmo da seção: 92 → CorrijaAProva → 101 → PareEPense. Capturas a 1280 e 390 px: o primeiro cartão, uma correção diferente da régua, o fim com a nota e o placar aberto pelo botão | substituída pela etapa 2 |
| 2 | `86bc679` | `testes/nota-do-livro.test.mjs` (3): o total de mensagens é o da prova do livro e os capítulos são os do sumário; os balões se sucedem e não usam régua, contrato nem decisão; a introdução não mostra a nota de partida nem a do capítulo 2, e o link abre o placar. `npm test` 171/171 numa cópia limpa (HEAD mais esta etapa). Ritmo da seção: 67 → PareEPense. Capturas rolando com a página a 1280 e 390 px das cinco cenas | aguardando revisão |

(redação: Claude Opus 5.5)
