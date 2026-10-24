# Capítulo 2: o primeiro agente

O agente com modelo, num grafo do LangGraph, medido pela régua do capítulo 1. Sem ferramentas: ele decide sem
consultar o pedido, e o erro dele nos casos de pedido é o gancho do capítulo 3.

## Etapas

- **0a.** O formato do capítulo: `docs/FORMATO.md`, o teste da estrutura e a numeração das partes da IDE.
- **0b.** O marco do capítulo 1: `marcos/cap-01/` e o gravador encadeando os roteiros.
- **1.** O grafo com um modelo falso, sem chamada paga.
- **2.** A gravação: o build repete o que o modelo respondeu, e falha se pedir uma chamada não gravada.
- **3.** A primeira rodada paga: as 20 perguntas com o GPT-6 Luna, gravadas (ok e chave do Erick).
- **4a.** A IDE do capítulo 2 abre com o projeto do fim do 1, e diz quando a resposta do modelo foi gravada.
- **4b.** O roteiro 02 completo: passos, blocos, apostas, um erro do caminho e os pedidos (rascunho).
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
- (1) A ponte com o modelo (`langchain-openai`) entra na etapa 3, quando ele é usado: o leitor não instala antes.
- (3) O modelo do livro é o GPT-6 Luna, da OpenAI (decisão do Erick, 24/10/2026); o prefácio diz isso.
- (3) Repetindo a gravação, o comando recebe uma chave de mentira: o cliente da OpenAI exige uma ao ser criado.
- (4b) O erro do caminho do capítulo 2 é o modelo falso da LangChain sem o `bind_tools`: real, e documentado por ela.
- (4b) Texto que cita um número gravado (a nota) tem teste: se a gravação mudar, o build avisa.
- (1) O roteiro 02 nasce com o primeiro código e cresce a cada etapa; capítulo sem `passos/02.json` não ganha tags.
- (1) Onde o modelo não precisa escrever, ele não escreve: passar a vez e abrir chamado têm texto fixo.
- (2) A gravação é o cache de modelos da LangChain trocado por um arquivo: o código do leitor não muda.
- (2) Todo comando do livro roda com a gravação ligada: o build nunca chama um modelo de verdade.

## Etapa atual: 4b

Arquivos: `roteiros/02.json` (16 ações, na ordem em que se pensa), `passos/02.json` (10 passos, pedidos em rascunho,
`abre_com`), o glossário (24 palavras novas), a IDE (abre no `contrato.py`; o "sua vez" do comando pago avisa da chave
e do custo) e os testes. Evidência: o erro de verdade no passo 6 (`NotImplementedError` do modelo falso, com aposta),
a nota com aposta no passo 10, e um teste que falha se o texto disser uma nota diferente da gravada.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 0a | `1a38db6` | o teste do formato falha no capítulo 1 (partes repetiam 1.6) e passa depois | 24/10 |
| 0b | `0a6551c` | o gravador recusa arquivo sem roteiro; roteiro 02 de teste parte do fim do 01 | 24/10 |
| 1 | `081b73d` | testes do grafo sem internet e sem chave; sem o caminho `passar`, o teste falha | 24/10 |
| 2 | `d81c6bc` | a conferência para na chamada não gravada, sem chegar à rede; 5 testes da gravação | 24/10 |
| 3 | `8a13c1a` | 21 chamadas ao GPT-6 Luna gravadas; nota 30% (passa 19 de 20); repetida sem chave, igual | 24/10 |
| 4a | `59d2c4b` | o capítulo 2 abre com os 14 arquivos do fim do 1; o terminal diz de quando é a resposta gravada | 24/10 |
