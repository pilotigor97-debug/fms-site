import { Shield } from "lucide-react";

export function AuthAside() {
  return (
    <aside className="hidden lg:flex flex-col justify-between bg-navy-900 text-white p-12">
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/8 text-white/80 mono w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-success ring-2 ring-success/25" />
        BETA · BRASIL
      </span>
      <div>
        <p className="text-2xl leading-relaxed">
          Console único pra agendamento, despacho, prova fotográfica e
          orçamento — feito pra equipes que tocam o dia direto do celular.
        </p>
        <div className="text-sm text-white/60 mt-6 leading-relaxed">
          IA contextual por vertical (limpeza, HVAC, locação, facilities,
          reforma, jardinagem). Configurada automaticamente no signup.
        </div>
      </div>
      <div className="flex items-center gap-3 border border-white/10 rounded-lg p-4">
        <div className="w-9 h-9 rounded-md bg-blue-600/20 text-blue-400 grid place-items-center"><Shield size={16} /></div>
        <div>
          <div className="text-sm font-medium">LGPD compliant</div>
          <div className="text-xs text-white/50 mt-0.5">Criptografado e isolado por tenant</div>
        </div>
        <span className="ml-auto mono text-white/40">SEG</span>
      </div>
    </aside>
  );
}
