/**
 * Audit A9 — rate-limit por IP no fms-site Next.js.
 *
 * Backend: doc Firestore `rate_limits/{scope}_{safeIp}` com array de
 * timestamps. Mesmo pattern usado em opspilot/functions/public_helpers.js
 * (consistência cross-codebase).
 *
 * Por que Firestore vs in-memory: Cloud Run pode escalar pra múltiplas
 * instâncias. In-memory perderia estado entre instâncias e o rate-limit
 * viraria fácil de bypassar. Firestore tem custo trivial (1 read + 1
 * write por chamada).
 */

import { adminDb } from './firebase-admin';

/**
 * Extrai IP do request Next.js. x-forwarded-for é o padrão por trás do
 * Cloud Run / Vercel. cf-connecting-ip é Cloudflare.
 */
export function getRequestIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  const cf = req.headers.get('cf-connecting-ip');
  if (cf) return cf;
  const real = req.headers.get('x-real-ip');
  if (real) return real;
  return 'unknown';
}

/**
 * Sanitiza IP pra usar como Firestore doc id (substitui chars inválidos
 * tipo `:` em IPv6 e `.` em IPv4).
 */
function safeIp(ip: string): string {
  return ip.replace(/[/.:]/g, '_').substring(0, 80);
}

/**
 * Bloqueia se o IP fez mais que `max` chamadas no scope nos últimos
 * `windowMs`. Lança Error com `code: 'rate_limited'` e `retryAfterSec`.
 *
 * Uso típico em route handler:
 * ```ts
 * try {
 *   await checkIpRateLimit(getRequestIp(req), 'contact_form', 3, 15*60*1000);
 * } catch (e) {
 *   if (e.code === 'rate_limited') {
 *     return NextResponse.json({ error: 'rate_limited', retryAfterSec: e.retryAfterSec }, { status: 429 });
 *   }
 *   throw e;
 * }
 * ```
 */
export async function checkIpRateLimit(
  ip: string,
  scope: string,
  max: number,
  windowMs: number,
): Promise<void> {
  if (!ip || ip === 'unknown') {
    // Sem IP confiável (dev local) — não bloqueia.
    return;
  }
  const docId = `${scope}_${safeIp(ip)}`;
  const ref = adminDb().doc(`rate_limits/${docId}`);
  const now = Date.now();
  const cutoff = now - windowMs;

  await adminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.exists ? snap.data() : {};
    const stamps = ((data?.stamps || []) as number[]).filter((s) => s > cutoff);

    if (stamps.length >= max) {
      const oldest = stamps[0];
      const retryAfterSec = Math.ceil((oldest + windowMs - now) / 1000);
      const err: Error & { code?: string; retryAfterSec?: number } = new Error(
        `Muitas tentativas. Aguarda ${retryAfterSec}s.`,
      );
      err.code = 'rate_limited';
      err.retryAfterSec = retryAfterSec;
      throw err;
    }

    stamps.push(now);
    tx.set(ref, { stamps, scope, ip, lastAt: now });
  });
}
