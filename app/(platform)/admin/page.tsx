import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-3xl font-medium">Platform Console</h1>
      <p className="text-ink-700 mt-2">
        Control tower interno do FMS. Gerencia tenants, billing, IA, segurança.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <Link
          href="/admin/tenants"
          className="border rounded-lg p-6 bg-white hover:border-navy-900 transition-colors"
        >
          <Building2 className="w-6 h-6 text-navy-900" />
          <h2 className="font-medium mt-3">Tenant Management</h2>
          <p className="text-sm text-ink-700 mt-1">
            Lista de empresas. Estender trial, dar créditos AI, suspender,
            reativar. Audit log do tenant aparece dentro da página de detalhe.
          </p>
          <div className="mt-4 text-sm text-navy-900 inline-flex items-center gap-1">
            Abrir <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      <div className="mt-10 p-5 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-ink-700">
        <div className="font-medium text-ink-900 mb-1">Fase 1 — MVP</div>
        Módulos seguintes (Billing dashboard, AI usage monitoring,
        Impersonation, Feature flags, Platform health, Analytics, White-label
        bulk) ficam pra próximas fases. Ver{" "}
        <code className="font-mono">AUDITORIA/07-arquitetura-platform-console.md</code>{" "}
        pro roadmap completo.
      </div>
    </div>
  );
}
