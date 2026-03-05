// 사용자
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  nickname: string;
  profileImage: string | null;
  createdAt: string;
}

// 조직
export type OrganizationType = 'UNIVERSITY_CLUB' | 'BAND_UNION' | 'INDIE_COLLECTIVE' | 'PLANNING_TEAM' | 'OTHER';
export type OrgMemberRole = 'ADMIN' | 'MEMBER';

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  description: string | null;
  profileImage: string | null;
  createdAt: string;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: OrgMemberRole;
  joinedAt: string;
  user?: UserProfile;
}

export interface Announcement {
  id: string;
  organizationId: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: string;
}

// 밴드
export type BandMemberRole = 'ADMIN' | 'MEMBER';

export interface Band {
  id: string;
  name: string;
  genre: string[];
  description: string | null;
  profileImage: string | null;
  snsLinks: Record<string, string> | null;
  organizationId: string | null;
  createdAt: string;
}

export interface BandMember {
  id: string;
  bandId: string;
  userId: string;
  role: BandMemberRole;
  part: string | null;
  joinedAt: string;
  user?: UserProfile;
}

// 공연
export type PerformanceStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

export interface Performance {
  id: string;
  title: string;
  description: string | null;
  date: string;
  venueId: string | null;
  ticketPrice: number | null;
  posterImage: string | null;
  status: PerformanceStatus;
  createdAt: string;
  venue?: Venue;
  bands?: PerformanceBandEntry[];
}

export interface PerformanceBandEntry {
  id: string;
  performanceId: string;
  bandId: string;
  playOrder: number | null;
  band?: Band;
}

// 공연장
export type AvailabilityStatus = 'AVAILABLE' | 'BOOKED' | 'BLOCKED';

export interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number | null;
  operatingHours: string | null;
  rentalFee: string | null;
  description: string | null;
  photos: string[];
  managerId: string;
  createdAt: string;
}

export interface VenueAvailability {
  id: string;
  venueId: string;
  date: string;
  status: AvailabilityStatus;
}

// 예약
export type ReservationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface Reservation {
  id: string;
  bandId: string;
  venueId: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  status: ReservationStatus;
  message: string | null;
  response: string | null;
  createdAt: string;
  band?: Band;
  venue?: Venue;
}

// 인증
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  nickname: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserProfile;
}
