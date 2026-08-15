import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('nexus_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await API.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.data.user);
          setProfile(res.data.data.profile);
        }
      } catch (err) {
        console.error('Auth verification failed:', err.response?.data?.message || err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: newToken, ...userData } = res.data.data;
      localStorage.setItem('nexus_token', newToken);
      setToken(newToken);
      setUser(userData);
      // Fetch profile
      try {
        const profRes = await API.get('/profile');
        if (profRes.data.success) setProfile(profRes.data.data);
      } catch (e) {}
      return res.data;
    }
  };

  const register = async (name, email, password) => {
    const res = await API.post('/auth/register', { name, email, password });
    if (res.data.success) {
      const { token: newToken, ...userData } = res.data.data;
      localStorage.setItem('nexus_token', newToken);
      setToken(newToken);
      setUser(userData);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('nexus_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const updateProfileState = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  const completeOnboardingState = (updatedProfile, updatedUser) => {
    setProfile(updatedProfile);
    if (updatedUser) {
      setUser(updatedUser);
    } else {
      setUser((prev) => (prev ? { ...prev, onboardingCompleted: true } : prev));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        login,
        register,
        logout,
        updateProfileState,
        completeOnboardingState,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
