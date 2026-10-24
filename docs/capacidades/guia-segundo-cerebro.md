# Guia: um segundo cérebro local

**Problema.** O artigo do Daily Dose of DS ("Build your own 100% local AI second brain") ensina a instalar o Rowboat e
promete um cérebro "100% local" que entende o que mudou nas suas notas. Mas os dados vêm do Gmail, da agenda e de
serviços de reunião; nada é medido; e a tese central (um resumo não acompanha o que mudou) é afirmada, não mostrada.
O guia faz o mecanismo à vista, num cofre do Obsidian, e mede: o leitor vê a armadilha do prazo que mudou, conserta e
compara a nota antes e depois.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| IDE do capítulo no guia | o chat guia a construção, passo a passo, com aposta, dúvida e troca | roteiro, passos, glossário | a ilha da IDE | existe (o guia passa a usar) |
| `roteiros/01.json` + `passos/01.json` + `glossario.json` | o caminho do projeto, da pasta vazia à nota, na ordem em que se pensa | o projeto final | estados e saídas | nova |
| `livroDaPagina.ts` e `saidas.py` | a IDE e o motor de roteiros valem também em `/guias/<guia>/` | o endereço | a pasta do guia | troca |
| `projeto/cofre/` | o cofre do Obsidian: o leitor cria e escreve a nota que muda o prazo | — | as notas | existe |
| `projeto/cerebro.py`, `medir.py`, `perguntas.jsonl` | a busca com fonte, a regra da data, a régua | o cofre | respostas e nota | existe |
| figura "o que vamos construir" | o caminho de uma pergunta, animado: cofre, busca, regra da data, resposta com fonte, régua | o projeto | figura no topo | nova |
| figura do cofre no tempo | o grafo dos `[[links]]` e o prazo mudando de 14/11 para 21/11 nas notas | o cofre | figura | nova |
| Ollama + modelo pequeno | instalar e baixar (no terminal do leitor) e o cérebro pedir a resposta ao modelo, gravada | as notas achadas | a resposta | nova |

## Decisões

- (Erick, 24/10/2026) Notas de uma pessoa qualquer, inventada; nada de dado real.
- (Erick, 24/10/2026) O guia ensina a subir o Ollama; o guia de modelos locais, mais fundo, vem depois.
- (Erick, 24/10/2026) As notas moram num cofre do Obsidian; o leitor instala o Obsidian e cria o cofre.
- (Erick, 24/10/2026) O guia segue o padrão do livro: a IDE com o chat guiando a construção, figuras que se mexem
  começando pelo que vamos construir, e o raciocínio ligando os pontos. Sem isso, vira mais um tutorial.
- (1) O que não roda no build fica como "sua vez", sem saída inventada: instalar o Obsidian, abrir o cofre, instalar
  o Ollama e baixar o modelo. O que roda (o projeto, a busca, a régua, a resposta do modelo) é gravado e conferido.
- (1) O cérebro começa sem modelo, com um BM25 em Python puro: a parte que decide roda e se mede em qualquer máquina.
- (3) A régua confere fatos, não frases: cada pergunta lista o que a resposta certa tem que trazer (`["24/10"]`), sem
  acento e sem caixa. Um modelo escreve com as palavras dele; conferir por pedaço de texto é grosseiro, e o guia diz isso.
- (3) A régua confere também a fonte: o fato tem que estar na nota citada. Acertar a resposta com a fonte errada é sorte.
- (3) As notas vão numeradas ao modelo, e ele devolve o número: copiando o nome, o llama3.2:3b escreveu "Reunióes" e
  "IntegraÎao", e a fonte não batia. Com o número, o modelo sozinho fez 10 de 10, gravado e em duas rodadas ao vivo
  (cerca de 7 s por pergunta na CPU); a dica da regra da data, testada, não acrescentou nada medível e saiu.

## Etapas

1. A IDE no guia: o roteiro da construção, da pasta vazia à nota (o projeto, o cofre no Obsidian com a nota que muda o
   prazo escrita pelo leitor, o `cerebro.py` por blocos, a armadilha com aposta, o conserto, a régua com a troca do
   limite), e o texto em volta.
2. As figuras: "o que vamos construir" no topo, e o cofre no tempo (o grafo dos links e o prazo que muda).
3. O modelo local: instalar o Ollama e baixar o modelo como "sua vez"; o cérebro pede a resposta ao modelo com as
   notas achadas, gravada; a régua diz se ele acerta o canal sem perder as outras (precisa do ok para baixar aqui).
4. Os links e o fecho: o que uma pessoa ficou de fazer, seguindo os `[[links]]`; o que fica local, e quando um app.

## Etapa 4 (detalhe)

- **Arquivos:** `projeto/pessoas.py` (novo), `perguntas.jsonl`, `roteiros/01.json`, `passos/01.json`,
  `glossario.json`, `guia.mdx` (o fecho), e a figura do cofre, se ajudar a mostrar os backlinks de uma pessoa.
- **Muda:** a pergunta-bandeira do artigo ("o que a Sarah ficou de fazer?"), feita do nosso jeito: "o que o Rafael
  ficou de fazer?". Os `[[links]]` dão as notas que citam a pessoa (os backlinks do Obsidian); nelas, as frases com
  "ficou de", com data e fonte; e o que veio depois, nas notas dele. Sem modelo, com uma aposta e a troca da pessoa no
  próprio comando (a régua das dez perguntas fica como está: mexer nela pediria regravar o modelo). No fim do guia, o fecho: o que fica de fato local aqui (o cofre, a busca, o modelo) e o que deixaria de
  ficar se você ligasse o e-mail e a agenda, como o artigo faz; e quando um app como o Rowboat vale o que custa.
- **Evidência:** as saídas novas gravadas e conferidas no `npm test`; a IDE do guia até o fim; capturas.
- **Fica fora:** a voz dos autores (fica com `Pendente`).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 (primeira versão) | `bb0740d` | 12 notas inventadas no cofre; 5 saídas gravadas e conferidas no `npm test` (41 testes). Com `--sem-data`, o prazo sai 14/11, citando o status de 03/11; com a data, 21/11, com o 14/11 de antes ao lado. Régua: 7 de 10 sem a data, 9 de 10 com ela; a do canal erra nos dois (a palavra não está nas notas). Trocar `PARECIDA` faz a conferência sair com 1, e voltar, com 0. Capturas no computador e no celular | refeita: faltou o padrão (a IDE com o chat, as figuras), Erick, 24/10/2026 |
| 1 | `1457d26` | o roteiro aplicado numa pasta vazia chega ao `projeto/` e grava 8 saídas (e as 2 da troca do limite), conferidas no `npm test` (41 testes). A IDE no guia, percorrida no Chrome headless: 6 passos, 31 envios, 3 apostas, 2 perguntas, dúvidas em 3 lugares; aqui no guia, 6 comandos digitados. O prazo sai 14/11 e depois 21/11 com o velho ao lado; a régua dá 7 e 9 de 10; tocar no `1.0` e escolher 0.6 pede a aposta e dá 8 de 10, com a do WhatsApp quebrada. A IDE diz "guia" onde diria livro; o capítulo 1 continua com 78 cliques. Capturas do cofre e da nota escrita por blocos | Erick, 24/10/2026 |
| 2 | `58537a3` | o rastro da pergunta do prazo gravado e conferido (falha se divergir do `cerebro.py`); figura 1: o fluxo de 5 etapas com os números reais (2 palavras, 5 de 12 notas, 4 frases empatadas, a regra da data reordenando as 4 com 21/11 em cima, 7 e 9 de 10); figura 2: as notas surgindo pela data, ligadas pelos links, "o cofre diz" indo de 14/11 a 21/11 e o resumo marcado como parado. Achei e corrigi um erro na figura 2 ("entregar as telas" contava como entrega); um teste novo pega esse erro. `npm test` com 43 testes; capturas no computador e no celular | pendente |
| 3 | `c2be024` | Ollama 0.40.10 e llama3.2:3b nesta máquina, na CPU; 3 comandos com o modelo gravados (12 respostas) e repetidos com o Ollama desligado (`npm test`, 51 testes). A régua passou a conferir a fonte: busca 7, regra da data 9, modelo 10 de 10 (e 10 nas duas rodadas ao vivo, 73 s as dez). Achados no caminho: o modelo estropiou nomes com acento (as notas foram numeradas) e respondeu diferente quando o pedido mudou; a dica da regra da data não acrescentou nada e saiu. IDE do guia até o passo 8 (43 envios, 6 apostas); capturas | Erick, 24/10/2026 |
| 4 | `c3c0bd9` | `pessoas.py` gravado e conferido: Rafael, 2 compromissos em 5 notas, cada um com o que veio depois (pronto em 24/10; SMS atrasou em 06/11); trocando o nome no comando, Otávio (1, sem notícia) e Bianca (0). O fecho "O que fica local", com `Pendente` para a voz dos autores. IDE do guia até o fim: 9 passos em 5 partes, 48 envios, 7 apostas, termina com "Fim do guia."; o capítulo 1 continua com 78 cliques. `npm test` com 51 testes; captura | Erick, 24/10/2026 |

(redação: claude-opus-5-5)
