import { apiClient } from './client';

export const getAll = () => apiClient.get('/performances');
export const getById = (id: string) => apiClient.get(`/performances/${id}`);
export const create = (data: Record<string, unknown>) => apiClient.post('/performances', data);
export const update = (id: string, data: Record<string, unknown>) => apiClient.patch(`/performances/${id}`, data);
export const remove = (id: string) => apiClient.delete(`/performances/${id}`);
