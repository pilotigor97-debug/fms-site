# Plano: i18n bilíngue (PT-BR + EN) — site + app + CFs

## Contexto

Hoje o stack é PT-BR-only com 1 exceção isolada: a landing `landscaping` no site está em EN como prova-de-conceito, sem suporte real de i18n por baixo. Surgiram 2 sinais de que isso precisa virar arquitetura, não exceção:

1. `landscaping` é vertical US/EN — vai precisar onboarding, app, emails e push em EN pra ter sentido.
2. `verticals.json` já carrega `aiContext.pt` + `aiContext.en` e `labels.pt` + `labels.en` desde o Sprint A.4 — metade do caminho já tá feito no app/CFs, mas nada conecta isso a uma escolha real de locale.

**Decisões já travadas pelo dono:**
- **Driver**: future-proof, sem prazo. Foundation primeiro, traduzir conteúdo incremental.
- **URL strategy site**: path prefix. PT-BR fica em `/`, EN em `/en/...`.
- **Locale model**: híbrido. `Company.settings.defaultLocale` como padrão da empresa + `User.preferredLocale` opcional como override por usuário.

**Resultado esperado:** quando uma empresa US fizer signup em `/en/sign-up?vertical=landscaping`, todo o fluxo (site → handoff → app → emails → push) sai em EN sem regressão para SoluClean (PT). Tradução de 100% das ~800 strings do app fica como roadmap incremental — **fora deste plano**.

---

## Arquitetura

| Camada | Decisão | Mecanismo |
|---|---|---|
| Site Next.js | `next-intl@^3.22` com path prefix em segment `[locale]` | lib |
| Site middleware | Compor com tenant routing atual — locale só roda em hosts marketing | edit middleware.ts |
| Verticals (site) | Split `lib/marketing/verticals/{id}.ts` → `{id}/pt.ts` + `{id}/en.ts` + registry locale-aware | refactor |
| Site ↔ app SSoT de nomes | `verticals.json` é fonte; site gera `_names.generated.ts` via prebuild | script Node |
| Flutter app | `gen-l10n` nativo + `.arb` files | toolchain Flutter |
| Flutter locale switching | `LocaleProvider extends ChangeNotifier` no topo do MaterialApp | provider (já dep) |
| Flutter persistência | SharedPreferences (offline) + `users/{uid}.preferredLocale` (sync) | já dep |
| CFs | Templates em `functions/i18n/{emails,push,errors}/` exportando `{pt-BR, en}` | refactor |
| HttpsError | Front mapeia chave (`error.details.i18nKey`) + fallback PT no `message` | convenção |
| Firestore | `companies/{cid}.settings.defaultLocale` + `users/{uid}.preferredLocale` (nullable) | model edit |

**Locale codes canônicos:** `'pt-BR'` e `'en'`. Flutter usa `Locale('en', 'US')` internamente por compat com `flutter_localizations` — `normalizeLocale()` em ambos os lados converte. **Esse mismatch é a fonte #1 de bugs futuros — função obrigatória.**

---

## Fase 0 — Preparação (½ dia, sem mudança em runtime)

- Definir contrato dos locale codes: `lib/utils/locales.dart` (Flutter) + `lib/locales.ts` (site) com `normalizeLocale()` em ambos.
- Definir namespace de keys: `<scope>.<key>` (ex: `auth.signup.title`).
- Confirmar: `verticals.json` continua SSoT de **labels de domínio** (ticket/order); `.arb` e `messages/` carregam **UI chrome** (botões, validações). Sem overlap.

---

## Fase 1 — Foundation (1-2 semanas)

### A. Site Next.js

**Lib:** `next-intl@^3.22` (Vercel recomenda pra App Router; suporta `typedRoutes` desde 3.15+).

**Estrutura final:**
```
fms-site/
  app/
    [locale]/              ← move tudo de (auth) e (marketing) pra cá
      layout.tsx           ← <html lang> reativo
      (auth)/...
      (marketing)/...
    api/                   ← fica fora de [locale]
  messages/
    pt-BR.json
    en.json
  i18n.ts                  ← config next-intl + pathnames map
  middleware.ts            ← composto (tenant + locale)
  lib/navigation.ts        ← Link/router tipados de next-intl
```

**Slugs traduzidos:** `/criar-conta` (PT) ↔ `/en/sign-up` (EN), `/recursos` ↔ `/en/features`, `/planos` ↔ `/en/pricing`. `next-intl` `pathnames` config faz o mapping.

**Middleware composto — ordem importa:**
1. `/app/*`, `/t/*`, `/api/*` → passa direto (sem locale).
2. Host não é marketing root (subdomínio tenant) → tenant rewrite atual, sem locale.
3. Host é marketing → `next-intl` middleware: path com `/en/...` mantém, sem prefix assume `pt-BR`.

**Críticos:**
- `<html lang="pt-BR">` hardcoded em [app/layout.tsx:19](development/fms-site/app/layout.tsx) → reativo via `params.locale`.
- `typedRoutes: true` em [next.config.mjs:5](development/fms-site/next.config.mjs) — trocar `import Link from "next/link"` por `import { Link } from "@/lib/navigation"` em ~20 lugares.
- `hreflang` via `generateMetadata` em cada page.

**Verticals — refactor:**
```
lib/marketing/verticals/
  rental/pt.ts, rental/en.ts           ← .en.ts = vazio com TODO no Fase 1
  cleaning/pt.ts, cleaning/en.ts
  hvac/pt.ts, hvac/en.ts
  remodeling/pt.ts, remodeling/en.ts
  facilities/pt.ts, facilities/en.ts
  landscaping/pt.ts (TODO), landscaping/en.ts  ← landscaping inverte
  index.ts: getVertical(id, locale) → VerticalMarketing | null
```
Code-splitting por locale economiza bundle no client.

**Language switcher:** botão minimalista "PT / EN" em `components/marketing/nav.tsx`. `useLocale()` + `router.replace(pathname, {locale})` preserva caminho atual.

### B. Flutter app

**Setup:**
- `pubspec.yaml`: adicionar `flutter: generate: true`.
- Criar `l10n.yaml` na raiz com `template-arb-file: app_pt_BR.arb`.
- Criar `lib/l10n/app_pt_BR.arb` + `lib/l10n/app_en.arb`.

**Locale reativo no MaterialApp:**
- Criar `lib/providers/locale_provider.dart` (`ChangeNotifier` com `Locale` state).
- Envolver `MaterialApp` em `ChangeNotifierProvider<LocaleProvider>`.
- Trocar `locale: const Locale('pt', 'BR')` hardcoded em [main.dart:269](development/opspilot/lib/main.dart) por `provider.locale`.
- Adicionar `AppLocalizations.delegate` ao `localizationsDelegates` em [main.dart:260-264](development/opspilot/lib/main.dart).

**Resolução em cascata no boot:**
1. SharedPreferences `app.locale` (override manual do user)
2. `users/{uid}.preferredLocale` (sync entre devices)
3. `companies/{cid}.settings.defaultLocale` (padrão da empresa)
4. Fallback `'pt-BR'`

**Bridge `.arb` ↔ `verticals.json` sem duplicação:**
- **UI chrome** (Salvar, Cancelar, "Email obrigatório") → `.arb`.
- **Labels de domínio** (ticket/order/dispatch) → `verticals.json` via `verticalLabel(activeVertical, key, locale)`. Helper já existe em [active_vertical.dart](development/opspilot/lib/verticals/active_vertical.dart) com param `locale` — só passar do `LocaleProvider`.

**Foundation only — sem traduzir 200 telas no Fase 1.** Roadmap incremental (Fase 2+) prioriza:
1. `login_home_screen.dart` (primeira tela pós-handoff)
2. `company_signup_screen.dart`
3. `app_drawer.dart` (~30 strings de navegação)
4. `vertical_selection_screen.dart`
5. Settings com language switcher

### C. Cloud Functions

**Estrutura:**
```
opspilot/functions/i18n/
  emails/pt-BR.js, en.js     ← STATUS_EMAILS_PT / STATUS_EMAILS_EN
  push/pt-BR.js, en.js
  errors/codes.js + messages.js
  index.js                    ← resolveCompanyLocale(cid), resolveUserLocale(uid)
```

**Resolução:**
- Email **ao cliente final** → `Company.settings.defaultLocale`.
- Push **ao técnico/admin** → `User.preferredLocale ?? Company.settings.defaultLocale`. Unificar `_isWithinNotifHours` + locale lookup em `getUserNotifContext()` (1 read, não 2).

**HttpsError:**
```js
throw new HttpsError("invalid-argument", "Nome da empresa é obrigatório.", {
  i18nKey: "auth/company-name-required"
});
```
Backward compat: `message` em PT fica como fallback. Clients novos olham `error.details.i18nKey` e lookup local. Catalog (~15-20 keys) sincronizado entre Flutter, site e CFs.

### D. Firestore — models + migração

**Adicionar:**
- `CompanySettings.defaultLocale: String?` em [company_model.dart:206-288](development/opspilot/lib/models/company_model.dart) (null-safe read com fallback `'pt-BR'`).
- `UserModel.preferredLocale: String?` em [user_model.dart](development/opspilot/lib/models/user_model.dart).

**Migração:** novo script `scripts/migrate_set_default_locale.js` baseado no template existente [migrate_set_vertical_default.js](development/opspilot/scripts/migrate_set_vertical_default.js). Idempotente, suporta `--dry-run`. Loop em companies, set `pt-BR` se ausente.

**Signup captura locale:**
- `app/api/auth/signup/route.ts` schema Zod aceita `defaultLocale: z.enum(['pt-BR', 'en']).optional()`.
- Form passa `defaultLocale` derivado de `useLocale()` no submit.
- CF `signupCompany` em [functions/index.js:115-130](development/opspilot/functions/index.js) grava em `settings.defaultLocale`.

**Firestore rules:** permitir user atualizar `preferredLocale` no próprio doc.

### E. Sync de nomes site ↔ app

Script `scripts/sync-vertical-names.mjs` no site:
- Lê `../opspilot/assets/verticals.json`
- Gera `lib/marketing/verticals/_names.generated.ts` com `{ rental: { pt, en }, ... }`
- Roda em `prebuild` hook

`criar-conta/page.tsx` importa de `_names.generated.ts` (substitui `VERTICAL_LABELS` hardcoded). Conteúdo marketing rico (hero/features/IA) continua nos `.ts` por vertical — só nome curto sincroniza.

---

## Fase 2 — First slice (1 semana, prova end-to-end)

**Slice:** signup em EN do landscaping até receber primeiro email em EN.

1. User abre `/en/sign-up?vertical=landscaping`.
2. Form submete `defaultLocale: 'en'` pro CF `signupCompany`.
3. CF grava `companies/{cid}.settings.defaultLocale = 'en'`.
4. Site emite custom token, redireciona pra `/app/index.html?token=...&locale=en`.
5. Flutter `HandoffScreen` lê `?locale=en` e chama `LocaleProvider.setLocale()` ANTES de `signInWithCustomToken`.
6. Boot do app resolve cascata → renderiza 5 telas-MVP em EN (login → drawer → onboarding → vertical selection → settings).
7. User cria primeiro chamado → trigger `onServiceOrderStatusChange` lê `Company.defaultLocale = 'en'` → envia email do `STATUS_EMAILS_EN`.

**Sem regressão em PT:** SoluClean continua exatamente como hoje — `defaultLocale` ausente no doc = fallback `'pt-BR'` = comportamento atual.

---

## Arquivos críticos

- [middleware.ts](development/fms-site/middleware.ts) — composição com next-intl
- [app/layout.tsx](development/fms-site/app/layout.tsx) — `<html lang>` reativo
- [next.config.mjs](development/fms-site/next.config.mjs) — typedRoutes interaction
- [main.dart](development/opspilot/lib/main.dart) — locale reativo no MaterialApp
- [company_model.dart](development/opspilot/lib/models/company_model.dart) — campo settings.defaultLocale
- [user_model.dart](development/opspilot/lib/models/user_model.dart) — campo preferredLocale
- [functions/index.js](development/opspilot/functions/index.js) — STATUS_EMAILS split + signupCompany + HttpsError keys
- [active_vertical.dart](development/opspilot/lib/verticals/active_vertical.dart) — já aceita `locale` param, só conectar
- [verticals.json](development/opspilot/assets/verticals.json) — SSoT de labels + completar `contractTypes.en` em facilities/remodeling
- [migrate_set_vertical_default.js](development/opspilot/scripts/migrate_set_vertical_default.js) — template pra migração de `defaultLocale`

---

## Riscos principais

1. **Mismatch `'en'` ↔ `Locale('en', 'US')`** — sem `normalizeLocale()` em ambos os lados, site manda `'en'`, app não reconhece, cai em `pt-BR`. **Mitigação:** função obrigatória na Fase 0.

2. **`typedRoutes` + `next-intl`** — mesmo na 3.22+, há casos onde `Route<>` quebra com pathnames customizados. Auditar [lib/marketing/verticals/types.ts:1](development/fms-site/lib/marketing/verticals/types.ts) e qualquer ref a `Route`. Risco médio.

3. **`STATUS_EMAILS` em produção HOJE** — `onServiceOrderStatusChange` é trigger Firestore que dispara automático. Refactor pra módulo separado precisa smoke test em emulator antes de deploy. Bug = email não vai = cliente reclama.

4. **`Company.defaultLocale` mutável** — admin trocar `pt-BR → en` retroage em emails futuros de tickets antigos. Conceitualmente estranho. **Mitigação opcional (Fase 2+):** snapshot `notificationLocale` no ticket/OS no momento da criação.

5. **Rewrite de `app/(auth)/...` → `app/[locale]/(auth)/...`** — qualquer link interno hardcoded pra `/criar-conta` ou `/login` quebra. Auditar com grep antes de mergear.

6. **`active_vertical.dart` (ValueNotifier global) ↔ `LocaleProvider` (Provider context-based)** — 2 patterns coexistem. NÃO unificar. Helpers como `verticalLabel(active, key, locale: activeLocale.value)` funcionam em ambos.

---

## Verificação end-to-end

Após Fase 1 completar:

1. **Build do site sem regressão**
   ```
   cd /Users/fernandes/development/fms-site && npm run build
   ```
   Esperado: build verde, todas as 6 verticals geradas em `/` e em `/en/`, sem warning de `typedRoutes`.

2. **Build do app sem regressão**
   ```
   cd /Users/fernandes/development/opspilot && flutter analyze && flutter test
   ```
   Esperado: zero erro. `app_localizations.dart` gerado em `lib/l10n/`.

3. **CFs smoke test em emulator**
   ```
   cd /Users/fernandes/development/opspilot/functions && npm run serve
   ```
   Disparar `onServiceOrderStatusChange` manual com company `defaultLocale=en` e `defaultLocale=pt-BR`. Conferir email recebido bate.

4. **Migração dry-run primeiro**
   ```
   node scripts/migrate_set_default_locale.js --dry-run
   ```
   Esperado: lista companies que vão receber `pt-BR`, nenhuma write.

5. **First slice manual (Fase 2)**
   - Abrir `https://fms-site--opspilot-dev.us-central1.hosted.app/en/sign-up?vertical=landscaping`
   - Submeter form com email teste
   - Confirmar: company criada com `settings.defaultLocale = 'en'` no Firestore
   - Confirmar: handoff redireciona pra `/app/index.html?locale=en`
   - Confirmar: 5 telas MVP renderizam em EN
   - Criar primeiro chamado → confirmar email recebido em EN
   - Paralelamente: signup PT em `/criar-conta` continua idêntico (regressão zero)

---

## NÃO faz parte deste plano

1. Tradução das ~800 strings restantes do app — Fase 3+ incremental.
2. Tradução completa dos 5 verticals.en.ts ainda em TODO — copy editorial, low-priority.
3. `landscaping.pt.ts` — vertical é US, baixa prioridade.
4. Tradução automática via LLM como pipeline — pode ser ferramenta auxiliar, não no core.
5. Currency/number formatting localizado — `intl: 0.19.0` (Flutter) e `useFormatter()` (next-intl) já cobrem on-demand. Aplicar quando precisar.
6. Templates de email de Asaas/billing/LGPD — só `STATUS_EMAILS` no Fase 1.
7. Localized SEO content (blog/landing alternativas por país) — fora de escopo.
8. Locale negotiation via `Accept-Language` header — adiar pra Fase 2+. MVP: locale sempre vem da URL ou da `Company.defaultLocale`.
9. i18n do client portal público (`public_portal_screen`, `public_ticket_timeline_screen`) — coberto conceitualmente pela regra "público = Company.defaultLocale", implementar como follow-up.
