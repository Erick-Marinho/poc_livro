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

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| lembrete e fundamentação | convida a abrir a IDE e diz por quê | — | botão fixo e diálogo | nova |
| `Terminal` (réplica) | guiado e interativo, no padrão do palco | saídas gravadas | ilha React | troca o atual |
| `roteiros/cap01.json` | a ordem lógica das edições e dos comandos, com os erros | projeto final | estados intermediários | nova |
| `saidas.py` estendido | reconstrói o projeto pelo roteiro e grava cada saída | roteiro | `saidas.json` | existe |
| `IDE` (réplica) | explorador, abas, editor que digita, Problemas e o terminal embaixo | roteiro + saídas | ilha React | nova |
| capítulo 1, seções 1.5 a 1.8 | o código contado pela IDE, com erros de verdade | IDE | texto | existe |

## Etapas (aceitas pelo responsável)

1. Lembrete fixo, nota no prefácio e a fundamentação com referências.
2. Terminal réplica, guiado e interativo, sobre as saídas gravadas.
3. Roteiro de construção do capítulo 1 e `saidas.py` reconstruindo e gravando cada passo, erros incluídos.
4. IDE réplica tocando o roteiro, com o terminal da etapa 2 embutido.
5. Capítulo 1 com a IDE nas seções 1.5 a 1.8, e o texto ajustado aos erros do caminho.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `fb7a34d` | `npm test`; capturas do lembrete, da nota no prefácio e do diálogo, no computador e no celular | Erick, 23/10/2026 |
| 2 | `f6fddab` | `npm test`; sessão interativa conferida no DOM (ls, comando incompleto, Tab, Enter, ↑); capturas no computador e no celular | Erick, 23/10/2026 |

(redação: claude-opus-5-5)
