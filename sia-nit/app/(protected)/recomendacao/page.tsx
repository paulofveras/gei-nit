"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { demandas, recomendacoesMock, Recomendacao, Demanda } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence, staggerContainer, staggerItem } from "@/components/ui/motion";
import {
  Sparkles,
  Brain,
  BarChart2,
  ThumbsUp,
  ThumbsDown,
  Building2,
  Clock,
  Loader2,
  Trophy,
  Info,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

function ScoreBar({ value, color, delay = 0 }: { value: number; color: string; delay?: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay + 80);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${width * 100}%` }}
        />
      </div>
      <span className="text-xs font-mono text-zinc-500 w-9 text-right tabular-nums">
        {(value * 100).toFixed(0)}%
      </span>
    </div>
  );
}

const PIPELINE_STEPS = [
  { label: "Pré-filtro por área CNPq", icon: Filter, delay: 0 },
  { label: "Similaridade cosseno (TF-IDF)", icon: BarChart2, delay: 550 },
  { label: "Re-ranking com LLM · gerando justificativa", icon: Brain, delay: 1100 },
];

function LoadingPipeline() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);

  useEffect(() => {
    PIPELINE_STEPS.forEach(({ delay }, i) => {
      const t = setTimeout(() => setVisibleSteps((p) => [...p, i]), delay);
      return () => clearTimeout(t);
    });
  }, []);

  return (
    <div className="space-y-2.5 pt-1">
      {PIPELINE_STEPS.map(({ label, icon: Icon }, i) => (
        <AnimatePresence key={i}>
          {visibleSteps.includes(i) && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2.5 text-xs text-zinc-500"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100">
                <Icon className="h-3 w-3 text-blue-600" />
              </div>
              <span>{label}</span>
              {i < PIPELINE_STEPS.length - 1 && (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 ml-auto" />
              )}
              {i === PIPELINE_STEPS.length - 1 && (
                <Loader2 className="h-3.5 w-3.5 text-blue-500 animate-spin ml-auto" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </div>
  );
}

function RecomendacaoContent() {
  const params = useSearchParams();
  const initialId = params.get("demanda") ?? demandas[0].id;

  const [selectedDemandaId, setSelectedDemandaId] = useState(initialId);
  const [resultados, setResultados] = useState<Recomendacao[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<{ idx: number; tipo: "util" | "nao_util" } | null>(null);
  const [feedbackTexto, setFeedbackTexto] = useState("");
  const [feedbackSalvo, setFeedbackSalvo] = useState<Record<number, { tipo: string; comentario: string }>>({});

  const demandaSelecionada = demandas.find((d) => d.id === selectedDemandaId) ?? demandas[0];

  useEffect(() => {
    setResultados(null);
    setFeedbackSalvo({});
  }, [selectedDemandaId]);

  async function gerarRecomendacao() {
    setLoading(true);
    setResultados(null);
    await new Promise((r) => setTimeout(r, 1800));
    setResultados(recomendacoesMock[selectedDemandaId] ?? []);
    setLoading(false);
  }

  function salvarFeedback() {
    if (!feedbackModal) return;
    setFeedbackSalvo((prev) => ({
      ...prev,
      [feedbackModal.idx]: { tipo: feedbackModal.tipo, comentario: feedbackTexto },
    }));
    setFeedbackModal(null);
    setFeedbackTexto("");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm shadow-blue-500/30">
            <Sparkles className="h-4.5 w-4.5 text-white animate-sparkle" />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-zinc-900">Pipeline de Recomendação IA</h1>
            <p className="text-zinc-400 text-sm">
              TF-IDF + re-rank por LLM · Justificativa auditável (LGPD art. 20)
            </p>
          </div>
        </div>
      </motion.div>

      {/* Demanda selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
      >
        <Card className="border-zinc-200/60 bg-white shadow-sm rounded-2xl">
          <CardContent className="pt-5 space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="h-4.5 w-4.5 text-zinc-400 shrink-0 mt-2.5" />
              <div className="flex-1 space-y-1.5">
                <label className="text-[13px] font-medium text-zinc-700">Selecionar Demanda</label>
                <Select value={selectedDemandaId} onValueChange={(v) => v && setSelectedDemandaId(v)}>
                  <SelectTrigger className="bg-zinc-50 border-zinc-200 text-[13px] w-full">
                    <span className="flex-1 text-left truncate text-zinc-900">
                      {demandaSelecionada.empresa}
                      <span className="text-zinc-400 ml-1.5">
                        — {demandaSelecionada.prioridade.toUpperCase()}
                      </span>
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {demandas.map((d) => (
                      <SelectItem key={d.id} value={d.id} className="text-[13px]">
                        {d.empresa} — {d.prioridade.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Demanda preview */}
            <div className="rounded-xl bg-zinc-50 border border-zinc-200/60 p-4 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-zinc-900 text-[13px]">{demandaSelecionada.empresa}</span>
                <PrioridadeBadge p={demandaSelecionada.prioridade} />
              </div>
              <p className="text-[13px] text-zinc-600 leading-relaxed">{demandaSelecionada.descricao}</p>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Clock className="h-3 w-3" />
                Prazo: {demandaSelecionada.prazoResposta || "—"} · Registrada: {demandaSelecionada.dataCriacao}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={gerarRecomendacao}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white gap-2 shadow-sm shadow-blue-500/30"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Processando pipeline...</>
                ) : (
                  <><Sparkles className="h-4 w-4" />Gerar Recomendação</>
                )}
              </Button>
              {!loading && resultados === null && (
                <p className="text-xs text-zinc-400">Tempo estimado: ~2 segundos</p>
              )}
            </div>

            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <LoadingPipeline />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {resultados !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Trophy className="h-5 w-5 text-amber-500" />
              <h2 className="font-semibold text-[15px] text-zinc-900">
                {resultados.length > 0
                  ? `${resultados.length} projeto${resultados.length > 1 ? "s" : ""} recomendado${resultados.length > 1 ? "s" : ""}`
                  : "Nenhum projeto encontrado para esta demanda."}
              </h2>
            </motion.div>

            <motion.div
              className="space-y-5"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {resultados.map((rec, idx) => (
                <motion.div
                  key={rec.projeto.id}
                  variants={staggerItem}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                >
                  {/* TF-IDF Card */}
                  <Card className="border-zinc-200/60 bg-white shadow-sm rounded-2xl">
                    <CardHeader className="pb-2 pt-5 px-5 flex flex-row items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100">
                        <BarChart2 className="h-3.5 w-3.5 text-zinc-500" />
                      </div>
                      <CardTitle className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider">
                        TF-IDF Clássico
                      </CardTitle>
                      <RankBadge rank={idx + 1} />
                    </CardHeader>
                    <CardContent className="px-5 pb-5 space-y-4">
                      <p className="font-semibold text-zinc-900 text-[14px] leading-snug">{rec.projeto.titulo}</p>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wide">Similaridade cosseno</p>
                        </div>
                        <ScoreBar value={rec.scoreTfIdf} color="bg-zinc-400" delay={idx * 120} />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {rec.projeto.palavrasChave.slice(0, 4).map((k) => (
                          <Badge key={k} variant="secondary" className="text-[11px] font-normal bg-zinc-100 text-zinc-500">
                            {k}
                          </Badge>
                        ))}
                      </div>
                      <div className="rounded-xl bg-zinc-50 border border-zinc-200/60 p-3.5">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Info className="h-3 w-3 text-zinc-400" />
                          <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Método clássico</span>
                        </div>
                        <p className="text-[12px] text-zinc-500 leading-relaxed">
                          Selecionado por frequência de termos compartilhados entre a demanda e o índice invertido do projeto. Sem análise semântica de contexto.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* IA Card — destaque visual */}
                  <Card className="border-blue-200/60 rounded-2xl ai-glow bg-linear-to-br from-blue-50/60 to-white">
                    <CardHeader className="pb-2 pt-5 px-5 flex flex-row items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
                        <Brain className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      <CardTitle className="text-[12px] font-semibold text-blue-600 uppercase tracking-wider">
                        Recomendação IA
                      </CardTitle>
                      <div className="ml-auto flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                          <Sparkles className="h-2.5 w-2.5" />
                          LLM
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 space-y-4">
                      <p className="font-semibold text-zinc-900 text-[14px] leading-snug">{rec.projeto.titulo}</p>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wide">Score pós re-rank</p>
                        </div>
                        <ScoreBar value={rec.scoreIA} color="bg-blue-500" delay={idx * 120 + 60} />
                      </div>

                      {/* Justificativa — imersiva */}
                      <div className="rounded-xl bg-white border border-blue-200/60 p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                          <span className="text-[11px] text-blue-600 font-semibold uppercase tracking-wider">
                            Justificativa IA · auditável (LGPD art. 20)
                          </span>
                        </div>
                        <p className="text-[13px] text-zinc-700 leading-[1.75]">{rec.justificativaIA}</p>
                      </div>

                      {/* Feedback */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs text-zinc-400">Útil?</span>
                        <div className="flex gap-1.5 ml-auto">
                          {feedbackSalvo[idx] ? (
                            <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Obrigado!
                            </span>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 gap-1.5 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 rounded-lg"
                                onClick={() => setFeedbackModal({ idx, tipo: "util" })}
                              >
                                <ThumbsUp className="h-3 w-3" /> Sim
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 gap-1.5 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg"
                                onClick={() => setFeedbackModal({ idx, tipo: "nao_util" })}
                              >
                                <ThumbsDown className="h-3 w-3" /> Não
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {resultados.length === 0 && (
              <Card className="border-zinc-200/60 rounded-2xl">
                <CardContent className="py-14 text-center">
                  <p className="text-zinc-400 text-[13px]">
                    Nenhum projeto encontrado com similaridade suficiente para esta demanda.
                  </p>
                  <p className="text-zinc-400 text-xs mt-1">
                    Considere cadastrar novos projetos com palavras-chave mais específicas.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <Dialog
        open={!!feedbackModal}
        onOpenChange={(v) => { if (!v) { setFeedbackModal(null); setFeedbackTexto(""); } }}
      >
        <DialogContent className="max-w-md rounded-2xl border-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-[15px] tracking-tight">
              {feedbackModal?.tipo === "util" ? "Recomendação foi útil" : "Recomendação não foi útil"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-1">
            <p className="text-[13px] text-zinc-500">
              Comentário opcional — ajuda a melhorar o algoritmo:
            </p>
            <Textarea
              value={feedbackTexto}
              onChange={(e) => setFeedbackTexto(e.target.value)}
              placeholder="Ex: O projeto é interessante mas a equipe não tem disponibilidade..."
              rows={3}
              className="text-[13px] resize-none"
            />
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={() => { setFeedbackModal(null); setFeedbackTexto(""); }}>
                Cancelar
              </Button>
              <Button onClick={salvarFeedback} className="bg-blue-600 hover:bg-blue-500 text-white">
                Enviar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PrioridadeBadge({ p }: { p: string }) {
  const styles: Record<string, string> = {
    alta: "bg-red-100 text-red-700",
    media: "bg-amber-100 text-amber-700",
    baixa: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={cn("text-[11px] rounded-full px-2 py-0.5 font-medium", styles[p] ?? "bg-zinc-100 text-zinc-600")}>
      {p.charAt(0).toUpperCase() + p.slice(1)} prioridade
    </span>
  );
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <span className="ml-auto text-[10px] bg-zinc-100 text-zinc-500 rounded-full px-2 py-0.5 font-mono">
      #{rank}
    </span>
  );
}

export default function RecomendacaoPage() {
  return (
    <Suspense>
      <RecomendacaoContent />
    </Suspense>
  );
}
