import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api, { readCsrfFromCookie, setCsrfToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncCsrf = () => {
    const existing = readCsrfFromCookie();
    if (existing) setCsrfToken(existing);
  };

  const refreshSession = useCallback(async () => {
    try {
      const [userRes, adminRes] = await Promise.allSettled([
        api.get('/auth/user/me'),
        api.get('/auth/admin/me'),
      ]);
      if (userRes.status === 'fulfilled') setUser(userRes.value.data.user);
      else setUser(null);
      if (adminRes.status === 'fulfilled') setAdmin(adminRes.value.data.admin);
      else setAdmin(null);
      syncCsrf();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const signUp = async (payload) => {
    const { data } = await api.post('/auth/user/register', payload);
    setCsrfToken(data.csrfToken);
    setUser(data.user);
    return data.user;
  };

  const signIn = async (email, password) => {
    const { data } = await api.post('/auth/user/signin', { email, password });
    setCsrfToken(data.csrfToken);
    setUser(data.user);
    return data.user;
  };

  const signOut = async () => {
    try {
      await api.post('/auth/user/signout');
    } catch {
      /* ignore */
    }
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const { data } = await api.patch('/auth/user/profile', payload);
    setUser(data.user);
    return data.user;
  };

  const adminLogin = async (username, password) => {
    const { data } = await api.post('/auth/admin/login', { username, password });
    setCsrfToken(data.csrfToken);
    setAdmin(data.admin);
    return data.admin;
  };

  const adminLogout = async () => {
    try {
      await api.post('/auth/admin/logout');
    } catch {
      /* ignore */
    }
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        adminLogin,
        adminLogout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};