/**
 * Audit A8 — loading state global do Next.js.
 *
 * Aparece automaticamente entre `Suspense` boundaries do App Router
 * durante navegação ou data fetching. Substitui a tela em branco que
 * o user via antes (UX horrível).
 *
 * Componente minimal — spinner centralizado com brand color.
 * Sub-rotas podem ter seu próprio `loading.tsx` pra UX customizada.
 */
export default function Loading() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid #E5E8EE',
          borderTopColor: '#2D6BFF',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ color: '#6B7689', fontSize: '14px', margin: 0 }}>
        Carregando…
      </p>
    </div>
  );
}
