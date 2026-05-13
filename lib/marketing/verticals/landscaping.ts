import { Camera, CloudSun, Leaf, MapPin } from "lucide-react";
import type { VerticalMarketing } from "./types";

// EN — US market. Site nav still in PT-BR for now; flagged for future i18n.
export const landscaping: VerticalMarketing = {
  id: "landscaping",
  hero: {
    eyebrow: "For landscaping & lawn care companies",
    headline:
      "Recurring routes, weather-aware schedules, crews that know what's next.",
    subhead:
      "Weekly mowing, biweekly maintenance, seasonal cleanups, snow removal — all under one schedule. No more juggling spreadsheets between truck and office.",
    primaryCtaLabel: "Start free trial (14 days)",
    secondaryCta: { label: "See all features", href: "/recursos" },
  },
  features: {
    eyebrow: "What changes for you",
    headline: "Built for the route, not for an industrial workshop.",
    items: [
      {
        icon: Leaf,
        title: "Recurring service plans",
        body:
          "Weekly or biweekly mowing, monthly fertilization, seasonal cleanup. System auto-generates work orders and keeps the route balanced across the week.",
      },
      {
        icon: MapPin,
        title: "Route-aware dispatch",
        body:
          "Properties grouped by neighborhood, assigned to crews by proximity. Less drive time per stop, more billable hours per truck.",
      },
      {
        icon: CloudSun,
        title: "Weather-aware scheduling",
        body:
          "Rain on Tuesday? Crew sees the updated route Wednesday morning. No phone-tree call-arounds when a storm rolls in.",
      },
      {
        icon: Camera,
        title: "Before/after photos per visit",
        body:
          "Crew snaps the lawn before and after right in the app. Property managers get visual proof — no more disputes over whether a property was serviced.",
      },
    ],
  },
  ia: {
    eyebrow: "Contextual AI",
    headline: "AI that speaks lawn care.",
    intro:
      "Assistant tuned for landscaping operations — mowing, edging, mulching, snow removal — with access to property history and crew assignments.",
    highlights: [
      "Native lawn-care vocabulary — 'weekly cut', 'spring cleanup', 'mulch refresh', 'aeration', 'snow plow route'.",
      "Polish field reports in seconds — crew writes 'mowed and edged, cleaned the curb', AI returns a clean visit summary for the customer.",
      "Period summaries in plain English — 'how many properties did we service this week?' with the number and which ones.",
    ],
  },
  closing: {
    headline: "Still running your routes from a whiteboard?",
    body:
      "14-day free trial. No credit card. The AI is already tuned for lawn care — you just add your properties and crews.",
    ctaLabel: "Create my account",
  },
  metadata: {
    title: "FMS for landscaping & lawn care companies",
    description:
      "Field service for lawn care: recurring routes, weather-aware scheduling, before/after photos, AI tuned for lawn-care vocabulary.",
  },
};
