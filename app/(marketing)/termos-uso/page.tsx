import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso — FMS",
  description:
    "Termos de uso do FMS (Field Management System) — condições de utilização da plataforma SaaS.",
};

const TERMS_VERSION = "2026-05-08";

export default function TermosUso() {
  return (
    <article className="container-wide py-20 max-w-3xl">
      <div className="mb-12">
        <span className="mono">Legal</span>
        <h1 className="text-5xl font-medium mt-3">Termos de Uso</h1>
        <p className="text-ink-700 mt-4 text-sm">Versão {TERMS_VERSION}</p>
      </div>

      <Section title="1. Aceitação">
        <p>
          Estes Termos regem o uso do FMS (Field Management System), software
          em modelo SaaS oferecido por <strong>[SUA RAZÃO SOCIAL LTDA]</strong>,
          CNPJ <strong>[SEU CNPJ]</strong>. Ao criar uma conta, marcar a opção
          "Li e concordo" no cadastro ou utilizar a plataforma, você declara
          ter lido, compreendido e aceitado integralmente estes Termos e a{" "}
          <a href="/politica-privacidade" className="underline">
            Política de Privacidade
          </a>
          .
        </p>
      </Section>

      <Section title="2. Definições">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Plataforma:</strong> aplicativo web, mobile e APIs
            disponibilizadas sob a marca FMS.
          </li>
          <li>
            <strong>Cliente Contratante:</strong> pessoa jurídica que assina o
            serviço.
          </li>
          <li>
            <strong>Usuários internos:</strong> diretores, supervisores,
            administradores e técnicos cadastrados pela Cliente Contratante.
          </li>
          <li>
            <strong>Clientes finais:</strong> pessoas físicas ou jurídicas
            cadastradas pela Cliente Contratante na plataforma para gestão
            operacional.
          </li>
        </ul>
      </Section>

      <Section title="3. Cadastro e responsabilidades">
        <p>
          O cadastro requer dados verdadeiros e atualizados. A Cliente
          Contratante é responsável por:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Manter sigilo das credenciais de acesso</li>
          <li>Atos praticados em sua conta</li>
          <li>Cumprir a LGPD em relação aos dados de seus clientes finais</li>
          <li>Pagar pontualmente as mensalidades contratadas</li>
        </ul>
      </Section>

      <Section title="4. Plano e pagamento">
        <p>
          O FMS é cobrado via assinatura mensal recorrente, processada pelo
          parceiro Asaas IP S.A. (PIX, boleto ou cartão de crédito). Período
          de teste gratuito (trial) de 7 dias está disponível para novos
          cadastros, sem necessidade de cartão.
        </p>
        <p>
          Mensalidades em atraso por mais de 7 dias podem resultar em suspensão
          temporária do acesso. Cancelamento pode ser feito a qualquer momento
          pela tela de configurações da conta — você continua tendo acesso
          até o fim do ciclo de cobrança vigente.
        </p>
      </Section>

      <Section title="5. Uso aceitável">
        <p>É expressamente proibido:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Compartilhar credenciais com terceiros não autorizados</li>
          <li>Usar a plataforma para atividades ilegais, fraudulentas ou que violem direitos de terceiros</li>
          <li>Tentar acessar dados de outras Clientes Contratantes (multi-tenant)</li>
          <li>Realizar engenharia reversa, descompilar ou tentar burlar mecanismos de segurança</li>
          <li>Sobrecarregar intencionalmente a plataforma (DDoS, scraping massivo)</li>
          <li>
            Inserir conteúdo difamatório, racista, discriminatório ou que
            infrinja direitos autorais
          </li>
          <li>Utilizar IA do FMS para gerar conteúdo enganoso, fraudulento ou ilegal</li>
        </ul>
        <p>
          Violações podem resultar em suspensão imediata da conta sem
          reembolso, com possível comunicação a autoridades competentes.
        </p>
      </Section>

      <Section title="6. Propriedade intelectual">
        <p>
          O FMS, incluindo código-fonte, design, marca e todas as
          funcionalidades, é propriedade exclusiva de{" "}
          <strong>[SUA RAZÃO SOCIAL LTDA]</strong>. O uso da plataforma não
          transfere qualquer direito de propriedade intelectual à Cliente
          Contratante, exceto a licença limitada e revogável de uso conforme
          estes Termos.
        </p>
        <p>
          Os <strong>dados operacionais</strong> da Cliente Contratante
          (chamados, relatórios, orçamentos, clientes finais cadastrados)
          permanecem de propriedade da Cliente — o FMS apenas hospeda e
          processa em nome dela.
        </p>
      </Section>

      <Section title="7. Disponibilidade e SLA">
        <p>
          Buscamos disponibilidade de 99,5% mensal. Manutenções programadas
          serão comunicadas com 48h de antecedência sempre que possível.
          Indisponibilidades não programadas que excedam 8 horas consecutivas
          em um mês podem ser objeto de crédito proporcional na próxima
          fatura, mediante solicitação formal.
        </p>
      </Section>

      <Section title="8. Limitação de responsabilidade">
        <p>
          Na máxima extensão permitida por lei:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            O FMS é fornecido "como está", sem garantias implícitas de
            adequação a fim específico além das funcionalidades descritas.
          </li>
          <li>
            Não nos responsabilizamos por lucros cessantes, perda de dados
            ou danos indiretos decorrentes de uso ou incapacidade de uso.
          </li>
          <li>
            A responsabilidade total agregada limita-se ao valor pago pela
            Cliente nos últimos 12 meses.
          </li>
          <li>
            Respostas geradas por funcionalidades de IA têm caráter
            consultivo e não substituem o julgamento humano. A Cliente
            Contratante é responsável por validar antes de tomar decisões
            operacionais.
          </li>
        </ul>
      </Section>

      <Section title="9. Cancelamento e rescisão">
        <p>
          A Cliente Contratante pode cancelar a qualquer momento pela tela
          "Configurações da conta". Após confirmação, o acesso continua
          ativo até o fim do ciclo vigente, e os dados ficam sujeitos ao
          procedimento de exclusão descrito na Política de Privacidade.
        </p>
        <p>
          Podemos rescindir o serviço unilateralmente em caso de violação
          grave destes Termos, fraude ou não pagamento por mais de 30 dias.
        </p>
      </Section>

      <Section title="10. Alterações dos Termos">
        <p>
          Reservamo-nos o direito de atualizar estes Termos. Mudanças
          materiais serão notificadas por email e via banner no app, com
          prazo mínimo de 30 dias para a Cliente revisar antes da entrada
          em vigor. O uso continuado após esse prazo equivale a aceite.
        </p>
      </Section>

      <Section title="11. Foro">
        <p>
          Aplica-se a legislação brasileira. Fica eleito o foro da Comarca
          de <strong>[SUA COMARCA]</strong>, Estado <strong>[SEU ESTADO]</strong>,
          para dirimir qualquer controvérsia, com renúncia de qualquer outro
          por mais privilegiado que seja.
        </p>
      </Section>

      <Section title="12. Contato">
        <p>
          Dúvidas sobre estes Termos:{" "}
          <a className="underline" href="mailto:atendimento.solucleanrj@gmail.com">
            atendimento.solucleanrj@gmail.com
          </a>
        </p>
      </Section>

      <p className="text-sm text-ink-500 mt-12 pt-6 border-t">
        Última atualização: {TERMS_VERSION}
      </p>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-medium mb-4">{title}</h2>
      <div className="text-ink-700 space-y-3 leading-relaxed">{children}</div>
    </section>
  );
}
