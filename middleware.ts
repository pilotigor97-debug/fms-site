import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "fms.io";

/**
 * Hostnames "raiz" do site institucional. Tudo aqui renderiza o site
 * marketing normal (Hero, Login, etc). Qualquer outro host vira tenant
 * rewrite pra `_tenant/*`.
 *
 * Pra App Hosting (URL `fms-site--opspilot-dev.us-central1.hosted.app`)
 * a env var `NEXT_PUBLIC_ROOT_DOMAIN` pode ou não estar correta no build
 * — então adicionamos uma checagem fallback por sufixo `.hosted.app`
 * pra qualquer hostname Firebase App Hosting passar como root.
 */
function isMarketingRoot(host: string): boolean {
  if (host === ROOT) return true;
  if (host === `www.${ROOT}`) return true;
  if (host === "localhost" || host === "127.0.0.1") return true;
  // Firebase App Hosting domains (qualquer subdomínio de hosted.app)
  if (host.endsWith(".hosted.app")) return true;
  // Firebase Hosting padrão (futuro custom domain via Firebase)
  if (host.endsWith(".web.app") || host.endsWith(".firebaseapp.com")) return true;
  // Vercel preview/prod
  if (host.endsWith(".vercel.app")) return true;
  return false;
}

export default function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").split(":")[0];
  const url = req.nextUrl.clone();

  if (isMarketingRoot(host)) return NextResponse.next();

  // Subdomain → tenant rewrite (futuro Phase 2B com domínio próprio).
  const sub = host.replace(`.${ROOT}`, "").replace(".localhost", "");
  url.pathname = `/_tenant${url.pathname === "/" ? "" : url.pathname}`;
  const res = NextResponse.rewrite(url);
  res.headers.set("x-tenant-sub", sub);
  return res;
}
