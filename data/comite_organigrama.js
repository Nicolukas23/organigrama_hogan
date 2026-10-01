/* ═══════════════════════════════════════════════════════════════════════
   comite_organigrama.js — Organigrama "Comité Ejecutivo" para la pestaña
   "Organigrama" de tablero_liderazgo.

   Fuente: "Comité Ejecutivo.xlsx" (los datos ya están en
   data/comite_ejecutivo.js, que debe cargarse antes que este archivo).
     · hoja CARGO            → los 9 directores (reportes directos) y el
                               tipo de talento que requiere su cargo
     · hoja CARGO VS SUCESOR → sucesores de cada director
   El Excel no trae el tipo de talento de cada director ni su caja 9-Box,
   así que sus tarjetas muestran solo lo que requiere el cargo.
   Expediente y foto de cada director cruzados con la ninebox de Supabase.
   ═══════════════════════════════════════════════════════════════════════ */
(function(){
  const ce = window.COMITE_EJECUTIVO || {};
  // Orden de la hoja CARGO del Excel.
  const miembros = [
    ['52185300',   'HERNANDEZ HERNANDEZ SANDRA LILIANA', 'Director(a) Auditoria',                                       '52185300.png'],
    ['79947402',   'BORDA FERRO WALTER JAVIER',          'Director(a) Corporativo Financiero',                          '79947402.png'],
    ['79516122',   'BUSTOS SUAREZ GERMAN LEONARDO',      'Director(a) Corporativo Gestion Humana y Administrativo',     '79516122.png'],
    ['80425417',   'PARDO FAJARDO SANTIAGO',             'Director(a) Corporativo Juridica y Sostenibilidad',           '80425417.png'],
    ['1128466768', 'GUZMAN FLOREZ DANIEL',               'Director(a) Corporativo Planeacion Estrategica e Innovacion', '1128466768.png'],
    ['85467103',   'MALDONADO ROBLES IADER ALBERTO',     'Director(a) Corporativo Tecnologia',                          '85467103.png'],
    ['80150353',   'VARGAS BLANCO FREDDY ALEXANDER',     'Director(a) Gestion de Riesgo y Control Interno',             '80150353.png'],
    ['32781111',   'ESCOLAR SUNDHEIM MARIA LUISA',       'Director(a) Ejecutivo Unidad Mercado Corporativo',            '32781111.png'],
    ['1138186',    'DOMINGUEZ DANIEL ARNALDO',           'Director(a) Ejecutivo Unidad Mercado Masivo',                 '1138186.png']
  ];
  (window.ORGANIGRAMAS = window.ORGANIGRAMAS || []).push({
    id: 'comite',
    titulo: 'Comité Ejecutivo',
    direccion: 'Comité Directivo',
    // Caja raíz sin persona: el Excel solo trae a los directores.
    director: { nombre: 'COMITÉ EJECUTIVO', cargo: 'Directores del Comité Ejecutivo' },
    directos: miembros.map(([exp, nombre, cargo, foto]) => ({
      expediente: exp, foto, nombre, cargo,
      posicion: ce[exp] ? ce[exp].posicion : '',
      sucesores: ce[exp] ? ce[exp].sucesores : []
    }))
  });
})();
