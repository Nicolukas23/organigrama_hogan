/* ═══════════════════════════════════════════════════════════════════════
   otros_sucesores.js — "Otros posibles sucesores": personas mapeadas como
   sucesor por un jefe, pero cuyo jefe REAL (según la data vigente de
   ninebox) es distinto de quien las mapeó — por eso no aparecen en la
   tabla principal de equipo de ese jefe. Se usa en ninebox.html y en
   tablero_liderazgo.html.

   Generado cruzando las 129 relaciones Titular→Sucesor de la hoja
   "Consolidado de sucesores" de Calibraciones.xlsx (fuente completa;
   excluye las filas "NO CUENTA CON SUCESOR IDENTIFICADO", que no son
   sucesores reales) contra el jefe real de cada sucesor en la tabla
   `ninebox` de Supabase: si el jefe real coincide con quien lo mapeó, la
   relación ya sale sola en la tabla principal (no se repite aquí); si no
   coincide, es "otro sucesor" y sale aquí bajo el jefe que lo mapeó.

   VEGA MEDELLIN LAURA LUCIA (mapeada por JOYA APARICIO ALEJANDRO) no tiene
   expediente en personas/ninebox/Base General — no está en ninguna hoja del
   excel con cédula. Se incluye igual, con un expediente provisional
   "PENDIENTE-..." (ya no hay botón de ficha en esta tabla, así que no rompe
   nada), para que al menos aparezca por nombre. Falta su cédula real.

   ── Actualización 2026-09-11 (Calibraciones  (2).xlsx, 22 filas resaltadas
   en rojo en "Consolidado de sucesores", pendientes de confirmar) ──
   A solicitud, se revierten las dos exclusiones anteriores y se agregan
   estas parejas de vuelta, todas marcadas "Por Confirmar" en vez de "Sí"
   (ver data/sucesor_pendientes.js):
   - Los 4 sucesores mapeados por GARZON MENDEZ LINA MARIA (antes excluidos
     "a solicitud"): MARTINEZ LANCHEROS WILLIAM ANDRES, ARCHILA SAA KAREN
     DANIELA, MARTINEZ REYES DAVID LEONARDO, RODRIGUEZ BERNAL EDICSON.
   - ABADIA BOLAÑOS PAOLA ANDREA (mapeada por CASTELLANOS RODRIGUEZ MIGUEL
     ANGEL), antes quitada porque era el único vínculo que hacía aparecer a
     Miguel Ángel Castellanos como Jefe dentro de "Unidad Mercado Masivo" —
     a solicitud, se acepta que reaparezca ese efecto.
   MARTINEZ LANCHEROS, MARTINEZ REYES, RODRIGUEZ BERNAL y AMAYA BONILLA
   (nueva, mapeada por LOPEZ TAVERA MARIA PAULA CATALINA) y CHACON GONZALEZ
   LILIANA PATRICIA (nueva, mapeada por SALAZAR BARON HUGO ALEXANDER) no
   tienen entrada aquí: SÍ tienen expediente en `ninebox`, así que salen
   solos vía el mecanismo (2) de abajo en cuanto su pareja está en
   sucesor_pairs.js — no hace falta curarlos a mano.
   ARCHILA SAA KAREN DANIELA y HEREDIA GAONA HECTOR ENRIQUE (mapeado por
   CARDONA TORRES CLAUDIA ISABEL) siguen sin expediente en ninguna hoja —
   igual que VEGA MEDELLIN, se agregan con expediente provisional
   "PENDIENTE-...".
   GRANADOS JAUREGUI JESICA ALEXANDRA: su entrada vieja aquí decía que la
   mapeaba SANABRIA CARDOZO LILIANA PATRICIA — desactualizado. El archivo
   nuevo (y su jefe real en `ninebox`) coinciden en que es GONZALEZ CHAVES
   DIEGO MIGUEL, así que ya sale sola en la tabla principal de él (jefe
   real = jefe que la mapea); se quitó la entrada vieja de aquí.

   ORDOÑEZ USSA LEIDY YURANY (exp 34327674) se movió aquí, bajo PEREZ
   MEDINA HUMBERTO ALEJANDRO: Humberto no tiene equipo propio en la
   ninebox, solo la tiene mapeada como sucesora. Antes había un registro
   fantasma (mismo expediente, sin sufijo -C) que la metía en la matriz de
   Humberto; se eliminó de la data embebida (ninebox.html, tablero_liderazgo
   .html) y de la tabla `ninebox` de Supabase. Su registro real sigue bajo
   CARLESIMO REY ANDRES con el expediente "34327674-C".
   ═══════════════════════════════════════════════════════════════════════ */
window.OTROS_SUCESORES = [
  {exp:"80150353",nombre:"VARGAS BLANCO FREDDY ALEXANDER",cargo:"Director(a) Gestion de Riesgo y Control Interno",region:"Transversal",direccion:"Comité Directivo",direccion_area:"Comité Directivo",gerencia:"Direccion Gestion de Riesgo y Control Interno",ciudad:"Bogotá, D.C.",jefe:"HERNANDEZ HERNANDEZ SANDRA LILIANA",caja:4,sucesor:"Si",tiempo:""},
  {exp:"52105775",nombre:"SARMIENTO SANDOVAL ADRIANA CONSUELO",cargo:"Jefe Gestion Identidades y Accesos",region:"Transversal",direccion:"Direccion Gestion de Riesgo y Control Interno",direccion_area:"Direccion Gestion de Riesgo y Control Interno",gerencia:"Gerencia Seguridad Informacion",ciudad:"Bogotá, D.C.",jefe:"MORENO MORENO ADRIANA",caja:4,sucesor:"Si",tiempo:""},
  {exp:"53015362",nombre:"CASAS SILVA CAROLINA",cargo:"Gerente Riesgo Financiero",region:"Transversal",direccion:"Direccion Gestion de Riesgo y Control Interno",direccion_area:"Direccion Gestion de Riesgo y Control Interno",gerencia:"Gerencia Riesgo Financiero",ciudad:"Bogotá, D.C.",jefe:"MONSALVE HERNANDEZ DIANA CAROLINA",caja:5,sucesor:"Si",tiempo:""},
  {exp:"1128466768",nombre:"GUZMAN FLOREZ DANIEL",cargo:"Director(a) Corporativo Planeacion Estrategica e Innovacion",region:"Transversal",direccion:"Comité Directivo",direccion_area:"Comité Directivo",gerencia:"Direccion Corporativa Planeacion Estrategica e Innovacion",ciudad:"Bogotá, D.C.",jefe:"BORDA FERRO WALTER JAVIER",caja:6,sucesor:"Si",tiempo:""},
  {exp:"1032365189",nombre:"MONTAGUT MORALES PEDRO ANGEL",cargo:"Director(a) Marketing Corporativo y Producto",region:"Transversal",direccion:"Unidad Mercado Corporativo",direccion_area:"Unidad Mercado Corporativo",gerencia:"Direccion Marketing Corporativo y Producto",ciudad:"Bogotá, D.C.",jefe:"GUZMAN FLOREZ DANIEL",caja:6,sucesor:"Si",tiempo:"3 Años"},
  {exp:"80096815",nombre:"TRUJILLO REHBEIN PABLO",cargo:"Director(a) Supply Chain",region:"Transversal",direccion:"Direccion Corporativa Financiera",direccion_area:"Direccion Corporativa Financiera",gerencia:"Direccion Supply Chain",ciudad:"Bogotá, D.C.",jefe:"GUZMAN FLOREZ DANIEL",caja:6,sucesor:"Si",tiempo:""},
  {exp:"3216158",nombre:"SARMIENTO GONZALEZ LUIS ALEJANDRO",cargo:"Gerente Gestion del Portafolio",region:"Transversal",direccion:"Direccion Corporativa Planeacion Estrategica e Innovacion",direccion_area:"Direccion Corporativa Planeacion Estrategica e Innovacion",gerencia:"Gerencia Gestion Portafolio Estrategico",ciudad:"Bogotá, D.C.",jefe:"PUERTAS OROZCO CARLOS ANDRES",caja:5,sucesor:"Si",tiempo:""},
  {exp:"1057515055",nombre:"MOLINA GONZALEZ MARIA CRISTINA",cargo:"Coach Agile",region:"Transversal",direccion:"Direccion Corporativa Gestion Humana y Administrativo",direccion_area:"Direccion Corporativa Gestion Humana y Administrativo",gerencia:"Direccion Corporativa Gestion Humana y Administrativo",ciudad:"Bogotá, D.C.",jefe:"SARMIENTO GONZALEZ LUIS ALEJANDRO",caja:0,sucesor:"Si",tiempo:"1 Año"},
  {exp:"52185300",nombre:"HERNANDEZ HERNANDEZ SANDRA LILIANA",cargo:"Director(a) Auditoria",region:"Transversal",direccion:"Comité Directivo",direccion_area:"Comité Directivo",gerencia:"Direccion Auditoria",ciudad:"Bogotá, D.C.",jefe:"VARGAS BLANCO FREDDY ALEXANDER",caja:4,sucesor:"Si",tiempo:"Listo ya"},
  {exp:"1129543149",nombre:"BOHORQUEZ HERNANDEZ JOHNATHAN ERNESTO",cargo:"Gerente Riesgo Tecnologico",region:"Transversal",direccion:"Direccion Gestion de Riesgo y Control Interno",direccion_area:"Direccion Gestion de Riesgo y Control Interno",gerencia:"Gerencia Riesgo Tecnologico",ciudad:"Bogotá, D.C.",jefe:"CASTRO CARDOZO CARLOS ANDRES",caja:4,sucesor:"Si",tiempo:""},
  {exp:"80004393",nombre:"RAMIREZ RINCON CARLOS JULIO",cargo:"Gerente Prevencion Fraude",region:"Transversal",direccion:"Direccion Gestion de Riesgo y Control Interno",direccion_area:"Direccion Gestion de Riesgo y Control Interno",gerencia:"Gerencia Prevencion Fraude",ciudad:"Bogotá, D.C.",jefe:"IBARRA CERON JANETH CONSTANZA",caja:7,sucesor:"Si",tiempo:""},
  {exp:"1024519211",nombre:"DUARTE MENDEZ MONICA ANDREA",cargo:"Analista Sarlaf",region:"Transversal",direccion:"Direccion Gestion de Riesgo y Control Interno",direccion_area:"Direccion Gestion de Riesgo y Control Interno",gerencia:"Direccion Gestion de Riesgo y Control Interno",ciudad:"Bogotá, D.C.",jefe:"CASTILLO MARTINEZ MARTHA LILIANA",caja:0,sucesor:"Si",tiempo:"Listo ya"},
  {exp:"80111618",nombre:"BAENA JARAMILLO ALEJANDRO",cargo:"Gerente Contratos Transparencia y Etica Empresarial",region:"Transversal",direccion:"Direccion Corporativa Juridica y Sostenibilidad",direccion_area:"Direccion Corporativa Juridica y Sostenibilidad",gerencia:"Gerencia Contratos Transparencia y Etica Empresarial",ciudad:"Bogotá, D.C.",jefe:"CASTILLO MARTINEZ MARTHA LILIANA",caja:2,sucesor:"Si",tiempo:""},
  {exp:"37620782",nombre:"GRASS ARDILA GERALDINE",cargo:"Ingeniero(a) Aseguramiento Calidad y Mejora Continua E&N",region:"Transversal",direccion:"Direccion Gestion de Riesgo y Control Interno",direccion_area:"Direccion Gestion de Riesgo y Control Interno",gerencia:"Direccion Gestion de Riesgo y Control Interno",ciudad:"Bogotá, D.C.",jefe:"SANABRIA CARDOZO LILIANA PATRICIA",caja:0,sucesor:"Si",tiempo:"2 Años"},
  {exp:"80820898",nombre:"CASTRO CARDOZO CARLOS ANDRES",cargo:"Gerente Seguridad Informacion",region:"Transversal",direccion:"Direccion Gestion de Riesgo y Control Interno",direccion_area:"Direccion Gestion de Riesgo y Control Interno",gerencia:"Gerencia Seguridad Informacion",ciudad:"Bogotá, D.C.",jefe:"SANABRIA CARDOZO LILIANA PATRICIA",caja:6,sucesor:"Si",tiempo:""},
  {exp:"80820898",nombre:"CASTRO CARDOZO CARLOS ANDRES",cargo:"Gerente Seguridad Informacion",region:"Transversal",direccion:"Direccion Gestion de Riesgo y Control Interno",direccion_area:"Direccion Gestion de Riesgo y Control Interno",gerencia:"Gerencia Seguridad Informacion",ciudad:"Bogotá, D.C.",jefe:"BOHORQUEZ HERNANDEZ JOHNATHAN ERNESTO",caja:6,sucesor:"Si",tiempo:""},
  {exp:"53015362",nombre:"CASAS SILVA CAROLINA",cargo:"Gerente Riesgo Financiero",region:"Transversal",direccion:"Direccion Gestion de Riesgo y Control Interno",direccion_area:"Direccion Gestion de Riesgo y Control Interno",gerencia:"Gerencia Riesgo Financiero",ciudad:"Bogotá, D.C.",jefe:"GONZALEZ CHAVES DIEGO MIGUEL",caja:5,sucesor:"Si",tiempo:""},
  {exp:"79965710",nombre:"GONZALEZ CHAVES DIEGO MIGUEL",cargo:"Gerente Riesgo Operativo y Control Interno",region:"Transversal",direccion:"Direccion Gestion de Riesgo y Control Interno",direccion_area:"Direccion Gestion de Riesgo y Control Interno",gerencia:"Gerencia Riesgo Operativo y Control Interno",ciudad:"Bogotá, D.C.",jefe:"CASAS SILVA CAROLINA",caja:5,sucesor:"Si",tiempo:"2 Años"},
  {exp:"1014251701",nombre:"ROSAS LOPEZ DIEGO FERNANDO",cargo:"Jefe Seguridad de la Informacion Proactiva",region:"Transversal",direccion:"Direccion Gestion de Riesgo y Control Interno",direccion_area:"Direccion Gestion de Riesgo y Control Interno",gerencia:"Gerencia Seguridad Informacion",ciudad:"Bogotá, D.C.",jefe:"BUSTOS MANCERA CAMILO ANDRES",caja:5,sucesor:"Si",tiempo:"2 Años"},
  {exp:"52733930",nombre:"MORENO AYURE YULI ZORAIDA",cargo:"Gestor(a) Interno y Aseguramiento Estrategico",region:"Transversal",direccion:"Direccion Gestion de Riesgo y Control Interno",direccion_area:"Direccion Gestion de Riesgo y Control Interno",gerencia:"Direccion Gestion de Riesgo y Control Interno",ciudad:"Bogotá, D.C.",jefe:"BUSTOS MANCERA CAMILO ANDRES",caja:0,sucesor:"Si",tiempo:"2 Años"},
  {exp:"7317314",nombre:"LANCHEROS CURREA CESAR FABIAN",cargo:"Gerente Control Operativo Devsecops",region:"Transversal",direccion:"Direccion Corporativa Tecnologia",direccion_area:"Direccion Corporativa Tecnologia",gerencia:"Gerencia Control Operativo Devsecops",ciudad:"Bogotá, D.C.",jefe:"BUSTOS MANCERA CAMILO ANDRES",caja:5,sucesor:"Si",tiempo:"3 Años"},
  {exp:"80820898",nombre:"CASTRO CARDOZO CARLOS ANDRES",cargo:"Gerente Seguridad Informacion",region:"Transversal",direccion:"Direccion Gestion de Riesgo y Control Interno",direccion_area:"Direccion Gestion de Riesgo y Control Interno",gerencia:"Gerencia Seguridad Informacion",ciudad:"Bogotá, D.C.",jefe:"BUSTOS MANCERA CAMILO ANDRES",caja:6,sucesor:"Si",tiempo:""},
  {exp:"79650698",nombre:"AGUIA GUTIERREZ CARLOS ANDRES",cargo:"Gerente Sistemas SAP Administrativos y Financieros",region:"Transversal",direccion:"Direccion Corporativa Tecnologia",direccion_area:"Direccion Corporativa Tecnologia",gerencia:"Direccion Corporativa Tecnologia",ciudad:"Bogotá, D.C.",jefe:"BUSTOS MANCERA CAMILO ANDRES",caja:0,sucesor:"Si",tiempo:""},
  {exp:"1018414804",nombre:"COTRINA RODRIGUEZ DAVID ENRIQUE",cargo:"Abogado(a) Asuntos Contenciosos",region:"Transversal",direccion:"Direccion Corporativa Juridica y Sostenibilidad",direccion_area:"Direccion Corporativa Juridica y Sostenibilidad",gerencia:"Gerencia Asuntos Contenciosos",ciudad:"Bogotá, D.C.",jefe:"NATERA MELO IVAN GIOVANNI",caja:2,sucesor:"Si",tiempo:"2 Años"},
  {exp:"80111618",nombre:"BAENA JARAMILLO ALEJANDRO",cargo:"Gerente Contratos Transparencia y Etica Empresarial",region:"Transversal",direccion:"Direccion Corporativa Juridica y Sostenibilidad",direccion_area:"Direccion Corporativa Juridica y Sostenibilidad",gerencia:"Gerencia Contratos Transparencia y Etica Empresarial",ciudad:"Bogotá, D.C.",jefe:"JOYA APARICIO ALEJANDRO",caja:2,sucesor:"Si",tiempo:""},
  {exp:"PENDIENTE-VEGA-MEDELLIN",nombre:"VEGA MEDELLIN LAURA LUCIA",cargo:"Abogado(a) Contratos Comerciales",region:"Transversal",direccion:"Direccion Corporativa Juridica y Sostenibilidad",direccion_area:"Direccion Corporativa Juridica y Sostenibilidad",gerencia:"Direccion Corporativa Juridica y Sostenibilidad",ciudad:"Bogotá, D.C.",jefe:"JOYA APARICIO ALEJANDRO",caja:0,sucesor:"Si",tiempo:"2 Años"},
  {exp:"1085273858",nombre:"OJEDA LUNA JUAN MANUEL",cargo:"Gerente Asuntos Contenciosos",region:"Transversal",direccion:"Direccion Corporativa Juridica y Sostenibilidad",direccion_area:"Direccion Corporativa Juridica y Sostenibilidad",gerencia:"Gerencia Asuntos Contenciosos",ciudad:"Bogotá, D.C.",jefe:"BAENA JARAMILLO ALEJANDRO",caja:5,sucesor:"Si",tiempo:"1 Año"},
  {exp:"1018503004",nombre:"VALDES OBANDO JULIETH DANIELA",cargo:"Analista Gestion Control Pago MINTIC",region:"Transversal",direccion:"Direccion Corporativa Juridica y Sostenibilidad",direccion_area:"Direccion Corporativa Juridica y Sostenibilidad",gerencia:"Direccion Corporativa Juridica y Sostenibilidad",ciudad:"Bogotá, D.C.",jefe:"CORTES LOPEZ JORGE ARTURO",caja:0,sucesor:"Si",tiempo:""},
  {exp:"80229765",nombre:"AYALA MURCIA SAMUEL IVAN",cargo:"Jefe Cuidado Al Cliente Corporativo",region:"Transversal",direccion:"Unidad Mercado Corporativo",direccion_area:"Unidad Mercado Corporativo",gerencia:"Gerencia Cuidado Al Cliente Negocios",ciudad:"Bogotá, D.C.",jefe:"PEÑA VEGA PATRICIA",caja:6,sucesor:"Si",tiempo:""},
  {exp:"1036648287",nombre:"VELEZ BARON HAROLD STEVEN",cargo:"Gerente Comercial Pymes R1",region:"Region 1",direccion:"Unidad Mercado Corporativo",direccion_area:"Unidad Mercado Corporativo",gerencia:"Gerencia Comercial Pymes R1",ciudad:"Barranquilla",jefe:"ZAPATA ORTIZ BEATRIZ",caja:6,sucesor:"Si",tiempo:"3 Años"},
  {exp:"52196323",nombre:"LOPEZ PABON DINA MARGARITA",cargo:"Gerente de Proyectos Empresariales",region:"Transversal",direccion:"Direccion Corporativa Tecnologia",direccion_area:"Direccion Corporativa Tecnologia",gerencia:"Gerencia de Proyectos Empresariales",ciudad:"Bogotá, D.C.",jefe:"DE LA ROCHE BENITEZ SONIA ANGELICA",caja:5,sucesor:"Si",tiempo:""},
  {exp:"79897183",nombre:"SANCHEZ DIEZ MAURICIO ALBERTO",cargo:"Gerente Ingenieria y Arquitectura Servicio Movil",region:"Transversal",direccion:"Direccion Corporativa Tecnologia",direccion_area:"Direccion Corporativa Tecnologia",gerencia:"Gerencia Ingenieria y Arquitectura Servicio Movil",ciudad:"Bogotá, D.C.",jefe:"BAYONA PORRAS JUAN MAURICIO",caja:9,sucesor:"Si",tiempo:"Listo ya"},
  {exp:"79455718",nombre:"BAYONA PORRAS JUAN MAURICIO",cargo:"Gerente Planeacion Tecnologia",region:"Transversal",direccion:"Direccion Corporativa Tecnologia",direccion_area:"Direccion Corporativa Tecnologia",gerencia:"Gerencia Planeacion Tecnologia",ciudad:"Bogotá, D.C.",jefe:"SALAZAR BARON HUGO ALEXANDER",caja:8,sucesor:"Si",tiempo:""},
  {exp:"79996518",nombre:"BEJARANO ACOSTA JOSE MARIO",cargo:"Jefe Operativo Centro Comercial",region:"Transversal",direccion:"Direccion Corporativa Gestion Humana y Administrativo",direccion_area:"Direccion Corporativa Gestion Humana y Administrativo",gerencia:"Gerencia Plaza Claro",ciudad:"Bogotá, D.C.",jefe:"CARDONA TORRES CLAUDIA ISABEL",caja:8,sucesor:"Si",tiempo:"2 Años"},
  {exp:"30335904",nombre:"MENDEZ CANO ELIANA MARCELA",cargo:"Business Partner Gestion Humana R2",region:"Transversal",direccion:"Direccion Corporativa Gestion Humana y Administrativo",direccion_area:"Direccion Corporativa Gestion Humana y Administrativo",gerencia:"Gerencia Gestion Humana Regional R2",ciudad:"Medellín",jefe:"MORALES MOLANO SANDRA PATRICIA",caja:6,sucesor:"Si",tiempo:""},
  {exp:"52392875",nombre:"RODRIGUEZ ALFARO ANGIE MARCELA",cargo:"Jefe Atraccion y Planeacion de Talento",region:"Transversal",direccion:"Direccion Corporativa Gestion Humana y Administrativo",direccion_area:"Direccion Corporativa Gestion Humana y Administrativo",gerencia:"Gerencia Gestion Humana Negocio y Transversales",ciudad:"Bogotá, D.C.",jefe:"LOPEZ TAVERA MARIA PAULA CATALINA",caja:7,sucesor:"Si",tiempo:""},
  {exp:"38600645",nombre:"CASTRO RAMIREZ ANGELICA MARIA",cargo:"Business Partner Gestion Humana R3",region:"Transversal",direccion:"Direccion Corporativa Gestion Humana y Administrativo",direccion_area:"Direccion Corporativa Gestion Humana y Administrativo",gerencia:"Gerencia Gestion Humana Regional R3",ciudad:"Cali",jefe:"LOPEZ TAVERA MARIA PAULA CATALINA",caja:8,sucesor:"Si",tiempo:""},
  {exp:"52804512",nombre:"LOPEZ TAVERA MARIA PAULA CATALINA",cargo:"Gerente Talento Cultura y Comunicaciones",region:"Transversal",direccion:"Direccion Corporativa Gestion Humana y Administrativo",direccion_area:"Direccion Corporativa Gestion Humana y Administrativo",gerencia:"Gerencia Talento Cultura y Comunicaciones",ciudad:"Bogotá, D.C.",jefe:"MORALES CLAVIJO LUIS GERMAN",caja:5,sucesor:"Si",tiempo:"3 Años"},
  {exp:"52144444",nombre:"MORALES MOLANO SANDRA PATRICIA",cargo:"Gerente Relaciones Laborales & SST",region:"Transversal",direccion:"Direccion Corporativa Gestion Humana y Administrativo",direccion_area:"Direccion Corporativa Gestion Humana y Administrativo",gerencia:"Gerencia Relaciones Laborales & SST",ciudad:"Bogotá, D.C.",jefe:"MORALES CLAVIJO LUIS GERMAN",caja:5,sucesor:"Si",tiempo:""},
  {exp:"38600645",nombre:"CASTRO RAMIREZ ANGELICA MARIA",cargo:"Business Partner Gestion Humana R3",region:"Transversal",direccion:"Direccion Corporativa Gestion Humana y Administrativo",direccion_area:"Direccion Corporativa Gestion Humana y Administrativo",gerencia:"Gerencia Gestion Humana Regional R3",ciudad:"Cali",jefe:"CASTELLANOS RODRIGUEZ MIGUEL ANGEL",caja:8,sucesor:"Si",tiempo:""},
  {exp:"34327674",nombre:"ORDOÑEZ USSA LEIDY YURANY",cargo:"Gerente Estrategia Fidelizacion y Rentabilizacion",region:"Transversal",direccion:"Unidad Mercado Masivo",direccion_area:"Direccion Producto Masivo",gerencia:"Gerencia Estrategia Fidelizacion",ciudad:"Bogotá, D.C.",jefe:"PEREZ MEDINA HUMBERTO ALEJANDRO",caja:0,sucesor:"Si",tiempo:"1 Año"},

  // ─── Sucesores UMM 1.xlsx (2026-09-09) ───
  // Identificados por un líder de Unidad Mercado Masivo cuyo jefe real en
  // `ninebox` es otra persona. No se tocaron las filas "DIRECTOR REGIONAL".
  //  - GALVIS CLARO (jefe real PEREZ PALMA JULIO CESAR) y CORREA PELAEZ
  //    (jefe real MARTINEZ PINILLA DIEGO FELIPE): identificados por OCAMPO GIRON.
  //  - MANRIQUE JUAN ANYELO (jefe real MUÑOZ RONCANCIO LUZ NEILA):
  //    identificado por VARGAS ANGEL SANDRA PATRICIA.
  {exp:"88227648",nombre:"GALVIS CLARO JOSE LUIS",cargo:"Gerente Regional CAVS",region:"Region 2",direccion:"Unidad Mercado Masivo",direccion_area:"Unidad Mercado Masivo Regiones",gerencia:"Direccion Region 2",ciudad:"Medellín",jefe:"OCAMPO GIRON MARIA DEL PILAR",caja:9,sucesor:"Si",tiempo:"2 Años"},
  {exp:"29284580",nombre:"CORREA PELAEZ TATIANA",cargo:"Gerente Regional Cavs",region:"Region 3",direccion:"Unidad Mercado Masivo",direccion_area:"Unidad Mercado Masivo Regiones",gerencia:"Direccion Region 3",ciudad:"Cali",jefe:"OCAMPO GIRON MARIA DEL PILAR",caja:9,sucesor:"Si",tiempo:"1 Año"},
  {exp:"80013914",nombre:"MANRIQUE JUAN ANYELO",cargo:"Jefe Inteligencia Terminales Y Tecnologia",region:"Transversal",direccion:"Unidad Mercado Masivo",direccion_area:"Direccion Negocio Terminales y Equipos Hogar",gerencia:"Direccion Negocio Terminales y Equipos Hogar",ciudad:"Bogotá, D.C.",jefe:"VARGAS ANGEL SANDRA PATRICIA",caja:8,sucesor:"Si",tiempo:"1 Año"},

  // ─── Calibraciones  (2).xlsx (2026-09-11), 22 filas resaltadas en rojo ───
  // Todas marcadas "Por Confirmar" en vez de "Sí" (data/sucesor_pendientes.js).
  // ABADIA BOLAÑOS: dato real de la tabla `personas` (no está en `ninebox`),
  // su jefe real es DIEGO FELIPE MARTINEZ PINILLA (Unidad Mercado Masivo,
  // Region 3) — CASTELLANOS RODRIGUEZ MIGUEL ANGEL la mapeó como sucesora.
  {exp:"29683064",nombre:"ABADIA BOLAÑOS PAOLA ANDREA",cargo:"Coordinador(a) Formacion Regional",region:"R3",direccion:"Unidad Mercado Masivo",direccion_area:"Unidad Mercado Masivo Regiones",gerencia:"Direccion Region 3",ciudad:"Cali",jefe:"CASTELLANOS RODRIGUEZ MIGUEL ANGEL",caja:0,sucesor:"Si",tiempo:""},
  // HEREDIA GAONA y ARCHILA SAA: sin expediente en personas/ninebox/Base
  // General (igual que VEGA MEDELLIN, ver nota arriba) — expediente provisional.
  {exp:"PENDIENTE-HEREDIA-GAONA",nombre:"HEREDIA GAONA HECTOR ENRIQUE",cargo:"Especialista Procurement Value Chain TEC",region:"Transversal",direccion:"Direccion Corporativa Financiera",direccion_area:"Direccion Corporativa Financiera",gerencia:"Direccion Corporativa Financiera",ciudad:"Bogotá, D.C.",jefe:"CARDONA TORRES CLAUDIA ISABEL",caja:0,sucesor:"Si",tiempo:""},
  {exp:"PENDIENTE-ARCHILA-SAA",nombre:"ARCHILA SAA KAREN DANIELA",cargo:"Coach Agile Hitss",region:"Transversal",direccion:"Direccion Corporativa Gestion Humana y Administrativo",direccion_area:"Direccion Corporativa Gestion Humana y Administrativo",gerencia:"Direccion Corporativa Gestion Humana y Administrativo",ciudad:"Bogotá, D.C.",jefe:"GARZON MENDEZ LINA MARIA",caja:0,sucesor:"Si",tiempo:""}
];
