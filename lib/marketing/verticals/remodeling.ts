import { Camera, Hammer, Layers, Users } from "lucide-react";
import type { VerticalMarketing } from "./types";

export const remodeling: VerticalMarketing = {
  id: "remodeling",
  hero: {
    eyebrow: "Para empresas de reforma e construção",
    headline: "Obra em etapas, equipe em campo, cliente acompanhando.",
    subhead:
      "Orçamento por etapa, evolução em fotos, controle de empreita e relatório de visita técnica. Sem WhatsApp virando memória oficial da obra.",
    primaryCtaLabel: "Começar grátis (14 dias)",
    secondaryCta: { label: "Ver todos os recursos", href: "/recursos" },
  },
  features: {
    eyebrow: "O que muda para você",
    headline: "Obra organizada, não improvisada.",
    items: [
      {
        icon: Layers,
        title: "Orçamento por etapa de obra",
        body:
          "Demolição, alvenaria, elétrica, acabamento. Cada etapa com valor, prazo e status próprios. Cliente aprova o que quiser, na ordem que quiser.",
      },
      {
        icon: Hammer,
        title: "Empreita e diária no mesmo painel",
        body:
          "Mestre de obra contratado por empreita? Servente por diária? Sistema separa custo de mão de obra por tipo de contratação e mostra margem real.",
      },
      {
        icon: Camera,
        title: "Evolução fotográfica da obra",
        body:
          "Equipe fotografa cada etapa, cliente recebe relatório visual semanal. Dispensa visita do dono pra ver como está indo.",
      },
      {
        icon: Users,
        title: "Equipes por especialidade",
        body:
          "Pedreiro, eletricista, encanador, pintor. Atribui a etapa ao especialista certo. Sem retrabalho de chamar errado.",
      },
    ],
  },
  ia: {
    eyebrow: "IA contextual · beta temporário",
    headline: "A IA entende obra.",
    intro:
      "Assistente configurado pra o vocabulário de reforma e construção. Sem termos genéricos de manutenção industrial.",
    highlights: [
      "Vocabulário de obra — 'contrapiso', 'reboco', 'gesso acartonado', 'instalação hidráulica', 'acabamento fino'.",
      "Polish de relatório de visita — mestre escreve 'fizemos a parte elétrica', IA devolve descrição técnica pro cliente.",
      "Orçamento estruturado — IA sugere itens típicos por etapa pra você não esquecer nada na hora de cotar.",
    ],
  },
  closing: {
    headline: "Sua obra ainda mora no WhatsApp do mestre?",
    body:
      "14 dias grátis. Sem cartão. A IA entende reforma e construção — você só cadastra suas obras em andamento.",
    ctaLabel: "Criar minha conta",
  },
  metadata: {
    title: "FMS para empresas de reforma e construção",
    description:
      "Gestão de reformas e obras: orçamento por etapa, controle de empreita, fotos de evolução, relatórios de visita técnica e IA que entende vocabulário de obra.",
  },
};
