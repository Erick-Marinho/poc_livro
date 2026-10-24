# O capítulo construído passo a passo

**Problema.** No capítulo 1, a IDE abre com os 12 arquivos do projeto e escreve 50 linhas de uma vez; depois dela,
listagens e terminais repetem o código. O leitor não vê onde o passo começa nem onde termina, e não liga os pontos.
O código entra sem explicação: `BaseModel`, `str | None` e `r"^R\d{2}$"` passam sem aviso para quem está começando.

**Regra que não muda.** O roteiro (`roteiros/01.json`) e o `saidas.py` continuam sendo o motor: o que muda é como
o caminho aparece na página.

## Decisões

- (5a) O **passador** lê um trecho do arquivo real bloco lógico por bloco lógico: o bloco acende, o resto apaga, e o
  painel diz o que ele faz em palavras do dia a dia. O leitor avança (botões, setas, ou clicando numa linha).
- (5a) As palavras que travam quem começa ficam num **glossário único por livro** (`livros/<livro>/glossario.json`),
  explicadas sem jargão. No passador, aparecem como botões do bloco e sublinhadas no código.
- (5a) Alguns blocos terminam numa **pergunta curta** (prever antes de seguir), e a resposta é conferida no projeto
  real: a do id contra o padrão do `contrato.py`, a do pedido contra as saídas gravadas do roteiro.
- (5a) No modo direto, todos os blocos aparecem abertos, sem apagar o código e sem perguntas.
- (5b) Cada passo mostra no máximo cerca de 12 linhas novas; se o roteiro pede mais, o passo se divide.
- (5c) A IDE completa só abre por clique ("ver o projeto inteiro até aqui"); nunca fica aberta no meio do texto.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `glossario.json` | as palavras difíceis, uma vez por livro | — | termos | nova |
| `Passador.astro` | um trecho real, bloco a bloco, com palavras e perguntas | arquivo real + `passadores/*.json` + glossário | figura | nova |
| `passadores/caso.json` | os 5 blocos do formato de um caso (`contrato.py`, 29–38) | — | blocos | nova |
| passo de construção | objetivo, mapa pequeno, código novo, rodar, "agora você tem" | roteiro + estados | figura | a construir (5b) |
| trilha do capítulo | fluxograma clicável dos passos | roteiro | figura | a construir (5c) |

## Etapas

- **5a.** Passador e glossário, num trecho só: a classe `Caso`, na seção 1.6.
- **5b.** O passo de construção, lido do roteiro, aplicado ao `contrato.py`.
- **5c.** A trilha clicável e as seções 1.6 a 1.8 reescritas em passos; a IDE vira botão; saem as listagens repetidas.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
