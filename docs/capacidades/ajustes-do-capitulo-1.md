# Ajustes do capítulo 1

**Problema.** No capítulo 1, "o primeiro conserto" não diz que é uma etapa de um caminho. E "rodar", embora correto,
soa estranho para o leitor: "executar" é a palavra que ele espera, no texto, na IDE e no botão do terminal.

## Decisões

- (25/10/2026, Erick) "O primeiro conserto" vira "a primeira etapa".
- (25/10/2026, Erick) "Rodar" vira "executar" no livro todo: textos, roteiros da IDE, botão e mensagens do terminal,
  nos capítulos e no experimento. O slogan "um livro que roda" vira "um livro que executa", e "rodada" (a vez do
  agente) vira "execução". Saídas reais do terminal e código (`uv run`) não mudam: o livro não pode mentir.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `01-o-problema-e-o-contrato.mdx` | o texto do capítulo 1 | — | o que o leitor lê | troca (etapas 1 e 2) |
| capítulos, experimento, `roteiros/`, `passos/`, `figuras/`, `glossario.json` | o texto do livro e da IDE | — | o que o leitor lê | troca (etapa 2) |
| `terminal/TerminalAoVivo.tsx`, `ide/IdeCapitulo.tsx`, `lib/ideCapitulo.ts`, layouts e páginas | o botão, as mensagens e o slogan | — | o que o leitor lê | troca (etapa 2) |

## Etapas

1. "O primeiro conserto" vira "a primeira etapa".
2. "Rodar" vira "executar" no livro todo, com o slogan e "rodada".

## Etapa atual: 1

**Arquivos.** `01-o-problema-e-o-contrato.mdx` (a frase da ferramenta, na seção 1.2), `testes/vocabulario.test.mjs`.

**Evidência.** Os testes do livro passam; o teste novo falha com o texto de antes; a página mostra "A primeira etapa".

**Fora.** "Rodar" (etapa 2).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|

(redação: claude-opus-5-5)
