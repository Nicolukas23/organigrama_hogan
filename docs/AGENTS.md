# Proyecto: Tableros de Talento / Hogan / Nine Box — Claro Colombia

Repositorio oficial: `https://github.com/Nicolukas23/organigrama_hogan` (main branch).
Despliegue: GitHub Pages (`https://nicolukas23.github.io/organigrama_hogan/<archivo>.html`) y Netlify.

## Regla de oro para todas las tareas

Cuando el usuario pida actualizar o revisar UN tablero, trabajar SOLO sobre ese archivo.
NO explorar ni leer los demás archivos del proyecto salvo que sea estrictamente necesario
o que el usuario lo pida. Usar herramientas dirigidas (Read/Grep sobre el archivo exacto),
nunca búsquedas globales del directorio.

## Tableros y su ubicación de datos

| Tablero | Archivo | Dónde vive la data | Login |
|---|---|---|---|
| Nine Box | `tableros/ninebox.html` | `<script id="dataStore">` embebido (~línea 1124 `const RAW`) + `OTROS_SUCESORES` + `SUCESION` | `AUTHORIZED_EMAILS` (~línea 2544) |
| Ficha de Talento | `tableros/ficha_talento.html` | Archivo externo `data/ficha_data.js` (770KB: `window.DATA`, `window.SUCESORES`, `window.SUCESION`) | Sin login |
| Hogan | `tableros/hogan.html` | Data embebida en el HTML (perfiles de personas por expediente) | `doLogin()` (~línea 398) |
| Organigrama Claro | `tableros/organigrama_hogan_claro.html` | Data embebida | `doLogin()` (~línea 397) |
| Índice | `tableros/index.html` | Data embebida | `doLogin()` (~línea 398) |
| Dimensionamiento | `tableros/dimensionamiento.html` | Data embebida | `VALID_EMAILS` (~línea 654) |
| Practicantes | `tableros/practicantes.html` | Data embebida (array en el HTML) | `AUTHORIZED_EMAILS` (~línea 247) |
| Tablero UMM | `tableros/tablero_umm.html` | `window.DATA` embebido | — |
| Informes | `tableros/informes.html` | Lista: Supabase `ninebox` (vivo). Informes: `data/ficha_data.js` (`window.DATA`: informacion/desempeno/talentos/objetivos/tres60/clima/hogan, keyed por expediente) | `AUTHORIZED_EMAILS` (~línea 328) |

## Usuarios autorizados (login)

Password de todos los logins: `1234`.

Emails autorizados (según archivo):
- `laura.amadop@claro.com.co`
- `nicolas.santos@claro.com.co`
- `edespitia@overlap.net.co`
- `angie.rodriguez@claro.com.co` (ninebox y practicantes)
- `luis.moralesc@claro.com.co` (solo ninebox)
- `valentina.campos@claro.com.co`

**IMPORTANTE:** los emails autorizados NO están centralizados. Están duplicados en
6 archivos distintos (ninebox, practicantes, dimensionamiento, hogan, index, organigrama).
Si se agrega/quita un usuario, actualizar TODOS los que lo requieran.

## Cómo se actualiza cada tablero

### ninebox.html (data embebida)
- La data principal está en `<script id="dataStore">` como JSON. 377 participantes
  (se eliminan personas con caja 0 y que no son jefe de nadie; DE GUSMAO no cuenta).
- OTROS_SUCESORES en el HTML. Filtro "Comité Directivo" muestra 69 reportes
  (personas cuyo jefe es miembro CD), no los 9 miembros CD.
- Scripts de origen: `scripts/rebuild_ficha.js` (lee `PARTICIPANTES NINE BOX (22).xlsx` y la
  `Planta_de_Personal_Mayo_2026.xlsx`).

### ficha_talento.html (data externa)
- La data está en `data/ficha_data.js` (770KB), NO embebida en el HTML.
- Para regenerarla: ejecutar `node scripts/rebuild_ficha.js` (lee `Info Ficha Talento 1.xlsx`,
  `Info Ficha Talento 2.xlsx`, `Planta_de_Personal_Mayo_2026.xlsx`).
- El HTML la carga con `<script src="../data/ficha_data.js?v=...">` (linea 295).
- Las fotos se cargan desde la carpeta `data/FOTOS/` usando el expediente (`p.exp`).
- IMPORTANTE: `data/ficha_data.js` es enorme (770KB). NUNCA leerlo completo con Read;
  usar Grep con patrones específicos o el script para regenerarlo.

### hogan.html, organigrama_hogan_claro.html, index.html
- Perfiles embebidos en el HTML (objeto por expediente con competencias, HPI, HDS, MVPI).
- Para regenerar: `scripts/rebuild_hogan_final.js`.
- Fuente: `fichas_hogan_actualizado (4) (1).xlsx`, `Competencias Hogan.xlsx`,
  `Resultados Hogan.xlsx`, `Hogan comite directivo.xlsx`.

### practicantes.html
- Array embebido en el HTML con todos los practicantes (fallback).
- Fuente: `HC Practicantes y Aprendices (1).xlsx`.

### dimensionamiento.html
- Data embebida en el HTML.

## Supabase (data viva)

- Proyecto: `organigrama-hogan` (ref `yxxpjttdmwruyeqiuxzu`). Credenciales en `.env`
  (gitignored). RLS: lectura pública con anon key.
- Tablas: `personas`, `desempeno`, `talentos`, `objetivos`, `evaluacion_360`, `clima`,
  `sucesores`, `ninebox`, `practicantes`, `tableros_json` (hogan/index/organigrama).
- Todos los tableros HTML cargan la data viva desde Supabase con un "cargador" async
  que hace fetch con la anon key, reconstruye la variable global (RAW/DATA) y re-render.
  Si Supabase falla, usan la data embebida como fallback.
- Los cargadores están identificados con el comentario `// ── CARGADOR SUPABASE ──`.
  IMPORTANTE: cuando edites un tablero, respetar que `let RAW`/`let DATA` y mantener
  el cargador (no convertirlo a `const` ni borrarlo).
- La anon key está inline en cada HTML (clave pública, solo lectura).

## Scripts de mantenimiento

- `scripts/rebuild_ficha.js` — regenera `data/ficha_data.js` desde los Excels de Info Ficha Talento + Planta.
- `scripts/rebuild_hogan_final.js` — regenera data de Hogan desde Excels.
- `scripts/update_desempeno.js` — actualiza desempeño en ficha.
- `analisis/analizador_hv.py` / `analisis/ver_modelos.py` — análisis de hojas de vida / modelos.
- `scripts/sync_supabase.js` — lee los Excels y hace upsert a Supabase (`--tabla=` selectivo).
  Los tableros que dependen de Supabase reflejan los cambios automáticamente.
- `scripts/sync_tableros.js` — sube a Supabase la data embebida en ninebox/practicantes/hogan/
  index/organigrama (`--tablero=` selectivo). Necesario tras regenerar esos HTML.

## Git

- Commit solo cuando el usuario lo pida explícitamente.
- Push a `origin/main`. El remote por defecto no lleva token; si GitHub pide auth,
  el usuario proveerá el token (usuario: `Nicolukas23`).
- Después de cualquier push exitoso, limpiar el remote para que no quede el token
  en la URL (`git remote set-url origin https://github.com/Nicolukas23/organigrama_hogan.git`).

## Notas de contexto

- Expedientes de personas retiradas de ninebox (caja 0): `1015436663,81754409,1023901384,
  67013077,1032424617,30402993,79565536,1023923983,52703284,1013632227,1015466310,
  26428594,14568049,80210526,80058551,1032491550,89009161,1022955506`.
- Contador de participantes ninebox debe ser 377.
- Assessment Center (analista senior/data analytics Claro): archivo
  `ASSESSMENT CENTER1.pdf` + `dataset_sintetico_15000.xlsx`; análisis en
  `Assessment_Center_Analisis.py` → `Assessment_Center_Analisis.pptx`.
