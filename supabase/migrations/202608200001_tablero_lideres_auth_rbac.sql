-- ============================================================
-- Migración: Tablero de Liderazgo con RBAC
-- Excluye: 'Comité Directivo' y 'Direccion Corporativa Gestion Humana y Administrativo'
-- ============================================================

-- 1. Vista Segura de Ninebox sin Comité ni Gestión Humana
create or replace view public.vista_lideres_ninebox as
select 
  n.expediente,
  n.nombre,
  n.cargo,
  n.caja,
  n.jefe,
  n.direccion,
  n.direccion_area,
  n.gerencia,
  n.email,
  n.region,
  n.ciudad,
  n.bp,
  n.nivel_reporte,
  n.desempeno,
  n.potencial,
  n.sucesor,
  n.tiempo,
  n.genero
from public.ninebox n
where 
  coalesce(n.direccion, '') not ilike '%comit%'
  and coalesce(n.direccion, '') not ilike '%gestion humana%'
  and coalesce(n.direccion_area, '') not ilike '%gestion humana%'
  and coalesce(n.direccion_area, '') not in ('Talento Cultura y Comunicaciones', 'Relaciones Laborales', 'Universidad Claro', 'Transformacion Y people Analytics', 'Administrativo', 'Seguridad');

-- 2. Tabla de Líderes Autorizados (Directores y Gerentes)
create table if not exists public.lideres_auth (
  id bigint generated always as identity primary key,
  email text unique not null,
  nombre text not null,
  cargo text not null,
  rol text not null check (rol in ('director', 'gerente', 'admin')),
  direccion text not null,
  gerencia text,
  expediente text,
  activo boolean default true,
  created_at timestamptz default now()
);

-- Habilitar RLS en lideres_auth
alter table public.lideres_auth enable row level security;

-- Política de lectura pública para autenticación en front
create policy "lectura autenticacion lideres" on public.lideres_auth 
for select using (true);
