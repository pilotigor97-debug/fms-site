import { Shield } from "lucide-react";

export function AuthAside() {
  return (
    <aside className="hidden lg:flex flex-col justify-between bg-navy-900 text-white p-12">
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/8 text-white/80 mono w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-success ring-2 ring-success/25" />
        +4.200 EQUIPES NO AR
      </span>
      <div>
        <p className="text-2xl leading-relaxed">
          "Migramos uma operação de 38 equipes pro FMS num fim de semana. Na terça pela manhã, o escritório não parecia
          mais o mesmo de segunda — e a gente já tinha economizado o trabalho de um despachante inteiro."
        </p>
        <div className="flex items-center gap-3 mt-6">
          <div className="w-9 h-9 rounded-full bg-white/10 grid place-items-center text-sm font-medium">MR</div>
          <div className="text-sm">
            <div className="font-medium">Maria Ribeiro</div>
            <div className="text-white/50 mt-0.5">Dona · Cleanpro</div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 border border-white/10 rounded-lg p-4">
        <div className="w-9 h-9 rounded-md bg-blue-600/20 text-blue-400 grid place-items-center"><Shield size={16} /></div>
        <div>
          <div className="text-sm font-medium">SOC 2 Type II · LGPD</div>
          <div className="text-xs text-white/50 mt-0.5">Criptografado e isolado por tenant</div>
        </div>
        <span className="ml-auto mono text-white/40">SEG</span>
      </div>
    </aside>
  );
}
