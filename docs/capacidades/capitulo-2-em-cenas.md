# O capítulo 2 em cenas

**Problema.** Do 2.1 ao 2.4, o capítulo 2 repete a mesma dinâmica: um conceito abstrato (grafo, nó, seta, estado,
saída estruturada, modelo falso, régua) e um pare e pense, seis vezes em quatro seções, e toda a prática fica para o
2.5. A história do capítulo 1 (a colega e o substituto) some. O Erick achou o trecho "complexo, abstrato e nada
intuitivo", e a repetição cansa (26/10/2026).

## Decisões

- (26/10/2026, Erick) Cada seção do 2.1 ao 2.4 ganha uma animação no Remotion que continua a história do substituto,
  com um momento em que o leitor decide. A IDE do capítulo fica como está, no 2.5.
- (26/10/2026, Erick) Uma figura por etapa: faz, mostra no túnel, ajusta, e só então a próxima.
- (1) As animações usam a base que já existe (`palco/AvancaCena.tsx`: cena a cena, nada toca sozinho, modo direto,
  menos movimento, anúncio para leitor de tela) e as cores com sentido fixo de `palco/video.ts`.
- (1) O que a figura mostra do agente vem do projeto real: as setas, da saída gravada `grafo-02`; os nós, do
  `figuras/grafo-02.json`; as mensagens e decisões, do `referencia.jsonl`. O que for ilustração diz que é.
- (1) No máximo um pare e pense por seção; a decisão do leitor passa a acontecer dentro da figura.
- (26/10/2026, Erick) A primeira versão (cenas que tocavam sozinhas depois de um avanço, e uma pergunta do balcão)
  não ficou boa com a rolagem. Refeita: sem pergunta e sem botão, a rolagem da página é a agulha da animação, para a
  frente e para trás, com um pouco de inércia; as explicações são balões, um por vez, apontando para o que acontece.
- (26/10/2026, Erick) "Ficou muito rápido ao rolar": o trilho do 2.1 passa de 4 para 8 telas, e a inércia fica mais macia.
- (26/10/2026, Erick) Dois jeitos de avançar: um play discreto (o começo), que toca a animação no ritmo de leitura,
  com pausar e ver de novo; ou rolar com a página, ligado por uma chave ao lado do play e nas configurações. A escolha
  fica lembrada para todas as figuras (`palco/rolar.ts`). Desligada, o trilho alto some e a página rola normalmente;
  trocar de modo mantém a figura no lugar da tela e a animação no mesmo quadro.
- (1) Uma base nova, `palco/RolaCena.tsx`: a figura presa na tela por um trilho de rolagem, a agulha seguindo a
  rolagem pelo `seekTo` (que o navegador deixa sem clique), o aviso "role" até a primeira rolagem, o quadro final no
  modo direto e o texto dos balões para leitor de tela. As próximas figuras do capítulo usam a mesma base.
- (1) Na base antiga, `AvancaCena`, dois consertos que valem para todas: o ouvinte de quadros se liga quando o Player
  existe (antes, só na montagem, e a cena podia tocar sem parar) e o Player vai sem trilhas de áudio.
- (1) Dois desenhos: o largo, com os balões ao lado, ligados por uma linha ao que apontam; e o estreito (até 640 px),
  com letra maior e o balão embaixo, para a figura caber inteira na tela do celular.

## Etapas

| Etapa | Seção | A cena | O conceito | Onde o leitor decide |
|---|---|---|---|---|
| 1 | 2.1 | O roteiro do substituto: a mensagem chega, ele decide e vai a um balcão. | o grafo: nó, seta, estado | para qual balcão vai a mensagem |
| 2 | 2.2 | O formulário de quatro caixas no lugar da redação. | a saída estruturada | encaixar "acho melhor encaminhar" numa caixa |
| 3 | 2.3 | O ensaio com um cliente de mentira, que segue um roteiro. | o modelo falso | o que o ensaio prova, e o que não prova |
| 4 | 2.4 | A prova: as 20 questões e o placar. | a régua | o palpite da nota |

## Etapa atual: 1 — o roteiro do substituto, no 2.1

### O que muda

- Uma animação nova (`roteiro/`): a mensagem do lençol (R10) chega; o substituto lê e decide; ela segue um caminho só,
  até o balcão de abrir chamado, e uma ficha vai junto, preenchendo a pergunta, a decisão e a resposta. Depois, o CPF
  da prima (R15) vai a outro balcão, pelo mesmo roteiro. Na última cena, o roteiro vira o grafo: o substituto é o nó
  `decidir`, os balcões são os nós dos caminhos, as setas que escolhem aparecem, e a ficha é o estado.
- O leitor rola, e a animação anda com ele; os balões explicam cada momento (a chegada, o caminho, a ficha, a
  segunda mensagem, o nó, as setas que escolhem, o estado).
- O texto do 2.1 vira a cena e a ideia (desenhar antes de chamar o modelo); fica um pare e pense, o do porquê do
  grafo. A figura animada toma o lugar do `GrafoAgente` em modo desenho no 2.1; o modo caminhos, no 2.6, fica.

### Verificação

- Teste da montagem: os nós e as setas da figura são os do grafo real; as mensagens vão ao balcão da decisão do
  contrato, e os balões dizem qual; os balões se sucedem sem buraco; uma figura com nó que o grafo não tem não monta.
- `npm run ritmo`, `npm test` e capturas no computador e no celular, no começo, depois da escolha e no quadro final.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `7927299` | primeira versão, com cenas e pergunta, substituída pela de baixo; `npm test`: 129 testes do livro (5 novos, `roteiro-do-agente.test.mjs`) e 5 da gravação, 30 + 16 saídas conferidas; 2.1 com 57 e 95 palavras entre as ações; a animação da introdução conferida depois da mudança na base; [capturas](../relatorios/capturas/capitulo-2-em-cenas-etapa-1/) no computador e em 390 px, rolando com a roda do mouse e clicando no balcão, da chegada ao grafo. | aguardando revisão |
| 1 (refeita) | `35c3286` | A rolagem como agulha e os balões, sem pergunta; `npm test`: 129 testes do livro e 5 da gravação, 30 + 16 saídas conferidas; a animação da introdução conferida depois dos consertos na base; [capturas](../relatorios/capturas/capitulo-2-em-cenas-etapa-1/) ao longo do trilho (8 % a 100 %), no computador e em 390 px, rolando com a roda do mouse. | aguardando revisão |
| 1 (play e rolar) | `fa1f610` | O play no ritmo de leitura e a chave "rolar com a página", lembrada e também nas configurações; conferido no navegador: começa sem trilho (602 px), toca, pausa, liga (trilho de 8 telas, rolagem no quadro em que estava), desliga (figura no topo, mesmo quadro); `npm test`: 129 testes do livro e 5 da gravação; [capturas](../relatorios/capturas/capitulo-2-em-cenas-etapa-1/) `a-` a `e-`. | aguardando revisão |

(redação: Claude Opus 5.5)
