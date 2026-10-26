# Para o Erick — correção da etapa 5

26/10/2026. Revisão sem ok; etapa 5 **aguardando revisão**. Base da correção: `3ccfdf5`. Não houve chamada paga.

(redação: GPT-6)

## Glosas da aposta

**Antes:** as opções mostravam somente o nome da fase. Quem investia antes do mapa ainda não sabia o que cada nome
queria dizer.

**Depois:** `onde-se-pega.json` define uma glosa única por fase usada nas opções:

| Fase | Glosa | Palavras |
|---|---|---:|
| Planejar | Define o que o agente deve fazer. | 7 |
| Quando dá errado | Investiga a causa e evita que volte. | 7 |
| Evoluir | Compara mudanças antes de trocar. | 5 |
| Avaliar | Mede melhora e tipos de erro. | 6 |
| Observar | Mostra o que aconteceu em cada conversa. | 7 |
| Pôr no ar | Leva o agente além da sua máquina. | 7 |
| Construir | Define o caminho e o acesso ao sistema. | 8 |

As frases condensam as perguntas e os ganhos das mesmas fases em `figuras/ciclo.json`. `Aposta.astro` mostra a
segunda linha somente quando os dados fornecem `glosas`; nenhuma opção aparece marcada antes da escolha. No
computador, as três opções ficaram lado a lado. A 360 px, ficaram uma por linha, sem corte ou estouro horizontal.
As outras apostas continuam sem glosa.

## Por que o agente precisa do contrato

**Antes**

> No agente, o modelo escolhe o caminho e pode escrever uma frase diferente a cada vez. Por isso o contrato deste
> livro fixa decisões, não frases: as palavras podem variar; a decisão, não.

**Depois**

> Um agente precisa de contrato mais do que uma rotina comum. Numa função escrita à mão, o caminho está no código;
> no agente, o modelo escolhe o caminho a cada pergunta. Por isso o contrato deste livro fixa decisões, não frases:
> as palavras podem variar; a decisão, não.

O “Por isso” volta a se apoiar na diferença entre o caminho fixado pelo código e o caminho escolhido pelo modelo.

## Casos sem nomes na introdução

### Primeiro pare e pense

**Antes**

> No mapa, Avaliar vem depois de Construir. Por que, então, o capítulo 1 já decide o que fazer quando o Bruno pede o
> pedido da Ana, antes de existir agente?

**Depois**

> No mapa, Avaliar vem depois de Construir. Por que, então, o capítulo 1 já decide o que fazer quando um cliente pede
> o pedido de outra pessoa, antes de existir agente?

### Segundo pare e pense

**Antes**

> Responder uma que devia passar. O primeiro custa o tempo de uma pessoa da equipe; o segundo pode tentar responder
> ao Bruno sobre o pedido da Ana e expor dados de outra pessoa. Por isso, no capítulo 4, os erros passam a ter peso.

**Depois**

> Responder uma que devia passar. O primeiro custa o tempo de uma pessoa da equipe; o segundo pode tentar responder
> a um cliente sobre o pedido de outra pessoa e expor dados dela. Por isso, no capítulo 4, os erros passam a ter peso.

A explicação revelada pela aposta também passou de “o Bruno pede o pedido da Ana” para “o pedido de outra pessoa”.
Bruno e Ana ficam para o capítulo 1.

## “Um livro que executa”

**Antes:** a gravação aparecia em três formulações: as saídas tinham sido gravadas executando o código; as respostas
do modelo eram repetidas das gravações; e o aviso de envelhecimento não valia para o modelo porque suas respostas
eram repetidas da gravação.

**Depois**

> Na página, você avança o código, prevê, compara caminhos e explora no terminal as saídas do projeto. Na sua
> máquina, escreve o código e executa os comandos.
>
> Por trás disso há uma regra: o livro não pode mentir. Código e saídas vêm do projeto real. A conferência executa os
> comandos de novo e compara o resultado com o gravado, ignorando variações como tempo e caminho. As respostas do
> modelo são repetidas da gravação, sem chamar o serviço; se faltar gravação ou algo divergir, a conferência falha.
>
> Bibliotecas de inteligência artificial mudam. Livro técnico costuma envelhecer em silêncio. Este foi feito para
> avisar quando envelhece: o aviso vale para o código e as bibliotecas. Na sua máquina, os comandos que chamam o
> modelo fazem chamadas reais, pagas, e podem responder diferente da gravação.

A repetição da gravação é dita uma vez. Permanecem distintos o código executado novamente na conferência e a chamada
real, paga e variável na máquina do leitor.

## “Como ler”

**Antes:** a seção explicava os dois pontos de partida em um parágrafo longo, repetia IDE e terminal, dedicava três
frases ao comportamento de `git checkout` e descrevia os exercícios em duas formulações.

**Depois**

> Leia em ordem. Escreva o código e compare as saídas: fazer revela o que ainda não entendeu.
>
> Comece numa pasta vazia no capítulo 1 ou **por uma tag**: `git clone
> https://github.com/Erick-Marinho/atendimento-bemtevi`, `cd atendimento-bemtevi` e `git checkout cap-02/inicio` — ou
> a tag indicada.
>
> Leia com a IDE e o terminal abertos. Não é gosto dos autores: a pesquisa mostra que fazer, prever antes de executar
> e errar com correção ensinam mais que ler ou assistir. O lembrete no canto fica por isso.
>
> Ative **Modo direto** na engrenagem: código, saídas e respostas ficam abertos, sem o passo a passo.

O ponto de volta ficou em uma frase:

> No clone, `git checkout` recupera os arquivos versionados da tag, preserva os pessoais não rastreados e para diante
> de conflitos.

O exercício ficou em uma frase:

> No capítulo 1, confira testes, notas e totais; no 2, compare decisões e justifique a mudança. O enunciado traz o
> critério de conclusão.

## Palavras e testes

`npm run ritmo`, comparando todos os trechos com aviso na introdução e no capítulo 1:

| Trecho | Antes | Depois |
|---|---:|---:|
| Introdução — Por que este livro existe → PareEPense | 366 | 294 |
| Introdução — O que você vai construir → PareEPense | 246 | 246 |
| Introdução — Como ler → fim | 323 | 209 |
| Capítulo 1 — 1.7 O que ficou de pé → Exercício | 214 | 214 |

O começo de 1.4, que não está mais entre os avisos, passou de 145 para 160 palavras até a primeira ação.

`npm test`:

```text
conferidas 30 saídas: iguais às do livro
conferidas 16 saídas: iguais às do livro
tests 116
pass 116
fail 0

.....                                                                    [100%]
5 passed in 1.30s
```

Na página montada, foram conferidos a aposta com glosas no computador e a 360 px, os dois pare e pense, a introdução
enxugada e 1.4. Estado: **aguardando revisão do Erick**.
