-- Practicantes (array simple en el HTML)
create table if not exists public.practicantes (
  doc text primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);

-- Tableros con estructura de árbol/JSON (hogan, index, organigrama, umm, dimensionamiento)
-- Una fila por tablero con su JSON completo.
create table if not exists public.tableros_json (
  clave text primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);