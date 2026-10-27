# Para o Erick — temperatura zero, etapa 2

Primeira versão do projeto e do experimento construído pela IDE. (redação: gpt-6.1-sol)

## O que mudou

O leitor constrói a conversão binary16, muda a ordem das somas, investiga uma asserção que falha, controla a margem
e implementa um comparador de sequências. Depois valida e mede uma coleta real. O coletor e os testes completos
são fornecidos com o projeto; a IDE identifica o que foi copiado e o que o leitor escreveu.

A escolha de execução aparece nas instruções da própria IDE e no README: CPU é o caminho padrão; CUDA é opcional,
com dependências separadas. O site reanalisa a captura CPU identificada. Nenhuma coleta GPU é apresentada como
realizada, e o navegador não executa um LLM ao avançar o chat.

O mapa inicial usa o Remotion já instalado no repositório: cinco cenas, vinte segundos, controle manual, sem áudio
ou reprodução automática. A mesma explicação aparece como lista estática no modo direto, em movimento reduzido e
sem JavaScript. O mapa é um esquema do mecanismo; não finge medir a organização interna de um kernel.

As árvores numéricas animadas, o controle visual da margem e o comparador visual completo continuam na etapa 3.
Nesta etapa, a margem já pode ser modificada pelo mecanismo `variar` da IDE, com execução e saída reais.

## Coleta e alcance

Resultado real: **90 de 90 (100%)** respostas-alvo iguais às referências. Cada condição deu dez de dez, com uma
sequência única por pergunta e lote. Não houve divergência observada neste modelo/ambiente. A conclusão preserva
esse resultado; não foi procurado outro prompt para fabricar o efeito desejado.

```text
$ HF_HOME=/tmp/temperatura-zero-hf uv run --extra modelo python coletar.py cpu coleta-cpu.json
loja lote=1 repetição=1
... cada condição executada dez vezes ...
livre lote=16 repetição=10

$ python3 medir.py coleta-cpu.json
Leitura da coleta: cpu
modelo: Qwen/Qwen3-0.6B
revisão: c1899de289a04d12100db370d81485cdf75e47ca
loja, lote 1: 10/10 iguais; 1 sequência(s) única(s)
loja, lote 4: 10/10 iguais; 1 sequência(s) única(s)
loja, lote 16: 10/10 iguais; 1 sequência(s) única(s)
fato, lote 1: 10/10 iguais; 1 sequência(s) única(s)
fato, lote 4: 10/10 iguais; 1 sequência(s) única(s)
fato, lote 16: 10/10 iguais; 1 sequência(s) única(s)
livre, lote 1: 10/10 iguais; 1 sequência(s) única(s)
livre, lote 4: 10/10 iguais; 1 sequência(s) única(s)
livre, lote 16: 10/10 iguais; 1 sequência(s) única(s)
iguais à referência: 90 de 90 (100%)
Repetição não mede se a resposta está certa.
```

CPU identificada separadamente como **Intel i7-1355U**, com doze threads de hardware e quatro usadas pelo PyTorch.
`platform.processor()` retornou vazio; a identificação foi anotada junto da coleta em `procedencia.json`, que também
guarda os SHA-256 da captura e do coletor executado. Ambiente: Python 3.13.13, Linux x86_64, atenção eager, float32.
A captura terminou às 21h22 de 26/10/2026 em São Paulo (`2026-10-27T00:22:58.470725+00:00` no arquivo).

Geração: **1.002,7918 s**; carregamento dos pesos já em cache: **1,4916 s**. Aquecimento fica fora do relógio da
geração; o download inicial gratuito, de cerca de 1,5 GB, não foi cronometrado. RAM de pico não foi medida. O custo
é desta rodada, sob a carga desta máquina; não foi apresentado como benchmark universal.

Uma resposta de referência foi cortada pelo limite de 48 tokens e termina em “compromet”. A repetição preserva esse
final; não verifica completude nem correção. O texto usa esse achado real para explicar o alcance do placar.

O corpus foi fixado antes da coleta principal: uma situação da loja, uma continuação factual e uma resposta livre.
São dez repetições por pergunta nos lotes 1, 4 e 16, até 48 tokens novos, sempre no mesmo ambiente. O modelo é
`Qwen/Qwen3-0.6B`, revisão `c1899de289a04d12100db370d81485cdf75e47ca`, com Transformers 4.57.1 e PyTorch 2.8.0 em
CPU/float32. A primeira sequência de lote 1 de cada pergunta é a referência; os três controles entram no total de
noventa execuções. O medidor não possui gabarito factual.

O total do placar é de noventa respostas-alvo. Os lotes também geram 540 sequências de preenchimento: o custo da
rodada inclui esse trabalho, embora essas respostas não entrem no placar.

Os IDs de entrada do alvo precisam permanecer iguais entre os lotes, descontado o padding de entrada. A saída
preserva EOS e retira só o padding posterior. Os testes barram uma coleta com repetições faltando, amostragem ou
mudança dos IDs de entrada. O comparador detecta também uma sequência que termina antes.

### Achado durante a implementação

A primeira tentativa foi interrompida: o Transformers avisou que a configuração fornecida estava sendo completada
com padrões do modelo, incluindo `do_sample=True`. Ela não gerou arquivo final nem entrou no resultado publicado.
A chamada foi corrigida com `use_model_defaults=False`, `do_sample=False` e `num_beams=1` explícitos. A configuração
precisa indicar `greedy_search`; uma proteção também interrompe a rodada se `torch.multinomial` for chamado.

Essa correção foi conferida no código instalado de Transformers 4.57.1,
`transformers/generation/utils.py`, função `_prepare_generation_config`: os padrões do modelo podem preencher os
valores globais da configuração; argumentos da chamada têm prioridade. A configuração e a amostragem efetivas
precisam ser verificadas antes de atribuir uma diferença ao cálculo numérico.
[Documentação da geração](https://huggingface.co/docs/transformers/v4.57.1/en/main_classes/text_generation).

### O que falta na outra máquina

Erick informou um limite de 6 GB de VRAM. O caminho CUDA foi preparado, mas ainda faltam a execução real, a GPU
efetiva, o driver, a memória e o resultado registrados nessa máquina. O coletor desta versão usa Transformers;
não oferece nem alega ter medido o modo invariante do vLLM. Essa comparação adicional precisa de coleta própria.
Nenhuma taxa de divergência, ganho de desempenho ou garantia para essa GPU foi inventada.

## As perguntas de saída para revisão

As quatro perguntas abaixo são redação de modelo e precisam de revisão do Erick. A posição da resposta certa varia
nos dados e não há sorteio na página. (redação: gpt-6.1-sol)

1. **Depois da asserção:** “O que precisa ser revisto depois dessa falha?” Opções: “A regra de que esses cálculos são
   sempre equivalentes” (certa); “A seed que escolheu um dos valores”; “A instalação do modelo que respondeu errado”.
   Porquê: a asserção comparou 1024.0 e 1025.0; `somas` arredonda os intermediários e não usa sorteio nem modelo.
   Fonte: `numeros.py`, `tz-assert`.
2. **Depois dos controles:** “O que esse controle permite concluir?” Opções: “Ponto flutuante funciona como um
   sorteio”; “Mudar a ordem pode importar, mas repetição fixa pode permanecer estável” (certa); “Toda execução de LLM
   repetirá para sempre”. Porquê: mil chamadas deram o mesmo par; os inteiros deram 1026 nos dois lados.
   Fonte: `numeros.py`, `tz-controle`.
3. **Depois do fim antecipado:** “Por que a comparação não pode usar apenas zip?” Opções: “Porque zip normaliza o
   texto”; “Porque os IDs negativos significam o fim”; “Porque zip pararia na sequência menor e esconderia o fim
   antecipado” (certa). Porquê: o índice 1 de `[10, 20]` contra `[10]` não seria comparado por `zip` comum.
   Fonte: `comparar.py`, `tz-fim`.
4. **Depois da medida:** “Se todas as sequências desta amostra coincidirem, o que podemos afirmar?” Opções: “O modelo
   acertou as três perguntas”; “Neste ambiente e nesta amostra não observamos divergência” (certa); “Temperatura zero
   garante igualdade em qualquer servidor”. Porquê: `medir.py` só compara IDs com a referência de cada pergunta;
   não tem gabarito factual nem testa todos os ambientes. Fonte: `medir.py`, `tz-medida`.

As falas dos passos, dúvidas, notas e texto da página também são redação de modelo. A opinião dos autores permanece
reservada com `Pendente`; nenhuma experiência foi atribuída a eles. (redação: gpt-6.1-sol)

## Verificação e capturas

```text
$ python3 -m unittest -q
Ran 9 tests
OK

$ python3 scripts/saidas.py experimentos/temperatura-zero
gravadas 15 saídas em experimentos/temperatura-zero/saidas.json e 1 roteiro(s) com os estados
```

O roteiro tem 15 passos, 26 ações, 14 comandos de base e uma variante. O teste reconstrói a IDE e conta as linhas
novas de Python escritas por passo: `0, 4, 5, 0, 0, 4, 5, 8, 8, 0, 0, 13, 10, 0, 0`. O máximo é 13. Os arquivos
fornecidos por cópia (coletor, testes e validador) ficam identificados como tal; não são apresentados como código
que o leitor digitou por esses passos.

O primeiro `npm test` identificou “rodada” no texto, palavra barrada pelo teste de vocabulário. Os trechos do
experimento foram corrigidos para “coleta”, sem alterar os testes. A execução seguinte passou com **168 testes do
site e 5 da gravação**, e 30 + 16 + 15 saídas conferidas. Os ajustes visuais posteriores do mapa também passaram
pelo build e pelos cinco testes específicos do experimento.

A verificação final completa, já com os controles externos do mapa e as instruções CPU/GPU em todos os modos,
passou novamente:

```text
$ npm test
10 page(s) built
conferidas 30 saídas: iguais às do livro
conferidas 16 saídas: iguais às do livro
conferidas 15 saídas: iguais às do livro
tests 168
pass 168
fail 0
5 passed in 2.31s
```

### Ritmo

`npm run ritmo`: nenhum aviso no experimento. O mapa não conta como ação, pois assistir não pede decisão.

| Trecho até a próxima ação | Palavras |
|---|---:|
| Abertura → investimento | 79 |
| O que vamos construir → pare e pense | 97 |
| Uma prova de cada vez → pare e pense | 81 |
| Mão na massa → IDE | 57 |
| Depois da IDE → pare e pense | 176 |
| O que esta medida não resolve → fim | 136 |

### Página montada

Percurso até o passo 15 nos três modos, no computador e em iframe de 390 px (375 px de área útil depois da barra
de rolagem). Nenhum transbordamento horizontal da página: 1425/1425 px no computador e 375/375 px no celular.
No modo “aqui no experimento”, os comandos foram preenchidos no campo e enviados com Enter; no direto, não houve
perguntas. Também foram capturadas a asserção real do passo 4 e a pergunta sobre o resultado do passo 13.

| Captura | Computador | Celular |
|---|---|---|
| Na minha IDE, fim | [imagem](capturas/temperatura-zero-etapa-2/ide-fim-computador.png) | [imagem](capturas/temperatura-zero-etapa-2/ide-fim-celular.png) |
| Aqui no experimento, fim | [imagem](capturas/temperatura-zero-etapa-2/livro-fim-computador.png) | [imagem](capturas/temperatura-zero-etapa-2/livro-fim-celular.png) |
| Modo direto, fim | [imagem](capturas/temperatura-zero-etapa-2/direto-fim-computador.png) | [imagem](capturas/temperatura-zero-etapa-2/direto-fim-celular.png) |
| Asserção e pergunta | [imagem](capturas/temperatura-zero-etapa-2/erro-computador.png) | [imagem](capturas/temperatura-zero-etapa-2/erro-celular.png) |
| Medida e pergunta | [imagem](capturas/temperatura-zero-etapa-2/medida-computador.png) | [imagem](capturas/temperatura-zero-etapa-2/medida-celular.png) |
| Mapa Remotion | [imagem](capturas/temperatura-zero-etapa-2/mapa-computador.png) | [imagem](capturas/temperatura-zero-etapa-2/mapa-celular.png) |

[Mapa estático, modo direto e movimento reduzido](capturas/temperatura-zero-etapa-2/mapa-estatico.png).
Na revisão visual, os controles padrão do Player cobriam a última etapa em telas pequenas; foram substituídos por
botões fora do desenho. A animação permanece Remotion, com reprodução e pausa manuais, reinício e sem áudio.

Conferência adicional no navegador: sem autoplay, reprodução avançando para a segunda cena, pausa mantendo o
quadro, reinício retornando à primeira cena e preferência de movimento reduzido removendo o Player em favor da
lista estática. Todos passaram.

### Trabalho em paralelo

Outra sessão trabalhou nas dinâmicas do capítulo 1 durante esta etapa. O commit `d20bc16` incluiu, junto de sua
própria classificação, a linha `MapaTemperatura: false` que eu havia acrescentado em `scripts/ritmo.mjs`. Essa
classificação já está no histórico; não foi revertida nem duplicada. Os arquivos e mudanças do capítulo 1 não
integram o commit desta entrega.

(redação: gpt-6.1-sol)
