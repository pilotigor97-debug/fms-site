import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Planos — FMS",
  description:
    "Pricing FMS por tamanho de operação. Growth R$ 1.890/mês até Enterprise sob consulta. Setup obrigatório. Trial 14 dias sem cartão pra Growth/Business.",
};

type Tier = {
  name: string;
  desc: string;
  monthly: string;
  setup: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Growth",
    desc: "Pequena/média locadora ou empresa facilities entrando no FMS.",
    monthly: "R$ 1.890",
    setup: "Setup R$ 18.000",
    features: [
      "Até 250 equipamentos OU 800 colaboradores",
      "15 usuários internos · técnicos ilimitados",
      "Portal cliente público (sem licença extra)",
      "Cobrança Asaas + NFS-e Focus (500/mês)",
      "Multi-CNPJ até 3 extras",
      "IA polish + busca em manuais (beta temporário)",
      "Suporte por e-mail + chat · SLA 99,5%",
      "Trial 14 dias sem cartão",
    ],
    cta: "Falar com vendas",
    href: "/contato",
  },
  {
    name: "Business",
    desc: "Operação regional consolidada — milhar de assets ou 2.500 colaboradores.",
    monthly: "R$ 4.890",
    setup: "Setup R$ 45.000",
    featured: true,
    features: [
      "Até 800 equipamentos OU 2.500 colaboradores",
      "50 usuários internos · técnicos ilimitados",
      "Tudo do Growth +",
      "NFS-e até 1.500/mês",
      "Multi-CNPJ até 10 extras",
      "Suporte + WhatsApp prioritário · SLA 99,5%",
      "Setup 40h estruturado",
    ],
    cta: "Falar com vendas",
    href: "/contato",
  },
  {
    name: "Pro",
    desc: "Operação nacional média — 2 mil equipamentos ou 7 mil colaboradores.",
    monthly: "R$ 11.900",
    setup: "Setup R$ 110.000",
    features: [
      "Até 2.000 equipamentos OU 7.000 colaboradores",
      "150 usuários internos",
      "NFS-e até 5.000/mês",
      "Multi-CNPJ ilimitado",
      "CSM (Customer Success) dedicado",
      "SLA 99,9%",
      "Setup 80h + visita on-site",
    ],
    cta: "Falar com vendas",
    href: "/contato",
  },
  {
    name: "Enterprise",
    desc: "Mills, Loctec, Versani — operação 5k+ assets ou 15k+ colaboradores.",
    monthly: "Sob consulta",
    setup: "Setup R$ 200k–500k",
    features: [
      "Usage ilimitado · 500+ usuários",
      "Suporte 24×7 dedicado",
      "SLA 99,9%+ · dedicated infrastructure",
      "Compliance pack (LGPD avançado, audit trimestral)",
      "Integração ERP custom (SAP, TOTVS, Oracle)",
      "Customização sob contrato",
    ],
    cta: "Falar com vendas",
    href: "/contato",
  },
];

export default function PricingPage() {
  return (
    <>
      {/* HERO */}
      <section className="container-wide pt-24 pb-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="mono">Planos · 2026</span>
          <h1 className="text-5xl lg:text-6xl font-medium mt-3">
            Pricing por tamanho de operação.
          </h1>
          <p className="text-ink-700 mt-5">
            Preços orientados ao que cabe no caixa da sua empresa — não ao
            que o software vale em teoria. Setup obrigatório em todos os
            tiers (cobre kickoff, configuração, migração, treinamento e
            go-live monitorado).
          </p>
        </div>
      </section>

      {/* TIERS */}
      <section className="container-wide pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`rounded-xl p-7 flex flex-col gap-5 ${
                t.featured
                  ? "bg-navy-900 text-white shadow-lg"
                  : "bg-white border"
              }`}
            >
              <div>
                <div className="font-medium text-lg flex items-center gap-2">
                  {t.name}
                  {t.featured && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-600">
                      RECOMENDADO
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm mt-1 ${
                    t.featured ? "text-white/60" : "text-ink-500"
                  }`}
                >
                  {t.desc}
                </p>
              </div>
              <div>
                <span className="text-4xl font-medium">{t.monthly}</span>
                {t.monthly.startsWith("R$") && (
                  <span
                    className={`text-sm ml-1 ${
                      t.featured ? "text-white/60" : "text-ink-500"
                    }`}
                  >
                    /mês
                  </span>
                )}
                <div
                  className={`text-xs mt-1 ${
                    t.featured ? "text-white/70" : "text-ink-500"
                  }`}
                >
                  {t.setup}
                </div>
              </div>
              <ul className="flex flex-col gap-2 text-sm flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check
                      size={16}
                      className={
                        t.featured ? "text-blue-400 shrink-0 mt-0.5" : "text-success shrink-0 mt-0.5"
                      }
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={t.href as any}
                className={`inline-flex justify-center items-center gap-2 px-5 py-3 rounded font-medium ${
                  t.featured
                    ? "bg-blue-600 hover:bg-blue-500"
                    : "bg-navy-900 text-white hover:bg-ink-900"
                }`}
              >
                {t.cta} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* DESCONTOS + NOTAS */}
      <section className="container-wide py-16 border-t">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
          <div>
            <span className="mono">Desconto por compromisso</span>
            <h2 className="text-3xl font-medium mt-2">Pagou anual, paga menos.</h2>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-ink-700">Mensal</span>
                <span className="font-medium">Preço cheio</span>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-ink-700">Anual prepago</span>
                <span className="font-medium text-success">−15%</span>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-ink-700">Bianual prepago</span>
                <span className="font-medium text-success">−22%</span>
              </div>
            </div>
          </div>

          <div>
            <span className="mono">Como funciona</span>
            <h2 className="text-3xl font-medium mt-2">O que está incluso.</h2>
            <ul className="mt-6 space-y-3 text-sm text-ink-700">
              <li className="flex gap-3">
                <Check size={16} className="text-success shrink-0 mt-0.5" />
                <span>
                  <strong>Setup obrigatório</strong> em todos os tiers — sem
                  setup, sem subscription. Inclui migração de dados de Conta
                  Azul, Auvo, planilha ou ERP comum.
                </span>
              </li>
              <li className="flex gap-3">
                <Check size={16} className="text-success shrink-0 mt-0.5" />
                <span>
                  <strong>Taxas Asaas</strong> (PIX, boleto, cartão) cobradas
                  pelo Asaas direto do seu fluxo, sem passar pela
                  mensalidade FMS.
                </span>
              </li>
              <li className="flex gap-3">
                <Check size={16} className="text-success shrink-0 mt-0.5" />
                <span>
                  <strong>NFS-e Focus NFe</strong> acima da cota: custo
                  do emissor (~R$ 0,80/nota), repassado sem markup.
                </span>
              </li>
              <li className="flex gap-3">
                <Check size={16} className="text-success shrink-0 mt-0.5" />
                <span>
                  <strong>POC paga</strong> de 30 dias por R$ 5.000
                  (abatida do setup se contratar) — disponível pra Growth e
                  Business.
                </span>
              </li>
              <li className="flex gap-3">
                <Check size={16} className="text-success shrink-0 mt-0.5" />
                <span>
                  <strong>Portal cliente</strong> público sem licença extra —
                  o cliente da sua locadora acessa sem pagar nada.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* IA BETA */}
      <section className="container-wide py-16 border-t">
        <div className="max-w-3xl flex items-start gap-4 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <Info className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
          <div>
            <div className="font-medium text-lg">IA contextual — beta temporário</div>
            <p className="text-ink-700 mt-2 leading-relaxed">
              As funcionalidades de IA (polish de relatório técnico, busca em
              manuais, chat com vocabulário da vertical) estão em{" "}
              <strong>beta temporário</strong>. Hoje desligadas para reduzir
              custo enquanto refinamos o modelo. Plano de retorno: H2 2026.
              Recursos operacionais (equipamento, contratos, OS, cobrança,
              portal cliente) permanecem 100% ativos.
            </p>
          </div>
        </div>
      </section>

      {/* PROGRAMA PARCEIRO */}
      <section className="container-wide py-16 border-t">
        <div className="max-w-3xl">
          <span className="mono">Operações menores</span>
          <h2 className="text-3xl font-medium mt-2">
            Sua operação é menor que 250 equipamentos?
          </h2>
          <p className="text-ink-700 mt-4 leading-relaxed">
            Empresas menores (autônomos, microempresa com até 30 técnicos)
            são atendidas via <strong>programa parceiro</strong> sob convite
            — não temos plano público abaixo de Growth. Entre em contato pra
            avaliar se há fit pro programa, indicação por parceiro ou template
            de planilha pra você organizar sem precisar de SaaS recorrente.
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-lg border border-ink-200 font-medium hover:bg-ink-50"
          >
            Avaliar programa parceiro <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* TRANSPARÊNCIA */}
      <section className="container-wide py-16 border-t">
        <div className="max-w-3xl">
          <span className="mono">Antes de fechar</span>
          <h2 className="text-3xl font-medium mt-2">Coisas que você deve saber.</h2>
          <ul className="mt-6 space-y-4 text-ink-700">
            <li>
              <strong>Conflito de interesse declarado:</strong> a operadora
              do FMS possui vínculo com a SoluClean LTDA (locadora). Cláusula
              6 dos{" "}
              <Link href="/termos-uso" className="underline hover:text-ink-900">
                Termos
              </Link>{" "}
              + página{" "}
              <Link href="/seguranca" className="underline hover:text-ink-900">
                /seguranca
              </Link>{" "}
              explicam isolamento técnico e direito de auditoria.
            </li>
            <li>
              <strong>Reajuste anual:</strong> IPCA acumulado. Sem reajuste
              fora desse índice durante o ano vigente.
            </li>
            <li>
              <strong>Cancelamento:</strong> a qualquer momento pela tela de
              configurações. Sem multa de fidelidade em contratos mensais.
              Anuais prepagos: sem reembolso do período já pago, mas
              cancelamento garante não renovação.
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
