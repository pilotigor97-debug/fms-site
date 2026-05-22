// Guia operacional da vertical Rental — convive com a landing
// dinâmica /rental (servida por app/(marketing)/[vertical]/page.tsx).
// Híbrido: vitrine no topo, manual aprofundado embaixo.

import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Wrench,
  Repeat,
  FileText,
  Truck,
  Receipt,
  Globe,
  Briefcase,
  UserCog,
  Users,
  HardHat,
  User,
  CheckCircle2,
  Package,
  Bell,
  BarChart3,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Guia Rental — FMS",
  description:
    "Guia operacional do FMS para locadoras de equipamento e empresas de manutenção. O que cada cargo (diretor, supervisor, técnico, cliente final) faz no sistema, recursos por área e como começar.",
};

const roles = [
  {
    icon: Briefcase,
    name: "Diretor",
    role: "diretor",
    scope: "Visão completa do negócio. Único com acesso ao painel executivo.",
    cans: [
      "Painel executivo: faturamento, top clientes, equipamento mais rentável",
      "Gestão de usuários (criar, editar, desativar, definir cargo)",
      "Multi-CNPJ — alterna entre empresas no header (matriz + filial)",
      "Aprova contratos e orçamentos de qualquer valor",
      "Acessa cobrança Asaas e emissão de NFS-e",
    ],
  },
  {
    icon: UserCog,
    name: "Supervisor",
    role: "supervisor",
    scope:
      "Coordenação operacional. Pode recusar chamados (administrador não pode).",
    cans: [
      "Recusa chamados que não vão atender",
      "Aprova orçamentos antes de virarem contrato",
      "Coordena equipe técnica e despacha OS",
      "Edita alocações de equipamento entre clientes",
      "Vê painel operacional consolidado",
    ],
    restrictions: "Escopo limitado a assignedContracts.",
  },
  {
    icon: Users,
    name: "Administrador",
    role: "administrador",
    scope: "Cadastros, criação de OS, edição de contratos.",
    cans: [
      "Cadastra equipamentos, clientes e contratos",
      "Cria orçamentos e ordens de serviço",
      "Programa entregas e devoluções",
      "Mantém lista de preços e tabelas",
      "Visualiza painéis operacionais",
    ],
    restrictions:
      "Não gerencia usuários, não recusa chamados, sem painel executivo.",
  },
  {
    icon: HardHat,
    name: "Técnico",
    role: "tecnico",
    scope:
      "Pessoa de campo — quem atende, instala, retira e mantém o equipamento.",
    cans: [
      "Tela 'Hoje' com OS atribuídas ao dia",
      "Registra relatório técnico (peças trocadas, leituras, fotos)",
      "Acessa manuais e histórico do equipamento",
      "IA polish (beta temporário — desligado) reescreve relato bruto em laudo formal",
      "Marca OS como concluída com assinatura do cliente",
    ],
    restrictions:
      "Não vê preço, orçamento, contrato, lista de preços, faturamento ou painel financeiro.",
  },
  {
    icon: User,
    name: "Cliente final (portal público)",
    role: "cliente",
    scope:
      "Acesso público sem custo de licença. Cliente do locador, não usuário interno.",
    cans: [
      "Aprova orçamento via link público (assinatura digital)",
      "Acompanha chamado em timeline pública",
      "Visualiza contrato e equipamentos locados",
      "Baixa segunda via de boleto / consulta status PIX",
      "Abre novo chamado sem precisar ligar",
    ],
    restrictions:
      "Vê apenas dados do próprio contrato. Não enxerga outros clientes nem custos internos.",
  },
];

const features = [
  {
    icon: Package,
    title: "Ciclo de equipamento ponta a ponta",
    body:
      "Cada equipamento tem status (available, rented, maintenance, retired) e histórico completo: locações, devoluções, peças trocadas, técnicos que atenderam. Sem perder informação entre contratos.",
  },
  {
    icon: Truck,
    title: "Entrega e devolução com checklist",
    body:
      "Programação de entrega com data, endereço e responsável. Checklist de retirada documenta estado do equipamento na devolução — base pra cobrança de avaria.",
  },
  {
    icon: FileText,
    title: "Contratos com PDF gerado",
    body:
      "Cadastra contrato com cliente, equipamentos atribuídos e periodicidade. Sistema gera PDF formatado pra assinatura. Vencimento, valor mensal e renovação visíveis em um painel só.",
  },
  {
    icon: Globe,
    title: "Portal público do cliente",
    body:
      "Cliente final acessa via link público (sem cobrança de licença extra). Aprova orçamento, acompanha chamado, baixa boleto, abre novo pedido — tudo sem ligar pra recepção.",
  },
  {
    icon: Receipt,
    title: "Cobrança Asaas + NFS-e",
    body:
      "Recorrência mensal em PIX, boleto ou cartão via Asaas. Emissão de NFS-e via Focus NFe integrada — fatura sai com nota anexada. Inadimplência cai no dashboard do supervisor.",
  },
  {
    icon: Repeat,
    title: "Manutenção preventiva agendada",
    body:
      "Equipamento sem manutenção há X dias acende alerta automático. Sistema sugere próximo agendamento e técnico disponível. Histórico amarrado ao item, não ao contrato.",
  },
  {
    icon: Wrench,
    title: "Relatórios técnicos com IA (beta temporário)",
    body:
      "Técnico escreve relato curto no app ('troquei o selo, equipamento operando'). Quando IA está ativa (beta temporário — atualmente desligada pra refinamento), reestrutura em laudo formal com vocabulário técnico do setor. Salva no histórico e vira anexo da OS.",
  },
  {
    icon: Bell,
    title: "Alertas de operação",
    body:
      "Contrato vencendo em 30 dias, equipamento próximo da devolução, manutenção atrasada, inadimplência. Push topic-based — supervisor recebe alertas dele, técnico recebe os dele.",
  },
  {
    icon: BarChart3,
    title: "Dashboard de equipamento e exec",
    body:
      "Taxa de ocupação por equipamento (quanto tempo locado, parado, rendendo). Diretor vê exec dashboard com top clientes, faturamento e ROI por item.",
  },
];

const faqs = [
  {
    q: "Em quantos dias minha locadora fica de pé?",
    a: "Setup padrão leva 7 a 21 dias úteis a depender do volume de equipamento (até 200 itens é rápido, 5.000+ exige migração planejada). Você importa via planilha ou cadastra direto no painel.",
  },
  {
    q: "Como funciona a cobrança recorrente?",
    a: "Integração nativa com Asaas (PIX, boleto, cartão). Cada contrato gera ciclo de fatura automaticamente. NFS-e sai via Focus NFe vinculada à fatura. Inadimplência sobe alerta no painel.",
  },
  {
    q: "O cliente final precisa baixar app?",
    a: "Não. Cliente final usa portal público pelo navegador — link enviado por e-mail ou WhatsApp. Aprova orçamento, acompanha chamado, baixa boleto. App é só pra equipe interna (técnico, admin).",
  },
  {
    q: "Técnico vê preço do equipamento?",
    a: "Não. Por design — técnico nunca vê preço, orçamento, contrato ou faturamento. Tela dele é focada em executar OS. Isso evita expor margem em conversa com cliente em campo.",
  },
  {
    q: "Funciona offline pro técnico?",
    a: "App de campo faz fila local quando perde conexão (foto, relatório, assinatura) e sincroniza ao voltar online. Painel administrativo requer conexão.",
  },
  {
    q: "Posso ter mais de um CNPJ na mesma conta?",
    a: "Sim. Multi-CNPJ nativo — diretor alterna no header. Comum pra locadoras que têm matriz + filial em estados diferentes. Cada colaborador tem CNPJ primário e pode acessar outros via companyIds.",
  },
  {
    q: "E LGPD?",
    a: "Soft-delete de 30 dias, export de portabilidade por titular (Art. 18), audit log universal e backup mensal. DPO designado e contrato de processador disponível.",
  },
];

export default function GuiaRentalPage() {
  return (
    <>
      {/* HERO — VITRINE */}
      <section className="container-wide pt-24 pb-12">
        <span className="mono">Guia Rental</span>
        <h1 className="text-5xl lg:text-6xl font-medium mt-3 max-w-4xl tracking-tight">
          Cada equipamento com histórico, contrato e técnico no mesmo lugar.
        </h1>
        <p className="text-xl text-ink-500 mt-6 max-w-2xl">
          Locação, manutenção, cobrança e portal do cliente em um console único.
          Cada cargo enxerga só o que precisa — técnico não vê preço, cliente
          final acessa só o próprio contrato.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 bg-ink-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-ink-800 transition-colors"
          >
            Falar com vendas
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/rental"
            className="inline-flex items-center gap-2 border border-ink-200 px-6 py-3 rounded-lg font-medium hover:bg-ink-50 transition-colors"
          >
            Ver visão geral
          </Link>
        </div>
      </section>

      {/* DORES — VITRINE */}
      <section className="container-wide py-16 border-t">
        <span className="mono">Por que existe</span>
        <h2 className="text-4xl font-medium mt-2 max-w-3xl">
          Três dores que a planilha não resolve.
        </h2>
        <div className="grid md:grid-cols-3 gap-4 mt-10">
          {[
            {
              title: "Histórico mora em duas cabeças",
              body:
                "Você sabe que a peça foi trocada no equipamento 042, mas a planilha não. Próximo técnico abre e refaz o diagnóstico do zero.",
            },
            {
              title: "Cliente liga pra perguntar status",
              body:
                "Cada chamado vira ligação. Cada renovação vira reunião. Sem portal, o cliente não tem como se autosservir.",
            },
            {
              title: "Cobrança recorrente é manual",
              body:
                "Boleto mensal feito na mão, NFS-e emitida em outro sistema, conciliação no fim do mês. Equipe perde tempo em vez de vender.",
            },
          ].map(({ title, body }) => (
            <div key={title} className="border rounded-xl p-7">
              <div className="font-medium text-lg">{title}</div>
              <p className="text-ink-500 mt-2 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROLES — MANUAL */}
      <section className="container-wide py-16 border-t">
        <span className="mono">Cargos e permissões</span>
        <h2 className="text-4xl font-medium mt-2 max-w-3xl">
          Cada cargo vê só o que precisa.
        </h2>
        <p className="text-ink-500 mt-3 max-w-2xl">
          São quatro cargos internos (diretor, supervisor, administrador, técnico)
          mais o cliente final, que acessa via portal público sem ocupar licença.
          Permissões são exclusivas por escopo.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mt-10">
          {roles.map(({ icon: Icon, name, role, scope, cans, restrictions }) => (
            <div key={role} className="border rounded-xl p-7">
              <div className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="font-medium text-lg">{name}</div>
                  <span className="mono">{role}</span>
                </div>
              </div>
              <p className="text-ink-700 mt-4 text-sm">{scope}</p>
              <ul className="mt-4 space-y-2">
                {cans.map((c) => (
                  <li key={c} className="flex gap-2 text-sm text-ink-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              {restrictions && (
                <p className="text-xs text-ink-500 mt-4 pt-4 border-t">
                  <span className="mono">Restrição </span>
                  {restrictions}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES — MANUAL */}
      <section className="container-wide py-16 border-t">
        <span className="mono">Recursos por área</span>
        <h2 className="text-4xl font-medium mt-2 max-w-3xl">
          Tudo amarrado ao equipamento, não ao cliente.
        </h2>
        <div className="grid md:grid-cols-2 gap-4 mt-10">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="border rounded-xl p-7">
              <Icon className="w-6 h-6 text-blue-600" />
              <div className="font-medium mt-4 text-lg">{title}</div>
              <p className="text-ink-500 mt-2 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SETUP — MANUAL */}
      <section className="container-wide py-16 border-t">
        <span className="mono">Como começar</span>
        <h2 className="text-4xl font-medium mt-2 max-w-3xl">
          Da assinatura à primeira locação faturada.
        </h2>
        <ol className="mt-10 space-y-6 max-w-3xl">
          {[
            {
              n: "1",
              title: "Kickoff e cadastro do parque",
              body:
                "Importa equipamentos via planilha (marca, modelo, número de série, status) ou cadastra direto. Definimos cargos da sua equipe interna.",
            },
            {
              n: "2",
              title: "Contratos e clientes",
              body:
                "Cadastra clientes e contratos ativos. Cada contrato amarra equipamentos, periodicidade de cobrança e técnico responsável.",
            },
            {
              n: "3",
              title: "Integração Asaas e NFS-e",
              body:
                "Conecta sua conta Asaas e configura emissão de NFS-e via Focus NFe (precisa do certificado A1 da sua prefeitura).",
            },
            {
              n: "4",
              title: "Treinamento de campo",
              body:
                "Vídeo curto por cargo + app guiado. Técnico aprende relatório em menos de uma hora (com IA ativa, mais rápido). Administrador domina cadastro em meio dia.",
            },
            {
              n: "5",
              title: "Go-live monitorado",
              body:
                "Primeira semana com suporte de plantão. Acompanhamos as primeiras OS, primeiros relatórios e primeira fatura recorrente.",
            },
            {
              n: "6",
              title: "Portal do cliente ativo",
              body:
                "Após go-live, envia link público pros clientes — orçamentos passam a ser aprovados online, chamados abertos pelo próprio cliente.",
            },
          ].map(({ n, title, body }) => (
            <li key={n} className="flex gap-5">
              <span className="mono text-2xl text-blue-600 shrink-0 w-8">{n}</span>
              <div>
                <div className="font-medium text-lg">{title}</div>
                <p className="text-ink-500 mt-1">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="container-wide py-16 border-t">
        <span className="mono">Dúvidas frequentes</span>
        <h2 className="text-4xl font-medium mt-2 max-w-3xl">
          Antes da call.
        </h2>
        <div className="mt-10 space-y-6 max-w-3xl">
          {faqs.map(({ q, a }) => (
            <div key={q} className="border-b pb-6">
              <div className="font-medium text-lg">{q}</div>
              <p className="text-ink-500 mt-2 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="container-wide py-20 border-t">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-medium tracking-tight">
            Quer ver isso rodando na sua locadora?
          </h2>
          <p className="text-ink-500 mt-4">
            Demo de 30 minutos com seu parque real. Sem pitch genérico — entramos
            com seus equipamentos, seus contratos e o seu fluxo de cobrança.
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
