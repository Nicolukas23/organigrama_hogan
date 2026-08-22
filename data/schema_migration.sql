-- ==============================================================================
-- SCHEMA MIGRATION: MODELO RELACIONAL CLARO TALENTO ENTERPRISE (SUPABASE)
-- ==============================================================================

-- 1. Tabla de Evaluaciones Nine Box
CREATE TABLE IF NOT EXISTS public.evaluaciones_ninebox (
    id BIGSERIAL PRIMARY KEY,
    expediente VARCHAR(50) NOT NULL,
    periodo VARCHAR(20) DEFAULT '2026-H1',
    caja INTEGER,
    desempeno VARCHAR(50),
    potencial VARCHAR(50),
    sucesor VARCHAR(10) DEFAULT 'No',
    tiempo VARCHAR(50),
    nivel_reporte INTEGER,
    bp VARCHAR(150),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_eval_persona FOREIGN KEY (expediente) 
        REFERENCES public.personas(expediente) ON DELETE CASCADE
);

-- 2. Tabla de Evaluaciones Hogan
CREATE TABLE IF NOT EXISTS public.evaluaciones_hogan (
    id BIGSERIAL PRIMARY KEY,
    expediente VARCHAR(50),
    nombre VARCHAR(200) NOT NULL,
    jefe VARCHAR(200),
    cargo VARCHAR(200),
    dir_area VARCHAR(150),
    gerencia VARCHAR(150),
    tipo_area VARCHAR(50) DEFAULT 'est',
    potencial INTEGER,
    versatilidad VARCHAR(50),
    clasificacion VARCHAR(50),
    scores JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Histórico de Movimientos y Trayectoria de Cajas
CREATE TABLE IF NOT EXISTS public.historial_cajas_ninebox (
    id BIGSERIAL PRIMARY KEY,
    expediente VARCHAR(50) NOT NULL,
    periodo VARCHAR(20) NOT NULL, -- ej. '2024', '2025', '2026-H1'
    caja INTEGER NOT NULL,
    desempeno VARCHAR(50),
    potencial VARCHAR(50),
    motivo_cambio VARCHAR(255) DEFAULT 'Evaluación Anual',
    registrado_por VARCHAR(100) DEFAULT 'sistema',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_hist_persona FOREIGN KEY (expediente) 
        REFERENCES public.personas(expediente) ON DELETE CASCADE
);

-- 4. Tabla de Logs de Auditoría de Sincronización
CREATE TABLE IF NOT EXISTS public.sync_log (
    id BIGSERIAL PRIMARY KEY,
    fecha TIMESTAMPTZ DEFAULT NOW(),
    archivos TEXT[],
    total_cambios INTEGER DEFAULT 0,
    cambios JSONB DEFAULT '{}'::jsonb,
    estado VARCHAR(50) DEFAULT 'exito',
    usuario VARCHAR(100) DEFAULT 'sistema'
);

-- 5. VISTA CONSOLIDADA EJECUTIVA
CREATE OR REPLACE VIEW public.v_tablero_consolidado AS
SELECT 
    p.expediente,
    p.nombre,
    p.cargo,
    p.jefe,
    p.direccion_comite AS direccion,
    p.gerencia,
    p.area,
    p.ciudades AS ciudad,
    p.region,
    COALESCE(s.sucesor, 'No') AS sucesor,
    COALESCE(s.tiempo, '') AS tiempo,
    d.y2024 AS desempeno_2024,
    d.y2025 AS desempeno_2025,
    d.y2026 AS desempeno_2026,
    t.talento,
    t.soy_dueno,
    t.soy_lider,
    t.soy_digital
FROM public.personas p
LEFT JOIN public.sucesores s ON p.expediente = s.expediente
LEFT JOIN public.desempeno d ON p.expediente = d.expediente
LEFT JOIN public.talentos t ON p.expediente = t.expediente;

-- 6. POLÍTICAS DE SEGURIDAD ROW LEVEL SECURITY (RLS)
-- Habilitar RLS en tablas sensibles
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluaciones_ninebox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluaciones_hogan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sucesores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historial_cajas_ninebox ENABLE ROW LEVEL SECURITY;

-- Política de lectura para usuarios anónimos/autenticados de los tableros
DROP POLICY IF EXISTS "Lectura de Tableros" ON public.personas;
CREATE POLICY "Lectura de Tableros" ON public.personas FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Lectura de Ninebox" ON public.evaluaciones_ninebox;
CREATE POLICY "Lectura de Ninebox" ON public.evaluaciones_ninebox FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Lectura de Hogan" ON public.evaluaciones_hogan;
CREATE POLICY "Lectura de Hogan" ON public.evaluaciones_hogan FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Lectura de Sucesores" ON public.sucesores;
CREATE POLICY "Lectura de Sucesores" ON public.sucesores FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Lectura de Historial" ON public.historial_cajas_ninebox;
CREATE POLICY "Lectura de Historial" ON public.historial_cajas_ninebox FOR SELECT TO anon, authenticated USING (true);

-- Permisos completos para el motor de sincronización (service_role)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

