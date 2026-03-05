// 목(mock) 데이터 - 백엔드 API 연동 시 교체 예정

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

export const mockVenues = [
  { id: '1', name: '인디카페 봄', address: '대전 유성구 궁동 123', capacity: 80, rentalFee: '200,000원/일' },
  { id: '2', name: '대전 예술의전당 소극장', address: '대전 서구 둔산동 456', capacity: 200, rentalFee: '500,000원/일' },
  { id: '3', name: '라이브홀 루트', address: '대전 중구 은행동 789', capacity: 120, rentalFee: '300,000원/일' },
];

export const mockOrganizations = [
  { id: '1', name: '충남대 록앤롤 동아리', type: 'UNIVERSITY_CLUB', bandCount: 6, memberCount: 35 },
  { id: '2', name: '한밭대 밴드 연합', type: 'BAND_UNION', bandCount: 4, memberCount: 22 },
  { id: '3', name: '대전 인디 연합', type: 'INDIE_COLLECTIVE', bandCount: 8, memberCount: 40 },
];
