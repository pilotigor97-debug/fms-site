# Sprint 5 — Multi-CNPJ Foundation MVP (Fase 1)

**Status:** Em desenvolvimento (branch `feat/sprint5-multi-cnpj`)
**Data:** 2026-05-19
**Roadmap:** Sprint 5 do plano "ROADMAP EXPANSÃO FACILITIES"

## Contexto

FMS hoje assume **1 tenant = 1 CNPJ**. Esse Sprint 5 entrega o MVP do
suporte a **holding (1 user → N CNPJs)** — fundação pra enterprise BR
médio-grande (50-500 colab) que opera grupos com vários CNPJs.

## Escopo entregue (MVP)

### Modelo

`UserModel` extendido em `lib/models/user_model.dart`:

```dart
final String companyId;          // primary (signup, imutável)
final List<String> companyIds;   // todos os CNPJs acessíveis
final String? activeCompanyId;   // qual tá ativo agora (CnpjPicker)
```

Helpers:
- `effectiveCompanyIds` → garante companyId sempre incluído
- `effectiveActiveCompanyId` → fallback pra companyId se null/inválido
- `isHolding` → true se >1 CNPJ
- `copyWithActiveCompany(id)` → clone com tenant ativo trocado

### TenantContext singleton

`lib/services/tenant_context.dart` (NOVO):

```dart
final companyId = await TenantContext.instance.currentCompanyId();
```

- Cache local 5min + invalidação automática em troca de UID
- `setActive(id)` persiste em Firestore + notifyListeners
- `companyIdsForUser()` retorna lista efetiva
- `isHolding()` retorna bool

### Services refatorados (10 críticos)

Substituem helper local `_myCompanyId()/_getCompanyId()` por delegação ao
singleton:

```dart
Future<String> _myCompanyId() async {
  return TenantContext.instance.currentCompanyId();
}
```

Lista: ClientService, ContractService, ShiftService, IncidentService,
PositionService, SiteService, EmployeeService, EmployeeAllocationService,
PlSnapshotService, CashFlowService.

**~50 outros services NÃO foram migrados** (estratégia conservadora —
ficam com helper local antigo até "Polimento Multi-CNPJ Fase 2"). Como
o helper local segue padrão idêntico ao TenantContext lookup, NÃO tem
incompatibilidade — só performance ligeiramente pior (não compartilham
cache).

### firestore.rules

Helper novo:
```firestore
function getUserCompanyIds() {
  return userDoc().get('companyIds', [getUserCompanyId()]);
}
```

`sameCompany(res)` agora usa `in` em vez de `==`:
```firestore
function sameCompany(resourceData) {
  return resourceData.companyId in getUserCompanyIds();
}
```

**53 ocorrências substituídas** em rules (read/write/create). Comparações
`==` zero remaining.

### UI

- `lib/widgets/shell/cnpj_picker.dart` (NOVO) — dropdown no FmsHeader,
  visível só se `user.isHolding && useMultiCnpj`
- `lib/screens/admin/user_companies_screen.dart` (NOVO) — gerenciamento
  por admin: lista CNPJs do user, adicionar/remover (universo limitado
  aos CNPJs do caller)
- Botão "Gerenciar CNPJs" em UserManagement (atrás de feature flag)

### Backend

- `functions/users/assign_secondary_companies.js` (NOVO) — admin atribui
  CNPJs secundários. Valida que caller tem acesso. Audit log.
- `functions/migration/backfill_company_ids.js` (NOVO) — backfill
  `companyIds:[companyId] + activeCompanyId:companyId` em todos users
  do tenant. Idempotente.

### Feature flag

`useMultiCnpj` adicionada ao `FeatureFlags.knownFlags`. Default false.
URL override `?ff=mc`.

## Gaps conhecidos (NÃO entregues — ficam em Fase 2)

1. **Consolidação P&L holding** — `pl_snapshots/${cid}_${period}`
   continua isolado por CNPJ. Diretor de holding ainda vê P&L por CNPJ
   ativo, NÃO consolidado dos N CNPJs. Sprint futuro precisa:
   - Nova collection `holding_pl_snapshots/{holdingId}_{period}`
   - CF aggregator que soma os N children
   - UI dashboard mode "Consolidado" vs "Por CNPJ"

2. **Audit log unified** — `audit_logs` continua por CNPJ singular.
   Holding-wide audit (admin vê tudo que aconteceu nos 5 CNPJs em uma
   busca) requer modelo de relação `holding_audit_view` ou índice
   `companyIds array-contains` (mas audit_logs hoje só tem `companyId`
   string).

3. **~50 services secundários** — continuam com helper local. Quando
   necessário (ex: caching cross-CNPJ), migrar pra TenantContext.

4. **Cache strategy refactor** — DashboardStatsService e similares
   guardam cache por companyId singular. Holding trocando ativo invalida
   cache de A pra B mas pode bagunçar se 2 dashboards abertos com CNPJs
   diferentes. Mitigação atual: cada troca via setActive() limpa cache
   global. Refactor pra dicionário (cache por companyId) fica em Fase 2.

5. **CF aggregations** — `computeEquipmentAlerts`,
   `pl_snapshot_builder`, `cash_movement_writer` etc continuam loop por
   companyId singular. Pra holding consolidado, precisam loop sobre
   children. ~20% das CFs.

6. **UI Settings → Empresas** — user comum vê lista read-only dos CNPJs
   dele + botão "Solicitar acesso a outra empresa" (envia request pra
   admin). NÃO entregue ainda — pode ser feito em Sprint 5C.5.

## Estratégia rollout

1. **Sprint 5 deploy:**
   - Branch `feat/sprint5-multi-cnpj` mergeada após smoke E2E
   - Feature flag `useMultiCnpj` default off em prod-dev
   - Backfill rodado em SoluClean (popula companyIds=[companyId])

2. **Prospect piloto holding** (paralelo Sprint 5+6):
   - Identificar 1 facilities BR com 2-3 CNPJs
   - Demo do CnpjPicker + UserCompanies
   - Coletar feedback de UX antes de Sprint 6

3. **Ativação por tenant:**
   - Admin do tenant ativa flag via Console (settings.featureFlags.useMultiCnpj = true)
   - Demais features (Quality, SLA, Bid) continuam orthogonal

## Riscos

| # | Risco | Mitigação |
|---|---|---|
| F1 | Bug em sameCompany IN deixa user A ver dados CNPJ B | Smoke pentest mental + 1 sprint em SoluClean dev antes de prod |
| F2 | activeCompanyId perdido em algum fluxo (signup, role change) | TenantContext fallback automático pra primary se inválido |
| F3 | Cache stale (user troca CNPJ mas tela mostra dados anteriores) | setActive() limpa cache via notifyListeners |
| F4 | 50 services não-migrados quebram em holding | Não — helper local segue mesma lógica, só sem cache compartilhado |

## Critical files

**Criados:**
- `lib/services/tenant_context.dart`
- `lib/services/multi_cnpj_service.dart`
- `lib/widgets/shell/cnpj_picker.dart`
- `lib/screens/admin/user_companies_screen.dart`
- `functions/users/assign_secondary_companies.js`
- `functions/migration/backfill_company_ids.js`

**Modificados:**
- `lib/models/user_model.dart` (+companyIds, activeCompanyId, helpers)
- `lib/config/feature_flags.dart` (+useMultiCnpj)
- `firestore.rules` (53 substituições == → in)
- `lib/widgets/shell/fms_header.dart` (+CnpjPicker)
- `lib/screens/admin/user_management_screen.dart` (+botão Gerenciar CNPJs)
- 10 services (delegação a TenantContext)
- `functions/index.js` (+2 CFs)

## Verification (smoke E2E)

1. `flutter analyze` → 0 erros (25 infos pré-existentes)
2. `flutter build web --release` → OK 34s
3. Deploy `firebase deploy --only firestore:rules,functions,hosting:dev`
4. Rodar `backfillCompanyIds` CF em SoluClean dev → todos users
   recebem `companyIds: [companyId]`
5. CNPJ picker NÃO aparece (SoluClean 1 CNPJ, isHolding=false)
6. Testar em company hypothetical com 2 CNPJs:
   - Picker aparece após user trocar pra ela
   - Click → menu lista 2 CNPJs
   - Select novo CNPJ → setActive + dashboards atualizam
   - Pentest mental: criar contract em A, NÃO aparece em B
7. Validar regression: rotinas existentes (Sprint 0-4) continuam OK

## Próximos passos

- **Sprint 6** — Quality + Checklist + Supervisor mobile (próximo)
- **Polimento Multi-CNPJ Fase 2** (sprint futuro quando piloto holding
  exigir): consolidação P&L, audit unified, CF aggregations multi-CNPJ
