import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../lib/api';

interface LoginResult {
  success: boolean;
  requiresOtp?: boolean;
  message?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<LoginResult>;
  verifyLoginOtp: (code: string) => Promise<boolean>;
  refreshSession: (token: string, admin: any) => void;
  logout: () => void;
  loading: boolean;
  pendingOtp?: {
    email: string;
    otpToken: string;
  } | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pendingOtp, setPendingOtp] = useState<{ email: string; otpToken: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in from localStorage/session
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');

    if (token && userData) {
      try {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  const persistSession = (token: string, admin: any) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('auth_token', token);
    localStorage.setItem('adminUser', JSON.stringify(admin));
    setIsAuthenticated(true);
    setUser(admin);
  };

  const refreshSession = (token: string, admin: any) => {
    persistSession(token, admin);
  };

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const response = await authAPI.login(email, password);

      if (response?.otp_token) {
        setPendingOtp({ email, otpToken: response.otp_token });
        return { success: true, requiresOtp: true };
      }

      if (response?.token && response?.admin) {
        persistSession(response.token, response.admin);
        return { success: true };
      }

      return { success: false, message: 'Unexpected response from server' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error?.message || 'Failed to login' };
    }
  };

  const verifyLoginOtp = async (code: string): Promise<boolean> => {
    if (!pendingOtp) {
      throw new Error('No OTP pending verification');
    }

    try {
      const response = await authAPI.verifyLoginOtp(pendingOtp.otpToken, code);

      if (response?.token && response?.admin) {
        persistSession(response.token, response.admin);
        setPendingOtp(null);
        return true;
      }

      return false;
    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/admin/login');
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, verifyLoginOtp, refreshSession, logout, loading, pendingOtp }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
