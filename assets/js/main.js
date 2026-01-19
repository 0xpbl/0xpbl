// QEL@0xpblab - JavaScript Principal
// Sistema de navegação e renderização de markdown

// Configuração
const DOCS_PATH = 'thehistory/';
const MARKED_CDN = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';

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

// Mostrar página inicial
function showIndex() {
  const main = document.querySelector('main');
  main.innerHTML = `
    <div class="index-grid">
      <div class="card" onclick="navigate('/qel')">
        <h2>🔬 QEL@0xpblab</h2>
        <p>A história completa do Quantum Experimental Laboratories. O laboratório que trata a realidade como infraestrutura.</p>
        <span class="badge badge-primary">Principal</span>
      </div>
      
      <div class="card" onclick="navigate('/pablo')">
        <h2>👔 Pablo Mu-R4d</h2>
        <p>Presidente e CEO desde 1932, com apenas 38 anos. Uma biografia impossível.</p>
        <span class="badge badge-info">Liderança</span>
      </div>
      
      <div class="card" onclick="navigate('/villains')">
        <h2>🦹 Dossiê de Vilões</h2>
        <p>O Quarteto da Impossibilidade: quatro antagonistas que tornam a ciência tecnicamente correta e inútil.</p>
        <span class="badge badge-danger">Ameaça</span>
      </div>
      
      <div class="card" onclick="navigate('/cold-war')">
        <h2>❄️🔥 Guerra Quente-Morna</h2>
        <p>O período de 1947-1991 visto pelos olhos do QEL@0xpblab. Ruído Diplomático Mínimo e muito mais.</p>
        <span class="badge badge-warning">História</span>
      </div>
      
      <div class="card" onclick="navigate('/wwii')">
        <h2>🎖️ Operações WWII</h2>
        <p>A Seção Δ-13 e as operações secretas durante a Segunda Guerra Mundial.</p>
        <span class="badge badge-warning">História</span>
      </div>
      
      <div class="card" onclick="navigate('/fu-monilson')">
        <h2>🔮🎸 Profeta ~~Ri~~ck</h2>
        <p>A chegada do profeta com Fu Monilson e o Protocolo de Amplificação Controlada.</p>
        <span class="badge badge-primary">Personagem</span>
      </div>
      
      <div class="card" onclick="navigate('/dq')">
        <h2>🏢 Desinclusão Quântica™</h2>
        <p>A política de RH que mantém colaboradores em superposição de pertencimento.</p>
        <span class="badge badge-success">Política</span>
      </div>
      
      <div class="card" onclick="navigate('/extras')">
        <h2>🧾🌀 Fiscal Interdimensional</h2>
        <p>O Fiscal Interdimensional da Lousa e sua guerra eterna contra π.</p>
        <span class="badge badge-info">Personagem</span>
      </div>
      
      <div class="card" onclick="navigate('/john')">
        <h2>🍬🚫 John Aunt-Bet</h2>
        <p>O germano-suíço anti-açúcar e a insulina como artefato de coerência.</p>
        <span class="badge badge-success">Personagem</span>
      </div>
      
      <div class="card" onclick="navigate('/tv-programs')">
        <h2>📺 Programas de TV</h2>
        <p>Experimentos de comunicação em massa do QEL@0xpblab.</p>
        <span class="badge badge-primary">Entretenimento</span>
      </div>
      
      <div class="card" onclick="navigate('/completo')">
        <h2>📦 Referência Completa</h2>
        <p>Índice consolidado de todos os conteúdos recentes.</p>
        <span class="badge badge-info">Referência</span>
      </div>
    </div>
  `;
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Verificar rota atual
  const path = window.location.pathname || '/';
  navigate(path);
  
  // Configurar navegação do browser
  window.addEventListener('popstate', (e) => {
    const path = window.location.pathname || '/';
    navigate(path);
  });
});

// Tornar navigate global
window.navigate = navigate;
