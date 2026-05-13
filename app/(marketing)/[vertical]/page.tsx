// Landing dinâmica por vertical — renderiza a partir de
// lib/marketing/verticals/{id}.ts. Pra "graduar" um vertical pra
// página própria com seções extras, crie app/(marketing)/{id}/page.tsx
// — Next.js prioriza segmento estático sobre dinâmico automaticamente.

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  getAllVerticalIds,
  getVertical,
  type VerticalMarketing,
} from "@/lib/marketing/verticals";

type Props = { params: { vertical: string } };

export function generateStaticParams() {
  return getAllVerticalIds().map((vertical) => ({ vertical }));
}

export function generateMetadata({ params }: Props): Metadata {
  const config = getVertical(params.vertical);
  if (!config) return {};
  return {
    title: config.metadata.title,
    description: config.metadata.description,
  };
}

export default function VerticalLandingPage({ params }: Props) {
  const config = getVertical(params.vertical);
  if (!config) notFound();
  return <VerticalLanding config={config} />;
}

function VerticalLanding({ config }: { config: VerticalMarketing }) {
  // typedRoutes não aceita template-string; UrlObject preserva tipagem.
  const signupHref = {
    pathname: "/criar-conta" as const,
    query: { vertical: config.id },
  };
  return (
    <>
      <section className="container-wide pt-24 pb-12">
        <span className="mono">{config.hero.eyebrow}</span>
        <h1 className="text-5xl lg:text-6xl font-medium mt-3 max-w-4xl tracking-tight">
          {config.hero.headline}
        </h1>
        <p className="text-xl text-ink-500 mt-6 max-w-2xl">
          {config.hero.subhead}
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href={signupHref}
            className="inline-flex items-center gap-2 bg-ink-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-ink-800 transition-colors"
          >
            {config.hero.primaryCtaLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
          {config.hero.secondaryCta && (
            <Link
              href={config.hero.secondaryCta.href}
              className="inline-flex items-center gap-2 border border-ink-200 px-6 py-3 rounded-lg font-medium hover:bg-ink-50 transition-colors"
            >
              {config.hero.secondaryCta.label}
            </Link>
          )}
        </div>
      </section>

      <section className="container-wide py-16 border-t">
        <span className="mono">{config.features.eyebrow}</span>
        <h2 className="text-4xl font-medium mt-2">
          {config.features.headline}
        </h2>
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {config.features.items.map(({ icon: Icon, title, body }) => (
            <div key={title} className="border rounded-xl p-7">
              <Icon className="w-6 h-6 text-blue-600" />
              <div className="font-medium mt-4 text-lg">{title}</div>
              <p className="text-ink-500 mt-2">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-wide py-16 border-t">
        <span className="mono">{config.ia.eyebrow}</span>
        <h2 className="text-4xl font-medium mt-2 max-w-3xl">
          {config.ia.headline}
        </h2>
        <p className="text-ink-500 mt-3 max-w-2xl">{config.ia.intro}</p>
        <ul className="mt-8 space-y-3 max-w-2xl">
          {config.ia.highlights.map((h) => (
            <li key={h} className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-ink-700">{h}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-wide py-20 border-t">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-medium tracking-tight">
            {config.closing.headline}
          </h2>
          <p className="text-ink-500 mt-4">{config.closing.body}</p>
          <Link
            href={signupHref}
            className="inline-flex items-center gap-2 bg-ink-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-ink-800 transition-colors mt-6"
          >
            {config.closing.ctaLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
