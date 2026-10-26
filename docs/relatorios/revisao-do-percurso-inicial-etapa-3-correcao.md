# Para o Erick — correção da etapa 3

25/10/2026. Revisão sem ok; etapa 3 **aguardando revisão**. Base da correção: `21b0c13`.

(redação: GPT-6)

O antes e o depois abaixo cobrem somente os trechos desta correção. O arquivo de testes de casos do leitor
continua idêntico ao da base; as demais etapas e os componentes da IDE não mudaram.

## Exercício do capítulo 1, passo 4

**Antes**

> 4. Compare `uv run python baseline.py` com `uv run python baseline.py meus-casos.jsonl`. Sem o arquivo como argumento, a nota deve continuar 5 de 20 (25%); com ele, confira a previsão e a contagem por decisão: os totais passam de 8/2/5/5 para 9/3/7/6, na ordem responder, abrir chamado, recusar e passar.

**Depois**

> 4. Compare `uv run python baseline.py` com `uv run python baseline.py meus-casos.jsonl`. Os totais de cada decisão subiram o que você acrescentou? A nota bateu com a previsão?

A pergunta sobre os totais substitui os números prontos. O leitor continua comparando as duas execuções e sua
previsão, conforme os passos anteriores; a resposta da previsão deixa de ser entregue pelo enunciado.

## Capítulo 2, seção 2.4

**Antes**

> …agora é o grafo com o GPT-6 Luna. A régua oficial continua com 20 perguntas; os casos do exercício ficam em `meus-casos.jsonl`.

**Depois**

> …agora é o grafo com o GPT-6 Luna. Os casos do seu exercício ficam no `meus-casos.jsonl`, fora dela.

## Código — projeto e marco do capítulo 1

As diferenças abaixo valem igualmente em `projeto/` e `marcos/cap-01/`. O import e as asserções dos testes
continuam os mesmos; só a posição da carga opcional mudou. No baseline, os imports ficam no topo e cada caminho
em `sys.argv[1:]` é lido pelo `carregar_referencia` existente e somado aos casos oficiais.

**baseline.py**

```diff
--- antes/baseline.py
+++ depois/baseline.py
@@ -3,7 +3,9 @@
 Ele nunca erra feio (não inventa prazo, não mostra pedido alheio), mas também não ajuda ninguém.
 Todo agente que vier depois tem que bater esta nota.
 """
+import sys
 from collections import Counter
+from pathlib import Path
 
 from contrato import Caso, Decisao, carregar_referencia
 
@@ -22,15 +24,9 @@
 
 
 if __name__ == "__main__":
-    import argparse
-    from pathlib import Path
-
-    argumentos = argparse.ArgumentParser(description="A nota de partida contra os casos do contrato.")
-    argumentos.add_argument("casos", nargs="?", type=Path, help="arquivo de casos para somar à referência oficial")
-    opcoes = argumentos.parse_args()
     casos = carregar_referencia()
-    if opcoes.casos:
-        casos += carregar_referencia(opcoes.casos)
+    for caminho in sys.argv[1:]:
+        casos += carregar_referencia(Path(caminho))
     placar = avaliar(sempre_passar, casos)
     for d, (certos, total) in placar.items():
         print(f"{d:<14} {certos:>2} de {total:>2}")
```

**test_referencia.py**

```diff
--- antes/test_referencia.py
+++ depois/test_referencia.py
@@ -6,6 +6,9 @@
 from contrato import AQUI, Decisao, carregar, carregar_referencia
 
 CASOS = carregar_referencia()
+CASOS_DO_LEITOR = AQUI / "meus-casos.jsonl"
+if CASOS_DO_LEITOR.exists():
+    CASOS += carregar_referencia(CASOS_DO_LEITOR)
 PEDIDOS = {p["id"]: p for p in carregar("pedidos")}
 EMAIL = {c["id"]: c["email"] for c in carregar("clientes")}
 HOJE = date.fromisoformat(carregar("loja")["hoje"])
@@ -51,8 +54,3 @@
     arquivo.write_text('{"id": "R01", "pergunta": "Oi, tudo bem?", "decisao": "talvez", "motivo": "não existe"}\n', encoding="utf-8")
     with pytest.raises(ValueError, match="linha 1"):
         carregar_referencia(arquivo)
-
-
-CASOS_DO_LEITOR = AQUI / "meus-casos.jsonl"
-if CASOS_DO_LEITOR.exists():
-    CASOS += carregar_referencia(CASOS_DO_LEITOR)
```

## Explicações da IDE e roteiro 01

**Antes — bloco do baseline**

> Sem argumento, o comando lê só referencia.jsonl. Com um caminho, como meus-casos.jsonl, carregar_referencia lê esse arquivo também e soma seus casos aos oficiais. O arquivo oficial não muda.

**Depois — bloco do baseline**

> O if __name__ == "__main__" só executa este trecho quando o arquivo é chamado direto, com uv run python baseline.py; importar avaliar não executa a medida. sys.argv[1:] contém os caminhos depois do nome do arquivo: cada arquivo passado soma seus casos à referência. Sem caminhos, fica só a referência oficial.

**Antes — bloco de leitura dos testes**

> Tudo o que os testes consultam é lido aqui, uma vez, quando o pytest abre o arquivo: as vinte perguntas, os pedidos por número, o e-mail de cada cliente e o "hoje" da loja.

A carga pessoal tinha outro bloco, ao fim da edição seguinte:

> Se meus-casos.jsonl existir ao lado da referência, suas perguntas entram em CASOS. As mesmas regras conferem os vinte casos oficiais e os do leitor, inclusive o e-mail do dono do pedido.

**Depois — junto da carga da referência**

> Os casos, os pedidos por número, o e-mail de cada cliente e o "hoje" da loja são lidos uma vez, quando o pytest abre o arquivo. Logo depois dos casos oficiais, entram os de meus-casos.jsonl, se o arquivo existir; todos passam pelas mesmas regras.

O bloco separado no fim foi removido. As faixas das ações 30, 31 e 33 de `test_referencia.py` foram ajustadas ao
novo lugar da carga; as das ações 37 e 39 de `baseline.py` acompanham os imports no topo e o arquivo menor.
Permanecem as 40 ações e os 18 passos; nenhum comando, aposta ou variante foi retirado.

**Antes — fecho do passo 18, passos/01.json**

> No exercício, seus casos vão para `meus-casos.jsonl`. Os testes o leem quando existe; `uv run python baseline.py meus-casos.jsonl` soma esses casos aos vinte oficiais. Sem o argumento, a nota de partida continua medindo só a referência do livro.

**Depois — fecho do passo 18**

> No exercício, seus casos vão para `meus-casos.jsonl`. Os testes o leem quando existe; `uv run python baseline.py meus-casos.jsonl` soma esses casos aos vinte oficiais. O comando aceita mais de um arquivo; sem caminhos, mede só a referência do livro.

No plano, “um argumento opcional de caminho” foi alinhado para “caminhos opcionais”; os demais critérios da etapa
foram preservados. As faixas do roteiro e os estados foram atualizados pelo projeto real. Os estados e saídas foram
regravados por `npm run saidas`; a mensagem de titularidade agora aponta a linha 36 e a do caso necessário a 41.
A variante do baseline agora altera a linha 14. Por isso `ide-capitulo.test.mjs` recebeu somente essas três
atualizações de coordenadas, mantendo as mesmas asserções de saída, quantidade de linhas alteradas e mensagens.

## Verificação

As execuções abaixo usaram `UV_OFFLINE=1` e `LIVRO_GRAVACAO_MODO=repetir`: dependências em cache e respostas
existentes, sem chamada paga.

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

**npm run ritmo** terminou com código 0: avisos 3/2/0, como antes. A faixa de 2.4 passou de 165 para 161 palavras;
nenhum aviso novo. As contagens dos demais trechos do relógio não mudaram.

**npm test** terminou com código 0: 113 testes do livro, incluindo `casos-leitor.test.mjs` sem alteração, e 5 testes
da gravação passaram; 29 saídas do livro e 16 do experimento foram conferidas. Trecho da execução real:

```text
✔ o leitor investe, e não aposta, no livro todo: nas páginas, nos textos, nos roteiros, nos dados e nos componentes (381.486127ms)
✔ o problema do custo diz que é o gasto com o modelo, e não "a conta": no texto, na caixa e na animação (3.929235ms)
✔ capítulo 1: a ferramenta é a primeira etapa, e não "o primeiro conserto" (9.294421ms)
✔ o livro executa, e não roda: nas páginas, nos textos, nos roteiros, nos dados e nos componentes; e a caixa das camadas diz "Onde é capturado" (404.642729ms)
ℹ tests 113
ℹ suites 0
ℹ pass 113
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1889.611174

> gravacao:testar
> uv run --frozen --project livros/ciclo-de-vida/projeto pytest -q -p no:cacheprovider testes/test_gravacao.py

.....                                                                    [100%]
5 passed in 1.45s
```

Também foi executada a soma de dois arquivos temporários, contendo uma pergunta de responder e uma de passar
reutilizadas da referência. Os arquivos ficaram fora do projeto. Saída real:

```text
$ uv run --frozen python baseline.py /tmp/percurso-correcao-argv-4mck5wrn/um.jsonl /tmp/percurso-correcao-argv-4mck5wrn/dois.jsonl
responder       0 de  9
abrir_chamado   0 de  2
recusar         0 de  5
passar          6 de  6
nota de partida: 6 de 22 (27%)
```

No site montado, servido somente em localhost, foram conferidos no Chrome o passo 4 do exercício sem os totais,
o parágrafo de 2.4 e o bloco de `baseline.py` que explica o `if` e `sys.argv[1:]` dentro da IDE. A explicação foi
lida após navegar até o passo 18. `git diff --check` passou; projeto e marco coincidem; nenhum caso pessoal,
componente da IDE, referência oficial ou gravação de modelo foi alterado por esta correção.
