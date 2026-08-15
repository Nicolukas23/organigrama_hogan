-- ============================================================
-- Schema: Tableros Claro Colombia
-- Tablas para Ficha de Talento, Nine Box, Hogan
-- ============================================================

-- 1. PERSONAS (Información general - de Planta_de_Personal)
create table if not exists public.personas (
  expediente text primary key,
  nombre text,
  cargo text,
  empresa text,
  area text,
  ciudades text,
  region text,
  direccion_comite text,
  gerencia text,
  jefe text,
  fecha_ingreso text,
  tipo_vinculacion text,
  estado text,
  antiguedad text,
  fortalezas text,
  oportunidades text,
  foto_url text,
  updated_at timestamptz default now()
);

-- 2. FORMACION (Formación & Experiencia)
create table if not exists public.formacion (
  expediente text primary key,
  educacion_formal text,
  educacion_complementaria text,
  experiencia_claro text,
  experiencia_otros text,
  updated_at timestamptz default now()
);

-- 3. DESEMPENO (por año)
create table if not exists public.desempeno (
  expediente text primary key,
  y2024 numeric,
  y2025 numeric,
  y2026 numeric,
  updated_at timestamptz default now()
);

-- 4. TALENTOS
create table if not exists public.talentos (
  expediente text primary key,
  talento text,
  soy_dueno text,
  soy_lider text,
  soy_digital text,
  updated_at timestamptz default now()
);

-- 5. OBJETIVOS
create table if not exists public.objetivos (
  expediente text primary key,
  obj text,
  talento text,
  updated_at timestamptz default now()
);

-- 6. EVALUACION 360 (una fila por competencia/persona)
create table if not exists public.evaluacion_360 (
  id bigint generated always as identity primary key,
  expediente text not null,
  competencia text,
  lider numeric,
  propio numeric,
  reporte numeric,
  par numeric,
  updated_at timestamptz default now()
);
create index if not exists idx_eval360_exp on public.evaluacion_360 (expediente);

-- 7. CLIMA
create table if not exists public.clima (
  id bigint generated always as identity primary key,
  expediente text not null,
  dimension text,
  pct numeric,
  updated_at timestamptz default now()
);
create index if not exists idx_clima_exp on public.clima (expediente);

-- 8. SUCESORES
create table if not exists public.sucesores (
  expediente text primary key,
  sucesor text,
  tiempo text,
  updated_at timestamptz default now()
);

-- 9. NINEBOX (participantes y su caja)
create table if not exists public.ninebox (
  expediente text primary key,
  nombre text,
  cargo text,
  caja text,
  jefe text,
  direccion text,
  sucesor text,
  tiempo text,
  updated_at timestamptz default now()
);

-- 10. HOGAN (perfiles)
create table if not exists public.hogan (
  expediente text primary key,
  perfil jsonb,
  updated_at timestamptz default now()
);

-- ============================================================
-- RLS: solo lectura pública (los tableros son públicos tras login
-- en el front; la data sensible se protege a nivel de front).
-- ============================================================
alter table public.personas enable row level security;
alter table public.formacion enable row level security;
alter table public.desempeno enable row level security;
alter table public.talentos enable row level security;
alter table public.objetivos enable row level security;
alter table public.evaluacion_360 enable row level security;
alter table public.clima enable row level security;
alter table public.sucesores enable row level security;
alter table public.ninebox enable row level security;
alter table public.hogan enable row level security;

-- Lectura pública (anon key)
create policy "lectura publica" on public.personas for select using (true);
create policy "lectura publica" on public.formacion for select using (true);
create policy "lectura publica" on public.desempeno for select using (true);
create policy "lectura publica" on public.talentos for select using (true);
create policy "lectura publica" on public.objetivos for select using (true);
create policy "lectura publica" on public.evaluacion_360 for select using (true);
create policy "lectura publica" on public.clima for select using (true);
create policy "lectura publica" on public.sucesores for select using (true);
create policy "lectura publica" on public.ninebox for select using (true);
create policy "lectura publica" on public.hogan for select using (true);
