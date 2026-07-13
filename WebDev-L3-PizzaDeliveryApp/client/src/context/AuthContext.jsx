import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        const payload = JSON.parse(atob(savedToken.split('.')[1]));
        setUser({ userId: payload.userId, role: payload.role });
        setToken(savedToken);
      } catch (err) {
        console.error('Invalid token found in local storage', err);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    // Use decoded payload or passed userData
    if (userData && userData.id && userData.role) {
      setUser({ userId: userData.id, role: userData.role, ...userData });
    } else {
      try {
        const payload = JSON.parse(atob(newToken.split('.')[1]));
        setUser({ userId: payload.userId, role: payload.role });
      } catch (err) {
        console.error('Error decoding token during login', err);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
