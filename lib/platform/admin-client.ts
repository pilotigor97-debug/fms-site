/**
 * Platform Console — client-side helpers pra chamar callables platform_*
 * do Cloud Functions.
 *
 * Resolução de region: southamerica-east1 (alinha com restante).
 *
 * TypeScript types refletem o shape retornado pelas CFs em
 * `opspilot/functions/platform_tenants.js`. Quando mudar lá, mudar
 * aqui — sem schema compartilhado por enquanto.
 */
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

const REGION = "southamerica-east1";

function ensureApp() {
  if (getApps().length > 0) return getApp();
  return initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  });
}

function fn<TReq, TRes>(name: string) {
  return async (data: TReq): Promise<TRes> => {
    const app = ensureApp();
    const functions = getFunctions(app, REGION);
    const callable = httpsCallable<TReq, TRes>(functions, name);
    const result = await callable(data);
    return result.data;
  };
}

// ─── Types ─────────────────────────────────────────────────────────

export type TenantBilling = {
  status: "trialing" | "active" | "past_due" | "canceled" | string;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  planId: string | null;
};

export type TenantAiCredits = {
  balance: number;
  canPurchase: boolean;
  totalConsumed?: number;
  dailyCapBrl?: number | null;
};

export type TenantListItem = {
  id: string;
  name: string;
  displayName: string;
  cnpj: string;
  vertical: string;
  billing: TenantBilling;
  aiCredits: TenantAiCredits;
  suspended: boolean;
  createdAt: string | null;
};

export type TenantDetail = TenantListItem & {
  branding: Record<string, unknown>;
  settings: Record<string, unknown>;
  billing: TenantBilling & { asaasSubscriptionId: string | null };
  aiCredits: TenantAiCredits;
  suspendedAt: string | null;
  suspendedReason: string | null;
  notes: string;
  counts: { users: number; serviceOrders: number; tickets: number };
};

export type AuditLog = {
  id: string;
  adminEmail: string;
  adminRole: string;
  action: string;
  targetCompanyId: string | null;
  payload: Record<string, unknown>;
  result: string;
  createdAt: string | null;
};

// ─── Callables ─────────────────────────────────────────────────────

export const platformListTenants = fn<
  {
    status?: string | null;
    vertical?: string | null;
    search?: string;
    cursor?: string | null;
  },
  { tenants: TenantListItem[]; nextCursor: string | null }
>("platformListTenants");

export const platformGetTenantDetail = fn<
  { companyId: string },
  TenantDetail
>("platformGetTenantDetail");

export const platformExtendTrial = fn<
  { companyId: string; days: number; reason: string },
  { success: true; newTrialEndsAt: string }
>("platformExtendTrial");

export const platformGrantAiCredits = fn<
  {
    companyId: string;
    amount: number;
    reason: string;
    enableAi?: boolean;
  },
  { success: true; newBalance: number }
>("platformGrantAiCredits");

export const platformSuspendTenant = fn<
  { companyId: string; reason: string },
  { success: true }
>("platformSuspendTenant");

export const platformReactivateTenant = fn<
  { companyId: string; reason: string },
  { success: true }
>("platformReactivateTenant");

export const platformListAuditLogs = fn<
  { companyId?: string | null; cursor?: string | null },
  { logs: AuditLog[]; nextCursor: string | null }
>("platformListAuditLogs");
