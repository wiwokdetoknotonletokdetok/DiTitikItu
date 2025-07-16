import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { userProfile } from '@/api/userProfile.ts';

type AuthContextType = {
  userId: string | null;
  name: string | null;
  setUserId: (id: string | null) => void;
  setName: (name: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  userId: null,
  name: null,
  setName: () => {},
  setUserId: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.sub);

        userProfile(decoded.sub)
        .then((res) => setName(res.data.name))
        .catch(() => setName(null));
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
    <AuthContext.Provider value={{ userId, name, setUserId, setName, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
