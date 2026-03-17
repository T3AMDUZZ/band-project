import api from './client';

export async function getVenues() {
  const res = await api.get('/venues');
  return res.data;
}

export async function getMyVenues() {
  const res = await api.get('/venues/mine');
  return res.data;
}

export async function getVenue(id: string) {
  const res = await api.get(`/venues/${id}`);
  return res.data;
}

export async function createVenue(data: { name: string; address: string; capacity?: number; operatingHours?: string; rentalFee?: string; description?: string }) {
  const res = await api.post('/venues', data);
  return res.data;
}

export async function updateVenue(id: string, data: any) {
  const res = await api.patch(`/venues/${id}`, data);
  return res.data;
}

export async function deleteVenue(id: string) {
  const res = await api.delete(`/venues/${id}`);
  return res.data;
}

export async function getVenueAvailability(id: string, year: number, month: number) {
  const res = await api.get(`/venues/${id}/availability`, { params: { year, month } });
  return res.data;
}

export async function setVenueAvailability(id: string, data: { date: string; status: string }) {
  const res = await api.post(`/venues/${id}/availability`, data);
  return res.data;
}
