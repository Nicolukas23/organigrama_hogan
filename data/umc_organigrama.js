/* ═══════════════════════════════════════════════════════════════════════
   umc_organigrama.js — Organigrama de la Dirección Unidad Mercado
   Corporativo (UMC) para la pestaña "Organigrama" de tablero_liderazgo.

   Fuente: "UMC - Recalibrado.xlsx"
     · hoja POSICIÓN VS OCUPANTE → reportes directos del director
     · hoja POSICIÓN VS SUCESOR  → sucesores de cada reporte directo
   Expediente y foto (data/FOTOS/<expediente>.<ext>) cruzados con la
   tabla ninebox de Supabase. El tiempo de alistamiento de cada sucesor
   se refresca en vivo desde la tabla "sucesores" de Supabase; el valor
   de aquí es respaldo si esa consulta falla.

   Escala de tipo de talento: EXPERTO=1, SÓLIDO=2, VERSÁTIL=3.
   brecha = N° posición − N° persona; clasificación del Excel:
   0 → BAJA, ±1 → MEDIA, ±2 → ALTA.
   ═══════════════════════════════════════════════════════════════════════ */
window.UMC_ORGANIGRAMA = {
  direccion: 'Unidad Mercado Corporativo',
  director: {
    expediente: '32781111', foto: '32781111.png',
    nombre: 'ESCOLAR SUNDHEIM MARIA LUISA',
    cargo: 'Director(a) Ejecutivo Unidad Mercado Corporativo'
  },
  directos: [
    { expediente: '80418091', foto: '80418091.jpg', nombre: 'PARRA BELTRAN LUIS FERNANDO', cargo: 'Director(a) Comercial Pymes',
      posicion: 'VERSÁTIL', persona: 'SÓLIDO', caja: '5', brecha: 1, clasif: 'MEDIA',
      sucesores: [
        { expediente: '79805697', foto: '79805697.png', nombre: 'CASTIBLANCO CLAVIJO JIMMY ANDERSON', cargo: 'Gerente Comercial Pymes R4', tiempo: '2 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 1, clasif: 'MEDIA' },
        { expediente: '37844585', foto: '37844585.png', nombre: 'ARIAS ROJAS JENNY MILENA', cargo: 'Gerente Comercial Pymes R2', tiempo: '3 AÑOS', caja: '6', persona: 'VERSÁTIL', brecha: 0, clasif: 'BAJA' },
        { expediente: '1036648287', foto: '1036648287.png', nombre: 'VELEZ BARON HAROLD STEVEN', cargo: 'Gerente Comercial Pymes R1', tiempo: '3 AÑOS', caja: '6', persona: 'VERSÁTIL', brecha: 0, clasif: 'BAJA' },
        { expediente: '1014197289', foto: '1014197289.jpg', nombre: 'PARRA PINZON OSCAR IVAN', cargo: 'Gerente Comercial Pymes R3', tiempo: '2 AÑOS', caja: '6', persona: 'VERSÁTIL', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '76320829', foto: '76320829.jpg', nombre: 'VERGARA VALENCIA ADRIAN ALFREDO', cargo: 'Director(a) Comercial Gobierno',
      posicion: 'EXPERTO', persona: 'EXPERTO', caja: '7', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '76333059', foto: '76333059.png', nombre: 'MUÑOZ IBARRA ANDHERSON FABIAN', cargo: 'Gerente Comercial Gobierno 1', tiempo: '2 AÑOS', caja: '8', persona: 'SÓLIDO', brecha: -1, clasif: 'MEDIA' },
        { expediente: '98393973', foto: '98393973.png', nombre: 'LOZANO ERASO OSCAR FERNANDO', cargo: 'Gerente Comercial Gobierno 2', tiempo: '3 AÑOS', caja: '8', persona: 'SÓLIDO', brecha: -1, clasif: 'MEDIA' }
      ] },
    { expediente: '79506436', foto: '79506436.jpg', nombre: 'ARIAS MORA JAIME ALBERTO', cargo: 'Director(a) Consultoria y Diseño',
      posicion: 'EXPERTO', persona: 'EXPERTO', caja: '7', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '80527831', foto: '80527831.png', nombre: 'GUEVARA TOCANCHON JOSE FRANCISCO', cargo: 'Gerente Soluciones IT', tiempo: '1 AÑO', caja: '9', persona: 'VERSÁTIL', brecha: -2, clasif: 'ALTA' },
        { expediente: '91474368', foto: '91474368.png', nombre: 'PINTO ALONSO CARLOS DAVID', cargo: 'Gerente Soluciones UC', tiempo: '2 AÑOS', caja: '9', persona: 'VERSÁTIL', brecha: -2, clasif: 'ALTA' }
      ] },
    { expediente: '79999930', foto: '79999930.jpg', nombre: 'JIMENEZ MORALES JOSE JULIAN', cargo: 'Gerente Soluciones Cloud',
      posicion: 'EXPERTO', persona: 'EXPERTO', caja: '7', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '52236050', foto: '52236050.png', nombre: 'PRADO MEJIA CAROL ALEXANDRA', cargo: 'Jefe Operaciones Multicloud', tiempo: '2 AÑOS', caja: '8', persona: 'SÓLIDO', brecha: -1, clasif: 'MEDIA' }
      ] },
    { expediente: '33066693', foto: '33066693.jpg', nombre: 'PEÑA VEGA PATRICIA', cargo: 'Gerente Inteligencia Comercial',
      posicion: 'SÓLIDO', persona: 'EXPERTO', caja: '4', brecha: 1, clasif: 'MEDIA',
      sucesores: [
        { expediente: '52879980', foto: '52879980.png', nombre: 'RODRIGUEZ FUENTES LUZ DARY', cargo: 'Jefe Mejoramiento Comercial', tiempo: '3 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' },
        { expediente: '80229765', foto: '80229765.jpg', nombre: 'AYALA MURCIA SAMUEL IVAN', cargo: 'Jefe Cuidado Al Cliente Corporativo', tiempo: '2 AÑOS', caja: '6', persona: 'VERSÁTIL', brecha: -1, clasif: 'MEDIA' }
      ] },
    { expediente: '66952849', foto: '66952849.jpg', nombre: 'ZAPATA ORTIZ BEATRIZ', cargo: 'Director(a) Grandes Cuentas',
      posicion: 'SÓLIDO', persona: 'SÓLIDO', caja: '2', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '79553598', foto: '79553598.png', nombre: 'RODRIGUEZ MORENO FERNANDO GUSTAVO', cargo: 'Gerente Comercial Grandes Empresas Bogota 2', tiempo: '3 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' },
        { expediente: '43869457', foto: '43869457.png', nombre: 'CASTRO MARIN VICTORIA EUGENIA', cargo: 'Gerente Comercial Grandes Empresas R2', tiempo: '2 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' },
        { expediente: '1036648287', foto: '1036648287.png', nombre: 'VELEZ BARON HAROLD STEVEN', cargo: 'Gerente Comercial Pymes R1', tiempo: '3 AÑOS', caja: '6', persona: 'VERSÁTIL', brecha: -1, clasif: 'MEDIA' }
      ] },
    { expediente: '52153221', foto: '52153221.jpeg', nombre: 'DE LA ROCHE BENITEZ SONIA ANGELICA', cargo: 'Director(a) Servicio al Cliente Corporativo',
      posicion: 'VERSÁTIL', persona: 'VERSÁTIL', caja: '6', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '52807479', foto: '52807479.png', nombre: 'JIMENEZ GONZALEZ JENNY', cargo: 'Gerente Cuidado Al Cliente Corporativo', tiempo: '1 AÑO', caja: '5', persona: 'SÓLIDO', brecha: 1, clasif: 'MEDIA' },
        { expediente: '1015425926', foto: '1015425926.png', nombre: 'VILLANUEVA ARGUELLO JORGE ANDRES', cargo: 'Gerente Cuidado al Cliente Negocios', tiempo: '2 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 1, clasif: 'MEDIA' }
      ] },
    { expediente: '1032365189', foto: '1032365189.png', nombre: 'MONTAGUT MORALES PEDRO ANGEL', cargo: 'Director(a) Marketing Corporativo y Producto',
      posicion: 'SÓLIDO', persona: 'VERSÁTIL', caja: '6', brecha: -1, clasif: 'MEDIA',
      sucesores: [] },
    { expediente: '80801701', foto: '80801701.jpg', nombre: 'CENDALES LARA MIGUEL ANTONIO', cargo: 'Gerente Ciberseguridad',
      posicion: 'EXPERTO', persona: 'SÓLIDO', caja: '5', brecha: -1, clasif: 'MEDIA',
      sucesores: [] },
    // Posición vacante en el Excel recalibrado (antes GIRALDO SANTAFE MARIA
    // DEL PILAR, que sigue apareciendo como jefe en la hoja de sucesores).
    { vacante: true, nombre: 'VACANTE', cargo: 'Director(a) Cuentas Estrategicas',
      posicion: 'EXPERTO',
      sucesores: [
        { expediente: '72182013', foto: '72182013.jpg', nombre: 'MORALES BERMEJO EDWIN RIGOBERTO', cargo: 'Gerente Cuentas Estrategicas Norte', tiempo: '2 AÑOS', caja: '8', persona: 'SÓLIDO', brecha: -1, clasif: 'MEDIA' }
      ] }
  ]
};
