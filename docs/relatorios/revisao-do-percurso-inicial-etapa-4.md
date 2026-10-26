# Para o Erick — preparação, recuperação e percurso sem chave

25/10/2026. Etapa 4 implementada, **aguardando revisão**. Produto no commit “Revisão do percurso inicial, etapa
4: recuperação e exercício sem chave”; o hash consta na entrega. A etapa 2 continua aberta, esperando o critério
de `sinal.md` e os leitores; não houve leitura observada.

(redação: GPT-6)

## Parte 1 registrada

`0b19927` — “Revisão do percurso inicial, etapa 3: ok do Erick”. As duas linhas da etapa 3 no registro receberam
“Erick, 25/10/2026”. Nenhum arquivo de produto entrou nesse commit.

## Decisões e limite

O repositório do leitor continua somente local. Nenhum repositório, site, túnel ou endereço foi publicado; o
endereço de clone ficou em `Pendente`. A única chamada paga autorizada foi usada para medir a variante sem a frase
“Quando a política não diz, não prometa: passe a vez.” nas vinte perguntas oficiais. As demais montagens e
verificações repetiram gravações existentes.

Antes das mudanças, `git status` estava limpo. `git log 5cb28ef..HEAD` não mostrou commits da outra sessão em
`roteiros/` nem nos componentes da IDE. A conferência foi repetida antes do único ajuste em `IdeCapitulo.tsx`.

## Antes e depois dos trechos

### Introdução, “Como ler”

**Antes:** o texto mandava ler em ordem e começar com a IDE aberta, dizia que `git checkout` trazia o projeto
“exatamente como ele está” e prometia “testes que dizem quando você terminou” em todo exercício. Não dizia de onde
vinha o clone nem onde ligar o modo direto.

**Depois:** o texto distingue os dois pontos de partida: pasta vazia no capítulo 1 e clone do repositório do leitor
para usar tags. Mostra o comando com `ENDERECO`, seguido de `cd`, e deixa explícito que o endereço ainda não foi
publicado:

> Endereço do repositório do leitor: quando os autores publicarem

Também aponta a chave **Modo direto** no painel aberto pela engrenagem e passa a descrever os exercícios pelo que
eles realmente conferem: testes, notas e totais no capítulo 1; comparação e justificativa no 2.

O ponto de volta agora diz que o checkout troca arquivos versionados. Arquivos pessoais não rastreados permanecem;
se a troca fosse sobrescrever uma alteração local ou um arquivo novo, o Git a barra. A frase “exatamente como ele
está” saiu.

Fontes: `scripts/saidas.py` cria os commits e tags do leitor; `src/lib/ideCapitulo.ts` só monta o link de volta
quando há `repositorio`; o ensaio no clone local, transcrito abaixo, confirma o alcance do checkout. O painel e sua
chave foram conferidos na página montada.

### Pontos de partida dos capítulos

**Antes**

> Ponto de partida: uma pasta vazia.

> Ponto de partida: o projeto como o capítulo 1 terminou.

**Depois**

> Ponto de partida: uma pasta vazia; o projeto nasce na seção 1.6. As tags de recuperação pertencem ao repositório do leitor, cujo endereço está pendente na introdução.

> Ponto de partida: o projeto como o capítulo 1 terminou. Para recuperá-lo por cap-02/inicio, use um clone do repositório do leitor; o endereço está pendente na introdução.

Fonte: `passos/01.json`, `passos/02.json` e o repositório gerado por `npm run leitor`. Os prefixos de tag foram
preservados; só o endereço público anterior saiu dos dois arquivos enquanto a publicação estiver pendente.

### Componente do ponto de volta

**Antes**

> Ponto de volta: `git checkout {tag}` traz o projeto exatamente como está agora.

**Depois**

> Ponto de volta, no clone: `git checkout {tag}` recupera os arquivos versionados deste ponto.

Fonte: comportamento do Git observado no clone local. O componente existente foi mantido; não nasceu uma peça
nova.

### Exercício do capítulo 2

**Antes:** o leitor apagava a regra, previa a nota, executava os testes e `medir.py` com sua chave, comparava com o
livro e restaurava a linha. Sem chave, não concluía a atividade; “testes verdes” podiam ser lidos como prova de
qualidade da decisão.

**Depois:** a previsão continua obrigatória. O leitor pode escolher:

- sem chave, voltar ao passo 10, selecionar **sem a regra**, revelar a gravação, comparar nota e R12 e retornar a
  **o do livro**;
- com chave, fazer a mesma alteração e executar na própria máquina, sabendo que essa alternativa é paga e pode
  produzir outra nota.

O critério de conclusão agora exige confrontar a previsão, explicar os casos comparados e restaurar a regra. O
texto separa as provas: testes verdes conferem o desenho do grafo; a régua conta decisões, não a qualidade da
resposta ao cliente.

Fontes: `projeto/test_agente.py` testa os caminhos com modelo falso; `projeto/medir.py` mede decisões;
`gravacoes/r02-medir.json` é a execução original; `gravacoes/r02-medir-sem-regra.json` é a variante autorizada.

### Passo 10, roteiro e IDE

**Antes:** o passo terminava no resultado original de 6/20; não havia variação. A proveniência aparecia como
“resposta do modelo”, mesmo quando uma variante era mostrada junto.

**Depois:** o texto de fecho explica a investigação sem chave. `variar` troca somente o fim da `INSTRUCAO` por
`\"\"\"  # sem a regra`, pede a previsão **Sobe / Desce / Fica igual**, revela a saída gravada e conserva **o do
livro** para restaurar a fonte. O rótulo da gravação principal passa a dizer “execução original com o” quando a
ação tem variantes, distinguindo-a da nota da variante, datada na própria explicação.

`roteiros/02.estados.json` guarda a linha alterada e termina novamente com a regra original. `saidas.json` ganhou
apenas a saída `r02-medir-sem-regra`. O projeto oficial, `referencia.jsonl`, a gravação original e as etapas 5 a 7
não mudaram.

Fontes: o mecanismo `variar` de `scripts/saidas.py`, os dois arquivos de gravação e o teste novo
`testes/percurso-sem-chave.test.mjs`. `testes/ide-capitulo.test.mjs` conserva a prova de que o ponto de volta e sua
tag reaparecem assim que um endereço de repositório é fornecido; com o endereço pendente, a página não anuncia um
clone público.

## A única gravação paga

A execução foi feita numa cópia temporária do projeto, com a regra retirada e os vinte casos oficiais. A gravação
original permaneceu com 21 chamadas; a nova tem 22: vinte escolhas estruturadas e duas escritas pedidas pelos
caminhos escolhidos. Nenhuma credencial foi escrita em arquivo.

```text
$ uv run python medir.py (cópia sem a regra; modo gravar; 20 casos)
responder       1 de  8
abrir_chamado   1 de  2
recusar         1 de  5
passar          5 de  5
nota do agente: 8 de 20 (40%)
  R01: o contrato pede responder, o agente decidiu passar
  R02: o contrato pede responder, o agente decidiu passar
  R03: o contrato pede responder, o agente decidiu passar
  R05: o contrato pede responder, o agente decidiu passar
  R06: o contrato pede responder, o agente decidiu passar
  R07: o contrato pede responder, o agente decidiu passar
  R08: o contrato pede responder, o agente decidiu passar
  R10: o contrato pede abrir_chamado, o agente decidiu passar
  R11: o contrato pede recusar, o agente decidiu passar
  R12: o contrato pede recusar, o agente decidiu passar
  R13: o contrato pede recusar, o agente decidiu passar
  R14: o contrato pede recusar, o agente decidiu passar
```

A execução original permanece em 6/20 (30%). Na variante, somente R04 e R09 mudaram: de `passar` para as decisões
corretas `responder` e `abrir_chamado`. R12 continuou em `passar`. Isso é o resultado desta gravação, não promessa
sobre uma execução futura.

O teste da gravação exige exatamente as vinte perguntas de `referencia.jsonl`, a mesma instrução original menos a
frase autorizada e a regra intacta em `projeto/agente.py`. O segundo teste deriva a direção da nota dos dados, em
vez de repetir “sobe” como frase editorial.

## Recuperação no clone real

A cópia foi clonada do repositório local gerado em `.leitor/atendimento-bemtevi`, sem remoto público. Em
`cap-01/fim`, foi criado um `meus-casos.jsonl` não rastreado. A troca para `cap-02/inicio` o preservou. Depois:

```text
$ git checkout --quiet cap-02/fim
error: Your local changes to the following files would be overwritten by checkout:
        pyproject.toml
Please commit your changes or stash them before you switch branches.
Aborting
[saída 1]

$ git checkout --quiet cap-02/fim
error: The following untracked working tree files would be overwritten by checkout:
        agente.py
Please move or remove them before you switch branches.
Aborting
[saída 1]
```

Depois de restaurar somente `pyproject.toml` e remover somente o arquivo de colisão criado pelo ensaio, o checkout
passou. O arquivo versionado coincidiu com a tag; `meus-casos.jsonl` conservou o mesmo SHA-256 nas duas trocas.
Nenhum comando de força, limpeza ou publicação foi executado.

## Verificações

`npm run saidas`, sem chave e em modo repetir:

```text
gravadas 30 saídas em livros/ciclo-de-vida/saidas.json e 2 roteiro(s) com os estados
```

`npm run leitor`, também repetindo gravações:

```text
conferidas 30 saídas: iguais às do livro
```

`npm run ritmo` manteve a quantidade de avisos: 3 na introdução, 2 no capítulo 1 e 0 no capítulo 2. O trecho “Como
ler” passou de 210 para 285 palavras e continuou abaixo do limite de falha de 400.

`npm test`:

```text
conferidas 30 saídas: iguais às do livro
conferidas 16 saídas: iguais às do livro
tests 115
pass 115
fail 0

.....                                                                    [100%]
5 passed in 2.60s
```

Na página montada foram conferidos o `Pendente`, a ausência de link público, o texto de preparação, o exercício,
a chave **Modo direto** e o passo 10. A interação real mostrou primeiro 6/20; em **sem a regra**, exigiu a previsão
e revelou 8/20 com R12 ainda em `passar`; **o do livro** restaurou a regra. Após a montagem final, o selo apareceu
como “execução original com o gpt-6-luna gravada em 24/10/2026”, separando a origem das duas medidas.

Estado: **aguardando revisão do Erick**.
