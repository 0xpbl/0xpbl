// QEL@0xpblab - Easter Egg: Ritual Terminal
// Engine do jogo narrativo oculto

const GAME_STATE_KEY = 'qel_occult_game_state_v1';

// Conteúdo do jogo em PT e EN
const GAME_CONTENT = {
  pt: {
    start: {
      text: `> SISTEMA DE RITUAL INICIADO
> Protocolo: Terminal de Invocação
> Status: Aguardando entrada...

Você está diante de um terminal antigo. A tela pisca com caracteres verdes sobre fundo preto. Algo parece estar esperando por você.

Três selos estão visíveis na tela, cada um com um padrão diferente. O que você faz?`,
      choices: [
        { id: 'touch_seal1', text: 'Tocar o primeiro selo' },
        { id: 'touch_seal2', text: 'Tocar o segundo selo' },
        { id: 'touch_seal3', text: 'Tocar o terceiro selo' },
        { id: 'examine', text: 'Examinar o terminal mais de perto' }
      ]
    },
    seal1: {
      text: `> SELO 1 ATIVADO
> Energia detectada: Fragmento de Chave

Ao tocar o primeiro selo, você sente uma leve descarga elétrica. Um fragmento de chave materializa-se no inventário.

O terminal exibe: "Um de três. Continue."`,
      choices: [
        { id: 'touch_seal2', text: 'Tocar o segundo selo', requires: [] },
        { id: 'touch_seal3', text: 'Tocar o terceiro selo', requires: [] },
        { id: 'gate', text: 'Avançar para o portão', requires: ['fragmento_chave'] }
      ],
      inventory: ['fragmento_chave'],
      flags: { seal1Touched: true }
    },
    seal2: {
      text: `> SELO 2 ATIVADO
> Energia detectada: Fragmento de Chave

O segundo selo responde ao seu toque. Outro fragmento aparece.

O terminal sussurra: "Dois de três. O caminho se abre."`,
      choices: [
        { id: 'touch_seal1', text: 'Tocar o primeiro selo', requires: [] },
        { id: 'touch_seal3', text: 'Tocar o terceiro selo', requires: [] },
        { id: 'gate', text: 'Avançar para o portão', requires: ['fragmento_chave'] }
      ],
      inventory: ['fragmento_chave'],
      flags: { seal2Touched: true }
    },
    seal3: {
      text: `> SELO 3 ATIVADO
> Energia detectada: Fragmento de Chave

O terceiro selo completa a tríade. O último fragmento se materializa.

O terminal vibra: "Três de três. O ritual está completo. O portão aguarda."`,
      choices: [
        { id: 'touch_seal1', text: 'Tocar o primeiro selo', requires: [] },
        { id: 'touch_seal2', text: 'Tocar o segundo selo', requires: [] },
        { id: 'gate', text: 'Avançar para o portão', requires: ['fragmento_chave'] }
      ],
      inventory: ['fragmento_chave'],
      flags: { seal3Touched: true }
    },
    gate: {
      text: `> PORTÃO DETECTADO
> Status: BLOQUEADO
> Requisito: Palavra-Selo

Você está diante de um portão etéreo. O terminal exige uma palavra-selo para abrir.

Digite a palavra que desbloqueia o portão. Dica: pense no que o QEL@0xpblab representa.`,
      puzzle: true,
      puzzleHint: 'A palavra está relacionada ao princípio fundamental do laboratório.',
      correctAnswers: ['commit', 'observação', 'observacao'],
      choices: []
    },
    recoil: {
      text: `> ERRO: PALAVRA-SELO INVÁLIDA
> Sistema de segurança ativado

O terminal pisca em vermelho. A palavra inserida não foi aceita. Você sente uma leve descarga de retorno.

O portão permanece fechado. Tente novamente.`,
      choices: [
        { id: 'gate', text: 'Tentar novamente', requires: [] }
      ]
    },
    opened: {
      text: `> PORTÃO ABERTO
> Status: ACESSO CONCEDIDO

A palavra-selo é aceita. O portão se dissolve em partículas de luz. Você avança para além do terminal.

O que você vê é... inesperado.`,
      choices: [
        { id: 'chapter1', text: 'Continuar', requires: [] }
      ]
    },
    chapter1: {
      text: `> CAPÍTULO 1: O QUE ESTÁ ALÉM

Você está em um espaço que não deveria existir. Arquivos flutuam no ar. Documentos se reorganizam sozinhos.

Uma voz ecoa: "Você descobriu o que poucos sabem. O QEL@0xpblab não é apenas um laboratório. É um sistema distribuído de realidade."

O que você faz?`,
      choices: [
        { id: 'endingA', text: 'Aceitar a verdade', requires: [] },
        { id: 'endingA', text: 'Questionar a realidade', requires: [] }
      ]
    },
    endingA: {
      text: `> FINAL: OBSERVAÇÃO CONCLUÍDA

Você entende agora. A realidade é um sistema distribuído, e observação é uma forma de commit.

O terminal se fecha. Você retorna ao QEL@0xpblab, mas algo mudou. Você sabe o que poucos sabem.

> RITUAL CONCLUÍDO
> Status: SUCESSO
> Obrigado por jogar.`,
      choices: []
    }
  },
  en: {
    start: {
      text: `> RITUAL SYSTEM INITIATED
> Protocol: Invocation Terminal
> Status: Awaiting input...

You stand before an ancient terminal. The screen flickers with green characters on a black background. Something seems to be waiting for you.

Three seals are visible on the screen, each with a different pattern. What do you do?`,
      choices: [
        { id: 'touch_seal1', text: 'Touch the first seal' },
        { id: 'touch_seal2', text: 'Touch the second seal' },
        { id: 'touch_seal3', text: 'Touch the third seal' },
        { id: 'examine', text: 'Examine the terminal more closely' }
      ]
    },
    seal1: {
      text: `> SEAL 1 ACTIVATED
> Energy detected: Key Fragment

As you touch the first seal, you feel a slight electric discharge. A key fragment materializes in your inventory.

The terminal displays: "One of three. Continue."`,
      choices: [
        { id: 'touch_seal2', text: 'Touch the second seal', requires: [] },
        { id: 'touch_seal3', text: 'Touch the third seal', requires: [] },
        { id: 'gate', text: 'Advance to the gate', requires: ['fragmento_chave'] }
      ],
      inventory: ['fragmento_chave'],
      flags: { seal1Touched: true }
    },
    seal2: {
      text: `> SEAL 2 ACTIVATED
> Energy detected: Key Fragment

The second seal responds to your touch. Another fragment appears.

The terminal whispers: "Two of three. The path opens."`,
      choices: [
        { id: 'touch_seal1', text: 'Touch the first seal', requires: [] },
        { id: 'touch_seal3', text: 'Touch the third seal', requires: [] },
        { id: 'gate', text: 'Advance to the gate', requires: ['fragmento_chave'] }
      ],
      inventory: ['fragmento_chave'],
      flags: { seal2Touched: true }
    },
    seal3: {
      text: `> SEAL 3 ACTIVATED
> Energy detected: Key Fragment

The third seal completes the triad. The last fragment materializes.

The terminal vibrates: "Three of three. The ritual is complete. The gate awaits."`,
      choices: [
        { id: 'touch_seal1', text: 'Touch the first seal', requires: [] },
        { id: 'touch_seal2', text: 'Touch the second seal', requires: [] },
        { id: 'gate', text: 'Advance to the gate', requires: ['fragmento_chave'] }
      ],
      inventory: ['fragmento_chave'],
      flags: { seal3Touched: true }
    },
    gate: {
      text: `> GATE DETECTED
> Status: LOCKED
> Requirement: Seal-Word

You stand before an ethereal gate. The terminal demands a seal-word to open.

Type the word that unlocks the gate. Hint: think about what QEL@0xpblab represents.`,
      puzzle: true,
      puzzleHint: 'The word is related to the fundamental principle of the laboratory.',
      correctAnswers: ['commit', 'observation', 'observação'],
      choices: []
    },
    recoil: {
      text: `> ERROR: INVALID SEAL-WORD
> Security system activated

The terminal flashes red. The entered word was not accepted. You feel a slight recoil discharge.

The gate remains closed. Try again.`,
      choices: [
        { id: 'gate', text: 'Try again', requires: [] }
      ]
    },
    opened: {
      text: `> GATE OPENED
> Status: ACCESS GRANTED

The seal-word is accepted. The gate dissolves into particles of light. You advance beyond the terminal.

What you see is... unexpected.`,
      choices: [
        { id: 'chapter1', text: 'Continue', requires: [] }
      ]
    },
    chapter1: {
      text: `> CHAPTER 1: WHAT LIES BEYOND

You are in a space that should not exist. Files float in the air. Documents reorganize themselves.

A voice echoes: "You have discovered what few know. QEL@0xpblab is not just a laboratory. It is a distributed system of reality."

What do you do?`,
      choices: [
        { id: 'endingA', text: 'Accept the truth', requires: [] },
        { id: 'endingA', text: 'Question reality', requires: [] }
      ]
    },
    endingA: {
      text: `> ENDING: OBSERVATION COMPLETED

You understand now. Reality is a distributed system, and observation is a kind of commit.

The terminal closes. You return to QEL@0xpblab, but something has changed. You know what few know.

> RITUAL COMPLETED
> Status: SUCCESS
> Thank you for playing.`,
      choices: []
    }
  }
};

// Estado inicial do jogo
function getInitialState() {
  return {
    nodeId: 'start',
    inventory: [],
    flags: {
      failCount: 0,
      seal1Touched: false,
      seal2Touched: false,
      seal3Touched: false
    },
    lastUpdated: Date.now()
  };
}

// Carregar estado do localStorage
function loadGameState() {
  try {
    const saved = localStorage.getItem(GAME_STATE_KEY);
    if (!saved) return getInitialState();
    
    const state = JSON.parse(saved);
    // Validar estrutura básica
    if (!state.nodeId || !state.inventory || !state.flags) {
      console.warn('Game state corrupted, resetting...');
      return getInitialState();
    }
    return state;
  } catch (error) {
    console.warn('Error loading game state:', error);
    return getInitialState();
  }
}

// Salvar estado no localStorage
function saveGameState(state) {
  try {
    state.lastUpdated = Date.now();
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
}

// Verificar se jogador tem itens necessários
function hasRequiredItems(inventory, requires) {
  if (!requires || requires.length === 0) return true;
  return requires.every(item => inventory.includes(item));
}

// Inicializar o jogo
function initOccultGame({ mountEl, lang, navigate }) {
  if (!mountEl) {
    console.error('Mount element not provided');
    return;
  }

  let gameState = loadGameState();
  let currentLang = lang || 'pt';

  // Adicionar meta noindex (opcional, não é garantia absoluta)
  // Crawlers podem ignorar JS, mas ajuda a reduzir indexação
  let metaRobots = document.querySelector('meta[name="robots"]');
  if (!metaRobots) {
    metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex';
    document.head.appendChild(metaRobots);
  } else {
    metaRobots.content = 'noindex';
  }

  // Renderizar o jogo
  function render() {
    const content = GAME_CONTENT[currentLang];
    if (!content || !content[gameState.nodeId]) {
      console.error('Node not found:', gameState.nodeId);
      return;
    }

    const node = content[gameState.nodeId];
    const inventoryItems = [...new Set(gameState.inventory)]; // Remover duplicatas

    let html = '<div class="occult-game-container">';
    
    // Terminal
    html += '<div class="occult-terminal" id="occult-terminal">';
    html += node.text;
    html += '</div>';

    // Inventário (se houver itens)
    if (inventoryItems.length > 0) {
      html += '<div class="occult-inventory">';
      html += '<strong>Inventário:</strong> ';
      html += inventoryItems.map(item => `<span class="occult-inventory-item">${item}</span>`).join('');
      html += '</div>';
    }

    // Puzzle (input de texto)
    if (node.puzzle) {
      html += '<div class="occult-input-container">';
      html += `<label class="occult-input-label" for="occult-puzzle-input">${currentLang === 'pt' ? 'Palavra-Selo:' : 'Seal-Word:'}</label>`;
      html += `<input type="text" id="occult-puzzle-input" class="occult-input" placeholder="${node.puzzleHint || ''}" autocomplete="off" aria-label="${currentLang === 'pt' ? 'Digite a palavra-selo' : 'Type the seal-word'}">`;
      html += '<button type="button" id="occult-puzzle-submit" class="occult-choice-btn" style="margin-top: 0.5rem;">';
      html += currentLang === 'pt' ? 'Enviar' : 'Submit';
      html += '</button>';
      html += '</div>';
    }

    // Escolhas
    if (node.choices && node.choices.length > 0) {
      html += '<div class="occult-choices">';
      node.choices.forEach(choice => {
        if (hasRequiredItems(gameState.inventory, choice.requires)) {
          html += `<button type="button" class="occult-choice-btn" data-choice="${choice.id}" aria-label="${choice.text}">${choice.text}</button>`;
        }
      });
      html += '</div>';
    }

    // Ações
    html += '<div class="occult-actions">';
    html += `<button type="button" class="occult-action-btn" id="occult-back-btn" aria-label="${currentLang === 'pt' ? 'Voltar ao QEL' : 'Back to QEL'}">${currentLang === 'pt' ? '← Voltar ao QEL' : '← Back to QEL'}</button>`;
    html += `<button type="button" class="occult-action-btn danger" id="occult-reset-btn" aria-label="${currentLang === 'pt' ? 'Resetar Ritual' : 'Reset Ritual'}">${currentLang === 'pt' ? 'Resetar Ritual' : 'Reset Ritual'}</button>`;
    html += `<button type="button" class="occult-action-btn" id="occult-copy-btn" aria-label="${currentLang === 'pt' ? 'Copiar Log' : 'Copy Log'}">${currentLang === 'pt' ? 'Copiar Log' : 'Copy Log'}</button>`;
    html += '</div>';

    html += '</div>';

    mountEl.innerHTML = html;

    // Handlers de eventos
    setupEventHandlers();
  }

  // Configurar handlers de eventos
  function setupEventHandlers() {
    // Botões de escolha
    const choiceButtons = mountEl.querySelectorAll('.occult-choice-btn[data-choice]');
    choiceButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const choiceId = btn.getAttribute('data-choice');
        handleChoice(choiceId);
      });
    });

    // Puzzle input
    const puzzleInput = mountEl.querySelector('#occult-puzzle-input');
    const puzzleSubmit = mountEl.querySelector('#occult-puzzle-submit');
    
    if (puzzleInput && puzzleSubmit) {
      const handlePuzzleSubmit = () => {
        const input = puzzleInput.value.trim().toLowerCase();
        handlePuzzle(input);
      };

      puzzleSubmit.addEventListener('click', handlePuzzleSubmit);
      puzzleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handlePuzzleSubmit();
        }
      });
    }

    // Botão voltar
    const backBtn = mountEl.querySelector('#occult-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        navigate('/');
      });
    }

    // Botão resetar
    const resetBtn = mountEl.querySelector('#occult-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm(currentLang === 'pt' 
          ? 'Tem certeza que deseja resetar o ritual? Todo o progresso será perdido.' 
          : 'Are you sure you want to reset the ritual? All progress will be lost.')) {
          resetGame();
        }
      });
    }

    // Botão copiar log
    const copyBtn = mountEl.querySelector('#occult-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        copyLog();
      });
    }

    // Foco no primeiro elemento interativo
    const firstInteractive = mountEl.querySelector('.occult-choice-btn, #occult-puzzle-input');
    if (firstInteractive) {
      setTimeout(() => firstInteractive.focus(), 100);
    }
  }

  // Processar escolha
  function handleChoice(choiceId) {
    const content = GAME_CONTENT[currentLang];
    const currentNode = content[gameState.nodeId];

    // Processar escolhas especiais
    if (choiceId === 'examine') {
      gameState.nodeId = 'start'; // Volta ao início
      saveGameState(gameState);
      render();
      return;
    }

    // Processar toque em selos
    if (choiceId.startsWith('touch_seal')) {
      const sealNum = choiceId.replace('touch_seal', '');
      const sealNode = content[`seal${sealNum}`];
      
      if (sealNode) {
        // Adicionar itens ao inventário
        if (sealNode.inventory) {
          sealNode.inventory.forEach(item => {
            if (!gameState.inventory.includes(item)) {
              gameState.inventory.push(item);
            }
          });
        }

        // Atualizar flags
        if (sealNode.flags) {
          Object.assign(gameState.flags, sealNode.flags);
        }

        gameState.nodeId = `seal${sealNum}`;
        saveGameState(gameState);
        render();
      }
      return;
    }

    // Navegar para próximo nó
    gameState.nodeId = choiceId;
    saveGameState(gameState);
    render();
  }

  // Processar puzzle
  function handlePuzzle(input) {
    const content = GAME_CONTENT[currentLang];
    const node = content[gameState.nodeId];

    if (!node.puzzle || !node.correctAnswers) {
      return;
    }

    const puzzleInput = mountEl.querySelector('#occult-puzzle-input');
    const puzzleSubmit = mountEl.querySelector('#occult-puzzle-submit');

    // Normalizar resposta (remover acentos, espaços, etc)
    const normalizedInput = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const normalizedAnswers = node.correctAnswers.map(ans => 
      ans.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    );

    if (normalizedAnswers.includes(normalizedInput)) {
      // Sucesso
      puzzleInput.classList.add('occult-input-success');
      puzzleInput.disabled = true;
      puzzleSubmit.disabled = true;

      setTimeout(() => {
        gameState.nodeId = 'opened';
        saveGameState(gameState);
        render();
      }, 1000);
    } else {
      // Erro
      gameState.flags.failCount = (gameState.flags.failCount || 0) + 1;
      puzzleInput.classList.add('occult-input-error');
      puzzleInput.value = '';

      setTimeout(() => {
        puzzleInput.classList.remove('occult-input-error');
      }, 1000);

      // Após 3 falhas, redirecionar para recoil
      if (gameState.flags.failCount >= 3) {
        setTimeout(() => {
          gameState.nodeId = 'recoil';
          saveGameState(gameState);
          render();
        }, 1500);
      } else {
        saveGameState(gameState);
      }
    }
  }

  // Resetar jogo
  function resetGame() {
    gameState = getInitialState();
    saveGameState(gameState);
    render();
  }

  // Copiar log
  function copyLog() {
    const terminal = mountEl.querySelector('#occult-terminal');
    if (terminal) {
      const text = terminal.textContent;
      navigator.clipboard.writeText(text).then(() => {
        const copyBtn = mountEl.querySelector('#occult-copy-btn');
        if (copyBtn) {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = currentLang === 'pt' ? '✓ Copiado!' : '✓ Copied!';
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 2000);
        }
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    }
  }

  // Atualizar idioma
  function updateLanguage(newLang) {
    currentLang = newLang;
    render();
  }

  // Renderizar inicialmente
  render();

  // Retornar API pública
  return {
    updateLanguage,
    render
  };
}

// Expor globalmente para uso em main.js
window.initOccultGame = initOccultGame;
