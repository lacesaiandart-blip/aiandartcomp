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
drop policy if exists "votes insert with access" on public.votes;
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

drop policy if exists "submission notifications insert self or admin" on public.submission_notifications;
drop policy if exists "submission notifications insert admin only" on public.submission_notifications;
create policy "submission notifications insert admin only"
on public.submission_notifications for insert
with check (public.is_admin());

revoke execute on function public.submission_vote_summary() from public;
revoke execute on function public.submission_vote_summary() from anon;
revoke execute on function public.submission_vote_summary() from authenticated;
grant execute on function public.submission_vote_summary() to service_role;
