import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

// Inter no lugar de Geist — Geist é Vercel-only (precisa do pacote `geist`),
// Inter é Google Font padrão e visualmente equivalente. O CSS variable
// `--font-sans` é o mesmo, então estilos não mudam.
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://getfms.pro",
  ),
  title: {
    default: "FMS — Field Management System",
    template: "%s · FMS",
  },
  description:
    "Software de operações pra equipes de campo (locação e facilities). Agende, despache, comprove o serviço e fature em um único console. Multi-tenant, LGPD nativo.",
  keywords: [
    "field management system",
    "locação de equipamentos",
    "facilities management",
    "gestão de campo",
    "OS técnico",
    "cobrança recorrente",
    "alternativa Eloca",
    "alternativa Auvo",
    "SaaS Brasil",
    "LGPD",
  ],
  authors: [{ name: "FMS" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "FMS — Field Management System",
    title: "FMS — Field Management System",
    description:
      "Software de operações pra equipes de campo (locação e facilities). Multi-tenant, LGPD nativo, com transparência radical sobre isolamento de dados.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "FMS — Field Management System",
    description:
      "Software de operações pra equipes de campo. Alternativa moderna ao Eloca / Conta Azul + Auvo.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
