# Para quem trabalha neste repositório (pessoas e agentes)

Livros técnicos em que o código se monta e o terminal roda no meio do texto. Leia o `README.md` para rodar.

## Antes de mexer

- **`docs/PRINCIPIOS.md`**: o leitor aprende com o que faz, não com o que vê. Toda peça nova passa pelo checklist
  de lá (que pergunta responde, o que o leitor faz, o que substitui, o que vira no modo direto, se é do projeto real).
- **`docs/capacidades/`**: um plano por capacidade, em etapas. Execute só a etapa detalhada, um commit de produto por
  etapa, mostre a evidência real e pare: sem o ok do responsável, a etapa não fecha. O registro vai no fim do plano.

## Regras que não mudam

- O livro não pode mentir: código, saída e erro vêm do projeto real (`livros/<livro>/projeto`, `saidas.json`,
  `roteiros/`), e o build falha se divergirem. Simulação e ilustração dizem o que são.
- É um livro, não um tutorial: o texto defende uma ideia; comando e código são prova, não roteiro.
- A voz dos autores ("eu faria assim", "eu errei isso") só os autores escrevem. Marque o lugar com `Pendente`.
- Texto redigido por modelo é sinalizado no relatório com `(redação: <modelo>)`, para revisão.
- Sem push, sem `.env`, sem chave, sem dado real de pessoa, sem decisão escrita do responsável.
- Commits em português, no estilo do `git log`, com o e-mail configurado no repositório.

## Verificar

```bash
npm test            # monta o site, confere as saídas gravadas e roda os testes do livro
npm run saidas      # regrava as saídas (comandos.json e roteiros) depois de mudar o projeto
```

Capturas de tela: o Chrome headless não abre janela com menos de 500 px (use um iframe para o celular) e, com
`--virtual-time-budget`, não avança `requestAnimationFrame` (troque por `setTimeout` numa cópia do `dist`).
