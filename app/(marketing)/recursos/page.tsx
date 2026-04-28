// Página /recursos — porta de design_handoff_fms/marketing-pages.jsx → FeaturesPage.
// Stub funcional; dev finaliza com os 4 grupos.

export default function FeaturesPage() {
  const groups = [
    { tag: "01 — DESPACHO", title: "Agendamento e despacho",
      items: ["Roteamento inteligente","Recorrentes e contratos","Detecção de conflitos","Capacidade real"] },
    { tag: "02 — CAMPO", title: "App de campo",
      items: ["Tela 'Hoje'","Funciona offline","Ponto por GPS","Foto + assinatura"] },
    { tag: "03 — RELATÓRIOS", title: "Relatórios e análises",
      items: ["Lucratividade por job","Ranking de equipes","Dashboards customizáveis","Exportações"] },
    { tag: "04 — CLIENTE", title: "Portal do cliente",
      items: ["Histórico de visitas","Aprovações e orçamentos","Pagamento online","White-label"] },
  ];
  return (
    <>
      <section className="container-wide pt-24 pb-12">
        <span className="mono">Recursos</span>
        <h1 className="text-5xl lg:text-6xl font-medium mt-3 max-w-4xl">
          Cada tela, desenhada por quem realmente toca uma operação de campo.
        </h1>
      </section>
      {groups.map(g => (
        <section key={g.tag} className="container-wide py-16 border-t">
          <span className="mono">{g.tag}</span>
          <h2 className="text-4xl font-medium mt-2">{g.title}</h2>
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {g.items.map(it => (
              <div key={it} className="border rounded-xl p-7">
                <div className="font-medium">{it}</div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
