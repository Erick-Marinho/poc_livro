# Ritmo

**Problema.** O leitor larga o texto linear: no capítulo 1, as seções 1.2 a 1.4 passam quase 4 minutos sem o leitor
fazer nada. Faltava um jeito de saber onde, o quê e como tornar o texto dinâmico sem depender de feeling.
A regra está em `docs/RITMO.md`; este plano é o caminho até ela valer no build.

## Etapas

1. A regra (`docs/RITMO.md`), o relógio (`npm run ritmo`) e o teste, que avisa sem falhar.
2. A skill `revisar-ritmo`, proposta para o Erick salvar: o roteiro que aplica a regra num rascunho.
3a. O capítulo 1 abaixo de 400: as ações Aposta, Pilhas e Troca do protótipo, como componentes do livro.
3b. O experimento do segundo cérebro abaixo de 400.
3c. O limite de 400 passa a falhar no `npm test`.
4. A skill aplicada no capítulo 2 e no experimento do segundo cérebro, que ela não ajudou a escrever.

## Decisões

- (0) Aviso acima de 200 palavras sem ação; falha acima de 400 (Erick, 25/10/2026).
- (0) Conta como ação o que pede uma decisão do leitor; abrir, assistir, rodar e rolar não contam (Erick, 25/10/2026).
- (0) A regra mora no repositório; a skill só tem o roteiro e lê a regra daqui, sem repetir números.
- (1) Todo componente está classificado no relógio; componente novo sem classificação faz o relógio parar.
- (1) O experimento do segundo cérebro também passa de 400: entra na etapa 3, antes de a falha valer no build.
- (3a) As mensagens das ações vêm do `referencia.jsonl`; o que o agente apressado fez e as frases da troca de prompt são
  ilustração, e a página diz.

## Etapa atual: 3b

A skill `revisar-ritmo` no experimento do segundo cérebro: a proposta primeiro, a decisão do Erick depois, e só então
a mudança no texto. Evidência: a proposta; depois, o relógio do experimento sem trecho acima de 400.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `f4435ed` | o relógio dos textos de hoje (788 no capítulo 1, 412 no experimento); teste do que conta como ação | 25/10 |
| 2 | skill salva | a skill `revisar-ritmo` revisada e salva pelo Erick; lê o `RITMO.md`, não guarda número | 25/10 |
| 3a | `fc10873` | o capítulo 1 sem trecho acima de 400 (788 virou 39, 183, 189, 230); as três ações usadas na página | 25/10 |
