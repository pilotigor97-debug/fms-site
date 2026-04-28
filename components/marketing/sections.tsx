/**
 * Seções da home institucional FMS — portadas do design original
 * (FMS.zip/design_handoff_fms/home.jsx) pra TSX/Next.js.
 *
 * Cada função aqui era um componente JSX no protótipo HTML estático.
 * Mantivemos as classes CSS originais (em globals.css) pra preservar
 * a aparência idêntica ao screenshot — em vez de reescrever em Tailwind.
 *
 * Substitui as versões "stub" que existiam em `sections-stubs.tsx`.
 */
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ─── Logo strip — clientes confiam no FMS ───────────────────────

export function LogoStrip() {
  return (
    <div className="container-wide">
      <div className="logo-strip">
        <span className="logo-strip-label">
          Mais de 4.200 equipes de campo confiam no FMS
        </span>
        <div className="logo-strip-row">
          <span className="logo">◆ Cleanpro</span>
          <span className="logo">▲ NorthGate</span>
          <span className="logo">○ Atlas Facilities</span>
          <span className="logo">▢ Bluestone</span>
          <span className="logo">◇ Harborline</span>
          <span className="logo">✦ Vertex</span>
        </div>
      </div>
    </div>
  );
}

// ─── Problem / Solution — antes vs depois ───────────────────────

export function ProblemSolution() {
  const before = [
    "Quadros brancos, grupos no WhatsApp e 14 planilhas diferentes.",
    "Equipes chegam no endereço errado — ou em endereço nenhum.",
    "Clientes ligam perguntando 'o time vem hoje?' e ninguém sabe.",
    "Faturas atrasam dias. As fotos ficam paradas no celular de alguém.",
  ];
  const after = [
    "Um único quadro de despacho que escritório e campo enxergam ao vivo.",
    "Jobs roteados por GPS e enviados ao celular da equipe com um toque.",
    "Notificações automáticas: a caminho, no local, concluído.",
    "Fotos, assinaturas e faturas geradas no momento em que o job termina.",
  ];
  return (
    <section className="section-sm">
      <div className="container-wide">
        <div className="section-head">
          <div>
            <div className="section-eyebrow">A virada</div>
            <h2 className="h2">
              Operações de campo,<br />sem o caos.
            </h2>
          </div>
          <p className="body-lg">
            A maioria das equipes de serviço ainda roda em grupos de
            mensagem e na memória. O FMS substitui tudo isso por um sistema
            estruturado — pra nada cair e você deixar de ser o gargalo.
          </p>
        </div>
        <div className="ps-grid">
          <div className="ps-card before">
            <div className="mono" style={{ marginBottom: 14, color: "var(--danger)" }}>
              ANTES DO FMS
            </div>
            <h3>Operação rodando em grupo de WhatsApp e intuição.</h3>
            <ul className="ps-list">
              {before.map((t, i) => (
                <li key={i}>
                  <span className="ps-icon">×</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ps-card after">
            <div className="mono" style={{ marginBottom: 14, color: "var(--blue-400)" }}>
              COM FMS
            </div>
            <h3>Uma fonte única de verdade — sincronizada do escritório à van.</h3>
            <ul className="ps-list">
              {after.map((t, i) => (
                <li key={i}>
                  <span className="ps-icon">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How it works — 3 passos ────────────────────────────────────

export function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Agendar",
      desc:
        "Arraste jobs até as equipes. O FMS roteia por proximidade, habilidade e SLA — e envia o plano do dia para cada celular.",
      visual: <ScheduleVisual />,
    },
    {
      n: "02",
      title: "Despachar",
      desc:
        "Equipes fazem check-in com um toque. O escritório vê status ao vivo, ETAs e qualquer bloqueio no instante em que aparece.",
      visual: <DispatchVisual />,
    },
    {
      n: "03",
      title: "Comprovar & faturar",
      desc:
        "Foto antes/depois, assinatura do cliente e fatura automática. O job se fecha sozinho — e o ciclo com o cliente também.",
      visual: <ProveVisual />,
    },
  ];
  return (
    <section className="section">
      <div className="container-wide">
        <div className="section-head">
          <div>
            <div className="section-eyebrow">Como funciona</div>
            <h2 className="h2">
              Três movimentos.<br />É o produto inteiro.
            </h2>
          </div>
          <p className="body-lg">
            Mantivemos o FMS deliberadamente enxuto. Você roda sua operação
            inteira nele antes do fim do dia.
          </p>
        </div>
        <div className="steps-rail">
          {steps.map((s) => (
            <div className="step" key={s.n}>
              <div className="step-num">
                {s.n} / 03 <span className="dash" />
              </div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
              <div className="step-visual">{s.visual}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScheduleVisual() {
  return (
    <div
      style={{
        padding: 14,
        height: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 4,
      }}
    >
      {[...Array(7)].map((_, d) => (
        <div key={d} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "var(--ink-400)",
              letterSpacing: "0.06em",
              textAlign: "center",
            }}
          >
            {["S", "T", "Q", "Q", "S", "S", "D"][d]}
          </div>
          {[0, 1, 2].map((r) => {
            const filled = (d * 3 + r) % 4 !== 0;
            const accent = (d * 3 + r) % 7 === 1;
            return (
              <div
                key={r}
                style={{
                  height: 16,
                  borderRadius: 3,
                  background: filled
                    ? accent
                      ? "var(--blue-600)"
                      : "var(--ink-200)"
                    : "transparent",
                  border: filled ? "none" : "1px dashed var(--border-strong)",
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function DispatchVisual() {
  return (
    <div style={{ position: "absolute", inset: 0, padding: 14 }}>
      <svg viewBox="0 0 240 110" style={{ width: "100%", height: "100%" }}>
        <defs>
          <pattern id="grd" width="14" height="14" patternUnits="userSpaceOnUse">
            <path d="M 14 0 L 0 0 0 14" fill="none" stroke="rgba(11,22,40,0.06)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="240" height="110" fill="url(#grd)" />
        <path
          d="M 20 90 Q 60 30 120 60 T 220 25"
          stroke="var(--blue-600)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="3 3"
        />
        <circle cx="20" cy="90" r="4" fill="var(--navy-900)" />
        <circle cx="120" cy="60" r="6" fill="var(--blue-600)" />
        <circle cx="120" cy="60" r="14" fill="none" stroke="var(--blue-600)" strokeOpacity="0.3" />
        <circle cx="220" cy="25" r="4" fill="var(--ink-300)" />
        <text x="130" y="56" fontSize="8" fontFamily="var(--font-mono)" fill="var(--ink-700)">
          EQUIPE 04
        </text>
      </svg>
    </div>
  );
}

function ProveVisual() {
  return (
    <div
      style={{
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        height: "100%",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        <div
          style={{
            height: 60,
            borderRadius: 4,
            background: "linear-gradient(135deg, #C8D2DD, #98A6B6)",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 4,
              left: 4,
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              color: "rgba(255,255,255,0.95)",
              background: "rgba(0,0,0,0.4)",
              padding: "1px 4px",
              borderRadius: 2,
            }}
          >
            ANTES
          </span>
        </div>
        <div
          style={{
            height: 60,
            borderRadius: 4,
            background: "linear-gradient(135deg, #E8EEF5, #B7C4D2)",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 4,
              left: 4,
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              color: "var(--white)",
              background: "var(--blue-600)",
              padding: "1px 4px",
              borderRadius: 2,
            }}
          >
            DEPOIS
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 8px",
          background: "var(--ink-50)",
          borderRadius: 4,
          fontSize: 11,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--ink-500)",
            fontSize: 9,
            letterSpacing: "0.06em",
          }}
        >
          FAT-4821
        </span>
        <span style={{ fontWeight: 500 }}>R$ 1.240,00</span>
        <span className="pill pill-success" style={{ height: 18, fontSize: 9 }}>
          <span className="pill-dot" />
          PAGO
        </span>
      </div>
    </div>
  );
}

// ─── Feature showcase — 5 cards ─────────────────────────────────

export function FeatureShowcase() {
  return (
    <section className="section">
      <div className="container-wide">
        <div className="section-head">
          <div>
            <div className="section-eyebrow">Tudo o que você precisa</div>
            <h2 className="h2">
              Um conjunto moldado<br />por mais de 1.200 equipes.
            </h2>
          </div>
          <p className="body-lg">
            Não é um clone de software de escritório com app móvel parafusado.
            Cada tela foi desenhada junto com quem realmente faz o serviço.
          </p>
        </div>
        <div className="feat-grid">
          <div className="feat feat-span-6">
            <span className="feat-tag">AGENDAMENTO</span>
            <h3>Quadro de despacho com arrastar e soltar.</h3>
            <p>
              Veja cada equipe, cada job e cada restrição de uma só vez.
              Conflitos se destacam antes de virarem incêndio na segunda de manhã.
            </p>
            <div className="feat-visual">
              <DispatchBoardMini />
            </div>
          </div>
          <div className="feat feat-span-6">
            <span className="feat-tag">APP DE CAMPO</span>
            <h3>O celular da equipe é o sistema.</h3>
            <p>
              Jobs do dia, navegação, captura de fotos e ponto — tudo numa
              interface de 4 toques pensada para luva e sol forte.
            </p>
            <div
              className="feat-visual"
              style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              <PhoneMini />
            </div>
          </div>
          <div className="feat feat-span-4">
            <span className="feat-tag">PROVA FOTOGRÁFICA</span>
            <h3>Antes. Depois. Assinado.</h3>
            <p>
              Todo job fecha com fotos carimbadas e assinatura do cliente.
              Disputas vão a zero.
            </p>
            <div className="feat-visual">
              <ProveVisual />
            </div>
          </div>
          <div className="feat feat-span-4">
            <span className="feat-tag">PORTAL DO CLIENTE</span>
            <h3>Seus clientes, em autosserviço.</h3>
            <p>
              Pedem, aprovam e pagam num portal com sua marca e suas cores.
              Menos vai-e-vem para você.
            </p>
            <div className="feat-visual">
              <PortalMini />
            </div>
          </div>
          <div className="feat feat-span-4">
            <span className="feat-tag">RELATÓRIOS</span>
            <h3>Margens, finalmente legíveis.</h3>
            <p>
              Lucro por job, por equipe, por linha de serviço. Custos vêm de
              tempo, materiais e rotas — automaticamente.
            </p>
            <div className="feat-visual">
              <ChartMini />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
          <Link href="/recursos" className="btn btn-secondary">
            Ver todos os recursos <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function DispatchBoardMini() {
  const lanes = [
    { name: "Equipe 01 · Norte", blocks: [{ x: 0, w: 2, c: "var(--blue-600)" }, { x: 3, w: 3, c: "var(--ink-200)" }] },
    { name: "Equipe 02 · Leste", blocks: [{ x: 1, w: 2, c: "var(--ink-200)" }, { x: 4, w: 2, c: "var(--blue-600)" }] },
    { name: "Equipe 03 · Sul",   blocks: [{ x: 0, w: 1, c: "var(--ink-200)" }, { x: 2, w: 3, c: "var(--blue-600)" }] },
  ];
  return (
    <div style={{ padding: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          color: "var(--ink-400)",
          letterSpacing: "0.06em",
          padding: "0 0 8px",
        }}
      >
        {["8", "9", "10", "11", "12", "13", "14"].map((h) => (
          <span key={h}>{h}:00</span>
        ))}
      </div>
      {lanes.map((lane, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ width: 90, fontSize: 10, color: "var(--ink-500)" }}>{lane.name}</span>
          <div
            style={{
              flex: 1,
              height: 18,
              background: "var(--white)",
              borderRadius: 3,
              position: "relative",
              border: "1px solid var(--border)",
            }}
          >
            {lane.blocks.map((b, j) => (
              <div
                key={j}
                style={{
                  position: "absolute",
                  top: 1,
                  bottom: 1,
                  left: `${(b.x / 7) * 100}%`,
                  width: `${(b.w / 7) * 100 - 1}%`,
                  background: b.c,
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PhoneMini() {
  return (
    <div
      style={{
        width: 140,
        height: 220,
        borderRadius: 22,
        background: "var(--navy-900)",
        padding: 6,
        boxShadow: "var(--shadow-md)",
        position: "relative",
        marginBottom: -28,
        marginTop: 8,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 18,
          background: "var(--white)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "6px 12px",
            fontFamily: "var(--font-mono)",
            fontSize: 8,
            color: "var(--ink-400)",
          }}
        >
          <span>9:24</span>
          <span>●●●</span>
        </div>
        <div style={{ padding: "0 10px", flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              fontFamily: "var(--font-mono)",
              color: "var(--ink-400)",
              letterSpacing: "0.06em",
            }}
          >
            PRÓXIMO JOB
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, marginTop: 2 }}>Edifício Riverside</div>
          <div style={{ fontSize: 9, color: "var(--ink-500)", marginTop: 2 }}>
            R. das Acácias, 1247 · 3,8 km
          </div>
          <div
            style={{
              marginTop: 8,
              padding: 8,
              background: "var(--ink-50)",
              borderRadius: 6,
              fontSize: 9,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ink-500)" }}>
              <span>ETA</span>
              <span style={{ color: "var(--ink-900)" }}>8min</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 4,
                color: "var(--ink-500)",
              }}
            >
              <span>Equipe</span>
              <span style={{ color: "var(--ink-900)" }}>2</span>
            </div>
          </div>
          <div
            style={{
              marginTop: 10,
              height: 24,
              borderRadius: 5,
              background: "var(--blue-600)",
              color: "var(--white)",
              display: "grid",
              placeItems: "center",
              fontSize: 10,
              fontWeight: 500,
            }}
          >
            Iniciar job
          </div>
        </div>
      </div>
    </div>
  );
}

function PortalMini() {
  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 8px",
          background: "var(--white)",
          border: "1px solid var(--border)",
          borderRadius: 4,
        }}
      >
        <div style={{ width: 14, height: 14, background: "var(--blue-600)", borderRadius: 3 }} />
        <span style={{ fontSize: 10, fontWeight: 600 }}>Cleanpro</span>
        <span style={{ marginLeft: "auto", fontSize: 9, color: "var(--ink-500)" }}>Sara K.</span>
      </div>
      <div
        style={{
          padding: "8px 10px",
          background: "var(--white)",
          border: "1px solid var(--border)",
          borderRadius: 4,
          fontSize: 10,
        }}
      >
        <div style={{ fontWeight: 500 }}>Próxima visita · 30/abr</div>
        <div style={{ color: "var(--ink-500)", marginTop: 2, fontSize: 9 }}>
          Quinzenal · janela de 2h
        </div>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        <div
          style={{
            flex: 1,
            height: 22,
            borderRadius: 3,
            background: "var(--blue-600)",
            color: "var(--white)",
            display: "grid",
            placeItems: "center",
            fontSize: 9,
            fontWeight: 500,
          }}
        >
          Aprovar
        </div>
        <div
          style={{
            flex: 1,
            height: 22,
            borderRadius: 3,
            background: "var(--ink-50)",
            color: "var(--ink-700)",
            display: "grid",
            placeItems: "center",
            fontSize: 9,
            fontWeight: 500,
            border: "1px solid var(--border)",
          }}
        >
          Reagendar
        </div>
      </div>
    </div>
  );
}

function ChartMini() {
  const bars = [42, 58, 51, 68, 60, 78, 72, 88, 82, 96];
  return (
    <div style={{ padding: 14, display: "flex", alignItems: "flex-end", gap: 4, height: "100%" }}>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              height: `${h}%`,
              background: i >= 7 ? "var(--blue-600)" : "var(--ink-200)",
              borderRadius: 2,
              minHeight: 4,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Segments — 5 verticais ─────────────────────────────────────

export function Segments() {
  const segs = [
    { i: "LP", name: "Limpeza",      desc: "Residencial, comercial e pós-obra." },
    { i: "MN", name: "Manutenção",   desc: "HVAC, facilities, multi-site." },
    { i: "RP", name: "Reparos",      desc: "Marido de aluguel, instalações, visitas mistas." },
    { i: "JR", name: "Jardinagem",   desc: "Rotas recorrentes, sazonais." },
    { i: "EM", name: "Empreiteiros", desc: "Equipes em múltiplas obras." },
  ];
  return (
    <section className="section-sm">
      <div className="container-wide" id="clientes">
        <div className="section-head">
          <div>
            <div className="section-eyebrow">Feito para</div>
            <h2 className="h2">
              O que quer que você<br />faça em campo.
            </h2>
          </div>
          <p className="body-lg">
            O FMS se adapta ao seu mix de serviços. Configure tipos de job,
            checklists e regras de preço por linha de serviço — sem fragmentar
            seus dados.
          </p>
        </div>
        <div className="seg-grid">
          {segs.map((s) => (
            <div className="seg" key={s.i}>
              <div className="seg-icon">{s.i}</div>
              <h4>{s.name}</h4>
              <p>{s.desc}</p>
              <span
                className="mono-tag"
                style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                Saiba mais <ArrowRight size={11} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Social proof — depoimentos + métricas ─────────────────────

export function SocialProof() {
  return (
    <section className="section-sm">
      <div className="container-wide">
        <div className="section-head">
          <div>
            <div className="section-eyebrow">Operadores falando</div>
            <h2 className="h2">A diferença do dia 2.</h2>
          </div>
          <p className="body-lg">
            A gente ouve o tempo todo: o escritório deixa de ser central
            telefônica. O dono deixa de ser o despachante. A equipe para de
            perguntar &quot;pra onde vou agora?&quot;.
          </p>
        </div>
        <div className="test-grid">
          <div className="test dark">
            <div className="test-quote">
              &quot;Dobramos o número de equipes sem contratar um único
              despachante. O quadro toca sozinho — e nossos clientes finalmente
              enxergam quando vamos chegar.&quot;
            </div>
            <div className="test-author">
              <div className="test-avatar" style={{ background: "rgba(255,255,255,0.15)" }}>
                MR
              </div>
              <div className="test-meta">
                <div className="name">Maria Ribeiro</div>
                <div className="role">Dona · Cleanpro · 38 equipes</div>
              </div>
            </div>
          </div>
          <div className="test">
            <div className="test-quote">
              &quot;Trocamos três ferramentas pelo FMS. O faturamento ficou 4
              dias mais rápido e as disputas praticamente sumiram com a prova
              fotográfica em cada visita.&quot;
            </div>
            <div className="test-author">
              <div className="test-avatar">DT</div>
              <div className="test-meta">
                <div className="name">Daniel Tavares</div>
                <div className="role">COO · NorthGate Facilities</div>
              </div>
            </div>
          </div>
          <div className="test">
            <div className="test-quote">
              &quot;Nossas equipes adotaram em uma manhã. Esse é o nível —
              qualquer coisa acima disso o pessoal de campo rejeita.&quot;
            </div>
            <div className="test-author">
              <div className="test-avatar">JL</div>
              <div className="test-meta">
                <div className="name">Júlia Lima</div>
                <div className="role">Líder de Operações · Atlas Property</div>
              </div>
            </div>
          </div>
        </div>
        <div className="metric-strip">
          <div className="metric">
            <div className="metric-value">
              38<span className="unit">%</span>
            </div>
            <div className="metric-label">Tempo de operação economizado</div>
          </div>
          <div className="metric">
            <div className="metric-value">
              4,2<span className="unit">d</span>
            </div>
            <div className="metric-label">Faturamento mais rápido</div>
          </div>
          <div className="metric">
            <div className="metric-value">
              98<span className="unit">%</span>
            </div>
            <div className="metric-label">Chegada no horário</div>
          </div>
          <div className="metric">
            <div className="metric-value">
              8<span className="unit">min</span>
            </div>
            <div className="metric-label">Tempo médio de setup</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ──────────────────────────────────────────────────

export function FinalCTA() {
  return (
    <section className="section">
      <div className="container-wide">
        <div className="final-cta">
          <span
            className="mono"
            style={{ color: "rgba(255,255,255,0.5)", display: "inline-block", marginBottom: 22 }}
          >
            QUANDO VOCÊ QUISER
          </span>
          <h2>Rode amanhã no FMS.</h2>
          <p>
            Configure sua equipe, importe os jobs e despache a primeira equipe
            antes do almoço. A gente ajuda se precisar.
          </p>
          <div style={{ display: "inline-flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/criar-conta" className="btn btn-accent btn-lg">
              Começar grátis <ArrowRight size={15} />
            </Link>
            <Link href="/contato" className="btn btn-secondary btn-lg">
              Falar com vendas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
