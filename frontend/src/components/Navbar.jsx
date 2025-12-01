import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }

  return (
    <header className="navbar">
      <div className="brand">
        <span className="brand-icon">CI</span>
        <span>Control de Inventario</span>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </header>
  )
}

export default Navbar
