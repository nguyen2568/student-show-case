import { createContext, useState, useEffect } from 'react';
import { api, setAuthContext } from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Make this context available to axios interceptors
    setAuthContext({ auth, setAuth, logout });
  }, [auth]);

  useEffect(() => {
    // Check if the user is already logged in (localStorage)
    const storedAuth = localStorage.getItem('auth');
    
    if (storedAuth) {
      try {
        setAuth(JSON.parse(storedAuth));
        setLoading(false);

      } catch (e) {
        localStorage.removeItem('auth');
      }
    }
    

    // Attempt to refresh token on initial load
    const verifyRefreshToken = async () => {
      try {
        const storedAuth = JSON.parse(localStorage.getItem('auth'));
        
        if (!storedAuth) throw new Error('No refresh token available');
        const { refreshToken } = storedAuth;
        
        //const response = await api.post('/auth/refresh-token', { refreshToken });
        
        //setAuth(response.data);
        //localStorage.setItem('auth', JSON.stringify(response.data));
      } catch (error) {
        setAuth(null);
        localStorage.removeItem('auth');
      } finally {
        setLoading(false);
      }
    };

    verifyRefreshToken();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      setAuth(response.data);
      localStorage.setItem('auth', JSON.stringify(response.data)); // Store both tokens
      return true;
    } catch (error) {
      return false;
    }
  };


  const register = async (username, password) => {
    try {
      const response = await api.post('/auth/register', { username, password });
      setAuth(response.data);
      localStorage.setItem('auth', JSON.stringify(response.data)); // Store both tokens
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Registration failed. Please try again.',
      };
    }
  };

  const logout = async () => {
    setAuth(null);
    localStorage.removeItem('auth');
    navigate('/login');
  //   try {
  //     await api.post('/auth/logout');
  //   } catch (error) {
  //     console.error('Logout error', error);
  //   } finally {
     
  //   }
  };

  const refreshToken = async () => {
    try {
      const storedAuth = JSON.parse(localStorage.getItem('auth'));
      if (!storedAuth) throw new Error('No refresh token available');
      const { refreshToken } = storedAuth;
      const response = await api.post('/auth/refresh-token', { refreshToken });
      setAuth(response.data);
      localStorage.setItem('auth', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Refresh token error', error);
    }
  }

  return (
    <AuthContext.Provider value={{ auth, loading, login, register, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;