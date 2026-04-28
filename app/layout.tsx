import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

// Inter no lugar de Geist — Geist é Vercel-only (precisa do pacote `geist`),
// Inter é Google Font padrão e visualmente equivalente. O CSS variable
// `--font-sans` é o mesmo, então estilos não mudam.
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "FMS — Field Management System",
  description:
    "Software de operações para equipes de campo. Agende, despache, comprove o serviço e fature — em um único console.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
