# Correções da introdução e do capítulo 1

**Problema.** Na leitura de 27/10/2026, o Erick achou seis pontos: o nome "Invista" não é bom para a dinâmica; o mapa
do ciclo, em "O que você vai construir", sobra espaço vazio; "A nota" pode ser mais intuitiva; o primeiro Pare e pense
do 1.1 pergunta por um conceito (a ferramenta) que só vem depois; na figura 1.1, na vez do leitor, o clique parece não
fazer nada; e "fluxo fixo" vira "fluxo (flow)".

## Decisões

- (27/10/2026, Erick) "Palpite" no lugar de "Invista": o rótulo da caixa, e no texto "dê o seu palpite", "o seu
  palpite". No livro inteiro e nos experimentos; o teste de vocabulário passa a barrar "invista/investe" (e segue
  barrando "aposta") no que o leitor lê. "Investigar" é outra palavra e fica.
- (27/10/2026, Erick) A ilustração com espaço vazio é o mapa do ciclo (Figura 1).
- (1) Três etapas, cada uma com o seu ok: o palpite; a introdução (o mapa e a nota); o capítulo 1 (o Pare e pense, a vez
  do leitor e o fluxo).

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | "Palpite" no lugar de "Invista", no livro, nos experimentos, na IDE e nas figuras | dá o seu palpite antes de ver |
| 2 | Introdução: o mapa do ciclo mais baixo; "A nota" dita como o jeito de avaliar o agente e de achar onde melhorar | entende a nota antes de vê-la |
| 3 | Capítulo 1: o primeiro Pare e pense sobre o que acabou de ler; a vez do leitor mostra o resultado no painel; "fluxo (flow)" | vê o que o clique fez |

## Etapa atual: 3 — o capítulo 1

- O primeiro Pare e pense do 1.1 deixa de perguntar por quem executa a ferramenta (conceito do parágrafo seguinte) e
  pergunta pelo que o leitor acabou de ler: o que falta para o modelo acertar a data, um modelo maior ou acesso ao
  sistema.
- A vez do leitor na figura 1.1: o resultado de cada clique aparece dentro do painel, com destaque, e o que ele já olhou
  ganha ✓; enquanto ele escolhe, o histórico de cima mostra só os passos anteriores.
- "Fluxo fixo" vira "fluxo (flow)" na torre, na escala, nas histórias e no fim da figura 1.1; no texto, "o fluxo".

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | b376ba5 | `testes/vocabulario.test.mjs`: "aposta", "invista" e "investe" barrados nas páginas montadas, nos textos, nos dados e nas frases dos componentes; "palpite" na introdução. `npm test` 208/208. Captura da caixa da introdução depois do clique | Erick, 27/10/2026 |
| 2 | 2474f82 | `npm test` 208/208; ritmo de "A nota": 99 palavras até o Pare e pense (os avisos da introdução são os de antes). Capturas do mapa rolando a 1280 e 390 px; ajuste: o rótulo da volta do erro encostava em "Quando dá errado" | Erick, 27/10/2026 |

(redação: Claude Opus 5.5)
