/* ═══════════════════════════════════════════════════════════════════════
   auditoria_organigrama.js — Organigrama de la Dirección Auditoría para
   la pestaña "Organigrama" de tablero_liderazgo.

   Fuente: "AUDITORIA Recalibrado.xlsx"
     · hoja POSICIÓN VS OCUPANTE → reportes directos del director
     · hoja POSICIÓN VS SUCESOR  → sucesores de cada reporte directo
   Expediente, cargo y foto (data/FOTOS/<expediente>.<ext>) cruzados con
   la tabla ninebox de Supabase. Misma estructura que umc_organigrama.js.
   ═══════════════════════════════════════════════════════════════════════ */
(window.ORGANIGRAMAS = window.ORGANIGRAMAS || []).push({
  id: 'auditoria',
  titulo: 'Dirección Auditoría',
  direccion: 'Direccion Auditoria',
  director: {
    expediente: '52185300', foto: '52185300.png',
    nombre: 'HERNANDEZ HERNANDEZ SANDRA LILIANA',
    cargo: 'Director(a) Auditoria'
  },
  directos: [
    { expediente: '52492548', foto: '52492548.jpg', nombre: 'MORENO MORENO ADRIANA', cargo: 'Gerente Auditoria Sistemas',
      posicion: 'EXPERTO', persona: 'EXPERTO', caja: '7', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '39582818', foto: '39582818.png', nombre: 'JARAMILLO YARCE YULIANA ANDREA', cargo: 'Auditor(a) Sistemas Sr', tiempo: '2 AÑOS', caja: '6', persona: 'VERSÁTIL', brecha: -2, clasif: 'ALTA' },
        { expediente: '52105775', foto: '52105775.jpg', nombre: 'SARMIENTO SANDOVAL ADRIANA CONSUELO', cargo: 'Jefe Gestion Identidades y Accesos', tiempo: '3 AÑOS', caja: '4', persona: 'EXPERTO', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '53073416', foto: '53073416.jpg', nombre: 'MONSALVE HERNANDEZ DIANA CAROLINA', cargo: 'Gerente Auditoria Operativa y Financiera',
      posicion: 'EXPERTO', persona: 'EXPERTO', caja: '4', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '1010198378', foto: '1010198378.png', nombre: 'PINZON LUIS KELLY JOHANA', cargo: 'Auditor(a) Operativo y Financiero Sr', tiempo: '2 AÑOS', caja: '8', persona: 'SÓLIDO', brecha: -1, clasif: 'MEDIA' },
        { expediente: '1016053644', foto: '1016053644.jpg', nombre: 'VELA MARTINEZ JUAN DAVID', cargo: 'Auditor(a) Operativo y Financiero', tiempo: '3 AÑOS', caja: '4', persona: 'EXPERTO', brecha: 0, clasif: 'BAJA' },
        { expediente: '53015362', foto: '53015362.jpg', nombre: 'CASAS SILVA CAROLINA', cargo: 'Gerente Riesgo Financiero', tiempo: 'LISTA', caja: '5', persona: 'SÓLIDO', brecha: -1, clasif: 'MEDIA' }
      ] }
  ]
});
