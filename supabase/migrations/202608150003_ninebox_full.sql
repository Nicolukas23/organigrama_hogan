-- Ampliar tabla ninebox con todos los campos del dataStore del HTML
alter table public.ninebox add column if not exists email text;
alter table public.ninebox add column if not exists region text;
alter table public.ninebox add column if not exists direccion_area text;
alter table public.ninebox add column if not exists gerencia text;
alter table public.ninebox add column if not exists ciudad text;
alter table public.ninebox add column if not exists bp text;
alter table public.ninebox add column if not exists nivel_reporte text;
alter table public.ninebox add column if not exists desempeno text;
alter table public.ninebox add column if not exists potencial text;
alter table public.ninebox add column if not exists genero text;