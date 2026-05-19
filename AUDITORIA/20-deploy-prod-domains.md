# Sprint 5+ — Deploy Prod `getfms.pro` (Cloudflare + Firebase)

**Domínio:** getfms.pro (Cloudflare Registrar)
**Project Firebase:** opspilot-prod
**Data:** 2026-05-19

## Arquitetura escolhida

```
getfms.pro          → fms-site (Next.js landing comercial) [FASE 2]
app.getfms.pro      → opspilot-prod.web.app (Flutter app) [FASE 1 ⚡ AGORA]
*.getfms.pro        → reservado pra multi-tenant futuro (sprint X)
```

**Fase 1** (hoje): app autenticado no subdomain `app.getfms.pro`. Landing `getfms.pro` fica em redirect ou placeholder até Fase 2.

**Fase 2** (futuro): App Hosting backend prod com fms-site Next.js apontando pra opspilot-prod. Landing pública com SEO + signup CTA → app.getfms.pro.

---

## FASE 1 — app.getfms.pro (~30min + 24h SSL)

### Passo 1.1 — Firebase Console: add custom domain

1. Abrir: <https://console.firebase.google.com/project/opspilot-prod/hosting/sites>
2. Click no site `opspilot-prod` (já existe)
3. Click **"Add custom domain"** (canto sup direito)
4. Digite: `app.getfms.pro` → Continue
5. Firebase pergunta "Do you want to redirect www?" → **Não** (não tem www em subdomain)
6. Firebase mostra 2 records pra você adicionar:
   - **TXT** (verificação): `_acme-challenge.app` com value tipo `firebase=...`
   - **A** record (final): `app` apontando pra IPs Firebase (2 IPs)
7. **NÃO CLICA "Verify" AINDA** — primeiro adiciona DNS no Cloudflare (Passo 1.2)

### Passo 1.2 — Cloudflare: adicionar DNS records

1. Abrir: <https://dash.cloudflare.com> > selecionar zona `getfms.pro`
2. Aba **DNS** > **Records**
3. **Add record TXT** (pra verificação inicial):
   - Type: `TXT`
   - Name: `_acme-challenge.app` (Cloudflare pode auto-encurtar pra `_acme-challenge.app`)
   - Content: (cola exatamente o que Firebase mostrou, começa com `firebase=`)
   - **Proxy status: OFF (cinza, DNS only)** — CRÍTICO
   - TTL: Auto
   - Save
4. **Add record A** (pra apontar pro Firebase Hosting):
   - Type: `A`
   - Name: `app`
   - IPv4 address: (cola **primeiro IP** que Firebase mostrou)
   - **Proxy status: OFF (cinza, DNS only)** — CRÍTICO
   - TTL: Auto
   - Save
5. **Add record A** segundo IP:
   - Type: `A`
   - Name: `app`
   - IPv4 address: (cola **segundo IP** Firebase)
   - **Proxy status: OFF (cinza, DNS only)** — CRÍTICO
   - Save

⚠ **Por que proxy OFF:** se proxy ON (laranja), Cloudflare intercepta SSL e Firebase não consegue emitir Let's Encrypt cert. Resultado: app.getfms.pro nunca fica HTTPS válido. **DNS only (cinza) é mandatório**.

### Passo 1.3 — Voltar Firebase: clicar Verify

1. Volta na aba do Firebase Console (Passo 1.1)
2. Click **"Verify"**
3. Firebase confere TXT (~1-2min)
4. Status muda pra "Connected"
5. **Aguarda ~24h** pra SSL Let's Encrypt emitir (status muda de "Pending SSL" pra "Connected")

Enquanto SSL não emite, `https://app.getfms.pro` dá erro "site not secure". `http://app.getfms.pro` já funciona mas Firebase Auth recusa (exige HTTPS).

### Passo 1.4 — Authorized domains Auth

1. Abrir: <https://console.firebase.google.com/project/opspilot-prod/authentication/settings>
2. Aba **Authorized domains**
3. Click **"Add domain"**
4. Digite: `app.getfms.pro` → Add
5. Confirme que tem: `localhost`, `opspilot-prod.firebaseapp.com`, `opspilot-prod.web.app`, **`app.getfms.pro`**

Sem isso, Firebase Auth rejeita signin no domain custom.

### Passo 1.5 — Verificar

Após ~24h:
- <https://app.getfms.pro> abre o app (mesmo que opspilot-prod.web.app)
- Login Google funciona (não dá erro "domain not authorized")
- Signup flow completo
- HTTPS válido (cadeado verde)

---

## FASE 2 — getfms.pro landing (fms-site)

Pré-requisito: Fase 1 estável.

### Passo 2.1 — Criar App Hosting backend NEW em opspilot-prod

1. Abrir: <https://console.firebase.google.com/project/opspilot-prod/apphosting>
2. Click **"Get started"** ou **"Create backend"**
3. Connect GitHub: autoriza Firebase a ler `pilotigor97-debug/fms-site`
4. Repository: **fms-site**
5. Live branch: **main**
6. Backend ID: `getfms-prod` (ou similar)
7. Root directory: `/` (raiz)
8. Region: **us-central1** (App Hosting não tem southamerica ainda — latência aceitável pra landing estática)
9. Create

### Passo 2.2 — Configurar env vars do backend (override)

Como o `apphosting.yaml` no repo aponta pra opspilot-dev, vamos sobrescrever no Console:

1. App Hosting > Backend `getfms-prod` > **Settings** > **Environment variables**
2. Override (Add variable):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_ROOT_DOMAIN` | `getfms.pro` |
| `NEXT_PUBLIC_APP_URL` | `https://app.getfms.pro` |
| `FIREBASE_PROJECT_ID` | `opspilot-prod` |
| `FIREBASE_WEB_API_KEY` | `AIzaSyCVsn_IFMR2XatRxuQgJvRs0RED2or4tjA` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyCVsn_IFMR2XatRxuQgJvRs0RED2or4tjA` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `opspilot-prod.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `opspilot-prod` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:457560136646:web:75accfd7e474d0b710f0c7` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `opspilot-prod.firebasestorage.app` |
| `SALES_LEAD_EMAIL` | (seu email pra leads) |

### Passo 2.3 — Service Account opspilot-prod (secrets)

Pro Next.js fazer write em Firestore prod (signup CTA, leads form):

1. Console > **Project settings** > **Service accounts** > **Generate new private key**
2. Baixa JSON (NÃO commita)
3. Abre o JSON, extrai `client_email` e `private_key`
4. App Hosting > backend > Settings > Secrets:
   - `FIREBASE_CLIENT_EMAIL` = valor de `client_email`
   - `FIREBASE_PRIVATE_KEY` = valor de `private_key` (com `\n` literais preservados)

### Passo 2.4 — Trigger first deploy

App Hosting já dispara build no primeiro setup. Aguarda 5-10min.

URL temporária: `https://getfms-prod--opspilot-prod.us-central1.hosted.app`

### Passo 2.5 — Custom domain getfms.pro → backend

1. App Hosting > backend `getfms-prod` > **Settings** > **Custom domain** > **Add domain**
2. Digite: `getfms.pro` (raiz)
3. Firebase mostra TXT + A records
4. Cloudflare: add records (proxy OFF):
   - TXT `_acme-challenge` (raiz, deixa `Name` vazio ou `@`)
   - A `@` (raiz) → IP Firebase 1
   - A `@` (raiz) → IP Firebase 2
5. Verify > aguarda SSL ~24h

### Passo 2.6 — www redirect (opcional)

Se quiser que `www.getfms.pro` redirecione pra `getfms.pro`:
- Cloudflare > Rules > Page Rules > URL: `www.getfms.pro/*` > Setting: `Forwarding URL (301)` > `https://getfms.pro/$1`

---

## Pendências auth/integrations (não-bloqueante)

- [ ] Asaas: criar conta prod + chaves API + webhook token → `firebase functions:secrets:set ASAAS_API_KEY -P opspilot-prod`
- [ ] Focus NF-e: validar certificado A1 SoluClean → `firebase functions:secrets:set FOCUS_NFE_API_KEY`
- [ ] Mail Extension: configurar SMTP prod (SendGrid free tier serve)
- [ ] Gemini key: reusa dev key, set como secret prod

Após secrets, deploy functions: `firebase deploy --only functions:default -P opspilot-prod` (~10min Gen2 build)

---

## Verificação smoke E2E em prod

Após Fase 1 fechar:
- [ ] <https://app.getfms.pro> carrega
- [ ] Login Google funciona
- [ ] Sem user doc → tela "Bem-vindo ao FMS" + botão "Criar minha empresa"
- [ ] Form criar empresa → cria company + user diretor + trial 7d
- [ ] Cai no dashboard (ExecutiveHomeScreen v1-Lite)
- [ ] Drawer navega: Financeiro, Postos, Alocações, etc
- [ ] Sem regressão visível (mesmo bug Financeiro do dev — aceito porque defensive layer impede travamento)

Após Fase 2 fechar:
- [ ] <https://getfms.pro> carrega landing fms-site
- [ ] Botões "Login" / "Começar" redirecionam pra <https://app.getfms.pro>
- [ ] Forms de lead (contato, demo) salvam em Firestore opspilot-prod
