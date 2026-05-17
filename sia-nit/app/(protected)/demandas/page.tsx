"use client";

import { useState } from "react";
import { demandas as demandasIniciais, Demanda, Prioridade, DemandaStatus } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence, staggerContainer, staggerItem } from "@/components/ui/motion";
import { Building2, Calendar, ChevronDown, Lock, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const PRIORIDADE_STYLE: Record<Prioridade, string> = {
  alta: "bg-red-100 text-red-700 border-red-200",
  media: "bg-amber-100 text-amber-700 border-amber-200",
  baixa: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const STATUS_STYLE: Record<DemandaStatus, string> = {
  aberta: "bg-blue-100 text-blue-700",
  em_analise: "bg-violet-100 text-violet-700",
  respondida: "bg-emerald-100 text-emerald-700",
  arquivada: "bg-zinc-100 text-zinc-500",
};

const STATUS_LABEL: Record<DemandaStatus, string> = {
  aberta: "Aberta",
  em_analise: "Em análise",
  respondida: "Respondida",
  arquivada: "Arquivada",
};

export default function DemandasPage() {
  const [demandas, setDemandas] = useState<Demanda[]>(demandasIniciais);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [mostraForm, setMostraForm] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    empresa: "",
    cnpj: "",
    contato: "",
    descricao: "",
    prioridade: "media" as Prioridade,
    prazoResposta: "",
    flagSigilo: false,
  });

  function salvar() {
    if (!form.empresa.trim() || !form.descricao.trim()) return;
    const nova: Demanda = {
      id: `d${Date.now()}`,
      empresa: form.empresa,
      cnpj: form.cnpj,
      contato: form.contato,
      descricao: form.descricao,
      prioridade: form.prioridade,
      prazoResposta: form.prazoResposta,
      status: "aberta",
      dataCriacao: new Date().toISOString().slice(0, 10),
      flagSigilo: form.flagSigilo,
    };
    setDemandas((prev) => [nova, ...prev]);
    setForm({ empresa: "", cnpj: "", contato: "", descricao: "", prioridade: "media", prazoResposta: "", flagSigilo: false });
    setMostraForm(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
      >
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-zinc-900">Demandas Externas</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{demandas.length} demandas registradas</p>
        </div>
        <Button
          onClick={() => setMostraForm((v) => !v)}
          className="gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/30"
        >
          <Plus className="h-4 w-4" /> Nova Demanda
        </Button>
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        {mostraForm && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Card className="border-blue-200/60 bg-blue-50/30 shadow-sm rounded-2xl">
              <CardContent className="pt-5 space-y-4">
                <h2 className="font-semibold text-[14px] text-zinc-900 tracking-tight">Registrar Nova Demanda</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Empresa / Órgão solicitante *</Label>
                    <Input
                      value={form.empresa}
                      onChange={(e) => setForm((f) => ({ ...f, empresa: e.target.value }))}
                      placeholder="Ex: Agronorte Sementes Ltda."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>CNPJ</Label>
                    <Input
                      value={form.cnpj}
                      onChange={(e) => setForm((f) => ({ ...f, cnpj: e.target.value }))}
                      placeholder="00.000.000/0001-00"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>E-mail / Contato</Label>
                  <Input
                    value={form.contato}
                    onChange={(e) => setForm((f) => ({ ...f, contato: e.target.value }))}
                    placeholder="contato@empresa.com.br"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Descrição detalhada da demanda *</Label>
                  <Textarea
                    value={form.descricao}
                    onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
                    placeholder="Descreva o problema ou necessidade tecnológica, contexto, volume de dados..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label>Prioridade</Label>
                    <Select
                      value={form.prioridade}
                      onValueChange={(v) => setForm((f) => ({ ...f, prioridade: v as Prioridade }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="baixa">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Prazo de resposta</Label>
                    <Input
                      type="date"
                      value={form.prazoResposta}
                      onChange={(e) => setForm((f) => ({ ...f, prazoResposta: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Sigilo</Label>
                    <Select
                      value={form.flagSigilo ? "sim" : "nao"}
                      onValueChange={(v) => setForm((f) => ({ ...f, flagSigilo: v === "sim" }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nao">Pública</SelectItem>
                        <SelectItem value="sim">Sigilosa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-1 border-t border-blue-100">
                  <Button variant="outline" onClick={() => setMostraForm(false)}>Cancelar</Button>
                  <Button onClick={salvar} className="bg-blue-600 hover:bg-blue-500 text-white">
                    Registrar Demanda
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <motion.div
        className="space-y-3"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {demandas.map((d) => (
          <motion.div key={d.id} variants={staggerItem}>
            <Card className="border-zinc-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                {/* Header row */}
                <button
                  className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-zinc-50/50 transition-colors"
                  onClick={() => setExpandido(expandido === d.id ? null : d.id)}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 shrink-0 mt-0.5">
                    <Building2 className="h-4 w-4 text-zinc-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-zinc-900 text-[13px]">{d.empresa}</p>
                      {d.flagSigilo && <Lock className="h-3 w-3 text-amber-500" />}
                    </div>
                    <p className="text-zinc-400 text-xs mt-0.5 line-clamp-1">{d.descricao}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={cn("text-[11px] rounded-full border px-2 py-0.5 font-medium", PRIORIDADE_STYLE[d.prioridade])}>
                        {d.prioridade.charAt(0).toUpperCase() + d.prioridade.slice(1)} prioridade
                      </span>
                      <span className={cn("text-[11px] rounded-full px-2 py-0.5 font-medium", STATUS_STYLE[d.status])}>
                        {STATUS_LABEL[d.status]}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                        <Calendar className="h-3 w-3" />
                        {d.prazoResposta || "—"}
                      </span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandido === d.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 text-zinc-400 shrink-0 mt-1" />
                  </motion.div>
                </button>

                {/* Expanded */}
                <AnimatePresence>
                  {expandido === d.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-zinc-100 px-5 py-4 space-y-3 bg-zinc-50/40">
                        <p className="text-[13px] text-zinc-700 leading-relaxed">{d.descricao}</p>
                        <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
                          <span>CNPJ: {d.cnpj || "—"}</span>
                          <span>·</span>
                          <span>Contato: {d.contato || "—"}</span>
                          <span>·</span>
                          <span>Registrada: {d.dataCriacao}</span>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-500 text-white gap-1.5 text-xs shadow-sm shadow-blue-500/20"
                            onClick={() => router.push(`/recomendacao?demanda=${d.id}`)}
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            Gerar Recomendação IA
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
