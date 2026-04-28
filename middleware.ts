import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "fms.io";

/**
 * Hostnames "raiz" do site institucional. Tudo aqui renderiza o site
 * marketing normal (Hero, Login, etc). Qualquer outro host vira tenant
 * rewrite pra `_tenant/*` (futuro, quando comprar domínio).
 */
function isMarketingRoot(host: string): boolean {
  if (host === ROOT) return true;
  if (host === `www.${ROOT}`) return true;
  if (host === "localhost" || host === "127.0.0.1") return true;
  // Firebase App Hosting domains (externo: hosted.app; interno: run.app).
  if (host.endsWith(".hosted.app")) return true;
  if (host.endsWith(".run.app")) return true;
  // Firebase Hosting padrão (futuro custom domain via Firebase)
  if (host.endsWith(".web.app") || host.endsWith(".firebaseapp.com")) return true;
  // Vercel preview/prod
  if (host.endsWith(".vercel.app")) return true;
  return false;
}

export default function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").split(":")[0];
  const url = req.nextUrl.clone();

  // (1) Path-based tenant URLs: `/t/{slug}/...` redireciona pro
  // app Flutter em /app/ que sabe rotear para o tenant correto.
  // Ex: /t/cleanpro/__handoff__?token=... → /app/t/cleanpro/__handoff__?token=...
  // Mantém compat com o handoff URL emitido por /api/auth/login (legacy).
  if (url.pathname.startsWith("/t/")) {
    const target = `/app${url.pathname}${url.search}`;
    return NextResponse.redirect(new URL(target, req.url), 308);
  }

  // (2) Site institucional ou App Hosting → renderiza marketing normal.
  if (isMarketingRoot(host)) return NextResponse.next();

  // (3) Subdomain → tenant rewrite (futuro Phase 2B com domínio próprio).
  // Ex: `cleanpro.opspilot.com.br/algo` → `/_tenant/algo` (placeholder
  // pra páginas branded server-side; ainda sem implementação).
  const sub = host.replace(`.${ROOT}`, "").replace(".localhost", "");
  url.pathname = `/_tenant${url.pathname === "/" ? "" : url.pathname}`;
  const res = NextResponse.rewrite(url);
  res.headers.set("x-tenant-sub", sub);
  return res;
}
