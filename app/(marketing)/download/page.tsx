import Link from "next/link";
import {
  Smartphone,
  Download,
  ShieldCheck,
  ArrowRight,
  Apple,
  Chrome,
} from "lucide-react";

// URL do APK hospedado no Firebase Hosting do projeto opspilot-dev.
// Quando promover pra prod, trocar opspilot-dev → opspilot-prod.
const APK_URL = "https://opspilot-dev.web.app/download/opspilot.apk";

export const metadata = {
  title: "Baixar app · FMS",
  description:
    "Baixe o app FMS pra Android e gerencie operações de campo do celular.",
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
                ~101 MB
              </span>
            </a>
            <p className="text-xs text-ink-500 mt-3">
              Requer Android 7.0+
            </p>
          </div>

          {/* iOS */}
          <div className="border rounded-xl p-7 bg-ink-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-ink-200 grid place-items-center">
                <Apple size={24} className="text-ink-700" />
              </div>
              <div>
                <div className="mono text-xs text-ink-500">EM BREVE</div>
                <h2 className="text-xl font-medium">iOS</h2>
              </div>
            </div>
            <p className="text-sm text-ink-700 mb-5">
              A versão para iPhone está em revisão da Apple. Enquanto isso,
              acesse pelo navegador — o app web funciona idêntico.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 border bg-white px-5 py-3 rounded font-medium hover:bg-ink-100"
            >
              <Smartphone size={16} /> Abrir no navegador{" "}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Como instalar Android */}
      <section className="container-wide py-16 border-t">
        <span className="mono">Instalação Android</span>
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
