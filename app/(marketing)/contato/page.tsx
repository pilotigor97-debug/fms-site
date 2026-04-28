"use client";
import { useState } from "react";
import { ArrowRight, Check, Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <section className="container-wide py-24 grid lg:grid-cols-2 gap-16">
      <div>
        <span className="mono">Contato</span>
        <h1 className="text-5xl font-medium mt-3">Fale com gente de verdade.</h1>
        <p className="text-ink-700 mt-5 max-w-md">
          Conte sua operação. Voltamos em até um dia útil com respostas, planos ou uma demo de 20 minutos.
        </p>
        <div className="mt-8 flex flex-col gap-4 text-sm">
          {[
            { icon: Mail,   label: "E-mail",  value: "ola@fms.io" },
            { icon: Phone,  label: "Vendas",  value: "+55 (11) 4000-0182" },
            { icon: MapPin, label: "Sede",    value: "Av. Paulista, 1578 · São Paulo, SP" },
          ].map(it => (
            <div key={it.label} className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-ink-100 grid place-items-center"><it.icon size={16} /></span>
              <div>
                <div className="mono">{it.label}</div>
                <div className="font-medium text-ink-900">{it.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border rounded-xl p-9 bg-white">
        {sent ? (
          <div className="text-center py-10">
            <div className="w-14 h-14 rounded-full bg-success/15 text-success grid place-items-center mx-auto"><Check size={28} /></div>
            <h3 className="text-2xl font-medium mt-5">Mensagem enviada.</h3>
            <p className="text-ink-700 mt-2">Voltamos em até um dia útil.</p>
          </div>
        ) : (
          <form onSubmit={(e)=>{e.preventDefault(); setSent(true);}} className="flex flex-col gap-4">
            <Field label="Nome completo" type="text"  placeholder="Maria Ribeiro" required />
            <Field label="E-mail corporativo" type="email" placeholder="maria@empresa.com" required />
            <Field label="Empresa" type="text" placeholder="Cleanpro Ltda." required />
            <div className="flex flex-col gap-1.5">
              <label className="mono">Tamanho da equipe</label>
              <select className="border rounded-md px-3 py-2.5">
                <option>1-5</option><option>6-25</option><option>26-100</option><option>100+</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="mono">O que você quer resolver?</label>
              <textarea className="border rounded-md px-3 py-2.5 min-h-[100px]" placeholder="Despachamos por quadro branco e estamos perdendo o controle dos jobs…" />
            </div>
            <button className="inline-flex items-center justify-center gap-2 bg-navy-900 text-white px-5 py-3 rounded font-medium hover:bg-ink-900">
              Enviar mensagem <ArrowRight size={14} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="mono">{label}</label>
      <input className="border rounded-md px-3 py-2.5" {...rest} />
    </div>
  );
}
