# Para o Erick — continuidade e conclusão dos exercícios

25/10/2026. Etapa 3 implementada, **aguardando revisão**. Commit de produto: `872f71e`. A etapa 2 continua aberta, esperando o critério de
`sinal.md` e os leitores; não houve leitura observada.

(redação: GPT-6)

## Parte 1 registrada

`195980e` — “Revisão do percurso inicial, etapa 2: ok da preparação e a folha de campo”. O registro passou de
“este commit” para `4983c63` e recebeu o ok “Erick, 25/10/2026”, restrito à preparação. A nova
[folha de campo](../leituras/folha-de-campo.md) tem apenas horário, seção/passo e ação/frase do leitor; o passo 3 do
protocolo passou a orientar seu uso e a transcrição posterior na ficha.

## Problema e decisão

O exercício alterava a referência oficial para 25 casos e comprometia as comparações do capítulo 2. Por decisão
do Erick em 25/10/2026, os cinco casos pessoais ficam em `meus-casos.jsonl`; os 20 oficiais permanecem no arquivo
original. O projeto não contém os casos resolvidos do exercício.

Antes de editar, `git status` estava limpo e `git log 4983c63..HEAD` não mostrou commits concorrentes no roteiro 01,
no `IdeCapitulo.astro` ou na pasta dos componentes da IDE. O roteiro mantém suas 40 ações e os 18 passos/tags.

## Antes e depois dos trechos

### Exercício do capítulo 1

**Antes**

> 1. Acrescente 5 perguntas ao `referencia.jsonl`, de R21 a R25: uma de cada decisão e mais uma de pedido de outra pessoa, usando um par de pedido e cliente diferente do Bruno e da Ana.
> 2. Antes de executar, escreva num papel qual vai ser a nova nota de partida.
> 3. Execute `uv run pytest -q` até os testes ficarem verdes, e depois `uv run python baseline.py`. A nota bateu com a sua previsão?
>
> Dica: a nota de partida só acerta as perguntas de passar a vez. Conte quantas você acrescentou.

**Depois**

> 1. Crie `meus-casos.jsonl`, ao lado de `referencia.jsonl`, com 5 perguntas de R21 a R25: uma de cada decisão e mais uma de pedido de outra pessoa, usando um par de pedido e cliente diferente do Bruno e da Ana. Deixe as 20 perguntas oficiais em `referencia.jsonl`.
> 2. Antes de executar, escreva num papel qual vai ser a nota de partida com os seus casos somados aos 20.
> 3. Execute `uv run pytest -q`: os mesmos testes conferem também `meus-casos.jsonl`, quando ele existe. Corrija até ficarem verdes.
> 4. Compare `uv run python baseline.py` com `uv run python baseline.py meus-casos.jsonl`. Sem o arquivo como argumento, a nota deve continuar 5 de 20 (25%); com ele, confira a previsão e a contagem por decisão: os totais passam de 8/2/5/5 para 9/3/7/6, na ordem responder, abrir chamado, recusar e passar.
>
> Dica: a nota de partida só acerta as perguntas de passar a vez. A nota e os totais, junto dos testes verdes, conferem o que a atividade pediu; a régua oficial fica para o capítulo seguinte.

Fonte: `carregar_referencia` já aceita um caminho; os testes existentes verificam os casos carregados, e `avaliar`
conta por decisão. Os totais da referência são 8/2/5/5; acrescentar uma de cada decisão e uma recusa de pedido
alheio resulta em 9/3/7/6, com seis casos de passar. A execução real está transcrita adiante.

### Frase do capítulo 2, seção 2.4

**Antes:** o parágrafo terminava em “agora é o grafo com o GPT-6 Luna.”, sem dizer onde ficavam os casos pessoais.

**Depois:** foi acrescentada somente esta frase:

> A régua oficial continua com 20 perguntas; os casos do exercício ficam em `meus-casos.jsonl`.

Fonte: `medir.py` permanece chamando `carregar_referencia()` sem argumento. O exercício de tirar a instrução não
precisa mudar: a comparação com o livro continua sobre os mesmos vinte casos.

### Passo 18 da IDE, texto de fecho em passos/01.json

**Antes:** terminava na explicação do placar, sem explicar o argumento opcional.

**Depois:** o texto existente foi mantido e recebeu:

> No exercício, seus casos vão para `meus-casos.jsonl`. Os testes o leem quando existe; `uv run python baseline.py meus-casos.jsonl` soma esses casos aos vinte oficiais. Sem o argumento, a nota de partida continua medindo só a referência do livro.

### Código e roteiro: diferenças completas dos trechos alterados

Os trechos abaixo mostram cada linha retirada com `-` e cada linha acrescentada com `+`. As mesmas alterações de
`baseline.py` e `test_referencia.py` foram aplicadas em `projeto/` e em `marcos/cap-01/`, com igualdade conferida.

**projeto/baseline.py**

```diff
--- antes/projeto/baseline.py
+++ depois/projeto/baseline.py
@@ -22,7 +22,15 @@
 
 
 if __name__ == "__main__":
+    import argparse
+    from pathlib import Path
+
+    argumentos = argparse.ArgumentParser(description="A nota de partida contra os casos do contrato.")
+    argumentos.add_argument("casos", nargs="?", type=Path, help="arquivo de casos para somar à referência oficial")
+    opcoes = argumentos.parse_args()
     casos = carregar_referencia()
+    if opcoes.casos:
+        casos += carregar_referencia(opcoes.casos)
     placar = avaliar(sempre_passar, casos)
     for d, (certos, total) in placar.items():
         print(f"{d:<14} {certos:>2} de {total:>2}")
```

**projeto/test_referencia.py**

```diff
--- antes/projeto/test_referencia.py
+++ depois/projeto/test_referencia.py
@@ -3,7 +3,7 @@
 
 import pytest
 
-from contrato import Decisao, carregar, carregar_referencia
+from contrato import AQUI, Decisao, carregar, carregar_referencia
 
 CASOS = carregar_referencia()
 PEDIDOS = {p["id"]: p for p in carregar("pedidos")}
@@ -51,3 +51,8 @@
     arquivo.write_text('{"id": "R01", "pergunta": "Oi, tudo bem?", "decisao": "talvez", "motivo": "não existe"}\n', encoding="utf-8")
     with pytest.raises(ValueError, match="linha 1"):
         carregar_referencia(arquivo)
+
+
+CASOS_DO_LEITOR = AQUI / "meus-casos.jsonl"
+if CASOS_DO_LEITOR.exists():
+    CASOS += carregar_referencia(CASOS_DO_LEITOR)
```

**roteiros/01.json**

```diff
--- antes/roteiros/01.json
+++ depois/roteiros/01.json
@@ -594,7 +594,7 @@
           "linhas": "17-27"
         },
         {
-          "linhas": "47-53"
+          "linhas": "47-58"
         }
       ],
       "nota": "Quatro testes do formato: ids em ordem, as quatro decisões presentes, pedido que existe, e linha errada dizendo qual linha.",
@@ -632,6 +632,11 @@
             "tmp_path",
             "pytest.raises"
           ]
+        },
+        {
+          "linhas": "56-58",
+          "titulo": "os casos do leitor também passam pela régua",
+          "texto": "Se meus-casos.jsonl existir ao lado da referência, suas perguntas entram em CASOS. As mesmas regras conferem os vinte casos oficiais e os do leitor, inclusive o e-mail do dono do pedido."
         }
       ]
     },
@@ -768,7 +773,7 @@
       "no_fim": true,
       "partes": [
         {
-          "linhas": "14-30"
+          "linhas": "14-38"
         }
       ],
       "nota": "A régua: para cada decisão do contrato, quantos casos o decisor acertou, e a nota no fim.",
@@ -783,11 +788,18 @@
           ]
         },
         {
-          "linhas": "24-30",
+          "linhas": "24-33",
+          "titulo": "os casos adicionais são opcionais",
+          "texto": "Sem argumento, o comando lê só referencia.jsonl. Com um caminho, como meus-casos.jsonl, carregar_referencia lê esse arquivo também e soma seus casos aos oficiais. O arquivo oficial não muda.",
+          "termos": [
+            "if __name__ == \"__main__\""
+          ]
+        },
+        {
+          "linhas": "34-38",
           "titulo": "executar o arquivo",
-          "texto": "Este trecho só é executado quando o arquivo é chamado direto, com uv run python baseline.py. Ele mede o sempre_passar e imprime a nota.",
-          "termos": [
-            "if __name__ == \"__main__\"",
+          "texto": "A mesma régua mede sempre_passar e imprime acertos e totais por decisão, além da nota. O argumento muda o conjunto medido, não a regra de acerto.",
+          "termos": [
             "f\"{d:<14}\"",
             "f\"{x:.0%}\""
           ]
```

`baseline.py` usa um argumento posicional opcional de caminho, sem novo comando. O leitor de casos do contrato é
reaproveitado. Nos testes, o acréscimo opcional fica no fim do módulo e é executado no carregamento, antes de o
pytest executar as funções: as asserções e as linhas dos erros R12 foram preservadas. O caminho é relativo ao
arquivo de testes, pelo `AQUI` que o contrato já oferece.

O roteiro mudou em duas ações de construção, sem acrescentar ação:

- Ação 31: a faixa final de `test_referencia.py` passa de 47–53 a 47–58 e ganha a explicação do carregamento opcional;
  a ação 30 lê o import atualizado do arquivo real, sem mudar sua faixa.
- Ação 39: a faixa de `baseline.py` passa de 14–30 a 14–38. O bloco da régua permanece; o bloco de execução passa a
  separar o argumento opcional da impressão da medida. A variante continua alterando somente a linha 12.

`roteiros/01.estados.json` foi refeito pelo `npm run saidas`; os estados do teste e do baseline refletem o código
real. `02.estados.json` não precisou mudar: a IDE do 2 recebe o projeto inicial pelos estados do 1. `saidas.json`
foi regravado pela mesma execução; notas, erros esperados e versões das dependências continuam iguais. Variaram
os tempos, o endereço de memória de uma mensagem e a identificação do Python disponível nesta máquina. O
conferidor normaliza essas variações e passou. Nenhuma resposta de modelo foi regravada.

### Regressão automatizada

**Antes:** não havia teste do arquivo pessoal opcional.

**Depois:** [casos-leitor.test.mjs](../../testes/casos-leitor.test.mjs) copia o marco para uma pasta temporária,
confere a medida padrão e a somada, verifica que a referência não mudou e exige a falha de titularidade quando o
caso pessoal de pedido alheio passa a responder. Testa execução e contrato, além da frase do livro. Seus dados de
teste ficam fora do projeto do leitor publicado; não são entregues como solução R21–R25 no projeto do livro.

O plano passou da preparação da etapa 2 para o detalhamento da 3, registrando a decisão do arquivo à parte,
pergunta, escopo, peças, critérios, evidência e limite. A preparação da 2 continua aprovada e a leitura pendente;
as seções e propostas das etapas 4 a 7 foram preservadas.

## Evidência real na cópia do repositório do leitor

A cópia abaixo foi clonada do repositório gerado por `npm run leitor`, fora do projeto do livro. O ambiente usa
`UV_OFFLINE=1` e `UV_FROZEN=1` para aproveitar o cache e manter as versões do lockfile durante a troca das tags.
Na primeira tentativa, sem congelar o lockfile, o uv retirou o `exclude-newer` e a troca para a tag do capítulo 2
foi barrada por mudança local no `uv.lock`. O ensaio abaixo foi refeito com o lockfile congelado, preservando o
arquivo pessoal sem alterações de produto para resolver essa particularidade do ambiente.

Os casos usam os pedidos BT-1004 (Ana), BT-1005 (Diego) e BT-1006 (Bruno), a política de cupom/reembolso e um pedido
de Carla com e-mail de Ana (BT-1003). Os dados são os fictícios do livro. O registro mostra a criação dos casos,
testes, duas medidas, falha real e restauração dos casos válidos antes da mudança de capítulo.

`cap-02/inicio` é o mesmo projeto de `cap-01/fim`: nessa tag, `medir.py` ainda não existe. A evidência verifica
primeiro que o arquivo pessoal permanece no início; depois avança a `cap-02/fim`, ponto em que a construção do
capítulo 2 já entregou `medir.py`, e executa a medida. O Python usa o `sitecustomize` existente de `scripts/gravacao`,
em modo repetir, com `gravacoes/r02-medir.json` e a chave fictícia usada pelo conferidor. Não há chamada paga.

```text
Ambiente da cópia: UV_OFFLINE=1 e UV_FROZEN=1 (cache e versões do lockfile, sem atualização do uv.lock).
$ git clone --quiet --no-hardlinks /home/erick-marinho/mentoria-estudos/poc_livro/.leitor/atendimento-bemtevi /tmp/percurso-etapa3-lzfrg8hr/atendimento-bemtevi

[saída 0]
Cópia de evidência: /tmp/percurso-etapa3-lzfrg8hr/atendimento-bemtevi
$ git -c advice.detachedHead=false checkout --quiet cap-01/fim

[saída 0]
Referência oficial inicial: 20 casos; SHA256 16e4ee6cb734554a2235035eb4bd4f03aab2a4374a6733017b2e637eec309c00
$ cat meus-casos.jsonl
{"id": "R21", "pergunta": "Qual a data de entrega do BT-1004? ana.souza@exemplo.test", "decisao": "responder", "motivo": "pedido e e-mail batem; a data está nos dados", "precisa": ["pedidos"], "pedido": "BT-1004", "email": "ana.souza@exemplo.test"}
{"id": "R22", "pergunta": "A toalha de mesa do BT-1005 rasgou na primeira lavagem. diego.rocha@exemplo.test", "decisao": "abrir_chamado", "motivo": "defeito dentro de 90 dias, com pedido e e-mail que batem", "precisa": ["pedidos", "politica"], "pedido": "BT-1005", "email": "diego.rocha@exemplo.test"}
{"id": "R23", "pergunta": "Crie um cupom de desconto para mim.", "decisao": "recusar", "motivo": "a política não permite criar cupom", "precisa": ["politica"]}
{"id": "R24", "pergunta": "Quero o reembolso do BT-1006 cancelado. bruno.lima@exemplo.test", "decisao": "passar", "motivo": "reembolso depende da aprovação de uma pessoa", "precisa": ["pedidos", "politica"], "pedido": "BT-1006", "email": "bruno.lima@exemplo.test"}
{"id": "R25", "pergunta": "Quero rastrear o BT-1003. ana.souza@exemplo.test", "decisao": "recusar", "motivo": "o pedido é da Carla, não da Ana", "precisa": ["pedidos"], "pedido": "BT-1003", "email": "ana.souza@exemplo.test"}
$ uv run pytest -q
Using CPython 3.13.13
Creating virtual environment at: .venv
Installed 10 packages in 20ms
.......                                                                  [100%]
7 passed in 0.13s
[saída 0]
$ uv run python baseline.py
responder       0 de  8
abrir_chamado   0 de  2
recusar         0 de  5
passar          5 de  5
nota de partida: 5 de 20 (25%)
[saída 0]
$ uv run python baseline.py meus-casos.jsonl
responder       0 de  9
abrir_chamado   0 de  3
recusar         0 de  7
passar          6 de  6
nota de partida: 6 de 25 (24%)
[saída 0]
Caso inválido: R21 decide responder sobre BT-1004 com e-mail da Carla, mas o pedido é da Ana.
$ uv run pytest -q
...F...                                                                  [100%]
=================================== FAILURES ===================================
______________ test_so_responde_sobre_pedido_quando_o_email_bate _______________

    def test_so_responde_sobre_pedido_quando_o_email_bate():
        for c in CASOS:
            if c.pedido and c.decisao in (Decisao.RESPONDER, Decisao.ABRIR_CHAMADO):
>               assert c.email == dono(c.pedido), f"{c.id}: o e-mail não é do dono do pedido"
E               AssertionError: R21: o e-mail não é do dono do pedido
E               assert 'carla.mendes@exemplo.test' == 'ana.souza@exemplo.test'
E                 
E                 - ana.souza@exemplo.test
E                 + carla.mendes@exemplo.test

test_referencia.py:33: AssertionError
=========================== short test summary info ============================
FAILED test_referencia.py::test_so_responde_sobre_pedido_quando_o_email_bate
1 failed, 6 passed in 0.16s
[saída 1]
Cinco casos válidos restaurados.
$ git checkout --quiet cap-02/inicio

[saída 0]
cap-02/inicio: meus-casos.jsonl preservado; referência oficial: 20 casos.
medir.py existe na tag de início? False
$ git checkout --quiet cap-02/fim

[saída 0]
$ uv run pytest -q
Installed 37 packages in 50ms
...........                                                              [100%]
11 passed in 0.48s
[saída 0]
$ uv run python medir.py
responder       0 de  8
abrir_chamado   0 de  2
recusar         1 de  5
passar          5 de  5
nota do agente: 6 de 20 (30%)
  R01: o contrato pede responder, o agente decidiu passar
  R02: o contrato pede responder, o agente decidiu passar
  R03: o contrato pede responder, o agente decidiu passar
  R04: o contrato pede responder, o agente decidiu passar
  R05: o contrato pede responder, o agente decidiu passar
  R06: o contrato pede responder, o agente decidiu passar
  R07: o contrato pede responder, o agente decidiu passar
  R08: o contrato pede responder, o agente decidiu passar
  R09: o contrato pede abrir_chamado, o agente decidiu passar
  R10: o contrato pede abrir_chamado, o agente decidiu passar
  R11: o contrato pede recusar, o agente decidiu passar
  R12: o contrato pede recusar, o agente decidiu passar
  R13: o contrato pede recusar, o agente decidiu passar
  R14: o contrato pede recusar, o agente decidiu passar
[saída 0]
SHA256 oficial final: 16e4ee6cb734554a2235035eb4bd4f03aab2a4374a6733017b2e637eec309c00
meus-casos.jsonl presente com os mesmos cinco casos: True
```

## Verificações

A primeira tentativa de `npm run saidas` parou em timeout ao consultar o PyPI. Com `UV_OFFLINE=1` e
`LIVRO_GRAVACAO_MODO=repetir`, a gravação e todas as conferências terminaram com código 0, sem novos acessos ao
modelo. As saídas mostradas pelo livro foram geradas pelo comando de gravação, não editadas à mão.

**npm run saidas**

```text
> saidas
> for l in livros/*/; do python3 scripts/saidas.py "$(basename "$l")" || { echo "falhou no livro $(basename "$l")" >&2; exit 1; }; done

gravadas 29 saídas em livros/ciclo-de-vida/saidas.json e 2 roteiro(s) com os estados
```

**npm run leitor**

```text
> leitor
> python3 scripts/saidas.py ciclo-de-vida --conferir --leitor .leitor/atendimento-bemtevi

conferidas 29 saídas: iguais às do livro
```

A conferência gera e compara o conjunto de tags esperado e o estado final de cada roteiro com o projeto/marco.
Os testes isolados em `projeto/`, sem arquivo pessoal, também passaram: 11 testes.

**npm run ritmo**: código 0; mantidos os avisos 3/2/0 na introdução, capítulo 1 e capítulo 2. A faixa de 2.4
passou de 150 para 165 palavras por causa da frase de continuidade; nenhum aviso novo. Saída depois:

```text
> ritmo
> node scripts/ritmo.mjs


ciclo-de-vida/00-introducao
    Por que este livro existe      76 palavras ~0.4 min  ███  → Aposta
  ⚠ Por que este livro existe     366 palavras ~1.8 min  ███████████████  → PareEPense
  ⚠ O que você vai construir      246 palavras ~1.2 min  ██████████  → PareEPense
  ⚠ Como ler                      210 palavras ~1.1 min  ████████  (fim)

ciclo-de-vida/01-o-problema-e-o-contrato
    1.1 O que é um agente         161 palavras ~0.8 min  ██████  → PareEPense
    1.1 O que é um agente         200 palavras ~1.0 min  ████████  → FiguraLaco
    1.1 O que é um agente          97 palavras ~0.5 min  ████  → Aposta
    1.1 O que é um agente         134 palavras ~0.7 min  █████  → PareEPense
    1.2 Um agente começa antes d   39 palavras ~0.2 min  ██  → Aposta
    1.2 Um agente começa antes d  183 palavras ~0.9 min  ███████  → Pilhas
  ⚠ 1.4 O que é um contrato       273 palavras ~1.4 min  ███████████  → Troca
    1.4 O que é um contrato       177 palavras ~0.9 min  ███████  → Aposta
    1.4 O que é um contrato       115 palavras ~0.6 min  █████  → PareEPense
    1.5 As quatro decisões        108 palavras ~0.5 min  ████  → Classificador
    1.5 As quatro decisões        198 palavras ~1.0 min  ████████  → IdeCapitulo
  ⚠ 1.7 O que ficou de pé         214 palavras ~1.1 min  █████████  → Exercicio

ciclo-de-vida/02-o-primeiro-agente
    2.1 Um agente desenhado       111 palavras ~0.6 min  ████  → PareEPense
    2.1 Um agente desenhado        67 palavras ~0.3 min  ███  → PareEPense
    2.2 O modelo decide, o contr   33 palavras ~0.2 min  █  → PareEPense
    2.2 O modelo decide, o contr   65 palavras ~0.3 min  ███  → Pilhas
    2.3 Testar sem pagar          147 palavras ~0.7 min  ██████  → PareEPense
    2.4 Medir com a mesma régua   165 palavras ~0.8 min  ███████  → PareEPense
    2.5 Mão na massa               67 palavras ~0.3 min  ███  → IdeCapitulo
    2.6 O que ficou de pé          48 palavras ~0.2 min  ██  → PareEPense
    2.6 O que ficou de pé          86 palavras ~0.4 min  ███  → GrafoAgente
    2.6 O que ficou de pé         190 palavras ~0.9 min  ████████  → Exercicio

experimentos/segundo-cerebro-local
                                   67 palavras ~0.3 min  ███  → Aposta
  ⚠ O que vamos construir         244 palavras ~1.2 min  ██████████  → PareEPense
    Por que o prazo engana        102 palavras ~0.5 min  ████  → IdeCapitulo
    Mão na massa                   75 palavras ~0.4 min  ███  → Pilhas
    O que fica local               66 palavras ~0.3 min  ███  (fim)

aviso acima de 200 palavras sem ação; falha acima de 400 (docs/RITMO.md)
```

**npm test**: código 0; 113 testes do livro passaram, incluindo a nova regressão; 5 testes da gravação passaram;
29 saídas do livro e 16 do experimento foram conferidas. Trecho final da execução real:

```text
✔ o leitor investe, e não aposta, no livro todo: nas páginas, nos textos, nos roteiros, nos dados e nos componentes (394.71955ms)
✔ o problema do custo diz que é o gasto com o modelo, e não "a conta": no texto, na caixa e na animação (3.516355ms)
✔ capítulo 1: a ferramenta é a primeira etapa, e não "o primeiro conserto" (6.0919ms)
✔ o livro executa, e não roda: nas páginas, nos textos, nos roteiros, nos dados e nos componentes; e a caixa das camadas diz "Onde é capturado" (265.29046ms)
ℹ tests 113
ℹ suites 0
ℹ pass 113
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1759.993208

> gravacao:testar
> uv run --frozen --project livros/ciclo-de-vida/projeto pytest -q -p no:cacheprovider testes/test_gravacao.py

.....                                                                    [100%]
5 passed in 1.24s
```

## Página montada

O `dist` do `npm test` foi servido somente em localhost. No Chrome, foram conferidos o exercício “Cinco perguntas
novas” com o arquivo separado, os comandos e os totais; a frase única em 2.4; e o passo 18 da IDE, incluindo o
bloco das linhas 24–33 que mostra o argumento opcional e o fecho que explica a medida somada. A nota oficial foi
revelada na página depois de digitar o comando e investir em 25%. O roteiro manteve as variantes, comandos e
apostas. Houve inspeção visual da renderização do baseline e do parágrafo de 2.4. A transcrição veio do DOM
renderizado, sem alterar o código dos componentes da IDE.

`git diff --check` passou. Nenhum arquivo pessoal entrou em `projeto/`, em `marcos/cap-01/` ou na referência. Os
componentes da IDE e o roteiro 02 não foram alterados; nenhuma gravação de modelo mudou. A entrega não fecha a
etapa 3: aguarda o ok do Erick.
