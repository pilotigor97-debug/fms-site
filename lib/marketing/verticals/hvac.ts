import { Gauge, Repeat, Thermometer, Wrench } from "lucide-react";
import type { VerticalMarketing } from "./types";

export const hvac: VerticalMarketing = {
  id: "hvac",
  hero: {
    eyebrow: "Para empresas de HVAC e climatização",
    headline: "PMOC, preventiva e corretiva em um único fluxo.",
    subhead:
      "Cada split, cada chiller, cada VRF com histórico próprio. Cliente vê o plano de manutenção, técnico vê o procedimento, você vê o lucro.",
    primaryCtaLabel: "Começar grátis (14 dias)",
    secondaryCta: { label: "Ver todos os recursos", href: "/recursos" },
  },
  features: {
    eyebrow: "O que muda para você",
    headline: "HVAC pensado por quem opera HVAC.",
    items: [
      {
        icon: Thermometer,
        title: "Histórico por equipamento, não por cliente",
        body:
          "Um cliente com 30 splits vira 30 fichas técnicas — modelo, capacidade, carga de gás, última higienização, próxima preventiva.",
      },
      {
        icon: Repeat,
        title: "Preventiva recorrente automática",
        body:
          "PMOC mensal, trimestral ou semestral. Sistema gera a OS no dia certo, alerta se passou do prazo e mantém o registro pro cliente exigir.",
      },
      {
        icon: Gauge,
        title: "Diagnóstico estruturado em campo",
        body:
          "Pressão de alta, pressão de baixa, temperatura de insuflamento. Técnico registra os números, IA sugere causa provável.",
      },
      {
        icon: Wrench,
        title: "Peças por modelo de equipamento",
        body:
          "Manual de peças anexado a cada modelo. Técnico aplica no relatório, sistema busca preço e gera orçamento sem dor.",
      },
    ],
  },
  ia: {
    eyebrow: "IA contextual",
    headline: "A IA fala HVAC.",
    intro:
      "Assistente treinado pro vocabulário de climatização — compressor, capilar, gás refrigerante, capacidade BTU — e conectado ao histórico real dos equipamentos.",
    highlights: [
      "Vocabulário HVAC nativo — 'pressão de sucção', 'superaquecimento', 'carga de gás R-410A', 'troca de capacitor'.",
      "Sintoma → hipótese — técnico descreve 'não está gelando, ventilador girando', IA lista 2-3 causas prováveis em ordem.",
      "Polish de relatório — entra 'fiz a manutenção, troquei filtro', sai diagnóstico estruturado com procedimento e recomendação.",
    ],
  },
  closing: {
    headline: "Sua empresa de HVAC ainda controla por planilha?",
    body:
      "14 dias grátis. Sem cartão. A IA entra configurada com vocabulário técnico de climatização — você só preenche os clientes.",
    ctaLabel: "Criar minha conta",
  },
  metadata: {
    title: "FMS para empresas de HVAC e climatização",
    description:
      "Sistema pra empresas de climatização: PMOC, manutenção preventiva e corretiva, histórico por equipamento, diagnóstico estruturado e IA com vocabulário HVAC.",
  },
};
