# Para o Erick — etapa 6a, contar e propor

26/10/2026. Levantamento concluído, **aguardando a escolha do Erick**. Nenhuma proposta foi implementada.

(redação: GPT-5)

## Estado encontrado

Desde `f499020`, nenhum commit alterou `IdeCapitulo.tsx`, `src/lib/ideCapitulo.ts`, `roteiros/` ou `passos/`. A
consulta foi `git log --name-only f499020..HEAD --` nesses caminhos e não devolveu arquivo. Os commits posteriores
anteriores a esta etapa mexeram somente no plano e no registro da etapa 5.

A contagem vem de `scripts/contar-passagens-ide-capitulo-1.mjs`. O script lê as 40 ações de `roteiros/01.json`, os
18 intervalos e pedidos de `passos/01.json`, as saídas reais e as regras de quadros e passagem do
`IdeCapitulo.tsx`. Ele para com erro se os passos deixarem de cobrir o roteiro ou se desaparecerem as regras de
bloco, `FIZ`, `SEGUE`, `Avançar` ou memória local em que a conta se apoia.

Uma **passagem mecânica** é uma fala que só abre o passo, confirma que a ação foi feita ou pede a continuação. A
seta **Avançar** e `ArrowRight` acionam a mesma transição da fala sugerida: aparecem como alternativa, mas não são
somadas outra vez. No modo guiado, a seta pode substituir 78 das 79 passagens; só o primeiro pedido precisa sair
pelo chat. No modo direto, ela pode substituir as 58.

Uma **decisão ou investigação principal** é uma aposta, uma pergunta de bloco, um comando executado pelo leitor ou
um erro real que ele encontra. Variantes e dúvidas são opcionais; a aposta e o erro dentro de uma variante também.
As categorias se sobrepõem de propósito: digitar um comando que falha conta o ato de executar e o ato de investigar
o resultado. A escolha inicial entre “na minha IDE” e “aqui no livro” e a escolha condicional de retomar são duas
decisões de navegação fora dos 18 passos, por isso não entram nas tabelas.

## Contagem passo a passo

| Passo | Ações | Blocos extras | Na minha IDE: pedido + FIZ + SEGUE | Aqui no livro: pedido + SEGUE | Direto: começo/pedido + SEGUE | Principais | Opcionais |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 4 | 0 | 1 + 4 + 0 = 5 | 1 + 4 = 5 | 1 + 4 = 5 | 1 | 0 |
| 2 | 1 | 0 | 1 + 1 + 0 = 2 | 1 + 1 = 2 | 1 + 1 = 2 | 1 | 2 |
| 3 | 1 | 0 | 1 + 1 + 0 = 2 | 1 + 1 = 2 | 1 + 1 = 2 | 1 | 1 |
| 4 | 1 | 0 | 1 + 1 + 0 = 2 | 1 + 1 = 2 | 1 + 1 = 2 | 0 | 0 |
| 5 | 2 | 3 | 1 + 2 + 3 = 6 | 1 + 5 = 6 | 1 + 2 = 3 | 3 | 2 |
| 6 | 3 | 4 | 1 + 3 + 4 = 8 | 1 + 7 = 8 | 1 + 3 = 4 | 4 | 1 |
| 7 | 3 | 2 | 1 + 3 + 2 = 6 | 1 + 5 = 6 | 1 + 3 = 4 | 0 | 0 |
| 8 | 2 | 0 | 1 + 2 + 0 = 3 | 1 + 2 = 3 | 1 + 2 = 3 | 1 | 0 |
| 9 | 2 | 0 | 1 + 2 + 0 = 3 | 1 + 2 = 3 | 1 + 2 = 3 | 2 | 0 |
| 10 | 3 | 2 | 1 + 3 + 2 = 6 | 1 + 5 = 6 | 1 + 3 = 4 | 3 | 1 |
| 11 | 3 | 0 | 1 + 3 = 4 | 1 + 3 = 4 | 1 + 3 = 4 | 2 | 0 |
| 12 | 4 | 0 | 1 + 4 = 5 | 1 + 4 = 5 | 1 + 4 = 5 | 1 | 0 |
| 13 | 1 | 2 | 1 + 1 + 2 = 4 | 1 + 3 = 4 | 1 + 1 = 2 | 0 | 0 |
| 14 | 2 | 3 | 1 + 2 + 3 = 6 | 1 + 5 = 6 | 1 + 2 = 3 | 2 | 0 |
| 15 | 2 | 2 | 1 + 2 + 2 = 5 | 1 + 4 = 5 | 1 + 2 = 3 | 3 | 1 |
| 16 | 2 | 0 | 1 + 2 = 3 | 1 + 2 = 3 | 1 + 2 = 3 | 1 | 0 |
| 17 | 2 | 1 | 1 + 2 + 1 = 4 | 1 + 3 = 4 | 1 + 2 = 3 | 1 | 0 |
| 18 | 2 | 2 | 1 + 2 + 2 = 5 | 1 + 4 = 5 | 1 + 2 = 3 | 2 | 4 |
| **Total** | **40** | **21** | **18 + 40 + 21 = 79** | **18 + 61 = 79** | **18 + 40 = 58** | **28** | **12** |

As 28 oportunidades principais são 7 apostas, 2 perguntas de bloco, 15 comandos e 4 erros. As 12 opcionais são
2 variantes, 8 dúvidas, 1 aposta de variante e 1 erro de variante:

| Passo | Apostas | Perguntas de bloco | Comandos | Erros | Variantes | Dúvidas | Aposta de variante | Erro de variante |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 2 | 0 | 0 | 1 | 0 | 0 | 2 | 0 | 0 |
| 3 | 0 | 0 | 1 | 0 | 0 | 1 | 0 | 0 |
| 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 5 | 1 | 0 | 1 | 1 | 1 | 0 | 0 | 1 |
| 6 | 0 | 2 | 1 | 1 | 0 | 1 | 0 | 0 |
| 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 8 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 9 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 10 | 1 | 0 | 1 | 1 | 0 | 1 | 0 | 0 |
| 11 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 12 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 13 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 14 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 15 | 1 | 0 | 1 | 1 | 0 | 1 | 0 | 0 |
| 16 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 17 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 18 | 1 | 0 | 1 | 0 | 1 | 2 | 1 | 0 |
| **Total** | **7** | **2** | **15** | **4** | **2** | **8** | **1** | **1** |

### O que muda entre os modos

- **Na minha IDE:** depois de cada ação inteira, o cartão “sua vez” pede que o leitor a repita na máquina dele; ele
  responde com uma das quatro formas de `FIZ`. Entre blocos da mesma ação, pede “E o próximo?”. São 18 pedidos, 40
  `FIZ` e 21 `SEGUE`: 79 passagens. Os 15 comandos são executados na máquina do leitor.
- **Aqui no livro:** não há cartão “sua vez”. As 40 confirmações viram `SEGUE`, somadas às 21 entre blocos e aos 18
  pedidos: as mesmas 79 passagens. O leitor digita os 15 comandos no terminal da página; “Executa pra mim” continua
  sendo a saída opcional já existente.
- **Modo direto:** há um quadro por ação, então os 21 avanços entre blocos desaparecem: 18 começos/pedidos e 40
  `SEGUE`, total 58. O modo não pergunta onde fazer, não pede digitação, não mostra as 7 apostas, a aposta de
  variante nem as 2 perguntas de bloco. Permanecem as saídas dos 4 erros principais, as 2 variantes, as 8 dúvidas e
  o erro opcional de variante: 4 oportunidades principais e 11 opcionais.

## Onde o leitor pode parar e como retoma hoje

Ao chegar ao “Pronto. Agora você tem”, a IDE guarda no `localStorage`, por página, o passo atual e os passos já
fechados. Na próxima visita, oferece continuar do passo guardado ou começar do início. Do passo 2 em diante, o cartão
“sua vez” também mostra a tag do fim do passo anterior; por exemplo, o passo 5 volta com
`git checkout cap-01/passo-04`. A tag recupera o projeto, enquanto o navegador recupera a posição da conversa.

Quatro paradas naturais propostas, todas depois de uma entrega nomeada pela própria IDE:

1. **Depois do passo 4 — A loja inventada.** Fecha a preparação: projeto, dependências e dados estão presentes. A
   retomada começa no passo 5, pela memória ou por `cap-01/passo-04`.
2. **Depois do passo 10 — O contrato se protege.** Fecha o arco do caso apressado: o erro apareceu e o contrato
   passou a barrá-lo. A retomada é o passo 11 ou `cap-01/passo-10`.
3. **Depois do passo 16 — O R12 corrigido.** Fecha o arco dos testes da política com as vinte referências coerentes
   e os testes verdes. A retomada é o passo 17 ou `cap-01/passo-16`.
4. **Depois do passo 18 — A régua.** Fecha o capítulo com a nota de partida; `cap-01/fim` recupera essa entrega.

## Propostas para a etapa 6b

As projeções abaixo saem do mesmo script. “Principais/todas” separa o caminho principal do leitor que abre todas as
opções. Os exemplos mostram **na minha IDE**; “aqui no livro” troca `FIZ` pelas variações de `SEGUE`.

| Proposta | Mecânicas: minha IDE | Mecânicas: aqui | Mecânicas: direto | Decisões guiadas: principais/todas | Decisões diretas: principais/todas |
|---|---:|---:|---:|---:|---:|
| Estado atual | 79 | 79 | 58 | 28/40 | 4/15 |
| A — um quadro por ação | 58 | 58 | 58 | 28/40 | 4/15 |
| B — agrupar ações sem comando | 49 | 49 | 49 | 28/40 | 4/15 |
| C — cinco confirmações viram previsões | 74 | 74 | 58 | 33/45 | 4/15 |

### Proposta A — um quadro por ação

Os 31 blocos continuam explicados, mas os blocos de uma mesma ação aparecem juntos. Saem 21 pedidos “E o próximo?”;
cada ação ainda exige uma fala do leitor. Ele faz menos confirmações, mas recebe até o conteúdo inteiro da ação de
uma vez.

**Passo 6, antes:**

> Você: Como fica um caso? Uma pergunta de referência, com a decisão que a gente espera.
>
> Você: Fiz. Pode seguir. → E o próximo? → E o próximo? → E o próximo? → E o próximo? → Fiz na minha IDE. → Feito
> aqui também.

**Passo 6, depois:**

> Você: Como fica um caso? Uma pergunta de referência, com a decisão que a gente espera.
>
> Você: Fiz na minha IDE. → Feito aqui também. → Pronto, fiz.

**Passo 16, antes:**

> Você: O R12 está errado. Corrige.
>
> Você: Fiz. Pode seguir. → Fiz na minha IDE.

**Passo 16, depois:**

> Você: O R12 está errado. Corrige.
>
> Você: Feito aqui também. → Pronto, fiz.

O passo 16 conserva duas confirmações porque já tem uma ação de mudança e outra de comando; ele serve como controle
do alcance da proposta. Esta alternativa **muda uma decisão do Erick em `imersao-ide.md`**: hoje cada bloco entra
quando o leitor passa. O motivo para pedir a mudança seria tirar passagens que apenas fatiam uma mesma ação, sem
tirar seus termos ou perguntas. O limite de cerca de 15 linhas novas por passo, as apostas, as variantes, as dúvidas
e o modo direto permanecem.

**Custo de implementação:** `IdeCapitulo.tsx` para montar e narrar todos os blocos no quadro da ação;
`testes/ide-capitulo.test.mjs` para provar a sequência e as perguntas; teste de página nos três modos. Roteiro,
passos, projeto e saídas gravadas não precisariam mudar.

### Proposta B — agrupar ações sem comando

Além de juntar os blocos, ações consecutivas que não executam comando viram um lote dentro do passo. Cada comando
continua isolado, com aposta, saída e erro próprios. O leitor confirma uma pequena entrega, não cada arquivo; em
troca, precisa acompanhar mais de uma mudança antes de falar.

**Passo 6, antes:**

> Você: Como fica um caso? Uma pergunta de referência, com a decisão que a gente espera.
>
> Você: Fiz. Pode seguir. → E o próximo? → E o próximo? → E o próximo? → E o próximo? → Fiz na minha IDE. → Feito
> aqui também.

**Passo 6, depois:**

> Você: Como fica um caso? Uma pergunta de referência, com a decisão que a gente espera.
>
> Você: Pronto, fiz. [troca e inserção no contrato] → Fiz. Pode seguir. [comando]

**Passo 16, antes:**

> Você: O R12 está errado. Corrige.
>
> Você: Fiz. Pode seguir. → Fiz na minha IDE.

**Passo 16, depois:**

> Você: O R12 está errado. Corrige.
>
> Você: Fiz na minha IDE. [correção] → Feito aqui também. [testes]

Outra vez, o passo 16 não encolhe porque o comando é uma fronteira. A redução vem de passos com várias mudanças
consecutivas, como 1, 6, 7, 10, 11 e 12. Esta proposta toca a mesma decisão de blocos um a um e vai além: uma fala
pode aplicar mais de uma ação do roteiro. Ela não faz a IDE avançar sem fala do leitor, mas muda a granularidade
decidida em `passo-a-passo.md` e `imersao-ide.md`; Erick precisaria aprovar explicitamente. O teto por passo não
muda, mas a carga visual de cada lote precisa ser conferida.

**Custo de implementação:** `IdeCapitulo.tsx` para formar lotes e aplicar seus estados, possivelmente
`src/lib/ideCapitulo.ts` para expor as fronteiras; `testes/ide-capitulo.test.mjs` e teste de página para ordem,
arquivos e retomada. Roteiro e passos podem permanecer; `npm run saidas:conferir` deve provar que as saídas não
mudaram.

### Proposta C — trocar cinco confirmações por previsões

O script seleciona os comandos sem aposta que vêm logo depois de uma mudança no mesmo passo: 6, 8, 12, 16 e 17.
A confirmação depois do comando vira uma pergunta curta sobre a saída. O total de falas continua 79; cinco deixam
de ser mecânicas, e as decisões principais sobem de 28 para 33. O leitor faz mais: interpreta a prova antes de
continuar. O modo direto continua sem perguntas e com 58 passagens.

**Passo 6, antes:**

> Você: Como fica um caso? Uma pergunta de referência, com a decisão que a gente espera.
>
> Você: Fiz. Pode seguir. → E o próximo? → E o próximo? → E o próximo? → E o próximo? → Fiz na minha IDE. → Feito
> aqui também.

**Passo 6, depois:**

> Você: Como fica um caso? Uma pergunta de referência, com a decisão que a gente espera.
>
> Você: Fiz. Pode seguir. → E o próximo? → E o próximo? → E o próximo? → E o próximo? → Fiz na minha IDE.
>
> IA: O erro vem do tipo dos campos ou do formato do id?
>
> Você: Do formato do id.

**Passo 16, antes:**

> Você: O R12 está errado. Corrige. → Fiz. Pode seguir. → Fiz na minha IDE.

**Passo 16, depois:**

> Você: O R12 está errado. Corrige. → Fiz. Pode seguir.
>
> IA: Os testes verdes provam só que o R12 mudou ou que as vinte referências concordam com os dados da loja?
>
> Você: Que as vinte referências concordam com os dados da loja.

Esta proposta preserva as decisões de conversa: cada passagem ainda é uma fala do leitor, a IDE não avança sozinha,
os blocos continuam um a um e apostas, variantes, dúvidas e modo direto ficam. Ela acrescenta cinco decisões que o
Erick ainda não escreveu nem aprovou; os textos acima são proposta, não voz dos autores.

**Custo de implementação:** um campo de pergunta pós-saída em `roteiros/01.json`, sua montagem em
`src/lib/ideCapitulo.ts`, resposta e passagem em `IdeCapitulo.tsx`, e testes da pergunta, do bloqueio e do modo
direto em `testes/ide-capitulo.test.mjs`. `npm run saidas` deve reconstituir os estados sem mudar nenhuma saída de
comando; a conferência precisa provar isso.

## Evidência executada

```text
$ node scripts/contar-passagens-ide-capitulo-1.mjs
18 passos; 40 ações; 21 blocos extras
guiado na minha IDE: 18 pedidos + 40 FIZ + 21 SEGUE = 79
guiado aqui no livro: 18 pedidos + 61 SEGUE = 79
modo direto: 18 começos/pedidos + 40 SEGUE = 58
decisões/investigações guiadas: 28 principais; 40 com opcionais
decisões/investigações diretas: 4 principais; 15 com opcionais
propostas A/B/C: 58, 49 e 74 passagens mecânicas guiadas
```

O bloco acima resume a saída; as duas tabelas anteriores são a saída completa do script. Não houve chamada paga,
regravação, mudança de produto, push ou túnel. `npm test` também passou: build concluído, 30 saídas do livro e 16
dos experimentos conferidas, 116 testes do livro e 5 testes da gravação verdes.
