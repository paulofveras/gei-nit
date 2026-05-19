"use client";

import { useMemo } from "react";
import {
  kpis,
  areasDemandadas,
  recomendacoesMock,
  demandas,
  Projeto,
} from "@/lib/mock-data";
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
  Trophy,
  Cloud,
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

const STOPWORDS = new Set([
  "para","pelo","pela","pelos","pelas","como","sobre","entre","sem","com","por","mais","menos","muito","pouco","todo","todos","toda","todas","este","esta","estes","estas","esse","essa","esses","essas","aquele","aquela","aqueles","aquelas","isso","isto","aquilo","sua","seu","suas","seus","nossa","nosso","nossas","nossos","também","então","ainda","apenas","mesmo","mesma","mesmos","mesmas","precisamos","precisa","busca","buscamos","somos","temos","queremos","devemos","podemos","estar","estão","pode","podem","foram","será","serão","sera","agora","antes","depois","sempre","nunca","cada","qualquer","durante","através","mediante","perante","conforme","segundo","enquanto","quando","onde","porque","porquê","quais","quanto","quantos","forma","formas","tempo","real","objetivo","maior","menor","baixa","alta","alto","representa","representam","tocantins","tocantinense","crítico","crítica","existe","existem","ainda","caso","casos","outro","outra","outros","outras","além","aqui","ali","cada","atendimento","milhões","milhão","reais"
]);

const TOP5_COLORS = [
  "bg-amber-500 text-white",
  "bg-zinc-400 text-white",
  "bg-orange-700 text-white",
  "bg-zinc-300 text-zinc-700",
  "bg-zinc-300 text-zinc-700",
];

interface Top5Entry {
  projeto: Projeto;
  count: number;
  avgScore: number;
}

interface WordcloudEntry {
  text: string;
  count: number;
  scale: number;
}

export default function DashboardPage() {
  const top5: Top5Entry[] = useMemo(() => {
    const stats = new Map<string, { projeto: Projeto; count: number; sumScore: number }>();
    Object.values(recomendacoesMock).flat().forEach((rec) => {
      const cur = stats.get(rec.projeto.id) ?? { projeto: rec.projeto, count: 0, sumScore: 0 };
      cur.count += 1;
      cur.sumScore += rec.scoreIA;
      stats.set(rec.projeto.id, cur);
    });
    return Array.from(stats.values())
      .map((s) => ({ projeto: s.projeto, count: s.count, avgScore: s.sumScore / s.count }))
      .sort((a, b) => b.count - a.count || b.avgScore - a.avgScore)
      .slice(0, 5);
  }, []);

  const wordcloud: WordcloudEntry[] = useMemo(() => {
    const texto = demandas
      .map((d) => `${d.descricao} ${d.areaCNPq ?? ""}`)
      .join(" ")
      .toLowerCase()
      .replace(/[.,;:()\/\-"'!?\d%]/g, " ")
      .replace(/\s+/g, " ");
    const tokens = texto.split(" ").filter((t) => t.length >= 5 && !STOPWORDS.has(t));
    const freq = new Map<string, number>();
    tokens.forEach((t) => freq.set(t, (freq.get(t) ?? 0) + 1));
    const sorted = Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 32);
    const max = sorted[0]?.[1] ?? 1;
    const min = sorted[sorted.length - 1]?.[1] ?? 1;
    return sorted.map(([text, count]) => ({
      text,
      count,
      scale: max === min ? 1 : (count - min) / (max - min),
    }));
  }, []);

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

      {/* Chart + TOP 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
        >
          <Card className="border-zinc-200/60 bg-white shadow-sm h-full">
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

        {/* TOP 5 projetos mais recomendados */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.28 }}
        >
          <Card className="border-zinc-200/60 bg-white shadow-sm h-full">
            <CardHeader className="pb-1 pt-5 px-5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 shrink-0">
                  <Trophy className="h-3.5 w-3.5 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-[14px] font-semibold text-zinc-900 tracking-tight">
                    TOP 5 Projetos Recomendados
                  </CardTitle>
                  <p className="text-xs text-zinc-400 mt-0.5">Por frequência no pipeline IA</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-4">
              <motion.ol
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-2.5"
              >
                {top5.map((entry, i) => (
                  <motion.li
                    key={entry.projeto.id}
                    variants={staggerItem}
                    className="group flex items-center gap-3 rounded-xl border border-zinc-200/60 bg-white px-3 py-2.5 hover:border-zinc-300 hover:shadow-sm transition-all"
                  >
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 text-[12px] font-bold ${TOP5_COLORS[i]}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[12px] font-medium text-zinc-900 leading-tight line-clamp-2"
                        title={entry.projeto.titulo}
                      >
                        {entry.projeto.titulo}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        {entry.count}× recomendado · {entry.projeto.areaCNPq}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-mono font-semibold text-blue-700 shrink-0 tabular-nums">
                      {(entry.avgScore * 100).toFixed(0)}%
                    </span>
                  </motion.li>
                ))}
                {top5.length === 0 && (
                  <li className="text-center py-6 text-[12px] text-zinc-400">
                    Nenhuma recomendação registrada ainda.
                  </li>
                )}
              </motion.ol>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Nuvem de palavras das demandas */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.34 }}
      >
        <Card className="border-zinc-200/60 bg-white shadow-sm overflow-hidden">
          <CardHeader className="pb-1 pt-5 px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-50 shrink-0">
                <Cloud className="h-3.5 w-3.5 text-cyan-600" />
              </div>
              <div>
                <CardTitle className="text-[14px] font-semibold text-zinc-900 tracking-tight">
                  Temas Recorrentes nas Demandas
                </CardTitle>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Frequência de termos extraídos das {demandas.length} demandas externas registradas
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-6 min-h-45 bg-linear-to-br from-zinc-50 to-white rounded-xl border border-zinc-200/40">
              {wordcloud.map((w, i) => (
                <motion.span
                  key={w.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.55 + w.scale * 0.45, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.02 * i, ease: "easeOut" }}
                  style={{
                    fontSize: `${0.875 + w.scale * 1.625}rem`,
                    color: COLORS[i % COLORS.length],
                  }}
                  className="font-semibold tracking-tight leading-none cursor-default hover:opacity-100 transition-opacity"
                  title={`"${w.text}" — ${w.count} ocorrência${w.count > 1 ? "s" : ""}`}
                >
                  {w.text}
                </motion.span>
              ))}
              {wordcloud.length === 0 && (
                <p className="text-[12px] text-zinc-400">
                  Sem termos suficientes para gerar a nuvem.
                </p>
              )}
            </div>
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
