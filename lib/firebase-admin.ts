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
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let cachedApp: App | null = null;

function getApp(): App {
  if (cachedApp) return cachedApp;
  if (getApps().length > 0) {
    cachedApp = getApps()[0]!;
    return cachedApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin: variáveis de ambiente faltando. ' +
        'Confira FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY.'
    );
  }

  cachedApp = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      // No Vercel/dotenv, \n vem escapado como literal "\\n" — reverte.
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
    // Passa explícito pra sobrepor FIREBASE_CONFIG auto-injetado pelo
    // App Hosting (que aponta pro projeto onde o backend roda, mesmo
    // quando o Admin SDK precisa apontar pra outro projeto).
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
