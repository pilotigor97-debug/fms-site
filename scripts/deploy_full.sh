#!/bin/bash
# Deploy completo do fms-site (Next.js + Flutter Web embeddado).
#
# Uso:  ./scripts/deploy_full.sh "mensagem do commit"
#
# O que faz:
# 1. Rebuild Flutter web (opspilot/) → sincado em fms-site/public/app/
# 2. Commit + push das mudanças (se houver)
# 3. firebase deploy --only apphosting (FORÇA o rollout do App Hosting)
#
# Por que o passo 3 é obrigatório:
# Push pro GitHub NÃO dispara rollout automático no App Hosting deste
# projeto (backend não tem repo connected via Firebase Console).
# Sem o `firebase deploy`, o bundle novo fica no GitHub mas NÃO no ar.
# Bug "fantasma" de deploy: bundle tá certo no repo, mas usuário vê
# bundle antigo na URL pública.

set -e

MSG="${1:-build(app): sync Flutter web}"
PROJECT="${PROJECT:-opspilot-dev}"

cd "$(dirname "$0")/.."

echo "▶ 1/3 — Rebuild Flutter web (--release, --base-href=/app/)..."
npm run build:flutter

echo ""
echo "▶ 2/3 — Commit + push (se houver mudanças)..."
if ! git diff --quiet HEAD -- public/app/; then
  git add public/app/
  git commit -m "$MSG"
  git push origin "$(git rev-parse --abbrev-ref HEAD)"
else
  echo "  (sem mudanças no public/app/, skip)"
fi

echo ""
echo "▶ 3/3 — firebase deploy --only apphosting (force rollout)..."
firebase deploy --only apphosting --project "$PROJECT"

echo ""
echo "✔  Deploy completo. URL: https://fms-site--${PROJECT}.us-central1.hosted.app"
echo "   Aguarda ~30s antes de testar (CDN warm-up). Hard refresh recomendado."
