import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if(storedUser) {
            setUser(JSON.parse(storedUser));
        }
         setLoading(false);
    }, []);

    const register = async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return data;
    };

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return data;
    };

    const logout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout, isAuthenticated: !!user }}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
  const cntxt = useContext(AuthContext);
  if (!cntxt) throw new Error('useAuth must be used within AuthProvider');
  return cntxt;
};