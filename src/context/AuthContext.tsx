import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

type AuthContextType = {
  userId: string | null;
  setUserId: (id: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  userId: null,
  setUserId: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.sub);
      } catch (e) {
        console.error('Invalid token');
        setUserId(null);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userId, setUserId, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
