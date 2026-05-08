import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — FMS",
  description:
    "Política de privacidade do FMS (Field Management System) — em conformidade com a LGPD (Lei 13.709/2018).",
};

const PRIVACY_VERSION = "2026-05-08";

export default function PoliticaPrivacidade() {
  return (
    <article className="container-wide py-20 max-w-3xl">
      <div className="mb-12">
        <span className="mono">Legal</span>
        <h1 className="text-5xl font-medium mt-3">Política de Privacidade</h1>
        <p className="text-ink-700 mt-4 text-sm">
          Versão {PRIVACY_VERSION} · Em conformidade com a Lei 13.709/2018 (LGPD).
        </p>
      </div>

      <Section title="1. Quem somos">
        <p>
          O FMS (Field Management System), doravante denominado simplesmente
          "FMS" ou "nós", é um software de gestão operacional para equipes de
          campo, oferecido como serviço (SaaS). É operado por{" "}
          <strong>[SUA RAZÃO SOCIAL LTDA]</strong>, inscrita no CNPJ sob{" "}
          <strong>[SEU CNPJ]</strong>, com sede em{" "}
          <strong>[SEU ENDEREÇO]</strong>, endereço eletrônico{" "}
          <a className="underline" href="mailto:atendimento.solucleanrj@gmail.com">
            atendimento.solucleanrj@gmail.com
          </a>
          .
        </p>
        <p>
          Esta política descreve como coletamos, usamos, armazenamos,
          compartilhamos e protegemos os dados pessoais de Titulares (clientes
          contratantes, usuários internos das empresas contratantes e clientes
          finais cadastrados pelas contratantes), conforme as exigências da
          LGPD.
        </p>
      </Section>

      <Section title="2. Papéis no tratamento de dados">
        <p>
          O FMS atua predominantemente como <strong>Operador</strong> de dados
          (Art. 5, VII LGPD) — tratando dados pessoais em nome das empresas
          contratantes (Controladoras), que decidem as finalidades e meios do
          tratamento sobre os dados de seus clientes finais.
        </p>
        <p>
          Para os dados dos próprios usuários da plataforma (administradores e
          técnicos das empresas contratantes), o FMS atua como{" "}
          <strong>Controlador</strong>.
        </p>
      </Section>

      <Section title="3. Dados que coletamos">
        <h3 className="font-medium mt-4 mb-2">3.1 De empresas contratantes</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Razão social, CNPJ e endereço comercial</li>
          <li>Email do diretor responsável e telefone de contato</li>
          <li>Dados financeiros para cobrança via parceiro de pagamento Asaas (Asaas IP S.A. — operador subcontratado)</li>
        </ul>

        <h3 className="font-medium mt-4 mb-2">
          3.2 De usuários internos (administradores, supervisores, diretores e técnicos)
        </h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Nome completo e email de acesso</li>
          <li>Foto de perfil (opcional)</li>
          <li>Senha (armazenada com hash seguro pelo Firebase Authentication)</li>
          <li>Localização GPS do dispositivo do técnico durante atendimentos em campo, com consentimento explícito (recurso F7 — auto-detecção de chegada)</li>
          <li>Logs de uso da plataforma para auditoria e segurança</li>
        </ul>

        <h3 className="font-medium mt-4 mb-2">3.3 De clientes finais (cadastrados pelas contratantes)</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Nome ou razão social, CNPJ/CPF e endereço</li>
          <li>Telefone e email de contato</li>
          <li>Equipamentos sob manutenção, histórico de chamados e relatórios técnicos</li>
          <li>Coordenadas GPS do endereço (opcional, para roteirização)</li>
        </ul>

        <p className="mt-4">
          O FMS NÃO coleta dados sensíveis de saúde, raça, religião,
          orientação política ou sexual.
        </p>
      </Section>

      <Section title="4. Finalidades do tratamento">
        <ul className="list-disc pl-6 space-y-1">
          <li>Prestação dos serviços contratados (gestão de chamados, ordens de serviço, relatórios e orçamentos)</li>
          <li>Faturamento e cobrança de mensalidades</li>
          <li>Suporte técnico e melhorias do produto</li>
          <li>Análises estatísticas internas anonimizadas para aprimoramento do serviço</li>
          <li>Inteligência Artificial opcional (Assistente IA) — apenas mediante consentimento e uso ativo do recurso pelo cliente contratante; mais detalhes na seção 6</li>
          <li>Cumprimento de obrigações legais e regulatórias (fiscais, trabalhistas, ANPD)</li>
        </ul>
      </Section>

      <Section title="5. Base legal (Art. 7 LGPD)">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Execução de contrato</strong> — para prestação dos
            serviços contratados pela empresa contratante.
          </li>
          <li>
            <strong>Cumprimento de obrigação legal</strong> — para guarda de
            registros fiscais (5 anos) e atendimento a requisições de autoridades.
          </li>
          <li>
            <strong>Legítimo interesse</strong> — para análises estatísticas
            anonimizadas, segurança da plataforma, prevenção de fraudes e
            melhorias contínuas.
          </li>
          <li>
            <strong>Consentimento</strong> — para coleta de localização GPS do
            técnico em campo e uso de funcionalidades de IA.
          </li>
        </ul>
      </Section>

      <Section title="6. Compartilhamento com terceiros">
        <p>
          Os dados são compartilhados apenas com operadores subcontratados
          estritamente necessários à prestação do serviço:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Google Cloud Platform / Firebase</strong> — armazenamento,
            autenticação e infraestrutura. Servidores em
            "southamerica-east1" (São Paulo).
          </li>
          <li>
            <strong>Google AI (Gemini)</strong> — quando o cliente contratante
            ativa o recurso de Assistente IA, dados operacionais (sem informações
            sensíveis) são processados para gerar respostas. Dados não são
            usados para treinamento de modelos pelo Google.
          </li>
          <li>
            <strong>Anthropic (Claude)</strong> — alternativa opcional ao Gemini,
            ativada por configuração do cliente contratante.
          </li>
          <li>
            <strong>Asaas IP S.A.</strong> — processamento de pagamentos
            (PIX, boleto, cartão). Compartilhamos somente CNPJ e dados mínimos
            de cobrança da empresa contratante.
          </li>
          <li>
            <strong>Autoridades públicas</strong> — quando exigido por lei
            ou ordem judicial.
          </li>
        </ul>
        <p>
          Não vendemos, alugamos ou cedemos dados pessoais a terceiros para
          fins de marketing.
        </p>
      </Section>

      <Section title="7. Transferência internacional">
        <p>
          Parte do processamento ocorre em servidores fora do Brasil (Estados
          Unidos e União Europeia, no caso da API do Google AI e Anthropic).
          Os fornecedores aderem a padrões internacionais de proteção
          (ex.: Standard Contractual Clauses — SCC) e têm certificações
          equivalentes ou superiores às exigidas pela LGPD.
        </p>
      </Section>

      <Section title="8. Período de retenção">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Dados de empresas contratantes ativas:</strong> mantidos
            durante toda a vigência do contrato.
          </li>
          <li>
            <strong>Dados após cancelamento:</strong> retidos por até 5 anos
            para cumprimento de obrigações fiscais brasileiras, podendo ser
            anonimizados antes desse prazo se a empresa solicitar exclusão
            (Art. 18 VI LGPD).
          </li>
          <li>
            <strong>Logs de auditoria:</strong> mantidos por 90 dias.
          </li>
          <li>
            <strong>Logs de uso de IA:</strong> mantidos por 90 dias após o
            uso, para auditoria de custo e segurança.
          </li>
        </ul>
      </Section>

      <Section title="9. Direitos do titular (Art. 18 LGPD)">
        <p>Você tem direito a:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Confirmar a existência de tratamento de seus dados</li>
          <li>Acessar seus dados</li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
          <li>
            Solicitar anonimização, bloqueio ou eliminação de dados
            desnecessários, excessivos ou tratados em desconformidade
          </li>
          <li>Solicitar portabilidade dos dados em formato estruturado (JSON)</li>
          <li>
            Revogar consentimento e solicitar exclusão dos dados tratados com
            base nele
          </li>
          <li>Obter informação sobre compartilhamentos</li>
          <li>Apresentar queixa à Autoridade Nacional de Proteção de Dados (ANPD)</li>
        </ul>
        <p className="mt-4">
          <strong>Como exercer:</strong>
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Diretores das empresas contratantes:</strong> menu
            "Configurações da conta" no aplicativo FMS — botões "Exportar meus
            dados" e "Excluir minha conta".
          </li>
          <li>
            <strong>Outros titulares</strong> (técnicos, clientes finais de
            uma empresa contratante): contate o administrador da empresa que
            cadastrou seus dados, que tem ferramentas para atender a
            solicitação dentro do app. Em caso de dificuldade ou recusa,
            contate-nos diretamente.
          </li>
          <li>
            Por email:{" "}
            <a className="underline" href="mailto:atendimento.solucleanrj@gmail.com">
              atendimento.solucleanrj@gmail.com
            </a>
            . Resposta em até 15 dias úteis.
          </li>
        </ul>
      </Section>

      <Section title="10. Cookies">
        <p>
          Usamos cookies essenciais para autenticação e funcionamento da
          plataforma. Cookies analíticos (medição de uso) só são ativados após
          consentimento explícito via banner. Não usamos cookies publicitários.
        </p>
      </Section>

      <Section title="11. Segurança">
        <ul className="list-disc pl-6 space-y-1">
          <li>Conexão HTTPS/TLS em todas as comunicações</li>
          <li>Senhas armazenadas com hash seguro (bcrypt via Firebase Auth)</li>
          <li>Isolamento multi-tenant rigoroso (cada empresa só acessa seus próprios dados)</li>
          <li>
            Autenticação adicional (re-confirmação de senha) para ações
            sensíveis: aprovar/recusar orçamentos, recusar chamados, excluir
            conta
          </li>
          <li>Audit log persistente de operações críticas</li>
          <li>Backups diários automáticos com retenção de 30 dias</li>
          <li>Acesso administrativo interno apenas via 2FA</li>
        </ul>
      </Section>

      <Section title="12. Notificação de incidentes (Art. 48 LGPD)">
        <p>
          Em caso de incidente de segurança que possa acarretar risco ou dano
          relevante aos titulares, notificaremos a ANPD e os titulares afetados
          em até <strong>72 horas</strong>, com a descrição do ocorrido,
          dados envolvidos, riscos e medidas tomadas para mitigar.
        </p>
      </Section>

      <Section title="13. Encarregado pelo Tratamento de Dados (DPO)">
        <p>
          O Encarregado pelo Tratamento de Dados Pessoais (Art. 41 LGPD) pode
          ser contatado em:
        </p>
        <p className="mt-2">
          <strong>Email:</strong>{" "}
          <a className="underline" href="mailto:atendimento.solucleanrj@gmail.com">
            atendimento.solucleanrj@gmail.com
          </a>
        </p>
      </Section>

      <Section title="14. Atualizações desta política">
        <p>
          Podemos atualizar esta política periodicamente. Mudanças relevantes
          serão notificadas aos clientes contratantes por email e via banner
          no app, exigindo novo aceite quando aplicável. Versão e data desta
          política aparecem no topo do documento.
        </p>
      </Section>

      <Section title="15. Foro">
        <p>
          Esta política é regida pelas leis brasileiras. Fica eleito o foro
          da Comarca de [SUA COMARCA], Estado [SEU ESTADO], para dirimir
          qualquer controvérsia decorrente desta política, com exclusão de
          qualquer outro, por mais privilegiado que seja.
        </p>
      </Section>

      <p className="text-sm text-ink-500 mt-12 pt-6 border-t">
        Última atualização: {PRIVACY_VERSION}
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
