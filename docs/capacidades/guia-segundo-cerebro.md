# Guia: um segundo cérebro local

**Problema.** O artigo do Daily Dose of DS ("Build your own 100% local AI second brain") ensina a instalar o Rowboat e
promete um cérebro "100% local" que entende o que mudou nas suas notas. Mas os dados vêm do Gmail, da agenda e de
serviços de reunião; nada é medido; e a tese central (um resumo não acompanha o que mudou) é afirmada, não mostrada.
O guia faz o mecanismo à vista, num cofre do Obsidian, e mede: o leitor vê a armadilha do prazo que mudou, conserta e
compara a nota antes e depois.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `projeto/cofre/` | as notas de uma pessoa inventada, em Markdown, com data e `[[links]]`; abre no Obsidian | — | o cofre | nova |
| `projeto/cerebro.py` | acha as notas da pergunta e responde com a frase e a fonte; com `--sem-data`, a busca ingênua | uma pergunta | resposta e fonte | nova |
| `projeto/perguntas.jsonl` + `medir.py` | dez perguntas de referência com a resposta certa, e a nota | o cofre | "X de 10" | nova |
| `guia.mdx` | o texto: a armadilha (com aposta), o conserto, a nota, o que é local | as saídas gravadas | a página | nova |
| Ollama + modelo pequeno | o modelo local redige a resposta a partir das notas achadas | as notas | a resposta gravada | nova (etapa 2) |

## Decisões

- (Erick, 24/10/2026) Notas de uma pessoa qualquer, inventada; nada de dado real.
- (Erick, 24/10/2026) O guia ensina a subir o Ollama; o guia de modelos locais, mais fundo, vem depois.
- (Erick, 24/10/2026) As notas moram num cofre do Obsidian; o Obsidian não roda no build, e captura dele é ilustração.
- (1) O cérebro começa sem modelo: a parte que decide (achar a nota certa e a mais recente) roda e se mede em qualquer
  máquina. A busca é um BM25 de vinte linhas, em Python puro, sem dependência.

## Etapas

1. O cofre e o cérebro sem modelo: a busca com fonte, a armadilha do prazo, o conserto pela data e a nota.
2. Subir o Ollama e deixar um modelo pequeno redigir a resposta, medido pela mesma régua (precisa do ok para baixar).
3. Os `[[links]]`: o que uma pessoa ficou de fazer, seguindo as notas que citam ela.
4. O fecho: o que fica local e o que não fica, e quando vale um app como o Rowboat.

## Etapa 1 (detalhe)

- **Arquivos:** `guias/segundo-cerebro-local/` (`guia.mdx`, `comandos.json`, `saidas.json`, `projeto/` com `cofre/`,
  `cerebro.py`, `perguntas.jsonl`, `medir.py`, `pyproject.toml`).
- **Evidência:** `npm run guias:conferir` grava e confere as saídas; com `--sem-data`, a pergunta do prazo devolve a
  data velha, citando a nota de onde veio; sem a flag, a nova, com a velha ao lado; as duas notas da régua, como
  saírem; `npm test`; captura da página.
- **Fica fora:** o modelo (etapa 2), os links (etapa 3), o fecho (etapa 4); a voz dos autores fica com `Pendente`.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|

(redação: claude-opus-5-5)
