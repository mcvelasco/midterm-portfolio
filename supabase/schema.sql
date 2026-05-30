-- =========================
-- PROFILES
-- =========================
create table profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  title text,
  bio text,
  email text,
  phone text,
  location text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- =========================
-- SKILLS
-- =========================
create table skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  percentage integer,
  created_at timestamp with time zone default now()
);

-- =========================
-- TECHNOLOGIES
-- =========================
create table technologies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamp with time zone default now()
);

-- =========================
-- EXPERIENCES
-- =========================
create table experiences (
  id uuid primary key default gen_random_uuid(),
  company text,
  position text,
  start_date text,
  end_date text,
  description text,
  tags text[],
  created_at timestamp with time zone default now()
);

-- =========================
-- EDUCATION
-- =========================
create table education (
  id uuid primary key default gen_random_uuid(),
  school text,
  degree text,
  year_start text,
  year_end text,
  gpa text,
  honors text[],
  created_at timestamp with time zone default now()
);

-- =========================
-- PROJECTS
-- =========================
create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  description text,
  image_url text,
  live_url text,
  github_url text,
  technologies text[],
  created_at timestamp with time zone default now()
);

-- =========================
-- CERTIFICATES
-- =========================
create table certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text,
  issue_date text,
  description text,
  image_url text,
  created_at timestamp with time zone default now()
);

-- =========================
-- SOCIAL LINKS
-- =========================
create table social_links (
  id uuid primary key default gen_random_uuid(),
  platform text,
  url text,
  created_at timestamp with time zone default now()
);

-- =========================
-- CONTACT MESSAGES
-- =========================
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  subject text,
  message text,
  created_at timestamp with time zone default now()
);

-- =========================
-- ENABLE RLS
-- =========================
alter table profiles enable row level security;
alter table skills enable row level security;
alter table technologies enable row level security;
alter table experiences enable row level security;
alter table education enable row level security;
alter table projects enable row level security;
alter table certificates enable row level security;
alter table social_links enable row level security;
alter table contact_messages enable row level security;

-- =========================
-- PUBLIC READ ACCESS
-- =========================
create policy "Public read access" on profiles for select using (true);
create policy "Public read access" on skills for select using (true);
create policy "Public read access" on technologies for select using (true);
create policy "Public read access" on experiences for select using (true);
create policy "Public read access" on education for select using (true);
create policy "Public read access" on projects for select using (true);
create policy "Public read access" on certificates for select using (true);
create policy "Public read access" on social_links for select using (true);

-- =========================
-- ADMIN WRITE ACCESS (authenticated users only)
-- =========================
create policy "Auth users can insert" on projects for insert with check (auth.role() = 'authenticated');
create policy "Auth users can update" on projects for update using (auth.role() = 'authenticated');
create policy "Auth users can delete" on projects for delete using (auth.role() = 'authenticated');

create policy "Auth users can insert" on certificates for insert with check (auth.role() = 'authenticated');
create policy "Auth users can update" on certificates for update using (auth.role() = 'authenticated');
create policy "Auth users can delete" on certificates for delete using (auth.role() = 'authenticated');

create policy "Auth users can insert" on skills for insert with check (auth.role() = 'authenticated');
create policy "Auth users can update" on skills for update using (auth.role() = 'authenticated');
create policy "Auth users can delete" on skills for delete using (auth.role() = 'authenticated');

create policy "Auth users can insert" on technologies for insert with check (auth.role() = 'authenticated');
create policy "Auth users can update" on technologies for update using (auth.role() = 'authenticated');
create policy "Auth users can delete" on technologies for delete using (auth.role() = 'authenticated');

create policy "Auth users can insert" on experiences for insert with check (auth.role() = 'authenticated');
create policy "Auth users can update" on experiences for update using (auth.role() = 'authenticated');
create policy "Auth users can delete" on experiences for delete using (auth.role() = 'authenticated');

create policy "Auth users can insert" on education for insert with check (auth.role() = 'authenticated');
create policy "Auth users can update" on education for update using (auth.role() = 'authenticated');
create policy "Auth users can delete" on education for delete using (auth.role() = 'authenticated');

create policy "Auth users can read messages" on contact_messages for select using (auth.role() = 'authenticated');

-- =========================
-- CONTACT INSERT ACCESS (public)
-- =========================
create policy "Anyone can insert contact messages"
  on contact_messages for insert with check (true);

-- =========================
-- STORAGE BUCKETS
-- =========================
insert into storage.buckets (id, name, public)
values
  ('profile-images', 'profile-images', true),
  ('project-images', 'project-images', true),
  ('certificate-images', 'certificate-images', true);

-- Storage policies (public read, auth write)
create policy "Public can view profile images"
  on storage.objects for select using (bucket_id = 'profile-images');
create policy "Auth users can upload profile images"
  on storage.objects for insert with check (bucket_id = 'profile-images' and auth.role() = 'authenticated');

create policy "Public can view project images"
  on storage.objects for select using (bucket_id = 'project-images');
create policy "Auth users can upload project images"
  on storage.objects for insert with check (bucket_id = 'project-images' and auth.role() = 'authenticated');

create policy "Public can view certificate images"
  on storage.objects for select using (bucket_id = 'certificate-images');
create policy "Auth users can upload certificate images"
  on storage.objects for insert with check (bucket_id = 'certificate-images' and auth.role() = 'authenticated');
