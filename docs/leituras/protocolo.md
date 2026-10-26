# Leitura observada do percurso — protocolo

Preparação da etapa 2 de [revisão do percurso inicial](../capacidades/revisao-do-percurso-inicial.md).
Quem conduz e observa é o Erick. Este documento não registra sessão realizada.

## Antes da primeira sessão

As decisões do Erick em 25/10/2026 são: tudo fica na máquina e na rede local, sem hospedagem, túnel ou endereço
público; ainda não há leitores de fora. Quando houver anotações do Erick, usar a mesma [ficha](ficha.md), com origem
**autor**. A leitura em voz alta com o Victor, prevista em [PRINCIPIOS](../PRINCIPIOS.md), também entra como autor,
pois ele escreve o livro. Essas fichas ajudam a localizar problemas, mas não substituem quem não escreveu o livro.

O público a observar é quem já programa em Python e quer construir agentes, sem ter participado da escrita.
Identificar as fichas por códigos, como L01 e A01; não guardar nomes, contatos, chaves ou dados pessoais dos leitores.
As falas são anotadas por escrito. Ler em voz alta não significa gravar áudio nem acrescentar narração ao livro.

Antes de contar resultados, Erick decide a [proposta de sinal](sinal.md). Registrar a versão escolhida e o commit
do livro na ficha. Enquanto o critério estiver pendente ou não houver leitores de fora, o resultado é **sem sinal**.
Não preencher fichas com observações simuladas.

## Abrir só na máquina

Na raiz deste repositório, com as dependências instaladas conforme o README:

```bash
npm run dev
```

Abrir o endereço `Local` que o Astro mostrar, acrescentando `/ciclo-de-vida/00-introducao/`; normalmente é
`http://localhost:4321/ciclo-de-vida/00-introducao/`. Registrar a porta realmente mostrada. O endereço da raiz mostra
a landing, por isso abrir diretamente a introdução.

O [scripts/dev.sh](../../scripts/dev.sh) precisa do FontMarAI ao lado, com suas dependências, monta a landing e
inicia seu preview em `127.0.0.1:4174`. Depois chama `astro dev --force` e repassa os argumentos recebidos. O script
para um Astro de desenvolvimento anterior deste projeto: combinar o horário com a outra sessão de trabalho antes
de executá-lo. Não parar processos de terceiros para liberar portas.

Se a landing não estiver disponível, o comando já existente abaixo serve só os livros e experimentos:

```bash
npm run dev:livro
```

É uma alternativa do `package.json`, sem script novo. Registrar na ficha qual comando foi usado.

## Abrir em tablet ou celular na mesma rede Wi-Fi

Parar com Ctrl+C o servidor iniciado para esta sessão e reiniciar permitindo acesso pela rede local:

```bash
npm run dev -- --host 0.0.0.0
```

O `--` faz o npm encaminhar `--host` ao script e daí ao Astro. No aparelho, usar o endereço privado mostrado em
`Network`, com a mesma rota `/ciclo-de-vida/00-introducao/`. Exemplo de formato, não endereço desta máquina:
`http://192.168.1.10:4321/ciclo-de-vida/00-introducao/`. Não usar `localhost` no celular: ele apontaria para o próprio
celular. Computador e aparelho precisam estar na mesma rede; o computador precisa continuar ligado com o servidor
ativo. Não criar túnel, hospedagem nem encaminhamento de porta no roteador.

Se houver conflito de portas, escolher portas livres para a landing e o Astro. Estes comandos foram conferidos
com o script existente; usar só um de cada vez:

```bash
# Só no computador
PORTA_LANDING=4187 npm run dev -- --port 4337

# Computador e aparelhos da rede local
PORTA_LANDING=4187 npm run dev -- --host 0.0.0.0 --port 4337
```

Nesse exemplo, abrir a rota do livro na porta **4337**; a 4187 é interna à landing. O mesmo `--host` funciona com
`npm run dev:livro -- --host 0.0.0.0` se a sessão usar a alternativa sem landing.

Se o aparelho não abrir a página, anotar a mensagem e interromper o relógio da leitura. Conferir a mesma rede, a
porta anunciada e a permissão de acesso local do sistema; se continuar sem acesso, encerrar como impedimento
técnico, sem contar como desistência do leitor. Nenhuma mudança de firewall ou rede faz parte deste protocolo.
Ao terminar, Ctrl+C encerra os serviços iniciados pelo `npm run dev`; na alternativa, encerra o Astro.

## Condução e duração

Uma visita dura **até 60 minutos**: cerca de 5 para preparar, até 45 para ler e agir, e 10 para o caso novo, quando
couber, e o encerramento. Não apressar para caber. Se não terminar, registrar o ponto de parada e combinar uma
retomada. A proposta de sinal prevê até duas visitas para introdução e capítulo 1; capítulo 2 pode precisar de
outra visita e não deve ser comprimido para caber. A duração não é uma meta de velocidade de leitura.

1. Usar o aparelho, sistema, navegador e preferência “Reduzir movimento” que o leitor usaria. Anotar também modo
   guiado/direto, “na minha IDE”/“aqui no livro”, familiaridade com Python e leitura anterior. Não escolher o modo
   para ele. O computador que serve o site não precisa ser o aparelho de leitura.
2. Dizer: “Leia em voz alta e faça como faria sozinho. Pode consultar o próprio livro, voltar, pular ou parar.
   Se algo não fizer sentido, diga o que está tentando fazer.” Não antecipar as hipóteses nem o caso novo.
3. Começar pela introdução, seguir pelo capítulo 1 e registrar seção e passo da IDE nos eventos da ficha.
   O observador anota ação, frase e horário aproximado; separa o que viu da interpretação. Conforme
   [RITMO](../RITMO.md), avançar ou abrir uma resposta não demonstra compreensão por si só.
4. Se ficar em silêncio, aguardar. Depois de cerca de um minuto sem progresso, perguntar apenas “O que você está
   tentando fazer agora?”. Se continuar travado por cerca de três minutos, perguntar se prefere procurar no livro,
   pular ou parar. Não apontar botão, explicar conceito, dar comando nem corrigir a resposta. Anotar todo pedido
   de ajuda e qualquer ajuda que de fato ocorrer; se explicar, o trecho deixa de contar como feito sem ajuda.
5. Ao parar, anotar a seção, passo, arquivo e intenção seguinte. Na retomada, abrir a mesma versão e deixar o leitor
   encontrar o caminho com os recursos do livro. Não lembrá-lo de onde clicar; anotar o que ele usa e se consegue.
6. Ao chegar ao fim do capítulo 1, registrar o que fez na IDE e no exercício, distinguindo o que concluiu do que só
   avançou. Registrar se pede o 2 espontaneamente, antes de mencionar o capítulo seguinte. Entregar só o cartão do
   leitor de [caso-novo](caso-novo.md), sem a resposta do observador. Ele pode consultar o livro e os arquivos da
   loja na IDE da página ou no projeto local; não precisa executar modelo nem escrever programa para esse caso.
7. Dar até cinco minutos ao caso, dentro do bloco final, e recolher decisão, motivo e fontes consultadas antes de
   mostrar a resposta esperada. Não corrigir durante a tentativa. Se não houver tempo, marcar “não aplicado” e
   reservar para o fim da retomada; isso não equivale a erro. Não inserir esse caso em `referencia.jsonl`.
8. No encerramento, perguntar “Onde você parou?” e “O que faria a seguir?”. Registrar se quer continuar no 2 e se
   isso surgiu espontaneamente ou só depois da pergunta neutra. Não perguntar “você gostou?” nem sugerir que peça
   o próximo capítulo. Se ele continuar no 2, observar com o mesmo método; a leitura paga de `medir.py` na máquina
   dele não integra esta sessão: o livro oferece a gravação na página.

Encerrar quando o leitor quiser, quando o tempo acabar ou quando um impedimento técnico impedir continuar.
Registrar o motivo exato: desistência, tempo, pausa combinada e falha técnica são resultados diferentes. Se houver
cansaço, oferecer parar sem tentar convencê-lo a terminar. Não exigir novo caso de quem não chegou ao fim do 1.

## Depois

Guardar a ficha com origem e versão. Relacionar os eventos às linhas de [hipoteses](hipoteses.md), inclusive quando
o resultado for “sem sinal”. Um defeito de aparelho vai para correção separada após reprodução; não esperar as
etapas de revisão de texto ou IDE. A análise e qualquer decisão de seguir pertencem ao Erick. Não implementar as
etapas 3 a 7 a partir destas fichas sem a revisão prevista no plano.

(redação: GPT-6)
