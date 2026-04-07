-- ============================================
-- We Are Live - Supabase Schema Migration
-- ============================================
-- Supabase Auth가 인증을 담당하므로 auth.users를 참조합니다.
-- public.profiles 테이블이 사용자 프로필 데이터를 저장합니다.

-- 0. Extensions
create extension if not exists "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

create type organization_type as enum (
  'UNIVERSITY_CLUB',
  'BAND_UNION',
  'INDIE_COLLECTIVE',
  'PLANNING_TEAM',
  'OTHER'
);

create type org_member_role as enum ('ADMIN', 'MEMBER');

create type band_status as enum ('ACTIVE', 'HIATUS', 'DISBANDED');

create type band_member_role as enum ('ADMIN', 'MEMBER');

create type performance_status as enum ('UPCOMING', 'COMPLETED', 'CANCELLED');

create type availability_status as enum ('AVAILABLE', 'BOOKED', 'BLOCKED');

create type reservation_status as enum ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

create type notification_type as enum (
  'RESERVATION_APPROVED',
  'RESERVATION_REJECTED',
  'RESERVATION_REQUESTED',
  'VENUE_ANNOUNCEMENT',
  'SHOW_REMINDER',
  'ORG_ANNOUNCEMENT'
);

-- ============================================
-- 0. PROFILES (auth.users 연동)
-- ============================================

create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  name text not null,
  nickname text unique not null,
  profile_image text,
  bio text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ============================================
-- 1. ORGANIZATIONS (조직/동아리)
-- ============================================

create table public.organizations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type organization_type not null,
  description text,
  profile_image text,
  cover_image text,
  school text,
  region text,
  sns_links jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_organizations_type on public.organizations(type);
create index idx_organizations_school on public.organizations(school);

-- ============================================
-- 1-1. ORGANIZATION MEMBERS
-- ============================================

create table public.organization_members (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role org_member_role default 'MEMBER' not null,
  joined_at timestamptz default now() not null,
  unique(organization_id, user_id)
);

-- ============================================
-- 1-2. ANNOUNCEMENTS (조직 공지)
-- ============================================

create table public.announcements (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  author_id uuid references public.profiles(id) not null,
  title text not null,
  content text not null,
  is_pinned boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_announcements_org_date on public.announcements(organization_id, created_at desc);

-- ============================================
-- 2. BANDS (밴드)
-- ============================================

create table public.bands (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  genre text[] default '{}',
  description text,
  profile_image text,
  cover_image text,
  sns_links jsonb,
  status band_status default 'ACTIVE' not null,
  invite_code text unique not null,
  organization_id uuid references public.organizations(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_bands_organization on public.bands(organization_id);
create index idx_bands_status on public.bands(status);

-- ============================================
-- 2-1. BAND MEMBERS
-- ============================================

create table public.band_members (
  id uuid default gen_random_uuid() primary key,
  band_id uuid references public.bands(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role band_member_role default 'MEMBER' not null,
  part text,
  joined_at timestamptz default now() not null,
  unique(band_id, user_id)
);

-- ============================================
-- 3. VENUES (공연장)
-- ============================================

create table public.venues (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  address text not null,
  latitude double precision,
  longitude double precision,
  phone text,
  capacity integer,
  operating_hours jsonb,
  rental_fee jsonb,
  description text,
  photos text[] default '{}',
  amenities text[] default '{}',
  manager_id uuid references public.profiles(id) not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_venues_manager on public.venues(manager_id);

-- ============================================
-- 3-1. VENUE AVAILABILITY
-- ============================================

create table public.venue_availability (
  id uuid default gen_random_uuid() primary key,
  venue_id uuid references public.venues(id) on delete cascade not null,
  date date not null,
  status availability_status default 'AVAILABLE' not null,
  note text,
  unique(venue_id, date)
);

-- ============================================
-- 4. PERFORMANCES (공연)
-- ============================================

create table public.performances (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date timestamptz not null,
  start_time text,
  end_time text,
  venue_id uuid references public.venues(id) on delete set null,
  ticket_price integer,
  poster_image text,
  status performance_status default 'UPCOMING' not null,
  created_by uuid references public.profiles(id) not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_performances_date on public.performances(date desc);
create index idx_performances_status on public.performances(status);
create index idx_performances_venue on public.performances(venue_id);

-- ============================================
-- 4-1. PERFORMANCE BANDS (공연-밴드 N:M)
-- ============================================

create table public.performance_bands (
  id uuid default gen_random_uuid() primary key,
  performance_id uuid references public.performances(id) on delete cascade not null,
  band_id uuid references public.bands(id) on delete cascade not null,
  play_order integer default 0 not null,
  setlist jsonb,
  unique(performance_id, band_id)
);

-- ============================================
-- 5. RESERVATIONS (예약)
-- ============================================

create table public.reservations (
  id uuid default gen_random_uuid() primary key,
  band_id uuid references public.bands(id) on delete cascade not null,
  venue_id uuid references public.venues(id) on delete cascade not null,
  requested_by uuid references public.profiles(id) not null,
  date date not null,
  start_time text not null,
  end_time text not null,
  event_type text default 'concert' not null,
  expected_size integer,
  message text,
  reply_message text,
  status reservation_status default 'PENDING' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_reservations_venue_status on public.reservations(venue_id, status);
create index idx_reservations_band_date on public.reservations(band_id, created_at desc);
create index idx_reservations_venue_date on public.reservations(venue_id, date);

-- ============================================
-- 6. NOTIFICATIONS (알림)
-- ============================================

create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  recipient_id uuid references public.profiles(id) on delete cascade not null,
  type notification_type not null,
  title text not null,
  body text,
  reference_id uuid,
  reference_type text,
  is_read boolean default false not null,
  created_at timestamptz default now() not null
);

create index idx_notifications_user on public.notifications(recipient_id, is_read, created_at desc);

-- ============================================
-- TRIGGERS: updated_at 자동 갱신
-- ============================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles
  for each row execute function update_updated_at();

create trigger set_updated_at before update on public.organizations
  for each row execute function update_updated_at();

create trigger set_updated_at before update on public.announcements
  for each row execute function update_updated_at();

create trigger set_updated_at before update on public.bands
  for each row execute function update_updated_at();

create trigger set_updated_at before update on public.venues
  for each row execute function update_updated_at();

create trigger set_updated_at before update on public.performances
  for each row execute function update_updated_at();

create trigger set_updated_at before update on public.reservations
  for each row execute function update_updated_at();

-- ============================================
-- TRIGGER: 회원가입 시 프로필 자동 생성
-- ============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, nickname)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'nickname', new.email)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- RLS (Row Level Security)
-- ============================================

-- 모든 테이블에 RLS 활성화
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.announcements enable row level security;
alter table public.bands enable row level security;
alter table public.band_members enable row level security;
alter table public.venues enable row level security;
alter table public.venue_availability enable row level security;
alter table public.performances enable row level security;
alter table public.performance_bands enable row level security;
alter table public.reservations enable row level security;
alter table public.notifications enable row level security;

-- ── Profiles ──
create policy "프로필 공개 조회" on public.profiles
  for select using (true);

create policy "본인 프로필 수정" on public.profiles
  for update using (auth.uid() = id);

-- ── Organizations ──
create policy "조직 공개 조회" on public.organizations
  for select using (true);

create policy "로그인 사용자 조직 생성" on public.organizations
  for insert with check (auth.uid() is not null);

create policy "조직 관리자만 수정" on public.organizations
  for update using (
    exists (
      select 1 from public.organization_members
      where organization_id = id and user_id = auth.uid() and role = 'ADMIN'
    )
  );

create policy "조직 관리자만 삭제" on public.organizations
  for delete using (
    exists (
      select 1 from public.organization_members
      where organization_id = id and user_id = auth.uid() and role = 'ADMIN'
    )
  );

-- ── Organization Members ──
create policy "조직 멤버 공개 조회" on public.organization_members
  for select using (true);

create policy "조직 멤버 추가" on public.organization_members
  for insert with check (auth.uid() is not null);

create policy "조직 관리자만 멤버 삭제" on public.organization_members
  for delete using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = organization_id and om.user_id = auth.uid() and om.role = 'ADMIN'
    )
  );

-- ── Announcements ──
create policy "공지 공개 조회" on public.announcements
  for select using (true);

create policy "조직 관리자만 공지 작성" on public.announcements
  for insert with check (
    exists (
      select 1 from public.organization_members
      where organization_id = announcements.organization_id and user_id = auth.uid() and role = 'ADMIN'
    )
  );

create policy "공지 작성자/관리자만 수정" on public.announcements
  for update using (author_id = auth.uid());

-- ── Bands ──
create policy "밴드 공개 조회" on public.bands
  for select using (true);

create policy "로그인 사용자 밴드 생성" on public.bands
  for insert with check (auth.uid() is not null);

create policy "밴드 관리자만 수정" on public.bands
  for update using (
    exists (
      select 1 from public.band_members
      where band_id = id and user_id = auth.uid() and role = 'ADMIN'
    )
  );

create policy "밴드 관리자만 삭제" on public.bands
  for delete using (
    exists (
      select 1 from public.band_members
      where band_id = id and user_id = auth.uid() and role = 'ADMIN'
    )
  );

-- ── Band Members ──
create policy "밴드 멤버 공개 조회" on public.band_members
  for select using (true);

create policy "밴드 멤버 추가" on public.band_members
  for insert with check (auth.uid() is not null);

create policy "밴드 관리자만 멤버 삭제" on public.band_members
  for delete using (
    exists (
      select 1 from public.band_members bm
      where bm.band_id = band_id and bm.user_id = auth.uid() and bm.role = 'ADMIN'
    )
  );

-- ── Venues ──
create policy "공연장 공개 조회" on public.venues
  for select using (true);

create policy "로그인 사용자 공연장 등록" on public.venues
  for insert with check (auth.uid() is not null);

create policy "공연장 관리자만 수정" on public.venues
  for update using (manager_id = auth.uid());

create policy "공연장 관리자만 삭제" on public.venues
  for delete using (manager_id = auth.uid());

-- ── Venue Availability ──
create policy "가용일정 공개 조회" on public.venue_availability
  for select using (true);

create policy "공연장 관리자만 가용일정 관리" on public.venue_availability
  for insert with check (
    exists (
      select 1 from public.venues where id = venue_id and manager_id = auth.uid()
    )
  );

create policy "공연장 관리자만 가용일정 수정" on public.venue_availability
  for update using (
    exists (
      select 1 from public.venues where id = venue_id and manager_id = auth.uid()
    )
  );

-- ── Performances ──
create policy "공연 공개 조회" on public.performances
  for select using (true);

create policy "로그인 사용자 공연 등록" on public.performances
  for insert with check (auth.uid() is not null);

create policy "공연 등록자만 수정" on public.performances
  for update using (created_by = auth.uid());

create policy "공연 등록자만 삭제" on public.performances
  for delete using (created_by = auth.uid());

-- ── Performance Bands ──
create policy "출연밴드 공개 조회" on public.performance_bands
  for select using (true);

create policy "로그인 사용자 출연밴드 추가" on public.performance_bands
  for insert with check (auth.uid() is not null);

create policy "출연밴드 삭제" on public.performance_bands
  for delete using (auth.uid() is not null);

-- ── Reservations ──
create policy "본인 관련 예약 조회" on public.reservations
  for select using (
    requested_by = auth.uid()
    or exists (
      select 1 from public.band_members where band_id = reservations.band_id and user_id = auth.uid()
    )
    or exists (
      select 1 from public.venues where id = reservations.venue_id and manager_id = auth.uid()
    )
  );

create policy "로그인 사용자 예약 요청" on public.reservations
  for insert with check (auth.uid() is not null);

create policy "관련자만 예약 수정" on public.reservations
  for update using (
    requested_by = auth.uid()
    or exists (
      select 1 from public.venues where id = venue_id and manager_id = auth.uid()
    )
  );

-- ── Notifications ──
create policy "본인 알림만 조회" on public.notifications
  for select using (recipient_id = auth.uid());

create policy "알림 생성" on public.notifications
  for insert with check (auth.uid() is not null);

create policy "본인 알림만 수정(읽음)" on public.notifications
  for update using (recipient_id = auth.uid());
