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
- (3) O teste da skill nova é no capítulo 1, numa cópia: os três textos de hoje já passaram por ela.

## Etapa atual: nenhuma

Capacidade fechada em 25/10/2026. A skill `revisar-ritmo` escreve os rascunhos no texto; o `npm test` não publica com
rascunho.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `e7eebb9` | o teste falha sem a conferência do dado; o build para com tipo que não é ação, componente que não existe e dado sem origem; captura do quadro em 1280 e 360 px | 25/10 |
| 2 | `35de94d` | numa cópia com um rascunho, o relógio vai de 243 a 180 · 63 e o teste falha com "linha 52: Aposta"; sem ele, passa | 25/10 |
| 3 | `28552d1` | a skill nova salva pelo Erick; seguida no capítulo 1 numa cópia: 9 linhas adicionadas e 0 removidas, 237 e 230 viraram 80 · 157 e 122 · 108, o `npm test` falhou nas linhas 49 e 105, os quadros na página | 25/10 |
