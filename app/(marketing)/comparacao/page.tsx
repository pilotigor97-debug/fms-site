// /comparacao — FMS vs Eloca vs Conta Azul+Auvo.
// Conteúdo derivado dos PDFs Pitch e Pricing 2026 + auditoria interna.

import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Check,
  X,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "FMS vs Eloca vs Conta Azul + Auvo",
  description:
    "Comparativo direto: FMS faz 95% do que Eloca cobra R$ 5.480/mês — pela metade. E substitui combo Conta Azul + Auvo pra operação de campo. Comparativo objetivo de features e preço.",
};

type Cell =
  | { kind: "yes"; note?: string }
  | { kind: "partial"; note?: string }
  | { kind: "no"; note?: string }
  | { kind: "text"; value: string };

type Row = {
  feature: string;
  fms: Cell;
  eloca: Cell;
  contaazulAuvo: Cell;
  group?: string;
};

const ROWS: Row[] = [
  // OPERAÇÃO DE CAMPO
  { group: "Operação de campo", feature: "App técnico (Hoje, OS, foto, assinatura)", fms: { kind: "yes" }, eloca: { kind: "yes" }, contaazulAuvo: { kind: "yes", note: "Auvo apenas" } },
  { feature: "Equipamento como entidade central (ficha viva)", fms: { kind: "yes" }, eloca: { kind: "yes" }, contaazulAuvo: { kind: "no", note: "Mora em planilha" } },
  { feature: "QR check-in/out + ronda (Facilities)", fms: { kind: "yes" }, eloca: { kind: "partial" }, contaazulAuvo: { kind: "partial", note: "Auvo só check-in genérico" } },
  { feature: "Funciona offline + sync automático", fms: { kind: "yes" }, eloca: { kind: "partial" }, contaazulAuvo: { kind: "partial" } },
  { feature: "Cross-platform mobile (Android + PWA iOS)", fms: { kind: "yes" }, eloca: { kind: "partial", note: "Web responsivo" }, contaazulAuvo: { kind: "yes" } },

  // CONTRATOS + COBRANÇA
  { group: "Contratos e cobrança", feature: "Contratos com PDF gerado", fms: { kind: "yes" }, eloca: { kind: "yes" }, contaazulAuvo: { kind: "no", note: "PDF avulso" } },
  { feature: "Cobrança recorrente (Asaas integrado)", fms: { kind: "yes" }, eloca: { kind: "yes" }, contaazulAuvo: { kind: "yes", note: "Conta Azul" } },
  { feature: "NFS-e automática (Focus NFe)", fms: { kind: "yes" }, eloca: { kind: "yes" }, contaazulAuvo: { kind: "partial", note: "Conta Azul faz, sem amarrar contrato" } },
  { feature: "Portal cliente público (aprovação + acompanhamento)", fms: { kind: "yes", note: "Sem licença extra" }, eloca: { kind: "yes" }, contaazulAuvo: { kind: "no" } },

  // FINANCEIRO
  { group: "Financeiro e análise", feature: "Contas a pagar", fms: { kind: "yes" }, eloca: { kind: "yes" }, contaazulAuvo: { kind: "yes", note: "Conta Azul" } },
  { feature: "Fluxo de caixa com projeção", fms: { kind: "yes" }, eloca: { kind: "yes" }, contaazulAuvo: { kind: "yes", note: "Conta Azul" } },
  { feature: "Margem por contrato (com burden CLT)", fms: { kind: "yes" }, eloca: { kind: "yes" }, contaazulAuvo: { kind: "no", note: "Não amarra a contrato" } },
  { feature: "P&L mensal automático", fms: { kind: "yes" }, eloca: { kind: "yes" }, contaazulAuvo: { kind: "partial", note: "Conta Azul fiscal completo" } },
  { feature: "DRE / SPED / NF-e mercadoria / Folha CLT", fms: { kind: "no", note: "Use Conta Azul" }, eloca: { kind: "partial" }, contaazulAuvo: { kind: "yes", note: "Conta Azul forte aqui" } },

  // DIFERENCIAIS
  { group: "Diferenciais técnicos", feature: "Multi-CNPJ nativo (holding)", fms: { kind: "yes" }, eloca: { kind: "partial" }, contaazulAuvo: { kind: "partial" } },
  { feature: "IA polish + busca em manuais", fms: { kind: "partial", note: "Beta temporário" }, eloca: { kind: "no" }, contaazulAuvo: { kind: "no" } },
  { feature: "Multi-tenant 3 camadas documentado publicamente", fms: { kind: "yes", note: "/seguranca" }, eloca: { kind: "no" }, contaazulAuvo: { kind: "no" } },
  { feature: "Cláusula NDA conflito de interesse declarada", fms: { kind: "yes", note: "Cláusula 6 dos Termos" }, eloca: { kind: "no" }, contaazulAuvo: { kind: "no" } },
  { feature: "Audit log público pro diretor (90 dias)", fms: { kind: "yes" }, eloca: { kind: "no" }, contaazulAuvo: { kind: "no" } },
  { feature: "LGPD nativo (export + soft-delete 30d)", fms: { kind: "yes" }, eloca: { kind: "partial" }, contaazulAuvo: { kind: "partial" } },

  // CRM / VENDAS
  { group: "Vendas e marketing", feature: "CRM / Funil de vendas", fms: { kind: "no", note: "Fora do escopo" }, eloca: { kind: "yes" }, contaazulAuvo: { kind: "partial" } },
  { feature: "E-commerce catálogo público", fms: { kind: "no", note: "Fora do escopo" }, eloca: { kind: "yes" }, contaazulAuvo: { kind: "no" } },
  { feature: "Assinatura digital validade jurídica", fms: { kind: "no", note: "PDF + assinatura física" }, eloca: { kind: "yes" }, contaazulAuvo: { kind: "no" } },
  { feature: "Reconhecimento facial anti-fraude", fms: { kind: "no", note: "Overkill p/ tier médio" }, eloca: { kind: "yes" }, contaazulAuvo: { kind: "no" } },
];

function CellIcon({ cell }: { cell: Cell }) {
  if (cell.kind === "yes") {
    return (
      <div className="flex flex-col items-center gap-1">
        <Check className="w-5 h-5 text-success" />
        {cell.note && <span className="text-[10px] text-ink-500">{cell.note}</span>}
      </div>
    );
  }
  if (cell.kind === "partial") {
    return (
      <div className="flex flex-col items-center gap-1">
        <AlertCircle className="w-5 h-5 text-warning" />
        {cell.note && <span className="text-[10px] text-ink-500">{cell.note}</span>}
      </div>
    );
  }
  if (cell.kind === "no") {
    return (
      <div className="flex flex-col items-center gap-1">
        <X className="w-5 h-5 text-ink-300" />
        {cell.note && <span className="text-[10px] text-ink-500">{cell.note}</span>}
      </div>
    );
  }
  return <span className="text-sm text-ink-700">{cell.value}</span>;
}

export default function ComparacaoPage() {
  return (
    <>
      {/* HERO */}
      <section className="container-wide pt-24 pb-12">
        <span className="mono">Comparativo objetivo</span>
        <h1 className="text-5xl lg:text-6xl font-medium mt-3 max-w-4xl tracking-tight">
          FMS vs Eloca vs Conta Azul + Auvo.
        </h1>
        <p className="text-xl text-ink-500 mt-6 max-w-2xl">
          Comparativo direto, sem floreio. Onde o FMS ganha, onde empata, e
          onde escolhemos não competir (CRM, e-commerce, reconhecimento
          facial). Dados puxados da auditoria técnica interna + sites
          oficiais.
        </p>
      </section>

      {/* PRICING TLDR */}
      <section className="container-wide py-12 border-t">
        <span className="mono">TL;DR de preço</span>
        <h2 className="text-3xl font-medium mt-2">
          Pra locadora média (200-800 equipamentos), ano 1:
        </h2>
        <div className="grid md:grid-cols-3 gap-5 mt-8">
          <div className="border rounded-xl p-7">
            <div className="font-medium text-lg">FMS Growth</div>
            <div className="text-3xl font-medium mt-3 text-success">R$ 40.680</div>
            <p className="text-sm text-ink-500 mt-2">
              R$ 1.890/mês × 12 + R$ 18.000 setup
            </p>
            <p className="text-xs text-ink-700 mt-4">
              Cobre 95% do que Eloca cobre, com IA contextual (beta) +
              transparência radical sobre dados.
            </p>
          </div>
          <div className="border rounded-xl p-7">
            <div className="font-medium text-lg">Eloca</div>
            <div className="text-3xl font-medium mt-3">R$ 65.760</div>
            <p className="text-sm text-ink-500 mt-2">
              R$ 5.480/mês × 12 (Opção Barreira Zero, com setup diluído)
            </p>
            <p className="text-xs text-ink-700 mt-4">
              Maduro no setor, time comercial estruturado. Sem cláusula
              conflito de interesse, sem audit log público pro cliente.
            </p>
          </div>
          <div className="border rounded-xl p-7">
            <div className="font-medium text-lg">Conta Azul + Auvo (combo)</div>
            <div className="text-3xl font-medium mt-3">R$ 14.400 – 21.600</div>
            <p className="text-sm text-ink-500 mt-2">
              R$ 1.200–1.800/mês juntos, sem setup
            </p>
            <p className="text-xs text-ink-700 mt-4">
              Mais barato no papel — mas é combo desintegrado. Equipamento
              não tem ficha. Cliente final não tem portal. Margem por
              contrato impossível.
            </p>
          </div>
        </div>

        <p className="text-sm text-ink-500 mt-6">
          <strong>FMS pela metade do Eloca</strong>. <strong>Investimento
          inicial menor (R$ 18k vs R$ 24k)</strong>. Mesma cobertura
          operacional para tier médio.
        </p>
      </section>

      {/* TABELA COMPARATIVA */}
      <section className="container-wide py-16 border-t">
        <span className="mono">Comparativo feature a feature</span>
        <h2 className="text-3xl font-medium mt-2">Onde cada um ganha.</h2>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-ink-900">
                <th className="text-left py-3 px-4 w-[40%]">Recurso</th>
                <th className="text-center py-3 px-4 bg-blue-50 text-blue-900 font-medium">
                  FMS
                </th>
                <th className="text-center py-3 px-4">Eloca</th>
                <th className="text-center py-3 px-4">
                  Conta Azul + Auvo
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => {
                const prevGroup = i > 0 ? ROWS[i - 1].group : undefined;
                const showGroup = row.group && row.group !== prevGroup;
                return (
                  <>
                    {showGroup && (
                      <tr key={`g-${row.group}`}>
                        <td colSpan={4} className="pt-6 pb-2">
                          <span className="mono text-blue-600">{row.group}</span>
                        </td>
                      </tr>
                    )}
                    <tr key={row.feature} className="border-b">
                      <td className="py-3 px-4 text-ink-700">{row.feature}</td>
                      <td className="py-3 px-4 text-center bg-blue-50/40">
                        <CellIcon cell={row.fms} />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <CellIcon cell={row.eloca} />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <CellIcon cell={row.contaazulAuvo} />
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex flex-wrap gap-6 text-sm text-ink-500">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-success" /> Tem nativamente
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-warning" /> Parcial /
            terceirizado
          </div>
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-ink-300" /> Não tem
          </div>
        </div>
      </section>

      {/* HONESTIDADE */}
      <section className="container-wide py-16 border-t">
        <span className="mono">Honestidade dura</span>
        <h2 className="text-3xl font-medium mt-2 max-w-3xl">
          Onde NÃO somos a escolha certa.
        </h2>
        <div className="grid md:grid-cols-2 gap-6 mt-8 max-w-4xl">
          <div className="border rounded-xl p-6 border-warning/30">
            <div className="font-medium">Cliente Enterprise puro (Mills, Loctec)</div>
            <p className="text-ink-700 mt-2 text-sm leading-relaxed">
              Vai pedir SOC 2, ISO 27001, contrato de R$ 1M multa, lista de
              casos similares. FMS é dev solo — não temos compliance formal
              ainda. Eloca tem mais maturidade aqui.
            </p>
          </div>
          <div className="border rounded-xl p-6 border-warning/30">
            <div className="font-medium">Quem PRECISA de CRM + e-commerce</div>
            <p className="text-ink-700 mt-2 text-sm leading-relaxed">
              FMS não tem funil de vendas nem catálogo público. Se a venda
              do seu negócio depende de aprovação digital com validade
              jurídica + e-commerce, Eloca cobre. Pra nós, fora do escopo.
            </p>
          </div>
          <div className="border rounded-xl p-6 border-warning/30">
            <div className="font-medium">Quem só usa Conta Azul e tá feliz</div>
            <p className="text-ink-700 mt-2 text-sm leading-relaxed">
              Se sua operação cabe em planilha + Conta Azul + WhatsApp, não
              tem motivo pra adicionar mensalidade. Volte quando precisar
              de: técnico em campo com app, ficha por equipamento, portal
              cliente, margem por contrato.
            </p>
          </div>
          <div className="border rounded-xl p-6 border-warning/30">
            <div className="font-medium">Microempresa abaixo de 30 equip</div>
            <p className="text-ink-700 mt-2 text-sm leading-relaxed">
              Não temos plano público abaixo do Growth (R$ 1.890/mês).
              Solo/Starter atendemos via{" "}
              <Link href="/planos" className="underline">programa parceiro
              </Link>{" "}
              sob convite — ou recomendamos planilha + suporte mínimo.
            </p>
          </div>
        </div>
      </section>

      {/* DIFERENCIAL ÚNICO */}
      <section className="container-wide py-16 border-t">
        <span className="mono">O que ninguém mais tem</span>
        <h2 className="text-3xl font-medium mt-2 max-w-3xl">
          Transparência radical sobre seus dados.
        </h2>
        <p className="text-ink-700 mt-3 max-w-2xl leading-relaxed">
          FMS é o único SaaS do setor (locação / facilities) que:
        </p>
        <ul className="mt-6 space-y-3 max-w-2xl">
          <li className="flex gap-3">
            <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <span className="text-ink-700">
              <strong>Documenta publicamente</strong> a arquitetura
              multi-tenant em{" "}
              <Link href="/seguranca" className="underline">/seguranca</Link>
            </span>
          </li>
          <li className="flex gap-3">
            <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <span className="text-ink-700">
              <strong>Declara conflito de interesse</strong> (vínculo com
              SoluClean LTDA) na Cláusula 6 dos{" "}
              <Link href="/termos-uso" className="underline">Termos</Link> —
              sem maquiagem
            </span>
          </li>
          <li className="flex gap-3">
            <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <span className="text-ink-700">
              <strong>Dá audit log público</strong> ao diretor no próprio
              app ("Acessos aos meus dados", últimos 90 dias)
            </span>
          </li>
          <li className="flex gap-3">
            <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <span className="text-ink-700">
              <strong>Permite auditoria técnica externa</strong> mediante
              NDA recíproco — código de isolamento aberto a auditor da sua
              confiança
            </span>
          </li>
        </ul>
      </section>

      {/* CTA */}
      <section className="container-wide py-20 border-t">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-medium tracking-tight">
            Quer comparar com seu cenário real?
          </h2>
          <p className="text-ink-500 mt-4">
            Mande na call o que você usa hoje (Eloca, Conta Azul+Auvo,
            planilha) e a gente faz comparativo lado a lado — features que
            usa, custos consolidados, gaps.
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 bg-ink-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-ink-800 transition-colors mt-6"
          >
            Agendar comparativo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
