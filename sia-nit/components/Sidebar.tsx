"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  Sparkles,
  LogOut,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "@/components/ui/motion";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projetos", label: "Projetos", icon: FolderKanban },
  { href: "/demandas", label: "Demandas", icon: ClipboardList },
  { href: "/recomendacao", label: "Recomendação IA", icon: Sparkles },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside className="flex h-screen w-57 shrink-0 flex-col border-r border-zinc-200/70 bg-white">
      {/* Branding — logo Unitins */}
      <div className="px-4 pt-5 pb-4">
        <Image
          src="/logo-unitins-horizontal-fundotransparente.jpg"
          alt="Unitins"
          width={136}
          height={36}
          className="object-contain"
          priority
        />
        <div className="mt-2 flex items-center gap-1.5">
          <span className="inline-flex items-center rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-white uppercase">
            NIT
          </span>
          <span className="text-[11px] text-zinc-400">Sistema de Recomendação</span>
        </div>
      </div>

      <div className="mx-4 h-px bg-zinc-100" />

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150",
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-blue-600"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  active ? "text-blue-600" : "text-zinc-400 group-hover:text-zinc-600"
                )}
              />
              <span className="flex-1">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="mx-4 h-px bg-zinc-100" />
      <div className="p-3 space-y-1">
        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 shrink-0">
            <Shield className="h-3.5 w-3.5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-zinc-900 truncate leading-tight">{user?.nome}</p>
            <p className={cn(
              "text-[10px] font-medium",
              user?.perfil === "admin_NIT" ? "text-blue-500" : "text-zinc-400"
            )}>
              {user?.perfil === "admin_NIT" ? "Admin NIT" : "Consultor"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sair da conta
        </button>
      </div>
    </aside>
  );
}
