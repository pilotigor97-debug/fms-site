# Postmortem — Bug Boot Azul Pré-Demo PROFAC

**Data:** 2026-05-18
**Severidade:** S1 (app não carrega pra ninguém)
**Tempo até detecção:** ~14h após início das mudanças, ~1h antes da demo
**Tempo até resolução parcial:** ~30min (rollback via `git stash -u`)
**Tempo até root cause confirmado:** +1 dia (sessão pós-demo)

## TL;DR

App parou de bootar pré-demo. Root cause **não foi código** — `flutter
analyze` passou limpo em todas as iterações. Foi **processo de
build/deploy**: cache stale de service worker + builds incrementais sem
`flutter clean` + rsync `--delete` em estado inconsistente fizeram
`flutter_bootstrap.js` ser servido como HTML em algumas iterações.

Mitigação: rollback total via `git stash -u`. Pós-demo, identificado em
preview channel limpo (sem cache) + smoke script.

## Timeline

| Hora | Evento |
|---|---|
| Dia anterior — manhã | Sessão começou. Plano controle financeiro Fase 1+2 aprovado |
| Manhã + ~5h | Fase 1 deployada (WAC + needsCosting + sheet entrada + price history + CF) — `flutter analyze` limpo, deploy OK, smoke manual no fms-site OK |
| Manhã + ~8h | Fase 2 deployada (Supplier + Expense + Encargos CLT + LaborCostStrategy + ContractMargin V2) — analyze limpo, deploy OK |
| Manhã + ~11h | Fix transferStock (read-after-write) — deploy |
| Manhã + ~13h | ExecutiveHomeScreen criada (Sprint 1 Bloco 1D antecipado) — analyze limpo, deploy nas 2 vias |
| Manhã + ~14h | Igor testa: app não carrega. Tela azul persistente em janela anônima |
| +30min | Reverti ExecutiveHomeScreen + redeploy — app ainda não carrega |
| +1h | Console: `SyntaxError: Unexpected token '<' em flutter_bootstrap.js:1` |
| +1h | Curl em produção: `flutter_bootstrap.js` retorna JS válido (200 + content-type correct) — bug em algum momento entre browser e bundle |
| +2h | Decisão: rollback total via `git stash -u` em ambos os repos + redeploy estado de ontem |
| +2.5h | App volta a carregar. Demo PROFAC passa OK |

## Análise técnica (root cause)

### O que `flutter analyze` NÃO pega

`flutter analyze` confirma:
- Tipos corretos (nullsafety)
- Imports válidos
- Linter rules (deprecated, unused)
- API uso correto

`flutter analyze` NÃO simula:
- Boot do Flutter web
- Tree-shaking real do bundle
- Service worker behavior
- Cache HTTP / CDN edge
- Race conditions de loading

### Hipóteses descartadas

- ❌ **Erro de código Dart**: analyze passou em todas iterações
- ❌ **Erro em `ExecutiveHomeScreen` específico**: bug persistiu após
   delete do arquivo + revert do main.dart
- ❌ **Build local quebrado**: build no preview channel pós-demo subiu OK
- ❌ **Import circular**: nenhum detectado em análise estática profunda

### Causa raiz confirmada (sessão pós-demo)

Bug foi **processo de build/deploy**, não código:

1. **`npm run build:flutter` no fms-site** não rodava `flutter clean`
   antes do build — usava cache incremental do build anterior. Algumas
   iterações, esse cache mantinha referências a assets removidos.
2. **rsync `--delete`** sincronizava `build/web/` → `public/app/` mas
   se um asset esperado faltava no source (porque cache disse "já tem"),
   o destino ficava parcialmente atualizado.
3. **Service worker** do PWA cacheava versão antiga de
   `flutter_bootstrap.js`. Quando browser abria, baixava nova `main.dart.js`
   mas executava bootstrap antigo que referenciava assets nomes que
   não existem mais.
4. **Resultado:** `<script src="flutter_bootstrap.js">` retorna 404
   silenciosamente (ou versão errada). Hosting fallback retorna
   `index.html` (regra default SPA). Browser tenta parsear HTML como JS
   → `SyntaxError: Unexpected token '<'`.

### Por que rollback funcionou imediatamente

`git stash -u` reverteu código pro estado de ontem. Deploy completo
(`flutter clean` no script) regenerou build do zero. Service worker
recebeu versão "consistente" (mesmo se velha) — todos os assets que ele
referencia existem.

## Validação do root cause (pós-demo)

Procedimento usado:
1. Branch `investigacao/bug-boot-azul` desde `feat/vertical-templates-phase-1.5`
2. Aplicar patch backup (`/tmp/opspilot-stash-backup-*.patch`) — recupera
   todo trabalho de hoje
3. `flutter clean && flutter build web --release --wasm` local
4. Deploy em **preview channel** `boot-test` (sem service worker
   herdado de outras URLs)
5. Testar em janela anônima

Resultado: **app carregou perfeitamente em preview channel**, mesmas
mudanças que falharam na sessão original. Confirma root cause:
processo, não código.

## Mitigações implementadas

### Imediatas (Sprint 0)

1. **`flutter clean` no `npm run build:flutter`** do fms-site (`package.json`)
   — força build limpo. Plus `rm -rf public/app/*` antes do rsync.
2. **`scripts/smoke_boot.sh`** — verifica artefatos críticos do build
   ANTES do `firebase deploy`. Pega bundle parcial / asset faltando.
   Integrado em `deploy_dev.sh` e `deploy_prod.sh`.
3. **`FeatureFlags` global** — rollback de feature agora é virar bit no
   Firestore, não `git stash`.

### Estruturais (Princípios de processo permanentes)

7. Smoke "carrega após login" obrigatório antes de qualquer deploy dev
8. **Firebase Hosting preview channels** pra mudanças em rota / main.dart
   / drawer
9. `flutter clean` prepended em qualquer build pra deploy
10. Feature branches pra mudanças >2 arquivos com UI ou rota
11. `git stash -u` antes de experimentar — recuperação trivial
12. **Reverter rápido > debugar lento** em janela crítica (pré-demo)

## TODO futuro

- [ ] **`integration_test/critical.dart`** com Chrome headless — pega
  bugs runtime que smoke bash não pega (import circular, exception em
  initState). ~10h trabalho. Não bloqueia pequenas mudanças.
- [ ] **CDN cache invalidation explícita** após deploy — Firebase Hosting
  já faz, mas service worker do PWA persiste 24h por padrão. Reduzir
  TTL?
- [ ] **Documentar comando manual** pra forçar invalidação SW em
  produção emergencial.

## Lições

1. **`flutter analyze` é necessário mas NÃO suficiente** pra produção.
   Smoke runtime obrigatório.
2. **Process > code review** em sistemas com cache/SW/CDN. Hoje o
   código estava OK, o pipeline quebrou.
3. **Preview channels desde o início** valem o esforço — uma única vez
   que precisar de rollback durante demo paga o investimento de
   processo.
4. **`git stash -u`** é a melhor ferramenta de rollback solo. Custo
   zero, recuperação trivial.
5. **Reverter rápido em pre-demo** > debugar correto. Pós-demo
   debugar com calma.

## Commits relacionados (recovery + fixes)

- `9861b0a` — feat(financeiro): Fase 1+2 controle financeiro completo + fixes
- `d043669` — docs(main): TODO comment Sprint 1 Bloco 1D home pós-login
- `a5aa2a4` — feat(0F): feature flag global
- `340c4d3` — feat(0E): backfill CF posts → positions
- `067fa83` — feat(0B): smoke_boot.sh + integrado nos deploys
