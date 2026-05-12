import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/85 border-b">
      <div className="container-wide flex items-center h-16">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <span className="w-7 h-7 rounded bg-navy-900 grid place-items-center text-white text-sm font-mono">F</span>
          FMS<span className="text-ink-500">.io</span>
        </Link>
        <nav className="ml-10 flex items-center gap-7 text-sm text-ink-700">
          <Link href="/recursos">Recursos</Link>
          <Link href="/planos">Planos</Link>
          <Link href="/download">App</Link>
          <Link href="/contato">Contato</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/login" className="text-sm px-3 py-2 rounded text-ink-700 hover:bg-ink-50">Entrar</Link>
          <Link href="/criar-conta" className="inline-flex items-center gap-1.5 text-sm bg-navy-900 text-white px-3.5 py-2 rounded font-medium hover:bg-ink-900">
            Começar grátis <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}
