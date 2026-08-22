-- ==============================================================================
-- SCHEMA MIGRATION: MODELO RELACIONAL CLARO TALENTO (SUPABASE / POSTGRESQL)
-- Ejecuta este script en el "SQL Editor" de tu panel de Supabase
-- ==============================================================================

-- 1. Tabla de Evaluaciones Nine Box (Si deseas separar histórico de cajas)
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

-- 2. Tabla de Evaluaciones Hogan (Estructurada relacionalmente)
CREATE TABLE IF NOT EXISTS public.evaluaciones_hogan (
    id BIGSERIAL PRIMARY KEY,
    expediente VARCHAR(50),
    nombre VARCHAR(200) NOT NULL,
    jefe VARCHAR(200),
    cargo VARCHAR(200),
    dir_area VARCHAR(150),
    gerencia VARCHAR(150),
    tipo_area VARCHAR(50) DEFAULT 'est', -- 'est' o 'op'
    potencial INTEGER,
    versatilidad VARCHAR(50),
    clasificacion VARCHAR(50),
    scores JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Logs de Sincronización
CREATE TABLE IF NOT EXISTS public.sync_log (
    id BIGSERIAL PRIMARY KEY,
    fecha TIMESTAMPTZ DEFAULT NOW(),
    archivos TEXT[],
    total_cambios INTEGER DEFAULT 0,
    cambios JSONB DEFAULT '{}'::jsonb,
    estado VARCHAR(50) DEFAULT 'exito',
    usuario VARCHAR(100) DEFAULT 'sistema'
);

-- 4. VISTA CONSOLIDADA: Cruce automático de Personas + Sucesores + Desempeño
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

-- Habilitar permisos de lectura pública/anónima en las nuevas tablas y vistas
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

