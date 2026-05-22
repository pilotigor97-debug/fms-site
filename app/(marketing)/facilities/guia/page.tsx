// Guia operacional da vertical Facilities — convive com a landing
// dinâmica /facilities (servida por app/(marketing)/[vertical]/page.tsx).
// Híbrido: vitrine no topo, manual aprofundado embaixo.

import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  MapPin,
  QrCode,
  Shield,
  Users,
  Briefcase,
  HardHat,
  UserCog,
  CheckCircle2,
  Bell,
  Wallet,
  Calendar,
  BarChart3,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Guia Facilities — FMS",
  description:
    "Guia operacional do FMS para empresas de facilities. O que cada cargo (diretor, supervisor, encarregado, técnico) faz no sistema, recursos por área e como começar.",
};

const roles = [
  {
    icon: Briefcase,
    name: "Diretor",
    role: "diretor",
    scope: "Visão completa da operação. Único com acesso ao painel executivo.",
    cans: [
      "Painel executivo: faturamento, top clientes, custo por contrato",
      "Gestão de usuários (criar, editar, desativar, definir cargo)",
      "Multi-CNPJ — alterna entre empresas no header",
      "Acessa todos os sites, contratos e relatórios sem filtro de escopo",
      "Aprova orçamentos e contratos de qualquer valor",
    ],
  },
  {
    icon: UserCog,
    name: "Supervisor",
    role: "supervisor",
    scope:
      "Coordenação operacional de múltiplos contratos/sites. Pode recusar chamados.",
    cans: [
      "Recusa chamados (admin normal não consegue)",
      "Edita alocações e escalas dos contratos sob seu escopo",
      "Vê painel operacional consolidado dos sites atribuídos",
      "Aprova trocas de turno e justifica faltas",
      "Coordena rondas e incidents entre encarregados",
    ],
    restrictions: "Escopo limitado a assignedContracts/assignedSites.",
  },
  {
    icon: Users,
    name: "Administrador",
    role: "administrador",
    scope: "Cadastros, criação de OS, edição de contratos.",
    cans: [
      "Cadastra postos, sites, contratos e cost centers",
      "Cria e edita ordens de serviço",
      "Mantém clientes, equipes e materiais",
      "Visualiza painéis operacionais e financeiros",
    ],
    restrictions:
      "Não gerencia usuários, não recusa chamados, sem acesso ao painel executivo.",
  },
  {
    icon: HardHat,
    name: "Encarregado",
    role: "encarregado",
    scope:
      "Supervisão de turno/equipe no posto. Cargo exclusivo de Facilities.",
    cans: [
      "Marca shifts como concluído ou faltoso",
      "Registra ocorrências do turno",
      "Acompanha checkpoints da ronda em tempo real",
      "Vê escala da equipe e propõe trocas",
    ],
    restrictions: "Acesso scoped ao posto/contrato sob sua responsabilidade.",
  },
  {
    icon: Shield,
    name: "Técnico / Operacional",
    role: "tecnico",
    scope:
      "Pessoa de campo — porteiro, agente de limpeza, vigilante. Foco em executar.",
    cans: [
      "Tela 'Hoje' com tarefas e turnos do dia",
      "Check-in/out por QR Code no posto",
      "Registra ocorrência com foto, hora e localização",
      "Bate checkpoint da ronda",
      "Acessa manuais de operação",
    ],
    restrictions:
      "Não vê preço, contrato, orçamento, faturamento, clientes ou financeiro.",
  },
];

const features = [
  {
    icon: Building2,
    title: "Cadastro de sites, postos e alocações",
    body:
      "Modelo ERP v2: cada cliente tem sites; cada site tem postos (portaria, ronda, limpeza); cada posto tem alocações de colaboradores em escalas. Trocas, folgas e coberturas registradas no histórico.",
  },
  {
    icon: QrCode,
    title: "QR check-in/out e ronda com checkpoint",
    body:
      "Scanner universal: porteiro entra no turno escaneando QR do posto. Vigilante bate cada checkpoint da ronda — sistema marca hora, GPS e foto opcional. Cliente vê em tempo real se a ronda foi feita.",
  },
  {
    icon: MapPin,
    title: "Mapa operacional em tempo real",
    body:
      "Flutter map + OpenStreetMap mostrando todos os postos ativos no mapa, com indicador de presença, ocorrência aberta e ronda em andamento. Útil pra gestor que cobre múltiplos sites.",
  },
  {
    icon: ClipboardList,
    title: "Livro de ocorrências digital",
    body:
      "Substitui o caderno de portaria. Porteiro registra ocorrência no app — fica vinculada ao posto, turno e timestamp. Cliente acessa via portal sem ligar. IA polish (beta temporário — atualmente desligada) reescreve relato bruto em texto formal.",
  },
  {
    icon: Calendar,
    title: "Routines programadas",
    body:
      "Rotinas recorrentes (limpeza semanal de área comum, vistoria mensal, dedetização trimestral) viram tasks automáticas. Materializam-se em ordens de serviço quando o ciclo vence.",
  },
  {
    icon: Wallet,
    title: "Payroll automático e cost centers",
    body:
      "Fechamento mensal agrega horas trabalhadas, faltas e adicional noturno por colaborador. Cost centers consolidam custo por contrato, ajudando a precificar renovação com margem real.",
  },
  {
    icon: Bell,
    title: "Despacho de OS e SLA watcher",
    body:
      "Chamado aberto pelo cliente vira OS, que cai no Despacho. SLA watcher monitora prazos e escala automaticamente pra supervisor se o prazo se aproxima do vencimento.",
  },
  {
    icon: BarChart3,
    title: "Painel financeiro e consumo",
    body:
      "Faturamento por contrato, ticket médio, consumo de materiais por site. Diretor vê o exec dashboard completo; administrador vê painel operacional.",
  },
];

const faqs = [
  {
    q: "Em quantos dias a operação fica de pé?",
    a: "Setup padrão leva 5 a 15 dias úteis a depender do número de sites e colaboradores. Você importa estrutura via planilha ou cadastra direto no painel. Treinamento de campo é via vídeo curto + app intuitivo — porteiros aprendem em menos de 30 minutos.",
  },
  {
    q: "Como funciona o multi-CNPJ?",
    a: "Se sua empresa tem mais de um CNPJ (matriz + filial, ou empresas-irmãs), o diretor alterna no seletor do header. Cada colaborador é vinculado a um CNPJ primário e pode ter acesso a outros via campo companyIds.",
  },
  {
    q: "Funciona offline?",
    a: "App de campo (técnico/encarregado) faz fila local de operações quando perde conexão e sincroniza ao voltar online. Painel administrativo (supervisor/diretor) requer conexão pra dados em tempo real.",
  },
  {
    q: "A IA é cobrada à parte?",
    a: "Recursos de IA (polish de ocorrência, resumo de turno, busca em manuais) estão em beta temporário — atualmente desligados pra refinamento. Quando voltarem, planos Business e Enterprise incluem cota; acima do limite cobramos por uso. Recursos operacionais (postos, escalas, OS, financeiro) seguem 100% ativos.",
  },
  {
    q: "E LGPD?",
    a: "Soft-delete de 30 dias, export de portabilidade por titular (Art. 18), audit log universal e backup mensal automático. DPO designado e contrato de processador disponível.",
  },
  {
    q: "Posso integrar com meu ERP/folha atual?",
    a: "Exportação de fechamento em CSV/XLSX é nativa. Integração via API custom faz parte do plano Enterprise.",
  },
];

export default function GuiaFacilitiesPage() {
  return (
    <>
      {/* HERO — VITRINE */}
      <section className="container-wide pt-24 pb-12">
        <span className="mono">Guia Facilities</span>
        <h1 className="text-5xl lg:text-6xl font-medium mt-3 max-w-4xl tracking-tight">
          O sistema de facilities pensado por quem opera no campo.
        </h1>
        <p className="text-xl text-ink-500 mt-6 max-w-2xl">
          Postos, escalas, ocorrências e ronda em um console único. Cada cargo
          enxerga só o que precisa — porteiro não vê preço, supervisor não
          mexe em faturamento, diretor vê tudo.
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
            href="/facilities"
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
          Três dores que três planilhas não resolvem.
        </h2>
        <div className="grid md:grid-cols-3 gap-4 mt-10">
          {[
            {
              title: "Ocorrência fica no caderno",
              body:
                "Porteiro anota, gestor descobre dois dias depois, cliente reclama. Sem timestamp, sem foto, sem rastreabilidade.",
            },
            {
              title: "Escala vira jogo de WhatsApp",
              body:
                "Troca de turno por mensagem, falta confirmada por foto borrada, fechamento da folha vira garimpo no fim do mês.",
            },
            {
              title: "Cliente não enxerga o que paga",
              body:
                "Sem portal, cada relatório vira PDF anexado em e-mail. Renovação fica difícil porque o cliente não vê o valor entregue.",
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
          O sistema usa cinco cargos no Facilities. As permissões são exclusivas
          por escopo — encarregado não enxerga financeiro, administrador não
          gerencia usuários, técnico nunca vê preço.
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
          Tudo que precisa, nada que não usa.
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
          Da assinatura ao primeiro check-in.
        </h2>
        <ol className="mt-10 space-y-6 max-w-3xl">
          {[
            {
              n: "1",
              title: "Kickoff e cadastro de estrutura",
              body:
                "Sua equipe importa sites, postos e contratos via planilha ou cadastra direto no painel. Definimos cargos da sua equipe interna.",
            },
            {
              n: "2",
              title: "Alocação e escala",
              body:
                "Administrador associa colaboradores aos postos com escalas (24h, 12h, 8h). Routines recorrentes são programadas.",
            },
            {
              n: "3",
              title: "Treinamento de campo",
              body:
                "Vídeo de 5 min por cargo + app guiado. Porteiro aprende QR check-in em menos de 30 minutos. Encarregado em uma hora.",
            },
            {
              n: "4",
              title: "Go-live monitorado",
              body:
                "Primeira semana com suporte de plantão. Acompanhamos os primeiros check-ins, ocorrências e fechamento de turno.",
            },
            {
              n: "5",
              title: "Fechamento mensal automatizado",
              body:
                "Ao final do primeiro mês, sistema gera payroll e relatório consolidado por contrato pra envio ao cliente.",
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
            Quer ver isso rodando na sua operação?
          </h2>
          <p className="text-ink-500 mt-4">
            Demo de 30 minutos com seus cenários reais. Sem pitch genérico —
            entramos no seu fluxo, com seus sites e seus contratos.
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
