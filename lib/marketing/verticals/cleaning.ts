import { Calendar, Camera, CheckCircle2, Repeat } from "lucide-react";
import type { VerticalMarketing } from "./types";

export const cleaning: VerticalMarketing = {
  id: "cleaning",
  hero: {
    eyebrow: "Para empresas de limpeza",
    headline: "Field service desenhado para quem limpa profissionalmente.",
    subhead:
      "Agenda recorrente, checklists, fotos antes/depois, IA que entende o vocabulário da limpeza. Sem adaptação genérica.",
    primaryCtaLabel: "Começar grátis (14 dias)",
    secondaryCta: { label: "Ver todos os recursos", href: "/recursos" },
  },
  features: {
    eyebrow: "O que muda para você",
    headline: "Vertical de limpeza, não sistema genérico.",
    items: [
      {
        icon: Repeat,
        title: "Recorrência sem dor de cabeça",
        body:
          "Contratos semanais, quinzenais ou mensais. O sistema agenda automaticamente, lembra a equipe e atualiza o cliente.",
      },
      {
        icon: CheckCircle2,
        title: "Checklists por tipo de serviço",
        body:
          "Limpeza pós-obra, limpeza profunda, faxina periódica — cada uma com seu checklist. Equipe não esquece nada.",
      },
      {
        icon: Camera,
        title: "Fotos antes/depois",
        body:
          "Equipe fotografa direto no app, cliente recebe registro visual do serviço. Reduz contestação e fideliza.",
      },
      {
        icon: Calendar,
        title: "Despacho que respeita rota",
        body:
          "Atribui equipes considerando endereço, horário e habilidade. Menos deslocamento, mais serviço entregue.",
      },
    ],
  },
  ia: {
    eyebrow: "IA contextual · beta temporário",
    headline: "A IA fala como sua equipe fala.",
    intro:
      "O FMS configura automaticamente o assistente para o seu segmento. Nenhuma frase genérica de manutenção industrial — só o que faz sentido pra limpeza.",
    highlights: [
      "Vocabulário de limpeza nativo — fala em 'limpeza profunda', 'pós-obra', 'faxina semanal', não em 'manutenção corretiva'.",
      "Polish de relatórios em segundos — equipe escreve 'limpei a casa toda', IA devolve relatório formal pro cliente.",
      "Resumos por período — 'quantos atendimentos completos esta semana?' em texto natural.",
    ],
  },
  closing: {
    headline: "Pronta para parar de adaptar planilha genérica?",
    body:
      "14 dias grátis. Sem cartão. Você cria a conta agora e a IA já entende que sua empresa é de limpeza.",
    ctaLabel: "Criar minha conta",
  },
  metadata: {
    title: "FMS para empresas de limpeza",
    description:
      "Field service desenhado para limpeza residencial e comercial. Agenda recorrente, checklists, fotos antes/depois, IA que fala o vocabulário da limpeza.",
  },
};
