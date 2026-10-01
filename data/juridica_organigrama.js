/* ═══════════════════════════════════════════════════════════════════════
   juridica_organigrama.js — Organigrama de la Dirección Corporativa
   Jurídica y Sostenibilidad para la pestaña "Organigrama" de
   tablero_liderazgo.

   Fuente: "JURÍDICA.xlsx"
     · hoja CARGO VS OCUPANTE → reportes directos del director
     · hoja CARGO VS SUCESOR  → sucesores de cada reporte directo
   Expediente, foto (data/FOTOS/<expediente>.<ext>) y director cruzados con
   la tabla ninebox de Supabase. Misma estructura que umc_organigrama.js.
   sinSucesor: texto del Excel cuando el cargo no tiene sucesor ("No
   requiere sucesor"); si no viene, la tarjeta dice "Sin sucesor
   identificado".
   ═══════════════════════════════════════════════════════════════════════ */
(window.ORGANIGRAMAS = window.ORGANIGRAMAS || []).push({
  id: 'juridica',
  titulo: 'Dirección Corporativa Jurídica y Sostenibilidad',
  direccion: 'Direccion Corporativa Juridica y Sostenibilidad',
  director: {
    expediente: '80425417', foto: '80425417.png',
    nombre: 'PARDO FAJARDO SANTIAGO',
    cargo: 'Director(a) Corporativo Juridica y Sostenibilidad'
  },
  directos: [
    { expediente: '1018417641', foto: '1018417641.jpg', nombre: 'NATERA MELO IVAN GIOVANNI', cargo: 'Gerente Regulacion Competencia',
      posicion: 'EXPERTO', persona: 'EXPERTO', caja: '4', brecha: 0, clasif: 'BAJA',
      sucesores: [] },
    { expediente: '80720654', foto: '80720654.jpg', nombre: 'ACOSTA BERNAL JOHN JAIRO', cargo: 'Gerente Cumplimiento',
      posicion: 'SÓLIDO', persona: 'SÓLIDO', caja: '5', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '1144033575', foto: '1144033575.png', nombre: 'PERDOMO CORDOBA FERNANDO ANDRES', cargo: 'Abogado(a) Cumplimiento', tiempo: '2 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '52709691', foto: '52709691.jpeg', nombre: 'CASTAÑEDA GUERRERO MARIA TERESA DEL PILAR', cargo: 'Gerente Regulacion Y Relacion Con Operadores',
      posicion: 'SÓLIDO', persona: 'SÓLIDO', caja: '5', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '36306108', foto: '36306108.png', nombre: 'DURAN MANCHOLA ANA LUCIA', cargo: 'Jefe Relaciones Con Operadores E Interconexion', tiempo: '1 AÑO', caja: '7', persona: 'EXPERTO', brecha: 1, clasif: 'MEDIA' }
      ] },
    { expediente: '52047965', foto: '52047965.jpg', nombre: 'CASTRO PINEDA MARIA CONSUELO', cargo: 'Gerente Sostenibilidad',
      posicion: 'VERSÁTIL', persona: 'VERSÁTIL', caja: '9', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '1024531733', foto: '1024531733.png', nombre: 'CAÑON RAMIREZ LUIS EDUARDO', cargo: 'Jefe Sostenibilidad y Relacionamiento', tiempo: '1 AÑO', caja: '8', persona: 'SÓLIDO', brecha: 1, clasif: 'MEDIA' }
      ] },
    { expediente: '1010189106', foto: '1010189106.jpg', nombre: 'JOYA APARICIO ALEJANDRO', cargo: 'Gerente Contratos Corporativos y Asuntos Societarios',
      posicion: 'SÓLIDO', persona: 'SÓLIDO', caja: '5', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '1110468886', foto: '1110468886.png', nombre: 'GALEANO GALEANO ADRIANA LUCIA', cargo: 'Abogado(a) Contratos', tiempo: '2 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' },
        // Sin datos de 9-Box ni tipo de talento en el Excel y sin registro en la ninebox.
        { expediente: '', foto: '', nombre: 'VEGA MEDELLIN LAURA LUCIA', cargo: 'Abogado(a) Contratos Comerciales', tiempo: '2 AÑOS', caja: '', persona: '', brecha: null, clasif: '' },
        // Tiempo de alistamiento vacío en el Excel: se usa el de Supabase.
        { expediente: '80111618', foto: '80111618.jpg', nombre: 'BAENA JARAMILLO ALEJANDRO', cargo: 'Gerente Contratos Transparencia y Etica Empresarial', tiempo: '', caja: '2', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '52818441', foto: '52818441.jpg', nombre: 'TORRES OSPINA INGRID JULIET', cargo: 'Gerente Contratos Comerciales y Administrativos',
      posicion: 'SÓLIDO', persona: 'SÓLIDO', caja: '5', brecha: 0, clasif: 'BAJA',
      sucesores: [
        { expediente: '1032438728', foto: '1032438728.png', nombre: 'GAMEZ ALVERNIA ALEJANDRO', cargo: 'Abogado(a) Contratos', tiempo: '3 AÑOS', caja: '5', persona: 'SÓLIDO', brecha: 0, clasif: 'BAJA' }
      ] },
    { expediente: '80111618', foto: '80111618.jpg', nombre: 'BAENA JARAMILLO ALEJANDRO', cargo: 'Gerente Contratos Transparencia y Etica Empresarial',
      posicion: 'EXPERTO', persona: 'SÓLIDO', caja: '2', brecha: -1, clasif: 'MEDIA',
      sucesores: [
        { expediente: '1085273858', foto: '1085273858.jpeg', nombre: 'OJEDA LUNA JUAN MANUEL', cargo: 'Gerente Asuntos Contenciosos', tiempo: '1 AÑO', caja: '5', persona: 'SÓLIDO', brecha: -1, clasif: 'MEDIA' }
      ] },
    { expediente: '79385806', foto: '79385806.jpg', nombre: 'CORTES LOPEZ JORGE ARTURO', cargo: 'Gerente De Gestion Control Facturacion Y Pago',
      posicion: 'EXPERTO', persona: 'EXPERTO', caja: '4', brecha: 0, clasif: 'BAJA',
      sinSucesor: 'No requiere sucesor',
      sucesores: [] },
    { expediente: '1085273858', foto: '1085273858.jpeg', nombre: 'OJEDA LUNA JUAN MANUEL', cargo: 'Gerente Asuntos Contenciosos',
      posicion: 'SÓLIDO', persona: 'SÓLIDO', caja: '5', brecha: 0, clasif: 'BAJA',
      sucesores: [] }
  ]
});
