import api from './client';

export async function getBands(search?: string) {
  const res = await api.get('/bands', { params: search ? { search } : {} });
  return res.data;
}

export async function getMyBands() {
  const res = await api.get('/bands/mine');
  return res.data;
}

export async function getBand(id: string) {
  const res = await api.get(`/bands/${id}`);
  return res.data;
}

export async function createBand(data: { name: string; genre: string[]; description?: string; snsLinks?: any; organizationId?: string }) {
  const res = await api.post('/bands', data);
  return res.data;
}

export async function updateBand(id: string, data: any) {
  const res = await api.patch(`/bands/${id}`, data);
  return res.data;
}

export async function deleteBand(id: string) {
  const res = await api.delete(`/bands/${id}`);
  return res.data;
}

export async function addBandMember(bandId: string, data: { userId: string; part?: string; role?: string }) {
  const res = await api.post(`/bands/${bandId}/members`, data);
  return res.data;
}

export async function removeBandMember(bandId: string, userId: string) {
  const res = await api.delete(`/bands/${bandId}/members/${userId}`);
  return res.data;
}
