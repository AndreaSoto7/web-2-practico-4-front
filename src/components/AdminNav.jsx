import { NavLink } from 'react-router'
export default function AdminNav() {
  return (
    <div className="admin-nav">
      <NavLink end to="/admin">
        Resumen
      </NavLink>
      <NavLink to="/admin/peliculas">Películas</NavLink>
      <NavLink to="/admin/salas">Salas</NavLink>
      <NavLink to="/admin/funciones">Funciones</NavLink>
    </div>
  )
}
