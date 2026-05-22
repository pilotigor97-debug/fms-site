// /recursos — visão completa de tudo que o FMS entrega hoje.
// Estruturado em 6 grupos pra cliente entender escopo real (não stub).

import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Wrench,
  Users,
  FileText,
  Globe,
  Wallet,
  Shield,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Recursos",
  description:
    "Tudo que o FMS faz hoje: gestão de equipamento, app técnico de campo, contratos + cobrança recorrente, portal cliente, financeiro completo, multi-tenant e LGPD nativo.",
};

const GROUPS: Array<{
  num: string;
  icon: typeof Wrench;
  title: string;
  intro: string;
  items: string[];
}> = [
  {
    num: "01",
    icon: Wrench,
    title: "Operação de campo e equipamento",
    intro:
      "O coração do FMS — equipamento como entidade central, técnico com app, ciclo completo de locação e manutenção.",
    items: [
      "Cadastro de equipamentos com ficha viva (disponível / locado / manutenção / retirado)",
      "Histórico amarrado ao equipamento — peças trocadas, técnicos, contratos passados",
      "App técnico cross-platform (Android + PWA iOS) com tela Hoje, OS + foto + assinatura digital",
      "Roteirização básica + check-in/out por QR Code (Facilities) ou marcação manual (Rental)",
      "Despacho de OS com SLA watcher (escala automática se prazo se aproxima)",
      "Funciona offline — técnico sem rede registra OS e sincroniza ao voltar online",
      "Manutenção preventiva agendada por equipamento + alerta automático no painel",
    ],
  },
  {
    num: "02",
    icon: Users,
    title: "Roles e permissões (5 cargos)",
    intro:
      "Cada cargo vê só o que precisa. Técnico nunca vê preço — gate técnico, não só de UI.",
    items: [
      "Diretor — visão completa, painel executivo, gestão de usuários, multi-CNPJ",
      "Supervisor — coordena contratos/sites, recusa chamados, scoped por assignedContracts",
      "Administrador — cadastros, criação de OS, edição de contratos",
      "Encarregado (Facilities only) — supervisão de turno, ronda, shifts",
      "Técnico — Hoje, OS atribuída, relatório, manuais. Nunca vê preço/contrato/faturamento",
      "Multi-CNPJ nativo — diretor alterna entre empresas no header (Sprint 5)",
      "Cliente final via portal público — sem licença extra",
    ],
  },
  {
    num: "03",
    icon: FileText,
    title: "Contratos, cobrança e fiscal",
    intro:
      "Cadastrou contrato, a cobrança roda sozinha. Sem replicar no Conta Azul.",
    items: [
      "Contratos com PDF gerado (cliente + equipamentos + valor mensal + vencimento)",
      "Cobrança recorrente Asaas integrada (PIX, boleto, cartão de crédito)",
      "Emissão NFS-e automática via Focus NFe (driver pluggable, mock + Focus)",
      "Conciliação automática quando fatura Asaas é paga (cash movement append-only)",
      "Alertas: contrato vencendo em 30 dias, equipamento em manutenção há +7 dias, inadimplência",
      "Portal público do cliente final: aprovar orçamento, acompanhar chamado, baixar boleto",
      "Sem licença extra por cliente final — link público gerado por contrato",
    ],
  },
  {
    num: "04",
    icon: Wallet,
    title: "Financeiro e análise de rentabilidade",
    intro:
      "Não substitui Conta Azul fiscal completo — mas dá visão real de margem e fluxo no painel do diretor.",
    items: [
      "Contas a pagar (expenses) com workflow status (pendente / pago / cancelado) + supplier",
      "Alocação de despesa por contrato (% ou valor) — afeta margem",
      "Fluxo de caixa com período configurável + projeção 3 meses",
      "Margem por contrato V2 — burden CLT (61,72%), benefícios rateados, cost centers",
      "P&L mensal noturno (snapshot por companyId) com receita + custo + margem%",
      "Cost centers ERP v2 — 9 categorias (labor, materials, fuel, uniform, equipment, etc.)",
      "Consumo de material por contrato/cliente (Facilities)",
      "Lucro por OS (peças + tempo técnico + deslocamento) com MarginTier",
    ],
  },
  {
    num: "05",
    icon: Globe,
    title: "Multi-vertical: Rental e Facilities",
    intro:
      "Mesma plataforma, 2 modelos operacionais distintos. Adapta UI e queries por vertical.",
    items: [
      "Rental — ciclo equipamento, deliveries, contracts, exec dashboard, portal cliente público",
      "Facilities — postos (sites), QR check-in/out, mapa em tempo real, command center",
      "Facilities ERP v2 — sites, positions, employees, allocations, routines, cost centers",
      "Verticais adicionais configuráveis (cleaning, hvac, construction, maintenance, landscaping)",
      "Cada vertical entra com landing dedicada + módulos habilitados via assets/verticals.json",
      "Dashboard executivo (diretor only) — faturamento, top clientes, técnico mais produtivo",
    ],
  },
  {
    num: "06",
    icon: Shield,
    title: "Segurança, LGPD e transparência",
    intro:
      "Multi-tenant em 3 camadas + audit log universal + página /seguranca pública. Único SaaS do setor com transparência radical.",
    items: [
      "Multi-tenant 3 camadas: Firestore rules + filtros por companyId + asserts em Cloud Functions",
      "Audit log universal (entityType) — toda escrita rastreável com IP + User-Agent",
      "LGPD nativo: export portabilidade (Art. 18) + soft-delete 30 dias",
      "Click-wrap moderno no signup + modal de re-aceite quando versão dos termos sobe",
      "Cláusula 6 dos Termos — divulgação do vínculo com SoluClean LTDA (conflito declarado)",
      "Página /seguranca pública com arquitetura técnica + direito de auditoria",
      "Audit log acessível pelo diretor: 'Acessos aos meus dados' no app (90 dias)",
      "Backups Firestore diários com retenção de 30 dias",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      {/* HERO */}
      <section className="container-wide pt-24 pb-12">
        <span className="mono">Recursos · 2026</span>
        <h1 className="text-5xl lg:text-6xl font-medium mt-3 max-w-4xl tracking-tight">
          Cada tela, desenhada por quem opera no campo.
        </h1>
        <p className="text-xl text-ink-500 mt-6 max-w-2xl">
          Tudo que o FMS faz hoje em 6 grupos — sem prometer feature que
          não existe. Marcadas explicitamente o que está em beta temporário
          (IA) e o que é roadmap.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/planos"
            className="inline-flex items-center gap-2 bg-ink-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-ink-800 transition-colors"
          >
            Ver pricing
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/comparacao"
            className="inline-flex items-center gap-2 border border-ink-200 px-6 py-3 rounded-lg font-medium hover:bg-ink-50 transition-colors"
          >
            Comparar com Eloca
          </Link>
        </div>
      </section>

      {GROUPS.map(({ num, icon: Icon, title, intro, items }) => (
        <section key={num} className="container-wide py-16 border-t">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-10">
            <div>
              <div className="flex items-center gap-3">
                <span className="mono text-blue-600">{num}</span>
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-3xl font-medium mt-3">{title}</h2>
              <p className="text-ink-500 mt-3 leading-relaxed">{intro}</p>
            </div>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span className="text-ink-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      {/* IA BETA */}
      <section className="container-wide py-16 border-t">
        <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-xl border border-blue-200 max-w-3xl">
          <Sparkles className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
          <div>
            <div className="font-medium text-lg">
              IA contextual — beta temporário
            </div>
            <p className="text-ink-700 mt-2 leading-relaxed">
              Funcionalidades de IA (polish de relatório técnico, busca em
              manuais, chat com vocabulário da vertical) estão em beta
              temporário — hoje desligadas para reduzir custo enquanto
              refinamos o modelo. Plano de retorno: H2 2026. Os 6 grupos
              acima permanecem 100% ativos.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-wide py-20 border-t">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-medium tracking-tight">
            Quer ver tudo isso rodando na sua operação?
          </h2>
          <p className="text-ink-500 mt-4">
            Demo de 30 minutos com seus dados reais — sem pitch genérico.
            Entramos no seu fluxo, com seus equipamentos, contratos e
            cobrança.
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 bg-ink-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-ink-800 transition-colors mt-6"
          >
            Agendar demo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
