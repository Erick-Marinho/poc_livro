# Ajustes do capítulo 1

**Problema.** No capítulo 1, "o primeiro conserto" não diz que é uma etapa de um caminho. E "rodar", embora correto,
soa estranho para o leitor: "executar" é a palavra que ele espera, no texto, na IDE e no botão do terminal.

## Decisões

- (25/10/2026, Erick) "O primeiro conserto" vira "a primeira etapa".
- (25/10/2026, Erick) "Rodar" vira "executar" no livro todo: textos, roteiros da IDE, botão e mensagens do terminal,
  nos capítulos e no experimento. O slogan "um livro que roda" vira "um livro que executa", e "rodada" (a vez do
  agente) vira "execução". Saídas reais do terminal e código (`uv run`) não mudam: o livro não pode mentir.
- (25/10/2026, Erick) A caixa das camadas, no capítulo 1, diz "Onde é capturado", como a da introdução.
- (2) Onde "executar" pede sujeito que age, a voz passiva: "o modelo é executado no Ollama", "os comandos são
  executados de verdade". As mensagens de erro da montagem ("rode npm run saidas") são para quem escreve, e ficam.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `01-o-problema-e-o-contrato.mdx` | o texto do capítulo 1 | — | o que o leitor lê | troca (etapas 1 e 2) |
| capítulos, experimento, `roteiros/`, `passos/`, `figuras/`, `glossario.json` | o texto do livro e da IDE | — | o que o leitor lê | troca (etapa 2) |
| `terminal/TerminalAoVivo.tsx`, `ide/IdeCapitulo.tsx`, `lib/ideCapitulo.ts`, layouts e páginas | o botão, as mensagens e o slogan | — | o que o leitor lê | troca (etapa 2) |

## Etapas

1. "O primeiro conserto" vira "a primeira etapa".
2. "Rodar" vira "executar" no livro todo, com o slogan e "rodada"; e "Quem pega" das camadas vira "Onde é capturado".

## Etapa atual: 2

**Arquivos.** Os capítulos e o experimento (`.mdx`), `roteiros/`, `passos/`, `figuras/` (com `camadas.json`),
os glossários, `terminal/TerminalAoVivo.tsx`, `ide/IdeCapitulo.tsx`, `comandos/Comandos.tsx`, os layouts e as páginas
com o slogan, `testes/vocabulario.test.mjs`.

**Evidência.** Os testes do livro passam; o teste novo falha com o texto de antes; nenhuma página montada diz "rodar"
em nenhuma forma, e o botão do terminal diz "▶ Executar".

**Fora.** As saídas gravadas do terminal (`saidas.json`), o código do projeto e os comandos (`uv run`); os nomes
internos (`tm-rodar`, a ação `rodar`); as mensagens de erro da montagem; a landing (FontMarAI).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `0bc7e3e` | 103 testes do livro; o teste novo falha com o texto de antes; a página mostra "A primeira etapa" e nenhum "conserto" | Erick, 25/10/2026 |

(redação: claude-opus-5-5)
