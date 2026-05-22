"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

type Vertical = "rental" | "facilities";
type Compare = "stack" | "eloca";

// Tabela simplificada pra cálculo. Baseada nos PDFs Pricing 2026 +
// benchmarks de mercado pesquisados (Auvo, Conta Azul, Eloca site).
const FMS_TIERS: Array<{
  name: string;
  limitRental: number;
  limitFacilities: number;
  monthly: number;
  setup: number;
}> = [
  { name: "Growth", limitRental: 250, limitFacilities: 800, monthly: 1890, setup: 18000 },
  { name: "Business", limitRental: 800, limitFacilities: 2500, monthly: 4890, setup: 45000 },
  { name: "Pro", limitRental: 2000, limitFacilities: 7000, monthly: 11900, setup: 110000 },
  { name: "Enterprise", limitRental: 5000, limitFacilities: 15000, monthly: 30000, setup: 200000 },
];

const ELOCA_TIERS: Array<{
  limitRental: number;
  limitFacilities: number;
  monthly: number;
  setup: number;
}> = [
  // Estimativas baseadas em proposta real Diego/Eloca pra SoluClean
  // (R$ 5.480/mês Opção Barreira Zero, R$ 24k setup tradicional)
  { limitRental: 200, limitFacilities: 600, monthly: 3138, setup: 24000 },
  { limitRental: 800, limitFacilities: 2000, monthly: 7500, setup: 48000 },
  { limitRental: 2000, limitFacilities: 5000, monthly: 16000, setup: 90000 },
  { limitRental: 9999, limitFacilities: 99999, monthly: 35000, setup: 180000 },
];

function pickFmsTier(vertical: Vertical, size: number) {
  const limitKey = vertical === "rental" ? "limitRental" : "limitFacilities";
  return FMS_TIERS.find((t) => size <= t[limitKey]) ?? FMS_TIERS[FMS_TIERS.length - 1];
}

function pickElocaTier(vertical: Vertical, size: number) {
  const limitKey = vertical === "rental" ? "limitRental" : "limitFacilities";
  return (
    ELOCA_TIERS.find((t) => size <= t[limitKey]) ??
    ELOCA_TIERS[ELOCA_TIERS.length - 1]
  );
}

function estimateStackCost(vertical: Vertical, size: number) {
  // Stack típico (Conta Azul Pro + Auvo + Focus NFe avulso + Excel)
  // baseado no porte da operação
  if (size <= 50) {
    return { monthly: 350, setup: 0, description: "Excel + Conta Azul Básico + Auvo Free" };
  }
  if (size <= 200) {
    return {
      monthly: vertical === "rental" ? 1200 : 2200,
      setup: 0,
      description:
        vertical === "rental"
          ? "Conta Azul Pro + Auvo Premium (5 usuários) + Focus NFe + Excel + ferramenta cobrança"
          : "Pontomais + Auvo + Bling + Focus NFe + folha terceirizada",
    };
  }
  if (size <= 800) {
    return {
      monthly: vertical === "rental" ? 4500 : 6500,
      setup: 0,
      description:
        vertical === "rental"
          ? "Conta Azul + Auvo (15 usuários) + Tiny estoque + Focus NFe + Asaas"
          : "Pontomais + Auvo + Conta Azul + sistema ronda dedicado",
    };
  }
  if (size <= 2500) {
    return {
      monthly: vertical === "rental" ? 10000 : 18000,
      setup: 0,
      description:
        vertical === "rental"
          ? "TOTVS módulos + Auvo + ferramentas avulsas"
          : "Senior / TOTVS módulos + apps paralelos",
    };
  }
  return {
    monthly: vertical === "rental" ? 25000 : 45000,
    setup: 0,
    description:
      vertical === "rental"
        ? "SAP / TOTVS + ERPs paralelos"
        : "SAP HR + módulos facilities customizados",
  };
}

function formatBRL(n: number): string {
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export default function EconomyCalculator() {
  const [vertical, setVertical] = useState<Vertical>("rental");
  const [size, setSize] = useState(80);
  const [compare, setCompare] = useState<Compare>("stack");

  const fmsTier = useMemo(() => pickFmsTier(vertical, size), [vertical, size]);
  const competitor = useMemo(() => {
    if (compare === "eloca") {
      const t = pickElocaTier(vertical, size);
      return {
        name: "Eloca",
        monthly: t.monthly,
        setup: t.setup,
        description: "Eloca Opção Barreira Zero (R$ 5.480 modelo pra 200 equip) escalado",
      };
    }
    const s = estimateStackCost(vertical, size);
    return {
      name: "Stack atual (Conta Azul + Auvo + ...)",
      monthly: s.monthly,
      setup: s.setup,
      description: s.description,
    };
  }, [compare, vertical, size]);

  const fmsYear1 = fmsTier.monthly * 12 + fmsTier.setup;
  const competitorYear1 = competitor.monthly * 12 + competitor.setup;
  const diffYear1 = competitorYear1 - fmsYear1;
  const fmsYear2 = fmsTier.monthly * 12;
  const competitorYear2 = competitor.monthly * 12;
  const diffYear2 = competitorYear2 - fmsYear2;

  return (
    <div className="grid lg:grid-cols-[1fr_2fr] gap-10">
      {/* CONTROLES */}
      <div className="space-y-6">
        <div>
          <label className="mono mb-2 block">Vertical</label>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["rental", "Locação (Rental)"],
                ["facilities", "Facilities"],
              ] as const
            ).map(([id, label]) => {
              const selected = vertical === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setVertical(id)}
                  className={`text-sm px-3 py-2.5 rounded-md border transition-colors ${
                    selected
                      ? "border-navy-900 bg-navy-900 text-white"
                      : "border-ink-200 hover:border-ink-400"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mono mb-2 block">
            Tamanho da operação ·{" "}
            {vertical === "rental" ? "equipamentos" : "colaboradores"}
          </label>
          <input
            type="number"
            min={10}
            max={20000}
            step={10}
            value={size}
            onChange={(e) => setSize(Math.max(10, Number(e.target.value) || 0))}
            className="w-full border rounded-md px-4 py-3 text-2xl font-medium"
          />
          <input
            type="range"
            min={20}
            max={vertical === "rental" ? 5000 : 15000}
            step={20}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full mt-3 accent-navy-900"
          />
          <div className="flex justify-between text-xs text-ink-500 mt-1">
            <span>20</span>
            <span>{vertical === "rental" ? "5.000" : "15.000"}</span>
          </div>
        </div>

        <div>
          <label className="mono mb-2 block">Comparar com</label>
          <div className="space-y-2">
            {(
              [
                ["stack", "Stack atual (Conta Azul + Auvo + planilha)"],
                ["eloca", "Eloca"],
              ] as const
            ).map(([id, label]) => {
              const selected = compare === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setCompare(id)}
                  className={`block w-full text-left text-sm px-3 py-2.5 rounded-md border transition-colors ${
                    selected
                      ? "border-navy-900 bg-navy-50"
                      : "border-ink-200 hover:border-ink-400"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RESULTADOS */}
      <div className="space-y-6">
        {/* CARDS LADO A LADO */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border rounded-xl p-6 border-ink-200">
            <div className="mono text-ink-500">Seu cenário atual</div>
            <div className="font-medium text-lg mt-1">{competitor.name}</div>
            <p className="text-xs text-ink-500 mt-2 leading-relaxed">
              {competitor.description}
            </p>
            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Mensal</span>
                <span className="font-medium">{formatBRL(competitor.monthly)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Setup</span>
                <span className="font-medium">
                  {competitor.setup === 0 ? "—" : formatBRL(competitor.setup)}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="text-ink-500">TCV ano 1</span>
                <span className="font-medium">{formatBRL(competitorYear1)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">TCV ano 2</span>
                <span className="font-medium">{formatBRL(competitorYear2)}</span>
              </div>
            </div>
          </div>

          <div className="border-2 border-navy-900 rounded-xl p-6 bg-navy-900 text-white">
            <div className="mono text-white/60">FMS recomendado</div>
            <div className="font-medium text-lg mt-1">{fmsTier.name}</div>
            <p className="text-xs text-white/60 mt-2 leading-relaxed">
              Até {vertical === "rental" ? fmsTier.limitRental + " equipamentos" : fmsTier.limitFacilities + " colaboradores"}{" "}
              · setup obrigatório · trial 14 dias sem cartão
            </p>
            <div className="border-t border-white/20 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Mensal</span>
                <span className="font-medium">{formatBRL(fmsTier.monthly)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Setup</span>
                <span className="font-medium">{formatBRL(fmsTier.setup)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-white/20">
                <span className="text-white/60">TCV ano 1</span>
                <span className="font-medium">{formatBRL(fmsYear1)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">TCV ano 2</span>
                <span className="font-medium">{formatBRL(fmsYear2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* DELTA */}
        <div
          className={`rounded-xl p-6 ${
            diffYear1 > 0
              ? "bg-success/10 border border-success/30"
              : "bg-warning/10 border border-warning/30"
          }`}
        >
          <div className="flex items-start gap-4">
            {diffYear1 > 0 ? (
              <TrendingDown className="w-8 h-8 text-success shrink-0 mt-1" />
            ) : (
              <TrendingUp className="w-8 h-8 text-warning shrink-0 mt-1" />
            )}
            <div className="flex-1">
              <div className="mono text-ink-500">
                {diffYear1 > 0 ? "Você economiza com FMS" : "FMS sai mais caro nesse cenário"}
              </div>
              <div className="text-4xl font-medium mt-2">
                {diffYear1 > 0 ? "+" : ""}
                {formatBRL(diffYear1)}
                <span className="text-base text-ink-500 font-normal ml-2">no ano 1</span>
              </div>
              <div className="text-sm text-ink-500 mt-1">
                {diffYear2 > 0 ? "+" : ""}
                {formatBRL(diffYear2)} no ano 2 (sem setup)
              </div>
              {diffYear1 < 0 && (
                <p className="text-sm text-ink-700 mt-3 leading-relaxed">
                  No seu cenário, o FMS sai mais caro porque o tier recomendado tem
                  capacidade maior que sua operação atual. Considere
                  programa parceiro (operações &lt; 250 equip) ou aguarde
                  crescer pra Growth.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 bg-ink-900 text-white px-5 py-3 rounded-lg font-medium hover:bg-ink-800"
          >
            Agendar demo · Validar com seus números reais
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/comparacao"
            className="inline-flex items-center gap-2 border border-ink-200 px-5 py-3 rounded-lg font-medium hover:bg-ink-50"
          >
            Ver comparativo feature a feature
          </Link>
        </div>
      </div>
    </div>
  );
}
