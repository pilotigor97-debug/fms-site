"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { Building2, LogOut, Shield, Activity } from "lucide-react";
import { getClientAuth } from "@/lib/firebase-client";

/**
 * Admin Layout (gate + nav lateral)
 *
 * 3 estados:
 *   - Loading: ainda checando authState
 *   - Unauthenticated: redireciona pra /login
 *   - Authenticated, NOT platformAdmin: 403
 *   - Authenticated + platformAdmin: renderiza children
 *
 * Auth check fica client-side porque Firebase Auth state vive em
 * IndexedDB (não em cookie). Middleware Next.js não consegue ler.
 *
 * Pra forçar refresh do token (após seed_platform_admin grant), o
 * user precisa fazer LOGOUT + LOGIN. Auto-refresh do Firebase pega
 * mudança de claim em ~1h.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlatformAdmin, setIsPlatformAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string>("");

  useEffect(() => {
    const auth = getClientAuth();
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        setIsPlatformAdmin(false);
        setLoading(false);
        return;
      }
      setUser(u);
      // Lê custom claim. `getIdTokenResult(true)` força refresh do token.
      try {
        const idToken = await u.getIdTokenResult();
        const isAdmin = idToken.claims.platformAdmin === true;
        setIsPlatformAdmin(isAdmin);
        setAdminRole((idToken.claims.platformRole as string) || "");
      } catch {
        setIsPlatformAdmin(false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Redirect to /admin/login (dedicated platform auth) se não autenticado.
  // Não /login do tenant — platform admin tem surface separada.
  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.replace(
        `/admin/login?next=${encodeURIComponent(pathname)}` as never
      );
    }
  }, [loading, user, router, pathname]);

  // Bypass: /admin/login renderiza fora do gate (é a porta de entrada).
  // Sem isso, navegar pra /admin/login com sessão null entra em loop
  // (gate redireciona pra /admin/login que tenta renderizar dentro do gate).
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-ink-50">
        <div className="text-sm text-ink-500">Carregando…</div>
      </div>
    );
  }

  if (!user) {
    return null; // useEffect vai redirecionar
  }

  if (!isPlatformAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-ink-50 p-6">
        <div className="max-w-md text-center">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-medium">Acesso restrito</h1>
          <p className="text-ink-700 mt-3">
            Esta área é só pra equipe FMS. Sua conta{" "}
            <span className="font-mono">{user.email}</span> não tem
            permissão.
          </p>
          <p className="text-ink-500 mt-2 text-sm">
            Se você acabou de receber acesso, faça logout e login de
            novo pra atualizar o token.
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            <Link
              href="/"
              className="px-4 py-2 rounded border hover:bg-ink-100 text-sm"
            >
              Voltar à home
            </Link>
            <button
              onClick={() => signOut(getClientAuth())}
              className="px-4 py-2 rounded bg-navy-900 text-white text-sm hover:bg-ink-900"
            >
              Sair e relogar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-ink-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r flex flex-col">
        <div className="px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-navy-900" />
            <span className="font-medium">FMS Console</span>
          </div>
          <div className="mono text-xs text-ink-500 mt-1">
            PLATFORM ADMIN
          </div>
        </div>
        <nav className="flex-1 p-2 text-sm">
          <NavItem
            href="/admin"
            label="Dashboard"
            icon={<Activity className="w-4 h-4" />}
            active={pathname === "/admin"}
          />
          <NavItem
            href="/admin/tenants"
            label="Tenants"
            icon={<Building2 className="w-4 h-4" />}
            active={pathname.startsWith("/admin/tenants")}
          />
        </nav>
        <div className="p-3 border-t text-xs text-ink-500">
          <div className="font-medium text-ink-900 truncate">
            {user.email}
          </div>
          <div className="mono uppercase mt-0.5">{adminRole}</div>
          <button
            onClick={() => signOut(getClientAuth())}
            className="mt-3 inline-flex items-center gap-1.5 text-ink-700 hover:text-ink-900"
          >
            <LogOut className="w-3 h-3" /> Sair
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

function NavItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href as never}
      className={`flex items-center gap-2 px-3 py-2 rounded font-medium transition-colors ${
        active
          ? "bg-navy-900 text-white"
          : "text-ink-700 hover:bg-ink-100"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
