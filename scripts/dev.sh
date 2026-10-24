#!/usr/bin/env bash
# npm run dev: tudo junto no desenvolvimento, num endereço só, como no túnel (http://localhost:4321):
#   o livro em astro dev, que recarrega quando você edita; a landing (FontMarAI) montada, e montada de novo quando ela
#   muda; o astro repassa para a landing o que é dela (astro.config.mjs). Uso: npm run dev (outra porta: npm run dev -- --port 4330)
# A landing fica ao lado deste repositório (../FontMarAI); outro lugar: LANDING=caminho npm run dev
set -euo pipefail
LANDING=${LANDING:-../FontMarAI}
PORTA_LANDING=${PORTA_LANDING:-4174}
[ -f "$LANDING/package.json" ] || { echo "a landing não está em $LANDING: clone o FontMarAI ao lado deste repositório, ou use LANDING=caminho" >&2; exit 1; }
[ -d "$LANDING/node_modules" ] || (cd "$LANDING" && npm install --no-audit --no-fund)
# o Astro deixa um astro dev por projeto: um segundo só avisa que já há um e sai, e quem responderia seria o antigo, sem a
# landing. Para ele antes.
antigo=$(npx astro dev status 2>&1 | grep -o 'running at [^ ]* (pid [0-9]*' | sed 's/running at \(.*\) (pid \(.*\)/\1, pid \2/' || true)
[ -n "$antigo" ] && npx astro dev stop >/dev/null 2>&1 && echo "parei o astro dev que já rodava neste projeto ($antigo); este fica no lugar dele"
# ao sair (Ctrl+C), para tudo: a landing e o astro dev (fora de um terminal, o astro dev roda desacoplado e volta na hora)
trap 'npx astro dev stop >/dev/null 2>&1; kill 0' EXIT
(cd "$LANDING" && npx vite build --logLevel warn)
(cd "$LANDING" && npx vite build --watch --logLevel warn) &
(cd "$LANDING" && npx vite preview --port "$PORTA_LANDING" --strictPort --host 127.0.0.1 --logLevel warn) &
URL_LANDING="http://localhost:$PORTA_LANDING" PUBLIC_URL_INICIO=/ npx astro dev "$@"
wait
