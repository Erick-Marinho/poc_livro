# Modo foco, e o sumário que fecha

**Problema.** No computador (a partir de 1280 px), o sumário fica sempre aberto ao lado do texto, sem jeito de fechar;
e a página não tem um jeito de ficar só com o texto. O Erick pediu "um modo foco, e que o usuário possa fechar o
sumário e voltar quando quiser" (26/10/2026).

## Decisões

- (26/10/2026, Erick) Um modo foco, e o sumário que o leitor fecha e reabre quando quiser.
- (1) Uma etapa só: o modo foco depende de o sumário fechar.
- (1) As duas escolhas ficam guardadas no navegador, como o tema e o modo direto, e o script do `<head>` aplica antes de
  pintar, para a página não piscar com o sumário aberto.

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | O sumário que fecha, e o modo foco | fecha o sumário pelo ✕ e reabre pelo ☰; liga o foco no topo e sai pelo mesmo botão ou pelo Esc |

## Etapa atual: 1

### O que muda

- **O sumário fecha no computador.** O ✕ do sumário, que hoje só aparece na gaveta do celular, aparece também no
  computador e recolhe o sumário para a esquerda; o texto volta ao centro da página. Para reabrir, um ☰ na barra do
  topo (à esquerda, junto da marca) e o ☰ da pílula, que hoje some no computador. Fechado fica fechado nas outras
  páginas, até o leitor reabrir. No celular, a gaveta continua como está.
- **O modo foco.** Um botão no topo (ao lado do lembrete da IDE e do placar) e uma chave em Configurações › Leitura.
  Ligado, a página fica só com o texto: o sumário fecha, a barra do topo mostra só onde o leitor está e o botão de
  sair do foco, e a pílula de navegação some (a engrenagem fica). Sai pelo mesmo botão, pela chave ou pelo Esc. Fica
  guardado, como o modo direto.
- No celular, o foco esconde a pílula e os botões do topo, menos o de sair.

### Verificação

- Teste: o script do `<head>` aplica as duas escolhas; o CSS fecha o sumário e esconde o que o foco esconde; o ✕, o ☰
  do topo e o botão do foco estão na página.
- `npm test` e capturas, com cliques de verdade, no computador: sumário aberto, fechado pelo ✕, reaberto pelo ☰, o
  foco ligado e desligado pelo Esc, e a escolha mantida ao recarregar; e o foco no celular.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|

(redação: Claude Opus 5.5)
