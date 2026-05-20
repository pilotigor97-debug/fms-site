"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, AlertCircle, Mail, X } from "lucide-react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getClientAuth } from "@/lib/firebase-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Esqueci senha — modal inline + sendPasswordResetEmail
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  async function submitReset(e: React.FormEvent) {
    e.preventDefault();
    if (resetLoading) return;
    const targetEmail = resetEmail.trim();
    if (!targetEmail) {
      setResetMessage({ kind: "error", text: "Digite seu e-mail primeiro." });
      return;
    }
    setResetLoading(true);
    setResetMessage(null);
    try {
      const auth = getClientAuth();
      await sendPasswordResetEmail(auth, targetEmail);
      setResetMessage({
        kind: "success",
        text:
          "Se essa conta existe, enviamos um link de redefinição. Confere a caixa de entrada e o spam.",
      });
    } catch (err) {
      const code = (err as { code?: unknown })?.code;
      // Por segurança, NÃO confirma se conta existe — mesma mensagem
      // pra "user-not-found" e sucesso. Só revela erros operacionais.
      if (typeof code === "string") {
        if (code === "auth/invalid-email") {
          setResetMessage({ kind: "error", text: "E-mail inválido." });
        } else if (code === "auth/too-many-requests") {
          setResetMessage({
            kind: "error",
            text: "Muitas tentativas. Aguarde uns minutos.",
          });
        } else {
          // user-not-found, network-failed, etc — mostra mensagem genérica
          setResetMessage({
            kind: "success",
            text:
              "Se essa conta existe, enviamos um link de redefinição. Confere a caixa de entrada e o spam.",
          });
        }
      }
    } finally {
      setResetLoading(false);
    }
  }

  function openReset() {
    setResetEmail(email); // Pre-preenche se já tinha digitado no form
    setResetMessage(null);
    setResetOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      // Login direto via Firebase JS SDK. Auth state fica em IndexedDB
      // do origin atual — Flutter Web em /app/ vai detectar a sessão
      // automaticamente quando bootar.
      const auth = getClientAuth();
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();

      // Resolve tenant pra branding do redirect splash. Se conta não
      // tiver empresa associada (ex: cliente do portal logando aqui
      // por engano), redireciona pra /app/ mesmo — o app Flutter
      // direciona pro flow correto via _RoleDispatcher.
      let tenant: { slug: string; company: string } | null = null;
      try {
        const resp = await fetch("/api/tenant/me", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (resp.ok) {
          const data = await resp.json();
          tenant = data.tenant;
        }
      } catch {
        // Sem tenant info, splash genérico — não trava o fluxo.
      }

      const params = new URLSearchParams({
        ...(tenant ? { sub: tenant.slug, company: tenant.company } : {}),
        to: "/app/index.html",
      });
      router.push(`/redirect?${params.toString()}`);
    } catch (err) {
      const msg = humanizeFirebaseAuthError(err);
      setError(msg);
      setLoading(false);
    }
  }

  function humanizeFirebaseAuthError(err: unknown): string {
    // Duck-typing em vez de `instanceof FirebaseError`: o Next.js bundler
    // pode duplicar módulos `firebase/*` vs `@firebase/*`, fazendo o
    // erro lançado pela SDK NÃO bater com o constructor que importamos.
    // O `code` (string "auth/...") é estável e sempre presente.
    const code = (err as { code?: unknown })?.code;
    if (typeof code === "string") {
      switch (code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
        case "auth/invalid-email":
          return "E-mail ou senha incorretos.";
        case "auth/user-disabled":
          return "Esta conta está desativada. Fale com o administrador.";
        case "auth/too-many-requests":
          return "Muitas tentativas. Aguarde alguns minutos.";
        case "auth/network-request-failed":
          return "Sem conexão. Verifique sua internet.";
      }
      if (code.startsWith("auth/")) {
        return "Erro ao entrar. Tente novamente em instantes.";
      }
    }
    return "Sem conexão com o servidor. Verifique sua internet.";
  }

  return (
    <>
      <h1 className="text-4xl font-medium tracking-tight">Bem-vindo de volta.</h1>
      <p className="text-ink-500 mt-2">Entre no seu workspace FMS.</p>

      {/* SSO desabilitado por enquanto — não está implementado.
          Quando ativar Google/GitHub via Auth.js, traz os botões de volta. */}
      <div className="my-6 flex items-center gap-3 text-xs text-ink-400">
        <span className="flex-1 h-px bg-ink-200" /> entre com e-mail <span className="flex-1 h-px bg-ink-200" />
      </div>

      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="mono">E-mail corporativo</label>
          <input
            className="border rounded-md px-3 py-2.5"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            autoComplete="email"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="mono flex justify-between">
            <span>Senha</span>
            <button
              type="button"
              onClick={openReset}
              className="text-blue-600 normal-case tracking-normal hover:underline"
            >
              Esqueci
            </button>
          </label>
          <input
            className="border rounded-md px-3 py-2.5"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <label
          className="flex items-center gap-2 text-sm cursor-pointer"
          onClick={() => setRemember(!remember)}
        >
          <span
            className={`w-4 h-4 rounded grid place-items-center border ${
              remember ? "bg-navy-900 border-navy-900 text-white" : ""
            }`}
          >
            {remember && <Check size={11} />}
          </span>
          Manter conectado por 30 dias
        </label>

        {error && (
          <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-md text-sm text-red-900">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-navy-900 text-white px-5 py-3 rounded font-medium hover:bg-ink-900 disabled:opacity-60"
        >
          {loading ? (
            "Entrando…"
          ) : (
            <>
              Entrar <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>
      <p className="text-sm text-center mt-6 text-ink-500">
        Não tem conta?{" "}
        <Link href="/criar-conta" className="text-blue-600 font-medium">
          Criar workspace
        </Link>
      </p>

      {/* Modal Esqueci senha — overlay + form simples */}
      {resetOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setResetOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-medium tracking-tight">
                  Esqueci minha senha
                </h2>
                <p className="text-sm text-ink-500 mt-1">
                  Vamos enviar um link de redefinição pro seu email.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setResetOpen(false)}
                className="text-ink-400 hover:text-ink-700"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submitReset} className="flex flex-col gap-3">
              <label className="mono text-xs">E-mail da conta</label>
              <input
                className="border rounded-md px-3 py-2.5"
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                autoFocus
                autoComplete="email"
                placeholder="voce@empresa.com.br"
              />

              {resetMessage && (
                <div
                  className={`text-sm rounded-md p-3 flex items-start gap-2 ${
                    resetMessage.kind === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-600 border border-red-200"
                  }`}
                >
                  {resetMessage.kind === "success" ? (
                    <Mail size={16} className="mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  )}
                  <span>{resetMessage.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={resetLoading}
                className="bg-navy-900 text-white rounded-md py-2.5 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {resetLoading ? (
                  <span className="text-sm">Enviando…</span>
                ) : (
                  <>
                    Enviar link <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-ink-400 mt-3 text-center">
              Por segurança, NÃO informamos se a conta existe.
              {" "}Se você cadastrou com esse email, vai chegar.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
