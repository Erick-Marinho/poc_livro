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

## Etapas

1. A IDE no guia: o roteiro da construção, da pasta vazia à nota (o projeto, o cofre no Obsidian com a nota que muda o
   prazo escrita pelo leitor, o `cerebro.py` por blocos, a armadilha com aposta, o conserto, a régua com a troca do
   limite), e o texto em volta.
2. As figuras: "o que vamos construir" no topo, e o cofre no tempo (o grafo dos links e o prazo que muda).
3. O modelo local: instalar o Ollama e baixar o modelo como "sua vez"; o cérebro pede a resposta ao modelo com as
   notas achadas, gravada; a régua diz se ele acerta o canal sem perder as outras (precisa do ok para baixar aqui).
4. Os links e o fecho: o que uma pessoa ficou de fazer, seguindo os `[[links]]`; o que fica local, e quando um app.

## Etapa 2 (detalhe)

- **Arquivos:** `guias/segundo-cerebro-local/figuras/rastro.py` (o caminho de uma pergunta, tirado do próprio
  `cerebro.py` e conferido contra ele), `comandos.json` (grava o rastro), `src/components/livro/cerebro/` (as duas
  figuras), `guia.mdx`, e o teste dos guias passa a olhar as saídas em qualquer figura da página.
- **Muda:** no topo, "o que vamos construir": a pergunta do prazo atravessando o cérebro, etapa por etapa (as
  palavras, a nota do BM25 de cada uma das doze notas, as frases candidatas, a resposta sem e com a data, a régua),
  com os números do rastro gravado. Responde: o que acontece entre a pergunta e a resposta? Depois, "o cofre no
  tempo": as notas surgindo na ordem das datas, ligadas pelos `[[links]]`, e o prazo que o cofre diz mudando de 14/11
  para 21/11, enquanto o resumo do projeto continua dizendo 14/11. Responde: por que uma busca devolveria a data velha?
  As duas tocam sozinhas, param, voltam; no modo direto, aparecem no estado final.
- **Evidência:** o rastro gravado e conferido (`npm test`), e falhando se ele divergir do `cerebro.py`; as duas
  figuras tocadas no Chrome headless; capturas no computador e no celular.
- **Fica fora:** o modelo (3), os links de pessoa e o fecho (4).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 (primeira versão) | `4778c64` | 12 notas inventadas no cofre; 5 saídas gravadas e conferidas no `npm test` (41 testes). Com `--sem-data`, o prazo sai 14/11, citando o status de 03/11; com a data, 21/11, com o 14/11 de antes ao lado. Régua: 7 de 10 sem a data, 9 de 10 com ela; a do canal erra nos dois (a palavra não está nas notas). Trocar `PARECIDA` faz a conferência sair com 1, e voltar, com 0. Capturas no computador e no celular | refeita: faltou o padrão (a IDE com o chat, as figuras), Erick, 24/10/2026 |
| 1 | `1b4ef33` | o roteiro aplicado numa pasta vazia chega ao `projeto/` e grava 8 saídas (e as 2 da troca do limite), conferidas no `npm test` (41 testes). A IDE no guia, percorrida no Chrome headless: 6 passos, 31 envios, 3 apostas, 2 perguntas, dúvidas em 3 lugares; aqui no guia, 6 comandos digitados. O prazo sai 14/11 e depois 21/11 com o velho ao lado; a régua dá 7 e 9 de 10; tocar no `1.0` e escolher 0.6 pede a aposta e dá 8 de 10, com a do WhatsApp quebrada. A IDE diz "guia" onde diria livro; o capítulo 1 continua com 78 cliques. Capturas do cofre e da nota escrita por blocos | Erick, 24/10/2026 |
| 2 | `0276007` | o rastro da pergunta do prazo gravado e conferido (falha se divergir do `cerebro.py`); figura 1: o fluxo de 5 etapas com os números reais (2 palavras, 5 de 12 notas, 4 frases empatadas, a regra da data reordenando as 4 com 21/11 em cima, 7 e 9 de 10); figura 2: as notas surgindo pela data, ligadas pelos links, "o cofre diz" indo de 14/11 a 21/11 e o resumo marcado como parado. Achei e corrigi um erro na figura 2 ("entregar as telas" contava como entrega); um teste novo pega esse erro. `npm test` com 43 testes; capturas no computador e no celular | pendente |

(redação: claude-opus-5-5)
