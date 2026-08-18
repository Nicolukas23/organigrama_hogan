/* ═══════════════════════════════════════════════════════════════════════
   nav.js — Barra de navegación + Búsqueda global + Atajos de teclado
   Cargar después del <body>. Requiere que exista #loginOverlay (opcional).
   ═══════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* ── CONFIG ──────────────────────────────────────────────────────────── */
var TABLEROS=[
  {id:'index',       label:'Portal',       icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>'},
  {id:'ninebox',     label:'Nine Box',     icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>'},
  {id:'ficha_talento',label:'Ficha de Talento',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'},
  {id:'hogan',       label:'Hogan',        icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>'},
  {id:'organigrama_hogan_claro',label:'Organigrama',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="14"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><line x1="12" y1="14" x2="5" y2="16"/><line x1="12" y1="14" x2="19" y2="16"/></svg>'},
  {id:'informes',    label:'Informes',     icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'},
  {id:'practicantes',label:'Practicantes', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>'}
];

/* Detectar tablero actual */
var currentId=(function(){
  var p=location.pathname.split('/').pop().replace('.html','')||'index';
  return p;
})();

/* ── INJECT STYLES ──────────────────────────────────────────────────── */
var css=document.createElement('link');
css.rel='stylesheet';
css.href=location.pathname.includes('/tableros/')?'../data/nav.css':'data/nav.css';
document.head.appendChild(css);

/* ── NAV BAR ─────────────────────────────────────────────────────────── */
function buildNav(){
  var nav=document.createElement('nav');
  nav.id='appNav';
  nav.className='app-nav';
  nav.innerHTML='<div class="app-nav-inner">'+
    '<div class="app-nav-brand">'+
      '<div class="app-nav-logo">C</div>'+
      '<span class="app-nav-title">Claro Talento</span>'+
    '</div>'+
    '<div class="app-nav-links">'+
      TABLEROS.map(function(t){
        var active=t.id===currentId?' active':'';
        var href=location.pathname.includes('/tableros/')?t.id+'.html':'tableros/'+t.id+'.html';
        return '<a href="'+href+'" class="app-nav-link'+active+'" data-tab="'+t.id+'">'+t.icon+'<span>'+t.label+'</span></a>';
      }).join('')+
    '</div>'+
    '<div class="app-nav-actions">'+
      '<button class="app-nav-search" id="globalSearchBtn" title="Buscar persona (Ctrl+K)">'+
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'+
        '<span>Buscar...</span>'+
        '<kbd>Ctrl+K</kbd>'+
      '</button>'+
      '<div class="app-nav-updated" id="lastUpdated">'+
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>'+
        '<span></span>'+
      '</div>'+
    '</div>'+
  '</div>';
  return nav;
}

/* ── SEARCH MODAL ────────────────────────────────────────────────────── */
function buildSearchModal(){
  var modal=document.createElement('div');
  modal.id='globalSearchModal';
  modal.className='app-search-modal';
  modal.innerHTML=
    '<div class="app-search-backdrop"></div>'+
    '<div class="app-search-dialog">'+
      '<div class="app-search-input-wrap">'+
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'+
        '<input type="text" id="globalSearchInput" placeholder="Buscar persona por nombre, expediente o cargo..." autocomplete="off" spellcheck="false"/>'+
        '<kbd>Esc</kbd>'+
      '</div>'+
      '<div class="app-search-results" id="globalSearchResults">'+
        '<div class="app-search-empty">Escribe al menos 2 caracteres para buscar</div>'+
      '</div>'+
    '</div>';
  return modal;
}

/* ── SEARCH DATA ─────────────────────────────────────────────────────── */
function getSearchData(){
  /* Intenta leer de window.DATA (ficha) o window.RAW (ninebox) */
  var people=[];
  if(window.DATA){
    var info=DATA.informacion||{};
    Object.keys(info).forEach(function(exp){
      var p=info[exp];
      if(p) people.push({exp:exp,nombre:p.nombre||p.Nombre||'',cargo:p.cargo||p.Cargo||'',fuente:'ficha'});
    });
  }
  if(window.RAW && Array.isArray(RAW)){
    RAW.forEach(function(p){
      if(!people.find(function(x){return x.exp===p.expediente;})){
        people.push({exp:p.expediente,nombre:p.nombre||'',cargo:p.cargo||'',fuente:'ninebox'});
      }
    });
  }
  if(window.NB_RAW && Array.isArray(NB_RAW)){
    NB_RAW.forEach(function(p){
      if(!people.find(function(x){return x.exp===p.expediente;})){
        people.push({exp:p.expediente||p.exp,nombre:p.nombre||'',cargo:p.cargo||'',fuente:'ninebox'});
      }
    });
  }
  return people;
}

function searchPeople(query){
  if(!query||query.length<2) return[];
  var q=query.toLowerCase();
  var data=getSearchData();
  return data.filter(function(p){
    return (p.nombre&&p.nombre.toLowerCase().indexOf(q)!==-1)||
           (p.exp&&p.exp.toLowerCase().indexOf(q)!==-1)||
           (p.cargo&&p.cargo.toLowerCase().indexOf(q)!==-1);
  }).slice(0,20);
}

function renderSearchResults(results){
  var el=document.getElementById('globalSearchResults');
  if(!results.length){
    el.innerHTML='<div class="app-search-empty">Sin resultados</div>';
    return;
  }
  el.innerHTML=results.map(function(p){
    var fichaUrl=location.pathname.includes('/tableros/')?'ficha_talento.html?expediente='+p.exp:'tableros/ficha_talento.html?expediente='+p.exp;
    return '<a href="'+fichaUrl+'" class="app-search-item">'+
      '<div class="app-search-avatar">'+(p.nombre?p.nombre.split(' ').filter(function(w){return w.length>2}).slice(0,2).map(function(w){return w[0]}).join('').toUpperCase():'??')+'</div>'+
      '<div class="app-search-info">'+
        '<div class="app-search-name">'+(p.nombre||'Sin nombre')+'</div>'+
        '<div class="app-search-meta">'+p.exp+' · '+(p.cargo||'Sin cargo')+'</div>'+
      '</div>'+
      '<div class="app-search-badge">'+(p.fuente==='ficha'?'F':'N')+'</div>'+
    '</a>';
  }).join('');
}

/* ── LAST UPDATED ────────────────────────────────────────────────────── */
function updateLastUpdated(){
  var el=document.getElementById('lastUpdated');
  if(!el) return;
  var stored=localStorage.getItem('lastSync');
  if(stored){
    var d=new Date(stored);
    el.querySelector('span').textContent='Sync: '+d.toLocaleDateString('es-CO',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
  }else{
    el.querySelector('span').textContent='';
  }
}

/* ── EVENTS ──────────────────────────────────────────────────────────── */
function openSearch(){
  var modal=document.getElementById('globalSearchModal');
  if(!modal) return;
  modal.classList.add('open');
  var input=document.getElementById('globalSearchInput');
  if(input){input.value='';input.focus();}
  document.body.style.overflow='hidden';
}
function closeSearch(){
  var modal=document.getElementById('globalSearchModal');
  if(!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow='';
}

function bindEvents(){
  /* Search button */
  var btn=document.getElementById('globalSearchBtn');
  if(btn) btn.addEventListener('click',openSearch);

  /* Search input */
  var input=document.getElementById('globalSearchInput');
  if(input){
    var debounce;
    input.addEventListener('input',function(){
      clearTimeout(debounce);
      var val=this.value;
      debounce=setTimeout(function(){
        renderSearchResults(searchPeople(val));
      },200);
    });
  }

  /* Backdrop close */
  var backdrop=document.querySelector('.app-search-backdrop');
  if(backdrop) backdrop.addEventListener('click',closeSearch);

  /* Keyboard: Ctrl+K to open, Esc to close */
  document.addEventListener('keydown',function(e){
    if((e.ctrlKey||e.metaKey)&&e.key==='k'){
      e.preventDefault();
      openSearch();
    }
    if(e.key==='Escape'){
      closeSearch();
      /* Also close any open modal in the tablero */
      document.querySelectorAll('.modal-overlay.open,.modal.open,[class*="modal"][class*="open"]').forEach(function(m){
        m.classList.remove('open');
      });
      document.body.style.overflow='';
    }
  });
}

/* ── INIT ────────────────────────────────────────────────────────────── */
function init(){
  /* Don't inject nav if login overlay is visible (wait for login) */
  var overlay=document.getElementById('loginOverlay');
  if(overlay && !overlay.classList.contains('hidden')){
    /* Wait for login */
    var observer=new MutationObserver(function(){
      if(overlay.classList.contains('hidden')){
        observer.disconnect();
        inject();
      }
    });
    observer.observe(overlay,{attributes:true,attributeFilter:['class']});
  }else{
    inject();
  }
}

function inject(){
  /* Insert nav as first child of body */
  var nav=buildNav();
  var searchModal=buildSearchModal();
  document.body.insertBefore(nav,document.body.firstChild);
  document.body.appendChild(searchModal);
  bindEvents();
  updateLastUpdated();
}

/* ── START ───────────────────────────────────────────────────────────── */
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init);
}else{
  init();
}

})();
