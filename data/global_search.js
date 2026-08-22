/**
 * global_search.js — Paleta de Comandos Universal (Cmd + K / Ctrl + K)
 * Búsqueda global instantánea en toda la suite de Talento Claro.
 */

(function () {
  'use strict';

  // 1. Inyectar HTML de la Paleta de Comandos
  const modalHtml = `
    <div id="gsModalOverlay" class="gs-overlay">
      <div class="gs-card">
        <div class="gs-header">
          <svg class="gs-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="gsSearchInput" class="gs-input" placeholder="Buscar colaborador por nombre, cargo, cédula o gerencia... (Esc para salir)" autocomplete="off" />
          <span class="gs-shortcut-badge">ESC</span>
        </div>
        <div class="gs-body">
          <div id="gsResultList" class="gs-results"></div>
          <div id="gsEmptyState" class="gs-empty">
            <span>Escribe para buscar entre los colaboradores de Claro</span>
          </div>
        </div>
        <div class="gs-footer">
          <div class="gs-footer-tips">
            <span><kbd>↑</kbd> <kbd>↓</kbd> Navegar</span>
            <span><kbd>↵</kbd> Seleccionar</span>
            <span><kbd>ESC</kbd> Cerrar</span>
          </div>
          <div class="gs-footer-brand">
            <span style="color:var(--crimson);font-weight:800;">Claro</span> Talento Ejecutivo
          </div>
        </div>
      </div>
    </div>
  `;

  document.addEventListener('DOMContentLoaded', initGlobalSearch);
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initGlobalSearch();
  }

  let searchIndex = [];
  let isIndexLoaded = false;
  let selectedIndex = 0;

  function initGlobalSearch() {
    if (document.getElementById('gsModalOverlay')) return;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const overlay = document.getElementById('gsModalOverlay');
    const input = document.getElementById('gsSearchInput');

    // Atajo de teclado global Cmd+K / Ctrl+K
    window.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearchModal();
      } else if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closeSearchModal();
      }
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeSearchModal();
    });

    input.addEventListener('input', function () {
      renderResults(input.value.trim());
    });

    input.addEventListener('keydown', function (e) {
      const items = document.querySelectorAll('.gs-item');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateSelected(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateSelected(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (items[selectedIndex]) {
          items[selectedIndex].click();
        }
      }
    });
  }

  function openSearchModal() {
    const overlay = document.getElementById('gsModalOverlay');
    const input = document.getElementById('gsSearchInput');
    if (!overlay || !input) return;

    overlay.classList.add('open');
    input.value = '';
    input.focus();
    loadSearchIndex();
    renderResults('');
  }

  function closeSearchModal() {
    const overlay = document.getElementById('gsModalOverlay');
    if (overlay) overlay.classList.remove('open');
  }

  async function loadSearchIndex() {
    if (isIndexLoaded && searchIndex.length > 0) return;

    // 1. Usar datos ya presentes en memoria en el tablero activo
    if (typeof ALL !== 'undefined' && Array.isArray(ALL) && ALL.length > 0) {
      searchIndex = ALL.map(formatRecord);
      isIndexLoaded = true;
      return;
    }

    if (typeof RAW !== 'undefined' && Array.isArray(RAW) && RAW.length > 0) {
      searchIndex = RAW.map(formatRecord);
      isIndexLoaded = true;
      return;
    }

    // 2. Cargar desde Supabase REST API si está offline en otro tablero
    try {
      const SUPABASE_URL = 'https://yxxpjttdmwruyeqiuxzu.supabase.co';
      const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4eHBqdHRkbXdydXllcWl1eHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MTQyNzUsImV4cCI6MjEwMjM5MDI3NX0.fxQc7o6Qv8Rvd8-PHJF_R-OEME-hbhbPPDnktjiNi9U';
      const hdr = { headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY } };
      const res = await fetch(SUPABASE_URL + '/rest/v1/personas?select=expediente,nombre,cargo,gerencia,direccion_comite,ciudades&limit=1000', hdr);
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        searchIndex = rows.map(formatRecord);
        isIndexLoaded = true;
      }
    } catch (e) {
      console.warn('Error cargando índice global:', e);
    }
  }

  function formatRecord(r) {
    return {
      expediente: str(r.expediente),
      nombre: str(r.nombre),
      cargo: str(r.cargo),
      gerencia: str(r.gerencia || r.direccion_comite || r.direccion || ''),
      caja: r.caja ? parseInt(r.caja, 10) : null
    };
  }

  function str(v) {
    return (v == null ? '' : String(v)).trim();
  }

  function renderResults(q) {
    const list = document.getElementById('gsResultList');
    const empty = document.getElementById('gsEmptyState');
    if (!list || !empty) return;

    if (!q) {
      list.innerHTML = '';
      empty.style.display = 'flex';
      empty.innerHTML = '<span>Escribe para buscar entre los colaboradores de Claro</span>';
      return;
    }

    const query = q.toLowerCase();
    const matches = searchIndex.filter(item =>
      item.nombre.toLowerCase().includes(query) ||
      item.expediente.toLowerCase().includes(query) ||
      item.cargo.toLowerCase().includes(query) ||
      item.gerencia.toLowerCase().includes(query)
    ).slice(0, 8); // Top 8 resultados rápidos

    if (!matches.length) {
      list.innerHTML = '';
      empty.style.display = 'flex';
      empty.innerHTML = `<span>No se encontraron colaboradores para <b>"${escapeHtml(q)}"</b></span>`;
      return;
    }

    empty.style.display = 'none';
    selectedIndex = 0;

    list.innerHTML = matches.map((m, idx) => `
      <div class="gs-item ${idx === 0 ? 'selected' : ''}" data-idx="${idx}" onclick="window.GlobalSearch.selectPerson('${escapeHtml(m.expediente)}', '${escapeHtml(m.nombre)}')">
        <div class="gs-item-avatar">
          ${getInitials(m.nombre)}
        </div>
        <div class="gs-item-info">
          <div class="gs-item-name">
            ${highlightMatch(m.nombre, query)}
            <span class="gs-item-exp">${m.expediente}</span>
            ${m.caja ? `<span class="gs-item-caja">Caja ${m.caja}</span>` : ''}
          </div>
          <div class="gs-item-meta">
            <span>${highlightMatch(m.cargo, query)}</span>
            ${m.gerencia ? ` · <span>${highlightMatch(m.gerencia, query)}</span>` : ''}
          </div>
        </div>
        <div class="gs-item-actions">
          <button class="gs-action-btn" title="Abrir Ficha">Ficha →</button>
        </div>
      </div>
    `).join('');
  }

  function updateSelected(items) {
    items.forEach((it, i) => {
      it.classList.toggle('selected', i === selectedIndex);
      if (i === selectedIndex) it.scrollIntoView({ block: 'nearest' });
    });
  }

  function getInitials(name) {
    const parts = name.trim().split(/\s+/);
    if (!parts.length) return 'C';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  function highlightMatch(text, query) {
    if (!query) return escapeHtml(text);
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx < 0) return escapeHtml(text);
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + query.length);
    const after = text.slice(idx + query.length);
    return `${escapeHtml(before)}<mark class="gs-mark">${escapeHtml(match)}</mark>${escapeHtml(after)}`;
  }

  function escapeHtml(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // API Pública
  window.GlobalSearch = {
    open: openSearchModal,
    close: closeSearchModal,
    selectPerson: function (exp, nombre) {
      closeSearchModal();
      // Si la función openProfileModal existe en el tablero actual
      if (typeof openProfileModal === 'function') {
        const found = typeof ALL !== 'undefined' ? ALL.find(r => r.expediente === exp || r.nombre === nombre) : null;
        if (found) {
          openProfileModal(found);
          return;
        }
      }
      // Si no, redirigir a ficha_talento.html con el id del expediente
      const cleanExp = exp.endsWith('-C') ? exp.slice(0, -2) : exp;
      window.open(`ficha_talento.html?id=${encodeURIComponent(cleanExp)}`, '_blank');
    }
  };

})();
