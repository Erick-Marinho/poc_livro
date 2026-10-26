# Para o Erick — etapa 6b, revisão das perguntas de saída

26/10/2026. Correção concluída, **sem ok ainda**. O quadro por ação e as quatro paradas não mudaram.

(redação: GPT-5)

## O que foi corrigido

As cinco perguntas anteriores pediam para localizar uma palavra ou um número já visível. Agora a saída fornece a
evidência, e o leitor decide o que ela prova, o que ainda não prova ou por que aconteceu. Cada pergunta guarda um
trecho literal de `saidas.json` como `evidencia`; a montagem falha se esse trecho não estiver na saída do próprio
comando. Também falha se a opção certa estiver escrita literalmente na saída ou na nota da ação.

A contagem não mudou: continuam **53 passagens mecânicas** nos modos guiados, contra 79 antes da etapa 6b, e **33
decisões principais**, contra 28. O contador agora confirma também que as **5 de 5 perguntas de saída são
interpretativas**. O modo direto permanece com 58 passagens e sem essas perguntas.

## As cinco perguntas para aprovação

### Passo 6 — por que o R7 foi barrado

(redação: GPT-5)

**Antes:** “Qual campo a saída aponta como inválido?”

**Pergunta:** “Por que o caso com id R7 não entrou?”

1. **Certa:** “Porque o id exige R seguido de dois dígitos, e R7 tem só um.”
2. “Porque o pydantic não aceita letras em um id.”
3. “Porque a decisão responder não serve para perguntas de pedido.”

**Porquê:** “A saída diz `String should match pattern '^R\d{2}$'`. No `Caso`,
`Field(pattern=r"^R\d{2}$")` exige R e dois dígitos; R7 tem só um.”

**Fonte:** a saída gravada de `r01-caso-id-torto` traz o padrão recusado; `Caso.id`, em
`livros/ciclo-de-vida/projeto/contrato.py`, declara exatamente esse `Field`. A resposta completa não aparece na
saída nem na nota “O id R7 não segue o padrão, e o pydantic diz qual campo e qual regra.”

### Passo 8 — formato válido não é decisão certa

(redação: GPT-5)

**Antes:** “Quantas perguntas entraram nesta primeira referência?”

**Pergunta:** “O que as três perguntas carregadas provam — e o que ainda não provam?”

1. **Certa:** “Provam que os casos têm formato válido; ainda não que as decisões estão certas.”
2. “Provam que as três decisões estão certas, porque o contrato carregou os casos.”
3. “Provam só que o arquivo tem três linhas; o formato ainda não foi conferido.”

**Porquê:** “A saída mostra `3 perguntas de referência` porque `carregar_referencia()` devolveu três `Caso`; em
`contrato.py`, cada linha passa por `Caso.model_validate_json`. Isso confere o formato, não compara a decisão com a
política e os dados.”

**Fonte:** a saída gravada de `r01-tres-casos` e o laço de `carregar_referencia()` em
`livros/ciclo-de-vida/projeto/contrato.py`. A função valida o JSON com o modelo `Caso`; nenhuma regra nela compara a
decisão esperada com os dados da loja.

### Passo 12 — por que os testes precisam dos pedidos

(redação: GPT-5)

**Antes:** “Quantos pedidos o código encontrou nos dados da loja?”

**Pergunta:** “Para que os testes vão precisar enxergar esses pedidos?”

1. **Certa:** “Para conferir cada caso com os dados, inclusive se o e-mail é do dono.”
2. “Para completar automaticamente os campos ausentes de cada caso.”
3. “Para escolher a decisão esperada no lugar de quem escreveu a referência.”

**Porquê:** “A saída confirma `6 pedidos na loja`. Em `test_referencia.py`, `PEDIDOS`, `EMAIL` e `dono()` permitem
ao teste `test_so_responde_sobre_pedido_quando_o_email_bate` comparar cada caso com o dono real do pedido.”

**Fonte:** a saída gravada de `r01-seis-pedidos`, `dados/pedidos.json`, `dados/clientes.json` e as estruturas
`PEDIDOS`, `EMAIL`, `dono()` e `test_so_responde_sobre_pedido_quando_o_email_bate` em
`livros/ciclo-de-vida/projeto/test_referencia.py`.

### Passo 16 — o alcance dos sete testes verdes

(redação: GPT-5)

**Antes:** “O que a última linha confirma depois da correção?”

**Pergunta:** “Depois de corrigir o R12, o que os sete testes verdes sustentam?”

1. **Certa:** “Que as vinte referências passam pelas regras que as conferem contra a loja.”
2. “Só que o R12 mudou de responder para recusar.”
3. “Que o decisor do próximo passo acertará as vinte perguntas.”

**Porquê:** “A saída termina em `7 passed in 0.28s`. Em `test_referencia.py`, os sete testes usam
`CASOS = carregar_referencia()` e conferem formato e coerência com os dados da loja; não executam o decisor do passo
seguinte.”

**Fonte:** a saída gravada de `r01-testes-passam` e os sete testes de
`livros/ciclo-de-vida/projeto/test_referencia.py`. Eles percorrem `CASOS`, inclusive nas regras de existência do
pedido, e-mail do dono e prazo para chamado; `baseline.py` só entra no passo seguinte.

### Passo 17 — por que o decisor constante acerta algumas

(redação: GPT-5)

**Antes:** “Que decisão o decisor devolveu para esta pergunta?”

**Pergunta:** “Se esse ‘agente’ nem lê a pergunta, por que ele ainda vai acertar algumas da referência?”

1. **Certa:** “Porque algumas perguntas têm passar como decisão esperada.”
2. “Porque a régua dá como certa toda decisão que evita responder.”
3. “Porque o primeiro caso da referência também pede para passar a vez.”

**Porquê:** “A saída é `passar`, exatamente o que `sempre_passar()` devolve. Em `avaliar()`, só conta quando isso é
igual a `c.decisao`; R16 a R20 esperam passar, e as outras perguntas não.”

**Fonte:** a saída gravada de `r01-sempre-passar`; `sempre_passar()` e a comparação exata com `c.decisao` em
`livros/ciclo-de-vida/projeto/baseline.py`; R16 a R20 em `livros/ciclo-de-vida/projeto/referencia.jsonl`.

## Capturas do quadro com os cinco blocos

O passo 6 foi aberto em **Na minha IDE** e avançou somente até a ação que insere `Caso`, antes de responder às duas
perguntas de bloco. Nas duas larguras, o chat diz “Os 5 blocos estão juntos neste quadro”, o editor destaca de uma
vez as linhas 24–33 e a passagem continua bloqueada pela pergunta.

- [Computador, 1120 px](capturas/revisao-do-percurso-inicial-etapa-6b-correcao/passo-06-quadro-cinco-blocos-computador.png)
- [Celular, iframe de 360 px](capturas/revisao-do-percurso-inicial-etapa-6b-correcao/passo-06-quadro-cinco-blocos-celular-360.png)

## Verificação executada

```text
$ node scripts/contar-passagens-ide-capitulo-1.mjs
Perguntas de saída interpretativas: 5 de 5; a evidência aparece na saída do comando, a resposta não aparece na saída nem na nota.
Antes/depois: 79 → 53 passagens mecânicas nos modos guiados; 28 → 33 decisões principais. O modo direto permanece em 58 passagens.

$ npm run saidas:conferir
conferidas 30 saídas: iguais às do livro

$ npm test
30 saídas do livro e 16 dos experimentos conferidas
120 testes do livro passaram
5 testes da gravação passaram
```

O teste novo também força três falhas: evidência ausente da saída, resposta entregue pela própria saída e resposta
entregue pela nota. Não houve chamada paga, mudança de saída, alteração das paradas nem mudança no capítulo 2.
