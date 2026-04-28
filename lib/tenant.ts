/**
 * Resolução de tenant — substitui o `tenant-mock.ts` do FMS-2 protótipo.
 *
 * Espelha exatamente o que o Flutter faz no `_RoleDispatcher`:
 *   1. Lê users/{uid}.companyId
 *   2. Lê companies/{cid} → branding (logo, cor, displayName, subdomain)
 *
 * Multi-tenant safe: NUNCA cruza tenants. O uid resolve UMA company.
 */
import { adminDb } from './firebase-admin';

export type TenantInfo = {
  companyId: string;
  /** Slug pra URL `/t/{slug}` no app Flutter (Phase 2A já implementada). */
  slug: string;
  company: string;
  color: string;
  logoUrl: string | null;
};

export async function resolveTenantByUid(
  uid: string
): Promise<TenantInfo | null> {
  const db = adminDb();
  // 1. user → companyId
  const userSnap = await db.collection('users').doc(uid).get();
  if (!userSnap.exists) return null;
  const companyId = userSnap.data()?.companyId as string | undefined;
  if (!companyId) return null;

  // 2. company → branding
  const compSnap = await db.collection('companies').doc(companyId).get();
  if (!compSnap.exists) return null;
  const data = compSnap.data() ?? {};
  const branding = (data.branding ?? {}) as Record<string, unknown>;

  // Slug pra URL: prioriza branding.subdomain (admin reservou em
  // /t/{slug}). Se não tem, fallback no companyId — funciona mas é feio.
  const slug =
    (branding.subdomain as string | undefined) ?? slugify(companyId);

  return {
    companyId,
    slug,
    company:
      (branding.displayName as string | undefined) ??
      (data.name as string | undefined) ??
      'OpsPilot',
    color: (branding.primaryColorHex as string | undefined) ?? '#0175C2',
    logoUrl: (branding.logoUrl as string | null | undefined) ?? null,
  };
}

function slugify(s: string) {
  return (s ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 24);
}
