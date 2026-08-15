-- Agregar columnas faltantes a personas (mapeo real de los Excels)
alter table public.personas add column if not exists region text;
alter table public.personas add column if not exists direccion_comite text;
alter table public.personas add column if not exists gerencia text;