# Para o Erick — etapa 7, capítulo 2 com decisões na passagem

26/10/2026. Implementação concluída, **aguardando revisão do Erick**.

(redação: GPT-5)

## O que mudou

O quadro por ação já era compartilhado pelos capítulos: as 16 ações do capítulo 2 aparecem em 16 quadros nos três
modos, e os blocos de uma ação ficam juntos no guiado. Esta etapa não precisou mudar o componente.

Quatro confirmações depois de comandos viraram perguntas sobre o alcance da prova. Elas bloqueiam **Na minha IDE**
e **Aqui no livro**; a resposta do leitor já é a passagem. No modo direto, não aparecem. As duas apostas e a
variante `r02-medir-sem-regra` ficaram iguais.

Três fechos ganharam aviso de parada: grafo pronto, testes sem pagar e agente medido. O aviso não cria quadro nem
passagem.

## Contagem antes e depois

O resultado vem de `node scripts/contar-passagens-ide-capitulo-1.mjs 02`. “Antes” é a entrada desta etapa, quando o
quadro por ação já valia no capítulo 2; a base anterior, bloco a bloco, teria 38 passagens.

| Passo | Ações | Blocos extras já reunidos | Perguntas novas | Passagens antes | Passagens depois | Decisões antes | Decisões depois |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 1 | 0 | 0 | 2 | 2 | 1 | 1 |
| 2 | 1 | 2 | 0 | 2 | 2 | 1 | 1 |
| 3 | 2 | 0 | 0 | 3 | 3 | 0 | 0 |
| 4 | 1 | 1 | 0 | 2 | 2 | 0 | 0 |
| 5 | 1 | 3 | 0 | 2 | 2 | 1 | 1 |
| 6 | 2 | 2 | 1 | 3 | 2 | 3 | 4 |
| 7 | 3 | 0 | 1 | 4 | 3 | 1 | 2 |
| 8 | 2 | 1 | 1 | 3 | 2 | 1 | 2 |
| 9 | 1 | 0 | 0 | 2 | 2 | 1 | 1 |
| 10 | 2 | 3 | 1 | 3 | 2 | 2 | 3 |
| **Total** | **16** | **12** | **4** | **26** | **22** | **11** | **15** |

As 22 passagens são 10 pedidos e 12 confirmações de ação. As 15 decisões principais são 2 apostas, 2 perguntas de
bloco, 4 perguntas de saída, 6 comandos e 1 erro investigado. O modo direto permanece com 26 passagens e não mostra
as quatro perguntas. O mesmo script com `01` preserva a contagem aprovada: **79 → 53** passagens e **28 → 33**
decisões; modo direto em 58.

## As quatro perguntas para aprovação

### Passo 6 — o erro antes do grafo

(redação: GPT-5)

**Pergunta:** “Por que esta falha ainda não diz que o desenho do grafo está errado?”

1. “Porque um teste que falha não pode avaliar código de grafo.”
2. **Certa:** “Porque o falso parou na saída estruturada, antes de o teste inspecionar os nós.”
3. “Porque a LangGraph ignora erros produzidos por modelos falsos.”

**Porquê:** “A saída diz `with_structured_output is not implemented for this model`. Em `montar()`,
`modelo.with_structured_output(Escolha)` vem antes da montagem do `StateGraph`; o teste não chegou a inspecionar os
nós.”

**Fonte:** `r02-pytest-falso` em `saidas.json`; `montar()` em `projeto/agente.py`; o estado do passo 7 em
`roteiros/02.estados.json`, onde o único teste chama `montar(...).get_graph().nodes`.

### Passo 7 — o alcance do primeiro teste verde

(redação: GPT-5)

**Pergunta:** “O que este único teste verde sustenta — e o que ainda fica aberto?”

1. **Certa:** “Sustenta que os nós esperados existem; ainda não percorre os quatro caminhos.”
2. “Sustenta que o modelo de verdade escolherá a decisão certa.”
3. “Sustenta que cada caminho produz a resposta esperada.”

**Porquê:** “A saída traz `1 passed in`. Nesse momento, `test_agente.py` tem apenas
`test_o_grafo_tem_um_caminho_para_cada_decisao()`, que compara o conjunto de nós; os testes que invocam os caminhos
ainda não entraram.”

**Fonte:** `r02-pytest-um` em `saidas.json` e os estados 10 e 11 de `roteiros/02.estados.json`.

### Passo 8 — desenho não é inteligência

(redação: GPT-5)

**Pergunta:** “Por que os onze testes verdes ainda não provam que o modelo decide bem?”

1. “Porque testes sem internet não exercitam nenhuma parte do grafo.”
2. “Porque a régua precisaria ter mais de vinte referências para medir decisões.”
3. **Certa:** “Porque o falso devolve decisões combinadas; os testes conferem os caminhos, não escolhem por ele.”

**Porquê:** “A saída termina em `11 passed in`. Em `test_agente.py`, cada chamada a
`falso(decisao, *textos)` recebe a `Decisao` que devolverá; os testes exercitam o caminho escolhido, mas não testam
uma escolha feita pelo modelo.”

**Fonte:** `r02-pytest` em `saidas.json` e `falso()` mais os quatro testes do grafo em
`projeto/test_agente.py`.

### Passo 10 — o limite da régua

(redação: GPT-5)

**Pergunta:** “Qual conclusão fica fora desta régua, mesmo com a lista de 14 erros?”

1. “Se seis decisões coincidiram com a referência.”
2. **Certa:** “Se os textos entregues ao cliente têm boa qualidade.”
3. “Se o R12 recebeu uma decisão diferente do contrato.”

**Porquê:** “A saída traz `R12: o contrato pede recusar, o agente decidiu passar`. Em `medir.py`, o decisor guarda
somente `agente.invoke(...)["decisao"]`, e `avaliar()` compara essa decisão com a referência; o texto de `resposta`
não entra no placar.”

**Fonte:** `r02-medir` em `saidas.json`; `decidir()` em `projeto/medir.py`; `avaliar()` em
`projeto/baseline.py`.

As posições certas são **1, 0, 2, 1**: fixas nos dados, variadas e sem repetição consecutiva. Nenhuma pergunta usa
“molde” nem responde o que ele garante; essa comparação continua na seção 2.6.

## Paradas naturais

(redação: GPT-5)

| Depois do passo | Entrega dita pela IA | Tag de volta |
|---:|---|---|
| 5 | o agente em grafo, com um caminho para cada decisão do contrato | `cap-02/passo-05` |
| 8 | os testes do contrato e dos quatro caminhos do grafo, sem chamada paga | `cap-02/passo-08` |
| 10 | o primeiro agente medido pela régua das vinte perguntas | `cap-02/fim` |

## Página montada e capturas

O passo 5 registra a ação com mais blocos; no guiado, os quatro aparecem no mesmo quadro. O passo 8 registra a nova
pergunta nos dois modos guiados e sua ausência no direto. A inspeção foi feita em modo foco a 1120 px e num iframe
de 360 px, nos três modos.

| Modo | Passo 5 — computador | Passo 5 — celular | Passo 8 — computador | Passo 8 — celular |
|---|---|---|---|---|
| Na minha IDE | [captura](capturas/revisao-do-percurso-inicial-etapa-7/ide-passo-05-computador.png) | [captura](capturas/revisao-do-percurso-inicial-etapa-7/ide-passo-05-celular-360.png) | [captura](capturas/revisao-do-percurso-inicial-etapa-7/ide-passo-08-computador.png) | [captura](capturas/revisao-do-percurso-inicial-etapa-7/ide-passo-08-celular-360.png) |
| Aqui no livro | [captura](capturas/revisao-do-percurso-inicial-etapa-7/livro-passo-05-computador.png) | [captura](capturas/revisao-do-percurso-inicial-etapa-7/livro-passo-05-celular-360.png) | [captura](capturas/revisao-do-percurso-inicial-etapa-7/livro-passo-08-computador.png) | [captura](capturas/revisao-do-percurso-inicial-etapa-7/livro-passo-08-celular-360.png) |
| Direto | [captura](capturas/revisao-do-percurso-inicial-etapa-7/direto-passo-05-computador.png) | [captura](capturas/revisao-do-percurso-inicial-etapa-7/direto-passo-05-celular-360.png) | [captura](capturas/revisao-do-percurso-inicial-etapa-7/direto-passo-08-computador.png) | [captura](capturas/revisao-do-percurso-inicial-etapa-7/direto-passo-08-celular-360.png) |

Não houve corte da janela da IDE nem passagem entre blocos. No passo 8, **Na minha IDE** executa a saída gravada;
**Aqui no livro** exige o comando antes da pergunta; o direto mostra comando e saída sem perguntar.

## Verificação executada

```text
$ node scripts/contar-passagens-ide-capitulo-1.mjs 01
Antes/depois: 79 → 53 passagens mecânicas nos modos guiados; 28 → 33 decisões principais. O modo direto permanece em 58 passagens.

$ node scripts/contar-passagens-ide-capitulo-1.mjs 02
O quadro por ação já reduzia a base de 38 para 26 passagens. Nesta etapa: 26 → 22 passagens mecânicas nos modos guiados; 11 → 15 decisões principais. O modo direto permanece em 26 passagens.

$ npm run saidas:conferir
conferidas 30 saídas: iguais às do livro

$ npm run leitor
conferidas 30 saídas: iguais às do livro

$ npm test
30 saídas do livro e 16 dos experimentos conferidas
123 testes do livro passaram
5 testes da gravação passaram
```

Não houve chamada paga, mudança de saída, mudança nas tags, publicação, túnel nem uso de chave.
