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
- **5a.** O texto do capítulo 2 no formato, com `Pendente` na voz dos autores e no lugar da figura 2.1.
- **5b.** A figura 2.1: o grafo do agente, com o caminho que cada pergunta gravada percorreu.
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
- (5a) O texto diz que o agente do capítulo 2 ainda não é um agente inteiro: sem ferramenta e sem ciclo.
- (5a) Frase do modelo citada no texto é a gravada, palavra por palavra, e um teste confere.
- (5b) A figura do grafo não é desenhada à mão: as setas são gravadas do grafo real; grafo com ciclo para a figura.
- (5b) O resultado (os caminhos) só aparece na 2.6, depois da aposta; na 2.1, só o desenho.
- (1) O roteiro 02 nasce com o primeiro código e cresce a cada etapa; capítulo sem `passos/02.json` não ganha tags.
- (1) Onde o modelo não precisa escrever, ele não escreve: passar a vez e abrir chamado têm texto fixo.
- (2) A gravação é o cache de modelos da LangChain trocado por um arquivo: o código do leitor não muda.
- (2) Todo comando do livro roda com a gravação ligada: o build nunca chama um modelo de verdade.

## Etapa atual: 5b

Arquivos: `components/livro/GrafoAgente.astro` e `lib/grafoAgente.ts` (a figura), `figuras/grafo-02.json` (o que
cada nó faz), o comando `grafo-02` (as setas do grafo real, gravadas) e o capítulo 2. Dois modos: o desenho na 2.1
(clicar num nó) e os caminhos na 2.6 (clicar numa pergunta), para a figura não estragar a aposta do passo 10.
Evidência: as setas e os nós batem com o grafo real; os caminhos somam 6 de 20; fotos no computador e no celular.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 0a | `1a38db6` | o teste do formato falha no capítulo 1 (partes repetiam 1.6) e passa depois | 24/10 |
| 0b | `0a6551c` | o gravador recusa arquivo sem roteiro; roteiro 02 de teste parte do fim do 01 | 24/10 |
| 1 | `081b73d` | testes do grafo sem internet e sem chave; sem o caminho `passar`, o teste falha | 24/10 |
| 2 | `d81c6bc` | a conferência para na chamada não gravada, sem chegar à rede; 5 testes da gravação | 24/10 |
| 3 | `8a13c1a` | 21 chamadas ao GPT-6 Luna gravadas; nota 30% (passa 19 de 20); repetida sem chave, igual | 24/10 |
| 4a | `59d2c4b` | o capítulo 2 abre com os 14 arquivos do fim do 1; o terminal diz de quando é a resposta gravada | 24/10 |
| 4b | `3dedd8e` | erro de verdade no passo 6 com aposta; a nota com aposta; teste do texto contra a gravação | 24/10 |
| 5a | `97aa2db` | o formato passa no capítulo 2; nota e frases citadas conferidas contra a gravação; 1 leva ao 2 | 24/10 |
