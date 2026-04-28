import Link from "next/link";

const cols = [
  { title: "Produto",   links: [["Recursos","/recursos"],["Planos","/planos"],["Novidades","#"],["Roadmap","#"]] },
  { title: "Empresa",   links: [["Sobre","#"],["Clientes","#"],["Contato","/contato"],["Carreiras","#"]] },
  { title: "Recursos",  links: [["Documentação","#"],["API","#"],["Status","#"],["Segurança","#"]] },
  { title: "Legal",     links: [["Privacidade","#"],["Termos","#"],["DPA","#"],["Cookies","#"]] },
] as const;

export function Footer() {
  return (
    <footer className="bg-ink-50 border-t">
      <div className="container-wide grid grid-cols-[1.4fr_repeat(4,1fr)] gap-12 py-20">
        <div>
          <div className="flex items-center gap-2 font-medium">
            <span className="w-7 h-7 rounded bg-navy-900 grid place-items-center text-white text-sm font-mono">F</span>
            FMS
          </div>
          <p className="text-sm text-ink-500 mt-4 max-w-xs">
            Field Management System — software de operações para equipes de campo. Agende, despache e comprove o serviço em um único console.
          </p>
          <span className="mono inline-flex items-center gap-1.5 mt-5">
            <span className="w-1.5 h-1.5 rounded-full bg-success ring-2 ring-success/25" />
            Todos os sistemas operacionais
          </span>
        </div>
        {cols.map(c => (
          <div key={c.title}>
            <h5 className="mono mb-4 text-ink-700">{c.title}</h5>
            <ul className="space-y-2 text-sm text-ink-700">
              {c.links.map(([label, href]) => (
                <li key={label}><Link href={href as any} className="hover:text-ink-900">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-wide flex justify-between items-center py-5 border-t text-xs text-ink-500">
        <span>© 2026 FMS — Field Management System</span>
        <span className="font-mono">v.1.0</span>
      </div>
    </footer>
  );
}
