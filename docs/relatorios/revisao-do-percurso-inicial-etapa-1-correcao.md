# Para o Erick — correção da redação da etapa 1

25/10/2026. Revisão solicitada pelo Erick, ainda **aguardando revisão**, sem ok para fechar a etapa.
Base desta correção: `40bb16d`. Mantidos os fatos e o escopo da etapa 1.

(redação: GPT-6)

O antes e o depois abaixo cobrem somente os oito trechos desta correção. Nas strings de JSON, a apresentação
preserva o conteúdo de origem sem expor os escapes das aspas. Os caminhos das fontes são relativos a
`livros/ciclo-de-vida/`, salvo os que começam por `src/` ou `scripts/`.

## 1. `livros/ciclo-de-vida/capitulos/02-o-primeiro-agente.mdx`

**Antes**

> Pela nota, sim. Mas o decisor de 40% só devolve a decisão responder: não escreve resposta nem mostra compras. No R12, escolheu responder quando devia recusar, o que num atendimento poderia expor dados. Nesta execução, os 14 erros do agente foram passar a vez. É um comportamento conservador nestes casos, sem garantia de segurança geral: a régua mede decisões, não a qualidade das respostas. No capítulo 4, os erros passam a ter peso.

**Depois**

> Pela nota, sim. Pelo tipo de erro, não. O decisor de 40% escolheu responder no R12, onde a próxima coisa, num atendimento, seria mostrar a compra da Ana ao Bruno. Ele só devolve a decisão: não escreve resposta nem mostra compras. Este agente errou passando a vez, e uma pessoa da equipe resolveria. A nota conta os dois erros igual, e por isso ainda engana. No capítulo 4, os erros passam a ter peso.

**Fonte:** projeto/baseline.py: avaliar; saidas.json: sempre-responder e r02-medir; projeto/agente.py: passar; gravacoes/r02-medir.json.

## 2. `livros/ciclo-de-vida/capitulos/02-o-primeiro-agente.mdx`

**Antes**

> Nestes 20 casos, o agente quase sempre passou a vez. Os pedidos, o catálogo e a política estão em `dados/`, sem acesso pelo agente. As ferramentas do capítulo 3 dão esse acesso. A nota sobe? Que erros aparecem?

**Depois**

> Falta informação: os pedidos, o catálogo e a política estão em `dados/`, e o agente não tem como olhar. As ferramentas do capítulo 3 dão esse acesso. A nota sobe sem que ele troque o erro seguro pelo perigoso?

**Fonte:** projeto/agente.py: montar não consulta dados; gancho editorial solicitado pelo Erick.

## 3. `livros/ciclo-de-vida/capitulos/02-o-primeiro-agente.mdx`

**Antes**

> - Nesta execução com o GPT-6 Luna, sem dados da loja, o agente acertou 6 de 20 (30%) e passou a vez em 19 casos. A nota mede decisões, não garante segurança. As ferramentas dão acesso à informação.

**Depois**

> - Nesta execução com o GPT-6 Luna, o agente acertou 6 de 20 (30%) e errou para o lado seguro nestes casos, mas a régua só mede a decisão; falta informação, e ela vem com as ferramentas.

**Fonte:** saidas.json: r02-medir; gravacoes/r02-medir.json; projeto/baseline.py: avaliar; projeto/agente.py.

## 4. `livros/ciclo-de-vida/capitulos/00-introducao.mdx`

**Antes**

> o terminal mostra essas saídas quando você digita o comando do passo.

**Depois**

> o terminal mostra essas saídas quando você executa o comando do passo.

**Fonte:** src/components/livro/ide/IdeCapitulo.tsx: executar e botão executa pra mim; orientação editorial do Erick.

## 5. `livros/ciclo-de-vida/capitulos/00-introducao.mdx`

**Antes**

> Bibliotecas de inteligência artificial mudam. Essa conferência detecta divergências entre o projeto executado e o livro; não mede a qualidade atual do modelo no serviço externo. Na sua máquina, os comandos que chamam o modelo fazem chamadas reais, pagas, e podem produzir respostas diferentes.

**Depois**

> Bibliotecas de inteligência artificial mudam. Livro técnico costuma envelhecer em silêncio. Este foi feito para avisar quando envelhece. O aviso vale para o código e as bibliotecas, não para o modelo, cujas respostas são repetidas da gravação. Na sua máquina, os comandos que chamam o modelo fazem chamadas reais, pagas, e podem produzir respostas diferentes.

**Fonte:** scripts/saidas.py: com_gravacao e principal; projeto/medir.py; frases retomadas a pedido do Erick.

## 6. `livros/ciclo-de-vida/passos/01.json`

**Antes**

> Ainda não existe agente, mas já dá para medir um decisor. O mais simples possível: uma função que sempre devolve passar, sem escrever resposta nem consultar dados. A régua vai contar em quantos dos vinte casos essa decisão coincide com o contrato.

**Depois**

> Ainda não existe agente, mas já dá para medir um. O mais simples possível: um "agente" que passa toda pergunta para uma pessoa da equipe. Ele nunca erra feio: não inventa prazo, não mostra pedido alheio, não promete desconto. Mas também não ajuda ninguém.

**Fonte:** projeto/baseline.py: docstring e sempre_passar.

## 7. `livros/ciclo-de-vida/passos/01.json`

**Antes**

> Vinte e cinco por cento: cinco decisões certas em vinte. Esta é a nota de partida do livro, que cada agente vai tentar superar. Na variante RESPONDER, são oito acertos (40%), mas o R12 recebe a decisão errada. Essa função só devolve uma decisão: não escreve resposta nem expõe compras. Num atendimento, responder sobre pedido alheio poderia expor dados; a nota não mede essa consequência. O placar permite comparar decisões, mas não basta para julgar as respostas.

**Depois**

> Vinte e cinco por cento. Esta é a nota de partida do livro. Todo agente que você construir daqui para a frente tem que passar dela, senão é melhor mandar tudo para a equipe e desligar o agente. A partir daqui ela fica no placar, no canto de cima da página, e cada capítulo vai tentar empurrá-la.

**Fonte:** projeto/baseline.py; saidas.json: r01-nota-de-partida; src/layouts/Capitulo.astro: placar; texto retomado a pedido do Erick.

## 8. `livros/ciclo-de-vida/roteiros/01.json`

**Antes**

> A nota de partida usa uma função que sempre devolve passar. Ela não escreve resposta nem consulta dados: o que será medido é a decisão.

**Depois**

> A nota de partida usa uma função que sempre devolve passar. Ela nunca erra feio: não inventa prazo nem mostra pedido alheio, mas também não ajuda ninguém.

**Fonte:** projeto/baseline.py: docstring e sempre_passar. Evita repetir a explicação da variante RESPONDER nesta superfície.

## Verificação

A explicação de que o decisor não escreve resposta nem mostra compras ficou uma vez no texto, uma nos passos e
uma no roteiro. A ressalva sobre segurança geral ficou zero vezes no texto, uma nos passos e uma no roteiro.
`passos/02.json` e `roteiros/02.json` já respeitavam o limite e não precisaram mudar.

`npm run ritmo` terminou com código 0: os avisos continuam 3 na introdução, 2 no capítulo 1 e 0 no capítulo 2.
A faixa afetada da introdução passou de 355 para 366 palavras; o trecho final do capítulo 2 continuou com 186.
Nenhum trecho ultrapassou 400 palavras.

`npm test` terminou com código 0, usando as gravações existentes:

```text
[build] 9 page(s) built
conferidas 29 saídas: iguais às do livro
conferidas 16 saídas: iguais às do livro
ℹ tests 112
ℹ pass 112
ℹ fail 0
5 passed in 1.75s
```

Os trechos da introdução e do capítulo 2 foram conferidos no HTML montado; as falas dos passos 17 e 18 e a nota do
roteiro foram conferidas nos dados da IDE montada. `git diff --check` passou. Nenhum teste foi criado ou alterado.

