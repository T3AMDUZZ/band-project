import api from './client';

export async function getSentReservations() {
  const res = await api.get('/reservations/sent');
  return res.data;
}

export async function getReceivedReservations() {
  const res = await api.get('/reservations/received');
  return res.data;
}

export async function createReservation(data: { bandId: string; venueId: string; date: string; startTime?: string; endTime?: string; message?: string }) {
  const res = await api.post('/reservations', data);
  return res.data;
}

export async function updateReservationStatus(id: string, data: { status: 'APPROVED' | 'REJECTED'; response?: string }) {
  const res = await api.patch(`/reservations/${id}/status`, data);
  return res.data;
}

export async function cancelReservation(id: string) {
  const res = await api.patch(`/reservations/${id}/cancel`);
  return res.data;
}
