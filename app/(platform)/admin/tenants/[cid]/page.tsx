"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Coins,
  Ban,
  PlayCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  platformGetTenantDetail,
  platformExtendTrial,
  platformGrantAiCredits,
  platformSuspendTenant,
  platformReactivateTenant,
  platformListAuditLogs,
  type TenantDetail,
  type AuditLog,
} from "@/lib/platform/admin-client";

export default function TenantDetailPage() {
  const params = useParams();
  const cid = String(params.cid);
  const [tenant, setTenant] = useState<TenantDetail | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [logsError, setLogsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<
    "extend" | "credits" | "suspend" | "reactivate" | null
  >(null);

  // 2 loads separados — audit pode falhar (ex: index ainda buildando)
  // sem derrubar a página de detail inteira. Detail é o que importa
  // pra agir no tenant; audit é histórico complementar.
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setLogsError(null);
    const tenantPromise = platformGetTenantDetail({ companyId: cid })
      .then((t) => setTenant(t))
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Erro ao carregar tenant.")
      );
    const logsPromise = platformListAuditLogs({ companyId: cid })
      .then((l) => setLogs(l.logs))
      .catch((e) =>
        setLogsError(
          e instanceof Error ? e.message : "Erro ao carregar audit log."
        )
      );
    await Promise.all([tenantPromise, logsPromise]);
    setLoading(false);
  }, [cid]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !tenant) {
    return (
      <div className="p-8">
        <Link
          href="/admin/tenants"
          className="inline-flex items-center gap-1 text-sm text-ink-700 hover:text-ink-900"
        >
          <ArrowLeft className="w-4 h-4" /> Tenants
        </Link>
        <div className="mt-8 text-ink-500">Carregando…</div>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="p-8">
        <Link
          href="/admin/tenants"
          className="inline-flex items-center gap-1 text-sm text-ink-700 hover:text-ink-900"
        >
          <ArrowLeft className="w-4 h-4" /> Tenants
        </Link>
        <div className="mt-8 p-4 rounded border border-red-200 bg-red-50 text-red-900">
          {error || "Tenant não encontrado."}
        </div>
      </div>
    );
  }

  const trial = tenant.billing.trialEndsAt
    ? new Date(tenant.billing.trialEndsAt)
    : null;
  const now = new Date();
  const trialExpired = trial && trial < now;

  return (
    <div className="p-8 max-w-5xl">
      <Link
        href="/admin/tenants"
        className="inline-flex items-center gap-1 text-sm text-ink-700 hover:text-ink-900"
      >
        <ArrowLeft className="w-4 h-4" /> Tenants
      </Link>

      {/* Header */}
      <div className="mt-4 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-medium">
              {tenant.branding && (tenant.branding as Record<string, unknown>).displayName
                ? String((tenant.branding as Record<string, unknown>).displayName)
                : tenant.name}
            </h1>
            <StatusPill
              status={tenant.billing.status}
              suspended={tenant.suspended}
            />
          </div>
          <div className="mt-1 text-sm text-ink-700 mono">{cid}</div>
          {tenant.cnpj && (
            <div className="mt-0.5 text-sm text-ink-500">
              CNPJ {formatCnpj(tenant.cnpj)}
            </div>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <ActionButton
            icon={<Calendar className="w-4 h-4" />}
            label="Estender trial"
            onClick={() => setOpenModal("extend")}
          />
          <ActionButton
            icon={<Coins className="w-4 h-4" />}
            label="Dar créditos AI"
            onClick={() => setOpenModal("credits")}
          />
          {tenant.suspended ? (
            <ActionButton
              icon={<PlayCircle className="w-4 h-4" />}
              label="Reativar"
              onClick={() => setOpenModal("reactivate")}
              variant="success"
            />
          ) : (
            <ActionButton
              icon={<Ban className="w-4 h-4" />}
              label="Suspender"
              onClick={() => setOpenModal("suspend")}
              variant="danger"
            />
          )}
        </div>
      </div>

      {/* Cards de info */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <InfoCard label="USUÁRIOS" value={tenant.counts.users} />
        <InfoCard label="OSes" value={tenant.counts.serviceOrders} />
        <InfoCard label="TICKETS" value={tenant.counts.tickets} />
      </div>

      {/* Billing + AI */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <DetailCard title="Billing">
          <DetailRow label="Status" value={tenant.billing.status} />
          <DetailRow
            label="Plano"
            value={tenant.billing.planId || "—"}
          />
          {trial && (
            <DetailRow
              label="Trial ends"
              value={
                trialExpired ? (
                  <span className="text-red-700">
                    Expirou em {trial.toLocaleDateString("pt-BR")}
                  </span>
                ) : (
                  <span>
                    {trial.toLocaleDateString("pt-BR")} (
                    {Math.ceil(
                      (trial.getTime() - now.getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}
                    d)
                  </span>
                )
              }
            />
          )}
          {tenant.billing.currentPeriodEnd && (
            <DetailRow
              label="Próx vencimento"
              value={new Date(
                tenant.billing.currentPeriodEnd
              ).toLocaleDateString("pt-BR")}
            />
          )}
          {tenant.billing.asaasSubscriptionId && (
            <DetailRow
              label="Asaas subscription"
              value={
                <span className="mono text-xs">
                  {tenant.billing.asaasSubscriptionId}
                </span>
              }
            />
          )}
        </DetailCard>

        <DetailCard title="AI Credits">
          <DetailRow label="Balance" value={tenant.aiCredits.balance} />
          <DetailRow
            label="Total consumed"
            value={tenant.aiCredits.totalConsumed || 0}
          />
          <DetailRow
            label="Can purchase"
            value={
              tenant.aiCredits.canPurchase ? (
                <span className="text-green-700">SIM</span>
              ) : (
                <span className="text-red-700">BLOQUEADO</span>
              )
            }
          />
          {tenant.aiCredits.dailyCapBrl && (
            <DetailRow
              label="Daily cap R$"
              value={tenant.aiCredits.dailyCapBrl}
            />
          )}
        </DetailCard>
      </div>

      {tenant.suspended && tenant.suspendedReason && (
        <div className="mt-6 p-4 rounded border border-red-200 bg-red-50">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-700 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-red-900">
                Tenant suspenso
              </div>
              <div className="text-ink-700 mt-1">
                {tenant.suspendedReason}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit log */}
      <div className="mt-8">
        <h2 className="text-xl font-medium mb-3">Audit log (últimos 50)</h2>
        <div className="bg-white border rounded-lg overflow-hidden">
          {logsError ? (
            <div className="p-6 text-center text-sm text-yellow-900 bg-yellow-50">
              Audit log indisponível: {logsError}.{" "}
              <button
                onClick={load}
                className="underline hover:text-yellow-950"
              >
                Tentar de novo
              </button>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-6 text-center text-ink-500 text-sm">
              Sem ações registradas pra este tenant.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-ink-50 border-b">
                <tr className="text-left mono text-xs text-ink-700">
                  <th className="px-4 py-3">QUANDO</th>
                  <th className="px-4 py-3">ADMIN</th>
                  <th className="px-4 py-3">AÇÃO</th>
                  <th className="px-4 py-3">PAYLOAD</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b last:border-b-0">
                    <td className="px-4 py-2 text-xs text-ink-500 mono">
                      {log.createdAt
                        ? new Date(log.createdAt).toLocaleString("pt-BR")
                        : "—"}
                    </td>
                    <td className="px-4 py-2 text-xs">{log.adminEmail}</td>
                    <td className="px-4 py-2">
                      <span className="mono text-xs">{log.action}</span>
                    </td>
                    <td className="px-4 py-2 text-xs text-ink-700 max-w-md truncate">
                      {JSON.stringify(log.payload)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modais */}
      {openModal === "extend" && (
        <ExtendTrialModal
          companyId={cid}
          onClose={() => setOpenModal(null)}
          onSuccess={() => {
            setOpenModal(null);
            load();
          }}
        />
      )}
      {openModal === "credits" && (
        <GrantCreditsModal
          companyId={cid}
          onClose={() => setOpenModal(null)}
          onSuccess={() => {
            setOpenModal(null);
            load();
          }}
        />
      )}
      {openModal === "suspend" && (
        <SuspendModal
          companyId={cid}
          onClose={() => setOpenModal(null)}
          onSuccess={() => {
            setOpenModal(null);
            load();
          }}
        />
      )}
      {openModal === "reactivate" && (
        <ReactivateModal
          companyId={cid}
          onClose={() => setOpenModal(null)}
          onSuccess={() => {
            setOpenModal(null);
            load();
          }}
        />
      )}
    </div>
  );
}

// ─── Modais ────────────────────────────────────────────────────────

function ExtendTrialModal({
  companyId,
  onClose,
  onSuccess,
}: {
  companyId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [days, setDays] = useState(30);
  const [reason, setReason] = useState("");
  return (
    <ActionModal
      title="Estender trial"
      onClose={onClose}
      onSubmit={async () => {
        await platformExtendTrial({ companyId, days, reason });
        onSuccess();
      }}
      submitLabel="Estender"
      canSubmit={days >= 1 && days <= 180 && reason.trim().length >= 10}
    >
      <div>
        <label className="mono text-xs text-ink-700">DIAS A ADICIONAR</label>
        <input
          type="number"
          min={1}
          max={180}
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value) || 0)}
          className="mt-1 w-full px-3 py-2 border rounded text-sm"
        />
        <p className="text-xs text-ink-500 mt-1">
          Se trial já expirou, conta a partir de agora. Senão, soma aos
          dias restantes. Max 180.
        </p>
      </div>
      <ReasonField value={reason} onChange={setReason} />
    </ActionModal>
  );
}

function GrantCreditsModal({
  companyId,
  onClose,
  onSuccess,
}: {
  companyId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState(100);
  const [reason, setReason] = useState("");
  const [enableAi, setEnableAi] = useState(true);
  return (
    <ActionModal
      title="Dar créditos AI"
      onClose={onClose}
      onSubmit={async () => {
        await platformGrantAiCredits({
          companyId,
          amount,
          reason,
          enableAi,
        });
        onSuccess();
      }}
      submitLabel="Dar créditos"
      canSubmit={amount >= 1 && amount <= 10000 && reason.trim().length >= 10}
    >
      <div>
        <label className="mono text-xs text-ink-700">QUANTIDADE</label>
        <input
          type="number"
          min={1}
          max={10000}
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
          className="mt-1 w-full px-3 py-2 border rounded text-sm"
        />
      </div>
      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={enableAi}
          onChange={(e) => setEnableAi(e.target.checked)}
          className="mt-0.5"
        />
        <span className="text-ink-700">
          Habilitar IA também (se estava bloqueada por past_due/cancel)
        </span>
      </label>
      <ReasonField value={reason} onChange={setReason} />
    </ActionModal>
  );
}

function SuspendModal({
  companyId,
  onClose,
  onSuccess,
}: {
  companyId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [reason, setReason] = useState("");
  return (
    <ActionModal
      title="Suspender tenant"
      danger
      onClose={onClose}
      onSubmit={async () => {
        await platformSuspendTenant({ companyId, reason });
        onSuccess();
      }}
      submitLabel="Suspender"
      canSubmit={reason.trim().length >= 10}
    >
      <div className="p-3 rounded border border-red-200 bg-red-50 text-sm text-ink-700">
        <div className="font-medium text-red-900">Ação destrutiva</div>
        Suspender bloqueia signups, IA e callable updates. Use pra
        inadimplência crítica ou abuso. Reversível via &quot;Reativar&quot;.
      </div>
      <ReasonField value={reason} onChange={setReason} />
    </ActionModal>
  );
}

function ReactivateModal({
  companyId,
  onClose,
  onSuccess,
}: {
  companyId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [reason, setReason] = useState("");
  return (
    <ActionModal
      title="Reativar tenant"
      onClose={onClose}
      onSubmit={async () => {
        await platformReactivateTenant({ companyId, reason });
        onSuccess();
      }}
      submitLabel="Reativar"
      canSubmit={reason.trim().length >= 10}
    >
      <ReasonField value={reason} onChange={setReason} />
    </ActionModal>
  );
}

// ─── Reusables ─────────────────────────────────────────────────────

function ActionModal({
  title,
  children,
  onClose,
  onSubmit,
  submitLabel,
  canSubmit,
  danger,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  submitLabel: string;
  canSubmit: boolean;
  danger?: boolean;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <h2 className="text-xl font-medium">{title}</h2>
        <div className="mt-4 space-y-4">{children}</div>
        {error && (
          <div className="mt-4 p-3 rounded border border-red-200 bg-red-50 text-sm text-red-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5" /> {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 rounded border border-green-200 bg-green-50 text-sm text-green-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5" /> Sucesso. Fechando…
          </div>
        )}
        <div className="mt-6 flex gap-2 justify-end">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded border text-sm hover:bg-ink-100"
          >
            Cancelar
          </button>
          <button
            disabled={!canSubmit || submitting || success}
            onClick={async () => {
              setSubmitting(true);
              setError(null);
              try {
                await onSubmit();
                setSuccess(true);
              } catch (e) {
                setError(
                  e instanceof Error
                    ? e.message
                    : "Erro ao executar ação."
                );
                setSubmitting(false);
              }
            }}
            className={`px-4 py-2 rounded text-sm font-medium text-white disabled:opacity-50 ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-navy-900 hover:bg-ink-900"
            }`}
          >
            {submitting ? "Aplicando…" : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReasonField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const len = value.trim().length;
  return (
    <div>
      <label className="mono text-xs text-ink-700">
        MOTIVO (min 10 chars — vai pro audit log)
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder="Ex: SoluClean é cliente strategic, pediu +30 dias"
        className="mt-1 w-full px-3 py-2 border rounded text-sm"
      />
      <div className="mt-1 text-xs text-ink-500">
        {len < 10 ? `${10 - len} caracteres a mais` : `${len} caracteres`}
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "danger" | "success";
}) {
  const colors =
    variant === "danger"
      ? "border-red-200 text-red-700 hover:bg-red-50"
      : variant === "success"
      ? "border-green-200 text-green-700 hover:bg-green-50"
      : "border-ink-200 text-ink-700 hover:bg-ink-100";
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded border text-sm font-medium ${colors}`}
    >
      {icon} {label}
    </button>
  );
}

function StatusPill({
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
  const c = map[status] || {
    label: status.toUpperCase(),
    bg: "bg-ink-100",
    text: "text-ink-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full mono text-xs ${c.bg} ${c.text}`}
    >
      {c.label}
    </span>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="mono text-xs text-ink-500">{label}</div>
      <div className="text-2xl font-medium mt-1">{value}</div>
    </div>
  );
}

function DetailCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border rounded-lg p-5">
      <h3 className="font-medium">{title}</h3>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-ink-500">{label}</span>
      <span className="text-ink-900 text-right">{value}</span>
    </div>
  );
}

function formatCnpj(digits: string): string {
  const c = digits.replace(/\D/g, "");
  if (c.length !== 14) return digits;
  return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5, 8)}/${c.slice(8, 12)}-${c.slice(12)}`;
}
