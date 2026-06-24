import { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard.jsx'
import Loading from '../components/Loading.jsx'
import StateMessage from '../components/StateMessage.jsx'
import { cinemaService } from '../services/cinemaService.js'
import { errorMessage } from '../services/api.js'
import { asArray } from '../utils/format.js'

export default function MoviesPage() {
  const [movies, setMovies] = useState([]),
    [search, setSearch] = useState(''),
    [genre, setGenre] = useState(''),
    [loading, setLoading] = useState(true),
    [error, setError] = useState('')
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        setMovies(
          asArray(
            await cinemaService.movies({
              ...(search && { buscar: search }),
              ...(genre && { genero: genre }),
            }),
          ),
        )
      } catch (e) {
        setError(errorMessage(e, 'No se pudo cargar la cartelera'))
      } finally {
        setLoading(false)
      }
    }, 250)
    return () => clearTimeout(timer)
  }, [search, genre])
  const genres = [
    'Acción',
    'Animación',
    'Aventura',
    'Ciencia ficción',
    'Comedia',
    'Drama',
    'Fantasía',
    'Terror',
    'Romance',
    'Suspenso',
  ]
  return (
    <>
      <section className="hero">
        <div className="hero-glow" />
        <div className="container hero-content">
          <p className="eyebrow">Ahora en cartelera</p>
          <h1>
            Historias que merecen
            <br />
            <em>la pantalla grande.</em>
          </h1>
          <p>Encuentra tu próxima película, elige tus asientos y disfruta.</p>
        </div>
      </section>
      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Explora</p>
            <h2>Cartelera</h2>
          </div>
          <span>
            {movies.length} {movies.length === 1 ? 'película' : 'películas'}
          </span>
        </div>
        <div className="filters">
          <label className="search">
            <span>⌕</span>
            <input
              aria-label="Buscar por título"
              placeholder="Buscar por título…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <select
            aria-label="Filtrar por género"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="">Todos los géneros</option>
            {genres.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <Loading text="Preparando la cartelera…" />
        ) : error ? (
          <StateMessage title="No pudimos cargar la cartelera">{error}</StateMessage>
        ) : movies.length ? (
          <div className="movie-grid">
            {movies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        ) : (
          <StateMessage title="No encontramos películas">
            Prueba con otro título o género.
          </StateMessage>
        )}
      </section>
    </>
  )
}
