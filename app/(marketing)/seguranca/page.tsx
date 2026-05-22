// Página /seguranca — radical transparência sobre isolamento técnico e
// compromisso de não-uso comercial dos dados. Referenciada pela Seção 6
// dos Termos e Seção 14 da Política de Privacidade.

import Link from "next/link";
import type { Metadata } from "next";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileSearch,
  AlertTriangle,
  Mail,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Segurança e Isolamento de Dados — FMS",
  description:
    "Como o FMS garante isolamento técnico multi-tenant e compromisso de não-uso comercial dos dados — transparência radical pra due diligence antes da contratação.",
};

export default function SegurancaPage() {
  return (
    <>
      {/* HERO */}
      <section className="container-wide pt-24 pb-12">
        <span className="mono">Segurança e isolamento de dados</span>
        <h1 className="text-5xl lg:text-6xl font-medium mt-3 max-w-4xl tracking-tight">
          Seus dados nunca saem do FMS. Aqui está como provamos isso.
        </h1>
        <p className="text-xl text-ink-500 mt-6 max-w-2xl">
          Operamos com vínculo declarado à SoluClean LTDA (locadora de
          equipamentos). Pra eliminar qualquer dúvida sobre conflito de
          interesses, expomos publicamente nossa arquitetura técnica, audit
          trail e compromisso contratual.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/termos-uso"
            className="inline-flex items-center gap-2 border border-ink-200 px-5 py-2.5 rounded-lg font-medium hover:bg-ink-50 transition-colors text-sm"
          >
            Ver Cláusula 6 nos Termos
          </Link>
          <Link
            href="/politica-privacidade"
            className="inline-flex items-center gap-2 border border-ink-200 px-5 py-2.5 rounded-lg font-medium hover:bg-ink-50 transition-colors text-sm"
          >
            Ver Seção 14 na Privacidade
          </Link>
        </div>
      </section>

      {/* DIVULGAÇÃO DO CONFLITO */}
      <section className="container-wide py-16 border-t">
        <span className="mono">Divulgação obrigatória</span>
        <h2 className="text-4xl font-medium mt-2 max-w-3xl">
          Conflito de interesse — declarado.
        </h2>
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="border rounded-xl p-7 bg-ink-50">
            <AlertTriangle className="w-6 h-6 text-warning" />
            <div className="font-medium mt-4 text-lg">O que existe</div>
            <p className="text-ink-700 mt-2 leading-relaxed">
              A operadora do FMS possui vínculo familiar/societário com{" "}
              <strong>SoluClean LTDA</strong>, empresa atuante na vertical de
              locação de equipamentos de limpeza profissional. SoluClean é
              cliente do FMS (tenant zero) e também usuária do sistema.
            </p>
          </div>
          <div className="border rounded-xl p-7">
            <ShieldCheck className="w-6 h-6 text-success" />
            <div className="font-medium mt-4 text-lg">Como mitigamos</div>
            <p className="text-ink-700 mt-2 leading-relaxed">
              Isolamento técnico em <strong>três camadas independentes</strong>,
              audit log inviolável de todo acesso, e direito contratual de
              auditoria pelo cliente a qualquer momento — sem custo.
            </p>
          </div>
        </div>
      </section>

      {/* ARQUITETURA — 3 CAMADAS */}
      <section className="container-wide py-16 border-t">
        <span className="mono">Arquitetura técnica</span>
        <h2 className="text-4xl font-medium mt-2 max-w-3xl">
          Isolamento multi-tenant em 3 camadas.
        </h2>
        <p className="text-ink-500 mt-3 max-w-2xl">
          Cada camada é independente — se uma falha por bug, as outras duas
          ainda impedem cross-tenant access. <em>Defense in depth.</em>
        </p>

        <div className="mt-10 space-y-6">
          <div className="border rounded-xl p-7">
            <div className="flex items-center gap-3">
              <span className="mono text-blue-600">01</span>
              <Lock className="w-5 h-5 text-blue-600" />
              <div className="font-medium text-lg">
                Camada 1 — Firestore Security Rules
              </div>
            </div>
            <p className="text-ink-700 mt-3 leading-relaxed">
              Regras declarativas no banco de dados (<code className="text-sm bg-ink-50 px-1.5 py-0.5 rounded">firestore.rules</code>) que
              <strong> negam acesso cross-tenant na origem</strong>. Toda
              leitura/escrita é validada pelo Firebase antes mesmo de chegar
              ao código de aplicação.
            </p>
            <p className="text-sm text-ink-500 mt-3">
              Exemplo: <code>request.auth.token.companyId == resource.data.companyId</code>
            </p>
          </div>

          <div className="border rounded-xl p-7">
            <div className="flex items-center gap-3">
              <span className="mono text-blue-600">02</span>
              <Lock className="w-5 h-5 text-blue-600" />
              <div className="font-medium text-lg">
                Camada 2 — Filtros obrigatórios por <code>companyId</code>
              </div>
            </div>
            <p className="text-ink-700 mt-3 leading-relaxed">
              Toda query de leitura no código frontend/backend tem filtro
              <strong> obrigatório por <code>companyId</code> do usuário
              autenticado</strong>. Mesmo se uma rule for relaxada
              acidentalmente, a query nunca pediria dado de outro tenant.
            </p>
          </div>

          <div className="border rounded-xl p-7">
            <div className="flex items-center gap-3">
              <span className="mono text-blue-600">03</span>
              <Lock className="w-5 h-5 text-blue-600" />
              <div className="font-medium text-lg">
                Camada 3 — Asserts em Cloud Functions
              </div>
            </div>
            <p className="text-ink-700 mt-3 leading-relaxed">
              Toda Cloud Function de escrita roda{" "}
              <code className="text-sm bg-ink-50 px-1.5 py-0.5 rounded">assertCompanyId()</code>{" "}
              e{" "}
              <code className="text-sm bg-ink-50 px-1.5 py-0.5 rounded">assertOwnership()</code>{" "}
              no início, validando que o dado pertence ao mesmo tenant do
              usuário antes de qualquer mutação. Falha de assert =
              <strong> rejeição imediata + audit log</strong>.
            </p>
          </div>
        </div>

        <p className="text-ink-500 mt-6 text-sm">
          Documentação técnica completa disponível mediante NDA recíproco —
          envie pedido por e-mail (contato no rodapé desta página).
        </p>
      </section>

      {/* QUEM TEM ACESSO */}
      <section className="container-wide py-16 border-t">
        <span className="mono">Acesso humano</span>
        <h2 className="text-4xl font-medium mt-2 max-w-3xl">
          Quem pode tocar nos seus dados.
        </h2>

        <div className="mt-10 grid md:grid-cols-2 gap-4">
          <div className="border rounded-xl p-7">
            <Eye className="w-6 h-6 text-blue-600" />
            <div className="font-medium mt-4 text-lg">
              Operadora (1 pessoa)
            </div>
            <p className="text-ink-700 mt-2 leading-relaxed">
              Atualmente <strong>um único desenvolvedor responsável</strong>{" "}
              tem acesso técnico aos dados, exclusivamente para:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1 text-sm text-ink-700">
              <li>Manutenção, suporte e debug do sistema</li>
              <li>Migração de dados sob solicitação do cliente</li>
              <li>Investigação de incidentes de segurança</li>
            </ul>
            <p className="text-sm text-ink-500 mt-4">
              Todo acesso é registrado em <code>audit_logs</code>{" "}
              disponível à Cliente sob demanda.
            </p>
          </div>

          <div className="border rounded-xl p-7">
            <FileSearch className="w-6 h-6 text-blue-600" />
            <div className="font-medium mt-4 text-lg">
              SoluClean LTDA
            </div>
            <p className="text-ink-700 mt-2 leading-relaxed">
              <strong>Zero acesso</strong> aos dados de outros clientes do
              FMS. SoluClean opera o sistema como qualquer outro tenant —
              vê apenas os próprios dados (regras Firestore + filtros +
              asserts impedem qualquer cross-tenant).
            </p>
            <p className="text-sm text-ink-500 mt-4">
              Auditável pela Cliente Contratante mediante NDA recíproco.
            </p>
          </div>
        </div>
      </section>

      {/* DIREITO DE AUDITORIA */}
      <section className="container-wide py-16 border-t">
        <span className="mono">Direito contratual</span>
        <h2 className="text-4xl font-medium mt-2 max-w-3xl">
          Auditoria sob demanda. Sem custo.
        </h2>
        <p className="text-ink-500 mt-3 max-w-2xl">
          Você pode solicitar a qualquer tempo, sem custo e sem precisar
          justificar:
        </p>

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          <div className="border rounded-xl p-7">
            <div className="mono">A</div>
            <div className="font-medium mt-3 text-lg">
              Relatório de acessos
            </div>
            <p className="text-ink-500 mt-2 text-sm leading-relaxed">
              Lista completa de quem acessou seus dados nos últimos 90 dias —
              incluindo acessos da operadora pra fins de suporte.
            </p>
          </div>
          <div className="border rounded-xl p-7">
            <div className="mono">B</div>
            <div className="font-medium mt-3 text-lg">
              Auditoria técnica
            </div>
            <p className="text-ink-500 mt-2 text-sm leading-relaxed">
              Auditoria independente das regras de isolamento por terceiro
              de sua confiança, mediante NDA recíproco.
            </p>
          </div>
          <div className="border rounded-xl p-7">
            <div className="mono">C</div>
            <div className="font-medium mt-3 text-lg">
              Rescisão sem multa
            </div>
            <p className="text-ink-500 mt-2 text-sm leading-relaxed">
              Caso descumprimento seja comprovado, você tem direito de
              rescindir o contrato imediatamente sem multa e exigir
              indenização integral.
            </p>
          </div>
        </div>
      </section>

      {/* REPORTAR INCIDENTE */}
      <section className="container-wide py-16 border-t">
        <span className="mono">Reportar incidente</span>
        <h2 className="text-4xl font-medium mt-2 max-w-3xl">
          Viu algo errado? Avise direto.
        </h2>
        <p className="text-ink-500 mt-3 max-w-2xl">
          Vulnerabilidade técnica, suspeita de uso indevido de dados,
          comportamento estranho — qualquer coisa, fale com a operadora
          diretamente. Compromisso de resposta em até 72h (conforme Art. 48
          da LGPD).
        </p>

        <div className="mt-8 max-w-md">
          <Link
            href="mailto:fms.saas@gmail.com?subject=Incidente%20de%20Seguran%C3%A7a%20FMS"
            className="inline-flex items-center gap-3 bg-ink-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-ink-800 transition-colors"
          >
            <Mail className="w-4 h-4" />
            fms.saas@gmail.com
          </Link>
        </div>
      </section>

      {/* MEDIDAS TÉCNICAS GERAIS */}
      <section className="container-wide py-16 border-t">
        <span className="mono">Medidas técnicas</span>
        <h2 className="text-4xl font-medium mt-2 max-w-3xl">
          Padrões adicionais de segurança.
        </h2>
        <div className="mt-10 grid md:grid-cols-2 gap-4">
          {[
            {
              title: "HTTPS/TLS em todas as comunicações",
              body: "Nenhuma requisição trafega em texto claro. Certificados gerenciados pelo Firebase/Google.",
            },
            {
              title: "Hash seguro de senhas",
              body: "Bcrypt via Firebase Authentication. Senhas nunca armazenadas em texto.",
            },
            {
              title: "Audit log universal por entityType",
              body: "Toda escrita rastreável: quem, quando, o quê, de onde (IP + User-Agent).",
            },
            {
              title: "Backups diários automáticos",
              body: "Firestore export com retenção de 30 dias. Recuperação por point-in-time.",
            },
            {
              title: "Notificação de incidente em 72h",
              body: "Em caso de incidente que afete dados de Cliente, notificação à ANPD e à Cliente em até 72h.",
            },
            {
              title: "Soft-delete + portabilidade (LGPD Art. 18)",
              body: "Direito de export e eliminação pelo titular. Soft-delete por 30 dias antes da exclusão definitiva.",
            },
          ].map(({ title, body }) => (
            <div key={title} className="border rounded-xl p-7">
              <ShieldCheck className="w-5 h-5 text-success" />
              <div className="font-medium mt-3 text-lg">{title}</div>
              <p className="text-ink-500 mt-2 text-sm leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="container-wide py-20 border-t">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-medium tracking-tight">
            Quer fazer due diligence antes de contratar?
          </h2>
          <p className="text-ink-500 mt-4">
            Posso enviar documentação técnica do isolamento, snippets de
            regras anonimizadas, ou agendar call de 30 min com seu time
            jurídico/TI. Mediante NDA recíproco quando necessário.
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 bg-ink-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-ink-800 transition-colors mt-6"
          >
            Falar com a operadora
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
