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
- (25/10/2026, Erick) "Régua" é explicada onde o leitor a encontra: um termo explicável, sublinhado, que mostra a
  definição ao tocar ou passar o mouse, sem alongar o texto (escolhida entre frase no texto, termo e as duas).
- (25/10/2026, Erick) Os cartões das fases saem de baixo da animação, para o leitor focar nela, e abrem num modal ao
  clicar no nó da fase; o nó mostra que é clicável.
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
- (4) No pare e pense, `Lightbulb` no rótulo e `Eye` no "Ver a resposta", do `lucide-react` que o projeto já usa
  (https://lucide.dev/guide/packages/lucide-react): num `.astro` sem `client:`, o componente React vira SVG no
  servidor, sem JS (https://docs.astro.build/en/guides/framework-components/). O ícone sai com `aria-hidden`.
- (5) Os termos e as definições ficam num JSON do livro (`termos.json`); o componente `Termos`, posto uma vez no
  capítulo, marca no navegador cada ocorrência no corpo, fora de código, SVG, vídeo, botão e link. Sem JS, o texto
  fica como está. Só a introdução usa, por ora: no capítulo 1 a régua é construída.
- (6) O nó ganha o ícone `Info` do Lucide no canto e um nome que diz o que abre; o modal é um `<dialog>` nativo,
  preenchido com o cartão da fase (que segue na página, escondido): fecha com Esc, no × ou fora. Os cartões voltam à
  vista sem JS, no modo direto e na impressão. O balão do termo passa a `position: fixed`, para abrir também por
  cima do modal.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `00-introducao.mdx`, `figuras/*.json` | o texto da introdução, da aposta, das cenas e dos cartões | — | o que o leitor lê | troca (etapas 1, 2, 7) |
| `Aposta.astro` | o rótulo e as frases da aposta | `onde-se-pega.json` | a caixa da aposta | troca (etapa 2) |
| `ciclo/FiguraCiclo.tsx`, `ciclo/CicloAnimado.tsx` | o botão, a pergunta do topo e a faixa da animação | as cenas e a aposta do leitor | o vídeo | troca (etapas 1 a 3) |
| `agente/FiguraAgenteVideo.tsx`, `ide/IdeCapitulo.tsx`, `comandos/Comandos.tsx` | o que a figura do agente, a IDE e o placar dizem da aposta | — | o que o leitor lê | troca (etapa 2) |
| `PareEPense.astro` | o ícone do rótulo e do "ver a resposta" | `lucide-react` | a caixa do pare e pense | troca (etapa 4) |
| `termos.json` + `Termos.astro` | o termo explicável e a definição | o corpo do capítulo | o termo sublinhado | nova (etapa 5) |
| `MapaDoCiclo.astro`, `ciclo/Anel.tsx` | os cartões das fases num modal, aberto pelo nó, que mostra que é clicável | `ciclo.json` | a Figura 1 | troca (etapa 6) |

## Etapas

1. "Pego" vira "capturado" em tudo o que o leitor lê na introdução.
2. "Aposte" vira "invista", no livro todo.
3. A animação parte do que o leitor já marcou, sem perguntar de novo.
4. Ícones do Lucide no pare e pense.
5. "Régua" explicada na primeira vez que aparece.
6. Os cartões das fases num modal, aberto pelo nó da fase.
7. "A conta que cresce" diz que é o gasto com o modelo.
8. O vão vazio entre o desenho e o botão, no vídeo do mapa em coluna (celular).

## Etapa atual: 8

A detalhar quando o responsável pedir: o vão vazio entre o desenho e o botão, no vídeo do mapa em coluna (celular).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `313a0e6`, `82eebbf` | 90 testes do livro; o teste novo falha com o texto de antes ("Quem pega"); na página, "capturado" em 13 lugares e nenhum "pego" | Erick, 25/10/2026 ("capturado", no lugar de "apanhado") |
| 2 | `da066d1` | 91 testes do livro; o teste novo (`vocabulario.test.mjs`) falha com o texto de antes ("Aposte em qual."); nenhum "apost…" nas páginas locais da introdução, dos capítulos 1 e 2 e do experimento | Erick, 25/10/2026 |
| 3 | `429b6b7` | 92 testes do livro; o teste novo falha sem o código; quadros da composição renderizados pelo Remotion: a pergunta sem investimento, a afirmação com, "✓ onde você investiu" e "você investiu em Avaliar" na faixa | Erick, 25/10/2026 |
| 4 | `5d8e572` | 93 testes do livro; o teste novo falha sem o código; a caixa aberta na página, com a lâmpada e o olho | Erick, 25/10/2026 |
| 5 | `370b3ce` | 96 testes do livro; o teste novo falha sem o código; no navegador, 10 réguas marcadas na introdução e o balão aberto, em 1280 e 390 px | Erick, 25/10/2026 |
| 6 | `8ced31f` | 97 testes do livro; o teste novo falha sem o código; no navegador, os nós com o ícone, o modal aberto pelo nó do vídeo e fechado com Esc, a régua por cima do modal, em 1280 e 390 px; no modo direto, os 8 cartões abertos embaixo | Erick, 25/10/2026 |
| 7 | `a2690d3` | 98 testes do livro; o teste novo falha com o texto de antes; na página, "o gasto com o modelo" no parágrafo e na caixa, e nenhum "conta que cresce"; o quadro da composição com "gasto que cresce" | Erick, 25/10/2026 |

(redação: claude-opus-5-5)
