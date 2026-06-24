import { Link } from 'react-router'
import AdminNav from '../../components/AdminNav.jsx'
export default function AdminDashboard() {
  return (
    <div className="container section">
      <p className="eyebrow">Panel privado</p>
      <h1>Administración</h1>
      <AdminNav />
      <div className="admin-cards">
        <Link to="/admin/peliculas">
          <span>▣</span>
          <h2>Películas</h2>
          <p>Cartelera, fichas y pósteres</p>
        </Link>
        <Link to="/admin/salas">
          <span>▦</span>
          <h2>Salas</h2>
          <p>Distribución y capacidad</p>
        </Link>
        <Link to="/admin/funciones">
          <span>◷</span>
          <h2>Funciones</h2>
          <p>Horarios, salas y precios</p>
        </Link>
      </div>
    </div>
  )
}
