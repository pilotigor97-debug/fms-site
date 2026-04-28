import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "fms.io";

export default function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").split(":")[0];
  const url = req.nextUrl.clone();

  // Marketing roots (prod + dev)
  const isRoot =
    host === ROOT || host === `www.${ROOT}` ||
    host === "localhost" || host === "127.0.0.1";

  if (isRoot) return NextResponse.next();

  // Subdomain → tenant rewrite
  const sub = host.replace(`.${ROOT}`, "").replace(".localhost", "");
  url.pathname = `/_tenant${url.pathname === "/" ? "" : url.pathname}`;
  const res = NextResponse.rewrite(url);
  res.headers.set("x-tenant-sub", sub);
  return res;
}
