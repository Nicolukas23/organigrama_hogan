/* ═══════════════════════════════════════════════════════════════════════
   gestion_humana_organigrama.js — Organigrama de la Dirección Corporativa
   Gestión Humana y Administrativa para la pestaña "Organigrama" de
   tablero_liderazgo.

   Fuente: "G. HUMANA RECALIBRADA V. 011026.xlsx"
     · hoja POSICIÓN VS OCUPANTE → reportes directos del director
     · hoja POSICIÓN VS SUCESOR  → sucesores de cada reporte directo
   Expediente, foto (data/FOTOS/<expediente>.<ext>) y director cruzados con
   la tabla ninebox de Supabase. Misma estructura que umc_organigrama.js.
   Sucesores sin tipo de talento en el Excel (persona vacía) se muestran
   sin versus; los que no están en la ninebox no tienen expediente ni foto.
   ═══════════════════════════════════════════════════════════════════════ */
(window.ORGANIGRAMAS = window.ORGANIGRAMAS || []).push({
  id: 'gestion_humana',
  titulo: 'Dirección Corporativa Gestión Humana y Administrativa',
  direccion: 'Direccion Corporativa Gestion Humana y Administrativo',
  director: {
    expediente: '79516122', foto: '79516122.png',
    nombre: 'BUSTOS SUAREZ GERMAN LEONARDO',
    cargo: 'Director(a) Corporativo Gestion Humana y Administrativo'
  },
  directos: [
    { expediente: '60333937', foto: '60333937.jpg', nombre: 'CARDONA TORRES CLAUDIA ISABEL', cargo: 'Gerente Servicios Administrativos',
      posicion: 'SÓLIDO', persona: 'EXPERTO', caja: '4', brecha: 1, clasif: 'MEDIA',
      sucesores: [
        { expediente: '1032470261', foto: '1032470261.png', nombre: 'BERJAN LOPEZ DANIEL MAURICIO', cargo: 'Jefe Implementacion y Mantenimiento CAVS y Sedes', tiempo: '2 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' },
        { expediente: '79996518', foto: '79996518.png', nombre: 'BEJARANO ACOSTA JOSE MARIO', cargo: 'Jefe Operativo Centro Comercial', tiempo: '3 AÑOS', caja: '8', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '79313587', foto: '79313587.jpg', nombre: 'DIAZ CLEVES DARIO', cargo: 'Gerente Seguridad Y Riesgo',
      posicion: 'SÓLIDO', persona: 'EXPERTO', caja: '4', brecha: 1, clasif: 'MEDIA',
      sucesores: [
        { expediente: '93403812', foto: '93403812.png', nombre: 'MEJIA CASTELLANOS GEOVANNY', cargo: 'Jefe Prevencion Y Control Perdida', tiempo: '2 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '52144444', foto: '52144444.jpg', nombre: 'MORALES MOLANO SANDRA PATRICIA', cargo: 'Gerente Relaciones Laborales & SST',
      posicion: 'SÓLIDO', persona: 'SÓLIDO', caja: '5', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '52560948', foto: '52560948.png', nombre: 'CASTRO PEDRAZA CLAUDIA ROCIO', cargo: 'Jefe Relaciones Colectivas', tiempo: '2 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' },
        { expediente: '38600645', foto: '38600645.jpg', nombre: 'CASTRO RAMIREZ ANGELICA MARIA', cargo: 'Business Partner Gestion Humana R2', tiempo: '3 AÑOS', caja: '8', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '52804512', foto: '52804512.png', nombre: 'LOPEZ TAVERA MARIA PAULA CATALINA', cargo: 'Gerente Talento Cultura y Comunicaciones',
      posicion: 'VERSÁTIL', persona: 'SÓLIDO', caja: '5', brecha: 1, clasif: 'MEDIA',
      sucesores: [
        { expediente: '52991488', foto: '52991488.png', nombre: 'MONROY URUEÑA KARINA ANDREA', cargo: 'Jefe Cultura y Cambio', tiempo: '3 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 1, clasif: 'MEDIA' },
        { expediente: '52392875', foto: '52392875.jpg', nombre: 'RODRIGUEZ ALFARO ANGIE MARCELA', cargo: 'Jefe Atraccion y Planeacion de Talento', tiempo: '3 AÑOS', caja: '7', persona: 'EXPERTO', brecha: 2, clasif: 'ALTA' },
        { expediente: '53128730', foto: '53128730.png', nombre: 'AMAYA BONILLA MILEIDY', cargo: 'Jefe Investigacion y Desarrollo Contenidos', tiempo: '3 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 1, clasif: 'MEDIA' }
      ] },
    { expediente: '79297860', foto: '79297860.png', nombre: 'MORALES CLAVIJO LUIS GERMAN', cargo: 'Gerente Gestion Humana Negocio Y Transversales',
      posicion: 'VERSÁTIL', persona: 'VERSÁTIL', caja: '9', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '1018464374', foto: '1018464374.png', nombre: 'VARGAS CLAVIJO SEBASTIAN', cargo: 'Business Partner Gestion Humana', tiempo: '3 AÑOS', caja: '8', persona: 'SÓLIDO', brecha: 1, clasif: 'MEDIA' },
        { expediente: '52144444', foto: '52144444.jpg', nombre: 'MORALES MOLANO SANDRA PATRICIA', cargo: 'Gerente Relaciones Laborales & SST', tiempo: '1 AÑO', caja: '5', persona: 'SÓLIDO', brecha: 1, clasif: 'MEDIA' }
      ] },
    { expediente: '79707735', foto: '79707735.jpg', nombre: 'RODRIGUEZ AFANADOR FREDY ENRIQUE', cargo: 'Gerente Plaza Claro',
      posicion: 'SÓLIDO', persona: 'EXPERTO', caja: '4', brecha: 1, clasif: 'MEDIA',
      sucesores: [
        // El Excel no trae caja 9-Box, tipo de talento ni brecha para esta fila.
        { expediente: '80206381', foto: '80206381.png', nombre: 'ESCOBAR MENDIGAÑA JAVIER NICOLAS', cargo: 'Gerente Marketing innovación y Comunicaciones', tiempo: '1 AÑO', caja: '', persona: '', brecha: null, clasif: '' }
      ] },
    { expediente: '79939609', foto: '79939609.jpg', nombre: 'CASTELLANOS RODRIGUEZ MIGUEL ANGEL', cargo: 'Gerente Universidad Claro',
      posicion: 'SÓLIDO', persona: 'VERSÁTIL', caja: '3', brecha: -1, clasif: 'MEDIA',
      sucesores: [
        { expediente: '53128730', foto: '53128730.png', nombre: 'AMAYA BONILLA MILEIDY', cargo: 'Jefe Investigacion y Desarrollo Contenidos', tiempo: '2 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' },
        { expediente: '1098651674', foto: '1098651674.png', nombre: 'GELVES VARGAS MAYERLY', cargo: 'Coordinador(a) Formacion Regional', tiempo: '1 AÑO', caja: '5', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' },
        { expediente: '38600645', foto: '38600645.jpg', nombre: 'CASTRO RAMIREZ ANGELICA MARIA', cargo: 'Business Partner Gestion Humana R3', tiempo: '2 AÑOS', caja: '8', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '52897880', foto: '52897880.jpg', nombre: 'GARZON MENDEZ LINA MARIA', cargo: 'Gerente Transformacion Y people Analytics',
      posicion: 'VERSÁTIL', persona: 'SÓLIDO', caja: '5', brecha: 1, clasif: 'MEDIA',
      sucesores: [
        // Sin datos de 9-Box ni tipo de talento en el Excel y sin registro en la ninebox.
        { expediente: '', foto: '', nombre: 'MARTINEZ LOPEZ JUAN CAMILO', cargo: 'Jefe People Analytics e Inteligencia Organizacional', tiempo: '2 AÑOS', caja: '', persona: '', brecha: null, clasif: '' },
        { expediente: '1014182084', foto: '1014182084.jpg', nombre: 'RODRIGUEZ BERNAL EDICSON', cargo: 'Gerente Mejora Continua Procesos Corporativos', tiempo: '3 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 1, clasif: 'MEDIA' },
        { expediente: '', foto: '', nombre: 'VELAZQUEZ RAMIREZ SEBASTIAN', cargo: 'Jefe de Agilismo y Nvas Formas de Trabajo', tiempo: '3 AÑOS', caja: '', persona: '', brecha: null, clasif: '' }
      ] }
  ]
});
