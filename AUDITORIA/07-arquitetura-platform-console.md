# Plano: FMS Platform Console (Control Tower interno)

## Contexto

**Trigger imediato:** SoluClean precisa de mais dias de trial. Hoje, estender exige editar `companies/{cid}.billing.trialEndsAt` direto via Firebase Console. Doloroso, sem auditoria, fácil de errar (regravar tipo, sobrescrever campo errado). Em 50+ tenants isso vira incidente recorrente.

**Por que agora:** o sistema já tem multi-tenant maduro (companies + audit_logs + billing + AI usage), mas falta uma **camada de governança** entre o dono (você) e os tenants. Cada operação repetitiva (estender trial, dar crédito, suspender, ver consumo) está virando "edição manual no Firestore" — não escala.

**Objetivo:** criar um console interno chamado **FMS Platform Console** rodando em `fms-site/app/(platform)/admin/*`, restrito a usuários com claim `platformAdmin: true`, que centraliza 10 módulos: gestão de tenants, suporte, impersonation, billing, monitoria IA, feature flags, saúde da plataforma, auditoria, analytics e white-label.

**Resultado esperado pós-Fase 1 (1-2 sprints):** estender trial de qualquer tenant em 3 clicks com auditoria. Ver lista de tenants com plano/status/consumo. Suspender/reativar tenant.

**Foundation pra Fases 2-5:** billing avançado, impersonation auditada, observabilidade, feature flags, AI governance.

---

## Arquitetura: separação Platform vs Tenant

### Princípio central
**Tudo que o FMS-operador faz vs tudo que o tenant faz** vive em coleções e auth claims DIFERENTES. Sem overlap.

| Camada | Quem | Coleções | Auth |
|---|---|---|---|
| **Platform** | Dono FMS + equipe interna | `platform_*` (novas) | `platformAdmin: true` em custom claim |
| **Tenant** | Diretor, admin, técnico da empresa | `companies/{cid}/...` + `audit_logs` + `ai_usage_log` (existentes) | `companyId: X` em custom claim |

**Não misturar.** Um `platform_admin` NÃO é também um `user` em company nenhuma (UIDs separados). Se o dono também opera SoluClean, ele tem 2 contas (uma "fernandes@fms.io" platform admin, outra "fernandes@soluclean.com" user da company).

### Onde vive o console

**Decisão**: dentro de `fms-site/` no path `/admin/*`, em um novo route group `(platform)` separado dos atuais `(auth)` e `(marketing)`.

```
fms-site/
  app/
    (marketing)/...        ← público (existente)
    (auth)/...             ← login + signup tenant (existente)
    (platform)/            ← NOVO route group
      admin/
        layout.tsx         ← gate + nav lateral
        page.tsx           ← dashboard
        tenants/
          page.tsx         ← lista
          [cid]/page.tsx   ← detalhe
        billing/
        ai-usage/
        feature-flags/
        audit/
        impersonation/
        health/
```

**Por que aqui (não em projeto separado):**
- Reusa Next.js, Firebase Auth, hosting já configurado
- Mesmo deploy pipeline (Firebase App Hosting)
- Middleware pode bloquear `/admin/*` para non-admins (gate em 1 lugar)
- Subdomínio futuro `admin.fms.io` é configuração de hosting, não projeto novo

**Auth gate em camadas:**
1. Middleware: `/admin/*` exige user autenticado (redireciona pra /login se não)
2. Layout: client-side checa `idTokenResult.claims.platformAdmin === true`, se false mostra 403 + link "voltar"
3. Cada callable platform_* re-valida no server-side `request.auth.token.platformAdmin === true`

3 camadas porque cliente pode ser modificado; CFs são a verdade.

---

## Modelagem de dados (Firestore)

### Novas coleções platform-level

```
/platform_admins/{uid}
  email: string
  role: 'owner' | 'support' | 'finance' | 'readonly'
  addedAt: Timestamp
  addedBy: uid                  // outro admin
  active: bool

/platform_audit/{auto_id}
  adminUid: uid
  adminEmail: string            // snapshot pra forense pós-deletar admin
  action: string                // ex: 'tenant.extend_trial', 'tenant.suspend'
  targetCompanyId: string?      // nullable (algumas ações globais)
  targetUserId: string?
  payload: map                  // input da ação (sanitizado)
  result: 'success' | 'denied' | 'error'
  errorMessage: string?
  impersonationSessionId: string?  // se via impersonation, qual sessão
  ip: string
  userAgent: string
  createdAt: Timestamp serverTimestamp
  // IMMUTABLE: rules permitem só create, nunca update/delete

/impersonation_sessions/{sid}
  adminUid: uid
  adminEmail: string
  targetCompanyId: string
  targetUserId: string          // qual user dentro da company
  reason: string                // obrigatório, 50+ chars
  startedAt: Timestamp
  expiresAt: Timestamp          // start + duration (max 60min)
  endedAt: Timestamp?           // populated quando user faz logout/expira/admin termina
  endReason: 'expired' | 'admin_terminated' | 'auto_logout'
  // IMMUTABLE: rules permitem só create + 1 update (set endedAt)

/feature_flags/{flagId}
  name: string                  // ex: 'ai_chat_v2'
  description: string
  scope: 'global' | 'tenant'
  defaultValue: bool | string | number
  // tenant-scoped overrides; flag não-listada = defaultValue
  overrides: map<companyId, value>
  rolloutPercent: number?       // 0-100 — gradual rollout opcional
  updatedAt: Timestamp
  updatedBy: uid

/plans/{planId}
  // FUTURO — hoje plano é hardcoded em asaas_billing.js
  id: 'fms_starter_v1' | 'fms_pro_v1' | 'fms_business_v1'
  name: string
  priceBrl: number
  cycle: 'MONTHLY' | 'YEARLY'
  trialDays: number             // default 14
  aiCreditsIncluded: number     // mensais
  features: string[]            // 'recurring_jobs', 'gps_checkin', etc
  active: bool
  // permite criar novos planos sem deploy

/platform_metrics_daily/{YYYY-MM-DD}
  // Agregação noturna pra dashboards. CF agendada calcula.
  totalTenants: number
  activeTenants: number
  trialingTenants: number
  pastDueTenants: number
  canceledTenants: number
  mrrBrl: number
  newSignups: number
  aiTokensUsed: number
  aiCostBrl: number
  serviceOrdersCreated: number
  // 365 docs/ano, custo mínimo
```

### Extensões em coleções existentes

```
/companies/{cid}
  // EXISTE: billing, aiCredits, settings, branding
  // ADICIONAR:
  suspended: bool?              // operador FMS suspendeu
  suspendedAt: Timestamp?
  suspendedReason: string?
  suspendedBy: uid?             // platformAdmin uid
  featureOverrides: map?        // copy dos feature flags pra avoid query no read path
  notes: string?                // platform notes ("este tenant tá pagando atrasado mas é grande")
  
/users/{uid}  
  // EXISTE: companyId, role, preferences
  // ADICIONAR:
  platformImpersonatedAt: Timestamp?    // last impersonated
```

### Custom claims Firebase Auth

```js
// Para platform admins
{ platformAdmin: true, platformRole: 'owner' }

// Para tenant users (já existe)
{ companyId: 'xyz', role: 'diretor' | 'admin' | 'tecnico' }

// Para impersonation (criado no fluxo)
{
  companyId: 'xyz',                     // tenant que está sendo impersonado
  role: 'diretor',                      // role assumido
  impersonatedBy: 'admin_uid',          // QUEM tá impersonando
  impersonationSid: 'session_id',
  exp: 1234567890                        // unix ts curto (15-60min)
}
```

---

## 10 Módulos detalhados

### Módulo 1 — Tenant Management

**Tela:** `/admin/tenants` — tabela com filtros + ações em massa.

**Colunas:**
- Nome + branding.displayName
- CNPJ (se preenchido)
- Vertical (cleaning/hvac/...)
- Plano + status (trialing/active/past_due/canceled/suspended)
- Trial expira em (se trialing)
- Usuários (count cached)
- OS último 30d (count agregado)
- Créditos AI: balance + canPurchase
- Última atividade (max(updatedAt) dos users)

**Filtros:** status, vertical, busca por nome/CNPJ/email-do-diretor.

**Detalhe `/admin/tenants/{cid}`:**
- Header: nome, status, ações rápidas (suspender/reativar/estender trial/adicionar créditos)
- Tabs: Overview / Users / Billing / AI Usage / Audit log / Feature Flags / Suporte

**Callables novas:**
- `platformListTenants(filter, cursor)` — paginated, filtros server-side
- `platformGetTenantDetail(companyId)` — agrega contagens (users, ordens, etc)
- `platformExtendTrial(companyId, days, reason)` — atualiza `billing.trialEndsAt += days`, audit log
- `platformSuspendTenant(companyId, reason)` — seta `suspended: true`, todas as CFs checam e throw
- `platformReactivateTenant(companyId, reason)`
- `platformGrantAiCredits(companyId, amount, reason)` — soma a `aiCredits.balance`
- `platformChangePlan(companyId, planId, reason)` — atualiza `billing.planId` + features

**Auditoria:** cada chamada escreve em `platform_audit` ANTES de aplicar a mudança (transação).

### Módulo 2 — Support Console

**Tela:** `/admin/tenants/{cid}/support`

**Recursos:**
- View dos últimos 100 audit_logs do tenant (action, before/after diff)
- View dos 50 erros mais recentes (do Cloud Logging via API ou collection `platform_errors` populada por trigger)
- Lista de OS/tickets recentes com status
- Botão "Abrir tenant em modo suporte" → fluxo de impersonation
- Notas internas (texto livre, salvas em `companies/{cid}.notes` com timestamp)

**Não escreve nada do tenant**. Read-only + notas. Modificações reais vão via impersonation (auditadas).

### Módulo 3 — Impersonation (CRÍTICO)

**Fluxo completo:**

1. **Admin solicita** em `/admin/tenants/{cid}` → modal "Impersonar como":
   - Dropdown: qual user da company (default: diretor)
   - Campo obrigatório: motivo (mín 30 chars)
   - Duração: 15min / 30min / 60min (max 60)
   - Botão "Iniciar sessão"

2. **CF `platformRequestImpersonation(companyId, targetUserId, reason, durationMinutes)`:**
   - Valida `platformAdmin: true` no token
   - Valida reason length >= 30
   - Valida duration <= 60
   - Cria doc em `impersonation_sessions/{sid}` (auto-id)
   - Cria custom token via Firebase Admin SDK com claims:
     ```js
     { 
       companyId, 
       role: targetUser.role,
       impersonatedBy: adminUid,
       impersonationSid: sid,
       exp: now + durationMinutes*60
     }
     ```
   - Escreve `platform_audit`: action='impersonation.start', payload={companyId, targetUserId, reason, durationMinutes}
   - Retorna `{ customToken, sessionId, expiresAt }`

3. **Frontend** abre em **nova aba**:
   - `signInWithCustomToken(token)` no Firebase Auth
   - Redirect pro app Flutter normal
   - **Banner persistente no topo**: "Você está impersonando SoluClean (Igor Diretor). Encerra em 14:32. [Encerrar]"

4. **Durante a sessão**, TODAS as callables verificam `request.auth.token.impersonationSid`:
   - Se presente: adicionar `impersonatedBy: adminUid` em qualquer `updatedBy` ou audit log que a operação gerar
   - Isso preserva o trail: "OS X foi modificada por user_Y mas via impersonation do admin_Z"

5. **Encerramento:**
   - Auto: token expira, próxima chamada CF retorna 401, frontend força logout
   - Manual: admin clica "Encerrar" → CF `platformEndImpersonation(sid)` invalida (revoga custom token via Firebase Auth `revokeRefreshTokens`), atualiza `impersonation_sessions/{sid}.endedAt`
   - Audit final: action='impersonation.end'

**Pontos de segurança críticos:**
- `firestore.rules`: TODAS as regras existentes que checam `request.auth.token.companyId == resource.data.companyId` continuam valendo (impersonation passa o companyId no token). Não precisa rule especial.
- **Operações destrutivas (delete OS, cancel billing) DEVEM ser bloqueadas durante impersonation** — adicionar check `if (request.auth.token.impersonationSid) throw`. Suporte vê, não destrói.
- **No PDF/email gerado durante impersonation, NÃO marcar com nome do admin** — usar nome do user normalmente. Senão admin aparece em fatura de cliente final, confuso.

### Módulo 4 — Billing & Subscriptions

**Tela:** `/admin/billing`

**Recursos:**
- Lista de subscriptions ativas (linkado a `companies`)
- MRR breakdown por plano
- Tenants em past_due (lista de cobrança)
- Histórico de Asaas webhooks recentes (debug)

**Por tenant em `/admin/tenants/{cid}/billing`:**
- Status atual: trialing/active/past_due
- Asaas customer ID + subscription ID (link clicável pra painel Asaas)
- Histórico de pagamentos
- Botão "Estender trial" (X dias, com motivo)
- Botão "Marcar como ativo manualmente" (situações especiais — bug de Asaas, pagamento out-of-band)
- Botão "Cancelar subscription" → calls existing `cancelAsaasSubscription`

**Plans CRUD:** `/admin/billing/plans` — criar/editar planos. Reflete em `plans/{id}`. Asaas integration via webhook recebe planId via externalReference (já existe).

### Módulo 5 — AI Usage Monitoring

**Tela:** `/admin/ai-usage`

**Dashboards:**
- Custo total mês corrente (BRL) — soma de `ai_usage_log.brlCost` agregado por dia
- Top 10 tenants por consumo
- Tokens vs custo real (Gemini API charges)
- Rate-limit alerts: tenants que bateram limit nas últimas 24h

**Por tenant em `/admin/tenants/{cid}/ai-usage`:**
- Balance, totalConsumed, canPurchase, dailyCapBrl
- Histórico de últimos 100 ai_usage_log
- Botões: "Adicionar créditos" / "Resetar daily cap" / "Bloquear IA"
- Detecção automática de abuso: se uso ULTRAPASSA padrão típico (ex: 50 req/h sustentado), flag visual

**Anti-abuso operacional:** tenant gastando 5x média → CF agendada nightly cria alert em `platform_alerts` (collection nova). Console mostra. Admin decide.

### Módulo 6 — Feature Flags

**Tela:** `/admin/feature-flags`

**CRUD de flags:**
- Listar todas
- Editar default value
- Editar overrides por tenant (table: companyId | value)
- Rollout gradual: % de tenants que recebem o novo valor (aleatoriamente)

**Como o app consome:**
- Boot do app: chama `getFeatureFlags(companyId)` → CF retorna map `{ flagName: value }` resolvendo overrides
- Cache em memória, refresh on app foreground OR Firestore listener em `feature_flags`
- Helper `featureFlag('ai_chat_v2', defaultValue)` em código Flutter

**Casos de uso:**
- Lançar feature pra 10% dos tenants primeiro (rollout 10%)
- Habilitar beta feature pra cliente específico (override)
- Kill switch: desabilitar feature problemática globalmente (default false)
- Premium-gated: feature só pra plano Business (overrides via plan)

### Módulo 7 — Platform Health

**Tela:** `/admin/health`

**Dashboards:**
- Functions: invocations/min, error rate, p95 latency (via Cloud Monitoring API ou logs)
- Firestore: reads/writes diárias, estimated cost
- Storage: bytes totais, growth rate
- Active sessions: contagem de auth tokens válidos
- Backups recentes (memória menciona backupFirestoreMonthly): status última run

**Alertas (collection `platform_alerts`):**
- Auto-gerados por CFs agendadas
- Tipos: ai_cost_spike, function_error_spike, storage_growth_abnormal, backup_failed
- Cada alert tem severidade + acknowledged/dismissed

### Módulo 8 — Security & Audit

**Tela:** `/admin/audit`

**Lista de `platform_audit`** com filtros:
- adminUid, action, targetCompanyId, date range, result
- Export CSV (LGPD: você pode precisar provar quem fez o quê)

**Tela `/admin/audit/cross-tenant`:**
- Detecta tentativas suspeitas (via logs estruturados que adicionei hoje em security.lookup_*)
- IPs probando >10 companies/hora → flag
- Failed auth bursts → flag

### Módulo 9 — Analytics

**Tela:** `/admin/analytics`

**KPIs:**
- MRR atual + crescimento MoM
- New signups por dia/semana
- Churn rate (cancelados/total)
- Trial → paid conversion rate
- Avg OS/tenant ativo
- Top verticais por receita
- AI usage cost vs revenue ratio

**Fonte:** `platform_metrics_daily` (CF agendada nightly agrega) + queries on-demand sobre companies para slice/dice.

### Módulo 10 — White-label Management

**Tela:** `/admin/tenants/{cid}/branding`

**Recursos:**
- Form pra editar `companies/{cid}.branding`: displayName, logoUrl, primaryColor, faviconUrl, welcomeMessage, subdomain
- Preview ao vivo do que vai aparecer no header do app Flutter
- Upload de logo direto pro Storage com path correto
- Verificação de slug de subdomain (já existe `claimSubdomain` CF)

---

## Roadmap (5 fases)

### Fase 1 — MVP "Extend Trial" + Tenant List (1-2 sprints, ~1 semana)

**Mínimo pra resolver o trigger (SoluClean trial extension):**

- Collection `platform_admins` + 1 doc com seu UID e role='owner'
- Firebase Auth custom claim `platformAdmin: true` setado via script de seed (`scripts/seed_platform_admin.js`)
- Middleware atualiza pra bloquear `/admin/*` se não auth + redirect login
- Layout `/admin` com check `platformAdmin === true` (403 senão)
- Página `/admin/tenants` — lista paginada via callable `platformListTenants`
- Página `/admin/tenants/[cid]` — detalhe básico
- 1 callable + UI: `platformExtendTrial(cid, days, reason)` com modal + audit log
- 1 callable + UI: `platformGrantAiCredits(cid, amount, reason)` (provavelmente útil junto)
- Collection `platform_audit` com firestore.rules write-only (no update/delete)

**Após Fase 1**: você abre `/admin/tenants/soluclean-cid`, clica "Estender trial", coloca "+30 dias, cliente strategic", commit. SoluClean tem 30d a mais, audit registra. **Trigger resolvido.**

### Fase 2 — Billing + Analytics (2-3 sprints)

- `plans/{id}` collection + admin UI pra criar/editar
- `/admin/billing` com MRR, past_due lista, history
- `platformChangePlan` callable
- `platformSuspendTenant` + `platformReactivateTenant` (importante pra past_due)
- CF agendada `computeDailyMetrics` → escreve `platform_metrics_daily`
- `/admin/analytics` com KPIs básicos
- `firestore.rules` extends: companies CFs check `suspended: true` → throw

### Fase 3 — Impersonation + Observability (3 sprints)

- Collection `impersonation_sessions` + rules immutability
- `platformRequestImpersonation` CF + `platformEndImpersonation` CF
- Frontend modal + handoff pra Flutter app via custom token
- Banner persistente no app Flutter durante impersonation
- Audit log enrichment: todas operações durante impersonation marcam `impersonatedBy`
- Block destructive ops (delete, cancel) durante impersonation
- `/admin/health` dashboard com Cloud Monitoring integration

### Fase 4 — Feature Flags (2 sprints)

- Collection `feature_flags` + CRUD admin UI
- Helper Flutter `featureFlag(name, defaultValue)` + cache
- Helper Next.js similar pro site
- Rollout gradual via hash(companyId) % 100 < rolloutPercent
- Migrate `canPurchase` to feature flag (`ai_allowed`) como precedente

### Fase 5 — AI Governance + White-label Bulk (2-3 sprints)

- `/admin/ai-usage` dashboards completos
- Anomaly detection via CF agendada (5x média = alert)
- `platform_alerts` collection + UI
- Bulk operations: editar branding em múltiplos tenants, bulk grant credits, bulk plan migration
- Export CSV de tudo (audit, billing, analytics) pra compliance

---

## Segurança — checklist crítico

| Risco | Mitigação |
|---|---|
| Admin platform usa credencial roubada | MFA obrigatório (Firebase Auth multi-factor) pra todos `platform_admins`. Curto TTL de session (1h). |
| Audit log adulterado | `firestore.rules` permite só `create` em `platform_audit` — nunca update/delete. Backup diário do log. |
| Impersonation usada maliciosamente | Sessão TTL max 60min. Sempre exige `reason` (50+ chars). Toda ação durante impersonation marca `impersonatedBy`. Banner permanente no app durante sessão. Block destructive ops. |
| Admin operando 2 contas (platform + tenant) confunde | UIDs separados. Platform admin claim é mutex com companyId claim — não pode coexistir no mesmo token. |
| Feature flag mudada acidentalmente afeta todos os tenants | Toda mudança em `feature_flags` exige `confirmAt = now()` no payload + role 'owner' (não 'support') |
| Suspended tenant ainda recebe writes | CFs `verifyTenantActive(companyId)` no início de toda callable de tenant → throw se `suspended: true` |
| Plan downgrade perde features pagas | Soft-suspend de features durante grace period (7d) em vez de cortar imediato |

---

## Arquivos a criar/modificar

### Novos (estimativa: ~3000 linhas)
- `functions/platform/` — toda lógica admin (10-15 callables)
  - `platform_admins.js` — gate helper `assertPlatformAdmin(request)`
  - `platform_audit.js` — helper `logPlatformAction(...)`
  - `tenant_management.js` — callables 1-7 do módulo 1
  - `impersonation.js` — request + end
  - `feature_flags.js` — get + set
  - `billing_admin.js` — change plan, extend trial, grant credits
- `fms-site/app/(platform)/admin/` — UI Next.js completa
- `fms-site/lib/platform/` — client helpers (callables wrappers, types)
- `firestore.rules` — adicionar regras pra todas as coleções platform_*
- `scripts/seed_platform_admin.js` — bootstrap inicial

### Modificações (estimativa: ~500 linhas)
- `functions/index.js` — adicionar checks `verifyTenantActive` em ~20 callables
- `firestore.rules` — companies/users/etc ganham regras read pra platformAdmin
- `lib/main.dart` (Flutter) — banner de impersonation
- `lib/services/feature_flag_service.dart` (novo) — Flutter side
- `middleware.ts` (site) — bloquear /admin/* unauthed
- `lib/utils/feature_flag.ts` (site) — Next.js side

### Coleções Firestore criadas
- `platform_admins`, `platform_audit`, `impersonation_sessions`, `feature_flags`, `plans`, `platform_metrics_daily`, `platform_alerts`

---

## Estimativa de esforço

| Fase | Esforço focado | Calendário sozinho | Com 1 dev |
|---|---|---|---|
| Fase 1 (MVP trial) | 15-20h | 1 semana | 3-4 dias |
| Fase 2 (billing+analytics) | 30-40h | 2-3 semanas | 1-1.5 semanas |
| Fase 3 (impersonation+observability) | 40-50h | 3-4 semanas | 2 semanas |
| Fase 4 (feature flags) | 20-30h | 1.5-2 semanas | 1 semana |
| Fase 5 (AI gov+bulk) | 30-40h | 2-3 semanas | 1.5 semanas |

**Total**: ~135-180h focado. ~10-12 semanas sozinho. ~6-7 semanas com 1 dev.

---

## NÃO faz parte deste plano

1. **Login social / SAML** pra platform admins — over-engineering pra <10 admins
2. **Real-time collaboration** entre admins — não precisa
3. **Mobile app pro console** — Next.js responsive serve
4. **Self-service signup de admins** — admins criados manualmente via script (5-10 pessoas no total)
5. **Dashboard customizável pelo admin** — fixed dashboards são suficientes
6. **Integração com Slack/Discord** pra alerts — email + UI já cobrem
7. **Backup/restore individual de tenant** — usar Firestore native export
8. **Bi-direcional sync com Asaas** — webhook one-way já existe, suficiente
9. **SOC 2 / ISO compliance tooling** — quando tiver 50+ clientes pagantes

---

## Decisões pendentes pro dono

1. **Auth model platform**: claim `platformAdmin` simples vs role granular ('owner'/'support'/'finance'/'readonly')?
   - Recomendação: role granular desde Fase 1 (não custa muito mais e dificulta retrofit)

2. **Impersonation: bloquear delete?** Suporte às vezes PRECISA deletar OS bugada do tenant.
   - Recomendação: bloquear no Fase 3, adicionar "confirm with 2nd admin" no Fase 5 se virar necessário

3. **Feature flags em Flutter**: usar Firestore real-time listener ou refresh on-demand?
   - Recomendação: refresh on app foreground (não real-time — economiza Firestore reads)

4. **Plan vs Tenant subscription**: 1 plano serve N tenants vs cada tenant tem subscription customizada?
   - Recomendação: planos fixos + overrides via featureOverrides + grants AI credits. Mantém simples.

5. **Onde rodar `computeDailyMetrics`**: Cloud Function agendada vs Cloud Run job?
   - Recomendação: CF agendada (alinhado com `computeEquipmentAlerts`), mover pra Run só se tempo > 540s

---

## Verificação end-to-end (após Fase 1)

1. **Seed inicial**:
   ```bash
   node scripts/seed_platform_admin.js --uid=YOUR_UID --email=fernandes@fms.io --role=owner
   ```

2. **Login**: abrir `https://fms-site--opspilot-dev.us-central1.hosted.app/login`, autenticar com fernandes@fms.io

3. **Verificar gate**: navegar pra `/admin` → ver dashboard. Tentar com outra conta → 403.

4. **Listar tenants**: `/admin/tenants` mostra SoluClean + outros companies em desenvolvimento

5. **Estender trial SoluClean**: click no tenant → "Estender trial" → "+30 dias, cliente strategic" → confirmar

6. **Verificar Firestore**:
   - `companies/{soluclean-cid}.billing.trialEndsAt` avançou 30d
   - `platform_audit/{auto_id}` tem doc com action='tenant.extend_trial', adminUid=seu_uid, payload={days:30, reason:'...'}

7. **Smoke test rules**:
   - Tentar `firestore.set('platform_admins/{otherUid}', ...)` direto via SDK → DENIED
   - Tentar `firestore.update('platform_audit/{id}', {})` → DENIED
   - Tentar `getDoc('platform_audit/{id}')` como non-admin → DENIED
