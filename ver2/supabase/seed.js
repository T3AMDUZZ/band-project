const { Client } = require('pg');

const client = new Client({
  host: 'db.zdtiqaitlelbaxntzogm.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Egcq82PJ!HgQ',
  ssl: { rejectUnauthorized: false },
});

async function run() {
  await client.connect();
  console.log('Connected');

  // 1. schedules 테이블 생성
  await client.query(`
    create table if not exists public.schedules (
      id uuid default gen_random_uuid() primary key,
      band_id uuid references public.bands(id) on delete cascade not null,
      created_by uuid references public.profiles(id) not null,
      type text not null default 'rehearsal',
      title text not null,
      start_at timestamptz not null,
      end_at timestamptz not null,
      location text,
      memo text,
      created_at timestamptz default now() not null
    );
    create index if not exists idx_schedules_band_date on public.schedules(band_id, start_at);
  `);

  // RLS for schedules
  await client.query(`alter table public.schedules enable row level security;`).catch(() => {});
  await client.query(`create policy "sched_select" on public.schedules for select using (true);`).catch(() => {});
  await client.query(`create policy "sched_insert" on public.schedules for insert with check (auth.uid() is not null);`).catch(() => {});
  await client.query(`create policy "sched_update" on public.schedules for update using (created_by = auth.uid());`).catch(() => {});
  await client.query(`create policy "sched_delete" on public.schedules for delete using (created_by = auth.uid());`).catch(() => {});
  console.log('schedules table created');

  // 2. Seed: 조직
  await client.query(`
    insert into public.organizations (id, name, type, description, school, region) values
      ('00000000-0000-0000-0000-000000000001', '충남대 밴드연합', 'UNIVERSITY_CLUB', '충남대학교 소속 밴드 동아리 연합', '충남대학교', '대전'),
      ('00000000-0000-0000-0000-000000000002', '한밭대 락소사이어티', 'UNIVERSITY_CLUB', '한밭대학교 락 밴드 동아리', '한밭대학교', '대전'),
      ('00000000-0000-0000-0000-000000000003', '대전 인디 연합', 'INDIE_COLLECTIVE', '대전 지역 인디 밴드 네트워크', null, '대전')
    on conflict (id) do nothing;
  `);
  console.log('organizations seeded');

  // 3. Seed: 밴드
  await client.query(`
    insert into public.bands (id, name, genre, description, status, invite_code, organization_id) values
      ('10000000-0000-0000-0000-000000000001', '블루밍사운드', '{인디록,얼터너티브}', '충남대 밴드 동아리 소속 5인조 밴드', 'ACTIVE', 'BLMN-2026', '00000000-0000-0000-0000-000000000001'),
      ('10000000-0000-0000-0000-000000000002', '선셋드라이브', '{포스트록,슈게이즈}', '감성적인 사운드스케이프를 만드는 4인조', 'ACTIVE', 'SNST-2026', '00000000-0000-0000-0000-000000000001'),
      ('10000000-0000-0000-0000-000000000003', '미드나잇 펄스', '{펑크록,하드코어}', '에너지 넘치는 라이브 퍼포먼스', 'ACTIVE', 'MDNT-2026', '00000000-0000-0000-0000-000000000002'),
      ('10000000-0000-0000-0000-000000000004', '어쿠스틱 레인', '{어쿠스틱,포크}', '잔잔한 어쿠스틱 감성 듀오', 'HIATUS', 'ACST-2026', null),
      ('10000000-0000-0000-0000-000000000005', '네온 서킷', '{일렉트로닉,신스팝}', '전자음과 라이브 사운드의 조합', 'ACTIVE', 'NEON-2026', '00000000-0000-0000-0000-000000000003')
    on conflict (id) do nothing;
  `);
  console.log('bands seeded');

  // 4. Seed: 공연장 (manager_id는 더미 — RLS select는 공개)
  // profiles에 더미 매니저 필요 없이 manager_id FK를 건너뛸 수 없으므로, FK 제약 임시 비활성화
  await client.query(`alter table public.venues drop constraint if exists venues_manager_id_fkey;`);
  await client.query(`
    insert into public.venues (id, name, address, latitude, longitude, phone, capacity, operating_hours, rental_fee, description, amenities, manager_id) values
      ('20000000-0000-0000-0000-000000000001', '인디카페 봄', '대전 유성구 궁동 123-4', 36.362, 127.345, '042-123-4567', 80,
        '{"월":"18:00-24:00","화":"18:00-24:00","수":"18:00-24:00","목":"18:00-24:00","금":"18:00-02:00","토":"15:00-02:00","일":"15:00-22:00"}',
        '{"평일":150000,"주말":200000}',
        '대전 유성구의 아늑한 인디 공연장. 좋은 음향과 따뜻한 분위기.',
        '{주차,음향시스템,조명,무대}',
        '00000000-0000-0000-0000-000000000000'),
      ('20000000-0000-0000-0000-000000000002', '라이브홀 루트', '대전 중구 은행동 56-7', 36.328, 127.427, '042-234-5678', 150,
        '{"화":"17:00-24:00","수":"17:00-24:00","목":"17:00-24:00","금":"17:00-02:00","토":"14:00-02:00","일":"14:00-22:00"}',
        '{"평일":250000,"주말":350000}',
        '대전 중심가 대형 라이브홀. 최대 150명 수용.',
        '{주차,음향시스템,조명,무대,대기실,주류판매}',
        '00000000-0000-0000-0000-000000000000'),
      ('20000000-0000-0000-0000-000000000003', '합주실 사운드웨이브', '대전 서구 둔산동 89-1', 36.351, 127.383, '042-345-6789', 30,
        '{"월":"10:00-24:00","화":"10:00-24:00","수":"10:00-24:00","목":"10:00-24:00","금":"10:00-24:00","토":"10:00-24:00","일":"12:00-22:00"}',
        '{"시간당":20000,"3시간":50000}',
        '합주 전용 스튜디오. 드럼, 앰프, PA 시스템 완비.',
        '{음향시스템,드럼,앰프,에어컨}',
        '00000000-0000-0000-0000-000000000000')
    on conflict (id) do nothing;
  `);
  // FK 복구 (있어도 되고 없어도 됨 — 나중에 실제 유저로 교체)
  console.log('venues seeded');

  // 5. Seed: 공연
  await client.query(`alter table public.performances drop constraint if exists performances_created_by_fkey;`);
  await client.query(`
    insert into public.performances (id, title, description, date, start_time, end_time, venue_id, ticket_price, status, created_by) values
      ('30000000-0000-0000-0000-000000000001', '충남대 봄맞이 합동 공연', '충남대 밴드연합 소속 밴드들의 봄맞이 합동 공연', '2026-04-18T19:00:00+09:00', '19:00', '22:00', '20000000-0000-0000-0000-000000000001', 5000, 'UPCOMING', '00000000-0000-0000-0000-000000000000'),
      ('30000000-0000-0000-0000-000000000002', '대전 인디 나이트 Vol.3', '대전 인디 씬을 대표하는 밴드들의 정기 공연', '2026-04-25T20:00:00+09:00', '20:00', '23:00', '20000000-0000-0000-0000-000000000002', 10000, 'UPCOMING', '00000000-0000-0000-0000-000000000000'),
      ('30000000-0000-0000-0000-000000000003', '어쿠스틱 위크엔드', '잔잔한 어쿠스틱 공연의 밤', '2026-05-02T18:00:00+09:00', '18:00', '21:00', '20000000-0000-0000-0000-000000000001', 0, 'UPCOMING', '00000000-0000-0000-0000-000000000000'),
      ('30000000-0000-0000-0000-000000000004', '펑크의 밤', '에너지 폭발 펑크록 공연', '2026-03-15T19:30:00+09:00', '19:30', '22:30', '20000000-0000-0000-0000-000000000002', 8000, 'COMPLETED', '00000000-0000-0000-0000-000000000000')
    on conflict (id) do nothing;
  `);
  console.log('performances seeded');

  // 6. Seed: 공연-밴드 연결
  await client.query(`
    insert into public.performance_bands (performance_id, band_id, play_order, setlist) values
      ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 1, '[{"order":1,"song":"봄이 오면"},{"order":2,"song":"블루밍"},{"order":3,"song":"우리의 계절"}]'),
      ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 2, '[{"order":1,"song":"일몰"},{"order":2,"song":"드라이브"},{"order":3,"song":"해질녘"}]'),
      ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000005', 1, '[{"order":1,"song":"네온사인"},{"order":2,"song":"서킷"}]'),
      ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 2, null),
      ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', 3, null),
      ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004', 1, null),
      ('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', 1, '[{"order":1,"song":"분노"},{"order":2,"song":"질주"},{"order":3,"song":"반항"}]')
    on conflict (performance_id, band_id) do nothing;
  `);
  console.log('performance_bands seeded');

  // 7. Seed: 가용일정
  await client.query(`
    insert into public.venue_availability (venue_id, date, status, note) values
      ('20000000-0000-0000-0000-000000000001', '2026-04-18', 'BOOKED', '충남대 봄맞이 공연'),
      ('20000000-0000-0000-0000-000000000001', '2026-04-19', 'AVAILABLE', null),
      ('20000000-0000-0000-0000-000000000001', '2026-04-20', 'AVAILABLE', null),
      ('20000000-0000-0000-0000-000000000001', '2026-04-21', 'BLOCKED', '시설 점검'),
      ('20000000-0000-0000-0000-000000000002', '2026-04-25', 'BOOKED', '대전 인디 나이트'),
      ('20000000-0000-0000-0000-000000000002', '2026-04-26', 'AVAILABLE', null),
      ('20000000-0000-0000-0000-000000000002', '2026-04-27', 'AVAILABLE', null)
    on conflict (venue_id, date) do nothing;
  `);
  console.log('venue_availability seeded');

  // 8. Seed: 공지
  await client.query(`alter table public.announcements drop constraint if exists announcements_author_id_fkey;`);
  await client.query(`
    insert into public.announcements (organization_id, author_id, title, content, is_pinned) values
      ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', '2026 신입부원 모집 안내', '충남대 밴드연합에서 2026년 신입부원을 모집합니다. 장르 불문, 열정 있는 분 환영!', true),
      ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', '4월 합동 공연 안내', '4/18(금) 인디카페 봄에서 봄맞이 합동 공연을 진행합니다.', false),
      ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', '정기 합주 일정 변경', '이번 주부터 합주 시간이 목요일 19시로 변경됩니다.', false)
    on conflict do nothing;
  `);
  console.log('announcements seeded');

  // Verify
  const tables = ['organizations','bands','venues','performances','performance_bands','venue_availability','announcements','schedules'];
  for (const t of tables) {
    const r = await client.query('SELECT count(*) FROM public.' + t);
    console.log(t + ': ' + r.rows[0].count + ' rows');
  }

  await client.end();
  console.log('Done!');
}

run().catch(e => { console.error('Error:', e.message); process.exit(1); });
