# Livros que Rodam (poc)

Livros técnicos em que o código se monta e o terminal roda no meio do texto.
O capítulo é escrito em MDX (Markdown com componentes); o Astro monta o site.

## Rodar

```bash
npm install
npm run dev      # http://localhost:4321
npm test         # monta o site e confere o capítulo contra a referência
```

Node 22.12 ou mais novo.

## Onde fica cada coisa

| Pasta | O que tem |
|---|---|
| `livros/<livro>/capitulos/*.mdx` | o texto de cada capítulo |
| `livros/<livro>/projeto/` | o código real que o leitor constrói; as listagens leem daqui |
| `livros/<livro>/saidas.json` | as saídas dos terminais, gravadas do código real |
| `src/components/livro/` | os componentes do livro: `Listagem`, `Terminal`, `Nota`, `Resumo`, `PontoDeVolta` |
| `testes/` | a conferência do capítulo; `referencia/` guarda o artefato que serviu de modelo |

## Escrever um trecho

```mdx
import Listagem from "../../../src/components/livro/Listagem.astro";
import clima from "../projeto/clima.py?raw";

<Listagem codigo={clima} nome="clima.py" linhas="7-17" notas={{ 12: "serviço fora do ar: para aqui" }} />
```

`linhas="7-17"` mostra o arquivo até a linha 17 e marca de 7 a 17 como novas.
Título de seção com número: `## 3.4 Do nome às coordenadas`.

## Estado

Etapa 1, parte 1a: fonte, `Listagem` e `Terminal`. O capítulo 3 do Agente do Clima é só o teste do formato.
Por enquanto o `saidas.json` foi gravado à mão a partir do projeto conferido; na parte 1c o verificador passa a gravá-lo.
