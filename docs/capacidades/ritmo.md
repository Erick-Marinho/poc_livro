# Ritmo

**Problema.** O leitor larga o texto linear: no capítulo 1, as seções 1.2 a 1.4 passam quase 4 minutos sem o leitor
fazer nada. Faltava um jeito de saber onde, o quê e como tornar o texto dinâmico sem depender de feeling.
A regra está em `docs/RITMO.md`; este plano é o caminho até ela valer no build.

## Etapas

1. A regra (`docs/RITMO.md`), o relógio (`npm run ritmo`) e o teste, que avisa sem falhar.
2. A skill `revisar-ritmo`, proposta para o Erick salvar: o roteiro que aplica a regra num rascunho.
3. O capítulo 1 refatorado (as ações Aposta, Pilhas e Troca do protótipo, como componentes), e o limite de 400 passa
   a falhar.
4. A skill aplicada no capítulo 2 e no experimento do segundo cérebro, que ela não ajudou a escrever.

## Decisões

- (0) Aviso acima de 200 palavras sem ação; falha acima de 400 (Erick, 25/10/2026).
- (0) Conta como ação o que pede uma decisão do leitor; abrir, assistir, rodar e rolar não contam (Erick, 25/10/2026).
- (0) A regra mora no repositório; a skill só tem o roteiro e lê a regra daqui, sem repetir números.
- (1) Todo componente está classificado no relógio; componente novo sem classificação faz o relógio parar.

## Etapa atual: 1

Arquivos: `docs/RITMO.md`, `scripts/ritmo.mjs`, `testes/ritmo.test.mjs`, `package.json` (`npm run ritmo`),
`AGENTS.md`. Evidência: o relógio dos textos de hoje; o teste do que conta como ação. Fica fora: falhar no build.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
