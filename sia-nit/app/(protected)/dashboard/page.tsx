"use client";

import { kpis, areasDemandadas } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, staggerContainer, staggerItem } from "@/components/ui/motion";
import {
  FolderKanban,
  ClipboardList,
  Clock,
  TrendingUp,
  ThumbsUp,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = [
  "oklch(0.488 0.243 264.376)",
  "oklch(0.606 0.224 292.717)",
  "oklch(0.545 0.206 231)",
  "oklch(0.723 0.218 149.579)",
  "oklch(0.705 0.213 47.604)",
  "oklch(0.577 0.245 27.325)",
];

const kpiCards = [
  {
    label: "Projetos Ativos",
    value: kpis.projetosAtivos,
    icon: FolderKanban,
    color: "text-blue-600",
    bg: "bg-blue-50",
    trend: "+2 este mês",
    trendUp: true,
  },
  {
    label: "Demandas Pendentes",
    value: kpis.demandasPendentes,
    icon: ClipboardList,
    color: "text-amber-600",
    bg: "bg-amber-50",
    trend: "3 alta prioridade",
    trendUp: null,
  },
  {
    label: "Tempo Médio de Resposta",
    value: kpis.tempoMedioResposta,
    icon: Clock,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    trend: "↓ 93% vs. manual",
    trendUp: true,
  },
  {
    label: "Taxa de Match",
    value: kpis.taxaMatch,
    icon: TrendingUp,
    color: "text-violet-600",
    bg: "bg-violet-50",
    trend: "Meta: 65% ✓",
    trendUp: true,
  },
  {
    label: "Feedbacks Positivos",
    value: kpis.feedbacksPositivos,
    icon: ThumbsUp,
    color: "text-rose-600",
    bg: "bg-rose-50",
    trend: `de ${kpis.totalRecomendacoes} recomendações`,
    trendUp: null,
  },
  {
    label: "Recomendações Geradas",
    value: kpis.totalRecomendacoes,
    icon: Sparkles,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    trend: "desde o lançamento",
    trendUp: null,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-[22px] font-semibold tracking-tight text-zinc-900">Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-0.5">
          NIT — Unitins · Atualizado em tempo real
        </p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {kpiCards.map(({ label, value, icon: Icon, color, bg, trend }) => (
          <motion.div key={label} variants={staggerItem}>
            <Card className="border-zinc-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-200 group">
              <CardContent className="p-5 flex items-start gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                  <Icon className={`h-4.5 w-4.5 ${color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">{label}</p>
                  <p className="text-2xl font-semibold text-zinc-900 mt-0.5 tracking-tight">{value}</p>
                  <p className="text-xs text-zinc-400 mt-1">{trend}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
      >
        <Card className="border-zinc-200/60 bg-white shadow-sm">
          <CardHeader className="pb-1 pt-5 px-6">
            <CardTitle className="text-[14px] font-semibold text-zinc-900 tracking-tight">
              Áreas Mais Demandadas pelo Setor Produtivo
            </CardTitle>
            <p className="text-xs text-zinc-400 mt-0.5">Demandas externas por área temática</p>
          </CardHeader>
          <CardContent className="px-6 pb-5">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={areasDemandadas} margin={{ top: 8, right: 8, left: -24, bottom: 56 }}>
                <XAxis
                  dataKey="area"
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  angle={-32}
                  textAnchor="end"
                  interval={0}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 10,
                    border: "1px solid #e4e4e7",
                    boxShadow: "0 4px 16px rgba(0,0,0,.06)",
                    padding: "8px 12px",
                  }}
                  cursor={{ fill: "oklch(0.967 0.003 264 / 50%)" }}
                  formatter={(v) => [`${v} demandas`, "Quantidade"]}
                />
                <Bar dataKey="quantidade" radius={[5, 5, 0, 0]} maxBarSize={52}>
                  {areasDemandadas.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-2xl bg-linear-to-r from-blue-600 to-blue-500 text-white px-6 py-4 flex items-center gap-4 shadow-lg shadow-blue-500/20"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 shrink-0">
          <Zap className="h-4.5 w-4.5 text-white" />
        </div>
        <div>
          <p className="font-medium text-sm">Pipeline IA operacional</p>
          <p className="text-xs text-blue-100 mt-0.5">
            TF-IDF + LLM (re-rank) ativos · Fallback automático habilitado · Circuit Breaker: 0 aberturas no período
          </p>
        </div>
      </motion.div>
    </div>
  );
}
