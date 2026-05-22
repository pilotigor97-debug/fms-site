// /economia — calculadora simples de ROI. Cliente entra com 2 dados
// (vertical + tamanho), recebe estimativa comparada com stack atual.

import type { Metadata } from "next";
import EconomyCalculator from "./_calculator";

export const metadata: Metadata = {
  title: "Quanto você economiza com o FMS",
  description:
    "Calculadora ROI simples — diga o tamanho da operação e veja a economia mensal estimada vs stack atual (Conta Azul + Auvo + Excel + Focus NFe avulso) ou Eloca.",
};

export default function EconomyPage() {
  return (
    <>
      <section className="container-wide pt-24 pb-12">
        <span className="mono">Calculadora ROI · estimativa</span>
        <h1 className="text-5xl lg:text-6xl font-medium mt-3 max-w-4xl tracking-tight">
          Quanto você economiza com o FMS.
        </h1>
        <p className="text-xl text-ink-500 mt-6 max-w-2xl">
          Digite tamanho da operação e veja comparativo direto: stack atual
          (Conta Azul + Auvo + planilha + emissor NFS-e avulso) vs FMS, ou
          Eloca vs FMS. Estimativa baseada em benchmarks de mercado, não em
          chute.
        </p>
      </section>

      <section className="container-wide pb-20 border-t pt-12">
        <EconomyCalculator />
      </section>

      <section className="container-wide py-12 border-t">
        <div className="max-w-3xl text-sm text-ink-500 space-y-3">
          <p>
            <strong>Limitações da estimativa:</strong> usa valores de
            mercado típicos pra cada combinação (Conta Azul Pro: R$ 199–599
            dependendo do plano; Auvo Premium: R$ 49/usuário; Focus NFe
            avulso: R$ 0,80/nota). Tempo administrativo estimado em
            benchmark da Associação Brasileira de Locadoras (ABLA).
          </p>
          <p>
            <strong>Não inclui:</strong> custo de implementação, treinamento
            de equipe, migração de dados (FMS inclui no setup). Não
            considera ganhos indiretos (menos churn de cliente, mais
            renovação de contrato — impossível estimar sem dados reais
            seus).
          </p>
          <p>
            <strong>Pra calculadora precisa:</strong> agende uma call de 30
            min — analisamos sua planilha financeira e mostramos comparação
            com seus números reais.
          </p>
        </div>
      </section>
    </>
  );
}
