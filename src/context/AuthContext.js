import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch { return null; }
  });

  useEffect(() => {
    if(user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const login = async (email, password) => {
    const res = await axios.post(API_BASE + '/auth/login', { email, password });
    const data = res.data;
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
    setUser({ token: data.token, role: data.role, name: data.name, email: data.email });
    return data;
  };

  const register = async ({ name, email, password, role }) => {
    const res = await axios.post(API_BASE + '/auth/register', { name, email, password, role });
    const data = res.data;
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
    setUser({ token: data.token, role: data.role, name: data.name, email: data.email });
    return data;
  };

  const logout = () => {
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
