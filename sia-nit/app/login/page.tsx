"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "@/components/ui/motion";
import { Lock, User, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [loginInput, setLoginInput] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const ok = login(loginInput, senha);
    if (ok) {
      router.push("/dashboard");
    } else {
      setErro("Usuário ou senha inválidos.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-zinc-900 via-blue-950 to-zinc-900 p-4 gap-8">
      <motion.div
        className="w-full max-w-sm space-y-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* NIT Logo — card branco para isolar do fundo escuro */}
        <div className="flex justify-center">
          <div className="rounded-2xl bg-white px-6 py-4 shadow-2xl shadow-black/30">
            <Image
              src="/logo-nit.png"
              alt="NIT — Núcleo de Inovação Tecnológica da Unitins"
              width={200}
              height={110}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Subtitle */}
        <div className="text-center space-y-0.5">
          <p className="text-white/80 text-sm font-medium tracking-tight">
            Sistema de Recomendação de Projetos Acadêmicos
          </p>
          <p className="text-zinc-500 text-xs">Acesso restrito ao pessoal autorizado</p>
        </div>

        {/* Card de Login */}
        <Card className="border-white/8 bg-white/6 shadow-2xl backdrop-blur-sm">
          <CardHeader className="space-y-0.5 pb-5">
            <CardTitle className="text-[15px] font-semibold text-white">Entrar na plataforma</CardTitle>
            <CardDescription className="text-zinc-500 text-xs">
              Use suas credenciais institucionais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="login" className="text-zinc-400 text-xs">Usuário</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
                  <Input
                    id="login"
                    placeholder="admin ou consultor"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    className="pl-9 bg-white/8 border-white/12 text-white placeholder:text-zinc-600 focus:border-blue-400 focus:bg-white/10 text-[13px]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="senha" className="text-zinc-400 text-xs">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
                  <Input
                    id="senha"
                    type="password"
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="pl-9 bg-white/8 border-white/12 text-white placeholder:text-zinc-600 focus:border-blue-400 focus:bg-white/10 text-[13px]"
                    required
                  />
                </div>
              </div>

              {erro && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2"
                >
                  <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                  <p className="text-red-400 text-xs">{erro}</p>
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-[13px] shadow-sm shadow-blue-500/30 mt-1"
              >
                {loading ? "Autenticando..." : "Entrar"}
              </Button>
            </form>

            {/* Credenciais de demo */}
            <div className="mt-5 rounded-xl bg-white/5 border border-white/8 p-3 space-y-2">
              <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest">Credenciais de demo</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-white/5 border border-white/8 px-2.5 py-2">
                  <p className="text-zinc-300 font-mono text-[11px]">admin / nit2026</p>
                  <p className="text-zinc-600 text-[10px] mt-0.5">Administrador NIT</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/8 px-2.5 py-2">
                  <p className="text-zinc-300 font-mono text-[11px]">consultor / unitins</p>
                  <p className="text-zinc-600 text-[10px] mt-0.5">Consultor Externo</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer institucional */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/8 backdrop-blur-sm px-6 py-3">
          <Image
            src="/logo-unitins-horizontal-fundotransparente.jpg"
            alt="Unitins"
            width={88}
            height={24}
            className="object-contain opacity-60"
          />
          <div className="h-5 w-px bg-white/20" />
          <span className="text-white/35 text-[11px] font-medium tracking-wide">
            Governo do Tocantins
          </span>
        </div>
        <p className="text-[11px] text-zinc-700">
          Unitins © 2026 · Núcleo de Inovação Tecnológica
        </p>
      </motion.div>
    </div>
  );
}
