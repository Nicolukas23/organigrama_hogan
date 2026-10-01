/* ═══════════════════════════════════════════════════════════════════════
   comite_brechas.js — Brechas de los sucesores de los directores del
   Comité Ejecutivo, para la rama "Sucesores del director" de la pestaña
   "Organigrama" de tablero_liderazgo.

   Fuente: "Comité Ejecutivo (1).xlsx"
     · hoja CARGO            → tipo de talento que requiere el cargo de
                               cada director (posicion)
     · hoja CARGO VS SUCESOR → sucesores de cada director con su tipo de
                               talento, brecha, tiempo y caja 9-Box
   Llave: expediente del director. Solo alimenta las fichas de sucesores
   del director (versus y color de brecha); no cambia nada más del
   organigrama. Expediente y foto de cada sucesor cruzados con la ninebox
   de Supabase. Tiempo vacío en el Excel → se usa el de la tabla
   "sucesores" de Supabase.
   ═══════════════════════════════════════════════════════════════════════ */
window.COMITE_BRECHAS = {
  // HERNANDEZ HERNANDEZ SANDRA LILIANA · Director(a) Auditoria
  '52185300': { posicion: 'SÓLIDO', sucesores: [
    { expediente: '80150353', foto: '80150353.png', nombre: 'VARGAS BLANCO FREDDY ALEXANDER', cargo: 'Director(a) Gestion de Riesgo y Control Interno', tiempo: '', caja: '4', persona: 'EXPERTO', brecha: 1, clasif: 'MEDIA' },
    { expediente: '52492548', foto: '52492548.jpg', nombre: 'MORENO MORENO ADRIANA', cargo: 'Gerente Auditoria Sistemas', tiempo: '', caja: '8', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' }
  ] },
  // BORDA FERRO WALTER JAVIER · Director(a) Corporativo Financiero
  '79947402': { posicion: 'SÓLIDO', sucesores: [
    { expediente: '53120673', foto: '53120673.png', nombre: 'SALAS MAHECHA VIVIANA ANDREA', cargo: 'Director(a) Planeacion Financiera y Tesoreria', tiempo: '1 AÑO', caja: '5', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' },
    { expediente: '1128466768', foto: '1128466768.png', nombre: 'GUZMAN FLOREZ DANIEL', cargo: 'Director(a) Corporativo Planeacion Estrategica e Innovacion', tiempo: '', caja: '6', persona: 'VERSÁTIL', brecha: -1, clasif: 'MEDIA' }
  ] },
  // BUSTOS SUAREZ GERMAN LEONARDO · Director(a) Corporativo Gestion Humana y Administrativo
  '79516122': { posicion: 'SÓLIDO', sucesores: [
    { expediente: '79297860', foto: '79297860.png', nombre: 'MORALES CLAVIJO LUIS GERMAN', cargo: 'Gerente Gestion Humana Negocio Y Transversales', tiempo: '1 AÑO', caja: '9', persona: 'VERSÁTIL', brecha: -1, clasif: 'MEDIA' },
    { expediente: '52804512', foto: '52804512.png', nombre: 'LOPEZ TAVERA MARIA PAULA CATALINA', cargo: 'Gerente Talento Cultura y Comunicaciones', tiempo: '3 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' }
  ] },
  // PARDO FAJARDO SANTIAGO · Director(a) Corporativo Juridica y Sostenibilidad
  '80425417': { posicion: 'SÓLIDO', sucesores: [
    { expediente: '52709691', foto: '52709691.jpeg', nombre: 'CASTAÑEDA GUERRERO MARIA TERESA DEL PILAR', cargo: 'Gerente Regulacion Y Relacion Con Operadores', tiempo: '2 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' },
    { expediente: '1085273858', foto: '1085273858.jpeg', nombre: 'OJEDA LUNA JUAN MANUEL', cargo: 'Gerente Asuntos Contenciosos', tiempo: '2 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' }
  ] },
  // GUZMAN FLOREZ DANIEL · Director(a) Corporativo Planeacion Estrategica e Innovacion
  '1128466768': { posicion: 'SÓLIDO', sucesores: [
    { expediente: '4617732', foto: '4617732.jpeg', nombre: 'ESTUPIÑAN LOPEZ ANDRES FERNANDO', cargo: 'Director(a) Datos y Analitica de Negocios', tiempo: '2 AÑOS', caja: '8', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' },
    { expediente: '1032365189', foto: '1032365189.png', nombre: 'MONTAGUT MORALES PEDRO ANGEL', cargo: 'Director(a) Marketing Corporativo y Producto', tiempo: '3 AÑOS', caja: '6', persona: 'VERSÁTIL', brecha: -1, clasif: 'MEDIA' },
    { expediente: '80096815', foto: '80096815.jpg', nombre: 'TRUJILLO REHBEIN PABLO', cargo: 'Director(a) Supply Chain', tiempo: '', caja: '6', persona: 'VERSÁTIL', brecha: -1, clasif: 'MEDIA' }
  ] },
  // MALDONADO ROBLES IADER ALBERTO · Director(a) Corporativo Tecnologia
  '85467103': { posicion: 'SÓLIDO', sucesores: [
    { expediente: '78747249', foto: '78747249.jpg', nombre: 'OTERO DUMAR ALVARO MIGUEL', cargo: 'Director(a) Implementacion', tiempo: '3 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' },
    { expediente: '80099040', foto: '80099040.jpeg', nombre: 'AVILA PLATA OSCAR MAURICIO', cargo: 'Director(a) Aseguramiento Calidad de Servicio', tiempo: '3 AÑOS', caja: '6', persona: 'VERSÁTIL', brecha: -1, clasif: 'MEDIA' }
  ] },
  // VARGAS BLANCO FREDDY ALEXANDER · Director(a) Gestion de Riesgo y Control Interno
  '80150353': { posicion: 'SÓLIDO', sucesores: [
    { expediente: '79965710', foto: '79965710.png', nombre: 'GONZALEZ CHAVES DIEGO MIGUEL', cargo: 'Gerente Riesgo Operativo y Control Interno', tiempo: '2 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' },
    { expediente: '52185300', foto: '52185300.png', nombre: 'HERNANDEZ HERNANDEZ SANDRA LILIANA', cargo: 'Director(a) Auditoria', tiempo: 'LISTO YA', caja: '4', persona: 'EXPERTO', brecha: 1, clasif: 'MEDIA' }
  ] },
  // ESCOLAR SUNDHEIM MARIA LUISA · Director(a) Ejecutivo Unidad Mercado Corporativo
  '32781111': { posicion: 'VERSÁTIL', sucesores: [
    { expediente: '1032365189', foto: '1032365189.png', nombre: 'MONTAGUT MORALES PEDRO ANGEL', cargo: 'Director(a) Marketing Corporativo y Producto', tiempo: '3 AÑOS', caja: '6', persona: 'VERSÁTIL', brecha: 0, clasif: 'BAJA' }
  ] },
  // DOMINGUEZ DANIEL ARNALDO · Director(a) Ejecutivo Unidad Mercado Masivo
  '1138186': { posicion: 'VERSÁTIL', sucesores: [
    { expediente: '8126425', foto: '8126425.jpeg', nombre: 'PEREZ PALMA JULIO CESAR', cargo: 'Director(a) Region 2', tiempo: '3 AÑOS', caja: '9', persona: 'VERSÁTIL', brecha: 0, clasif: 'BAJA' },
    { expediente: '80096815', foto: '80096815.jpg', nombre: 'TRUJILLO REHBEIN PABLO', cargo: 'Director(a) Supply Chain', tiempo: '', caja: '6', persona: 'VERSÁTIL', brecha: 0, clasif: 'BAJA' }
  ] }
};
