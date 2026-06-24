import api from './api.js'
const data = (request) => request.then((r) => r.data)
export const cinemaService = {
  movies: (params) => data(api.get('/peliculas', { params })),
  movie: (id) => data(api.get(`/peliculas/${id}`)),
  shows: (params) => data(api.get('/funciones', { params })),
  show: (id) => data(api.get(`/funciones/${id}`)),
  seats: (id) => data(api.get(`/funciones/${id}/asientos`)),
  myBookings: () => data(api.get('/reservas/mias')),
  book: (payload) => data(api.post('/reservas', payload)),
  rooms: () => data(api.get('/salas')),
  saveMovie: (id, formData) =>
    data(api[id ? 'patch' : 'post'](id ? `/peliculas/${id}` : '/peliculas', formData)),
  deleteMovie: (id) => data(api.delete(`/peliculas/${id}`)),
  saveRoom: (id, payload) =>
    data(api[id ? 'patch' : 'post'](id ? `/salas/${id}` : '/salas', payload)),
  deleteRoom: (id) => data(api.delete(`/salas/${id}`)),
  saveShow: (id, payload) =>
    data(api[id ? 'patch' : 'post'](id ? `/funciones/${id}` : '/funciones', payload)),
  deleteShow: (id) => data(api.delete(`/funciones/${id}`)),
}
