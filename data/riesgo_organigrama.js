/* ═══════════════════════════════════════════════════════════════════════
   riesgo_organigrama.js — Organigrama de la Dirección Gestión de Riesgo y
   Control Interno para la pestaña "Organigrama" de tablero_liderazgo.

   Fuente: "RIESGO (1).xlsx" (solo hoja POSICIÓN VS SUCESOR): los jefes de
   esa hoja son los reportes directos del director (confirmado con la
   ninebox de Supabase) y cada fila es uno de sus sucesores.
   sinBrechas: este organigrama se muestra SIN versus ni color de brecha
   (el Excel no trae el tipo de talento que requiere cada cargo).
   La caja 9-Box de los reportes directos sale de la ninebox (el Excel no
   la trae); la de los sucesores, del Excel. Los sucesores que no están en
   la ninebox no tienen expediente ni foto.
   ═══════════════════════════════════════════════════════════════════════ */
(window.ORGANIGRAMAS = window.ORGANIGRAMAS || []).push({
  id: 'riesgo',
  titulo: 'Dirección Gestión de Riesgo y Control Interno',
  direccion: 'Direccion Gestion de Riesgo y Control Interno',
  sinBrechas: true,
  director: {
    expediente: '80150353', foto: '80150353.png',
    nombre: 'VARGAS BLANCO FREDDY ALEXANDER',
    cargo: 'Director(a) Gestion de Riesgo y Control Interno'
  },
  directos: [
    { expediente: '80820898', foto: '80820898.png', nombre: 'CASTRO CARDOZO CARLOS ANDRES', cargo: 'Gerente Seguridad Informacion', caja: '6',
      sucesores: [
        { expediente: '63532006', foto: '63532006.jpg', nombre: 'ALBA RINCON ISABEL', cargo: 'Jefe Estrategia de Seguridad de la Informacion y Ciberseguridad', tiempo: '3 AÑOS', caja: '8', persona: 'SÓLIDO' }
      ] },
    { expediente: '55180918', foto: '55180918.jpg', nombre: 'IBARRA CERON JANETH CONSTANZA', cargo: 'Gerente Aseguramiento Ingresos', caja: '7',
      sucesores: [
        { expediente: '1015415329', foto: '1015415329.png', nombre: 'LOPEZ JARAMILLO HERNANDO', cargo: 'Jefe Operacion y Gestion', tiempo: '3 AÑOS', caja: '5', persona: 'SÓLIDO' },
        { expediente: '75071414', foto: '75071414.jpeg', nombre: 'RESTREPO SEPULVEDA HAROLD RICARDO', cargo: 'Jefe Analisis y Mejoramiento', tiempo: '2 AÑOS', caja: '5', persona: 'SÓLIDO' },
        { expediente: '80004393', foto: '80004393.jpg', nombre: 'RAMIREZ RINCON CARLOS JULIO', cargo: 'Gerente Prevencion Fraude', tiempo: '1 AÑO', caja: '7', persona: 'EXPERTO' }
      ] },
    { expediente: '37893805', foto: '37893805.jpg', nombre: 'CASTILLO MARTINEZ MARTHA LILIANA', cargo: 'Oficial Cumplimiento', caja: '4',
      sucesores: [
        { expediente: '', foto: '', nombre: 'DUARTE MENDEZ MONICA ANDREA', cargo: 'Analista Sarlaf', tiempo: 'LISTO YA', caja: '', persona: '' },
        { expediente: '80111618', foto: '80111618.jpg', nombre: 'BAENA JARAMILLO ALEJANDRO', cargo: 'Gerente Contratos Transparencia y Etica Empresarial', tiempo: 'LISTO YA', caja: '2', persona: 'SÓLIDO' }
      ] },
    { expediente: '80004393', foto: '80004393.jpg', nombre: 'RAMIREZ RINCON CARLOS JULIO', cargo: 'Gerente Prevencion Fraude', caja: '7',
      sucesores: [
        { expediente: '1233695609', foto: '1233695609.png', nombre: 'PACHON ARIAS NICOLAS DAVID', cargo: 'Jefe Prevencion Fraude', tiempo: '2 AÑOS', caja: '5', persona: 'SÓLIDO' },
        { expediente: '52706228', foto: '52706228.png', nombre: 'RIVEROS GUZMAN CAROLINA', cargo: 'Jefe Proteccion Tecnologica y Consultoria de Seguridad de la Informacion', tiempo: '2 AÑOS', caja: '5', persona: 'SÓLIDO' }
      ] },
    { expediente: '52110121', foto: '52110121.jpg', nombre: 'SANABRIA CARDOZO LILIANA PATRICIA', cargo: 'Gerente Cumplimiento y Continuidad Datacenter', caja: '4',
      sucesores: [
        { expediente: '', foto: '', nombre: 'GRASS ARDILA GERALDINE', cargo: 'Ingeniero(a) Aseguramiento Calidad y Mejora Continua E&N', tiempo: '2 AÑOS', caja: '', persona: '' },
        { expediente: '1129543149', foto: '1129543149.png', nombre: 'BOHORQUEZ HERNANDEZ JOHNATHAN ERNESTO', cargo: 'Gerente Riesgo Tecnologico', tiempo: '1 AÑO', caja: '6', persona: 'VERSÁTIL' },
        { expediente: '', foto: '', nombre: 'BAUTISTA PARRA RAMIRO ALFONSO', cargo: 'Arquitecto(a) Senior Soporte TIC', tiempo: 'LISTO YA', caja: '', persona: '' }
      ] },
    { expediente: '1129543149', foto: '1129543149.png', nombre: 'BOHORQUEZ HERNANDEZ JOHNATHAN ERNESTO', cargo: 'Gerente Riesgo Tecnologico', caja: '4',
      sucesores: [
        { expediente: '52492548', foto: '52492548.jpg', nombre: 'MORENO MORENO ADRIANA', cargo: 'Gerente Auditoria Sistemas', tiempo: '1 AÑO', caja: '6', persona: 'VERSÁTIL' }
      ] },
    { expediente: '79965710', foto: '79965710.png', nombre: 'GONZALEZ CHAVES DIEGO MIGUEL', cargo: 'Gerente Riesgo Operativo y Control Interno', caja: '5',
      sucesores: [
        { expediente: '80096673', foto: '80096673.png', nombre: 'GARCIA CERTUCHE CESAR EDUARDO', cargo: 'Lider Gestion Riesgo', tiempo: '2 AÑOS', caja: '7', persona: 'EXPERTO' },
        { expediente: '53015362', foto: '53015362.jpg', nombre: 'CASAS SILVA CAROLINA', cargo: 'Gerente Riesgo Financiero', tiempo: 'LISTO YA', caja: '5', persona: 'SÓLIDO' },
        { expediente: '52110121', foto: '52110121.jpg', nombre: 'SANABRIA CARDOZO LILIANA PATRICIA', cargo: 'Gerente Cumplimiento y Continuidad Datacenter', tiempo: 'LISTO YA', caja: '', persona: '' }
      ] },
    { expediente: '53015362', foto: '53015362.jpg', nombre: 'CASAS SILVA CAROLINA', cargo: 'Gerente Riesgo Financiero', caja: '5',
      sucesores: [
        { expediente: '79965710', foto: '79965710.png', nombre: 'GONZALEZ CHAVES DIEGO MIGUEL', cargo: 'Gerente Riesgo Operativo y Control Interno', tiempo: 'LISTO YA', caja: '5', persona: 'SÓLIDO' }
      ] },
    { expediente: '79843010', foto: '79843010.jpg', nombre: 'BUSTOS MANCERA CAMILO ANDRES', cargo: 'Gerente Riesgos de Proyectos y Monitoreo', caja: '4',
      sucesores: [
        { expediente: '79965710', foto: '79965710.png', nombre: 'GONZALEZ CHAVES DIEGO MIGUEL', cargo: 'Gerente Riesgo Operativo y Control Interno', tiempo: 'LISTO YA', caja: '5', persona: 'SÓLIDO' },
        { expediente: '', foto: '', nombre: 'AGUIA GUTIERREZ CARLOS ANDRES', cargo: 'Gerente Sistemas SAP Administrativos y Financieros', tiempo: 'LISTO YA', caja: '', persona: '' }
      ] }
  ]
});
