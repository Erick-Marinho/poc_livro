# Livros que Rodam (poc)

Livros técnicos em que o código se monta e o terminal roda no meio do texto.
O capítulo é escrito em MDX (Markdown com componentes); o Astro monta o site.

## Rodar

```bash
npm install
npm run dev      # http://localhost:4321
npm test         # monta o site e confere as saídas do livro
npm run saidas   # roda os comandos do livro no projeto e grava as saídas
```

Para o projeto do livro (Python): [uv](https://docs.astral.sh/uv/).

Node 22.12 ou mais novo.

## Onde fica cada coisa

| Pasta | O que tem |
|---|---|
| `livros/<livro>/capitulos/*.mdx` | o texto de cada capítulo |
| `livros/<livro>/projeto/` | o código real que o leitor constrói; as listagens leem daqui |
| `livros/<livro>/comandos.json` | os comandos que o livro mostra no terminal |
| `livros/<livro>/saidas.json` | o que esses comandos mostram de verdade (gravado pelo `npm run saidas`) |
| `scripts/saidas.py` | grava e confere as saídas; a conferência falha se o código mudar e o livro não |
| `src/components/livro/` | os componentes do livro: `Listagem`, `Terminal`, `Nota`, `PareEPense`, `Classificador`, `Exercicio`, `Resumo`, `PontoDeVolta` |
| `testes/` | os testes do livro (montagem, código, saídas) |

## Escrever um trecho

```mdx
import Listagem from "../../../src/components/livro/Listagem.astro";
import agente from "../projeto/agente.py?raw";

<Listagem codigo={agente} nome="agente.py" linhas="7-17" notas={{ 12: "o que esta linha faz" }} />
```

`linhas="7-17"` mostra o arquivo até a linha 17 e marca de 7 a 17 como novas.
Título de seção com número: `## 1.4 As perguntas de referência`.

## Estado

Formato pronto: fonte em MDX, `Listagem` e `Terminal`.
Livro em andamento: *O ciclo de vida de um agente*. O projeto do capítulo 1 está em
`livros/ciclo-de-vida/projeto/` (a loja inventada, o contrato, as perguntas de referência e a nota zero).
Escritos: prefácio e capítulo 1 (rascunhos para revisão).
