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
- (2) A trava é do `npm test`, que é o passo antes de publicar; o `npm run dev` mostra o rascunho normalmente.

## Etapa atual: 2

`scripts/ritmo.mjs`: o `Rascunho` conta como ação (o texto de dentro não entra na conta). `testes/ritmo.test.mjs`: um
teste falha se algum capítulo ou experimento tiver `Rascunho`, e diz o arquivo e a linha. Fora: a skill (etapa 3).
Evidência: o `npm test` passa hoje; numa cópia com um `Rascunho`, o relógio fecha o trecho nele e o teste falha
dizendo onde.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `e7eebb9` | o teste falha sem a conferência do dado; o build para com tipo que não é ação, componente que não existe e dado sem origem; captura do quadro em 1280 e 360 px | 25/10 |
