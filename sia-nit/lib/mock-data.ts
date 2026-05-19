export type Status = "ativo" | "concluido" | "suspenso";
export type Prioridade = "baixa" | "media" | "alta";
export type DemandaStatus = "aberta" | "em_analise" | "respondida" | "arquivada";

export interface Projeto {
  id: string;
  titulo: string;
  resumo: string;
  palavrasChave: string[];
  areaCNPq: string;
  status: Status;
  dataInicio: string;
  equipe: string[];
  nivelSigilo: "publico" | "restrito" | "confidencial";
}

export interface Demanda {
  id: string;
  empresa: string;
  cnpj: string;
  contato: string;
  descricao: string;
  prioridade: Prioridade;
  prazoResposta: string;
  status: DemandaStatus;
  dataCriacao: string;
  flagSigilo: boolean;
  areaCNPq?: string;
}

export interface Recomendacao {
  projeto: Projeto;
  scoreTfIdf: number;
  scoreIA: number;
  justificativaIA: string;
  feedback: "util" | "nao_util" | null;
  feedbackComentario: string;
}

export interface Pesquisador {
  id: string;
  nome: string;
  email: string;
  orcid: string;
  link_lattes: string;
  areas: string[];
  projetos: string[]; // IDs de Projeto.id
  consentimento_lgpd: boolean;
  ativo: boolean;
}

export const projetos: Projeto[] = [
  {
    id: "p1",
    titulo: "Sistema de Monitoramento de Queimadas via IoT e Machine Learning",
    resumo:
      "Plataforma de sensoriamento remoto com dispositivos IoT instalados em áreas de risco no Cerrado tocantinense, combinando dados de temperatura, umidade e imagens de satélite para predição de focos de incêndio com 72h de antecedência.",
    palavrasChave: ["IoT", "machine learning", "queimadas", "cerrado", "sensoriamento remoto", "ambiental"],
    areaCNPq: "Ciência da Computação",
    status: "ativo",
    dataInicio: "2024-03-01",
    equipe: ["Dr. Renato Alves", "MSc. Camila Ferreira", "Pedro Souza (IC)"],
    nivelSigilo: "publico",
  },
  {
    id: "p2",
    titulo: "Rastreabilidade na Cadeia de Soja com Blockchain",
    resumo:
      "Implementação de contrato inteligente em blockchain permissionado (Hyperledger Fabric) para rastrear a cadeia produtiva da soja desde a fazenda até o porto, garantindo conformidade ESG e redução de fraudes em certificações.",
    palavrasChave: ["blockchain", "agronegócio", "soja", "rastreabilidade", "ESG", "cadeia produtiva"],
    areaCNPq: "Engenharia de Produção",
    status: "ativo",
    dataInicio: "2024-07-15",
    equipe: ["Dra. Lúcia Mendes", "MSc. Fábio Corrêa"],
    nivelSigilo: "restrito",
  },
  {
    id: "p3",
    titulo: "Telemedicina Rural — Plataforma de Consultas Remotas para o Interior do TO",
    resumo:
      "Sistema de teleconsulta com integração a dispositivos de oximetria e pressão arterial Bluetooth, voltado para UBSs (Unidades Básicas de Saúde) em municípios com menos de 10 mil habitantes, reduzindo o deslocamento de pacientes crônicos.",
    palavrasChave: ["telemedicina", "saúde digital", "rural", "Bluetooth", "UBS", "consulta remota"],
    areaCNPq: "Medicina",
    status: "ativo",
    dataInicio: "2023-08-01",
    equipe: ["Dr. Tiago Barbosa", "Enfª. Patrícia Lima", "MSc. André Rocha"],
    nivelSigilo: "publico",
  },
  {
    id: "p4",
    titulo: "Agricultura de Precisão com Drones e Visão Computacional",
    resumo:
      "Mapeamento de lavouras de milho e algodão com drones DJI equipados com câmeras multiespectrais e modelo de visão computacional (YOLO v8) para detecção precoce de pragas e deficiências nutricionais, com geração de mapa de variabilidade.",
    palavrasChave: ["drone", "visão computacional", "agricultura de precisão", "NDVI", "milho", "algodão"],
    areaCNPq: "Agronomia",
    status: "ativo",
    dataInicio: "2024-01-10",
    equipe: ["Dr. Carlos Pinheiro", "MSc. Daniela Siqueira"],
    nivelSigilo: "publico",
  },
  {
    id: "p5",
    titulo: "Plataforma de Gestão Educacional com IA Generativa para EAD",
    resumo:
      "Sistema de learning analytics integrado ao Moodle com módulo de geração de trilhas de aprendizagem personalizadas via GPT-4o, análise de evasão preditiva e recomendação de materiais baseada no histórico do estudante.",
    palavrasChave: ["educação", "IA generativa", "EAD", "Moodle", "learning analytics", "evasão"],
    areaCNPq: "Educação",
    status: "ativo",
    dataInicio: "2025-01-20",
    equipe: ["Dra. Mariana Costa", "MSc. Rafael Gomes"],
    nivelSigilo: "publico",
  },
  {
    id: "p6",
    titulo: "Sistema de Gestão Hídrica para Pequenos Irrigantes do TO",
    resumo:
      "Aplicativo mobile e painel web para agricultores familiares monitorarem outorgas d'água, calcularem demanda hídrica de culturas e receberem alertas da ANA e do NATURATINS sobre restrições de captação em períodos de estiagem.",
    palavrasChave: ["recursos hídricos", "irrigação", "outorga", "agricultores familiares", "mobile", "ANA"],
    areaCNPq: "Engenharia Agrícola",
    status: "concluido",
    dataInicio: "2023-02-01",
    equipe: ["Dr. Eduardo Matos", "MSc. Fernanda Braga"],
    nivelSigilo: "publico",
  },
  {
    id: "p7",
    titulo: "Detecção de Fraudes em Licitações Municipais com NLP",
    resumo:
      "Ferramenta de auditoria automatizada que aplica NLP (BERT-ptBR) para comparar editais de licitação de municípios tocantinenses, identificando padrões de direcionamento, sobreposição textual e incompatibilidade de preços de referência.",
    palavrasChave: ["NLP", "licitação", "auditoria", "transparência pública", "BERT", "governo"],
    areaCNPq: "Ciência da Computação",
    status: "ativo",
    dataInicio: "2025-03-10",
    equipe: ["Dr. Sérgio Oliveira", "MSc. Juliana Ramos"],
    nivelSigilo: "confidencial",
  },
  {
    id: "p8",
    titulo: "Energia Solar Fotovoltaica de Baixo Custo para Comunidades Ribeirinhas",
    resumo:
      "Desenvolvimento de kit fotovoltaico modular e econômico para eletrificação rural de comunidades à beira do Araguaia sem acesso à rede elétrica, com sistema de armazenamento em baterias de segunda vida e painel de monitoramento remoto.",
    palavrasChave: ["energia solar", "fotovoltaico", "comunidades rurais", "baixo custo", "armazenamento", "sustentabilidade"],
    areaCNPq: "Engenharia Elétrica",
    status: "ativo",
    dataInicio: "2024-09-01",
    equipe: ["Dr. Marcos Nunes", "MSc. Isabela Torres"],
    nivelSigilo: "publico",
  },
];

export const demandas: Demanda[] = [
  {
    id: "d1",
    empresa: "Agronorte Sementes Ltda.",
    cnpj: "12.345.678/0001-90",
    contato: "engenharia@agronorte.com.br",
    descricao:
      "Precisamos de uma solução tecnológica para monitorar em tempo real a saúde das lavouras de soja e milho em nossa fazenda de 5.000 ha no norte do Tocantins. O objetivo é detectar pragas e doenças precocemente para reduzir o uso de defensivos agrícolas em até 30% e garantir a certificação ESG para exportação.",
    prioridade: "alta",
    prazoResposta: "2026-06-01",
    status: "em_analise",
    dataCriacao: "2026-05-10",
    flagSigilo: false,
    areaCNPq: "Agronomia",
  },
  {
    id: "d2",
    empresa: "Secretaria Municipal de Saúde de Araguaína",
    cnpj: "00.394.429/0001-08",
    contato: "ti@saude.araguaina.to.gov.br",
    descricao:
      "A secretaria busca parceria para implantação de sistema de teleconsulta nas 12 UBSs da zona rural do município. Temos população dispersa em assentamentos sem acesso a especialistas médicos. Necessitamos de solução que funcione com conexão 3G instável e integre ao prontuário eletrônico do cidadão (PEC do e-SUS).",
    prioridade: "alta",
    prazoResposta: "2026-05-30",
    status: "aberta",
    dataCriacao: "2026-05-14",
    flagSigilo: false,
    areaCNPq: "Medicina",
  },
  {
    id: "d3",
    empresa: "Cooperativa dos Pequenos Agricultores do TO (COPAT)",
    cnpj: "33.198.765/0001-44",
    contato: "diretoria@copat.org.br",
    descricao:
      "Nossa cooperativa representa 320 agricultores familiares que enfrentam dificuldades com o gerenciamento de outorgas d'água junto à NATURATINS. Precisamos de um aplicativo simples para acompanhar os limites de captação, receber alertas de restrição e calcular automaticamente a lâmina de irrigação por cultura.",
    prioridade: "media",
    prazoResposta: "2026-06-15",
    status: "aberta",
    dataCriacao: "2026-05-12",
    flagSigilo: false,
    areaCNPq: "Engenharia Agrícola",
  },
  {
    id: "d4",
    empresa: "Tribunal de Contas do Estado do Tocantins (TCE-TO)",
    cnpj: "25.053.117/0001-83",
    contato: "inovacao@tce.to.gov.br",
    descricao:
      "O TCE-TO está estruturando um laboratório de auditoria digital e busca tecnologia para análise automatizada de editais de licitação municipal. Interesse específico em soluções baseadas em processamento de linguagem natural (NLP) para identificação de irregularidades textuais e preços fora da referência de mercado.",
    prioridade: "alta",
    prazoResposta: "2026-05-25",
    status: "em_analise",
    dataCriacao: "2026-05-08",
    flagSigilo: true,
    areaCNPq: "Ciência da Computação",
  },
  {
    id: "d5",
    empresa: "Instituto Natureza do Tocantins (NATURATINS)",
    cnpj: "07.692.208/0001-20",
    contato: "gestaoambiental@naturatins.to.gov.br",
    descricao:
      "Necessitamos de ferramenta para monitoramento de queimadas e desmatamento ilegal em tempo real no Cerrado tocantinense. A solução deve integrar dados de satélite, sensores de campo e permitir o acionamento automatizado das equipes de fiscalização via geolocalização.",
    prioridade: "alta",
    prazoResposta: "2026-06-05",
    status: "aberta",
    dataCriacao: "2026-05-15",
    flagSigilo: false,
    areaCNPq: "Ciências Ambientais",
  },
  {
    id: "d6",
    empresa: "Fazendas Reunidas Capim Dourado S.A.",
    cnpj: "58.432.901/0001-17",
    contato: "inovacao@capimdourado.agr.br",
    descricao:
      "Somos um grupo agroindustrial com 15.200 ha de soja e milho na região de Campos Lindos (TO). Nossa maior dor operacional é a ausência de rastreabilidade integrada: não conseguimos garantir ao mercado europeu que nossa soja é livre de desmatamento (Regulação EUDR). Precisamos de solução que combine monitoramento ambiental em tempo real via sensores IoT distribuídos nas bordas de propriedade, visão computacional para detecção de variações na lavoura, e registro imutável das operações em blockchain para emissão de Certificado de Origem Digital rastreável. O prazo é crítico — nossa safra 25/26 precisa estar certificada ou perderemos o contrato de exportação com nosso comprador holandês.",
    prioridade: "alta",
    prazoResposta: "2026-08-01",
    status: "aberta",
    dataCriacao: "2026-05-18",
    flagSigilo: false,
    areaCNPq: "Agronomia",
  },
  {
    id: "d7",
    empresa: "Secretaria de Estado da Saúde do Tocantins (SESAU-TO)",
    cnpj: "02.109.881/0001-62",
    contato: "inovacao@saude.to.gov.br",
    descricao:
      "A SESAU-TO está estruturando o Programa Saúde Digital Tocantins com cobertura para os 139 municípios do estado. O desafio é a assistência a populações em municípios de menos de 5.000 habitantes sem especialistas médicos residentes. Buscamos parceria com a Unitins para plataforma de teleconsulta com três requisitos mandatórios: (1) operação em baixa conectividade (3G/satélite), (2) integração nativa com o Prontuário Eletrônico do Cidadão (PEC) do e-SUS RNDS, e (3) módulo de triagem por IA para classificação de risco Manchester antes da teleconsulta, reduzindo o tempo médio de atendimento. Investimento previsto de R$ 4,2 milhões via emenda parlamentar aprovada.",
    prioridade: "alta",
    prazoResposta: "2026-07-15",
    status: "aberta",
    dataCriacao: "2026-05-17",
    flagSigilo: false,
    areaCNPq: "Medicina",
  },
];

export const recomendacoesMock: Record<string, Recomendacao[]> = {
  d1: [
    {
      projeto: projetos[3],
      scoreTfIdf: 0.91,
      scoreIA: 0.95,
      justificativaIA:
        "O projeto de Agricultura de Precisão com Drones apresenta alinhamento semântico superior com a demanda da Agronorte. Além das palavras-chave coincidentes (drone, agricultura de precisão, NDVI), o modelo YOLO v8 descrito atende diretamente ao requisito de detecção precoce de pragas solicitado. A compatibilidade com culturas de soja e milho e o formato de mapa de variabilidade entregue são diferenciais que o TF-IDF clássico não consegue capturar por estarem implícitos no contexto do resumo.",
      feedback: null,
      feedbackComentario: "",
    },
    {
      projeto: projetos[1],
      scoreTfIdf: 0.78,
      scoreIA: 0.82,
      justificativaIA:
        "O projeto de Rastreabilidade com Blockchain tem relevância moderada. Atende ao requisito de certificação ESG e rastreabilidade produtiva solicitado pela Agronorte para exportação, mas não cobre o monitoramento em tempo real de lavouras. Recomendável como solução complementar ao projeto de drones, atuando na camada de certificação e não no sensoriamento.",
      feedback: null,
      feedbackComentario: "",
    },
    {
      projeto: projetos[0],
      scoreTfIdf: 0.61,
      scoreIA: 0.55,
      justificativaIA:
        "O projeto de Monitoramento de Queimadas via IoT tem sobreposição técnica (sensoriamento IoT, machine learning ambiental), mas seu foco é prevenção de incêndios e não monitoramento de lavouras. A adaptação seria possível, mas demandaria reengenharia significativa do modelo de detecção. Score de IA penalizado pela divergência de domínio aplicado.",
      feedback: null,
      feedbackComentario: "",
    },
  ],
  d2: [
    {
      projeto: projetos[2],
      scoreTfIdf: 0.97,
      scoreIA: 0.98,
      justificativaIA:
        "Match quase perfeito. O projeto de Telemedicina Rural da Unitins foi concebido especificamente para o cenário descrito pela Secretaria de Saúde de Araguaína: UBSs em zona rural, conectividade limitada e integração a dispositivos de monitoramento via Bluetooth. A equipe já possui experiência com o padrão e-SUS/RNDS, o que reduz drasticamente o tempo de adaptação para integração com o PEC solicitado.",
      feedback: null,
      feedbackComentario: "",
    },
  ],
  d4: [
    {
      projeto: projetos[6],
      scoreTfIdf: 0.95,
      scoreIA: 0.97,
      justificativaIA:
        "Correspondência altíssima e direta. O projeto de Detecção de Fraudes em Licitações com NLP do Dr. Sérgio Oliveira foi desenvolvido exatamente para o cenário operacional do TCE-TO: análise automatizada de editais municipais tocantinenses com BERT-ptBR. A ferramenta já possui módulo de detecção de sobreposição textual e incompatibilidade de preços, atendendo os dois requisitos explicitados na demanda.",
      feedback: null,
      feedbackComentario: "",
    },
  ],
  d3: [
    {
      projeto: projetos[5],
      scoreTfIdf: 0.94,
      scoreIA: 0.96,
      justificativaIA:
        "Correspondência direta e documentada. O Sistema de Gestão Hídrica para Pequenos Irrigantes da Unitins foi desenvolvido especificamente para o ecossistema NATURATINS/COPAT: gerenciamento de outorgas d'água, cálculo automatizado de lâmina de irrigação por cultura e alertas de restrição de captação integrados com a base de dados da ANA. Os 320 agricultores familiares representados pela COPAT se encaixam exatamente no perfil de usuário para o qual o aplicativo mobile foi projetado — simplicidade de uso com conectividade limitada.",
      feedback: null,
      feedbackComentario: "",
    },
  ],
  d5: [
    {
      projeto: projetos[0],
      scoreTfIdf: 0.93,
      scoreIA: 0.96,
      justificativaIA:
        "O projeto de Monitoramento de Queimadas via IoT e ML foi projetado especificamente para o Cerrado tocantinense com integração a dados de satélite e sensores de campo — correspondência direta com a demanda do NATURATINS. O módulo de geolocalização existente no sistema pode ser estendido para acionar equipes de fiscalização, conforme requisitado, sem necessidade de reengenharia arquitetural.",
      feedback: null,
      feedbackComentario: "",
    },
    {
      projeto: projetos[7],
      scoreTfIdf: 0.62,
      scoreIA: 0.58,
      justificativaIA:
        "O projeto de Energia Solar tem relevância periférica — trabalha em áreas remotas e inclui monitoramento remoto, mas não cobre sensoriamento ambiental de queimadas. Potencial de parceria futura para eletrificação de bases de monitoramento do NATURATINS, mas não responde ao núcleo da demanda atual.",
      feedback: null,
      feedbackComentario: "",
    },
  ],
  // ── DEMANDAS DE PITCH ─────────────────────────────────────────────────────
  // d6: caso onde a IA INVERTE o ranking do TF-IDF (o "pulo do gato" ao vivo)
  d6: [
    {
      projeto: projetos[3], // Drones — IA sobe para #1, TF-IDF rankeava #2
      scoreTfIdf: 0.74,
      scoreIA: 0.94,
      justificativaIA:
        "O projeto de Agricultura de Precisão com Drones e Visão Computacional apresenta alinhamento arquitetural direto com os três requisitos técnicos da Fazenda Capim Dourado: (1) o modelo YOLO v8 atende à detecção de variações na lavoura solicitada; (2) os dados multiespectrais NDVI geram a evidência de não desmatamento exigida pela Regulação EUDR europeia; (3) o mapeamento georreferenciado serve como camada de evidência auditável para o Certificado de Origem Digital. O TF-IDF subestimou este projeto pela menor sobreposição lexical com 'blockchain', mas a correspondência semântica com o núcleo do problema — rastreabilidade por evidência física de campo — é superior a qualquer outro candidato.",
      feedback: null,
      feedbackComentario: "",
    },
    {
      projeto: projetos[1], // Blockchain — TF-IDF colocava #1, IA rebaixou para #2
      scoreTfIdf: 0.89,
      scoreIA: 0.85,
      justificativaIA:
        "O projeto de Rastreabilidade com Blockchain (Hyperledger Fabric) atende ao requisito de registro imutável para o Certificado de Origem Digital. O score TF-IDF foi o mais alto do conjunto pelo vocabulário coincidente (blockchain, rastreabilidade, soja, ESG). Porém, a IA identifica que o blockchain sozinho não comprova o estado físico da lavoura — ele registra eventos, mas depende de uma fonte de evidência primária. Recomendação estratégica: este projeto deve atuar em camada 2, recebendo os dados produzidos pelo sistema de drones (recomendação #1), não como substituto dele.",
      feedback: null,
      feedbackComentario: "",
    },
    {
      projeto: projetos[0], // Queimadas IoT — terceiro lugar em ambos
      scoreTfIdf: 0.68,
      scoreIA: 0.71,
      justificativaIA:
        "O sistema de IoT para monitoramento de queimadas possui infraestrutura técnica aproveitável — sensores de campo distribuídos e pipeline de dados em tempo real. Porém, o domínio aplicado é prevenção de incêndios, não agricultura de precisão. Adaptação parcial seria viável para monitoramento de bordas de propriedade (requisito EUDR de desmatamento zero), mas representaria reengenharia significativa do modelo de alertas. Score penalizado pela divergência de domínio aplicado versus os projetos #1 e #2.",
      feedback: null,
      feedbackComentario: "",
    },
  ],
  // d7: caso de match quase perfeito — mostra confiança do pipeline
  d7: [
    {
      projeto: projetos[2], // Telemedicina — match perfeito, ambos os modelos concordam
      scoreTfIdf: 0.97,
      scoreIA: 0.99,
      justificativaIA:
        "Correspondência quase perfeita em todos os requisitos técnicos mandatórios. O projeto de Telemedicina Rural da Unitins: (1) foi desenvolvido com protocolo de operação em conectividade limitada (3G/Bluetooth), atendendo o requisito de municípios com menos de 5.000 habitantes; (2) a equipe do Dr. Tiago Barbosa possui integração prévia documentada com o padrão PEC/e-SUS RNDS, eliminando o maior risco técnico da implantação estadual; (3) a arquitetura modular do sistema suporta escala para os 139 municípios sem redesenho estrutural. O investimento de R$ 4,2 milhões previsto é compatível com a capacidade de entrega já validada. Prioridade máxima de encaminhamento.",
      feedback: null,
      feedbackComentario: "",
    },
    {
      projeto: projetos[4], // EAD/IA generativa — match secundário para o módulo de triagem
      scoreTfIdf: 0.51,
      scoreIA: 0.73,
      justificativaIA:
        "Relevância secundária mas estrategicamente importante para o componente de triagem por IA solicitado. O módulo GPT-4o integrado ao projeto de gestão educacional da Dra. Mariana Costa pode ser adaptado como motor de classificação de risco Manchester antes da teleconsulta — exatamente o terceiro requisito mandatório da SESAU-TO. A base de learning analytics do projeto oferece padrões de interação que poderiam ser retreinados para comportamento de pacientes em triagem. A IA detectou esta sinergia de segundo nível que o TF-IDF (score 0.51) não foi capaz de capturar — demonstrando o valor do re-ranking semântico.",
      feedback: null,
      feedbackComentario: "",
    },
  ],
};

export const kpis = {
  projetosAtivos: projetos.filter((p) => p.status === "ativo").length,
  demandasPendentes: demandas.filter((d) => d.status === "aberta" || d.status === "em_analise").length,
  tempoMedioResposta: "1h 48min",
  taxaMatch: "68%",
  feedbacksPositivos: 12,
  totalRecomendacoes: 27,
};

export const areasDemandadas = [
  { area: "Agronegócio / Precision Ag", quantidade: 8 },
  { area: "Saúde Digital", quantidade: 6 },
  { area: "Meio Ambiente / IoT", quantidade: 5 },
  { area: "Auditoria / NLP", quantidade: 4 },
  { area: "Educação / EAD", quantidade: 3 },
  { area: "Energia Renovável", quantidade: 2 },
];

export const pesquisadores: Pesquisador[] = [
  {
    id: "res1",
    nome: "Dr. Renato Alves",
    email: "renato.alves@unitins.edu.br",
    orcid: "0000-0002-1234-5678",
    link_lattes: "http://lattes.cnpq.br/1234567890",
    areas: ["Ciência da Computação", "IoT", "Machine Learning"],
    projetos: ["p1"],
    consentimento_lgpd: true,
    ativo: true,
  },
  {
    id: "res2",
    nome: "Dra. Lúcia Mendes",
    email: "lucia.mendes@unitins.edu.br",
    orcid: "0000-0003-8765-4321",
    link_lattes: "http://lattes.cnpq.br/9876543210",
    areas: ["Engenharia de Produção", "Blockchain", "Agronegócio"],
    projetos: ["p2"],
    consentimento_lgpd: true,
    ativo: true,
  },
  {
    id: "res3",
    nome: "Dr. Tiago Barbosa",
    email: "tiago.barbosa@unitins.edu.br",
    orcid: "0000-0001-2345-6789",
    link_lattes: "http://lattes.cnpq.br/1357924680",
    areas: ["Medicina", "Saúde Digital", "Telemedicina"],
    projetos: ["p3"],
    consentimento_lgpd: false,
    ativo: true,
  },
  {
    id: "res4",
    nome: "Dr. Carlos Pinheiro",
    email: "carlos.pinheiro@unitins.edu.br",
    orcid: "0000-0002-9876-5432",
    link_lattes: "http://lattes.cnpq.br/2468013579",
    areas: ["Agronomia", "Visão Computacional", "Engenharia Agrícola"],
    projetos: ["p4", "p6"],
    consentimento_lgpd: true,
    ativo: true,
  },
  {
    id: "res5",
    nome: "Dr. Sérgio Oliveira",
    email: "sergio.oliveira@unitins.edu.br",
    orcid: "0000-0003-1357-2468",
    link_lattes: "http://lattes.cnpq.br/1111222233",
    areas: ["Ciência da Computação", "NLP", "Auditoria Digital"],
    projetos: ["p7"],
    consentimento_lgpd: true,
    ativo: false,
  },
];
