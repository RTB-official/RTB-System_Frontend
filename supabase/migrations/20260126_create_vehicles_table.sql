-- Vehicles table for admin-only vehicle management
create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  plate text not null,
  color text,
  primary_user text,
  rental_start date,
  contract_end date,
  insurer text,
  inspection_date date,
  engine_oil_date date,
  repair_note text,
  registration_doc_bucket text,
  registration_doc_path text,
  registration_doc_name text,
  created_at timestamptz not null default now()
);

alter table vehicles enable row level security;

create policy "Admins can read vehicles"
  on vehicles for select
  using (
    exists (
      select 1
      from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

create policy "Admins can insert vehicles"
  on vehicles for insert
  with check (
    exists (
      select 1
      from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

create policy "Admins can update vehicles"
  on vehicles for update
  using (
    exists (
      select 1
      from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

create policy "Admins can delete vehicles"
  on vehicles for delete
  using (
    exists (
      select 1
      from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );
