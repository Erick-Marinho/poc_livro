# Ajustes da introdução

**Problema.** Na introdução, "pego" soa estranho, e "aposte" também. A animação do mapa pergunta onde cada problema é
pego como se o leitor não soubesse, logo depois de a aposta ter dado a resposta. "Régua" aparece sem dizer o que é. O
pare e pense usa um losango de texto no lugar de ícone, e os cartões das fases abaixo da animação, todos à vista,
tiram o foco dela. "A conta que cresce" confunde: não diz que a conta é o gasto com o modelo.

## Decisões

- (25/10/2026, Erick) Na introdução, "pego" vira "capturado" (passou por "apanhado"); "aposte" vira "invista" no livro
  todo, inclusive nas composições do Remotion (o Studio do my-video as importa do poc_livro).
- (25/10/2026, Erick) A animação não repete como pergunta o que o leitor já marcou na aposta.
- (25/10/2026, Erick) O pare e pense usa ícones do Lucide.
- (25/10/2026, Erick) "Régua" é explicada onde o leitor a encontra pela primeira vez.
- (25/10/2026, Erick) O que fica abaixo da animação começa recolhido, para o leitor focar nela.
- (25/10/2026, Erick) "A conta que cresce" diz o que é a conta.
- (1) Muda só o texto que o leitor lê; os nomes internos (`onde-se-pega.json`, o campo `pega`) ficam. "Quem pega" vira
  "Onde é capturado" (na aposta) e "Capturado em" (na animação).
- (2) Os nomes internos (`Aposta.astro`, `data-aposta`, o evento `fontmar:apostou`) ficam. "Aposto: X" vira "Meu
  investimento: X", que serve a todas as opções. "A aposta da parte do modelo local", no experimento, fica: é a aposta
  do artigo, não uma ação do leitor.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `00-introducao.mdx`, `figuras/*.json` | o texto da introdução, da aposta, das cenas e dos cartões | — | o que o leitor lê | troca (etapas 1, 2, 7) |
| `Aposta.astro` | o rótulo e as frases da aposta | `onde-se-pega.json` | a caixa da aposta | troca (etapa 2) |
| `ciclo/FiguraCiclo.tsx`, `ciclo/CicloAnimado.tsx` | o botão, a pergunta do topo e a faixa da animação | as cenas e a aposta do leitor | o vídeo | troca (etapas 1 a 3) |
| `agente/FiguraAgenteVideo.tsx`, `ide/IdeCapitulo.tsx`, `comandos/Comandos.tsx` | o que a figura do agente, a IDE e o placar dizem da aposta | — | o que o leitor lê | troca (etapa 2) |
| `PareEPense.astro` | o ícone do rótulo e do "ver a resposta" | `lucide-react` | a caixa do pare e pense | troca (etapa 4) |
| `MapaDoCiclo.astro` | os cartões das fases, recolhidos abaixo da animação | `ciclo.json` | a Figura 1 | troca (etapa 6) |

## Etapas

1. "Pego" vira "capturado" em tudo o que o leitor lê na introdução.
2. "Aposte" vira "invista", no livro todo.
3. A animação parte do que o leitor já marcou, sem perguntar de novo.
4. Ícones do Lucide no pare e pense.
5. "Régua" explicada na primeira vez que aparece.
6. O que fica abaixo da animação começa recolhido.
7. "A conta que cresce" diz que é o gasto com o modelo.

## Etapa atual: 2

**Arquivos.** `Aposta.astro` (o rótulo e o fecho padrão), `00-introducao.mdx`, `02-o-primeiro-agente.mdx`,
`experimentos/segundo-cerebro-local/experimento.mdx`, `CicloAnimado.tsx` (a faixa), `FiguraAgenteVideo.tsx`,
`IdeCapitulo.tsx`, `Comandos.tsx`, `testes/vocabulario.test.mjs` (novo, com o teste da etapa 1 dentro).

**Evidência.** Os testes do livro passam; o teste novo falha com o texto de antes; nenhuma página montada do livro e
dos experimentos diz "aposte" ou "apostou".

**Fora.** Os nomes internos e os comentários do código; a aposta do artigo, no experimento.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `313a0e6`, `82eebbf` | 90 testes do livro; o teste novo falha com o texto de antes ("Quem pega"); na página, "capturado" em 13 lugares e nenhum "pego" | Erick, 25/10/2026 ("capturado", no lugar de "apanhado") |

(redação: claude-opus-5-5)
