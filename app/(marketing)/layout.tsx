import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="animate-fade-in">{children}</main>
      <Footer />
    </>
  );
}
