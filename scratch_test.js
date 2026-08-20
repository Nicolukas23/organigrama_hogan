
/* ── CONFIG & STATE ───────────────────────────────────────────────── */
const SUPABASE_URL = 'https://yxxpjttdmwruyeqiuxzu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4eHBqdHRkbXdydXllcWl1eHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MTQyNzUsImV4cCI6MjEwMjM5MDI3NX0.fxQc7o6Qv8Rvd8-PHJF_R-OEME-hbhbPPDnktjiNi9U';

const HOGAN_COMPETENCIES = [
  "Toma de Decisiones", "Liderar a otros", "Impulsar el Cambio",
  "Impulsar la Estrategia", "Desarrollo de Otros", "Impulsar la Innovación",
  "Escuchar a Otros", "Influenciar a otros", "Responsabilidad",
  "Comunicación de Impacto", "Potencial"
];

const BOX_NAMES = {
  9: 'Alto Potencial', 8: 'Sólido', 7: 'Experto',
  6: 'Alto Pot. en Desarr.', 5: 'Sólido en Desarr.', 4: 'Experto en Desarr.',
  3: 'A Gestionar', 2: 'En Revisión', 1: 'En Riesgo'
};

const BOX_COLORS = {
  9: 'var(--c9)', 8: 'var(--c8)', 7: 'var(--c7)',
  6: 'var(--c6)', 5: 'var(--c5)', 4: 'var(--c4)',
  3: 'var(--c3)', 2: 'var(--c2)', 1: 'var(--c1)'
};

let ALL_COMBINED = [];
let LEADER_USERS = [];
let CURRENT_USER = null;
let FILTERED_DATA = [];
let currentView = 'ninebox';

function normWords(s){
  if(!s) return '';
  return s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toUpperCase().split(/\s+/)
    .filter(w => !['DE','LA','DEL','LOS','LAS','Y','SAN','SANTA'].includes(w))
    .sort().join(' ');
}

function toggleTheme(){
  document.documentElement.classList.toggle('light');
  localStorage.setItem('theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
}
if(localStorage.getItem('theme') === 'light'){
  document.documentElement.classList.add('light');
}

/* ── DATA INITIALIZATION ──────────────────────────────────────────── */
async function initDashboard(){
  try{
    const hdr = { headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY } };
    
    const [nbRes, hgRes] = await Promise.all([
      fetch(SUPABASE_URL + '/rest/v1/ninebox?select=*', hdr).then(r => r.json()),
      fetch(SUPABASE_URL + '/rest/v1/tableros_json?clave=eq.hogan', hdr).then(r => r.json())
    ]);

    const hoganData = (hgRes && hgRes[0] && hgRes[0].data) ? hgRes[0].data : { est: [] };
    const hoganMap = new Map();
    (hoganData.est || []).forEach(e => {
      (e.team || []).forEach(m => {
        const key = normWords(m.name);
        if(key) hoganMap.set(key, m);
      });
    });

    // Filter exclusions: No Comité, No Gestión Humana
    const validNinebox = nbRes.filter(r => {
      const d = (r.direccion || '').toLowerCase();
      const da = (r.direccion_area || '').toLowerCase();
      if(d.includes('comit') || da.includes('comit')) return false;
      if(d.includes('gestion humana') || da.includes('gestion humana') || d.includes('humana')) return false;
      if(['talento cultura y comunicaciones', 'relaciones laborales', 'universidad claro', 'transformacion y people analytics', 'administrativo', 'seguridad'].includes(da)) return false;
      return true;
    });

    ALL_COMBINED = validNinebox.map(r => {
      const copy = { ...r };
      if(copy.caja !== null) copy.caja = +copy.caja;
      if(copy.nivel_reporte !== null) copy.nivel_reporte = +copy.nivel_reporte;

      const key = normWords(copy.nombre);
      const hg = hoganMap.get(key);
      if(hg){
        copy.hogan = hg;
        copy.hogan_scores = hg.scores || {};
        copy.hogan_versatilidad = hg.versatilidad || '';
        copy.hogan_clasificacion = hg.clasificacion || '';
        copy.hogan_potencial = (hg.scores && hg.scores['Potencial']) ? +hg.scores['Potencial'] : null;
        copy.hogan_status = hg.status || 'Contestó';
      } else {
        copy.hogan = null;
        copy.hogan_scores = {};
        copy.hogan_versatilidad = '';
        copy.hogan_clasificacion = '';
        copy.hogan_potencial = null;
        copy.hogan_status = 'Sin registro';
      }
      return copy;
    });

    // Build Leaders Map
    const leaderMap = new Map();
    leaderMap.set('nicolas.santos@claro.com.co', {
      nombre: 'NICOLAS SANTOS',
      cargo: 'Administrador General de Talento',
      email: 'nicolas.santos@claro.com.co',
      rol: 'admin',
      direccion: 'Todas las Direcciones',
      gerencia: 'Todas las Gerencias',
      expediente: 'ADMIN-01'
    });

    ALL_COMBINED.forEach(r => {
      const cargo = (r.cargo || '').toLowerCase();
      const email = (r.email || '').trim().toLowerCase();
      const nivel = String(r.nivel_reporte || '');
      
      const isDirector = cargo.includes('director') || nivel === '1';
      const isGerente = cargo.includes('gerente') || nivel === '2';
      
      if((isDirector || isGerente) && email && email !== 'nicolas.santos@claro.com.co'){
        if(!leaderMap.has(email)){
          leaderMap.set(email, {
            nombre: r.nombre,
            cargo: r.cargo,
            email: email,
            rol: isDirector ? 'director' : 'gerente',
            direccion: r.direccion,
            gerencia: r.gerencia,
            expediente: r.expediente
          });
        }
      }
    });

    LEADER_USERS = Array.from(leaderMap.values());
    populateDemoSelect();

    const savedEmail = localStorage.getItem('lider_auth_email') || 'nicolas.santos@claro.com.co';
    const userToLogin = leaderMap.get(savedEmail) || leaderMap.get('nicolas.santos@claro.com.co');
    if(userToLogin) setLeaderSession(userToLogin);

  }catch(err){
    console.error('Error inicializando tablero:', err);
  }
}

function populateDemoSelect(){
  const sel = document.getElementById('selDemoUser');
  sel.innerHTML = '<option value="">-- Seleccionar Director o Gerente --</option>';
  
  const adminGroup = document.createElement('optgroup'); adminGroup.label = '── ADMINISTRADOR ──';
  const dirGroup = document.createElement('optgroup'); dirGroup.label = '── DIRECTORES CORPORATIVOS ──';
  const gerGroup = document.createElement('optgroup'); gerGroup.label = '── GERENTES DE ÁREA ──';

  LEADER_USERS.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u.email;
    opt.textContent = `${u.nombre} (${u.cargo}${u.rol !== 'admin' ? ' - ' + u.direccion : ''})`;
    if(u.rol === 'admin') adminGroup.appendChild(opt);
    else if(u.rol === 'director') dirGroup.appendChild(opt);
    else gerGroup.appendChild(opt);
  });

  sel.appendChild(adminGroup);
  sel.appendChild(dirGroup);
  sel.appendChild(gerGroup);
}

function loginByEmail(){
  const email = (document.getElementById('txtEmail').value || '').trim().toLowerCase();
  const user = LEADER_USERS.find(u => u.email === email);
  if(user){
    document.getElementById('loginErr').style.display = 'none';
    setLeaderSession(user);
    closeLoginModal();
  } else {
    document.getElementById('loginErr').style.display = 'block';
  }
}

function loginByDemoSelect(){
  const email = document.getElementById('selDemoUser').value;
  if(email){
    const user = LEADER_USERS.find(u => u.email === email);
    if(user){ setLeaderSession(user); closeLoginModal(); }
  }
}

function setLeaderSession(user){
  CURRENT_USER = user;
  localStorage.setItem('lider_auth_email', user.email);

  document.getElementById('lblUserNameHeader').textContent = user.nombre;
  document.getElementById('lblScopeText').textContent = user.direccion;
  
  const badge = document.getElementById('lblUserRoleBadge');
  badge.textContent = user.rol.toUpperCase();
  badge.className = 'badge-role-tag ' + user.rol;

  setupScopeFilters();
  applyFilters();
}

function openLoginModal(){ document.getElementById('loginOverlay').style.display = 'flex'; }
function closeLoginModal(){ document.getElementById('loginOverlay').style.display = 'none'; }

function setupScopeFilters(){
  if(!CURRENT_USER) return;
  const wrapDir = document.getElementById('wrapDirFilter');
  const fDir = document.getElementById('fDireccion');

  if(CURRENT_USER.rol === 'admin'){
    wrapDir.style.display = 'flex';
    const dirs = [...new Set(ALL_COMBINED.map(r => r.direccion).filter(Boolean))].sort();
    fDir.innerHTML = '<option value="">Todas las Direcciones</option>';
    dirs.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d; opt.textContent = d;
      fDir.appendChild(opt);
    });
  } else {
    wrapDir.style.display = 'none';
    fDir.value = '';
  }

  updateGerenciasAndJefes();
}

function onDireccionChange(){
  updateGerenciasAndJefes();
  applyFilters();
}

function updateGerenciasAndJefes(){
  const fDir = document.getElementById('fDireccion');
  const fGerencia = document.getElementById('fGerencia');
  const fJefe = document.getElementById('fJefe');

  let scopeData = [];
  if(CURRENT_USER.rol === 'admin'){
    const selDir = fDir.value;
    scopeData = selDir ? ALL_COMBINED.filter(r => r.direccion === selDir) : ALL_COMBINED;
  } else if(CURRENT_USER.rol === 'director'){
    scopeData = ALL_COMBINED.filter(r => r.direccion === CURRENT_USER.direccion);
  } else {
    scopeData = ALL_COMBINED.filter(r => 
      r.gerencia === CURRENT_USER.gerencia || 
      (r.jefe && r.jefe.toLowerCase() === CURRENT_USER.nombre.toLowerCase())
    );
  }

  const gerencias = [...new Set(scopeData.map(r => r.gerencia).filter(Boolean))].sort();
  fGerencia.innerHTML = '<option value="">Todas las Gerencias</option>';
  gerencias.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g; opt.textContent = g;
    fGerencia.appendChild(opt);
  });

  if(CURRENT_USER.rol === 'gerente'){
    fGerencia.value = CURRENT_USER.gerencia;
    fGerencia.disabled = true;
  } else {
    fGerencia.disabled = false;
  }

  const jefes = [...new Set(scopeData.map(r => r.jefe).filter(Boolean))].sort();
  fJefe.innerHTML = '<option value="">Todos los Jefes</option>';
  jefes.forEach(j => {
    const opt = document.createElement('option');
    opt.value = j; opt.textContent = j;
    fJefe.appendChild(opt);
  });
}

function applyFilters(){
  if(!CURRENT_USER) return;

  const search = (document.getElementById('fSearch').value || '').toLowerCase().trim();
  const selDir = document.getElementById('fDireccion').value;
  const selGer = document.getElementById('fGerencia').value;
  const selJefe = document.getElementById('fJefe').value;
  const selCaja = document.getElementById('fCaja').value;
  const selVers = document.getElementById('fVersatilidad').value;

  let data = [];
  if(CURRENT_USER.rol === 'admin'){
    data = selDir ? ALL_COMBINED.filter(r => r.direccion === selDir) : ALL_COMBINED;
  } else if(CURRENT_USER.rol === 'director'){
    data = ALL_COMBINED.filter(r => r.direccion === CURRENT_USER.direccion);
  } else {
    data = ALL_COMBINED.filter(r => 
      r.gerencia === CURRENT_USER.gerencia || 
      (r.jefe && r.jefe.toLowerCase() === CURRENT_USER.nombre.toLowerCase())
    );
  }

  FILTERED_DATA = data.filter(r => {
    if(selGer && r.gerencia !== selGer) return false;
    if(selJefe && r.jefe !== selJefe) return false;
    if(selCaja && String(r.caja) !== selCaja) return false;
    if(selVers && r.hogan_versatilidad !== selVers) return false;
    if(search){
      const matchName = (r.nombre || '').toLowerCase().includes(search);
      const matchCargo = (r.cargo || '').toLowerCase().includes(search);
      const matchExp = (r.expediente || '').toLowerCase().includes(search);
      if(!matchName && !matchCargo && !matchExp) return false;
    }
    return true;
  });

  document.getElementById('resultCount').innerHTML = `Mostrando <strong>${FILTERED_DATA.length}</strong> colaboradores`;

  renderStats();
  renderNinebox();
  renderHogan();
  renderTable();
}

function resetFilters(){
  document.getElementById('fSearch').value = '';
  document.getElementById('fCaja').value = '';
  document.getElementById('fVersatilidad').value = '';
  if(CURRENT_USER.rol === 'admin') document.getElementById('fDireccion').value = '';
  if(CURRENT_USER.rol !== 'gerente') document.getElementById('fGerencia').value = '';
  document.getElementById('fJefe').value = '';
  updateGerenciasAndJefes();
  applyFilters();
}

/* ── RENDER STATS ──────────────────────────────────────────────────── */
function renderStats(){
  const total = FILTERED_DATA.length;
  document.getElementById('kpiTotal').textContent = total;

  const topBoxes = FILTERED_DATA.filter(r => [7,8,9].includes(r.caja)).length;
  document.getElementById('kpiTopBoxes').textContent = topBoxes;
  document.getElementById('kpiTopBoxesPct').textContent = total > 0 ? ` (${Math.round((topBoxes/total)*100)}%)` : ' (0%)';

  const hoganAnswered = FILTERED_DATA.filter(r => r.hogan && r.hogan.scores && Object.keys(r.hogan.scores).length > 0);
  const hCount = hoganAnswered.length;
  document.getElementById('chipHoganCount').textContent = hCount;

  if(hCount > 0){
    const avgPot = Math.round(hoganAnswered.reduce((acc, r) => acc + (r.hogan_potencial || 0), 0) / hCount);
    document.getElementById('kpiHoganAvgPot').textContent = avgPot;
  } else {
    document.getElementById('kpiHoganAvgPot').textContent = '0';
  }

  const sucesores = FILTERED_DATA.filter(r => (r.sucesor || '').toLowerCase() === 'si').length;
  document.getElementById('kpiSucesores').textContent = sucesores;
  document.getElementById('kpiSucesoresPct').textContent = total > 0 ? ` (${Math.round((sucesores/total)*100)}%)` : ' (0%)';
}

/* ── RENDER NINE BOX ───────────────────────────────────────────────── */
function renderNinebox(){
  for(let i = 1; i <= 9; i++){
    const boxData = FILTERED_DATA.filter(r => r.caja === i);
    document.getElementById(`countBox${i}`).textContent = boxData.length;
    const body = document.getElementById(`bodyBox${i}`);
    body.innerHTML = '';

    boxData.forEach(p => {
      const el = document.createElement('div');
      el.className = 'card-item';
      el.onclick = () => openProfileModal(p);

      const vClass = p.hogan_versatilidad === 'Alta Versatilidad' ? 'mb-alta' : 
                     p.hogan_versatilidad === 'Media Versatilidad' ? 'mb-media' : 'mb-prof';

      el.innerHTML = `
        <div class="ci-top">
          <span class="ci-name">${p.nombre}</span>
          <span style="font-size:10px;color:rgba(255,255,255,.5)">↗</span>
        </div>
        <div class="ci-sub">${p.cargo || '-'}</div>
        <div class="ci-tags">
          ${p.hogan_versatilidad ? `<span class="mini-badge ${vClass}">${p.hogan_versatilidad}</span>` : ''}
          ${p.hogan_potencial ? `<span class="mini-badge mb-pot">Hogan ${p.hogan_potencial}</span>` : ''}
          ${p.sucesor === 'Si' ? `<span class="mini-badge mb-suc">Sucesor</span>` : ''}
        </div>
      `;
      body.appendChild(el);
    });
  }
}

/* ── RENDER HOGAN VIEW ─────────────────────────────────────────────── */
function renderHogan(){
  const hoganAnswered = FILTERED_DATA.filter(r => r.hogan && r.hogan.scores && Object.keys(r.hogan.scores).length > 0);
  const hCount = hoganAnswered.length;

  const teamGrid = document.getElementById('teamCompGrid');
  teamGrid.innerHTML = '';

  if(hCount === 0){
    teamGrid.innerHTML = '<div style="grid-column:1/-1;padding:16px;text-align:center;color:var(--text-dim)">No hay evaluaciones de Hogan registradas para este filtro.</div>';
  } else {
    HOGAN_COMPETENCIES.forEach(comp => {
      const sum = hoganAnswered.reduce((acc, r) => acc + (r.hogan_scores[comp] ? +r.hogan_scores[comp] : 0), 0);
      const avg = Math.round(sum / hCount);

      const item = document.createElement('div');
      item.className = 'comp-metric-box';
      item.innerHTML = `
        <div class="comp-head">
          <span>${comp}</span>
          <span style="color:var(--gold);font-family:'JetBrains Mono'">${avg} pts</span>
        </div>
        <div class="comp-track">
          <div class="comp-fill" style="width:${Math.min(100, avg)}%"></div>
        </div>
      `;
      teamGrid.appendChild(item);
    });
  }

  const hgrid = document.getElementById('hoganGrid');
  hgrid.innerHTML = '';

  if(hoganAnswered.length === 0){
    hgrid.innerHTML = '<div style="grid-column:1/-1;padding:24px;text-align:center;color:var(--text-dim)">No hay tarjetas individuales de Hogan para mostrar.</div>';
    return;
  }

  hoganAnswered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'hcard';
    card.onclick = () => openProfileModal(p, 'hogan');

    const vClass = p.hogan_versatilidad === 'Alta Versatilidad' ? 'mb-alta' : 
                   p.hogan_versatilidad === 'Media Versatilidad' ? 'mb-media' : 'mb-prof';

    let scoresHtml = '';
    const keyComps = ['Toma de Decisiones', 'Liderar a otros', 'Impulsar el Cambio', 'Impulsar la Innovación'];
    keyComps.forEach(c => {
      const val = p.hogan_scores[c] !== undefined ? p.hogan_scores[c] : '-';
      const pct = typeof val === 'number' ? val : 0;
      scoresHtml += `
        <div class="hs-row">
          <span class="hs-lbl">${c}</span>
          <div class="hs-bar"><div class="hs-fill" style="width:${pct}%"></div></div>
          <span class="hs-val">${val}</span>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="hcard-top">
        <div class="hcard-av">${p.nombre.charAt(0)}</div>
        <div style="min-width:0;flex:1">
          <div style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.nombre}</div>
          <div style="font-size:11.5px;color:var(--text-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.cargo || '-'}</div>
        </div>
      </div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px">
        <span class="mini-badge ${vClass}">${p.hogan_versatilidad || 'Versatilidad N/A'}</span>
        <span class="mini-badge mb-pot">Potencial: ${p.hogan_potencial || 0} pts</span>
        ${p.caja ? `<span class="mini-badge" style="background:${BOX_COLORS[p.caja]||'#6b7280'};color:#fff">Caja ${p.caja}</span>` : ''}
      </div>
      <div class="hcard-scores">${scoresHtml}</div>
      <div style="margin-top:10px;text-align:right;font-size:11.5px;font-weight:700;color:var(--crimson)">Ver 11 competencias →</div>
    `;
    hgrid.appendChild(card);
  });
}

/* ── RENDER TABLE VIEW ─────────────────────────────────────────────── */
function renderTable(){
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  if(FILTERED_DATA.length === 0){
    tbody.innerHTML = '<tr><td colspan="11" style="text-align:center;padding:32px;color:var(--text-dim)">No se encontraron colaboradores con los filtros seleccionados.</td></tr>';
    return;
  }

  FILTERED_DATA.forEach(p => {
    const tr = document.createElement('tr');
    const color = BOX_COLORS[p.caja] || '#6b7280';
    const vClass = p.hogan_versatilidad === 'Alta Versatilidad' ? 'mb-alta' : 
                   p.hogan_versatilidad === 'Media Versatilidad' ? 'mb-media' : 'mb-prof';

    tr.innerHTML = `
      <td><b>${p.nombre}</b></td>
      <td><code>${p.expediente || '-'}</code></td>
      <td>${p.cargo || '-'}</td>
      <td>${p.direccion || '-'}</td>
      <td>${p.gerencia || '-'}</td>
      <td>${p.jefe || '-'}</td>
      <td><span class="mini-badge" style="background:${color};color:#fff">${p.caja ? 'Caja ' + p.caja : 'Sin caja'}</span></td>
      <td><b>${p.hogan_potencial ? p.hogan_potencial + ' pts' : '<span style="color:var(--text-faint)">-</span>'}</b></td>
      <td>${p.hogan_versatilidad ? `<span class="mini-badge ${vClass}">${p.hogan_versatilidad}</span>` : '<span style="color:var(--text-faint)">-</span>'}</td>
      <td>${p.sucesor === 'Si' ? '<span style="color:var(--green);font-weight:700">✔ Sí (' + (p.tiempo||'') + ')</span>' : '<span style="color:var(--text-faint)">No</span>'}</td>
      <td>
        <button class="btn-outline" style="padding:3px 8px;font-size:11px" onclick='openProfileModal(${JSON.stringify(p).replace(/'/g, "&apos;")})'>Ver Detalle</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* ── VIEW SWITCHER ─────────────────────────────────────────────────── */
function switchView(view){
  currentView = view;
  document.getElementById('tabNinebox').className = 'tab-btn ' + (view === 'ninebox' ? 'active' : '');
  document.getElementById('tabHogan').className = 'tab-btn ' + (view === 'hogan' ? 'active' : '');
  document.getElementById('tabTable').className = 'tab-btn ' + (view === 'table' ? 'active' : '');

  document.getElementById('viewNinebox').style.display = view === 'ninebox' ? 'block' : 'none';
  document.getElementById('viewHogan').style.display = view === 'hogan' ? 'block' : 'none';
  document.getElementById('viewTable').style.display = view === 'table' ? 'block' : 'none';
}

/* ── MODAL FICHA & HOGAN ───────────────────────────────────────────── */
function openProfileModal(p, defaultTab = 'ficha'){
  document.getElementById('mNombre').textContent = p.nombre;
  document.getElementById('mAvatar').textContent = p.nombre.charAt(0);
  document.getElementById('mCargo').textContent = p.cargo || '-';
  
  const badge = document.getElementById('mCajaBadge');
  badge.textContent = p.caja ? `Caja ${p.caja} · ${BOX_NAMES[p.caja] || ''}` : 'Sin Caja 9-Box';
  badge.style.background = BOX_COLORS[p.caja] || '#6b7280';

  const vClass = p.hogan_versatilidad === 'Alta Versatilidad' ? 'mb-alta' : 
                 p.hogan_versatilidad === 'Media Versatilidad' ? 'mb-media' : 'mb-prof';
  const vBadge = document.getElementById('mHoganVersBadge');
  vBadge.textContent = p.hogan_versatilidad ? p.hogan_versatilidad : 'Hogan: Sin registro';
  vBadge.className = 'mini-badge ' + (p.hogan_versatilidad ? vClass : '');

  const cBadge = document.getElementById('mHoganClasBadge');
  cBadge.textContent = p.hogan_clasificacion ? `Clasif: ${p.hogan_clasificacion}` : '';
  cBadge.style.display = p.hogan_clasificacion ? 'inline-block' : 'none';

  document.getElementById('mExp').textContent = p.expediente || '-';
  document.getElementById('mDir').textContent = p.direccion || '-';
  document.getElementById('mGer').textContent = p.gerencia || '-';
  document.getElementById('mJefe').textContent = p.jefe || '-';
  document.getElementById('mPotencial').textContent = p.potencial || 'No evaluado';
  document.getElementById('mDesempeno').textContent = p.desempeno || 'No evaluado';
  document.getElementById('mSucesor').textContent = p.sucesor === 'Si' ? 'Sí' : 'No';
  document.getElementById('mTiempo').textContent = p.tiempo || 'N/A';

  // Hogan Details
  if(p.hogan && p.hogan.scores && Object.keys(p.hogan.scores).length > 0){
    document.getElementById('mHoganEmpty').style.display = 'none';
    document.getElementById('mHoganContent').style.display = 'block';
    
    document.getElementById('mHoganPotVal').textContent = `${p.hogan_potencial || 0} pts`;
    document.getElementById('mHoganVersVal').textContent = p.hogan_versatilidad || '-';
    document.getElementById('mHoganStatus').textContent = p.hogan_status || 'Contestó';

    const scoresList = document.getElementById('mHoganScoresList');
    scoresList.innerHTML = '';
    HOGAN_COMPETENCIES.forEach(comp => {
      const val = p.hogan_scores[comp] !== undefined ? p.hogan_scores[comp] : '-';
      const pct = typeof val === 'number' ? val : 0;
      const row = document.createElement('div');
      row.className = 'hs-row';
      row.innerHTML = `
        <span class="hs-lbl" style="width:160px">${comp}</span>
        <div class="hs-bar"><div class="hs-fill" style="width:${pct}%;background:${pct>=75?'var(--green)':pct>=50?'var(--gold)':'var(--crimson)'}"></div></div>
        <span class="hs-val" style="width:30px">${val}</span>
      `;
      scoresList.appendChild(row);
    });
  } else {
    document.getElementById('mHoganEmpty').style.display = 'block';
    document.getElementById('mHoganContent').style.display = 'none';
  }

  const btnFicha = document.getElementById('btnVerFichaCompleta');
  btnFicha.href = `ficha_talento.html?expediente=${p.expediente}`;

  switchModalTab(defaultTab);
  document.getElementById('profileModal').classList.add('open');
}

function switchModalTab(tab){
  document.getElementById('mSecFicha').style.display = tab === 'ficha' ? 'block' : 'none';
  document.getElementById('mSecHogan').style.display = tab === 'hogan' ? 'block' : 'none';

  document.getElementById('btnModalFicha').className = 'tab-btn ' + (tab === 'ficha' ? 'active' : '');
  document.getElementById('btnModalHogan').className = 'tab-btn ' + (tab === 'hogan' ? 'active' : '');
}

function closeProfileModal(){ document.getElementById('profileModal').classList.remove('open'); }

/* ── EXCEL EXPORT ──────────────────────────────────────────────────── */
function exportDataToExcel(){
  if(!FILTERED_DATA.length){ alert('No hay datos para exportar.'); return; }

  const exportRows = FILTERED_DATA.map(r => ({
    'Expediente': r.expediente,
    'Nombre': r.nombre,
    'Cargo': r.cargo,
    'Dirección': r.direccion,
    'Gerencia': r.gerencia,
    'Jefe Directo': r.jefe,
    'Nivel Reporte': r.nivel_reporte,
    'Caja Nine-Box': r.caja,
    'Nombre Caja': BOX_NAMES[r.caja] || '',
    'Desempeño 9-Box': r.desempeno,
    'Potencial 9-Box': r.potencial,
    'Hogan Potencial Score': r.hogan_potencial,
    'Hogan Versatilidad': r.hogan_versatilidad,
    'Hogan Clasificación': r.hogan_clasificacion,
    'Hogan Toma Decisiones': r.hogan_scores ? r.hogan_scores['Toma de Decisiones'] : '',
    'Hogan Liderar a Otros': r.hogan_scores ? r.hogan_scores['Liderar a otros'] : '',
    'Hogan Impulsar Cambio': r.hogan_scores ? r.hogan_scores['Impulsar el Cambio'] : '',
    'Hogan Innovación': r.hogan_scores ? r.hogan_scores['Impulsar la Innovación'] : '',
    'Hogan Responsabilidad': r.hogan_scores ? r.hogan_scores['Responsabilidad'] : '',
    'Sucesor': r.sucesor,
    'Tiempo Sucesión': r.tiempo,
    'Email': r.email,
    'Ciudad': r.ciudad
  }));

  const ws = XLSX.utils.json_to_sheet(exportRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Talento_Liderazgo');
  
  const fileName = `Talento_Liderazgo_${CURRENT_USER ? CURRENT_USER.nombre.replace(/\s+/g, '_') : 'Consolidado'}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

window.addEventListener('DOMContentLoaded', initDashboard);
