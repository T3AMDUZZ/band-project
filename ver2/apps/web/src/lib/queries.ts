import { createClient } from './supabase';

function getSupabase() {
  return createClient();
}

// 간단한 메모리 캐시 (30초 TTL)
const cache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 30_000;

async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.data;
  const data = await fn();
  cache.set(key, { data, ts: Date.now() });
  return data;
}

export function invalidateCache(prefix?: string) {
  if (!prefix) { cache.clear(); return; }
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
}

// ──────────── Bands ────────────

export async function getBands() {
  return cached('bands:all', async () => {
    const { data, error } = await getSupabase()
      .from('bands')
      .select('*, organization:organizations(id, name)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  });
}

export async function getBandById(id: string) {
  return cached(`bands:${id}`, async () => {
    const { data, error } = await getSupabase()
      .from('bands')
      .select('*, organization:organizations(id, name)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  });
}

export async function getBandMembers(bandId: string) {
  return cached(`band_members:${bandId}`, async () => {
    const { data, error } = await getSupabase()
      .from('band_members')
      .select('*, user:profiles(id, name, nickname, profile_image)')
      .eq('band_id', bandId);
    if (error) throw error;
    return data;
  });
}

export async function joinBandByCode(inviteCode: string) {
  // First find the band
  const { data: band, error: findErr } = await getSupabase()
    .from('bands')
    .select('id')
    .eq('invite_code', inviteCode)
    .single();
  if (findErr) throw new Error('유효하지 않은 초대코드입니다.');

  const { data: { session } } = await getSupabase().auth.getSession();
  if (!session) throw new Error('로그인이 필요합니다.');

  const { error } = await getSupabase().from('band_members').insert({
    band_id: band.id,
    user_id: session.user.id,
    role: 'MEMBER',
    part: '',
  });
  if (error) throw error;
  invalidateCache('bands');
  return band.id;
}

export async function createBand(data: { name: string; genre: string[]; description: string }) {
  const { data: { session } } = await getSupabase().auth.getSession();
  if (!session) throw new Error('로그인이 필요합니다.');

  const inviteCode = Math.random().toString(36).substring(2, 6).toUpperCase() + '-' +
    Math.random().toString(36).substring(2, 6).toUpperCase();

  const { data: band, error } = await getSupabase()
    .from('bands')
    .insert({
      name: data.name,
      genre: data.genre,
      description: data.description,
      status: 'ACTIVE',
      invite_code: inviteCode,
    })
    .select()
    .single();
  if (error) throw error;

  // Add creator as ADMIN
  await getSupabase().from('band_members').insert({
    band_id: band.id,
    user_id: session.user.id,
    role: 'ADMIN',
    part: '',
  });

  invalidateCache('bands');
  return band;
}

// ──────────── Venues ────────────

export async function getVenues() {
  return cached('venues:all', async () => {
    const { data, error } = await getSupabase()
      .from('venues')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  });
}

export async function getVenueById(id: string) {
  return cached(`venues:${id}`, async () => {
    const { data, error } = await getSupabase()
      .from('venues')
      .select('*, manager:profiles(id, name, nickname)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  });
}

export async function getVenueAvailability(venueId: string) {
  return cached(`venue_avail:${venueId}`, async () => {
    const { data, error } = await getSupabase()
      .from('venue_availability')
      .select('*')
      .eq('venue_id', venueId)
      .order('date', { ascending: true });
    if (error) throw error;
    return data;
  });
}

// ──────────── Performances ────────────

export async function getPerformances() {
  return cached('performances:all', async () => {
    const { data, error } = await getSupabase()
      .from('performances')
      .select('*, venue:venues(id, name, address)')
      .order('date', { ascending: true });
    if (error) throw error;
    return data;
  });
}

export async function getPerformanceById(id: string) {
  return cached(`performances:${id}`, async () => {
    const { data, error } = await getSupabase()
      .from('performances')
      .select('*, venue:venues(id, name, address)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  });
}

export async function getPerformanceBands(performanceId: string) {
  return cached(`perf_bands:${performanceId}`, async () => {
    const { data, error } = await getSupabase()
      .from('performance_bands')
      .select('*, band:bands(id, name, profile_image)')
      .eq('performance_id', performanceId)
      .order('play_order', { ascending: true });
    if (error) throw error;
    return data;
  });
}

export async function createPerformance(data: {
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  venue_id: string;
  ticket_price: number;
}) {
  const { data: { session } } = await getSupabase().auth.getSession();
  if (!session) throw new Error('로그인이 필요합니다.');

  const { data: perf, error } = await getSupabase()
    .from('performances')
    .insert({ ...data, created_by: session.user.id, status: 'UPCOMING' })
    .select()
    .single();
  if (error) throw error;
  invalidateCache('performances');
  return perf;
}

// ──────────── Organizations ────────────

export async function getOrganizations() {
  return cached('orgs:all', async () => {
    const { data, error } = await getSupabase()
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  });
}

export async function getOrganizationById(id: string) {
  const { data, error } = await getSupabase()
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getOrgBands(orgId: string) {
  const { data, error } = await getSupabase()
    .from('bands')
    .select('*')
    .eq('organization_id', orgId);
  if (error) throw error;
  return data;
}

export async function getOrgAnnouncements(orgId: string) {
  const { data, error } = await getSupabase()
    .from('announcements')
    .select('*, author:profiles(id, name, nickname)')
    .eq('organization_id', orgId)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createOrganization(data: {
  name: string;
  type: string;
  description: string;
  school: string;
  region: string;
}) {
  const { data: org, error } = await getSupabase()
    .from('organizations')
    .insert(data)
    .select()
    .single();
  if (error) throw error;

  // Add creator as ADMIN
  const { data: { session } } = await getSupabase().auth.getSession();
  if (session) {
    await getSupabase().from('organization_members').insert({
      organization_id: org.id,
      user_id: session.user.id,
      role: 'ADMIN',
    });
  }

  invalidateCache('orgs');
  return org;
}

// ──────────── Reservations ────────────

export async function getMyReservations() {
  const { data: { session } } = await getSupabase().auth.getSession();
  if (!session) return [];

  // Get user's bands
  const { data: memberships } = await getSupabase()
    .from('band_members')
    .select('band_id')
    .eq('user_id', session.user.id);

  const bandIds = memberships?.map((m) => m.band_id) || [];
  if (bandIds.length === 0) return [];

  const { data, error } = await getSupabase()
    .from('reservations')
    .select('*, band:bands(id, name, profile_image), venue:venues(id, name)')
    .in('band_id', bandIds)
    .order('date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createReservation(data: {
  venue_id: string;
  band_id: string;
  date: string;
  start_time: string;
  end_time: string;
  event_type: string;
  expected_size: number | null;
  message: string;
}) {
  const { data: { session } } = await getSupabase().auth.getSession();
  if (!session) throw new Error('로그인이 필요합니다.');

  const { data: profile } = await getSupabase()
    .from('profiles')
    .select('name')
    .eq('id', session.user.id)
    .single();

  const { data: reservation, error } = await getSupabase()
    .from('reservations')
    .insert({
      ...data,
      requested_by: profile?.name || session.user.email,
      status: 'PENDING',
    })
    .select()
    .single();
  if (error) throw error;
  return reservation;
}

export async function getVenueReservations(venueId: string) {
  const { data, error } = await getSupabase()
    .from('reservations')
    .select('*, band:bands(id, name, profile_image)')
    .eq('venue_id', venueId)
    .order('date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateReservationStatus(id: string, status: string, replyMessage?: string) {
  const update: Record<string, unknown> = { status };
  if (replyMessage !== undefined) update.reply_message = replyMessage;

  const { error } = await getSupabase()
    .from('reservations')
    .update(update)
    .eq('id', id);
  if (error) throw error;
}

// ──────────── Schedules ────────────

export async function getSchedules(bandId?: string) {
  let query = getSupabase()
    .from('schedules')
    .select('*, band:bands(id, name)')
    .order('start_at', { ascending: true });

  if (bandId) query = query.eq('band_id', bandId);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createSchedule(data: {
  band_id: string;
  type: string;
  title: string;
  start_at: string;
  end_at: string;
  location?: string;
  memo?: string;
}) {
  const { data: { session } } = await getSupabase().auth.getSession();
  if (!session) throw new Error('로그인이 필요합니다.');

  const { data: schedule, error } = await getSupabase()
    .from('schedules')
    .insert({ ...data, created_by: session.user.id })
    .select('*, band:bands(id, name)')
    .single();
  if (error) throw error;
  return schedule;
}

export async function updateSchedule(id: string, data: {
  type?: string;
  title?: string;
  start_at?: string;
  end_at?: string;
  location?: string;
  memo?: string;
}) {
  const { data: schedule, error } = await getSupabase()
    .from('schedules')
    .update(data)
    .eq('id', id)
    .select('*, band:bands(id, name)')
    .single();
  if (error) throw error;
  return schedule;
}

export async function deleteSchedule(id: string) {
  const { error } = await getSupabase()
    .from('schedules')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ──────────── Profile ────────────

export async function getMyProfile() {
  const { data: { session } } = await getSupabase().auth.getSession();
  if (!session) return null;

  const { data } = await getSupabase()
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  return data;
}

export async function getMyBands() {
  const { data: { session } } = await getSupabase().auth.getSession();
  if (!session) return [];

  const { data } = await getSupabase()
    .from('band_members')
    .select('role, band:bands(id, name, genre, status, profile_image)')
    .eq('user_id', session.user.id);
  return data || [];
}

export async function getMyOrganizations() {
  const { data: { session } } = await getSupabase().auth.getSession();
  if (!session) return [];

  const { data } = await getSupabase()
    .from('organization_members')
    .select('role, organization:organizations(id, name, school, region)')
    .eq('user_id', session.user.id);
  return data || [];
}
