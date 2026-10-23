# Livros que Rodam (poc)

Livros técnicos em que o código se monta e o terminal roda no meio do texto.
O capítulo é escrito em MDX (Markdown com componentes); o Astro monta o site.

## Rodar

```bash
npm install
npm run dev      # http://localhost:4321
npm test         # monta o site e roda os testes do livro
```

Node 22.12 ou mais novo.

## Onde fica cada coisa

| Pasta | O que tem |
|---|---|
| `livros/<livro>/capitulos/*.mdx` | o texto de cada capítulo |
| `livros/<livro>/projeto/` | o código real que o leitor constrói; as listagens leem daqui |
| `livros/<livro>/saidas.json` | as saídas dos terminais, gravadas do código real |
| `src/components/livro/` | os componentes do livro: `Listagem`, `Terminal`, `Nota`, `Resumo`, `PontoDeVolta` |
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

Formato pronto: fonte em MDX, `Listagem` e `Terminal` (conferidos contra o capítulo de teste, já removido).
Próximo: o livro *O ciclo de vida de um agente*, começando pelo capítulo 1.
