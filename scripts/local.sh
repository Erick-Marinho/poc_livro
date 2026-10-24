#!/usr/bin/env bash
# Tudo junto no desenvolvimento, num endereço só, como no túnel (http://localhost:4321):
#   o livro em astro dev, que recarrega quando você edita; a landing (FontMarAI) montada, e montada de novo quando ela
#   muda; o astro repassa para a landing o que é dela (astro.config.mjs). Uso: npm run local (outra porta: npm run local -- --port 4330)
# A landing fica ao lado deste repositório (../FontMarAI); outro lugar: LANDING=caminho npm run local
set -euo pipefail
LANDING=${LANDING:-../FontMarAI}
PORTA_LANDING=${PORTA_LANDING:-4174}
[ -f "$LANDING/package.json" ] || { echo "a landing não está em $LANDING: clone o FontMarAI ao lado deste repositório, ou use LANDING=caminho" >&2; exit 1; }
[ -d "$LANDING/node_modules" ] || (cd "$LANDING" && npm install --no-audit --no-fund)
# ao sair (Ctrl+C), para tudo: a landing e o astro dev (fora de um terminal, o astro dev roda desacoplado e volta na hora)
trap 'npx astro dev stop >/dev/null 2>&1; kill 0' EXIT
(cd "$LANDING" && npx vite build --logLevel warn)
(cd "$LANDING" && npx vite build --watch --logLevel warn) &
(cd "$LANDING" && npx vite preview --port "$PORTA_LANDING" --strictPort --host 127.0.0.1 --logLevel warn) &
URL_LANDING="http://localhost:$PORTA_LANDING" PUBLIC_URL_INICIO=/ npx astro dev "$@"
wait
