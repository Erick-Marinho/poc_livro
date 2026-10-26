# Para o Erick — correção da etapa 4

26/10/2026. Revisão sem ok; etapa 4 **aguardando revisão**. Base da correção: `5b0e223`. Não houve nova chamada
paga.

(redação: GPT-6)

## Antes e depois

### Endereço e pontos de volta

**Antes:** `passos/01.json` e `passos/02.json` não tinham `repositorio`. A IDE escondia todos os pontos de volta;
o teste do capítulo 2 precisava acrescentar um endereço fictício para provar que a tag ainda seria montada.

**Depois:** os dois arquivos voltaram a ter:

```json
"repositorio": "https://github.com/Erick-Marinho/atendimento-bemtevi"
```

O teste usa o endereço dos próprios arquivos e confere `cap-01/passo-04` no capítulo 1 e `cap-02/inicio` no 2.
Continua provando também que, sem a propriedade, o ponto não aparece.

Na página montada, o segundo passo do capítulo 1 mostrou:

> Perdeu o ritmo? `git checkout cap-01/passo-01` traz o projeto como estava no começo deste passo, no clone de github.com/Erick-Marinho/atendimento-bemtevi.

O link apontou para `https://github.com/Erick-Marinho/atendimento-bemtevi`. O remoto não foi acessado nem publicado.

### Introdução: clone e Pendente

**Antes**

> Quando o endereço for publicado, substitua `ENDERECO` em `git clone ENDERECO atendimento-bemtevi` [...] Hoje esse repositório só existe localmente; o endereço ainda está pendente.

> Endereço do repositório do leitor: quando os autores publicarem

**Depois**

> **Por uma tag:** clone as versões preparadas pelos autores com `git clone https://github.com/Erick-Marinho/atendimento-bemtevi`, entre com `cd atendimento-bemtevi` e use `git checkout` com a tag indicada pelo ponto de volta — por exemplo, `git checkout cap-02/inicio` para o começo do capítulo 2.

> Publicar o repositório do leitor no endereço acima antes de o livro ir para leitores

O texto agora é o definitivo que o leitor receberá; a publicação continua sendo uma tarefa dos autores, fora desta
etapa.

### Pontos de partida

**Antes**

> Ponto de partida: uma pasta vazia; o projeto nasce na seção 1.6. As tags de recuperação pertencem ao repositório do leitor, cujo endereço está pendente na introdução.

> Ponto de partida: o projeto como o capítulo 1 terminou. Para recuperá-lo por cap-02/inicio, use um clone do repositório do leitor; o endereço está pendente na introdução.

**Depois**

> Ponto de partida: uma pasta vazia.

> Ponto de partida: o projeto como o capítulo 1 terminou.

### Nota “leia com a IDE aberta”

**Antes**

> Prever antes de executar e errar com correção ensinam mais do que só acompanhar a página.

**Depois:** voltou integralmente o texto anterior à etapa 4:

> Este livro rende mais lido ao lado de uma IDE, com o projeto aberto e o terminal à mão. Não é gosto dos autores: a pesquisa sobre aprendizagem mostra que fazer, prever antes de executar e errar com correção ensinam mais do que só ler ou assistir. O lembrete no canto de cima da página fica lá por isso.

O botão “Por que isso funciona” permaneceu. A frase nova que localiza **Modo direto** também foi mantida.

### Ordem do plano

**Antes:** a etapa 2 previa uma leitura antes das etapas seguintes, e a etapa 8 previa uma nova leitura para
comparação. As etapas 5 a 7 dependiam da observação. “Defeitos de aparelho” ainda citava um exemplo de iPad já
resolvido.

**Depois:** a etapa 2 registra somente a preparação já aprovada do kit. As etapas 5 a 7 seguem sem esperar
observação. A etapa final contém a única leitura: Victor, coautor, revisa e lê com `docs/leituras/`, e sua ficha o
marca como `autor`. A “nova leitura” deixou de existir e o exemplo do iPad saiu; o kit não mudou.

O plano registra ainda que o endereço foi decidido em 26/10/2026, mas não publicado, e que publicar pertence ao
Erick fora desta etapa.

### Registro da etapa 4

**Antes:** a coluna Commit continha a mensagem “Revisão do percurso inicial, etapa 4: recuperação e exercício sem
chave”.

**Depois:** a coluna contém o hash `5b0e223`. O estado continua **aguardando revisão**.

## Verificação

`npm run ritmo`:

```text
introdução: 3 avisos
capítulo 1: 2 avisos
capítulo 2: 0 avisos
Como ler: 323 palavras; abaixo do limite de falha de 400
```

`npm run saidas:conferir`, somente com as gravações existentes:

```text
conferidas 30 saídas: iguais às do livro
```

`npm test`:

```text
conferidas 30 saídas: iguais às do livro
conferidas 16 saídas: iguais às do livro
tests 115
pass 115
fail 0

.....                                                                    [100%]
5 passed in 2.74s
```

Na página montada, foram conferidos o clone definitivo, o `Pendente`, a nota restaurada, **Modo direto** e o ponto
de volta com a tag e o endereço. Estado: **aguardando revisão do Erick**.
