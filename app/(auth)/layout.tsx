// Layout do grupo (auth) — split com form à esquerda + AuthAside escuro à direita.
import { AuthAside } from "@/components/auth/auth-aside";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr]">
      <div className="flex items-center justify-center p-10 bg-white">
        <div className="w-full max-w-md">{children}</div>
      </div>
      <AuthAside />
    </div>
  );
}
