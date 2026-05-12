/**
 * GET /api/tenant/me
 *
 * Retorna info do tenant (slug, branding) do usuário autenticado.
 * Substitui o que `/api/auth/login` retornava como `tenant` antes da
 * unificação Firebase project (auth agora é client-side via JS SDK,
 * o site não cria mais custom token pro web — só pra apps nativos).
 *
 * Auth: ID token do Firebase no header `Authorization: Bearer <token>`.
 * O cliente pega via `auth.currentUser?.getIdToken()`.
 *
 * Por que não em Server Component:
 *   - Páginas client-side (`/redirect`) precisam buscar via fetch, não
 *     têm acesso ao ID token no SSR (cookie httpOnly não tem o token).
 *   - Endpoint isolado é mais fácil de testar e evolucionar.
 */
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { resolveTenantByUid } from '@/lib/tenant';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization') ?? '';
  const match = authHeader.match(/^Bearer (.+)$/i);
  if (!match) {
    return NextResponse.json({ error: 'missing_token' }, { status: 401 });
  }
  const idToken = match[1];

  let uid: string;
  try {
    const decoded = await adminAuth().verifyIdToken(idToken);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: 'invalid_token' }, { status: 401 });
  }

  const tenant = await resolveTenantByUid(uid);
  if (!tenant) {
    // user_users (cliente do portal) ou doc users/{uid} sem companyId.
    // O site institucional não atende esses casos — Flutter portal sim.
    return NextResponse.json(
      {
        error: 'no_admin_tenant',
        hint: 'Conta não vinculada a uma empresa do FMS.',
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    tenant: {
      slug: tenant.slug,
      company: tenant.company,
      color: tenant.color,
      logoUrl: tenant.logoUrl,
    },
  });
}
