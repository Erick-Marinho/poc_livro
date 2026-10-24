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
- (5c2) Os passos do capítulo moram em `livros/<livro>/passos/<n>.json` (título, trecho do roteiro, fim do passo,
  "agora você tem"); o MDX só diz qual passo entra onde. O Passo e a trilha leem do mesmo arquivo.
- (5c2) A numeração passa a ser do capítulo inteiro ("passo 7 de 14 · seção 1.7"). Os trechos dos passos têm que
  emendar um no outro e cobrir o roteiro até o fim: se um pedaço do caminho sumir, o build falha.
- (5c2) O sinal de cada passo na trilha sai da saída gravada: ✗ quando o comando sai com erro ou mostra uma linha de
  erro; ! quando o passo tem `engano` (dá certo e esconde um erro); ✓ quando dá certo; • quando não roda nada.
- (5c2) "Ver o projeto inteiro até aqui" abre num diálogo os arquivos do fim daquele passo; ele só é montado no clique.
- (5c3) No caminho do erro, os trechos de fora do código do leitor (bibliotecas, o Python, o `-c` do comando) dobram
  num botão; ficam à vista a linha `Traceback`, os trechos do `contrato.py` e a mensagem. Nada some: o botão abre.
- (5c3) Linha em branco nova não acende no passo.
- (6a) O projeto nasce no livro: o roteiro começa numa pasta vazia, com `uv init` (rodado na pasta de cima),
  `uv add pydantic` e `uv add --dev pytest` de verdade. A seção 1.5 deixa de ter o bloco de comandos para ler.
- (6a) As versões ficam presas a uma data (`versoes_ate` no `comandos.json`, que vira `UV_EXCLUDE_NEWER`), também no
  `uv sync` do `projeto/`; o `uv.lock` do projeto guarda essa data. O livro avisa que na máquina do leitor elas podem ser
  mais novas, e como pegar as mesmas.
- (6a) Linhas do uv que dependem da máquina (o Python achado, o que já estava baixado) são gravadas como saíram, mas
  ficam fora da conferência. O tempo em milissegundos também.
- (6a) O que um comando cria ou muda (o `uv init`, o `uv add`) aparece depois da saída dele, como "o que o comando criou
  ou mudou"; o `uv.lock` aparece só pelo nome. Arquivo apagado (o `main.py` do exemplo) aparece riscado.
- (6a) Arquivos de configuração (`.gitignore`, `.python-version`, `.lock`) contam como dados: não entram no limite.
- (6b) O pensamento do autor fica no passo (`pensamento` no `passos/<n>.json`): **me pergunto**, **por que assim** e,
  se houver, **espero**. Só os autores listados no arquivo podem assinar; o build falha com outro nome.
- (6b) O **espero** não aparece antes da aposta do leitor: num passo com aposta, ele entra depois da saída, como
  "Erick tinha apostado: …", para o leitor comparar a aposta dele com a do autor.
- (6b) Passo sem pensamento mostra o marcador "pendente"; nenhum texto de exemplo vai para o livro.
- (7a) Mudança de rumo, a pedido do Erick: os passos espalhados no texto (`Passo`, `Trilha`) saem, e o capítulo é
  construído numa **IDE só**, da pasta vazia à nota zero. O explorador ganha os arquivos na ordem em que nascem, o
  terminal guarda tudo o que rodou, e o **passador** embaixo avança ação por ação: cada passo abre (o que vai existir
  no fim, e o que o autor pensa), segue nas ações e fecha ("agora você tem").
- (7a) O texto que ficava entre os passos vira `antes` e `depois` do passo, no `passos/01.json`, e aparece no passador.
  Ficam fora da IDE só as perguntas e a conclusão (seção 1.6, "O que ficou de pé").
- (7a) O que a IDE mostra é montado em `src/lib/ideCapitulo.ts`, puro, e o teste chama esse módulo direto.
- (7b) Os blocos lógicos moram no próprio roteiro (`blocos` na edição), com as linhas do arquivo final, como as partes;
  a IDE acha cada bloco no arquivo daquele momento pelo texto. Bloco que não está lá, ou palavra fora do glossário,
  não monta o livro. O `passadores/caso.json` e o `Passador.astro` saem: os blocos do `Caso` foram para o roteiro.
- (7b) No bloco, as linhas dele acendem e as outras apagam um pouco; as palavras dele ficam sublinhadas no código e
  como botões no passador, e as duas abrem a mesma explicação. Pergunta de bloco segura o "seguir" até a resposta
  (ou "só mostrar"), como a aposta.
- (7c) No celular, o explorador vira uma linha de arquivos que rola para o lado, no lugar das abas: os arquivos
  continuam nascendo à vista. O passador tem altura mínima, para o "seguir" não pular de lugar a cada quadro.
- (7c) Modo direto: um quadro por ação, sem os blocos; nada segura o "seguir" (as saídas aparecem sem aposta), e o
  leitor continua no mesmo passo ao ligar ou desligar. As setas do teclado avançam e voltam quando o foco está na IDE.
- (5c) A IDE completa só abre por clique ("ver o projeto inteiro até aqui"); nunca fica aberta no meio do texto.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `glossario.json` | as palavras difíceis, uma vez por livro | — | termos | nova |
| `passos/01.json` | os 18 passos do capítulo: trecho do roteiro, fim do passo, pensamento, texto antes e depois | — | passos | em uso |
| `lib/ideCapitulo.ts` | monta as ações, os passos e as versões dos arquivos, e barra o que não bate | roteiro + estados + saídas + passos | dados da IDE | nova (7a) |
| `IdeCapitulo` | a IDE do capítulo: progresso, explorador, editor, terminal com aposta, e o passador | dados da IDE | figura | nova (7a) |
| `blocos` no roteiro | os blocos lógicos de cada edição de código: título, texto, palavras, pergunta | — | blocos | novo (7b): 10 edições, 30 blocos |
| `Passo.astro`, `Trilha.astro`, `IDE.astro` | substituídos pela IDE do capítulo | — | — | apagados (7a) |

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

- **6a.** O projeto nasce no livro: `uv init`, `uv add`, a loja, nos passos 1 a 4 da seção 1.5.
- **6b.** A camada "o que eu penso" no passo, na voz dos autores, com o marcador de pendente em todos os passos.
- **6c.** A coleta com o Erick, passo a passo: três perguntas por passo, as palavras dele no passo.

- **7a.** A IDE do capítulo, da pasta vazia à nota zero, com o passador; os passos espalhados saem.
- **7b.** O código entra por blocos lógicos dentro do editor, com o balão de cada bloco e as palavras clicáveis.
- **7c.** O celular (o explorador vira uma linha de arquivos), o modo direto e o acabamento.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 5a | `43782da` | `npm test` (10 testes, 4 novos); passador no ngrok, no computador e no celular; perguntas conferidas no projeto real | Erick, 23/10/2026 |
| 5b1 | `11d272c` | contagem de linhas novas por passo (todas ≤ 13 no `contrato.py`); 2 saídas novas gravadas e conferidas | Erick, 23/10/2026 |
| 5b2 | `9a105c0` | `npm test` (14 testes, 4 novos); seis passos na 1.6 no ngrok, no computador e no celular; o build barrou um passo de 16 linhas | Erick, 23/10/2026 |
| 5c1 | `2e0e4b3` | `npm test` (17 testes, 3 novos); 1.7 e 1.8 em passos no ngrok; o placar se revela com a aposta | Erick, 23/10/2026 |
| 5c2 | `32cfca7` | `npm test` (19 testes, 2 novos); trilha e projeto inteiro no ngrok; o build barrou um buraco entre dois passos | Erick, 23/10/2026 |
| 5c3 | `f38d3f2` | `npm test` (21 testes, 2 novos); erro dobrado no ngrok, no celular; nenhuma linha em branco acesa | Erick, 23/10/2026 |
| 6a | `e3c87a3`, `f9930ee` | `npm test` (22 testes) no computador e na máquina do Erick; a 1.5 da pasta vazia ao `uv add` no ngrok | Erick, 23/10/2026 |
| 7a | `63e936f` | `npm test` (15 testes) no computador e na máquina do Erick; a IDE do capítulo no ngrok | Erick, 23/10/2026 |
| 7b | `d1514b1` | `npm test` (16 testes) no computador e na máquina do Erick; 30 blocos no ngrok; o build barrou bloco fora do arquivo e palavra fora do glossário | Erick, 24/10/2026 |
| 7c | `1a86408` | `npm test` (16 testes) no computador e na máquina do Erick; celular, modo direto e teclado conferidos no navegador | Erick, 24/10/2026 |

## Depois do fechamento

- (8a) **Sua vez**: quando a ação já foi toda mostrada (o último bloco, ou a saída depois da aposta), o passador para e
  diz o que fazer na IDE do leitor (digitar, rodar, copiar, apagar), e o botão vira "fiz na minha IDE". No modo direto,
  não para.
- (8b) **Ponto de volta**: `git checkout` numa tag por passo, num repositório do leitor gerado pelo roteiro. Só aparece
  na IDE quando o repositório existir de verdade: o livro não mostra comando que não funciona.
- (8b) O repositório do leitor mora em `Erick-Marinho/atendimento-bemtevi` (decisão do Erick, 24/10/2026). `npm run leitor`
  gera ele em `.leitor/atendimento-bemtevi`: o `.git` que o `uv init` criou, um commit e uma tag `cap-01/passo-NN` no fim de
  cada passo, datas fixas (sai igual toda vez). A IDE mostra o checkout quando o `passos/01.json` tiver `repositorio`.
- (8c) A IDE ganha a barra da direita e o rodapé, como o VS Code. Na barra, abas que simulam os chats de IA
  (Claude Code e Codex): o texto do passo, dos blocos, das palavras ("o que é…?") e das perguntas vira uma conversa,
  com as respostas do leitor como mensagens dele e o pensamento do autor como mensagem do autor. É simulação, e diz:
  "a conversa foi escrita pelos autores do livro, não por um modelo". O "seguir" mora no chat.
- (8c) O rodapé mostra o ramo do git (depois do `uv init`), os problemas do último comando e o Python do
  `.python-version`. A "sua vez" flutua sobre o editor; abaixo de 1000 px, o chat desce para baixo da IDE.

**Capacidade fechada em 24/10/2026.** Fica para depois: os pensamentos dos autores nos 18 passos (6c), e a barra flutuante do livro por cima do "seguir" no celular.
