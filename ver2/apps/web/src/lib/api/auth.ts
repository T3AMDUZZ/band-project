import { apiClient } from './client';

export const login = (email: string, password: string) =>
  apiClient.post('/auth/login', { email, password });

export const signup = (data: { email: string; password: string; name: string; nickname: string }) =>
  apiClient.post('/auth/signup', data);
