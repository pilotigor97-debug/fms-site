// Stub — porta `HeroVisual` de home.jsx. Implementação completa fica no developer.
// Estrutura: chrome de browser navy + corpo claro com 3 KPIs + lista de 4 jobs.
// Veja design_handoff_fms/home.jsx → HeroVisual.

export function HeroVisual() {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg border bg-white">
      <div className="bg-navy-900 px-4 py-3 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
        <span className="ml-3 font-mono text-xs text-white/60">cleanpro.fms.io / despacho</span>
        <span className="ml-auto font-mono text-[10px] text-white/40 tracking-wider">AO VIVO</span>
      </div>
      <div className="p-5">
        <div className="font-medium">Hoje · Seg, 27 de abr</div>
        <div className="mono mt-1">27 jobs · 8 equipes ativas</div>
        <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
          {[
            { l: "Concluídos", v: "14",   d: "+3 vs meta" },
            { l: "Em curso",   v: "9",    d: "no horário" },
            { l: "Receita",    v: "R$ 8,4k", d: "+12,4%" },
          ].map(s => (
            <div key={s.l} className="border rounded p-3">
              <div className="mono">{s.l}</div>
              <div className="text-2xl font-medium mt-1">{s.v}</div>
              <div className="text-xs text-ink-500 mt-0.5">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
