# Para o Erick — revisão do gráfico de “O que vamos construir”

Correção da etapa 2, ainda sem ok. (redação: gpt-6.1-sol)

## Antes e depois

**Antes:** cinco nomes em uma lista, com o item da vez destacado. A figura dizia que uma mudança nas pontuações
poderia mudar o próximo token, mas o leitor precisava imaginar os valores, a comparação e a volta à entrada.

**Depois:** a mesma entrada se divide em duas execuções. As duas ordens de soma aparecem, seguidas de barras para
as alternativas A e B. A escala é a mesma em todas as comparações. A figura pausa antes da escolha e o leitor
prevê se as duas execuções escolherão o mesmo token. Depois vê o vencedor destacado e o token entrando no próximo
cálculo. Pode conferir o caso com B à frente, em que a pontuação de A muda sem trocar a escolha.

O gráfico substitui o pare e pense de mesma pergunta que vinha logo depois dele. `MapaTemperatura` agora conta
como ação no ritmo, pois exige a previsão; assistir ou clicar em próxima, por si só, não ganhou essa classificação.
O texto imediatamente depois da figura liga a comparação à construção na IDE.

## Fonte de cada valor

`figuras/mapa.py` importa `somas` e `escolher` do `projeto/numeros.py`. O resultado é gravado por
`python3 scripts/saidas.py experimentos/temperatura-zero` e conferido novamente pelo build de testes.
A figura recebe o JSON bruto da saída `tz-mapa`; a montagem recusa barras e vencedores incompatíveis.

| Condição | Execução | Soma guardada | A = soma − 1024 | B fixo | Escolha |
|---|---|---:|---:|---:|---|
| Disputa apertada | 1, soma da esquerda | 1024 | 0 | 0,5 | B |
| Disputa apertada | 2, soma da direita | 1025 | 1 | 0,5 | A |
| B com folga | 1, soma da esquerda | 1024 | 0 | 2 | B |
| B com folga | 2, soma da direita | 1025 | 1 | 2 | B |

O eixo comum vai de zero a dois. Uma barra de valor zero tem largura zero; a de um ocupa metade do eixo, mesmo
quando a outra vale 0,5. A pergunta sobre pedido e os nomes “token A/B” ilustram o mecanismo; não são uma inferência
observada. A origem dos valores e esse limite aparecem na própria figura e na legenda.

A captura real do Qwen e seu resultado de 90/90 permaneceram intactos. Nenhum novo modelo foi executado. O gráfico
não atribui o exemplo a um kernel, lote ou placa real.

## Aprendizado e interação

- Seis cenas de quatro segundos: entrada, ordens de cálculo, barras, escolha, próxima entrada e comparação.
- Reprodução e pausa manuais, navegação por cenas e reinício. O avanço para a escolha espera uma previsão, inclusive
  quando o leitor usa “Próxima”. A resposta recebe explicação a partir dos valores, acertando ou não.
- Duas condições; mudar para “B com folga” reinicia a previsão e preserva a escala.
- No desktop, as execuções ficam lado a lado; no celular, empilhadas com tipografia própria, em vez de reduzir
  uma tela de desktop até o texto ficar miúdo.
- Modo direto, preferência de movimento reduzido e ausência de JavaScript mostram os dois resultados completos,
  com barras e texto equivalentes. A preferência é acompanhada se mudar durante a visita.
- Descrição textual acompanha a cena e os valores, com retorno anunciado depois da previsão. Os controles são
  botões nativos, com foco visível. Não há áudio ou autoplay.

As perguntas, legendas e explicações são redação de modelo; não representam uma opinião ou experiência inventada
dos autores. (redação: gpt-6.1-sol)

## Verificação

O teste específico recalcula o rastro Python, compara as oito larguras de barra com a escala comum, recusa escolhas
e dados inconsistentes e confere a barreira antes da previsão. Os sete testes do experimento passaram.

```text
$ npm test
10 page(s) built
conferidas 30 saídas: iguais às do livro
conferidas 16 saídas: iguais às do livro
conferidas 16 saídas: iguais às do livro
tests 173
pass 173
fail 0
5 passed in 2.10s
```

A execução completa acima foi feita em `/tmp/temperatura-mapa-verificacao.YIuYwA`: cópia do commit `e24bbe0` mais
somente esta revisão. Na pasta compartilhada, uma tentativa de build perdeu um módulo temporário durante a troca
de `dist` pelo servidor já ativo; outra pegou a introdução sendo substituída pela outra sessão e os testes antigos
daquela figura. Nenhuma dessas mudanças foi alterada para fazer a suíte passar. A cópia isolada não usa o `dist`
compartilhado nem o conteúdo ainda em andamento da introdução.

Depois que a outra sessão concluiu sua troca da introdução (`86bc679` e registro `fea6db0`), a suíte também passou
na pasta compartilhada: **173 testes do site e 5 da gravação**, novamente com 30 + 16 + 16 saídas conferidas
(`5 passed in 1.90s`). A classificação do mapa no ritmo foi a única alteração desta entrega nos arquivos
compartilhados de ritmo; os commits e arquivos da introdução não integram esta correção.

`npm run ritmo`: nenhum aviso no experimento. Na seção alterada, antes havia 97 palavras até o pare e pense;
agora são 46 até a previsão do mapa e 167 até o pare e pense seguinte. Os demais trechos têm 79, 57, 176 e 136
palavras, como antes. O contador reconhece a previsão concreta do gráfico como ação.

No navegador, computador (1425 px úteis) e iframe de celular (375 px úteis dentro de 390 px): sem transbordamento
horizontal; pausa antes do vencedor, previsão, contraste e controle, reinício, reprodução e pausa passaram. As
versões direto e movimento reduzido também foram verificadas no celular, com os dois casos estáticos.
Alternar para o direto no meio da previsão e voltar manteve o ponto de parada e a pergunta pendente nas duas
larguras.

| Estado | Computador | Celular |
|---|---|---|
| Antes da escolha, aguardando previsão | [imagem](capturas/temperatura-zero-mapa/antes-da-escolha-computador.png) | [imagem](capturas/temperatura-zero-mapa/antes-da-escolha-celular.png) |
| A escolha muda | [imagem](capturas/temperatura-zero-mapa/escolha-muda-computador.png) | [imagem](capturas/temperatura-zero-mapa/escolha-muda-celular.png) |
| A escolha se repete | [imagem](capturas/temperatura-zero-mapa/escolha-repete-computador.png) | [imagem](capturas/temperatura-zero-mapa/escolha-repete-celular.png) |

[Modo direto](capturas/temperatura-zero-mapa/direto-celular.png) ·
[Movimento reduzido](capturas/temperatura-zero-mapa/movimento-reduzido-celular.png).

Esta correção se concentra no mapa inicial. A etapa 3 completa, com árvores de arredondamento e comparador de
tokens, não foi iniciada; a etapa 2 permanece aguardando revisão.

(redação: gpt-6.1-sol)
## Correção do servidor de desenvolvimento — 26/10/2026

(redação: gpt-6.1-sol)

O Erick encontrou `Cannot read properties of undefined (reading 'tz-mapa')`. Reproduzido em
`http://localhost:4321/experimentos/temperatura-zero/`: a resposta começava com status 200, mas terminava antes
do corpo do experimento. Conferir só o status HTTP não detectava a quebra.

O log do servidor (`/tmp/poc_livro-dev.log`) registrou `ENOSPC: System limit for number of file watchers reached`
ao acompanhar `experimentos/temperatura-zero/projeto/.venv/lib/python3.13/site-packages/functorch/`. O servidor
continuava usando o MDX antigo, com a chamada do mapa sem `saidas`, enquanto o componente já exigia esse argumento.
Servidores iniciados depois e o build montavam a página completa.

A configuração do Vite agora exclui da monitoração `.venv`, `__pycache__`, `.leitor` e `.tunel`, em qualquer nível.
O conteúdo, os componentes e as gravações continuam acompanhados. O proxy da landing foi preservado. O teste novo
usa o monitor de arquivos real: verifica que as pastas geradas ficam de fora e que alterações em `experimento.mdx`
e `saidas.json` produzem eventos. Nenhum valor substituto ou saída inventada foi acrescentado ao mapa.

Evidência depois da atualização e do reinício automático do servidor:

- A mesma rota em 4321 entrega o gráfico, os dados atuais e o documento até `</html>`.
- Uma marca temporária no MDX apareceu na página sem reiniciar; sua remoção também foi detectada. Arquivo restaurado.
- Chrome no servidor de desenvolvimento: previsão antes da escolha, duas condições, reprodução, pausa, reinício e
  retorno do modo direto funcionam no computador e no celular; sem transbordamento horizontal. Modo direto e
  movimento reduzido mostram os dois casos estáticos.
- `npm test`: **177 testes do site e 5 da gravação passaram**; as **30 + 16 + 16 saídas** continuam conferindo.

A correção mantém a etapa 2 aguardando revisão.
