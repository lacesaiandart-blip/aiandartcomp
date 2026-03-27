insert into public.admins (email, active)
values ('organizer@ucla.edu', true)
on conflict (email) do nothing;

insert into public.gallery_access_codes (code, active)
values ('SPRING24', true)
on conflict (code) do nothing;

insert into public.judge_access_codes (code, judge_name, active)
values
  ('JUDGE-A', 'Faculty Judge A', true),
  ('JUDGE-B', 'Student Judge B', true)
on conflict (code) do nothing;
