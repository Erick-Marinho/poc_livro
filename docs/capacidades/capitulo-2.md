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

## Etapa atual: 0b

Arquivos: `marcos/cap-01/` (a cópia do `projeto/`), `scripts/saidas.py`, o capítulo 1 e os testes que leem o projeto.
O que muda: o roteiro NN confere contra `marcos/cap-NN/` (ou contra o `projeto/`, enquanto o capítulo não fechou);
o roteiro seguinte parte do fim do anterior; no fim, o `projeto/` tem que ser igual ao fim do último roteiro. O
repositório do leitor ganha `cap-NN/fim` e, a partir do 2, `cap-NN/inicio`. Evidência: a conferência verde; o
gravador recusando um arquivo no `projeto/` que nenhum roteiro construiu; um roteiro 02 de teste, numa cópia, que
parte do fim do 01 e gera `cap-02/inicio`. Fica fora: qualquer código do capítulo 2.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 0a | `1a38db6` | o teste do formato falha no capítulo 1 (partes repetiam 1.6) e passa depois | 24/10 |
