import { Navigate, Route, Routes } from 'react-router'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import MoviesPage from './pages/MoviesPage.jsx'
import MovieDetailPage from './pages/MovieDetailPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import BookingPage from './pages/BookingPage.jsx'
import MyBookingsPage from './pages/MyBookingsPage.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminMoviesPage from './pages/admin/AdminMoviesPage.jsx'
import AdminRoomsPage from './pages/admin/AdminRoomsPage.jsx'
import AdminShowsPage from './pages/admin/AdminShowsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<MoviesPage />} />
        <Route path="peliculas/:id" element={<MovieDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="registro" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="reservar/:funcionId" element={<BookingPage />} />
          <Route path="mis-reservas" element={<MyBookingsPage />} />
        </Route>
        <Route element={<ProtectedRoute admin />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/peliculas" element={<AdminMoviesPage />} />
          <Route path="admin/salas" element={<AdminRoomsPage />} />
          <Route path="admin/funciones" element={<AdminShowsPage />} />
        </Route>
        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  )
}
