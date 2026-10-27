# O ritmo de um texto

Vale para capítulo e experimento. O `npm run ritmo` mede; a skill `revisar-ritmo` escreve no texto um `Rascunho` em
cada lugar onde o leitor deve agir, e quem escreve troca pelo componente ou apaga (texto com rascunho não publica).
✓ é o que o `testes/ritmo.test.mjs` confere.

## As três camadas

1. **Quando: o relógio.** Palavras lidas sem o leitor agir, de uma ação à próxima. **Aviso acima de 200** (cerca de
   1 minuto). ✓ **Falha acima de 400** (sem exceção que se sustente): o `npm test` para e diz qual trecho.
2. **O quê: o verbo da frase principal** do trecho, a que o resumo citaria. Ele escolhe o dispositivo:

   | A frase diz... | Dispositivo |
   |---|---|
   | "é", "chama-se" | texto + analogia da loja |
   | "acontece", "passa por", "vai para" (e não se vê) | animação de mecanismo |
   | "parece, mas não é" | prever antes, mostrar depois |
   | "depende de", "se... então" | explorável: o leitor troca e compara (variantes gravadas) |
   | "custa", "quantos", "é maior que" | escala: contador, taxímetro |
   | "agrupa", "separa", "tem um padrão" | o leitor separa antes de ler a resposta |
   | "faça", "rode" | IDE |

   O mais barato que resolve vem primeiro: prever e separar antes de animar. Dinâmico não é o mesmo que animado.
3. **Como: as regras do dispositivo.** Para animação, a seção abaixo.

E sempre: a leitura em voz alta do Victor (onde trava, onde pula, onde diz "ah!") decide os casos de dúvida.

## O que conta como ação

Conta o que pede uma decisão do leitor: apostar ou prever antes de ver, separar ou classificar, trocar uma variante e
comparar, responder um pare e pense antes de abrir, um passo da IDE. **Não conta:** "continuar", "ver mais", abrir um
texto escondido, passar o mouse, rolar, assistir a uma animação sem nada a decidir.

✓ Cada componente está classificado (`scripts/ritmo.mjs`); um componente novo sem classificação faz o relógio parar.

| Conta | Não conta |
|---|---|
| `IdeCapitulo`, `Classificador`, `PareEPense`, `Exercicio`, `Aposta`, `Pilhas`, `PrimeiroDia`, `MontaQuestao` (monta e o contrato confere), `RespostasDaColeta` (prevê e compara grupo a grupo), `DecisaoFixa` (escolhe a decisão e compara as notas), `Troca`, `Rastro` (escolhe o jeito e compara), `GrafoAgente` no modo `caminhos` | `Nota`, `Terminal`, `QuemDecide` (arrasta e vê, sem decidir), `DiaSeguinte` (toca ou rola), `NotaDoLivro` (toca ou rola), `NumerosDaPesquisa` (lê os números), `AgentesEmProducao` (toca ou rola), `ComoOModeloEscolhe` (toca ou rola), `FluxoOuAgente` (toca ou rola), `AndarDaTorre` (vê o andar, sem decidir), `DoisBilhetes` (compara os bilhetes, depois do Invista), `TemposReais` (toca ou rola; a aposta de escala fica na IDE, logo antes), `RoteiroDoAgente`, `FormularioDoAgente`, `EnsaioDoAgente`, `ProvaDoAgente` e `ResultadoDoAgente` (tocam ou rolam; a decisão fica no Invista logo antes), `FiguraAgente`, `FiguraCaminho`, `FiguraCofre`, `GrafoAgente` no modo `desenho` |

O texto de `Pendente` não entra na conta (ainda não existe); o de `Nota` e o das tabelas entram.

`MapaTemperatura` não conta: o leitor toca ou rola; a previsão fica no Invista logo antes do vídeo.

## Exceções

- Trecho narrativo (uma história da loja que segura o leitor) pode passar de 200: quem diz é a leitura.
- Trecho denso pode pedir ação antes de 200: duas frases seguidas com verbo de processo.

## Animação

Uma pergunta por animação, escrita no topo. No máximo 45 s, 6 cenas e 8 s por cena; até 4 coisas novas e um movimento
por vez em cada cena. Anatomia: pergunta → elenco parado e com nome → cenas, com os mesmos objetos atravessando →
um momento-chave, mais lento, com uma decisão antes (aposta) → quadro final parado, desenhável no papel (é o do modo
direto). O leitor controla: nada toca sozinho. Números e textos vêm das saídas e gravações; ilustração diz que é.
Legendas curtas (cerca de 12 palavras). Cor com sentido fixo: acento é o que acontece agora, verde é o que o contrato
pede, âmbar é erro, cinza é o que já passou. Analogia só do elenco da loja (a ficha de atendimento, os balcões, a
recepção, o taxímetro, o boneco de teste, o replay), e a última cena diz onde ela quebra. Nos experimentos, o exemplo e
a analogia podem sair do caso do livro (decisão do Erick, 27/10/2026): o experimento não precisa ser da loja. Legível a 360 px. O que sai
sem perder sentido, sai.
