// ──────────── Types ────────────

export type BandStatus = 'ACTIVE' | 'HIATUS' | 'DISBANDED';
export type ReservationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type AvailabilityStatus = 'AVAILABLE' | 'BOOKED' | 'BLOCKED';
export type PerformanceStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
export type OrgType = 'UNIVERSITY_CLUB' | 'BAND_UNION' | 'INDIE_COLLECTIVE' | 'PLANNING_TEAM' | 'OTHER';
export type MemberRole = 'ADMIN' | 'MEMBER';

export interface User {
  id: string;
  email: string;
  name: string;
  nickname: string;
  profileImage: string | null;
  bio: string | null;
}

export interface Band {
  id: string;
  name: string;
  genre: string[];
  description: string;
  profileImage: string | null;
  coverImage: string | null;
  status: BandStatus;
  inviteCode: string;
  snsLinks: Record<string, string>;
  organizationId: string | null;
  organization?: { id: string; name: string };
  members?: BandMember[];
}

export interface BandMember {
  id: string;
  userId: string;
  bandId: string;
  role: MemberRole;
  part: string;
  user: Pick<User, 'id' | 'name' | 'nickname' | 'profileImage'>;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number;
  photos: string[];
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  amenities: string[];
  operatingHours: Record<string, string>;
  rentalFee: Record<string, number>;
  managerId: string | null;
  manager?: Pick<User, 'id' | 'name' | 'nickname'>;
}

export interface VenueAvailability {
  id: string;
  venueId: string;
  date: string;
  status: AvailabilityStatus;
  note: string | null;
}

export interface Performance {
  id: string;
  title: string;
  description: string | null;
  date: string;
  startTime: string;
  endTime: string;
  venueId: string;
  venue?: Pick<Venue, 'id' | 'name' | 'address'>;
  ticketPrice: number;
  posterImage: string | null;
  status: PerformanceStatus;
  bands?: PerformanceBand[];
}

export interface PerformanceBand {
  performanceId: string;
  bandId: string;
  playOrder: number;
  setlist: string[];
  band: Pick<Band, 'id' | 'name' | 'profileImage'>;
}

export interface Organization {
  id: string;
  name: string;
  type: OrgType;
  description: string | null;
  profileImage: string | null;
  coverImage: string | null;
  school: string | null;
  region: string | null;
  snsLinks: Record<string, string>;
}

export interface Announcement {
  id: string;
  organizationId: string;
  authorId: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  author?: Pick<User, 'id' | 'name' | 'nickname'>;
}

export interface Reservation {
  id: string;
  bandId: string;
  venueId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  message: string | null;
  replyMessage: string | null;
  eventType: string;
  expectedSize: number | null;
  requestedBy: string | null;
  band?: Pick<Band, 'id' | 'name' | 'profileImage'>;
  venue?: Pick<Venue, 'id' | 'name'>;
}

export type ScheduleType = 'REHEARSAL' | 'PERFORMANCE' | 'MEETING' | 'OTHER';

export interface Schedule {
  id: string;
  bandId: string;
  title: string;
  type: ScheduleType;
  date: string;
  startTime: string;
  endTime: string;
  location: string | null;
  description: string | null;
  band?: Pick<Band, 'id' | 'name'>;
}

// ──────────── Mock Data ────────────

export const mockUser: User = {
  id: '1',
  email: 'hong@example.com',
  name: '홍길동',
  nickname: '길동이',
  profileImage: null,
  bio: '기타 치는 대학생입니다',
};

export const mockBands: Band[] = [
  {
    id: '1',
    name: 'The Wavelength',
    genre: ['Indie Rock', 'Post-Punk'],
    description: '대전 인디씬의 새로운 물결. 2024년 결성, 감성적인 기타 사운드와 시적인 가사를 추구합니다.',
    profileImage: null,
    coverImage: null,
    status: 'ACTIVE',
    inviteCode: 'WAVE-2024',
    snsLinks: { instagram: 'https://instagram.com/wavelength', youtube: 'https://youtube.com/@wavelength' },
    organizationId: '1',
    organization: { id: '1', name: '충남대 밴드동아리 소울' },
    members: [
      { id: '1', userId: '1', bandId: '1', role: 'ADMIN', part: 'Guitar / Vocal', user: { id: '1', name: '홍길동', nickname: '길동이', profileImage: null } },
      { id: '2', userId: '2', bandId: '1', role: 'MEMBER', part: 'Bass', user: { id: '2', name: '김철수', nickname: '철수', profileImage: null } },
      { id: '3', userId: '3', bandId: '1', role: 'MEMBER', part: 'Drums', user: { id: '3', name: '이영희', nickname: '영희', profileImage: null } },
      { id: '4', userId: '4', bandId: '1', role: 'MEMBER', part: 'Keyboard', user: { id: '4', name: '박민수', nickname: '민수', profileImage: null } },
    ],
  },
  {
    id: '2',
    name: 'Midnight Echo',
    genre: ['Shoegaze', 'Dream Pop'],
    description: '몽환적인 사운드스케이프를 만드는 슈게이즈 밴드',
    profileImage: null,
    coverImage: null,
    status: 'ACTIVE',
    inviteCode: 'MDNT-ECHO',
    snsLinks: { instagram: 'https://instagram.com/midnightecho' },
    organizationId: '1',
    organization: { id: '1', name: '충남대 밴드동아리 소울' },
  },
  {
    id: '3',
    name: 'Rust & Bloom',
    genre: ['Folk', 'Acoustic'],
    description: '어쿠스틱 기반의 따뜻한 포크 사운드',
    profileImage: null,
    coverImage: null,
    status: 'ACTIVE',
    inviteCode: 'RUST-BLOOM',
    snsLinks: {},
    organizationId: '2',
    organization: { id: '2', name: 'KAIST 락밴드부' },
  },
  {
    id: '4',
    name: 'Neon Pulse',
    genre: ['Synth Pop', 'Electronic'],
    description: '신스 사운드와 일렉트로닉 비트의 퓨전',
    profileImage: null,
    coverImage: null,
    status: 'HIATUS',
    inviteCode: 'NEON-PULS',
    snsLinks: { soundcloud: 'https://soundcloud.com/neonpulse' },
    organizationId: null,
  },
  {
    id: '5',
    name: 'Black Horizon',
    genre: ['Metal', 'Hardcore'],
    description: '대전 하드코어 씬의 중심',
    profileImage: null,
    coverImage: null,
    status: 'DISBANDED',
    inviteCode: 'BLCK-HRZN',
    snsLinks: {},
    organizationId: null,
  },
  {
    id: '6',
    name: 'Velvet Haze',
    genre: ['Jazz', 'Neo-Soul'],
    description: '재즈와 네오소울을 결합한 그루비한 사운드',
    profileImage: null,
    coverImage: null,
    status: 'ACTIVE',
    inviteCode: 'VLVT-HAZE',
    snsLinks: { instagram: 'https://instagram.com/velvethaze' },
    organizationId: '1',
    organization: { id: '1', name: '충남대 밴드동아리 소울' },
  },
];

export const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'Studio MU',
    address: '대전 유성구 궁동 123-4',
    capacity: 80,
    photos: [],
    description: '대전 유성구의 라이브 전문 공연장. 뮤지션 친화적인 환경과 최신 음향 장비를 갖추고 있습니다.',
    latitude: 36.362,
    longitude: 127.356,
    phone: '042-123-4567',
    amenities: ['주차', '음향장비', '조명', '대기실', 'Wi-Fi'],
    operatingHours: {
      월: '18:00 - 24:00',
      화: '18:00 - 24:00',
      수: '18:00 - 24:00',
      목: '18:00 - 24:00',
      금: '17:00 - 02:00',
      토: '14:00 - 02:00',
      일: '14:00 - 22:00',
    },
    rentalFee: { 평일: 200000, 주말: 300000, 공휴일: 350000 },
    managerId: '10',
    manager: { id: '10', name: '최관리', nickname: '스튜디오장' },
  },
  {
    id: '2',
    name: 'Vinyl Underground',
    address: '대전 중구 대흥동 456-7',
    capacity: 120,
    photos: [],
    description: '지하 공간의 특유의 분위기를 자랑하는 인디 뮤직 성지',
    latitude: 36.328,
    longitude: 127.427,
    phone: '042-234-5678',
    amenities: ['음향장비', '조명', '바', '대기실'],
    operatingHours: {
      월: '휴무',
      화: '19:00 - 01:00',
      수: '19:00 - 01:00',
      목: '19:00 - 01:00',
      금: '19:00 - 03:00',
      토: '16:00 - 03:00',
      일: '16:00 - 23:00',
    },
    rentalFee: { 평일: 250000, 주말: 400000 },
    managerId: null,
  },
  {
    id: '3',
    name: '둔산 아트홀',
    address: '대전 서구 둔산동 789-1',
    capacity: 250,
    photos: [],
    description: '중대형 규모의 복합 문화공간. 밴드 공연부터 어쿠스틱 콘서트까지.',
    latitude: 36.351,
    longitude: 127.378,
    phone: '042-345-6789',
    amenities: ['주차', '음향장비', '조명', '대기실', '분장실', '엘리베이터'],
    operatingHours: {
      월: '10:00 - 22:00',
      화: '10:00 - 22:00',
      수: '10:00 - 22:00',
      목: '10:00 - 22:00',
      금: '10:00 - 22:00',
      토: '10:00 - 22:00',
      일: '10:00 - 18:00',
    },
    rentalFee: { 평일: 500000, 주말: 700000, 공휴일: 700000 },
    managerId: null,
  },
];

export const mockPerformances: Performance[] = [
  {
    id: '1',
    title: '봄맞이 인디 페스티벌',
    description: '대전 인디씬의 봄을 여는 축제! 6팀의 밴드가 함께합니다.',
    date: '2026-04-20',
    startTime: '18:00',
    endTime: '22:00',
    venueId: '2',
    venue: { id: '2', name: 'Vinyl Underground', address: '대전 중구 대흥동 456-7' },
    ticketPrice: 15000,
    posterImage: null,
    status: 'UPCOMING',
    bands: [
      { performanceId: '1', bandId: '1', playOrder: 1, setlist: ['Wave', 'Echoes', 'Midnight Sun'], band: { id: '1', name: 'The Wavelength', profileImage: null } },
      { performanceId: '1', bandId: '2', playOrder: 2, setlist: ['Haze', 'Dreamscape'], band: { id: '2', name: 'Midnight Echo', profileImage: null } },
      { performanceId: '1', bandId: '6', playOrder: 3, setlist: ['Groove City', 'Satin'], band: { id: '6', name: 'Velvet Haze', profileImage: null } },
    ],
  },
  {
    id: '2',
    title: '충남대 밴드동아리 정기공연',
    description: '소울 동아리 2026 상반기 정기공연',
    date: '2026-05-10',
    startTime: '19:00',
    endTime: '21:30',
    venueId: '3',
    venue: { id: '3', name: '둔산 아트홀', address: '대전 서구 둔산동 789-1' },
    ticketPrice: 0,
    posterImage: null,
    status: 'UPCOMING',
    bands: [
      { performanceId: '2', bandId: '1', playOrder: 1, setlist: ['New Dawn', 'Rising'], band: { id: '1', name: 'The Wavelength', profileImage: null } },
      { performanceId: '2', bandId: '2', playOrder: 2, setlist: ['Into the Void', 'Luna'], band: { id: '2', name: 'Midnight Echo', profileImage: null } },
    ],
  },
  {
    id: '3',
    title: 'Studio MU 금요 라이브',
    description: '매주 금요일 Studio MU에서 열리는 소규모 라이브',
    date: '2026-04-11',
    startTime: '20:00',
    endTime: '22:00',
    venueId: '1',
    venue: { id: '1', name: 'Studio MU', address: '대전 유성구 궁동 123-4' },
    ticketPrice: 10000,
    posterImage: null,
    status: 'UPCOMING',
    bands: [
      { performanceId: '3', bandId: '3', playOrder: 1, setlist: ['Wildflower', 'Road'], band: { id: '3', name: 'Rust & Bloom', profileImage: null } },
    ],
  },
  {
    id: '4',
    title: '대전 메탈 나이트',
    description: '하드코어/메탈 밴드 합동 공연',
    date: '2026-03-15',
    startTime: '19:00',
    endTime: '23:00',
    venueId: '2',
    venue: { id: '2', name: 'Vinyl Underground', address: '대전 중구 대흥동 456-7' },
    ticketPrice: 12000,
    posterImage: null,
    status: 'COMPLETED',
  },
];

export const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: '충남대 밴드동아리 소울',
    type: 'UNIVERSITY_CLUB',
    description: '충남대학교 중앙 밴드동아리. 1995년 창단, 매 학기 정기공연과 다양한 행사를 진행합니다.',
    profileImage: null,
    coverImage: null,
    school: '충남대학교',
    region: '대전',
    snsLinks: { instagram: 'https://instagram.com/cnu_soul' },
  },
  {
    id: '2',
    name: 'KAIST 락밴드부',
    type: 'UNIVERSITY_CLUB',
    description: 'KAIST 학부생 락밴드 동아리',
    profileImage: null,
    coverImage: null,
    school: 'KAIST',
    region: '대전',
    snsLinks: {},
  },
  {
    id: '3',
    name: '대전 인디 커뮤니티',
    type: 'INDIE_COLLECTIVE',
    description: '대전 지역 인디 뮤지션들의 자발적 커뮤니티',
    profileImage: null,
    coverImage: null,
    school: null,
    region: '대전',
    snsLinks: { instagram: 'https://instagram.com/dj_indie' },
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    organizationId: '1',
    authorId: '1',
    title: '2026 신입부원 모집 안내',
    content: '안녕하세요! 소울 2026 상반기 신입부원을 모집합니다. 장르 무관, 열정만 있으면 OK!',
    isPinned: true,
    createdAt: '2026-03-01T09:00:00Z',
    author: { id: '1', name: '홍길동', nickname: '길동이' },
  },
  {
    id: '2',
    organizationId: '1',
    authorId: '1',
    title: '정기공연 안내 (5/10)',
    content: '2026 상반기 정기공연이 5월 10일 둔산 아트홀에서 열립니다.',
    isPinned: false,
    createdAt: '2026-03-20T14:00:00Z',
    author: { id: '1', name: '홍길동', nickname: '길동이' },
  },
  {
    id: '3',
    organizationId: '1',
    authorId: '2',
    title: '합주실 이용 안내',
    content: '합주실 예약은 소울 카카오톡 단톡방에서 신청해주세요.',
    isPinned: false,
    createdAt: '2026-03-15T10:00:00Z',
    author: { id: '2', name: '김철수', nickname: '철수' },
  },
];

export const mockReservations: Reservation[] = [
  {
    id: '1',
    bandId: '1',
    venueId: '1',
    date: '2026-04-15',
    startTime: '14:00',
    endTime: '18:00',
    status: 'PENDING',
    message: '정기공연 리허설 예약입니다.',
    replyMessage: null,
    eventType: '합주',
    expectedSize: 8,
    requestedBy: '홍길동',
    band: { id: '1', name: 'The Wavelength', profileImage: null },
    venue: { id: '1', name: 'Studio MU' },
  },
  {
    id: '2',
    bandId: '1',
    venueId: '2',
    date: '2026-04-20',
    startTime: '17:00',
    endTime: '22:00',
    status: 'APPROVED',
    message: '봄맞이 인디 페스티벌 공연입니다.',
    replyMessage: '확인했습니다. 사운드체크 16시부터 가능합니다.',
    eventType: '공연',
    expectedSize: 100,
    requestedBy: '홍길동',
    band: { id: '1', name: 'The Wavelength', profileImage: null },
    venue: { id: '2', name: 'Vinyl Underground' },
  },
];

export const mockSchedules: Schedule[] = [
  {
    id: '1',
    bandId: '1',
    title: '정기공연 합주',
    type: 'REHEARSAL',
    date: '2026-04-08',
    startTime: '19:00',
    endTime: '22:00',
    location: 'Studio MU 합주실 B',
    description: '정기공연 셋리스트 연습. 곡 순서 확정 필요.',
    band: { id: '1', name: 'The Wavelength' },
  },
  {
    id: '2',
    bandId: '1',
    title: '봄맞이 인디 페스티벌 리허설',
    type: 'REHEARSAL',
    date: '2026-04-18',
    startTime: '14:00',
    endTime: '17:00',
    location: 'Vinyl Underground',
    description: '페스티벌 전 최종 리허설. 사운드체크 포함.',
    band: { id: '1', name: 'The Wavelength' },
  },
  {
    id: '3',
    bandId: '1',
    title: '봄맞이 인디 페스티벌',
    type: 'PERFORMANCE',
    date: '2026-04-20',
    startTime: '18:00',
    endTime: '22:00',
    location: 'Vinyl Underground',
    description: null,
    band: { id: '1', name: 'The Wavelength' },
  },
  {
    id: '4',
    bandId: '1',
    title: '밴드 미팅',
    type: 'MEETING',
    date: '2026-04-12',
    startTime: '15:00',
    endTime: '16:00',
    location: '충남대 학생회관 3층',
    description: '상반기 활동 계획 회의',
    band: { id: '1', name: 'The Wavelength' },
  },
  {
    id: '5',
    bandId: '1',
    title: '주간 합주',
    type: 'REHEARSAL',
    date: '2026-04-15',
    startTime: '19:00',
    endTime: '21:00',
    location: 'Studio MU 합주실 B',
    description: null,
    band: { id: '1', name: 'The Wavelength' },
  },
  {
    id: '6',
    bandId: '1',
    title: '충남대 정기공연',
    type: 'PERFORMANCE',
    date: '2026-05-10',
    startTime: '19:00',
    endTime: '21:30',
    location: '둔산 아트홀',
    description: '소울 동아리 2026 상반기 정기공연',
    band: { id: '1', name: 'The Wavelength' },
  },
];

export const mockVenueAvailability: VenueAvailability[] = (() => {
  const items: VenueAvailability[] = [];
  const year = 2026;
  const month = 3; // April (0-indexed)
  for (let day = 1; day <= 30; day++) {
    const d = new Date(year, month, day);
    const dayOfWeek = d.getDay();
    let status: AvailabilityStatus = 'AVAILABLE';
    if (dayOfWeek === 1) status = 'BLOCKED'; // 월요일 휴무
    if ([5, 12, 20, 25].includes(day)) status = 'BOOKED';
    items.push({
      id: `avail-${day}`,
      venueId: '1',
      date: `2026-04-${String(day).padStart(2, '0')}`,
      status,
      note: status === 'BLOCKED' ? '정기 휴무' : null,
    });
  }
  return items;
})();
