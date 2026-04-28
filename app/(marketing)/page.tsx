import { Hero } from "@/components/marketing/hero";
// Seções portadas do design original (FMS.zip/design_handoff_fms/home.jsx).
import {
  LogoStrip,
  ProblemSolution,
  HowItWorks,
  FeatureShowcase,
  Segments,
  SocialProof,
  FinalCTA,
} from "@/components/marketing/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoStrip />
      <ProblemSolution />
      <HowItWorks />
      <FeatureShowcase />
      <Segments />
      <SocialProof />
      <FinalCTA />
    </>
  );
}
