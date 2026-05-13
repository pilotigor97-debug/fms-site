import type { Route } from "next";
import type { LucideIcon } from "lucide-react";

// IDs canônicos — espelham opspilot/assets/verticals.json.
export type VerticalId =
  | "rental"
  | "cleaning"
  | "hvac"
  | "remodeling"
  | "facilities"
  | "landscaping";

// Config dirige a renderização da landing /[vertical]/page.tsx.
// Strings vêm prontas — template não tem lógica de locale; cada
// vertical traz sua própria cópia no idioma certo.
export type VerticalMarketing = {
  id: VerticalId;
  hero: {
    eyebrow: string;
    headline: string;
    subhead: string;
    primaryCtaLabel: string;
    secondaryCta?: { label: string; href: Route };
  };
  features: {
    eyebrow: string;
    headline: string;
    items: ReadonlyArray<{
      icon: LucideIcon;
      title: string;
      body: string;
    }>;
  };
  ia: {
    eyebrow: string;
    headline: string;
    intro: string;
    highlights: ReadonlyArray<string>;
  };
  closing: {
    headline: string;
    body: string;
    ctaLabel: string;
  };
  metadata: {
    title: string;
    description: string;
  };
};
