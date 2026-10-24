# Imersão na IDE do capítulo

**Problema.** Percorrendo a IDE do capítulo 1 inteira como leitor, esperando a conversa assentar a cada clique
(24/10/2026): 95 cliques até o fim, dos quais 40 são "sua vez" (o fazer), 17 fechos de passo e 38 "seguir" que só
mostram; mais 9 decisões (7 apostas e 2 perguntas). Uma primeira medição deu 143 porque clicava com a conversa ainda
entrando. Os 38 "seguir" passivos são o alvo (docs/PRINCIPIOS.md: assistir não é aprender; uma interação por ideia).

## Decisões

- (etapa 1) O "pendente" do pensamento do autor sai da tela: já feito em `75439e6` (outra sessão).
- (etapa 2) A abertura de um passo emenda sozinha na primeira ação: o chat corre do pedido do autor à primeira coisa
  feita, e o leitor só para onde há algo a fazer (aposta, pergunta, "sua vez", fecho do passo). Os blocos de código
  continuam um por clique: avançar código sozinho seria "código se montando sozinho".
- (etapa 3) O livro lembra o passo em que o leitor parou (no navegador) e oferece continuar dali; a trilha mantém os
  passos feitos entre visitas.
- (etapa 4) Modo foco: a IDE ocupa a tela inteira (sem sumário, cabeçalho e pílula); Esc volta ao livro.
- (etapa 5) No terminal da IDE, o comando não roda sozinho: o chat diz qual é, e o leitor digita e aperta Enter. Tab
  completa; "roda pra mim" é a saída para quem está no celular ou não quer digitar um `python -c` longo. O que não é o
  comando ganha uma dica do livro, em outra letra (não é saída de terminal). A aposta vem depois do Enter, antes da
  saída. O modo é o mesmo dos terminais avulsos (guiado ou interativo, guardado no navegador); a IDE começa no
  interativo, os terminais avulsos continuam começando no guiado. No modo direto, não se digita.

## Etapas

1. Tirar o "pendente" da tela (feito por outra sessão).
2. Menos cliques: a abertura emenda na primeira ação. Medida: cliques até o fim, antes e depois.
3. Continuar de onde parou.
4. Modo foco.
5. (médio) O leitor digita os comandos no terminal da IDE. Medida: o percurso inteiro nos três modos; o guiado e o
   direto não podem mudar.
6. (médio) Modificar antes de criar: 2 ou 3 variantes gravadas, com aposta.
7. (grande) "Fiz na minha IDE" conferido: `uv run conferir` no repositório do leitor.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `75439e6` (outra sessão) | o "pendente" do pensamento já não aparece na tela | Erick, 24/10/2026 |
| 2 | `812f432` | percurso do capítulo 1 inteiro: de 95 para 78 cliques; as 40 pausas "sua vez" continuam | Erick, 24/10/2026 |
| 3 | `8135191` | duas visitas no mesmo navegador: oferece continuar do passo 4 depois de fechar o 3, e a trilha mantém os feitos | Erick, 24/10/2026 |
| 4 | `26ddea9` | a IDE cobre 1440×813, a página não rola, a pílula e o cabeçalho ficam por baixo, Esc volta; capturas no computador e no celular | Erick, 24/10/2026 |
| 5 | `62d03d7` | percurso do capítulo 1: no interativo, 78 cliques mais 15 comandos (14 digitados, 1 "roda pra mim"), e as 7 apostas depois do Enter; no guiado, 78 cliques, como antes; no direto, 58 e sem campo. Capítulo 2 no interativo: 5 digitados, 1 "roda pra mim", até o passo 10. Erros digitados mostram a dica do livro; Tab completa | pendente |

(redação: claude-opus-5-5)
