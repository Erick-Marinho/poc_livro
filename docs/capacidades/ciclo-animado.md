# O mapa do ciclo, em anel e animado

**Problema.** O mapa do ciclo na introdução (Figura 1, da capacidade "Rota do livro") desenha uma linha, não um ciclo: a
volta de "Quando dá errado" para "Avaliar" e o Evoluir viram frases embaixo, e Governar vira uma caixa. O leitor acabou
de apostar em que fase cada um dos quatro problemas é pego, e o mapa não responde a aposta. E os textos de cada fase
ficam escondidos, desligados do desenho.

## Decisões

- (25/10/2026, Erick) Capacidade nova; pode mexer no mapa e no "você está aqui" da "Rota do livro".
- (25/10/2026, Erick) As fases em anel; a volta de "Quando dá errado" para "Avaliar" por dentro do anel, com destaque;
  Governar como halo em volta de tudo. No celular, uma coluna, com a volta na lateral.
- (25/10/2026, Erick) A animação mostra os quatro problemas da aposta andando pelo ciclo até a fase que os pega, com a
  aposta do leitor ao lado; o momento-chave é a pergunta imprevista que falha no uso e volta como caso da régua.
- (25/10/2026, Erick) Quem controla é o leitor: nada toca sozinho; até 6 cenas e 45 s; quadro final parado, o mesmo do
  modo direto; sem animação para quem pede menos movimento (`docs/RITMO.md`).
- (25/10/2026, Erick) Embaixo, um cartão por fase, sempre visível: o nome e a pergunta; o resto abre no clique. A fase
  por onde a animação passa acende o cartão, e clicar num nó do desenho também.
- (25/10/2026, Erick) O "você está aqui" dos capítulos vira o mesmo anel, em miniatura.
- (1) Evoluir anda por fora do anel, de Observar de volta a Construir: num anel, as duas voltas por dentro (a do erro e
  a do Evoluir) se cruzariam no meio, e a do erro é a que tem destaque.
- (1) O desenho é um componente React só de SVG (`ciclo/Anel.tsx`), montado no servidor: o mesmo vai para a animação e
  para a miniatura. Os cartões são `<details>`: abrem sem JS. No modo direto e na impressão, abrem todos.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `ciclo/Anel.tsx` | o desenho do ciclo: anel e coluna, a fase acesa, os nós clicáveis | `ciclo.json` | SVG | nova (etapa 1) |
| `MapaDoCiclo.astro` | o anel parado e os cartões ligados a ele | `ciclo.json`, `sumario.json` | a Figura 1 | troca (etapa 1) |
| `figuras/ciclo-animado.json` | as cenas: o problema, o caminho, a legenda | `onde-se-pega.json` | JSON | nova (etapa 2) |
| `ciclo/CicloAnimado.tsx` + ilha | os problemas andando pelo anel, cena a cena, com a aposta do leitor | as cenas | o vídeo | nova (etapa 2) |
| `CicloAqui.astro` | o anel em miniatura, com a fase do capítulo acesa | `ciclo.json` | SVG | troca (etapa 3) |

## Etapas

1. O anel parado: o desenho (anel e coluna) e os cartões ligados a ele, sem JS e na impressão; substitui o mapa de hoje.
2. A animação: as 6 cenas, aprovadas antes no Studio, com o avançar, as apostas ao lado, menos movimento e modo direto.
3. O "você está aqui" com o anel em miniatura.

## Etapa 1, detalhada

- **Arquivos:** `src/components/livro/ciclo/Anel.tsx` (novo), `src/components/livro/MapaDoCiclo.astro`,
  `testes/ciclo-animado.test.mjs` (novo).
- **Muda:** o mapa vira o anel (a coluna abaixo de 640 px), com Evoluir por fora e Governar como halo; embaixo, um
  cartão `<details>` por fase. Clicar num nó acende e abre o cartão dele; sem JS, os cartões abrem sozinhos.
- **Evidência:** `npm test`; o teste novo falha com o mapa de hoje; capturas em 1280 e 360 px, sem JS e na impressão.
- **Fora:** a animação (etapa 2) e a miniatura (etapa 3).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|

(redação: claude-opus-5-5)
