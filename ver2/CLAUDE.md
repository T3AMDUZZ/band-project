# We Are Live - ver2 프로젝트

## 프로젝트 개요
대전 밴드 생태계 통합 플랫폼 "We Are Live"의 ver2 리빌드.
ver1 코드는 상위 디렉토리(`../apps/`, `../packages/`)에 참고용으로 존재.

## 기술 스택
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend:** NestJS 10, Prisma 5, PostgreSQL 16
- **Monorepo:** pnpm workspace + Turborepo
- **상태관리:** TanStack React Query v5
- **HTTP:** Axios + JWT 인터셉터

## 디자인 시스템
- 다크 테마: 배경 `#0C0A09`, 카드 `#1C1917`, 엘리베이트 `#292524`
- 액센트: `#F59E0B` (앰버), 호버 `#F97316` (오렌지)
- 폰트: Bebas Neue (브랜딩), Noto Sans KR (본문), Space Mono (데이터)

## 문서
- `docs/MVP.md` — MVP 정의서 (기능 범위, API 명세)
- `docs/DB_schema.md` — DB 스키마 문서
- `docs/기획서.md` — 프로젝트 기획서

---

# 에이전트 팀 운영 규칙

## 팀 구성
| 역할 | 터미널 | 담당 |
|------|--------|------|
| **팀 리더** | 터미널 1 | 아키텍처 설계, 백엔드 개발, 태스크 분배, 코드 리뷰 |
| **프론트엔드 개발자/디자이너** | 터미널 2 | UI/UX 설계, 프론트엔드 구현, 컴포넌트 개발, 스타일링 |

## 협업 프로토콜

### 1. 작업 현황 공유
- `TEAM_BOARD.md` 파일로 작업 상태를 공유한다
- 작업 시작 전 보드를 읽고, 작업 완료 후 보드를 업데이트한다
- 충돌 방지를 위해 자기 섹션만 수정한다

### 2. 파일 소유권
- **프론트엔드 에이전트 영역:** `apps/web/` 전체 (컴포넌트, 페이지, 스타일, 프론트 API 클라이언트)
- **팀 리더 영역:** `apps/api/`, `packages/shared/`, `prisma/`, 인프라 설정
- **공유 영역:** `docs/`, `CLAUDE.md`, `TEAM_BOARD.md`, `package.json`, `turbo.json`
- 상대 영역 파일은 **읽기만** 가능, 수정 시 보드에 요청을 남긴다

### 3. 커뮤니케이션
- 상대에게 전달할 내용은 `TEAM_BOARD.md`의 메시지 섹션에 작성
- API 스펙 변경, 타입 변경 등은 반드시 보드에 공지
- 블로커가 있으면 보드에 `[BLOCKED]` 태그로 표시

### 4. Git 컨벤션
- 브랜치: `feat/`, `fix/`, `refactor/` 접두사 사용
- 커밋: 한글 허용, 변경 내용 명확히 기술
- 충돌 시 사용자(중간리더)에게 보고
