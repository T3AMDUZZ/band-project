import { apiClient } from './client';

export const getAll = () => apiClient.get('/bands');
export const getById = (id: string) => apiClient.get(`/bands/${id}`);
export const create = (data: Record<string, unknown>) => apiClient.post('/bands', data);
export const update = (id: string, data: Record<string, unknown>) => apiClient.patch(`/bands/${id}`, data);
export const remove = (id: string) => apiClient.delete(`/bands/${id}`);
export const getMembers = (id: string) => apiClient.get(`/bands/${id}/members`);
export const inviteMember = (id: string, userId: string) => apiClient.post(`/bands/${id}/members/invite`, { userId });
export const joinByCode = (inviteCode: string) => apiClient.post('/bands/join', { inviteCode });
export const getPerformances = (id: string) => apiClient.get(`/bands/${id}/performances`);
