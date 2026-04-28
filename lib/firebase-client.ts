/**
 * Firebase Web SDK (client-side) — usado pelas páginas /login e /criar-conta
 * para autenticar o usuário direto no browser.
 *
 * Por que client SDK e não REST + custom token (como antes):
 *   - Custom token é project-specific. Antes o site usava project diferente
 *     do app, então custom token era a única forma de fazer handoff.
 *   - Agora ambos compartilham `relatorio-tecnico-dev`. Auth state via
 *     IndexedDB fica disponível em todo o origin (`/login`, `/app/`, etc).
 *   - Flutter Web em /app/ detecta sessão automaticamente via authStateChanges.
 *
 * Idempotência: getApps() retorna app já inicializado se existir, evitando
 * o erro "Firebase app already initialized" em hot reload do Next.js dev.
 */
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
};

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;

function getClientApp(): FirebaseApp {
  if (cachedApp) return cachedApp;
  const apps = getApps();
  cachedApp = apps.length > 0 ? apps[0]! : initializeApp(config);
  return cachedApp;
}

export function getClientAuth(): Auth {
  if (cachedAuth) return cachedAuth;
  cachedAuth = getAuth(getClientApp());
  return cachedAuth;
}
