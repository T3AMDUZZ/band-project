# Band Platform — Phase 1 Database Schema

> **16 tables · 5 domains · PostgreSQL + UUID PK**
> Auth, Band, Schedule, Performance, Venue & Reservation

---

## Overview

| Domain | Tables | Key Entities |
|--------|--------|-------------|
| 0. Authentication | 1 | USERS |
| 1. Band | 4 | BANDS, BAND_MEMBERS, BAND_PHOTOS, BAND_FAVORITES |
| 2. Schedule | 3 | SCHEDULES, AVAILABILITY_POLLS, AVAILABILITY_VOTES |
| 2-B. Performance | 2 | PERFORMANCES, PERFORMANCE_PHOTOS |
| 3. Venue & Reservation | 6 | VENUES, VENUE_SLOTS, RESERVATIONS, TECH_RIDERS, VENUE_SCHEDULES, NOTIFICATIONS |

---

## 0. Authentication

소셜 로그인(카카오/구글) 전용. 자체 비밀번호 없이 OAuth provider에 인증을 위임한다.

### USERS

사용자 계정. 소셜 로그인 시 자동 생성된다.

| Column | Type | Constraints | Note |
|--------|------|-------------|------|
| `id` | UUID | PK | `gen_random_uuid()` |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | OAuth에서 수신 |
| `nickname` | VARCHAR(100) | NOT NULL | 표시 이름 |
| `profile_image_url` | TEXT | NULLABLE | 프로필 사진 URL |
| `social_provider` | VARCHAR(20) | NOT NULL | `kakao` / `google` |
| `social_id` | VARCHAR(255) | NOT NULL | Provider의 user ID |
| `created_at` | TIMESTAMPTZ | NOT NULL | 가입 시각 |
| `updated_at` | TIMESTAMPTZ | NOT NULL | 마지막 수정 |

```
UNIQUE(social_provider, social_id)
INDEX(email)
```

---

## 1. Band

밴드 생성/프로필, 멤버 관리, 사진 갤러리, 탐색 & 즐겨찾기.

### BANDS

밴드 프로필. 리더가 생성하고 탐색 피드에 카드로 노출된다.

| Column | Type | Constraints | Note |
|--------|------|-------------|------|
| `id` | UUID | PK | |
| `name` | VARCHAR(100) | NOT NULL | 밴드명 |
| `genre` | VARCHAR(50) | NULLABLE | 주 장르 태그 |
| `description` | TEXT | NULLABLE | 소개글 |
| `cover_image_url` | TEXT | NULLABLE | 카드 커버 이미지 |
| `invite_code` | VARCHAR(20) | UNIQUE, NOT NULL | 가입용 초대 코드 |
| `school` | VARCHAR(100) | NULLABLE | 소속 학교 |
| `created_at` | TIMESTAMPTZ | NOT NULL | |
| `updated_at` | TIMESTAMPTZ | NOT NULL | |

```
INDEX(genre)
INDEX(school)
```

### BAND_MEMBERS

유저-밴드 N:M 조인 테이블. `role`로 권한을 구분한다.

| Column | Type | Constraints | Note |
|--------|------|-------------|------|
| `id` | UUID | PK | |
| `band_id` | UUID | FK → BANDS | |
| `user_id` | UUID | FK → USERS | |
| `role` | VARCHAR(20) | NOT NULL | `leader` / `member` / `guest` |
| `joined_at` | TIMESTAMPTZ | NOT NULL | |

```
UNIQUE(band_id, user_id)
```

### BAND_PHOTOS

밴드별 전용 사진 갤러리.

| Column | Type | Constraints | Note |
|--------|------|-------------|------|
| `id` | UUID | PK | |
| `band_id` | UUID | FK → BANDS | |
| `uploader_id` | UUID | FK → USERS | 업로드한 멤버 |
| `image_url` | TEXT | NOT NULL | S3/CDN URL |
| `created_at` | TIMESTAMPTZ | NOT NULL | |

```
INDEX(band_id, created_at DESC)
```

### BAND_FAVORITES

밴드 탐색 화면의 즐겨찾기.

| Column | Type | Constraints | Note |
|--------|------|-------------|------|
| `id` | UUID | PK | |
| `user_id` | UUID | FK → USERS | |
| `band_id` | UUID | FK → BANDS | |
| `created_at` | TIMESTAMPTZ | NOT NULL | |

```
UNIQUE(user_id, band_id)
```

---

## 2. Schedule

합주 시간 조율(When2Meet 방식), 캘린더 뷰, 일정 생성.

### SCHEDULES

통합 캘린더 엔트리. `type`으로 합주/공연을 구분한다.

| Column | Type | Constraints | Note |
|--------|------|-------------|------|
| `id` | UUID | PK | |
| `band_id` | UUID | FK → BANDS | |
| `created_by` | UUID | FK → USERS | 생성자 |
| `type` | VARCHAR(20) | NOT NULL | `rehearsal` / `performance` |
| `title` | VARCHAR(200) | NOT NULL | 일정 제목 |
| `start_at` | TIMESTAMPTZ | NOT NULL | 시작 시각 |
| `end_at` | TIMESTAMPTZ | NOT NULL | 종료 시각 |
| `location` | VARCHAR(255) | NULLABLE | 장소 |
| `memo` | TEXT | NULLABLE | 메모 |
| `created_at` | TIMESTAMPTZ | NOT NULL | |

```
INDEX(band_id, start_at)
```

### AVAILABILITY_POLLS

When2Meet 방식 시간 조율 투표.

| Column | Type | Constraints | Note |
|--------|------|-------------|------|
| `id` | UUID | PK | |
| `band_id` | UUID | FK → BANDS | |
| `created_by` | UUID | FK → USERS | |
| `title` | VARCHAR(200) | NOT NULL | 투표 제목 |
| `start_date` | DATE | NOT NULL | 투표 범위 시작 |
| `end_date` | DATE | NOT NULL | 투표 범위 끝 |
| `created_at` | TIMESTAMPTZ | NOT NULL | |

### AVAILABILITY_VOTES

개별 타임 슬롯 투표. 프론트에서 aggregate 해서 겹치는 시간을 하이라이트한다.

| Column | Type | Constraints | Note |
|--------|------|-------------|------|
| `id` | UUID | PK | |
| `poll_id` | UUID | FK → AVAILABILITY_POLLS | |
| `user_id` | UUID | FK → USERS | |
| `time_slot` | TIMESTAMPTZ | NOT NULL | 30분 단위 슬롯 시작 |
| `status` | VARCHAR(20) | NOT NULL | `available` / `maybe` / `unavailable` |

```
UNIQUE(poll_id, user_id, time_slot)
```

---

## 2-B. Performance Records

공연 기록 + 셋리스트 + 사진 갤러리.

### PERFORMANCES

과거 공연 기록. 밴드와 공연장에 모두 연결된다.

| Column | Type | Constraints | Note |
|--------|------|-------------|------|
| `id` | UUID | PK | |
| `band_id` | UUID | FK → BANDS | |
| `venue_id` | UUID | FK → VENUES, NULLABLE | 공연장 미등록 시 NULL |
| `title` | VARCHAR(200) | NOT NULL | 공연 제목 |
| `performance_date` | DATE | NOT NULL | 공연 날짜 |
| `setlist` | JSONB | NULLABLE | `[{"order":1,"song":"..."}]` |
| `created_at` | TIMESTAMPTZ | NOT NULL | |

```
INDEX(band_id, performance_date DESC)
```

### PERFORMANCE_PHOTOS

공연별 사진 갤러리.

| Column | Type | Constraints | Note |
|--------|------|-------------|------|
| `id` | UUID | PK | |
| `performance_id` | UUID | FK → PERFORMANCES | |
| `image_url` | TEXT | NOT NULL | |
| `sort_order` | INTEGER | DEFAULT 0 | 표시 순서 |
| `created_at` | TIMESTAMPTZ | NOT NULL | |

```
INDEX(performance_id, sort_order)
```

---

## 3. Venue & Reservation

공연장 등록, 슬롯 관리, 예약 워크플로우(pending → approved/rejected), 테크라이더, 타임테이블, 알림.

### VENUES

공연장 프로필. 어드민 유저가 관리한다.

| Column | Type | Constraints | Note |
|--------|------|-------------|------|
| `id` | UUID | PK | |
| `admin_id` | UUID | FK → USERS | 공연장 관리자 |
| `name` | VARCHAR(200) | NOT NULL | |
| `address` | VARCHAR(500) | NOT NULL | |
| `latitude` | DECIMAL(9,6) | NULLABLE | 위도 |
| `longitude` | DECIMAL(9,6) | NULLABLE | 경도 |
| `phone` | VARCHAR(20) | NULLABLE | |
| `description` | TEXT | NULLABLE | |
| `cover_image_url` | TEXT | NULLABLE | |
| `created_at` | TIMESTAMPTZ | NOT NULL | |
| `updated_at` | TIMESTAMPTZ | NOT NULL | |

```
INDEX(admin_id)
```

### VENUE_SLOTS

예약 가능한 시간 블록. 어드민이 사전에 정의한다.

| Column | Type | Constraints | Note |
|--------|------|-------------|------|
| `id` | UUID | PK | |
| `venue_id` | UUID | FK → VENUES | |
| `slot_date` | DATE | NOT NULL | |
| `start_time` | TIME | NOT NULL | |
| `end_time` | TIME | NOT NULL | |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'open' | `open` / `reserved` / `blocked` |

```
INDEX(venue_id, slot_date)
UNIQUE(venue_id, slot_date, start_time)
```

### RESERVATIONS

밴드 → 공연장 예약 신청. 상태 머신: `pending` → `approved` / `rejected`.

| Column | Type | Constraints | Note |
|--------|------|-------------|------|
| `id` | UUID | PK | |
| `venue_id` | UUID | FK → VENUES | |
| `band_id` | UUID | FK → BANDS | |
| `slot_id` | UUID | FK → VENUE_SLOTS | |
| `requested_by` | UUID | FK → USERS | 신청자 |
| `member_count` | INTEGER | NOT NULL | 예상 인원 |
| `genre` | VARCHAR(50) | NULLABLE | |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | `pending` / `approved` / `rejected` |
| `reject_reason` | TEXT | NULLABLE | 거절 사유 |
| `created_at` | TIMESTAMPTZ | NOT NULL | |
| `updated_at` | TIMESTAMPTZ | NOT NULL | |

```
INDEX(venue_id, status)
INDEX(band_id, created_at DESC)
```

### TECH_RIDERS

밴드별 테크라이더. 예약 신청 시 자동 첨부된다.

| Column | Type | Constraints | Note |
|--------|------|-------------|------|
| `id` | UUID | PK | |
| `band_id` | UUID | FK → BANDS | 밴드당 1개 |
| `content` | JSONB | NOT NULL | 구조화된 TR 데이터 |
| `created_at` | TIMESTAMPTZ | NOT NULL | |
| `updated_at` | TIMESTAMPTZ | NOT NULL | |

```
UNIQUE(band_id)
```

### VENUE_SCHEDULES

승인된 예약이 반영된 공연장 일정.

| Column | Type | Constraints | Note |
|--------|------|-------------|------|
| `id` | UUID | PK | |
| `venue_id` | UUID | FK → VENUES | |
| `reservation_id` | UUID | FK → RESERVATIONS | |
| `title` | VARCHAR(200) | NOT NULL | |
| `event_date` | DATE | NOT NULL | |
| `timetable` | JSONB | NULLABLE | 셋리스트 / 러닝 오더 |
| `created_at` | TIMESTAMPTZ | NOT NULL | |

```
INDEX(venue_id, event_date)
```

### NOTIFICATIONS

다형성(polymorphic) 알림 저장소. `reference_type`으로 대상 엔티티를 역추적한다.

| Column | Type | Constraints | Note |
|--------|------|-------------|------|
| `id` | UUID | PK | |
| `user_id` | UUID | FK → USERS | 수신자 |
| `type` | VARCHAR(50) | NOT NULL | `reservation_approved`, `rehearsal_reminder`, ... |
| `title` | VARCHAR(200) | NOT NULL | |
| `body` | TEXT | NULLABLE | |
| `reference_id` | UUID | NULLABLE | 연결된 엔티티 ID |
| `reference_type` | VARCHAR(50) | NULLABLE | 엔티티 타입명 |
| `is_read` | BOOLEAN | DEFAULT FALSE | |
| `created_at` | TIMESTAMPTZ | NOT NULL | |

```
INDEX(user_id, is_read, created_at DESC)
```

---

## Relationships

```
USERS        ||--o{  BAND_MEMBERS        : joins
BANDS        ||--o{  BAND_MEMBERS        : has
BANDS        ||--o{  PERFORMANCES        : performs
PERFORMANCES ||--o{  PERFORMANCE_PHOTOS  : has
BANDS        ||--o{  BAND_PHOTOS         : has
USERS        ||--o{  BAND_FAVORITES      : favorites
BANDS        ||--o{  BAND_FAVORITES      : favorited_by
BANDS        ||--o{  SCHEDULES           : has
BANDS        ||--o{  AVAILABILITY_POLLS  : creates
AVAIL_POLLS  ||--o{  AVAILABILITY_VOTES  : has
USERS        ||--o{  AVAILABILITY_VOTES  : votes
VENUES       ||--o{  VENUE_SLOTS         : has
VENUES       ||--o{  RESERVATIONS        : receives
BANDS        ||--o{  RESERVATIONS        : requests
VENUE_SLOTS  ||--||  RESERVATIONS        : books
BANDS        ||--o{  TECH_RIDERS         : owns
USERS        ||--o{  NOTIFICATIONS       : receives
VENUES       ||--o{  VENUE_SCHEDULES     : has
RESERVATIONS ||--||  VENUE_SCHEDULES     : generates
PERFORMANCES }o--||  VENUES              : at
```

---

## Design Notes

### UUID Primary Keys
Auto-increment 대신 UUID 사용. 분산 환경에서 충돌 없이 생성 가능하고, URL에 노출돼도 순서 추측이 불가능하다. Postgres의 `gen_random_uuid()` 또는 앱 레벨 UUIDv7(시간 정렬 가능)을 사용한다.

### Polymorphic Notifications
`reference_id` + `reference_type` 패턴으로 N개의 알림 테이블을 하나로 통합한다. Trade-off: `reference_id`에 FK 제약을 걸 수 없으므로 앱 레이어에서 정합성을 보장해야 한다.

### Tech Rider as Band-Level Entity
예약 테이블에 임베드하지 않고 밴드 단위로 분리했다. 문서의 "자동 첨부" 요구사항에 대응한다. 특정 예약에 대해 TR을 수정해야 할 경우 `RESERVATIONS`에 `tech_rider_snapshot JSONB` 컬럼을 추가하면 된다.

### JSONB for Setlist / Timetable
Phase 1에서는 곡별 메타데이터 검색이 불필요하므로 비정규화 상태로 유지한다. Phase 2에서 곡 DB가 필요해지면 별도 `SONGS` 테이블로 분리한다.

### Venue Slot Management
어드민이 사전에 예약 가능한 시간 블록을 정의한다. 상태 전이: `open` → `reserved`(승인 시) 또는 `blocked`(어드민 수동 차단).

### Reservation State Machine
`status` ENUM: `pending` → `approved` / `rejected`.
- 승인 시: `slot.status = 'reserved'`, `VENUE_SCHEDULES` 행 생성, 알림 발송.
- 거절 시: `reject_reason` 저장, 알림 발송.
