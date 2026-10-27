# Os acertos pequenos da revisão de narrativa

**Problema.** Uma revisão da narrativa da introdução e dos capítulos 1 e 2 (27/10/2026) achou problemas de três
tamanhos. Este plano trata só dos pequenos, de texto, que não mexem em figura nem na ordem das seções: um exemplo
trocado, um número exagerado, uma metáfora sem ponte, um termo interno que sobrou, uma resposta entregue antes da
aposta da IDE e ressalvas repetidas. Os grandes têm plano próprio: a torre como marcador no 2.1 e no 2.6 (b) e as
escolhas nas figuras do capítulo 2, com o bilhete (c).

## Decisões

- (27/10/2026, Erick) "Vamos seguir o plano e começar com a": primeiro os acertos pequenos, depois (b) e (c).
- (1) Ficam de fora, porque pedem decisão dos autores: as promessas de capítulo que divergem (o R12 "quebrado de
  propósito" no capítulo 6, e "que regra valia numa conversa" no capítulo 5, quando o sumário diz Observar e Pôr no
  ar); o R02 do agente apressado; a ordem do 1.1 e a figura P.1 da introdução.

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | Os acertos de texto, um por trecho | lê sem tropeçar: o exemplo bate com o contrato, o número com a fonte, a aposta da IDE não chega respondida |

## Etapa atual: 1 — os acertos

- Introdução, Pare e pense dos erros: "responder uma que devia passar" vira "responder uma que não devia" (o exemplo é
  o pedido de outra pessoa, que o contrato manda recusar, e não passar).
- 1.1: a torre ganha a ponte com a escala ("uma escala de autonomia"); "quase todas as instituições" vira
  "quatro em cada cinco", como o dado (80%).
- 1.3: o "hoje" da loja aparece no texto (10/11/2026, o `hoje` do `loja.json`).
- 1.4: a colega está de férias, então o gabarito não é "o que ela vai usar para conferir", e sim o que confere enquanto
  ela está fora.
- 2.3: "cada balcão ligado" vira "cada nó ligado"; o limite do modelo falso não é dito antes da aposta da IDE.
- 2.4: o aviso da gravação, que repete a introdução, fica numa frase.
- 2.6: o "Ele" do Pare e pense passa a dizer quem é; o último item do Resumo e o passo 9 da IDE perdem o tom de
  ressalva jurídica, sem perder o que dizem.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | cdb7ead | `npm test` 190/190; `npm run ritmo`: os mesmos avisos de antes (o trecho do 1.1 antes da Aposta foi a 203 com a ponte longa e ficou em 200 com "uma escala de autonomia"); nenhum teste dependia dos trechos trocados | Erick, 27/10/2026 |

(redação: Claude Opus 5.5)
