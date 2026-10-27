# Você é o gabarito, no 1.4

**Problema.** No 1.4, a dinâmica "Troque" (`Troca.astro`) mostrava a mensagem do desconto em três abas, "prompt curto",
"prompt simpático" e "outro modelo", e duas colunas abstratas: "o que muda: a resposta" e "o que fica: o contrato". O
leitor não via o bilhete de cada tentativa e não decidia nada; a conclusão vinha pronta no parágrafo seguinte. O Erick
achou "confusa e complexa, de difícil entendimento e pouco intuitiva", e notou que o 2.4, que trata quase do mesmo
cenário com um palpite e os dois bilhetes desenhados, está melhor (27/10/2026).

## Decisões

- (27/10/2026, Erick) "Você é o gabarito": três cartões, um por vez. Cada um mostra o bilhete, como papel (o mesmo
  desenho do 2.4), quem responde e a resposta ao desconto. O leitor corrige: "cumpriu o gabarito" ou "o gabarito
  pega". No fim, a conta de quantas ele corrigiu como o gabarito, e a ideia: as frases mudam, o gabarito só olha o que
  foi feito.
- (27/10/2026, Erick) "Fala de cumprir o gabarito sem nem ter ensinado a criar o gabarito": a caixa deixa de pedir que o
  leitor corrija pelo gabarito. Ele se põe no lugar da colega, que escreveu o bilhete, e diz se ela aprovaria cada
  resposta; sabe responder porque leu o bilhete. O parágrafo depois da caixa dá o nome: olhar o que foi feito, e não as
  palavras, escrito antes e mensagem por mensagem, é o gabarito. Nenhuma peça a mais.
- (1) O primeiro bilhete é o da colega, o mesmo do texto do 1.4, e o teste confere. O motivo vem do `referencia.jsonl` e aparece no
  retorno de cada cartão. Os bilhetes e as
  respostas são ilustração, e a caixa diz.
- (1) O componente continua sendo o `Troca` (conta como ação no ritmo), refeito; o parágrafo depois da caixa deixa de
  repetir a conclusão dela.

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | A caixa refeita, os dados com os bilhetes, o texto em volta e o teste | corrige as três tentativas como o gabarito |

## Etapa atual: 1 — a caixa

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | 9f5ac64 | `testes/acoes.test.mjs`: três cartões, dois que cumprem e um que o gabarito pega, o motivo do R11 na página, e o primeiro bilhete igual ao da colega no texto. `npm test` 208/208; ritmo do 1.4 sem aviso. Capturas a 1280 e 390 px, do primeiro cartão até a conta no fim | aguardando revisão |

(redação: Claude Opus 5.5)
