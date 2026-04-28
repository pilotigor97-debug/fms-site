# FMS — Field Management System (site Next.js)

Site institucional + autenticação do FMS. Marketing pages (Hero, Recursos, Planos, Contato), login e signup.

**Não é o produto** — o produto é o app Flutter em `opspilot-dev.web.app`. O site emite custom token via Firebase Admin SDK e faz handoff pro app.

## Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Firebase Admin SDK (server-side)
- Lucide React (ícones)
- Framer Motion (animations)
- Zod (validação)

## Setup local (testado e funcionando)

### 1. Pegar credenciais Firebase Admin (Console)

`opspilot-dev` no [Firebase Console](https://console.firebase.google.com/project/opspilot-dev):

1. **Project Settings** (engrenagem no canto sup esq) → **Service Accounts** → **Generate new private key**. Salva o JSON.
2. **Project Settings → General → Web API Key**. Copia.

### 2. `.env.local`

```bash
cd /Users/fernandes/development/fms-site
cp .env.example .env.local
```

Preenche:

```env
NEXT_PUBLIC_ROOT_DOMAIN=localhost
NEXT_PUBLIC_APP_URL=https://opspilot-dev.web.app

FIREBASE_PROJECT_ID=opspilot-dev
FIREBASE_WEB_API_KEY=<da console>
FIREBASE_CLIENT_EMAIL=<do JSON: client_email>
FIREBASE_PRIVATE_KEY="<do JSON: private_key — preserva os \n>"

SALES_LEAD_EMAIL=fernandes@suaempresa.com.br
```

> **Atenção `FIREBASE_PRIVATE_KEY`**: vem com `\n` literais no JSON. Mantém entre aspas duplas. O `lib/firebase-admin.ts` faz `replace(/\\n/g, '\n')` ao ler.

### 3. Rodar

```bash
npm install
npm run dev
```

Acessa `http://localhost:3000`.

Rotas:
- `/` → Home (Hero + stubs das outras seções)
- `/login` → form de login
- `/criar-conta` → toggle "Cadastro rápido" (self-service) / "Falar com vendas" (lead)
- `/redirect?to=...` → tela de transição animada (chamada após login)

## Deploy na Vercel (FREE tier)

Vercel grátis dá um subdomínio livre `*.vercel.app`. Sugestões de nome:
- `fms-app.vercel.app`
- `fms-saas.vercel.app`
- `fms-br.vercel.app`
- `fms-online.vercel.app`

Você escolhe na hora do deploy (precisa estar disponível).

### 1. Push pro GitHub

```bash
cd /Users/fernandes/development/fms-site
git init
git add .
git commit -m "Initial commit — FMS site Next.js"
gh repo create fms-site --public --source=. --push
```

(Precisa ter `gh` CLI logado em sua conta GitHub.)

### 2. Importar na Vercel

1. https://vercel.com/new → conecta GitHub → seleciona `fms-site`
2. Project name: digita `fms-app` (ou `fms-saas`, etc)
3. Framework: Next.js (auto-detect)
4. **Environment Variables** → cola tudo do `.env.local`:
   - `NEXT_PUBLIC_ROOT_DOMAIN` = `fms-app.vercel.app` (ou nome que escolheu)
   - `NEXT_PUBLIC_APP_URL` = `https://opspilot-dev.web.app`
   - `FIREBASE_PROJECT_ID` = `opspilot-dev`
   - `FIREBASE_WEB_API_KEY` = (copia do Console)
   - `FIREBASE_CLIENT_EMAIL` = (copia do JSON)
   - `FIREBASE_PRIVATE_KEY` = (copia do JSON, **preserva os `\n` literais**)
   - `SALES_LEAD_EMAIL` = teu email
5. Click **Deploy** → 60-90s pra ficar no ar

### 3. Custom domain (futuro, opcional)

Quando comprar um domínio (ex: `fms.com.br`):
1. Vercel → Project → Settings → Domains → Add → `fms.com.br`
2. Apontar DNS conforme instrução da Vercel (CNAME ou A)
3. Atualiza `NEXT_PUBLIC_ROOT_DOMAIN=fms.com.br` na env

## Fluxo end-to-end (quando deployado)

```
1. Visitor → fms-app.vercel.app/login
2. POST /api/auth/login { email, password }
   ↓
3. /api/auth/login chama Firebase Auth REST (Identity Toolkit) com email+senha
4. Se OK, lê users/{uid}.companyId via Admin SDK → resolve company branding
5. Emite customToken via adminAuth().createCustomToken(uid, { companyId })
   ↓
6. Devolve { customToken, redirectTo: "https://opspilot-dev.web.app/t/{slug}/__handoff__?token=..." }
7. Site mostra /redirect (animação) e dá window.location.href = redirectTo
   ↓
8. Browser cai em opspilot-dev.web.app/t/{slug}/__handoff__?token=...
9. Flutter detecta __handoff__, mostra HandoffScreen
10. signInWithCustomToken(customToken) → sessão Firebase Auth válida
11. AuthGate detecta user → AuthenticatedHome (admin) ou ClientPortalHomeScreen (cliente)
```

## Estrutura

```
fms-site/
├── app/
│   ├── (marketing)/             ← Home, Recursos, Planos, Contato
│   ├── (auth)/                  ← Login + Criar conta
│   ├── api/
│   │   ├── auth/login/route.ts  ← Firebase REST + custom token + handoff URL
│   │   ├── auth/signup/route.ts ← proxy pro callable signupCompany
│   │   └── contact/route.ts     ← lead form → mail/ collection
│   └── redirect/page.tsx        ← tela de transição animada
├── components/
│   ├── marketing/               ← Nav, Footer, Hero, sections-stubs
│   └── auth/auth-aside.tsx
├── lib/
│   ├── firebase-admin.ts        ← Admin SDK lazy init
│   └── tenant.ts                ← resolveTenantByUid (lê Firestore)
├── middleware.ts                ← Rewrite multi-tenant (futuro)
└── package.json
```

## Bugs corrigidos pra build passar

3 bugs no protótipo original (zip FMS-2) que travavam o `npm run build`:

1. **`Geist` font não existe em `next/font/google`** — era pacote `geist` separado da Vercel. Trocado por `Inter` (Google Font padrão, visualmente equivalente).
2. **Firebase Admin SDK inicializava no top-level do módulo** — quebrava `next build` porque env vars não estão disponíveis em build time. Refatorado pra **lazy init** (`adminAuth()` e `adminDb()` são funções, instância só é criada no primeiro request).
3. **`useSearchParams()` em `/redirect`** — Next 14 exige wrapper `<Suspense>` em build estático. Componente foi extraído pra `RedirectInner` envolvido em `<Suspense fallback={...}>`.

## Backlog do site

- [ ] Portar seções stubadas (`sections-stubs.tsx`) pra arquivos próprios — usa o design dos JSX em `FMS/design_handoff_fms/home.jsx`
- [ ] reCAPTCHA Enterprise no `/api/auth/signup` pra App Check no callable backend
- [ ] SSO Google + GitHub (UI já tem botões, falta backend)
- [ ] Rate limit no `/api/auth/login` (per IP, in-memory ou Redis)
- [ ] Sitemap.xml + robots.txt
- [ ] OG meta tags em cada rota
