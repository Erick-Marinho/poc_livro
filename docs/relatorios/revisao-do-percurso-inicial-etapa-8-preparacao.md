# Etapa 8 — lista de prontidão para a leitura do Victor

Relatório para o Erick em 26/10/2026. Esta preparação não realizou nem simulou a leitura. (redação: GPT-5)

## Estado

A base local está reproduzível, mas a sessão ainda não está pronta para começar: três decisões pertencem ao Erick.
(redação: GPT-5)

| Item | Estado | Evidência |
|---|---|---|
| Testes do livro | pronto | `npm test` passou. |
| Saídas gravadas | pronto | `npm run saidas:conferir` conferiu 30 saídas. |
| Repositório local do leitor | pronto | `npm run leitor` conferiu as saídas e regenerou as 31 tags locais. |
| Introdução na máquina | pronto | O comando local do protocolo respondeu à rota da introdução. |
| Repositório público do leitor | decisão e ação pendentes | Erick decide e faz o push das tags regeneradas; nenhum push foi feito nesta preparação. |
| Acesso de Victor fora da rede local | decisão pendente | A decisão de 25/10 cobre apenas máquina e rede local; este novo caso ainda não tem forma de acesso decidida. |
| Voz dos autores | decisão pendente | Erick decide se os cinco lugares reservados são preenchidos antes ou depois da leitura. |
| Contexto da sessão | pendente | Data, aparelho, sistema, navegador, “Reduzir movimento”, commit e comando usados entram na ficha. |
| Critério do sinal | pendente | Erick marca em `sinal.md` se a proposta foi adotada, alterada ou continua pendente. |

## Repositório público e tags locais

A consulta foi somente de leitura:

```text
$ git ls-remote --tags --refs https://github.com/Erick-Marinho/atendimento-bemtevi.git
87e74f78e2898af7514fd4b2b0df17bfd7392814 refs/tags/cap-01/fim
3ccffc21032d11047095a07ec055e9c88ace11ba refs/tags/cap-02/fim
... 31 tags ao todo
```

O commit mais recente alcançado pelas tags públicas é `6c06f36b6e7bc2100e056447a61272f6a8faee81`, de
`2026-10-16T13:16:00Z`, com a mensagem `capítulo 2, passo 10: A nota do agente`.

Depois de `npm run leitor`, as duas árvores finais foram comparadas numa cópia bare temporária:

| Tag | Commit público | Árvore pública | Commit local | Árvore local | Diferença |
|---|---|---|---|---|---|
| `cap-01/fim` | `6c054a8` | `1140465` | `164c39a` | `8a2dad3` | `baseline.py`, `test_referencia.py` |
| `cap-02/fim` | `6c06f36` | `0b5d7aa` | `d3b1578` | `d64250e` | `baseline.py`, `test_referencia.py` |

Nas duas tags, `baseline.py` local soma cada caminho de `sys.argv[1:]` à referência, e `test_referencia.py` local
carrega `meus-casos.jsonl` quando o arquivo existe. São as mudanças da etapa 3 que faltam nas árvores públicas.
Nenhuma referência remota foi alterada. (redação: GPT-5)

## Lugares reservados para a voz dos autores

As linhas foram conferidas no estado preparado; o texto continua reservado, sem experiência inventada:

| Arquivo e linha | Pendente |
|---|---|
| `livros/ciclo-de-vida/capitulos/01-o-problema-e-o-contrato.mdx:93` | Uma vez em que os autores começaram pelo agente, e o que isso custou. |
| `livros/ciclo-de-vida/capitulos/01-o-problema-e-o-contrato.mdx:138` | Por que quatro decisões, e não três ou cinco. |
| `livros/ciclo-de-vida/capitulos/01-o-problema-e-o-contrato.mdx:169` | Um caso mal escrito que já chegou à régua de um projeto dos autores. |
| `livros/ciclo-de-vida/capitulos/02-o-primeiro-agente.mdx:75` | Uma vez em que texto solto de um modelo quebrou o código seguinte. |
| `livros/ciclo-de-vida/capitulos/02-o-primeiro-agente.mdx:127` | O que os autores esperavam da primeira nota, e o que acharam dela. |

Erick ainda decide se esses cinco lugares são preenchidos antes ou depois da leitura. (redação: GPT-5)

## Verificações reais

### Saídas gravadas

```text
$ npm run saidas:conferir
conferidas 30 saídas: iguais às do livro
```

### Repositório do leitor

```text
$ npm run leitor
conferidas 30 saídas: iguais às do livro
```

### Introdução servida na máquina

```text
$ npm run dev:livro -- --host 127.0.0.1 --port 4339
Dev server running at http://127.0.0.1:4339

$ curl http://127.0.0.1:4339/ciclo-de-vida/00-introducao/
HTTP 200
<title>Introdução · O ciclo de vida de um agente
<h1>Introdução
```

O servidor foi encerrado depois da conferência.

### Testes

```text
$ npm test
9 page(s) built
conferidas 30 saídas: iguais às do livro
conferidas 16 saídas: iguais às do livro
tests 123
pass 123
fail 0
5 passed in 1.54s
```

A primeira tentativa no sandbox parou porque o `uv` não pôde criar seu lock no cache do usuário, montado somente
para leitura. A mesma suíte foi repetida com acesso a esse cache e passou com a saída acima; não foi uma falha do
projeto. (redação: GPT-5)

Não houve chamada paga, túnel, push nem escrita no repositório público.
