import api from './client';

export interface User {
  id: string;
  email: string;
  name: string;
  nickname: string;
  profileImage: string | null;
}

interface AuthResponse {
  user: User;
  accessToken: string;
}

export async function signup(data: { email: string; password: string; name: string; nickname: string }) {
  const res = await api.post<AuthResponse>('/auth/signup', data);
  localStorage.setItem('accessToken', res.data.accessToken);
  return res.data;
}

export async function login(data: { email: string; password: string }) {
  const res = await api.post<AuthResponse>('/auth/login', data);
  localStorage.setItem('accessToken', res.data.accessToken);
  return res.data;
}

export async function getMe() {
  const res = await api.get<User>('/users/me');
  return res.data;
}

export async function updateProfile(data: { name?: string; nickname?: string; profileImage?: string }) {
  const res = await api.patch<User>('/users/me', data);
  return res.data;
}

export function logout() {
  localStorage.removeItem('accessToken');
}
