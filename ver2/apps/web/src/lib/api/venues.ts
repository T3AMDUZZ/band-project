import { apiClient } from './client';

export const getAll = () => apiClient.get('/venues');
export const getById = (id: string) => apiClient.get(`/venues/${id}`);
export const create = (data: Record<string, unknown>) => apiClient.post('/venues', data);
export const update = (id: string, data: Record<string, unknown>) => apiClient.patch(`/venues/${id}`, data);
export const remove = (id: string) => apiClient.delete(`/venues/${id}`);
export const getAvailability = (id: string, month?: string) =>
  apiClient.get(`/venues/${id}/availability`, { params: { month } });
