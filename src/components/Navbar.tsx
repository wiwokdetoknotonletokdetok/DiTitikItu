import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { userId, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Beranda</Link>
      {userId ? (
        <>
          <Link to={`/profile/${userId}`} style={{ marginRight: '1rem' }}>Profil</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/auth/login" style={{ marginRight: '1rem' }}>Login</Link>
          <Link to="/auth/register">Register</Link>
        </>
      )}
    </nav>
  );
}
