# Livros que Rodam (poc)

Livros técnicos em que o código se monta e o terminal roda no meio do texto.
O capítulo é escrito em MDX (Markdown com componentes); o Astro monta o site.

## Rodar

```bash
npm install
npm run dev      # http://localhost:4321, só os livros e os experimentos
npm run local    # http://localhost:4321, com a landing do FontMar.ai junto, como no túnel
npm test         # monta o site e confere as saídas do livro
npm run saidas   # roda os comandos do livro no projeto e grava as saídas
npm run site     # monta e serve o site em http://localhost:4321, como a landing do FontMar.ai o lê
```

O build publica `/livros/index.json` e `/experimentos/index.json` (`src/lib/vitrine.ts`), que a landing do FontMar.ai mostra.
A marca e o "Início" levam a `PUBLIC_URL_INICIO`: no `npm run dev`, o FontMar.ai local; sem a variável, `/`.

O `npm run local` sobe tudo num endereço só, para navegar como o leitor: o livro em `astro dev` (recarrega quando você
edita) e a landing ([FontMarAI](https://github.com/Erick-Marinho/FontMarAI), clonada ao lado deste repositório, ou em
`LANDING=caminho`) montada, e montada de novo quando ela muda. O `astro dev` repassa para a landing o que é dela (`/`, a
newsletter, as páginas em construção e os arquivos dela: `astro.config.mjs`). Pare antes outro `npm run dev` deste
projeto: o Astro só deixa um por projeto. Ctrl+C para tudo.

Para o projeto do livro (Python): [uv](https://docs.astral.sh/uv/).

Node 22.12 ou mais novo.

## Onde fica cada coisa

| Pasta | O que tem |
|---|---|
| `livros/<livro>/capitulos/*.mdx` | o texto de cada capítulo |
| `livros/<livro>/projeto/` | o código real que o leitor constrói; as listagens leem daqui |
| `livros/<livro>/marcos/cap-NN/` | o projeto congelado no fim do capítulo NN; o capítulo NN lê daqui |
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
Livro em andamento: *O ciclo de vida de um agente*. O projeto do capítulo 1 está congelado em
`livros/ciclo-de-vida/marcos/cap-01/` (a loja inventada, o contrato, as perguntas de referência e a nota de partida);
o `projeto/` é sempre o capítulo mais novo.
Escritos: prefácio e capítulo 1 (rascunhos para revisão).
