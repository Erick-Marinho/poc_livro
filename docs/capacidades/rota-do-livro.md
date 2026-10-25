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

## Etapa atual: 1

`sumario.json` com 9 capítulos; `00-prefacio.mdx` vira `00-introducao.mdx` (tipo `introducao`, título Introdução), com
a lista nova; a referência "capítulo 5" da 2.1 vira 6; o redirecionamento e os testes de rota. Evidência: `npm test`; o
menu com os 9 e o endereço antigo levando à introdução.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
