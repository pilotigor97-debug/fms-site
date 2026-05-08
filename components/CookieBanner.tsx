"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Cookie consent banner conformidade LGPD.
 *
 * Persiste decisão em `localStorage.fms_cookie_consent`:
 *   - "all"        — todos os cookies (essenciais + analytics)
 *   - "essential"  — só essenciais (auth, sessão)
 *
 * Banner some após decisão. Pra reabrir, limpar localStorage.
 *
 * Cookies analíticos NÃO devem ser disparados antes do user clicar
 * "Aceitar todos". Implementação real do gate em hooks que leem
 * `window.fmsCookieConsent` (setado por este componente).
 */

const STORAGE_KEY = "fms_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // SSR-safe: só checa localStorage no cliente.
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setVisible(true);
      } else {
        // Re-expõe pro resto da app saber sem ler localStorage de novo.
        (window as any).fmsCookieConsent = saved;
      }
    } catch (_) {
      // localStorage pode estar bloqueado (modo privado em alguns navegadores).
      setVisible(true);
    }
  }, []);

  function decide(value: "all" | "essential") {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
      (window as any).fmsCookieConsent = value;
    } catch (_) {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso sobre cookies"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md bg-white border rounded-xl shadow-lg p-5 z-50"
    >
      <h3 className="font-medium text-base">Esse site usa cookies</h3>
      <p className="text-sm text-ink-700 mt-2 leading-relaxed">
        Usamos cookies essenciais para autenticação e funcionamento da
        plataforma. Cookies analíticos só são ativados se você aceitar.
        Saiba mais na nossa{" "}
        <Link href="/politica-privacidade" className="underline">
          Política de Privacidade
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => decide("all")}
          className="flex-1 px-4 py-2 rounded-md bg-navy-900 text-white text-sm font-medium hover:opacity-90"
        >
          Aceitar todos
        </button>
        <button
          onClick={() => decide("essential")}
          className="flex-1 px-4 py-2 rounded-md border text-sm font-medium hover:bg-ink-50"
        >
          Apenas essenciais
        </button>
      </div>
    </div>
  );
}
