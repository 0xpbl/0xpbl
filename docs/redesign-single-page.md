# Redesign Single-Page QEL@0xpblab — Documento de Design

Referência visual: [stevencasteel.com](https://www.stevencasteel.com/#home).  
Projeto: QEL@0xpblab — lore em Temporada 1, site em vanilla JS.

---

## Understanding Summary

- **O que está sendo construído:** Uma única página (single-page) que substitui a home atual: hero (#home), timeline da Temporada 1 (#temporada-1), bloco de personagens (#personagens), contato (#contato). Navegação por âncoras e nav fixa. Rotas como `/qel`, `/characters`, `/contact` continuam carregando documentos .md no mesmo SPA.
- **Por que existe:** Organizar a fanfic em temporadas (Temporada 1 concluída) e dar ao site uma identidade visual inspirada em stevencasteel.com (compacta, seções com rótulos, blocos expansíveis).
- **Para quem:** Leitores da lore QEL@0xpblab e o autor (Pablo Murad).
- **Restrições principais:** README.md não pode ser alterado; manter easter eggs (Ritual, Street Fighter); PT/EN; documentos em `thehistory/season-1/` e `thehistory/en/season-1/`.
- **Não-goals:** Não clonar stevencasteel.com; não mudar a stack (HTML/CSS/JS vanilla); não remover funcionalidades existentes.

---

## Assumptions

- Usuários acessam principalmente por `/` e navegam por âncoras ou por links "Ver documento completo" para rotas de documento.
- O relógio quântico permanece como elemento de identidade e easter egg (7 cliques / Konami → Street Fighter).
- Mobile: nav pode ser menu hamburger ou lista compacta; single-page deve scrollar suavemente.
- Acessibilidade: âncoras acessíveis por teclado; contraste suficiente; labels onde necessário.

---

## Decision Log

| Decisão | Alternativas | Escolha |
|--------|--------------|--------|
| Estrutura da home | A) SPA híbrida com redirecionamento para âncoras; B) Home = single-page, rotas de doc mantidas | B — menos quebra; "Ver documento completo" continua para `/qel`, etc. |
| Navegação | Topo fixo vs lateral | Topo fixo (consistente com referência e com header atual). |
| Seções na single-page | Apenas timeline vs timeline + personagens + contato | Incluir #home, #temporada-1, #personagens, #contato. |
| Estética | Paleta clara vs escura | Manter fundo claro por padrão; header/terminal com acentos (ex.: relógio verde); rótulos entre colchetes `[ TEMPORADA 1 ]`. |
| Rótulos de seção | Estilo Casteel com colchetes | Sim: `[ TEMPORADA 1 ] Lore`, `[ PERSONAGENS ]`, `[ CONTATO ]`. |

---

## Final Design

### Direção estética

- **Nome:** Terminal Casteel — single-page compacta, rótulos entre colchetes, tipografia monospace para títulos de seção, identidade "laboratório quântico" preservada (relógio, frase do Memorando).
- **Elemento memorável:** Relógio quântico na hero + cabeçalhos de seção no formato `[ ANO ]` ou `[ TEMPORADA 1 ]`.

### Estrutura da página (rota `/`)

1. **#home** — Hero: logo, título "QEL@0xpblab", subtítulo "Quantum Experimental Laboratories", frase do Memorando, seletor PT/EN, relógio quântico (quando ativo).
2. **#temporada-1** — Título da seção `[ TEMPORADA 1 ] Lore`; container da timeline (mesma lógica atual: períodos, eventos, Expandir, Ver documento completo).
3. **#personagens** — Título `[ PERSONAGENS ]`; lista/grid com links para CHARACTERS.md e personagens principais (Pablo, John, Gaybe-EL, etc.) com "Ver doc".
4. **#contato** — Título `[ CONTATO ]`; resumo ou embed do CONTACT.md; link para `/contact` para documento completo.

### Navegação

- Nav fixa no topo (após o header): Início (#home), Temporada 1 (#temporada-1), Personagens (#personagens), Contato (#contato).
- Links usam âncoras quando na rota `/`; scroll suave (scrollIntoView behavior: smooth).
- Em mobile: mesma nav, pode ser colapsável (hamburger) se o CSS assim definir.

### Roteamento

- `navigate('/')` → mostrar single-page (renderizar seções no `#content` ou preencher um wrapper com `#home`, `#temporada-1`, `#personagens`, `#contato`).
- `navigate('/qel')`, `navigate('/characters')`, etc. → comportamento atual: `loadDocument()` no `#content` (pode substituir o conteúdo principal por uma única área de documento, sem duplicar header/nav).

### Arquivos

- **index.html:** Um `<main id="content">` que o JS preenche: na rota `/` com a single-page (wrapper com seções); nas outras rotas com o documento .md como hoje.
- **main.js:** Nova função `renderSinglePage()` que monta o HTML das seções (hero já está no header; conteúdo de #temporada-1 = timeline; #personagens = lista; #contato = bloco estático ou fetch CONTACT). `showIndex()` chama `renderSinglePage()` em vez de só `renderTimeline()`. Links da nav para âncoras fazem scroll quando path é `/`.
- **style.css:** Estilos para `.single-page`, `section[id]`, `.section-label` (rótulos `[ ... ]`), nav fixa (position: sticky), espaçamento entre seções.

### Acessibilidade e i18n

- Seções com `<section id="home">` etc.; rótulos traduzidos (PT/EN) para "Temporada 1", "Personagens", "Contato".
- Links de âncora com href="#home" etc.; evitar remoção de foco; contraste mantido.

---

## Implementação

A Fase 2 do plano aplica este documento em [index.html](index.html), [assets/js/main.js](assets/js/main.js) e [assets/css/style.css](assets/css/style.css). README.md não é modificado.
