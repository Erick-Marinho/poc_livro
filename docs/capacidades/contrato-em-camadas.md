# Contrato em camadas

**Problema.** O livro fala de contrato no sentido de comportamento (o que decidir); o capítulo 5 de *AI Agents: The
Definitive Guide* (Nicole Koenigstein, O'Reilly, 2026) fala no sentido de interface (em que forma os dados passam).
As duas valem, e juntas viram camadas que atravessam o livro. E formato válido não é decisão certa: no capítulo 2,
as 20 respostas vieram no formato e 6 estavam certas.

## Etapas

1. As camadas no 1.4: o leitor aposta qual camada pega cada falha, e um quadro diz em que capítulo cada uma entra.
2. A aposta do formato no 2.4: se as 20 passaram no Pydantic, quantas estavam certas?

## Decisões

- (0) Do livro, só as ideias (porta de validação, política fixada e carimbada, laço de dentro e de fora, checkpoint),
  com citação; sem Instructor, OmegaConf nem descoberta de ferramentas em tempo de execução.
- (0) Para quando chegarmos lá: entrada e saída tipadas das ferramentas, e o MCP como quadro opcional (cap. 3); a
  política fixada com impressão digital, as tentativas contadas e o checkpoint (cap. 5); a impressão digital gravada
  junto de cada decisão (cap. 8).
- (2) A pergunta do molde fica na 2.6, e não na 2.4, para não entregar o palpite da IDE antes da hora.
- (1) Quatro camadas: comportamento, formato, ferramenta e execução (a auditoria fica dentro de execução).

## Etapa atual: nenhuma

Capacidade fechada em 25/10/2026. O que vem do livro para os capítulos 3, 5 e 8 está nas decisões (0).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `45cfb79` | `npm test` com 101 testes; a aposta das camadas jogada (3 de 4) e o quadro em 1280 e 360 px; o R12 conferido contra a gravação; a 1.4 em 273 · 177 · 115 | 25/10 |
| 2 | `2b2c5bb` | `npm test` com 102 testes; o 20 e o 14 conferidos contra a gravação; a 2.6 em 48 · 86 · 199, sem aviso | 25/10 |
