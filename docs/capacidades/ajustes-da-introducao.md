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
- (25/10/2026, Erick) "A conta que cresce" diz o que é a conta: "o gasto com o modelo que cresce sem aviso" e, na
  etiqueta da animação, "gasto que cresce" (escolha do Claude, a pedido de Erick: "a melhor experiência").
- (1) Muda só o texto que o leitor lê; os nomes internos (`onde-se-pega.json`, o campo `pega`) ficam. "Quem pega" vira
  "Onde é capturado" (na aposta) e "Capturado em" (na animação).
- (2) Os nomes internos (`Aposta.astro`, `data-aposta`, o evento `fontmar:apostou`) ficam. "Aposto: X" vira "Meu
  investimento: X", que serve a todas as opções. "A aposta da parte do modelo local", no experimento, fica: é a aposta
  do artigo, não uma ação do leitor.
- (3) "Já sabe" é o leitor que investiu em ao menos um problema, ou está no modo direto (lá a resposta aparece sem
  pedir). Para ele, o título e a primeira cena afirmam, e a faixa só diz onde foi capturado e se bateu com o
  investimento. Quem não investiu continua vendo a pergunta: para ele, a animação é a resposta.

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

## Etapa atual: 3

**Arquivos.** `ciclo-animado.json` (o título e a primeira legenda de quem já sabe), `ciclo/cenas.ts` (quem já sabe,
o título e a legenda de cada caso), `ciclo/CicloAnimado.tsx` (o título e a faixa), `ciclo/FiguraCiclo.tsx` (lê o
investimento quando o leitor clica na caixa, e o botão), `testes/ciclo-animado.test.mjs`.

**Evidência.** Os testes do livro passam; o teste novo falha sem o código; dois quadros da composição renderizados
pelo Remotion, um sem investimento (a pergunta) e um com (a afirmação e a faixa curta).

**Fora.** A caixa do "invista" em si; os cartões abaixo da animação (etapa 6); "conta que cresce" (etapa 7).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `313a0e6`, `82eebbf` | 90 testes do livro; o teste novo falha com o texto de antes ("Quem pega"); na página, "capturado" em 13 lugares e nenhum "pego" | Erick, 25/10/2026 ("capturado", no lugar de "apanhado") |
| 2 | `da066d1` | 91 testes do livro; o teste novo (`vocabulario.test.mjs`) falha com o texto de antes ("Aposte em qual."); nenhum "apost…" nas páginas locais da introdução, dos capítulos 1 e 2 e do experimento | Erick, 25/10/2026 |

(redação: claude-opus-5-5)
