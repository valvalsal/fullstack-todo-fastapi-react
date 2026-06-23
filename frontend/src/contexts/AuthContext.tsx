import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { loginUser, fetchUserProfile } from '@/services/userService';
import type { TokenResponse, UserProfile } from '@/services/userService';

interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  login: (username: string, password: string) => Promise<TokenResponse>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('access_token'),
  );
  const [loading, setLoading] = useState<boolean>(
    !!localStorage.getItem('access_token'),
  );
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      const response = await loginUser({ username, password });
      if (response?.access_token) {
        setToken(response.access_token);
        localStorage.setItem('access_token', response.access_token);
        return response;
      } else {
        setLoading(false);
        throw new Error('Invalid credentials');
      }
    } catch (e) {
      console.error('Context login error:', e);
      throw e;
    }
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (token && !user) {
      const getUser = async () => {
        try {
          const profile = await fetchUserProfile();

          if (!profile) {
            logout();
            return;
          }

          setUser(profile);
        } catch {
          logout();
        } finally {
          setLoading(false);
        }
      };
      getUser();
    }
  }, [token, logout, user]);

  return (
    <AuthContext.Provider
      value={{ token, user, setUser, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
export type { AuthContextType };
