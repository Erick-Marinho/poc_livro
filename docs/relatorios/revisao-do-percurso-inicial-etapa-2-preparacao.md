# Para o Erick — fechamento da etapa 1 e preparação local da etapa 2

25/10/2026. A etapa 1 tem o ok do Erick, comunicado nesta solicitação. A preparação da etapa 2 está entregue para
revisão; nenhuma sessão de leitura foi realizada, nenhum leitor foi contatado e nenhuma ficha foi preenchida.

(redação: GPT-6)

## Primeiro commit: fechamento da etapa 1

`3a4e367` — “Revisão do percurso inicial, etapa 1: ok do Erick”.

As duas linhas da etapa 1 no registro receberam “Erick, 25/10/2026”; a referência “este commit” passou a `7513682`.
O resumo do capítulo 2 passou de “Nesta execução com o GPT-6 Luna, o agente acertou…” para “Nesta execução com o
GPT-6 Luna, sem dados da loja, o agente acertou…”. O resultado continua 6 de 20 (30%).

`npm test` terminou com código 0 antes desse commit: build de 9 páginas, 29 saídas do livro e 16 do experimento
iguais às existentes, 112 testes do livro passando e 5 testes da gravação passando. Usou as gravações existentes.

## Segundo commit: materiais da observação

O [plano](../capacidades/revisao-do-percurso-inicial.md) passa a detalhar a etapa 2 com pergunta, escopo, peças,
critérios, evidência e limite. Registra as decisões do Erick: uso somente local e mesma ficha para anotações de
origem autor. A antiga proposta de endereço fixo público deixa de ser requisito desta preparação.

Materiais entregues em [docs/leituras](../leituras/):

- [protocolo.md](../leituras/protocolo.md): abertura local, visita de até 60 minutos, leitura em voz alta,
  observação sem explicação adicional, travas, interrupção, retomada e encerramento.
- [ficha.md](../leituras/ficha.md): aparelho, sistema, navegador, reduzir movimento, modo, eventos por seção,
  distinção entre ação e interpretação, parada/retomada, conclusão do 1, pedido do 2 e caso novo.
- [caso-novo.md](../leituras/caso-novo.md): mensagem de defeito no BT-1005 com o e-mail da Carla; cartão separado da
  resposta esperada para o observador. A combinação não está na referência. A decisão esperada é recusar porque o
  comprador é Diego; a divergência entre comprador e e-mail impede atender com essa identificação.
- [hipoteses.md](../leituras/hipoteses.md): o que procurar para confirmar, descartar ou deixar sem sinal as hipóteses
  das etapas 3 a 7, sem desenvolver suas soluções.
- [sinal.md](../leituras/sinal.md): PROPOSTA para 3 leitores que não escreveram o livro, com limiares de conclusão,
  resolução e pedido espontâneo do 2. O Erick ainda decide o critério antes de observar. As fichas de autor ficam
  fora do denominador; ausência de leitores não vira resultado.

## Verificação técnica local

Foram lidos `scripts/dev.sh`, `package.json` e `astro.config.mjs`. O script de desenvolvimento repassa `"$@"` para
`npx astro dev --force`, portanto o `--host` chega ao Astro pelo comando npm existente. Não foi necessário propor
ou criar script novo. Os arquivos de código, dados, referência e gravações não mudaram nesta segunda parte.

A primeira tentativa com `npm run dev` encontrou a porta 4174 já ocupada. O serviço existente foi preservado.
Os comandos abaixo foram então executados, um de cada vez, com portas livres:

```bash
PORTA_LANDING=4187 npm run dev -- --port 4337
PORTA_LANDING=4187 npm run dev -- --host 0.0.0.0 --port 4337
```

No Chrome headless, o primeiro abriu a introdução em localhost, com o título correto. O segundo abriu o capítulo 1
pelo endereço privado da interface Wi-Fi do próprio computador. No navegador, as rotas da introdução e dos
capítulos 1 e 2 responderam HTTP 200. A IDE carregou e o clique no passo 18 abriu “A régua — passo 18 de 18”.
O preview interno da landing ficou em `127.0.0.1:4187`; o Astro ouviu na porta 4337 com `--host`.

Isso confere o comando, o acesso pelo endereço privado e a página no navegador do computador. Não houve teste em
um tablet ou celular físico; sistema, navegador, gestos e eventuais bloqueios da rede nesses aparelhos serão
registrados pelo Erick na ficha. Não foi criado endereço público, hospedagem ou túnel.

O caso foi conferido diretamente contra os JSONs: BT-1005 pertence a C04; o e-mail apresentado pertence a C03;
o item P04 é o jogo de lençol. A entrega fica a 21 dias do “hoje” fixo da loja. A combinação BT-1005 + e-mail da
Carla e a mensagem completa estão ausentes dos 20 casos de `referencia.jsonl`. A solução é derivada da política,
sem chamada ao modelo e sem adicionar caso à régua do livro.

Os links locais dos materiais e do plano foram conferidos e `git diff --check` passou. A segunda parte altera
somente documentação; a suíte completa já passou para a mudança do produto no primeiro commit.

## Estado na entrega

Etapa 1 encerrada com o ok informado. Etapa 2 preparada, aguardando revisão e condução pelo Erick. Todos os campos
de sessão continuam vazios e as hipóteses continuam sem sinal. As únicas decisões atribuídas ao Erick são as que
ele comunicou; os limiares de leitura continuam PROPOSTA. Os serviços temporários usados na conferência foram
encerrados ao terminar.
