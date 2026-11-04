-- Optional nickname for existing and new family members.
alter table public.members
  add column if not exists nickname text;
