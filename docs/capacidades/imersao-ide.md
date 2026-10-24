# Imersão na IDE do capítulo

**Problema.** Percorrendo a IDE do capítulo 1 inteira como leitor, esperando a conversa assentar a cada clique
(24/10/2026): 95 cliques até o fim, dos quais 40 são "sua vez" (o fazer), 17 fechos de passo e 38 "seguir" que só
mostram; mais 9 decisões (7 apostas e 2 perguntas). Uma primeira medição deu 143 porque clicava com a conversa ainda
entrando. Os 38 "seguir" passivos são o alvo (docs/PRINCIPIOS.md: assistir não é aprender; uma interação por ideia).

## Decisões

- (etapa 1) O "pendente" do pensamento do autor sai da tela: já feito em `75439e6` (outra sessão).
- (etapa 2) A abertura de um passo emenda sozinha na primeira ação: o chat corre do pedido do autor à primeira coisa
  feita, e o leitor só para onde há algo a fazer (aposta, pergunta, "sua vez", fecho do passo). Os blocos de código
  continuam um por clique: avançar código sozinho seria "código se montando sozinho".
- (etapa 3) O livro lembra o passo em que o leitor parou (no navegador) e oferece continuar dali; a trilha mantém os
  passos feitos entre visitas.
- (etapa 4) Modo foco: a IDE ocupa a tela inteira (sem sumário, cabeçalho e pílula); Esc volta ao livro.
- (etapa 5) Revisada antes do ok: o que decide se o leitor digita não é um modo de terminal, é onde ele faz o
  projeto. A IDE pergunta uma vez, no lugar do primeiro "seguir": "Onde você vai fazer o projeto?" (no computador, a
  sugestão é "na minha IDE"; no celular, "aqui no livro"). Fica no navegador (`fontmar:onde`, `palco/onde.ts`), vale
  para todos os terminais e muda nas configurações e na barra do terminal da IDE.
  - Na minha IDE: o comando roda sozinho aqui (depois da aposta) e o cartão "sua vez" pede para rodar na máquina dele.
    Ninguém digita duas vezes.
  - Aqui no livro: o chat diz o comando e o leitor digita; Tab completa; "roda pra mim" para o `python -c` longo; o
    que não é o comando ganha uma dica do livro em outra letra; a aposta vem depois do Enter. O "sua vez" sai: digitar
    aqui já é o fazer. Os cliques não diminuem (o "fiz na minha IDE" vira "seguir").
  - No modo direto, não há pergunta nem digitação. O seletor guiado/interativo dos terminais avulsos saiu.
- (etapa 6) Modificar antes de criar, em dois lugares só do capítulo 1. Poucos e bons: o primeiro apresenta o gesto
  com algo pequeno, o segundo é onde mexer muda o argumento do capítulo.
  - `Decisao('talvez')` (passo 5): depois da saída, a palavra `'talvez'` do comando vira um seletor. `'responder'`
    entra; `'RESPONDER'` dá erro. A lista fechada é exata, até na maiúscula.
  - A nota de partida (passo 18): depois da nota, o `PASSAR` do `baseline.py` vira um seletor no editor. Sempre
    `RESPONDER` dá 40%, mais que os 25% de passar, e é o pior agente dos quatro (responderia ao Bruno sobre o pedido da
    Ana). Antes dessa saída, uma aposta: a nota sobe, desce ou fica? Nota sozinha não diz se o agente presta.
  - O gesto é manipular o próprio código (um toque na palavra abre as opções), não um botão ao lado. A linha muda no
    editor, o comando roda de novo no terminal com a saída gravada daquela versão, e o chat registra a troca e
    comenta. "O do livro" volta ao original; ao seguir, o arquivo volta sozinho, e o chat avisa isso antes.
  - Não segura o leitor: explorar é opcional, e o seguir só espera uma aposta que ele mesmo abriu. Quem faz na
    própria IDE ganha, no "sua vez", o convite para fazer a mesma troca lá.
  - Cada variante roda de verdade no `scripts/saidas.py` (o arquivo trocado e depois restaurado, conferido igual), e
    a saída entra no `saidas.json` com id próprio: o livro continua sem mentir.

## Etapas

1. Tirar o "pendente" da tela (feito por outra sessão).
2. Menos cliques: a abertura emenda na primeira ação. Medida: cliques até o fim, antes e depois.
3. Continuar de onde parou.
4. Modo foco.
5. (médio) O leitor digita os comandos no terminal da IDE. Medida: o percurso inteiro nos três modos; o guiado e o
   direto não podem mudar.
6. (médio) Modificar antes de criar: 2 ou 3 variantes gravadas, com aposta. Medida: as variantes conferidas pelo
   `npm test`; o percurso inteiro sem explorar continua com os mesmos cliques; explorando, cada troca mostra a linha,
   a saída gravada e a fala do chat.
7. (grande) "Fiz na minha IDE" conferido: `uv run conferir` no repositório do leitor.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `75439e6` (outra sessão) | o "pendente" do pensamento já não aparece na tela | Erick, 24/10/2026 |
| 2 | `812f432` | percurso do capítulo 1 inteiro: de 95 para 78 cliques; as 40 pausas "sua vez" continuam | Erick, 24/10/2026 |
| 3 | `8135191` | duas visitas no mesmo navegador: oferece continuar do passo 4 depois de fechar o 3, e a trilha mantém os feitos | Erick, 24/10/2026 |
| 4 | `26ddea9` | a IDE cobre 1440×813, a página não rola, a pílula e o cabeçalho ficam por baixo, Esc volta; capturas no computador e no celular | Erick, 24/10/2026 |
| 5 | `62d03d7`, revisão `5d7d580` | percurso do capítulo 1: sem resposta, a pergunta no lugar do seguir, e responder já avança; "na minha IDE": 78 cliques, 40 "sua vez", nenhum comando digitado, como antes; "aqui no livro": 78 cliques, 15 comandos (14 digitados, 1 "roda pra mim"), nenhum "sua vez", as 7 apostas depois do Enter; modo direto: 58 cliques, sem pergunta. Capturas da pergunta no computador e no celular, e das configurações | Erick, 24/10/2026 |
| 6 | `04a2111` | 5 variantes rodadas de verdade e gravadas (`npm run saidas`, conferidas pelo `npm test`; as saídas antigas ficaram como estavam). Percurso no passo 18: o `PASSAR` vira seletor, o menu abre na escolha atual, RESPONDER pede a aposta (o seguir espera), a linha 12 muda e fica realçada, a saída dá 40% e o chat comenta; RECUSAR dá 25%; "o do livro" volta ao original. No passo 5, o `'talvez'` relembrado no terminal: `'RESPONDER'` dá o erro, `'responder'` entra. Sem explorar, o percurso inteiro continua com 78 cliques (na minha IDE e aqui no livro) e 58 (direto). Capturas no computador e no celular | Erick, 24/10/2026 |

(redação: claude-opus-5-5)
