import { NavLink, Outlet } from 'react-router'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Layout() {
  const { user, authenticated, loading, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const link = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')
  return (
    <div className="app-shell">
      <header className="navbar">
        <NavLink to="/" className="brand">
          <span>◉</span> CINE<span>NOVA</span>
        </NavLink>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Abrir menú">
          ☰
        </button>
        <nav className={open ? 'nav-links open' : 'nav-links'} onClick={() => setOpen(false)}>
          <NavLink to="/" className={link}>
            Cartelera
          </NavLink>
          {authenticated && (
            <NavLink to="/mis-reservas" className={link}>
              Mis reservas
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={link}>
              Administración
            </NavLink>
          )}
          {!loading && !authenticated && (
            <>
              <NavLink to="/login" className={link}>
                Ingresar
              </NavLink>
              <NavLink to="/registro" className="button small">
                Crear cuenta
              </NavLink>
            </>
          )}
          {authenticated && (
            <button className="nav-user" onClick={logout}>
              {user.fullName || user.fullname || user.email} · Salir
            </button>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <span>CINENOVA</span>
        <small>Tu próxima historia comienza aquí.</small>
      </footer>
    </div>
  )
}
