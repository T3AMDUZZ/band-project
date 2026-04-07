import { apiClient } from './client';

export const getAll = () => apiClient.get('/reservations');
export const getById = (id: string) => apiClient.get(`/reservations/${id}`);
export const create = (data: Record<string, unknown>) => apiClient.post('/reservations', data);
export const updateStatus = (id: string, status: string, replyMessage?: string) =>
  apiClient.patch(`/reservations/${id}/status`, { status, replyMessage });
export const cancel = (id: string) => apiClient.patch(`/reservations/${id}/cancel`);
