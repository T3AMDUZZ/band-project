import api from './client';

export async function getPerformances(status?: string) {
  const res = await api.get('/performances', { params: status ? { status } : {} });
  return res.data;
}

export async function getPerformance(id: string) {
  const res = await api.get(`/performances/${id}`);
  return res.data;
}

export async function createPerformance(data: { title: string; date: string; venueId?: string; ticketPrice?: number; description?: string }) {
  const res = await api.post('/performances', data);
  return res.data;
}

export async function updatePerformance(id: string, data: any) {
  const res = await api.patch(`/performances/${id}`, data);
  return res.data;
}

export async function deletePerformance(id: string) {
  const res = await api.delete(`/performances/${id}`);
  return res.data;
}

export async function assignBandToPerformance(performanceId: string, data: { bandId: string; playOrder?: number }) {
  const res = await api.post(`/performances/${performanceId}/bands`, data);
  return res.data;
}

export async function removeBandFromPerformance(performanceId: string, bandId: string) {
  const res = await api.delete(`/performances/${performanceId}/bands/${bandId}`);
  return res.data;
}
