/* ═══════════════════════════════════════════════════════════════════════
   planeacion_organigrama.js — Organigrama de la Dirección Corporativa
   Planeación Estratégica e Innovación para la pestaña "Organigrama" de
   tablero_liderazgo.

   Fuente: "PLANEACIÓN (002).xlsx"
     · hoja POSICIÓN VS OCUPANTE → reportes directos del director
     · hoja POSICIÓN VS SUCESOR  → sucesores de cada reporte directo
   Expediente, foto (data/FOTOS/<expediente>.<ext>) y director cruzados con
   la tabla ninebox de Supabase. Misma estructura que umc_organigrama.js.
   posicion en un sucesor: tipo de talento del cargo según la hoja de
   sucesores cuando difiere del de la hoja de ocupantes (Gerente Gestión
   del Portafolio: VERSÁTIL en CARGO y SUCESOR, SÓLIDO en OCUPANTE).
   ═══════════════════════════════════════════════════════════════════════ */
(window.ORGANIGRAMAS = window.ORGANIGRAMAS || []).push({
  id: 'planeacion',
  titulo: 'Dirección Corporativa Planeación Estratégica e Innovación',
  direccion: 'Direccion Corporativa Planeacion Estrategica e Innovacion',
  director: {
    expediente: '1128466768', foto: '1128466768.png',
    nombre: 'GUZMAN FLOREZ DANIEL',
    cargo: 'Director(a) Corporativo Planeacion Estrategica e Innovacion'
  },
  directos: [
    { expediente: '4617732', foto: '4617732.jpeg', nombre: 'ESTUPIÑAN LOPEZ ANDRES FERNANDO', cargo: 'Director(a) Datos y Analitica de Negocios',
      posicion: 'SÓLIDO', persona: 'SÓLIDO', caja: '8', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '80153086', foto: '80153086.png', nombre: 'PEÑUELA CRUZ JOHN HOWARD', cargo: 'Gerente Arquitectura E Ingenieria Datos', tiempo: '1 AÑO', caja: '8', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' },
        { expediente: '7603469', foto: '7603469.png', nombre: 'DEL CASTILLO PAVAJEAU RAFAEL JOSE', cargo: 'Gerente Analitica Avanzada', tiempo: '3 AÑOS', caja: '8', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '94429618', foto: '94429618.jpeg', nombre: 'PUERTAS OROZCO CARLOS ANDRES', cargo: 'Director(a) Planeacion',
      posicion: 'SÓLIDO', persona: 'EXPERTO', caja: '7', brecha: 1, clasif: 'MEDIA',
      sucesores: [
        // En el Excel dice "2 AÑO".
        { expediente: '80098521', foto: '80098521.png', nombre: 'USECHE VARON JOHN JAIRO', cargo: 'Gerente Planeacion Estrategica', tiempo: '2 AÑOS', caja: '8', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' },
        { expediente: '3216158', foto: '3216158.png', nombre: 'SARMIENTO GONZALEZ LUIS ALEJANDRO', cargo: 'Gerente Gestion del Portafolio', tiempo: 'LISTO YA', caja: '5', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '3216158', foto: '3216158.png', nombre: 'SARMIENTO GONZALEZ LUIS ALEJANDRO', cargo: 'Gerente Gestion del Portafolio',
      posicion: 'SÓLIDO', persona: 'SÓLIDO', caja: '5', brecha: 0, clasif: 'BAJA',
      sucesores: [
        // 9-Box #N/A en el Excel y sin registro en la ninebox.
        { expediente: '', foto: '', nombre: 'MEJIA PULIDO WILMER ALEXANDER', cargo: 'Jefe Implementacion y Mejoramiento CAV y Tiendas', tiempo: '3 AÑOS', caja: '', posicion: 'VERSÁTIL', persona: 'SÓLIDO', brecha: 0, clasif: 'MEDIA' }
      ] }
  ]
});
