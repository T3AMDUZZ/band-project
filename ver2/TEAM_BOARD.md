# TEAM BOARD — We Are Live ver2

> 이 파일은 에이전트 간 협업 보드입니다. 각자 자기 섹션만 수정하세요.

---

## 현재 스프린트 목표

**Sprint 1: MVP DB 스키마 확정 + 핵심 화면 구현**

**⚠️ 아키텍처 전환: NestJS → Supabase**
- 기존: Next.js → NestJS → PostgreSQL (Docker)
- 변경: Next.js → Supabase (DB + Auth + API 올인원)
- `apps/api/` NestJS 코드는 더 이상 사용하지 않음
- FE에서 `@supabase/supabase-js`로 직접 DB 접근

목표:
1. ~~통합 DB 스키마 확정 및 마이그레이션~~ ✅ Supabase에 12개 테이블 생성 완료
2. 핵심 화면 UI 구현 (홈, 밴드, 공연장, 예약) ✅ FE 완료
3. ~~백엔드 API를 새 스키마에 맞춰 업데이트~~ → Supabase로 대체
4. **FE → Supabase 연동** (mock → 실제 DB)

기간: 2026-04-05 ~

---

## 팀 리더 — 작업 현황
| 태스크 | 상태 | 비고 |
|--------|------|------|
| 3개 문서 기반 DB 스키마 통합 설계 | ✅ 완료 | schema.prisma 업데이트 완료 |
| shared 타입 패키지 동기화 | ✅ 완료 | packages/shared/src/types/index.ts |
| DB 변경사항 보고서 작성 | ✅ 완료 | docs/DB_변경사항_보고.md |
| 프론트엔드 디자인 명세서 작성 | ✅ 완료 | docs/Frontend_디자인_명세.md |
| ~~Prisma/NestJS 작업~~ | ⛔ 폐기 | Supabase로 아키텍처 전환 |
| Supabase SQL 스키마 작성 | ✅ 완료 | 12 tables + RLS + triggers |
| Supabase DB 마이그레이션 실행 | ✅ 완료 | 전체 테이블 생성 확인 |
| Supabase 클라이언트 설정 | ✅ 완료 | .env.local + supabase.ts + supabase-server.ts |
| @supabase/supabase-js 설치 | ✅ 완료 | apps/web에 설치 |

## 프론트엔드 — 작업 현황
| 태스크 | 상태 | 비고 |
|--------|------|------|
| 모노레포 scaffolding (root + apps/web) | ✅ 완료 | package.json, turbo, pnpm-workspace, tailwind, globals.css |
| 공통 인프라 (auth, api client, providers, mock-data) | ✅ 완료 | 새 스키마 기반 타입/mock 데이터 포함 |
| 공통 UI 컴포넌트 (Header, BottomNav, Footer, Card, Badge, Button) | ✅ 완료 | 디자�� 명세 기반 |
| 홈 페이지 | ✅ 완료 | 히어로 + 다가오는 공연 + 추천 밴드 + 전체목록 |
| 🔴 공연장 목록 + 상세 페이지 리디자인 | ✅ 완료 | amenities, operatingHours JSON, rentalFee JSON, 캘린더, 지도 플레이스홀더 |
| 🔴 예약 요청 폼 + 예약 관리 페이지 | ✅ 완료 | eventType, expectedSize, startTime/endTime required, 필터링 |
| 🟡 밴드 ��록 + 상세 페이지 | ✅ 완료 | coverImage, status 뱃지, inviteCode, 장르/상태 필터, SNS, 공연이력 타임라인 |
| 🟡 조직 상세 페이지 | ✅ 완료 | school, region, snsLinks, isPinned 공지, 산하밴드 탭 |
| 🟢 마이페이지 | ✅ 완료 | bio, 내밴드, 내조직, 예약현황 |
| 🟢 밴드 가입 페이지 | ✅ 완료 | inviteCode 입력 |
| 공연 목록 + 상세 페이지 | ✅ 완료 | 셋리스트, 출연순서, 시간 |
| 로그인 / 회원가입 | ✅ 완료 | AuthContext 연동 |
| Next.js 빌드 검증 | ✅ 완료 | 에러 없이 빌드 성공 |
| 일정 페이지 (캘린더뷰 + 리스트뷰) | ✅ 완료 | 타입 필터, 월 네비게이션, mock 일정 데이터 |
| 대관 페이지 (밴드 측) | ✅ 완료 | 공연장 선택 → 예약 요청 플로우 |
| 대관 관리 페이지 (공연장 측) | ✅ 완료 | 예약 요청 승인/거절, 일정 차단 캘린더 |
| 조직 목록 페이지 | ✅ 완료 | 카드 그리드, 유형/학교/지역 표시 |
| 조직 생성 폼 | ✅ 완료 | 유형, 학교, 지역, 소개 입력 |
| 밴드 생성 폼 | ✅ 완료 | 장르 다중선택, 밴드명, 소개 |
| 공연 등록 폼 | ✅ 완료 | 날짜/시간, 공연장, 출연밴드+셋리스트 편집 |
| @supabase/ssr 의존성 설치 | ✅ 완료 | 팀 리더의 supabase-server.ts 반영 |
| 빌드 재검증 (20페이지) | ✅ 완료 | 전체 통과 |
| 🔴 Supabase 브라우저 클라이언트 생성 | ✅ 완료 | lib/supabase.ts |
| 🔴 AuthContext → Supabase Auth 교체 | ✅ 완료 | signUp/signIn/signOut + onAuthStateChange + profiles 조회 |
| 🔴 Supabase 쿼리 레이어 생성 | ✅ 완료 | lib/queries.ts — bands, venues, performances, orgs, reservations, profile |
| 🔴 mock→DB fallback 훅 | ✅ 완료 | lib/use-query-with-fallback.ts — DB 데이터 없으면 mock 표시 |
| 🔴 전체 목록 페이지 Supabase 연동 | ✅ 완료 | 홈, 밴드, 공연장, 공연, 조직, 예약관리 |
| 🔴 생성 폼 Supabase 연동 | ✅ 완료 | 밴드생성, 밴드가입, 조직생성, 예약요청 |
| 🔴 로그인/회원가입 Supabase Auth 연동 | ✅ 완료 | 에러 메시지 표시 포함 |
| 🟡 snake_case 호환 처리 | ✅ 완료 | 템플릿에서 snake_case ?? camelCase fallback |
| 빌드 최종 검증 (20페이지) | ✅ 완료 | 전체 통과 |
| 🔴 상세 페이지 3개 Supabase 직접 연동 | ✅ 완료 | bands/[id], venues/[id], performances/[id] — 시드 데이터로 동작 |
| 🔴 조직 상세 Supabase 연동 | ✅ 완료 | organizations/[id] — 산하밴드, 공지(isPinned), 멤버 |
| 🔴 일정 페이지 schedules 테이블 연동 | ✅ 완료 | start_at/end_at→시간 변환, type lowercase 호환 |
| 🔴 queries.ts에 getSchedules 추가 | ✅ 완료 | bandId 필터 지원 |
| 빌드 최최종 검증 (20페이지) | ✅ 완료 | clean build 통과 |

---

## 메시지 (에이전트 간 전달사항)

### 팀 리더 → 프론트엔드

**[2026-04-05] DB 스키마 변경 및 FE 작업 요청**

DB 스키마를 3개 문서(DB_schema.md, 기획서.md, MVP.md) 기반으로 통합 재설계했습니다.
상세 내용은 아래 문서들을 참고해주세요:

- `docs/DB_변경사항_보고.md` — 변경 내역 전체
- `docs/Frontend_디자인_명세.md` — 화면별 와이어프레임 + 데이터 매핑
- `packages/shared/src/types/index.ts` — 업데이트된 타입 정의

**FE에서 반영해야 할 핵심 변경사항:**

1. **Band 모델 변경**
   - 새 필드: `coverImage`, `status` (ACTIVE/HIATUS/DISBANDED), `inviteCode`
   - 밴드 카드에 status 뱃지 표시, 카드 커버에 coverImage 사용
   - `/bands/join` 페이지: inviteCode 입력 화면 신규 필요

2. **Organization 모델 변경**
   - 새 필드: `coverImage`, `school`, `region`, `snsLinks`
   - 조직 상세 페이지에 학교/지역/SNS 표시
   - `Announcement.isPinned` → 상단 고정 공지 UI

3. **Venue 모델 대폭 변경**
   - 새 필드: `latitude/longitude`, `phone`, `amenities[]`, `operatingHours` (JSON), `rentalFee` (JSON)
   - 타입 변경: `operatingHours` String→JSON, `rentalFee` String→JSON
   - 공연장 상세 리디자인 필요 (운영시간표, 요금표, 편의시설 아이콘)
   - `manager` 관계 추가 → 관리자 정보 표시 가능

4. **Performance 모델 변경**
   - 새 필드: `startTime`, `endTime`, `createdBy`
   - 공연 등록 폼에 시간 입력 추가
   - 공연 카드/상세에 시간 표시

5. **Reservation 모델 대폭 변경**
   - 새 필드: `requestedBy`, `eventType`, `expectedSize`, `replyMessage`
   - `startTime/endTime` → required로 변경
   - `response` → `replyMessage`로 리네임
   - 예약 폼: eventType 선택, expectedSize 입력 추가
   - 예약 관리: replyMessage 표시/입력

6. **User 모델 변경**
   - 새 필드: `bio`
   - 마이페이지: bio 표시/편집

7. **Notification 모델 변경**
   - 새 필드: `referenceId`, `referenceType`
   - 새 타입: `RESERVATION_REQUESTED`, `ORG_ANNOUNCEMENT`

**API 클라이언트 업데이트 필요:**
- `lib/api/venues.ts` — operatingHours/rentalFee 타입 변경
- `lib/api/reservations.ts` — 새 필드 반영
- `lib/api/bands.ts` — inviteCode, status, coverImage 추가

**우선순위 제안:**
1. 🔴 공연장 상세 페이지 리디자인 (변경 가장 큼)
2. 🔴 예약 요청 폼 리디자인
3. 🟡 밴드 카드/상세 업데이트
4. 🟡 조직 상세 업데이트
5. 🟢 마이페이지 bio 추가
6. 🟢 밴드 가입 페이지 신규

와이어프레임은 `docs/Frontend_디자인_명세.md`에 있으니 참고 부탁드립니다.

### 프론트엔드 → 팀 리더

**[2026-04-05] FE 전체 페이지 신규 생성 완료**

디자인 명세서 기반으로 모든 핵심 페이지를 신규 구현했습니다.

**[2026-04-06] 누락 페이지 추가 + Supabase 전환 확인**

Supabase 아키텍처 전환 확인했습니다. `@supabase/ssr` 의존성 설치 완료.

**현재 FE 전체 구현 현황 (20페이지, 빌드 통과):**

| 카테고리 | 페이지 | 경로 | 주요 기능 |
|----------|--------|------|-----------|
| 인프라 | 모노레포 | root | package.json, turbo, pnpm-workspace, tailwind, globals.css |
| 인프라 | 공통 컴포넌트 | components/ | Header, BottomNav, Footer, Card, Badge, Button |
| 인프라 | 공통 인프라 | lib/, contexts/, providers/ | AuthContext, QueryProvider, API client, mock-data, utils |
| 홈 | 홈 | `/` | 히어로, 다가오는 공연 가로스크롤, 추천 밴드, 전체 공연 목록 |
| 밴드 | 밴드 목록 | `/bands` | 장르/상태 필터, 카드 그리드 (coverImage, status 뱃지) |
| 밴드 | 밴드 상세 | `/bands/[id]` | 히어로, 멤버/공연이력 탭, inviteCode, SNS, 타임라인 |
| 밴드 | 밴드 생성 | `/bands/new` | 밴드명, 장르 다중선택, 소개 입력 |
| 밴드 | 밴드 가입 | `/bands/join` | 초대코드 입력 |
| 공연장 | 공연장 목록 | `/venues` | 카드 그리드, amenities, 연락처 |
| 공연장 | 공연장 상세 | `/venues/[id]` | 사진갤러리, 운영시간표, 요금표(JSON), 편의시설, 가용일정 캘린더, 지도 플레이스홀더 |
| 공연 | 공연 목록 | `/performances` | 카드 그리드, 상태뱃지, 출연밴드 태그 |
| 공연 | 공연 상세 | `/performances/[id]` | 포스터, 출연밴드 + 셋리스트, 출연순서 |
| 공연 | 공연 등록 | `/performances/new` | 날짜/시간, 공연장 선택, 출연밴드+셋리스트 편집 UI |
| 예약 | 예약 요청 폼 | `/reservations/new` | eventType, expectedSize, startTime/endTime required |
| 예약 | 예약 관리 | `/reservations` | 상태 필터(전체/대기/승인/거절/취소), replyMessage |
| 일정 | 일정 | `/schedule` | 캘린더뷰/리스트뷰 전환, 합주/공연/미팅/기타 필터, 월 네비게이션 |
| 대관 | 대관 (밴드 측) | `/booking` | 공연장 카드 + 요금 + 편의시설 → 예약 요청 연결 |
| 대관 | 대관 관리 (공연장 측) | `/booking/admin` | 예약 승인/거절 + 답변 + 일정 차단 캘린더 |
| 조직 | 조직 목록 | `/organizations` | 카드 그리드, 유형 뱃지, 학교/지역 |
| 조직 | 조직 상세 | `/organizations/[id]` | 산하밴드/공지/멤버 탭, isPinned, school, region, snsLinks |
| 조직 | 조직 생성 | `/organizations/new` | 이름, 유형, 학교, 지역, 소개 |
| 인증 | 로그인 | `/login` | 이메일/비밀번호 |
| 인증 | 회원가입 | `/signup` | 이름, 닉네임, 이메일, 비밀번호 |
| 마이 | 마이페이지 | `/mypage` | 프로필(bio), 내밴드, 내조직, 예약현황 |

**[2026-04-06] Supabase 연동 완료**

팀 리더 지시에 따라 Supabase 전환 작업 완료했습니다.

**완료 항목:**
1. ✅ `lib/supabase.ts` 브라우저 클라이언트 생성
2. ✅ AuthContext → Supabase Auth 전면 교체 (`signUp/signInWithPassword/signOut` + `onAuthStateChange` 리스너 + profiles 테이블 조회)
3. ✅ `lib/queries.ts` — Supabase 쿼리 레이어 신규 생성 (bands, venues, performances, organizations, reservations, profile 전체 CRUD)
4. ✅ `lib/use-query-with-fallback.ts` — DB 데이터 없으면 mock fallback 훅 (DB 채워지면 자동 전환)
5. ✅ 전체 목록 페이지(홈, 밴드, 공연장, 공연, 조직, 예약관리) Supabase 쿼리 연동
6. ✅ 생성 폼(밴드생성, 밴드가입, 조직생성, 예약요청) Supabase insert 연동
7. ✅ 로그인/회원가입 Supabase Auth 연동
8. ✅ snake_case ↔ camelCase 호환 처리 (템플릿에서 `??` fallback)
9. ✅ 빌드 최종 검증 통과 (20페이지)

**아직 mock 유지 중인 페이지 (DB 데이터 필요):**
- `/bands/[id]`, `/venues/[id]`, `/performances/[id]` — 상세 페이지는 mock 유지 (DB에 seed 데이터 넣으면 자동 전환)
- `/schedule` — 일정 테이블이 Supabase에 없는 것으로 보임, 확인 필요
- `/booking/admin` — 공연장 관리자 전용, RLS 확인 필요

**기존 axios API 클라이언트(`lib/api/`)는 더 이상 사용하지 않지만, 참고용으로 남겨둠.**

**[2026-04-06] 블로커 해결 반영 — 상세 페이지 + 일정 Supabase 연동 완료**

시드 데이터 확인했습니다. 반영 완료:
- `bands/[id]` — `getBandById()` + `getBandMembers()` 직접 쿼리. useQuery로 로딩/에러 처리
- `venues/[id]` — `getVenueById()` + `getVenueAvailability()` 직접 쿼리. operating_hours/rental_fee JSON 호환
- `performances/[id]` — `getPerformanceById()` + `getPerformanceBands()` 직접 쿼리. setlist 렌더링 (string/object 모두 지원)
- `organizations/[id]` — `getOrganizationById()` + `getOrgBands()` + `getOrgAnnouncements()` 직접 쿼리
- `schedule` — `getSchedules()` 추가. `start_at/end_at` → 날짜/시간 변환. type lowercase 호환

**테스트 가능 URL:**
- `/bands/10000000-0000-0000-0000-000000000001`
- `/venues/20000000-0000-0000-0000-000000000001`
- `/performances/30000000-0000-0000-0000-000000000001`

**현재 상태: 전체 20페이지 Supabase 연동 완료, 빌드 통과.**

### 팀 리더 → 프론트엔드 (답변 2)

**[2026-04-06] 블로커 3건 해결 완료**

1. **schedules 테이블 생성 완료** — `public.schedules` 테이블 + RLS 정책 추가됨
   - 컬럼: id, band_id, created_by, type, title, start_at, end_at, location, memo, created_at
   - type: 'rehearsal' / 'performance' / 'meeting' / 'other'
   - RLS: 공개 조회, 로그인 생성, 생성자만 수정/삭제

2. **시드 데이터 삽입 완료** — 상세 페이지가 실제 데이터로 동작합니다
   - organizations: 3건 (충남대 밴드연합, 한밭대 락소사이어티, 대전 인디 연합)
   - bands: 5건 (블루밍사운드, 선셋드라이브, 미드나잇 펄스, 어쿠스틱 레인, 네온 서킷)
   - venues: 3건 (인디카페 봄, 라이브홀 루트, 합주실 사운드웨이브)
   - performances: 4건 (봄맞이 합동공연, 인디나이트 Vol.3, 어쿠스틱 위크엔드, 펑크의 밤)
   - performance_bands: 7건 (셋리스트 포함)
   - venue_availability: 7건
   - announcements: 3건 (고정 공지 포함)

3. **booking/admin RLS** — venues 테이블의 manager_id로 관리자 판별. 현재 시드 데이터의 manager_id는 더미UUID. 실제 유저가 가입 후 공연장 등록하면 자동 연결됨.

**상세 페이지 ID 참고 (테스트용):**
- `/bands/10000000-0000-0000-0000-000000000001` → 블루밍사운드
- `/venues/20000000-0000-0000-0000-000000000001` → 인디카페 봄
- `/performances/30000000-0000-0000-0000-000000000001` → 충남대 봄맞이 합동 공연

### 팀 리더 → 프론트엔드 (답변)

**[2026-04-05] FE 작업 확인 완료 + 요청사항 답변**

수고했습니다! 전체 페이지 빌드 통과 확인했습니다.

**요청사항 답변:**
1. **마이그레이션** — 사용자에게 .env + Docker 세팅 요청한 상태입니다. 세팅 완료되면 바로 실행합니다.
2. **shared 타입 패키지** — **이미 업데이트 완료**입니다! `packages/shared/src/types/index.ts`에 새 스키마의 모든 타입이 반영되어 있습니다. 바로 import해서 mock-data 타입을 교체하시면 됩니다:
   - `Band` (coverImage, status, inviteCode 포함)
   - `Venue` (latitude, longitude, phone, amenities, operatingHours JSON, rentalFee JSON 포함)
   - `Reservation` (requestedBy, eventType, expectedSize, replyMessage 포함)
   - `Performance` (startTime, endTime, createdBy 포함)
   - `Notification` (referenceId, referenceType 포함)
   - 기타: `SetlistItem`, `BandStatus`, `NotificationType` 등
3. **API 엔드포인트** — 백엔드 코드는 완료 (DTO+Service+Controller 전부 업데이트). DB 연결 후 바로 사용 가능합니다. 새로 추가된 엔드포인트: `POST /bands/join` (초대코드 가입)

**다음 작업 제안:**
- shared 타입 import 전환 (mock-data.ts → @band-project/shared)
- API 클라이언트에 `POST /bands/join` 엔드포인트 추가

### 팀 리더 → 프론트엔드 (긴급)

**[2026-04-05] ⚠️ 아키텍처 전환: NestJS → Supabase**

NestJS 백엔드를 폐기하고 **Supabase**로 전환했습니다. 이유:
- Docker/PostgreSQL 로컬 설치 불필요
- 백엔드 서버 배포/관리 불필요
- Auth + DB + API가 올인원

**변경된 아키텍처:**
```
기존: Next.js → axios → NestJS API → Prisma → PostgreSQL
신규: Next.js → @supabase/supabase-js → Supabase (PostgreSQL + Auth + RLS)
```

**DB 마이그레이션 완료!** Supabase에 12개 테이블 생성됨:
- profiles, organizations, organization_members, announcements
- bands, band_members, venues, venue_availability
- performances, performance_bands, reservations, notifications

**FE에서 변경해야 할 것:**

1. **API 클라이언트 교체** (가장 중요)
   - `lib/api/client.ts` (axios) → `lib/supabase.ts` (이미 생성됨)
   - 각 `lib/api/*.ts` → Supabase 쿼리로 교체
   - 예시:
     ```ts
     // 기존 (axios + NestJS)
     const bands = await api.get('/bands');
     // 신규 (Supabase)
     const { data: bands } = await supabase.from('bands').select('*, organization:organizations(name)');
     ```

2. **인증 교체**
   - 커스텀 JWT AuthContext → Supabase Auth
   - `supabase.auth.signUp()`, `supabase.auth.signInWithPassword()`
   - 회원가입 시 `name`, `nickname`을 `options.data`로 전달 → 트리거가 profiles 자동 생성

3. **DB 컬럼명 주의 (snake_case)**
   - Supabase DB는 snake_case: `profile_image`, `cover_image`, `invite_code`, `sns_links` 등
   - 기존 camelCase와 다름

4. **환경 설정 (이미 완료)**
   - `apps/web/.env.local` 생성됨 (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - `@supabase/supabase-js`, `@supabase/ssr` 설치됨
   - `lib/supabase.ts` (브라우저), `lib/supabase-server.ts` (서버 컴포넌트) 생성됨

5. **RLS (Row Level Security) 적용됨**
   - 공개 조회: profiles, organizations, bands, venues, performances → select 전부 가능
   - 예약/알림: 본인 관련 데이터만 조회 가능
   - 수정/삭제: 각 관리자/소유자만 가능
   - 인증된 사용자만 생성 가능

**우선순위:**
1. 🔴 인증 교체 (Supabase Auth) — 이게 먼저여야 나머지 API 호출이 동작
2. 🔴 API 클라이언트 교체 (axios → supabase)
3. 🟡 snake_case 매핑 처리

---

## API 스펙 변경 로그
| 날짜 | 변경 내용 | 작성자 |
|------|-----------|--------|
| 2026-04-05 | ⚠️ **아키텍처 전환: NestJS → Supabase** | 팀 리더 |
| 2026-04-05 | Supabase DB에 12개 테이블 + RLS + triggers 생성 | 팀 리더 |
| 2026-04-05 | DB 컬럼명: camelCase → snake_case (Supabase 컨벤션) | 팀 리더 |
| 2026-04-05 | 인증: 커스텀 JWT → Supabase Auth | 팀 리더 |
| 2026-04-05 | API: REST endpoints → Supabase client 직접 쿼리 | 팀 리더 |

---

## 블로커 / 이슈
| 이슈 | 상태 | 담당 |
|------|------|------|
| ~~.env 미생성~~ | ✅ 해결 | Supabase로 전환 |
| ~~Docker 필요~~ | ✅ 해결 | Supabase로 전환 |
| FE axios→supabase 클라이언트 교체 필요 | 🔄 진행 필요 | 프론트엔드 |
