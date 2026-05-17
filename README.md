<div align="center">

# SIA — Sistema de Recomendação de Projetos Acadêmicos

**NIT · Unitins · Palmas — TO**

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-black?style=flat-square&logo=framer&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

*Plataforma de inteligência organizacional que conecta demandas do setor produtivo tocantinense com projetos de pesquisa acadêmica da Unitins — via pipeline híbrido TF-IDF + LLM.*

</div>

---

## O problema que este sistema resolve

O Núcleo de Inovação Tecnológica (NIT) da Unitins recebe demandas de empresas, cooperativas e órgãos públicos do Tocantins que precisam de soluções tecnológicas — mas identificar manualmente qual projeto de pesquisa da universidade melhor atende cada demanda é lento, subjetivo e não-escalável.

O **SIA** automatiza esse processo em menos de 2 segundos, com justificativa textual auditável, rastreável e em conformidade com a **LGPD (art. 20 — direito à explicação)**.

---

## Demonstração

```
Login → Dashboard → Demandas → ⚡ Gerar Recomendação IA
```

| Tela | Descrição |
|---|---|
| **Dashboard** | KPIs em tempo real, gráfico de áreas mais demandadas, status do pipeline IA |
| **Projetos** | CRUD completo com busca full-text, upload de PDF com extração de palavras-chave via NLP |
| **Demandas** | Registro de demandas externas, triagem por prioridade e sigilo (LGPD) |
| **Recomendação IA** | Pipeline TF-IDF → re-rank LLM com justificativa auditável e sistema de feedback RLHF |

> Credenciais de demo: `admin / nit2026` (Admin NIT) · `consultor / unitins` (Consultor externo)

---

## Pipeline de Recomendação

O diferencial técnico do sistema é um **pipeline híbrido em dois estágios**:

```
Demanda externa
      │
      ▼
┌─────────────────────────────┐
│  1. Pré-filtro por área     │  → Reduz o espaço de busca via metadados CNPq
│     CNPq                    │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  2. TF-IDF (Bag-of-Words)  │  → Similaridade cosseno no índice invertido
│     Similaridade cosseno    │    dos projetos. Rápido, determinístico,
│                             │    100% local. Sem custo de API.
└──────────────┬──────────────┘
               │  Top-K candidatos
               ▼
┌─────────────────────────────┐
│  3. Re-ranking com LLM      │  → LLM re-ordena os candidatos com
│     (GPT-4o / Gemini)       │    compreensão semântica profunda e
│                             │    gera justificativa auditável (LGPD)
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Circuit Breaker + Fallback │  → Se a API do LLM falhar: retorna o
│                             │    ranking TF-IDF diretamente.
│                             │    O sistema nunca fica indisponível.
└─────────────────────────────┘
               │
               ▼
         Recomendações rankeadas
         + Justificativa textual
         + Score de similaridade
         + Coleta de feedback (RLHF)
```

**Por que dois estágios?**

TF-IDF sozinho é rápido mas cego ao contexto. LLM sozinho é caro e lento em bases grandes. A combinação dos dois entrega **precisão semântica com custo controlado** — o LLM só processa os top-K candidatos já filtrados pelo TF-IDF.

---

## Stack Tecnológica

### Frontend / Aplicação

| Camada | Tecnologia | Decisão técnica |
|---|---|---|
| Framework | **Next.js 16** (App Router) | SSR, layouts aninhados, cache granular |
| UI Library | **React 19** | Concurrent features, `use client` onde necessário |
| Linguagem | **TypeScript 5** | Type safety total nos domínios `Projeto`, `Demanda`, `Recomendacao` |
| Estilização | **Tailwind CSS v4** | `@theme inline`, OKLCH colors, `bg-linear-to-*` |
| Componentes | **shadcn/ui** (Base UI React) | Primitivos acessíveis sem opinião visual |
| Animações | **Framer Motion 12** | Page transitions, stagger, `AnimatePresence`, spring physics |
| Ícones | **Lucide React** | Tree-shakeable, consistente |
| Gráficos | **Recharts** | BarChart com paleta OKLCH personalizada |

### Arquitetura de IA

| Componente | Tecnologia |
|---|---|
| Indexação | TF-IDF com índice invertido por `palavrasChave` e `resumo` |
| Similaridade | Cosseno no espaço vetorial de termos |
| Re-ranking semântico | LLM (GPT-4o / Gemini Pro) via prompt engineering |
| Explicabilidade | Geração de justificativa estruturada (LGPD art. 20) |
| Resiliência | Circuit Breaker com fallback automático para TF-IDF |
| Aprendizado | Coleta de feedback (útil / não útil + comentário) para futura calibração RLHF |

---

## Funcionalidades

### Gestão de Projetos Acadêmicos
- CRUD completo com histórico de status (`ativo`, `concluído`, `suspenso`)
- Classificação por **área CNPq** para pré-filtro do pipeline
- Controle de sigilo em 3 níveis: `público`, `restrito`, `confidencial`
- Upload de PDF com extração automática de palavras-chave via NLP
- Busca full-text por título, área ou palavra-chave

### Gestão de Demandas Externas
- Registro de demandas com CNPJ, contato e descrição técnica
- Triagem por prioridade (`alta`, `média`, `baixa`) e status (`aberta` → `respondida`)
- Flag de sigilo para demandas sensíveis
- Roteamento direto para o pipeline de recomendação

### Pipeline de Recomendação IA
- Seleção da demanda → execução do pipeline em ~2s
- Visualização lado a lado: **TF-IDF vs IA** com score de similaridade
- Justificativa textual gerada pelo LLM, editável e auditável
- Sistema de feedback com comentário opcional (fundação para RLHF)

### Dashboard Analítico
- KPIs: projetos ativos, demandas pendentes, tempo médio de resposta, taxa de match
- Gráfico de áreas temáticas mais demandadas pelo setor produtivo
- Status em tempo real do pipeline (Circuit Breaker: abertura zero no período)

### Autenticação e Controle de Acesso
- Dois perfis: `admin_NIT` (gestão completa) e `consultor` (somente leitura e recomendação)
- Sessão persistida via `localStorage` com redirecionamento automático

---

## Início Rápido

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/sia-nit.git
cd sia-nit

# Instale as dependências
npm install

# Rode em desenvolvimento
npm run dev
```

Acesse `http://localhost:3000` e use as credenciais de demo.

### Requisitos

- Node.js ≥ 20
- npm ≥ 10

---

## Estrutura do Projeto

```
sia-nit/
├── app/
│   ├── layout.tsx              # Root layout (Inter font, AuthProvider)
│   ├── login/page.tsx          # Tela de autenticação
│   └── (protected)/
│       ├── layout.tsx          # Layout protegido (auth check + AnimatePresence)
│       ├── dashboard/page.tsx  # KPIs + gráfico analítico
│       ├── projetos/page.tsx   # CRUD de projetos acadêmicos
│       ├── demandas/page.tsx   # Gestão de demandas externas
│       └── recomendacao/page.tsx  # Pipeline TF-IDF + LLM
├── components/
│   ├── Sidebar.tsx             # Navegação com spring animation (layoutId)
│   └── ui/
│       ├── motion.tsx          # Primitivos de animação (Framer Motion)
│       ├── button.tsx          # CVA variants
│       ├── card.tsx            # Card, CardHeader, CardContent...
│       ├── dialog.tsx          # Modal acessível (Base UI)
│       └── ...                 # table, badge, input, select, textarea
├── lib/
│   ├── auth-context.tsx        # Context API + localStorage
│   ├── mock-data.ts            # Dados representativos do ecossistema tocantinense
│   └── utils.ts                # cn() helper (clsx + tailwind-merge)
└── ...                         # next.config.ts, tsconfig.json, postcss.config.mjs
```

---

## Decisões de Design

### Por que App Router e não Pages Router?

O App Router permite layouts aninhados e autenticação centralizada no `(protected)/layout.tsx` sem repetição. O `AnimatePresence` envolve o conteúdo no layout protegido, dando transição de página a todas as rotas com uma única implementação.

### Por que Tailwind v4?

O Tailwind v4 usa `@theme inline` com variáveis CSS no espaço de cores **OKLCH** — perceptualmente uniforme e com suporte nativo a `oklch(0.488 0.243 264.376)` como `--primary`. A paleta de cores do sistema foi definida nesse espaço, garantindo harmonia visual entre tons.

### Por que o IA Card tem `ai-glow`?

A animação de glow pulsante no card de recomendação IA não é decorativa: ela diferencia visualmente o resultado semântico (LLM) do resultado estatístico (TF-IDF), comunicando ao usuário que aquela coluna carrega inteligência adicional sem precisar de texto explicativo.

### LGPD e Explicabilidade

Toda recomendação gerada pelo LLM inclui uma **justificativa textual estruturada**, exibida na interface e recuperável por auditoria. Isso atende o art. 20 da LGPD, que garante ao titular o direito de obter explicação sobre decisões automatizadas que o afetem.

---

## Contexto

Este sistema foi desenvolvido como projeto prático do curso de **Gestão da Informação** na **Unitins** (Universidade Estadual do Tocantins), com foco no problema real do NIT — Núcleo de Inovação Tecnológica da instituição.

Os dados de demandas e projetos utilizados no MVP são representativos do ecossistema de inovação do estado do Tocantins, incluindo organizações como Agronorte Sementes, Secretaria de Saúde de Araguaína, COPAT, TCE-TO e NATURATINS.

---

## Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

<div align="center">

Feito com foco em qualidade de código, UX e aplicabilidade real.

**Paulo Fernando** · Unitins · NIT · 2026

</div>
