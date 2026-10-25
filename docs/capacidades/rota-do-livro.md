# A rota do livro

**Problema.** A rota de 8 capítulos não tinha a fase de pôr no ar, que as quatro referências de ciclo de vida de
agente têm (IBM, Microsoft, LangChain, Salesforce), e o leitor entrava no problema sem ver o ciclo inteiro antes.

## Etapas

1. A rota A no livro: 9 capítulos (o 5 é Pôr no ar), e o prefácio vira introdução.
2. O mapa do ciclo na introdução: o leitor separa os problemas pelas fases, depois vê o mapa, com as fontes.
3. "Você está aqui": o mapa pequeno na abertura dos capítulos 1 e 2.

## Decisões

- (0) Rota A: 1 contrato · 2 primeiro agente · 3 ferramentas · 4 avaliar · 5 pôr no ar · 6 observar · 7 quando dá
  errado · 8 governar · 9 evoluir (Erick, 25/10/2026).
- (0) O ciclo é explicado como mapa na introdução, não num capítulo 0; cada fase é explicada no capítulo dela.
- (0) A aprovação humana como mecanismo vai para o 5; o 8 fica com a regra de quem aprova o quê.
- (1) O endereço antigo `/ciclo-de-vida/00-prefacio` leva à introdução.
- (1) A introdução fica fora do relógio até ganhar a primeira ação (etapa 2).

## Etapa atual: 2

Na introdução, antes da lista dos capítulos: `Pilhas` com quatro problemas do próprio texto (a conta que cresce, o
pedido de outra pessoa, o modelo novo que estraga, a pergunta não prevista) e as fases como pilhas; depois, a figura
`MapaDoCiclo`: as 9 fases em ciclo, a volta de "quando dá errado" para "avaliar", e o clique em cada fase (o que ela
pergunta, o que o agente ganha, o capítulo), com as quatro fontes. A introdução entra no relógio. Evidência: `npm
test` com a introdução medida; a separação e o mapa no navegador, em 1280 e 360 px.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `ed60114` | `npm test` com 72 testes; o menu com os 9 capítulos; `/00-prefacio` levando à introdução | 25/10 |
