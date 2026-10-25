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
- (1) Quatro camadas: comportamento, formato, ferramenta e execução (a auditoria fica dentro de execução).

## Etapa atual: 1

`01-o-problema-e-o-contrato.mdx`, depois da definição: um parágrafo das camadas, a `Aposta` com quatro falhas (a do
R12 é real, da gravação do capítulo 2), e o quadro camada · pergunta · capítulo. `figuras/camadas.json` e o teste
(o R12 decidido como passar na gravação, contra recusar no contrato; os capítulos citados no sumário). Evidência:
`npm test`, o relógio da 1.4 e a aposta no navegador.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
