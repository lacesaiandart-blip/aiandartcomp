create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  school text,
  created_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  student_name text not null,
  school text not null,
  email text not null,
  artwork_title text not null,
  theme text not null,
  image_path text not null,
  prompt_log text not null,
  ai_tools_used text not null,
  creative_process_statement text not null,
  integrity_agreed boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'deleted')),
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_access_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_access_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  gallery_code_id uuid not null references public.gallery_access_codes(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, gallery_code_id)
);

create table if not exists public.judge_access_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  judge_name text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.judge_access_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  judge_code_id uuid not null references public.judge_access_codes(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, judge_code_id)
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  judge_code_id uuid references public.judge_access_codes(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (submission_id, user_id)
);

create or replace function public.enforce_vote_limit()
returns trigger
language plpgsql
as $$
begin
  if (
    select count(*)
    from public.votes
    where user_id = new.user_id
  ) >= 3 then
    raise exception 'vote limit reached for user %', new.user_id;
  end if;

  return new;
end;
$$;

drop trigger if exists votes_limit_trigger on public.votes;
create trigger votes_limit_trigger
before insert on public.votes
for each row
execute function public.enforce_vote_limit();

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.submission_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  submission_id uuid references public.submissions(id) on delete set null,
  artwork_title text not null,
  kind text not null check (kind in ('pending', 'approved', 'rejected')),
  message_title text not null,
  message_body text not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins
    where lower(email) = lower(auth.jwt() ->> 'email')
      and active = true
  );
$$;

create or replace function public.has_gallery_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.gallery_access_grants
    where user_id = auth.uid()
  );
$$;

create or replace function public.has_judge_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.judge_access_grants
    where user_id = auth.uid()
  );
$$;

create or replace function public.submission_vote_summary()
returns table (
  id uuid,
  artwork_title text,
  student_name text,
  theme text,
  school text,
  vote_count bigint
)
language sql
security definer
set search_path = public
as $$
  select
    s.id,
    s.artwork_title,
    s.student_name,
    s.theme,
    s.school,
    count(v.id) as vote_count
  from public.submissions s
  left join public.votes v on v.submission_id = s.id
  group by s.id
  order by vote_count desc, s.created_at asc;
$$;

alter table public.profiles enable row level security;
alter table public.submissions enable row level security;
alter table public.gallery_access_codes enable row level security;
alter table public.gallery_access_grants enable row level security;
alter table public.judge_access_codes enable row level security;
alter table public.judge_access_grants enable row level security;
alter table public.votes enable row level security;
alter table public.admins enable row level security;
alter table public.submission_notifications enable row level security;

drop policy if exists "profiles select self" on public.profiles;
create policy "profiles select self"
on public.profiles for select
using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles insert self" on public.profiles;
create policy "profiles insert self"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "profiles update self" on public.profiles;
create policy "profiles update self"
on public.profiles for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

drop policy if exists "submissions insert self" on public.submissions;
create policy "submissions insert self"
on public.submissions for insert
with check (auth.uid() = user_id and status = 'pending' and integrity_agreed = true);

drop policy if exists "submissions select self or approved" on public.submissions;
create policy "submissions select self or approved"
on public.submissions for select
using (
  auth.uid() = user_id
  or public.is_admin()
  or (
    status = 'approved'
    and (public.has_gallery_access() or public.has_judge_access())
  )
);

drop policy if exists "submissions update admin" on public.submissions;
create policy "submissions update admin"
on public.submissions for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "gallery codes admin read" on public.gallery_access_codes;
create policy "gallery codes admin read"
on public.gallery_access_codes for select
using (public.is_admin());

drop policy if exists "gallery grants self" on public.gallery_access_grants;
create policy "gallery grants self"
on public.gallery_access_grants for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "gallery grants insert self" on public.gallery_access_grants;
create policy "gallery grants insert self"
on public.gallery_access_grants for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.gallery_access_codes
    where id = gallery_code_id
      and active = true
  )
);

drop policy if exists "judge codes admin read" on public.judge_access_codes;
create policy "judge codes admin read"
on public.judge_access_codes for select
using (public.is_admin());

drop policy if exists "judge grants self" on public.judge_access_grants;
create policy "judge grants self"
on public.judge_access_grants for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "judge grants insert self" on public.judge_access_grants;
create policy "judge grants insert self"
on public.judge_access_grants for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.judge_access_codes
    where id = judge_code_id
      and active = true
  )
);

drop policy if exists "votes select self or admin" on public.votes;
create policy "votes select self or admin"
on public.votes for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "votes insert self" on public.votes;
create policy "votes insert with access"
on public.votes for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.submissions
    where id = submission_id
      and status = 'approved'
  )
  and (
    (judge_code_id is null and public.has_gallery_access())
    or (
      judge_code_id is not null
      and exists (
        select 1
        from public.judge_access_grants
        where user_id = auth.uid()
          and judge_code_id = votes.judge_code_id
      )
    )
  )
);

drop policy if exists "votes delete self" on public.votes;
create policy "votes delete self"
on public.votes for delete
using (auth.uid() = user_id);

drop policy if exists "admins select admin" on public.admins;
create policy "admins select admin"
on public.admins for select
using (public.is_admin());

drop policy if exists "submission notifications select self" on public.submission_notifications;
create policy "submission notifications select self"
on public.submission_notifications for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "submission notifications insert self or admin" on public.submission_notifications;
create policy "submission notifications insert admin only"
on public.submission_notifications for insert
with check (public.is_admin());

revoke execute on function public.submission_vote_summary() from public;
revoke execute on function public.submission_vote_summary() from anon;
revoke execute on function public.submission_vote_summary() from authenticated;
grant execute on function public.submission_vote_summary() to service_role;
