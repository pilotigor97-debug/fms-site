// /faq — Perguntas frequentes consolidadas. Agrega dúvidas das guides
// Rental + Facilities + objeções comuns mapeadas no Step-by-Step de demo.

import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Perguntas frequentes",
  description:
    "FAQ do FMS: pricing, setup, trial, IA, LGPD, isolamento de dados, conflito de interesse com SoluClean. Respostas honestas, sem floreio.",
};

type Q = { q: string; a: React.ReactNode };

const SECTIONS: Array<{ title: string; questions: Q[] }> = [
  {
    title: "Pricing e contratação",
    questions: [
      {
        q: "Qual o preço?",
        a: (
          <>
            Começa em <strong>R$ 1.890/mês</strong> (Growth) + R$ 18.000 de
            setup obrigatório. Tiers maiores em{" "}
            <Link href="/planos" className="underline">/planos</Link>. Não
            atendemos abaixo de Growth via plano público — operações
            menores são por programa parceiro sob convite.
          </>
        ),
      },
      {
        q: "Por que setup obrigatório?",
        a: "O setup cobre kickoff, configuração, migração de dados (Conta Azul, Auvo, planilha ou ERP comum), treinamento e go-live monitorado. Sem essa fase, o cliente abandona em 30 dias. Cobramos pra garantir entrega — e oferecemos POC paga de R$ 5.000 que é abatida do setup se contratar.",
      },
      {
        q: "Tem trial gratuito?",
        a: "Sim — 14 dias sem cartão de crédito, com cota reduzida de NFS-e e funcionalidades operacionais completas. Disponível pra Growth e Business. Pro/Enterprise são vendidos via call direta (não auto-serviço).",
      },
      {
        q: "Posso cancelar a qualquer momento?",
        a: "Sim, contratos mensais sem fidelidade. Anuais prepagos: sem reembolso do período já pago, mas cancelamento garante não renovação. Bianuais: condições especiais no contrato.",
      },
      {
        q: "Qual o desconto pra pagamento anual?",
        a: (
          <>
            <strong>−15% pra anual prepago</strong>, <strong>−22% pra
            bianual prepago</strong>. Mensal é preço cheio. Detalhes em{" "}
            <Link href="/planos" className="underline">/planos</Link>.
          </>
        ),
      },
    ],
  },
  {
    title: "Migração e onboarding",
    questions: [
      {
        q: "Em quantos dias minha operação fica de pé?",
        a: "Setup padrão: 7 a 21 dias úteis pra Rental (depende do volume — até 200 equipamentos é rápido, 1000+ exige migração planejada). Facilities: 5 a 15 dias úteis (postos + colaboradores).",
      },
      {
        q: "Como funciona a migração de dados?",
        a: "Importação via planilha (formato fornecido) ou cadastro direto no painel. Cliente continua operando no sistema antigo durante a transição — sem ruptura. Migração inclusa no setup.",
      },
      {
        q: "Funciona offline?",
        a: "App de campo (técnico/encarregado) faz fila local quando perde conexão e sincroniza ao voltar online. Painel administrativo (supervisor/diretor) requer conexão pra dados em tempo real.",
      },
      {
        q: "Tem app nativo iOS?",
        a: "App Store planejado pra H2 2026. Hoje no iPhone instala como Web App (PWA) via Safari — ícone na tela de início, tela cheia, funciona offline. Android tem APK pra download.",
      },
    ],
  },
  {
    title: "Funcionalidades",
    questions: [
      {
        q: "Substitui Conta Azul?",
        a: (
          <>
            <strong>Não substitui ERP fiscal completo</strong> — não tem
            SPED, folha CLT, NF-e mercadoria, integração contábil
            avançada. Use Conta Azul pro fiscal e FMS pra operação +
            cobrança recorrente. FMS exporta dado fechado pro Conta Azul.{" "}
            <Link href="/comparacao" className="underline">Ver comparativo
            </Link>.
          </>
        ),
      },
      {
        q: "Substitui Auvo?",
        a: "Sim — cobre ~65% do escopo Auvo (OS, check-in/out, foto, assinatura, relatório). FMS é vertical pra locação/facilities (amarra OS ao equipamento), enquanto Auvo é campo genérico. Não tem roteirização inteligente com Google Maps API integrado (no roadmap).",
      },
      {
        q: "A IA está funcionando?",
        a: "IA contextual (polish de relatório, busca em manuais, chat com vocabulário da vertical) está em beta temporário — atualmente desligada pra reduzir custo enquanto refinamos modelo. Plano de retorno: H2 2026. Recursos operacionais (equipamento, contratos, OS, cobrança, portal cliente) seguem 100% ativos.",
      },
      {
        q: "Quais integrações estão prontas?",
        a: "Asaas (cobrança recorrente), Focus NFe (NFS-e), Firebase (auth + storage). Conta Azul, Omie, Bling: roadmap. Integração ERP custom (SAP, TOTVS): plano Enterprise via projeto.",
      },
      {
        q: "Multi-CNPJ funciona?",
        a: "Sim — Sprint 5 entregou. Diretor alterna entre empresas no seletor do header. Cada colaborador é vinculado a um CNPJ primário e pode ter acesso a outros via campo companyIds. Limite Firestore: 30 CNPJs ativos por usuário.",
      },
    ],
  },
  {
    title: "Segurança e LGPD",
    questions: [
      {
        q: "Como vocês garantem que minha SoluClean concorrente não vê meus dados?",
        a: (
          <>
            Isolamento técnico em 3 camadas independentes (Firestore rules
            + filtros por companyId + asserts em Cloud Functions). Mesmo
            se uma camada falhar por bug, as outras duas impedem
            cross-tenant. Documentação técnica completa em{" "}
            <Link href="/seguranca" className="underline">/seguranca</Link>{" "}
            + Cláusula 6 dos{" "}
            <Link href="/termos-uso" className="underline">Termos</Link>{" "}
            com compromisso contratual + audit log público pro diretor.
          </>
        ),
      },
      {
        q: "Posso auditar quem acessou meus dados?",
        a: "Sim, sem custo. Diretor acessa no app: 'Acessos aos meus dados' — mostra audit log dos últimos 90 dias com data, ator, ação. Permite identificar acessos de operadora (manutenção/suporte) vs usuários internos. Também disponível auditoria técnica externa mediante NDA recíproco.",
      },
      {
        q: "Atende LGPD?",
        a: "Sim, nativo: export de portabilidade (Art. 18), soft-delete por 30 dias antes da exclusão definitiva, audit log universal, notificação de incidente em até 72h (Art. 48), DPO designado (fms.saas@gmail.com).",
      },
      {
        q: "Onde os dados ficam armazenados?",
        a: "Firebase / Google Cloud — região southamerica-east1 (São Paulo). Backups diários com retenção de 30 dias. Sem replicação fora do Brasil.",
      },
      {
        q: "Como reportar incidente de segurança?",
        a: (
          <>
            E-mail direto pra <a href="mailto:fms.saas@gmail.com" className="underline">fms.saas@gmail.com</a>{" "}
            (linha de assunto: "Incidente de Segurança FMS"). Compromisso
            de resposta em até 72h. Documentação completa em{" "}
            <Link href="/seguranca" className="underline">/seguranca</Link>.
          </>
        ),
      },
    ],
  },
  {
    title: "Cobrança e financeiro",
    questions: [
      {
        q: "Como funciona a cobrança recorrente?",
        a: "Integração nativa com Asaas (PIX, boleto, cartão). Cada contrato cadastrado gera ciclo de fatura automaticamente. NFS-e sai via Focus NFe vinculada à fatura. Inadimplência sobe alerta no painel.",
      },
      {
        q: "Vocês emitem nota fiscal?",
        a: "Emitimos NFS-e (serviço) via Focus NFe — driver pluggable, sem markup do FMS. Não emitimos NF-e mercadoria (CFOP/NCM/ICMS) — pra isso, use seu emissor fiscal atual ou Conta Azul. Pra cliente Enterprise: integração com emissor fiscal custom no projeto.",
      },
      {
        q: "Taxa de Asaas vem na mensalidade?",
        a: "Não. Taxas Asaas (PIX, boleto, cartão) são cobradas pelo Asaas direto do seu fluxo de pagamento, sem passar pelo FMS. O que você paga ao FMS é apenas a mensalidade contratada.",
      },
      {
        q: "Tem portal pro cliente final pagar / aprovar?",
        a: "Sim, portal público gratuito (sem licença extra). Cliente acessa via link público: aprova orçamento com assinatura digital, acompanha chamado em timeline, baixa segunda via de boleto, abre novo chamado sem ligar.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      {/* HERO */}
      <section className="container-wide pt-24 pb-12">
        <span className="mono">FAQ</span>
        <h1 className="text-5xl lg:text-6xl font-medium mt-3 max-w-4xl tracking-tight">
          Perguntas frequentes.
        </h1>
        <p className="text-xl text-ink-500 mt-6 max-w-2xl">
          Tudo que costuma ser perguntado antes de fechar contrato — pricing,
          migração, LGPD, isolamento de dados, IA e por que cobramos setup.
          Respostas honestas, incluindo onde NÃO somos a escolha certa.
        </p>
      </section>

      {/* SEÇÕES */}
      {SECTIONS.map((sec, sIdx) => (
        <section key={sec.title} className="container-wide py-12 border-t">
          <span className="mono text-blue-600">
            {String(sIdx + 1).padStart(2, "0")}
          </span>
          <h2 className="text-3xl font-medium mt-2">{sec.title}</h2>
          <div className="mt-8 space-y-6 max-w-3xl">
            {sec.questions.map(({ q, a }) => (
              <details key={q} className="border-b pb-5 group">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                  <span className="font-medium text-lg">{q}</span>
                  <span className="mono text-blue-600 shrink-0 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <div className="text-ink-700 mt-3 leading-relaxed">{a}</div>
              </details>
            ))}
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="container-wide py-20 border-t">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-medium tracking-tight">
            Sua dúvida não tá aqui?
          </h2>
          <p className="text-ink-500 mt-4">
            Chama no e-mail{" "}
            <a
              href="mailto:fms.saas@gmail.com"
              className="underline hover:text-ink-900"
            >
              fms.saas@gmail.com
            </a>{" "}
            ou agenda uma call de 30 min pra conversar direto.
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 bg-ink-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-ink-800 transition-colors mt-6"
          >
            Agendar conversa
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
