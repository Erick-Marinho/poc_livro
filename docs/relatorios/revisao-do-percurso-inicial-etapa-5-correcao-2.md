# Para o Erick — segunda correção da etapa 5

26/10/2026. Revisão sem ok; etapa 5 **aguardando revisão**. Base: `877fbdb`. Não houve chamada paga.

(redação: GPT-6)

## Glosas

**Antes**

| Fase | Glosa |
|---|---|
| Planejar | Define o que o agente deve fazer. |
| Quando dá errado | Investiga a causa e evita que volte. |
| Evoluir | Compara mudanças antes de trocar. |
| Avaliar | Mede melhora e tipos de erro. |
| Observar | Mostra o que aconteceu em cada conversa. |
| Pôr no ar | Leva o agente além da sua máquina. |
| Construir | Define o caminho e o acesso ao sistema. |

“Melhora” repetia “melhora” na pergunta sobre a versão nova e atraía a escolha para Avaliar.

**Depois**

| Fase | Glosa |
|---|---|
| Planejar | Define tarefas e limites do agente. |
| Quando dá errado | Investiga causas, impedindo reincidências. |
| Evoluir | Compara mudanças antes de trocar. |
| Avaliar | Mede acertos atuais. |
| Observar | Revela conversas, tempo e custo. |
| Pôr no ar | Leva agentes além da máquina local. |
| Construir | Define caminhos, ferramentas, acessos ao sistema. |

As novas frases condensam as perguntas e os ganhos de `figuras/ciclo.json` sem usar “melhora”. O teste normaliza
acentos e exige que nenhuma das sete glosas repita qualquer palavra da pergunta em que aparece.

## “Por que este livro existe” e “Um livro que executa”

**Antes**

> Trabalhamos com isso e sentíamos falta de um livro em português que acompanhasse um agente antes, durante e depois
> de ir para o ar, com código real. Como não achamos, resolvemos escrever.

> Na página, você avança o código, prevê, compara caminhos e explora no terminal as saídas do projeto. Na sua
> máquina, escreve o código e executa os comandos.

**Depois**

> Nós dois trabalhamos com isso no dia a dia, e sentíamos falta de um livro em português que acompanhasse um agente
> antes, durante e depois de ir para o ar, com código real. Como não achamos, resolvemos escrever.

> Este não é um livro para só ler. Na página, você avança o código, prevê, compara caminhos e explora no terminal as
> saídas do projeto. Na sua máquina, escreve o código e executa os comandos.

## “Como ler”

**Antes**

> Comece numa pasta vazia no capítulo 1 ou **por uma tag**: `git clone
> https://github.com/Erick-Marinho/atendimento-bemtevi`, `cd atendimento-bemtevi` e `git checkout cap-02/inicio` — ou
> a tag indicada.

> **Ponto de volta:** no clone, `git checkout` recupera os arquivos versionados da tag, preserva os pessoais não
> rastreados e para diante de conflitos.

**Depois**

> **Do zero**, no capítulo 1, você começa numa pasta vazia e constrói o projeto na IDE.

> **Por uma tag**, você clona uma versão pronta com `git clone
> https://github.com/Erick-Marinho/atendimento-bemtevi`, entra nela com `cd atendimento-bemtevi` e usa a tag indicada
> pelo ponto de volta, como em `git checkout cap-02/inicio`.

> **Ponto de volta:** troca o projeto pela versão daquele ponto, mantém os seus arquivos à parte, como
> `meus-casos.jsonl`, e para com um aviso antes de apagar uma mudança sua.

Na cópia do repositório gerado por `npm run leitor`, o antes e o depois observados foram:

```text
antes da troca para cap-02/inicio:
tag cap-01/fim; meus-casos.jsonl fora do Git

depois da troca:
tag cap-02/inicio; ?? meus-casos.jsonl

antes da tentativa de ir a cap-02/fim:
 M pyproject.toml
?? meus-casos.jsonl

depois da tentativa:
error: Your local changes to the following files would be overwritten by checkout:
        pyproject.toml
Aborting
tag cap-02/inicio; a mudança e meus-casos.jsonl permaneceram
```

## Palavras e testes

`npm run ritmo`:

| Trecho | Antes | Depois |
|---|---:|---:|
| Por que este livro existe → Aposta | 76 | 76 |
| Por que este livro existe → primeiro Pare e pense | 294 | 308 |
| Como ler → fim | 209 | 239 |

As glosas fazem parte da ação e não entram no relógio. A abertura continua abaixo de 319 e “Como ler” fica em cerca
de 240 palavras.

`npm test`:

```text
conferidas 30 saídas: iguais às do livro
conferidas 16 saídas: iguais às do livro
tests 116
pass 116
fail 0

.....                                                                    [100%]
5 passed in 1.24s
```

Estado depois dos três ajustes: **aguardando revisão do Erick**.
