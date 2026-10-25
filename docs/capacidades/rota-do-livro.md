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

## Etapa atual: nenhuma

Capacidade fechada em 25/10/2026. Capítulo novo entra numa fase do `figuras/ciclo.json`, ou não monta.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `ed60114` | `npm test` com 72 testes; o menu com os 9 capítulos; `/00-prefacio` levando à introdução | 25/10 |
| 2 | `0007690` | a introdução de 922 palavras sem ação para 73 · 297 · 245 · 210; testes do ciclo contra o sumário, da aposta contra o texto e o R12; aposta e mapa em 1280 e 360 px | 25/10 |
| 3 | `9a64a62` | a fase acesa do 1 (Planejar) e do 2 (Construir) conferida contra o `ciclo.json`; o link leva ao mapa; 1280 e 360 px sem rolagem lateral | 25/10 |
