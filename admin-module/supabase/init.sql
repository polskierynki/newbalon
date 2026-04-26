-- Tabela treści
create table if not exists content (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

insert into content (key, value) values
  ('hero_title', 'Nazwa Firmy'),
  ('hero_subtitle', 'Twoje hasło reklamowe'),
  ('about_text', 'Opis firmy...'),
  ('contact_phone', '+48 000 000 000'),
  ('contact_email', 'kontakt@firma.pl'),
  ('contact_address', 'ul. Przykładowa 1, Warszawa'),
  ('services_title', 'Nasze usługi'),
  ('footer_text', '© 2025 Nazwa Firmy'),
  ('service_photo_1', 'https://images.pexels.com/photos/1172849/pexels-photo-1172849.jpeg?auto=compress&cs=tinysrgb&w=800&q=80'),
  ('service_photo_2', 'https://images.pexels.com/photos/1543627/pexels-photo-1543627.jpeg?auto=compress&cs=tinysrgb&w=800&q=80'),
  ('service_photo_3', 'https://images.pexels.com/photos/3419692/pexels-photo-3419692.jpeg?auto=compress&cs=tinysrgb&w=800&q=80'),
  ('service_photo_4', 'https://images.pexels.com/photos/1405528/pexels-photo-1405528.jpeg?auto=compress&cs=tinysrgb&w=800&q=80')
on conflict (key) do nothing;

-- Tabela galerii
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption text default '',
  position int default 0,
  created_at timestamptz default now()
);

-- Tabela usług
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  icon text default '⭐',
  position int default 0
);

insert into gallery (url, caption, position)
select *
from (
  values
    ('https://images.pexels.com/photos/3950478/pexels-photo-3950478.jpeg?auto=compress&cs=tinysrgb&w=800&q=80', '[APPROVED] Oh Baby - dekoracje balonowe', 0),
    ('https://images.pexels.com/photos/5760866/pexels-photo-5760866.jpeg?auto=compress&cs=tinysrgb&w=800&q=80', '[APPROVED] Chrzest Swiety - dekoracje balonowe', 1),
    ('https://images.pexels.com/photos/1561504/pexels-photo-1561504.jpeg?auto=compress&cs=tinysrgb&w=800&q=80', '[APPROVED] Happy Birthday - dekoracje balonowe', 2),
    ('https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=800&q=80', '[APPROVED] 18 urodziny - dekoracje balonowe', 3),
    ('https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=800&q=80', '[APPROVED] Slub i wesele - dekoracje balonowe', 4),
    ('https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800&q=80', '[APPROVED] Event firmowy - dekoracje balonowe', 5)
) as seed(url, caption, position)
where not exists (select 1 from gallery limit 1);

insert into services (title, description, icon, position)
select *
from (
  values
    ('Scianki balonowe', 'Efektowne scianki z balonow dopasowane do charakteru Twojej imprezy.', '🎈', 0),
    ('Scianki dekoracyjne', 'Eleganckie scianki i tla idealne na zdjecia oraz wyjatkowe aranzacje przestrzeni.', '✨', 1),
    ('Balony z helem', 'Balony z helem na kazda okazje. Bukiety, kompozycje i balony personalizowane.', '🎉', 2),
    ('Dekoracje imprezowe', 'Kompleksowe dekoracje imprez okolicznosciowych - urodziny, chrzciny, komunie i inne.', '🥳', 3)
) as seed(title, description, icon, position)
where not exists (select 1 from services limit 1);

-- RLS
alter table content enable row level security;
alter table gallery enable row level security;
alter table services enable row level security;

drop policy if exists "public read content" on content;
drop policy if exists "admin write content" on content;
drop policy if exists "public read gallery" on gallery;
drop policy if exists "admin write gallery" on gallery;
drop policy if exists "public read services" on services;
drop policy if exists "admin write services" on services;

create policy "public read content" on content for select using (true);
create policy "admin write content" on content for all using (auth.role() = 'authenticated');
create policy "public read gallery" on gallery for select using (true);
create policy "admin write gallery" on gallery for all using (auth.role() = 'authenticated');
create policy "public read services" on services for select using (true);
create policy "admin write services" on services for all using (auth.role() = 'authenticated');

-- Storage bucket
insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true)
on conflict (id) do nothing;

drop policy if exists "public read gallery storage" on storage.objects;
drop policy if exists "admin upload gallery storage" on storage.objects;
drop policy if exists "admin delete gallery storage" on storage.objects;

create policy "public read gallery storage" on storage.objects
  for select using (bucket_id = 'gallery');
create policy "admin upload gallery storage" on storage.objects
  for insert with check (bucket_id = 'gallery' and auth.role() = 'authenticated');
create policy "admin delete gallery storage" on storage.objects
  for delete using (bucket_id = 'gallery' and auth.role() = 'authenticated');
