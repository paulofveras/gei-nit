"use client";

import { useState } from "react";
import { projetos as projetosIniciais, Projeto, Status } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, staggerContainer, staggerItem } from "@/components/ui/motion";
import { Plus, Upload, Loader2, Search, Pencil, Trash2 } from "lucide-react";

const STATUS_COLORS: Record<Status, string> = {
  ativo: "bg-emerald-100 text-emerald-700",
  concluido: "bg-zinc-100 text-zinc-500",
  suspenso: "bg-amber-100 text-amber-700",
};

const KEYWORDS_BY_AREA: Record<string, string> = {
  computacao: "machine learning, IoT, blockchain, NLP, API REST, Python",
  agronomia: "agricultura de precisão, NDVI, solo, irrigação, defensivos",
  saude: "telemedicina, e-SUS, prontuário eletrônico, telemonitoramento",
  engenharia: "energia solar, fotovoltaico, eficiência energética, automação",
  educacao: "EAD, Moodle, learning analytics, gamificação, evasão",
};

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>(projetosIniciais);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Projeto | null>(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    resumo: "",
    palavrasChave: "",
    areaCNPq: "",
    status: "ativo" as Status,
    nivelSigilo: "publico" as Projeto["nivelSigilo"],
    equipe: "",
    dataInicio: new Date().toISOString().slice(0, 10),
  });

  function resetForm() {
    setForm({
      titulo: "",
      resumo: "",
      palavrasChave: "",
      areaCNPq: "",
      status: "ativo",
      nivelSigilo: "publico",
      equipe: "",
      dataInicio: new Date().toISOString().slice(0, 10),
    });
    setEditando(null);
  }

  function openNovo() {
    resetForm();
    setOpen(true);
  }

  function openEditar(p: Projeto) {
    setEditando(p);
    setForm({
      titulo: p.titulo,
      resumo: p.resumo,
      palavrasChave: p.palavrasChave.join(", "),
      areaCNPq: p.areaCNPq,
      status: p.status,
      nivelSigilo: p.nivelSigilo,
      equipe: p.equipe.join(", "),
      dataInicio: p.dataInicio,
    });
    setOpen(true);
  }

  function salvar() {
    if (!form.titulo.trim()) return;
    const base = {
      titulo: form.titulo,
      resumo: form.resumo,
      palavrasChave: form.palavrasChave.split(",").map((k) => k.trim()).filter(Boolean),
      areaCNPq: form.areaCNPq,
      status: form.status,
      nivelSigilo: form.nivelSigilo,
      equipe: form.equipe.split(",").map((e) => e.trim()).filter(Boolean),
      dataInicio: form.dataInicio,
    };

    if (editando) {
      setProjetos((prev) => prev.map((p) => (p.id === editando.id ? { ...p, ...base } : p)));
    } else {
      const novo: Projeto = { id: `p${Date.now()}`, ...base };
      setProjetos((prev) => [novo, ...prev]);
    }
    setOpen(false);
    resetForm();
  }

  function excluir(id: string) {
    setProjetos((prev) => prev.filter((p) => p.id !== id));
  }

  async function fakeUpload() {
    setUploading(true);
    await new Promise((r) => setTimeout(r, 2200));
    const area = form.areaCNPq.toLowerCase();
    const key = Object.keys(KEYWORDS_BY_AREA).find((k) => area.includes(k)) ?? "computacao";
    setForm((f) => ({ ...f, palavrasChave: KEYWORDS_BY_AREA[key] }));
    setUploading(false);
  }

  const filtered = projetos.filter(
    (p) =>
      p.titulo.toLowerCase().includes(search.toLowerCase()) ||
      p.areaCNPq.toLowerCase().includes(search.toLowerCase()) ||
      p.palavrasChave.some((k) => k.toLowerCase().includes(search.toLowerCase()))
  );

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
          <h1 className="text-[22px] font-semibold tracking-tight text-zinc-900">Projetos Acadêmicos</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{projetos.length} projetos cadastrados</p>
        </div>
        <Button
          onClick={openNovo}
          className="gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/30"
        >
          <Plus className="h-4 w-4" /> Novo Projeto
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        className="relative max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.08 }}
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <Input
          placeholder="Buscar por título, área ou palavra-chave..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white border-zinc-200 text-sm placeholder:text-zinc-400 focus:border-blue-400"
        />
      </motion.div>

      {/* Table */}
      <motion.div
        className="rounded-2xl border border-zinc-200/60 bg-white shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12 }}
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/80 border-b border-zinc-200/60 hover:bg-zinc-50/80">
              <TableHead className="w-[36%] text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Título</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Área CNPq</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Status</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Palavras-chave</TableHead>
              <TableHead className="text-right text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <motion.tbody
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {filtered.map((p) => (
              <motion.tr
                key={p.id}
                variants={staggerItem}
                className="group border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-colors duration-100"
              >
                <TableCell className="font-medium text-zinc-900 text-[13px] py-3.5">{p.titulo}</TableCell>
                <TableCell className="text-zinc-500 text-[13px] py-3.5">{p.areaCNPq}</TableCell>
                <TableCell className="py-3.5">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_COLORS[p.status]}`}>
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {p.palavrasChave.slice(0, 3).map((k) => (
                      <Badge key={k} variant="secondary" className="text-[11px] font-normal bg-zinc-100 text-zinc-600 hover:bg-zinc-200">
                        {k}
                      </Badge>
                    ))}
                    {p.palavrasChave.length > 3 && (
                      <Badge variant="outline" className="text-[11px] font-normal text-zinc-400 border-zinc-200">
                        +{p.palavrasChave.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right py-3.5">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditar(p)}
                      className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => excluir(p.id)}
                      className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600 rounded-lg"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <TableCell colSpan={5} className="text-center py-12 text-zinc-400 text-sm">
                  Nenhum projeto encontrado.
                </TableCell>
              </tr>
            )}
          </motion.tbody>
        </Table>
      </motion.div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) { setOpen(false); resetForm(); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-semibold tracking-tight">
              {editando ? "Editar Projeto" : "Novo Projeto"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Título *</Label>
              <Input
                value={form.titulo}
                onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                placeholder="Ex: Sistema de monitoramento de queimadas via IoT"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Resumo</Label>
              <Textarea
                value={form.resumo}
                onChange={(e) => setForm((f) => ({ ...f, resumo: e.target.value }))}
                placeholder="Descreva o projeto, objetivos e metodologia..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Área CNPq</Label>
                <Input
                  value={form.areaCNPq}
                  onChange={(e) => setForm((f) => ({ ...f, areaCNPq: e.target.value }))}
                  placeholder="Ex: Ciência da Computação"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Data de Início</Label>
                <Input
                  type="date"
                  value={form.dataInicio}
                  onChange={(e) => setForm((f) => ({ ...f, dataInicio: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as Status }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="suspenso">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Nível de Sigilo</Label>
                <Select
                  value={form.nivelSigilo}
                  onValueChange={(v) => setForm((f) => ({ ...f, nivelSigilo: v as Projeto["nivelSigilo"] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publico">Público</SelectItem>
                    <SelectItem value="restrito">Restrito</SelectItem>
                    <SelectItem value="confidencial">Confidencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Palavras-chave</Label>
              <div className="flex gap-2">
                <Input
                  value={form.palavrasChave}
                  onChange={(e) => setForm((f) => ({ ...f, palavrasChave: e.target.value }))}
                  placeholder="IoT, machine learning, cerrado..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={fakeUpload}
                  disabled={uploading}
                  className="gap-2 shrink-0 border-dashed border-zinc-300 text-zinc-600"
                >
                  {uploading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Extraindo...</>
                  ) : (
                    <><Upload className="h-4 w-4" />Upload PDF</>
                  )}
                </Button>
              </div>
              <p className="text-xs text-zinc-400">
                Upload do PDF do projeto para extração automática de palavras-chave via NLP.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label>Equipe (separado por vírgula)</Label>
              <Input
                value={form.equipe}
                onChange={(e) => setForm((f) => ({ ...f, equipe: e.target.value }))}
                placeholder="Dr. João Silva, MSc. Ana Paula, Pedro (IC)"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-zinc-100">
              <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>
                Cancelar
              </Button>
              <Button onClick={salvar} className="bg-blue-600 hover:bg-blue-500 text-white">
                {editando ? "Salvar Alterações" : "Cadastrar Projeto"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
