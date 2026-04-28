"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, AlertCircle, MessageSquare } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase-client";

type Mode = "self" | "sales";

export default function CriarContaPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("self");

  return (
    <>
      <h1 className="text-4xl font-medium tracking-tight">
        Criar conta no FMS.
      </h1>
      <p className="text-ink-500 mt-2">
        {mode === "self"
          ? "Crie sua empresa em 30 segundos. Trial gratuito de 14 dias, sem cartão."
          : "Fale com o time de vendas. Resposta em até 1 dia útil."}
      </p>

      {/* Toggle entre self-service e sales-led */}
      <div className="grid grid-cols-2 gap-2 mt-6 p-1 bg-ink-50 rounded-lg">
        <button
          onClick={() => setMode("self")}
          className={`text-sm px-3 py-2 rounded-md font-medium transition-colors ${
            mode === "self"
              ? "bg-white shadow-sm"
              : "text-ink-500 hover:text-ink-900"
          }`}
        >
          Cadastro rápido
        </button>
        <button
          onClick={() => setMode("sales")}
          className={`text-sm px-3 py-2 rounded-md font-medium transition-colors ${
            mode === "sales"
              ? "bg-white shadow-sm"
              : "text-ink-500 hover:text-ink-900"
          }`}
        >
          Falar com vendas
        </button>
      </div>

      <div className="mt-6">
        {mode === "self" ? <SelfServiceForm router={router} /> : <SalesForm />}
      </div>

      <p className="text-sm text-center mt-6 text-ink-500">
        Já tem conta?{" "}
        <Link href="/login" className="text-blue-600 font-medium">
          Entrar
        </Link>
      </p>
    </>
  );
}

// ─── Self-service: cria company + diretor direto via signupCompany ─

function SelfServiceForm({ router }: { router: ReturnType<typeof useRouter> }) {
  const [companyName, setCompanyName] = useState("");
  const [directorName, setDirectorName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      // (1) Cria company + diretor via callable signupCompany
      const r = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, directorName, email, password }),
      });
      const data = await r.json();
      if (!r.ok) {
        const msg =
          data.error === "Já existe uma conta com este e-mail."
            ? "Já existe uma conta com este e-mail. Use 'Entrar'."
            : data.error === "E-mail inválido."
              ? "E-mail inválido."
              : data.error ?? "Erro ao criar conta.";
        setError(msg);
        setLoading(false);
        return;
      }

      // (2) Login automático via Firebase JS SDK no mesmo origin do site.
      // Auth state vai pra IndexedDB do origin, e o Flutter Web em /app/
      // detecta a sessão automaticamente quando bootar.
      try {
        const auth = getClientAuth();
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await cred.user.getIdToken();

        // Branding do splash — best-effort, não trava o fluxo.
        let tenant: { slug: string; company: string } | null = null;
        try {
          const resp = await fetch("/api/tenant/me", {
            headers: { Authorization: `Bearer ${idToken}` },
          });
          if (resp.ok) {
            const tdata = await resp.json();
            tenant = tdata.tenant;
          }
        } catch {
          // sem branding, splash genérico
        }

        const params = new URLSearchParams({
          ...(tenant
            ? { sub: tenant.slug, company: tenant.company }
            : { company: companyName }),
          to: "/app/index.html",
        });
        router.push(`/redirect?${params.toString()}`);
      } catch {
        // Edge case: signup OK mas auto-login falhou. Manda pro /login.
        router.push("/login?msg=signup_ok");
      }
    } catch {
      setError("Sem conexão com o servidor.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="mono">Nome da empresa *</label>
        <input
          className="border rounded-md px-3 py-2.5"
          type="text"
          required
          minLength={2}
          maxLength={120}
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Ex: Cleanpro Serviços"
          autoFocus
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="mono">Seu nome *</label>
        <input
          className="border rounded-md px-3 py-2.5"
          type="text"
          required
          minLength={2}
          value={directorName}
          onChange={(e) => setDirectorName(e.target.value)}
          autoComplete="name"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="mono">E-mail corporativo *</label>
        <input
          className="border rounded-md px-3 py-2.5"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="mono">Criar senha *</label>
        <input
          className="border rounded-md px-3 py-2.5"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <span className="text-xs text-ink-500">Mínimo 6 caracteres</span>
      </div>

      <ul className="flex flex-col gap-1.5 text-sm text-ink-700 mt-1">
        <li className="flex items-center gap-2">
          <Check size={14} className="text-success" /> Trial gratuito de 14 dias
        </li>
        <li className="flex items-center gap-2">
          <Check size={14} className="text-success" /> Sem cartão de crédito
        </li>
        <li className="flex items-center gap-2">
          <Check size={14} className="text-success" /> Cancele quando quiser
        </li>
      </ul>

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
          "Criando empresa…"
        ) : (
          <>
            Criar minha empresa <ArrowRight size={14} />
          </>
        )}
      </button>
    </form>
  );
}

// ─── Sales-led: captura lead pra atendimento humano ──────────────

function SalesForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, company, teamSize, message }),
      });
      if (!r.ok) {
        setError("Erro ao enviar. Tenta de novo em instantes.");
        setLoading(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Sem conexão com o servidor.");
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="border rounded-lg p-6 bg-success/5">
        <div className="w-10 h-10 rounded-full bg-success/15 grid place-items-center text-success mb-4">
          <Check size={20} />
        </div>
        <h3 className="text-lg font-medium">Recebemos seu contato.</h3>
        <p className="text-ink-500 mt-1 text-sm">
          Nosso time vai te responder pelo e-mail informado em até 1 dia útil.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="mono">Nome *</label>
        <input
          className="border rounded-md px-3 py-2.5"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="mono">E-mail *</label>
          <input
            className="border rounded-md px-3 py-2.5"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="mono">Telefone</label>
          <input
            className="border rounded-md px-3 py-2.5"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="mono">Empresa</label>
        <input
          className="border rounded-md px-3 py-2.5"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="mono">Tamanho da equipe</label>
        <select
          className="border rounded-md px-3 py-2.5 bg-white"
          value={teamSize}
          onChange={(e) => setTeamSize(e.target.value)}
        >
          <option value="">Selecione</option>
          <option value="1-10">1 a 10 pessoas</option>
          <option value="11-50">11 a 50 pessoas</option>
          <option value="51-200">51 a 200 pessoas</option>
          <option value="200+">200+ pessoas</option>
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="mono">Mensagem (opcional)</label>
        <textarea
          className="border rounded-md px-3 py-2.5 resize-none"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Conta brevemente como você opera hoje e o que busca."
        />
      </div>

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
          "Enviando…"
        ) : (
          <>
            <MessageSquare size={14} /> Falar com vendas
          </>
        )}
      </button>
    </form>
  );
}
