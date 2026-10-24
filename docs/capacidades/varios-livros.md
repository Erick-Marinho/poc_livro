# Vários livros

**Problema.** A estrutura gera páginas, sumário, placar e saídas por livro, mas quatro pontos estão amarrados ao
"O ciclo de vida de um agente": os comandos do `package.json` só gravam e conferem esse livro (um segundo ficaria fora
da conferência, e o build não falharia se ele mentisse); a IDE do capítulo e o chat da loja têm o nome do projeto e da
loja escritos no código; e o placar guarda no navegador só pelo número do capítulo. Os guias já comportam vários.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `package.json` | grava e confere as saídas de todos os livros, como já faz com os guias | `livros/*/` | `npm test` | troca |
| `IdeCapitulo.astro` + `ideCapitulo.ts` | a pasta do projeto vem do livro da página | `comandos.json` (`pasta_do_leitor`) | título, prompt e caminhos | troca |
| `FiguraAgente.astro`, `Rastro.astro`, `palco/Palco.tsx` | o nome da loja vem do livro da página | `projeto/dados/loja.json` | cabeçalho do chat | troca |
| `comandos/Comandos.tsx` | o placar guarda por livro e capítulo | o endereço da página | chave no navegador | troca |

## Decisões

- (1) O livro de um componente é o primeiro pedaço do endereço da página (`/<livro>/<capítulo>/`); o que falta nos
  dados dele falha o build com o nome do livro.

## Etapas

1. Os quatro pontos, com um livro de teste montando ao lado do atual.

## Etapa 1 (detalhe)

- **Arquivos:** `package.json`, `src/components/livro/IdeCapitulo.astro`, `src/lib/ideCapitulo.ts`,
  `src/components/livro/ide/IdeCapitulo.tsx`, `src/components/livro/FiguraAgente.astro`, `src/components/livro/Rastro.astro`,
  `agente/AgenteAoVivo.tsx`, `rastro/RastroAoVivo.tsx`, `palco/Palco.tsx`, `comandos/Comandos.tsx`, `testes/ide-capitulo.test.mjs`.
- **Evidência:** nenhum `atendimento-bemtevi` nem `Casa Bem-te-vi` no `src/`; numa cópia do repositório com um
  segundo livro de teste, `npm run saidas` grava os dois, o site monta as páginas dos dois, e a conferência falha
  apontando o livro de teste quando uma saída dele muda; o livro atual continua igual (`npm test`).
- **Fica fora:** o repositório do leitor (`npm run leitor`) e a gravação paga continuam só do livro que os tem.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|

(redação: claude-opus-5-5)
