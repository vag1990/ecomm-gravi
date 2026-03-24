import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (username === 'admin' && password === 'passpass') {
      localStorage.setItem('adminAuth', 'true')
      navigate('/admin/dashboard')
    } else {
      setError('Credenciales incorrectas')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-terrazo-50">
      <div className="bg-white p-8 border border-terrazo-200 shadow-sm max-w-sm w-full">
        <h1 className="text-2xl font-serif text-terrazo-900 mb-6 text-center">Acceso Admin</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2">{error}</p>}
          <div>
            <label className="block text-sm text-terrazo-600 mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-terrazo-200 p-2 focus:outline-none focus:border-terrazo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-terrazo-600 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-terrazo-200 p-2 focus:outline-none focus:border-terrazo-500"
            />
          </div>
          <button 
            type="submit"
            className="mt-4 bg-terrazo-900 text-white p-3 text-sm tracking-wider uppercase hover:bg-terrazo-800 transition-colors"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  )
}
