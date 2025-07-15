import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode"

type JwtPayload = {
  sub: string;
};

export default function Navbar() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUserId(decoded.sub);
      } catch (error) {
        console.error('Token invalid', error);
        setUserId(null);
      }
    } else {
      setUserId(null);
    }
  }, []);

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>
        Beranda
      </Link>
      {userId ? (
        <Link to={`/profile/${userId}`}>Profil</Link>
      ) : (
        <>
          <Link to="/auth/login" style={{ marginRight: '1rem' }}>
            Login
          </Link>
          <Link to="/auth/register">Register</Link>
        </>
      )}
    </nav>
  );
}
