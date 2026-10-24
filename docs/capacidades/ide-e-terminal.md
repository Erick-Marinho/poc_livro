# A IDE e o terminal do livro

**Problema.** Uma listagem estática mostra o código pronto, de cima para baixo, como ninguém escreve.
Quem programa escreve na ordem do raciocínio (o teste antes da função, a volta ao topo para um import),
roda, erra e corrige. O livro precisa mostrar esse caminho, e o leitor precisa poder repetir no terminal.

**Regra que não muda.** O livro não pode mentir, nem no caminho. Todo estado intermediário do código e todo
erro mostrado saem de rodar o projeto de verdade; o estado final tem que ser igual ao `projeto/` real.

## Decisões

- (etapa 1) Lembrete fixo e nota no prefácio: "leia com a IDE aberta", com fundamentação e referências
  (Freeman et al., 2014; Sentance, Waite e Kallia, 2019; Metcalfe, 2017; Kapur, 2008), conferidas por busca.
- (etapa 2) O terminal é uma réplica com dois modos: **guiado** (o livro digita e roda, passo a passo) e
  **interativo** (o leitor digita; Tab completa, ↑ traz o histórico, `help` lista os comandos). Em ambos, a saída
  é a gravada do projeto real: no navegador não há Python, e simular um seria mentir. (aceito pelo responsável)
- (etapa 3) O caminho do código é um **roteiro de construção** por capítulo: criar arquivo, inserir, trocar,
  rodar. O `saidas.py` aplica o roteiro numa cópia vazia, roda cada comando no estado em que ele aparece
  (inclusive os que falham de propósito), grava a saída e confere que o fim é igual ao `projeto/`.
- (etapa 3) Formato do roteiro (`roteiros/01.json`): `copiar`, `escrever`, `inserir` (no fim, ou depois de uma linha
  que aparece uma vez só), `trocar` (um trecho que aparece uma vez só) e `rodar` (com o código de saída esperado).
  O texto vem de faixas de linhas do arquivo final ou é literal, para os estados errados. Cada passo tem uma `nota`
  curta, que a IDE vai mostrar. O roteiro não monta se: a âncora não for única, um comando sair com outro código,
  ou o fim não for igual ao `projeto/`. As saídas entram no mesmo `saidas.json`, com ids `r01-…`.
- (etapa 3) A conferência ignora endereços de memória (`at 0x…`), como já ignorava os tempos.
- (etapa 4, refeita depois de docs/PRINCIPIOS.md) A IDE **não toca sozinha**: quem avança é o leitor, um passo por vez.
  Em cada `rodar`, ela pede a **aposta** antes de mostrar a saída ("vai carregar ou dar erro?", "quantos testes
  falham?"), e só então mostra o terminal; a aposta mora no roteiro, ao lado do comando. O código muda de uma vez,
  com as linhas alteradas destacadas, sem digitação animada. O erro de verdade marca a linha no editor e no painel
  Problemas. A IDE **substitui** as listagens e os terminais da seção, em vez de se somar a eles. No modo direto, ela
  mostra o código final e as saídas, sem apostas. Os estados de cada passo saem do `saidas.py` (uma implementação só).

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| lembrete e fundamentação | convida a abrir a IDE e diz por quê | — | botão fixo e diálogo | nova |
| `Terminal` (réplica) | guiado e interativo, no padrão do palco | saídas gravadas | ilha React | troca o atual |
| `roteiros/cap01.json` | a ordem lógica das edições e dos comandos, com os erros | projeto final | estados intermediários | nova |
| `saidas.py` estendido | reconstrói o projeto pelo roteiro e grava cada saída | roteiro | `saidas.json` | existe |
| `IDE` (réplica) | explorador, abas, editor que digita, Problemas e o terminal embaixo | roteiro + saídas | ilha React | nova |
| capítulo 1, seções 1.5 a 1.8 | o código contado pela IDE, com erros de verdade | IDE | texto | existe |

> **Estado (24/10/2026).** As etapas 1 a 3 continuam valendo (o lembrete da IDE, o terminal e o roteiro de construção).
> A IDE das etapas 4 e 5 foi **substituída pela IDE do capítulo** (`IdeCapitulo`), construída em outra sessão e descrita
> em [`passo-a-passo.md`](passo-a-passo.md), etapas 7a a 7c. A etapa 5 deste plano não fecha aqui: o capítulo e a IDE
> passam a ser daquele plano; este fica com o terminal e o roteiro.

## Etapas (aceitas pelo responsável)

1. Lembrete fixo, nota no prefácio e a fundamentação com referências.
2. Terminal réplica, guiado e interativo, sobre as saídas gravadas.
3. Roteiro de construção do capítulo 1 e `saidas.py` reconstruindo e gravando cada passo, erros incluídos.
4. IDE réplica com apostas, avançada pelo leitor, usada na seção 1.6 no lugar das listagens e do terminal dela.
5. A IDE nas seções 1.7 e 1.8, o texto ajustado aos erros do caminho, e a contagem de peças do capítulo antes e depois.
   *Substituída: o commit `a09e5a4` chegou a fazer isso (o capítulo passou de 20 peças para 12), mas a IDE do capítulo
   (passo-a-passo.md, 7a) trocou essa versão logo depois.*

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `fb7a34d` | `npm test`; capturas do lembrete, da nota no prefácio e do diálogo, no computador e no celular | Erick, 23/10/2026 |
| 2 | `f6fddab` | `npm test`; sessão interativa conferida no DOM (ls, comando incompleto, Tab, Enter, ↑); capturas no computador e no celular | Erick, 23/10/2026 |
| 3 | `7dab392` | `npm test` com 12 saídas; conferência estável em duas rodadas; o build falha com âncora errada, código de saída errado, sem a correção do R12 e sem o baseline.py | Erick, 23/10/2026 |
| 4 | `3059027` (substituída por `63e936f`) | `npm test`; sessão conferida no DOM (aposta bloqueia o avanço, nota só depois da aposta, veredito, linhas 6 e 40-47 destacadas, erro na linha 4 com 1 problema); capturas no computador e no celular | Erick, 23/10/2026 |

(redação: claude-opus-5-5)
