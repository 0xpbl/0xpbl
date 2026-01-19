// QEL@0xpblab - JavaScript Principal
// Sistema de navegação e renderização de markdown

// Configuração
const DOCS_PATH = 'thehistory/';
const MARKED_CDN = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
const THEME_KEY = 'qel_theme';

// Sistema de Toggle de Tema
function applyTheme(theme) {
  const html = document.documentElement;
  if (theme === 'retro') {
    html.classList.add('theme-retro');
  } else {
    html.classList.remove('theme-retro');
  }
  localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'neon';
  applyTheme(saved);
}

function toggleTheme() {
  const current = document.documentElement.classList.contains('theme-retro') ? 'retro' : 'neon';
  const newTheme = current === 'retro' ? 'neon' : 'retro';
  applyTheme(newTheme);
  updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.textContent = `Theme: ${theme === 'retro' ? 'Retro' : 'Neon'}`;
  }
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
  '/pablo': 'PABLO-MU-R4D.md',
  '/cold-war': 'COLD-WAR.md',
  '/tv-programs': 'TV-PROGRAMS.md',
  '/villains': 'VILLAINS.md',
  '/wwii': 'WWII-OPERATIONS.md',
  '/fu-monilson': 'FU-MONILSON.md',
  '/dq': 'DQ.md',
  '/extras': 'QEL-PACOTE-EXTRAS.md',
  '/completo': 'QEL-PACOTE-COMPLETO.md',
  '/john': 'JOHN-AUNT-BET.md'
};

// Função para atualizar URL sem recarregar página
function updateURL(path) {
  window.history.pushState({ path }, '', path || '/');
}

// Função para carregar e renderizar markdown
async function loadDocument(filename) {
  const main = document.querySelector('main');
  main.innerHTML = '<div class="loading"><div class="spinner"></div><p>Carregando documento...</p></div>';

  try {
    await loadMarked();
    
    const response = await fetch(`${DOCS_PATH}${filename}`);
    if (!response.ok) {
      throw new Error(`Erro ao carregar: ${response.statusText}`);
    }
    
    const markdown = await response.text();
    const html = marked.parse(markdown);
    
    // Criar estrutura do documento
    const docTitle = extractTitle(markdown);
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
    
    // Processar links internos
    processInternalLinks();
    processImages();
    
  } catch (error) {
    main.innerHTML = `
      <div class="document-container">
        <h1>Erro ao carregar documento</h1>
        <p style="color: var(--red);">${error.message}</p>
        <p><a href="/" onclick="navigate('/'); return false;">← Voltar ao início</a></p>
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
      <a href="/" onclick="navigate('/'); return false;">Início</a> / 
      <span>${docName}</span>
    </div>
  `;
}

// Processar links internos para usar roteamento
function processInternalLinks() {
  const links = document.querySelectorAll('.markdown-content a[href$=".md"], .markdown-content a[href*=".md#"]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    let filename = href.split('/').pop();
    
    // Remover âncora se houver
    if (filename.includes('#')) {
      filename = filename.split('#')[0];
    }
    
    // Mapear README.md para qel.md
    if (filename === 'README.md') {
      filename = 'qel.md';
    }
    
    const route = Object.keys(routes).find(key => routes[key] === filename);
    
    if (route) {
      // Preservar âncora se houver
      const anchor = href.includes('#') ? href.split('#')[1] : null;
      const newHref = anchor ? `${route}#${anchor}` : route;
      
      link.setAttribute('href', newHref);
      link.onclick = (e) => {
        e.preventDefault();
        navigate(route, anchor);
      };
    } else if (href.startsWith('thehistory/')) {
      // Link já está na pasta thehistory
      let file = href.replace('thehistory/', '');
      if (file.includes('#')) {
        file = file.split('#')[0];
      }
      if (file === 'README.md') {
        file = 'qel.md';
      }
      const route = Object.keys(routes).find(key => routes[key] === file);
      if (route) {
        const anchor = href.includes('#') ? href.split('#')[1] : null;
        const newHref = anchor ? `${route}#${anchor}` : route;
        link.setAttribute('href', newHref);
        link.onclick = (e) => {
          e.preventDefault();
          navigate(route, anchor);
        };
      }
    }
  });
  
  // Processar links com âncoras
  const anchorLinks = document.querySelectorAll('.markdown-content a[href*="#"]');
  anchorLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href.includes('.md#')) {
      const [file, anchor] = href.split('#');
      const filename = file.split('/').pop();
      const route = Object.keys(routes).find(key => routes[key] === filename);
      
      if (route) {
        link.setAttribute('href', `${route}#${anchor}`);
        link.onclick = (e) => {
          e.preventDefault();
          navigate(route, anchor);
        };
      }
    }
  });
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

// Função de navegação
function navigate(path, anchor = null) {
  updateURL(path);
  
  if (path === '/' || path === '') {
    showIndex();
  } else {
    const filename = routes[path];
    if (filename) {
      loadDocument(filename).then(() => {
        if (anchor) {
          setTimeout(() => {
            const element = document.querySelector(`#${anchor}, [id*="${anchor}"]`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    } else {
      showIndex();
    }
  }
}

// Renderizar Timeline Cronológica
function renderTimeline() {
  const main = document.querySelector('main');
  
  let timelineHTML = '<div class="timeline-container">';
  timelineHTML += '<div class="timeline-header"><h1>História do QEL@0xpblab</h1><p class="timeline-subtitle">Uma narrativa cronológica da realidade como sistema distribuído</p></div>';
  timelineHTML += '<div class="timeline-wrapper">';
  
  let currentPeriod = '';
  
  timeline.forEach((event, index) => {
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
              <span class="expand-text">Expandir</span>
              <span class="collapse-text" style="display: none;">Recolher</span>
            </button>
            ${route ? `<a href="${routePath}" class="btn-view" onclick="navigate('${routePath}'); return false;">Ver Documento Completo →</a>` : ''}
          </div>
          <div class="event-content" id="content-${eventId}" style="display: none;">
            <div class="loading-content">
              <div class="spinner-small"></div>
              <p>Carregando conteúdo...</p>
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
  const event = timeline[index];
  
  try {
    await loadMarked();
    
    const response = await fetch(`${DOCS_PATH}${documentName}`);
    if (!response.ok) {
      throw new Error(`Erro ao carregar: ${response.statusText}`);
    }
    
    const markdown = await response.text();
    let html = marked.parse(markdown);
    
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
    
    // Processar links e imagens no conteúdo carregado
    processInternalLinks();
    processImages();
    
  } catch (error) {
    contentDiv.innerHTML = `
      <div class="error-content">
        <p style="color: var(--red);">Erro ao carregar conteúdo: ${error.message}</p>
      </div>
    `;
  }
}

// Mostrar página inicial (mantida para compatibilidade)
function showIndex() {
  renderTimeline();
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar tema
  initTheme();
  updateThemeButton(localStorage.getItem(THEME_KEY) || 'neon');
  
  // Configurar botão de toggle de tema
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
  
  // Verificar rota atual
  const path = window.location.pathname || '/';
  navigate(path);
  
  // Configurar navegação do browser
  window.addEventListener('popstate', (e) => {
    const path = window.location.pathname || '/';
    navigate(path);
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
window.toggleTheme = toggleTheme;