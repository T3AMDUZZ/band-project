// ============================================
// 사용자
// ============================================

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  nickname: string;
  profileImage: string | null;
  bio: string | null;
  createdAt: string;
}

// ============================================
// 조직 (동아리/연합)
// ============================================

export type OrganizationType = 'UNIVERSITY_CLUB' | 'BAND_UNION' | 'INDIE_COLLECTIVE' | 'PLANNING_TEAM' | 'OTHER';
export type OrgMemberRole = 'ADMIN' | 'MEMBER';

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  description: string | null;
  profileImage: string | null;
  coverImage: string | null;
  school: string | null;
  region: string | null;
  snsLinks: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
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
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// 밴드
// ============================================

export type BandMemberRole = 'ADMIN' | 'MEMBER';
export type BandStatus = 'ACTIVE' | 'HIATUS' | 'DISBANDED';

export interface Band {
  id: string;
  name: string;
  genre: string[];
  description: string | null;
  profileImage: string | null;
  coverImage: string | null;
  snsLinks: Record<string, string> | null;
  status: BandStatus;
  inviteCode: string;
  organizationId: string | null;
  createdAt: string;
  updatedAt: string;
  organization?: Organization;
  members?: BandMember[];
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

// ============================================
// 공연
// ============================================

export type PerformanceStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

export interface Performance {
  id: string;
  title: string;
  description: string | null;
  date: string;
  startTime: string | null;
  endTime: string | null;
  venueId: string | null;
  ticketPrice: number | null;
  posterImage: string | null;
  status: PerformanceStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  venue?: Venue;
  bands?: PerformanceBandEntry[];
  creator?: UserProfile;
}

export interface PerformanceBandEntry {
  id: string;
  performanceId: string;
  bandId: string;
  playOrder: number;
  setlist: SetlistItem[] | null;
  band?: Band;
}

export interface SetlistItem {
  order: number;
  song: string;
}

// ============================================
// 공연장
// ============================================

export type AvailabilityStatus = 'AVAILABLE' | 'BOOKED' | 'BLOCKED';

export interface Venue {
  id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  capacity: number | null;
  operatingHours: Record<string, string> | null;
  rentalFee: Record<string, number> | null;
  description: string | null;
  photos: string[];
  amenities: string[];
  managerId: string;
  createdAt: string;
  updatedAt: string;
  manager?: UserProfile;
}

export interface VenueAvailability {
  id: string;
  venueId: string;
  date: string;
  status: AvailabilityStatus;
  note: string | null;
}

// ============================================
// 예약
// ============================================

export type ReservationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface Reservation {
  id: string;
  bandId: string;
  venueId: string;
  requestedBy: string;
  date: string;
  startTime: string;
  endTime: string;
  eventType: string;
  expectedSize: number | null;
  message: string | null;
  replyMessage: string | null;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
  band?: Band;
  venue?: Venue;
}

// ============================================
// 알림
// ============================================

export type NotificationType =
  | 'RESERVATION_APPROVED'
  | 'RESERVATION_REJECTED'
  | 'RESERVATION_REQUESTED'
  | 'VENUE_ANNOUNCEMENT'
  | 'SHOW_REMINDER'
  | 'ORG_ANNOUNCEMENT';

export interface Notification {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  body: string | null;
  referenceId: string | null;
  referenceType: string | null;
  reservationId: string | null;
  isRead: boolean;
  createdAt: string;
}

// ============================================
// 인증
// ============================================

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
