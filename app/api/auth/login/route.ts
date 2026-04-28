/**
 * POST /api/auth/login
 *
 * Autentica via Firebase Auth REST e devolve um custom token + tenant
 * resolvido. O cliente faz handoff redirecionando o browser pro app
 * Flutter com `?token=...` — o app troca por sessão Firebase real.
 *
 * Por que NÃO usar Auth.js v5 / NextAuth aqui:
 *   - Auth.js mantém sessão em cookie do site institucional (opspilot.com.br)
 *   - Mas o produto vive em outro domínio (app.opspilot.com.br ou web.app)
 *   - Cookies cross-domain dão dor de cabeça com SameSite + CORS
 *   - Custom token do Firebase é o transporte canônico server→client
 *
 * Por que NÃO usar Firebase JS SDK no client do site:
 *   - Bundlear o SDK no site institucional infla bundle (~80KB gz)
 *   - Não precisamos de auth state no site, só do "passe" pro app
 *   - REST + Admin SDK é leve e mais seguro (custom token só sai server)
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuth } from '@/lib/firebase-admin';
import { resolveTenantByUid } from '@/lib/tenant';

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://opspilot-dev.web.app';
const WEB_API_KEY = process.env.FIREBASE_WEB_API_KEY ?? '';

export async function POST(req: NextRequest) {
  if (!WEB_API_KEY) {
    return NextResponse.json(
      { error: 'server_misconfigured' },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  const { email, password } = parsed.data;

  // (1) Autentica via Firebase Auth REST. Preserva todas as proteções
  // do Firebase: rate-limit por IP, MFA se ativado, blocking functions.
  const authResp = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${WEB_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );
  if (!authResp.ok) {
    // Firebase retorna mensagens estruturadas (EMAIL_NOT_FOUND,
    // INVALID_PASSWORD, USER_DISABLED, etc) — generaliza pro client
    // pra evitar enumeration attack.
    return NextResponse.json(
      { error: 'invalid_credentials' },
      { status: 401 }
    );
  }
  const authData = (await authResp.json()) as { localId: string };
  const uid = authData.localId;

  // (2) Resolve tenant. Se o user é admin/diretor (`users/{uid}`),
  // tem companyId. Se é cliente do portal (`client_users/{uid}`),
  // o site institucional não atende — direciona pro portal.
  const tenant = await resolveTenantByUid(uid);
  if (!tenant) {
    // Pode ser um client_user — direciona pro app na home,
    // que faz o roteamento correto via _RoleDispatcher.
    return NextResponse.json(
      {
        error: 'no_admin_tenant',
        // Sem custom token: quem usa o site institucional pra logar
        // como cliente B2B é raro; orientamos a usar o link branded.
        hint: 'O site institucional é pra equipes (admin/técnico). Se você é cliente, peça pro seu prestador o link específico.',
      },
      { status: 403 }
    );
  }

  // (3) Custom token expira em 1h; o Flutter troca por idToken assim
  // que recebe via signInWithCustomToken. Inclui claim `companyId`
  // pra observabilidade — o produto não depende dela (já consulta via
  // users/{uid} dentro do app).
  const customToken = await adminAuth().createCustomToken(uid, {
    companyId: tenant.companyId,
  });

  // URL de handoff: app Flutter detecta /__handoff__ + ?token, faz
  // signInWithCustomToken e roteia. O slug vai junto pra branding
  // imediato (antes mesmo do token resolver no Firestore).
  const redirectTo = `${APP_URL}/t/${tenant.slug}/__handoff__?token=${encodeURIComponent(customToken)}`;

  return NextResponse.json({
    ok: true,
    tenant: {
      slug: tenant.slug,
      company: tenant.company,
      color: tenant.color,
      logoUrl: tenant.logoUrl,
    },
    customToken,
    redirectTo,
  });
}
