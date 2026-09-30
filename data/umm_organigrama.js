/* ═══════════════════════════════════════════════════════════════════════
   umm_organigrama.js — Organigrama de la Unidad Mercado Masivo (UMM)
   para la pestaña "Organigrama" de tablero_liderazgo.

   Fuente: "UMM - Recalibrado.xlsx"
     · hoja POSICIÓN vs OCUPANTE → reportes directos del director
     · hoja POSICIÓN vs SUCESOR  → sucesores de cada reporte directo
   Las filas con jefe "DIRECTOR REGIONAL" se asignan al director de la
   región que indica el cargo (Director(a) Region N). Expediente, cargo y
   foto (data/FOTOS/<expediente>.<ext>) cruzados con la tabla ninebox de
   Supabase. Misma estructura que umc_organigrama.js.
   ═══════════════════════════════════════════════════════════════════════ */
(window.ORGANIGRAMAS = window.ORGANIGRAMAS || []).push({
  id: 'umm',
  titulo: 'Unidad Mercado Masivo',
  direccion: 'Unidad Mercado Masivo',
  director: {
    expediente: '1138186', foto: '1138186.png',
    nombre: 'DOMINGUEZ DANIEL ARNALDO',
    cargo: 'Director(a) Ejecutivo Unidad Mercado Masivo'
  },
  directos: [
    { expediente: '8533055', foto: '8533055.jpg', nombre: 'PORTO VELASQUEZ LUIS MIGUEL', cargo: 'Director(a) Region 1',
      posicion: 'VERSÁTIL', persona: 'SÓLIDO', caja: '5', brecha: 1, clasif: 'MEDIA',
      sucesores: [
        { expediente: '93235739', foto: '93235739.png', nombre: 'RUBIO GUZMAN JUAN RICARDO', cargo: 'Gerente Regional Prepago', tiempo: '2 AÑOS', caja: '6', persona: 'VERSÁTIL', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '8126425', foto: '8126425.jpeg', nombre: 'PEREZ PALMA JULIO CESAR', cargo: 'Director(a) Region 2',
      posicion: 'VERSÁTIL', persona: 'VERSÁTIL', caja: '9', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '88227648', foto: '88227648.png', nombre: 'GALVIS CLARO JOSE LUIS', cargo: 'Gerente Regional CAVS', tiempo: '1 AÑO', caja: '9', persona: 'VERSÁTIL', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '1032396133', foto: '1032396133.jpg', nombre: 'MARTINEZ PINILLA DIEGO FELIPE', cargo: 'Director(a) Region 3',
      posicion: 'VERSÁTIL', persona: 'SÓLIDO', caja: '5', brecha: 1, clasif: 'MEDIA',
      sucesores: [
        { expediente: '29284580', foto: '29284580.png', nombre: 'CORREA PELAEZ TATIANA', cargo: 'Gerente Regional Cavs', tiempo: '2 AÑOS', caja: '9', persona: 'VERSÁTIL', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '79861675', foto: '79861675.jpg', nombre: 'VASCO GARCIA JOSE LUIS', cargo: 'Director(a) Region 4',
      posicion: 'VERSÁTIL', persona: 'SÓLIDO', caja: '2', brecha: 1, clasif: 'MEDIA',
      sucesores: [
        { expediente: '79628903', foto: '79628903.png', nombre: 'URDANETA RINCON JOHN ALEJANDRO', cargo: 'Gerente Regional Prepago', tiempo: '3 AÑOS', caja: '6', persona: 'VERSÁTIL', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '13871736', foto: '13871736.jpg', nombre: 'JAIMES VEGA DIEGO FERNANDO', cargo: 'Director(a) Region 5',
      posicion: 'VERSÁTIL', persona: 'SÓLIDO', caja: '5', brecha: 1, clasif: 'MEDIA',
      sucesores: [
        { expediente: '91506857', foto: '91506857.png', nombre: 'MEJIA RODRIGUEZ SERGIO ALONSO', cargo: 'Gerente Regional Prepago', tiempo: '3 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 1, clasif: 'MEDIA' },
        { expediente: '88002967', foto: '88002967.png', nombre: 'DUARTE MENDOZA HERMES ALFONSO', cargo: 'Gerente Regional Agentes PDV', tiempo: '2 AÑOS', caja: '6', persona: 'VERSÁTIL', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '66881732', foto: '66881732.jpg', nombre: 'OCAMPO GIRON MARIA DEL PILAR', cargo: 'Director(a) Canales Atencion UMM',
      posicion: 'SÓLIDO', persona: 'SÓLIDO', caja: '8', brecha: 0, clasif: 'MEDIA',
      sucesores: [
        { expediente: '80055143', foto: '80055143.png', nombre: 'MARTINEZ NIÑO JESUS GIOVANY', cargo: 'Gerente Planeacion y Control Operativo SAC', tiempo: '2 AÑOS', caja: '9', persona: 'VERSÁTIL', brecha: -1, clasif: 'ALTA' },
        { expediente: '88227648', foto: '88227648.png', nombre: 'GALVIS CLARO JOSE LUIS', cargo: 'Gerente Regional CAVS', tiempo: '2 AÑOS', caja: '9', persona: 'VERSÁTIL', brecha: -1, clasif: 'ALTA' },
        { expediente: '29284580', foto: '29284580.png', nombre: 'CORREA PELAEZ TATIANA', cargo: 'Gerente Regional Cavs', tiempo: '1 AÑO', caja: '9', persona: 'VERSÁTIL', brecha: -1, clasif: 'ALTA' }
      ] },
    { expediente: '32842621', foto: '32842621.jpg', nombre: 'MANOTAS SALCEDO ELIANA MARIA', cargo: 'Director(a) Canales de Venta Agentes',
      posicion: 'VERSÁTIL', persona: 'VERSÁTIL', caja: '6', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '1016030752', foto: '1016030752.png', nombre: 'MURILLO BOBADILLA CARLOS ARTURO', cargo: 'Gerente Nacional PDV', tiempo: 'LISTO YA', caja: '9', persona: 'VERSÁTIL', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '80471459', foto: '80471459.jpg', nombre: 'MEDINA PEÑA IVAN RICARDO', cargo: 'Director(a) Ecommerce y Telemercadeo',
      posicion: 'SÓLIDO', persona: 'VERSÁTIL', caja: '6', brecha: -1, clasif: 'ALTA',
      sucesores: [
        { expediente: '80895159', foto: '80895159.png', nombre: 'NORIEGA NIEBLES ESTEBAN JOSE', cargo: 'Gerente Ecommerce y Canales Digitales', tiempo: '2 AÑOS', caja: '9', persona: 'VERSÁTIL', brecha: -1, clasif: 'ALTA' }
      ] },
    { expediente: '79556029', foto: '79556029.jpg', nombre: 'CARLESIMO REY ANDRES', cargo: 'Director(a) Producto Masivo',
      posicion: 'VERSÁTIL', persona: 'SÓLIDO', caja: '8', brecha: 1, clasif: 'MEDIA',
      sucesores: [
        { expediente: '34327674-C', foto: '34327674-C.jpg', nombre: 'ORDOÑEZ USSA LEIDY YURANY', cargo: 'Gerente Estrategia Fidelizacion y Rentabilizacion', tiempo: 'LISTO YA', caja: '9', persona: 'VERSÁTIL', brecha: 0, clasif: 'BAJA' },
        { expediente: '79904332', foto: '79904332.png', nombre: 'PICON RUIZ GERMAN', cargo: 'Gerente Producto Hogar', tiempo: '1 AÑO', caja: '6', persona: 'VERSÁTIL', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '52534703', foto: '52534703.jpg', nombre: 'MUÑOZ RONCANCIO LUZ NEILA', cargo: 'Director(a) Terminales y Equipos Hogar',
      posicion: 'SÓLIDO', persona: 'SÓLIDO', caja: '8', brecha: 0, clasif: 'BAJA',
      sucesores: [] },
    { expediente: '72285538', foto: '72285538.jpg', nombre: 'PEREZ MEDINA HUMBERTO ALEJANDRO', cargo: 'Gerente Growth',
      posicion: 'EXPERTO', persona: 'EXPERTO', caja: '7', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '34327674-C', foto: '34327674-C.jpg', nombre: 'ORDOÑEZ USSA LEIDY YURANY', cargo: 'Gerente Estrategia Fidelizacion y Rentabilizacion', tiempo: '1 AÑO', caja: '9', persona: 'VERSÁTIL', brecha: -2, clasif: 'ALTA' }
      ] },
    { expediente: '51976159', foto: '51976159.jpg', nombre: 'VARGAS ANGEL SANDRA PATRICIA', cargo: 'Gerente Inteligencia Comercial Personas',
      posicion: 'EXPERTO', persona: 'EXPERTO', caja: '4', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '1098687767', foto: '1098687767.png', nombre: 'CALA DUARTE LUZ ANDREA', cargo: 'Jefe Soporte Comercial y Rentabilizacion Masivo', tiempo: '2 AÑOS', caja: '8', persona: 'SÓLIDO', brecha: -1, clasif: 'MEDIA' },
        // Cargo vacío en el Excel; tomado de ninebox.
        { expediente: '80013914', foto: '80013914.jpg', nombre: 'MANRIQUE JUAN ANYELO', cargo: 'Jefe Inteligencia Terminales Y Tecnologia', tiempo: '1 AÑO', caja: '8', persona: 'SÓLIDO', brecha: -1, clasif: 'MEDIA' },
        { expediente: '79686499', foto: '79686499.png', nombre: 'SILVA LOPEZ WILLIAM ALEJANDRO', cargo: 'Jefe Operacion Comercial', tiempo: '2 AÑOS', caja: '4', persona: 'EXPERTO', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '79940951', foto: '79940951.jpg', nombre: 'ROCA ACEVEDO FEDERICO', cargo: 'Gerente Marketing Masivo',
      posicion: 'SÓLIDO', persona: 'SÓLIDO', caja: '5', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '63514458', foto: '63514458.png', nombre: 'PEÑA ORTIZ PAOLA JOHANNA', cargo: 'Gerente Marketing Postpago y Hogar', tiempo: 'LISTO YA', caja: '8', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' },
        { expediente: '80206381', foto: '80206381.png', nombre: 'ESCOBAR MENDIGAÑA JAVIER NICOLAS', cargo: 'Gerente Marketing Innovacion y Comunicaciones', tiempo: 'LISTO YA', caja: '6', persona: 'VERSÁTIL', brecha: -1, clasif: 'MEDIA' }
      ] },
    { expediente: '52526001', foto: '52526001.jpg', nombre: 'ALVAREZ ZULUAGA LUZ ASTRID', cargo: 'Gerente Nacional B2B2C y Proyectos Especiales',
      posicion: 'VERSÁTIL', persona: 'SÓLIDO', caja: '8', brecha: 1, clasif: 'MEDIA',
      sucesores: [] }
  ]
});
