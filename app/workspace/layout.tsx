// Layout do workspace (sidebar + topbar). Stub — porta de design_handoff_fms/tenant.jsx.
import { Suspense } from "react";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr]">
      <aside className="border-r p-5 bg-white">
        <div className="flex items-center gap-2.5 pb-5 border-b">
          <span className="w-8 h-8 rounded bg-blue-600 grid place-items-center text-white font-mono">C</span>
          <div>
            <div className="font-medium text-sm">Cleanpro</div>
            <div className="font-mono text-[10px] text-ink-400 mt-0.5">cleanpro.fms.io</div>
          </div>
        </div>
        <div className="mono mt-5 mb-2">WORKSPACE</div>
        <nav className="text-sm flex flex-col gap-0.5">
          {["Despacho","Jobs","Equipes","Clientes","Rotas"].map((n,i) => (
            <a key={n} className={`px-2 py-1.5 rounded hover:bg-ink-50 ${i===0 ? "bg-ink-50 font-medium" : ""}`}>{n}</a>
          ))}
        </nav>
        <div className="mono mt-5 mb-2">GERENCIAR</div>
        <nav className="text-sm flex flex-col gap-0.5">
          {["Relatórios","Faturas","Configurações"].map(n => (
            <a key={n} className="px-2 py-1.5 rounded hover:bg-ink-50">{n}</a>
          ))}
        </nav>
      </aside>
      <main className="bg-ink-50">
        <Suspense>{children}</Suspense>
      </main>
    </div>
  );
}
