# A figura 1 em vídeo

**Problema.** A figura "o que vamos construir" do experimento do segundo cérebro troca de cena a cada passo: a pergunta
não atravessa o cérebro, cinco quadros se sucedem. O momento que importa (a regra da data reordenar as frases que
empatam) passa em meio segundo, e a cor não separa o prazo velho do novo. Refeita no Remotion, os mesmos objetos seguem
de uma etapa para a outra, e as frases empatadas caem num eixo do tempo.

## Decisões

- (24/10/2026, Erick) Licença do Remotion: a gratuita, de pessoa física, que desenvolve por conta própria.
- (24/10/2026, Erick) O vídeo substitui a figura atual (não soma uma interação à seção).
- (24/10/2026, Erick) O código mora aqui; o Studio do `my-video` importa a composição daqui para pré-visualizar.
- (1) Não toca sozinho: o leitor aperta o play. No modo direto e com menos movimento, abre no último quadro.
- (1) As fontes são as que a página já carrega (IBM Plex Sans, JetBrains Mono); a composição não baixa fonte.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `remotion` + `@remotion/player` (4.0.538) | tocar a composição na página ([`<Player>`](https://www.remotion.dev/docs/player/player)) | — | dependências | nova |
| `cerebro/caminho.ts` | o rastro lido, os tempos e onde cada coisa fica | `bruto`, `regua` | o desenho | nova |
| `cerebro/CaminhoDaPergunta.tsx` | a composição | `bruto`, `comando`, `regua` | os quadros | troca (sai a versão com `motion`) |
| `cerebro/FiguraCaminhoVideo.tsx` | a ilha: o Player, com controles, e o modo direto | as mesmas props | o vídeo na figura | nova |
| `FiguraCaminho.astro` | lê as saídas gravadas e monta a figura | `saidas.json` | a figura 1 | existe (monta a ilha nova) |
| teste da figura | os números do vídeo são os das saídas gravadas | `dist/`, `saidas.json` | falha se divergir | nova |

## Etapas

1. O vídeo no lugar da figura: as dependências, a composição aqui, a ilha com o Player, o modo direto, o teste; o
   Studio do `my-video` importa daqui.
2. A aposta: o vídeo para antes da escolha (17 s); o leitor aposta qual frase o cérebro devolve, e só então segue.
3. O celular: composição vertical, figura antiga ou rolagem (escolha do responsável).

## Etapa 1 (detalhe)

- **Arquivos:** `package.json`, `src/components/livro/cerebro/` (`caminho.ts`, `CaminhoDaPergunta.tsx`,
  `FiguraCaminhoVideo.tsx`, `cerebro.css`), `src/components/livro/FiguraCaminho.astro`,
  `testes/experimento-segundo-cerebro.test.mjs`. No `my-video`: `src/Root.tsx`, `remotion.config.ts`.
- **Muda:** a figura 1 passa a ser o Player com a composição; as props continuam vindo do `saidas.json` pelo
  `FiguraCaminho.astro`. Os estilos `cdp-` da versão antiga saem.
- **Evidência:** `npm test`; o teste novo falha com a figura antiga; o Studio do `my-video` abre a composição daqui;
  captura da página (com o Chrome headless instalado no WSL, ou pelo túnel, pelo responsável).
- **Fica fora:** a aposta (2) e o celular (3).

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|

(redação: claude-opus-5-5)
