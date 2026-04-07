# DB 스키마 통합 설계 보고서

> 작성: 중간 리더 | 기준 문서: DB_schema.md, 기획서.md, MVP.md

---

## 1. 변경 요약

| 모델 | 변경 유형 | 상세 |
|------|-----------|------|
| **User** | 필드 추가 | `bio` (한줄 소개), Venue/Performance 역관계 추가 |
| **Organization** | 필드 추가 | `coverImage`, `school`, `region`, `snsLinks` + 인덱스 |
| **Announcement** | 필드 추가 | `isPinned`, `updatedAt` |
| **Band** | 필드 추가 | `coverImage`, `status` (ACTIVE/HIATUS/DISBANDED), `inviteCode` |
| **Performance** | 필드 추가 | `startTime`, `endTime`, `createdBy` (FK→User) + 인덱스 |
| **PerformanceBand** | 변경 | `playOrder` required (default 0), `setlist` JSONB 추가 |
| **Venue** | 대폭 강화 | `latitude/longitude`, `phone`, `amenities[]`, `operatingHours` JSON, `rentalFee` JSON, `managerId` FK→User |
| **VenueAvailability** | 필드 추가 | `note`, `@db.Date` 명시 |
| **Reservation** | 대폭 강화 | `requestedBy`, `startTime/endTime` required, `eventType`, `expectedSize`, `replyMessage`, 인덱스 3개 |
| **Notification** | 다형성 전환 | `referenceId/referenceType` 추가 (DB_schema 방식), `RESERVATION_REQUESTED/ORG_ANNOUNCEMENT` 타입 추가 |
| **전체** | 관계 안전성 | `onDelete: Cascade/SetNull` 명시, `@@map` 테이블명 지정, 인덱스 추가 |

---

## 2. 설계 근거

### 2.1 DB_schema.md에서 채택한 것
- `Band.inviteCode`: 초대 코드 기반 밴드 가입
- `Band.coverImage`: 탐색 카드 커버 이미지
- `Venue.latitude/longitude`: 지도 연동
- `PerformanceBand.setlist`: JSONB 셋리스트
- `Notification.referenceId/referenceType`: 다형성 알림
- 각 테이블 인덱스 전략

### 2.2 기획서.md에서 채택한 것
- `Organization.school/region/snsLinks/coverImage`: 대전 지역 플랫폼 특성
- `Band.status` (ACTIVE/HIATUS/DISBANDED): 밴드 활동 상태
- `Performance.startTime/endTime/createdBy`: 공연 시간 및 등록자
- `Venue.operatingHours/rentalFee` (JSON): 구조화된 운영 정보
- `Venue.amenities[]`: 편의시설
- `Reservation.eventType/expectedSize/replyMessage/requestedBy`: 예약 상세

### 2.3 MVP.md에서 유지한 것 (스코프 제한)
- 이메일/비밀번호 인증 (소셜 로그인 Phase 2)
- Organization 계층 구조
- Follow/Bookmark/Donation/TechRider/Portfolio → MVP 제외 유지
- VenueEquipment → MVP 제외 유지
- OrgEvent/EventRsvp → MVP 제외 유지

---

## 3. ERD (텍스트)

```
User ──< BandMember >── Band ──? Organization
 |                       |
 |                       +──< PerformanceBand >── Performance
 |                       |                           |
 |                       +──< Reservation ───────── Venue ──< VenueAvailability
 |                                |
 +──< OrganizationMember >── Organization ──< Announcement
 |
 +──< Notification
 +──< PushSubscription
 +──< Venue (manager)
 +──< Performance (creator)
```

---

## 4. 마이그레이션 영향

### Breaking Changes
- `Reservation.startTime/endTime`: nullable → required
- `Reservation.response` → `replyMessage`로 리네임
- `Venue.operatingHours`: String? → Json?
- `Venue.rentalFee`: String? → Json?
- `Band.inviteCode`: 새 필드 (NOT NULL UNIQUE) → 기존 데이터에 기본값 필요

### 마이그레이션 전략
1. 개발 초기 단계이므로 `prisma migrate reset`으로 클린 마이그레이션 권장
2. 프로덕션 데이터가 있다면 단계적 마이그레이션 필요

---

## 5. 다음 단계

- [ ] `prisma migrate dev` 실행하여 마이그레이션 생성
- [ ] NestJS DTO/Service 코드 스키마 반영
- [ ] Shared 타입 패키지 동기화 (완료)
- [ ] 프론트엔드 API 클라이언트 타입 업데이트
