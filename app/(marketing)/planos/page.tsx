"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const TIERS = [
  { name: "Starter", desc: "Operadores de uma equipe colocando o primeiro sistema no ar.",
    monthly: 199, annual: 159,
    features: ["Até 5 usuários","Jobs e clientes ilimitados","App mobile · iOS e Android","Prova fotográfica e assinatura","Suporte por e-mail"],
    cta: "Começar grátis", href: "/criar-conta" },
  { name: "Pro", desc: "Equipes em crescimento com várias linhas de serviço.",
    monthly: 449, annual: 369, featured: true,
    features: ["Até 25 usuários","Roteamento inteligente e quadro de despacho","Portal do cliente (seu subdomínio)","Contratos recorrentes e orçamentos","Relatórios de lucratividade","Suporte prioritário · SLA 4h"],
    cta: "Começar grátis", href: "/criar-conta" },
  { name: "Business", desc: "Operações multi-site com necessidade de marca e integrações.",
    monthly: 949, annual: 799,
    features: ["Equipes e locais ilimitados","Portal do cliente white-label","Domínio próprio","Conta Azul / Omie / QuickBooks / Zapier","SSO e papéis avançados","Gerente de conta dedicado"],
    cta: "Falar com vendas", href: "/contato" },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  return (
    <section className="container-wide py-24">
      <div className="text-center max-w-2xl mx-auto">
        <span className="mono">Planos</span>
        <h1 className="text-5xl lg:text-6xl font-medium mt-3">Preço por equipe, não por clique.</h1>
        <p className="text-ink-700 mt-5">Uma única assinatura cobre a empresa toda — escritório e campo.</p>
        <div className="inline-flex mt-7 border rounded-full p-1 text-sm">
          <button onClick={()=>setAnnual(false)} className={`px-4 py-1.5 rounded-full ${!annual ? "bg-navy-900 text-white" : ""}`}>Mensal</button>
          <button onClick={()=>setAnnual(true)} className={`px-4 py-1.5 rounded-full inline-flex items-center gap-2 ${annual ? "bg-navy-900 text-white" : ""}`}>
            Anual <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-success/15 text-success">−18%</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-12">
        {TIERS.map(t => (
          <div key={t.name} className={`rounded-xl p-7 flex flex-col gap-6 ${t.featured ? "bg-navy-900 text-white shadow-lg" : "bg-white border"}`}>
            <div>
              <div className="font-medium text-lg">{t.name}</div>
              <p className={`text-sm mt-1 ${t.featured ? "text-white/60" : "text-ink-500"}`}>{t.desc}</p>
            </div>
            <div>
              <span className="text-5xl font-medium">R${annual ? t.annual : t.monthly}</span>
              <span className={`text-sm ml-1 ${t.featured ? "text-white/60" : "text-ink-500"}`}>/mês</span>
              <div className={`text-xs mt-1 ${t.featured ? "text-white/50" : "text-ink-400"}`}>cobrança {annual ? "anual" : "mensal"}</div>
            </div>
            <ul className="flex flex-col gap-2 text-sm flex-1">
              {t.features.map(f => (
                <li key={f} className="flex gap-2"><Check size={16} className={t.featured ? "text-blue-400" : "text-success"} />{f}</li>
              ))}
            </ul>
            <Link href={t.href as any} className={`inline-flex justify-center items-center gap-2 px-5 py-3 rounded font-medium ${t.featured ? "bg-blue-600 hover:bg-blue-400" : "bg-navy-900 text-white hover:bg-ink-900"}`}>
              {t.cta} <ArrowRight size={14} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
