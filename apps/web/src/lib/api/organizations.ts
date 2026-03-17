import api from './client';

export async function getOrganizations(type?: string) {
  const res = await api.get('/organizations', { params: type ? { type } : {} });
  return res.data;
}

export async function getOrganization(id: string) {
  const res = await api.get(`/organizations/${id}`);
  return res.data;
}

export async function createOrganization(data: { name: string; type: string; description?: string }) {
  const res = await api.post('/organizations', data);
  return res.data;
}

export async function updateOrganization(id: string, data: any) {
  const res = await api.patch(`/organizations/${id}`, data);
  return res.data;
}

export async function deleteOrganization(id: string) {
  const res = await api.delete(`/organizations/${id}`);
  return res.data;
}

export async function addOrgMember(orgId: string, data: { userId: string; role?: string }) {
  const res = await api.post(`/organizations/${orgId}/members`, data);
  return res.data;
}

export async function removeOrgMember(orgId: string, userId: string) {
  const res = await api.delete(`/organizations/${orgId}/members/${userId}`);
  return res.data;
}

export async function getAnnouncements(orgId: string) {
  const res = await api.get(`/organizations/${orgId}/announcements`);
  return res.data;
}

export async function createAnnouncement(orgId: string, data: { title: string; content: string }) {
  const res = await api.post(`/organizations/${orgId}/announcements`, data);
  return res.data;
}
