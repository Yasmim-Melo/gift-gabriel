create extension if not exists pgcrypto;

create table if not exists public.album_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  file_path text not null,
  added_at timestamptz not null default now()
);

alter table public.album_photos enable row level security;

drop policy if exists "album_photos_select_all" on public.album_photos;
create policy "album_photos_select_all"
  on public.album_photos
  for select
  using (true);

drop policy if exists "album_photos_insert_all" on public.album_photos;
create policy "album_photos_insert_all"
  on public.album_photos
  for insert
  with check (true);

drop policy if exists "album_photos_delete_all" on public.album_photos;
create policy "album_photos_delete_all"
  on public.album_photos
  for delete
  using (true);

insert into storage.buckets (id, name, public)
values ('love-photos', 'love-photos', true)
on conflict (id) do nothing;

drop policy if exists "storage_love_photos_select" on storage.objects;
create policy "storage_love_photos_select"
  on storage.objects
  for select
  using (bucket_id = 'love-photos');

drop policy if exists "storage_love_photos_insert" on storage.objects;
create policy "storage_love_photos_insert"
  on storage.objects
  for insert
  with check (bucket_id = 'love-photos');

drop policy if exists "storage_love_photos_delete" on storage.objects;
create policy "storage_love_photos_delete"
  on storage.objects
  for delete
  using (bucket_id = 'love-photos');
