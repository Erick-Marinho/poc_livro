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
- (5b1) Comando com erro que passa pela biblioteca padrão do Python (o caminho e as linhas mudam de máquina para
  máquina) mostra só a última linha do erro, com `2>&1 | tail -1`; o comando aparece inteiro, então o leitor vê o truque.
- (5b1) Linha que começa com `NomeError:` passa a ser marcada como erro nas saídas gravadas.
- (5b1) A conferência do fim do roteiro ignora `.ruff_cache`, como já ignorava `.venv` e `__pycache__`.
- (5b2) O limite vale para o passo inteiro: até 15 linhas novas, sem contar as em branco, somando todos os arquivos.
  Passou disso, o build falha e pede para dividir (foi o que dividiu "ler o arquivo" e "as três primeiras perguntas").
- (5b2) No passo, cada arquivo mostra só as linhas novas e uma de cada lado; o resto dobra, com "ver o arquivo inteiro".
  O código não "entra" animado. A nota de cada edição do roteiro aparece em cima do código, como o porquê da mudança.
- (5b2) Comando com aposta: a saída só aparece depois da aposta. Sem aposta: botão "Rodar". "Agora você tem" aparece
  quando todos os comandos do passo rodaram. No modo direto, tudo aberto, sem apostas.
- (5b2) A IDE da 1.6 saiu; as figuras seguintes foram renumeradas (as IDEs da 1.7 e da 1.8 viram 1.3 e 1.4).
- (5c1) Arquivo de dados (`.json`, `.jsonl`, `.md`, `.toml`) não conta no limite: é para copiar do repositório,
  não para digitar. No passo, mostra as três primeiras linhas novas e as que o autor pedir com `ver` (o R12, por exemplo).
- (5c1) O `test_referencia.py` entra em três partes (o que os testes leem; os quatro de formato, que passam com o R12
  errado; os três da política, que o pegam) e o `baseline.py` em duas (o decisor; a régua). Três comandos novos gravados.
- (5c1) Os passos são numerados por seção (1.6: 6; 1.7: 6; 1.8: 2). A numeração do capítulo inteiro fica para a trilha (5c2).
- (5c1) O passo avisa o placar quando o leitor aposta (`fontmar:apostou`), como a IDE fazia.
- (5c) A IDE completa só abre por clique ("ver o projeto inteiro até aqui"); nunca fica aberta no meio do texto.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `glossario.json` | as palavras difíceis, uma vez por livro | — | termos | nova |
| `Passador.astro` | um trecho real, bloco a bloco, com palavras e perguntas | arquivo real + `passadores/*.json` + glossário | figura | nova |
| `passadores/caso.json` | os 5 blocos do formato de um caso (`contrato.py`, 29–38) | — | blocos | nova |
| `Passo.astro` | objetivo, mapa pequeno, código novo, rodar com aposta, "agora você tem" | roteiro + estados + saídas | figura | nova (5b2) |
| trilha do capítulo | fluxograma clicável dos passos | roteiro | figura | a construir (5c) |

## Etapas

- **5a.** Passador e glossário, num trecho só: a classe `Caso`, na seção 1.6.
- **5b.** O passo de construção, lido do roteiro, aplicado ao `contrato.py`. Dividida em duas partes:
  - **5b1.** O roteiro reparte o `contrato.py` em pedaços de até ~13 linhas novas, na ordem em que se pensa
    (as listas fechadas; o formato de um caso, voltando ao topo para o import; a leitura do arquivo; a regra),
    e cada pedaço termina num comando real gravado. Evidência: a contagem de linhas novas por passo e as saídas novas.
  - **5b2.** O componente `Passo` (objetivo, mapa pequeno, código novo, rodar com aposta, "agora você tem") na seção
    1.6, no lugar da IDE dela; o passador da 5a entra como o código do passo do formato de um caso.
- **5c.** Dividida em três partes:
  - **5c1.** As seções 1.7 e 1.8 em passos, com o `test_referencia.py` e o `baseline.py` repartidos; a IDE sai do texto.
  - **5c2.** A trilha clicável do capítulo, e a IDE como botão "ver o projeto inteiro até aqui".
  - **5c3.** O caminho do erro dobrado no meio (fica a primeira e a última linha) e as linhas em branco sem destaque.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 5a | `43782da` | `npm test` (10 testes, 4 novos); passador no ngrok, no computador e no celular; perguntas conferidas no projeto real | Erick, 23/10/2026 |
| 5b1 | `11d272c` | contagem de linhas novas por passo (todas ≤ 13 no `contrato.py`); 2 saídas novas gravadas e conferidas | Erick, 23/10/2026 |
| 5b2 | `9a105c0` | `npm test` (14 testes, 4 novos); seis passos na 1.6 no ngrok, no computador e no celular; o build barrou um passo de 16 linhas | Erick, 23/10/2026 |
