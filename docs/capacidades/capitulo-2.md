# Capítulo 2: o primeiro agente

O agente com modelo, num grafo do LangGraph, medido pela régua do capítulo 1. Sem ferramentas: ele decide sem
consultar o pedido, e o erro dele nos casos de pedido é o gancho do capítulo 3.

## Etapas

- **0a.** O formato do capítulo: `docs/FORMATO.md`, o teste da estrutura e a numeração das partes da IDE.
- **0b.** O marco do capítulo 1: `marcos/cap-01/` e o gravador encadeando os roteiros.
- **1.** O grafo com um modelo falso, sem chamada paga.
- **2.** A gravação: o build repete o que o modelo respondeu, e falha se pedir uma chamada não gravada.
- **3.** A primeira rodada paga: as 20 perguntas com Claude, gravadas (ok e chave do Erick).
- **4.** O roteiro do capítulo na IDE: passos, blocos, apostas e pedidos.
- **5.** O texto do capítulo 2, com `Pendente` na voz dos autores.
- **6.** O placar ganha o marco do capítulo 2, e o repositório do leitor ganha as tags `cap-02`.

## Decisões

- (0) O que o modelo respondeu é gravado uma vez e repetido no build; o terminal diz quando e com que modelo.
- (0) O agente do capítulo 2 não tem ferramentas.
- (0) Cada capítulo fecha numa pasta congelada (`marcos/cap-NN/`); o `projeto/` é sempre o capítulo mais novo.
- (0a) As partes da IDE são subpartes da mão na massa (1.5a, 1.5b…): o texto e a IDE não repetem número.
- (0b) O repositório do leitor tem `cap-NN/fim` e, do 2 em diante, `cap-NN/inicio` (o mesmo commit do fim anterior).
  O capítulo 1 começa numa pasta vazia: o livro não mostra `git checkout` para ele.
- (0b) O capítulo seguinte herda o `.venv` do anterior, recriado em silêncio: o leitor não vê o uv criar de novo.
- (1) O `langchain-anthropic` entra na etapa 3, quando o modelo de verdade é usado: o leitor não instala antes.
- (1) O roteiro 02 nasce com o primeiro código e cresce a cada etapa; capítulo sem `passos/02.json` não ganha tags.
- (1) Onde o modelo não precisa escrever, ele não escreve: passar a vez e abrir chamado têm texto fixo.
- (2) A gravação é o cache de modelos da LangChain trocado por um arquivo: o código do leitor não muda.
- (2) Todo comando do livro roda com a gravação ligada: o build nunca chama um modelo de verdade.

## Etapa atual: 2

Arquivos: `scripts/gravacao/` (o cache que lê e grava um arquivo, e o `sitecustomize.py` que o liga), o gravador
(todo comando roda com a gravação ligada) e `testes/test_gravacao.py`. Modos: `repetir` (o padrão, no build: chamada
que não está gravada para o comando) e `gravar` (chama o modelo no que falta, e só roda com o ok e a chave do Erick).
Modelos falsos (os dos testes) passam direto. Evidência: os testes da gravação com um modelo de mentira (grava,
repete sem chamar, recusa a chamada não gravada) e a conferência do livro verde. Fica fora: a rodada paga.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 0a | `1a38db6` | o teste do formato falha no capítulo 1 (partes repetiam 1.6) e passa depois | 24/10 |
| 0b | `0a6551c` | o gravador recusa arquivo sem roteiro; roteiro 02 de teste parte do fim do 01 | 24/10 |
| 1 | `081b73d` | testes do grafo sem internet e sem chave; sem o caminho `passar`, o teste falha | 24/10 |
