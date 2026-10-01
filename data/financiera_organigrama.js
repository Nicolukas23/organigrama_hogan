/* ═══════════════════════════════════════════════════════════════════════
   financiera_organigrama.js — Organigrama de la Dirección Corporativa
   Financiera para la pestaña "Organigrama" de tablero_liderazgo.

   Fuente: "FINANCIERA (1).xlsx"
     · hoja POSICIÓN VS OCUPANTE → reportes directos del director
     · hoja POSICIÓN VS SUCESOR  → sucesores de cada reporte directo
   Expediente, foto (data/FOTOS/<expediente>.<ext>) y director cruzados con
   la tabla ninebox de Supabase. Misma estructura que umc_organigrama.js.
   ═══════════════════════════════════════════════════════════════════════ */
(window.ORGANIGRAMAS = window.ORGANIGRAMAS || []).push({
  id: 'financiera',
  titulo: 'Dirección Corporativa Financiera',
  direccion: 'Direccion Corporativa Financiera',
  director: {
    expediente: '79947402', foto: '79947402.png',
    nombre: 'BORDA FERRO WALTER JAVIER',
    cargo: 'Director(a) Corporativo Financiero'
  },
  directos: [
    { expediente: '52912096', foto: '52912096.jpg', nombre: 'CHACON GOMEZ MYRIAM YOLANDA', cargo: 'Director(a) Experiencia del Cliente',
      posicion: 'VERSÁTIL', persona: 'VERSÁTIL', caja: '6', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '80070878', foto: '80070878.png', nombre: 'IGUA PORRAS FREDDY ALDEMAR', cargo: 'Gerente Experiencia Pospago y Hogar', tiempo: '2 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 1, clasif: 'MEDIA' },
        { expediente: '72273597', foto: '72273597.png', nombre: 'BERRIO GARCIA JULIO CESAR', cargo: 'Gerente Digital', tiempo: '1 AÑO', caja: '7', persona: 'EXPERTO', brecha: 2, clasif: 'ALTA' }
      ] },
    { expediente: '53120673', foto: '53120673.png', nombre: 'SALAS MAHECHA VIVIANA ANDREA', cargo: 'Director(a) Planeacion Financiera y Tesoreria',
      posicion: 'SÓLIDO', persona: 'SÓLIDO', caja: '5', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '1015417124', foto: '1015417124.png', nombre: 'POVEDA VALERO JULIO CESAR', cargo: 'Gerente Analisis y Estrategia Financiera', tiempo: '2 AÑOS', caja: '8', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '46670410', foto: '46670410.jpg', nombre: 'SANABRIA HIGUERA ANA PATRICIA', cargo: 'Director(a) Soporte a la Operacion',
      posicion: 'SÓLIDO', persona: 'SÓLIDO', caja: '5', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '80058898', foto: '80058898.png', nombre: 'MARTINEZ FLORIDO ANDRES FRANCISCO', cargo: 'Gerente Comisiones', tiempo: '1 AÑO', caja: '8', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '80096815', foto: '80096815.jpg', nombre: 'TRUJILLO REHBEIN PABLO', cargo: 'Director(a) Supply Chain',
      posicion: 'SÓLIDO', persona: 'VERSÁTIL', caja: '6', brecha: -1, clasif: 'MEDIA',
      sucesores: [
        { expediente: '80070923', foto: '80070923.png', nombre: 'CAÑON LARA CARLOS ANDRES', cargo: 'Gerente Supply Chain Aliados y Proveedores', tiempo: '2 AÑOS', caja: '9', persona: 'VERSÁTIL', brecha: -1, clasif: 'MEDIA' },
        { expediente: '52704630', foto: '52704630.png', nombre: 'CASAS GUTIERREZ MARIA CECILIA', cargo: 'Gerente Centro Value Chain UMM', tiempo: '2 AÑOS', caja: '6', persona: 'VERSÁTIL', brecha: -1, clasif: 'MEDIA' }
      ] },
    { expediente: '79576371', foto: '79576371.jpg', nombre: 'TORRES RIVERA CARLOS ALBERTO', cargo: 'Director(a) Contraloria',
      posicion: 'EXPERTO', persona: 'SÓLIDO', caja: '5', brecha: -1, clasif: 'MEDIA',
      sucesores: [
        { expediente: '80844584', foto: '80844584.png', nombre: 'MATEUS VELASCO HECTOR VICENTE', cargo: 'Gerente Control Ingresos y Costos', tiempo: '3 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: -1, clasif: 'MEDIA' },
        { expediente: '79495740', foto: '79495740.png', nombre: 'ACEVEDO ARIAS MAURICIO', cargo: 'Gerente de Impuestos y planeacion Fiscal', tiempo: '2 AÑOS', caja: '8', persona: 'SÓLIDO', brecha: -1, clasif: 'MEDIA' }
      ] }
  ]
});
