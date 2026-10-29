# O experimento em Markdown

**Problema.** O Erick quer que o leitor possa baixar um experimento em Markdown, para estudar fora do site ou dar a um
assistente de IA como contexto. O `.mdx` cru não serve: tem imports e componentes que só fazem sentido na página.

## Decisões

- (29/10/2026, Erick) "Texto + código do projeto": o arquivo traz o texto inteiro e, no fim, o projeto final e as
  saídas gravadas.
- (29/10/2026, Erick) "Só no KV cache, como teste": liga por experimento, com `markdown: true` no topo do `.mdx`.
- (1) O arquivo é montado com o site, em `/experimentos/<id>.md`, a partir do próprio `.mdx`: muda o texto, muda o
  arquivo. Componente que o conversor não conhece faz a montagem falhar.
- (1) Pare e pense e palpite chegam com a resposta recolhida num `<details>`, que o GitHub, o VS Code e o Obsidian
  mostram fechado: o leitor ainda pode pensar antes de abrir.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `markdown` no topo do `.mdx` | liga o arquivo e o botão | `true` | o esquema valida | nova |
| `src/lib/markdownExperimento.ts` | converte o experimento | o `.mdx`, os JSON, as saídas, o projeto | o Markdown | nova |
| `src/pages/experimentos/[experimento].md.ts` | monta o arquivo | a coleção | `/experimentos/<id>.md` | nova |
| `src/lib/resultados.ts` | o "X de Y" do resultado, para a página e o arquivo | `resultado`, `saidas.json` | as linhas | sai da página |
| `LEGENDAS` em `kv/kv.ts` | a legenda das figuras, para a página e o arquivo | `qual` | o texto | sai do componente |
| botão "Baixar em Markdown" | na abertura, antes do áudio | o endereço | o download | nova |

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | O Markdown do KV cache | baixa o experimento num arquivo só, com o código e as saídas |

## Última etapa: 1 — o Markdown do KV cache

- Cada componente vira texto: Pare e pense e palpite com a resposta recolhida; as figuras pelos balões e pela legenda;
  a IDE aponta para "O projeto" e "As saídas gravadas"; o exercício e a nota em texto; o `Pendente` sai.
- Links que começam com "/" viram absolutos (`ENDERECO`, em `src/lib/site.ts`).
- Do projeto ficam de fora o que é grande (acima de 50 KB: `coleta.json`) e o `uv.lock`; o arquivo diz quais.
- Comando que aparece duas vezes nas saídas é avisado: foi gravado em passos diferentes da IDE.
- Fora: os outros três experimentos, e um "copiar" ao lado do "baixar".

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|

(redação: Claude Opus 5.5)
