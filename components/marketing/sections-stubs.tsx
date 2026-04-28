// Stubs das demais seções. O dev deve portar de design_handoff_fms/home.jsx
// (ProblemSolution, HowItWorks, FeatureShowcase, Segments, SocialProof, FinalCTA).
// Mantemos export plano aqui para não quebrar imports da página principal.

export function LogoStrip()       { return <section className="container-wide py-12 mono">+4.200 equipes confiam no FMS</section>; }
export function ProblemSolution() { return <section className="container-wide py-20"><h2 className="text-4xl font-medium">Operações de campo, sem o caos.</h2></section>; }
export function HowItWorks()      { return <section className="container-wide py-20"><h2 className="text-4xl font-medium">Três movimentos. É o produto inteiro.</h2></section>; }
export function FeatureShowcase() { return <section className="container-wide py-20"><h2 className="text-4xl font-medium">Tudo o que você precisa.</h2></section>; }
export function Segments()        { return <section className="container-wide py-20"><h2 className="text-4xl font-medium">O que quer que você faça em campo.</h2></section>; }
export function SocialProof()     { return <section className="container-wide py-20"><h2 className="text-4xl font-medium">A diferença do dia 2.</h2></section>; }
export function FinalCTA() {
  return (
    <section className="container-wide py-20">
      <div className="bg-navy-900 text-white rounded-xl p-16 text-center">
        <h2 className="text-5xl font-medium">Rode amanhã no FMS.</h2>
        <p className="text-white/70 mt-4">Configure sua equipe, importe os jobs e despache antes do almoço.</p>
        <a href="/criar-conta" className="inline-flex mt-8 bg-blue-600 text-white px-6 py-3 rounded font-medium">Começar grátis →</a>
      </div>
    </section>
  );
}
