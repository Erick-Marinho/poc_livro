# Princípios do livro

**O leitor aprende com o que faz, e não com o que vê.** Tudo neste repositório (texto, figura, terminal, IDE)
é julgado por isso. O problema que o livro resolve é o abandono: livro técnico linear e curso gravado
perdem o leitor nos primeiros capítulos. A meta é o leitor chegar ao fim sabendo fazer.

E duas fronteiras que não se cruzam:
- **O livro não pode mentir.** Código, saída e erro mostrados saem do projeto real, gravados e conferidos no build.
  Simulação e ilustração dizem o que são.
- **É um livro, não um tutorial.** Cada seção defende uma ideia (o porquê, o custo, a escolha). Comando e código
  entram como prova do argumento, não como roteiro de "faça isto, depois aquilo".

## O caminho de cada seção

gancho → **prever** → **fazer** → **errar** → consertar → lembrar → usar em caso novo

- Prever antes de rodar, e fazer antes de ver feito: aprendizagem ativa (Freeman et al., 2014); em programação,
  prever, rodar, investigar, modificar e criar (PRIMM: Sentance, Waite e Kallia, 2019).
- Errar com correção logo depois fixa mais do que acertar de primeira (Metcalfe, 2017); tentar antes da
  explicação ajuda a entender (Kapur, 2008). Por isso o caminho do código tem erros de verdade (os roteiros).

## Fontes de encanto

- **O placar sempre à vista.** A nota de partida (25%) é o começo de uma história; cada capítulo empurra o número.
  "O seu agente bate os 25%?" é uma meta do leitor, e o progresso é real.
- **Preparar e cobrar.** Um caso plantado volta depois (Ana e Bruno: capítulo 1, cobrado no 6). Uma semente
  por capítulo, de propósito, e o leitor reconhece: "ah, é aquele!".
- **A loja como lugar.** Os mesmos clientes, a mesma loja, o mesmo "hoje" (10/11/2026). Dado com rosto
  se aprende melhor do que `cliente_01`.
- **A voz dos autores nas decisões.** "Eu faria assim, e por quê", inclusive "eu errei isso no projeto real".
  Isso não se copia e é o que separa o livro de uma documentação. Só os autores escrevem: o modelo marca o
  lugar (componente `Pendente`) e não inventa experiência.

## Cuidados, para não errar a mão

- **Enfeite atrapalha.** Detalhe atraente que não serve à ideia reduz o que se lembra (Harp e Mayer, 1998).
  Regra: cada animação responde a uma pergunta do texto. Se tirar a animação e nada se perder, ela sai.
- **Assistir não é aprender.** Ver o código se montar sozinho dá a sensação de ter entendido sem ter entendido.
  "Aposte antes" e "quebre de propósito" valem mais do que qualquer animação nova. Nada toca sozinho onde o
  leitor deveria estar fazendo.
- **Guia demais irrita quem já sabe** (efeito de reversão da experiência: Kalyuga et al., 2003). O **modo direto**,
  nas configurações, recolhe as partes guiadas e deixa só código e testes.
- **Cansaço de clicar.** Uma interação por ideia, não três. Antes de pôr mais uma num capítulo, contar as que já
  existem e medir.

## Como medir no começo

Leitura em voz alta com o Victor, capítulo a capítulo, anotando onde trava, onde pula e onde se perde.
Registro automático só depois, na plataforma, e com aceite do leitor.

## Checklist de uma peça nova (figura, terminal, IDE, seção)

1. Que pergunta do texto ela responde? (sem resposta, não entra)
2. O que o leitor **faz** nela? Prever, apostar, quebrar, digitar? (só olhar não basta)
3. Ela substitui alguma peça, ou se soma? Quantas interações a seção passa a ter?
4. No modo direto, o que ela vira?
5. O que ela mostra é do projeto real, ou diz que é ilustração?

## Referências

- Freeman, S. et al. (2014). Active learning increases student performance in science, engineering, and mathematics. *PNAS*, 111(23), 8410–8415.
- Sentance, S., Waite, J. e Kallia, M. (2019). Teaching computer programming with PRIMM: a sociocultural perspective. *Computer Science Education*, 29(2–3), 136–176.
- Metcalfe, J. (2017). Learning from errors. *Annual Review of Psychology*, 68, 465–489.
- Kapur, M. (2008). Productive failure. *Cognition and Instruction*, 26(3), 379–424.
- Harp, S. F. e Mayer, R. E. (1998). How seductive details do their damage: a theory of cognitive interest in science learning. *Journal of Educational Psychology*, 90(3), 414–434.
- Kalyuga, S., Ayres, P., Chandler, P. e Sweller, J. (2003). The expertise reversal effect. *Educational Psychologist*, 38(1), 23–31.

(redação: claude-opus-5-5, a partir dos princípios trazidos pelo responsável)
