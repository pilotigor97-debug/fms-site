import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { HeroVisual } from "./hero-visual";
import { HeroFloaters } from "./hero-floaters";

export function Hero() {
  return (
    <section className="relative pt-20 pb-24 overflow-hidden">
      <div className="absolute inset-0 [background-image:linear-gradient(rgba(11,22,40,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(11,22,40,0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      <div className="container-wide relative grid lg:grid-cols-[1.1fr_1fr] gap-16 items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-xs text-ink-500">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-100 text-blue-600 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-success ring-2 ring-success/25" />v4.2
            </span>
            Agora com otimização de rotas por IA
            <ArrowRight size={13} />
          </span>
          <h1 className="mt-5 text-5xl lg:text-7xl font-medium tracking-tight leading-[1.05] text-balance">
            O sistema operacional para <em className="not-italic text-blue-600">equipes de campo.</em>
          </h1>
          <p className="mt-6 text-lg text-ink-700 max-w-xl">
            FMS é um console único para agendamento, despacho, prova fotográfica e faturamento — feito para equipes de
            limpeza, manutenção e empreiteiros que tocam o dia direto do celular.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/criar-conta" className="inline-flex items-center gap-2 bg-navy-900 text-white px-5 py-3 rounded font-medium hover:bg-ink-900">
              Comece grátis — 14 dias <ArrowRight size={15} />
            </Link>
            <Link href="/contato" className="inline-flex items-center gap-2 border px-5 py-3 rounded font-medium hover:bg-ink-50">
              Agendar demo
            </Link>
          </div>
          <div className="mt-8 flex gap-6 text-sm text-ink-500">
            {["Sem cartão", "Configura em 8 minutos", "Cancele quando quiser"].map(t => (
              <span key={t} className="inline-flex items-center gap-1.5"><Check size={14} className="text-success" />{t}</span>
            ))}
          </div>
        </div>
        <div className="relative">
          <HeroVisual />
          <HeroFloaters />
        </div>
      </div>
    </section>
  );
}
