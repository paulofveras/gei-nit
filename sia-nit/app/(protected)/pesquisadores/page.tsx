"use client";

import { useState } from "react";
import {
  pesquisadores as pesquisadoresIniciais,
  projetos as todosProjetos,
  Pesquisador,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, staggerContainer, staggerItem } from "@/components/ui/motion";
import {
  Plus,
  Search,
  Pencil,
  UserX,
  UserCheck,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

function tituloProjeto(id: string) {
  return todosProjetos.find((p) => p.id === id)?.titulo ?? id;
}

const FORM_INICIAL = {
  nome: "",
  email: "",
  orcid: "",
  link_lattes: "",
  areas: "",
  projetos: "",
  consentimento_lgpd: "sim" as "sim" | "nao",
};

type FormState = typeof FORM_INICIAL;

function pesquisadorParaForm(p: Pesquisador): FormState {
  return {
    nome: p.nome,
    email: p.email,
    orcid: p.orcid,
    link_lattes: p.link_lattes,
    areas: p.areas.join(", "),
    projetos: p.projetos.join(", "),
    consentimento_lgpd: p.consentimento_lgpd ? "sim" : "nao",
  };
}

export default function PesquisadoresPage() {
  const [lista, setLista] = useState<Pesquisador[]>(pesquisadoresIniciais);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Pesquisador | null>(null);
  const [form, setForm] = useState<FormState>(FORM_INICIAL);

  function abrirNovo() {
    setEditando(null);
    setForm(FORM_INICIAL);
    setOpen(true);
  }

  function abrirEditar(p: Pesquisador) {
    setEditando(p);
    setForm(pesquisadorParaForm(p));
    setOpen(true);
  }

  function fecharModal() {
    setOpen(false);
    setEditando(null);
    setForm(FORM_INICIAL);
  }

  function salvar() {
    if (!form.nome.trim() || !form.email.trim()) return;
    const base: Omit<Pesquisador, "id" | "ativo"> = {
      nome: form.nome.trim(),
      email: form.email.trim(),
      orcid: form.orcid.trim(),
      link_lattes: form.link_lattes.trim(),
      areas: form.areas.split(",").map((s) => s.trim()).filter(Boolean),
      projetos: form.projetos.split(",").map((s) => s.trim()).filter(Boolean),
      consentimento_lgpd: form.consentimento_lgpd === "sim",
    };

    if (editando) {
      setLista((prev) =>
        prev.map((p) => (p.id === editando.id ? { ...p, ...base } : p))
      );
    } else {
      setLista((prev) => [
        { id: `res${Date.now()}`, ativo: true, ...base },
        ...prev,
      ]);
    }
    fecharModal();
  }

  function toggleAtivo(id: string) {
    setLista((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ativo: !p.ativo } : p))
    );
  }

  const filtrado = lista.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.areas.some((a) => a.toLowerCase().includes(search.toLowerCase()))
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
          <h1 className="text-[22px] font-semibold tracking-tight text-zinc-900">
            Pesquisadores
          </h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            {lista.length} pesquisadores cadastrados
          </p>
        </div>
        <Button
          onClick={abrirNovo}
          className="gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/30"
        >
          <Plus className="h-4 w-4" /> Novo Pesquisador
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
          placeholder="Buscar por nome ou área..."
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
              <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 w-[22%]">
                Nome
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                E-mail
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                ORCID
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                Áreas
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                Projetos
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                Status
              </TableHead>
              <TableHead className="text-right text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <motion.tbody variants={staggerContainer} initial="initial" animate="animate">
            {filtrado.map((p) => (
              <motion.tr
                key={p.id}
                variants={staggerItem}
                className={cn(
                  "group border-b border-zinc-100 last:border-0 transition-colors duration-100",
                  p.ativo
                    ? "hover:bg-zinc-50/50"
                    : "bg-zinc-50/40 hover:bg-zinc-100/50"
                )}
              >
                {/* Nome + LGPD */}
                <TableCell className="py-3.5">
                  <p
                    className={cn(
                      "font-medium text-[13px] leading-tight",
                      p.ativo ? "text-zinc-900" : "text-zinc-400"
                    )}
                  >
                    {p.nome}
                  </p>
                  <span
                    className={cn(
                      "mt-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                      p.consentimento_lgpd
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    )}
                  >
                    {p.consentimento_lgpd ? (
                      <ShieldCheck className="h-2.5 w-2.5" />
                    ) : (
                      <ShieldAlert className="h-2.5 w-2.5" />
                    )}
                    {p.consentimento_lgpd ? "LGPD: Consentiu" : "LGPD: Pendente"}
                  </span>
                </TableCell>

                {/* E-mail */}
                <TableCell className="text-zinc-500 text-[13px] py-3.5">
                  {p.email}
                </TableCell>

                {/* ORCID */}
                <TableCell className="py-3.5">
                  {p.orcid ? (
                    <a
                      href={`https://orcid.org/${p.orcid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[12px] text-blue-600 hover:text-blue-500 font-mono transition-colors"
                    >
                      {p.orcid}
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-zinc-300 text-[12px]">—</span>
                  )}
                </TableCell>

                {/* Áreas */}
                <TableCell className="py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {p.areas.slice(0, 2).map((a) => (
                      <Badge
                        key={a}
                        variant="secondary"
                        className="text-[11px] font-normal bg-zinc-100 text-zinc-600"
                      >
                        {a}
                      </Badge>
                    ))}
                    {p.areas.length > 2 && (
                      <Badge
                        variant="outline"
                        className="text-[11px] font-normal text-zinc-400 border-zinc-200"
                      >
                        +{p.areas.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Projetos vinculados */}
                <TableCell className="py-3.5">
                  {p.projetos.length === 0 ? (
                    <span className="text-zinc-300 text-[12px]">—</span>
                  ) : (
                    <div className="space-y-0.5">
                      <p
                        className="text-[12px] text-zinc-600 leading-tight max-w-[160px] truncate"
                        title={tituloProjeto(p.projetos[0])}
                      >
                        {tituloProjeto(p.projetos[0])}
                      </p>
                      {p.projetos.length > 1 && (
                        <span className="text-[11px] text-zinc-400">
                          +{p.projetos.length - 1} projeto{p.projetos.length - 1 > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell className="py-3.5">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                      p.ativo
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-zinc-100 text-zinc-500"
                    )}
                  >
                    {p.ativo ? "Ativo" : "Inativo"}
                  </span>
                </TableCell>

                {/* Ações */}
                <TableCell className="text-right py-3.5">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => abrirEditar(p)}
                      className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                      title="Editar"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleAtivo(p.id)}
                      className={cn(
                        "h-7 w-7 p-0 rounded-lg",
                        p.ativo
                          ? "hover:bg-amber-50 hover:text-amber-600"
                          : "hover:bg-emerald-50 hover:text-emerald-600"
                      )}
                      title={p.ativo ? "Desativar" : "Ativar"}
                    >
                      {p.ativo ? (
                        <UserX className="h-3.5 w-3.5" />
                      ) : (
                        <UserCheck className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}

            {filtrado.length === 0 && (
              <tr>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-zinc-400 text-sm"
                >
                  Nenhum pesquisador encontrado.
                </TableCell>
              </tr>
            )}
          </motion.tbody>
        </Table>
      </motion.div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) fecharModal(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-semibold tracking-tight">
              {editando ? "Editar Pesquisador" : "Novo Pesquisador"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Nome + E-mail */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Nome completo *</Label>
                <Input
                  value={form.nome}
                  onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                  placeholder="Dr. Nome Sobrenome"
                />
              </div>
              <div className="space-y-1.5">
                <Label>E-mail institucional *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="nome@unitins.edu.br"
                />
              </div>
            </div>

            {/* ORCID + Lattes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>ORCID</Label>
                <Input
                  value={form.orcid}
                  onChange={(e) => setForm((f) => ({ ...f, orcid: e.target.value }))}
                  placeholder="0000-0000-0000-0000"
                  className="font-mono text-[13px]"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Link Lattes</Label>
                <Input
                  value={form.link_lattes}
                  onChange={(e) => setForm((f) => ({ ...f, link_lattes: e.target.value }))}
                  placeholder="http://lattes.cnpq.br/..."
                />
              </div>
            </div>

            {/* Áreas */}
            <div className="space-y-1.5">
              <Label>Áreas de atuação (separadas por vírgula)</Label>
              <Input
                value={form.areas}
                onChange={(e) => setForm((f) => ({ ...f, areas: e.target.value }))}
                placeholder="Ciência da Computação, IoT, Machine Learning"
              />
            </div>

            {/* Projetos */}
            <div className="space-y-1.5">
              <Label>Projetos vinculados (IDs separados por vírgula)</Label>
              <Input
                value={form.projetos}
                onChange={(e) => setForm((f) => ({ ...f, projetos: e.target.value }))}
                placeholder="p1, p4"
                className="font-mono text-[13px]"
              />
              <p className="text-xs text-zinc-400">
                IDs disponíveis: p1 a p8 · Ex: &quot;p1, p4&quot;
              </p>
            </div>

            {/* Consentimento LGPD */}
            <div className="space-y-1.5">
              <Label>Consentimento LGPD</Label>
              <Select
                value={form.consentimento_lgpd}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, consentimento_lgpd: v as "sim" | "nao" }))
                }
              >
                <SelectTrigger className="w-full">
                  <span className={cn(
                    "text-[13px]",
                    form.consentimento_lgpd === "sim" ? "text-emerald-700" : "text-red-600"
                  )}>
                    {form.consentimento_lgpd === "sim" ? "✓ Consentimento fornecido" : "⚠ Pendente de consentimento"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">✓ Consentimento fornecido</SelectItem>
                  <SelectItem value="nao">⚠ Pendente de consentimento</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-zinc-400">
                Coleta e uso de dados conforme LGPD art. 7º.
              </p>
            </div>

            {/* Ações */}
            <div className="flex justify-end gap-3 pt-2 border-t border-zinc-100">
              <Button variant="outline" onClick={fecharModal}>
                Cancelar
              </Button>
              <Button
                onClick={salvar}
                className="bg-blue-600 hover:bg-blue-500 text-white"
              >
                {editando ? "Salvar Alterações" : "Cadastrar Pesquisador"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
