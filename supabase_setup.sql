-- Jalankan di Supabase: SQL Editor > New query > Run

create table if not exists public.confessions (
  id          bigint generated always as identity primary key,
  name        text        not null check (char_length(btrim(name))    between 1 and 30),
  message     text        not null check (char_length(btrim(message)) between 1 and 280),
  approved    boolean     not null default true,   -- ubah ke false di dashboard untuk menyembunyikan pesan
  created_at  timestamptz not null default now()
);

alter table public.confessions enable row level security;

-- Pengunjung boleh MEMBACA pesan yang approved
create policy "read approved confessions"
  on public.confessions for select
  to anon
  using (approved = true);

-- Pengunjung boleh MENGIRIM pesan baru (tidak bisa mengubah/menghapus)
create policy "insert confessions"
  on public.confessions for insert
  to anon
  with check (approved = true);

create index if not exists confessions_created_idx on public.confessions (created_at desc);

-- Moderasi: Table Editor > confessions > hapus baris, atau set approved = false.
