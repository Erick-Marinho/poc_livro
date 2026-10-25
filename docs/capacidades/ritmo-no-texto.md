# Ritmo no texto

**Problema.** A skill `revisar-ritmo` entrega a proposta no chat, e alguém aplica depois: uma volta a mais, e a decisão
longe do texto. O fluxo pedido é linear: escrever → skill → esqueleto **no texto** → ajustar → publicar.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `Rascunho.astro` | o lugar de uma ação sugerida no texto: o tipo, a frase, o verbo, o dado e a sugestão | props e o texto de dentro | um quadro âmbar "ação sugerida" na página | nova |
| `scripts/ritmo.mjs` (`eAcao`) | diz se um componente é uma ação do leitor; o `Rascunho` só aceita ação | o nome | sim ou erro | existe (ganha a função) |
| relógio e trava | o `Rascunho` conta como ação; o `npm test` falha se sobrar algum | os textos | o relatório e a falha | existe (etapa 2) |
| skill `revisar-ritmo` | escreve os `Rascunho` no arquivo, num commit, só adicionando | o texto | o commit e o relógio | existe (etapa 3) |

## Etapas

1. O componente `Rascunho`.
2. O relógio conta o `Rascunho`, e o `npm test` falha se sobrar algum.
3. A skill no modo esqueleto, testada num texto que ainda não passou por ela.

## Decisões

- (0) A skill só adiciona `Rascunho`: nunca reescreve nem apaga um parágrafo (Erick, 25/10/2026).
- (0) Preencher a ação é um passo à parte, com o dado conferido contra a fonte num teste.
- (1) O quadro do `Rascunho` tem borda contínua, não tracejada.
- (1) A regra que dá para testar sem o build (o tipo é uma ação; o dado diz se é real ou ilustração) fica em
  `scripts/ritmo.mjs`; o componente só desenha.

## Etapa atual: 1

`Rascunho.astro` com as props `acao`, `frase`, `verbo`, `dado` e a sugestão dentro; `eAcao` e `conferirRascunho` em
`scripts/ritmo.mjs`, com teste. Fora: o relógio e a trava (etapa 2), a skill (etapa 3). Evidência: o teste falha com
um tipo que não é ação e com um dado sem "real:" ou "ilustração:"; captura do quadro numa cópia do experimento.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
