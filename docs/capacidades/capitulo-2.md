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

## Etapa atual: 0a

Arquivos: `docs/FORMATO.md`, `testes/formato.test.mjs`, `passos/01.json` e o capítulo 1 (as partes 1.5a a 1.5d),
o cabeçalho do chat ("parte 1.5c"). Evidência: o teste falha no capítulo 1 como estava (as partes repetiam 1.6) e
passa depois da troca. Fica fora: o marco e qualquer código do capítulo 2.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
