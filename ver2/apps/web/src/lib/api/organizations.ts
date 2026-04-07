import { apiClient } from './client';

export const getAll = () => apiClient.get('/organizations');
export const getById = (id: string) => apiClient.get(`/organizations/${id}`);
export const create = (data: Record<string, unknown>) => apiClient.post('/organizations', data);
export const update = (id: string, data: Record<string, unknown>) => apiClient.patch(`/organizations/${id}`, data);
export const remove = (id: string) => apiClient.delete(`/organizations/${id}`);
export const getMembers = (id: string) => apiClient.get(`/organizations/${id}/members`);
export const getBands = (id: string) => apiClient.get(`/organizations/${id}/bands`);
export const getAnnouncements = (id: string) => apiClient.get(`/organizations/${id}/announcements`);
export const createAnnouncement = (id: string, data: Record<string, unknown>) =>
  apiClient.post(`/organizations/${id}/announcements`, data);
