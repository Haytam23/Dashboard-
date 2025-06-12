// // src/AuthContext.tsx
// import React, { createContext, useState, ReactNode ,useContext,useEffect} from 'react';
// import { useNavigate } from 'react-router-dom';

// export const AuthContext = createContext<{
//   token: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
// }>({
//   token: null,
//   login: async () => { throw new Error('login fn not implemented'); },
//   logout: () => { throw new Error('logout fn not implemented'); },
// });

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [token, setToken] = useState<string | null>(
//     localStorage.getItem('token')
//   );

//   const login = async (email: string, password: string) => {
//     const url = `${import.meta.env.VITE_API_URL}/auth/login`;
//     console.log('Attempting login to:', url);

//     const res = await fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });

//     console.log('Login response status:', res.status);

//     // try to parse any JSON error body
//     let body: any = null;
//     try { body = await res.json(); } catch {}

//     if (!res.ok) {
//       console.error('Login failed response body:', body);
//       const msg =
//         body && body.error
//           ? body.error
//           : `Login failed: ${res.status} ${res.statusText}`;
//       throw new Error(msg);
//     }

//     const data = body as { token: string };
//     if (!data.token) {
//       throw new Error('Login succeeded but no token returned');
//     }

//     localStorage.setItem('token', data.token);
//     setToken(data.token);
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
// src/context/AuthContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthed: boolean;
  isLoading: boolean; // Add loading state to interface
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;
  // On mount: check session cookie
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Add timeout to prevent infinite loading
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const res = await fetch(`${API}/auth/whoami`, {
          credentials: 'include',
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        setIsAuthed(res.ok);
        console.log('Initial auth check result:', res.ok);
      } catch (error) {
        console.log('Initial auth check failed:', error);
        setIsAuthed(false);
      } finally {
        setIsLoading(false); // Always set loading to false
      }
    };
    checkAuth();
  }, [API]);

  // Perform login: server sets HttpOnly cookie
  const login = async (email: string, password: string) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Login failed');
    }
    
    // Immediately set auth state and wait a moment for cookie to be available
    setIsAuthed(true);
    
    // Small delay to ensure cookie is properly set before navigation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verify auth state with server before proceeding
    try {
      const verifyRes = await fetch(`${API}/auth/whoami`, {
        credentials: 'include',
      });
      if (!verifyRes.ok) {
        console.warn('Auth verification failed after login');
        setIsAuthed(false);
        throw new Error('Authentication verification failed');
      }
      console.log('✅ Login and auth verification successful');
    } catch (error) {
      console.error('Auth verification error:', error);
      setIsAuthed(false);
      throw error;
    }
  };
  // Perform logout: server clears the cookie
  const logout = async () => {
    await fetch(`${API}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setIsAuthed(false);
    navigate('/login', { replace: true });
  };
  return (
    <AuthContext.Provider value={{ isAuthed, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
