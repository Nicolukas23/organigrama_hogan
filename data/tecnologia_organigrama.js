/* ═══════════════════════════════════════════════════════════════════════
   tecnologia_organigrama.js — Organigrama de la Dirección Corporativa
   Tecnología para la pestaña "Organigrama" de tablero_liderazgo.

   Fuente: "TECNOLOGÍA - Recalibrado.xlsx"
     · hoja POSICIÓN VS OCUPANTE → reportes directos del director
     · hoja POSICIÓN VS SUCESOR  → sucesores de cada reporte directo
   Expediente, caja y foto (data/FOTOS/<expediente>.<ext>) cruzados con
   la tabla ninebox de Supabase. Misma estructura que umc_organigrama.js.

   Posición y persona usan EXPERTO / SÓLIDO / VERSÁTIL (niveles 1 / 2 / 3).
   La clasificación de brecha se toma tal cual del Excel recalibrado.
   ═══════════════════════════════════════════════════════════════════════ */
(window.ORGANIGRAMAS = window.ORGANIGRAMAS || []).push({
  id: 'tecnologia',
  titulo: 'Dirección Corporativa Tecnología',
  direccion: 'Direccion Corporativa Tecnologia',
  director: {
    expediente: '85467103', foto: '85467103.png',
    nombre: 'MALDONADO ROBLES IADER ALBERTO',
    cargo: 'Director(a) Corporativo Tecnologia'
  },
  directos: [
    { expediente: '52809026', foto: '52809026.jpg', nombre: 'CASTAÑEDA ALDANA NAYIBE ALCIRA', cargo: 'Director(a) de Administracion Recursos Tecnicos',
      posicion: 'EXPERTO', persona: 'VERSÁTIL', caja: '6', brecha: -2, clasif: 'ALTA',
      sucesores: [
        { expediente: '52433846', foto: '52433846.png', nombre: 'GALINDO LOPEZ BIBIAM JIMENA', cargo: 'Gerente Administrativa Inmuebles e Infraestructura', tiempo: '3 AÑOS', caja: '7', persona: 'EXPERTO', brecha: 0, clasif: 'BAJA' },
        { expediente: '80055832', foto: '80055832.jpg', nombre: 'SANTIAGO SANCHEZ RONAL ANTONIO', cargo: 'Gerente Control de Costos y Operacion', tiempo: '3 AÑOS', caja: '7', persona: 'EXPERTO', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '79277334', foto: '79277334.jpg', nombre: 'DONADO ARENAS CARLOS EFREN', cargo: 'Director(a) Servicios TIC y Datacenter',
      posicion: 'SÓLIDO', persona: 'SÓLIDO', caja: '5', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '52997400', foto: '52997400.jpg', nombre: 'LEMUS MEDINA INGRITH CATALINA', cargo: 'Gerente Implementacion y Clientes Corporativos', tiempo: '1 AÑO', caja: '5', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' },
        { expediente: '80099040', foto: '80099040.jpeg', nombre: 'AVILA PLATA OSCAR MAURICIO', cargo: 'Director(a) Aseguramiento Calidad de Servicio', tiempo: 'LISTO YA', caja: '6', persona: 'VERSÁTIL', brecha: -1, clasif: 'MEDIA' }
      ] },
    { expediente: '78747249', foto: '78747249.jpg', nombre: 'OTERO DUMAR ALVARO MIGUEL', cargo: 'Director(a) Implementacion',
      posicion: 'EXPERTO', persona: 'SÓLIDO', caja: '5', brecha: -1, clasif: 'MEDIA',
      sucesores: [
        { expediente: '98385917', foto: '98385917.jpg', nombre: 'RICAURTE SEGOVIA IVAN ADOLFO', cargo: 'Gerente Implementacion Red de Acceso', tiempo: '2 AÑOS', caja: '8', persona: 'SÓLIDO', brecha: -1, clasif: 'MEDIA' },
        { expediente: '80188592', foto: '80188592.jpg', nombre: 'GONZALEZ TORRES JHONNATAN PAOLO', cargo: 'Gerente Implementacion Acceso Celular e Infraestructura', tiempo: '3 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: -1, clasif: 'MEDIA' }
      ] },
    { expediente: '79455718', foto: '79455718.jpg', nombre: 'BAYONA PORRAS JUAN MAURICIO', cargo: 'Gerente Planeacion Tecnologia',
      posicion: 'VERSÁTIL', persona: 'SÓLIDO', caja: '8', brecha: 1, clasif: 'MEDIA',
      sucesores: [
        { expediente: '13870556', foto: '13870556.png', nombre: 'MELENDEZ BETANCOURT JAVIER ALEJANDRO', cargo: 'Gerente Planeacion Servicios Corporativos y Datacenter', tiempo: '1 AÑO', caja: '6', persona: 'VERSÁTIL', brecha: 0, clasif: 'BAJA' },
        { expediente: '79897183', foto: '79897183.jpg', nombre: 'SANCHEZ DIEZ MAURICIO ALBERTO', cargo: 'Gerente Ingenieria y Arquitectura Servicio Movil', tiempo: 'LISTO YA', caja: '9', persona: 'VERSÁTIL', brecha: 0, clasif: 'BAJA' },
        { expediente: '72257140', foto: '72257140.png', nombre: 'ZABALETA POMBO JULIO ALBERTO', cargo: 'Gerente Planeacion Evolucion y Estrategia Servicio Movil y Fijo', tiempo: '1 AÑO', caja: '8', persona: 'SÓLIDO', brecha: 1, clasif: 'MEDIA' }
      ] },
    { expediente: '19420900', foto: '19420900.jpg', nombre: 'CAJIGAS SILVA MIGUEL EDUARDO', cargo: 'Director(a) Experiencia Soporte y Operacion IT',
      posicion: 'VERSÁTIL', persona: 'EXPERTO', caja: '1', brecha: 2, clasif: 'ALTA',
      sucesores: [
        { expediente: '7317314', foto: '7317314.png', nombre: 'LANCHEROS CURREA CESAR FABIAN', cargo: 'Gerente Control Operativo Devsecops', tiempo: '3 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 1, clasif: 'MEDIA' },
        { expediente: '80084586', foto: '80084586.png', nombre: 'LOPERA MARQUEZ GERMAN AUGUSTO', cargo: 'Gerente Control Portafolio de Proyectos', tiempo: '3 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 1, clasif: 'MEDIA' }
      ] },
    { expediente: '12193497', foto: '12193497.jpg', nombre: 'QUINTERO LOPEZ CARLOS HUMBERTO', cargo: 'Director(a) Operaciones Tecnicas de Campo',
      posicion: 'SÓLIDO', persona: 'SÓLIDO', caja: '5', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '80021548', foto: '80021548.jpg', nombre: 'RODRIGUEZ CORREA JULIAN HERNANDO', cargo: 'Gerente O&M Red Fija', tiempo: '2 AÑOS', caja: '7', persona: 'EXPERTO', brecha: 1, clasif: 'MEDIA' },
        { expediente: '52809026', foto: '52809026.jpg', nombre: 'CASTAÑEDA ALDANA NAYIBE ALCIRA', cargo: 'Director(a) de Administracion Recursos Tecnicos', tiempo: '2 AÑOS', caja: '6', persona: 'VERSÁTIL', brecha: -1, clasif: 'MEDIA' },
        { expediente: '79943837', foto: '79943837.jpg', nombre: 'SANCHEZ BORDA OSCAR ALBERTO', cargo: 'Gerente Aseguramiento Calidad y Recursos', tiempo: '1 AÑO', caja: '8', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '79532521', foto: '79532521.jpg', nombre: 'SALAZAR BARON HUGO ALEXANDER', cargo: 'Director(a) Ingenieria',
      posicion: 'SÓLIDO', persona: 'EXPERTO', caja: '7', brecha: 1, clasif: 'MEDIA',
      sucesores: [
        { expediente: '79897183', foto: '79897183.jpg', nombre: 'SANCHEZ DIEZ MAURICIO ALBERTO', cargo: 'Gerente Ingenieria y Arquitectura Servicio Movil', tiempo: '1 AÑO', caja: '9', persona: 'VERSÁTIL', brecha: -1, clasif: 'MEDIA' },
        { expediente: '79455718', foto: '79455718.jpg', nombre: 'BAYONA PORRAS JUAN MAURICIO', cargo: 'Gerente Planeacion Tecnologia', tiempo: '1 AÑO', caja: '8', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' },
        { expediente: '52009864', foto: '52009864.jpeg', nombre: 'CHACON GONZALEZ LILIANA PATRICIA', cargo: 'Gerente Ingenieria Red IP Transmision & Infraestructura', tiempo: '2 AÑOS', caja: '8', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '80099040', foto: '80099040.jpeg', nombre: 'AVILA PLATA OSCAR MAURICIO', cargo: 'Director(a) Aseguramiento Calidad de Servicio',
      posicion: 'SÓLIDO', persona: 'VERSÁTIL', caja: '6', brecha: -1, clasif: 'MEDIA',
      sucesores: [
        { expediente: '43983175', foto: '43983175.png', nombre: 'GARCES ZAPATA CAROLINA', cargo: 'Gerente SOC Masivo', tiempo: '2 AÑOS', caja: '6', persona: 'VERSÁTIL', brecha: -1, clasif: 'MEDIA' },
        { expediente: '80755651', foto: '80755651.png', nombre: 'RIVAS GUARNIZO MARCO AURELIO', cargo: 'Gerente Aseguramiento y Riesgos', tiempo: '1 AÑO', caja: '5', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' }
      ] }
  ]
});
