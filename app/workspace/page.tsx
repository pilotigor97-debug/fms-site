// Página inicial do workspace — Despacho. Stub a partir de tenant.jsx.

export default function WorkspaceHome() {
  return (
    <div className="p-8">
      <header className="flex items-center mb-7">
        <div className="font-mono text-sm text-ink-500">Cleanpro / <span className="text-ink-900">Despacho</span> / Hoje</div>
        <div className="ml-auto flex gap-2">
          <span className="inline-flex items-center gap-1.5 mono px-2 py-1 rounded-full bg-success/10 text-success">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />SINCRONIZADO
          </span>
          <button className="border bg-white rounded-md px-3 py-1.5 text-sm hover:bg-ink-50">+ Novo job</button>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-4 mb-7">
        {[
          { l: "Jobs hoje",       v: "27",     d: "+3" },
          { l: "Pontualidade",    v: "98%",    d: "+1,2pt" },
          { l: "Equipes ativas",  v: "8",      d: "todas no ar" },
          { l: "Receita · dia",   v: "R$ 8,4k", d: "+12%" },
        ].map(k => (
          <div key={k.l} className="bg-white border rounded-xl p-5">
            <div className="mono">{k.l}</div>
            <div className="text-3xl font-medium mt-2">{k.v}</div>
            <div className="text-xs text-ink-500 mt-1">↗ {k.d}</div>
          </div>
        ))}
      </div>

      <section className="bg-white border rounded-xl">
        <header className="px-5 py-4 border-b flex items-center">
          <h3 className="font-medium">Jobs de hoje · 27</h3>
          <button className="ml-auto text-sm text-ink-500">Filtrar</button>
        </header>
        <table className="w-full text-sm">
          <thead className="text-left text-ink-400">
            <tr><th className="px-5 py-3">Job</th><th>Cliente</th><th>Equipe</th><th>Hora</th><th>Status</th></tr>
          </thead>
          <tbody>
            {[
              { id: "#4821", c: "Edifício Riverside",       t: "09:24", s: "AO VIVO" },
              { id: "#4822", c: "Maple Plaza Condomínio",   t: "11:00", s: "NA FILA" },
              { id: "#4823", c: "Harbor Logística",         t: "08:10", s: "AO VIVO" },
              { id: "#4824", c: "Residência Brookline",     t: "07:45", s: "CONCLUÍDO" },
            ].map(r => (
              <tr key={r.id} className="border-t">
                <td className="px-5 py-3 font-mono">{r.id}</td>
                <td className="font-medium">{r.c}</td>
                <td>—</td>
                <td className="font-mono">{r.t}</td>
                <td><span className="mono px-2 py-1 rounded-full bg-ink-50">{r.s}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
