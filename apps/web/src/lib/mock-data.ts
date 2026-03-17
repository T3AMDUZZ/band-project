// 목(mock) 데이터 - 백엔드 API 연동 시 교체 예정

// ── 내 밴드 ──
export const myBand = {
  id: '1',
  name: '블루밍사운드',
  genre: ['인디록', '얼터너티브'],
  description: '충남대 밴드 동아리 소속',
  profileImage: null,
  members: [
    { name: '김민수', part: '보컬/기타', emoji: '🎸' },
    { name: '이지현', part: '리드기타', emoji: '🎸' },
    { name: '박준호', part: '베이스', emoji: '🎵' },
    { name: '최서연', part: '드럼', emoji: '🥁' },
    { name: '정다은', part: '키보드', emoji: '🎹' },
  ],
};

// ── 다음 공연 (내 밴드) ──
export const myNextShow = {
  id: 'p1',
  title: '충남대 봄맞이 합동 공연',
  venue: '인디카페 봄',
  venueAddress: '대전 유성구 궁동 123',
  date: '2026-03-21',
  time: '18:00',
  coAct: '선셋드라이브',
  ticketPrice: 5000,
};

// ── 내 밴드 공연 히스토리 ──
export const myHistory = [
  { date: '2026-02-14', venue: '인디카페 봄', note: '발렌타인 특별공연' },
  { date: '2026-01-18', venue: '라이브홀 루트', note: '' },
  { date: '2025-12-20', venue: '라이브홀 루트', note: '겨울 합동공연' },
  { date: '2025-11-22', venue: '대전 예술의전당 소극장', note: '어쿠스틱 셋' },
  { date: '2025-10-05', venue: '인디카페 봄', note: '가을맞이 공연' },
];

// ── 다른 밴드 (탐색용) ──
export const otherBands = [
  { id: '2', name: '선셋드라이브', genre: ['얼터너티브', '인디록'], members: 4, cover: 'Creep — Radiohead', bio: '대전 기반 얼터너티브 밴드' },
  { id: '3', name: '미드나잇 크루', genre: ['팝록', '인디팝'], members: 5, cover: 'Champagne Supernova — Oasis', bio: '한밭대 밴드 연합 소속' },
  { id: '4', name: '어쿠스틱 레인', genre: ['어쿠스틱', '포크'], members: 3, cover: 'Pink Moon — Nick Drake', bio: '감성적인 어쿠스틱 사운드' },
  { id: '5', name: '노이즈가든', genre: ['포스트록', '매스록'], members: 4, cover: 'Your Hand in Mine — EITS', bio: '실험적 사운드를 추구하는 밴드' },
  { id: '6', name: '더 스트릿라인', genre: ['개러지록', '펑크'], members: 3, cover: 'Disorder — Joy Division', bio: '소리로 벽을 허무는 3인조' },
  { id: '7', name: '새벽감성', genre: ['로파이', '인디록'], members: 4, cover: 'Loser — Beck', bio: '나른한 새벽의 사운드트랙' },
  { id: '8', name: '보라색 연기', genre: ['사이키델릭', '블루스'], members: 5, cover: 'Purple Haze — Jimi Hendrix', bio: '환각적 사운드스케이프' },
];

// ── 공연장 (색상 포함) ──
export const mockVenues = [
  { id: '1', name: '인디카페 봄', address: '대전 유성구 궁동 123', capacity: 80, rentalFee: '200,000원/일', color: '#F97316' },
  { id: '2', name: '대전 예술의전당 소극장', address: '대전 서구 둔산동 456', capacity: 200, rentalFee: '500,000원/일', color: '#06B6D4' },
  { id: '3', name: '라이브홀 루트', address: '대전 중구 은행동 789', capacity: 120, rentalFee: '300,000원/일', color: '#A855F7' },
  { id: '4', name: '갤러리 이음', address: '대전 유성구 봉명동 321', capacity: 60, rentalFee: '150,000원/일', color: '#EC4899' },
  { id: '5', name: '봉명동 루프탑', address: '대전 유성구 봉명동 555', capacity: 100, rentalFee: '250,000원/일', color: '#22C55E' },
];

// ── 전체 공연 일정 (대전 전체) ──
export const allBookings = [
  { date: '2026-03-15', venueId: '1', band: '더 스트릿라인', time: '19:00' },
  { date: '2026-03-15', venueId: '3', band: '새벽감성', time: '20:00' },
  { date: '2026-03-17', venueId: '2', band: '미드나잇 크루', time: '19:30' },
  { date: '2026-03-20', venueId: '1', band: '노이즈가든', time: '20:00' },
  { date: '2026-03-21', venueId: '1', band: '블루밍사운드', time: '18:00' },
  { date: '2026-03-21', venueId: '4', band: '보라색 연기', time: '19:00' },
  { date: '2026-03-22', venueId: '5', band: '어쿠스틱 레인', time: '18:00' },
  { date: '2026-03-22', venueId: '3', band: '선셋드라이브', time: '20:00' },
  { date: '2026-03-28', venueId: '2', band: '미드나잇 크루', time: '19:00' },
  { date: '2026-03-28', venueId: '1', band: '블루밍사운드', time: '20:00' },
  { date: '2026-03-29', venueId: '3', band: '더 스트릿라인', time: '20:00' },
  { date: '2026-04-03', venueId: '4', band: '미드나잇 크루', time: '19:30' },
  { date: '2026-04-05', venueId: '3', band: '블루밍사운드', time: '17:00' },
  { date: '2026-04-05', venueId: '5', band: '새벽감성', time: '19:00' },
  { date: '2026-04-10', venueId: '2', band: '노이즈가든', time: '19:00' },
  { date: '2026-04-12', venueId: '1', band: '보라색 연기', time: '20:00' },
];

// ── 기존 호환 데이터 ──
export const mockPerformances = [
  {
    id: '1',
    title: '충남대 봄맞이 합동 공연',
    date: '2026-03-21T18:00:00',
    venue: { name: '인디카페 봄', address: '대전 유성구' },
    bands: [
      { id: '1', name: '블루밍사운드', genre: ['인디록'] },
      { id: '2', name: '선셋드라이브', genre: ['얼터너티브'] },
    ],
    ticketPrice: 5000,
    posterImage: null,
    status: 'UPCOMING' as const,
  },
  {
    id: '2',
    title: '한밭대 밴드 정기공연',
    date: '2026-03-28T19:00:00',
    venue: { name: '대전 예술의전당 소극장', address: '대전 서구' },
    bands: [
      { id: '3', name: '미드나잇 크루', genre: ['팝록'] },
      { id: '4', name: '어쿠스틱 레인', genre: ['어쿠스틱'] },
      { id: '5', name: '노이즈가든', genre: ['포스트록'] },
    ],
    ticketPrice: 3000,
    posterImage: null,
    status: 'UPCOMING' as const,
  },
  {
    id: '3',
    title: '대전 인디 연합 쇼케이스',
    date: '2026-04-05T17:00:00',
    venue: { name: '라이브홀 루트', address: '대전 중구' },
    bands: [
      { id: '6', name: '더 스트릿라인', genre: ['개러지록'] },
      { id: '1', name: '블루밍사운드', genre: ['인디록'] },
    ],
    ticketPrice: 8000,
    posterImage: null,
    status: 'UPCOMING' as const,
  },
  {
    id: '4',
    title: '2025 겨울 합동 공연',
    date: '2025-12-20T18:00:00',
    venue: { name: '라이브홀 루트', address: '대전 중구' },
    bands: [
      { id: '2', name: '선셋드라이브', genre: ['얼터너티브'] },
      { id: '5', name: '노이즈가든', genre: ['포스트록'] },
    ],
    ticketPrice: 5000,
    posterImage: null,
    status: 'COMPLETED' as const,
  },
];

export const mockBands = [
  { id: '1', name: '블루밍사운드', genre: ['인디록'], description: '충남대 밴드 동아리 소속', profileImage: null, memberCount: 5 },
  { id: '2', name: '선셋드라이브', genre: ['얼터너티브'], description: '대전 기반 얼터너티브 밴드', profileImage: null, memberCount: 4 },
  { id: '3', name: '미드나잇 크루', genre: ['팝록'], description: '한밭대 밴드 연합 소속', profileImage: null, memberCount: 5 },
  { id: '4', name: '어쿠스틱 레인', genre: ['어쿠스틱', '포크'], description: '감성적인 어쿠스틱 사운드', profileImage: null, memberCount: 3 },
  { id: '5', name: '노이즈가든', genre: ['포스트록'], description: '실험적 사운드를 추구하는 밴드', profileImage: null, memberCount: 4 },
];

export const mockOrganizations = [
  { id: '1', name: '충남대 록앤롤 동아리', type: 'UNIVERSITY_CLUB', bandCount: 6, memberCount: 35 },
  { id: '2', name: '한밭대 밴드 연합', type: 'BAND_UNION', bandCount: 4, memberCount: 22 },
  { id: '3', name: '대전 인디 연합', type: 'INDIE_COLLECTIVE', bandCount: 8, memberCount: 40 },
];
