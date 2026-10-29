# Áudio nos experimentos

**Problema.** O Erick quer testar um áudio no experimento "O que o modelo anota enquanto escreve" (kv-cache). A regra
era "sem áudio nem narração: o livro não é curso".

## Decisões

- (29/10/2026, Erick) "Mudar a regra": áudio entra como complemento de um experimento; o texto continua completo sem
  ele (AGENTS.md, PRINCIPIOS.md).
- (29/10/2026, Erick) "Só o áudio por agora": a segunda feature fica para depois.
- (29/10/2026, Erick) O lugar: "na melhor experiência possível para o usuário" → na abertura, antes de "O que se
  testa": o leitor escolhe ouvir antes, durante ou depois de ler.
- (1) Os áudios ficam em `public/audios/` (o Astro copia sem processar: docs.astro.build/en/basics/project-structure);
  não em `assets/`, que é rota da landing.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `audio` no topo do `.mdx` | declara o áudio e diz o que ele é | `arquivo`, `sobre` | o esquema valida | nova |
| `OuvirExperimento.astro` | o player na abertura | `arquivo`, `sobre` | `<audio>`, velocidade, retomada | nova |
| `public/audios/` | onde os áudios moram | o MP3 | `/audios/<nome>.mp3` | nova |
| `testes/audio.test.mjs` | confere arquivo, MP3, build e player | o `.mdx` e o `dist` | passa ou falha | nova |

## Etapas

| Etapa | O que | O que o leitor faz |
|---|---|---|
| 1 | O player no kv-cache | ouve o experimento, na velocidade que quiser, e retoma de onde parou |

## Última etapa: 1 — o player no kv-cache

- `preload="metadata"`: antes do play, só a duração (MDN, `<audio>`); os 6,8 MB vêm quando o leitor toca.
- Velocidade 1×, 1,25×, 1,5× e 2×, sem mudar o tom da voz (MDN, `playbackRate`); a escolha fica no navegador.
- Retoma de onde parou (posição no navegador, a cada 5 s e na pausa), com "Ouvir do começo".
- O arquivo: `audio_experimento_teste.mpeg` era MP3 (MPEG layer III, bitrate variável com índice Xing): virou
  `kv-cache-teste.mp3`, servido como `audio/mpeg`. Duração contada quadro a quadro: 6:08.
- Fora: transcrição (a MDN recomenda para áudio falado), player que acompanha a rolagem, e dizer quem fala no áudio,
  que depende de o Erick dizer como ele foi feito.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|

(redação: Claude Opus 5.5)
