// QEL@0xpblab - JavaScript Principal
// Sistema de navegação e renderização de markdown

// Configuração
const MARKED_CDN = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
const LANG_KEY = 'qel_language';

// Sistema de Idioma
let currentLang = 'pt';

function getCurrentLang() {
  const saved = localStorage.getItem(LANG_KEY);
  return saved || 'pt';
}

function setCurrentLang(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'pt-BR');
}

// Função para obter o base path do GitHub Pages
function getBasePath() {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  if (hostname.includes('github.io')) {
    const repoName = hostname.split('.')[0]; // 0xpbl.github.io -> 0xpbl
    
    // Se o pathname já começa com o nome do repositório, retornar o base path
    if (pathname.startsWith(`/${repoName}/`) || pathname === `/${repoName}`) {
      return `/${repoName}`;
    }
    
    // Se não começa, mas estamos no GitHub Pages, ainda retornar o base path
    // (o 404.html vai redirecionar se necessário)
    return `/${repoName}`;
  }
  return '';
}

function getDocsPath() {
  // Detectar base path do GitHub Pages
  // Exemplo: https://0xpbl.github.io/0xpbl/ -> basePath = '/0xpbl'
  const pathname = window.location.pathname;
  const hostname = window.location.hostname;
  
  let basePath = '';
  
  // Se estiver no GitHub Pages (não é localhost)
  if (hostname.includes('github.io')) {
    // Extrair o nome do repositório do hostname
    // hostname: 0xpbl.github.io -> repo: 0xpbl
    const repoName = hostname.split('.')[0];
    
    // Verificar se o pathname começa com o nome do repositório
    // Se sim, usar como base path
    if (pathname.startsWith(`/${repoName}/`) || pathname.startsWith(`/${repoName}`)) {
      basePath = '/' + repoName;
    } else {
      // Se não, verificar se há um primeiro segmento no pathname que não é uma rota conhecida
      const parts = pathname.split('/').filter(p => p && p !== 'index.html' && !p.endsWith('.html'));
      const knownRoutes = ['qel', 'characters', 'pablo', 'cold-war', 'tv-programs', 'villains', 'wwii', 'fu-monilson', 'dq', 'extras', 'completo', 'john', 'marcelo', 'old-ed', 'gorossario', 'gaybe-el', 'lore-gaybe-el-pixitos', 'madeusa', 'contact'];
      
      if (parts.length > 0) {
        const firstPart = parts[0];
        // Se o primeiro segmento não é uma rota conhecida e não tem extensão, é o base path
        if (!firstPart.includes('.') && !knownRoutes.includes(firstPart)) {
          basePath = '/' + firstPart;
        } else {
          // Se é uma rota conhecida, o base path é o nome do repositório
          basePath = '/' + repoName;
        }
      } else {
        // Se não há partes no pathname, usar o nome do repositório como base path
        basePath = '/' + repoName;
      }
    }
  }
  
  const langPath = currentLang === 'en' ? 'thehistory/en/' : 'thehistory/';
  
  // Retornar caminho: basePath + langPath ou apenas langPath se basePath vazio
  const fullPath = basePath ? `${basePath}/${langPath}` : langPath;
  console.log('getDocsPath() - hostname:', hostname, 'pathname:', pathname, 'basePath:', basePath, 'fullPath:', fullPath);
  return fullPath;
}

// Traduções
const translations = {
  pt: {
    nav: {
      home: "Início",
      history: "História",
      characters: "Personagens",
      contact: "Contato",
      pablo: "Pablo Mu-R4d",
      villains: "Vilões",
      prophet: "Profeta",
      john: "John Aunt-Bet",
      dq: "Desinclusão",
      tv: "TV",
      gaybe: "Orquestra",
      madeusa: "Advogado",
      jao: "Ferreiro",
      marcitus: "Analista"
    },
    ui: {
      loading: "Carregando documento...",
      loadingContent: "Carregando conteúdo...",
      back: "Voltar ao início",
      error: "Erro ao carregar documento",
      errorContent: "Erro ao carregar conteúdo",
      initializing: "Inicializando sistema quântico...",
      document: "Documento"
    },
    timeline: {
      title: "História do QEL@0xpblab",
      subtitle: "Uma narrativa cronológica da realidade como sistema distribuído",
      expand: "Expandir",
      collapse: "Recolher",
      viewDoc: "Ver Documento Completo →"
    },
    clock: {
      tooltip: "Sincronizado com o relógio atômico da empresa. Pode estar adiantado ou atrasado."
    }
  },
  en: {
    nav: {
      home: "Home",
      history: "History",
      characters: "Characters",
      contact: "Contact",
      pablo: "Pablo Mu-R4d",
      villains: "Villains",
      prophet: "Prophet",
      john: "John Aunt-Bet",
      dq: "De-Inclusion",
      tv: "TV",
      gaybe: "Orchestra",
      madeusa: "Lawyer"
    },
    ui: {
      loading: "Loading document...",
      loadingContent: "Loading content...",
      back: "Back to home",
      error: "Error loading document",
      errorContent: "Error loading content",
      initializing: "Initializing quantum system...",
      document: "Document"
    },
    timeline: {
      title: "QEL@0xpblab History",
      subtitle: "A chronological narrative of reality as a distributed system",
      expand: "Expand",
      collapse: "Collapse",
      viewDoc: "View Full Document →"
    },
    clock: {
      tooltip: "Synchronized with the company's atomic clock. May be ahead or behind."
    }
  }
};

function t(key) {
  const keys = key.split('.');
  let value = translations[currentLang];
  for (const k of keys) {
    value = value?.[k];
  }
  return value || key;
}

// Timeline Cronológica
const timeline = [
  {
    year: "1931",
    period: "Pré-Fundação",
    title: "Acordo de Viena Sobre Incerteza Legal",
    summary: "O QEL@0xpblab aparece como nota de rodapé em correspondências. Um grupo de juristas tenta 'processar' o Princípio da Incerteza por ser 'deliberadamente vago'.",
    document: "qel.md",
    anchor: "acordo-viena",
    icon: "📜",
    color: "violet"
  },
  {
    year: "1932",
    period: "Pré-Fundação",
    title: "Pablo Mu-R4d assume como Presidente e CEO",
    summary: "Desde 1932, o presidente e CEO do QEL@0xpblab é Pablo Mu-R4d — e, de forma perfeitamente consistente com a contabilidade quântica do laboratório, ele tem apenas 38 anos.",
    document: "PABLO-MU-R4D.md",
    anchor: null,
    icon: "👔",
    color: "violet"
  },
  {
    year: "1939-1945",
    period: "Segunda Guerra Mundial",
    title: "Operações Secretas da Seção Δ-13",
    summary: "O QEL@0xpblab operou secretamente sob o codinome Seção Δ-13, uma 'unidade de metrologia avançada' que nunca existiu oficialmente. Missão: evitar que a realidade colapsasse no pior ramo possível.",
    document: "WWII-OPERATIONS.md",
    anchor: null,
    icon: "🎖️",
    color: "red"
  },
  {
    year: "1947",
    period: "Guerra Quente-Morna",
    title: "Crise dos Dois Relógios de Greenwich",
    summary: "Dois relógios atômicos, lado a lado, discordavam como se tivessem opiniões políticas. A solução do QEL@0xpblab: colocar os relógios numa sala e pedir que chegassem a um consenso por interferência construtiva.",
    document: "qel.md",
    anchor: "crise-relogios",
    icon: "🕐",
    color: "cyan"
  },
  {
    year: "1947-1991",
    period: "Guerra Quente-Morna",
    title: "A Guerra Quente-Morna",
    summary: "O QEL@0xpblab nunca chamou de 'Guerra Fria'. Para o laboratório, foi a Guerra Quente-Morna: quente o suficiente para derreter confiança, morna o suficiente para manter tudo 'negável'.",
    document: "COLD-WAR.md",
    anchor: null,
    icon: "❄️🔥",
    color: "cyan"
  },
  {
    year: "1959",
    period: "Guerra Quente-Morna",
    title: "O Incidente do Cubo de Copenhagen",
    summary: "Durante uma demonstração privada na Dinamarca, um protótipo do QEL@0xpblab — o famoso Cubo de Copenhagen — foi ligado por 11 segundos. Ocorrências relatadas: um chapéu desapareceu e reapareceu em lugar mais apropriado.",
    document: "qel.md",
    anchor: "cubo-copenhagen",
    icon: "📦",
    color: "cyan"
  },
  {
    year: "1969",
    period: "Guerra Quente-Morna",
    title: "Protocolo de Reversão Suave (Apollo 12)",
    summary: "O QEL@0xpblab desenvolveu o Protocolo de Reversão Suave durante a missão Apollo 12, garantindo que a realidade não escolhesse o pior ramo possível durante operações espaciais críticas.",
    document: "qel.md",
    anchor: "apollo-12",
    icon: "🚀",
    color: "cyan"
  },
  {
    year: "1973",
    period: "Fundação Oficial",
    title: "Fundação Oficial do QEL@0xpblab",
    summary: "O QEL@0xpblab nasceu oficialmente em 1973, num porão sem janelas. O primeiro documento — o Memorando do Gato Não-Assinado — afirmava: 'A realidade é um sistema distribuído, e observação é uma forma de commit.'",
    document: "qel.md",
    anchor: "sobre",
    icon: "🔬",
    color: "green"
  },
  {
    year: "1973",
    period: "Fundação Oficial",
    title: "Desinclusão Quântica™",
    summary: "A política de RH do QEL@0xpblab que mantém cada colaborador incluído em pelo menos um ramo, e excluído em todos os outros — por razões de escalabilidade humana e consistência estatística.",
    document: "DQ.md",
    anchor: null,
    icon: "🏢",
    color: "green"
  },
  {
    year: "1978-1986",
    period: "Guerra Quente-Morna",
    title: "Guerra Fria do Emaranhamento",
    summary: "Período de intensa atividade do QEL@0xpblab durante a Guerra Quente-Morna, com desenvolvimento de protocolos de emaranhamento e ruído diplomático mínimo.",
    document: "COLD-WAR.md",
    anchor: "guerra-emaranhamento",
    icon: "🔗",
    color: "cyan"
  },
  {
    year: "1983",
    period: "Guerra Quente-Morna",
    title: "Incidente 'Verdadeiro o Suficiente'",
    summary: "Um dos incidentes mais críticos da Guerra Quente-Morna, onde o QEL@0xpblab precisou intervir para evitar um colapso de realidade em escala global.",
    document: "COLD-WAR.md",
    anchor: "incidente-1983",
    icon: "⚠️",
    color: "cyan"
  },
  {
    year: "1980s-1990s",
    period: "Era Moderna",
    title: "Programas de TV (Experimentos de Comunicação)",
    summary: "O QEL@0xpblab produziu (ou alegadamente produziu) diversos programas de TV, que o laboratório insiste em chamar de 'experimentos de comunicação em massa'.",
    document: "TV-PROGRAMS.md",
    anchor: null,
    icon: "📺",
    color: "green"
  },
  {
    year: "1997",
    period: "Era Moderna",
    title: "Conferência de Kyoto Sobre Decoerência Cultural",
    summary: "Evento que formalizou a tese do QEL@0xpblab sobre decoerência cultural e marcou o fim oficial da Guerra Quente-Morna.",
    document: "qel.md",
    anchor: "kyoto",
    icon: "🌍",
    color: "green"
  },
  {
    year: "2000s+",
    period: "Era Moderna",
    title: "A Chegada do Profeta ~~Ri~~ck com Fu Monilson",
    summary: "A chegada do profeta com Fu Monilson e o Protocolo de Amplificação Controlada, uma evolução dos protocolos anteriores para combater os quatro vilões do Quarteto da Impossibilidade.",
    document: "FU-MONILSON.md",
    anchor: null,
    icon: "🔮🎸",
    color: "green"
  },
  {
    year: "2000s+",
    period: "Era Moderna",
    title: "O Fiscal Interdimensional da Lousa",
    summary: "O Fiscal Interdimensional da Lousa e sua guerra eterna contra π. Uma entidade que garante que a matemática permaneça consistente, mesmo quando a realidade não quer.",
    document: "QEL-PACOTE-EXTRAS.md",
    anchor: null,
    icon: "🧾🌀",
    color: "green"
  },
  {
    year: "2000s+",
    period: "Era Moderna",
    title: "John Aunt-Bet: O Germano-Suíço Anti-Açúcar",
    summary: "John Aunt-Bet, colaborador germano-suíço que recusa sobremesas e mantém a insulina como artefato de coerência. Proteção especial contra 'docinhos de certeza' da Sra. Laplace.",
    document: "JOHN-AUNT-BET.md",
    anchor: null,
    icon: "🍬🚫",
    color: "green"
  },
  {
    year: "2000s+",
    period: "Era Moderna",
    title: "Gaybe-EL: O Barbo dos Mullets, Regente da Orquestra da Companhia",
    summary: "Gaybe-EL, entidade executivo-musical que rege a Orquestra da Companhia em ritmo 7/8. Implementação corporativa do Protocolo de Amplificação que transforma reuniões em performances musicais.",
    document: "GAYBE-EL.md",
    anchor: null,
    icon: "🎻🧔🐟",
    color: "green"
  },
  {
    year: "2000s+",
    period: "Era Moderna",
    title: "Madeusa De La Passion: O Advogado de Inverno da Companhia",
    summary: "Madeusa De La Passion, advogado sazonal que só atua no inverno (temperatura <= 18°C). Revisa contratos em superposição e impugna agendas com 9 tópicos inúteis.",
    document: "MADEUSA-DE-LA-PASSION.md",
    anchor: null,
    icon: "⚖️🧥",
    color: "green"
  },
  {
    year: "2000s+",
    period: "Era Moderna",
    title: "Jão Bolão: O Ferreiro que Todo Mundo Jura Ser Anão (Mas é do Tamanho Normal)",
    summary: "Jão Bolão, construtor de equipamentos do QEL@0xpblab que trabalha na Forja Δ. Constrói artefatos operacionais que impedem o universo de virar reunião, incluindo o carimbo de metal, catraca anti-superposição e o martelo BOLÃO-1.",
    document: "JAO-BOLAO.md",
    anchor: null,
    icon: "⚒️🧱",
    color: "green"
  },
  {
    year: "2000s+",
    period: "Era Moderna",
    title: "Marcitus Markitus: O Homem que Vê \"CASO\" em Tudo (Até em Slide)",
    summary: "Marcitus Markitus, analista de \"casos\" (românticos, criminais e de uso) do QEL@0xpblab. Transforma PDF em romance e romance em inquérito. Acredita que o CEO teve um \"caso\" com a esposa de um gago bêbado do espaço quântico (confundiu \"caso de uso\" com \"caso amoroso\").",
    document: "MARCITUS-MARKITUS.md",
    anchor: null,
    icon: "🕵️‍♂️🧷",
    color: "green"
  },
  {
    year: "Através dos Anos",
    period: "Contínuo",
    title: "Dossiê de Vilões: O Quarteto da Impossibilidade",
    summary: "Quatro antagonistas que tornam a ciência tecnicamente correta e inútil: Willy Xarzenegger, Condessa Zeno von Retardo, Dr. Null Quorum e Sra. Laplace.",
    document: "VILLAINS.md",
    anchor: null,
    icon: "🦹",
    color: "orange"
  }
];

// Timeline Cronológica (English)
const timelineEN = [
  {
    year: "1931",
    period: "Pre-Foundation",
    title: "Vienna Agreement on Legal Uncertainty",
    summary: "QEL@0xpblab appears as a footnote in correspondence. A group of jurists attempts to 'sue' the Uncertainty Principle for being 'deliberately vague'.",
    document: "qel.md",
    anchor: "acordo-viena",
    icon: "📜",
    color: "violet"
  },
  {
    year: "1932",
    period: "Pre-Foundation",
    title: "Pablo Mu-R4d becomes President & CEO",
    summary: "Since 1932, QEL@0xpblab's President & CEO has been Pablo Mu-R4d — and, in a way that is perfectly consistent with the lab's quantum accounting, he is only 38 years old.",
    document: "PABLO-MU-R4D.md",
    anchor: null,
    icon: "👔",
    color: "violet"
  },
  {
    year: "1939-1945",
    period: "World War II",
    title: "Secret Operations of Section Δ-13",
    summary: "QEL@0xpblab operated secretly under the codename Section Δ-13, an 'advanced metrology unit' that never officially existed. Mission: prevent reality from collapsing into the worst possible branch.",
    document: "WWII-OPERATIONS.md",
    anchor: null,
    icon: "🎖️",
    color: "red"
  },
  {
    year: "1947",
    period: "Warm-ish Hot War",
    title: "The Two Greenwich Clocks Crisis",
    summary: "Two atomic clocks, side by side, disagreed as if they had political opinions. QEL@0xpblab's solution: put the clocks in a room and ask them to reach consensus through constructive interference.",
    document: "qel.md",
    anchor: "crise-relogios",
    icon: "🕐",
    color: "cyan"
  },
  {
    year: "1947-1991",
    period: "Warm-ish Hot War",
    title: "The Warm-ish Hot War",
    summary: "QEL@0xpblab never called it the 'Cold War'. For the lab, it was the Warm-ish Hot War: hot enough to melt trust, warm enough to keep everything 'deniable'.",
    document: "COLD-WAR.md",
    anchor: null,
    icon: "❄️🔥",
    color: "cyan"
  },
  {
    year: "1959",
    period: "Warm-ish Hot War",
    title: "The Copenhagen Cube Incident",
    summary: "During a private demonstration in Denmark, a QEL@0xpblab prototype — the famous Copenhagen Cube — was turned on for 11 seconds. Reported occurrences: a hat disappeared and reappeared in a more appropriate place.",
    document: "qel.md",
    anchor: "cubo-copenhagen",
    icon: "📦",
    color: "cyan"
  },
  {
    year: "1969",
    period: "Warm-ish Hot War",
    title: "Gentle Reversion Protocol (Apollo 12)",
    summary: "QEL@0xpblab developed the Gentle Reversion Protocol during the Apollo 12 mission, ensuring that reality would not choose the worst possible branch during critical space operations.",
    document: "qel.md",
    anchor: "apollo-12",
    icon: "🚀",
    color: "cyan"
  },
  {
    year: "1973",
    period: "Official Foundation",
    title: "Official Foundation of QEL@0xpblab",
    summary: "QEL@0xpblab was officially born in 1973, in a windowless basement. The first document — the Unsigned Cat Memo — stated: 'Reality is a distributed system, and observation is a kind of commit.'",
    document: "qel.md",
    anchor: "sobre",
    icon: "🔬",
    color: "green"
  },
  {
    year: "1973",
    period: "Official Foundation",
    title: "Quantum De-Inclusion™",
    summary: "QEL@0xpblab's HR policy that keeps each collaborator included in at least one branch, and excluded in all others — for reasons of human scalability and statistical consistency.",
    document: "DQ.md",
    anchor: null,
    icon: "🏢",
    color: "green"
  },
  {
    year: "1978-1986",
    period: "Warm-ish Hot War",
    title: "The Entanglement Cold War",
    summary: "Period of intense QEL@0xpblab activity during the Warm-ish Hot War, with development of entanglement protocols and minimum diplomatic noise.",
    document: "COLD-WAR.md",
    anchor: "guerra-emaranhamento",
    icon: "🔗",
    color: "cyan"
  },
  {
    year: "1983",
    period: "Warm-ish Hot War",
    title: "The 'True Enough' Incident",
    summary: "One of the most critical incidents of the Warm-ish Hot War, where QEL@0xpblab had to intervene to prevent a global-scale reality collapse.",
    document: "COLD-WAR.md",
    anchor: "incidente-1983",
    icon: "⚠️",
    color: "cyan"
  },
  {
    year: "1980s-1990s",
    period: "Modern Era",
    title: "TV Programs (Communication Experiments)",
    summary: "QEL@0xpblab produced (or allegedly produced) various TV programs, which the lab insists on calling 'mass communication experiments'.",
    document: "TV-PROGRAMS.md",
    anchor: null,
    icon: "📺",
    color: "green"
  },
  {
    year: "1997",
    period: "Modern Era",
    title: "Kyoto Conference on Cultural Decoherence",
    summary: "Event that formalized QEL@0xpblab's thesis on cultural decoherence and marked the official end of the Warm-ish Hot War.",
    document: "qel.md",
    anchor: "kyoto",
    icon: "🌍",
    color: "green"
  },
  {
    year: "2000s+",
    period: "Modern Era",
    title: "The Arrival of the Prophet ~~Ri~~ck with Fu Monilson",
    summary: "The arrival of the prophet with Fu Monilson and the Controlled Amplification Protocol, an evolution of previous protocols to combat the four villains of the Impossibility Quartet.",
    document: "FU-MONILSON.md",
    anchor: null,
    icon: "🔮🎸",
    color: "green"
  },
  {
    year: "2000s+",
    period: "Modern Era",
    title: "The Interdimensional Whiteboard Auditor",
    summary: "The Interdimensional Whiteboard Auditor and its eternal war against π. An entity that ensures mathematics remains consistent, even when reality doesn't want to.",
    document: "QEL-PACOTE-EXTRAS.md",
    anchor: null,
    icon: "🧾🌀",
    color: "green"
  },
  {
    year: "2000s+",
    period: "Modern Era",
    title: "John Aunt-Bet: The German-Swiss Anti-Sugar Operator",
    summary: "John Aunt-Bet, a German-Swiss collaborator who refuses desserts and maintains insulin as a coherence artifact. Special protection against Mrs. Laplace's 'certainty sweets'.",
    document: "JOHN-AUNT-BET.md",
    anchor: null,
    icon: "🍬🚫",
    color: "green"
  },
  {
    year: "2000s+",
    period: "Modern Era",
    title: "Gaybe-EL: The Mullet-Barbed Maestro of the Company Orchestra",
    summary: "Gaybe-EL, an executive-musical entity who conducts the Company Orchestra in 7/8 time. Corporate implementation of the Amplification Protocol that transforms meetings into musical performances.",
    document: "GAYBE-EL.md",
    anchor: null,
    icon: "🎻🧔🐟",
    color: "green"
  },
  {
    year: "2000s+",
    period: "Modern Era",
    title: "Madeusa De La Passion: The Company's Winter-Only Lawyer",
    summary: "Madeusa De La Passion, the seasonal lawyer who only practices in winter (temperature <= 18°C). Reviews contracts in superposition and files injunctions against agendas with nine useless topics.",
    document: "MADEUSA-DE-LA-PASSION.md",
    anchor: null,
    icon: "⚖️🧥",
    color: "green"
  },
  {
    year: "2000s+",
    period: "Modern Era",
    title: "Jão Bolão: The \"Forge Dwarf\" Everyone Swears Exists (But He's Normal-Sized)",
    summary: "Jão Bolão, QEL@0xpblab's equipment builder who works in Forge Δ. Builds operational artifacts that stop the universe from turning into meetings, including the metal stamp, anti-superposition turnstile, and BOLÃO-1 hammer.",
    document: "JAO-BOLAO.md",
    anchor: null,
    icon: "⚒️🧱",
    color: "green"
  },
  {
    year: "2000s+",
    period: "Modern Era",
    title: "Marcitus Markitus: The Man Who Sees \"A CASE\" in Everything (Even in Slides)",
    summary: "Marcitus Markitus, case analyst (romantic cases, criminal cases, and use cases) at QEL@0xpblab. Turns PDFs into soap operas and soap operas into investigations. Believes the CEO had an \"affair\" with the wife of a drunk, stuttering guy from quantum space (confused \"use case\" with \"romantic case\").",
    document: "MARCITUS-MARKITUS.md",
    anchor: null,
    icon: "🕵️‍♂️🧷",
    color: "green"
  },
  {
    year: "Throughout the Years",
    period: "Continuous",
    title: "Villains Dossier: The Impossibility Quartet",
    summary: "Four antagonists that make science technically correct and useless: Willy Xarzenegger, Countess Zeno von Retardo, Dr. Null Quorum, and Mrs. Laplace.",
    document: "VILLAINS.md",
    anchor: null,
    icon: "🦹",
    color: "orange"
  }
];

// Carregar marked.js dinamicamente
let markedLoaded = false;

function loadMarked() {
  return new Promise((resolve, reject) => {
    if (markedLoaded) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = MARKED_CDN;
    script.onload = () => {
      markedLoaded = true;
      // Configurar marked.js para gerar IDs nos títulos
      if (typeof marked !== 'undefined') {
        marked.setOptions({
          headerIds: true,
          mangle: false,
          headerPrefix: ''
        });
      }
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Sistema de roteamento simples
const routes = {
  '/': 'index',
  '/qel': 'qel.md',
  '/characters': 'CHARACTERS.md',
  '/pablo': 'PABLO-MU-R4D.md',
  '/cold-war': 'COLD-WAR.md',
  '/tv-programs': 'TV-PROGRAMS.md',
  '/villains': 'VILLAINS.md',
  '/wwii': 'WWII-OPERATIONS.md',
  '/fu-monilson': 'FU-MONILSON.md',
  '/dq': 'DQ.md',
  '/extras': 'QEL-PACOTE-EXTRAS.md',
  '/completo': 'QEL-PACOTE-COMPLETO.md',
  '/john': 'JOHN-AUNT-BET.md',
  '/gaybe-el': 'GAYBE-EL.md',
  '/lore-gaybe-el-pixitos': 'LORE-GAYBE-EL-PIXITOS-PT.md',
  '/madeusa': 'MADEUSA-DE-LA-PASSION.md',
  '/jao-bolao': 'JAO-BOLAO.md',
  '/marcitus-markitus': 'MARCITUS-MARKITUS.md',
  '/marcelo': 'HISTORIA-MARCELO-MARMELO-MARTELO-PT.md',
  '/old-ed': 'PERSONAGEM-OLD-ED-EDUARDO-FONTOURA-PT.md',
  '/gorossario': 'GOROSSARIO-PT.md',
  '/contact': 'CONTACT.md',
  '/sigil': 'OCCULT_GAME' // Easter egg: Ritual Terminal
};

// Função para atualizar URL sem recarregar página
function updateURL(path) {
  const basePath = getBasePath();
  const fullPath = basePath + (path === '/' ? '' : path);
  window.history.pushState({ path }, '', fullPath || basePath + '/');
}

// Função para carregar e renderizar markdown
async function loadDocument(filename) {
  const main = document.querySelector('main');
  main.innerHTML = `<div class="loading"><div class="spinner"></div><p>${t('ui.loading')}</p></div>`;

  try {
    await loadMarked();
    
    const docsPath = getDocsPath();
    const fullPath = `${docsPath}${filename}`;
    console.log('Tentando carregar:', fullPath);
    
    const response = await fetch(fullPath);
    if (!response.ok) {
      console.error('Erro ao carregar:', fullPath, response.status, response.statusText);
      throw new Error(`${t('ui.error')}: ${response.status} ${response.statusText}`);
    }
    
    const markdown = await response.text();
    
    // Criar estrutura do documento
    const docTitle = extractTitle(markdown);
    
    // Remover o primeiro H1 do markdown para evitar duplicação
    const markdownWithoutFirstH1 = markdown.replace(/^#\s+.+$/m, '').trim();
    const html = marked.parse(markdownWithoutFirstH1);
    
    const breadcrumbs = createBreadcrumbs(filename);
    
    main.innerHTML = `
      <div class="document-container">
        <div class="document-header">
          ${breadcrumbs}
          <h1>${docTitle}</h1>
        </div>
        <div class="markdown-content">
          ${html}
        </div>
      </div>
    `;
    
    // Processar IDs nos títulos primeiro
    processHeadingIds();
    
    // Processar links internos
    processInternalLinks();
    processImages();
    
    // Processar e executar scripts no conteúdo
    processScripts();
    
    // Processar tabelas para responsividade
    processTables();
    
  } catch (error) {
    main.innerHTML = `
      <div class="document-container">
        <h1>${t('ui.error')}</h1>
        <p style="color: var(--red);">${error.message}</p>
        <p><a href="/" onclick="navigate('/'); return false;">← ${t('ui.back')}</a></p>
      </div>
    `;
  }
}

// Extrair título do markdown
function extractTitle(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].replace(/[🔮🎸🧾🌀🍬🚫🏢👔🦹❄️🔥🎖️📺]/g, '').trim() : 'Documento';
}

// Criar breadcrumbs
function createBreadcrumbs(filename) {
  const docName = filename.replace('.md', '').replace(/-/g, ' ').toUpperCase();
  return `
    <div class="breadcrumbs">
      <a href="/" onclick="navigate('/'); return false;">${t('nav.home')}</a> / 
      <span>${docName}</span>
    </div>
  `;
}

// Gerar ID a partir do texto do título
function generateHeadingId(text) {
  if (!text) return '';
  
  // Remover emojis e caracteres especiais
  let id = text.replace(/[\u{1F300}-\u{1F9FF}]/gu, ''); // Emojis Unicode
  id = id.replace(/[🔮🎸🧾🌀🍬🚫🏢👔🦹❄️🔥🎖️📺]/g, ''); // Emojis específicos
  id = id.replace(/[^\w\s-]/g, ''); // Remover caracteres especiais exceto hífen e underscore
  
  // Converter para minúsculas e substituir espaços por hífens
  id = id.toLowerCase().trim();
  id = id.replace(/\s+/g, '-');
  id = id.replace(/-+/g, '-'); // Múltiplos hífens viram um só
  id = id.replace(/^-+|-+$/g, ''); // Remover hífens no início e fim
  
  return id;
}

// Processar títulos e adicionar IDs
function processHeadingIds() {
  const headings = document.querySelectorAll('.markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4, .markdown-content h5, .markdown-content h6');
  
  headings.forEach(heading => {
    // Se já tem ID, pular
    if (heading.id) return;
    
    // Gerar ID baseado no texto do título
    const text = heading.textContent || heading.innerText;
    let id = generateHeadingId(text);
    
    // Se o ID está vazio, usar um fallback
    if (!id) {
      id = 'heading-' + Math.random().toString(36).substr(2, 9);
    }
    
    // Garantir que o ID é único
    let uniqueId = id;
    let counter = 1;
    while (document.getElementById(uniqueId)) {
      uniqueId = `${id}-${counter}`;
      counter++;
    }
    
    heading.id = uniqueId;
  });
}

// Processar links internos para usar roteamento
function processInternalLinks() {
  // Processar TODOS os links que podem ser documentos markdown
  // Isso inclui: .md, .md#, thehistory/..., e links relativos
  const allLinks = document.querySelectorAll('.markdown-content a[href]');
  
  allLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Ignorar links externos (http, https, mailto, etc)
    // Mas processar links que começam com # (âncoras)
    if (href.match(/^(https?|mailto|ftp):/i)) {
      return;
    }
    
    // Links que começam com # serão processados na seção de âncoras abaixo
    if (href.startsWith('#')) {
      return; // Será processado depois
    }
    
    // Processar links que começam com / (rotas)
    if (href.startsWith('/')) {
      const routePath = href.split('#')[0];
      const anchor = href.includes('#') ? href.split('#').slice(1).join('#') : null;
      
      // Verificar se é uma rota conhecida
      if (routes[routePath]) {
        link.setAttribute('href', href);
        link.onclick = (e) => {
          e.preventDefault();
          navigate(routePath, anchor);
        };
        return;
      }
    }
    
    // Processar links que apontam para arquivos .md
    if (href.includes('.md')) {
      processMarkdownLink(link, href);
      return;
    }
    
    // Processar links que começam com thehistory/
    if (href.startsWith('thehistory/')) {
      processMarkdownLink(link, href);
      return;
    }
    
    // Processar links relativos que podem ser markdown (sem extensão explícita)
    // Isso é menos comum, mas pode acontecer
    if (href.startsWith('./') || (!href.startsWith('/') && !href.startsWith('http') && !href.startsWith('#'))) {
      // Verificar se o link pode ser um arquivo markdown
      const possibleFiles = Object.values(routes).filter(f => f.endsWith('.md'));
      const hrefWithoutAnchor = href.split('#')[0];
      const possibleMatch = possibleFiles.find(f => 
        f.toLowerCase() === hrefWithoutAnchor.toLowerCase() || 
        f.toLowerCase().replace('.md', '') === hrefWithoutAnchor.toLowerCase()
      );
      
      if (possibleMatch) {
        processMarkdownLink(link, possibleMatch + (href.includes('#') ? '#' + href.split('#')[1] : ''));
        return;
      }
    }
  });
  
  // Processar links com âncoras (incluindo links do índice)
  const anchorLinks = document.querySelectorAll('.markdown-content a[href^="#"]');
  anchorLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Normalizar âncora: remover hífen inicial se presente (#-sobre -> #sobre)
    let anchor = href.substring(1); // Remove o #
    if (anchor.startsWith('-')) {
      anchor = anchor.substring(1); // Remove o hífen inicial
    }
    
    // Remover emojis e caracteres especiais da âncora para busca
    anchor = normalizeAnchor(anchor);
    
    if (anchor) {
      // Tentar encontrar o elemento por ID exato ou variações
      link.onclick = (e) => {
        e.preventDefault();
        scrollToAnchor(anchor);
      };
      
      // Atualizar href para formato normalizado
      link.setAttribute('href', `#${anchor}`);
    }
  });
}

// Função auxiliar para processar links markdown
function processMarkdownLink(link, href) {
  let filename = href;
  let anchor = null;
  
  // Separar arquivo e âncora
  if (href.includes('#')) {
    const parts = href.split('#');
    filename = parts[0];
    anchor = parts.slice(1).join('#'); // Em caso de múltiplos #
  }
  
  // Remover caminho thehistory/ se presente
  if (filename.startsWith('thehistory/')) {
    filename = filename.replace('thehistory/', '');
  }
  
  // Remover caminhos relativos
  filename = filename.split('/').pop();
  
  // Mapear README.md para qel.md
  if (filename === 'README.md' || filename.toLowerCase() === 'readme.md') {
    filename = 'qel.md';
  }
  
  // Buscar rota correspondente
  const route = Object.keys(routes).find(key => {
    const routeFile = routes[key];
    return routeFile === filename || 
           routeFile.toLowerCase() === filename.toLowerCase() ||
           routeFile.replace('.md', '').toLowerCase() === filename.replace('.md', '').toLowerCase();
  });
  
  if (route) {
    // Normalizar âncora se presente
    let normalizedAnchor = anchor;
    if (normalizedAnchor) {
      normalizedAnchor = normalizeAnchor(normalizedAnchor);
    }
    
    const newHref = normalizedAnchor ? `${route}#${normalizedAnchor}` : route;
    link.setAttribute('href', newHref);
    link.onclick = (e) => {
      e.preventDefault();
      navigate(route, normalizedAnchor);
    };
  } else {
    // Link para arquivo que não está no sistema de rotas (ex: LICENSE.md)
    // Tentar carregar diretamente se estiver na pasta thehistory
    const docsPath = getDocsPath();
    const fullPath = `${docsPath}${filename}`;
    
    // Verificar se é um arquivo markdown que pode ser carregado
    if (filename.endsWith('.md')) {
      link.onclick = async (e) => {
        e.preventDefault();
        try {
          // Tentar carregar o arquivo diretamente
          await loadDocument(filename);
          if (anchor) {
            setTimeout(() => {
              scrollToAnchor(normalizeAnchor(anchor));
            }, 200);
          }
        } catch (error) {
          console.warn('Não foi possível carregar arquivo:', filename, error);
          // Se falhar, manter comportamento padrão
          window.location.href = fullPath;
        }
      };
    }
    // Se não for markdown ou não conseguir carregar, manter comportamento padrão
  }
}

// Função para normalizar âncoras (remover emojis, caracteres especiais, etc)
function normalizeAnchor(anchor) {
  if (!anchor) return '';
  
  // Remover hífen inicial se presente
  let normalized = anchor.startsWith('-') ? anchor.substring(1) : anchor;
  
  // Remover emojis Unicode
  normalized = normalized.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
  
  // Remover emojis específicos comuns
  normalized = normalized.replace(/[🔮🎸🧾🌀🍬🚫🏢👔🦹❄️🔥🎖️📺1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣]/g, '');
  
  // Remover caracteres especiais exceto hífen, underscore e números
  normalized = normalized.replace(/[^\w\s-]/g, '');
  
  // Converter para minúsculas e substituir espaços por hífens
  normalized = normalized.toLowerCase().trim();
  normalized = normalized.replace(/\s+/g, '-');
  normalized = normalized.replace(/-+/g, '-'); // Múltiplos hífens viram um só
  normalized = normalized.replace(/^-+|-+$/g, ''); // Remover hífens no início e fim
  
  return normalized;
}

// Função auxiliar para fazer scroll até uma âncora
function scrollToAnchor(anchor) {
  if (!anchor) return;
  
  // Normalizar a âncora primeiro
  const normalizedAnchor = normalizeAnchor(anchor);
  
  // Tentar múltiplas variações do ID
  const variations = [
    normalizedAnchor,
    anchor, // Original também
    anchor.toLowerCase(),
    anchor.replace(/^-/, ''), // Sem hífen inicial
    anchor.replace(/^-/, '').toLowerCase(),
    // Tentar com diferentes normalizações
    anchor.replace(/[🔮🎸🧾🌀🍬🚫🏢👔🦹❄️🔥🎖️📺1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣]/g, '').toLowerCase().trim(),
    anchor.replace(/[^\w\s-]/g, '').toLowerCase().trim()
  ];
  
  // Remover duplicatas
  const uniqueVariations = [...new Set(variations.filter(v => v))];
  
  let element = null;
  for (const variation of uniqueVariations) {
    // Tentar ID exato
    element = document.getElementById(variation);
    if (element) break;
    
    // Tentar buscar por atributo id que contenha o anchor (case-insensitive)
    element = Array.from(document.querySelectorAll('[id]')).find(el => {
      const id = el.id.toLowerCase();
      const varLower = variation.toLowerCase();
      return id === varLower || 
             id.includes(varLower) || 
             varLower.includes(id) ||
             id.replace(/[^\w-]/g, '') === varLower.replace(/[^\w-]/g, '');
    });
    if (element) break;
  }
  
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Atualizar URL sem recarregar
    const currentPath = window.location.pathname;
    const basePath = getBasePath();
    let normalizedPath = currentPath;
    if (basePath && currentPath.startsWith(basePath)) {
      normalizedPath = currentPath.substring(basePath.length) || '/';
    }
    window.history.pushState({ path: normalizedPath, anchor: normalizedAnchor }, '', `${currentPath}#${normalizedAnchor}`);
  } else {
    console.warn('Âncora não encontrada:', anchor, 'Variações tentadas:', uniqueVariations);
  }
}

// Processar imagens
function processImages() {
  const images = document.querySelectorAll('.markdown-content img');
  images.forEach(img => {
    const src = img.getAttribute('src');
    if (src && !src.startsWith('http') && !src.startsWith('/') && !src.startsWith('../')) {
      // Ajustar caminho relativo - imagens em img/ devem apontar para ../img/
      if (src.startsWith('img/')) {
        img.setAttribute('src', `../${src}`);
      } else if (src.includes('img/')) {
        // Se o caminho contém img/ mas não começa com ele
        img.setAttribute('src', `../${src}`);
      }
    }
  });
}

// Processar e executar scripts no conteúdo markdown
function processScripts() {
  const markdownContent = document.querySelector('.markdown-content');
  if (!markdownContent) return;
  
  // Encontrar todos os scripts no conteúdo
  const scripts = markdownContent.querySelectorAll('script');
  
  scripts.forEach(oldScript => {
    // Criar novo script
    const newScript = document.createElement('script');
    
    // Copiar atributos
    Array.from(oldScript.attributes).forEach(attr => {
      newScript.setAttribute(attr.name, attr.value);
    });
    
    // Copiar conteúdo se houver
    if (oldScript.textContent) {
      newScript.textContent = oldScript.textContent;
    }
    
    // Substituir o script antigo pelo novo (que será executado)
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
  
  // Processar variáveis globais definidas por scripts (como NekoType)
  // Isso é necessário porque alguns scripts definem variáveis antes de serem carregados
  const inlineScripts = markdownContent.querySelectorAll('script:not([src])');
  inlineScripts.forEach(script => {
    try {
      // Executar código inline
      const code = script.textContent || script.innerHTML;
      if (code) {
        // Criar função para executar no contexto global
        const func = new Function(code);
        func();
      }
    } catch (e) {
      console.warn('Erro ao executar script inline:', e);
    }
  });
}

// Processar tabelas para responsividade (adicionar wrapper para scroll)
function processTables() {
  const markdownContent = document.querySelector('.markdown-content');
  if (!markdownContent) return;
  
  const tables = markdownContent.querySelectorAll('table');
  
  tables.forEach(table => {
    // Verificar se já está envolvida em um wrapper
    if (table.parentElement && table.parentElement.classList.contains('table-wrapper')) {
      return;
    }
    
    // Criar wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    
    // Inserir wrapper antes da tabela
    table.parentNode.insertBefore(wrapper, table);
    
    // Mover tabela para dentro do wrapper
    wrapper.appendChild(table);
  });
}

// Função de navegação
function navigate(path, anchor = null) {
  const basePath = getBasePath();
  // Remover base path se presente no path recebido
  let normalizedPath = path;
  if (basePath && path.startsWith(basePath)) {
    normalizedPath = path.substring(basePath.length) || '/';
  }
  
  // Normalizar âncora se presente (remover hífen inicial)
  let normalizedAnchor = anchor;
  if (normalizedAnchor && normalizedAnchor.startsWith('-')) {
    normalizedAnchor = normalizedAnchor.substring(1);
  }
  
  updateURL(normalizedPath);
  
  if (normalizedPath === '/' || normalizedPath === '') {
    showIndex();
    // Se há âncora, tentar fazer scroll após renderizar
    if (normalizedAnchor) {
      setTimeout(() => scrollToAnchor(normalizedAnchor), 200);
    }
  } else {
    stopQuantumClock();
    const filename = routes[normalizedPath];
    if (filename === 'OCCULT_GAME') {
      // Easter egg: Ritual Terminal
      const main = document.querySelector('main');
      if (main && typeof window.initOccultGame === 'function') {
        main.innerHTML = '<div class="loading"><div class="spinner"></div><p>Inicializando ritual...</p></div>';
        setTimeout(() => {
          window.occultGameInstance = window.initOccultGame({
            mountEl: main,
            lang: currentLang,
            navigate: navigate
          });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      } else {
        console.error('Occult game not loaded');
        showIndex();
      }
    } else if (filename) {
      // Ajustar nome do arquivo baseado no idioma para arquivos com versões PT/EN
      let actualFilename = filename;
      if (filename === 'LORE-GAYBE-EL-PIXITOS-PT.md') {
        actualFilename = currentLang === 'en' ? 'LORE-GAYBE-EL-PIXITOS-EN.md' : 'LORE-GAYBE-EL-PIXITOS-PT.md';
      }
      
      loadDocument(actualFilename).then(() => {
        if (normalizedAnchor) {
          // Aguardar um pouco mais para garantir que os IDs foram processados
          setTimeout(() => {
            scrollToAnchor(normalizedAnchor);
          }, 200);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    } else {
      showIndex();
      if (normalizedAnchor) {
        setTimeout(() => scrollToAnchor(normalizedAnchor), 200);
      }
    }
  }
}

  // Renderizar Timeline Cronológica
function renderTimeline() {
  const main = document.querySelector('main');
  const currentTimeline = currentLang === 'en' ? timelineEN : timeline;
  
  // Inicializar relógio quântico quando renderizar a timeline (home)
  initQuantumClock();
  
  let timelineHTML = '<div class="timeline-container">';
  timelineHTML += `<div class="timeline-header"><h1>${t('timeline.title')}</h1><p class="timeline-subtitle">${t('timeline.subtitle')}</p></div>`;
  timelineHTML += '<div class="timeline-wrapper">';
  
  let currentPeriod = '';
  
  currentTimeline.forEach((event, index) => {
    // Adicionar separador de período se mudou
    if (event.period !== currentPeriod) {
      if (currentPeriod !== '') {
        timelineHTML += '</div>'; // Fechar período anterior
      }
      currentPeriod = event.period;
      timelineHTML += `<div class="timeline-period" data-period="${event.period}">`;
      timelineHTML += `<div class="period-header"><h2>${event.period}</h2></div>`;
    }
    
    const eventId = `event-${index}`;
    const route = Object.keys(routes).find(key => routes[key] === event.document);
    const routePath = route || '/';
    
    timelineHTML += `
      <div class="timeline-event ${event.color}" id="${eventId}">
        <div class="timeline-marker">
          <div class="marker-dot"></div>
          <div class="marker-line"></div>
        </div>
        <div class="timeline-content">
          <div class="event-header">
            <span class="event-year">${event.year}</span>
            <span class="event-icon">${event.icon}</span>
            <h3 class="event-title">${event.title}</h3>
          </div>
          <div class="event-summary">
            <p>${event.summary}</p>
          </div>
          <div class="event-actions">
            <button class="btn-expand" onclick="toggleEvent('${eventId}', '${event.document}', ${index})">
              <span class="expand-text">${t('timeline.expand')}</span>
              <span class="collapse-text" style="display: none;">${t('timeline.collapse')}</span>
            </button>
            ${route ? `<a href="${routePath}" class="btn-view" onclick="navigate('${routePath}'); return false;">${t('timeline.viewDoc')}</a>` : ''}
          </div>
          <div class="event-content" id="content-${eventId}" style="display: none;">
            <div class="loading-content">
              <div class="spinner-small"></div>
              <p>${t('ui.loadingContent')}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  
  timelineHTML += '</div>'; // Fechar último período
  timelineHTML += '</div>'; // Fechar timeline-wrapper
  timelineHTML += '</div>'; // Fechar timeline-container
  
  main.innerHTML = timelineHTML;
  
  // Verificar se há âncora na URL após renderizar
  setTimeout(() => {
    const hash = window.location.hash;
    if (hash) {
      const anchorId = hash.substring(1);
      const eventElement = document.getElementById(anchorId);
      if (eventElement) {
        eventElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Expandir automaticamente se houver hash
        const contentDiv = document.getElementById(`content-${anchorId}`);
        if (contentDiv && contentDiv.style.display === 'none') {
          const expandBtn = eventElement.querySelector('.btn-expand');
          if (expandBtn) {
            setTimeout(() => expandBtn.click(), 300);
          }
        }
      }
    }
  }, 100);
}

// Alternar expansão de evento
async function toggleEvent(eventId, documentName, index) {
  const contentDiv = document.getElementById(`content-${eventId}`);
  if (!contentDiv) return;
  
  const expandBtn = document.querySelector(`#${eventId} .btn-expand`);
  if (!expandBtn) return;
  
  const expandText = expandBtn.querySelector('.expand-text');
  const collapseText = expandBtn.querySelector('.collapse-text');
  const currentTimeline = currentLang === 'en' ? timelineEN : timeline;
  
  if (contentDiv.style.display === 'none' || !contentDiv.style.display) {
    // Expandir
    contentDiv.style.display = 'block';
    if (expandText) expandText.style.display = 'none';
    if (collapseText) collapseText.style.display = 'inline';
    
    // Carregar conteúdo se ainda não foi carregado
    if (contentDiv.querySelector('.loading-content')) {
      try {
        await loadEventContent(eventId, documentName, index);
      } catch (error) {
        console.error('Erro ao carregar conteúdo:', error);
      }
    }
    
    // Scroll suave para o conteúdo expandido
    setTimeout(() => {
      contentDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  } else {
    // Recolher
    contentDiv.style.display = 'none';
    if (expandText) expandText.style.display = 'inline';
    if (collapseText) collapseText.style.display = 'none';
  }
}

// Carregar conteúdo do evento
async function loadEventContent(eventId, documentName, index) {
  const contentDiv = document.getElementById(`content-${eventId}`);
  const currentTimeline = currentLang === 'en' ? timelineEN : timeline;
  const event = currentTimeline[index];
  
  try {
    await loadMarked();
    
    const docsPath = getDocsPath();
    const fullPath = `${docsPath}${documentName}`;
    console.log('Tentando carregar conteúdo do evento:', fullPath);
    
    const response = await fetch(fullPath);
    if (!response.ok) {
      console.error('Erro ao carregar conteúdo:', fullPath, response.status, response.statusText);
      throw new Error(`${t('ui.errorContent')}: ${response.status} ${response.statusText}`);
    }
    
    const markdown = await response.text();
    
    // Remover o primeiro H1 do markdown para evitar duplicação (já temos o título do evento)
    const markdownWithoutFirstH1 = markdown.replace(/^#\s+.+$/m, '').trim();
    let html = marked.parse(markdownWithoutFirstH1);
    
    // Se há âncora específica, tentar extrair apenas essa seção
    if (event.anchor) {
      // Criar um elemento temporário para processar o HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Procurar pela seção com o ID ou texto relacionado
      let anchorElement = tempDiv.querySelector(`#${event.anchor}`);
      if (!anchorElement) {
        // Tentar encontrar por atributo id que contenha o anchor
        anchorElement = Array.from(tempDiv.querySelectorAll('[id]')).find(el => 
          el.id.includes(event.anchor) || el.id.toLowerCase().includes(event.anchor.toLowerCase())
        );
      }
      
      if (anchorElement) {
        // Extrair a seção relevante (do elemento até o próximo H1/H2 ou fim)
        let sectionHTML = '';
        let current = anchorElement;
        const parent = anchorElement.parentElement || tempDiv;
        
        // Se o elemento é um heading, incluir ele e tudo até o próximo heading
        if (['H1', 'H2', 'H3'].includes(anchorElement.tagName)) {
          sectionHTML = anchorElement.outerHTML;
          current = anchorElement.nextElementSibling;
          while (current && current !== parent) {
            if (['H1', 'H2'].includes(current.tagName)) {
              break;
            }
            sectionHTML += current.outerHTML;
            current = current.nextElementSibling;
          }
        } else {
          // Se não é heading, incluir o elemento e seus irmãos até próximo heading
          sectionHTML = anchorElement.outerHTML;
          current = anchorElement.nextElementSibling;
          while (current && current !== parent) {
            if (['H1', 'H2'].includes(current.tagName)) {
              break;
            }
            sectionHTML += current.outerHTML;
            current = current.nextElementSibling;
          }
        }
        
        if (sectionHTML) {
          html = sectionHTML;
        }
      }
    }
    
    contentDiv.innerHTML = `
      <div class="markdown-content">
        ${html}
      </div>
    `;
    
    // Processar IDs nos títulos primeiro
    processHeadingIds();
    
    // Processar links e imagens no conteúdo carregado
    processInternalLinks();
    processImages();
    
    // Processar e executar scripts no conteúdo
    processScripts();
    
    // Processar tabelas para responsividade
    processTables();
    
  } catch (error) {
    contentDiv.innerHTML = `
      <div class="error-content">
        <p style="color: var(--red);">${t('ui.errorContent')}: ${error.message}</p>
      </div>
    `;
  }
}

// Função de troca de idioma
function switchLanguage(lang) {
  if (lang === currentLang) return;
  
  setCurrentLang(lang);
  updateLangButtons();
  updateNavigation();
  updateFooter();
  updateSubtitle();
  updateClockTooltip(); // Atualizar tooltip do relógio
  
  // Se estiver no jogo oculto, atualizar idioma do jogo
  if (window.occultGameInstance && typeof window.occultGameInstance.updateLanguage === 'function') {
    window.occultGameInstance.updateLanguage(lang);
    return; // Não navegar, apenas atualizar idioma
  }
  
  // Recarregar página atual no novo idioma
  const path = window.location.pathname || '/';
  navigate(path);
}

// Atualizar botões de idioma
function updateLangButtons() {
  const btnPT = document.getElementById('lang-pt');
  const btnEN = document.getElementById('lang-en');
  
  if (btnPT && btnEN) {
    if (currentLang === 'pt') {
      btnPT.classList.add('active');
      btnEN.classList.remove('active');
    } else {
      btnPT.classList.remove('active');
      btnEN.classList.add('active');
    }
  }
}

// Atualizar navegação
function updateNavigation() {
  const navLinks = document.querySelectorAll('nav a');
  const navMap = {
    'Início': 'nav.home',
    'História': 'nav.history',
    'Personagens': 'nav.characters',
    'Contato': 'nav.contact',
    'Pablo Mu-R4d': 'nav.pablo',
    'Vilões': 'nav.villains',
    'Profeta': 'nav.prophet',
    'John Aunt-Bet': 'nav.john',
    'Orquestra': 'nav.gaybe',
    'Advogado': 'nav.madeusa',
    'Ferreiro': 'nav.jao',
    'Analista': 'nav.marcitus',
    'Desinclusão': 'nav.dq',
    'TV': 'nav.tv',
    'Home': 'nav.home',
    'History': 'nav.history',
    'Characters': 'nav.characters',
    'Contact': 'nav.contact',
    'Villains': 'nav.villains',
    'Prophet': 'nav.prophet',
    'De-Inclusion': 'nav.dq',
    'Orchestra': 'nav.gaybe',
    'Lawyer': 'nav.madeusa',
    'Blacksmith': 'nav.jao',
    'Analyst': 'nav.marcitus'
  };
  
  navLinks.forEach(link => {
    const text = link.textContent.trim();
    if (navMap[text]) {
      link.textContent = t(navMap[text]);
    }
  });
}

// Atualizar footer
function updateFooter() {
  const footer = document.querySelector('footer p');
  if (footer) {
    footer.textContent = currentLang === 'en' 
      ? 'graciously lived by Pablo Murad (but not in that way)'
      : 'graciosamente vivido por Pablo Murad (mas não dessa maneira)';
  }
}

// Atualizar subtítulo
function updateSubtitle() {
  const subtitles = document.querySelectorAll('header .subtitle');
  subtitles.forEach(subtitle => {
    if (subtitle && (subtitle.textContent.includes('realidade') || subtitle.textContent.includes('Reality'))) {
      subtitle.textContent = currentLang === 'en'
        ? '"Reality is a distributed system, and observation is a kind of commit."'
        : '"A realidade é um sistema distribuído, e observação é uma forma de commit."';
    }
  });
}

// Relógio Quântico
let quantumClockInterval = null;
let quantumClockEasterEggListeners = null;

function initQuantumClock() {
  const clockContainer = document.getElementById('quantum-clock-container');
  const clockTime = document.getElementById('clock-time');
  
  if (!clockContainer || !clockTime) return;
  
  // Mostrar o relógio
  clockContainer.style.display = 'block';
  
  // Atualizar tooltip
  updateClockTooltip();
  
  // Atualizar o relógio imediatamente
  updateClock();
  
  // Atualizar a cada segundo
  if (quantumClockInterval) {
    clearInterval(quantumClockInterval);
  }
  quantumClockInterval = setInterval(updateClock, 1000);
  
  // Configurar easter egg
  setupQuantumClockEasterEgg();
}

function updateClock() {
  const clockTime = document.getElementById('clock-time');
  if (!clockTime) return;
  
  const now = new Date();
  
  // Adicionar offset aleatório de ±1 hora (em milissegundos)
  const offsetMs = (Math.random() * 2 - 1) * 60 * 60 * 1000; // -1h a +1h
  const quantumTime = new Date(now.getTime() + offsetMs);
  
  // Formatar como HH:MM:SS
  const hours = String(quantumTime.getHours()).padStart(2, '0');
  const minutes = String(quantumTime.getMinutes()).padStart(2, '0');
  const seconds = String(quantumTime.getSeconds()).padStart(2, '0');
  
  clockTime.textContent = `${hours}:${minutes}:${seconds}`;
}

function updateClockTooltip() {
  const clockContainer = document.getElementById('quantum-clock-container');
  if (!clockContainer) return;
  
  const tooltipText = t('clock.tooltip');
  clockContainer.setAttribute('title', tooltipText);
}

function stopQuantumClock() {
  const clockContainer = document.getElementById('quantum-clock-container');
  if (clockContainer) {
    clockContainer.style.display = 'none';
  }
  
  if (quantumClockInterval) {
    clearInterval(quantumClockInterval);
    quantumClockInterval = null;
  }
  
  // Remover easter egg listeners
  removeQuantumClockEasterEgg();
}

// Easter egg do Relógio Quântico
function setupQuantumClockEasterEgg() {
  const clockContainer = document.getElementById('quantum-clock-container');
  if (!clockContainer) return;
  
  // Limpar listeners anteriores se existirem
  removeQuantumClockEasterEgg();
  
  let clickCount = 0;
  let clickTimer = null;
  const CLICK_THRESHOLD = 7;
  const CLICK_TIMEOUT = 4000; // 4 segundos
  
  // Gatilho 1: 7 cliques em 4 segundos
  const clickHandler = () => {
    clickCount++;
    
    // Resetar timer
    if (clickTimer) {
      clearTimeout(clickTimer);
    }
    
    // Se atingiu o threshold, ativar easter egg
    if (clickCount >= CLICK_THRESHOLD) {
      triggerEasterEgg();
      return;
    }
    
    // Resetar contador após timeout
    clickTimer = setTimeout(() => {
      clickCount = 0;
    }, CLICK_TIMEOUT);
  };
  
  // Gatilho 2: Sequência Konami (↑↑↓↓←→←→BA)
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
  let konamiIndex = 0;
  let konamiTimer = null;
  const KONAMI_TIMEOUT = 3000; // 3 segundos para completar sequência
  
  const keyHandler = (e) => {
    // Ignorar se estiver em input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }
    
    const expectedKey = konamiSequence[konamiIndex];
    
    if (e.key === expectedKey || e.code === expectedKey) {
      konamiIndex++;
      
      // Resetar timer
      if (konamiTimer) {
        clearTimeout(konamiTimer);
      }
      
      // Se completou a sequência, ativar easter egg
      if (konamiIndex >= konamiSequence.length) {
        triggerEasterEgg();
        return;
      }
      
      // Resetar após timeout
      konamiTimer = setTimeout(() => {
        konamiIndex = 0;
      }, KONAMI_TIMEOUT);
    } else {
      // Sequência incorreta, resetar
      konamiIndex = 0;
      if (konamiTimer) {
        clearTimeout(konamiTimer);
      }
    }
  };
  
  // Função para ativar easter egg
  function triggerEasterEgg() {
    // Limpar listeners
    removeQuantumClockEasterEgg();
    
    // Exibir hint diegético
    const hintText = currentLang === 'pt' 
      ? 'Um selo foi marcado... O terminal aguarda.'
      : 'A seal has been marked... The terminal awaits.';
    
    const originalTitle = clockContainer.getAttribute('title');
    clockContainer.setAttribute('title', hintText);
    
    // Navegar para /sigil após breve delay
    setTimeout(() => {
      navigate('/sigil');
      // Restaurar tooltip original após navegação
      setTimeout(() => {
        if (clockContainer) {
          clockContainer.setAttribute('title', originalTitle || '');
        }
      }, 1000);
    }, 500);
  }
  
  // Adicionar listeners
  clockContainer.addEventListener('click', clickHandler);
  window.addEventListener('keydown', keyHandler);
  
  // Armazenar referências para remoção
  quantumClockEasterEggListeners = {
    clickHandler,
    keyHandler,
    cleanup: () => {
      if (clickTimer) clearTimeout(clickTimer);
      if (konamiTimer) clearTimeout(konamiTimer);
    }
  };
}

function removeQuantumClockEasterEgg() {
  if (!quantumClockEasterEggListeners) return;
  
  const clockContainer = document.getElementById('quantum-clock-container');
  if (clockContainer && quantumClockEasterEggListeners.clickHandler) {
    clockContainer.removeEventListener('click', quantumClockEasterEggListeners.clickHandler);
  }
  
  if (quantumClockEasterEggListeners.keyHandler) {
    window.removeEventListener('keydown', quantumClockEasterEggListeners.keyHandler);
  }
  
  if (quantumClockEasterEggListeners.cleanup) {
    quantumClockEasterEggListeners.cleanup();
  }
  
  quantumClockEasterEggListeners = null;
}

// Mostrar página inicial (mantida para compatibilidade)
function showIndex() {
  renderTimeline();
  // initQuantumClock() já é chamado dentro de renderTimeline()
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar sistema de idioma
  currentLang = getCurrentLang();
  setCurrentLang(currentLang);
  updateLangButtons();
  updateNavigation();
  updateFooter();
  updateSubtitle();
  
  // Atualizar loading inicial
  const loadingText = document.querySelector('.loading p');
  if (loadingText) {
    loadingText.textContent = t('ui.initializing');
  }
  
  // Verificar rota atual e normalizar
  const pathname = window.location.pathname || '/';
  const basePath = getBasePath();
  let normalizedPath = pathname;
  
  if (basePath) {
    // Se há base path configurado (GitHub Pages)
    if (pathname.startsWith(basePath)) {
      // URL já tem base path, normalizar
      normalizedPath = pathname.substring(basePath.length) || '/';
    } else if (pathname !== '/' && !pathname.startsWith(basePath)) {
      // URL não tem base path mas não é a raiz - REDIRECIONAR
      const fullPath = basePath + (pathname.startsWith('/') ? pathname : '/' + pathname);
      window.history.replaceState({ path: normalizedPath }, '', fullPath);
      // Manter o path original para navegação (já está normalizado)
    }
  } else {
    // Se não há base path, verificar se estamos no GitHub Pages mas o pathname não começa com /
    // Isso pode acontecer se alguém acessar diretamente uma rota sem o base path
    if (window.location.hostname.includes('github.io') && pathname !== '/' && !pathname.startsWith('/')) {
      normalizedPath = '/' + pathname;
    }
  }
  
  navigate(normalizedPath);
  
  // Configurar navegação do browser
  window.addEventListener('popstate', (e) => {
    const pathname = window.location.pathname || '/';
    const basePath = getBasePath();
    let normalizedPath = pathname;
    
    if (basePath && pathname.startsWith(basePath)) {
      normalizedPath = pathname.substring(basePath.length) || '/';
    }
    
    navigate(normalizedPath);
  });
  
  // Configurar navegação por hash (âncoras)
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash) {
      const eventId = hash.substring(1);
      const eventElement = document.getElementById(eventId);
      if (eventElement) {
        eventElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Se o evento não estiver expandido, expandir automaticamente
        const contentDiv = document.getElementById(`content-${eventId}`);
        if (contentDiv && contentDiv.style.display === 'none') {
          const expandBtn = eventElement.querySelector('.btn-expand');
          if (expandBtn) {
            expandBtn.click();
          }
        }
      }
    }
  });
});

// Tornar funções globais
window.navigate = navigate;
window.toggleEvent = toggleEvent;
window.switchLanguage = switchLanguage;