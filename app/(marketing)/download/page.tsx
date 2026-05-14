import Link from "next/link";
import {
  Smartphone,
  Download,
  ShieldCheck,
  ArrowRight,
  Apple,
  Chrome,
} from "lucide-react";

// URL do APK hospedado no Firebase Storage (path público /public-downloads/).
// Atualizar via `gsutil cp ... gs://opspilot-{env}.firebasestorage.app/public-downloads/opspilot.apk`
// quando subir nova build. version.json em /app/download/ tem metadata.
// Pra prod: trocar opspilot-dev → opspilot-prod.
const APK_URL =
  "https://firebasestorage.googleapis.com/v0/b/opspilot-dev.firebasestorage.app/o/public-downloads%2Fopspilot.apk?alt=media";

export const metadata = {
  title: "Baixar app · FMS",
  description:
    "Baixe o app FMS pra Android (APK) ou instale como Web App no iPhone. Mesmo workspace que você usa no navegador, no bolso da equipe.",
};

export default function DownloadPage() {
  return (
    <>
      <section className="container-wide pt-24 pb-12">
        <div className="max-w-3xl">
          <span className="mono">App</span>
          <h1 className="text-5xl lg:text-6xl font-medium mt-3">
            Baixe o FMS pro celular.
          </h1>
          <p className="text-ink-700 mt-5 text-lg max-w-2xl">
            O mesmo workspace que você usa no navegador — agora no bolso da
            equipe. Funciona offline, sincroniza quando voltar a conexão.
          </p>
        </div>
      </section>

      {/* CTAs por plataforma */}
      <section className="container-wide pb-12">
        <div className="grid md:grid-cols-2 gap-5">
          {/* Android */}
          <div className="border rounded-xl p-7 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-success/10 grid place-items-center">
                <Chrome size={24} className="text-success" />
              </div>
              <div>
                <div className="mono text-xs">DISPONÍVEL</div>
                <h2 className="text-xl font-medium">Android (APK)</h2>
              </div>
            </div>
            <p className="text-sm text-ink-700 mb-5">
              Versão dev — instale direto pelo Chrome do celular. Não está na
              Play Store ainda.
            </p>
            <a
              href={APK_URL}
              className="inline-flex items-center gap-2 bg-navy-900 text-white px-5 py-3 rounded font-medium hover:bg-ink-900"
            >
              <Download size={16} /> Baixar APK
              <span className="text-xs font-mono opacity-70 ml-2">
                ~112 MB
              </span>
            </a>
            <p className="text-xs text-ink-500 mt-3">
              Requer Android 7.0+
            </p>
          </div>

          {/* iOS */}
          <div className="border rounded-xl p-7 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 grid place-items-center">
                <Apple size={24} className="text-blue-700" />
              </div>
              <div>
                <div className="mono text-xs">DISPONÍVEL · WEB APP</div>
                <h2 className="text-xl font-medium">iPhone</h2>
              </div>
            </div>
            <p className="text-sm text-ink-700 mb-5">
              App Store em breve. Por enquanto instale como Web App pelo
              Safari — fica idêntico ao app nativo: ícone na tela de início,
              tela cheia, funciona offline.
            </p>
            <a
              href="#instalar-iphone"
              className="inline-flex items-center gap-2 bg-navy-900 text-white px-5 py-3 rounded font-medium hover:bg-ink-900"
            >
              <Smartphone size={16} /> Como instalar
              <ArrowRight size={14} />
            </a>
            <p className="text-xs text-ink-500 mt-3">
              Requer iOS 14+ e Safari (Chrome no iPhone não instala).
            </p>
          </div>
        </div>
      </section>

      {/* Como instalar Android */}
      <section className="container-wide py-16 border-t">
        <span className="mono">Instalação no Android</span>
        <h2 className="text-3xl font-medium mt-2">5 passos.</h2>
        <ol className="mt-8 grid md:grid-cols-5 gap-4">
          {[
            {
              n: "01",
              t: "Toque em Baixar",
              d: "O Chrome vai começar o download do APK.",
            },
            {
              n: "02",
              t: "Permitir instalação",
              d: "Android pede pra autorizar 'Apps desconhecidos' — só pro Chrome.",
            },
            {
              n: "03",
              t: "Abra o APK",
              d: "Em Downloads ou na notificação. Toque pra instalar.",
            },
            {
              n: "04",
              t: "Abra o FMS",
              d: "Aparece no menu de apps. Toque pra abrir.",
            },
            {
              n: "05",
              t: "Faça login",
              d: "Mesmo email/senha que usa no site. Pronto.",
            },
          ].map((s) => (
            <li key={s.n} className="border rounded-xl p-5">
              <div className="mono text-xs text-ink-500">{s.n}</div>
              <div className="font-medium mt-2">{s.t}</div>
              <div className="text-sm text-ink-700 mt-1">{s.d}</div>
            </li>
          ))}
        </ol>
      </section>

      {/* Como instalar iPhone */}
      <section
        id="instalar-iphone"
        className="container-wide py-16 border-t scroll-mt-20"
      >
        <span className="mono">Instalação no iPhone</span>
        <h2 className="text-3xl font-medium mt-2">5 passos.</h2>
        <p className="text-ink-700 mt-3 max-w-2xl">
          O FMS no iPhone é um <strong>Web App</strong> — não tem APK nem
          App Store, mas depois de instalado pela tela de início ele vira
          ícone fixo, abre em tela cheia e funciona offline igual ao nativo.
        </p>
        <ol className="mt-8 grid md:grid-cols-5 gap-4">
          {[
            {
              n: "01",
              t: "Abra o Safari",
              d: "No iPhone, abra o Safari (Chrome no iOS não permite instalar Web App).",
            },
            {
              n: "02",
              t: "Acesse o site",
              d: "Digite o endereço deste site e toque em Entrar no menu.",
            },
            {
              n: "03",
              t: "Faça login",
              d: "Mesmo email/senha que usa no navegador. Você cai no workspace.",
            },
            {
              n: "04",
              t: "Toque em Compartilhar",
              d: "Ícone de caixa com seta (↑) na barra inferior do Safari.",
            },
            {
              n: "05",
              t: "Adicionar à Tela de Início",
              d: "Role o menu, toque na opção, confirme o nome (FMS) e Adicionar.",
            },
          ].map((s) => (
            <li key={s.n} className="border rounded-xl p-5">
              <div className="mono text-xs text-ink-500">{s.n}</div>
              <div className="font-medium mt-2">{s.t}</div>
              <div className="text-sm text-ink-700 mt-1">{s.d}</div>
            </li>
          ))}
        </ol>
        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5 text-sm text-ink-700 max-w-3xl">
          <strong className="block mb-1">
            Sobre notificações push no iPhone
          </strong>
          Push funciona no iOS 16.4 ou superior, mas <strong>só depois</strong>{" "}
          de adicionar o app à tela de início — não pelo Safari direto. Quando
          abrir o FMS pela primeira vez pelo ícone, ele vai pedir permissão.
          Aceite pra receber alertas de novos chamados e mudanças de status.
        </div>
      </section>

      {/* Segurança */}
      <section className="container-wide py-16 border-t">
        <div className="grid md:grid-cols-[1fr_2fr] gap-8 items-start">
          <div>
            <span className="mono">Segurança</span>
            <h2 className="text-3xl font-medium mt-2">
              Dá pra confiar no APK?
            </h2>
          </div>
          <div className="space-y-4 text-ink-700">
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="text-success mt-1 shrink-0" />
              <p>
                <strong>Sim.</strong> O APK é hospedado em Firebase Hosting
                (Google) com HTTPS e content-disposition de download legítimo.
                O Android pode mostrar aviso de "fonte desconhecida" — é
                porque ainda não publicamos na Play Store, não porque há
                problema com o arquivo.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="text-success mt-1 shrink-0" />
              <p>
                Permissões pedidas são só as que o app realmente usa: câmera
                (foto antes/depois), localização (registrar onde a OS foi
                feita), notificações (avisos de novo chamado).
              </p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="text-success mt-1 shrink-0" />
              <p>
                Atualizações: por enquanto manuais — quando sair uma versão
                nova, baixar APK novo. Versão Play Store (auto-update) está
                em desenvolvimento.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="text-success mt-1 shrink-0" />
              <p>
                <strong>iPhone (Web App):</strong> sem instalador, sem permissão
                de "fonte desconhecida". É o mesmo site HTTPS que você abre no
                navegador, só salvo como ícone na tela de início — atualizações
                chegam automaticamente quando publicamos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA secundário */}
      <section className="container-wide py-16 border-t">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-medium">
            Não tem conta ainda?
          </h2>
          <p className="text-ink-700 mt-3">
            Crie sua empresa em 30 segundos e use grátis por 14 dias.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/criar-conta"
              className="inline-flex items-center gap-2 bg-navy-900 text-white px-5 py-3 rounded font-medium hover:bg-ink-900"
            >
              Criar workspace <ArrowRight size={14} />
            </Link>
            <Link
              href="/recursos"
              className="inline-flex items-center gap-2 border px-5 py-3 rounded font-medium hover:bg-ink-50"
            >
              Ver recursos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
