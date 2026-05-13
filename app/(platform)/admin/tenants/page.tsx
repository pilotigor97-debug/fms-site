"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { ArrowRight, Search, RefreshCw } from "lucide-react";
import {
  platformListTenants,
  type TenantListItem,
} from "@/lib/platform/admin-client";

const STATUS_OPTIONS = [
  { value: "", label: "Todos status" },
  { value: "trialing", label: "Trial" },
  { value: "active", label: "Active" },
  { value: "past_due", label: "Past due" },
  { value: "canceled", label: "Canceled" },
];

const VERTICAL_OPTIONS = [
  { value: "", label: "Todos verticals" },
  { value: "rental", label: "Rental" },
  { value: "cleaning", label: "Cleaning" },
  { value: "hvac", label: "HVAC" },
  { value: "remodeling", label: "Remodeling" },
  { value: "facilities", label: "Facilities" },
  { value: "landscaping", label: "Landscaping" },
];

export default function TenantsListPage() {
  const [tenants, setTenants] = useState<TenantListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [vertical, setVertical] = useState("");
  const [search, setSearch] = useState("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const load = useCallback(
    async (append = false) => {
      setLoading(true);
      setError(null);
      try {
        const result = await platformListTenants({
          status: status || null,
          vertical: vertical || null,
          search,
          cursor: append ? nextCursor : null,
        });
        setTenants((prev) =>
          append ? [...prev, ...result.tenants] : result.tenants
        );
        setNextCursor(result.nextCursor);
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Erro inesperado ao listar tenants."
        );
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [status, vertical, search]
  );

  useEffect(() => {
    load(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, vertical]);

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium">Tenants</h1>
          <p className="text-ink-700 mt-1 text-sm">
            {tenants.length} {tenants.length === 1 ? "tenant" : "tenants"}{" "}
            listados
          </p>
        </div>
        <button
          onClick={() => load(false)}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded border text-sm hover:bg-ink-100 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
          <input
            type="text"
            placeholder="Buscar por nome ou CNPJ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load(false)}
            className="w-full pl-9 pr-3 py-2 border rounded text-sm bg-white"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 border rounded text-sm bg-white"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={vertical}
          onChange={(e) => setVertical(e.target.value)}
          className="px-3 py-2 border rounded text-sm bg-white"
        >
          {VERTICAL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Erros */}
      {error && (
        <div className="mt-4 p-4 rounded border border-red-200 bg-red-50 text-sm text-red-900">
          {error}
        </div>
      )}

      {/* Tabela */}
      <div className="mt-6 bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 border-b">
            <tr className="text-left text-ink-700 mono text-xs">
              <th className="px-4 py-3">EMPRESA</th>
              <th className="px-4 py-3">VERTICAL</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3">TRIAL ENDS</th>
              <th className="px-4 py-3">AI BALANCE</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && tenants.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-500">
                  Carregando…
                </td>
              </tr>
            ) : tenants.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-500">
                  Nenhum tenant encontrado.
                </td>
              </tr>
            ) : (
              tenants.map((t) => <TenantRow key={t.id} tenant={t} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {nextCursor && (
        <div className="mt-4 text-center">
          <button
            onClick={() => load(true)}
            disabled={loading}
            className="px-4 py-2 rounded border text-sm hover:bg-ink-100 disabled:opacity-50"
          >
            Carregar mais
          </button>
        </div>
      )}
    </div>
  );
}

function TenantRow({ tenant }: { tenant: TenantListItem }) {
  const trial = tenant.billing.trialEndsAt
    ? new Date(tenant.billing.trialEndsAt)
    : null;
  const now = new Date();
  const trialExpired = trial && trial < now;
  const daysLeft = trial
    ? Math.ceil((trial.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <tr className="border-b hover:bg-ink-50 last:border-b-0">
      <td className="px-4 py-3">
        <Link
          href={`/admin/tenants/${tenant.id}` as never}
          className="font-medium hover:text-navy-900"
        >
          {tenant.displayName || tenant.name}
        </Link>
        {tenant.cnpj && (
          <div className="mono text-xs text-ink-500 mt-0.5">
            {formatCnpj(tenant.cnpj)}
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        <span className="mono text-xs uppercase text-ink-700">
          {tenant.vertical}
        </span>
      </td>
      <td className="px-4 py-3">
        <StatusBadge
          status={tenant.billing.status}
          suspended={tenant.suspended}
        />
      </td>
      <td className="px-4 py-3 text-sm">
        {trial ? (
          <span
            className={
              trialExpired
                ? "text-red-700"
                : daysLeft && daysLeft <= 3
                ? "text-yellow-700"
                : "text-ink-700"
            }
          >
            {trialExpired
              ? "Expirou"
              : daysLeft && daysLeft <= 30
              ? `${daysLeft}d`
              : trial.toLocaleDateString("pt-BR")}
          </span>
        ) : (
          <span className="text-ink-400">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-sm">
        <span className={tenant.aiCredits.canPurchase ? "" : "text-red-700"}>
          {tenant.aiCredits.balance}
        </span>
        {!tenant.aiCredits.canPurchase && (
          <span className="ml-1 mono text-xs text-red-700">BLOCKED</span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <Link
          href={`/admin/tenants/${tenant.id}` as never}
          className="inline-flex items-center gap-1 text-sm text-navy-900 hover:underline"
        >
          Abrir <ArrowRight className="w-3 h-3" />
        </Link>
      </td>
    </tr>
  );
}

function StatusBadge({
  status,
  suspended,
}: {
  status: string;
  suspended: boolean;
}) {
  if (suspended) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full mono text-xs bg-red-100 text-red-800">
        SUSPENDED
      </span>
    );
  }
  const map: Record<string, { label: string; bg: string; text: string }> = {
    trialing: { label: "TRIAL", bg: "bg-blue-100", text: "text-blue-800" },
    active: { label: "ACTIVE", bg: "bg-green-100", text: "text-green-800" },
    past_due: {
      label: "PAST DUE",
      bg: "bg-yellow-100",
      text: "text-yellow-800",
    },
    canceled: { label: "CANCELED", bg: "bg-ink-200", text: "text-ink-700" },
  };
  const config = map[status] || {
    label: status.toUpperCase(),
    bg: "bg-ink-100",
    text: "text-ink-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full mono text-xs ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}

function formatCnpj(digits: string): string {
  const c = digits.replace(/\D/g, "");
  if (c.length !== 14) return digits;
  return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5, 8)}/${c.slice(8, 12)}-${c.slice(12)}`;
}
