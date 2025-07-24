import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { logoutUser } from '@/api/logoutUser.ts'
import { useAuth } from '@/context/AuthContext.tsx'
import { ApiError } from '@/exception/ApiError.ts'

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { token, isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [])

  async function handleLogout() {
    try {
      await logoutUser(token)
      logout()
      navigate('/')
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        console.log(err.message)
      } else {
        console.log('Terjadi kesalahan. Silakan coba lagi.')
      }
    }
  }

  return (
    <nav className="max-w-7xl mx-auto py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center space-x-2">
        <img src="/logo.jpg" alt="Logo" className="h-8 w-8 object-contain" />
        <span className="text-xl font-bold text-gray-800">DiTitikItu</span>
      </Link>

      <div className="flex items-center space-x-4">
        {!isLoggedIn() ? (
          <Link
            to="/auth/login"
            className="px-4 py-2 text-sm font-medium text-white rounded-md bg-[#1E497C] hover:bg-[#5C8BC1] transition"
          >
            Masuk
          </Link>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2"
            >
              <img
                src={user?.profilePicture}
                alt={user?.name}
                className="w-9 h-9 rounded-full object-cover border"
              />
              <ChevronDown size={16} className="text-gray-600" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-[3000]">
                <div className="px-4 py-2 text-sm text-gray-700">{user?.name}</div>
                <hr className="border-gray-200" />
                <Link
                  to="/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Beranda
                </Link>
                <Link
                  to={`/profile/${user?.id}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profil
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Pengaturan
                </Link>
                <button
                  type="button"
                  onClick={() => handleLogout()}
                  className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
