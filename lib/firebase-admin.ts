/**
 * Firebase Admin SDK — inicializado SOB DEMANDA por instância Next.js.
 *
 * É chamado pelos route handlers em `app/api/auth/*` pra:
 *   - emitir custom tokens (login handoff pro Flutter)
 *   - ler `users/{uid}` e `companies/{cid}` (resolução de tenant)
 *   - enfileirar emails (lead form via collection `mail/`)
 *
 * Por que LAZY init (em vez de top-level):
 *   - Next.js durante `next build` faz "page data collection" — chama
 *     o módulo de cada route. Se as env vars não estiverem presentes
 *     no momento do build (Vercel injeta em runtime), o build quebra.
 *   - Lazy init só roda no PRIMEIRO request real, quando as envs
 *     já estão carregadas. Build passa limpo.
 */
import {
  initializeApp,
  getApps,
  cert,
  applicationDefault,
  type App,
} from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let cachedApp: App | null = null;

/**
 * Resolve credenciais conforme ambiente:
 *
 * - **Cloud Run / App Hosting** (detectado por env `K_SERVICE`): usa ADC
 *   (Application Default Credentials = identidade da SA do runtime, que
 *   já tem `firebase.sdkAdminServiceAgent`). Elimina complicações com
 *   formato de PEM em Secret Manager — cada tentativa anterior dava
 *   `invalid_grant: account not found`.
 *
 * - **Local / outros**: usa `cert()` com FIREBASE_CLIENT_EMAIL e
 *   FIREBASE_PRIVATE_KEY do `.env.local`. Funciona porque dotenv
 *   parseia o PEM com `\n` literal preservado.
 */
function getApp(): App {
  if (cachedApp) return cachedApp;
  if (getApps().length > 0) {
    cachedApp = getApps()[0]!;
    return cachedApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error('Firebase Admin: FIREBASE_PROJECT_ID ausente.');
  }

  // Cloud Run / App Hosting → ADC.
  if (process.env.K_SERVICE) {
    cachedApp = initializeApp({
      credential: applicationDefault(),
      projectId,
    });
    return cachedApp;
  }

  // Local → cert via env vars.
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin: FIREBASE_CLIENT_EMAIL ou FIREBASE_PRIVATE_KEY faltando ' +
        'pra modo local. Em Cloud Run usaria ADC automático.'
    );
  }

  cachedApp = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
    projectId,
  });
  return cachedApp;
}

export function adminAuth(): Auth {
  return getAuth(getApp());
}

export function adminDb(): Firestore {
  return getFirestore(getApp());
}
