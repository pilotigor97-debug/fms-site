"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { AlertCircle, Shield, Eye, EyeOff } from "lucide-react";
import { getClientAuth } from "@/lib/firebase-client";

/**
 * Login dedicado pro Platform Console — separado do /login de tenants.
 *
 * Por que separado:
 *   1. Segurança: superficie de auth distinta. Bots probando /login
 *      pra brute force não atingem aqui (URL não-listada em sitemap).
 *   2. UX: platform admin não vai parar na Flutter app (que mostra
 *      "Sua conta não está vinculada a uma empresa" — porque admin
 *      NÃO É tenant user).
 *   3. Branding: tela com vibe operacional (cinza/navy), não comercial.
 *   4. Flow: ao logar, verifica claim platformAdmin ANTES de
 *      redirecionar. Se conta tenant tentar entrar aqui, signOut +
 *      mensagem clara.
 */
export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div />}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Se já tem sessão válida com claim platformAdmin, redireciona
  // direto sem pedir login de novo. Útil pra abrir tab nova.
  useEffect(() => {
    const auth = getClientAuth();
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setCheckingSession(false);
        return;
      }
      try {
        const t = await u.getIdTokenResult();
        if (t.claims.platformAdmin === true) {
          router.replace(next as never);
          return;
        }
      } catch {
        // Continua na tela de login.
      }
      setCheckingSession(false);
    });
    return () => unsub();
  }, [router, next]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const auth = getClientAuth();
      // Garante sessão limpa — se user tava logado como tenant antes,
      // logout primeiro evita IndexedDB conflict.
      try {
        await signOut(auth);
      } catch {
        /* ignore */
      }
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // Força refresh do token pra pegar custom claim mais recente
      // (caso seed_platform_admin tenha rodado nessa sessão).
      const tokenResult = await cred.user.getIdTokenResult(true);
      if (tokenResult.claims.platformAdmin !== true) {
        await signOut(auth);
        setError(
          "Esta conta não é admin da plataforma. Use a tela de login normal em /login pra acessar como tenant."
        );
        setLoading(false);
        return;
      }
      router.replace(next as never);
    } catch (e: unknown) {
      const code =
        e instanceof Error && "code" in e
          ? String((e as { code: string }).code)
          : "";
      let msg = "Erro inesperado. Tenta de novo.";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        msg = "Email ou senha incorretos.";
      } else if (code === "auth/too-many-requests") {
        msg = "Muitas tentativas. Aguarde alguns minutos.";
      } else if (code === "auth/network-request-failed") {
        msg = "Sem conexão. Verifique sua internet.";
      } else if (e instanceof Error && e.message) {
        msg = e.message;
      }
      setError(msg);
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen grid place-items-center bg-ink-50">
        <div className="text-sm text-ink-500">Verificando sessão…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center bg-ink-50 p-6">
      <div className="bg-white rounded-lg border w-full max-w-md p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-navy-900" />
          <span className="mono text-xs text-ink-500">PLATFORM CONSOLE</span>
        </div>
        <h1 className="mt-3 text-3xl font-medium tracking-tight">
          Entrar como admin
        </h1>
        <p className="text-ink-700 mt-2 text-sm">
          Acesso restrito à equipe FMS. Tenant users normais entram em{" "}
          <a
            href="/login"
            className="text-navy-900 underline hover:text-blue-700"
          >
            /login
          </a>
          .
        </p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="mono text-xs text-ink-700">EMAIL</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2.5 border rounded text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="mono text-xs text-ink-700">SENHA</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 border rounded text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-ink-500 hover:text-ink-900"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded text-sm text-red-900">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-navy-900 text-white px-4 py-2.5 rounded font-medium hover:bg-ink-900 disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-xs text-ink-500 leading-relaxed">
          Esta é uma área operacional interna da FMS. Toda ação é registrada
          em audit log imutável. Se você acessou aqui por engano, feche a
          aba.
        </p>
      </div>
    </div>
  );
}
