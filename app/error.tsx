'use client';

/**
 * Audit A8 — error boundary global do Next.js App Router.
 *
 * Aparece quando rota lança erro não tratado. Substitui o crash silente
 * (tela em branco ou erro do Next dev mode em produção).
 *
 * Componente minimal — mensagem amigável + botão "Tentar de novo" que
 * reseta o boundary via `reset()` do Next. Em prod, o erro real fica no
 * server log mas o user vê só "Algo deu errado, tenta de novo".
 *
 * Sub-rotas podem ter `error.tsx` próprio pra UX específica
 * (ex: workspace tem error pq depende de auth).
 */

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log no client-side; server-side já vai pro Vercel/Cloud Run logs.
    // eslint-disable-next-line no-console
    console.error('FMS error boundary:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px',
        padding: '32px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#FEE5E6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
        }}
      >
        ⚠
      </div>
      <h2
        style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: 600,
          color: '#0A1628',
        }}
      >
        Algo deu errado
      </h2>
      <p
        style={{
          margin: 0,
          maxWidth: '400px',
          color: '#6B7689',
          fontSize: '14px',
          lineHeight: 1.5,
        }}
      >
        Tivemos um problema ao carregar essa página. Você pode tentar de novo
        ou voltar pra home.
      </p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            padding: '12px 20px',
            background: '#0A1628',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Tentar de novo
        </button>
        <a
          href="/"
          style={{
            padding: '12px 20px',
            background: '#fff',
            color: '#0A1628',
            border: '1px solid #D0D5DD',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Voltar pra home
        </a>
      </div>
      {error.digest && (
        <p
          style={{
            margin: 0,
            fontSize: '11px',
            color: '#8A93A3',
            fontFamily: 'monospace',
          }}
        >
          ID: {error.digest}
        </p>
      )}
    </div>
  );
}
