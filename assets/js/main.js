// QEL@0xpblab - JavaScript Principal
// Sistema de navegação e renderização de markdown

// Forçar HTTPS se estiver em HTTP
if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  window.location.replace(window.location.href.replace(/^http:/, 'https:'));
}

// Configuração
const MARKED_CDN = 'https://cdn.jsdelivr.net/npm/marked@11.1.1/marked.min.js';
const LANG_KEY = 'qel_language';
const MARKDOWN_CACHE_KEY = 'qel_markdown_cache_v2';
const MARKDOWN_CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 horas em ms

// Cache de documentos Markdown
let markdownCache = new Map();
let markdownCacheStorage = null;

// Inicializar cache do localStorage
function initMarkdownCache() {
  try {
    const cached = localStorage.getItem(MARKDOWN_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const now = Date.now();
      // Limpar entradas expiradas
      for (const [key, value] of Object.entries(parsed)) {
        if (now - value.timestamp < MARKDOWN_CACHE_EXPIRY) {
          markdownCache.set(key, value.content);
        }
      }
    }
  } catch (e) {
    console.warn('Erro ao carregar cache do localStorage:', e);
  }
}

// Salvar cache no localStorage
function saveMarkdownCache() {
  try {
    const cacheObj = {};
    const now = Date.now();
    for (const [key, content] of markdownCache.entries()) {
      cacheObj[key] = {
        content: content,
        timestamp: now
      };
    }
    localStorage.setItem(MARKDOWN_CACHE_KEY, JSON.stringify(cacheObj));
  } catch (e) {
    console.warn('Erro ao salvar cache no localStorage:', e);
  }
}

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
  // Limpar cache quando o idioma mudar
  cachedDocsPath = null;
  cachedLang = null;
}

function getBasePath() {
  if (cachedBasePath !== null) {
    return cachedBasePath;
  }
  
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  let basePath = '';
  
  // Domínio customizado: não aplicar base path
  if (hostname === 'dlore.org' || hostname === 'www.dlore.org') {
    cachedBasePath = '';
    return '';
  }
  
  if (hostname.includes('github.io')) {
    const repoName = hostname.split('.')[0];
    basePath = `/${repoName}`;
    
    if (pathname.startsWith(`/${repoName}/`) || pathname === `/${repoName}`) {
      cachedBasePath = basePath;
      return basePath;
    }
    cachedBasePath = basePath;
    return basePath;
  }
  
  cachedBasePath = basePath;
  return basePath;
}

// Cache para getDocsPath e getBasePath
let cachedBasePath = null;
let cachedDocsPath = null;
let cachedLang = null;
let cachedSeason = null;

function getDocsPath(season = 1) {
  if (cachedDocsPath && cachedLang === currentLang && cachedBasePath === getBasePath() && cachedSeason === season) {
    return cachedDocsPath;
  }
  
  const basePath = getBasePath();
  const seasonFolder = season === 2 ? 'season-2' : 'season-1';
  const langPath = currentLang === 'en' ? `thehistory/en/${seasonFolder}/` : `thehistory/${seasonFolder}/`;
  
  const fullPath = basePath ? `${basePath}/${langPath}` : langPath;
  
  cachedBasePath = basePath;
  cachedDocsPath = fullPath;
  cachedLang = currentLang;
  cachedSeason = season;
  
  return fullPath;
}

// Traduções
const translations = {
  pt: {
    nav: {
      home: "Início",
      cronologia: "Cronologia",
      history: "História",
      season1: "Temporada 1",
      season2: "Temporada 2",
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
      title: "História do QEL@0xpblab — Temporada 1",
      titleSeason2: "História do QEL@0xpblab — Temporada 2",
      subtitle: "Uma narrativa cronológica da realidade como sistema distribuído",
      subtitleSeason2: "A sirene toca dentro do elevador.",
      expand: "Expandir",
      collapse: "Recolher",
      viewDoc: "Ver Documento Completo →"
    },
    section: {
      cronologiaLabel: "[ CRONOLOGIA ]",
      season1Label: "[ TEMPORADA 1 ] Lore",
      season2Label: "[ TEMPORADA 2 ]",
      charactersLabel: "[ PERSONAGENS ]",
      contactLabel: "[ CONTATO ]",
      contactSummary: "Entre em contato para colaborações, ideias ou um café quântico.",
      viewFullContact: "Ver documento completo →"
    },
    clock: {
      tooltip: "Sincronizado com o relógio atômico da empresa. Pode estar adiantado ou atrasado."
    },
    header: {
      signature: "QEL@0xpblab",
      signatureLine: "# QEL@%>0xpblab // 2026"
    },
    intro: {
      message: "Se você chegou até aqui, talvez tenha notado: esse universo do **QEL@0xpblab** não é só uma fanfic.\n\nEle é um jeito **lúdico** (e deliberadamente exagerado) de eu organizar as coisas que eu vivo — trabalho, ansiedade, ambição, caos, disciplina, família, decisões, erros, recomeços. Eu gosto de pensar a vida como um sistema cheio de *logs*, *incidentes*, *protocolos* e personagens que aparecem pra te cobrar, te proteger, te derrubar ou te salvar.\n\nNa vida real, as coisas raramente vêm com manual. Aqui, eu invento um manual que **ri de mim** e, ao mesmo tempo, me ajuda a não me levar tão a sério.\n\n- Quando eu falo de *ramos*, é porque eu sinto que toda escolha abre um caminho.\n- Quando eu falo de *compliance*, é porque o mundo ama regra — mesmo quando ninguém sabe explicar por quê.\n- Quando eu falo de *profetas*, *fiscais* e *chefes interdimensionais*, é porque existem forças (internas e externas) que parecem gigantes, mesmo quando são só… gente, hábito, medo, trauma, responsabilidade.\n\nEu escrevo assim porque funciona pra mim.\n\nEsse projeto é uma brincadeira,  (ou não) — mas também é um espelho.\nUm espelho sujo, com neon, carimbos e um monte de \"NÃO\" na lousa.\n\nE no meio disso tudo, tem uma coisa bem simples:\n\nEu continuo tentando.\n\nCom humor, com raiva, com sono, com vontade de sumir, com vontade de construir.\nE com a paz estranha de saber que, se eu conseguir transformar meus próprios monstros em personagens, eu consigo conversar com eles.\n\nObrigado por ler, por entrar nesse ramo comigo, e por aceitar que o absurdo às vezes é a forma mais honesta de dizer a verdade.\n\n— **Pablo Murad**\n\n21/01/2026"
    }
  },
  en: {
    nav: {
      home: "Home",
      cronologia: "Chronology",
      history: "History",
      season1: "Season 1",
      season2: "Season 2",
      characters: "Characters",
      contact: "Contact",
      pablo: "Pablo Mu-R4d",
      villains: "Villains",
      prophet: "Prophet",
      john: "John Aunt-Bet",
      dq: "De-Inclusion",
      tv: "TV",
      gaybe: "Orchestra",
      madeusa: "Lawyer",
      jao: "Blacksmith",
      marcitus: "Analyst"
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
      title: "QEL@0xpblab History — Season 1",
      titleSeason2: "QEL@0xpblab History — Season 2",
      subtitle: "A chronological narrative of reality as a distributed system",
      subtitleSeason2: "The siren blares inside the elevator.",
      expand: "Expand",
      collapse: "Collapse",
      viewDoc: "View Full Document →"
    },
    section: {
      cronologiaLabel: "[ CHRONOLOGY ]",
      season1Label: "[ SEASON 1 ] Lore",
      season2Label: "[ SEASON 2 ]",
      charactersLabel: "[ CHARACTERS ]",
      contactLabel: "[ CONTACT ]",
      contactSummary: "Get in touch for collaborations, ideas, or a quantum coffee.",
      viewFullContact: "View full document →"
    },
    clock: {
      tooltip: "Synchronized with the company's atomic clock. May be ahead or behind."
    },
    header: {
      signature: "QEL@0xpblab",
      signatureLine: "# QEL@%>0xpblab // 2026"
    },
    intro: {
      message: "If you've made it here, you may have noticed: this **QEL@0xpblab** universe isn't just fanfic.\n\nIt's a **playful** (and deliberately over-the-top) way for me to organize what I live — work, anxiety, ambition, chaos, discipline, family, decisions, mistakes, fresh starts. I like to think of life as a system full of *logs*, *incidents*, *protocols* and characters that show up to push you, protect you, knock you down or save you.\n\nIn real life, things rarely come with a manual. Here, I make up a manual that **laughs at me** and, at the same time, helps me not take myself too seriously.\n\n- When I talk about *branches*, it's because I feel every choice opens a path.\n- When I talk about *compliance*, it's because the world loves rules — even when no one can say why.\n- When I talk about *prophets*, *auditors* and *interdimensional bosses*, it's because there are forces (inner and outer) that feel huge, even when they're just… people, habit, fear, trauma, responsibility.\n\nI write this way because it works for me.\n\nThis project is a joke, (or not) — but it's also a mirror.\nA dirty mirror, with neon, stamps and a lot of \"NO\" on the board.\n\nAnd in the middle of all that, there's something very simple:\n\nI keep trying.\n\nWith humor, with rage, with sleep, with the urge to disappear, with the urge to build.\nAnd with the odd peace of knowing that, if I can turn my own monsters into characters, I can talk to them.\n\nThank you for reading, for stepping into this branch with me, and for accepting that absurdity is sometimes the most honest way to tell the truth.\n\n— **Pablo Murad**\n\n01/21/2026"
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
  },
  {
    year: "2024",
    period: "O Alvorecer",
    title: "A Grande Batalha do Alvorecer",
    summary: "Sora.IA vs Pablo Mu-R4d. A guerra que começou às 05:59 e terminou às 06:00 com um abraço que colapsou o ódio. O alvorecer finalmente aconteceu.",
    document: "GRANDE-BATALHA-DO-ALVORECER-PTBR.md",
    anchor: null,
    icon: "🌅⚔️",
    color: "gold"
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
  },
  {
    year: "2024",
    period: "The Dawn",
    title: "The Great Battle of Dawn",
    summary: "Sora.IA vs Pablo Mu-R4d. The war that started at 05:59 and ended at 06:00 with a hug that collapsed the hate. Dawn finally happened.",
    document: "GRANDE-BATALHA-DO-ALVORECER-EN.md",
    anchor: null,
    icon: "🌅⚔️",
    color: "gold"
  }
];

// Temporada 2 — Cronologia
const timelineSeason2 = [
  {
    year: "—",
    period: "Temporada 2",
    title: "A Chegada do Xerige Sargento Tenent3 Rafoiléu e seu amigo Digo Drogado",
    summary: "Uma sirene policial toca dentro do elevador. A dupla Rafoiléu e Digo Drogado chega ao QEL para investigar o Ruído Diplomático Mínimo e descobre que o problema não é técnico: é governança com parentesco e entropia com orçamento.",
    document: "CAPITULO-I-XERIGE-RAFOLIEU-DIGO-DROGADO-PTBR.md",
    anchor: null,
    icon: "🚨🌅",
    color: "red"
  },
  {
    year: "—",
    period: "Temporada 2",
    title: "A Morte de Nikols e Doktor Albino Bino no Poço Quantumheaven",
    summary: "O Poço Quantumheaven, a escada do Jão Bolão, um espelho e 40 segundos estratégicos. Nikols e Albino Bino caem juntos num deslizamento de sentido. Lenda corporativa.",
    document: "CAPITULO-TRAGICO-NIKOLS-ALBINO-PTBR.md",
    anchor: null,
    icon: "☀️🕳️💤",
    color: "gold"
  },
  {
    year: "—",
    period: "Temporada 2",
    title: "DISRUPTURA A-TEMPORAL",
    summary: "Reator de improbabilidade, SENHORA CREMILDA e espresso para todas as versões do mesmo estagiário. A causalidade pediu demissão por escrito. Paulo Pa-Monha aplaudindo no intervalo comercial do cosmos.",
    document: "DISRUPTURA-ATEMPORAL-PTBR.md",
    anchor: null,
    icon: "⏳💥",
    color: "purple"
  },
  {
    year: "—",
    period: "Temporada 2",
    title: "A Chegada de Paulo Pa-Monha",
    summary: "O homem que declarou guerra com um exército de ninguém. Vingança por streaming interdimensional negado. 27 abas da vingança, rodinhas de supermercado e um controle remoto que pausa matéria.",
    document: "CAPITULO-PAULO-PA-MONHA-PTBR.md",
    anchor: null,
    icon: "🎩⚔️",
    color: "red"
  },
  {
    year: "—",
    period: "Temporada 2",
    title: "As Baladas de Paulo Pirata",
    summary: "Lendário de Pó-Blanc. Pirata, rockeiro e motociclista na mesma profissão. A Viúva de Cal, do Farol Torto à Igreja do Último Acorde.",
    document: "BALADAS-PAULO-PIRATA-PTBR.md",
    anchor: null,
    icon: "🏴‍☠️🎸",
    color: "purple"
  }
];

const timelineSeason2EN = [
  {
    year: "—",
    period: "Season 2",
    title: "The Arrival of Sergeant Tenent3 Rafoiléu and His Friend Digo Drogado",
    summary: "A police siren blares inside the elevator. The duo Rafoiléu and Digo Drogado arrive at QEL to investigate the Minimum Diplomatic Noise and discover the problem is not technical: it's governance with kinship and entropy with budget.",
    document: "CAPITULO-I-XERIGE-RAFOLIEU-DIGO-DROGADO-EN.md",
    anchor: null,
    icon: "🚨🌅",
    color: "red"
  },
  {
    year: "—",
    period: "Season 2",
    title: "The Death of Nikols and Doktor Albino Bino in the Quantumheaven Pit",
    summary: "The Quantumheaven Pit, Jão Bolão's ladder, a mirror, and 40 strategic seconds. Nikols and Albino Bino fall together in a slippage of meaning. Corporate legend.",
    document: "CAPITULO-TRAGICO-NIKOLS-ALBINO-EN.md",
    anchor: null,
    icon: "☀️🕳️💤",
    color: "gold"
  },
  {
    year: "—",
    period: "Season 2",
    title: "THE A-TEMPORAL DISRUPTION",
    summary: "Improbability reactor, LADY CREMILDA and espresso for every version of the same intern. Causality resigned in writing. Paulo Pa-Monha applauding in the cosmos's commercial break.",
    document: "DISRUPTURA-ATEMPORAL-EN.md",
    anchor: null,
    icon: "⏳💥",
    color: "purple"
  },
  {
    year: "—",
    period: "Season 2",
    title: "The Arrival of Paulo Pa-Monha",
    summary: "The man who declared war with an army of nobody. Vengeance for denied interdimensional streaming. 27 tabs of vengeance, shopping cart wheels and a remote that pauses matter.",
    document: "CAPITULO-PAULO-PA-MONHA-EN.md",
    anchor: null,
    icon: "🎩⚔️",
    color: "red"
  },
  {
    year: "—",
    period: "Season 2",
    title: "The Ballads of Paulo Pirata",
    summary: "Legend of Pó-Blanc. Pirate, rocker and biker in one profession. The Widow of Lime, from the Crooked Lighthouse to the Church of the Last Chord.",
    document: "BALADAS-PAULO-PIRATA-EN.md",
    anchor: null,
    icon: "🏴‍☠️🎸",
    color: "purple"
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
  '/willy-bebe': 'LORE-WILLY-CRIANCA-PTBR.md',
  '/grande-batalha': 'GRANDE-BATALHA-DO-ALVORECER-PTBR.md',
  '/sora-ia': 'LORE-SORA-IA-PTBR.md',
  '/contact': 'CONTACT.md',
  '/ritual': 'OCCULT_GAME', // Easter egg: Ritual Terminal (movido do relógio)
  '/street-fighter': 'STREET_FIGHTER_2', // Easter egg: Street Fighter Alpha (novo no relógio)
};

// Rotas que carregam documentos da Temporada 2 (getDocsPath(2)); valor é [PTBR, EN]
const season2Routes = {
  '/xerige-digo': ['CAPITULO-I-XERIGE-RAFOLIEU-DIGO-DROGADO-PTBR.md', 'CAPITULO-I-XERIGE-RAFOLIEU-DIGO-DROGADO-EN.md'],
  '/nikols-albino': ['CAPITULO-TRAGICO-NIKOLS-ALBINO-PTBR.md', 'CAPITULO-TRAGICO-NIKOLS-ALBINO-EN.md'],
  '/disruptura-atemporal': ['DISRUPTURA-ATEMPORAL-PTBR.md', 'DISRUPTURA-ATEMPORAL-EN.md'],
  '/paulo-pa-monha': ['CAPITULO-PAULO-PA-MONHA-PTBR.md', 'CAPITULO-PAULO-PA-MONHA-EN.md'],
  '/paulo-pirata': ['BALADAS-PAULO-PIRATA-PTBR.md', 'BALADAS-PAULO-PIRATA-EN.md']
};

// Função para atualizar URL sem recarregar página
function updateURL(path) {
  const basePath = getBasePath();
  const fullPath = basePath + (path === '/' ? '' : path);
  window.history.pushState({ path }, '', fullPath || basePath + '/');
}

// Função para carregar e renderizar markdown
async function loadDocument(filename, season = 1) {
  const main = document.querySelector('#content');
  main.innerHTML = `<div class="loading"><div class="spinner"></div><p>${t('ui.loading')}</p></div>`;

  try {
    await loadMarked();
    
    const docsPath = getDocsPath(season);
    const fullPath = `${docsPath}${filename}`;
    const cacheKey = `${fullPath}_${currentLang}_s${season}`;
    
    // Verificar cache em memória primeiro
    let markdown = markdownCache.get(cacheKey);
    
    if (!markdown) {
      console.log('Tentando carregar:', fullPath);
      
      const response = await fetch(fullPath);
      if (!response.ok) {
        console.error('Erro ao carregar:', fullPath, response.status, response.statusText);
        throw new Error(`${t('ui.error')}: ${response.status} ${response.statusText}`);
      }
      
      markdown = await response.text();
      
      // Armazenar no cache
      markdownCache.set(cacheKey, markdown);
      saveMarkdownCache();
    } else {
      console.log('Usando cache para:', fullPath);
    }
    
    // Ocultar contador de visitas em páginas que não são a inicial
    const counterEl = document.getElementById('visit-counter');
    if (counterEl) {
      counterEl.style.display = 'none';
    }
    
    // Criar estrutura do documento
    const docTitle = extractTitle(markdown);
    const docDescription = extractDescription(markdown);
    
    // Atualizar meta tags
    updateMetaTags({
      title: docTitle,
      description: docDescription,
      type: 'article',
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString()
    });
    
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
    
    requestAnimationFrame(() => {
      processHeadingIds();
      processInternalLinks();
      removeBrokenEmojis();
      processImages();
      
      requestAnimationFrame(() => {
        prefetchVisibleLinks();
      });
      
      processScripts();
      processTables();
    });
    
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

// Função para remover emoticons quebrados
function removeBrokenEmojis() {
  const markdownContent = document.querySelector('.markdown-content');
  if (!markdownContent) return;
  
  const walker = document.createTreeWalker(
    markdownContent,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const textNodes = [];
  let node;
  while (node = walker.nextNode()) {
    if (node.textContent.includes('?') || node.textContent.includes('\uFFFD')) {
      textNodes.push(node);
    }
  }
  
  textNodes.forEach(textNode => {
    let text = textNode.textContent;
    text = text.replace(/\s+\?\s+/g, ' ');
    text = text.replace(/^\?\s+/g, '');
    text = text.replace(/\uFFFD/g, '');
    text = text.replace(/^#+\s+\?/g, (match) => match.replace('?', ''));
    
    if (text !== textNode.textContent) {
      textNode.textContent = text;
    }
  });
}

// Extrair título do markdown
function extractTitle(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  if (!match) return 'Documento';
  
  let title = match[1];
  
  // Remover caracteres de substituição UTF-8 (emoji quebrado)
  title = title.replace(/\uFFFD/g, '');
  
  // Remover todos os emojis Unicode (incluindo sequências)
  // Regex para detectar ranges de emoji Unicode
  title = title.replace(/[\u{1F300}-\u{1F9FF}]/gu, ''); // Emojis diversos
  title = title.replace(/[\u{2600}-\u{26FF}]/gu, ''); // Símbolos diversos
  title = title.replace(/[\u{2700}-\u{27BF}]/gu, ''); // Dingbats
  title = title.replace(/[\u{1F600}-\u{1F64F}]/gu, ''); // Emoticons
  title = title.replace(/[\u{1F680}-\u{1F6FF}]/gu, ''); // Transporte e símbolos
  title = title.replace(/[\u{1F1E0}-\u{1F1FF}]/gu, ''); // Bandeiras
  title = title.replace(/[\u{1F900}-\u{1F9FF}]/gu, ''); // Suplementar
  title = title.replace(/[\u{1FA00}-\u{1FA6F}]/gu, ''); // Extensão A
  title = title.replace(/[\u{1FA70}-\u{1FAFF}]/gu, ''); // Extensão B
  title = title.replace(/[\u{FE00}-\u{FE0F}]/gu, ''); // Variantes
  title = title.replace(/[\u{200D}]/gu, ''); // Zero-width joiner
  title = title.replace(/[\u{20E3}]/gu, ''); // Combining enclosing keycap
  
  // Remover espaços múltiplos e trim
  title = title.replace(/\s+/g, ' ').trim();
  
  return title || 'Documento';
}

// Extrair descrição do markdown (primeiro parágrafo)
function extractDescription(markdown) {
  const lines = markdown.split('\n');
  for (let line of lines) {
    line = line.trim();
    if (line && !line.startsWith('#') && !line.startsWith('![') && !line.startsWith('>') && line.length > 20) {
      return line.substring(0, 160) + (line.length > 160 ? '...' : '');
    }
  }
  return 'A realidade é um sistema distribuído, e observação é uma forma de commit.';
}

// Atualizar ou criar meta tag
function updateOrCreateMeta(attr, value, content) {
  let meta = document.querySelector(`meta[${attr}="${value}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, value);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

// Atualizar ou criar link tag
function updateOrCreateLink(rel, href) {
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
}

// Atualizar structured data JSON-LD
function updateStructuredData(data) {
  const baseUrl = getBaseUrl();
  const basePath = getBasePath();
  let currentPath = window.location.pathname;
  
  if (basePath && currentPath.startsWith(basePath)) {
    currentPath = currentPath.substring(basePath.length) || '/';
  }
  
  const currentUrl = baseUrl + currentPath;
  
  let existingScript = document.getElementById('structured-data');
  if (existingScript) {
    existingScript.remove();
  }
  
  const script = document.createElement('script');
  script.id = 'structured-data';
  script.type = 'application/ld+json';
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        'name': 'QEL@0xpblab',
        'alternateName': 'Quantum Experimental Laboratories',
        'url': baseUrl,
        'logo': `${baseUrl}/img/qel.png`,
        'description': 'Quantum Experimental Laboratories at 0xpblab. A realidade é um sistema distribuído, e observação é uma forma de commit.'
      },
      {
        '@type': 'WebSite',
        'name': 'QEL@0xpblab',
        'url': baseUrl,
        'description': 'A realidade é um sistema distribuído, e observação é uma forma de commit.',
        'inLanguage': currentLang === 'pt' ? 'pt-BR' : 'en-US',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': `${baseUrl}/?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  };
  
  if (data.type === 'article' || data.type === 'document') {
    structuredData['@graph'].push({
      '@type': 'Article',
      'headline': data.title,
      'description': data.description,
      'url': currentUrl,
      'datePublished': data.datePublished || new Date().toISOString(),
      'dateModified': data.dateModified || new Date().toISOString(),
      'author': {
        '@type': 'Person',
        'name': 'Pablo Murad'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'QEL@0xpblab',
        'logo': {
          '@type': 'ImageObject',
          'url': `${baseUrl}/img/qel.png`
        }
      },
      'inLanguage': currentLang === 'pt' ? 'pt-BR' : 'en-US',
      'image': data.image || `${baseUrl}/img/qel.png`
    });
  }
  
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

// Função para obter personagem baseado na hora
function getCharacterByHour() {
  const hour = new Date().getHours();
  const characters = [
    { name: 'Pablo', image: 'Pablo.png' },
    { name: 'Profeta', image: 'Profeta.png' },
    { name: 'John', image: 'john.png' },
    { name: 'Gaybe-EL', image: 'Gaybe-EL.png' },
    { name: 'Madeusa', image: 'Madeusa.png' },
    { name: 'Marcitus', image: 'Marcitus.png' },
    { name: 'Marcelo', image: 'Marcelo.png' },
    { name: 'Jão Bolão', image: 'Jão.png' },
    { name: 'Nikols', image: 'Nikols.png' },
    { name: 'Dr. Bee Shaa', image: 'BeeShaa.png' },
    { name: 'Doktor Bino', image: 'Doktor.png' },
    { name: 'Willy Criança', image: 'bebewilly.png' },
    { name: 'Sora.IA', image: 'soraia.png' },
    { name: 'Willy', image: 'Willy.png' }
  ];
  const index = hour % characters.length;
  return characters[index];
}

// Função para obter a URL base do site (domínio customizado ou GitHub Pages)
function getBaseUrl() {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // Domínio customizado
  if (hostname === 'dlore.org' || hostname === 'www.dlore.org') {
    return `${protocol}//${hostname}`;
  }
  
  // GitHub Pages padrão
  const basePath = getBasePath();
  return `https://0xpbl.github.io${basePath}`;
}

// Função para gerar URL de imagem dinâmica de compartilhamento
function getDynamicShareImage(title, description) {
  const baseUrl = getBaseUrl();
  const character = getCharacterByHour();
  const imageUrl = `${baseUrl}/img/${character.image}`;
  return imageUrl;
}

// Atualizar meta tags dinamicamente
function updateMetaTags(data) {
  const baseUrl = getBaseUrl();
  const basePath = getBasePath();
  let currentPath = window.location.pathname;
  
  if (basePath && currentPath.startsWith(basePath)) {
    currentPath = currentPath.substring(basePath.length) || '/';
  }
  
  const currentUrl = baseUrl + currentPath;
  
  const title = data.title || 'QEL@0xpblab - Quantum Experimental Laboratories';
  const description = data.description || 'A realidade é um sistema distribuído, e observação é uma forma de commit.';
  
  // Obter imagem dinâmica baseada no personagem da hora
  const dynamicImage = data.image || getDynamicShareImage(title, description);
  const character = getCharacterByHour();
  const locale = data.locale || (currentLang === 'pt' ? 'pt_BR' : 'en_US');
  
  document.title = title;
  
  updateOrCreateMeta('name', 'description', description);
  
  updateOrCreateMeta('property', 'og:title', title);
  updateOrCreateMeta('property', 'og:description', description);
  updateOrCreateMeta('property', 'og:url', currentUrl);
  updateOrCreateMeta('property', 'og:image', dynamicImage);
  updateOrCreateMeta('property', 'og:image:alt', `${character.name} - ${title}`);
  updateOrCreateMeta('property', 'og:locale', locale);
  updateOrCreateMeta('property', 'og:type', data.type || 'website');
  
  updateOrCreateMeta('name', 'twitter:title', title);
  updateOrCreateMeta('name', 'twitter:description', description);
  updateOrCreateMeta('name', 'twitter:image', dynamicImage);
  updateOrCreateMeta('name', 'twitter:image:alt', `${character.name} - ${title}`);
  
  updateOrCreateLink('canonical', currentUrl);
  
  updateStructuredData({
    ...data,
    title,
    description,
    image: dynamicImage,
    type: data.type || 'website'
  });
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


// Prefetch de links visíveis na viewport
function prefetchVisibleLinks() {
  const links = document.querySelectorAll('.markdown-content a[href^="/"]');
  if (links.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const link = entry.target;
        const href = link.getAttribute('href');
        if (href && !link.dataset.prefetched) {
          const route = routes[href.split('#')[0]];
          if (route) {
            const docsPath = getDocsPath();
            const filename = route.endsWith('.md') ? route : `${route}.md`;
            const langSuffix = currentLang === 'en' ? '/en/' : '/';
            const fullPath = `${docsPath}${langSuffix}${filename}`;
            
            // Prefetch usando link rel="prefetch"
            const prefetchLink = document.createElement('link');
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = fullPath;
            prefetchLink.as = 'document';
            document.head.appendChild(prefetchLink);
            
            link.dataset.prefetched = 'true';
          }
        }
      }
    });
  }, {
    rootMargin: '50px' // Prefetch quando está a 50px da viewport
  });
  
  links.forEach(link => observer.observe(link));
}

// Processar links internos para usar roteamento
function processInternalLinks() {
  // Processar TODOS os links que podem ser documentos markdown
  // Isso inclui: .md, .md#, thehistory/..., e links relativos
  const allLinks = document.querySelectorAll('.markdown-content a[href]');
  
  allLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Easter egg: clicar no email do Pablo abre o Ritual Terminal
    const currentPath = window.location.pathname;
    const basePath = getBasePath();
    let currentRoute = currentPath;
    if (basePath && currentPath.startsWith(basePath)) {
      currentRoute = currentPath.substring(basePath.length) || '/';
    }
    
    if ((currentRoute === '/contact' || currentRoute === '/contact/') && 
        href.includes('mailto:') && href.includes('pablomurad@pm.me')) {
      link.onclick = (e) => {
        e.preventDefault();
        // Adicionar hint visual
        link.style.textDecoration = 'line-through';
        setTimeout(() => {
          link.style.textDecoration = '';
          navigate('/ritual');
        }, 300);
      };
      return;
    }
    
    // Ignorar outros links externos (http, https, mailto, etc)
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
      
      // Verificar se é uma rota conhecida (inclui season 2)
      if (routes[routePath] || season2Routes[routePath]) {
        link.setAttribute('href', href);
        link.onclick = (e) => {
          e.preventDefault();
          navigate(routePath, anchor);
        };
        return;
      }
    }
    
    // Easter egg especial: se estiver na página de contatos e clicar em Pablo Mu-R4d
    if ((currentRoute === '/contact' || currentRoute === '/contact/') && 
        (href.includes('PABLO-MU-R4D') || href.includes('pablo'))) {
      // Easter egg: clicar em Pablo em contatos leva ao Ritual Terminal
      link.onclick = (e) => {
        e.preventDefault();
        // Adicionar hint visual
        link.style.textDecoration = 'line-through';
        setTimeout(() => {
          link.style.textDecoration = '';
          navigate('/ritual');
        }, 300);
      };
      return;
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
  const basePath = getBasePath();
  
  images.forEach(img => {
    let src = img.getAttribute('src');
    if (!src) return;
    
    // Garantir que URLs absolutas usem HTTPS
    if (src.startsWith('http://')) {
      src = src.replace(/^http:/, 'https:');
      img.src = src;
      applyImageOptimizations(img);
      return;
    }
    if (src.startsWith('https://')) {
      // Ainda aplicar otimizações de performance
      applyImageOptimizations(img);
      return;
    }
    
    // Decodificar primeiro caso já esteja codificado (para evitar dupla codificação)
    try {
      src = decodeURIComponent(src);
    } catch (e) {
      // Se falhar, usar o src original
    }
    
    // Se já começa com / e tem basePath, verificar se precisa adicionar
    if (src.startsWith('/')) {
      // Codificar espaços e caracteres especiais no caminho
      // Dividir por /, codificar cada parte (exceto a primeira vazia), e juntar novamente
      const parts = src.split('/');
      const encodedParts = parts.map((part, index) => {
        // Primeira parte vazia (antes da primeira /) deve permanecer vazia
        if (index === 0 && part === '') return '';
        return encodeURIComponent(part);
      });
      const encodedSrc = encodedParts.join('/');
      
      if (basePath && !src.startsWith(basePath)) {
        img.setAttribute('src', `${basePath}${encodedSrc}`);
      } else {
        img.setAttribute('src', encodedSrc);
      }
      applyImageOptimizations(img);
      return;
    }
    
    // Caminhos relativos (img/party.png, ../img/party.png, etc.)
    // Construir caminho absoluto usando basePath
    let cleanSrc = src;
    
    // Remover ../ se presente
    if (cleanSrc.startsWith('../')) {
      cleanSrc = cleanSrc.replace(/^\.\.\//, '');
    }
    
    // Codificar espaços e caracteres especiais no caminho ANTES de adicionar /
    // Dividir por /, codificar cada parte, e juntar novamente
    const parts = cleanSrc.split('/');
    const encodedParts = parts.map(part => encodeURIComponent(part));
    const encodedCleanSrc = encodedParts.join('/');
    
    // Garantir que começa com / se não tiver basePath
    const pathWithSlash = encodedCleanSrc.startsWith('/') ? encodedCleanSrc : '/' + encodedCleanSrc;
    
    // Adicionar basePath se necessário
    const finalSrc = basePath ? `${basePath}${pathWithSlash}` : pathWithSlash;
    img.setAttribute('src', finalSrc);
    
    // Aplicar otimizações de performance
    applyImageOptimizations(img);
  });
}

function applyImageOptimizations(img) {
  if (!img.hasAttribute('loading')) {
    img.setAttribute('loading', 'lazy');
  }
  
  if (!img.hasAttribute('decoding')) {
    img.setAttribute('decoding', 'async');
  }
  
  if (img.complete && img.naturalWidth > 0) {
    if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
      img.setAttribute('width', img.naturalWidth);
      img.setAttribute('height', img.naturalHeight);
    }
  } else {
    img.addEventListener('load', function() {
      if (!this.hasAttribute('width') && !this.hasAttribute('height')) {
        this.setAttribute('width', this.naturalWidth);
        this.setAttribute('height', this.naturalHeight);
      }
    }, { once: true });
  }
}

// Processar e executar scripts no conteúdo markdown
function processScripts() {
  const markdownContent = document.querySelector('.markdown-content');
  if (!markdownContent) return;
  
  // Executar scripts inline ANTES dos scripts externos
  const inlineScripts = markdownContent.querySelectorAll('script:not([src])');
  inlineScripts.forEach(script => {
    try {
      const code = script.textContent || script.innerHTML;
      if (code) {
        const func = new Function(code);
        func();
      }
    } catch (e) {
      console.warn('Erro ao executar script inline:', e);
    }
  });
  
  const externalScripts = markdownContent.querySelectorAll('script[src]');
  externalScripts.forEach(oldScript => {
    const newScript = document.createElement('script');
    let src = oldScript.getAttribute('src');
    
    // Forçar HTTPS em scripts externos
    if (src && src.startsWith('http://')) {
      src = src.replace(/^http:/, 'https:');
      newScript.setAttribute('src', src);
    } else {
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
    }
    
    if (oldScript.textContent) {
      newScript.textContent = oldScript.textContent;
    }
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

function processTables() {
  const markdownContent = document.querySelector('.markdown-content');
  if (!markdownContent) return;
  
  const tables = markdownContent.querySelectorAll('table');
  
  tables.forEach(table => {
    if (table.parentElement && table.parentElement.classList.contains('table-wrapper')) {
      return;
    }
    
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
}

// Função de navegação
function navigate(path, anchor = null) {
  const basePath = getBasePath();
  let normalizedPath = path;
  if (basePath && path.startsWith(basePath)) {
    normalizedPath = path.substring(basePath.length) || '/';
  }
  
  let normalizedAnchor = anchor;
  if (normalizedAnchor && normalizedAnchor.startsWith('-')) {
    normalizedAnchor = normalizedAnchor.substring(1);
  }
  
  updateURL(normalizedPath);
  
  if (normalizedPath === '/' || normalizedPath === '') {
    showIndex();
    if (normalizedAnchor) {
      setTimeout(() => scrollToAnchor(normalizedAnchor), 200);
    }
  } else {
    const counterEl = document.getElementById('visit-counter');
    if (counterEl) {
      counterEl.style.display = 'none';
    }
    stopQuantumClock();
    const filename = routes[normalizedPath] || season2Routes[normalizedPath];
    const loadSeason = season2Routes[normalizedPath] ? 2 : 1;
    
    if (filename === 'OCCULT_GAME') {
      const main = document.querySelector('#content');
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
    } else if (filename === 'STREET_FIGHTER_2') {
      const main = document.querySelector('#content');
      if (main) {
        const basePath = getBasePath();
        const cleanBasePath = basePath && basePath !== '' 
          ? (basePath.startsWith('/') ? basePath : `/${basePath}`)
          : '';
        const gamePath = cleanBasePath 
          ? `${cleanBasePath}/games/street-fighter/index.html`
          : '/games/street-fighter/index.html';
        main.innerHTML = `
          <div class="document-container">
            <div class="document-header">
              <h1>Street Fighter 2</h1>
            </div>
            <div class="markdown-content game-container">
              <div style="position:relative;width:100%;max-width:1200px;margin:2rem auto;padding-top:75%;">
                <iframe 
                  src="${gamePath}" 
                  style="position:absolute;inset:0;width:100%;height:100%;border:0;" 
                  allow="autoplay; fullscreen; gamepad; clipboard-write" 
                  allowfullscreen 
                  loading="lazy" 
                  referrerpolicy="no-referrer-when-downgrade"
                  title="Street Fighter 2">
                </iframe>
              </div>
            </div>
          </div>
        `;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (filename) {
      let actualFilename = Array.isArray(filename)
        ? (currentLang === 'en' ? filename[1] : filename[0])
        : filename;
      if (!Array.isArray(filename) && filename === 'LORE-GAYBE-EL-PIXITOS-PT.md') {
        actualFilename = currentLang === 'en' ? 'LORE-GAYBE-EL-PIXITOS-EN.md' : 'LORE-GAYBE-EL-PIXITOS-PT.md';
      }
      if (filename === 'LORE-WILLY-CRIANCA-PTBR.md') {
        actualFilename = currentLang === 'en' ? 'LORE-WILLY-CRIANCA-EN.md' : 'LORE-WILLY-CRIANCA-PTBR.md';
      }
      if (filename === 'GRANDE-BATALHA-DO-ALVORECER-PTBR.md') {
        actualFilename = currentLang === 'en' ? 'GRANDE-BATALHA-DO-ALVORECER-EN.md' : 'GRANDE-BATALHA-DO-ALVORECER-PTBR.md';
      }
      if (!Array.isArray(filename) && filename === 'LORE-SORA-IA-PTBR.md') {
        actualFilename = currentLang === 'en' ? 'LORE-SORA-IA-EN.md' : 'LORE-SORA-IA-PTBR.md';
      }
      if (!Array.isArray(filename) && filename === 'CAPITULO-I-XERIGE-RAFOLIEU-DIGO-DROGADO-PTBR.md') {
        actualFilename = currentLang === 'en' ? 'CAPITULO-I-XERIGE-RAFOLIEU-DIGO-DROGADO-EN.md' : 'CAPITULO-I-XERIGE-RAFOLIEU-DIGO-DROGADO-PTBR.md';
      }
      
      loadDocument(actualFilename, loadSeason).then(() => {
        if (normalizedAnchor) {
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

function getTimelineHTML(season = 1) {
  const currentTimeline = season === 2
    ? (currentLang === 'en' ? timelineSeason2EN : timelineSeason2)
    : (currentLang === 'en' ? timelineEN : timeline);
  const titleKey = season === 2 ? 'timeline.titleSeason2' : 'timeline.title';
  const subtitleKey = season === 2 ? 'timeline.subtitleSeason2' : 'timeline.subtitle';
  const routeMap = season === 2 ? season2Routes : routes;

  let timelineHTML = '<div class="timeline-container">';
  timelineHTML += `<div class="timeline-header"><h1>${t(titleKey)}</h1><p class="timeline-subtitle">${t(subtitleKey)}</p></div>`;
  timelineHTML += '<div class="timeline-wrapper">';

  let currentPeriod = '';

  currentTimeline.forEach((event, index) => {
    if (event.period !== currentPeriod) {
      if (currentPeriod !== '') {
        timelineHTML += '</div>';
      }
      currentPeriod = event.period;
      timelineHTML += `<div class="timeline-period" data-period="${event.period}">`;
      timelineHTML += `<div class="period-header"><h2>${event.period}</h2></div>`;
    }

    const eventId = season === 2 ? `event-s2-${index}` : `event-${index}`;
    const route = Object.keys(routeMap).find(key => {
      const v = routeMap[key];
      return Array.isArray(v) ? v.includes(event.document) : v === event.document;
    });
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

  timelineHTML += '</div></div></div>';
  return timelineHTML;
}

function renderTimeline() {
  const main = document.querySelector('#content');
  updateMetaTags({
    title: currentLang === 'pt' ? 'História do QEL@0xpblab' : 'QEL@0xpblab History',
    description: currentLang === 'pt'
      ? 'Uma narrativa cronológica da realidade como sistema distribuído.'
      : 'A chronological narrative of reality as a distributed system.',
    type: 'website'
  });
  initQuantumClock();
  main.innerHTML = getTimelineHTML();
  scrollToSectionOrEvent(100);
}

function getPersonagensLinksHTML() {
  const basePath = getBasePath();
  const link = (path, label) => `<a href="${path}" onclick="navigate('${path}'); return false;">${label}</a>`;
  const chars = [
    { path: '/characters', key: 'nav.characters' },
    { path: '/pablo', key: 'nav.pablo' },
    { path: '/john', key: 'nav.john' },
    { path: '/gaybe-el', key: 'nav.gaybe' },
    { path: '/madeusa', key: 'nav.madeusa' },
    { path: '/jao-bolao', key: 'nav.jao' },
    { path: '/marcitus-markitus', key: 'nav.marcitus' },
    { path: '/villains', key: 'nav.villains' },
    { path: '/dq', key: 'nav.dq' },
    { path: '/tv-programs', key: 'nav.tv' }
  ];
  return chars.map(c => link(c.path, t(c.key))).join(' · ');
}

function scrollToSectionOrEvent(delayMs) {
  setTimeout(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const anchorId = hash.replace(/^#/, '');
    const sectionEl = document.getElementById(anchorId);
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const contentDiv = document.getElementById(`content-${anchorId}`);
      if (contentDiv && contentDiv.style.display === 'none') {
        const expandBtn = sectionEl.querySelector('.btn-expand');
        if (expandBtn) setTimeout(() => expandBtn.click(), 300);
      }
    }
  }, delayMs);
}

function getCronologiaMessageHTML() {
  const raw = t('intro.message') || '';
  const paragraphs = raw.split(/\n\n/).filter(Boolean);
  return paragraphs.map(p => {
    const withBr = p.replace(/\n/g, '<br>');
    const withStrong = withBr.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    const withEm = withStrong.replace(/\*(.+?)\*/g, '<em>$1</em>');
    return `<p>${withEm}</p>`;
  }).join('');
}

function renderSinglePage() {
  const main = document.querySelector('#content');
  updateMetaTags({
    title: currentLang === 'pt' ? 'História do QEL@0xpblab' : 'QEL@0xpblab History',
    description: currentLang === 'pt'
      ? 'Uma narrativa cronológica da realidade como sistema distribuído.'
      : 'A chronological narrative of reality as a distributed system.',
    type: 'website'
  });
  initQuantumClock();

  const timelineHTML = getTimelineHTML(1);
  const timelineSeason2HTML = getTimelineHTML(2);
  const personagensHTML = getPersonagensLinksHTML();
  const contactPath = '/contact';
  const cronologiaMessageHTML = getCronologiaMessageHTML();

  const fullHTML = `
    <div class="single-page">
      <section id="cronologia" class="single-page-section">
        <h2 class="section-label">${t('section.cronologiaLabel')}</h2>
        <div class="cronologia-message">${cronologiaMessageHTML}</div>
      </section>
      <section id="temporada-1" class="single-page-section">
        <h2 class="section-label">${t('section.season1Label')}</h2>
        ${timelineHTML}
      </section>
      <section id="temporada-2" class="single-page-section">
        <h2 class="section-label">${t('section.season2Label')}</h2>
        ${timelineSeason2HTML}
      </section>
      <section id="personagens" class="single-page-section">
        <h2 class="section-label">${t('section.charactersLabel')}</h2>
        <div class="personagens-links">${personagensHTML}</div>
      </section>
      <section id="contato" class="single-page-section">
        <h2 class="section-label">${t('section.contactLabel')}</h2>
        <p class="section-contact-summary">${t('section.contactSummary')}</p>
        <a href="${contactPath}" class="btn-view" onclick="navigate('${contactPath}'); return false;">${t('section.viewFullContact')}</a>
      </section>
    </div>
  `;
  main.innerHTML = fullHTML;
  scrollToSectionOrEvent(100);
}

function scrollToSection(anchor) {
  const el = document.getElementById(anchor);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  const seasonMatch = eventId.match(/^event-s2-(\d+)$/);
  const season = seasonMatch ? 2 : 1;
  const eventIndex = seasonMatch ? parseInt(seasonMatch[1], 10) : index;
  const currentTimeline = season === 2
    ? (currentLang === 'en' ? timelineSeason2EN : timelineSeason2)
    : (currentLang === 'en' ? timelineEN : timeline);
  const event = currentTimeline[eventIndex];
  
  try {
    await loadMarked();
    
    const docsPath = getDocsPath(season);
    const filename = documentName.endsWith('.md') ? documentName : `${documentName}.md`;
    const fullPath = `${docsPath}${filename}`;
    const cacheKey = `${fullPath}_${currentLang}_s${season}`;
    
    // Verificar cache em memória primeiro
    let markdown = markdownCache.get(cacheKey);
    
    if (!markdown) {
      console.log('Tentando carregar conteúdo do evento:', fullPath);
      
      const response = await fetch(fullPath);
      if (!response.ok) {
        console.error('Erro ao carregar conteúdo:', fullPath, response.status, response.statusText);
        throw new Error(`${t('ui.errorContent')}: ${response.status} ${response.statusText}`);
      }
      
      markdown = await response.text();
      
      // Armazenar no cache
      markdownCache.set(cacheKey, markdown);
      saveMarkdownCache();
    } else {
      console.log('Usando cache para conteúdo do evento:', fullPath);
    }
    
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
    removeBrokenEmojis();
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
  updateHeaderSignature();
  updateLastUpdate();
  updateSubtitle();
  updateClockTooltip(); // Atualizar tooltip do relógio

  // Atualizar contador de visitas se estiver visível
  const counterEl = document.getElementById('visit-counter');
  if (counterEl && counterEl.style.display !== 'none') {
    const count = getVisitCount();
    updateVisitCounter(count);
  }
  
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
  const navLinks = document.querySelectorAll('#nav a');
  const navMap = {
    'Início': 'nav.home',
    'Cronologia': 'nav.cronologia',
    'Chronology': 'nav.cronologia',
    'História': 'nav.history',
    'Temporada 1': 'nav.season1',
    'Season 1': 'nav.season1',
    'Temporada 2': 'nav.season2',
    'Season 2': 'nav.season2',
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

// Atualizar assinatura do header (estilo Casteel, i18n)
function updateHeaderSignature() {
  const sig = document.getElementById('header-signature');
  const sigLine = document.getElementById('header-signature-line');
  if (sig) sig.textContent = t('header.signature');
  if (sigLine) sigLine.textContent = t('header.signatureLine');
}

// Função para buscar e exibir última atualização
async function updateLastUpdate() {
  const lastUpdateEl = document.getElementById('last-update');
  const lastUpdateText = lastUpdateEl?.querySelector('.last-update-text');
  if (!lastUpdateEl || !lastUpdateText) return;
  
  try {
    const repo = '0xpbl/0xpbl';
    const response = await fetch(`https://api.github.com/repos/${repo}/commits?path=thehistory&per_page=1`);
    
    if (response.ok) {
      const commits = await response.json();
      if (commits.length > 0) {
        const lastCommit = commits[0];
        const commitDate = new Date(lastCommit.commit.author.date);
        const formattedDate = commitDate.toLocaleDateString(
          currentLang === 'en' ? 'en-US' : 'pt-BR',
          { year: 'numeric', month: 'long', day: 'numeric' }
        );
        
        const text = currentLang === 'en' 
          ? `Last lore update: ${formattedDate}`
          : `Última atualização da lore: ${formattedDate}`;
        
        lastUpdateText.textContent = text;
        lastUpdateEl.style.display = 'block';
      }
    }
  } catch (error) {
    console.warn('Não foi possível buscar última atualização:', error);
    const buildDate = document.querySelector('meta[name="build-date"]');
    if (buildDate) {
      const date = new Date(buildDate.content);
      const formattedDate = date.toLocaleDateString(
        currentLang === 'en' ? 'en-US' : 'pt-BR',
        { year: 'numeric', month: 'long', day: 'numeric' }
      );
      const text = currentLang === 'en' 
        ? `Last lore update: ${formattedDate}`
        : `Última atualização da lore: ${formattedDate}`;
      lastUpdateText.textContent = text;
      lastUpdateEl.style.display = 'block';
    }
  }
}

// Atualizar subtítulo
function updateSubtitle() {
  const subtitles = document.querySelectorAll('.app-header .subtitle');
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
      ? 'Hadouken detectado... Preparando combate.'
      : 'Hadouken detected... Preparing combat.';
    
    const originalTitle = clockContainer.getAttribute('title');
    clockContainer.setAttribute('title', hintText);
    
    // Navegar para /street-fighter após breve delay
    setTimeout(() => {
      navigate('/street-fighter');
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

// Funções do contador de visitas
function getVisitCount() {
  const stored = localStorage.getItem('qel_visit_count');
  if (stored) {
    return parseInt(stored, 10);
  }
  return 34881;
}

function updateVisitCounter(count) {
  const counterText = document.querySelector('.visit-counter-text');
  if (counterText) {
    const formatted = count.toLocaleString('pt-BR');
    const text = currentLang === 'pt' 
      ? `Visitas: ${formatted}`
      : `Visits: ${formatted}`;
    counterText.textContent = text;
  }
}

function initVisitCounter() {
  const counterEl = document.getElementById('visit-counter');
  if (!counterEl) return;
  
  const sessionKey = 'qel_visit_counted';
  const storageKey = 'qel_visit_count';
  
  if (!sessionStorage.getItem(sessionKey)) {
    let count = getVisitCount();
    count++;
    localStorage.setItem(storageKey, count.toString());
    sessionStorage.setItem(sessionKey, 'true');
  }
  
  const count = getVisitCount();
  updateVisitCounter(count);
  counterEl.style.display = 'block';
}

// Mostrar página inicial (single-page com âncoras)
function showIndex() {
  updateMetaTags({
    title: 'QEL@0xpblab - Quantum Experimental Laboratories',
    description: currentLang === 'pt'
      ? 'A realidade é um sistema distribuído, e observação é uma forma de commit.'
      : 'Reality is a distributed system, and observation is a form of commit.',
    type: 'website'
  });
  renderSinglePage();
  initVisitCounter();
}

// Inicialização
// Inicializar cache ao carregar
initMarkdownCache();

document.addEventListener('DOMContentLoaded', () => {
  // Ajustar favicon para usar basePath
  const faviconLink = document.getElementById('favicon-link');
  if (faviconLink) {
    const basePath = getBasePath();
    const faviconPath = basePath ? `${basePath}/favicon.svg` : './favicon.svg';
    faviconLink.href = faviconPath;
    // Adicionar link alternativo para evitar busca automática de favicon.ico
    let alternateFavicon = document.querySelector('link[rel="alternate icon"]');
    if (!alternateFavicon) {
      alternateFavicon = document.createElement('link');
      alternateFavicon.rel = 'alternate icon';
      alternateFavicon.type = 'image/svg+xml';
      document.head.appendChild(alternateFavicon);
    }
    alternateFavicon.href = faviconPath;
  }
  
  // Inicializar sistema de idioma
  currentLang = getCurrentLang();
  setCurrentLang(currentLang);
  updateLangButtons();
  updateNavigation();
  updateFooter();
  updateHeaderSignature();
  updateLastUpdate();
  updateSubtitle();

  // Nav: âncoras na rota /, senão navegar para / e depois scroll
  const navEl = document.getElementById('nav');
  if (navEl) {
    navEl.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-anchor]');
      if (!link) return;
      e.preventDefault();
      const anchor = link.getAttribute('data-anchor');
      const pathname = window.location.pathname || '/';
      const basePath = getBasePath();
      let path = pathname;
      if (basePath && pathname.startsWith(basePath)) {
        path = pathname === basePath ? '/' : pathname.slice(basePath.length) || '/';
      } else if (pathname === '/' || pathname === '') {
        path = '/';
      }
      if (path === '/') {
        scrollToSection(anchor);
        return;
      }
      navigate('/');
      setTimeout(() => {
        window.location.hash = anchor;
        scrollToSection(anchor);
      }, 0);
    });
  }
  
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
    if (pathname.startsWith(basePath + '/') || pathname === basePath) {
      // URL já tem base path, normalizar removendo o base path
      if (pathname === basePath) {
        normalizedPath = '/';
      } else {
        normalizedPath = pathname.substring(basePath.length) || '/';
      }
      // Remover trailing slash se não for a raiz
      if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
        normalizedPath = normalizedPath.slice(0, -1);
      }
      // Garantir que começa com /
      if (!normalizedPath.startsWith('/')) {
        normalizedPath = '/' + normalizedPath;
      }
    } else if (pathname === '/' || pathname === '') {
      // Está na raiz absoluta
      normalizedPath = '/';
    } else {
      // Pathname não começa com basePath - pode ser uma rota direta sem base path
      // Normalizar para navegação interna (sem base path)
      normalizedPath = pathname.startsWith('/') ? pathname : '/' + pathname;
      // Remover trailing slash
      if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
        normalizedPath = normalizedPath.slice(0, -1);
      }
    }
  } else {
    // Se não há base path (localhost ou outro ambiente)
    normalizedPath = pathname;
    // Remover trailing slash se não for a raiz
    if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
      normalizedPath = normalizedPath.slice(0, -1);
    }
    // Garantir que começa com /
    if (!normalizedPath.startsWith('/')) {
      normalizedPath = '/' + normalizedPath;
    }
  }
  
  // Fallback: se a rota normalizada não existe, tentar detectar diretamente do pathname
  const hasRoute = (p) => routes[p] || season2Routes[p];
  if (!hasRoute(normalizedPath) && basePath && pathname.startsWith(basePath)) {
    const directRoute = pathname.substring(basePath.length) || '/';
    if (directRoute !== '/' && directRoute.endsWith('/')) {
      const trimmedRoute = directRoute.slice(0, -1);
      if (hasRoute(trimmedRoute)) normalizedPath = trimmedRoute;
    } else if (hasRoute(directRoute)) {
      normalizedPath = directRoute;
    }
  }
  
  navigate(normalizedPath);
  
  // Configurar navegação do browser
  window.addEventListener('popstate', (e) => {
    const pathname = window.location.pathname || '/';
    const basePath = getBasePath();
    let normalizedPath = pathname;
    
    if (basePath) {
      if (pathname.startsWith(basePath + '/') || pathname === basePath) {
        if (pathname === basePath) {
          normalizedPath = '/';
        } else {
          normalizedPath = pathname.substring(basePath.length) || '/';
        }
        // Remover trailing slash se não for a raiz
        if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
          normalizedPath = normalizedPath.slice(0, -1);
        }
        // Garantir que começa com /
        if (!normalizedPath.startsWith('/')) {
          normalizedPath = '/' + normalizedPath;
        }
      } else if (pathname === '/' || pathname === '') {
        normalizedPath = '/';
      } else {
        normalizedPath = pathname.startsWith('/') ? pathname : '/' + pathname;
        if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
          normalizedPath = normalizedPath.slice(0, -1);
        }
      }
    } else {
      normalizedPath = pathname;
      if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
        normalizedPath = normalizedPath.slice(0, -1);
      }
      if (!normalizedPath.startsWith('/')) {
        normalizedPath = '/' + normalizedPath;
      }
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

// Glitches aleatórios sutis
function initRandomGlitches() {
  // Aplicar glitch ocasional em elementos aleatórios
  setInterval(() => {
    if (Math.random() < 0.1) { // 10% de chance a cada intervalo
      const elements = document.querySelectorAll('.markdown-content h1, .markdown-content h2, .markdown-content img');
      if (elements.length > 0) {
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        randomElement.style.animation = 'quantumGlitch 0.2s';
        setTimeout(() => {
          randomElement.style.animation = '';
        }, 200);
      }
    }
  }, 5000); // A cada 5 segundos
}

// Inicializar glitches após DOM carregado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRandomGlitches);
} else {
  initRandomGlitches();
}

// Tornar funções globais
window.navigate = navigate;
window.toggleEvent = toggleEvent;
window.switchLanguage = switchLanguage;