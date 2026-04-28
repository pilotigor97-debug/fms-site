"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Lock } from "lucide-react";

const STAGES = [
  { label: "Autenticando",         meta: "AUTH" },
  { label: "Resolvendo workspace", meta: "DNS"  },
  { label: "Carregando ambiente",  meta: "LOAD" },
];

// Wrapper Suspense é obrigatório no Next 14 quando o componente
// usa `useSearchParams()`. Sem ele, o build estático falha com
// "missing-suspense-with-csr-bailout".
export default function RedirectPage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 grid place-items-center bg-ink-50"><div className="text-ink-500">Carregando…</div></div>}>
      <RedirectInner />
    </Suspense>
  );
}

function RedirectInner() {
  const sp = useSearchParams();
  const sub = sp.get("sub") ?? "workspace";
  const company = sp.get("company") ?? "Workspace";
  // `to` é a URL completa de handoff no app Flutter
  // (ex: https://opspilot-dev.web.app/t/soluclean/__handoff__?token=...)
  // Vinda do /api/auth/login. Se faltar, fallback pra subdomínio
  // hipotético (não deve acontecer em prod).
  const to = sp.get("to") ?? `https://${sub}.opspilot.com.br/`;
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = STAGES.map((_, i) =>
      setTimeout(() => setStage(i + 1), 600 + i * 700)
    );
    // window.location ao invés de router.push: estamos saindo do
    // domínio do site institucional pro app Flutter (cross-origin).
    const arrive = setTimeout(
      () => {
        window.location.href = to;
      },
      600 + STAGES.length * 700 + 400
    );
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(arrive);
    };
  }, [to]);

  // Pra mostrar o domínio bonito no card, extrai do `to`.
  const targetHost = (() => {
    try {
      return new URL(to).host;
    } catch {
      return `${sub}.opspilot.com.br`;
    }
  })();

  return (
    <div className="fixed inset-0 grid place-items-center bg-ink-50">
      <div className="bg-white border rounded-xl shadow-lg p-9 w-full max-w-lg">
        <div className="flex items-center gap-3 mb-7">
          <span className="w-8 h-8 rounded bg-navy-900 grid place-items-center text-white font-mono">
            F
          </span>
          <div>
            <div className="mono">CONECTADO COMO</div>
            <div className="font-medium mt-0.5">{company}</div>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 mono px-2 py-1 rounded-full bg-success/10 text-success">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            AUTENTICADO
          </span>
        </div>
        <h2 className="text-2xl font-medium">Levando você ao seu workspace</h2>
        <p className="text-ink-700 mt-2 text-sm">
          Cada empresa no FMS tem ambiente isolado com sua marca.
        </p>
        <div className="mt-5 flex items-center gap-2 px-3 py-2 border rounded-md font-mono text-sm bg-ink-50 overflow-hidden">
          <span className="text-ink-400 shrink-0">https://</span>
          <span className="font-medium truncate">{targetHost}</span>
          <span className="ml-auto inline-flex items-center gap-1 text-xs text-ink-500 shrink-0">
            <Lock size={11} /> SSL
          </span>
        </div>
        <ul className="mt-6 flex flex-col gap-2.5">
          {STAGES.map((s, i) => {
            const state =
              stage > i ? "done" : stage === i ? "active" : "pending";
            return (
              <li key={s.meta} className="flex items-center gap-3 text-sm">
                <span
                  className={`w-5 h-5 rounded-full grid place-items-center
                    ${
                      state === "done"
                        ? "bg-success/15 text-success"
                        : state === "active"
                          ? "bg-blue-100 text-blue-600 animate-pulse"
                          : "bg-ink-100 text-ink-400"
                    }`}
                >
                  {state === "done" ? (
                    <Check size={11} />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  )}
                </span>
                <span className={state === "pending" ? "text-ink-400" : ""}>
                  {s.label}
                </span>
                <span className="ml-auto mono">{s.meta}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
