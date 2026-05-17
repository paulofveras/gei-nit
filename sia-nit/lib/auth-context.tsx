"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Perfil = "admin_NIT" | "consultor";

interface AuthUser {
  login: string;
  perfil: Perfil;
  nome: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (login: string, senha: string) => boolean;
  logout: () => void;
}

const USERS: Record<string, { senha: string; perfil: Perfil; nome: string }> = {
  admin: { senha: "nit2026", perfil: "admin_NIT", nome: "Coordenador NIT" },
  consultor: { senha: "unitins", perfil: "consultor", nome: "Consultor Externo" },
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("sia_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  function login(loginInput: string, senha: string): boolean {
    const found = USERS[loginInput];
    if (!found || found.senha !== senha) return false;
    const authUser: AuthUser = { login: loginInput, perfil: found.perfil, nome: found.nome };
    setUser(authUser);
    localStorage.setItem("sia_user", JSON.stringify(authUser));
    return true;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("sia_user");
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
