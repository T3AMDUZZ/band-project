'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { createClient } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  name: string;
  nickname: string;
  profile_image: string | null;
  bio: string | null;
}

interface AuthContextType {
  user: Profile | null;
  supabaseUser: SupabaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { email: string; password: string; name: string; nickname: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// 프로필 캐시 (세션 중 한 번만 조회)
const profileCache = new Map<string, Profile>();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchProfile(uid: string) {
      if (profileCache.has(uid)) return profileCache.get(uid)!;
      const { data } = await supabase
        .from('profiles')
        .select('id, email, name, nickname, profile_image, bio')
        .eq('id', uid)
        .single();
      if (data) profileCache.set(uid, data as Profile);
      return data as Profile | null;
    }

    // onAuthStateChange가 초기 세션도 자동으로 전달함 — getSession() 별도 호출 불필요
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setSupabaseUser(session.user);
          const profile = await fetchProfile(session.user.id);
          setUser(profile);
        } else {
          setUser(null);
          setSupabaseUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []); // 의존성 빈 배열 — 마운트 시 1회만

  const login = async (email: string, password: string) => {
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signup = async (data: { email: string; password: string; name: string; nickname: string }) => {
    const { error } = await createClient().auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { name: data.name, nickname: data.nickname } },
    });
    if (error) throw error;
  };

  const logout = async () => {
    profileCache.clear();
    await createClient().auth.signOut();
    setUser(null);
    setSupabaseUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, supabaseUser, isLoading, isAuthenticated: !!user, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
