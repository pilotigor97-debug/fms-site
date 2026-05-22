import { Building2, ClipboardList, MapPin, Shield } from "lucide-react";
import type { VerticalMarketing } from "./types";

export const facilities: VerticalMarketing = {
  id: "facilities",
  hero: {
    eyebrow: "Para empresas de facilities",
    headline: "Portaria, limpeza e segurança no mesmo painel.",
    subhead:
      "Escala 24h/12h, livro de ocorrências digital, ronda registrada e contratos integrados. Pare de gerenciar três sistemas diferentes pro mesmo cliente.",
    primaryCtaLabel: "Começar grátis (14 dias)",
    secondaryCta: { label: "Ver todos os recursos", href: "/recursos" },
  },
  features: {
    eyebrow: "O que muda para você",
    headline: "Facilities integrado, não três planilhas.",
    items: [
      {
        icon: Shield,
        title: "Escala 24h ou 12h sem dor de cabeça",
        body:
          "Postos com turnos, folga e cobertura. Trocas registradas, faltas notificadas, fechamento mensal automático pra folha.",
      },
      {
        icon: ClipboardList,
        title: "Livro de ocorrências digital",
        body:
          "Porteiro registra ocorrência direto pelo app — com foto, hora, posto. Cliente acessa pelo portal sem ter que ligar pra empresa.",
      },
      {
        icon: MapPin,
        title: "Ronda registrada com QR code",
        body:
          "Vigilante bate ponto em cada checkpoint da ronda. Cliente vê em tempo real se a ronda foi feita — e onde.",
      },
      {
        icon: Building2,
        title: "Bundle integrado por cliente",
        body:
          "Condomínio que tem portaria + limpeza + segurança vira um contrato só. Fatura unificada, equipes coordenadas, gestor único.",
      },
    ],
  },
  ia: {
    eyebrow: "IA contextual · beta temporário",
    headline: "A IA entende facilities.",
    intro:
      "Vocabulário operacional do seu setor — postos, escalas, ocorrências, rondas — sem precisar adaptar prompts de outro segmento.",
    highlights: [
      "Vocabulário facilities — 'cobertura de posto', 'troca de turno', 'ronda noturna', 'ocorrência grau 2', 'livro de visitas'.",
      "Polish de ocorrência — porteiro escreve 'caminhão parado na entrada às 23h', IA estrutura relato formal pro cliente.",
      "Resumo de turno — 'o que aconteceu hoje no condomínio X?' com timeline das ocorrências em ordem.",
    ],
  },
  closing: {
    headline: "Sua operação ainda usa caderno na guarita?",
    body:
      "14 dias grátis. Sem cartão. A IA entende vocabulário de facilities — você só cadastra postos e contratos.",
    ctaLabel: "Criar minha conta",
  },
  metadata: {
    title: "FMS para empresas de facilities (portaria, limpeza, segurança)",
    description:
      "Sistema integrado de facilities: escala 24h/12h, livro de ocorrências digital, ronda registrada, contratos bundle e IA com vocabulário operacional do setor.",
  },
};
