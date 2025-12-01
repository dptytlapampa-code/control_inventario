import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../services/api'
import Loader from '../components/Loader'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/', { replace: true })
    }
  }, [navigate])

  const validateForm = () => {
    if (!email || !password) {
      setError('Por favor ingresa tu email y contraseña.')
      return false
    }
    const emailRegex = /\S+@\S+\.\S+/
    if (!emailRegex.test(email)) {
      setError('Ingresa un email válido.')
      return false
    }
    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!validateForm()) return

    try {
      setLoading(true)
      const { data } = await api.post('/login', { email, password })
      const token = data?.token || data?.access_token

      if (!token) {
        throw new Error('Respuesta inválida del servidor')
      }

      localStorage.setItem('token', token)
      const redirectTo = location.state?.from?.pathname || '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const message = err.response?.data?.message || 'Credenciales inválidas. Intenta de nuevo.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="content" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <div className="card">
        <div className="text-center" style={{ marginBottom: '1.5rem' }}>
          <div className="brand" style={{ justifyContent: 'center' }}>
            <span className="brand-icon">CI</span>
            <div>
              <div>Control de Inventario</div>
              <small style={{ color: '#475569' }}>Inicio de sesión</small>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="tu@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <label htmlFor="password" style={{ marginTop: '1rem', display: 'block' }}>
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && <div className="error-text">{error}</div>}

          <button className="btn-primary" type="submit" style={{ marginTop: '1.25rem' }} disabled={loading}>
            {loading ? <Loader /> : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
