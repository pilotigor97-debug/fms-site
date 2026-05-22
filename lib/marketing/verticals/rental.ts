import { Clock, FileText, Repeat, Wrench } from "lucide-react";
import type { VerticalMarketing } from "./types";

export const rental: VerticalMarketing = {
  id: "rental",
  hero: {
    eyebrow: "Para empresas de locação e manutenção",
    headline:
      "Cada equipamento locado, com histórico, contrato e técnico no mesmo lugar.",
    subhead:
      "Chamado, ordem de serviço, relatório técnico, manutenção preventiva e contrato — tudo amarrado ao equipamento, não ao cliente.",
    primaryCtaLabel: "Começar grátis (14 dias)",
    secondaryCta: { label: "Ver todos os recursos", href: "/recursos" },
  },
  features: {
    eyebrow: "O que muda para você",
    headline: "Locação + manutenção, sem dois sistemas.",
    items: [
      {
        icon: Wrench,
        title: "Preventiva e corretiva no mesmo lugar",
        body:
          "Cada equipamento tem histórico completo de chamados, peças trocadas e técnicos que atenderam. Sem perder informação entre contratos.",
      },
      {
        icon: Repeat,
        title: "Manutenção preventiva agendada",
        body:
          "Equipamento sem manutenção há 180 dias acende alerta automático. Sistema sugere o próximo agendamento e quem pode atender.",
      },
      {
        icon: FileText,
        title: "Contratos vivos, não PDFs parados",
        body:
          "Locação, manutenção e avulsos. Vencimento, valor mensal e equipamentos atribuídos visíveis em um painel só.",
      },
      {
        icon: Clock,
        title: "Taxa de ocupação por equipamento",
        body:
          "Quanto tempo cada item está locado, quanto está parado, quanto rende. Decisão de comprar mais ou rotacionar fica óbvia.",
      },
    ],
  },
  ia: {
    eyebrow: "IA contextual · beta temporário",
    headline: "A IA fala manutenção industrial.",
    intro:
      "O assistente entende o vocabulário operacional do seu setor — preventiva, corretiva, instalação, retirada — e usa os dados reais do sistema, não palpite.",
    highlights: [
      "Vocabulário técnico nativo — 'compressor', 'pressão', 'troca de selo', 'manutenção preventiva trimestral'.",
      "Polish de relatórios em segundos — técnico escreve 'troquei a peça, equipamento operando', IA devolve relatório estruturado.",
      "Busca em manuais e histórico — 'qual peça usei no equipamento X mês passado?' com resposta direta.",
    ],
  },
  closing: {
    headline: "Seus equipamentos merecem mais que uma planilha.",
    body:
      "14 dias grátis. Sem cartão. A IA já entra configurada pra entender que sua empresa loca equipamentos e faz manutenção.",
    ctaLabel: "Criar minha conta",
  },
  metadata: {
    title: "FMS para empresas de locação e manutenção de equipamentos",
    description:
      "Sistema de gestão para empresas que locam equipamentos e fazem manutenção. Histórico por equipamento, manutenção preventiva, contratos e IA técnica integrados.",
  },
};
