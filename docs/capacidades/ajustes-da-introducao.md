# Ajustes da introdução

**Problema.** Na introdução, "pego" soa estranho, e "aposte" também. A animação do mapa pergunta onde cada problema é
pego como se o leitor não soubesse, logo depois de a aposta ter dado a resposta. "Régua" aparece sem dizer o que é. O
pare e pense usa um losango de texto no lugar de ícone, e os cartões das fases abaixo da animação, todos à vista,
tiram o foco dela.

## Decisões

- (25/10/2026, Erick) Na introdução, "pego" vira "apanhado", e "aposte", "invista".
- (25/10/2026, Erick) A animação não repete como pergunta o que o leitor já marcou na aposta.
- (25/10/2026, Erick) O pare e pense usa ícones do Lucide.
- (25/10/2026, Erick) "Régua" é explicada onde o leitor a encontra pela primeira vez.
- (25/10/2026, Erick) O que fica abaixo da animação começa recolhido, para o leitor focar nela.
- (1) Muda só o texto que o leitor lê; os nomes internos (`onde-se-pega.json`, o campo `pega`) ficam. "Quem pega" vira
  "Onde é apanhado" (na aposta) e "Apanhado em" (na animação): "quem apanha" teria outro sentido.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `00-introducao.mdx`, `figuras/*.json` | o texto da introdução, da aposta, das cenas e dos cartões | — | o que o leitor lê | troca (etapa 1) |
| `Aposta.astro` | o rótulo e as frases da aposta | `onde-se-pega.json` | a caixa da aposta | troca (etapa 2) |
| `ciclo/FiguraCiclo.tsx`, `ciclo/CicloAnimado.tsx` | o botão, a pergunta do topo e a faixa da animação | as cenas e a aposta do leitor | o vídeo | troca (etapas 1 a 3) |
| `PareEPense.astro` | o ícone do rótulo e do "ver a resposta" | `lucide-react` | a caixa do pare e pense | troca (etapa 4) |
| `MapaDoCiclo.astro` | os cartões das fases, recolhidos abaixo da animação | `ciclo.json` | a Figura 1 | troca (etapa 6) |

## Etapas

1. "Pego" vira "apanhado" em tudo o que o leitor lê na introdução.
2. "Aposte" vira "invista".
3. A animação parte do que o leitor já marcou, sem perguntar de novo.
4. Ícones do Lucide no pare e pense.
5. "Régua" explicada na primeira vez que aparece.
6. O que fica abaixo da animação começa recolhido.

## Etapa atual: 1

**Arquivos.** `00-introducao.mdx` (a pergunta da aposta e a frase antes do mapa), `onde-se-pega.json` (o rótulo do
resultado e um "porquê"), `ciclo-animado.json` (a pergunta e a primeira legenda), `ciclo.json` (o "ganha" de Quando dá
errado), `FiguraCiclo.tsx` (o botão), `CicloAnimado.tsx` (a faixa), `testes/introducao.test.mjs`.

**Evidência.** `npm test` passa; o teste novo falha com o texto de antes; a página mostra "apanhado" na aposta, no mapa
e no botão da animação.

**Fora.** "Pega" nos outros capítulos (o contrato que "pega" a variante, no capítulo 2) e nos comentários do código.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|

(redação: claude-opus-5-5)
