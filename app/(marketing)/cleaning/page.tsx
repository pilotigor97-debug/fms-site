// Landing page do vertical "cleaning" — empresas de limpeza
// residencial/comercial recorrente. CTA leva pra /criar-conta?vertical=cleaning,
// que sinaliza pro signup gravar settings.vertical='cleaning' na company.

import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle2, Camera, Repeat } from "lucide-react";

export const metadata = {
  title: "FMS para empresas de limpeza",
  description:
    "Field service desenhado para limpeza residencial e comercial. Agenda recorrente, checklists, fotos antes/depois, IA que fala o vocabulário da limpeza.",
};

const FEATURES = [
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
];

const IA_HIGHLIGHTS = [
  "Vocabulário de limpeza nativo — fala em 'limpeza profunda', 'pós-obra', 'faxina semanal', não em 'manutenção corretiva'.",
  "Polish de relatórios em segundos — equipe escreve 'limpei a casa toda', IA devolve relatório formal pro cliente.",
  "Resumos por período — 'quantos atendimentos completos esta semana?' em texto natural.",
];

export default function CleaningLandingPage() {
  return (
    <>
      <section className="container-wide pt-24 pb-12">
        <span className="mono">Para empresas de limpeza</span>
        <h1 className="text-5xl lg:text-6xl font-medium mt-3 max-w-4xl tracking-tight">
          Field service desenhado para quem limpa profissionalmente.
        </h1>
        <p className="text-xl text-ink-500 mt-6 max-w-2xl">
          Agenda recorrente, checklists, fotos antes/depois, IA que entende
          o vocabulário da limpeza. Sem adaptação genérica.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/criar-conta?vertical=cleaning"
            className="inline-flex items-center gap-2 bg-ink-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-ink-800 transition-colors"
          >
            Começar grátis (14 dias)
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/recursos"
            className="inline-flex items-center gap-2 border border-ink-200 px-6 py-3 rounded-lg font-medium hover:bg-ink-50 transition-colors"
          >
            Ver todos os recursos
          </Link>
        </div>
      </section>

      <section className="container-wide py-16 border-t">
        <span className="mono">O que muda para você</span>
        <h2 className="text-4xl font-medium mt-2">
          Vertical de limpeza, não sistema genérico.
        </h2>
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="border rounded-xl p-7">
              <Icon className="w-6 h-6 text-blue-600" />
              <div className="font-medium mt-4 text-lg">{title}</div>
              <p className="text-ink-500 mt-2">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-wide py-16 border-t">
        <span className="mono">IA contextual</span>
        <h2 className="text-4xl font-medium mt-2 max-w-3xl">
          A IA fala como sua equipe fala.
        </h2>
        <p className="text-ink-500 mt-3 max-w-2xl">
          O FMS configura automaticamente o assistente para o seu segmento.
          Nenhuma frase genérica de manutenção industrial — só o que faz sentido
          pra limpeza.
        </p>
        <ul className="mt-8 space-y-3 max-w-2xl">
          {IA_HIGHLIGHTS.map((h) => (
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
            Pronta para parar de adaptar planilha genérica?
          </h2>
          <p className="text-ink-500 mt-4">
            14 dias grátis. Sem cartão. Você cria a conta agora e a IA já entende
            que sua empresa é de limpeza.
          </p>
          <Link
            href="/criar-conta?vertical=cleaning"
            className="inline-flex items-center gap-2 bg-ink-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-ink-800 transition-colors mt-6"
          >
            Criar minha conta
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
