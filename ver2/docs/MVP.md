# 대전 밴드 생태계 통합 플랫폼 - MVP 정의서

## 1. MVP 핵심 가설

**가설 1: 조직-밴드 계층 구조의 실용성**

"대전 지역 밴드 동아리 운영진은 산하 밴드를 하나의 플랫폼에서 계층적으로 관리하고 공지를 전달할 수 있다면, 기존 카카오톡/수기 관리 대신 이 플랫폼을 사용할 것이다."

**가설 2: 밴드-공연장 예약 연결의 가치**

"밴드 관리자는 공연장의 가용 일정을 온라인으로 확인하고 예약 요청을 보낼 수 있다면, 전화/DM 기반 수동 예약 대신 이 플랫폼을 사용할 것이다."

**가설 3: 공연 정보 통합 노출의 수요**

"대전 지역 밴드 관련 사용자(팬, 밴드원, 공연장 운영자)는 다가오는 공연 정보가 한 곳에 모여 있다면, 해당 플랫폼을 주기적으로 방문할 것이다."

---

## 2. MVP 포함 기능

### 2.1 회원가입 및 인증

| 항목 | 내용 |
|------|------|
| **포함** | 이메일 회원가입/로그인, JWT 인증, 토큰 갱신, 로그아웃, 기본 프로필(이름, 닉네임, 프로필 이미지) |
| **제외** | 소셜 로그인(카카오/구글), 구독 관리(Premium) |
| **API** | `POST /auth/signup`, `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh`, `GET /users/me`, `PATCH /users/me`, `GET /users/me/bands`, `GET /users/me/organizations` |
| **DB** | `User` |
| **화면** | 회원가입, 로그인, 마이페이지(기본) |

### 2.2 조직(동아리) 관리

| 항목 | 내용 |
|------|------|
| **포함** | 조직 CRUD, 산하 밴드 추가/제거, 멤버 초대/목록, 공지 게시판(작성/목록/상세), 관리자/멤버 2단계 권한 |
| **제외** | 일정 관리(MT/캘린더/참석 투표), 게스트 역할, 복잡한 가입 승인 플로우 |
| **API** | `POST /organizations`, `GET /organizations`, `GET /organizations/{id}`, `PATCH /organizations/{id}`, `DELETE /organizations/{id}`, `GET /organizations/{id}/bands`, `POST /organizations/{id}/bands`, `DELETE /organizations/{id}/bands/{bandId}`, `GET /organizations/{id}/members`, `POST /organizations/{id}/members/invite`, `DELETE /organizations/{id}/members/{userId}`, `GET /organizations/{id}/announcements`, `POST /organizations/{id}/announcements` |
| **DB** | `Organization`, `OrganizationMember`, `Announcement` |
| **화면** | 조직 페이지(헤더/소개/산하밴드/공지/멤버), 조직 생성/편집 폼 |

### 2.3 밴드 프로필

| 항목 | 내용 |
|------|------|
| **포함** | 밴드 CRUD, 멤버 초대/제거/파트 지정, 기본 정보(이름/장르/소개/이미지/SNS), 소속 조직 표시, 공연 이력 자동 연동 |
| **제외** | 테크라이더 관리, 포트폴리오(음원/사진/영상), 팔로우 |
| **API** | `POST /bands`, `GET /bands`, `GET /bands/{id}`, `PATCH /bands/{id}`, `DELETE /bands/{id}`, `GET /bands/{id}/members`, `POST /bands/{id}/members/invite`, `DELETE /bands/{id}/members/{userId}`, `GET /bands/{id}/performances` |
| **DB** | `Band`, `BandMember` |
| **화면** | 밴드 프로필(헤더/소개/멤버/공연이력), 밴드 생성/편집 폼, 밴드 목록 |

### 2.4 공연 등록 및 조회

| 항목 | 내용 |
|------|------|
| **포함** | 공연 CRUD, 공연 정보(제목/일시/공연장/출연밴드/입장료/포스터/설명), 다가오는 공연 목록, 상태 관리(UPCOMING/COMPLETED/CANCELLED) |
| **제외** | 공연 후 미디어 업로드, 관심 표시(북마크), 셋리스트 협의, 공연 통계, 피드 자동 게시 |
| **API** | `POST /performances`, `GET /performances`, `GET /performances/upcoming`, `GET /performances/{id}`, `PATCH /performances/{id}`, `DELETE /performances/{id}` |
| **DB** | `Performance`, `PerformanceBand` |
| **화면** | 홈(다가오는 공연 리스트), 공연 상세, 공연 등록 폼 |

### 2.5 공연장 등록 및 예약

| 항목 | 내용 |
|------|------|
| **포함** | 공연장 CRUD, 기본 정보(이름/주소/수용인원/운영시간/사진/대관요금), 가용 일정 캘린더, 예약 요청/승인/거절/취소, 예약 목록 조회 |
| **제외** | 장비 상세 관리, 테크라이더 대조, 월간 통계, 지도 연동, 공연장 팔로우 |
| **API** | `POST /venues`, `GET /venues`, `GET /venues/{id}`, `PATCH /venues/{id}`, `GET /venues/{id}/availability`, `PUT /venues/{id}/availability`, `GET /venues/{id}/performances`, `POST /reservations`, `GET /reservations`, `GET /reservations/venue/{venueId}`, `GET /reservations/{id}`, `PATCH /reservations/{id}/approve`, `PATCH /reservations/{id}/reject`, `PATCH /reservations/{id}/cancel` |
| **DB** | `Venue`, `VenueAvailability`, `Reservation` |
| **화면** | 공연장 목록, 공연장 상세(사진/정보/요금/일정 캘린더), 예약 요청 폼, 예약 관리(밴드 측 + 공연장 측) |

---

## 3. MVP 제외 기능

| 제외 기능 | 이유 |
|-----------|------|
| 소셜 로그인 (카카오/구글) | 이메일 인증으로 핵심 가설 검증 가능. 베타 이후 즉시 추가 |
| 일정 관리 (MT/캘린더/투표) | 핵심 연결 구조와 무관. 공지 게시판으로 대체 가능 |
| 피드/타임라인 | 추천 알고리즘 등 부가 기능 수반. 홈은 "다가오는 공연 목록"으로 대체 |
| 팔로우/알림 | 베타 규모(밴드 30개 이하)에서는 직접 탐색으로 충분 |
| 테크라이더 관리 | 구조화된 장비 양식 설계에 추가 기획 필요 |
| 포트폴리오 (음원/사진/영상) | 파일 저장소 연동 비용. SNS 링크로 대체 |
| 후원 기능 | 결제 시스템 연동 필요. 수익화는 Phase 3 목표 |
| 공연 통계 | 충분한 데이터 축적 후에 의미 |
| 검색 | 베타 규모에서 목록 + 필터링으로 충분 |

---

## 4. 기술 스택

| 영역 | 기술 | 이유 |
|------|------|------|
| Frontend | **Next.js 14+ (App Router)** | SSR/SEO, React 생태계 |
| Backend | **NestJS** | TypeScript 통일, 모듈 구조 |
| Database | **PostgreSQL** | 관계형 구조에 최적 |
| ORM | **Prisma** | 타입 안전, 마이그레이션 관리 |
| 인증 | **자체 JWT** | 소셜 로그인 제외로 단순화 |
| 파일 저장 | **Cloudflare R2** | 무료 이그레스, 최소 비용 |
| 배포 | **Vercel (FE) + Railway (BE+DB)** | 간편 설정, 무료/저가 티어 |
| UI | **Tailwind CSS + shadcn/ui** | 빠른 프로토타이핑 |
| 상태 관리 | **TanStack Query** | 서버 상태 중심 앱에 적합 |
| 유효성 검증 | **Zod** | FE/BE 공통 스키마 |
| 모바일 | **반응형 웹 (PWA 고려)** | 네이티브 앱 불필요 |

---

## 5. DB 스키마 (MVP 대상 11개 테이블)

```prisma
// MVP 대상 테이블만 포함

model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password      String
  name          String
  nickname      String   @unique
  profileImage  String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  bandMembers           BandMember[]
  organizationMembers   OrganizationMember[]
}

model Organization {
  id          String   @id @default(uuid())
  name        String
  type        OrganizationType
  description String?
  profileImage String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  bands         Band[]
  members       OrganizationMember[]
  announcements Announcement[]
}

enum OrganizationType {
  UNIVERSITY_CLUB
  BAND_UNION
  INDIE_COLLECTIVE
  PLANNING_TEAM
  OTHER
}

model OrganizationMember {
  id             String   @id @default(uuid())
  organizationId String
  userId         String
  role           OrgMemberRole @default(MEMBER)
  joinedAt       DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id])
  user         User         @relation(fields: [userId], references: [id])

  @@unique([organizationId, userId])
}

enum OrgMemberRole {
  ADMIN
  MEMBER
}

model Announcement {
  id             String   @id @default(uuid())
  organizationId String
  authorId       String
  title          String
  content        String
  createdAt      DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id])
}

model Band {
  id             String   @id @default(uuid())
  name           String
  genre          String[]
  description    String?
  profileImage   String?
  snsLinks       Json?
  organizationId String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  organization   Organization? @relation(fields: [organizationId], references: [id])
  members        BandMember[]
  performances   PerformanceBand[]
  reservations   Reservation[]
}

model BandMember {
  id       String @id @default(uuid())
  bandId   String
  userId   String
  role     BandMemberRole @default(MEMBER)
  part     String?
  joinedAt DateTime @default(now())

  band Band @relation(fields: [bandId], references: [id])
  user User @relation(fields: [userId], references: [id])

  @@unique([bandId, userId])
}

enum BandMemberRole {
  ADMIN
  MEMBER
}

model Performance {
  id          String   @id @default(uuid())
  title       String
  description String?
  date        DateTime
  venueId     String?
  ticketPrice Int?
  posterImage String?
  status      PerformanceStatus @default(UPCOMING)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  venue Venue? @relation(fields: [venueId], references: [id])
  bands PerformanceBand[]
}

enum PerformanceStatus {
  UPCOMING
  COMPLETED
  CANCELLED
}

model PerformanceBand {
  id            String @id @default(uuid())
  performanceId String
  bandId        String
  playOrder     Int?

  performance Performance @relation(fields: [performanceId], references: [id])
  band        Band        @relation(fields: [bandId], references: [id])

  @@unique([performanceId, bandId])
}

model Venue {
  id            String   @id @default(uuid())
  name          String
  address       String
  capacity      Int?
  operatingHours String?
  rentalFee     String?
  description   String?
  photos        String[]
  managerId     String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  performances  Performance[]
  availability  VenueAvailability[]
  reservations  Reservation[]
}

model VenueAvailability {
  id      String   @id @default(uuid())
  venueId String
  date    DateTime
  status  AvailabilityStatus @default(AVAILABLE)

  venue Venue @relation(fields: [venueId], references: [id])

  @@unique([venueId, date])
}

enum AvailabilityStatus {
  AVAILABLE
  BOOKED
  BLOCKED
}

model Reservation {
  id        String   @id @default(uuid())
  bandId    String
  venueId   String
  date      DateTime
  startTime String?
  endTime   String?
  status    ReservationStatus @default(PENDING)
  message   String?
  response  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  band  Band  @relation(fields: [bandId], references: [id])
  venue Venue @relation(fields: [venueId], references: [id])
}

enum ReservationStatus {
  PENDING
  APPROVED
  REJECTED
  CANCELLED
}
```

---

## 6. 개발 단계

```
Phase 0 (3일) ──> Phase 1 (4일) ──┬──> Phase 2 (4일) ──> Phase 3 (5일) ──┐
                                   │                                       │
                                   │                    Phase 2 ──┐        │
                                   │                              ├──> Phase 5 (4일) ──┐
                                   └──> Phase 4 (4일) ──┬─────────┘                    │
                                                        │                              │
                                                        ├─────────────> Phase 6 (5일) ─┤
                                                        │                              │
                                                   Phase 2 ──┘                  Phase 7 (3일)

의존성 요약:
  Phase 0 → Phase 1 (인증이 모든 것의 기반)
  Phase 1 → Phase 2 (밴드는 인증 필요)
  Phase 1 → Phase 4 (공연장도 인증 필요, Phase 2/3과 병렬 가능)
  Phase 2 → Phase 3 (조직은 밴드가 있어야 연결 가능)
  Phase 2 + Phase 4 → Phase 5 (공연은 밴드+공연장 참조)
  Phase 2 + Phase 4 → Phase 6 (예약은 밴드+공연장 필요)
  Phase 3 + Phase 5 + Phase 6 → Phase 7 (통합 테스트는 모든 기능 완료 후)
```

### Phase 0: 프로젝트 초기 설정 (3일)

- 모노레포 구조: `apps/web` (Next.js), `apps/api` (NestJS), `packages/shared`
- Prisma 스키마 + 초기 마이그레이션
- ESLint, Prettier, TypeScript 설정
- Docker Compose (PostgreSQL 로컬 개발)
- GitHub Actions (lint + type-check)

### Phase 1: 인증 및 사용자 관리 (4일)

- BE: Auth 모듈 (회원가입, 로그인, 로그아웃, 토큰 갱신)
- BE: User 모듈 (프로필 조회/수정)
- FE: 회원가입/로그인 페이지
- FE: 인증 상태 관리 (JWT, 인터셉터, 보호 라우트)
- FE: 마이페이지 (기본)

### Phase 2: 밴드 프로필 (4일)

- BE: Band 모듈 (CRUD, 멤버 관리, 공연 이력)
- FE: 밴드 생성/편집 폼
- FE: 밴드 프로필 페이지
- FE: 밴드 목록 페이지

### Phase 3: 조직 관리 (5일)

- BE: Organization 모듈 (CRUD, 산하 밴드, 멤버, 공지)
- FE: 조직 생성/편집 폼
- FE: 조직 페이지 (산하밴드/공지/멤버)
- FE: 밴드-조직 연결 UI

### Phase 4: 공연장 등록 및 가용 일정 (4일) — Phase 2/3과 병렬 가능

- BE: Venue 모듈 (CRUD, 가용 일정)
- FE: 공연장 등록/편집 폼
- FE: 공연장 상세 (일정 캘린더 포함)
- FE: 공연장 목록

### Phase 5: 공연 등록 및 조회 (4일)

- BE: Performance 모듈 (CRUD, 출연밴드 연결)
- FE: 공연 등록 폼 (공연장/밴드 선택)
- FE: 공연 상세 페이지
- FE: 홈 화면 (다가오는 공연 리스트)

### Phase 6: 예약 시스템 (5일)

- BE: Reservation 모듈 (요청/승인/거절/취소)
- FE: 예약 요청 폼
- FE: 밴드 측 예약 관리
- FE: 공연장 측 예약 관리

### Phase 7: 통합 테스트 및 배포 (3일)

- E2E 테스트 (핵심 플로우)
- 버그 수정
- 배포 (Vercel + Railway)
- 시드 데이터

**크리티컬 패스: 약 19일 (4주)**

- 경로: Phase 0(3일) → Phase 1(4일) → Phase 2(4일) → Phase 3(5일) → Phase 7(3일) = 19일
- 또는: Phase 0(3일) → Phase 1(4일) → Phase 2(4일) → Phase 6(5일) → Phase 7(3일) = 19일
- Phase 4는 Phase 1 완료 후 Phase 2와 병렬 진행 (7일차~11일차)
- Phase 3(11~16일차), Phase 5(11~15일차), Phase 6(11~16일차)은 Phase 2 + Phase 4 완료 후 병렬 진행
- Phase 7은 Phase 3(16일차), Phase 5(15일차), Phase 6(16일차) 중 가장 늦은 16일차 이후 시작

---

## 7. 성공 기준 (베타 1개월 차)

| 지표 | 목표 | 가설 |
|------|------|------|
| 등록 조직 수 | 3개+ | 가설 1 |
| 등록 밴드 수 | 15개+ | 가설 1,2 |
| 조직당 산하 밴드 | 평균 3개+ | 가설 1 |
| 등록 공연장 수 | 3개+ | 가설 2 |
| 등록 공연 수 | 5건+ | 가설 3 |
| 예약 요청 수 | 5건+ | 가설 2 |
| 예약 전환율 | 50%+ | 가설 2 |
| 가입자 수 | 50명+ | 전체 |
| 주간 재방문율 | 30%+ | 가설 3 |
| 조직 공지 게시 | 월 2건+/조직 | 가설 1 |

### 실패 판단 기준 (피벗 검토 트리거)

- 등록 조직 1개 이하
- 등록 공연장 1개 이하
- 예약 요청 0건
- 가입 후 밴드/조직 생성 진행률 10% 미만

---

## 8. 핵심 화면 목록

| 화면 | 라우트 | 인증 필요 |
|------|--------|-----------|
| 홈 (다가오는 공연) | `/` | X |
| 회원가입 | `/signup` | X |
| 로그인 | `/login` | X |
| 마이페이지 | `/mypage` | O |
| 밴드 목록 | `/bands` | X |
| 밴드 상세 | `/bands/[id]` | X |
| 밴드 생성/편집 | `/bands/new`, `/bands/[id]/edit` | O |
| 조직 목록 | `/organizations` | X |
| 조직 상세 | `/organizations/[id]` | X |
| 조직 생성/편집 | `/organizations/new`, `/organizations/[id]/edit` | O |
| 공연 상세 | `/performances/[id]` | X |
| 공연 등록 | `/performances/new` | O |
| 공연장 목록 | `/venues` | X |
| 공연장 상세 | `/venues/[id]` | X |
| 공연장 등록/편집 | `/venues/new`, `/venues/[id]/edit` | O |
| 예약 관리 | `/reservations` | O |
